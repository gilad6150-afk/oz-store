import os

dir_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"
target_files = ["clean_render.js", "pages_code.js", "index.html", "shop_layout.html", "modals.html"]

for fname in target_files:
    fpath = os.path.join(dir_path, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, "r", encoding="utf-8", errors="replace") as f:
        text = f.read()
    
    mojibake = []
    if "\u05f3" in text or "ג€" in text or "׳’" in text or "Ã—" in text:
        mojibake.append("Mojibake markers found")
    
    if mojibake:
        print(f"FAILED: {fname} -> {mojibake}")
    else:
        print(f"CLEAN: {fname}")
