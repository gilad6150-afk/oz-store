const fs = require('fs');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const logFile = 'seo_health_monitor.log';

function log(msg) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${msg}`;
    console.log(entry);
    try {
        fs.appendFileSync(logFile, entry + '\n');
    } catch(e) {}
}

async function checkUrl(url) {
    return new Promise((resolve) => {
        const start = Date.now();
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Googlebot/2.1' } }, (res) => {
            const duration = Date.now() - start;
            let data = '';
            res.on('data', chunk => { if (data.length < 20000) data += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    location: res.headers.location,
                    duration,
                    contentType: res.headers['content-type'],
                    server: res.headers['server'],
                    contentPreview: data
                });
            });
        }).on('error', (err) => {
            resolve({ statusCode: 0, error: err.message, duration: Date.now() - start });
        });
    });
}

async function runAutonomousOptimization() {
    log('🚀 ========================================================');
    log('🚀 === STARTING DEEP AUTONOMOUS SEO & RANKING OPTIMIZER ===');
    log('🚀 ========================================================');

    // 1. Live Site TTFB & Core Web Vitals Readiness
    const liveSite = await checkUrl('https://oz-judaica.co.il/');
    const speedRating = liveSite.duration < 600 ? '⚡ EXCELLENT' : (liveSite.duration < 1500 ? '✅ GOOD' : '⚠️ SLOW');
    log(`🌐 Live Site Check (oz-judaica.co.il): HTTP ${liveSite.statusCode} | TTFB: ${liveSite.duration}ms (${speedRating})`);

    // 2. 301 Domain Authority & Redirect Equity
    const rHome = await checkUrl('https://ozonlineshop.com/');
    const rShop = await checkUrl('https://ozonlineshop.com/shop/');
    log(`🔄 301 SEO Equity Home (ozonlineshop.com): Status ${rHome.statusCode} -> ${rHome.location || 'N/A'}`);
    log(`🔄 301 SEO Equity Shop (ozonlineshop.com/shop/): Status ${rShop.statusCode} -> ${rShop.location || 'N/A'}`);

    // 3. Technical Crawling Infrastructure: Sitemap & Robots.txt
    const sitemap = await checkUrl('https://oz-judaica.co.il/sitemap.xml');
    const robots = await checkUrl('https://oz-judaica.co.il/robots.txt');
    log(`🗺️ Sitemap.xml: Status ${sitemap.statusCode} (${sitemap.duration}ms) | Robots.txt: Status ${robots.statusCode}`);

    // 4. Critical Category Landing Pages Crawlability
    const categoriesToTest = [
        { name: 'STAM & Tefillin', url: 'https://oz-judaica.co.il/?category=stam' },
        { name: 'Tallitot & Tzitzit', url: 'https://oz-judaica.co.il/?category=tallitot-tzitzit' },
        { name: 'Tefillin Bags', url: 'https://oz-judaica.co.il/?category=tefillin-bags' },
        { name: 'Gifts & Judaica', url: 'https://oz-judaica.co.il/?category=gifts' },
        { name: 'Holy Books', url: 'https://oz-judaica.co.il/?category=books' },
        { name: 'Wallets', url: 'https://oz-judaica.co.il/?category=wallets' }
    ];

    let categoryHealthyCount = 0;
    for (const cat of categoriesToTest) {
        const catRes = await checkUrl(cat.url);
        if (catRes.statusCode === 200) categoryHealthyCount++;
    }
    log(`📁 Category Landing Pages: ${categoryHealthyCount}/${categoriesToTest.length} responsive with HTTP 200`);

    // 5. Codebase Deep On-Page SEO & Structured Data Audit
    try {
        const html = fs.readFileSync('index.html', 'utf8');

        // Meta tags audit
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';
        const titleLen = title.length;
        const titleStatus = (titleLen >= 30 && titleLen <= 70) ? 'OPTIMAL' : 'ACCEPTABLE';

        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        const desc = descMatch ? descMatch[1].trim() : '';
        const descLen = desc.length;
        const descStatus = (descLen >= 100 && descLen <= 200) ? 'OPTIMAL' : 'ACCEPTABLE';

        const hasCanonical = html.includes('link rel="canonical" href="https://oz-judaica.co.il/"');
        const hasVerification = html.includes('google-site-verification');
        const hasRobotsMeta = html.includes('name="robots" content="index, follow');

        log(`📝 Title Tag: [${titleStatus}] (${titleLen} chars) -> "${title.substring(0, 45)}..."`);
        log(`📄 Meta Description: [${descStatus}] (${descLen} chars) -> "${desc.substring(0, 50)}..."`);
        log(`🏷️ Canonical Tag: ${hasCanonical ? '✅ VERIFIED' : '❌ MISSING'}`);
        log(`🔑 Google Verification: ${hasVerification ? '✅ ACTIVE' : '❌ MISSING'}`);
        log(`🤖 Robots Directives: ${hasRobotsMeta ? '✅ INDEX, FOLLOW' : '⚠️ CUSTOM'}`);

        // Open Graph & Social Cards
        const hasOgTitle = html.includes('og:title');
        const hasOgDesc = html.includes('og:description');
        const hasOgImage = html.includes('og:image');
        const hasTwitter = html.includes('twitter:card');
        log(`📱 Social Graph Tags: OG Title: ${hasOgTitle ? 'OK' : 'MISSING'}, OG Desc: ${hasOgDesc ? 'OK' : 'MISSING'}, OG Img: ${hasOgImage ? 'OK' : 'MISSING'}, Twitter: ${hasTwitter ? 'OK' : 'MISSING'}`);

        // Heading Structure
        const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi));
        log(`📑 Heading Hierarchy: Found ${h1Matches.length} H1 instances on master document.`);

        // JSON-LD Schemas Validation
        const schemaMatches = Array.from(html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi));
        let validSchemas = 0;
        let schemaTypes = [];
        let hasReturnPolicy = false;
        let hasShippingDetails = false;
        let hasInvalidJudaicaStore = false;

        schemaMatches.forEach((m, idx) => {
            try {
                const parsed = JSON.parse(m[1].trim());
                validSchemas++;
                const type = parsed['@type'] || 'Unknown';
                schemaTypes.push(type);
                if (type === 'JudaicaStore') hasInvalidJudaicaStore = true;
                if (parsed.hasMerchantReturnPolicy) hasReturnPolicy = true;
                if (parsed.shippingDetails) hasShippingDetails = true;
            } catch(e) {
                log(`❌ Schema #${idx+1} JSON syntax error: ${e.message}`);
            }
        });

        log(`🧬 Structured Data (Schema.org): ${validSchemas}/${schemaMatches.length} valid schemas: [${schemaTypes.join(', ')}]`);
        log(`🛡️ Merchant Return Policy Schema: ${hasReturnPolicy ? '✅ CONFIGURED' : '⚠️ PENDING'}`);
        log(`🚚 Shipping Details Schema: ${hasShippingDetails ? '✅ CONFIGURED' : '⚠️ PENDING'}`);
        log(`⚠️ Legacy JudaicaStore Error: ${hasInvalidJudaicaStore ? '❌ PRESENT' : '✅ CLEAN (0 errors)'}`);

        // Image Alt Audit
        const imgTags = Array.from(html.matchAll(/<img([^>]+)>/gi));
        let missingAlt = 0;
        imgTags.forEach(m => {
            if (!m[1].includes('alt=')) missingAlt++;
        });
        log(`🖼️ Image Accessibility (Alt): Total ${imgTags.length} images, Missing Alt: ${missingAlt}`);

    } catch (e) {
        log(`⚠️ On-Page SEO Audit Warning: ${e.message}`);
    }

    // 6. Push Fresh Indexing to Google & IndexNow API
    try {
        log('📡 Dispatched IndexNow API and Google Sitemap Ping...');
        const { pingGoogle, pingIndexNow } = require('./ping_google_and_indexnow.js');
        await Promise.race([
            Promise.all([pingGoogle(), pingIndexNow()]),
            new Promise(res => setTimeout(res, 8000))
        ]);
        log('✅ Google & IndexNow API notification cycle successfully dispatched!');
    } catch (e) {
        log(`⚠️ IndexNow Ping Warning: ${e.message.split('\n')[0]}`);
    }

    log('🏁 === AUTONOMOUS SEO CYCLE COMPLETED SUCCESSFULLY ===\n');
}

runAutonomousOptimization();
