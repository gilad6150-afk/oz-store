[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$configRaw = Get-Content "hebrew_names.json" -Raw -Encoding utf8
$config = $configRaw | ConvertFrom-Json

$urls = Get-Content "mishkan_product_urls.txt" -Encoding utf8
Write-Host "Processing $($urls.Count) Mishkan product URLs..."

$existingJs = Get-Content "products_data.js" -Raw -Encoding utf8
$startIdx = $existingJs.IndexOf('[')
$endIdx = $existingJs.LastIndexOf(']')
$existingJson = $existingJs.Substring($startIdx, $endIdx - $startIdx + 1)
$existingProducts = $existingJson | ConvertFrom-Json

Write-Host "Existing products in products_data.js: $($existingProducts.Count)"

$newProducts = [System.Collections.Generic.List[PSObject]]::new()
$baseId = 9100

$images = @(
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/A01-%D7%9B%D7%97%D7%95%D7%9C-150x150.jpg",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/%D7%94%D7%95%D7%93-%D7%A9%D7%9E%D7%A0%D7%AA-1-107x150.webp",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/DSC_9779-150x100.jpg",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/%D7%A4%D7%AA%D7%99%D7%9C%D7%99%D7%9D-150x122.jpg"
)

for ($i = 0; $i -lt $urls.Count; $i++) {
    $url = $urls[$i]
    if ([string]::IsNullOrWhiteSpace($url)) { continue }

    $pid = $baseId + $i
    $rawSlug = $url.Split('/m/')[-1].Trim('/')
    $unquoted = [System.Web.HttpUtility]::UrlDecode($rawSlug)
    $cleanTitle = $unquoted -replace '-', ' ' -replace '_', ' '

    # Lookup mapping if exact match
    if ($config.psobject.properties[$rawSlug]) {
        $cleanTitle = $config.psobject.properties[$rawSlug].Value
    }

    $subcat = $config.subcat_tzitzit
    $price = 99

    if ($rawSlug -like "*tallit*" -or $rawSlug -like "*shawl*") {
        $price = 290 + ($i % 5) * 30
        $subcat = $config.subcat_tallit
    } elseif ($rawSlug -like "*shirt*" -or $rawSlug -like "*t-shirt*" -or $rawSlug -like "*undershirt*") {
        $price = 69 + ($i % 4) * 10
        $subcat = $config.subcat_undershirt
    } elseif ($rawSlug -like "*wick*" -or $rawSlug -like "*thread*") {
        $price = 45 + ($i % 3) * 15
        $subcat = $config.subcat_wicks
    } elseif ($rawSlug -like "*bag*" -or $rawSlug -like "*cover*" -or $rawSlug -like "*tafdanit*") {
        $price = 85 + ($i % 4) * 20
        $subcat = $config.subcat_bag
    } else {
        $price = 59 + ($i % 6) * 15
    }

    $img = $images[$i % $images.Count]
    $desc = $config.desc_template -f $cleanTitle

    $p = [PSCustomObject]@{
        id = $pid
        sku = "OZ-MH-$pid"
        name = $cleanTitle.Trim()
        price = $price
        regular_price = $price + 35
        category = "tallitot-tzitzit"
        category_name = $config.category_name
        subcategory = $subcat
        inStock = $true
        image = $img
        images = @($img)
        short_description = $desc
        permalink = "https://oz-judaica.co.il/product/mh-$pid/"
    }

    $newProducts.Add($p)
}

Write-Host "Generated $($newProducts.Count) new products!"

$merged = @($existingProducts) + @($newProducts)
Write-Host "Total products in merged catalog: $($merged.Count)"

$mergedJson = $merged | ConvertTo-Json -Depth 5
$finalJs = "window.PRODUCTS_DATA = " + $mergedJson + ";"

[System.IO.File]::WriteAllText("products_data.js", $finalJs, [System.Text.Encoding]::UTF8)
Write-Host "Successfully updated products_data.js with $($merged.Count) products!"
