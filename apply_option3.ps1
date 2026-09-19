$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

# 1. Update clean_nav.html to Option 3 (Luxury Royal Violet Gradient Category Bar + White Header)
$navPath = Join-Path $dir "clean_nav.html"
$navText = [System.IO.File]::ReadAllText($navPath, $utf8NoBOM)

$navText = $navText -replace 'bg-white text-\[#1E1B4B\] border-t border-b border-purple-100 shadow-sm', 'bg-gradient-to-r from-[#1E1B4B] via-[#2E1065] to-[#1E1B4B] text-white border-t border-purple-900/80 shadow-md'
$navText = $navText -replace 'text-\[#1E1B4B\]', 'text-white'
$navText = $navText -replace 'hover:text-purple-700', 'hover:text-purple-200'
$navText = $navText -replace 'hover:bg-purple-50', 'hover:bg-white/15'
$navText = $navText -replace 'text-purple-600', 'text-purple-300'

[System.IO.File]::WriteAllText($navPath, $navText, $utf8NoBOM)
Write-Host "Option 3 applied to clean_nav.html"

# 2. Update animated_hero.html to Option 3 (Vibrant Purple CTA + Royal Gradient Hero)
$heroPath = Join-Path $dir "animated_hero.html"
$heroText = [System.IO.File]::ReadAllText($heroPath, $utf8NoBOM)

$heroText = $heroText -replace 'from-[#1E1B4B] via-[#312E81] to-[#1E1B4B]', 'from-[#1E1B4B] via-[#2E1065] to-[#1E1B4B]'
$heroText = $heroText -replace 'from-white via-purple-50 to-white text-\[#1E1B4B\]', 'from-[#7C3AED] via-[#6D28D9] to-[#581C87] text-white'
$heroText = $heroText -replace 'text-\[#1E1B4B\] font-black text-base rounded-2xl shadow-2xl border-2 border-purple-300', 'text-white font-black text-base rounded-2xl shadow-xl shadow-purple-900/40 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#581C87]'

[System.IO.File]::WriteAllText($heroPath, $heroText, $utf8NoBOM)
Write-Host "Option 3 applied to animated_hero.html"

# 3. Update shop_layout.html to Option 3 (Polished Luxury Filters)
$shopPath = Join-Path $dir "shop_layout.html"
$shopText = [System.IO.File]::ReadAllText($shopPath, $utf8NoBOM)

$shopText = $shopText -replace 'bg-purple-50/60 text-\[#1E1B4B\] hover:bg-purple-100/80 border border-purple-200/60', 'bg-slate-50 text-slate-800 hover:bg-purple-50 hover:text-[#1E1B4B] border border-slate-200/80'

[System.IO.File]::WriteAllText($shopPath, $shopText, $utf8NoBOM)
Write-Host "Option 3 applied to shop_layout.html"
