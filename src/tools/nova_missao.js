/**
 * nova_missao.js
 *
 * Cria uma missão nova a partir de public/campaigns/_modelo/ e a cadastra no hub.
 *
 * Uso:
 *   npm run nova-missao -- 03 "Silent Storm"
 *
 * Resultado:
 *   public/campaigns/missao-03-silent-storm/   <- páginas + missao.js e missao-gm.js para preencher,
 *                                                 com imagens/, audio/ e video/ (o que o site publica)
 *   bastidores/missao-03-silent-storm/         <- fora do site: originais, roteiro, rascunhos
 *   public/campaigns/catalogo.js                <- missão adicionada à lista do hub
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const CAMPAIGNS = path.join(ROOT, 'public', 'campaigns');
const MODELO = path.join(CAMPAIGNS, '_modelo');
const REGISTRO = path.join(CAMPAIGNS, 'catalogo.js');

function sair(mensagem) {
    console.error('ERRO: ' + mensagem);
    console.error('Uso: npm run nova-missao -- <número> "<nome da operação>"');
    console.error('Ex.: npm run nova-missao -- 03 "Silent Storm"');
    process.exit(1);
}

const [numeroArg, nomeArg] = process.argv.slice(2);
if (!numeroArg || !/^\d{1,2}$/.test(numeroArg)) sair('informe o número da missão (ex.: 03).');
if (!nomeArg || !nomeArg.trim()) sair('informe o nome da operação entre aspas.');

const nn = numeroArg.padStart(2, '0');
const nome = nomeArg.trim();
const slug = nome
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const pasta = `missao-${nn}-${slug}`;
const destino = path.join(CAMPAIGNS, pasta);
const bastidores = path.join(ROOT, 'bastidores', pasta);

if (fs.existsSync(destino)) sair(`a pasta ${pasta} já existe.`);
const existente = fs.readdirSync(CAMPAIGNS).find(d => d.startsWith(`missao-${nn}-`));
if (existente) sair(`já existe uma missão ${nn}: ${existente}.`);

const valores = {
    '{{CODIGO}}': `OPORD-${nn.padStart(3, '0')}`,
    '{{NOME}}': nome.toUpperCase(),
    '{{NOME_TITULO}}': nome
};

// 1. Copia o modelo preenchendo os marcadores
fs.mkdirSync(destino);
for (const arquivo of fs.readdirSync(MODELO)) {
    let conteudo = fs.readFileSync(path.join(MODELO, arquivo), 'utf8');
    for (const [marcador, valor] of Object.entries(valores)) {
        conteudo = conteudo.split(marcador).join(valor);
    }
    fs.writeFileSync(path.join(destino, arquivo), conteudo, 'utf8');
}

// 2. Pastas de mídia da missão e de bastidores (.gitkeep para o Git registrar pastas vazias)
for (const sub of ['imagens', 'audio', 'video']) {
    fs.mkdirSync(path.join(destino, sub));
    fs.writeFileSync(path.join(destino, sub, '.gitkeep'), '');
}
fs.mkdirSync(path.join(bastidores, 'imagens-originais'), { recursive: true });
fs.writeFileSync(path.join(bastidores, 'imagens-originais', '.gitkeep'), '');

// 3. Cadastra no hub inicial
const registro = fs.readFileSync(REGISTRO, 'utf8');
const fim = registro.lastIndexOf('];');
if (fim === -1) sair('não encontrei o final da lista em campaigns/catalogo.js.');
const antes = registro.slice(0, fim).replace(/\s*$/, '');
const entrada =
    ',\n    {\n' +
    `        titulo: 'OPORD: ${nome.toUpperCase().replace(/'/g, "\\'")}',\n` +
    `        resumo: 'Status: Em preparação | Setor: (definir)',\n` +
    `        pagina: 'campaigns/${pasta}/hub.html'\n` +
    '    }\n';
fs.writeFileSync(REGISTRO, antes + entrada + registro.slice(fim), 'utf8');

console.log(`Missão criada: public/campaigns/${pasta}/`);
console.log(`Mídia em:      public/campaigns/${pasta}/imagens/ (WebP/JPG), audio/briefing.mp3, video/`);
console.log(`Originais em:  bastidores/${pasta}/imagens-originais/ (fora do site)`);
console.log('Hub inicial:   cadastrada em public/campaigns/catalogo.js (ajuste o "resumo")');
console.log(`Próximo passo: preencha missao.js (Squad) e missao-gm.js (GM) e rode "npm run validar"`);
