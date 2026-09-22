import json

with open('products_data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')
json_str = js_content[start_idx:end_idx+1]

products = json.loads(json_str)

tree = {}
for p in products:
    cat_key = p.get('category', 'uncategorized')
    cat_name = p.get('category_name', cat_key)
    sub = p.get('subcategory') or 'ללא תת-קטגוריה'
    
    cat_full = f"{cat_name} (מפתח: '{cat_key}')"
    if cat_full not in tree:
        tree[cat_full] = {}
    
    tree[cat_full][sub] = tree[cat_full].get(sub, 0) + 1

print(f"סה\"כ מוצרים בחנות: {len(products)}\n")
for cat, subs in tree.items():
    cat_total = sum(subs.values())
    print(f"📂 {cat} - סה\"כ {cat_total} מוצרים:")
    for sub, count in sorted(subs.items(), key=lambda x: x[1], reverse=True):
        print(f"   └── 🏷️ {sub} ({count} מוצרים)")
    print()
