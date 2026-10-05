const fs = require('fs');

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

let products = [];
if (fs.existsSync('products.json')) {
    try {
        products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
    } catch(e) {}
}
if (!products || products.length === 0) {
    const prodCode = fs.readFileSync('products_data.js', 'utf8');
    const prodMatch = prodCode.match(/window\.(?:PRODUCTS_DATA|products)\s*=\s*(\[[\s\S]*?\]);/);
    products = prodMatch ? JSON.parse(prodMatch[1]) : [];
}

let articles = [];
const artCode = fs.readFileSync('articles_data.js', 'utf8');
const artMatch = artCode.match(/window\.ARTICLES_DATA\s*=\s*(\[[\s\S]*?\]);/);
articles = artMatch ? JSON.parse(artMatch[1]) : [];

console.log(`Loaded ${products.length} products and ${articles.length} articles.`);

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>https://oz-judaica.co.il/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://oz-judaica.co.il/public/hero_banner_groom.jpg</image:loc>
      <image:title>עוז יודאיקה - מרכז תשמישי קדושה ויודאיקה אונליין</image:title>
    </image:image>
  </url>

  <!-- Categories -->
  <url>
    <loc>https://oz-judaica.co.il/?category=stam</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://oz-judaica.co.il/?category=tallitot-tzitzit</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://oz-judaica.co.il/?category=tefillin-bags</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://oz-judaica.co.il/?category=gifts</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://oz-judaica.co.il/?category=books</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Google Merchant Feed -->
  <url>
    <loc>https://oz-judaica.co.il/google_merchant_feed.xml</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;

// Products
xml += '\n  <!-- Products (405 items) -->\n';
for (const p of products) {
    const pUrl = `https://oz-judaica.co.il/?product=${p.id}`;
    let imgUrl = p.image || '';
    if (imgUrl && !imgUrl.startsWith('http')) {
        imgUrl = 'https://oz-judaica.co.il/' + imgUrl.replace(/^\//, '');
    }

    xml += `  <url>
    <loc>${pUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>`;

    if (imgUrl) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
    </image:image>`;
    }

    xml += `\n  </url>\n`;
}

// Articles (Only active published articles)
const publishedArticles = articles.filter(a => a.status === 'published' || (!a.publish_at || new Date(a.publish_at).getTime() <= Date.now()));
xml += `\n  <!-- Articles (${publishedArticles.length} published guides) -->\n`;
for (const a of publishedArticles) {
    const aUrl = `https://oz-judaica.co.il/?article=${a.id}`;
    let imgUrl = a.image || a.img || 'public/hero_banner_groom.jpg';
    if (imgUrl && !imgUrl.startsWith('http')) {
        imgUrl = 'https://oz-judaica.co.il/' + imgUrl.replace(/^\//, '');
    }

    xml += `  <url>
    <loc>${aUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(a.title)}</image:title>
    </image:image>
  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log(`sitemap.xml successfully generated with size: ${Buffer.byteLength(xml, 'utf8')} bytes.`);
