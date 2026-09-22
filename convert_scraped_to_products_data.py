import json
import os
import re

scraped_file = 'mishkan_catalog_scraped.json'
products_file = 'products_data.js'

if not os.path.exists(scraped_file):
    print("scraped file not ready yet")
    exit(0)

with open(scraped_file, 'r', encoding='utf-8') as f:
    scraped = json.load(f)

print(f"Loaded {len(scraped)} scraped items from {scraped_file}")

# Format into PRODUCTS_DATA schema
new_products = []
base_id = 9100

for i, item in enumerate(scraped):
    pid = base_id + i
    title = item.get('title', f'מוצר משכן התכלת {i+1}')
    price = item.get('price', 99)
    if price <= 0:
        price = 99
    
    main_img = item.get('main_image', '')
    if not main_img:
        main_img = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
    
    gallery = item.get('gallery', [])
    if not gallery:
        gallery = [main_img]
    else:
        if main_img not in gallery:
            gallery.insert(0, main_img)
            
    desc = item.get('description', 'מוצר איכותי מבית משכן התכלת בהשגחה מהודרת.')
    
    cat = 'tallitot-tzitzit'
    cat_name = 'טליות וציציות'
    subcat = 'ציצית צמר'
    if 'טלית' in title:
        subcat = 'טליתות מעוצבות'
    elif 'גופיה' in title or 'גופיית' in title:
        subcat = 'גופיית ציצית'
    elif 'דריי' in title or 'dry' in title.lower():
        subcat = 'ציצית דרייפיט'
    elif 'פתיל' in title:
        subcat = 'פתילים לציצית'

    prod_dict = {
        "id": pid,
        "sku": f"OZ-MH-{pid}",
        "name": title,
        "price": price,
        "regular_price": price + 35,
        "category": cat,
        "category_name": cat_name,
        "subcategory": subcat,
        "inStock": True,
        "image": main_img,
        "images": gallery,
        "short_description": desc,
        "permalink": f"https://oz-judaica.co.il/product/mh-{pid}/"
    }
    new_products.append(prod_dict)

print(f"Generated {len(new_products)} products matching schema.")

# Read existing products_data.js
with open(products_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Extract existing array using regex or json
start_idx = js_content.find('[')
end_idx = js_content.rfind(']')

if start_idx != -1 and end_idx != -1:
    existing_json_str = js_content[start_idx:end_idx+1]
    existing_items = json.loads(existing_json_str)
    print(f"Existing products in JS: {len(existing_items)}")

    # Merge: keep existing items + append new_products
    merged_items = existing_items + new_products

    # Re-write products_data.js
    new_js = "window.PRODUCTS_DATA = " + json.dumps(merged_items, ensure_ascii=False, indent=4) + ";"
    with open(products_file, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print(f"Updated {products_file} cleanly! Total products: {len(merged_items)}")
