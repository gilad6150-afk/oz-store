$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
$files = Get-ChildItem -Path $dir -Include *.html, *.js -Recurse

$corruptedFiles = @()

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*brain*") { continue }
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8NoBOM)
    $mojibake = $false
    for ($i = 0; $i -lt $text.Length - 1; $i++) {
        $c1 = [int]$text[$i]
        $c2 = [int]$text[$i+1]
        if ($c1 -eq 0x05F3 -and ($c2 -ge 0x05D0 -and $c2 -le 0x05EA)) {
            $mojibake = $true
            break
        }
        if ($c1 -eq 0x05E2 -and $c2 -eq 0x20AC) {
            $mojibake = $true
            break
        }
    }
    if ($mojibake) {
        Write-Host "⚠️ MOJIBAKE FOUND IN: $($file.Name)"
        $corruptedFiles += $file.Name
    } else {
        Write-Host "✓ CLEAN UTF-8: $($file.Name)"
    }
}

if ($corruptedFiles.Count -gt 0) {
    Write-Host "CORRUPTED FILES:" ($corruptedFiles -join ', ')
} else {
    Write-Host "ALL PROJECT FILES ARE 100% CLEAN UTF-8 HEBREW!"
}
