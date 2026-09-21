$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$utf8BOM = New-Object System.Text.UTF8Encoding($true)

$scratchIndex = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$txt = [System.IO.File]::ReadAllText($scratchIndex, $utf8NoBOM)

$destinations = @(
    'C:\Users\97254\Desktop\oz_store_live_site.html',
    'C:\Users\97254\Desktop\oz_store_live_ui.html',
    'C:\Users\97254\Desktop\index.html',
    'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html',
    'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_app_preview.html',
    'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_new_site_preview.html',
    'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_site.html'
)

foreach ($dest in $destinations) {
    [System.IO.File]::WriteAllText($dest, $txt, $utf8BOM)
    Write-Host "Saved UTF-8 BOM file:" $dest
}

Write-Host "✅ All local desktop and preview files written with UTF-8 BOM!"
