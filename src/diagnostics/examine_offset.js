const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Data', 'Extracted', 'DataPC_TGT_WorldMap_Bootstrap_Split.forge', '15559_-_MFD_GridCellDataBlock_Cell87380_DataBlock(0x15CE78BD662).data');

try {
    if (!fs.existsSync(filePath)) {
        console.error("File not found!");
        process.exit(1);
    }
    const buf = fs.readFileSync(filePath);
    console.log(`Analyzing offset surrounding GL001_RespawnPoint_PhotographerHouse (offset: 0x1B111)`);

    const startOffset = 0x1B0E0;
    const endOffset = 0x1B1E0;
    const len = endOffset - startOffset;
    const section = buf.slice(startOffset, endOffset);

    console.log("\nHex:");
    let hexStr = "";
    for (let i = 0; i < len; i++) {
        hexStr += section[i].toString(16).padStart(2, '0') + " ";
        if ((i + 1) % 16 === 0) hexStr += "\n";
    }
    console.log(hexStr);

    console.log("\nASCII printable:");
    let asciiStr = "";
    for (let i = 0; i < len; i++) {
        const c = section[i];
        if (c >= 32 && c <= 126) {
            asciiStr += String.fromCharCode(c);
        } else {
            asciiStr += ".";
        }
        if ((i + 1) % 64 === 0) asciiStr += "\n";
    }
    console.log(asciiStr);

    console.log("\nParsed Float32 at offset relative to start (0x1B0E0):");
    for (let i = 0; i <= len - 4; i += 4) {
        const val = section.readFloatLE(i);
        if (!isNaN(val) && isFinite(val) && Math.abs(val) > 0.01 && Math.abs(val) < 1000000) {
            console.log(`  Offset relative ${i} (absolute 0x${(startOffset + i).toString(16).toUpperCase()}): ${val.toFixed(4)}`);
        }
    }

    console.log("\nParsed UInt64 at offset relative to start (0x1B0E0) (in Hex):");
    for (let i = 0; i <= len - 8; i += 8) {
        const low = section.readUInt32LE(i);
        const high = section.readUInt32LE(i + 4);
        // Combine low and high to display hex
        const hex = high.toString(16).padStart(8, '0') + low.toString(16).padStart(8, '0');
        console.log(`  Offset relative ${i} (absolute 0x${(startOffset + i).toString(16).toUpperCase()}): 0x${hex}`);
    }

} catch (err) {
    console.error(err);
}
