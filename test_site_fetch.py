import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://oz-judaica.co.il",
    "http://oz-judaica.co.il",
    "https://oz-judaica.netlify.app"
]

for url in urls:
    print(f"\n--- Testing URL: {url} ---")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
            print("HTTP Status Code:", res.status)
            html = res.read().decode("utf-8", errors="ignore")
            print("Page HTML Size:", len(html), "bytes")
            match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
            if match:
                print("Site Title:", match.group(1))
    except Exception as e:
        print("Error fetching URL:", e)
