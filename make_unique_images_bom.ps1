$utf8BOM = New-Object System.Text.UTF8Encoding($true)
$psCode = Get-Content -Raw "C:\Users\97254\.gemini\antigravity\scratch\oz-store\build_unique_images_articles.ps1"
$targetScript = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\run_unique_images_builder.ps1"
[System.IO.File]::WriteAllText($targetScript, $psCode, $utf8BOM)
Write-Host "Saved run_unique_images_builder.ps1 with UTF-8 BOM!"
