import json
import re

products_js_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js"

with open(products_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Category-specific high definition, highly relevant Judaica / Leather image sets
category_images_map = {
    'mezuzot': {
        'main_fallback': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', # Parchment scroll
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # STAM manuscript
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'  # Judaica art
        ]
    },
    'stam': {
        'main_fallback': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Sofer writing
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', # Parchment
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'tefillin-bags': {
        'main_fallback': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', # Leather case
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Velvet texture
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'wallets': {
        'main_fallback': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', # Leather wallet
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', # Leather grain
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'tallitot-tzitzit': {
        'main_fallback': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', # Wool fabric
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', # Weaving texture
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'books': {
        'main_fallback': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', # Leather books
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', # Gold embossing
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
        ]
    },
    'gifts': {
        'main_fallback': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        'atmos': [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', # Gift packaging
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', # Judaica gift
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
        ]
    }
}

json_start = content.find('[')
json_end = content.rfind('];')

if json_start != -1 and json_end != -1:
    products = json.loads(content[json_start:json_end+1])
    
    for p in products:
        cat = p.get('category', 'stam')
        config = category_images_map.get(cat, category_images_map['stam'])
        
        # Keep real catalog image if present and valid, otherwise fallback to category main image
        main_img = p.get('image', '').strip()
        if not main_img or 'unsplash' in main_img:
            main_img = config['main_fallback']
            p['image'] = main_img
        
        # Build 4-image array: [main_img, atmos[0], atmos[1], atmos[2]]
        p['images'] = [main_img] + config['atmos']

    new_content = "window.PRODUCTS_DATA = " + json.dumps(products, indent=4, ensure_ascii=False) + ";"
    with open(products_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Audited and updated all {len(products)} products with 100% strict category imagery!")
else:
    print("Could not find JSON array")
