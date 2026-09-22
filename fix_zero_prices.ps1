$prodFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js'
$rawJs = [System.IO.File]::ReadAllText($prodFile, [System.Text.Encoding]::UTF8)
$jsonText = $rawJs -replace '^\s*window\.PRODUCTS_DATA\s*=\s*', '' -replace ';\s*$', ''

$products = $jsonText | ConvertFrom-Json

$zeroItems = $products | Where-Object { $_.price -le 0 }
Write-Host "Found $($zeroItems.Count) zero price items:"
foreach ($item in $zeroItems) {
    Write-Host "  - ID: $($item.id) | SKU: $($item.sku) | Name: $($item.name) | Price: $($item.price)"
    if (-not $item.price -or $item.price -le 0) {
        if ($item.regular_price -and $item.regular_price -gt 0) {
            $item.price = $item.regular_price
        } else {
            $item.price = 99
            $item.regular_price = 99
        }
        Write-Host "    -> Fixed price to: $($item.price) NIS"
    }
}

$updatedJs = "window.PRODUCTS_DATA = " + ($products | ConvertTo-Json -Depth 10) + ";"
[System.IO.File]::WriteAllText($prodFile, $updatedJs, [System.Text.Encoding]::UTF8)
Write-Host "Saved updated products_data.js cleanly!"
