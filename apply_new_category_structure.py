import json, re

print("==========================================================")
print("APPLYING NEW CATEGORY & SUBCATEGORY STRUCTURE TO ALL 613 PRODUCTS")
print("==========================================================")

with open('products_data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')
json_str = js_content[start_idx:end_idx+1]
products = json.loads(json_str)

updated_count = 0

for p in products:
    cat = p.get('category', '')
    name = p.get('name', '')
    sub = p.get('subcategory', '')
    sku = p.get('sku', '')
    id_val = p.get('id', 0)

    # 1. טליות וציציות (tallitot-tzitzit)
    if cat == 'tallitot-tzitzit' or 'טלית' in name or 'ציצית' in name:
        p['category'] = 'tallitot-tzitzit'
        p['category_name'] = 'טליות וציציות'
        if 'ציצית' in name or 'גופיית' in name or 'Dry-Fit' in name or 'ציציות' in sub:
            p['subcategory'] = 'ציציות'
        else:
            p['subcategory'] = 'טליתות'
        updated_count += 1
        continue

    # 2. מתנות ויודאיקה (gifts) - includes Rabbinical pictures, Shmec perfumes, Wallets, Judaica gifts
    if cat in ['gifts', 'wallets'] or 'ארנק' in name or 'תמונה' in name or 'רב' in name or 'בשמים' in name or sku.startswith('OZ-SHM-'):
        p['category'] = 'gifts'
        p['category_name'] = 'מתנות ויודאיקה'
        if sku.startswith('OZ-SHM-') or 'בשמים' in name or 'להבדלה' in name or 'ריחות' in sub:
            p['subcategory'] = 'בשמים וריחות להבדלה'
        elif cat == 'wallets' or 'ארנק' in name:
            p['subcategory'] = 'ארנקים לגבר'
        elif 'תמונה' in name or 'קנבס' in name or 'זכוכית' in name or 'דיוקן' in name or 'מרן' in name or 'הרב' in name or id_val >= 10000:
            p['subcategory'] = 'תמונות זכוכית וקנבס'
        else:
            p['subcategory'] = 'מארזים ומתנות יודאיקה'
        updated_count += 1
        continue

    # 3. תיקים לטלית ותפילין (tefillin-bags)
    if cat == 'tefillin-bags' or 'תיק' in name or 'כיסוי' in name or 'תפדנית' in name:
        p['category'] = 'tefillin-bags'
        p['category_name'] = 'תיקים לטלית ותפילין'
        if 'תפדנית' in name or 'דק קטן' in name or ('לתפילין' in name and 'טלית' not in name):
            p['subcategory'] = 'תיקים לתפילין'
        else:
            p['subcategory'] = 'כיסוי טלית ותפילין'
        updated_count += 1
        continue

    # 4. ספרי קודש (books)
    if cat == 'books' or 'ספר' in name or 'סידור' in name or 'תהילים' in name or 'חומש' in name:
        p['category'] = 'books'
        p['category_name'] = 'ספרי קודש'
        p['subcategory'] = 'ספרי קודש וסידורים'
        updated_count += 1
        continue

    # 5. תשמישי קדושה וסת"ם (stam / mezuzot)
    if cat in ['stam', 'mezuzot'] or 'מזוזה' in name or 'תפילין' in name or 'תורה' in name:
        p['category'] = 'stam'
        p['category_name'] = 'תשמישי קדושה וסת"ם'
        if 'אלומיניום' in name or 'מוברש' in name:
            p['subcategory'] = 'בתי מזוזה מאלומיניום'
        elif 'אפוקסי' in name or 'יציקה' in name:
            p['subcategory'] = 'בתי מזוזה מאפוקסי'
        elif 'פלסטיק' in name or 'שקוף' in name:
            p['subcategory'] = 'בתי מזוזה מפלסטיק'
        elif 'קלף' in name and 'מזוז' in name:
            p['subcategory'] = 'מזוזות'
        elif 'מזוז' in name:
            p['subcategory'] = 'בתי מזוזה'
        elif 'תורה' in name:
            p['subcategory'] = 'ספר תורה'
        else:
            p['subcategory'] = 'תפילין'
        updated_count += 1
        continue

print(f"Successfully processed {updated_count} products.")

new_js = "window.PRODUCTS_DATA = " + json.dumps(products, ensure_ascii=False, indent=4) + ";"
with open('products_data.js', 'w', encoding='utf-8') as f:
    f.write(new_js)

print("Saved updated products_data.js!")
