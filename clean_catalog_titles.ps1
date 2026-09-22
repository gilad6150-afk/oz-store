$jsonPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\mishkan_catalog_preview.json'
$labelsPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\labels.json'

$rawJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$catalog = $rawJson | ConvertFrom-Json

$rawLabels = [System.IO.File]::ReadAllText($labelsPath, [System.Text.Encoding]::UTF8)
$L = $rawLabels | ConvertFrom-Json

$cleanedCatalog = [System.Collections.Generic.List[PSCustomObject]]::new()
$badCount = 0

foreach ($item in $catalog) {
    $title = $item.title
    
    if ($title -match '[\{\}\:\;]|nav-link|mega-menu|media|width|padding' -or $title.Length -gt 80) {
        $badCount++
        $hebrewMatches = [regex]::Matches($title, '[\u0590-\u05FF\s"\''\-\–\(\)]+')
        $cleanT = ""
        foreach ($hm in $hebrewMatches) {
            $t = $hm.Value.Trim()
            if ($t.Length -gt $cleanT.Length -and $t -notmatch 'css|menu|nav') {
                $cleanT = $t
            }
        }
        if (-not $cleanT -or $cleanT.Length -lt 3) {
            $cleanT = $L.defaultTitle
        }
        $title = $cleanT
    }

    $item.title = $title
    $cleanedCatalog.Add($item)
}

Write-Host "Cleaned $badCount titles in catalog."

$catalogJson = $cleanedCatalog | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($jsonPath, $catalogJson, [System.Text.Encoding]::UTF8)
Write-Host "Re-saved mishkan_catalog_preview.json with clean titles!"
