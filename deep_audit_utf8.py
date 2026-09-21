import os, re

mojibake_patterns = [
    r'׳[א-ת]',
    r'נŸ',
    r'׳',
    r'Ã[¡-ÿ]',
    r'â'
]

files_to_check = [f for f in os.listdir('.') if f.endswith('.html') or f.endswith('.js')]

for fname in files_to_check:
    try:
        with open(fname, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for idx, line in enumerate(lines, 1):
                if any(re.search(pat, line) for pat in mojibake_patterns):
                    print(f"[{fname}:{idx}] {line.strip()[:100]}")
    except Exception as e:
        print(f"Error reading {fname}: {e}")
