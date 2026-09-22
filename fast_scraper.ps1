[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

if (-not (Test-Path "mishkan_product_urls.txt")) {
    Write-Host "Missing mishkan_product_urls.txt"
    exit 0
}

$urls = Get-Content "mishkan_product_urls.txt" -Encoding utf8
Write-Host "Fast multi-thread scraping for $($urls.Count) products..."

$scriptBlock = {
    param($url, $index)
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
    $headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }

    try {
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        $req.Timeout = 10000
        $resp = $req.GetResponse()
        $reader = [System.IO.StreamReader]::new($resp.GetResponseStream(), [System.Text.Encoding]::UTF8)
        $html = $reader.ReadToEnd()
        $reader.Close()
        $resp.Close()

        # Extract Title
        $title = "Mishkan Product $index"
        if ($html -match '<h1[^>]*class=["''][^"'']*product_title[^"'']*["''][^>]*>(.*?)</h1>') {
            $title = $Matches[1] -replace '<[^>]+>', ''
        } elseif ($html -match '<title>(.*?)</title>') {
            $title = ($Matches[1] -split '[\|-]')[0].Trim()
        }

        # Extract Price
        $price = "99"
        if ($html -match '<bdi>(.*?)</bdi>') {
            $rawP = $Matches[1] -replace '[^\d\.]', ''
            if ($rawP -and $rawP -match '^\d+$') { $price = $rawP }
        }

        # Extract Images
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

        return [PSCustomObject]@{
            id = "mishkan_" + $index
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
    } catch {
        return $null
    }
}

$results = $urls | ForEach-Object -Parallel $scriptBlock -ThrottleLimit 15

$cleanResults = $results | Where-Object { $_ -ne $null }
Write-Host "Fast scraper completed! Harvested $($cleanResults.Count) products!"

$json = $cleanResults | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("mishkan_catalog_scraped.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_scraped.json cleanly!"
