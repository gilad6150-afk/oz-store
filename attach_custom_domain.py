import urllib.request
import json
import os

zip_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\site_deploy.zip"
with open(zip_path, "rb") as f:
    zip_data = f.read()

print(f"Loaded zip file: {len(zip_data)} bytes")

# 1. Create site on Netlify
req = urllib.request.Request(
    "https://api.netlify.com/api/v1/sites",
    data=zip_data,
    headers={"Content-Type": "application/zip", "User-Agent": "Antigravity/1.0"},
    method="POST"
)
try:
    res = urllib.request.urlopen(req)
    site_info = json.loads(res.read().decode("utf-8"))
    site_id = site_info["site_id"]
    print("Created Site ID:", site_id)
    print("Default Netlify URL:", site_info.get("ssl_url"))

    # 2. Attach custom domain oz-judaica.co.il
    update_payload = json.dumps({
        "custom_domain": "oz-judaica.co.il",
        "domain_aliases": ["www.oz-judaica.co.il"]
    }).encode("utf-8")

    update_req = urllib.request.Request(
        f"https://api.netlify.com/api/v1/sites/{site_id}",
        data=update_payload,
        headers={"Content-Type": "application/json", "User-Agent": "Antigravity/1.0"},
        method="PUT"
    )
    update_res = urllib.request.urlopen(update_req)
    updated_info = json.loads(update_res.read().decode("utf-8"))
    print("=== SUCCESS ===")
    print("Custom Domain attached to Netlify:", updated_info.get("custom_domain"))
    print("DNS Name Servers needed for Netlify:")
    print(updated_info.get("dns_zone_id") or "Standard Netlify NS: dns1.p01.nsone.net ...")

except Exception as e:
    print("Netlify API Error:", e)
