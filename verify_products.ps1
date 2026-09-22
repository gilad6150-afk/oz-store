$prodFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js'
$feedFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\google_merchant_feed.xml'
$indexFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'

if (Test-Path $prodFile) {
    $content = [System.IO.File]::ReadAllText($prodFile, [System.Text.Encoding]::UTF8)
    $idMatches = [regex]::Matches($content, 'id:\s*["'']([^"'']+)["'']')
    Write-Host "products_data.js contains $($idMatches.Count) products!"
    
    # Categorization breakdown
    $tzitzitCount = ([regex]::Matches($content, 'category:\s*["'']tzitzit["'']')).Count
    $tallitCount = ([regex]::Matches($content, 'category:\s*["'']tallit["'']')).Count
    $coversCount = ([regex]::Matches($content, 'category:\s*["'']covers["'']|כיסוי')).Count
    $stringsCount = ([regex]::Matches($content, 'category:\s*["'']strings["'']|פתיל')).Count
    Write-Host "  - Tzitzit: $tzitzitCount"
    Write-Host "  - Tallit: $tallitCount"
    Write-Host "  - Covers: $coversCount"
    Write-Host "  - Strings/Accessories: $stringsCount"
} else {
    Write-Host "products_data.js not found"
}

if (Test-Path $feedFile) {
    $feedContent = [System.IO.File]::ReadAllText($feedFile, [System.Text.Encoding]::UTF8)
    $feedItems = ([regex]::Matches($feedContent, '<item>')).Count
    Write-Host "google_merchant_feed.xml contains $feedItems items!"
} else {
    Write-Host "google_merchant_feed.xml not found"
}

if (Test-Path $indexFile) {
    $idxContent = [System.IO.File]::ReadAllText($indexFile, [System.Text.Encoding]::UTF8)
    Write-Host "index.html size: $($idxContent.Length) bytes."
}
