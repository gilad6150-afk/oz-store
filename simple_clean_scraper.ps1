[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

if (-not (Test-Path "mishkan_product_urls.txt")) {
    Write-Host "Missing mishkan_product_urls.txt"
    exit 0
}

$urls = Get-Content "mishkan_product_urls.txt" -Encoding utf8
Write-Host "Scraping $($urls.Count) product pages cleanly..."

$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
$catalog = [System.Collections.Generic.List[PSObject]]::new()
$count = 0

foreach ($url in $urls) {
    if ([string]::IsNullOrWhiteSpace($url)) { continue }
    $count++
    try {
        $resp = Invoke-WebRequest -Uri $url -Headers $headers -TimeoutSec 3 -UseBasicParsing
        $html = $resp.Content

        $title = "Mishkan Product $count"
        if ($html -match '<h1[^>]*class=["''][^"'']*product_title[^"'']*["''][^>]*>(.*?)</h1>') {
            $title = $Matches[1] -replace '<[^>]+>', ''
        } elseif ($html -match '<title>(.*?)</title>') {
            $title = ($Matches[1] -split '[\|-]')[0].Trim()
        }

        $price = "99"
        if ($html -match '<bdi>(.*?)</bdi>') {
            $rawP = $Matches[1] -replace '[^\d\.]', ''
            if ($rawP -and $rawP -match '^\d+$') { $price = $rawP }
        }

        $images = [System.Collections.Generic.HashSet[string]]::new()
        $imgMatches = [regex]::Matches($html, 'src=["''](https://mishkan-hatchelet\.co\.il/wp-content/uploads/[^"'']+\.(?:jpg|png|webp))["'']')
        foreach ($im in $imgMatches) {
            $imgUrl = $im.Groups[1].Value
            if ($imgUrl -notlike "*150x150*" -and $imgUrl -notlike "*100x*" -and $imgUrl -notlike "*logo*") {
                [void]$images.Add($imgUrl)
            }
        }

        $mainImg = ""
        if ($images.Count -gt 0) {
            $mainImg = ($images | Select-Object -First 1)
        }

        $desc = "Quality Mishkan Hatchelet Product"
        if ($html -match '<div[^>]*class=["''][^"'']*woocommerce-product-details__short-description[^"'']*["''][^>]*>(.*?)</div>') {
            $cleanDesc = $Matches[1] -replace '<[^>]+>', ' ' -replace '\s+', ' '
            if ($cleanDesc.Trim().Length -gt 5) { $desc = $cleanDesc.Trim() }
        }

        $prodObj = [PSCustomObject]@{
            id = "mishkan_" + $count
            title = $title.Trim()
            url = $url
            price = [int]$price
            original_price = [int]$price + 35
            main_image = $mainImg
            gallery = [string[]]($images | Select-Object -Skip 1 -First 5)
            description = $desc
            brand = "Mishkan HaTchelet"
            in_stock = $true
        }

        $catalog.Add($prodObj)
        Write-Host "[$count/$($urls.Count)] OK - $($title.Trim())"
    } catch {
        Write-Host "[$count/$($urls.Count)] Error: $_"
    }
}

Write-Host "`nScraped $($catalog.Count) valid products out of $($urls.Count)!"
$json = $catalog | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("mishkan_catalog_scraped.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_scraped.json cleanly!"
