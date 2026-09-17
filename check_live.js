process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
const dns = require('dns');

console.log("Checking DNS and HTTP for oz-judaica.co.il and netlify.app...");

dns.resolveNs('oz-judaica.co.il', (err, addresses) => {
    if (err) console.log("NS Error:", err.message);
    else console.log("NS Records for oz-judaica.co.il:", addresses);
});

dns.resolve4('oz-judaica.co.il', (err, addresses) => {
    if (err) console.log("A Record Error:", err.message);
    else console.log("A Records for oz-judaica.co.il:", addresses);
});

https.get('https://oz-judaica.netlify.app', (res) => {
    console.log("https://oz-judaica.netlify.app Status Code:", res.statusCode);
}).on('error', (e) => {
    console.log("Netlify App Error:", e.message);
});

https.get('https://oz-judaica.co.il', (res) => {
    console.log("https://oz-judaica.co.il Status Code:", res.statusCode);
}).on('error', (e) => {
    console.log("Custom Domain Error:", e.message);
});
