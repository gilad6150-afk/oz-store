process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');

const email = 'ozstore2026@gmail.com';
const pass = 'MechonOz2026Pass!';
const auth = Buffer.from(`${email}:${pass}`).toString('base64');

console.log("Testing Surge Token Request with Basic Auth...");

const req = https.request({
    hostname: 'router.surge.sh',
    path: '/token',
    method: 'POST',
    headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'surge/0.23.0'
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Surge Token Response (${res.statusCode}):`, body);
    });
});

req.on('error', err => console.log('Error:', err.message));
req.end();
