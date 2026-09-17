$text = Get-Content 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html' -Raw -Encoding UTF8
$lines = $text -split "\r?\n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match '[ÃÂÃâ€œגœ]') {
        Write-Output "$($i + 1): $line"
    }
}
