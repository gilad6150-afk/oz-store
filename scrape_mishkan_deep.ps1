[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$categories = @(
    "https://mishkan-hatchelet.co.il/product-category/%D7%A6%D7%99%D7%A6%D7%99%D7%AA/",
    "https://mishkan-hatchelet.co.il/product-category/%D7%98%D7%9C%D7%99%D7%AA/",
    "https://mishkan-hatchelet.co.il/c/tzitzit/",
    "https://mishkan-hatchelet.co.il/c/prayer-shawls/"
)

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

$visited = [System.Collections.Generic.HashSet[string]]::new()
$productUrls = [System.Collections.Generic.HashSet[string]]::new()
$subCategories = [System.Collections.Generic.HashSet[string]]::new()

foreach ($cat in $categories) {
    [void]$subCategories.Add($cat)
}

$queue = [System.Collections.Generic.Queue[string]]::new()
foreach ($c in $subCategories) { $queue.Enqueue($c) }

while ($queue.Count -gt 0 -and $visited.Count -lt 50) {
    $currentUrl = $queue.Dequeue()
    if ($visited.Contains($currentUrl)) { continue }
    [void]$visited.Add($currentUrl)

    Write-Host "Scraping category/page: $currentUrl"
    try {
        $resp = Invoke-WebRequest -Uri $currentUrl -Headers $headers -UseBasicParsing
        $html = $resp.Content

        # Find subcategories and pagination
        $matches = [regex]::Matches($html, 'href=["'']([^"'']+)["'']')
        foreach ($m in $matches) {
            $link = $m.Groups[1].Value
            if (-not $link.StartsWith("http")) {
                if ($link.StartsWith("/")) {
                    $link = "https://mishkan-hatchelet.co.il" + $link
                } else {
                    continue
                }
            }

            if ($link -like "*mishkan-hatchelet.co.il/product/*" -or $link -like "*mishkan-hatchelet.co.il/p/*" -or ($link -like "*mishkan-hatchelet.co.il/*" -and $link -notlike "*product-category*" -and $link -notlike "*/c/*" -and $link -notlike "*/cart*" -and $link -notlike "*/checkout*" -and $link -notlike "*/my-account*" -and $link -notlike "*.jpg*" -and $link -notlike "*.png*" -and $link -notlike "*.css*" -and $link -notlike "*.js*")) {
                # Could be product page
                if ($link -match '/(?:product|p|tzitzit|prayer-shawls)/[^/]+/?$') {
                    [void]$productUrls.Add($link)
                }
            }
            if ($link -like "*product-category*" -or $link -like "*/page/*" -or $link -like "*/c/*") {
                if (-not $visited.Contains($link) -and ($link -like "*tzitzit*" -or $link -like "*prayer-shawls*" -or $link -like "*%D7%A6%D7%99%D7%A6%D7%99%D7%AA*" -or $link -like "*%D7%98%D7%9C%D7%99%D7%AA*")) {
                    $queue.Enqueue($link)
                }
            }
        }
    } catch {
        Write-Host "Error fetching $currentUrl : $_"
    }
}

Write-Host "Done scanning category pages!"
Write-Host "Discovered $($productUrls.Count) potential product pages."
$productUrls | Select-Object -First 20 | ForEach-Object { Write-Host " - $_" }
