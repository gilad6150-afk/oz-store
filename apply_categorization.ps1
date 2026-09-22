[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

Write-Host "=========================================================="
Write-Host "APPLYING NEW CATEGORY & SUBCATEGORY STRUCTURE TO ALL 613 PRODUCTS"
Write-Host "=========================================================="

$filePath = Join-Path $dir "products_data.js"
$jsContent = [System.IO.File]::ReadAllText($filePath, $utf8NoBOM)

$startIdx = $jsContent.IndexOf('[')
$endIdx = $jsContent.LastIndexOf(']')
$jsonText = $jsContent.Substring($startIdx, $endIdx - $startIdx + 1)

$products = $jsonText | ConvertFrom-Json

$countUpdated = 0

foreach ($p in $products) {
    $cat = "" + $p.category
    $name = "" + $p.name
    $sub = "" + $p.subcategory
    $sku = "" + $p.sku
    $id = [int]$p.id

    # 1. ׳˜׳׳™׳•׳× ׳•׳¦׳™׳¦׳™׳•׳× (tallitot-tzitzit)
    if ($cat -eq "tallitot-tzitzit" -or $name.Contains("׳˜׳׳™׳×") -or $name.Contains("׳¦׳™׳¦׳™׳×")) {
        $p.category = "tallitot-tzitzit"
        $p.category_name = "׳˜׳׳™׳•׳× ׳•׳¦׳™׳¦׳™׳•׳×"
        
        if ($name.Contains("׳¦׳™׳¦׳™׳×") -or $name.Contains("׳’׳•׳₪׳™׳™׳×") -or $name.Contains("Dry-Fit") -or $sub.Contains("׳¦׳™׳¦׳™׳•׳×")) {
            $p.subcategory = "׳¦׳™׳¦׳™׳•׳×"
        } else {
            $p.subcategory = "׳˜׳׳™׳×׳•׳×"
        }
        $countUpdated++
        continue
    }

    # 2. ׳׳×׳ ׳•׳× ׳•׳™׳•׳“׳׳™׳§׳” (gifts) - includes Rabbinical art, Shmec fragrances, Wallets, Judaica gifts
    if ($cat -eq "gifts" -or $cat -eq "wallets" -or $name.Contains("׳׳¨׳ ׳§") -or $name.Contains("׳×׳׳•׳ ׳”") -or $name.Contains("׳‘׳©׳׳™׳") -or $sku.StartsWith("OZ-SHM-")) {
        $p.category = "gifts"
        $p.category_name = "׳׳×׳ ׳•׳× ׳•׳™׳•׳“׳׳™׳§׳”"
        
        if ($sku.StartsWith("OZ-SHM-") -or $name.Contains("׳‘׳©׳׳™׳") -or $name.Contains("׳׳”׳‘׳“׳׳”")) {
            $p.subcategory = "׳‘׳©׳׳™׳ ׳•׳¨׳™׳—׳•׳× ׳׳”׳‘׳“׳׳”"
        }
        elseif ($cat -eq "wallets" -or $name.Contains("׳׳¨׳ ׳§")) {
            $p.subcategory = "׳׳¨׳ ׳§׳™׳ ׳׳’׳‘׳¨"
        }
        elseif ($name.Contains("׳×׳׳•׳ ׳”") -or $name.Contains("׳§׳ ׳‘׳¡") -or $name.Contains("׳–׳›׳•׳›׳™׳×") -or $id -ge 10000 -or $name.Contains("׳׳¨׳") -or $name.Contains("׳”׳¨׳‘")) {
            $p.subcategory = "׳×׳׳•׳ ׳•׳× ׳–׳›׳•׳›׳™׳× ׳•׳§׳ ׳‘׳¡"
        }
        else {
            $p.subcategory = "׳׳׳¨׳–׳™׳ ׳•׳׳×׳ ׳•׳× ׳™׳•׳“׳׳™׳§׳”"
        }
        $countUpdated++
        continue
    }

    # 3. ׳×׳™׳§׳™׳ ׳׳˜׳׳™׳× ׳•׳×׳₪׳™׳׳™׳ (tefillin-bags)
    if ($cat -eq "tefillin-bags" -or $name.Contains("׳×׳™׳§") -or $name.Contains("׳›׳™׳¡׳•׳™") -or $name.Contains("׳×׳₪׳“׳ ׳™׳×")) {
        $p.category = "tefillin-bags"
        $p.category_name = "׳×׳™׳§׳™׳ ׳׳˜׳׳™׳× ׳•׳×׳₪׳™׳׳™׳"
        
        if ($name.Contains("׳×׳₪׳“׳ ׳™׳×") -or $name.Contains("׳“׳§ ׳§׳˜׳") -or ($name.Contains("׳׳×׳₪׳™׳׳™׳") -and -not $name.Contains("׳˜׳׳™׳×"))) {
            $p.subcategory = "׳×׳™׳§׳™׳ ׳׳×׳₪׳™׳׳™׳"
        } else {
            $p.subcategory = "׳›׳™׳¡׳•׳™ ׳˜׳׳™׳× ׳•׳×׳₪׳™׳׳™׳"
        }
        $countUpdated++
        continue
    }

    # 4. ׳¡׳₪׳¨׳™ ׳§׳•׳“׳© (books)
    if ($cat -eq "books" -or $name.Contains("׳¡׳₪׳¨") -or $name.Contains("׳¡׳™׳“׳•׳¨") -or $name.Contains("׳×׳”׳™׳׳™׳") -or $name.Contains("׳—׳•׳׳©")) {
        $p.category = "books"
        $p.category_name = "׳¡׳₪׳¨׳™ ׳§׳•׳“׳©"
        $p.subcategory = "׳¡׳₪׳¨׳™ ׳§׳•׳“׳© ׳•׳¡׳™׳“׳•׳¨׳™׳"
        $countUpdated++
        continue
    }

    # 5. ׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳” ׳•׳¡׳×"׳ (stam / mezuzot)
    if ($cat -eq "stam" -or $cat -eq "mezuzot" -or $name.Contains("׳׳–׳•׳–׳”") -or $name.Contains("׳×׳₪׳™׳׳™׳") -or $name.Contains("׳×׳•׳¨׳”")) {
        $p.category = "stam"
        $p.category_name = "׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳” ׳•׳¡׳×`"׳"
        
        if ($name.Contains("׳׳׳•׳׳™׳ ׳™׳•׳") -or $name.Contains("׳׳•׳‘׳¨׳©")) {
            $p.subcategory = "׳‘׳×׳™ ׳׳–׳•׳–׳” ׳׳׳׳•׳׳™׳ ׳™׳•׳"
        }
        elseif ($name.Contains("׳׳₪׳•׳§׳¡׳™") -or $name.Contains("׳™׳¦׳™׳§׳”")) {
            $p.subcategory = "׳‘׳×׳™ ׳׳–׳•׳–׳” ׳׳׳₪׳•׳§׳¡׳™"
        }
        elseif ($name.Contains("׳₪׳׳¡׳˜׳™׳§") -or $name.Contains("׳©׳§׳•׳£")) {
            $p.subcategory = "׳‘׳×׳™ ׳׳–׳•׳–׳” ׳׳₪׳׳¡׳˜׳™׳§"
        }
        elseif ($name.Contains("׳§׳׳£") -and $name.Contains("׳׳–׳•׳–")) {
            $p.subcategory = "׳׳–׳•׳–׳•׳×"
        }
        elseif ($name.Contains("׳׳–׳•׳–")) {
            $p.subcategory = "׳‘׳×׳™ ׳׳–׳•׳–׳”"
        }
        elseif ($name.Contains("׳×׳•׳¨׳”")) {
            $p.subcategory = "׳¡׳₪׳¨ ׳×׳•׳¨׳”"
        }
        else {
            $p.subcategory = "׳×׳₪׳™׳׳™׳"
        }
        $countUpdated++
        continue
    }
}

Write-Host "Processed and updated $countUpdated products."

# Save updated products_data.js
$newJson = $products | ConvertTo-Json -Depth 10
$newJsContent = "window.PRODUCTS_DATA = " + $newJson + ";"
[System.IO.File]::WriteAllText($filePath, $newJsContent, $utf8NoBOM)
Write-Host "Successfully saved products_data.js!"