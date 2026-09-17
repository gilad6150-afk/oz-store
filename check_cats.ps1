$content = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\products_data.js', [System.Text.Encoding]::UTF8)
$regex = [regex]'"category":\s*"([^"]+)"'
$matches = $regex.Matches($content)
$cats = @{}
foreach ($m in $matches) {
    $cat = $m.Groups[1].Value
    if (-not $cats.ContainsKey($cat)) { $cats[$cat] = 0 }
    $cats[$cat]++
}
Write-Host "Total matched products:" $matches.Count
$cats.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "$($_.Key): $($_.Value)"
}
