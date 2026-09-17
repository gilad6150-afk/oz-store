const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\index.html', 'utf8');

const prodMatch = html.match(/const products = ([^;]+);/);
if (prodMatch) {
    console.log("products initialization expression:", prodMatch[1]);
}

const dbMatch = html.match(/window\.PRODUCTS_DATA = (\[[\s\S]*?\]);/);
if (dbMatch) {
    const data = JSON.parse(dbMatch[1]);
    console.log("Verified window.PRODUCTS_DATA length in index.html:", data.length);
}
