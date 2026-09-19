import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://oz-judaica.co.il?v=nocache123"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"})

try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
        html = res.read().decode("utf-8", errors="ignore")
        print("HTML length:", len(html))
        print("Has from-[#7C3AED] (Option 3):", "from-[#7C3AED]" in html)
        print("Has from-amber-400 (Old amber):", "from-amber-400" in html)
except Exception as e:
    print("Error:", e)
