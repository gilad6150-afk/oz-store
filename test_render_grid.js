const fs = require('fs');

const indexPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\index.html';
const html = fs.readFileSync(indexPath, 'utf8');

global.window = global;
global.document = {
    getElementById: (id) => ({ innerHTML: '', scrollIntoView: () => {} })
};

// Check for DOMContentLoaded or initial render calls
console.log("Checking script blocks in index.html...");

const scriptStart = html.indexOf('window.renderProductsGrid =');
if (scriptStart !== -1) {
    console.log("Found window.renderProductsGrid around char", scriptStart);
} else {
    console.error("ERROR: window.renderProductsGrid NOT FOUND in index.html!");
}

// Let's search for filterCategory or state.category
const catStart = html.indexOf('state.category');
console.log("Found state.category around char:", catStart);
