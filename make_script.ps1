# Save as UTF-8 with BOM so PowerShell parser handles Hebrew literals cleanly
$utf8BOM = New-Object System.Text.UTF8Encoding($true)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$scriptContent = @'
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

    # 1. טליות וציציות (tallitot-tzitzit)
    if ($cat -eq "tallitot-tzitzit" -or $name.Contains("טלית") -or $name.Contains("ציצית")) {
        $p.category = "tallitot-tzitzit"
        $p.category_name = "טליות וציציות"
        
        if ($name.Contains("ציצית") -or $name.Contains("גופיית") -or $name.Contains("Dry-Fit") -or $sub.Contains("ציציות")) {
            $p.subcategory = "ציציות"
        } else {
            $p.subcategory = "טליתות"
        }
        $countUpdated++
        continue
    }

    # 2. מתנות ויודאיקה (gifts) - includes Rabbinical art, Shmec fragrances, Wallets, Judaica gifts
    if ($cat -eq "gifts" -or $cat -eq "wallets" -or $name.Contains("ארנק") -or $name.Contains("תמונה") -or $name.Contains("בשמים") -or $sku.StartsWith("OZ-SHM-")) {
        $p.category = "gifts"
        $p.category_name = "מתנות ויודאיקה"
        
        if ($sku.StartsWith("OZ-SHM-") -or $name.Contains("בשמים") -or $name.Contains("להבדלה")) {
            $p.subcategory = "בשמים וריחות להבדלה"
        }
        elseif ($cat -eq "wallets" -or $name.Contains("ארנק")) {
            $p.subcategory = "ארנקים לגבר"
        }
        elseif ($name.Contains("תמונה") -or $name.Contains("קנבס") -or $name.Contains("זכוכית") -or $id -ge 10000 -or $name.Contains("מרן") -or $name.Contains("הרב")) {
            $p.subcategory = "תמונות זכוכית וקנבס"
        }
        else {
            $p.subcategory = "מארזים ומתנות יודאיקה"
        }
        $countUpdated++
        continue
    }

    # 3. תיקים לטלית ותפילין (tefillin-bags)
    if ($cat -eq "tefillin-bags" -or $name.Contains("תיק") -or $name.Contains("כיסוי") -or $name.Contains("תפדנית")) {
        $p.category = "tefillin-bags"
        $p.category_name = "תיקים לטלית ותפילין"
        
        if ($name.Contains("תפדנית") -or $name.Contains("דק קטן") -or ($name.Contains("לתפילין") -and -not $name.Contains("טלית"))) {
            $p.subcategory = "תיקים לתפילין"
        } else {
            $p.subcategory = "כיסוי טלית ותפילין"
        }
        $countUpdated++
        continue
    }

    # 4. ספרי קודש (books)
    if ($cat -eq "books" -or $name.Contains("ספר") -or $name.Contains("סידור") -or $name.Contains("תהילים") -or $name.Contains("חומש")) {
        $p.category = "books"
        $p.category_name = "ספרי קודש"
        $p.subcategory = "ספרי קודש וסידורים"
        $countUpdated++
        continue
    }

    # 5. תשמישי קדושה וסת"ם (stam / mezuzot)
    if ($cat -eq "stam" -or $cat -eq "mezuzot" -or $name.Contains("מזוזה") -or $name.Contains("תפילין") -or $name.Contains("תורה")) {
        $p.category = "stam"
        $p.category_name = "תשמישי קדושה וסת`"ם"
        
        if ($name.Contains("אלומיניום") -or $name.Contains("מוברש")) {
            $p.subcategory = "בתי מזוזה מאלומיניום"
        }
        elseif ($name.Contains("אפוקסי") -or $name.Contains("יציקה")) {
            $p.subcategory = "בתי מזוזה מאפוקסי"
        }
        elseif ($name.Contains("פלסטיק") -or $name.Contains("שקוף")) {
            $p.subcategory = "בתי מזוזה מפלסטיק"
        }
        elseif ($name.Contains("קלף") -and $name.Contains("מזוז")) {
            $p.subcategory = "מזוזות"
        }
        elseif ($name.Contains("מזוז")) {
            $p.subcategory = "בתי מזוזה"
        }
        elseif ($name.Contains("תורה")) {
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
[System.IO.File]::WriteAllText($filePath, $newJsContent, $utf8NoBOM)
Write-Host "Successfully saved products_data.js!"
'@

$targetPath = Join-Path $dir "apply_categorization.ps1"
[System.IO.File]::WriteAllText($targetPath, $scriptContent, $utf8BOM)
Write-Host "Created apply_categorization.ps1 with UTF-8 BOM!"
