process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
const querystring = require('querystring');

console.log("Testing Surge API registration...");

const postData = querystring.stringify({
    email: 'mechon.oz.store@gmail.com',
    password: 'MechonOzStore2026!'
});

const req = https.request({
    hostname: 'router.surge.sh',
    path: '/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Surge token response (${res.statusCode}):`, body);
    });
});

req.on('error', err => console.log('Error:', err));
req.write(postData);
req.end();
