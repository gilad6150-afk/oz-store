const fs = require('fs');

const productsJsPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\products_data.js';
const content = fs.readFileSync(productsJsPath, 'utf8');

const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf('];');

if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonStr = content.substring(jsonStart, jsonEnd + 1);
    const products = JSON.parse(jsonStr);

    console.log("Total products:", products.length);

    const categories = {};
    products.forEach(p => {
        const cat = p.category || 'other';
        categories[cat] = (categories[cat] || 0) + 1;
    });

    console.log("Product categories distribution:", categories);

    // Inspect sample images for each category
    const samples = {};
    products.forEach(p => {
        const cat = p.category || 'other';
        if (!samples[cat]) {
            samples[cat] = {
                name: p.name,
                image: p.image,
                images: p.images
            };
        }
    });

    console.log("\nSample images by category:");
    console.log(JSON.stringify(samples, null, 2));
}
