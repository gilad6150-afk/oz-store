$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$productsJs = [System.IO.File]::ReadAllText((Join-Path $dir "products_data.js"), $utf8NoBOM)

$jsonStart = $productsJs.IndexOf('[')
$jsonEnd = $productsJs.LastIndexOf(']')
$jsonStr = $productsJs.Substring($jsonStart, $jsonEnd - $jsonStart + 1)

$products = $jsonStr | ConvertFrom-Json

Write-Host "Loaded" $products.Count "products for Google Merchant Feed generator"

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>עוז יודאיקה - Google Merchant Center Product Feed</title>
    <link>https://oz-judaica.co.il</link>
    <description>פיד מוצרים רשמי של עוז יודאיקה עבור Google Shopping, קמפיינים ב-Google Ads והופעה במנוע החיפוש של גוגל</description>
"@

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
    $subCat = if ($p.subcategory) { [System.Security.SecurityElement]::Escape($p.subcategory) } else { $catName }

    # Map Google Product Category
    $gCategory = "Religious &amp; Ceremonial &gt; Religious Apparel"
    if ($p.category -eq 'tallitot-tzitzit' -or $title -match 'טלית|ציצית') {
        $gCategory = "Apparel &amp; Accessories &gt; Religious Apparel &gt; Prayer Shawls"
    }

    $xml += @"

    <item>
      <g:id>$sku</g:id>
      <title>$title</title>
      <description>$desc</description>
      <link>$link</link>
      <g:image_link>$img</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>$avail</g:availability>
      <g:price>$price</g:price>
      <g:brand>עוז יודאיקה</g:brand>
      <g:google_product_category>$gCategory</g:google_product_category>
      <g:product_type>$catName &gt; $subCat</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
"@
}

$xml += @"

  </channel>
</rss>
"@

$feedPath = Join-Path $dir "google_merchant_feed.xml"
[System.IO.File]::WriteAllText($feedPath, $xml, $utf8NoBOM)
Write-Host "Google Merchant XML Feed regenerated successfully with 100% Oz Judaica branding!"
