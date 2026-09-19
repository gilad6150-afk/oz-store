$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

# 1. Update clean_nav.html to Option 2 (Clean White & Soft Purple Category Bar)
$navPath = Join-Path $dir "clean_nav.html"
$navText = [System.IO.File]::ReadAllText($navPath, $utf8NoBOM)

$navText = $navText -replace 'bg-\[#1E1B4B\] text-white shadow-inner border-t border-purple-950', 'bg-white text-[#1E1B4B] border-t border-b border-purple-100 shadow-sm'
$navText = $navText -replace 'text-slate-100', 'text-[#1E1B4B]'
$navText = $navText -replace 'hover:text-purple-300', 'hover:text-purple-700'
$navText = $navText -replace 'hover:bg-white/10', 'hover:bg-purple-50'
$navText = $navText -replace 'text-purple-300', 'text-purple-600'

[System.IO.File]::WriteAllText($navPath, $navText, $utf8NoBOM)
Write-Host "Option 2 applied to clean_nav.html"

# 2. Update animated_hero.html to Option 2 (Deep Royal Purple & Pure White CTA)
$heroPath = Join-Path $dir "animated_hero.html"
$heroText = [System.IO.File]::ReadAllText($heroPath, $utf8NoBOM)

$heroText = $heroText -replace 'from-\[#2E1065\] via-\[#1E1B4B\] to-\[#2E1065\]', 'from-[#1E1B4B] via-[#312E81] to-[#1E1B4B]'
$heroText = $heroText -replace 'from-\[#7C3AED\] via-\[#6D28D9\] to-\[#581C87\]', 'from-white via-purple-50 to-white text-[#1E1B4B]'
$heroText = $heroText -replace 'text-white font-black text-base rounded-2xl shadow-xl shadow-purple-600/30', 'text-[#1E1B4B] font-black text-base rounded-2xl shadow-2xl border-2 border-purple-300'

[System.IO.File]::WriteAllText($heroPath, $heroText, $utf8NoBOM)
Write-Host "Option 2 applied to animated_hero.html"

# 3. Update shop_layout.html to Option 2 (Crisp White & Deep Purple Filter Pills)
$shopPath = Join-Path $dir "shop_layout.html"
$shopText = [System.IO.File]::ReadAllText($shopPath, $utf8NoBOM)

$shopText = $shopText -replace 'bg-slate-50 text-slate-700 hover:bg-purple-50', 'bg-purple-50/60 text-[#1E1B4B] hover:bg-purple-100/80 border border-purple-200/60'

[System.IO.File]::WriteAllText($shopPath, $shopText, $utf8NoBOM)
Write-Host "Option 2 applied to shop_layout.html"
