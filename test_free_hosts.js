process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');
const http = require('http');

const zipPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\site_deploy.zip';
const zipData = fs.readFileSync(zipPath);

console.log("Zip loaded:", zipData.length, "bytes");

// Function to upload multipart form data or raw zip
function uploadFile(host, path, fieldName, fileName, buffer) {
    return new Promise((resolve) => {
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
        const header = `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${fileName}"\r\nContent-Type: application/zip\r\n\r\n`;
        const footer = `\r\n--${boundary}--\r\n`;
        
        const payload = Buffer.concat([
            Buffer.from(header),
            buffer,
            Buffer.from(footer)
        ]);

        const req = https.request({
            hostname: host,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': payload.length,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                console.log(`\n=== Response from ${host}${path} (${res.statusCode}) ===`);
                console.log(body.substring(0, 400));
                resolve({ host, status: res.statusCode, body });
            });
        });

        req.on('error', err => {
            console.log(`Error ${host}:`, err.message);
            resolve({ host, error: err.message });
        });

        req.write(payload);
        req.end();
    });
}

async function main() {
    console.log("Testing upload services...");
    await uploadFile('tmpfiles.org', '/api/v1/upload', 'file', 'site_deploy.zip', zipData);
}

main();
