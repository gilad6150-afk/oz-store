const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Updating Product 633 Data with 100% Authentic Matching Lifestyle Images ===');

// 1. Ensure public/products/pitom_633_original.jpg exists
fs.copyFileSync('product_633_orig.jpg', 'public/products/pitom_633_original.jpg');
console.log('✓ Copied public/products/pitom_633_original.jpg');

// Also copy all 4 images to cloudflare_deploy
const cfProductsDir = 'cloudflare_deploy/public/products';
if (!fs.existsSync(cfProductsDir)) fs.mkdirSync(cfProductsDir, { recursive: true });

const imgFiles = [
  'pitom_633_original.jpg',
  'pitom_633_lifestyle_shabbat.jpg',
  'pitom_633_lifestyle_marble.jpg',
  'pitom_633_lifestyle_study.jpg'
];

imgFiles.forEach(f => {
  fs.copyFileSync(path.join('public/products', f), path.join(cfProductsDir, f));
  console.log(`✓ Synced ${f} to cloudflare_deploy`);
});

// 2. Update products.json
const prods = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const pIndex = prods.findIndex(p => p.id == 633);

if (pIndex === -1) {
  console.error('Product 633 not found in products.json!');
  process.exit(1);
}

const newImages = [
  'public/products/pitom_633_original.jpg',
  'public/products/pitom_633_lifestyle_shabbat.jpg',
  'public/products/pitom_633_lifestyle_marble.jpg',
  'public/products/pitom_633_lifestyle_study.jpg'
];

prods[pIndex].image = newImages[0];
prods[pIndex].images = newImages;

fs.writeFileSync('products.json', JSON.stringify(prods, null, 2), 'utf8');
console.log('✓ Updated products.json with 4 matching authentic images');

// 3. Update products_data.js and index.html
console.log('Running update_index_html_products.js...');
execSync('node update_index_html_products.js', { stdio: 'inherit' });

// 4. Update feeds & sitemap
console.log('Updating feeds & sitemap...');
execSync('node update_feeds.js', { stdio: 'inherit' });
execSync('node build_seo_sitemap.js', { stdio: 'inherit' });

// 5. Run verify_pre_deploy.js
console.log('Running verify_pre_deploy.js...');
execSync('node verify_pre_deploy.js', { stdio: 'inherit' });

console.log('\n✅ PRODUCT 633 DATA AND ASSETS COMPLETELY SYNCHRONIZED!');
