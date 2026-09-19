$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$renderPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js'
$content = [System.IO.File]::ReadAllText($renderPath, $utf8NoBOM)

if ($content.Contains('15% הנחה')) {
    $content = $content.Replace('15% הנחה', '10% הנחה')
    [System.IO.File]::WriteAllText($renderPath, $content, $utf8NoBOM)
    Write-Host "Strictly capped all discounts in clean_render.js to a maximum of 10%!"
} else {
    Write-Host "All discounts already capped at maximum 10%."
}
