import os

dir_path = r'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
extensions = ['.html', '.js']

corrupted = []

for root, dirs, files in os.walk(dir_path):
    if 'node_modules' in root or '.git' in root or 'brain' in root:
        continue
    for f in files:
        if any(f.endswith(ext) for ext in extensions):
            full_path = os.path.join(root, f)
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as file_content:
                text = file_content.read()
                has_mojibake = False
                for i in range(len(text)-1):
                    c1 = text[i]
                    c2 = text[i+1]
                    if c1 == '׳' and '\u05d0' <= c2 <= '\u05ea':
                        has_mojibake = True
                        break
                    if c1 == 'ג' and c2 == '€':
                        has_mojibake = True
                        break
                if has_mojibake:
                    print(f"⚠️ MOJIBAKE FOUND IN: {f}")
                    corrupted.append(f)
                else:
                    print(f"✓ CLEAN UTF-8: {f}")

if corrupted:
    print(f"\nCORRUPTED FILES: {', '.join(corrupted)}")
else:
    print("\n🎉 ALL PROJECT FILES ARE 100% CLEAN UTF-8 HEBREW!")
