const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Data', 'Extracted', 'DataPC_TGT_WorldMap_Bootstrap_Split.forge', '15559_-_MFD_GridCellDataBlock_Cell87380_DataBlock(0x15CE78BD662).data');

try {
    if (!fs.existsSync(filePath)) {
        console.error("File not found!");
        process.exit(1);
    }
    const buf = fs.readFileSync(filePath);
    console.log(`Parsing file: ${filePath}`);

    // Let's search for some of the known strings and print the floats 35 bytes after them
    const targets = [
        "GL001_RespawnPoint_PhotographerHouse",
        "RA01_RespawnPoint_ChemicalPlant",
        "GL042_ResPoint_MissionStart",
        "GL076_RespawnPoint_Sullivan",
        "GL007_Respawn_SmugglersCove",
        "RA01_RespawnPoint_ExitRaid"
    ];

    for (const target of targets) {
        const offset = buf.indexOf(target);
        if (offset === -1) {
            console.log(`Target "${target}" not found.`);
            continue;
        }

        const endOffset = offset + target.length;
        console.log(`\nTarget: "${target}"`);
        console.log(`  Offset: 0x${offset.toString(16).toUpperCase()} - 0x${endOffset.toString(16).toUpperCase()}`);

        // Try reading floats at offset relative to end
        // Let's scan from endOffset + 10 to endOffset + 60 in steps of 1 or 4 to find where the coordinates are
        console.log("  Scanning for coordinates (3 consecutive reasonable floats):");
        for (let relative = 10; relative <= 60; relative++) {
            const startPos = endOffset + relative;
            if (startPos + 12 > buf.length) break;
            
            const x = buf.readFloatLE(startPos);
            const y = buf.readFloatLE(startPos + 4);
            const z = buf.readFloatLE(startPos + 8);

            // Coordinates on Auroa are generally:
            // X: -25000 to +25000
            // Y: -25000 to +25000
            // Z: -100 to +2000
            // Also, Y is typically negative for the southern part of the map, and X is negative for the west.
            if (Math.abs(x) > 500 && Math.abs(x) < 25000 &&
                Math.abs(y) > 500 && Math.abs(y) < 25000 &&
                z > -50 && z < 2500) {
                console.log(`    FOUND at relative offset ${relative} (absolute 0x${startPos.toString(16).toUpperCase()}):`);
                console.log(`      X: ${x.toFixed(4)}`);
                console.log(`      Y: ${y.toFixed(4)}`);
                console.log(`      Z: ${z.toFixed(4)}`);
            }
        }
    }

} catch (err) {
    console.error(err);
}
