const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'Data', 'Extracted', 'DataPC_TGT_WorldMap_Bootstrap_Split.forge', '15559_-_MFD_GridCellDataBlock_Cell87380_DataBlock(0x15CE78BD662).data');

function extractEntities(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return [];
    }
    const buf = fs.readFileSync(filePath);
    
    // We want to extract printable strings of length >= 6 that look like entities/POI/Villages/RespawnPoints
    const entities = [];
    let currentStr = "";
    let startOffset = -1;

    // First, find all potential strings and their offsets
    const stringLocations = [];
    for (let i = 0; i < buf.length; i++) {
        const c = buf[i];
        if (c >= 32 && c <= 126) {
            if (currentStr === "") startOffset = i;
            currentStr += String.fromCharCode(c);
        } else {
            if (currentStr.length >= 6) {
                // Filter strings to avoid pure noise.
                // We want strings containing letters, numbers, underscores
                if (/^[A-Za-z0-9_#\[\]\-\s]+$/.test(currentStr)) {
                    // Check if it matches interesting patterns
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
                        lower.includes('plant');
                    
                    if (isInteresting) {
                        stringLocations.push({ offset: startOffset, text: currentStr });
                    }
                }
            }
            currentStr = "";
        }
    }

    console.log(`Found ${stringLocations.length} candidate strings.`);

    // For each string, extract ID and Coordinates
    for (const strInfo of stringLocations) {
        const endOffset = strInfo.offset + strInfo.text.length;
        
        // Entity ID: 8 bytes immediately following the string (or very close)
        // Let's read the 8 bytes starting exactly at endOffset (or endOffset + 1 if there's a null terminator)
        // Usually, in Anvil, strings in binary files are either null-terminated or have a length prefix.
        // Let's check the byte at endOffset. If it is 0x00, the ID might start at endOffset + 1.
        let idOffset = endOffset;
        if (buf[idOffset] === 0x00) {
            idOffset += 1;
        }

        let entityIdHex = "Unknown";
        if (idOffset + 8 <= buf.length) {
            const low = buf.readUInt32LE(idOffset);
            const high = buf.readUInt32LE(idOffset + 4);
            entityIdHex = "0x" + high.toString(16).padStart(8, '0') + low.toString(16).padStart(8, '0');
        }

        // Scan for 3 consecutive floats in the next 10 to 60 bytes
        let coords = null;
        for (let relative = 10; relative <= 60; relative++) {
            const startPos = endOffset + relative;
            if (startPos + 12 > buf.length) break;
            
            const x = buf.readFloatLE(startPos);
            const y = buf.readFloatLE(startPos + 4);
            const z = buf.readFloatLE(startPos + 8);

            // Bounds check for Auroa coordinates
            if (Math.abs(x) > 100 && Math.abs(x) < 25000 &&
                Math.abs(y) > 100 && Math.abs(y) < 25000 &&
                z > -100 && z < 3000) {
                coords = { x, y, z };
                break; // Take the first valid match
            }
        }

        if (coords) {
            entities.push({
                name: strInfo.text,
                offsetHex: "0x" + strInfo.offset.toString(16).toUpperCase(),
                id: entityIdHex,
                x: parseFloat(coords.x.toFixed(4)),
                y: parseFloat(coords.y.toFixed(4)),
                z: parseFloat(coords.z.toFixed(4))
            });
        }
    }

    return entities;
}

const entities = extractEntities(filePath);
console.log(`Successfully extracted ${entities.length} entities with coordinates.`);
console.log("Samples:");
for (let i = 0; i < Math.min(30, entities.length); i++) {
    console.log(JSON.stringify(entities[i], null, 2));
}
