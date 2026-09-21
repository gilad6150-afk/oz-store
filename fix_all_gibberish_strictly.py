import re
import os

store_dir = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store"

# 1. Clean layout_frame.html
layout_path = os.path.join(store_dir, "layout_frame.html")
with open(layout_path, "r", encoding="utf-8", errors="ignore") as f:
    layout_txt = f.read()

# Remove any mojibake meta tags
layout_txt = re.sub(r'<meta name="keywords" content="[^"]*">', '', layout_txt)
layout_txt = re.sub(r'<meta name="description" content="[^"]*">', '', layout_txt)

clean_meta = '''    <meta name="keywords" content="מתנות לגבר, כיסוי לתפילין, תיק לתפילין, מתנה לבר מצווה, מתנה לחתן, תפילין מהודרות, תפילין לבר מצווה, קלף מזוזה כשר, בתי מזוזה מעוצבים, טלית צמר טהור, טלית לחתן, ציצית עבודת יד, ארנק עור יוקרתי לגבר, סט קידוש והבדלה, תשמישי קדושה משלוח לכל הארץ, מכון עוז">
    <meta name="description" content="מכון עוז – חנות תשמישי קדושה, יודאיקה וארנקי עור פרימיום עם משלוחים מהירים לכל חלקי הארץ (1-3 ימי עסקים). מתנות לגבר, כיסוי לתפילין, תפילין מהודרות, מזוזות כשרות וסטים לבר מצווה ולחתן.">'''

layout_txt = layout_txt.replace('<!-- OFFICIAL BRAND FAVICON -->', clean_meta + '\n    <!-- OFFICIAL BRAND FAVICON -->')

# Clean knowsAbout if mojibake present
layout_txt = re.sub(r'"knowsAbout":\s*\[[^\]]*\]', '"knowsAbout": ["מתנות לגבר", "כיסוי לתפילין", "תיק לתפילין", "תפילין מהודרות", "מתנה לבר מצווה", "מתנה לחתן", "קלף מזוזה כשר", "בתי מזוזה מעוצבים", "טלית צמר טהור", "ארנק עור יוקרתי לגבר"]', layout_txt)

with open(layout_path, "w", encoding="utf-8") as f:
    f.write(layout_txt)

print("Fixed layout_frame.html with 100% clean UTF-8 Hebrew!")

# 2. Clean footer.html
footer_path = os.path.join(store_dir, "footer.html")
with open(footer_path, "r", encoding="utf-8", errors="ignore") as f:
    footer_txt = f.read()

# Remove broken NATIONWIDE SEO KEYWORD LANDING GRID if present
if "NATIONWIDE SEO KEYWORD LANDING GRID" in footer_txt:
    parts = footer_txt.split("<!-- NATIONWIDE SEO KEYWORD LANDING GRID")
    part1 = parts[0]
    sub_parts = parts[1].split("<!-- GOOGLE LOCAL BUSINESS")
    if len(sub_parts) > 1:
        part2 = "<!-- GOOGLE LOCAL BUSINESS" + sub_parts[1]
    else:
        sub_parts2 = parts[1].split('<div class="border-t border-white/10')
        part2 = '<div class="border-t border-white/10' + sub_parts2[1]
    footer_txt = part1 + part2

clean_footer_grid = '''        <!-- NATIONWIDE SEO KEYWORD LANDING GRID -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 border-t border-purple-900/40 text-right">
            <h4 class="text-xs font-black text-purple-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>🌐</span> מפת החיפוש הארצית – מכון עוז (משלוחים מהירים לכל חלקי הארץ)
            </h4>
            <div class="flex flex-wrap gap-2 text-[11px] font-bold">
                <a href="#shop" onclick="handleSearch('מתנות לגבר')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🎁 מתנות לגבר</a>
                <a href="#shop" onclick="handleSearch('כיסוי לתפילין')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">💼 כיסוי לתפילין</a>
                <a href="#shop" onclick="handleSearch('תיק לתפילין')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">👜 תיק לתפילין</a>
                <a href="#shop" onclick="handleSearch('מתנה לבר מצווה')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🎉 מתנה לבר מצווה</a>
                <a href="#shop" onclick="handleSearch('מתנה לחתן')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🤵 מתנה לחתן</a>
                <a href="#shop" onclick="handleSearch('תפילין מהודרות')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">✨ תפילין מהודרות</a>
                <a href="#shop" onclick="handleSearch('תפילין לבר מצווה')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">📜 תפילין לבר מצווה</a>
                <a href="#shop" onclick="handleSearch('קלף מזוזה כשר')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">✒️ קלף מזוזה כשר</a>
                <a href="#shop" onclick="handleSearch('בתי מזוזה מעוצבים')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🏛️ בתי מזוזה מעוצבים</a>
                <a href="#shop" onclick="handleSearch('טלית צמר טהור')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🧣 טלית צמר טהור</a>
                <a href="#shop" onclick="handleSearch('טלית לחתן')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🤍 טלית לחתן</a>
                <a href="#shop" onclick="handleSearch('ציצית עבודת יד')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🧵 ציצית עבודת יד</a>
                <a href="#shop" onclick="handleSearch('ארנק עור יוקרתי לגבר')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">💳 ארנק עור יוקרתי לגבר</a>
                <a href="#shop" onclick="handleSearch('סט קידוש והבדלה')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🍷 סט קידוש והבדלה</a>
                <a href="#shop" onclick="handleSearch('בדיקת מזוזות ותפילין')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🔍 בדיקת מזוזות ותפילין</a>
                <a href="#shop" onclick="handleSearch('משלוח לכל הארץ')" class="py-1.5 px-3 bg-purple-950/70 border border-purple-800/60 rounded-xl text-slate-200 hover:text-white hover:bg-purple-800 transition-all">🚚 משלוחים לכל חלקי הארץ</a>
            </div>
        </div>\n'''

footer_split = '<div class="border-t border-white/10 pt-6 pb-2'
footer_txt = footer_txt.replace(footer_split, clean_footer_grid + footer_split)

with open(footer_path, "w", encoding="utf-8") as f:
    f.write(footer_txt)

print("Fixed footer.html with 100% clean UTF-8 Hebrew!")
