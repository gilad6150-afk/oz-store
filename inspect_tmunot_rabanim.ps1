[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

$siteUrl = "https://tmunotrabanim.com/"
Write-Host "Fetching Tmunot Rabanim homepage: $siteUrl..."

try {
    $resp = Invoke-WebRequest -Uri $siteUrl -Headers $headers -UseBasicParsing
    $html = $resp.Content

    $matches = [regex]::Matches($html, 'href=["'']([^"'']+)["'']')
    $productLinks = [System.Collections.Generic.HashSet[string]]::new()
    $catLinks = [System.Collections.Generic.HashSet[string]]::new()

    foreach ($m in $matches) {
        $link = $m.Groups[1].Value
        if ($link -like "*/product/*" -or $link -like "*/product-category/*" -or $link -like "*/p/*" -or $link -like "*/shop/*" -or $link -like "*/c/*") {
            if (-not $link.StartsWith("http")) { $link = "https://tmunotrabanim.com" + $link }
            if ($link -like "*/product/*" -or $link -like "*/p/*") {
                [void]$productLinks.Add($link)
            } else {
                [void]$catLinks.Add($link)
            }
        }
    }

    Write-Host "`nDiscovered $($productLinks.Count) product links:"
    $productLinks | Select-Object -First 20 | ForEach-Object { Write-Host " - $_" }

    Write-Host "`nDiscovered $($catLinks.Count) category links:"
    $catLinks | Select-Object -First 20 | ForEach-Object { Write-Host " - $_" }

} catch {
    Write-Host "Error: $_"
}
