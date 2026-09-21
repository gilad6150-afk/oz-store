import os

layout_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\layout_frame.html"

with open(layout_path, "r", encoding="utf-8") as f:
    txt = f.read()

old_schema_part = '"name": "מכון עוז - תשמישי קדושה, תפילין מהודרות וארנקי יוקרה",'
new_schema_part = '''"name": "מכון עוז - תשמישי קדושה, תפילין מהודרות ויודאיקה",
      "alternateName": ["עוז יודאיקה", "עוז יודאיקה ומתנות", "מכון עוז ראש העין", "עוז יודאיקה ראש העין"],
      "disambiguatingDescription": "החנות הרשמית והיחידה של מכון עוז בראש העין ברחוב שלום מנצורה 48 - תשמישי קדושה, תפילין מהודרות, מזוזות כשרות וארנקי עור לגבר",'''

if old_schema_part in txt:
    txt = txt.replace(old_schema_part, new_schema_part)
    with open(layout_path, "w", encoding="utf-8") as f:
        f.write(txt)
    print("Enhanced layout_frame.html with Brand Disambiguation & Alternate Names!")
else:
    print("Old schema pattern not found or already updated.")
