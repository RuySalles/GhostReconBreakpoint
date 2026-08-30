const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Data', 'Extracted', 'DataPC_TGT_WorldMap_Bootstrap_Split.forge', '15559_-_MFD_GridCellDataBlock_Cell87380_DataBlock(0x15CE78BD662).data');

try {
    if (!fs.existsSync(filePath)) {
        console.error("File not found!");
        process.exit(1);
    }
    const buf = fs.readFileSync(filePath);
    console.log(`Analyzing file: ${filePath}`);
    console.log(`Size: ${buf.length} bytes`);

    // 1. Find all ASCII strings (length >= 4)
    console.log("\n--- ASCII Strings ---");
    let stringsFound = [];
    let currentStr = "";
    let startOffset = -1;
    for (let i = 0; i < buf.length; i++) {
        const c = buf[i];
        if (c >= 32 && c <= 126) {
            if (currentStr === "") startOffset = i;
            currentStr += String.fromCharCode(c);
        } else {
            if (currentStr.length >= 4) {
                stringsFound.push({ offset: startOffset, text: currentStr });
            }
            currentStr = "";
        }
    }
    console.log(`Total strings found: ${stringsFound.length}`);
    console.log("First 30 strings:");
    for (let i = 0; i < Math.min(30, stringsFound.length); i++) {
        console.log(`  Offset ${stringsFound[i].offset.toString(16).toUpperCase()}: "${stringsFound[i].text}"`);
    }

    // 2. Look for repetitive patterns of Float32 and UInt64
    // We scan the file from the end of the strings onwards, or just scan it all
    // Let's find places with high density of "valid floats" (floats between -100000 and 100000, not very close to 0)
    console.log("\n--- Float32 / UInt64 Pattern Search ---");
    // Let's check some offsets and read floats/ints
    // In Anvil, cell files often contain a section of instanced objects.
    // Let's print the first 256 bytes in Hex to see the header
    console.log("\nFirst 256 bytes header:");
    let hexStr = "";
    for (let i = 0; i < Math.min(buf.length, 256); i++) {
        hexStr += buf[i].toString(16).padStart(2, '0') + " ";
        if ((i + 1) % 16 === 0) hexStr += "\n";
    }
    console.log(hexStr);

} catch (err) {
    console.error(err);
}
