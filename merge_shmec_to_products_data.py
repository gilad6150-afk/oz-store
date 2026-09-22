import json
import os

shmec_file = 'shmec_catalog_scraped.json'
products_file = 'products_data.js'

if not os.path.exists(shmec_file):
    print("missing shmec_catalog_scraped.json")
    exit(1)

with open(shmec_file, 'r', encoding='utf-8') as f:
    shmec_items = json.load(f)

print(f"Loaded {len(shmec_items)} Shmec items")

with open(products_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')

if start_idx != -1 and end_idx != -1:
    existing_json_str = js_content[start_idx:end_idx+1]
    existing_items = json.loads(existing_json_str)
    print(f"Existing items before Shmec merge: {len(existing_items)}")

    # Check if shmec items already exist to avoid duplicate merging
    existing_skus = set(item.get('sku') for item in existing_items)
    items_to_add = [item for item in shmec_items if item.get('sku') not in existing_skus]

    merged = existing_items + items_to_add
    print(f"Total merged products: {len(merged)}")

    new_js = "window.PRODUCTS_DATA = " + json.dumps(merged, ensure_ascii=False, indent=4) + ";"
    with open(products_file, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print(f"Successfully updated {products_file} with {len(merged)} products!")
