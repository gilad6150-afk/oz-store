[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

Write-Host "=========================================================="
Write-Host "RE-CLASSIFYING ALL 613 PRODUCTS ACCORDING TO USER SPEC"
Write-Host "=========================================================="

$rulesJson = [System.IO.File]::ReadAllText((Join-Path $dir "cat_rules.json"), $utf8) | ConvertFrom-Json

$productsPath = Join-Path $dir "products_data.js"
$jsContent = [System.IO.File]::ReadAllText($productsPath, $utf8)

$startIdx = $jsContent.IndexOf('[')
$endIdx = $jsContent.LastIndexOf(']')
$jsonText = $jsContent.Substring($startIdx, $endIdx - $startIdx + 1)

$products = $jsonText | ConvertFrom-Json

function Match-Any ($text, $words) {
    if (-not $text) { return $false }
    foreach ($w in $words) {
        if ($text.Contains($w)) { return $true }
    }
    return $false
}

function Set-Prop ($obj, $propName, $val) {
    $obj | Add-Member -NotePropertyName $propName -NotePropertyValue $val -Force
}

$countUpdated = 0

foreach ($p in $products) {
    $cat = "" + $p.category
    $name = "" + $p.name
    $sub = "" + $p.subcategory
    $sku = "" + $p.sku
    $permalink = "" + $p.permalink
    $id = [int]$p.id

    # 1. Tallitot & Tzitzit
    if ($cat -eq "tallitot-tzitzit" -or (Match-Any $name $rulesJson.tallitot_tzitzit.tzitzit_words) -or $name.Contains("tallit") -or $name.Contains("tzitzit") -or $p.category_name -like "*טליות*") {
        Set-Prop $p "category" $rulesJson.tallitot_tzitzit.key
        Set-Prop $p "category_name" $rulesJson.tallitot_tzitzit.cat_name
        
        if ((Match-Any $name $rulesJson.tallitot_tzitzit.tzitzit_words) -or (Match-Any $sub $rulesJson.tallitot_tzitzit.tzitzit_words)) {
            Set-Prop $p "subcategory" $rulesJson.tallitot_tzitzit.sub_tzitzit
        } else {
            Set-Prop $p "subcategory" $rulesJson.tallitot_tzitzit.sub_tallitot
        }
        $countUpdated++
        continue
    }

    # 2. Gifts & Judaica (including rabbinic art, fragrances, wallets, judaica gifts)
    if ($cat -eq "gifts" -or $cat -eq "wallets" -or $sku.StartsWith("OZ-TMN-") -or $permalink.Contains("/tr-") -or $id -ge 10000 -or (Match-Any $name $rulesJson.gifts.wallet_words) -or (Match-Any $name $rulesJson.gifts.picture_words) -or (Match-Any $name $rulesJson.gifts.fragrance_words) -or $sku.StartsWith("OZ-SHM-")) {
        Set-Prop $p "category" $rulesJson.gifts.key
        Set-Prop $p "category_name" $rulesJson.gifts.cat_name
        
        if ($sku.StartsWith("OZ-SHM-") -or (Match-Any $name $rulesJson.gifts.fragrance_words)) {
            Set-Prop $p "subcategory" $rulesJson.gifts.sub_fragrance
        }
        elseif ($cat -eq "wallets" -or (Match-Any $name $rulesJson.gifts.wallet_words)) {
            Set-Prop $p "subcategory" $rulesJson.gifts.sub_wallets
        }
        elseif ($sku.StartsWith("OZ-TMN-") -or $permalink.Contains("/tr-") -or $id -ge 10000 -or (Match-Any $name $rulesJson.gifts.picture_words)) {
            Set-Prop $p "subcategory" $rulesJson.gifts.sub_pictures
        }
        else {
            Set-Prop $p "subcategory" $rulesJson.gifts.sub_gifts
        }
        $countUpdated++
        continue
    }

    # 3. Tefillin & Tallit Bags
    if ($cat -eq "tefillin-bags" -or $p.category_name -like "*תיקים*" -or (Match-Any $name $rulesJson.tefillin_bags.single_words)) {
        Set-Prop $p "category" $rulesJson.tefillin_bags.key
        Set-Prop $p "category_name" $rulesJson.tefillin_bags.cat_name
        
        if ((Match-Any $name $rulesJson.tefillin_bags.single_words) -or ($p.category_name -like "*לתפילין*" -and $name -notlike "*טלית*")) {
            Set-Prop $p "subcategory" $rulesJson.tefillin_bags.sub_single
        } else {
            Set-Prop $p "subcategory" $rulesJson.tefillin_bags.sub_combined
        }
        $countUpdated++
        continue
    }

    # 4. Holy Books & Siddurim
    if ($cat -eq "books" -or (Match-Any $name $rulesJson.books.book_words)) {
        Set-Prop $p "category" $rulesJson.books.key
        Set-Prop $p "category_name" $rulesJson.books.cat_name
        Set-Prop $p "subcategory" $rulesJson.books.sub_books
        $countUpdated++
        continue
    }

    # 5. STAM & Mezuzot
    if ($cat -eq "stam" -or $cat -eq "mezuzot" -or (Match-Any $name $rulesJson.stam.case_words) -or (Match-Any $name $rulesJson.stam.tefillin_words) -or (Match-Any $name $rulesJson.stam.torah_words)) {
        Set-Prop $p "category" $rulesJson.stam.key
        Set-Prop $p "category_name" $rulesJson.stam.cat_name
        
        if (Match-Any $name $rulesJson.stam.alum_words) {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_alum
        }
        elseif (Match-Any $name $rulesJson.stam.epoxy_words) {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_epoxy
        }
        elseif (Match-Any $name $rulesJson.stam.plastic_words) {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_plastic
        }
        elseif (Match-Any $name $rulesJson.stam.parchment_words) {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_mezuzot
        }
        elseif (Match-Any $name $rulesJson.stam.case_words) {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_cases
        }
        elseif (Match-Any $name $rulesJson.stam.torah_words) {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_torah
        }
        else {
            Set-Prop $p "subcategory" $rulesJson.stam.sub_tefillin
        }
        $countUpdated++
        continue
    }
}

Write-Host "`nSuccessfully updated $countUpdated products."

# Save updated products_data.js
$newJson = $products | ConvertTo-Json -Depth 10
$newJsContent = "window.PRODUCTS_DATA = " + $newJson + ";"
[System.IO.File]::WriteAllText($productsPath, $newJsContent, $utf8)
Write-Host "Successfully saved products_data.js!"
