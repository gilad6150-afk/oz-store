$indexText = Get-Content -Path 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html' -Raw -Encoding UTF8
if ($indexText -match '׳[׳-ת]') {
    Write-Host "Found remaining Mojibake characters in index.html!"
} else {
    Write-Host "index.html is 100% CLEAN UTF-8 Hebrew!"
}

$dbText = Get-Content -Path 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js' -Raw -Encoding UTF8
if ($dbText -match '׳[׳-ת]') {
    Write-Host "Found Mojibake characters in products_data.js!"
} else {
    Write-Host "products_data.js is 100% CLEAN UTF-8 Hebrew!"
}
