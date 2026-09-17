$content = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js', [System.Text.Encoding]::UTF8)

# Extract realProductsDB block
$startIdx = $content.IndexOf('const realProductsDB = [')
$endIdx = $content.IndexOf('];', $startIdx)
$jsonStr = $content.Substring($startIdx + 23, $endIdx - $startIdx - 23 + 1)

$products = ConvertFrom-Json $jsonStr

Write-Host "Total products:" $products.Count
$badNames = $products | Where-Object { [string]::IsNullOrWhiteSpace($_.name) }
$badPrices = $products | Where-Object { $_.price -eq $null }
$badCats = $products | Where-Object { [string]::IsNullOrWhiteSpace($_.category) }

Write-Host "Missing names:" $badNames.Count
Write-Host "Missing prices:" $badPrices.Count
Write-Host "Missing categories:" $badCats.Count

foreach ($p in $products) {
    if (-not $p.name) { Write-Host "Bad product ID:" $p.id }
}
