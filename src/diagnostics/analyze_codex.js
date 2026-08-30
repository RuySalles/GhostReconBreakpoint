const fs = require('fs');
const path = require('path');

const codexDir = path.join(__dirname, '..', '..', 'Data', 'Codex');

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

try {
    const files = fs.readdirSync(codexDir);
    const provinces = new Set();
    const locations = new Set();
    const keywords = new Set();

    files.forEach(file => {
        if (!file.endsWith('.csv')) return;
        const filePath = path.join(codexDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\r\n').filter(l => l.trim() !== "");
        if (lines.length === 0) return;

        const header = parseCSVLine(lines[0]);
        const provinceIndex = header.findIndex(h => h.toLowerCase() === 'province');
        const locationIndex = header.findIndex(h => h.toLowerCase() === 'location' || h.toLowerCase() === 'locations');
        const nameIndex = header.findIndex(h => h.toLowerCase() === 'name' || h.toLowerCase() === 'mission name' || h.toLowerCase() === 'clue name');

        for (let i = 1; i < lines.length; i++) {
            const cells = parseCSVLine(lines[i]);
            if (provinceIndex !== -1 && cells[provinceIndex]) {
                const prov = cells[provinceIndex].replace(/^"|"$/g, '').trim();
                if (prov && prov !== '???' && prov !== 'Province') {
                    provinces.add(prov);
                }
            }
            if (locationIndex !== -1 && cells[locationIndex]) {
                const locs = cells[locationIndex].replace(/^"|"$/g, '').trim();
                locs.split(',').forEach(loc => {
                    const cleanLoc = loc.trim().replace(/^"|"$/g, '').trim();
                    if (cleanLoc && cleanLoc !== '???' && cleanLoc !== 'Locations' && cleanLoc !== 'Location') {
                        if (!cleanLoc.toLowerCase().includes('talk to') && !cleanLoc.toLowerCase().includes('find any')) {
                            locations.add(cleanLoc);
                        }
                    }
                });
            }
            if (nameIndex !== -1 && cells[nameIndex]) {
                const name = cells[nameIndex].replace(/^"|"$/g, '').trim();
                if (name && name !== 'Name' && name !== 'Mission Name') {
                    if (name.length < 50 && !name.includes('?') && !name.includes('.')) {
                        keywords.add(name);
                    }
                }
            }
        }
    });

    console.log("=== UNIQUE PROVINCES ===");
    console.log(Array.from(provinces).sort());

    console.log("\n=== UNIQUE LOCATIONS ===");
    console.log(Array.from(locations).sort());

} catch (err) {
    console.error(err);
}
