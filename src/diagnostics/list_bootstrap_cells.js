const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'Data', 'Extracted', 'DataPC_TGT_WorldMap_Bootstrap_Split.forge');

try {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        process.exit(1);
    }
    const files = fs.readdirSync(dir);
    const cells = [];
    for (const file of files) {
        if (file.toLowerCase().includes('cell') && file.toLowerCase().includes('datablock')) {
            const stat = fs.statSync(path.join(dir, file));
            if (stat.size > 140) {
                cells.push({ name: file, size: stat.size, path: path.join(dir, file) });
            }
        }
    }
    cells.sort((a, b) => a.size - b.size);
    console.log(`Found ${cells.length} cells with data in Bootstrap split.`);
    console.log("Top 20 smallest non-empty cells:");
    for (let i = 0; i < Math.min(cells.length, 20); i++) {
        console.log(`  ${cells[i].name} (${cells[i].size} bytes)`);
    }
    console.log("\nTop 20 largest cells:");
    for (let i = Math.max(0, cells.length - 20); i < cells.length; i++) {
        console.log(`  ${cells[i].name} (${cells[i].size} bytes)`);
    }
} catch (err) {
    console.error(err);
}
