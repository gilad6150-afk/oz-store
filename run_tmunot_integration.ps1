[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

Write-Host "=========================================================="
Write-Host "PARSING AND MERGING TMUNOT RABANIM SUPPLIER CATALOG"
Write-Host "=========================================================="

$urls = Get-Content "tmunot_rabanim_urls.txt" -Encoding utf8
Write-Host "Loaded $($urls.Count) Tmunot Rabanim product URLs..."

$configRaw = Get-Content "tmunot_config.json" -Raw -Encoding utf8
$config = $configRaw | ConvertFrom-Json

$existingJs = Get-Content "products_data.js" -Raw -Encoding utf8
$startIdx = $existingJs.IndexOf('[')
$endIdx = $existingJs.LastIndexOf(']')
$existingJson = $existingJs.Substring($startIdx, $endIdx - $startIdx + 1)
$existingProducts = $existingJson | ConvertFrom-Json

Write-Host "Existing catalog products before Supplier 2 merge: $($existingProducts.Count)"

$newProducts = [System.Collections.Generic.List[PSObject]]::new()
$baseId = 9600

$artImages = @(
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80"
)

$ambientGallery = @(
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
)

for ($i = 0; $i -lt $urls.Count; $i++) {
    $url = $urls[$i]
    if ([string]::IsNullOrWhiteSpace($url)) { continue }

    $itemId = $baseId + $i
    $rawSlug = $url.Split('/product/')[-1].Trim('/')
    $unquoted = [System.Web.HttpUtility]::UrlDecode($rawSlug)

    # REMOVE SUPPLIER BRAND NAME (tmunotrabanim / brand names from config)
    $cleanTitle = $unquoted -replace '-', ' ' -replace '_', ' '
    foreach ($bn in $config.brand_names) {
        $cleanTitle = $cleanTitle -replace [regex]::Escape($bn), ''
    }
    $cleanTitle = $cleanTitle.Trim()
    if ([string]::IsNullOrWhiteSpace($cleanTitle)) {
        $cleanTitle = $config.fallback_title + ($i + 1)
    }

    $price = 149 + ($i % 6) * 30
    $mainImg = $artImages[$i % $artImages.Count]
    $ambientImg = $ambientGallery[$i % $ambientGallery.Count]

    $p = [PSCustomObject]@{
        id = $itemId
        sku = "OZ-TR-$itemId"
        name = $cleanTitle
        price = $price
        regular_price = $price + 40
        category = "gifts"
        category_name = $config.category_name
        subcategory = $config.subcategory
        inStock = $true
        image = $mainImg
        images = @($mainImg, $ambientImg)
        short_description = $config.desc_template
        permalink = "https://oz-judaica.co.il/product/tr-$itemId/"
    }

    $newProducts.Add($p)
}

Write-Host "Generated $($newProducts.Count) Tmunot Rabanim products without supplier brand name."

$merged = @($existingProducts) + @($newProducts)
Write-Host "Total catalog products after Supplier 2 merge: $($merged.Count)"

$mergedJson = $merged | ConvertTo-Json -Depth 5
$finalJs = "window.PRODUCTS_DATA = " + $mergedJson + ";"

[System.IO.File]::WriteAllText("products_data.js", $finalJs, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated products_data.js!"

# Rebuild Merchant Feed & Master Site
Write-Host "`n[Step 2] Rebuilding Merchant Feed & Master index.html..."
powershell -ExecutionPolicy Bypass -File build_merchant_feed_unicode.ps1
powershell -ExecutionPolicy Bypass -File rebuild_master_site.ps1

Write-Host "`n=========================================================="
Write-Host "TMUNOT RABANIM CATALOG INTEGRATION COMPLETE!"
Write-Host "=========================================================="
