const fs = require('fs');

const productsJsPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\products_data.js';
let content = fs.readFileSync(productsJsPath, 'utf8');

const catAtmosphere = {
    'wallets': [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    'stam': [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    'mezuzot': [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    'tefillin-bags': [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    'tallitot-tzitzit': [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    'books': [
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    'gifts': [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ]
};

const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf('];');

if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonStr = content.substring(jsonStart, jsonEnd + 1);
    const products = JSON.parse(jsonStr);

    products.forEach(p => {
        const cat = p.category || 'stam';
        const mainImg = p.image || '';
        const atmos = catAtmosphere[cat] || catAtmosphere['stam'];
        p.images = [mainImg, ...atmos];
    });

    const newContent = "window.PRODUCTS_DATA = " + JSON.stringify(products, null, 4) + ";";
    fs.writeFileSync(productsJsPath, newContent, 'utf8');
    console.log(`Successfully fixed all ${products.length} product galleries!`);
} else {
    console.log("Could not find JSON array in products_data.js");
}
