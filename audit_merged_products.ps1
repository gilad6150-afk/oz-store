$prodFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js'
$feedFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\google_merchant_feed.xml'

if (-not (Test-Path $prodFile)) {
    Write-Host "products_data.js missing."
    exit 1
}

$rawJs = [System.IO.File]::ReadAllText($prodFile, [System.Text.Encoding]::UTF8)
# Strip window.PRODUCTS_DATA = and trailing semicolon if present
$jsonText = $rawJs -replace '^\s*window\.PRODUCTS_DATA\s*=\s*', '' -replace ';\s*$', ''

try {
    $products = $jsonText | ConvertFrom-Json
    Write-Host "=== AUDIT REPORT FOR PRODUCTS_DATA.JS ==="
    Write-Host "Total Products: $($products.Count)"

    # Categories breakdown
    $cats = $products | Group-Object category
    Write-Host "`nCategory Breakdown:"
    foreach ($c in $cats) {
        Write-Host "  - $($c.Name): $($c.Count) products"
    }

    # Subcategories breakdown
    $subcats = $products | Group-Object subcategory
    Write-Host "`nSubcategory Breakdown:"
    foreach ($sc in $subcats) {
        if ($sc.Name) {
            Write-Host "  - $($sc.Name): $($sc.Count) products"
        }
    }

    # Supplier brand mentions check (Make sure "משכן התכלת" is not exposed in product names)
    $brandMentions = $products | Where-Object { $_.name -match 'משכן התכלת' -or $_.short_description -match 'משכן התכלת' }
    Write-Host "`nSupplier Brand Exposes in Name/Description: $($brandMentions.Count)"
    if ($brandMentions.Count -gt 0) {
        Write-Host "  Sample items containing supplier brand:"
        $brandMentions | Select-Object -First 5 | ForEach-Object { Write-Host "    - ID $($_.id): $($_.name)" }
    } else {
        Write-Host "  SUCCESS: 0 supplier brand mentions found! All branded as Oz Judaica."
    }

    # Check images validity
    $noImg = $products | Where-Object { -not $_.image }
    Write-Host "`nProducts missing primary image: $($noImg.Count)"

    # Check price validity
    $zeroPrice = $products | Where-Object { $_.price -le 0 }
    Write-Host "Products with 0 price: $($zeroPrice.Count)"

    # Check Merchant Feed count
    if (Test-Path $feedFile) {
        $feedXml = [System.IO.File]::ReadAllText($feedFile, [System.Text.Encoding]::UTF8)
        $feedItemCount = ([regex]::Matches($feedXml, '<item>')).Count
        Write-Host "`nGoogle Merchant Feed (<item> count): $feedItemCount"
        if ($feedItemCount -eq $products.Count) {
            Write-Host "  SUCCESS: Merchant feed items match products_data.js count exactly ($($products.Count))!"
        } else {
            Write-Host "  WARNING: Feed count ($feedItemCount) differs from products_data.js count ($($products.Count))."
        }
    }

} catch {
    Write-Host "JSON parse error: $_"
}
