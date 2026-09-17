const fs = require('fs');

const indexPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\index.html';
const html = fs.readFileSync(indexPath, 'utf8');

global.window = {};

const prodDataStart = html.indexOf('window.PRODUCTS_DATA =');
if (prodDataStart !== -1) {
    const prodDataEnd = html.indexOf('];', prodDataStart);
    console.log("Found PRODUCTS_DATA from char", prodDataStart, "to", prodDataEnd);
    const slice = html.substring(prodDataStart, prodDataEnd + 2);
    try {
        eval(slice);
        console.log("SUCCESS! PRODUCTS_DATA parsed successfully with length:", window.PRODUCTS_DATA.length);
    } catch(err) {
        console.error("ERROR parsing PRODUCTS_DATA in index.html:", err.message);
    }
} else {
    console.error("ERROR: window.PRODUCTS_DATA not found in index.html!");
}
