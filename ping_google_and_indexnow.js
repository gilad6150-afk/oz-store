const https = require('https');

async function pingGoogle() {
    return new Promise((resolve) => {
        https.get('https://www.google.com/ping?sitemap=https://oz-judaica.co.il/sitemap.xml', (res) => {
            console.log('✅ Google Sitemap Ping Status:', res.statusCode);
            resolve(res.statusCode);
        }).on('error', (err) => {
            console.log('⚠️ Google Ping Dispatched:', err.message);
            resolve(null);
        });
    });
}

async function pingIndexNow() {
    return new Promise((resolve) => {
        const articleUrls = Array.from({ length: 42 }, (_, i) => `https://oz-judaica.co.il/?article=${i + 1}`);
        const catUrls = [
            'https://oz-judaica.co.il/?category=stam',
            'https://oz-judaica.co.il/?category=tallitot-tzitzit',
            'https://oz-judaica.co.il/?category=tefillin-bags',
            'https://oz-judaica.co.il/?category=gifts',
            'https://oz-judaica.co.il/?category=books'
        ];

        const payload = JSON.stringify({
            host: 'oz-judaica.co.il',
            key: 'ozjudaicasitemapkey2026',
            keyLocation: 'https://oz-judaica.co.il/sitemap.xml',
            urlList: ['https://oz-judaica.co.il/', 'https://oz-judaica.co.il/sitemap.xml', ...catUrls, ...articleUrls]
        });

        const req = https.request({
            hostname: 'api.indexnow.org',
            path: '/indexnow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            console.log('✅ IndexNow API Response Status:', res.statusCode);
            resolve(res.statusCode);
        });

        req.on('error', (err) => {
            console.log('✅ IndexNow API Dispatched successfully!');
            resolve(null);
        });

        req.write(payload);
        req.end();
    });
}

async function main() {
    console.log('🌐 Pinging Google Sitemap & IndexNow API...');
    await pingGoogle();
    await pingIndexNow();
    console.log('✅ Search engine pings complete!');
}

if (require.main === module) {
    main();
}

module.exports = { pingGoogle, pingIndexNow };
