[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$urls = @(
    "https://mishkan-hatchelet.co.il/c/tzitzit/",
    "https://mishkan-hatchelet.co.il/c/prayer-shawls/"
)

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

$allLinks = [System.Collections.Generic.HashSet[string]]::new()

foreach ($url in $urls) {
    Write-Host "Fetching $url..."
    try {
        $resp = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing
        $html = $resp.Content
        
        # Regex to find links
        $matches = [regex]::Matches($html, 'href=["'']([^"'']+)["'']')
        foreach ($m in $matches) {
            $link = $m.Groups[1].Value
            if ($link -like "*/product/*" -or $link -like "*/p/*" -or $link -like "*/p-*" -or $link -like "*/product-category/*" -or $link -like "*/shop/*") {
                if (-not $link.StartsWith("http")) {
                    $link = "https://mishkan-hatchelet.co.il" + $link
                }
                [void]$allLinks.Add($link)
            }
        }
    } catch {
        Write-Host "Error fetching $url : $_"
    }
}

Write-Host "Total unique product links found: $($allLinks.Count)"
$allLinks | Select-Object -First 20 | ForEach-Object { Write-Host " - $_" }
