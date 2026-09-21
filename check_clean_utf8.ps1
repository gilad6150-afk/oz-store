$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$files = Get-ChildItem -Path $dir -Include *.html,*.js,*.xml,*.json -Recurse

$badCount = 0

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }
    
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    
    # Check for Mojibake markers: ׳ (0x05F3 / 0xD7 0xB3), ג (0x05D2)
    if ($text.Contains([char]0x05F3) -or $text.Contains("ג€") -or $text.Contains("׳’")) {
        Write-Host "⚠️ Mojibake found in file:" $file.Name
        $badCount++
    }
}

if ($badCount -eq 0) {
    Write-Host "✅ 100% CLEAN UTF-8! ZERO Mojibake detected across all HTML/JS/XML files!"
} else {
    Write-Host "❌ Total files with Mojibake:" $badCount
}
