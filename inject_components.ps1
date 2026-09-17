$indexPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$modalsPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\modals.html"
$jsPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\pages_code.js"

$indexContent = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$modalsContent = [System.IO.File]::ReadAllText($modalsPath, [System.Text.Encoding]::UTF8)
$jsContent = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)

# 1. Update Cart Checkout Button to open openCheckoutModal()
$indexContent = $indexContent.Replace('onclick="alert(''מעבר לתשלום מאובטח בקליק!'')"', 'onclick="toggleCartDrawer(); openCheckoutModal();"')

# 2. Inject Modals before </footer>
$indexContent = $indexContent.Replace('<footer id="footer"', $modalsContent + "`n`n    <footer id=\"footer\"")

# 3. Update Footer Quick Links to include Shipping, Terms, Accessibility
$footerNavOld = @"
                <h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">ניווט מהיר</h4>
                <ul class="space-y-2.5 text-xs font-semibold text-slate-300">
                    <li><a href="#shop" onclick="filterCategory('stam')" class="hover:text-purple-300 transition-colors">תשמישי קדושה וסת"ם</a></li>
                    <li><a href="#shop" onclick="filterCategory('wallets')" class="hover:text-purple-300 transition-colors">תיקים וארנקים</a></li>
                    <li><a href="#shop" onclick="filterCategory('tallitot-tzitzit')" class="hover:text-purple-300 transition-colors">טליתות וציציות</a></li>
                    <li><a href="#shop" onclick="filterCategory('books')" class="hover:text-purple-300 transition-colors">ספרי קודש וסידורים</a></li>
                    <li><a href="#shop" onclick="filterCategory('gifts')" class="hover:text-purple-300 transition-colors">מתנות ויודאיקה</a></li>
                </ul>
"@

$footerNavNew = @"
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

$indexContent = $indexContent.Replace($footerNavOld, $footerNavNew)

# 4. Inject JS code before function initApp()
$indexContent = $indexContent.Replace('function initApp()', $jsContent + "`n`n        function initApp()")

# Save UTF-8 clean
[System.IO.File]::WriteAllText($indexPath, $indexContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully injected Modals, Checkout Page, Accessibility Widget & Footer Navigation into index.html!"
