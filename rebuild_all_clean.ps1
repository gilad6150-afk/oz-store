$utf8 = [System.Text.Encoding]::UTF8
$storeDir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'

# Read layout_frame.html
$layoutPath = Join-Path $storeDir 'layout_frame.html'
$lines = [System.IO.File]::ReadAllLines($layoutPath, $utf8)

$cleanLines = @()
foreach ($line in $lines) {
    if ($line.Contains('׳') -or $line.Contains('ג€')) { continue }
    $cleanLines += $line
}

$cleanTxt = $cleanLines -join "`n"

$metaBlock = @"
    <link rel="canonical" href="https://oz-judaica.co.il/" />
    <meta name="keywords" content="מתנות לגבר, כיסוי לתפילין, תיק לתפילין, מתנה לבר מצווה, מתנה לחתן, תפילין מהודרות, תפילין לבר מצווה, קלף מזוזה כשר, בתי מזוזה מעוצבים, טלית צמר טהור, טלית לחתן, ציצית עבודת יד, ארנק עור יוקרתי לגבר, סט קידוש והבדלה, תשמישי קדושה משלוח לכל הארץ, מכון עוז">
    <meta name="description" content="מכון עוז – חנות תשמישי קדושה, יודאיקה וארנקי עור פרימיום עם משלוחים מהירים לכל חלקי הארץ (1-3 ימי עסקים). מתנות לגבר, כיסוי לתפילין, תפילין מהודרות, מזוזות כשרות וסטים לבר מצווה ולחתן.">
"@

if (-not $cleanTxt.Contains('rel="canonical"')) {
    $cleanTxt = $cleanTxt.Replace('<!-- OFFICIAL BRAND FAVICON -->', $metaBlock + "`n    <!-- OFFICIAL BRAND FAVICON -->")
}

[System.IO.File]::WriteAllText($layoutPath, $cleanTxt, $utf8)

# Rebuild index.html
$layoutFrame = [System.IO.File]::ReadAllText((Join-Path $storeDir 'layout_frame.html'), $utf8)
$topBar = [System.IO.File]::ReadAllText((Join-Path $storeDir 'top_bar.html'), $utf8)
$cleanNav = [System.IO.File]::ReadAllText((Join-Path $storeDir 'clean_nav.html'), $utf8)
$animatedHero = [System.IO.File]::ReadAllText((Join-Path $storeDir 'animated_hero.html'), $utf8)
$shopLayout = [System.IO.File]::ReadAllText((Join-Path $storeDir 'shop_layout.html'), $utf8)
$footer = [System.IO.File]::ReadAllText((Join-Path $storeDir 'footer.html'), $utf8)
$modals = [System.IO.File]::ReadAllText((Join-Path $storeDir 'modals.html'), $utf8)
$floatingCart = [System.IO.File]::ReadAllText((Join-Path $storeDir 'floating_cart.html'), $utf8)
$pagesCode = [System.IO.File]::ReadAllText((Join-Path $storeDir 'pages_code.js'), $utf8)
$cleanRender = [System.IO.File]::ReadAllText((Join-Path $storeDir 'clean_render.js'), $utf8)
$productsData = [System.IO.File]::ReadAllText((Join-Path $storeDir 'products_data.js'), $utf8)
$articlesData = [System.IO.File]::ReadAllText((Join-Path $storeDir 'articles_data.js'), $utf8)

# Read Base64 logos
$logoTransBytes = [System.IO.File]::ReadAllBytes((Join-Path $storeDir 'public\oz_logo_transparent.png'))
$logoTransBase64 = "data:image/png;base64," + [Convert]::ToBase64String($logoTransBytes)

$logoWhiteBytes = [System.IO.File]::ReadAllBytes((Join-Path $storeDir 'public\oz_logo_white.png'))
$logoWhiteBase64 = "data:image/png;base64," + [Convert]::ToBase64String($logoWhiteBytes)

$cleanNav = $cleanNav.Replace('public/oz_logo_transparent.png', $logoTransBase64)
$footer = $footer.Replace('public/oz_logo_white.png', $logoWhiteBase64)

$html = $layoutFrame
$html = $html.Replace('/* TOP_BAR_PLACEHOLDER */', $topBar)
$html = $html.Replace('/* CLEAN_NAV_PLACEHOLDER */', $cleanNav)
$html = $html.Replace('/* ANIMATED_HERO_PLACEHOLDER */', $animatedHero)
$html = $html.Replace('/* SHOP_LAYOUT_PLACEHOLDER */', $shopLayout)
$html = $html.Replace('/* FOOTER_PLACEHOLDER */', $footer)
$html = $html.Replace('/* FLOATING_CART_PLACEHOLDER */', $floatingCart)
$html = $html.Replace('/* MODALS_PLACEHOLDER */', $modals)
$html = $html.Replace('/* PRODUCTS_DATA_PLACEHOLDER */', $productsData)
$html = $html.Replace('/* ARTICLES_DATA_PLACEHOLDER */', $articlesData)
$html = $html.Replace('/* PAGES_CODE_PLACEHOLDER */', $pagesCode)
$html = $html.Replace('/* CLEAN_RENDER_PLACEHOLDER */', $cleanRender)

$indexPath = Join-Path $storeDir 'index.html'
$livePath1 = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'
$livePath2 = 'C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\oz_store_live_site.html'

[System.IO.File]::WriteAllText($indexPath, $html, $utf8)
[System.IO.File]::WriteAllText($livePath1, $html, $utf8)
[System.IO.File]::WriteAllText($livePath2, $html, $utf8)

Write-Host "Rebuilt index.html with canonical tags and clean UTF-8!"
