$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$fileContent = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js', $utf8NoBOM)
$lines = $fileContent -split "`n"

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match 'name:\s*"([^"]+)"' -or $line -match "name:\s*'([^']+)'") {
        Write-Host "Line $($i+1): $line"
    }
}
