import os
import base64

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"
layout_path = os.path.join(store_dir, "layout_frame.html")

with open(layout_path, "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

clean_lines = []
for line in lines:
    if "׳" in line or "ג€" in line:
        continue
    clean_lines.append(line)

new_content = "".join(clean_lines)

meta_block = '''    <link rel="canonical" href="https://oz-judaica.co.il/" />
    <meta name="keywords" content="מתנות לגבר, כיסוי לתפילין, תיק לתפילין, מתנה לבר מצווה, מתנה לחתן, תפילין מהודרות, תפילין לבר מצווה, קלף מזוזה כשר, בתי מזוזה מעוצבים, טלית צמר טהור, טלית לחתן, ציצית עבודת יד, ארנק עור יוקרתי לגבר, סט קידוש והבדלה, תשמישי קדושה משלוח לכל הארץ, מכון עוז">
    <meta name="description" content="מכון עוז – חנות תשמישי קדושה, יודאיקה וארנקי עור פרימיום עם משלוחים מהירים לכל חלקי הארץ (1-3 ימי עסקים). מתנות לגבר, כיסוי לתפילין, תפילין מהודרות, מזוזות כשרות וסטים לבר מצווה ולחתן.">\n'''

if "canonical" not in new_content:
    new_content = new_content.replace('<!-- OFFICIAL BRAND FAVICON -->', meta_block + '    <!-- OFFICIAL BRAND FAVICON -->')

with open(layout_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("layout_frame.html cleaned successfully!")

# Rebuild index.html
with open(os.path.join(store_dir, "public", "oz_logo_transparent.png"), "rb") as f:
    logo_trans_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(store_dir, "public", "oz_logo_white.png"), "rb") as f:
    logo_white_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

def read_tmpl(name):
    with open(os.path.join(store_dir, name), "r", encoding="utf-8") as f:
        return f.read()

layout_frame = read_tmpl("layout_frame.html")
top_bar = read_tmpl("top_bar.html")
clean_nav = read_tmpl("clean_nav.html")
animated_hero = read_tmpl("animated_hero.html")
shop_layout = read_tmpl("shop_layout.html")
footer = read_tmpl("footer.html")
modals = read_tmpl("modals.html")
floating_cart = read_tmpl("floating_cart.html")
pages_code = read_tmpl("pages_code.js")
clean_render = read_tmpl("clean_render.js")
products_data = read_tmpl("products_data.js")
articles_data = read_tmpl("articles_data.js")

clean_nav = clean_nav.replace('public/oz_logo_transparent.png', logo_trans_b64)
footer = footer.replace('public/oz_logo_white.png', logo_white_b64)

html = layout_frame
html = html.replace('/* TOP_BAR_PLACEHOLDER */', top_bar)
html = html.replace('/* CLEAN_NAV_PLACEHOLDER */', clean_nav)
html = html.replace('/* ANIMATED_HERO_PLACEHOLDER */', animated_hero)
html = html.replace('/* SHOP_LAYOUT_PLACEHOLDER */', shop_layout)
html = html.replace('/* FOOTER_PLACEHOLDER */', footer)
html = html.replace('/* FLOATING_CART_PLACEHOLDER */', floating_cart)
html = html.replace('/* MODALS_PLACEHOLDER */', modals)
html = html.replace('/* PRODUCTS_DATA_PLACEHOLDER */', products_data)
html = html.replace('/* ARTICLES_DATA_PLACEHOLDER */', articles_data)
html = html.replace('/* PAGES_CODE_PLACEHOLDER */', pages_code)
html = html.replace('/* CLEAN_RENDER_PLACEHOLDER */', clean_render)

index_path = os.path.join(store_dir, "index.html")
live_path1 = r"C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html"
live_path2 = r"C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\oz_store_live_site.html"

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)
with open(live_path1, "w", encoding="utf-8") as f:
    f.write(html)
with open(live_path2, "w", encoding="utf-8") as f:
    f.write(html)

print("Python Master Clean Rebuild executed successfully!")
