$raw = Get-Content -Path "C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js" -Raw -Encoding UTF8
$start = $raw.IndexOf('[')
$end = $raw.IndexOf('];', $start)
$json = $raw.Substring($start, $end - $start + 1)
$items = $json | ConvertFrom-Json
$items | Group-Object category_name | Select-Object Name, Count | Format-Table -AutoSize
