import re
import json

path1 = r"C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.system_generated\steps\6452\content.md"
path2 = r"C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.system_generated\steps\6456\content.md"

def extract_products(filepath, category_name):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    # Find all product links or product items
    # Typically <a href="https://mishkan-hatchelet.co.il/p/..." or class="product"
    links = re.findall(r'href="(https://mishkan-hatchelet\.co\.il/p/[^"]+)"', html)
    links = list(set(links))
    print(f"Found {len(links)} product links in {category_name}")
    return links

tzitzit_links = extract_products(path1, "ציצית")
tallit_links = extract_products(path2, "טלית")

with open(r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\extracted_links.json", "w", encoding="utf-8") as f:
    json.dump({"tzitzit": tzitzit_links, "tallit": tallit_links}, f, ensure_ascii=False, indent=2)
