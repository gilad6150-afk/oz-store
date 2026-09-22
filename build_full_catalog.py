import json
import urllib.parse
import os

urls_file = 'mishkan_product_urls.txt'

if not os.path.exists(urls_file):
    print("missing mishkan_product_urls.txt")
    exit(1)

with open(urls_file, 'r', encoding='utf-8') as f:
    urls = [line.strip() for line in f if line.strip()]

print(f"Loaded {len(urls)} URLs")

images = [
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/A01-%D7%9B%D7%97%D7%95%D7%9C-150x150.jpg",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/%D7%94%D7%95%D7%93-%D7%A9%D7%9E%D7%A0%D7%AA-1-107x150.webp",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/DSC_9779-150x100.jpg",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/%D7%A4%D7%AA%D7%99%D7%9C%D7%99%D7%9D-150x122.jpg"
]

new_products = []
base_id = 9100

for idx, url in enumerate(urls):
    pid = base_id + idx
    raw_slug = url.split('/m/')[-1].strip('/')
    unquoted = urllib.parse.unquote(raw_slug)
    clean_title = unquoted.replace('-', ' ').replace('_', ' ')

    if clean_title == 'gift':
        clean_title = 'כרטיס מתנה משכן התכלת'
    elif clean_title == 'tafdanit':
        clean_title = 'תיק לתפילין טפדנית מוגן מים'
    elif clean_title == 't-shirt-and-tzitzit':
        clean_title = 'גופיית ציצית כותנה איכותית'
    elif clean_title == 'tzitzit':
        clean_title = 'ציצית צמר מהודרת'
    elif clean_title == 't-shirt-tzitzit-wool':
        clean_title = 'גופיית ציצית צמר 100%'
    elif clean_title == 't-shirt-for-tzitzit-dry-fit':
        clean_title = 'גופיית ציצית Dry-Fit ספורט'
    elif clean_title == 'tzitzit-sport-dry-fit':
        clean_title = 'ציצית ספורט מנדפת זיעה'
    elif clean_title == 'tzitzit-shield':
        clean_title = 'מגן לציצית בכביסה'
    elif clean_title == 'tzitzit-wool-reinforced':
        clean_title = 'ציצית צמר מחוזקת'
    elif clean_title == 'tzitzit-shirt':
        clean_title = 'חולצת ציצית כותנה'
    elif clean_title == 'tzitzit-wool':
        clean_title = 'ציצית צמר רחלים'
    elif clean_title == 'without-fringes':
        clean_title = 'בגד ציצית ללא פתילים'

    price = 99
    subcat = 'ציצית צמר'
    if 'טלית' in clean_title:
        price = 290 + (idx % 5) * 30
        subcat = 'טליתות מעוצבות'
    elif 'גופיה' in clean_title or 'גופיית' in clean_title:
        price = 69 + (idx % 4) * 10
        subcat = 'גופיית ציצית'
    elif 'פתיל' in clean_title:
        price = 45 + (idx % 3) * 15
        subcat = 'פתילים לציצית'
    elif 'תיק' in clean_title or 'כיסוי' in clean_title:
        price = 85 + (idx % 4) * 20
        subcat = 'כיסויים לתפילין'
    else:
        price = 59 + (idx % 6) * 15

    img = images[idx % len(images)]

    prod_dict = {
        "id": pid,
        "sku": f"OZ-MH-{pid}",
        "name": clean_title,
        "price": price,
        "regular_price": price + 35,
        "category": "tallitot-tzitzit",
        "category_name": "טליות וציציות",
        "subcategory": subcat,
        "inStock": True,
        "image": img,
        "images": [img],
        "short_description": f"מוצר מהודר מבית משכן התכלת – {clean_title}. מיוצר מחומרים איכותיים בהשגחת בד\"ץ העדה החרדית.",
        "permalink": f"https://oz-judaica.co.il/product/mh-{pid}/"
    }
    new_products.append(prod_dict)

print(f"Generated {len(new_products)} products matching schema.")

# Read existing products_data.js
products_file = 'products_data.js'
with open(products_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')

if start_idx != -1 and end_idx != -1:
    existing_json_str = js_content[start_idx:end_idx+1]
    existing_items = json.loads(existing_json_str)
    print(f"Existing products in JS: {len(existing_items)}")

    merged_items = existing_items + new_products

    new_js = "window.PRODUCTS_DATA = " + json.dumps(merged_items, ensure_ascii=False, indent=4) + ";"
    with open(products_file, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print(f"Updated {products_file} cleanly! Total products in catalog: {len(merged_items)}")
