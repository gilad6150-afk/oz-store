[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

Write-Host "=========================================================="
Write-Host "SETTING ALL SHMEC PRODUCTS TO OUT OF STOCK (inStock = false)"
Write-Host "=========================================================="

$filePath = Join-Path $dir "products_data.js"
$jsContent = [System.IO.File]::ReadAllText($filePath, $utf8)

$startIdx = $jsContent.IndexOf('[')
$endIdx = $jsContent.LastIndexOf(']')
$jsonText = $jsContent.Substring($startIdx, $endIdx - $startIdx + 1)

$products = $jsonText | ConvertFrom-Json

$countUpdated = 0
foreach ($p in $products) {
    # Match Shmec products by ID range (9500-9522), SKU (OZ-SHM-*), or permalink containing /shm-
    $isShmec = ($p.id -ge 9500 -and $p.id -le 9522) -or ($p.sku -like "OZ-SHM-*") -or ($p.permalink -like "*/shm-*")

    if ($isShmec) {
        $p.inStock = $false
        $countUpdated++
        Write-Host "Set OUT OF STOCK: [$($p.id)] $($p.sku)"
    }
}

Write-Host "`nTotal Shmec products updated to inStock = false: $countUpdated"

# Save updated products_data.js
$newJson = $products | ConvertTo-Json -Depth 10
$newJsContent = "window.PRODUCTS_DATA = " + $newJson + ";"
[System.IO.File]::WriteAllText($filePath, $newJsContent, $utf8)
Write-Host "Successfully saved products_data.js!"

# Rebuild merchant feed & master site
Write-Host "`nRebuilding Merchant Feed & Master Site..."
powershell -ExecutionPolicy Bypass -File (Join-Path $dir "build_merchant_feed_unicode.ps1")
powershell -ExecutionPolicy Bypass -File (Join-Path $dir "rebuild_master_site.ps1")

Write-Host "`n=========================================================="
Write-Host "ALL SHMEC PRODUCTS ARE NOW MARKED OUT OF STOCK!"
Write-Host "=========================================================="
