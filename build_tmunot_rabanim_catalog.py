import json
import urllib.parse
import os
import re

urls_file = 'tmunot_rabanim_urls.txt'
products_file = 'products_data.js'

if not os.path.exists(urls_file):
    print("missing tmunot_rabanim_urls.txt")
    exit(1)

with open(urls_file, 'r', encoding='utf-8') as f:
    urls = [line.strip() for line in f if line.strip()]

print(f"Loaded {len(urls)} Tmunot Rabanim URLs")

# High quality sample images for Rabbinical Art & Framed Judaica
art_images = [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80"
]

# Ambient lifestyle background variations (transformed ambient surroundings)
ambient_gallery = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
]

with open(products_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')

existing_items = []
if start_idx != -1 and end_idx != -1:
    existing_items = json.loads(js_content[start_idx:end_idx+1])

print(f"Existing catalog products before Supplier 2 merge: {len(existing_items)}")

base_id = 9600
new_items = []

for idx, url in enumerate(urls):
    raw_slug = url.split('/product/')[-1].strip('/')
    unquoted = urllib.parse.unquote(raw_slug)

    # REMOVE SUPPLIER BRAND NAME ("תמונות רבנים", "tmunotrabanim")
    clean_title = unquoted.replace('-', ' ').replace('_', ' ')
    clean_title = re.sub(r'תמונות רבנים|תמונותרבנים|tmunotrabanim|tmunot rabanim', '', clean_title, flags=re.IGNORECASE).strip()
    clean_title = re.sub(r'\s+[a-z0-9]{1,4}-\d{1,4}$', '', clean_title, flags=re.IGNORECASE).strip()

    if not clean_title:
        clean_title = f"תמונת קודש מרהיבה #{idx+1}"

    pid = base_id + idx
    price = 149 + (idx % 6) * 30
    main_img = art_images[idx % len(art_images)]
    gallery_img = ambient_gallery[idx % len(ambient_gallery)]

    # SUBTLE DISCLAIMER IN SMALL TEXT
    desc = f"תמונת קודש יוקרתית מודפסת ברזולוציה גבוהה (HD) על זכוכית אקרילית/קנבס יוקרתי. מגיעה מוכנה לתלייה. <span class='text-[11px] text-slate-400 block mt-2 opacity-75'>*(ייתכן עיכוב קל במשלוח עקב זמינות אצל הספק)*</span>"

    prod_dict = {
        "id": pid,
        "sku": f"OZ-TR-{pid}",
        "name": clean_title,
        "price": price,
        "regular_price": price + 40,
        "category": "gifts",
        "category_name": "תמונות קודש ויודאיקה",
        "subcategory": "תמונות זכוכית וקנבס",
        "inStock": True,
        "image": main_img,
        "images": [main_img, gallery_img],
        "short_description": desc,
        "permalink": f"https://oz-judaica.co.il/product/tr-{pid}/"
    }
    new_items.append(prod_dict)

print(f"Generated {len(new_items)} Tmunot Rabanim products without supplier brand name.")

merged = existing_items + new_items
new_js = "window.PRODUCTS_DATA = " + json.dumps(merged, ensure_ascii=False, indent=4) + ";"

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(new_js)

print(f"Successfully merged Supplier 2! Total catalog products: {len(merged)}")
