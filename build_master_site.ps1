$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

# 1. Read Base64 Data URIs for Logos to make artifact 100% self-contained
$logoTransBytes = [System.IO.File]::ReadAllBytes('C:\Users\97254\.gemini\antigravity\scratch\oz-store\public\oz_logo_transparent.png')
$logoTransBase64 = "data:image/png;base64," + [Convert]::ToBase64String($logoTransBytes)

$logoWhiteBytes = [System.IO.File]::ReadAllBytes('C:\Users\97254\.gemini\antigravity\scratch\oz-store\public\oz_logo_white.png')
$logoWhiteBase64 = "data:image/png;base64," + [Convert]::ToBase64String($logoWhiteBytes)

# 2. Read Component Templates (100% UTF-8 Text Files)
$layoutFrame = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\layout_frame.html', $utf8NoBOM)
$topBar = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\top_bar.html', $utf8NoBOM)
$cleanNav = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_nav.html', $utf8NoBOM)
$animatedHero = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\animated_hero.html', $utf8NoBOM)
$shopLayout = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\shop_layout.html', $utf8NoBOM)
$footer = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\footer.html', $utf8NoBOM)
$modals = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\modals.html', $utf8NoBOM)
$floatingCart = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\floating_cart.html', $utf8NoBOM)
$pagesCode = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\pages_code.js', $utf8NoBOM)
$cleanRender = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js', $utf8NoBOM)
$productsDataJs = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js', $utf8NoBOM)
$articlesDataJs = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\articles_data.js', $utf8NoBOM)

# Replace logo paths with base64 data URIs
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
$html = $html.Replace('/* PRODUCTS_DATA_PLACEHOLDER */', $productsDataJs)
$html = $html.Replace('/* ARTICLES_DATA_PLACEHOLDER */', $articlesDataJs)
$html = $html.Replace('/* PAGES_CODE_PLACEHOLDER */', $pagesCode)
$html = $html.Replace('/* CLEAN_RENDER_PLACEHOLDER */', $cleanRender)

[System.IO.File]::WriteAllText($indexPath, $html, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $html, $utf8NoBOM)
Write-Host "Master clean build executed successfully with 100% INLINED database and base64 logos!"
