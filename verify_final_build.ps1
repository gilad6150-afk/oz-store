$utf8 = [System.Text.Encoding]::UTF8
$text = [System.IO.File]::ReadAllText("C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html", $utf8)
$lines = $text -split "`n" | Where-Object { $_ -match "filterSubcategory" }
Write-Host "Found $($lines.Count) filterSubcategory references in index.html:"
$lines | Select-Object -First 6 | ForEach-Object { Write-Host $_.Trim() }
