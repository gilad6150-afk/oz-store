[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Subcategories to crawl for product links
$categoriesToCrawl = @(
    "https://mishkan-hatchelet.co.il/c/tzitzit/",
    "https://mishkan-hatchelet.co.il/c/tzitzit/t-shirt-and-tzitzit/",
    "https://mishkan-hatchelet.co.il/c/tzitzit/wool-tassel/",
    "https://mishkan-hatchelet.co.il/c/tzitzit/%d7%a6%d7%99%d7%a6%d7%99%d7%95%d7%aa-%d7%93%d7%a8%d7%99%d7%99%d7%a4%d7%99%d7%98/",
    "https://mishkan-hatchelet.co.il/c/wicks/",
    "https://mishkan-hatchelet.co.il/c/wicks/light-blue-thread/",
    "https://mishkan-hatchelet.co.il/c/prayer-shawls/",
    "https://mishkan-hatchelet.co.il/c/prayer-shawls/%d7%98%d7%9c%d7%99%d7%aa-%d7%9e%d7%a2%d7%95%d7%a6%d7%91%d7%aa/",
    "https://mishkan-hatchelet.co.il/c/prayer-shawls/tallit-for-shabbat/",
    "https://mishkan-hatchelet.co.il/c/talit-tefillin-covers/",
    "https://mishkan-hatchelet.co.il/c/atarot-for-tallit/",
    "https://mishkan-hatchelet.co.il/c/atarot-for-tallit/%d7%a2%d7%98%d7%a8%d7%a8%d7%a1%d7%91%d7%a8%d7%95%d7%91%d7%a1%d7%a7%d7%99/"
)

# Add pagination pages for tzitzit and prayer-shawls (pages 2 to 6)
for ($i = 2; $i -le 6; $i++) {
    $categoriesToCrawl += "https://mishkan-hatchelet.co.il/c/tzitzit/page/$i/"
    $categoriesToCrawl += "https://mishkan-hatchelet.co.il/c/prayer-shawls/page/$i/"
}

$productUrls = [System.Collections.Generic.HashSet[string]]::new()

Write-Host "CRAWLING CATEGORY PAGES FOR /m/ PRODUCT LINKS..."

foreach ($catUrl in $categoriesToCrawl) {
    Write-Host "Scanning: $catUrl"
    try {
        $resp = Invoke-WebRequest -Uri $catUrl -Headers $headers -UseBasicParsing
        $html = $resp.Content
        $matches = [regex]::Matches($html, 'href=["''](https://mishkan-hatchelet\.co\.il/m/[^"'']+)["'']')
        foreach ($m in $matches) {
            $purl = $m.Groups[1].Value
            # Filter out non-product anchors if any
            if ($purl -notlike "*#*" -and $purl -notlike "*feed*") {
                [void]$productUrls.Add($purl)
            }
        }
        # Also relative /m/ links
        $relMatches = [regex]::Matches($html, 'href=["''](/m/[^"'']+)["'']')
        foreach ($rm in $relMatches) {
            $purl = "https://mishkan-hatchelet.co.il" + $rm.Groups[1].Value
            if ($purl -notlike "*#*") {
                [void]$productUrls.Add($purl)
            }
        }
    } catch {
        Write-Host "Error scanning $catUrl : $_"
    }
}

Write-Host "`n========================================================"
Write-Host "DISCOVERED $($productUrls.Count) UNIQUE MISHKAN HATCHELET PRODUCT PAGES (/m/)"
Write-Host "========================================================"

$productUrls | Out-File -FilePath "mishkan_product_urls.txt" -Encoding utf8
$productUrls | Select-Object -First 30 | ForEach-Object { Write-Host " - $_" }
