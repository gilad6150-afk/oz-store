$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$lines = [System.IO.File]::ReadAllLines('C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js', $utf8NoBOM)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function\s+(\w+)') {
        Write-Host "L$($i+1): $($Matches[1])"
    }
}
