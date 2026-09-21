import os

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"

bad_patterns = [
    "׳", "ג†", "ג—", "ג€", "Ã", "", "×", "ֿ", "װ", "××", "׳§", "׳¨", "׳×", "׳₪"
]

files_with_issues = []

for root, dirs, files in os.walk(store_dir):
    if ".git" in root or "node_modules" in root:
        continue
    for f in files:
        if f.endswith(".html") or f.endswith(".js") or f.endswith(".ps1") or f.endswith(".xml"):
            file_path = os.path.join(root, f)
            try:
                with open(file_path, "r", encoding="utf-8") as file_obj:
                    content = file_obj.read()
                    found = []
                    for pattern in bad_patterns:
                        if pattern in content:
                            found.append(pattern)
                    if found:
                        files_with_issues.append((file_path, found))
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

print("=== GIBBERISH / MOJIBAKE AUDIT REPORT ===")
if not files_with_issues:
    print("NO GIBBERISH FOUND IN UTF-8 FILES")
else:
    for fp, patterns in files_with_issues:
        print(f"BAD ENCODING/MOJIBAKE DETECTED IN: {fp} (Patterns: {patterns})")
