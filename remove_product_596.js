const fs = require('fs');

// 1. Read products.json and filter out 596
const productsPath = 'products.json';
const raw = fs.readFileSync(productsPath, 'utf8');
let products = JSON.parse(raw);

const beforeCount = products.length;
const removedProduct = products.find(p => p.id == 596 || p.id == '596');

if (!removedProduct) {
  console.log('Product 596 was not found in products.json!');
  process.exit(1);
}

console.log(`Found product to remove: ID ${removedProduct.id} - "${removedProduct.name}" (Price: ${removedProduct.price})`);

products = products.filter(p => p.id != 596 && p.id != '596');
const afterCount = products.length;

console.log(`Count before: ${beforeCount}, Count after: ${afterCount} (Removed 1 item)`);

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Saved updated products.json');

// 2. Update products_data.js
const productsDataPath = 'products_data.js';
fs.writeFileSync(productsDataPath, 'window.PRODUCTS_DATA = ' + JSON.stringify(products, null, 2) + ';', 'utf8');
console.log('Saved updated products_data.js');

console.log('Product 596 removal complete!');
