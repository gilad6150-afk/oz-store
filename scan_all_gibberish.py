import os
import re

dir_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"
live_path = r"C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html"

target_files = []
for root, dirs, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.html') or f.endswith('.js'):
            target_files.append(os.path.join(root, f))

target_files.append(live_path)

mojibake_pattern = re.compile(r'[׳×ײÃ¿½âï]')

found = False
for path in target_files:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
        lines = fp.readlines()
        for idx, line in enumerate(lines):
            if mojibake_pattern.search(line):
                found = True
                print(f"MOJIBAKE in {os.path.basename(path)} line {idx+1}: {line.strip()[:100]}")

if not found:
    print("NO MOJIBAKE FOUND WITH SIMPLE PATTERN! Checking for weird unicode sequences...")
