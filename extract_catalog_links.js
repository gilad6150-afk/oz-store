const fs = require('fs');
const path = require('path');

const tzitzitPath = 'C:\\Users\\97254\\.gemini\\antigravity\\brain\\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\\.system_generated\\steps\\6452\\content.md';
const tallitPath = 'C:\\Users\\97254\\.gemini\\antigravity\\brain\\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\\.system_generated\\steps\\6456\\content.md';

function extractProductsFromPage(filePath, category) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /href=["'](https:\/\/mishkan-hatchelet\.co\.il\/m\/[^"']+|\/m\/[^"']+)["']/g;
  const links = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    let url = match[1];
    if (url.startsWith('/')) url = 'https://mishkan-hatchelet.co.il' + url;
    url = url.split('#')[0];
    links.add(url);
  }
  return Array.from(links).map(url => ({ url, category }));
}

const tzitzitProducts = extractProductsFromPage(tzitzitPath, 'tzitzit');
const tallitProducts = extractProductsFromPage(tallitPath, 'tallit');

console.log(`Found ${tzitzitProducts.length} Tzitzit products`);
console.log(`Found ${tallitProducts.length} Tallit products`);

const allProducts = [...tzitzitProducts, ...tallitProducts];
console.log('Sample URLs:');
allProducts.slice(0, 10).forEach(p => console.log(`[${p.category}] ${p.url}`));

fs.writeFileSync('product_urls.json', JSON.stringify(allProducts, null, 2), 'utf8');
console.log('Saved product_urls.json');
