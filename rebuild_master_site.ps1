$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

function Read-CleanFile($filename) {
    return [System.IO.File]::ReadAllText((Join-Path $dir $filename), $utf8)
}

$layout_frame = Read-CleanFile "layout_frame.html"
$top_bar = Read-CleanFile "top_bar.html"
$clean_nav = Read-CleanFile "clean_nav.html"
$animated_hero = Read-CleanFile "animated_hero.html"
$shop_layout = Read-CleanFile "shop_layout.html"
$footer = Read-CleanFile "footer.html"
$modals = Read-CleanFile "modals.html"
$floating_cart = Read-CleanFile "floating_cart.html"
$pages_code = Read-CleanFile "pages_code.js"
$admin_supplier_system = Read-CleanFile "admin_supplier_system.js"
$clean_render = Read-CleanFile "clean_render.js"
$products_data = Read-CleanFile "products_data.js"
$articles_data = Read-CleanFile "articles_data.js"

$logoTransBytes = [System.IO.File]::ReadAllBytes((Join-Path $dir "public\oz_logo_transparent.png"))
$logoTransB64 = "data:image/png;base64," + [System.Convert]::ToBase64String($logoTransBytes)

$logoWhiteBytes = [System.IO.File]::ReadAllBytes((Join-Path $dir "public\oz_logo_white.png"))
$logoWhiteB64 = "data:image/png;base64," + [System.Convert]::ToBase64String($logoWhiteBytes)

$clean_nav = $clean_nav.Replace('public/oz_logo_transparent.png', $logoTransB64)
$footer = $footer.Replace('public/oz_logo_white.png', $logoWhiteB64)

# Combine JS modules
$combinedJs = $admin_supplier_system + "`n`n" + $pages_code

$html = $layout_frame
$html = $html.Replace('/* TOP_BAR_PLACEHOLDER */', $top_bar)
$html = $html.Replace('/* CLEAN_NAV_PLACEHOLDER */', $clean_nav)
$html = $html.Replace('/* ANIMATED_HERO_PLACEHOLDER */', $animated_hero)
$html = $html.Replace('/* SHOP_LAYOUT_PLACEHOLDER */', $shop_layout)
$html = $html.Replace('/* FOOTER_PLACEHOLDER */', $footer)
$html = $html.Replace('/* FLOATING_CART_PLACEHOLDER */', $floating_cart)
$html = $html.Replace('/* MODALS_PLACEHOLDER */', $modals)
$html = $html.Replace('/* PRODUCTS_DATA_PLACEHOLDER */', $products_data)
$html = $html.Replace('/* ARTICLES_DATA_PLACEHOLDER */', $articles_data)
$html = $html.Replace('/* PAGES_CODE_PLACEHOLDER */', $combinedJs)
$html = $html.Replace('/* CLEAN_RENDER_PLACEHOLDER */', $clean_render)

$indexPath = Join-Path $dir "index.html"
$livePath1 = "C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html"
$livePath2 = "C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\oz_store_live_site.html"

[System.IO.File]::WriteAllText($indexPath, $html, $utf8)
if (Test-Path (Split-Path $livePath1)) { [System.IO.File]::WriteAllText($livePath1, $html, $utf8) }
if (Test-Path (Split-Path $livePath2)) { [System.IO.File]::WriteAllText($livePath2, $html, $utf8) }

Write-Host "✅ Master index.html rebuilt successfully with Admin & Supplier Automation System!"
