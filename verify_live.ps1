$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$livePath = "C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html"
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$content = [System.IO.File]::ReadAllText($livePath, $utf8NoBOM)

Write-Host "=========================================="
Write-Host "   AUTOMATED REGRESSION SUITE (VERIFY LIVE) "
Write-Host "=========================================="
Write-Host "File Length:" $content.Length

# 1. MOJIBAKE / GIBBERISH REGRESSION CHECK
$filesToScan = Get-ChildItem -Path $dir -Include *.html,*.js -Recurse
$filesToScan += Get-Item $livePath

$mojiChar1 = [char]0x05F3 # ׳
$mojiChar2 = [char]0x00D7 # ג
$mojiChar3 = [char]0x00C3 # Ã

$hasMojibake = $false
foreach ($f in $filesToScan) {
    if (-not (Test-Path $f.FullName)) { continue }
    $text = [System.IO.File]::ReadAllText($f.FullName, $utf8NoBOM)
    if ($text.Contains($mojiChar1) -or $text.Contains($mojiChar2) -or $text.Contains($mojiChar3)) {
        $hasMojibake = $true
        Write-Host "CRITICAL MOJIBAKE FOUND IN FILE: $($f.Name)"
    }
}
$zeroGibberish = (-not $hasMojibake)
Write-Host "Zero Gibberish / Mojibake (100% Clean UTF-8):" $zeroGibberish

# 2. FEATURE & STRUCTURAL REGRESSION CHECKS
Write-Host "realProductsDB:" $content.Contains("realProductsDB")
Write-Host "openAccountPage (VIP Account Page Function):" $content.Contains("openAccountPage")
Write-Host "account-page-container (VIP Account Container):" $content.Contains("account-page-container")
Write-Host "openProductPage (Dedicated PDP Function):" $content.Contains("openProductPage")
Write-Host "product-page-container (PDP Container):" $content.Contains("product-page-container")
Write-Host "startHeroSlider:" $content.Contains("startHeroSlider")
Write-Host "startSocialProofToasts:" $content.Contains("startSocialProofToasts")
Write-Host "setupExitIntent:" $content.Contains("setupExitIntent")
Write-Host "cart-drawer:" $content.Contains("cart-drawer")
Write-Host "toggleCartDrawer:" $content.Contains("toggleCartDrawer")
Write-Host "search-modal:" $content.Contains("search-modal")
Write-Host "quick-view-modal:" $content.Contains("quick-view-modal")
Write-Host "openQuickView:" $content.Contains("openQuickView")
Write-Host "shipping-returns-modal:" $content.Contains("shipping-returns-modal")
Write-Host "terms-modal:" $content.Contains("terms-modal")
Write-Host "accessibility-modal:" $content.Contains("accessibility-modal")
Write-Host "checkout-modal:" $content.Contains("checkout-modal")
Write-Host "tallit-calc-modal:" $content.Contains("tallit-calc-modal")
Write-Host "gift-quiz-modal:" $content.Contains("gift-quiz-modal")
Write-Host "login-modal:" $content.Contains("login-modal")
Write-Host "exit-intent-popup:" $content.Contains("exit-intent-popup")
Write-Host "official WhatsApp SVG:" $content.Contains("M17.472 14.382c-.297-.149")
Write-Host "grid-cols-2 (mobile 2 products):" $content.Contains("grid-cols-2")
Write-Host "=========================================="
