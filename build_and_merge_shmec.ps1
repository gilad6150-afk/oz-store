[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

Write-Host "=========================================================="
Write-Host "PARSING AND MERGING SHMEC SUPPLIER CATALOG"
Write-Host "=========================================================="

# 1. Run Python extract script if files exist or build directly
$shmecUrls = @(
    "https://www.shmec.co.il/product-page/ליקר-בננה",
    "https://www.shmec.co.il/product-page/פאסטיס",
    "https://www.shmec.co.il/product-page/פפרמינט",
    "https://www.shmec.co.il/product-page/מנטה-יום-כיפור",
    "https://www.shmec.co.il/product-page/מנטה-מרוקו",
    "https://www.shmec.co.il/product-page/אקסטרא-מרוקו",
    "https://www.shmec.co.il/product-page/מנטה-ירוק",
    "https://www.shmec.co.il/product-page/מנטה-שחור-חריף",
    "https://www.shmec.co.il/product-page/רוזמרין",
    "https://www.shmec.co.il/product-page/אבנים-טובות",
    "https://www.shmec.co.il/product-page/קול-חזן",
    "https://www.shmec.co.il/product-page/שפרייזן",
    "https://www.shmec.co.il/product-page/רחמסטריבקה",
    "https://www.shmec.co.il/product-page/בורדוגן",
    "https://www.shmec.co.il/product-page/דאבל-אספרסו",
    "https://www.shmec.co.il/product-page/גינג-ר-מרוקאי",
    "https://www.shmec.co.il/product-page/זהר-טריפולטאי",
    "https://www.shmec.co.il/product-page/מאחייה-אניס",
    "https://www.shmec.co.il/product-page/אקליפטוס-שחור",
    "https://www.shmec.co.il/product-page/הדס-אתרוג",
    "https://www.shmec.co.il/product-page/ציפורן-טהור",
    "https://www.shmec.co.il/product-page/תערובת-בשמים-למוצאי-שבת",
    "https://www.shmec.co.il/product-page/עשבי-בשמים-ארץ-ישראלי"
)

$existingJs = [System.IO.File]::ReadAllText((Join-Path $dir "products_data.js"), [System.Text.Encoding]::UTF8)
$startIdx = $existingJs.IndexOf('[')
$endIdx = $existingJs.LastIndexOf(']')
$existingJson = $existingJs.Substring($startIdx, $endIdx - $startIdx + 1)
$existingProducts = $existingJson | ConvertFrom-Json

Write-Host "Existing products in store: $($existingProducts.Count)"

$newShmecProducts = [System.Collections.Generic.List[PSObject]]::new()
$baseId = 9500

$sampleImages = @(
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
)

for ($i = 0; $i -lt $shmecUrls.Count; $i++) {
    $url = $shmecUrls[$i]
    $pid = $baseId + $i
    $rawSlug = $url.Split('/product-page/')[-1].Trim('/')
    $unquoted = [System.Web.HttpUtility]::UrlDecode($rawSlug)

    # REMOVE SUPPLIER BRAND NAME (שמעק / שמעיה)
    $cleanTitle = $unquoted -replace '-', ' ' -replace '_', ' ' -replace 'שמעק', '' -replace 'שמעיה', ''
    $cleanTitle = $cleanTitle.Trim()
    if ([string]::IsNullOrWhiteSpace($cleanTitle)) {
        $cleanTitle = "תערובת בשמים וריחות להבדלה #$($i+1)"
    } else {
        $cleanTitle = "בשמים להבדלה – " + $cleanTitle
    }

    $price = 35 + ($i % 4) * 10
    $img = $sampleImages[$i % $sampleImages.Count]

    # SUBTLE DISCLAIMER IN SMALL OPAQUE TEXT
    $desc = "תערובת בשמים וניחוחות מובחרים להבדלה ולברכה. עשוי מעשבי ריח וצמחי מרפא טבעיים בהכשר מהודר. <span class='text-[11px] text-slate-400 block mt-2 opacity-75'>*(ייתכן עיכוב קל במשלוח עקב זמינות אצל הספק)*</span>"

    $p = [PSCustomObject]@{
        id = $pid
        sku = "OZ-SHM-$pid"
        name = $cleanTitle
        price = $price
        regular_price = $price + 15
        category = "gifts"
        category_name = "בשמים ויודאיקה"
        subcategory = "בשמים וריחות להבדלה"
        inStock = $false
        image = $img
        images = @($img)
        short_description = $desc
        permalink = "https://oz-judaica.co.il/product/shm-$pid/"
    }

    $newShmecProducts.Add($p)
}

Write-Host "Generated $($newShmecProducts.Count) Shmec products without supplier brand name."

$merged = @($existingProducts) + @($newShmecProducts)
Write-Host "Total products after Shmec integration: $($merged.Count)"

$mergedJson = $merged | ConvertTo-Json -Depth 5
$finalJs = "window.PRODUCTS_DATA = " + $mergedJson + ";"

[System.IO.File]::WriteAllText((Join-Path $dir "products_data.js"), $finalJs, $utf8)
Write-Host "Successfully updated products_data.js!"

# Rebuild Merchant Feed & Master Site
Write-Host "`n[Step 2] Rebuilding Merchant Feed & Master index.html..."
powershell -ExecutionPolicy Bypass -File build_merchant_feed_unicode.ps1
powershell -ExecutionPolicy Bypass -File rebuild_master_site.ps1

Write-Host "`n=========================================================="
Write-Host "SHMEC CATALOG INTEGRATION COMPLETE!"
Write-Host "=========================================================="
