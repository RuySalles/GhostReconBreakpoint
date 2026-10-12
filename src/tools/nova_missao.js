/**
 * nova_missao.js
 *
 * Cria uma missão nova a partir de public/campaigns/_modelo/ e a cadastra no hub.
 *
 * Uso:
 *   npm run nova-missao -- 03 "Silent Storm"
 *
 * Resultado:
 *   public/campaigns/missao-03-silent-storm/   <- páginas + missao.js para preencher
 *   public/assets/missao-03/                   <- pasta para as imagens (e audio/)
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
const pastaImagens = path.join(ROOT, 'public', 'assets', `missao-${nn}`);

if (fs.existsSync(destino)) sair(`a pasta ${pasta} já existe.`);
const existente = fs.readdirSync(CAMPAIGNS).find(d => d.startsWith(`missao-${nn}-`));
if (existente) sair(`já existe uma missão ${nn}: ${existente}.`);

const valores = {
    '{{CODIGO}}': `OPORD-${nn.padStart(3, '0')}`,
    '{{NOME}}': nome.toUpperCase(),
    '{{NOME_TITULO}}': nome,
    '{{IMAGENS}}': `../../assets/missao-${nn}/`
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

// 2. Pasta de imagens (com .gitkeep para o Git registrar a pasta vazia)
fs.mkdirSync(path.join(pastaImagens, 'audio'), { recursive: true });
fs.writeFileSync(path.join(pastaImagens, '.gitkeep'), '');

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
console.log(`Imagens em:    public/assets/missao-${nn}/  (áudio em audio/briefing.mp3)`);
console.log('Hub inicial:   cadastrada em public/campaigns/catalogo.js (ajuste o "resumo")');
console.log(`Próximo passo: preencha public/campaigns/${pasta}/missao.js`);
