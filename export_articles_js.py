import os
import sys

# Import update_20_articles module
sys.path.append(os.path.dirname(__file__))
import update_20_articles

articles_content = update_20_articles.articles_db

output_file = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\articles_data.js"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(articles_content)

print(f"Successfully wrote articles_data.js with length: {len(articles_content)} bytes")
