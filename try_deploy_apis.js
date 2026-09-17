process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');

const zipPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\site_deploy.zip';
const zipData = fs.readFileSync(zipPath);

console.log("Zip file loaded:", zipData.length, "bytes");

function testEndpoint(name, options, data) {
    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`\n=== ${name} Response (${res.statusCode}) ===`);
                console.log(body.substring(0, 500));
                resolve({ name, status: res.statusCode, body });
            });
        });
        req.on('error', (err) => {
            console.log(`\n=== ${name} Error ===`, err.message);
            resolve({ name, error: err.message });
        });
        if (data) req.write(data);
        req.end();
    });
}

async function main() {
    await testEndpoint("Netlify API (zip upload)", {
        hostname: 'api.netlify.com',
        path: '/api/v1/sites',
        method: 'POST',
        headers: {
            'Content-Type': 'application/zip',
            'Content-Length': zipData.length,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
    }, zipData);
}

main();
