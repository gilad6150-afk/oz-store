import re
import urllib.parse

fpath = r'C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1346\content.md'

with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

hrefs = set(re.findall(r'href=["\']([^"\']+)["\']', content))
print(f"Total hrefs in Tmunot Rabanim home page: {len(hrefs)}")

# Filter product links
prod_pages = [h for h in hrefs if '/product/' in h or '/p/' in h or '/shop/' in h or 'product' in h]
print(f"\nProduct Pages ({len(prod_pages)}):")
for p in prod_pages[:20]:
    print(" -", p)

# Filter site links
site_hrefs = [h for h in hrefs if 'tmunotrabanim.com' in h or h.startswith('/')]
print(f"\nSite Hrefs ({len(site_hrefs)}):")
for h in sorted(site_hrefs)[:40]:
    print(" -", h)
