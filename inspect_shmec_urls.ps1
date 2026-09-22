[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

$siteUrl = "https://www.shmec.co.il/"
Write-Host "Fetching Shmec homepage: $siteUrl..."

try {
    $resp = Invoke-WebRequest -Uri $siteUrl -Headers $headers -UseBasicParsing
    $html = $resp.Content

    # Find product links (/product-page/...) or store links
    $matches = [regex]::Matches($html, 'href=["'']([^"'']+)["'']')
    $productLinks = [System.Collections.Generic.HashSet[string]]::new()
    $catLinks = [System.Collections.Generic.HashSet[string]]::new()

    foreach ($m in $matches) {
        $link = $m.Groups[1].Value
        if ($link -like "*/product-page/*" -or $link -like "*/product/*" -or $link -like "*/p/*") {
            if (-not $link.StartsWith("http")) { $link = "https://www.shmec.co.il" + $link }
            [void]$productLinks.Add($link)
        }
        if ($link -like "*/shop*" -or $link -like "*/category/*" -or $link -like "*/collection/*" -or $link -like "*/%*") {
            if (-not $link.StartsWith("http")) { $link = "https://www.shmec.co.il" + $link }
            [void]$catLinks.Add($link)
        }
    }

    Write-Host "`nDiscovered $($productLinks.Count) product-page links directly from home:"
    $productLinks | Select-Object -First 20 | ForEach-Object { Write-Host " - $_" }

    Write-Host "`nDiscovered $($catLinks.Count) category/shop links from home:"
    $catLinks | Select-Object -First 20 | ForEach-Object { Write-Host " - $_" }

} catch {
    Write-Host "Error: $_"
}
