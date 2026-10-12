/**
 * validar_missoes.js
 *
 * Confere todas as missões de public/campaigns/ antes de publicar.
 *
 * Uso:
 *   npm run validar
 *
 * ERRO  (bloqueia o deploy): conteúdo do GM vazando no missao.js, chave GRB.gm() sem valor,
 *       página/documento inexistente, link quebrado, HTML mal fechado num texto,
 *       página do Squad carregando missao-gm.js, missão do catálogo sem página.
 * AVISO (não bloqueia): imagem/áudio/vídeo ausente, imagem pesada ou em PNG,
 *       chave do missao-gm.js sem uso, pasta de missão fora do catálogo.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'public');
const CAMPAIGNS = path.join(PUBLIC, 'campaigns');
const PINTURAS = path.join(PUBLIC, 'assets', 'paint');
const LIMITE_IMAGEM_KB = 800;

let totalErros = 0;
let totalAvisos = 0;

// ---------------------------------------------------------------------------
// Carrega missao-gm.js + missao.js com uma imitação da API GRB do navegador
// ---------------------------------------------------------------------------
function carregarMissao(pasta, erros) {
    const capturado = { dados: null, gm: {}, temGmJs: false, papelComTextoGm: [], usoSoGm: 0 };
    const GRB = {
        papel(squad, gm) {
            if (!(gm && typeof gm === 'object' && gm.__gm)) capturado.papelComTextoGm.push(squad);
            return { __porPapel: true, squad, gm };
        },
        gm(chave) { return { __gm: chave }; },
        soSquad(valor) { return { __so: 'squad', valor }; },
        soGm(valor) { capturado.usoSoGm++; return { __so: 'gm', valor }; },
        registrarGm(dados) { capturado.gm = dados || {}; },
        registrarMissao(dados) { capturado.dados = dados; }
    };
    const contexto = vm.createContext({ window: { GRB }, console });

    const arqGm = path.join(pasta, 'missao-gm.js');
    if (fs.existsSync(arqGm)) {
        capturado.temGmJs = true;
        executar(arqGm, contexto, erros);
    }
    const arq = path.join(pasta, 'missao.js');
    if (!fs.existsSync(arq)) { erros.push('missao.js não existe'); return null; }
    executar(arq, contexto, erros);
    if (!capturado.dados) erros.push('missao.js não chamou GRB.registrarMissao(...)');
    return capturado;
}

function executar(arquivo, contexto, erros) {
    try {
        vm.runInContext(fs.readFileSync(arquivo, 'utf8'), contexto, { filename: arquivo });
    } catch (e) {
        erros.push(path.basename(arquivo) + ' tem erro de JavaScript: ' + e.message);
    }
}

// Mesmo comportamento do resolver de js/componentes.js
function resolver(v, papel, gm, faltando) {
    const OMITIR = resolver.OMITIR;
    if (v === null || v === undefined || typeof v !== 'object') return v;
    if (v.__gm) {
        if (papel !== 'gm') return OMITIR;
        if (!(v.__gm in gm)) { faltando.add(v.__gm); return OMITIR; }
        return resolver(gm[v.__gm], papel, gm, faltando);
    }
    if (v.__so) return v.__so === papel ? resolver(v.valor, papel, gm, faltando) : OMITIR;
    if (v.__porPapel) return resolver(v[papel], papel, gm, faltando);
    if (Array.isArray(v)) {
        return v.map(i => resolver(i, papel, gm, faltando)).filter(r => r !== OMITIR && r !== null && r !== undefined);
    }
    const obj = {};
    for (const k of Object.keys(v)) {
        const r = resolver(v[k], papel, gm, faltando);
        if (r !== OMITIR) obj[k] = r;
    }
    return obj;
}
resolver.OMITIR = {};

function chavesGmUsadas(v, set = new Set()) {
    if (v && typeof v === 'object') {
        if (v.__gm) set.add(v.__gm);
        for (const k of Object.keys(v)) chavesGmUsadas(v[k], set);
    }
    return set;
}

// ---------------------------------------------------------------------------
// Verificações
// ---------------------------------------------------------------------------
const TAGS_VAZIAS = new Set(['br', 'hr', 'img']);

function htmlBalanceado(texto) {
    const pilha = [];
    const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    let m;
    while ((m = re.exec(texto))) {
        const tag = m[1].toLowerCase();
        if (TAGS_VAZIAS.has(tag) || m[0].endsWith('/>')) continue;
        if (m[0][1] === '/') {
            if (pilha.pop() !== tag) return 'tag </' + tag + '> sem abertura correspondente';
        } else {
            pilha.push(tag);
        }
    }
    if (pilha.length) return 'tag <' + pilha[pilha.length - 1] + '> não foi fechada';
    if (/<(?![a-zA-Z\/])/.test(texto)) return 'símbolo "<" solto (use &lt;)';
    return null;
}

// Percorre os dados resolvidos coletando textos e arquivos referenciados
function percorrer(v, contexto, visita) {
    if (typeof v === 'string') return visita.texto(v, contexto.caminho);
    if (!v || typeof v !== 'object') return;
    for (const k of Object.keys(v)) {
        const caminho = contexto.caminho + (Array.isArray(v) ? '[' + k + ']' : '.' + k);
        const filho = { ...contexto, caminho };
        if (k === 'camuflagens') filho.base = 'pintura';
        if (typeof v[k] === 'string') {
            if (k === 'img') visita.arquivo('imagem', v[k], filho);
            else if (k === 'video') visita.arquivo('video', v[k], { ...filho, base: 'missao' });
            else if (k === 'href') visita.link(v[k], caminho);
        }
        percorrer(v[k], filho, visita);
    }
}

function lerEsqueletos(pasta) {
    return fs.readdirSync(pasta).filter(f => f.endsWith('.html')).map(f => {
        const html = fs.readFileSync(path.join(pasta, f), 'utf8');
        const body = (html.match(/<body([^>]*)>/) || [])[1] || '';
        const attr = n => ((body.match(new RegExp(n + '="([^"]*)"')) || [])[1]);
        return {
            arquivo: f,
            pagina: attr('data-pagina'),
            papel: attr('data-papel') === 'gm' ? 'gm' : 'squad',
            doc: attr('data-doc'),
            carregaGm: /src="missao-gm\.js"/.test(html)
        };
    });
}

function validarMissao(nome) {
    const pasta = path.join(CAMPAIGNS, nome);
    const erros = [];
    const avisos = [];
    const m = carregarMissao(pasta, erros);
    const esqueletos = lerEsqueletos(pasta);

    if (m && m.dados) {
        // 1. Conteúdo do GM não pode estar no missao.js
        if (m.papelComTextoGm.length) {
            erros.push(m.papelComTextoGm.length + ' GRB.papel() com texto do GM escrito no missao.js (use GRB.papel(\'...\', GRB.gm(\'chave\')) e coloque o texto no missao-gm.js). Ex.: "' + String(m.papelComTextoGm[0]).slice(0, 60) + '"');
        }
        if (m.usoSoGm) erros.push(m.usoSoGm + ' uso(s) de GRB.soGm() no missao.js: troque por GRB.gm(\'chave\') e mova o conteúdo para o missao-gm.js');

        // 2. Chaves GRB.gm()
        const usadas = chavesGmUsadas(m.dados);
        if (usadas.size && !m.temGmJs) erros.push('usa ' + usadas.size + ' chave(s) GRB.gm() mas não existe missao-gm.js');
        for (const k of Object.keys(m.gm)) if (!usadas.has(k)) avisos.push('chave "' + k + '" do missao-gm.js não é usada no missao.js');

        // 3. Esqueletos .html
        if (!esqueletos.some(e => e.arquivo === 'hub.html')) erros.push('falta hub.html (página de entrada da missão)');
        for (const e of esqueletos) {
            if (e.pagina !== 'hub' && e.pagina !== 'documento') erros.push(e.arquivo + ': data-pagina deve ser "hub" ou "documento"');
            if (e.pagina === 'documento' && !(m.dados.documentos && m.dados.documentos[e.doc])) erros.push(e.arquivo + ': data-doc="' + e.doc + '" não existe em documentos do missao.js');
            if (e.papel === 'squad' && e.carregaGm) erros.push(e.arquivo + ': página do Squad carrega missao-gm.js (vaza spoilers)');
            if (e.papel === 'gm' && !e.carregaGm && usadas.size) erros.push(e.arquivo + ': página do GM não carrega missao-gm.js');
        }

        // 4. Cada papel: arquivos, links, HTML dos textos
        const imagensBase = path.join(pasta, m.dados.imagens || '');
        const jaVisto = new Set();
        for (const papel of ['squad', 'gm']) {
            const faltando = new Set();
            const dados = resolver(m.dados, papel, m.gm, faltando);
            for (const k of faltando) erros.push('chave GRB.gm(\'' + k + '\') sem conteúdo no missao-gm.js');
            if (papel === 'squad' && dados.hub && !dados.hub.titulo) avisos.push('hub sem "titulo" (a página fica sem <h1>)');

            if (dados.audio) verificarArquivo('áudio', path.join(pasta, dados.audio), dados.audio);
            percorrer(dados, { caminho: 'missao', base: 'imagens' }, {
                texto(t, caminho) {
                    const problema = htmlBalanceado(t);
                    if (problema) registrar(erros, 'HTML em ' + caminho + ': ' + problema + ' — "' + t.slice(0, 60) + '"');
                },
                arquivo(tipo, valor, ctx) {
                    if (/^https?:/.test(valor)) return;
                    const alvo = /^\.{1,2}\//.test(valor) ? path.join(pasta, valor)
                        : ctx.base === 'pintura' ? path.join(PINTURAS, valor)
                        : ctx.base === 'missao' ? path.join(pasta, valor)
                        : path.join(imagensBase, valor);
                    verificarArquivo(tipo, alvo, valor);
                },
                link(href, caminho) {
                    if (/^(https?:|#|mailto:)/.test(href)) return;
                    if (!fs.existsSync(path.join(pasta, href.split('#')[0]))) registrar(erros, 'link quebrado em ' + caminho + ': ' + href);
                }
            });
        }

        function verificarArquivo(tipo, alvo, rotulo) {
            if (jaVisto.has(alvo)) return;
            jaVisto.add(alvo);
            if (!fs.existsSync(alvo)) return avisos.push((tipo === 'imagem' ? 'imagem não encontrada: ' : tipo + ' não encontrado: ') + rotulo);
            if (tipo === 'imagem' && !alvo.startsWith(PINTURAS)) {
                const kb = Math.round(fs.statSync(alvo).size / 1024);
                if (/\.png$/i.test(alvo) && kb > 200) avisos.push('imagem em PNG (' + kb + ' KB), converta para WebP/JPG: ' + rotulo);
                else if (kb > LIMITE_IMAGEM_KB) avisos.push('imagem pesada (' + kb + ' KB), reduza para no máx. ~1920px: ' + rotulo);
            }
        }
    }

    function registrar(lista, msg) { if (!lista.includes(msg)) lista.push(msg); }
    return { erros, avisos };
}

// ---------------------------------------------------------------------------
// Catálogo do hub inicial
// ---------------------------------------------------------------------------
function validarCatalogo(pastas) {
    const erros = [];
    const avisos = [];
    const ctx = vm.createContext({ window: {} });
    try {
        vm.runInContext(fs.readFileSync(path.join(CAMPAIGNS, 'catalogo.js'), 'utf8'), ctx);
    } catch (e) {
        erros.push('catalogo.js tem erro de JavaScript: ' + e.message);
        return { erros, avisos };
    }
    const lista = ctx.window.GRB_MISSOES || [];
    const cadastradas = new Set();
    for (const item of lista) {
        if (!item.titulo || !item.pagina) erros.push('item sem titulo/pagina: ' + JSON.stringify(item));
        if (item.pagina && !fs.existsSync(path.join(PUBLIC, item.pagina))) erros.push('página não existe: ' + item.pagina);
        const pasta = (item.pagina || '').split('/')[1];
        if (pasta) cadastradas.add(pasta);
    }
    for (const p of pastas) if (!cadastradas.has(p)) avisos.push(p + ' não está no catálogo (não aparece no hub inicial)');
    return { erros, avisos };
}

// ---------------------------------------------------------------------------
function imprimir(titulo, { erros, avisos }) {
    totalErros += erros.length;
    totalAvisos += avisos.length;
    const status = erros.length ? 'ERRO' : avisos.length ? 'AVISOS' : 'OK';
    console.log('\n[' + status + '] ' + titulo);
    erros.forEach(e => console.log('   ✖ ' + e));
    avisos.forEach(a => console.log('   ⚠ ' + a));
}

const pastas = fs.readdirSync(CAMPAIGNS).filter(d => /^missao-\d{2}-/.test(d) && fs.statSync(path.join(CAMPAIGNS, d)).isDirectory());
console.log('Validando ' + pastas.length + ' missão(ões) em public/campaigns/ ...');
for (const p of pastas) imprimir(p, validarMissao(p));
imprimir('catalogo.js (hub inicial)', validarCatalogo(pastas));

console.log('\nResultado: ' + totalErros + ' erro(s), ' + totalAvisos + ' aviso(s).');
if (totalErros) {
    console.log('Corrija os erros antes de publicar.');
    process.exit(1);
}
