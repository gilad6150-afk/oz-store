$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"
$filePath = Join-Path $dir "products_data.js"
$jsContent = [System.IO.File]::ReadAllText($filePath, $utf8)

$startIdx = $jsContent.IndexOf('[')
$endIdx = $jsContent.LastIndexOf(']')
$jsonText = $jsContent.Substring($startIdx, $endIdx - $startIdx + 1)

$products = $jsonText | ConvertFrom-Json

Write-Host "TOTAL PRODUCTS: $($products.Count)"
Write-Host "=========================================="

$catGroups = $products | Group-Object category

foreach ($cGroup in $catGroups) {
    $firstItem = $cGroup.Group[0]
    $catName = $firstItem.category_name
    if (-not $catName) { $catName = $cGroup.Name }
    
    Write-Host "CATEGORY KEY: [$($cGroup.Name)] | NAME: $catName | COUNT: $($cGroup.Count)"
    
    $subGroups = $cGroup.Group | Group-Object subcategory
    foreach ($sub in $subGroups) {
        $subName = $sub.Name
        if (-not $subName) { $subName = "None" }
        Write-Host "   -> SUBCATEGORY: $subName | COUNT: $($sub.Count)"
    }
    Write-Host "------------------------------------------"
}
