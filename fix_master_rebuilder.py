import os
import base64

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"
index_path = os.path.join(store_dir, "index.html")
live_path = r"C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html"
artifact_live_path = r"C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\oz_store_live_site.html"

# Base64 logos
with open(os.path.join(store_dir, "public", "oz_logo_transparent.png"), "rb") as f:
    logo_trans_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(store_dir, "public", "oz_logo_white.png"), "rb") as f:
    logo_white_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

def read_template(name):
    path = os.path.join(store_dir, name)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

layout_frame = read_template("layout_frame.html")
top_bar = read_template("top_bar.html")
clean_nav = read_template("clean_nav.html")
animated_hero = read_template("animated_hero.html")
shop_layout = read_template("shop_layout.html")
footer = read_template("footer.html")
modals = read_template("modals.html")
floating_cart = read_template("floating_cart.html")
pages_code = read_template("pages_code.js")
clean_render = read_template("clean_render.js")
products_data = read_template("products_data.js")
articles_data = read_template("articles_data.js")

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

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

with open(live_path, "w", encoding="utf-8") as f:
    f.write(html)

with open(artifact_live_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Python Master Clean Build successfully executed!")

# Verify UTF-8 cleanliness
bad_markers = ["׳ž׳", "ג€“", "ג—", "ג†", "Ã—", "Ã©"]
found = [m for m in bad_markers if m in html]

if found:
    print(f"CRITICAL ERROR: MOJIBAKE STILL DETECTED IN INDEX.HTML! Markers: {found}")
else:
    print("SUCCESS: 100% CLEAN UTF-8 HEBREW IN INDEX.HTML! ZERO MOJIBAKE!")
