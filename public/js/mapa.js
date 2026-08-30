// State variables
let poiData = [];
let filteredData = [];
let selectedPoi = null;

// Background Image Calibration Parameters (Auroa-Optimized WebP mathematically calculated center/bounds)
let mapWidthGameUnits = 18000;
let mapHeightGameUnits = 22658; // matches 12710x16000 aspect ratio
let mapCenterX = -4600;         // Center of main island (excluding Golem)
let mapCenterY = -1400;         // Center of main island (excluding Golem)
let mapOpacity = 0.60;

let overlay = null;
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
// We use CRS.Simple for flat 2D game coordinates where Y is north and X is east
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -6, // Expanded to allow massive zoom out
    maxZoom: 4,  // Expanded to allow deeper zoom in
    zoomSnap: 0.1,
    attributionControl: false,
    renderer: L.canvas({ padding: 0.5 }) // High-performance Leaflet canvas renderer
});

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

            // Setup dynamic image overlay bounds
            updateOverlayBounds();

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

// Render Overlay Bounds
function updateOverlayBounds() {
    const cx = mapCenterX;
    const cy = mapCenterY;
    const w = mapWidthGameUnits;
    const h = mapHeightGameUnits;

    // Leaflet bounds: [[minY, minX], [maxY, maxX]]
    const southWest = [cy - h/2, cx - w/2];
    const northEast = [cy + h/2, cx + w/2];
    const bounds = [southWest, northEast];

    if (!overlay) {
        overlay = L.imageOverlay('assets/aurora-optimized.webp', bounds, {
            opacity: mapOpacity
        }).addTo(map);
    } else {
        overlay.setBounds(bounds);
        overlay.setOpacity(mapOpacity);
    }
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

// Simple offset sliders for visual alignment
const slideCX = document.getElementById('slideCX');
const slideCY = document.getElementById('slideCY');
const slideOpacity = document.getElementById('slideOpacity');
const valCX = document.getElementById('valCX');
const valCY = document.getElementById('valCY');
const valOpacity = document.getElementById('valOpacity');
const btnCopyCalib = document.getElementById('btnCopyCalib');

slideCX.addEventListener('input', () => {
    mapCenterX = parseInt(slideCX.value);
    valCX.textContent = mapCenterX;
    updateOverlayBounds();
});

slideCY.addEventListener('input', () => {
    mapCenterY = parseInt(slideCY.value);
    valCY.textContent = mapCenterY;
    updateOverlayBounds();
});

slideOpacity.addEventListener('input', () => {
    mapOpacity = parseFloat(slideOpacity.value);
    valOpacity.textContent = mapOpacity.toFixed(2);
    updateOverlayBounds();
});

btnCopyCalib.addEventListener('click', () => {
    const text = `mapWidthGameUnits = ${mapWidthGameUnits};\nmapHeightGameUnits = ${mapHeightGameUnits};\nmapCenterX = ${mapCenterX};\nmapCenterY = ${mapCenterY};\nmapOpacity = ${mapOpacity.toFixed(2)};`;
    navigator.clipboard.writeText(text).catch(() => {});
    alert('Valores copiados!\n\n' + text);
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
