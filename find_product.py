import json
import re

file_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Find product block or search for any lines matching
for line_idx, line in enumerate(text.splitlines()):
    if any(k in line for k in ["סקאי", "כוונת", "מחזור", "כרכים", "50"]):
        print(f"Line {line_idx+1}: {line}")
