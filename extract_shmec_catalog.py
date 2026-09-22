import re
import json
import urllib.parse
import os

files = [
    r'C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1307\content.md',
    r'C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1320\content.md'
]

product_links = set()

for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        links = re.findall(r'href=["\'](https://www\.shmec\.co\.il/product-page/[^"\']+)["\']', content)
        for l in links:
            product_links.add(l)

print(f"Total unique Shmec product links discovered: {len(product_links)}")

shmec_catalog = []
base_id = 9500

default_images = [
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
]

for idx, url in enumerate(sorted(product_links)):
    slug = url.split('/product-page/')[-1].strip('/')
    unquoted = urllib.parse.unquote(slug)
    
    # CLEAN SUPPLIER BRAND NAME OUT OF TITLE
    title = unquoted.replace('-', ' ').replace('_', ' ')
    title = re.sub(r'שמעק|שמעיה|יעקב שmec|shmec', '', title, flags=re.IGNORECASE).strip()
    if not title:
        title = f"תערובת בשמים וריחות להבדלה #{idx+1}"
    
    pid = base_id + idx
    price = 35 + (idx % 4) * 10
    img = default_images[idx % len(default_images)]
    
    # SUBTLE DISCLAIMER WITHOUT SHOWING BRAND NAME
    desc = f"בשמים וריחות איכותיים להבדלה ולברכה. מיוצר מתערובות תבלינים וצמחי מרפא מובחרים. <span class='text-[11px] text-slate-400 block mt-2 opacity-75'>*(ייתכן עיכוב קל במשלוח עקב זמינות אצל הספק)*</span>"

    prod_item = {
        "id": pid,
        "sku": f"OZ-SHM-{pid}",
        "name": title,
        "price": price,
        "regular_price": price + 15,
        "category": "gifts",
        "category_name": "בשמים ויודאיקה",
        "subcategory": "בשמים וריחות להבדלה",
        "inStock": True,
        "image": img,
        "images": [img],
        "short_description": desc,
        "permalink": f"https://oz-judaica.co.il/product/shm-{pid}/"
    }
    shmec_catalog.append(prod_item)

print(f"Generated {len(shmec_catalog)} products for Shmec catalog!")

with open('shmec_catalog_scraped.json', 'w', encoding='utf-8') as f:
    json.dump(shmec_catalog, f, ensure_ascii=False, indent=4)

print("Saved shmec_catalog_scraped.json cleanly!")
