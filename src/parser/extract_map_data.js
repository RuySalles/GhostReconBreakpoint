const fs = require('fs');
const path = require('path');

const codexDir = path.join(__dirname, '..', 'Data', 'Codex');
const extractedDir = path.join(__dirname, '..', 'Data', 'Extracted');
const outputFile = path.join(__dirname, '..', 'assets', 'map_data.json');

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Helper to parse CSV lines safely
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// 2. Load Codex and Build Location/Province Dictionary
const locationToProvinceMap = new Map();
const provinceNames = new Set([
    'Cape North', 'Channels', 'Driftwood Islets', 'Egg Island', 'Fen Bog',
    'Good Hope Mountain', 'Infinity', 'Lake Country', 'Liberty', 'Mount Hodgson',
    'New Argyll', 'New Stirling', 'Restricted Area 01', 'Seal Islands',
    'Silent Mountain', 'Sinking Country', 'Smuggler Coves', 'Whalers Bay',
    'Wild Coast', 'Windy Islands'
]);

function loadCodex() {
    console.log("Loading Codex CSV files...");
    try {
        if (!fs.existsSync(codexDir)) {
            console.warn(`Codex directory not found at ${codexDir}. Using default mappings.`);
            return;
        }
        const files = fs.readdirSync(codexDir);
        files.forEach(file => {
            if (!file.endsWith('.csv')) return;
            const filePath = path.join(codexDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split(/\r?\n/).filter(l => l.trim() !== "");
            if (lines.length === 0) return;

            const header = parseCSVLine(lines[0]);
            const provinceIndex = header.findIndex(h => h.toLowerCase() === 'province');
            const locationIndex = header.findIndex(h => h.toLowerCase() === 'location' || h.toLowerCase() === 'locations');

            for (let i = 1; i < lines.length; i++) {
                const cells = parseCSVLine(lines[i]);
                let province = "";
                if (provinceIndex !== -1 && cells[provinceIndex]) {
                    province = cells[provinceIndex].replace(/^"|"$/g, '').trim();
                    if (province === '???' || province.toLowerCase() === 'n/a') {
                        province = "";
                    }
                }

                if (locationIndex !== -1 && cells[locationIndex]) {
                    const locs = cells[locationIndex].replace(/^"|"$/g, '').trim();
                    locs.split(',').forEach(loc => {
                        const cleanLoc = loc.trim().replace(/^"|"$/g, '').trim();
                        if (!cleanLoc || cleanLoc === '???' || cleanLoc === 'Locations' || cleanLoc === 'Location') return;

                        // Ignore general instruction texts
                        if (cleanLoc.toLowerCase().includes('talk to') || cleanLoc.toLowerCase().includes('find any')) return;

                        // Check if format is "Province - Location"
                        if (cleanLoc.includes(' - ')) {
                            const parts = cleanLoc.split(' - ');
                            const provCand = parts[0].trim();
                            const locCand = parts[1].trim();

                            let matchedProv = "";
                            for (const p of provinceNames) {
                                if (p.toLowerCase() === provCand.toLowerCase()) {
                                    matchedProv = p;
                                    break;
                                }
                            }

                            if (matchedProv && locCand) {
                                const normLoc = locCand.toLowerCase().replace(/[^a-z0-9]/g, '');
                                if (normLoc) {
                                    locationToProvinceMap.set(normLoc, matchedProv);
                                }
                                return;
                            }
                        }

                        // Standard location mapping
                        const normLoc = cleanLoc.toLowerCase().replace(/[^a-z0-9]/g, '');
                        if (normLoc && province) {
                            locationToProvinceMap.set(normLoc, province);
                            provinceNames.add(province);
                        }
                    });
                }
            }
        });
        console.log(`Codex loaded. Mapped ${locationToProvinceMap.size} locations and registered ${provinceNames.size} provinces.`);
    } catch (err) {
        console.error("Error loading Codex:", err.message);
    }
}

// 3. Match POI Type and Province
function getPOIInfo(name) {
    const normName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Determine type
    let type = "Other";
    if (normName.includes("bivouac") || normName.includes("respawn") || normName.includes("respoint")) {
        type = "Bivouac";
    } else if (normName.includes("camp")) {
        type = "Camp";
    } else if (normName.includes("outpost")) {
        type = "Outpost";
    } else if (normName.includes("village")) {
        type = "Village";
    } else if (normName.includes("station")) {
        type = "Station";
    }

    // Determine province
    let province = "Unknown";

    // Heuristic 1: Direct province name match in entity name
    for (const p of provinceNames) {
        const normP = p.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normName.includes(normP)) {
            province = p;
            break;
        }
    }

    // Heuristic 2: Codex Location matches substring of entity name
    if (province === "Unknown") {
        for (const [normLoc, prov] of locationToProvinceMap.entries()) {
            if (normName.includes(normLoc) || normLoc.includes(normName)) {
                province = prov;
                break;
            }
        }
    }

    // Heuristic 3: Manual coordinates / prefix overrides
    if (province === "Unknown") {
        if (normName.startsWith("ra01") || normName.includes("chemicalplant")) {
            province = "Restricted Area 01";
        } else if (normName.includes("photographerhouse")) {
            province = "Cape North";
        } else if (normName.includes("smugglerscove")) {
            province = "Smuggler Coves";
        }
    }

    return { type, province };
}

// 4. Main Extraction Logic
const extractedPOIs = new Map(); // Keyed by entity ID

function processFile(filePath) {
    const buf = fs.readFileSync(filePath);
    let currentStr = "";
    let startOffset = -1;
    const stringLocations = [];

    // Find all candidate strings
    for (let i = 0; i < buf.length; i++) {
        const c = buf[i];
        if (c >= 32 && c <= 126) {
            if (currentStr === "") startOffset = i;
            currentStr += String.fromCharCode(c);
        } else {
            if (currentStr.length >= 6) {
                if (/^[A-Za-z0-9_#\[\]\-\s]+$/.test(currentStr)) {
                    const lower = currentStr.toLowerCase();
                    const isInteresting =
                        lower.includes('respawn') ||
                        lower.includes('village') ||
                        lower.includes('poi') ||
                        lower.includes('location') ||
                        lower.includes('camp') ||
                        lower.includes('spawn') ||
                        lower.includes('benchmark') ||
                        lower.includes('site') ||
                        lower.includes('plant') ||
                        lower.includes('bivouac') ||
                        lower.includes('outpost') ||
                        lower.includes('battery') ||
                        lower.includes('station') ||
                        lower.includes('center') ||
                        lower.includes('office') ||
                        lower.includes('factory') ||
                        lower.includes('assembly') ||
                        lower.includes('testing') ||
                        lower.includes('r&d') ||
                        lower.includes('control') ||
                        lower.includes('residences') ||
                        lower.includes('homestead') ||
                        lower.includes('estate') ||
                        lower.includes('farm') ||
                        lower.includes('ruins') ||
                        lower.includes('fort') ||
                        lower.includes('harbor') ||
                        lower.includes('cavern') ||
                        lower.includes('lake') ||
                        lower.includes('glacier') ||
                        lower.includes('peak') ||
                        lower.includes('mountain') ||
                        lower.includes('island') ||
                        lower.includes('checkpoint');

                    if (isInteresting) {
                        stringLocations.push({ offset: startOffset, text: currentStr });
                    }
                }
            }
            currentStr = "";
        }
    }

    // Process each candidate string
    for (const strInfo of stringLocations) {
        const endOffset = strInfo.offset + strInfo.text.length;

        let idOffset = endOffset;
        if (buf[idOffset] === 0x00) {
            idOffset += 1;
        }

        if (idOffset + 8 > buf.length) continue;
        const low = buf.readUInt32LE(idOffset);
        const high = buf.readUInt32LE(idOffset + 4);

        // Filter out zero IDs
        if (low === 0 && high === 0) continue;
        const entityIdHex = "0x" + high.toString(16).padStart(8, '0') + low.toString(16).padStart(8, '0');

        // Scan for 3 consecutive Float32 coordinates in relative +10 to +60 offset
        let coords = null;
        for (let relative = 10; relative <= 60; relative++) {
            const startPos = endOffset + relative;
            if (startPos + 12 > buf.length) break;

            const x = buf.readFloatLE(startPos);
            const y = buf.readFloatLE(startPos + 4);
            const z = buf.readFloatLE(startPos + 8);

            // Coordinates bounds check
            if (x >= -25000 && x <= 25000 &&
                y >= -25000 && y <= 25000 &&
                z >= -100 && z <= 3000 &&
                Math.abs(x) > 1.0 && Math.abs(y) > 1.0) {
                coords = { x, y, z };
                break;
            }
        }

        if (coords) {
            const { type, province } = getPOIInfo(strInfo.text);

            // Clean up name by trimming or stripping basic artifacts
            const cleanName = strInfo.text.trim();

            extractedPOIs.set(entityIdHex, {
                id: entityIdHex,
                name: cleanName,
                x: parseFloat(coords.x.toFixed(4)),
                y: parseFloat(coords.y.toFixed(4)),
                z: parseFloat(coords.z.toFixed(4)),
                province: province,
                type: type
            });
        }
    }
}

function runGlobalParsing() {
    loadCodex();

    console.log(`Starting global scan in: ${extractedDir}`);
    if (!fs.existsSync(extractedDir)) {
        console.error(`Extracted data directory not found at ${extractedDir}`);
        process.exit(1);
    }

    try {
        const forgeDirs = fs.readdirSync(extractedDir)
            .map(name => path.join(extractedDir, name))
            .filter(p => fs.statSync(p).isDirectory());

        let totalFilesProcessed = 0;
        let cellFiles = [];

        console.log(`Found ${forgeDirs.length} forge subdirectories.`);

        // Collect all cell data files to process
        forgeDirs.forEach(dir => {
            const files = fs.readdirSync(dir)
                .filter(f => f.endsWith('.data'))
                .map(f => path.join(dir, f));
            cellFiles = cellFiles.concat(files);
        });

        const totalFiles = cellFiles.length;
        console.log(`Total cell files found to process: ${totalFiles}`);

        // Iterative sync processing
        for (let i = 0; i < totalFiles; i++) {
            const file = cellFiles[i];
            try {
                processFile(file);
            } catch (fileErr) {
                console.error(`Error processing file ${path.basename(file)}:`, fileErr.message);
            }
            totalFilesProcessed++;

            if (totalFilesProcessed % 10000 === 0 || totalFilesProcessed === totalFiles) {
                const percent = ((totalFilesProcessed / totalFiles) * 100).toFixed(1);
                console.log(`[PROGRESS] Processed ${totalFilesProcessed}/${totalFiles} files (${percent}%) - Unique POIs so far: ${extractedPOIs.size}`);
            }
        }

        // 5. Save results to output JSON
        const resultsArray = Array.from(extractedPOIs.values());
        console.log(`Extraction complete. Writing ${resultsArray.length} unique POIs to ${outputFile}...`);

        fs.writeFileSync(outputFile, JSON.stringify(resultsArray, null, 2), 'utf-8');
        console.log("Write finished successfully!");

    } catch (err) {
        console.error("Global parsing failed:", err);
    }
}

// Run the script
runGlobalParsing();
