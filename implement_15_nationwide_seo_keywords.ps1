$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

# 1. Update layout_frame.html head tags with nationwide keywords and meta tags
$layoutPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\layout_frame.html'
$layoutContent = [System.IO.File]::ReadAllText($layoutPath, $utf8NoBOM)

$metaBlock = @"
    <meta name="keywords" content="מתנות לגבר, כיסוי לתפילין, תיק לתפילין, מתנה לבר מצווה, מתנה לחתן, תפילין מהודרות, תפילין לבר מצווה, קלף מזוזה כשר, בתי מזוזה מעוצבים, טלית צמר טהור, טלית לחתן, ציצית עבודת יד, ארנק עור יוקרתי לגבר, סט קידוש והבדלה, תשמישי קדושה משלוח לכל הארץ, מכון עוז">
    <meta name="description" content="מכון עוז – חנות תשמישי קדושה, יודאיקה וארנקי עור פרימיום עם משלוחים מהירים לכל חלקי הארץ (1-3 ימי עסקים). מתנות לגבר, כיסוי לתפילין, תפילין מהודרות, מזוזות כשרות וסטים לבר מצווה ולחתן.">
"@

if (-not $layoutContent.Contains('name="keywords"')) {
    $targetTag = '<!-- OFFICIAL BRAND FAVICON -->'
    $layoutContent = $layoutContent.Replace($targetTag, $metaBlock + "`n" + $targetTag)
    [System.IO.File]::WriteAllText($layoutPath, $layoutContent, $utf8NoBOM)
    Write-Host "Updated layout_frame.html with meta keywords & description!"
}

# 2. Update footer.html with Nationwide Search Map Section
$footerPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\footer.html'
$footerContent = [System.IO.File]::ReadAllText($footerPath, $utf8NoBOM)

$nationwideSeoGrid = @"
        <!-- NATIONWIDE SEO KEYWORD LANDING GRID (מפת החיפוש הארצית) -->
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
        </div>
"@

if (-not $footerContent.Contains('NATIONWIDE SEO KEYWORD LANDING GRID')) {
    $splitTag = '<div class="border-t border-white/10 pt-6 pb-2'
    $footerContent = $footerContent.Replace($splitTag, $nationwideSeoGrid + "`n`n        " + $splitTag)
    [System.IO.File]::WriteAllText($footerPath, $footerContent, $utf8NoBOM)
    Write-Host "Updated footer.html with Nationwide Search Tag Grid!"
}

# 3. Update sitemap.xml with targeted search intent URLs
$sitemapPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\sitemap.xml'
$sitemapXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://oz-judaica.co.il/</loc>
        <lastmod>2026-09-20</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://oz-judaica.co.il/google_merchant_feed.xml</loc>
        <lastmod>2026-09-20</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <!-- NATIONWIDE KEYWORD SEARCH INTENT LANDING URLS -->
    <url><loc>https://oz-judaica.co.il/?search=%D7%9E%D7%AA%D7%A0%D7%95%D7%AA+%D7%9C%D7%92%D7%91%D7%A8</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%9B%D7%99%D7%A1%D7%95%D7%99+%D7%9C%D7%AA%D7%A4%D7%99%D7%9C%D7%99%D7%9F</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%AA%D7%99%D7%A7+%D7%9C%D7%AA%D7%A4%D7%99%D7%9C%D7%99%D7%9F</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%9E%D7%AA%D7%A0%D7%94+%D7%9C%D7%91%D7%A8+%D7%9E%D7%A6%D7%95%D7%95%D7%94</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%9E%D7%AA%D7%A0%D7%94+%D7%9C%D7%97%D7%AA%D7%9F</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%AA%D7%A4%D7%99%D7%9C%D7%99%D7%9F+%D7%9E%D7%97%D7%95%D7%93%D7%A8%D7%95%D7%AA</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%AA%D7%A4%D7%99%D7%9C%D7%99%D7%9F+%D7%9C%D7%91%D7%A8+%D7%9E%D7%A6%D7%95%D7%95%D7%94</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%A7%D7%9C%D7%A3+%D7%9E%D7%96%D7%95%D7%96%D7%94+%D7%9B%D7%A9%D7%A8</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%91%D7%AA%D7%99+%D7%9E%D7%96%D7%95%D7%96%D7%94+%D7%9E%D7%A2%D7%95%D7%A6%D7%91%D7%99%D7%9D</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%9D%D7%9C%D7%99%D7%AA+%D7%A6%D7%9E%D7%A8+%D7%9F%D7%94%D7%95%D7%A8</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%90%D7%A8%D7%A0%D7%A7+%D7%A2%D7%95%D7%A8+%D7%99%D7%95%D7%A7%D7%A8%D7%AA%D7%99+%D7%9C%D7%92%D7%91%D7%A8</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
    <url><loc>https://oz-judaica.co.il/?search=%D7%A1%D7%9D+%D7%A7%D7%99%D7%93%D7%95%D7%A9+%D7%95%D7%97%D7%91%D7%93%D7%9C%D7%94</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
</urlset>
"@

[System.IO.File]::WriteAllText($sitemapPath, $sitemapXml, $utf8NoBOM)
Write-Host "Updated sitemap.xml with 12 targeted nationwide search intent landing URLs!"
