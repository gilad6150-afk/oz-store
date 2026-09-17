$content = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js', [System.Text.Encoding]::UTF8)

# Parse JSON array
$startIdx = $content.IndexOf('const realProductsDB = [')
$endIdx = $content.IndexOf('];', $startIdx)
$jsonStr = $content.Substring($startIdx + 23, $endIdx - $startIdx - 23 + 1)
$products = ConvertFrom-Json $jsonStr

$categories = @('all', 'stam', 'wallets', 'tallitot-tzitzit', 'mezuzot', 'books', 'gifts')

foreach ($cat in $categories) {
    $filtered = $products | Where-Object {
        $p = $_
        if ($cat -ne 'all') {
            $pCat = if ($p.category) { $p.category.ToLower() } else { '' }
            $pName = if ($p.name) { $p.name.ToLower() } else { '' }
            $pCatName = if ($p.category_name) { $p.category_name.ToLower() } else { '' }

            if ($cat -eq 'stam') {
                $isStam = ($pCat -eq 'stam') -or ($pCat -eq 'tefillin') -or ($pCat -eq 'all') -or ($pName -like '*תפילין*') -or ($pName -like '*סופר*') -or ($pName -like '*סת"*') -or ($pName -like '*סתם*') -or ($pName -like '*קלף*')
                if (-not $isStam) { return $false }
            }
            elseif ($cat -eq 'wallets') {
                $isWallet = ($pCat -eq 'wallets') -or ($pCatName -like '*ארנק*') -or ($pCatName -like '*תיק*') -or ($pName -like '*ארנק*') -or ($pName -like '*תיק*')
                if (-not $isWallet) { return $false }
            }
            elseif ($cat -eq 'tallitot-tzitzit') {
                $isTallit = ($pCat -eq 'tallitot-tzitzit') -or ($pCatName -like '*טלית*') -or ($pCatName -like '*ציצית*') -or ($pName -like '*טלית*') -or ($pName -like '*ציצית*')
                if (-not $isTallit) { return $false }
            }
            elseif ($cat -eq 'mezuzot') {
                $isMezuzah = ($pCat -eq 'mezuzot') -or ($pCatName -like '*מזוז*') -or ($pName -like '*מזוז*')
                if (-not $isMezuzah) { return $false }
            }
            elseif ($cat -eq 'books') {
                $isBook = ($pCat -eq 'books') -or ($pCatName -like '*ספר*') -or ($pCatName -like '*סידור*') -or ($pName -like '*ספר*') -or ($pName -like '*סידור*') -or ($pName -like '*חומש*') -or ($pName -like '*תהילים*')
                if (-not $isBook) { return $false }
            }
            elseif ($cat -eq 'gifts') {
                $isGift = ($pCat -eq 'gifts') -or ($pCat -eq 'sets') -or ($pCatName -like '*מתנ*') -or ($pCatName -like '*מארז*') -or ($pName -like '*מתנה*') -or ($pName -like '*מארז*') -or ($pName -like '*סט*')
                if (-not $isGift) { return $false }
            }
        }
        return $true
    }
    Write-Host "Category '$cat': $($filtered.Count) products"
}
