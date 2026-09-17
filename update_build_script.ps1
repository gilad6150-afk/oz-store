$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$path = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\build_master_site.ps1'
$content = [System.IO.File]::ReadAllText($path, $utf8NoBOM)

# 1. Add $footer ReadAllText at top
$target1 = '$modals = [System.IO.File]::ReadAllText(''C:\Users\97254\.gemini\antigravity\scratch\oz-store\modals.html'', $utf8NoBOM)'
$replacement1 = '$footer = [System.IO.File]::ReadAllText(''C:\Users\97254\.gemini\antigravity\scratch\oz-store\footer.html'', $utf8NoBOM)' + "`n" + $target1

if ($content.Contains($target1)) {
    $content = $content.Replace($target1, $replacement1)
    Write-Host "Added `$footer ReadAllText line."
}

# 2. Replace hardcoded footer block with $footer
$pattern = '(?s)<!-- MASTER PURPLE & WHITE FOOTER -->.*?</footer>'
if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, '$footer')
    Write-Host "Replaced hardcoded footer HTML with `$footer variable."
}

[System.IO.File]::WriteAllText($path, $content, $utf8NoBOM)
Write-Host "build_master_site.ps1 updated successfully!"
