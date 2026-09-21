import os
import json
import xml.etree.ElementTree as ET
import xml.dom.minidom

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"
products_js_path = os.path.join(store_dir, "products_data.js")

with open(products_js_path, "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("[")
end_idx = content.rfind("]")

json_str = content[start_idx:end_idx+1]
products = json.loads(json_str)

rss = ET.Element("rss", version="2.0")
rss.set("xmlns:g", "http://base.google.com/ns/1.0")

channel = ET.SubElement(rss, "channel")

title_el = ET.SubElement(channel, "title")
title_el.text = "מכון עוז - Google Merchant Center Product Feed"

link_el = ET.SubElement(channel, "link")
link_el.text = "https://oz-judaica.co.il"

desc_el = ET.SubElement(channel, "description")
desc_el.text = "פיד מוצרים רשמי עבור Google Shopping והופעה במנוע החיפוש של גוגל"

for p in products:
    item = ET.SubElement(channel, "item")
    
    sku_val = p.get("sku") or f"OZ-{p['id']}"
    g_id = ET.SubElement(item, "{http://base.google.com/ns/1.0}id")
    g_id.text = str(sku_val)
    
    item_title = ET.SubElement(item, "title")
    item_title.text = p.get("name", "")
    
    item_desc = ET.SubElement(item, "description")
    item_desc.text = p.get("short_description", p.get("name", ""))
    
    item_link = ET.SubElement(item, "link")
    item_link.text = f"https://oz-judaica.co.il/#product-{p['id']}"
    
    g_img = ET.SubElement(item, "{http://base.google.com/ns/1.0}image_link")
    g_img.text = p.get("image", "")
    
    g_cond = ET.SubElement(item, "{http://base.google.com/ns/1.0}condition")
    g_cond.text = "new"
    
    g_avail = ET.SubElement(item, "{http://base.google.com/ns/1.0}availability")
    g_avail.text = "in_stock" if p.get("inStock", True) else "out_of_stock"
    
    g_price = ET.SubElement(item, "{http://base.google.com/ns/1.0}price")
    g_price.text = f"{p.get('price', 0)} ILS"
    
    g_brand = ET.SubElement(item, "{http://base.google.com/ns/1.0}brand")
    g_brand.text = "מכון עוז"
    
    g_prod_type = ET.SubElement(item, "{http://base.google.com/ns/1.0}product_type")
    g_prod_type.text = p.get("category_name", "תשמישי קדושה ויודאיקה")
    
    g_ident = ET.SubElement(item, "{http://base.google.com/ns/1.0}identifier_exists")
    g_ident.text = "no"

xml_str = ET.tostring(rss, encoding="utf-8")
dom = xml.dom.minidom.parseString(xml_str)
pretty_xml = dom.toprettyxml(indent="  ", encoding="utf-8")

feed_path = os.path.join(store_dir, "google_merchant_feed.xml")
with open(feed_path, "wb") as f:
    f.write(pretty_xml)

print(f"✅ Successfully generated google_merchant_feed.xml with {len(products)} products in clean UTF-8!")
