$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$dir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
$live = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$files = Get-ChildItem -Path $dir -Include *.html,*.js,*.ps1 -Recurse
$files += Get-Item $live

foreach ($file in $files) {
    if (-not (Test-Path $file.FullName)) { continue }
    $lines = [System.IO.File]::ReadAllLines($file.FullName, $utf8NoBOM)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        # Check for UTF-8 Mojibake / bad encoding characters or double-encoded UTF-8 symbols
        if ($line -match '׳' -or $line -match '×' -or $line -match 'ײ' -or $line -match 'Ã' -or $line -match '¿' -or $line -match '½' -or $line -match 'â' -or $line -match 'ï') {
            Write-Host "MOJIBAKE FOUND in $($file.Name) at line $($i+1): $($line.Substring(0, [Math]::Min(120, $line.Length)))"
        }
    }
}
Write-Host "Scan completed!"
