// State variables
let poiData = [];
let filteredData = [];
let selectedPoi = null;

// Background map calibration: where aurora-optimized.webp sits in game coordinates.
// The image is served as tiles (assets/mapa-tiles/, made by "npm run gerar-tiles").
// To recalibrate, change these values (the old offset sliders found them).
const IMAGEM_LARGURA_PX = 12710;         // aurora-optimized.webp size
const IMAGEM_ALTURA_PX = 16000;
const MAPA_LARGURA_UNIDADES = 18000;     // image width in game units
const MAPA_CENTRO_X = -4600;             // Center of main island (excluding Golem)
const MAPA_CENTRO_Y = -1400;
const TILE_TAMANHO = 256;
let mapOpacity = 0.60;

const UNIDADES_POR_PX = MAPA_LARGURA_UNIDADES / IMAGEM_LARGURA_PX;
const MAPA_ALTURA_UNIDADES = IMAGEM_ALTURA_PX * UNIDADES_POR_PX;
const MAPA_ESQUERDA = MAPA_CENTRO_X - MAPA_LARGURA_UNIDADES / 2;
const MAPA_TOPO = MAPA_CENTRO_Y + MAPA_ALTURA_UNIDADES / 2;
const MAPA_LIMITES = [
    [MAPA_TOPO - MAPA_ALTURA_UNIDADES, MAPA_ESQUERDA],
    [MAPA_TOPO, MAPA_ESQUERDA + MAPA_LARGURA_UNIDADES]
];
// Deepest tile level = full resolution (zoom 0 = whole image inside one tile)
const TILE_ZOOM_MAX = Math.ceil(Math.log2(Math.max(IMAGEM_LARGURA_PX, IMAGEM_ALTURA_PX) / TILE_TAMANHO));

let tileLayer = null;
let isHoveringMarker = false; // Prevents coordinate conflict during hover

// Canvas elements & HUD controls
const coordsDisplay = document.getElementById('coordsDisplay');
const searchInput = document.getElementById('searchInput');
const provinceSelect = document.getElementById('provinceSelect');
const detailsPlaceholder = document.getElementById('detailsPlaceholder');
const detailsContent = document.getElementById('detailsContent');
const txtCounter = document.getElementById('txtCounter');

// Checkboxes
const typeFilters = {
    'Bivouac': document.getElementById('chkBivouac'),
    'Camp': document.getElementById('chkCamp'),
    'Outpost': document.getElementById('chkOutpost'),
    'Village': document.getElementById('chkVillage'),
    'Station': document.getElementById('chkStation'),
    'Other': document.getElementById('chkOther')
};

// Color definitions
const COLORS = {
    'Bivouac': '#00f0ff',
    'Camp': '#ff3333',
    'Outpost': '#ff9900',
    'Village': '#ffff33',
    'Station': '#cc33ff',
    'Other': '#55a855'
};

// Initialize Leaflet Map
// Flat 2D game coordinates (Y is north, X is east), scaled so that Leaflet zoom N
// matches tile level N: at zoom 0 the whole image fits in one 256 px tile.
const ESCALA_ZOOM0 = 1 / (UNIDADES_POR_PX * Math.pow(2, TILE_ZOOM_MAX));
const CRS_AUROA = L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(ESCALA_ZOOM0, -MAPA_ESQUERDA * ESCALA_ZOOM0, -ESCALA_ZOOM0, MAPA_TOPO * ESCALA_ZOOM0)
});

const map = L.map('map', {
    crs: CRS_AUROA,
    minZoom: 0,
    maxZoom: TILE_ZOOM_MAX + 2,  // beyond full resolution the last tiles are enlarged
    zoomSnap: 0.1,
    attributionControl: false,
    renderer: L.canvas({ padding: 0.5 }) // High-performance Leaflet canvas renderer
});

// Only the tiles on screen are downloaded (instead of the whole 12 MB image)
tileLayer = L.tileLayer('assets/mapa-tiles/{z}/{y}/{x}.webp', {
    tileSize: TILE_TAMANHO,
    minZoom: 0,
    maxZoom: TILE_ZOOM_MAX + 2,
    maxNativeZoom: TILE_ZOOM_MAX,
    bounds: MAPA_LIMITES,   // no requests for tiles outside the image
    noWrap: true,
    opacity: mapOpacity
}).addTo(map);

// Show the map right away, even before the POI data arrives
map.fitBounds(MAPA_LIMITES);

// Create a layer group to hold all points
const markerGroup = L.layerGroup().addTo(map);

// Initialize Page
window.addEventListener('load', () => {
    loadData();
});

// Load map data
function loadData() {
    const loaderText = document.getElementById('loaderText');
    fetch('data-out/map_data.json')
        .then(res => {
            if (!res.ok) throw new Error("Falha ao abrir telemetria.");
            return res.json();
        })
        .then(data => {
            poiData = data;
            
            // Populate Provinces Selector
            const provinces = new Set();
            data.forEach(poi => {
                if (poi.province && poi.province !== 'Unknown') {
                    provinces.add(poi.province);
                }
            });

            Array.from(provinces).sort().forEach(p => {
                const opt = document.createElement('option');
                opt.value = p;
                opt.textContent = p.toUpperCase();
                provinceSelect.appendChild(opt);
            });

            // Auto-fit to coordinates bounds on load
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            let hasPoints = false;
            poiData.forEach(poi => {
                if (Math.abs(poi.x) > 100 && Math.abs(poi.y) > 100) {
                    if (poi.x < minX) minX = poi.x;
                    if (poi.x > maxX) maxX = poi.x;
                    if (poi.y < minY) minY = poi.y;
                    if (poi.y > maxY) maxY = poi.y;
                    hasPoints = true;
                }
            });

            if (hasPoints) {
                // Zoom directly into the archipelago bounds
                map.fitBounds([[minY, minX], [maxY, maxX]]);
            } else {
                map.setView([0, 0], -1);
            }

            applyFilters();

            // Hide loader overlay
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 500);
        })
        .catch(err => {
            console.error(err);
            loaderText.innerHTML = `<span style="color:#ff3333;">ERRO DE CONEXÃO: ${err.message}</span><br><br>Verifique se o servidor HTTP/HTTPS está rodando.`;
        });
}

// Filter Logic
function applyFilters() {
    const query = searchInput.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const selProvince = provinceSelect.value;

    filteredData = poiData.filter(poi => {
        // Type filters
        const typeActive = typeFilters[poi.type] ? typeFilters[poi.type].checked : typeFilters['Other'].checked;
        if (!typeActive) return false;

        // Province filter
        if (selProvince !== 'ALL' && poi.province !== selProvince) return false;

        // Text search
        if (query) {
            const normName = poi.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const normId = poi.id.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!normName.includes(query) && !normId.includes(query)) return false;
        }

        return true;
    });

    txtCounter.textContent = `POIs: ${filteredData.length} / ${poiData.length}`;
    renderPoints();
}

// Plot Points in Leaflet using high performance Canvas markers
function renderPoints() {
    markerGroup.clearLayers();

    filteredData.forEach(poi => {
        const color = COLORS[poi.type] || COLORS['Other'];

        // L.circleMarker performs beautifully at 20,000+ points on canvas renderer
        const marker = L.circleMarker([poi.y, poi.x], {
            radius: 3,
            fillColor: color,
            color: '#000',
            weight: 0.5,
            fillOpacity: 0.85
        });

        // Handle hover to update coords display (extremely lightweight, zero DOM overhead!)
        marker.on('mouseover', () => {
            isHoveringMarker = true;
            coordsDisplay.textContent = `X: ${poi.x.toFixed(4)} | Y: ${poi.y.toFixed(4)} | ALVO: ${poi.name}`;
            coordsDisplay.style.borderColor = color; // Border glows in category color!
        });
        marker.on('mouseout', () => {
            isHoveringMarker = false;
            coordsDisplay.style.borderColor = 'var(--term-green)';
        });

        // Handle selection on click
        marker.on('click', () => {
            selectedPoi = poi;
            showDetails(poi);

            // Open standard Leaflet popup with quick info
            marker.bindPopup(`
                <div style="font-weight:bold; font-size: 0.9rem; border-bottom: 1px dashed var(--term-green); padding-bottom:5px; margin-bottom:8px;">${poi.name}</div>
                <b>Tipo:</b> ${poi.type.toUpperCase()}<br>
                <b>Província:</b> ${poi.province}<br>
                <b>Coord:</b> X: ${poi.x.toFixed(2)} | Y: ${poi.y.toFixed(2)}
            `).openPopup();
        });

        marker.addTo(markerGroup);
    });
}

// Attach HUD listeners
searchInput.addEventListener('input', applyFilters);
provinceSelect.addEventListener('change', applyFilters);
Object.values(typeFilters).forEach(chk => {
    chk.addEventListener('change', applyFilters);
});

// Mouse Coordinates overlay tracking
map.on('mousemove', (e) => {
    if (isHoveringMarker) return;
    const gameX = e.latlng.lng;
    const gameY = e.latlng.lat;
    coordsDisplay.textContent = `X: ${gameX.toFixed(4)} | Y: ${gameY.toFixed(4)}`;
});

// Background image opacity slider
const slideOpacity = document.getElementById('slideOpacity');
const valOpacity = document.getElementById('valOpacity');

slideOpacity.addEventListener('input', () => {
    mapOpacity = parseFloat(slideOpacity.value);
    valOpacity.textContent = mapOpacity.toFixed(2);
    tileLayer.setOpacity(mapOpacity);
});

// Selection Details cards
function showDetails(poi) {
    detailsPlaceholder.style.display = 'none';
    detailsContent.style.display = 'block';

    document.getElementById('detName').textContent = poi.name;
    document.getElementById('detId').textContent = poi.id;
    document.getElementById('detProvince').textContent = poi.province;
    
    const typeEl = document.getElementById('detType');
    typeEl.textContent = poi.type;
    typeEl.style.color = COLORS[poi.type] || COLORS['Other'];

    document.getElementById('detX').textContent = poi.x.toFixed(4);
    document.getElementById('detY').textContent = poi.y.toFixed(4);
    document.getElementById('detZ').textContent = poi.z.toFixed(4);
}

function hideDetails() {
    detailsPlaceholder.style.display = 'block';
    detailsContent.style.display = 'none';
}
