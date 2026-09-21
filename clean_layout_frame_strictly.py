import os

layout_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\layout_frame.html"

with open(layout_path, "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

clean_lines = []
for line in lines:
    if "׳ž׳×" in line or "ג€“" in line or "׳—׳ " in line:
        continue
    clean_lines.append(line)

new_content = "".join(clean_lines)

# Inject clean meta keywords & description
clean_meta = '''    <link rel="canonical" href="https://oz-judaica.co.il/" />
    <meta name="keywords" content="מתנות לגבר, כיסוי לתפילין, תיק לתפילין, מתנה לבר מצווה, מתנה לחתן, תפילין מהודרות, תפילין לבר מצווה, קלף מזוזה כשר, בתי מזוזה מעוצבים, טלית צמר טהור, טלית לחתן, ציצית עבודת יד, ארנק עור יוקרתי לגבר, סט קידוש והבדלה, תשמישי קדושה משלוח לכל הארץ, מכון עוז">
    <meta name="description" content="מכון עוז – חנות תשמישי קדושה, יודאיקה וארנקי עור פרימיום עם משלוחים מהירים לכל חלקי הארץ (1-3 ימי עסקים). מתנות לגבר, כיסוי לתפילין, תפילין מהודרות, מזוזות כשרות וסטים לבר מצווה ולחתן.">\n'''

new_content = new_content.replace('<!-- OFFICIAL BRAND FAVICON -->', clean_meta + '    <!-- OFFICIAL BRAND FAVICON -->')

with open(layout_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("layout_frame.html cleaned and canonical link added!")
