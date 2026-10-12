/* ==========================================================================
   COMPONENTES — monta as páginas de uma missão a partir do missao.js dela

   Cada página da missão é só um esqueleto que diz QUAL página é e para QUEM:
     <body data-pagina="hub"       data-papel="squad|gm">
     <body data-pagina="documento" data-papel="squad|gm" data-doc="tatico|inteligencia">

   O missao.js chama GRB.registrarMissao({...}) e esta página é desenhada na hora.
   Ordem dos scripts no <head> (todos com defer):
     componentes.js -> missao.js -> ops.js

   Conteúdo por papel (Ghost Squad x Ghost Lead/GM), dentro do missao.js:
     GRB.papel('texto do squad', 'texto do GM')  -> escolhe conforme a página
     GRB.soGm(valor) / GRB.soSquad(valor)        -> só aparece para aquele papel
   Lembrete: o GM vê tudo o que o Squad vê + o que for soGm.
   ========================================================================== */
(function () {
    'use strict';

    var body = document.body;
    var PAPEL = body.getAttribute('data-papel') === 'gm' ? 'gm' : 'squad';
    var GM = PAPEL === 'gm';
    var PINTURAS = '../../assets/paint/';
    var OMITIR = {};

    // ----------------------------------------------------------------------
    // CONTEÚDO POR PAPEL
    // ----------------------------------------------------------------------
    function papel(squad, gm) {
        return { __porPapel: true, squad: squad, gm: gm };
    }

    function soGm(valor) {
        return { __so: 'gm', valor: valor };
    }

    function soSquad(valor) {
        return { __so: 'squad', valor: valor };
    }

    // Resolve papel()/soGm()/soSquad() em toda a árvore de dados
    function resolver(v) {
        if (v === null || v === undefined || typeof v !== 'object') return v;
        if (v.__so) return v.__so === PAPEL ? resolver(v.valor) : OMITIR;
        if (v.__porPapel) return resolver(v[PAPEL]);
        if (Array.isArray(v)) {
            var lista = [];
            v.forEach(function (item) {
                var r = resolver(item);
                if (r !== OMITIR && r !== null && r !== undefined) lista.push(r);
            });
            return lista;
        }
        var obj = {};
        Object.keys(v).forEach(function (k) {
            var r = resolver(v[k]);
            if (r !== OMITIR) obj[k] = r;
        });
        return obj;
    }

    // ----------------------------------------------------------------------
    // UTILITÁRIOS
    // ----------------------------------------------------------------------
    function esc(texto) {
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function classes() {
        var lista = Array.prototype.filter.call(arguments, Boolean);
        return lista.length ? ' class="' + lista.join(' ') + '"' : '';
    }

    // Caminhos começando com ../, / ou http são usados como estão
    function caminho(base, arquivo) {
        return /^(\.{1,2}\/|\/|https?:)/.test(arquivo) ? arquivo : (base || '') + arquivo;
    }

    function corTitulo(cor) {
        return cor === 'amber' ? 'h-amber' : cor === 'perigo' ? 'h-danger' : '';
    }

    // ----------------------------------------------------------------------
    // GALERIA DE INTELIGÊNCIA
    //   { img, titulo, legenda, zoom, alt, larga, natural, centro }
    // ----------------------------------------------------------------------
    var primeiraImagem = true;
    var estiloGaleriaPadrao = '';   // missão pode definir (ex.: filtro NVG na Missão 01)

    function itemGaleria(it, base) {
        var src = caminho(base, it.img);
        var carregamento = primeiraImagem ? '' : ' loading="lazy"';
        primeiraImagem = false;
        return '<figure' + classes('intel-item', it.larga && 'intel-item--wide', it.natural && 'intel-item--natural', it.centro && 'intel-item--center') + '>' +
            '<a class="intel-thumb" href="' + esc(src) + '" data-zoom' + (it.zoom ? ' data-caption="' + esc(it.zoom) + '"' : '') + '>' +
            '<img src="' + esc(src) + '" alt="' + esc(it.alt || it.legenda || it.titulo || '') + '"' + carregamento + ' decoding="async"></a>' +
            '<figcaption class="intel-caption">' + (it.titulo ? '<strong>' + it.titulo + '</strong>' : '') + (it.legenda || '') + '</figcaption>' +
            '</figure>';
    }

    function galeria(itens, base, extra) {
        return '<div' + classes('intel-gallery', extra || estiloGaleriaPadrao) + '>' +
            itens.map(function (it) { return itemGaleria(it, base); }).join('') +
            '</div>';
    }

    // ----------------------------------------------------------------------
    // BLOCOS DE CONTEÚDO (usados no briefing, objetivos e dossiês)
    //   'texto'                       -> parágrafo
    //   { p, classe }                 -> parágrafo com classe
    //   { linhas: [...] }             -> parágrafo com uma linha por item
    //   { h3 }                        -> subtítulo
    //   { lista: [...], classe }      -> lista com marcadores
    //   { galeria: [...] }            -> galeria de imagens
    //   { callout, titulo, perigo }   -> bloco de destaque (texto ou lista de blocos)
    //   { complicacoes: [...] }       -> complicações do GM (gatilho/ação/resposta)
    //   { video, legenda }            -> vídeo "uplink" com moldura
    //   { kneeboard, galeria }        -> cartas de navegação (título + galeria)
    //   { tabela: [col1, col2], linhas: [[rótulo, valor] | { perigo, celulas }] }
    // ----------------------------------------------------------------------
    function blocos(lista, base) {
        return (lista || []).map(function (b) { return bloco(b, base); }).join('');
    }

    function bloco(b, base) {
        if (typeof b === 'string') return '<p>' + b + '</p>';
        // Blocos com chaves próprias vêm antes dos genéricos (tabela também usa 'linhas')
        if (b.tabela) {
            return '<div class="table-wrap"><table class="table-stack">' +
                '<thead><tr>' + b.tabela.map(function (c) { return '<th scope="col">' + c + '</th>'; }).join('') + '</tr></thead>' +
                '<tbody>' + b.linhas.map(function (l) {
                    if (Array.isArray(l)) return '<tr><td><strong>' + l[0] + '</strong></td><td>' + l[1] + '</td></tr>';
                    return '<tr' + classes(l.perigo && 'row-danger') + '>' + l.celulas.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
                }).join('') + '</tbody></table></div>';
        }
        if (b.p) return '<p' + classes(b.classe) + '>' + b.p + '</p>';
        if (b.linhas) return '<p' + classes(b.classe) + '>' + b.linhas.join('<br>') + '</p>';
        if (b.h3) return '<h3>' + b.h3 + '</h3>';
        if (b.lista) return '<ul' + classes(b.classe) + '>' + b.lista.map(function (li) { return '<li>' + li + '</li>'; }).join('') + '</ul>';
        if (b.kneeboard) {
            return '<section class="kneeboard"><h4>' + b.kneeboard + '</h4>' + galeria(b.galeria, base, b.classe) + '</section>';
        }
        if (b.galeria) return galeria(b.galeria, base, b.classe);
        if (b.callout) {
            var conteudo = Array.isArray(b.callout) ? blocos(b.callout, base) : b.callout;
            return '<div' + classes('callout', b.perigo && 'callout--danger') + '>' +
                (b.titulo ? '<h3>' + b.titulo + '</h3>' : '') + conteudo + '</div>';
        }
        if (b.complicacoes) {
            return b.complicacoes.map(function (c, i) {
                return '<h3>COMPLICAÇÃO ' + (i + 1) + ': ' + c.nome + '</h3>' +
                    '<p><strong>Gatilho:</strong> ' + c.gatilho +
                    '<br><strong>Ação do GM:</strong> ' + c.acao +
                    '<br><strong>Resposta dos jogadores:</strong> ' + c.resposta + '</p>';
            }).join('');
        }
        if (b.video) {
            return '<div class="video-frame">' +
                '<span class="video-frame__label">' + (b.legenda || 'SINAL DE VÍDEO SEGURO - UPLINK ESTABELECIDO') + '</span>' +
                '<video controls preload="metadata" playsinline><source src="' + esc(caminho(base, b.video)) + '" type="video/mp4">' +
                'Seu navegador não suporta a tag de vídeo.</video></div>';
        }
        return '';
    }

    // ----------------------------------------------------------------------
    // CABEÇALHO DE MEMORANDO
    //   { titulo, digitando, perigo, linhas: [[rótulo, valor] | { aviso }], aviso }
    //   Uma linha { aviso: '...' } vira o alerta piscando naquela posição.
    // ----------------------------------------------------------------------
    function cabecalho(h) {
        return '<header class="header">' +
            (h.titulo ? '<h1' + classes(h.digitando !== false && 'typing-effect', h.perigo && 'h-danger') + '>' + h.titulo + '</h1>' : '') +
            (h.linhas || []).map(function (l) {
                if (!Array.isArray(l)) return '<p class="warning">' + l.aviso + '</p>';
                return '<p><strong>' + l[0] + ':</strong> ' + l[1] + '</p>';
            }).join('') +
            (h.aviso ? '<p class="warning">' + h.aviso + '</p>' : '') +
            '</header>';
    }

    // ----------------------------------------------------------------------
    // COMPONENTES DO HUB
    // ----------------------------------------------------------------------
    function canalOverlord(audio) {
        return '<audio id="overlord-transmission" src="' + esc(audio) + '" preload="metadata"></audio>' +
            '<div class="comms-panel">' +
            '<div class="comms-header">// CANAL SEGURO: OVERLORD</div>' +
            '<button type="button" id="btn-play-comms" class="btn btn-overlord">' +
            '<span class="icon" aria-hidden="true">▶</span> <span class="label">RECEBER TRANSMISSÃO</span></button>' +
            '<div class="comms-status" id="comms-status" role="status">Aguardando...</div>' +
            '</div>';
    }

    //   [{ configuracoes: true, rotulo, dica }, { rotulo, href, dica, estilo: 'amber' }]
    function barraDocumentos(docs) {
        return '<div class="btn-row">' + docs.map(function (d) {
            var titulo = d.dica ? ' title="' + esc(d.dica) + '"' : '';
            if (d.configuracoes) {
                return '<button type="button" class="btn btn--ghost btn--sm" data-open="settingsModal"' + titulo + '>' + d.rotulo + '</button>';
            }
            return '<a class="btn btn--' + (d.estilo || 'ghost') + ' btn--sm" href="' + esc(d.href) + '"' + titulo + '>' + d.rotulo + '</a>';
        }).join('') + '</div>';
    }

    // Script do mestre: { evento, paragrafos: [...] }
    function scriptMestre(s) {
        return '<div class="callout callout--danger"><h3>// SCRIPT DO MESTRE (OVERLORD)</h3>' +
            (s.evento ? '<p><strong>' + s.evento + '</strong></p>' : '') +
            s.paragrafos.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
            '</div>';
    }

    // Seção de objetivos: { titulo, cor, intro, itens: [{ titulo, texto, galeria, sub: [{ rotulo, texto, galeria }] }] }
    function secaoObjetivos(s, base) {
        return '<h2' + classes(corTitulo(s.cor)) + '>' + s.titulo + '</h2>' +
            (s.intro ? '<p class="muted">' + s.intro + '</p>' : '') +
            '<ul class="muted">' + s.itens.map(function (it) { return itemObjetivo(it, base); }).join('') + '</ul>';
    }

    function itemObjetivo(it, base) {
        var html = '<li>' + (it.titulo ? '<strong>' + it.titulo + '</strong>' : '') + (it.texto ? ' ' + it.texto : '');
        if (it.galeria) html += galeria(it.galeria, base);
        if (it.sub && it.sub.length) {
            html += '<ul class="list-sub">' + it.sub.map(function (s) {
                return '<li>' + (s.rotulo ? '<em>' + s.rotulo + '</em> ' : '') + (s.texto || '') +
                    (s.galeria ? galeria(s.galeria, base) : '') + '</li>';
            }).join('') + '</ul>';
        }
        return html + '</li>';
    }

    // Gabaritos do GM: [{ img, titulo, descricao, zoom }]
    function gabaritos(lista, base) {
        return '<h2 class="h-danger">// GABARITOS DE ARBITRAGEM (OVERLORD CHEAT SHEET)</h2>' +
            '<p class="muted">Estes mapas contêm spoilers críticos. Use para monitorar o avanço do Squad.</p>' +
            '<div class="gm-grid">' + lista.map(function (g) {
                var src = caminho(base, g.img);
                return '<button type="button" class="btn btn--danger" data-zoom="' + esc(src) + '" data-caption="' + esc(g.zoom || g.titulo) + '">' +
                    '[GM] ' + g.titulo +
                    '<small><strong>(' + esc(src.split('/').pop()) + ')</strong> ' + (g.descricao || '') + '</small>' +
                    '</button>';
            }).join('') + '</div>';
    }

    // Configurações de imersão: [{ rotulo, texto } | { rotulo, camuflagens: [{ img, nome, partes }], aviso }]
    function modalConfiguracoes(linhas) {
        var corpo = linhas.map(function (l) {
            var valor;
            if (l.camuflagens) {
                valor = '<td class="camo-list">' + l.camuflagens.map(function (c) {
                    var src = caminho(PINTURAS, c.img);
                    return '<a class="camo-swatch" href="' + esc(src) + '" data-zoom data-caption="' + esc(c.nome) + '">' +
                        '<img src="' + esc(src) + '" alt="Amostra ' + esc(c.nome) + '"></a>' +
                        '<strong>' + c.nome + ':</strong> ' + c.partes + '<br>';
                }).join('') + (l.aviso ? '<span class="text-danger">' + l.aviso + '</span>' : '') + '</td>';
            } else {
                valor = '<td>' + l.texto + '</td>';
            }
            return '<tr><td><strong>' + l.rotulo + '</strong></td>' + valor + '</tr>';
        }).join('');

        return '<dialog id="settingsModal" class="modal" aria-labelledby="settingsTitle">' +
            '<h2 id="settingsTitle">CONFIGURAÇÕES DE IMERSÃO (GHOST EXPERIENCE)</h2>' +
            '<p class="muted">Ajustem os parâmetros do jogo de acordo com a tabela abaixo antes de iniciar a operação.</p>' +
            '<div class="table-wrap"><table class="table-stack">' +
            '<thead><tr><th scope="col">Elemento</th><th scope="col">Diretriz Obrigatória</th></tr></thead>' +
            '<tbody>' + corpo + '</tbody></table></div>' +
            '<div class="modal__actions"><button type="button" class="btn" data-close>ENTENDIDO / FECHAR</button></div>' +
            '</dialog>';
    }

    function acessoGm(hubGm) {
        return '<dialog id="spoilerModal" class="modal modal--danger" aria-labelledby="spoilerTitle">' +
            '<h2 id="spoilerTitle">⚠️ ALERTA DE SEGURANÇA</h2>' +
            '<p>PROTOCOLO OVERLORD // TOC RESTRITO.</p>' +
            '<p>Este dossiê contém diretrizes de arbitragem e eventos imprevistos exclusivos para o GHOST 1-1 (LEAD / GM DA SESSÃO).</p>' +
            '<p>A visualização por operadores de campo comprometerá a imersão da missão.</p>' +
            '<p><strong>Deseja prosseguir?</strong></p>' +
            '<div class="modal__actions">' +
            '<button type="button" class="btn btn--ghost" data-close>CANCELAR / SOU OPERADOR</button>' +
            '<a class="btn btn--danger" href="' + hubGm + '">CONFIRMAR / SOU GHOST 1-1 LEAD</a>' +
            '</div></dialog>' +
            '<a href="' + hubGm + '" data-open="spoilerModal" class="secret-link" title="Acesso Overlord" aria-label="Acesso restrito do Ghost Lead">👁️</a>';
    }

    // ----------------------------------------------------------------------
    // PÁGINAS
    // ----------------------------------------------------------------------
    var ARQUIVOS = {
        hubSquad: 'lore_hub.html',
        hubGm: 'lore_hub_gm.html'
    };

    function paginaHub(m) {
        var hub = m.hub;
        var base = m.imagens;
        var html =
            '<nav class="nav-buttons" aria-label="Navegação da missão"><a class="btn" href="../../index.html">&lt; RETORNAR AO HUB</a>' +
            (hub.imprimir ? '<button type="button" class="btn" data-action="print">IMPRIMIR DOSSIÊ</button>' : '') +
            '</nav>' +
            '<main' + classes('container', GM && 'is-gm') + '>' +
            cabecalho({ titulo: hub.titulo, perigo: GM, linhas: hub.cabecalho, aviso: hub.aviso }) +
            (m.audio ? canalOverlord(m.audio) : '') +
            blocos(hub.briefing, base) +
            (hub.documentos ? barraDocumentos(hub.documentos) : '') +
            (hub.script ? scriptMestre(hub.script) : '') +
            (hub.objetivos || []).map(function (s) { return secaoObjetivos(s, base); }).join('') +
            (hub.gabaritos ? gabaritos(hub.gabaritos, base) : '') +
            '</main>' +
            (m.configuracoes ? modalConfiguracoes(m.configuracoes) : '') +
            (GM || hub.acessoGm === false ? '' : acessoGm(ARQUIVOS.hubGm));

        document.title = hub.tituloPagina || document.title;
        body.insertAdjacentHTML('afterbegin', html);
    }

    function paginaDocumento(m, chave) {
        var doc = m.documentos[chave];
        if (!doc) return erro('Documento "' + chave + '" não existe no missao.js.');

        var voltar = doc.voltar || (GM ? { href: ARQUIVOS.hubGm, rotulo: 'RETORNAR AO HUB GM' } : { href: ARQUIVOS.hubSquad, rotulo: 'RETORNAR AO HUB' });
        var html =
            (doc.marcaDagua ? '<div class="a4-watermark" aria-hidden="true">' + doc.marcaDagua + '</div>' : '') +
            '<nav class="nav-buttons" aria-label="Navegação do dossiê">' +
            '<a class="btn btn--ghost" href="' + esc(voltar.href) + '">&lt; ' + voltar.rotulo + '</a>' +
            '<button type="button" class="btn" data-action="print">🖨️ IMPRIMIR DOSSIÊ</button>' +
            '</nav>' +
            '<main' + classes('container', GM && 'is-gm') + '>' +
            (doc.carimbo ? '<div class="a4-stamp">' + doc.carimbo + '</div>' : '') +
            cabecalho({ titulo: doc.titulo, digitando: doc.digitando, linhas: doc.cabecalho, aviso: doc.aviso }) +
            (doc.secoes || []).map(function (s) {
                return '<h2' + classes(corTitulo(s.cor)) + '>' + s.titulo + '</h2>' + blocos(s.blocos, m.imagens);
            }).join('') +
            (doc.fim ? '<p' + classes('end-mark', doc.fimPequeno && 'fine-print') + '>' + doc.fim + '</p>' : '') +
            (doc.carimboFim ? '<div class="a4-stamp a4-stamp--end">' + doc.carimboFim + '</div>' : '') +
            '</main>';

        body.classList.add('dossier');
        if (doc.estilo) body.classList.add('dossier--' + doc.estilo);
        document.title = doc.tituloPagina || document.title;
        body.insertAdjacentHTML('afterbegin', html);
    }

    function erro(mensagem) {
        body.insertAdjacentHTML('afterbegin', '<main class="container"><h1 class="h-danger">[SEM SINAL]</h1><p>' + esc(mensagem) + '</p></main>');
        if (window.console) console.error('[GRB] ' + mensagem);
    }

    function registrarMissao(dados) {
        var m = resolver(dados);
        estiloGaleriaPadrao = m.estiloGaleria || '';
        var pagina = body.getAttribute('data-pagina');
        if (pagina === 'hub') return paginaHub(m);
        if (pagina === 'documento') return paginaDocumento(m, body.getAttribute('data-doc'));
        erro('Página sem data-pagina válido ("hub" ou "documento").');
    }

    window.GRB = {
        registrarMissao: registrarMissao,
        papel: papel,
        soGm: soGm,
        soSquad: soSquad
    };
})();
