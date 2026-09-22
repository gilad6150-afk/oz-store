import json
import urllib.parse
import os
import re

shmec_urls = [
    "https://www.shmec.co.il/product-page/ליקר-בננה",
    "https://www.shmec.co.il/product-page/פאסטיס",
    "https://www.shmec.co.il/product-page/פפרמינט",
    "https://www.shmec.co.il/product-page/מנטה-יום-כיפור",
    "https://www.shmec.co.il/product-page/מנטה-מרוקו",
    "https://www.shmec.co.il/product-page/אקסטרא-מרוקו",
    "https://www.shmec.co.il/product-page/מנטה-ירוק",
    "https://www.shmec.co.il/product-page/מנטה-שחור-חריף",
    "https://www.shmec.co.il/product-page/רוזמרין",
    "https://www.shmec.co.il/product-page/אבנים-טובות",
    "https://www.shmec.co.il/product-page/קול-חזן",
    "https://www.shmec.co.il/product-page/שפרייזן",
    "https://www.shmec.co.il/product-page/רחמסטריבקה",
    "https://www.shmec.co.il/product-page/בורדוגן",
    "https://www.shmec.co.il/product-page/דאבל-אספרסו",
    "https://www.shmec.co.il/product-page/גינג-ר-מרוקאי",
    "https://www.shmec.co.il/product-page/זהר-טריפולטאי",
    "https://www.shmec.co.il/product-page/מאחייה-אניס",
    "https://www.shmec.co.il/product-page/אקליפטוס-שחור",
    "https://www.shmec.co.il/product-page/הדס-אתרוג",
    "https://www.shmec.co.il/product-page/ציפורן-טהור",
    "https://www.shmec.co.il/product-page/תערובת-בשמים-למוצאי-שבת",
    "https://www.shmec.co.il/product-page/עשבי-בשמים-ארץ-ישראלי"
]

sample_images = [
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
]

products_file = 'products_data.js'
with open(products_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')

existing_items = []
if start_idx != -1 and end_idx != -1:
    existing_items = json.loads(js_content[start_idx:end_idx+1])

print(f"Existing store products: {len(existing_items)}")

base_id = 9500
new_items = []

for i, url in enumerate(shmec_urls):
    raw_slug = url.split('/product-page/')[-1].strip('/')
    unquoted = urllib.parse.unquote(raw_slug)
    
    # REMOVE SUPPLIER BRAND NAME (שמעק / שמעיה / shmec)
    clean_title = unquoted.replace('-', ' ').replace('_', ' ')
    clean_title = re.sub(r'שמעק|שמעיה|shmec', '', clean_title, flags=re.IGNORECASE).strip()
    if not clean_title:
        clean_title = f"תערובת בשמים וריחות להבדלה #{i+1}"
    else:
        clean_title = f"בשמים להבדלה – {clean_title}"

    pid = base_id + i
    price = 35 + (i % 4) * 10
    img = sample_images[i % len(sample_images)]

    # SUBTLE DISCLAIMER IN SMALL OPAQUE TEXT
    desc = f"תערובת בשמים וניחוחות מובחרים להבדלה ולברכה. עשוי מעשבי ריח וצמחי מרפא טבעיים בהכשר מהודר. <span class='text-[11px] text-slate-400 block mt-2 opacity-75'>*(ייתכן עיכוב קל במשלוח עקב זמינות אצל הספק)*</span>"

    prod_dict = {
        "id": pid,
        "sku": f"OZ-SHM-{pid}",
        "name": clean_title,
        "price": price,
        "regular_price": price + 15,
        "category": "gifts",
        "category_name": "בשמים ויודאיקה",
        "subcategory": "בשמים וריחות להבדלה",
        "inStock": False,
        "image": img,
        "images": [img],
        "short_description": desc,
        "permalink": f"https://oz-judaica.co.il/product/shm-{pid}/"
    }
    new_items.append(prod_dict)

print(f"Generated {len(new_items)} Shmec products without brand name.")

merged = existing_items + new_items
new_js = "window.PRODUCTS_DATA = " + json.dumps(merged, ensure_ascii=False, indent=4) + ";"

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(new_js)

print(f"Successfully merged! Total catalog products: {len(merged)}")
