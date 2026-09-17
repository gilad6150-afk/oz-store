$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$content = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)

$oldWidgetPattern = '(?s)<div id="floating-cart-btn-wrapper".*?</div>'
$cleanWidget = @"
    <!-- FLOATING STICKY MOBILE & DESKTOP CART BUTTON -->
    <div id="floating-cart-btn-wrapper" class="fixed bottom-6 left-6 z-[9999999]">
        <button onclick="toggleCartDrawer()" class="group relative flex items-center gap-2.5 px-4 py-3.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-[#29114D] via-purple-900 to-[#190933] hover:from-purple-800 hover:to-indigo-900 text-white rounded-full sm:rounded-2xl shadow-2xl shadow-purple-950/60 border border-amber-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer" title="סל הקניות">
            
            <!-- Animated Pulse Ring when cart has items -->
            <span id="floating-cart-pulse" class="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping opacity-75 hidden"></span>
            
            <!-- Cart Icon & Badge -->
            <div class="relative flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/>
                </svg>
                <span id="floating-cart-badge" class="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 font-black text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-purple-950 shadow-md">0</span>
            </div>

            <!-- Button Label (Visible on Mobile & Desktop) -->
            <div class="flex flex-col text-right pr-0.5">
                <span class="text-xs font-black text-amber-300 leading-none">&#1505;&#1500; &#1510;&#1511;&#1500;&#1514;&#1513;&#1501;&#1514; &#1505;&#1500; &#1510;&#1511;&#1500;</span>
                <span id="floating-cart-total" class="text-[10px] text-purple-200 font-bold leading-tight mt-0.5">&#83aa;0</span>
            </div>
        </button>
    </div>
"@

# Replace with exact clean HTML
$cleanAsciiWidget = @"
    <!-- FLOATING STICKY MOBILE & DESKTOP CART BUTTON -->
    <div id="floating-cart-btn-wrapper" class="fixed bottom-6 left-6 z-[9999999]">
        <button onclick="toggleCartDrawer()" class="group relative flex items-center gap-2.5 px-4 py-3.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-[#29114D] via-purple-900 to-[#190933] hover:from-purple-800 hover:to-indigo-900 text-white rounded-full sm:rounded-2xl shadow-2xl shadow-purple-950/60 border border-amber-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer" title="סל הקניות">
            
            <!-- Animated Pulse Ring when cart has items -->
            <span id="floating-cart-pulse" class="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping opacity-75 hidden"></span>
            
            <!-- Cart Icon & Badge -->
            <div class="relative flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/>
                </svg>
                <span id="floating-cart-badge" class="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 font-black text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-purple-950 shadow-md">0</span>
            </div>

            <!-- Button Label (Visible on Mobile & Desktop) -->
            <div class="flex flex-col text-right pr-0.5">
                <span class="text-xs font-black text-amber-300 leading-none">&#1505;&#1500; &#1510;&#1511;&#1500;&#1514;&#1513;&#1501;&#1514;</span>
                <span id="floating-cart-total" class="text-[10px] text-purple-200 font-bold leading-tight mt-0.5">&#83aa;0</span>
            </div>
        </button>
    </div>
"@

# Let's read clean_widget from a separate clean UTF-8 text file to avoid PowerShell literal string mangling!
