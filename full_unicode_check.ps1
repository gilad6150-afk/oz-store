$dir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
$files = Get-ChildItem -Path $dir -Include *.html,*.js -Recurse

$foundError = $false

foreach ($f in $files) {
    if ($f.FullName -like "*node_modules*" -or $f.FullName -like "*.git*") { continue }
    
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    
    # Check for BOM
    $hasBOM = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    if ($hasBOM) {
        Write-Host "WARNING: FILE HAS UTF-8 BOM (Might cause header issues):" $f.Name
    }

    # Convert bytes using UTF8
    $str = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    # Check for common Mojibake markers: '׳' followed by ascii/heb or 'Ã' or ''
    if ($str.Contains([char]65533)) {
        Write-Host "CRITICAL: REPLACEMENT CHARACTER (EF BF BD) IN FILE:" $f.Name
        $foundError = $true
    }
    
    if ($str.Contains('ג—') -or $str.Contains('ג†') -or $str.Contains('ג€') -or $str.Contains('Ã—')) {
        Write-Host "CRITICAL: MOJIBAKE CHARACTERS FOUND IN FILE:" $f.Name
        $foundError = $true
    }
}

if (-not $foundError) {
    Write-Host "ALL FILES CLEARED FULL UNICODE & MOJIBAKE AUDIT!"
}
