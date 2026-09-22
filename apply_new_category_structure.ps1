[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

Write-Host "=========================================================="
Write-Host "APPLYING NEW CATEGORY & SUBCATEGORY STRUCTURE TO ALL 613 PRODUCTS"
Write-Host "=========================================================="

$filePath = Join-Path $dir "products_data.js"
$jsContent = [System.IO.File]::ReadAllText($filePath, $utf8)

$startIdx = $jsContent.IndexOf('[')
$endIdx = $jsContent.LastIndexOf(']')
$jsonText = $jsContent.Substring($startIdx, $endIdx - $startIdx + 1)

$products = $jsonText | ConvertFrom-Json

$countUpdated = 0

foreach ($p in $products) {
    $cat = $p.category
    $name = $p.name
    $sub = $p.subcategory
    $sku = $p.sku
    $id = $p.id

    # Rule 1: טליות וציציות (tallitot-tzitzit)
    if ($cat -eq "tallitot-tzitzit" -or $name -like "*טלית*" -or $name -like "*ציצית*") {
        $p.category = "tallitot-tzitzit"
        $p.category_name = "טליות וציציות"
        
        if ($name -like "*ציצית*" -or $name -like "*גופיית*" -or $name -like "*Dry-Fit*" -or $sub -like "*ציציות*") {
            $p.subcategory = "ציציות"
        } else {
            $p.subcategory = "טליתות"
        }
        $countUpdated++
        continue
    }

    # Rule 2: מתנות ויודאיקה (gifts) - includes Rabbinical art, Shmec fragrances, Wallets, Judaica gifts
    if ($cat -eq "gifts" -or $cat -eq "wallets" -or $name -like "*ארנק*" -or $name -like "*תמונה*" -or $name -like "*בשמים*" -or $sku -like "OZ-SHM-*") {
        $p.category = "gifts"
        $p.category_name = "מתנות ויודאיקה"
        
        if ($sku -like "OZ-SHM-*" -or $name -like "*בשמים*" -or $name -like "*להבדלה*") {
            $p.subcategory = "בשמים וריחות להבדלה"
        }
        elseif ($cat -eq "wallets" -or $name -like "*ארנק*") {
            $p.subcategory = "ארנקים לגבר"
        }
        elseif ($name -like "*תמונה*" -or $name -like "*קנבס*" -or $name -like "*זכוכית*" -or $id -ge 10000 -or $name -like "*מרן*" -or $name -like "*הרב*") {
            $p.subcategory = "תמונות זכוכית וקנבס"
        }
        else {
            $p.subcategory = "מארזים ומתנות יודאיקה"
        }
        $countUpdated++
        continue
    }

    # Rule 3: תיקים לטלית ותפילין (tefillin-bags)
    if ($cat -eq "tefillin-bags" -or $name -like "*תיק*" -or $name -like "*כיסוי*" -or $name -like "*תפדנית*") {
        $p.category = "tefillin-bags"
        $p.category_name = "תיקים לטלית ותפילין"
        
        if ($name -like "*תפדנית*" -or $name -like "*דק קטן*" -or ($name -like "*לתפילין*" -and $name -notlike "*טלית*")) {
            $p.subcategory = "תיקים לתפילין"
        } else {
            $p.subcategory = "כיסוי טלית ותפילין"
        }
        $countUpdated++
        continue
    }

    # Rule 4: ספרי קודש (books)
    if ($cat -eq "books" -or $name -like "*ספר*" -or $name -like "*סידור*" -or $name -like "*תהילים*" -or $name -like "*חומש*") {
        $p.category = "books"
        $p.category_name = "ספרי קודש"
        $p.subcategory = "ספרי קודש וסידורים"
        $countUpdated++
        continue
    }

    # Rule 5: תשמישי קדושה וסת"ם (stam / mezuzot)
    if ($cat -eq "stam" -or $cat -eq "mezuzot" -or $name -like "*מזוזה*" -or $name -like "*תפילין*" -or $name -like "*תורה*") {
        $p.category = "stam"
        $p.category_name = "תשמישי קדושה וסת\"ם"
        
        if ($name -like "*אלומיניום*" -or $name -like "*מוברש*") {
            $p.subcategory = "בתי מזוזה מאלומיניום"
        }
        elseif ($name -like "*אפוקסי*" -or $name -like "*יציקה*") {
            $p.subcategory = "בתי מזוזה מאפוקסי"
        }
        elseif ($name -like "*פלסטיק*" -or $name -like "*שקוף*") {
            $p.subcategory = "בתי מזוזה מפלסטיק"
        }
        elseif ($name -like "*קלף*" -and $name -like "*מזוז*") {
            $p.subcategory = "מזוזות"
        }
        elseif ($name -like "*מזוז*") {
            $p.subcategory = "בתי מזוזה"
        }
        elseif ($name -like "*תורה*") {
            $p.subcategory = "ספר תורה"
        }
        else {
            $p.subcategory = "תפילין"
        }
        $countUpdated++
        continue
    }
}

Write-Host "Processed and updated $countUpdated products."

# Save updated products_data.js
$newJson = $products | ConvertTo-Json -Depth 10
$newJsContent = "window.PRODUCTS_DATA = " + $newJson + ";"
[System.IO.File]::WriteAllText($filePath, $newJsContent, $utf8)
Write-Host "Successfully saved products_data.js!"
