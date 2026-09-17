$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$widgetPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\floating_cart.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$indexContent = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)
$widgetHtml = [System.IO.File]::ReadAllText($widgetPath, $utf8NoBOM)

$pattern = '(?s)<div id="floating-cart-btn-wrapper".*?</div>\s*</div>'
if ($indexContent -match $pattern) {
    $indexContent = [regex]::Replace($indexContent, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $widgetHtml.Trim() })
    Write-Host "Replaced floating cart widget with clean UTF-8 HTML."
} else {
    Write-Host "Pattern match failed, trying simple wrapper replace..."
    $pattern2 = '(?s)<div id="floating-cart-btn-wrapper".*?</div>'
    if ($indexContent -match $pattern2) {
        $indexContent = [regex]::Replace($indexContent, $pattern2, [System.Text.RegularExpressions.MatchEvaluator]{ return $widgetHtml.Trim() })
        Write-Host "Replaced floating cart widget using pattern2."
    }
}

[System.IO.File]::WriteAllText($indexPath, $indexContent, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $indexContent, $utf8NoBOM)
Write-Host "Injected clean floating cart widget and synced successfully."
