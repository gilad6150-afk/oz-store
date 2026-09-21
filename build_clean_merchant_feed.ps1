$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$feedTitleBytes = [byte[]](215, 158, 215, 155, 215, 157, 215, 157, 32, 215, 162, 215, 153, 215, 150, 32, 45, 32, 71, 111, 111, 103, 108, 101, 32, 77, 101, 114, 99, 104, 97, 110, 116, 32, 67, 101, 110, 116, 101, 114, 32, 80, 114, 111, 100, 117, 99, 116, 32, 70, 101, 101, 100)
$feedTitle = $utf8.GetString($feedTitleBytes)

$feedDescBytes = [byte[]](215, 164, 215, 153, 215, 157, 32, 215, 158, 215, 157, 215, 182, 215, 153, 215, 157, 32, 215, 168, 215, 164, 215, 158, 215, 153, 32, 215, 158, 215, 162, 215, 151, 215, 168, 32, 71, 111, 111, 103, 108, 101, 32, 83, 104, 111, 112, 112, 105, 110, 103, 32, 215, 153, 215, 157, 215, 164, 215, 153, 215, 150, 32, 215, 158, 215, 157, 215, 162, 215, 157, 32, 215, 157, 215, 151, 215, 153, 215, 182, 215, 153, 215, 150, 32, 215, 169, 215, 156, 32, 215, 154, 215, 151, 215, 153, 215, 154, 215, 157)
$feedDesc = $utf8.GetString($feedDescBytes)

$brandNameBytes = [byte[]](215, 158, 215, 155, 215, 157, 215, 157, 32, 215, 162, 215, 153, 215, 150)
$brandName = $utf8.GetString($brandNameBytes)

$productsJs = [System.IO.File]::ReadAllText((Join-Path $dir "products_data.js"), $utf8)
$jsonStart = $productsJs.IndexOf('[')
$jsonEnd = $productsJs.LastIndexOf(']')
$jsonStr = $productsJs.Substring($jsonStart, $jsonEnd - $jsonStart + 1)
$products = $jsonStr | ConvertFrom-Json

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
Write-Host "✅ Google Merchant XML Feed generated successfully at google_merchant_feed.xml!"
