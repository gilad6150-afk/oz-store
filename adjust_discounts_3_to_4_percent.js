const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== Adjusting Discounts to 3-4% (Subtle & Professional, No Percentage Shown) ===');

const prods = JSON.parse(fs.readFileSync('products.json', 'utf8'));

let adjustedCount = 0;
let resetCount = 0;

prods.forEach(p => {
  if (p.regular_price && Number(p.regular_price) > Number(p.price)) {
    const P = Number(p.price);

    // If plastic item under 15 NIS or Sefer Torah (120,000 NIS), clean to regular_price = price
    if (P <= 15 || p.id == 5223) {
      p.regular_price = P;
      resetCount++;
      console.log(`Reset ${p.id} (${p.name.substring(0, 30)}): regular_price = ${P}`);
    } else {
      // Calculate 3.5% discount: P / (1 - 0.035) -> P * ~1.036269
      const newReg = Math.round(P * 1.036);
      p.regular_price = newReg > P ? newReg : P + 1;
      const pct = (((p.regular_price - P) / p.regular_price) * 100).toFixed(1);
      adjustedCount++;
      console.log(`Adjusted ${p.id} (${p.name.substring(0, 30)}): price=${P}, regular_price=${p.regular_price} (${pct}% discount)`);
    }
  }
});

console.log(`\nSummary: ${adjustedCount} products adjusted to ~3.5% discount, ${resetCount} reset to equal price.`);

// Save products.json
fs.writeFileSync('products.json', JSON.stringify(prods, null, 2), 'utf8');
if (fs.existsSync('cloudflare_deploy/products.json')) {
  fs.writeFileSync('cloudflare_deploy/products.json', JSON.stringify(prods, null, 2), 'utf8');
}
console.log('✓ products.json updated successfully.');

// Sync products_data.js and index.html
console.log('Syncing products_data.js and index.html...');
execSync('node update_index_html_products.js', { stdio: 'inherit' });

// Remove percentage from PDP in index.html and cloudflare_deploy/index.html
function removePercentageFromHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  const target = '<span>מבצע חם: חיסכון של ₪${Number(p.regular_price) - Number(p.price)} (${Math.round((1 - Number(p.price) / Number(p.regular_price)) * 100)}% הנחה)</span>';
  const replacement = '<span>מבצע מיוחד: חיסכון של ₪${Number(p.regular_price) - Number(p.price)}</span>';
  if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Removed percentage display from ${filePath}`);
  } else {
    console.log(`Percentage target string not found in ${filePath} (may already be clean)`);
  }
}

removePercentageFromHtml('index.html');
removePercentageFromHtml('cloudflare_deploy/index.html');

// Update feeds and sitemap
console.log('Updating feeds and sitemap...');
execSync('node update_feeds.js', { stdio: 'inherit' });
execSync('node build_seo_sitemap.js', { stdio: 'inherit' });

// Verify pre-deploy
console.log('Running verify_pre_deploy.js...');
execSync('node verify_pre_deploy.js', { stdio: 'inherit' });

console.log('\n🎉 ALL DISCOUNTS ADJUSTED TO 3-4% AND PERCENTAGE BADGE REMOVED!');
