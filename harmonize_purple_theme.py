import os
import re

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"

replacements = [
    # Top Bar & Hero Ambient & Accents
    (r"from-\[#0F172A\] via-\[#1E1B4B\] to-\[#0F172A\]", "from-[#2E1065] via-[#1E1B4B] to-[#2E1065]"),
    (r"text-amber-400", "text-purple-300"),
    (r"text-amber-300", "text-purple-200"),
    (r"bg-amber-400", "bg-purple-600"),
    (r"bg-amber-500", "bg-purple-600"),
    (r"border-amber-400", "border-purple-400"),
    (r"fill-amber-400", "fill-purple-300"),
    (r"hover:text-amber-300", "hover:text-purple-300"),
    (r"hover:text-amber-600", "hover:text-purple-600"),
    (r"hover:bg-amber-600", "hover:bg-purple-600"),
    (r"text-amber-900", "text-purple-900"),
    (r"text-amber-700", "text-purple-700"),
    (r"bg-amber-50", "bg-purple-50"),
    (r"border-amber-200", "border-purple-200"),
    
    # CTA Buttons Gradient
    (r"from-amber-400 via-amber-500 to-yellow-500", "from-[#7C3AED] via-[#6D28D9] to-[#581C87]"),
    (r"from-amber-400 via-amber-500 to-yellow-400", "from-purple-600 via-purple-700 to-indigo-900"),
    (r"from-amber-300 via-amber-200 to-yellow-400", "from-purple-200 via-white to-purple-300"),
    (r"hover:from-amber-300 hover:to-yellow-400", "hover:from-purple-500 hover:to-indigo-800"),
    (r"shadow-amber-500/20", "shadow-purple-600/30"),
    (r"text-slate-950", "text-white"),
    
    # Cart Badge
    (r"bg-amber-400 text-slate-950", "bg-purple-600 text-white"),
    (r"border-purple-900", "border-white"),
    
    # General Amber/Yellow/Gold Classes
    (r"\bamber-\b", "purple-"),
    (r"\byellow-\b", "purple-"),
    (r"\bgold-border\b", "border-purple-600")
]

files_to_update = [
    "top_bar.html",
    "clean_nav.html",
    "animated_hero.html",
    "shop_layout.html",
    "footer.html",
    "modals.html",
    "floating_cart.html",
    "clean_render.js",
    "pages_code.js"
]

for filename in files_to_update:
    filepath = os.path.join(store_dir, filename)
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    updated = content
    for pattern, repl in replacements:
        updated = re.sub(pattern, repl, updated)
        
    if updated != content:
        with open(filepath, "w", encoding="utf-8", newline="\n") as f:
            f.write(updated)
        print(f"Updated color scheme in: {filename}")

print("Theme harmonization complete!")
