const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  const startMark = 'window.PRODUCTS_DATA = [';
  const startIdx = html.indexOf(startMark);
  if (startIdx === -1) {
    console.log('startMark not found in', filePath);
    return;
  }
  const endIdx = html.indexOf('];', startIdx);
  if (endIdx === -1) {
    console.log('endIdx not found in', filePath);
    return;
  }

  const newProductsJs = 'window.PRODUCTS_DATA = ' + JSON.stringify(products, null, 2);
  html = html.slice(0, startIdx) + newProductsJs + html.slice(endIdx + 1); // keep semicolon
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully updated PRODUCTS_DATA in', filePath);
}

updateHtmlFile('index.html');
updateHtmlFile('cloudflare_deploy/index.html');

// Also keep products_data.js in sync
const productsDataContent = 'window.PRODUCTS_DATA = ' + JSON.stringify(products, null, 2) + ';\n';
fs.writeFileSync('products_data.js', productsDataContent, 'utf8');
if (fs.existsSync('cloudflare_deploy')) {
  fs.writeFileSync('cloudflare_deploy/products_data.js', productsDataContent, 'utf8');
}
console.log('Successfully updated products_data.js in root and cloudflare_deploy');
