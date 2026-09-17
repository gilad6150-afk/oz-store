const fs = require('fs');

const productsJsPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\products_data.js';
let content = fs.readFileSync(productsJsPath, 'utf8');

const categoryImagesMap = {
    'mezuzot': {
        main_fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'stam': {
        main_fallback: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'tefillin-bags': {
        main_fallback: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'wallets': {
        main_fallback: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'tallitot-tzitzit': {
        main_fallback: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'books': {
        main_fallback: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'gifts': {
        main_fallback: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        atmos: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
        ]
    }
};

const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf('];');

if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonStr = content.substring(jsonStart, jsonEnd + 1);
    const products = JSON.parse(jsonStr);

    products.forEach(p => {
        const cat = p.category || 'stam';
        const config = categoryImagesMap[cat] || categoryImagesMap['stam'];
        
        let mainImg = (p.image || '').trim();
        if (!mainImg || mainImg.includes('unsplash')) {
            mainImg = config.main_fallback;
            p.image = mainImg;
        }

        p.images = [mainImg, ...config.atmos];
    });

    const newContent = "window.PRODUCTS_DATA = " + JSON.stringify(products, null, 4) + ";";
    fs.writeFileSync(productsJsPath, newContent, 'utf8');
    console.log(`Audited and fixed all ${products.length} products strictly!`);
} else {
    console.log("Could not find JSON array in products_data.js");
}
