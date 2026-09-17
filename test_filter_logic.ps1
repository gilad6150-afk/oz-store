$content = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js', [System.Text.Encoding]::UTF8)

# Parse JSON array from products_data.js
$jsonStr = $content.Substring($content.IndexOf('['))
$products = ConvertFrom-Json $jsonStr

Write-Host "Total products in DB:" $products.Count

$categories = @('all', 'stam', 'wallets', 'tallitot-tzitzit', 'mezuzot', 'books', 'gifts')

foreach ($cat in $categories) {
    $filtered = $products | Where-Object {
        $p = $_
        if ($cat -ne 'all') {
            if ($cat -eq 'stam') {
                if ($p.category -ne 'tefillin' -and $p.category -ne 'all' -and $p.name -notlike '*סופר*' -and $p.name -notlike '*סת"ם*' -and $p.name -notlike '*תפילין*') { return $false }
            }
            elseif ($cat -eq 'wallets') {
                if ($p.category -ne 'wallets') { return $false }
            }
            elseif ($cat -eq 'tallitot-tzitzit') {
                if ($p.category -ne 'tallitot-tzitzit') { return $false }
            }
            elseif ($cat -eq 'mezuzot') {
                if ($p.category -ne 'mezuzot') { return $false }
            }
            elseif ($cat -eq 'books') {
                if ($p.category -ne 'books') { return $false }
            }
            elseif ($cat -eq 'gifts') {
                if ($p.category -ne 'gifts' -and $p.category -ne 'sets') { return $false }
            }
        }
        return $true
    }
    Write-Host "Category '$cat': $($filtered.Count) products"
}
