const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Data', 'Extracted', 'DataPC_TGT_WorldMap_Bootstrap_Split.forge', '15559_-_MFD_GridCellDataBlock_Cell87380_DataBlock(0x15CE78BD662).data');

try {
    if (!fs.existsSync(filePath)) {
        console.error("File not found!");
        process.exit(1);
    }
    const buf = fs.readFileSync(filePath);
    console.log(`Searching file: ${filePath}`);

    // Keywords to search (case-insensitive)
    const keywords = ['cell', 'datablock', 'entity', 'mesh', 'poi', 'village', 'location', 'spawn', 'position', 'coord'];
    
    // We will do a search of strings that contain these keywords
    // To extract strings, we look for 4+ consecutive printable ASCII chars
    let currentStr = "";
    let startOffset = -1;
    let matches = [];

    for (let i = 0; i < buf.length; i++) {
        const c = buf[i];
        if (c >= 32 && c <= 126) {
            if (currentStr === "") startOffset = i;
            currentStr += String.fromCharCode(c);
        } else {
            if (currentStr.length >= 4) {
                const lowerStr = currentStr.toLowerCase();
                for (const kw of keywords) {
                    if (lowerStr.includes(kw)) {
                        matches.push({ offset: startOffset, text: currentStr, keyword: kw });
                        break;
                    }
                }
            }
            currentStr = "";
        }
    }

    console.log(`Found ${matches.length} matching strings.`);
    for (let i = 0; i < Math.min(100, matches.length); i++) {
        console.log(`  Offset 0x${matches[i].offset.toString(16).toUpperCase()} (kw: ${matches[i].keyword}): "${matches[i].text}"`);
    }

} catch (err) {
    console.error(err);
}
