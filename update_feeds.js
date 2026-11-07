const fs = require('fs');
const path = require('path');

const storeDir = 'C:/Users/97254/.gemini/antigravity/scratch/oz-store';
const products = JSON.parse(fs.readFileSync(path.join(storeDir, 'products.json'), 'utf8'));

// Only active products
const activeProducts = products.filter(p => !p.is_offline && p.status !== 'offline');
console.log(`Active products for feeds: ${activeProducts.length} (out of ${products.length} total)`);

// 1. Regenerate sitemap.xml
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
sitemap += '  <url>\n    <loc>https://oz-judaica.co.il/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n';
sitemap += '  <url>\n    <loc>https://oz-judaica.co.il/tefillin-bar-mitzvah.html</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n';
sitemap += '  <url>\n    <loc>https://oz-judaica.co.il/matana-le-gever.html</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n';
sitemap += '  <url>\n    <loc>https://oz-judaica.co.il/klaf-mezuzah-kasher.html</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n';

activeProducts.forEach(p => {
    sitemap += '  <url>\n    <loc>https://oz-judaica.co.il/?product=' + p.id + '</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n';
});
sitemap += '</urlset>\n';
fs.writeFileSync(path.join(storeDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('✅ sitemap.xml updated with', activeProducts.length, 'products.');

// 2. Helper to escape XML
const escapeXml = s => String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// 3. Regenerate Google Shopping Feeds
function buildFeedXml(title) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
    xml += '  <channel>\n';
    xml += `    <title>${escapeXml(title)}</title>\n`;
    xml += '    <link>https://oz-judaica.co.il</link>\n';
    xml += '    <description>חנות תשמישי קדושה, תפילין מהודרות ויודאיקה פרימיום</description>\n';

    activeProducts.forEach(p => {
        const desc = (p.short_description || p.description || p.name).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        let imgLink = 'https://oz-judaica.co.il/public/judaica_gifts_category.jpg';
        if (p.image) {
            if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
                imgLink = p.image;
            } else {
                imgLink = 'https://oz-judaica.co.il/' + p.image.replace(/^\//, '');
            }
        }

        xml += '    <item>\n';
        xml += '      <g:id>' + p.id + '</g:id>\n';
        xml += '      <g:title>' + escapeXml(p.name) + '</g:title>\n';
        xml += '      <g:description>' + escapeXml(desc.slice(0, 500)) + '</g:description>\n';
        xml += '      <g:link>https://oz-judaica.co.il/?product=' + p.id + '</g:link>\n';
        xml += '      <g:image_link>' + escapeXml(imgLink) + '</g:image_link>\n';

        if (p.video) {
            const vidUrl = p.video.startsWith('http') ? p.video : 'https://oz-judaica.co.il/' + p.video.replace(/^\//, '');
            xml += '      <g:video_link>' + escapeXml(vidUrl) + '</g:video_link>\n';
        }

        xml += '      <g:availability>in_stock</g:availability>\n';
        xml += '      <g:price>' + p.price + ' ILS</g:price>\n';
        xml += '      <g:brand>עוז יודאיקה</g:brand>\n';
        xml += '      <g:condition>new</g:condition>\n';
        xml += '      <g:google_product_category>Religious &amp; Ceremonial &gt; Religious Items</g:google_product_category>\n';
        
        // Add MPN (Manufacturer Part Number / SKU)
        if (p.sku) {
            xml += '      <g:mpn>' + escapeXml(p.sku) + '</g:mpn>\n';
        }

        xml += '    </item>\n';
    });

    xml += '  </channel>\n</rss>\n';
    return xml;
}

const freeFeed = buildFeedXml('עוז יודאיקה - כרטיסי מוצר חינם גוגל שופינג');
fs.writeFileSync(path.join(storeDir, 'google_shopping_free_feed.xml'), freeFeed, 'utf8');
console.log('✅ google_shopping_free_feed.xml updated with', activeProducts.length, 'items.');

const merchantFeed = buildFeedXml('עוז יודאיקה - Google Merchant Center Product Feed');
fs.writeFileSync(path.join(storeDir, 'google_merchant_feed.xml'), merchantFeed, 'utf8');
console.log('✅ google_merchant_feed.xml updated with', activeProducts.length, 'items.');

const ozFeed = buildFeedXml('עוז יודאיקה - Oz Products Feed');
fs.writeFileSync(path.join(storeDir, 'oz_products_feed.xml'), ozFeed, 'utf8');
console.log('✅ oz_products_feed.xml updated with', activeProducts.length, 'items.');

// Also copy oz_products_feed.xml to Downloads
fs.copyFileSync(path.join(storeDir, 'oz_products_feed.xml'), 'C:/Users/97254/Downloads/oz_products_feed.xml');
console.log('✅ Copied updated oz_products_feed.xml to Downloads.');
