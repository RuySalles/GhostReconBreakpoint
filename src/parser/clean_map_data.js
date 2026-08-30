/**
 * clean_map_data.js
 * 
 * Le o assets/map_data.json extraido e aplica filtros baseados em evidencia
 * para remover ruido, assets de motor 3D e coordenadas placeholder invalidas.
 * 
 * Preserva deliberadamente:
 *   - Todos os pontos de Golem Island (RA01_, Sector1, RAID_*)
 *   - Erewhon e pontos de missao com nome especifico
 *   - Todos os Bivouacs/Camps/Outposts com prefixo geografico identificavel
 * 
 * Saida: assets/map_data_clean.json (nao sobrescreve o original)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT_FILE  = path.join(__dirname, '..', 'assets', 'map_data.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'map_data_clean.json');

// 1. PREFIXOS DE ASSETS DO MOTOR - nunca sao POIs geograficos
const ENGINE_ASSET_PREFIXES = [
    'ENV-', 'VEG-', 'GFX_', 'UI_', 'ANX-',
    'houdini', 'DBUnlock', 'WI_AT_',
    'CPointCloud_', 'PointCloud_',
    'AriMountain', '3PB_',
    'IN_Bivouac_Timelapse',
    // Prefixos adicionais descobertos na auditoria
    'DBKnowledge',          // descricoes de banco de dados, sem coordenada geografica
    'Location_WorldMap',    // testes de progressao do mapa-mundo (coords placeholder)
    'Province_Wxx_',        // templates de provincas sem coordenada real
    'MQ_ACT',               // cinematicas de missao principal
    'EVTGRP_',              // grupos de evento logico (triggers), nao locais fisicos
    'Campershed',           // asset de cenario
    'LeaveTheCamp',         // trigger de missao
    'VehicleSpawn',         // spawns de veiculos
    'Vehicle_',
    'PVP_',                 // modo PvP, sem POI de mapa
    'Raid_',
    'RAID_',
    'SaveStation',
    'FastTravel',
    'FASTTRAVE',
];

// 2. NOMES PURAMENTE GENERICOS (sem contexto geografico)
const GENERIC_EXACT_NAMES = new Set([
    'Bivouac','BIVOUAC','#BIVOUAC',
    'Camp','CAMP','Outpost','OUTPOST',
    'Village','VILLAGE','Station','STATION',
    'Location','LOCATION','Mountain','Office','OFFICE',
    'Island','Lake','Farm','Ruins','Fort','Peak','Cavern','Harbor','Glacier',
    'RespawnD','eachBivouac','Reachbivouac','NoRespawn',
    'houdiniPoint','houdiniPointO',
    'Camp  Enemy',          // nome corrompido
    '#caBivouac_FireCamp_AR', // nome de script interno
    'PMC Outpost',          // generico sem localizacao
]);

// 2b. REGRA ADICIONAL: Location_* com coordenadas suspeitas (x ou y entre -50 e 50)
//     As entidades Location_* validas tem coordenadas reais, nao placeholder
function isSuspiciousLocation(poi) {
    if (!poi.name.startsWith('Location_')) return false;
    // Se tanto x quanto y sao muito pequenos, as coordenadas sao placeholder
    if (Math.abs(poi.x) < 50 && Math.abs(poi.y) < 50) return true;
    // Coords tipicas de placeholder do motor: multiplos de 2048/512/8
    const suspX = [8, 8.02, 8.0078, 8.0166, 8.0186, 8.0191, 8.0193, 8.0197, 8.0200, 8.0212, 2052, 2053, 2053.125, 128, 512, 513];
    const suspY = [8, 8.02, 8.0078, 8.0166, 8.0186, 8.0191, 8.0193, 8.0197, 8.0200, 8.0212, 2052, 2053, 2053.125, 128, 512, 513, 32];
    if (suspX.includes(poi.x) || suspY.includes(poi.y)) return true;
    return false;
}


// 3. COORDENADAS GOLEM ISLAND - preservar mesmo que disparem outros filtros
function isGolemIsland(poi) {
    if (poi.x > 9000 && poi.y > 8000) return true;
    const n = poi.name;
    return (
        n.startsWith('RA01_')           ||
        n.startsWith('CamREFPOS_RAID_') ||
        n.startsWith('CamREFPOS_RA01') ||
        n.startsWith('DSC_Bivouac_FP') ||
        n.includes('Sector1')          ||
        n.includes('Sector 1')
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABORDAGEM A - FILTRO GEOGRAFICO POR ZONA VALIDA
//
// Baseado nos limites reais medidos dos dados geograficos de Auroa.
// Apenas entidades cujas coordenadas caem dentro de uma zona valida sao mantidas.
//
// Zonas validas:
//   Ilha Principal: x ∈ [-16000, 2500]  y ∈ [-10000, 8500]
//   Golem Island:   x ∈ [9000,  15000]  y ∈ [ 8000, 15000]
//
// TODO (ABORDAGEM B - Fase Futura):
//   Reprocessar os 99.702 arquivos de celulas binarias com um parser melhorado:
//   - Reduzir a janela de busca de floats de "+10 a +60 bytes" para "+8 a +20 bytes"
//     para uma atribuicao de coordenada mais precisa por entidade.
//   - Exigir que o float Z (altitude) seja > 1.0 para descartar entidades 2D/HUD.
//   - Rejeitar floats com valores tipicos de placeholder do motor (multiplos de 8, 512, 2048).
//   - Ver: src/extract_map_data.js para implementacao atual.
// ─────────────────────────────────────────────────────────────────────────────
const GEO_ZONES = [
    // Ilha Principal de Auroa (sem Golem Island)
    { name: 'main_island', xMin: -16000, xMax: 2500, yMin: -10000, yMax: 8500 },
    // Golem Island / Restricted Area 01
    { name: 'golem_island', xMin: 9000, xMax: 16000, yMin: 8000, yMax: 16000 },
];

// Zona morta central: proximo a (0,0) so existem templates e triggers do motor.
// Entidades reais do mapa (Erewhon, bivouacs, outposts) ficam acima de 200 unidades
// em pelo menos um dos eixos. |x| < 200 E |y| < 200 = placeholder.
const DEAD_ZONE_RADIUS = 200;

// Valores centrais de coordenada usados como placeholder pelo editor do jogo.
// Os floats reais ficam dentro de +-5 unidades desses centros (ex: 2052.8125, 8.019).
const PLACEHOLDER_CENTERS = [8, 512, 513, 2048, 2052, 2053, 8192, 8200, 8212, -512];
const PLACEHOLDER_TOLERANCE = 5;

function isPlaceholderCoord(val) {
    return PLACEHOLDER_CENTERS.some(function(c) {
        return Math.abs(val - c) <= PLACEHOLDER_TOLERANCE;
    });
}

function isInsideValidZone(poi) {
    // Rejeitar zona morta central
    if (Math.abs(poi.x) < DEAD_ZONE_RADIUS && Math.abs(poi.y) < DEAD_ZONE_RADIUS) {
        return false;
    }
    // Rejeitar coordenadas placeholder conhecidas do editor do motor (faixas de +-5)
    if (isPlaceholderCoord(poi.x) || isPlaceholderCoord(poi.y)) {
        return false;
    }
    // Deve estar dentro de uma das zonas geograficas validas de Auroa
    return GEO_ZONES.some(function(zone) {
        return poi.x >= zone.xMin && poi.x <= zone.xMax &&
               poi.y >= zone.yMin && poi.y <= zone.yMax;
    });
}

// 4. DETECTAR COORDENADAS TEMPLATE - par X,Y partilhado por muitas entidades
function buildTemplateCoordsSet(data, threshold) {
    const freq = {};
    for (const p of data) {
        const k = p.x + '|' + p.y;
        freq[k] = (freq[k] || 0) + 1;
    }
    const bad = new Set();
    for (const [k, count] of Object.entries(freq)) {
        if (count > threshold) bad.add(k);
    }
    console.log('  ' + bad.size + ' grupos de coordenadas template detectados (threshold=' + threshold + ')');
    Object.entries(freq)
        .filter(function(e){ return e[1] > threshold; })
        .sort(function(a,b){ return b[1]-a[1]; })
        .slice(0,8)
        .forEach(function(e){ console.log('    [' + e[1] + 'x] coords (' + e[0] + ')'); });
    return bad;
}

// MAIN
function run() {
    console.log('=== CLEAN MAP DATA ===');
    console.log('Lendo: ' + INPUT_FILE);
    const raw  = fs.readFileSync(INPUT_FILE, 'utf-8');
    const data = JSON.parse(raw);
    console.log('Total original: ' + data.length + ' entradas\n');

    console.log('Detectando coordenadas template...');
    const templateCoords = buildTemplateCoordsSet(data, 6);

    let removed = { engineAsset: 0, genericName: 0, templateCoords: 0, suspiciousLocation: 0, outOfZone: 0, preserved_golem: 0 };
    const cleaned = [];

    for (const poi of data) {
        const name     = poi.name.trim();
        const coordKey = poi.x + '|' + poi.y;

        // REGRA 0: Golem Island e sempre preservado
        if (isGolemIsland(poi)) {
            removed.preserved_golem++;
            cleaned.push(poi);
            continue;
        }

        // REGRA 1: Assets do motor (por prefixo de nome)
        const isEngineAsset = ENGINE_ASSET_PREFIXES.some(function(prefix){ return name.startsWith(prefix); });
        if (isEngineAsset) { removed.engineAsset++; continue; }

        // REGRA 2: Nomes puramente genericos
        if (GENERIC_EXACT_NAMES.has(name)) { removed.genericName++; continue; }

        // REGRA 2b: Location_* com coordenadas placeholder
        if (isSuspiciousLocation(poi)) { removed.suspiciousLocation++; continue; }

        // REGRA 3: Coordenadas template
        if (templateCoords.has(coordKey)) { removed.templateCoords++; continue; }

        // REGRA 4 (ABORDAGEM A): Filtro geografico por zona valida de Auroa
        //   Descarta tudo que nao cair dentro da ilha principal ou de Golem Island.
        if (!isInsideValidZone(poi)) { removed.outOfZone++; continue; }

        cleaned.push(poi);
    }

    console.log('\n=== RELATORIO DE LIMPEZA ===');
    console.log('  Original:                   ' + data.length);
    console.log('  Removidos (assets 3D):     -' + removed.engineAsset);
    console.log('  Removidos (nomes genericos):-' + removed.genericName);
    console.log('  Removidos (Location suspeita):-' + removed.suspiciousLocation);
    console.log('  Removidos (coords template):-' + removed.templateCoords);
    console.log('  Removidos (fora de zona A):  -' + removed.outOfZone);
    console.log('  Preservados (Golem Island):  +' + removed.preserved_golem);
    console.log('  ─────────────────────────────');
    console.log('  RESULTADO FINAL:             ' + cleaned.length + ' entradas limpas');

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleaned, null, 2), 'utf-8');
    console.log('\nArquivo gravado em: ' + OUTPUT_FILE);

    // Amostra de qualidade
    console.log('\n=== AMOSTRA DO RESULTADO (primeiros 5 por tipo) ===');
    const byType = {};
    for (const p of cleaned) {
        if (!byType[p.type]) byType[p.type] = [];
        if (byType[p.type].length < 5) byType[p.type].push(p.name + ' (' + p.x.toFixed(0) + ', ' + p.y.toFixed(0) + ')');
    }
    for (const [type, examples] of Object.entries(byType)) {
        console.log('\n  [' + type + ']');
        examples.forEach(function(e){ console.log('    - ' + e); });
    }
}

run();
