$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

# 1. Update floating_cart.html to hide floating cart pill on mobile (hidden on mobile, visible on desktop md:flex)
$floatingCartPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\floating_cart.html'
$floatingCartContent = [System.IO.File]::ReadAllText($floatingCartPath, $utf8NoBOM)

$oldFloatingPillWrapper = '<div id="floating-cart-btn-wrapper" class="fixed bottom-6 left-6 z-[999999]">'
$newFloatingPillWrapper = '<div id="floating-cart-btn-wrapper" class="hidden md:flex fixed bottom-6 left-6 z-[9999]">'

if ($floatingCartContent.Contains($oldFloatingPillWrapper)) {
    $floatingCartContent = $floatingCartContent.Replace($oldFloatingPillWrapper, $newFloatingPillWrapper)
    [System.IO.File]::WriteAllText($floatingCartPath, $floatingCartContent, $utf8NoBOM)
    Write-Host "Updated floating_cart.html: Floating cart pill is now hidden on mobile and visible on desktop md:flex!"
}

# 2. Update modals.html to move Accessibility widget safely above the mobile bottom bar
$modalsPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\modals.html'
$modalsContent = [System.IO.File]::ReadAllText($modalsPath, $utf8NoBOM)

$oldAccessWrapper = '<div class="fixed bottom-6 right-6 z-[9999999]">'
$newAccessWrapper = '<div class="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[9998]">'

if ($modalsContent.Contains($oldAccessWrapper)) {
    $modalsContent = $modalsContent.Replace($oldAccessWrapper, $newAccessWrapper)
    [System.IO.File]::WriteAllText($modalsPath, $modalsContent, $utf8NoBOM)
    Write-Host "Updated modals.html: Accessibility widget moved safely to bottom-20 on mobile to avoid overlapping navigation bar!"
}

# 3. Update clean_nav.html to install the new Executive Mobile Bottom Navigation Bar
$cleanNavPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_nav.html'
$cleanNavContent = [System.IO.File]::ReadAllText($cleanNavPath, $utf8NoBOM)

$oldNavBlock = @"
    <!-- FIXED MOBILE BOTTOM NAVIGATION BAR (UX Optimized for Smartphones) -->
    <div class="fixed bottom-0 left-0 right-0 z-[99999] lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl px-2 py-1.5 flex items-center justify-around text-slate-700 dir-rtl">
        <a href="#shop" onclick="resetFilters(); closeProductPage(); closeAccountPage(); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-bold text-slate-700 hover:text-purple-300 active:scale-95 transition-all">
            <svg class="w-5 h-5 fill-none stroke-current stroke-2 text-slate-600" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
            <span class="whitespace-nowrap">בית</span>
        </a>
        <a href="#shop" onclick="closeProductPage(); closeAccountPage(); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-bold text-slate-700 hover:text-purple-300 active:scale-95 transition-all">
            <svg class="w-5 h-5 fill-none stroke-current stroke-2 text-slate-600" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
            <span class="whitespace-nowrap">קטלוג</span>
        </a>
        <button onclick="toggleModal('search-modal')" class="flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-bold text-slate-700 hover:text-purple-300 active:scale-95 transition-all">
            <svg class="w-5 h-5 fill-none stroke-current stroke-2 text-slate-600" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <span class="whitespace-nowrap">חיפוש</span>
        </button>
        <button onclick="toggleCartDrawer()" class="flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-bold text-slate-700 hover:text-purple-300 active:scale-95 transition-all relative">
            <svg class="w-5 h-5 fill-none stroke-current stroke-2 text-slate-600" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3-3h-1.5m0 0l-1.12-4.48A1.125 1.125 0 013.006 5.5H16.5a1.125 1.125 0 011.08 1.42l-1.5 6a1.125 1.125 0 01-1.08.83H7.5z"/></svg>
            <span class="whitespace-nowrap">סל קניות</span>
        </button>
        <button onclick="openAccountPage()" class="flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-bold text-slate-700 hover:text-purple-300 active:scale-95 transition-all">
            <svg class="w-5 h-5 fill-none stroke-current stroke-2 text-slate-600" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            <span class="whitespace-nowrap">החשבון שלי</span>
        </button>
    </div>
"@

$newNavBlock = @"
    <!-- FIXED EXECUTIVE MOBILE BOTTOM NAVIGATION BAR (UX OPTIMIZED FOR SMARTPHONES) -->
    <nav class="fixed bottom-0 left-0 right-0 z-[99999] lg:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] px-1.5 py-2 flex items-center justify-around text-slate-600 dir-rtl">
        <a href="#hero" onclick="resetFilters(); closeProductPage(); closeAccountPage(); document.getElementById('hero').scrollIntoView({behavior:'smooth'})" class="flex flex-col items-center gap-1 p-1 text-[11px] font-black text-slate-600 hover:text-oz-primary active:scale-95 transition-all flex-1">
            <svg class="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
            <span class="whitespace-nowrap">ראשי</span>
        </a>
        <a href="#shop" onclick="closeProductPage(); closeAccountPage(); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="flex flex-col items-center gap-1 p-1 text-[11px] font-black text-slate-600 hover:text-oz-primary active:scale-95 transition-all flex-1">
            <svg class="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v15.75a.75.75 0 01-.75.75H13.5z"/></svg>
            <span class="whitespace-nowrap">קטלוג</span>
        </a>
        <button onclick="toggleModal('search-modal')" class="flex flex-col items-center gap-1 p-1 text-[11px] font-black text-slate-600 hover:text-oz-primary active:scale-95 transition-all flex-1 cursor-pointer">
            <svg class="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <span class="whitespace-nowrap">חיפוש</span>
        </button>
        <button onclick="toggleCartDrawer()" class="flex flex-col items-center gap-1 p-1 text-[11px] font-black text-oz-primary hover:text-purple-900 active:scale-95 transition-all flex-1 relative cursor-pointer">
            <div class="relative">
                <svg class="w-5.5 h-5.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                <span id="mobile-bottom-cart-badge" class="absolute -top-1.5 -right-2 bg-purple-600 text-white font-black text-[9px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border border-white shadow-sm">0</span>
            </div>
            <span class="whitespace-nowrap">סל קניות</span>
        </button>
        <button onclick="openAccountPage()" class="flex flex-col items-center gap-1 p-1 text-[11px] font-black text-slate-600 hover:text-oz-primary active:scale-95 transition-all flex-1 cursor-pointer">
            <svg class="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            <span class="whitespace-nowrap">החשבון שלי</span>
        </button>
    </nav>
"@

if ($cleanNavContent.Contains('<div class="fixed bottom-0 left-0 right-0 z-[99999] lg:hidden')) {
    $cleanNavContent = $cleanNavContent.Replace($oldNavBlock, $newNavBlock)
    [System.IO.File]::WriteAllText($cleanNavPath, $cleanNavContent, $utf8NoBOM)
    Write-Host "Updated clean_nav.html with Executive Mobile Bottom Navigation Bar!"
}

# 4. Update clean_render.js to update mobile-bottom-cart-badge
$renderPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js'
$renderContent = [System.IO.File]::ReadAllText($renderPath, $utf8NoBOM)

if (-not $renderContent.Contains('mobile-bottom-cart-badge')) {
    $renderContent = $renderContent.Replace("const badge = document.getElementById('floating-cart-badge');", "const badge = document.getElementById('floating-cart-badge');`n    const mobBadge = document.getElementById('mobile-bottom-cart-badge');`n    if (mobBadge) { mobBadge.textContent = totalCount; mobBadge.classList.toggle('hidden', totalCount === 0); }")
    [System.IO.File]::WriteAllText($renderPath, $renderContent, $utf8NoBOM)
    Write-Host "Updated clean_render.js to sync mobile-bottom-cart-badge count!"
}
