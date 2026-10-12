/**
 * gerar_og.js
 *
 * Gera as imagens de pré-visualização de link (Open Graph: WhatsApp, Telegram, Discord...)
 * em public/assets/og/, renderizando um cartão HTML com o Edge/Chrome em modo headless.
 *
 * Uso (só no Windows, precisa do Edge ou Chrome instalado):
 *   npm run gerar-og
 *
 * Para incluir uma missão nova, acrescente um item em CARTOES abaixo e
 * aponte as tags og:image do hub.html da missão para o arquivo gerado.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'public');
const SAIDA = path.join(PUBLIC, 'assets', 'og');

// fundo: caminho a partir da raiz do repositório (imagem SEM spoiler: o Squad também vê a prévia).
// recuo (opcional): px à esquerda sem foto, para o personagem não ficar atrás do título.
// Wallpapers baixados de wallpaperaccess.com ficam em bastidores/og-fundos/ (fora do site).
const CARTOES = [
    {
        arquivo: 'og-site.jpg',
        fundo: 'bastidores/og-fundos/wallpaperaccess-1786050.jpg',
        posicao: 'center', recuo: 300,
        rotulo: 'SALA DE OPERAÇÕES',
        titulo: 'GHOST SQUAD',
        subtitulo: 'Briefings táticos // Auroa'
    },
    {
        arquivo: 'og-missao-01.jpg',
        fundo: 'bastidores/og-fundos/wallpaperaccess-1786059.jpg',
        posicao: 'center', recuo: 360,
        rotulo: 'OPORD-001',
        titulo: 'GROWLER SILENT',
        subtitulo: 'Alvo: Instalação Clandestina Skell Tech'
    },
    {
        arquivo: 'og-missao-02.jpg',
        fundo: 'bastidores/og-fundos/wallpaperaccess-1786053.jpg',
        posicao: 'center',
        rotulo: 'OPORD-002',
        titulo: 'COLD ORE',
        subtitulo: 'Setor: Mount Hodgson'
    }
];

const NAVEGADORES = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

const navegador = NAVEGADORES.find(p => fs.existsSync(p));
if (!navegador) {
    console.error('ERRO: Edge ou Chrome não encontrado.');
    process.exit(1);
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function html(c) {
    const fundo = 'file:///' + path.join(ROOT, c.fundo).replace(/\\/g, '/');
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #060906; }
  .card { position: relative; width: 1200px; height: 630px; font-family: 'Share Tech Mono', monospace; color: #e8ffe8; }
  .bg { position: absolute; inset: 0 0 0 ${c.recuo || 0}px; background: url('${fundo}') ${c.posicao} / cover no-repeat; filter: saturate(.85); -webkit-mask-image: linear-gradient(90deg, transparent, #000 240px); }
  .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(6,9,6,.94) 0%, rgba(6,9,6,.78) 48%, rgba(6,9,6,.25) 100%); }
  .scan { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(51,255,51,.05) 0 1px, transparent 1px 4px); }
  .frame { position: absolute; inset: 28px; border: 2px solid rgba(51,255,51,.55); }
  .content { position: absolute; left: 80px; top: 0; bottom: 0; width: 760px; display: flex; flex-direction: column; justify-content: center; }
  .rotulo { font-size: 30px; letter-spacing: 6px; color: #33ff33; }
  .titulo { font-size: 92px; line-height: 1; margin: 18px 0 22px; letter-spacing: 2px; text-shadow: 0 0 24px rgba(51,255,51,.35); }
  .sub { font-size: 32px; color: #b8d8b8; }
  .rodape { position: absolute; left: 80px; bottom: 58px; font-size: 22px; letter-spacing: 3px; color: #33ff33; opacity: .85; }
  .mira { position: absolute; right: 64px; bottom: 56px; width: 96px; height: 96px; }
</style></head><body><div class="card">
  <div class="bg"></div><div class="shade"></div><div class="scan"></div><div class="frame"></div>
  <svg class="mira" viewBox="0 0 64 64"><g fill="none" stroke="#33ff33" stroke-width="3" stroke-linecap="square">
    <circle cx="32" cy="32" r="17"/><path d="M32 6v14M32 44v14M6 32h14M44 32h14"/></g>
    <circle cx="32" cy="32" r="3.5" fill="#33ff33"/></svg>
  <div class="content">
    <div class="rotulo">// ${esc(c.rotulo)}</div>
    <div class="titulo">${esc(c.titulo)}</div>
    <div class="sub">${esc(c.subtitulo)}</div>
  </div>
  <div class="rodape">GHOST RECON BREAKPOINT // CENTRO DE COMANDO TÁTICO</div>
</div></body></html>`;
}

fs.mkdirSync(SAIDA, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grb-og-'));

for (const c of CARTOES) {
    const htmlPath = path.join(tmp, c.arquivo + '.html');
    const pngPath = path.join(tmp, c.arquivo + '.png');
    const jpgPath = path.join(SAIDA, c.arquivo);
    fs.writeFileSync(htmlPath, html(c), 'utf8');

    execFileSync(navegador, [
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
        '--virtual-time-budget=8000', '--window-size=1200,630',
        `--screenshot=${pngPath}`, 'file:///' + htmlPath.replace(/\\/g, '/')
    ], { stdio: 'ignore' });

    // PNG -> JPG (qualidade 85) para ficar bem abaixo do limite de ~300 KB do WhatsApp
    const ps = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('${pngPath}')
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 85L
$img.Save('${jpgPath}', $codec, $p)
$img.Dispose()`;
    execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });

    const kb = Math.round(fs.statSync(jpgPath).size / 1024);
    console.log(`OK  public/assets/og/${c.arquivo}  (${kb} KB)`);
}

fs.rmSync(tmp, { recursive: true, force: true });
