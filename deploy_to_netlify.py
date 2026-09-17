import os
import zipfile
import json
import urllib.request

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"
zip_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\site_deploy.zip"

# Create clean ZIP of public site assets
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add index.html as root index.html
    zipf.write(os.path.join(store_dir, "index.html"), "index.html")
    
    # Add public folder if exists
    public_dir = os.path.join(store_dir, "public")
    if os.path.exists(public_dir):
        for root, dirs, files in os.walk(public_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, store_dir)
                zipf.write(full_path, rel_path)

print(f"Zip created successfully: {os.path.getsize(zip_path)} bytes")

# Deploy zip to Netlify API endpoint (Anonymous site creation)
url = "https://api.netlify.com/api/v1/sites"
headers = {
    "Content-Type": "application/zip",
    "User-Agent": "AntigravityDeployEngine/1.0"
}

with open(zip_path, "rb") as f:
    zip_data = f.read()

req = urllib.request.Request(url, data=zip_data, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode('utf-8')
        res_json = json.loads(res_data)
        site_id = res_json.get("site_id")
        subdomain = res_json.get("subdomain")
        ssl_url = res_json.get("ssl_url") or res_json.get("url")
        admin_url = res_json.get("admin_url")
        
        print("=== DEPLOYMENT SUCCESSFUL ===")
        print(f"Live URL: {ssl_url}")
        print(f"Subdomain: {subdomain}")
        print(f"Admin URL: {admin_url}")
        print(f"Site ID: {site_id}")
        
        # Save deployment details to json file
        deploy_info = {
            "ssl_url": ssl_url,
            "subdomain": subdomain,
            "admin_url": admin_url,
            "site_id": site_id,
            "timestamp": "2026-09-17T16:17:00+03:00"
        }
        with open(os.path.join(store_dir, "deploy_info.json"), "w", encoding="utf-8") as out_f:
            json.dump(deploy_info, out_f, indent=2, ensure_ascii=False)
            
except Exception as e:
    print(f"Deployment error: {e}")
