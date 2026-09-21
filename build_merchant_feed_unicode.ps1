$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$productsJs = [System.IO.File]::ReadAllText((Join-Path $dir "products_data.js"), $utf8)
$jsonStart = $productsJs.IndexOf('[')
$jsonEnd = $productsJs.LastIndexOf(']')
$jsonStr = $productsJs.Substring($jsonStart, $jsonEnd - $jsonStart + 1)
$products = $jsonStr | ConvertFrom-Json

$feedTitle = "$([char]0x05DE)$([char]0x05DB)$([char]0x05D5)$([char]0x05DF) $([char]0x05E2)$([char]0x05D5)$([char]0x05D6) - Google Merchant Center Product Feed"
$feedDesc = "$([char]0x05E4)$([char]0x05D9)$([char]0x05D3) $([char]0x05DE)$([char]0x05D5)$([char]0x05E6)$([char]0x05D9)$([char]0x05DD) $([char]0x05E8)$([char]0x05E9)$([char]0x05DE)$([char]0x05D9) $([char]0x05E2)$([char]0x05D1)$([char]0x05D5)$([char]0x05E8) Google Shopping"
$brandName = "$([char]0x05DE)$([char]0x05DB)$([char]0x05D5)$([char]0x05DF) $([char]0x05E2)$([char]0x05D5)$([char]0x05D6)"

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sb.AppendLine('<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">')
[void]$sb.AppendLine('  <channel>')
[void]$sb.AppendLine("    <title>$feedTitle</title>")
[void]$sb.AppendLine('    <link>https://oz-judaica.co.il</link>')
[void]$sb.AppendLine("    <description>$feedDesc</description>")

foreach ($p in $products) {
    $id = $p.id
    $sku = if ($p.sku) { $p.sku } else { "OZ-$id" }
    $title = [System.Security.SecurityElement]::Escape($p.name)
    $desc = [System.Security.SecurityElement]::Escape($p.short_description)
    $link = "https://oz-judaica.co.il/#product-$id"
    $img = $p.image
    $price = "$($p.price) ILS"
    $avail = if ($p.inStock) { "in_stock" } else { "out_of_stock" }
    $catName = [System.Security.SecurityElement]::Escape($p.category_name)

    [void]$sb.AppendLine('    <item>')
    [void]$sb.AppendLine("      <g:id>$sku</g:id>")
    [void]$sb.AppendLine("      <title>$title</title>")
    [void]$sb.AppendLine("      <description>$desc</description>")
    [void]$sb.AppendLine("      <link>$link</link>")
    [void]$sb.AppendLine("      <g:image_link>$img</g:image_link>")
    [void]$sb.AppendLine('      <g:condition>new</g:condition>')
    [void]$sb.AppendLine("      <g:availability>$avail</g:availability>")
    [void]$sb.AppendLine("      <g:price>$price</g:price>")
    [void]$sb.AppendLine("      <g:brand>$brandName</g:brand>")
    [void]$sb.AppendLine("      <g:product_type>$catName</g:product_type>")
    [void]$sb.AppendLine('      <g:identifier_exists>no</g:identifier_exists>')
    [void]$sb.AppendLine('    </item>')
}

[void]$sb.AppendLine('  </channel>')
[void]$sb.AppendLine('</rss>')

$feedPath = Join-Path $dir "google_merchant_feed.xml"
[System.IO.File]::WriteAllText($feedPath, $sb.ToString(), $utf8)
Write-Host "✅ Google Merchant XML Feed generated successfully!"
