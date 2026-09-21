const fs = require('fs');
const path = require('path');

const storeDir = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store';

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules') scanDir(fullPath);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            checkFile(fullPath);
        }
    }
}

function checkFile(filePath) {
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('utf8');
    
    // Check for common UTF-8 Mojibake / ISO-8859-1 double encoding artifacts
    // Hebrew in Mojibake often appears as '׳' (U+05F3), '×', 'ג', 'Ã©', 'Ã—', etc.
    const mojiRegex = /[\u00C0-\u00FF][\u0080-\u00BF]/g;
    const matches = content.match(mojiRegex);
    
    // Also check for replacement character U+FFFD ()
    const replacementChars = (content.match(/\uFFFD/g) || []).length;
    
    if (replacementChars > 0) {
        console.log(`REPLACEMENT CHARACTERS () FOUND: ${filePath} (${replacementChars} times)`);
    }
    
    if (matches && matches.length > 5) {
        console.log(`POTENTIAL MOJIBAKE IN: ${filePath} (${matches.length} matches)`);
    }
}

console.log("=== COMPREHENSIVE NODE UNICODE AUDIT ===");
scanDir(storeDir);
console.log("=== AUDIT COMPLETE ===");
