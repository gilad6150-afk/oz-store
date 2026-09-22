import json, re

with open('products_data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

start_idx = js_content.find('[')
end_idx = js_content.rfind(']')
json_str = js_content[start_idx:end_idx+1]
products = json.loads(json_str)

def get_new_cat_and_subcat(p):
    cat = p.get('category', '')
    name = p.get('name', '')
    sub = p.get('subcategory', '')
    sku = p.get('sku', '')
    id_val = p.get('id')

    # 1. טליות וציציות (tallitot-tzitzit)
    if cat == 'tallitot-tzitzit' or 'טלית' in name or 'ציצית' in name:
        new_cat = 'tallitot-tzitzit'
        new_cat_name = 'טליות וציציות'
        if 'ציצית' in name or 'ציציות' in sub or 'גופיית' in name or 'Dry-Fit' in name:
            new_sub = 'ציציות'
        else:
            new_sub = 'טליתות'
        return new_cat, new_cat_name, new_sub

    # 2. מתנות ויודאיקה (gifts) - includes Rabbinical pictures, Shmec perfumes, Wallets, Judaica gifts
    if cat in ['gifts', 'wallets'] or 'ארנק' in name or 'תמונה' in name or 'רב' in name or 'בשמים' in name or 'שמעק' in name:
        new_cat = 'gifts'
        new_cat_name = 'מתנות ויודאיקה'
        if sku.startswith('OZ-SHM-') or 'בשמים' in name or 'להבדלה' in name or 'ריחות' in sub:
            new_sub = 'בשמים וריחות להבדלה'
        elif cat == 'wallets' or 'ארנק' in name:
            new_sub = 'ארנקים לגבר'
        elif 'תמונה' in name or 'קנבס' in name or 'זכוכית' in name or 'דיוקן' in name or 'מרן' in name or 'הרב' in name or 'אדמו"ר' in name or id_val > 10000:
            new_sub = 'תמונות זכוכית וקנבס'
        else:
            new_sub = 'מארזים ומתנות יודאיקה'
        return new_cat, new_cat_name, new_sub

    # 3. תיקים לטלית ותפילין (tefillin-bags)
    if cat == 'tefillin-bags' or 'תיק' in name or 'כיסוי' in name or 'תפדנית' in name:
        new_cat = 'tefillin-bags'
        new_cat_name = 'תיקים לטלית ותפילין'
        if 'תפדנית' in name or 'רק לתפילין' in name or ('תפילין' in name and 'טלית' not in name):
            new_sub = 'תיקים לתפילין'
        else:
            new_sub = 'כיסוי טלית ותפילין'
        return new_cat, new_cat_name, new_sub

    # 4. ספרי קודש (books)
    if cat == 'books' or 'ספר' in name or 'סידור' in name or 'חומש' in name or 'תהילים' in name:
        new_cat = 'books'
        new_cat_name = 'ספרי קודש'
        new_sub = 'ספרי קודש וסידורים'
        return new_cat, new_cat_name, new_sub

    # 5. תשמישי קדושה וסת"ם (stam) & מזוזות (mezuzot)
    if cat in ['stam', 'mezuzot'] or 'מזוזה' in name or 'תפילין' in name or 'תורה' in name:
        new_cat = 'stam'
        new_cat_name = 'תשמישי קדושה וסת"ם'
        if 'אלומיניום' in name or 'מוברש' in name:
            new_sub = 'בתי מזוזה מאלומיניום'
        elif 'אפוקסי' in name or 'יציקה' in name:
            new_sub = 'בתי מזוזה מאפוקסי'
        elif 'פלסטיק' in name or 'שקוף' in name:
            new_sub = 'בתי מזוזה מפלסטיק'
        elif 'מזוזה' in name or 'בית מזוזה' in name or 'עץ' in name:
            new_sub = 'בתי מזוזה'
        elif 'קלף' in name:
            new_sub = 'מזוזות'
        elif 'תורה' in name:
            new_sub = 'ספר תורה'
        else:
            new_sub = 'תפילין'
        return new_cat, new_cat_name, new_sub

    return cat, p.get('category_name', cat), sub

stats = {}
for p in products:
    c, cn, s = get_new_cat_and_subcat(p)
    key = f"{cn} (category: '{c}')"
    if key not in stats: stats[key] = {}
    stats[key][s] = stats[key].get(s, 0) + 1

for cat, subs in stats.items():
    print(f"=== {cat} | Total: {sum(subs.values())} ===")
    for sub, count in subs.items():
        print(f"   ├── {sub}: {count}")
    print()
