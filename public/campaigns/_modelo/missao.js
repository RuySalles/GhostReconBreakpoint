/* ==========================================================================
   {{CODIGO}} — {{NOME}}
   Todo o conteúdo da missão fica aqui. As páginas são montadas a partir deste arquivo:
     hub.html             -> Hub do Ghost Squad (jogadores)
     hub-gm.html          -> Hub do Ghost Lead (GM) = tudo do Squad + o conteúdo do missao-gm.js
     dossie.html          -> Dossiê tático do Squad   (documentos.dossie)
     dossie-gm.html       -> Dossiê do GM             (documentos.dossie, versão GM)
     intel-documento.html -> Documento interceptado   (documentos.inteligencia)
                             renomeie para intel-<assunto>.html (ex.: intel-skell-agua.html)

   IMPORTANTE: os jogadores baixam ESTE arquivo. Conteúdo do GM vai no missao-gm.js:
   GRB.gm('chave')                       -> lugar de um conteúdo do GM (item de lista, linha,
                                            botão, seção inteira...); o valor fica no missao-gm.js
   GRB.papel('texto Squad', GRB.gm('chave')) -> versão diferente para Squad e GM
   GRB.soSquad(...)                       -> aparece só para o Squad

   Textos aceitam HTML simples: <strong>, <em>, <br>, <span class="warning">,
   <strong class="text-amber">, <strong class="text-danger">.
   Imagens: só o nome do arquivo (procurado em "imagens"), ou caminho começando com ../
   Guia completo: AGENTS.md -> "Como criar uma missão".
   ========================================================================== */
(function (GRB) {
    'use strict';

    var papel = GRB.papel;
    var gm = GRB.gm;
    var soSquad = GRB.soSquad;

    GRB.registrarMissao({
        imagens: 'imagens/',                  // imagens/ desta pasta (salve em WebP ou JPG, máx. ~1920px)
        audio: 'audio/briefing.mp3',          // áudio do Overlord (apague a linha se não houver)
        // estiloGaleria: 'intel-gallery--nvg',         // filtro de visão noturna em todas as galerias

        // ------------------------------------------------------------------
        // HUB
        // ------------------------------------------------------------------
        hub: {
            tituloPagina: papel('{{CODIGO}}: {{NOME_TITULO}} - Lore & Briefing', gm('hub.tituloPagina')),
            titulo: papel('OPERAÇÃO: {{NOME}}', gm('hub.titulo')),
            cabecalho: [
                ['DE', papel('CENTRO DE COMANDO TÁTICO (OVERLORD)', gm('hub.de'))],
                ['PARA', papel('ESQUADRÃO GHOST', gm('hub.para'))],
                ['LOCALIZAÇÃO', 'PROVÍNCIA, AUROA']
                // { aviso: 'TEXTO PISCANDO' }   <- alerta piscando no meio do cabeçalho
            ],
            aviso: papel('&gt;&gt; UPLINK SEGURO ESTABELECIDO...', gm('hub.aviso')),
            // imprimir: true,      // botão "IMPRIMIR DOSSIÊ" na barra do topo
            // acessoGm: false,     // missão sem área do GM (some o 👁️ do canto)

            // Briefing: lista de blocos, na ordem em que aparecem
            briefing: [
                // { video: 'video/briefing.mp4' },
                // { kneeboard: '// CARTAS DE NAVEGAÇÃO (KNEEBOARD)', galeria: [ ... ] },
                'Senhores, ... (parágrafo de abertura do Overlord).',
                { galeria: [
                    { img: 'insercao.jpg', larga: true, titulo: 'Ponto de Inserção', legenda: 'Descrição curta.',
                      zoom: '[INTEL 001] Legenda longa que aparece ao ampliar a imagem.' }
                ] },
                'Segundo parágrafo do briefing.'
                // { h3: 'Resumo Tático (SITREP)' },
                // { tabela: ['Parâmetro', 'Detalhe'], linhas: [
                //     ['Ponto de Infiltração', 'Bivaque X'],
                //     { perigo: true, celulas: ['Risco Ambiental', 'Zona NOGO'] }
                // ] },
                // { lista: ['Item 1', 'Item 2'] },
                // { callout: '<strong>Procedimento:</strong> texto em destaque.' },
                // { p: 'Boa sorte, Ghosts. Dispensados.', classe: 'sign-off typing-effect' }
            ],

            // Botões de documentos abaixo do briefing
            documentos: [
                { configuracoes: true, rotulo: '⚙️ CONFIGURAÇÕES', dica: 'Parâmetros de Imersão e Loadout' },
                { rotulo: '📄 CONFIDENCIAL', href: 'dossie.html', dica: '{{CODIGO}}: Execução Tática (Esquadrão)' },
                { rotulo: '📖 INTELIGÊNCIA', href: 'intel-documento.html', dica: 'Documento Interceptado' },
                gm('hub.documentos.dossieGm')
            ],

            // Script do mestre (só GM)
            script: gm('hub.script'),

            // Objetivos: cada seção vira um título + lista
            objetivos: [
                {
                    titulo: '// OBJETIVOS PRIMÁRIOS',
                    itens: [
                        {
                            titulo: 'OBJETIVO PRINCIPAL:',
                            texto: papel('O que o esquadrão deve fazer.', gm('hub.objetivo1')),
                            sub: [
                                { rotulo: 'Local A:', texto: 'Detalhe do local.', galeria: [
                                    { img: 'alvo_a.jpg', titulo: 'Alvo Primário', legenda: 'Local A', zoom: '[SABOTAGEM] Descrição ampliada.' }
                                ] }
                            ]
                        }
                    ]
                },
                {
                    titulo: '// OBJETIVOS SECUNDÁRIOS (OPCIONAIS)',
                    cor: 'amber',
                    itens: [
                        { titulo: 'OBJETIVO OPCIONAL:', texto: 'Descrição.' }
                    ]
                },
                {
                    titulo: '// PROTOCOLO DE EXTRAÇÃO (EXFIL)',
                    intro: 'A extração só será autorizada após ...',
                    itens: [
                        { titulo: 'PONTO DE ENCONTRO (RV): Bivaque X', galeria: [
                            { img: 'exfil.jpg', larga: true, titulo: 'Ponto de Encontro (RV)', legenda: 'Bivaque X' }
                        ] }
                    ]
                }
            ],

            // Gabaritos do GM (botões que abrem a imagem em tela cheia)
            gabaritos: gm('hub.gabaritos')
        },

        // ------------------------------------------------------------------
        // CONFIGURAÇÕES DE IMERSÃO (modal ⚙️) — camuflagens ficam em assets/paint/
        // ------------------------------------------------------------------
        configuracoes: [
            { rotulo: 'Interface (HUD) e Teclado', texto: 'Regras de HUD.' },
            { rotulo: 'Ponto de Entrada', texto: 'Bivaque X entre 06:00 e 08:00.' },
            { rotulo: 'Transporte (Logística)', texto: 'Viagem rápida PROIBIDA.' },
            { rotulo: 'Camuflagem', aviso: '[!] PROIBIDO OVN', camuflagens: [
                { img: 'all-black.png', nome: 'Preto Sólido', partes: 'Coletes, Mãos' }
            ] },
            { rotulo: 'Regras de Sobrevivência', texto: 'Squad Wipe total encerra a missão.' }
        ],

        // ------------------------------------------------------------------
        // DOCUMENTOS (dossiês em papel)
        // ------------------------------------------------------------------
        documentos: {
            dossie: {
                tituloPagina: papel('{{CODIGO}}: {{NOME_TITULO}} - Briefing Tático (Ghost Squad)', gm('dossie.tituloPagina')),
                marcaDagua: papel('CONFIDENCIAL // USO RESTRITO', gm('dossie.marcaDagua')),
                carimbo: papel('ULTRA SECRETO - APENAS GHOST SQUAD', gm('dossie.carimbo')),
                titulo: papel('GRB-INTEL-{{CODIGO}}: {{NOME}}', gm('dossie.titulo')),
                cabecalho: [
                    ['OPERAÇÃO', '{{NOME}}'],
                    ['LOCALIZAÇÃO', 'ARQUIPÉLAGO DE AUROA // PROVÍNCIA'],
                    ['AUTORIZAÇÃO', papel('APENAS PARA ESQUADRÃO GHOST', gm('dossie.autorizacao'))],
                    gm('dossie.alerta')
                ],
                aviso: soSquad('&gt;&gt; TRANSMISSÃO CRIPTOGRAFADA RECEBIDA...'),
                secoes: [
                    {
                        titulo: '1. REGRAS TÁTICAS',
                        blocos: [
                            { linhas: [
                                '- <strong>Regra 1:</strong> descrição.',
                                gm('dossie.regras.arbitragem')
                            ] }
                        ]
                    },
                    {
                        titulo: '2. EXECUÇÃO TÁTICA (PASSO A PASSO)',
                        blocos: [
                            { h3: 'OBJETIVO 1: LOCAL' },
                            'Prioridade em infiltração.',
                            { lista: ['Ação 1.', gm('dossie.objetivo1.acaoExtra')] }
                        ]
                    },
                    gm('dossie.complicacoes')
                ],
                fim: papel('FIM DA TRANSMISSÃO - BOA CAÇADA, GHOSTS.', gm('dossie.fim')),
                carimboFim: papel('FIM DE RELATÓRIO', gm('dossie.carimboFim'))
            },

            inteligencia: {
                tituloPagina: 'Documento Interceptado',
                // estilo: 'skell',     // visual corporativo azul da Skell Tech
                voltar: { href: 'hub.html', rotulo: 'RETORNAR AO HUB' },
                marcaDagua: 'CONFIDENCIAL',
                carimbo: 'ASSUNTOS INTERNOS',
                titulo: 'TÍTULO DO DOCUMENTO',
                digitando: false,
                cabecalho: [
                    ['DE', 'REMETENTE'],
                    ['PARA', 'DESTINATÁRIO'],
                    ['ASSUNTO', 'ASSUNTO']
                ],
                aviso: '&gt;&gt; DOCUMENTO INTERCEPTADO PELA INTELIGÊNCIA GHOST...',
                secoes: [
                    { titulo: '1. RESUMO', blocos: ['Texto do documento.'] }
                ],
                fim: 'Rodapé do documento.',
                fimPequeno: true
            }
        }
    });
})(window.GRB);
