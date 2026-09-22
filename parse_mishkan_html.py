import re
import json

files = [
    r'C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1056\content.md',
    r'C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1058\content.md'
]

for fpath in files:
    print(f"\n=================== File: {fpath} ===================")
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all hrefs
    hrefs = set(re.findall(r'href=["\']([^"\']+)["\']', content))
    print(f"Total hrefs: {len(hrefs)}")
    
    # Print hrefs containing mishkan-hatchelet
    site_hrefs = [h for h in hrefs if 'mishkan-hatchelet.co.il' in h or h.startswith('/')]
    print(f"Site hrefs: {len(site_hrefs)}")
    for h in sorted(site_hrefs)[:40]:
        print(" -", h)
