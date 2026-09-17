$indexPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$modalsPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\modals.html"
$jsPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\pages_code.js"

$index = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$modals = [System.IO.File]::ReadAllText($modalsPath, [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)

# 1. Insert modals right before <footer
$footerPos = $index.IndexOf('<footer id="footer"')
if ($footerPos -gt 0) {
    $index = $index.Substring(0, $footerPos) + $modals + "`n`n    " + $index.Substring($footerPos)
}

# 2. Replace cart alert button
$cartPos = $index.IndexOf('onclick="alert(')
if ($cartPos -gt 0) {
    $endQuote = $index.IndexOf('"', $cartPos + 16)
    $index = $index.Substring(0, $cartPos) + 'onclick="toggleCartDrawer(); openCheckoutModal();"' + $index.Substring($endQuote + 1)
}

# 3. Insert JS before function initApp()
$initPos = $index.IndexOf('function initApp()')
if ($initPos -gt 0) {
    $index = $index.Substring(0, $initPos) + $js + "`n`n        " + $index.Substring($initPos)
}

# 4. Update footer quick links
$navStart = $index.IndexOf('ניווט מהיר</h4>')
if ($navStart -gt 0) {
    $h4Start = $index.LastIndexOf('<h4', $navStart)
    $ulEnd = $index.IndexOf('</ul>', $navStart) + 5
    $newNavBlock = @"
<h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">ניווט מהיר</h4>
                <ul class="space-y-2.5 text-xs font-semibold text-slate-300">
                    <li><a href="#shop" onclick="filterCategory('stam')" class="hover:text-purple-300 transition-colors">תשמישי קדושה וסת"ם</a></li>
                    <li><a href="#shop" onclick="filterCategory('wallets')" class="hover:text-purple-300 transition-colors">תיקים וארנקים</a></li>
                    <li><a href="#shop" onclick="filterCategory('tallitot-tzitzit')" class="hover:text-purple-300 transition-colors">טליתות וציציות</a></li>
                    <li><a href="#shipping-returns-modal" onclick="toggleModal('shipping-returns-modal')" class="hover:text-purple-300 transition-colors">🚚 משלוחים והחזרות</a></li>
                    <li><a href="#terms-modal" onclick="toggleModal('terms-modal')" class="hover:text-purple-300 transition-colors">📜 תנאים והגבלות (תקנון)</a></li>
                    <li><a href="#accessibility-modal" onclick="toggleModal('accessibility-modal')" class="hover:text-purple-300 transition-colors">♿ הצהרת נגישות</a></li>
                </ul>
"@
    $index = $index.Substring(0, $h4Start) + $newNavBlock + $index.Substring($ulEnd)
}

[System.IO.File]::WriteAllText($indexPath, $index, [System.Text.Encoding]::UTF8)
Write-Output "Successfully injected modals, checkout page, accessibility widget, and footer navigation!"
