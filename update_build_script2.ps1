$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$path = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\build_master_site.ps1'
$content = [System.IO.File]::ReadAllText($path, $utf8NoBOM)

# 1. Add $cleanRender ReadAllText line at top
$target1 = '$pagesCode = [System.IO.File]::ReadAllText(''C:\Users\97254\.gemini\antigravity\scratch\oz-store\pages_code.js'', $utf8NoBOM)'
$replacement1 = $target1 + "`n" + '$cleanRender = [System.IO.File]::ReadAllText(''C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js'', $utf8NoBOM)'

if ($content.Contains($target1)) {
    $content = $content.Replace($target1, $replacement1)
    Write-Host "Added `$cleanRender ReadAllText line."
}

# 2. Replace inline JS functions from startAutoScrollCarousels to end of handleSearch with $cleanRender
$pattern = '(?s)function startAutoScrollCarousels\(\).*?function handleSearch\(q\)\s*\{.*?\}'
if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, '$cleanRender')
    Write-Host "Replaced inline render functions with `$cleanRender."
}

[System.IO.File]::WriteAllText($path, $content, $utf8NoBOM)
Write-Host "build_master_site.ps1 updated with clean_render.js module!"
