import json
import re

products_js_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js"

with open(products_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Category atmosphere map (Only highly relevant, elegant Judaica / Leather / STAM atmosphere photos)
cat_atmosphere = {
    'wallets': [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', # Leather texture
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', # Executive leather detail
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'  # Leather craft studio
    ],
    'stam': [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Sofer writing
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', # Parchment detail
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'  # Quill & ink studio
    ],
    'mezuzot': [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', # Parchment
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Handcraft scroll
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    'tefillin-bags': [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Velvet & case
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', # Leather embroidery
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    'tallitot-tzitzit': [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', # Wool fabric
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', # Weaving texture
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    'books': [
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', # Leather books
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', # Gold embossing
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    'gifts': [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', # Gift packaging
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Luxury presentation
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ]
}

# Extract products array JSON string from products_data.js
match = re.search(r'window\.PRODUCTS_DATA\s*=\s*(\[\s*\{[\s\S]*\}\s*\]);', content)
if match:
    products = json.loads(match.group(1))
    
    for p in products:
        cat = p.get('category', 'stam')
        main_img = p.get('image', '')
        
        # Get appropriate category atmosphere images
        atmos = cat_atmosphere.get(cat, cat_atmosphere['stam'])
        
        # Build 4-image array: [main_img, atmos[0], atmos[1], atmos[2]]
        p['images'] = [main_img] + atmos
    
    # Format back to JS file
    new_js = "window.PRODUCTS_DATA = " + json.dumps(products, indent=4, ensure_ascii=False) + ";"
    with open(products_js_path, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print(f"Updated all {len(products)} products gallery images cleanly!")
else:
    print("Could not match window.PRODUCTS_DATA in products_data.js")
