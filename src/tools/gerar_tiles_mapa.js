/**
 * gerar_tiles_mapa.js
 *
 * Corta a imagem de fundo do mapa (public/assets/aurora-optimized.webp, 12 MB) em
 * "tiles" de 256 px em public/assets/mapa-tiles/{z}/{y}/{x}.webp. O mapa.html baixa
 * só os pedaços visíveis no zoom atual, em vez da imagem inteira.
 *
 * Uso (precisa do "npm install" uma vez, para instalar o sharp):
 *   npm run gerar-tiles
 *
 * Só é preciso rodar de novo se a imagem de fundo mudar. Se as dimensões mudarem,
 * atualize IMAGEM_LARGURA_PX / IMAGEM_ALTURA_PX em public/js/mapa.js (o script avisa).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', '..');
const ORIGEM = path.join(ROOT, 'public', 'assets', 'aurora-optimized.webp');
const SAIDA = path.join(ROOT, 'public', 'assets', 'mapa-tiles');
const TAMANHO_TILE = 256;
const QUALIDADE_WEBP = 80;

// Mesmos valores de public/js/mapa.js
const ESPERADO = { largura: 12710, altura: 16000 };

async function main() {
    sharp.cache(false);
    // A imagem tem ~200 megapixels: acima do limite padrão de segurança do sharp
    const imagem = sharp(ORIGEM, { limitInputPixels: false });
    const { width, height } = await imagem.metadata();
    const zoomMax = Math.ceil(Math.log2(Math.max(width, height) / TAMANHO_TILE));

    console.log(`Origem: ${path.relative(ROOT, ORIGEM)} (${width} x ${height} px)`);
    if (width !== ESPERADO.largura || height !== ESPERADO.altura) {
        console.warn(`AVISO: dimensões diferentes de ${ESPERADO.largura} x ${ESPERADO.altura}. ` +
            'Atualize IMAGEM_LARGURA_PX / IMAGEM_ALTURA_PX em public/js/mapa.js e ESPERADO aqui.');
    }

    fs.rmSync(SAIDA, { recursive: true, force: true });

    // layout "google": pastas {z}/{y}/{x}, zoom 0 = imagem inteira em um tile,
    // imagem presa no canto superior esquerdo; sobra das bordas fica transparente.
    await imagem
        .ensureAlpha()
        .webp({ quality: QUALIDADE_WEBP })
        .tile({
            size: TAMANHO_TILE,
            layout: 'google',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(SAIDA);

    // Arquivos auxiliares do libvips que o site não usa (ficam dentro e ao lado da pasta)
    for (const pasta of [SAIDA, path.dirname(SAIDA)]) {
        for (const extra of ['vips-properties.xml', 'blank.png']) {
            fs.rmSync(path.join(pasta, extra), { force: true });
        }
    }

    let arquivos = 0;
    let bytes = 0;
    (function contar(pasta) {
        for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
            const alvo = path.join(pasta, item.name);
            if (item.isDirectory()) contar(alvo);
            else { arquivos++; bytes += fs.statSync(alvo).size; }
        }
    })(SAIDA);

    const niveis = fs.readdirSync(SAIDA).map(Number).filter(n => !Number.isNaN(n)).sort((a, b) => a - b);
    console.log(`Tiles: ${arquivos} arquivos, ${(bytes / 1048576).toFixed(1)} MB, zoom ${niveis[0]} a ${niveis[niveis.length - 1]}`);
    if (niveis[niveis.length - 1] !== zoomMax) {
        console.warn(`AVISO: zoom máximo gerado (${niveis[niveis.length - 1]}) difere do calculado (${zoomMax}).`);
    }
}

main().catch(err => {
    console.error('Falha ao gerar os tiles:', err.message);
    process.exit(1);
});
