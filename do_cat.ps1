$raw = Get-Content -Path 'products_data.js' -Raw -Encoding UTF8
$idx = $raw.IndexOf('[')
$lastIdx = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($idx, $lastIdx - $idx + 1)
$products = $jsonStr | ConvertFrom-Json

$wallets = 0
$bags = 0

foreach ($p in $products) {
    if ($p.name -match 'ארנק') {
        $p.category = 'wallets'
        $p.category_name = 'ארנקים לגבר'
        $wallets++
    } elseif ($p.name -match 'תיק|נרתיק|כיסוי') {
        $p.category = 'tefillin-bags'
        $p.category_name = 'תיקים לתפילין וטלית'
        $bags++
    }
}

Write-Host ('Updated Wallets: ' + $wallets + ' | Tefillin Bags: ' + $bags)

$newJson = $products | ConvertTo-Json -Depth 10
$newContent = 'const realProductsDB = ' + $newJson + ';'
[System.IO.File]::WriteAllText('products_data.js', $newContent, [System.Text.Encoding]::UTF8)
