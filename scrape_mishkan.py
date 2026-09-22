import urllib.request
import re
import json
import os
import ssl

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

urls = [
    'https://mishkan-hatchelet.co.il/c/tzitzit/',
    'https://mishkan-hatchelet.co.il/c/prayer-shawls/'
]

all_product_urls = set()

for category_url in urls:
    print(f"Fetching category: {category_url}")
    req = urllib.request.Request(category_url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ssl_context) as response:
            html = response.read().decode('utf-8')
            # Look for product links
            links = set(re.findall(r'href=["\'](https?://mishkan-hatchelet\.co\.il/(?:product|p|product-category)/[^"\']+)["\']', html))
            print(f"  Found {len(links)} links matching pattern")
            # Also catch relative links or any href containing product
            all_hrefs = re.findall(r'href=["\']([^"\']+)["\']', html)
            prod_hrefs = [h for h in all_hrefs if '/product/' in h or '/p/' in h]
            print(f"  Found {len(prod_hrefs)} prod_hrefs total")
            for h in prod_hrefs:
                if not h.startswith('http'):
                    h = 'https://mishkan-hatchelet.co.il' + h
                all_product_urls.add(h)
    except Exception as e:
        print(f"Error: {e}")

print(f"\nTotal unique product URLs discovered: {len(all_product_urls)}")
for u in list(all_product_urls)[:15]:
    print(" -", u)
