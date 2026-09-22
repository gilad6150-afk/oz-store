[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$urls = @(
    "https://mishkan-hatchelet.co.il/c/tzitzit/",
    "https://mishkan-hatchelet.co.il/c/prayer-shawls/"
)

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

foreach ($url in $urls) {
    Write-Host "=== Inspecting Hrefs from $url ==="
    try {
        $resp = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing
        $html = $resp.Content
        $matches = [regex]::Matches($html, 'href=["'']([^"'']+)["'']')
        $uniqueHrefs = [System.Collections.Generic.HashSet[string]]::new()
        foreach ($m in $matches) {
            $h = $m.Groups[1].Value
            if ($h.Length -gt 1 -and $h -notlike "*wp-*" -and $h -notlike "*#*") {
                [void]$uniqueHrefs.Add($h)
            }
        }
        $uniqueHrefs | Select-Object -First 30 | ForEach-Object { Write-Host " - $_" }
    } catch {
        Write-Host "Error: $_"
    }
}
