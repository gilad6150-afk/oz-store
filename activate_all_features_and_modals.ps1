$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$content = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)

# 1. Position purchase-toast at bottom-24 left-6 to prevent overlap with floating cart button
$oldToastPattern = 'id="purchase-toast" class="[^"]*"'
$newToastClass = 'id="purchase-toast" class="fixed bottom-24 left-6 z-[99999] bg-white border border-purple-100 rounded-2xl p-4 shadow-2xl flex items-center gap-3 hidden animate-toast dir-rtl"'
if ($content -match $oldToastPattern) {
    $content = [regex]::Replace($content, $oldToastPattern, $newToastClass)
    Write-Host "Updated purchase-toast position to bottom-24 left-6."
}

# 2. Add setupExitIntent function if missing
$exitIntentJs = @"

        function setupExitIntent() {
            document.addEventListener('mouseleave', function(e) {
                if (e.clientY <= 10 && !state.exitIntentTriggered) {
                    state.exitIntentTriggered = true;
                    toggleModal('exit-intent-popup');
                }
            });
        }
"@

if ($content -notmatch 'function setupExitIntent') {
    $content = $content.Replace("function startSocialProofToasts()", $exitIntentJs + "`n`n        function startSocialProofToasts()")
    Write-Host "Added setupExitIntent function."
}

# 3. Update initApp to execute startSocialProofToasts(), setupExitIntent(), and startHeroSlider()
$oldInitApp = '(?s)function initApp\(\)\s*\{.*?\}'
$newInitApp = @"
function initApp() {
            renderProducts();
            renderArticles();
            updateWishlistBadge();
            updateUserLabel();
            updateCartUI();
            startAutoScrollCarousels();
            startSocialProofToasts();
            setupExitIntent();
            startHeroSlider();
        }
"@

if ($content -match $oldInitApp) {
    $content = [regex]::Replace($content, $oldInitApp, [System.Text.RegularExpressions.MatchEvaluator]{ return $newInitApp })
    Write-Host "Updated initApp to trigger Social Proof toasts, Exit-Intent, and Hero Slider."
}

[System.IO.File]::WriteAllText($indexPath, $content, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $content, $utf8NoBOM)
Write-Host "All features activated and synced to live UI successfully."
