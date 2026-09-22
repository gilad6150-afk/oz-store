$html = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\sample_product.html', [System.Text.Encoding]::UTF8)

# Title
if ($html -match '<h1[^>]*>([\s\S]*?)</h1>') {
    Write-Host "Title: $($Matches[1].Trim())"
}

# Look for select options, variations, prices, attributes
Write-Host "--- Select Elements ---"
$selects = [regex]::Matches($html, '<select[^>]*>([\s\S]*?)</select>')
foreach ($s in $selects) {
    Write-Host "Select match: $($s.Value.Substring(0, [Math]::Min(300, $s.Value.Length)))"
}

# Look for json data / variations in scripts (woocommerce / shopify / custom)
Write-Host "--- Script data containing price/variation ---"
$scripts = [regex]::Matches($html, '<script[^>]*>([\s\S]*?)</script>')
foreach ($scr in $scripts) {
    if ($scr.Value -match 'product_variations|price|variation_id|sizes|attributes') {
        Write-Host "Found script block snippet: $($scr.Value.Substring(0, [Math]::Min(500, $scr.Value.Length)))`n"
    }
}

# Images
Write-Host "--- Images ---"
$imgs = [regex]::Matches($html, 'src=["'']([^"'']+\.(?:jpg|png|webp))["'']')
$uniqueImgs = [System.Collections.Generic.HashSet[string]]::new()
foreach ($im in $imgs) {
    [void]$uniqueImgs.Add($im.Groups[1].Value)
}
Write-Host "Found $($uniqueImgs.Count) images. Sample:"
$uniqueImgs | Select-Object -First 10 | ForEach-Object { Write-Host $_ }
