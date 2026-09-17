const fs = require('fs');

// 1. Update layout_frame.html with DNS prefetch and preconnect
const layoutPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\layout_frame.html';
let layout = fs.readFileSync(layoutPath, 'utf8');

const preconnectHead = `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>מכון עוז | תשמישי קדושה, תפילין מהודרות וארנקי יוקרה לגבר - חנות אונליין</title>
    <!-- PERFORMANCE BOOST: DNS PREFETCH & PRECONNECT -->
    <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://images.unsplash.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;

layout = layout.replace(/<meta charset="UTF-8">[\s\S]*?<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/, preconnectHead);
fs.writeFileSync(layoutPath, layout, 'utf8');

// 2. Update clean_render.js to add loading="lazy" decoding="async" to product cards
const cleanRenderPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\clean_render.js';
let cleanRender = fs.readFileSync(cleanRenderPath, 'utf8');

cleanRender = cleanRender.replace(/<img src="([^"]+)" alt="([^"]+)" class="([^"]+)" \/>/g, '<img src="$1" alt="$2" class="$3" loading="lazy" decoding="async" />');

fs.writeFileSync(cleanRenderPath, cleanRender, 'utf8');

console.log("Performance optimizations applied cleanly!");
