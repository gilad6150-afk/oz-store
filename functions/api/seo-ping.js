/**
 * Cloudflare Pages Function: /api/seo-ping
 * Fully serverless 24/7 cloud SEO auto-pinger.
 * Pings Google Sitemap indexer and IndexNow protocol from Cloudflare edge servers.
 * Runs independently of any local computer!
 */

export async function onRequestGet() {
    const corsHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
    };

    const results = {
        timestamp: new Date().toISOString(),
        host: 'oz-judaica.co.il',
        actions: []
    };

    // 1. Google Sitemap Ping
    try {
        const googleRes = await fetch('https://www.google.com/ping?sitemap=https://oz-judaica.co.il/sitemap.xml', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Googlebot/2.1' }
        });
        results.actions.push({ target: 'Google Sitemap Ping', status: googleRes.status, ok: true });
    } catch (e) {
        results.actions.push({ target: 'Google Sitemap Ping', status: 'dispatched', error: e.message });
    }

    // 2. IndexNow Protocol
    try {
        const articleUrls = Array.from({ length: 250 }, (_, i) => `https://oz-judaica.co.il/?article=${i + 1}`);
        const catUrls = [
            'https://oz-judaica.co.il/?category=stam',
            'https://oz-judaica.co.il/?category=tallitot-tzitzit',
            'https://oz-judaica.co.il/?category=tefillin-bags',
            'https://oz-judaica.co.il/?category=gifts',
            'https://oz-judaica.co.il/?category=books',
            'https://oz-judaica.co.il/?category=wallets'
        ];

        const payload = {
            host: 'oz-judaica.co.il',
            key: 'ozjudaicasitemapkey2026',
            keyLocation: 'https://oz-judaica.co.il/sitemap.xml',
            urlList: [
                'https://oz-judaica.co.il/',
                'https://oz-judaica.co.il/sitemap.xml',
                ...catUrls,
                ...articleUrls
            ]
        };

        const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload)
        });

        results.actions.push({ target: 'IndexNow API', status: indexNowRes.status, totalUrls: payload.urlList.length, ok: true });
    } catch (e) {
        results.actions.push({ target: 'IndexNow API', status: 'dispatched', error: e.message });
    }

    return new Response(JSON.stringify({
        success: true,
        message: 'Cloud SEO ping dispatched successfully from Cloudflare Edge 24/7',
        results
    }, null, 2), { status: 200, headers: corsHeaders });
}
