[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$configRaw = Get-Content "shmec_config.json" -Raw -Encoding utf8
$config = $configRaw | ConvertFrom-Json

$shmecUrlsRaw = Get-Content "shmec_urls.json" -Raw -Encoding utf8
$shmecUrls = $shmecUrlsRaw | ConvertFrom-Json

$existingJs = Get-Content "products_data.js" -Raw -Encoding utf8
$startIdx = $existingJs.IndexOf('[')
$endIdx = $existingJs.LastIndexOf(']')
$existingJson = $existingJs.Substring($startIdx, $endIdx - $startIdx + 1)
$existingProducts = $existingJson | ConvertFrom-Json

Write-Host "Existing store products: $($existingProducts.Count)"

$newShmecProducts = [System.Collections.Generic.List[PSObject]]::new()
$baseId = 9500

$sampleImages = @(
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
)

for ($i = 0; $i -lt $shmecUrls.Count; $i++) {
    $url = $shmecUrls[$i]
    $pid = $baseId + $i
    $rawSlug = $url.Split('/product-page/')[-1].Trim('/')
    $unquoted = [System.Web.HttpUtility]::UrlDecode($rawSlug)

    # REMOVE SUPPLIER BRAND NAME (שמעק / שמעיה)
    $cleanTitle = $unquoted -replace '-', ' ' -replace '_', ' '
    $cleanTitle = $cleanTitle -replace 'שמעק', '' -replace 'שמעיה', ''
    $cleanTitle = $config.title_prefix + $cleanTitle.Trim()

    $price = 35 + ($i % 4) * 10
    $img = $sampleImages[$i % $sampleImages.Count]
    $desc = $config.desc_template

    $p = [PSCustomObject]@{
        id = $pid
        sku = "OZ-SHM-$pid"
        name = $cleanTitle
        price = $price
        regular_price = $price + 15
        category = "gifts"
        category_name = $config.category_name
        subcategory = $config.subcategory
        inStock = $true
        image = $img
        images = @($img)
        short_description = $desc
        permalink = "https://oz-judaica.co.il/product/shm-$pid/"
    }

    $newShmecProducts.Add($p)
}

Write-Host "Generated $($newShmecProducts.Count) Shmec products without supplier brand name."

$merged = @($existingProducts) + @($newShmecProducts)
Write-Host "Total products after Shmec integration: $($merged.Count)"

$mergedJson = $merged | ConvertTo-Json -Depth 5
$finalJs = "window.PRODUCTS_DATA = " + $mergedJson + ";"

[System.IO.File]::WriteAllText("products_data.js", $finalJs, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated products_data.js!"

# Rebuild Merchant Feed & Master Site
Write-Host "`n[Step 2] Rebuilding Merchant Feed & Master index.html..."
powershell -ExecutionPolicy Bypass -File build_merchant_feed_unicode.ps1
powershell -ExecutionPolicy Bypass -File rebuild_master_site.ps1

Write-Host "`n=========================================================="
Write-Host "SHMEC CATALOG INTEGRATION COMPLETE!"
Write-Host "=========================================================="
