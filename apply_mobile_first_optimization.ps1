$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$content = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)

# 1. Update products-grid class to 2 columns on mobile
$oldGridPattern = 'id="products-grid" class="[^"]*"'
$newGridTag = 'id="products-grid" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"'
if ($content -match $oldGridPattern) {
    $content = [regex]::Replace($content, $oldGridPattern, $newGridTag)
    Write-Host "Updated products-grid layout to 2 columns on mobile."
}

# 2. Add Floating Cart Button Widget right before </body> if not present
$floatingCartHtml = @"
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
                <span class="text-xs font-black text-amber-300 leading-none">סל הקניות</span>
                <span id="floating-cart-total" class="text-[10px] text-purple-200 font-bold leading-tight mt-0.5">₪0</span>
            </div>
        </button>
    </div>
"@

if ($content -notmatch 'id="floating-cart-btn-wrapper"') {
    $content = $content.Replace("</body>", $floatingCartHtml + "`n</body>")
    Write-Host "Injected Floating Sticky Cart Button Widget."
}

# 3. Update renderProducts function for responsive 2-col card layout
$oldRenderPattern = '(?s)function renderProducts\(\)\s*\{.*?function renderArticles\(\)'

$cleanRenderReplacement = @"
function renderProducts() {
            const grid = document.getElementById('products-grid');
            const countEl = document.getElementById('product-count');

            if (!grid || !countEl) return;

            let filtered = products.filter(p => {
                if (state.selectedCategory !== 'all') {
                    const pCat = (p.category || '').toLowerCase();
                    const pName = (p.name || '').toLowerCase();
                    const pCatName = (p.category_name || '').toLowerCase();

                    if (state.selectedCategory === 'stam') {
                        const isStam = pCat === 'stam' || pCat === 'tefillin' || pCat === 'all' || 
                                       pName.includes('\u05ea\u05e4\u05d9\u05dc\u05d9\u05df') || pName.includes('\u05e1\u05d5\u05e4\u05e8') || pName.includes('\u05e1\u05ea"\u05dd') || pName.includes('\u05e1\u05ea\u05dd') || pName.includes('\u05e7\u05dc\u05e3');
                        if (!isStam) return false;
                    }
                    else if (state.selectedCategory === 'wallets') {
                        const isWallet = pCat === 'wallets' || pCatName.includes('\u05d0\u05e8\u05e0\u05e7') || pCatName.includes('\u05ea\u05d9\u05e7') || pName.includes('\u05d0\u05e8\u05e0\u05e7') || pName.includes('\u05ea\u05d9\u05e7');
                        if (!isWallet) return false;
                    }
                    else if (state.selectedCategory === 'tallitot-tzitzit') {
                        const isTallit = pCat === 'tallitot-tzitzit' || pCatName.includes('\u05ea\u05dc\u05d9\u05ea') || pCatName.includes('\u05e6\u05d9\u05e6\u05d9\u05ea') || pName.includes('\u05ea\u05dc\u05d9\u05ea') || pName.includes('\u05e6\u05d9\u05e6\u05d9\u05ea');
                        if (!isTallit) return false;
                    }
                    else if (state.selectedCategory === 'mezuzot') {
                        const isMezuzah = pCat === 'mezuzot' || pCatName.includes('\u05de\u05d6\u05d5\u05d6') || pName.includes('\u05de\u05d6\u05d5\u05d6');
                        if (!isMezuzah) return false;
                    }
                    else if (state.selectedCategory === 'books') {
                        const isBook = pCat === 'books' || pCatName.includes('\u05e1\u05e4\u05e8') || pCatName.includes('\u05e1\u05d9\u05d3\u05d5\u05e8') || pName.includes('\u05e1\u05e4\u05e8') || pName.includes('\u05e1\u05d9\u05d3\u05d5\u05e8') || pName.includes('\u05d7\u05d5\u05de\u05e9') || pName.includes('\u05ea\u05d7\u05d9\u05dc\u05d9\u05dd');
                        if (!isBook) return false;
                    }
                    else if (state.selectedCategory === 'gifts') {
                        const isGift = pCat === 'gifts' || pCat === 'sets' || pCatName.includes('\u05de\u05ea\u05e0') || pCatName.includes('\u05de\u05d0\u05e8\u05d6') || pName.includes('\u05de\u05ea\u05e0\u05d4') || pName.includes('\u05de\u05d0\u05e8\u05d6') || pName.includes('\u05e1\u05d8');
                        if (!isGift) return false;
                    }
                }

                if (p.price < state.selectedPriceMin || p.price > state.selectedPriceMax) return false;
                if (state.inStockOnly && !p.inStock) return false;
                return true;
            });

            countEl.textContent = '\u05de\u05e6\u05d9\u05d2 ' + filtered.length + ' \u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05d1\u05e7\u05d8\u05dc\u05d5\u05d2';

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100"><svg class="w-10 h-10 text-slate-300 mx-auto mb-2 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg><p class="font-bold text-slate-500 text-sm">\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05d4\u05ea\u05d5\u05d0\u05de\u05d9\u05dd \u05d0\u05ea \u05d4\u05e1\u05d9\u05e0\u05d5\u05df \u05e9\u05e0\u05d1\u05d7\u05e8</p></div>';
                return;
            }

            grid.innerHTML = filtered.map(p => {
                const isFav = state.wishlist.includes(p.id);
                const outOfStockLabel = p.inStock ? '' : '<span class="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white font-bold text-[9px] sm:text-[10px] py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-full">\u05d0\u05d6\u05dc \u05de\u05d4\u05de\u05dc\u05d0\u05d9</span>';
                const catName = p.category_name || '\u05ea\u05e9\u05de\u05d9\u05e9\u05d9 \u05e7\u05d3\u05d5\u05e9\u05d4';

                return `
                    <div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">
                        <!-- Wishlist Heart Button -->
                        <button onclick="toggleWishlist(${p.id})" class="wishlist-btn ${isFav ? 'active' : ''} absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-7 h-7 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500 fill-none'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                        </button>

                        <div onclick="openQuickView(${p.id})" class="cursor-pointer">
                            <div class="h-36 sm:h-52 bg-slate-100 overflow-hidden relative">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ${outOfStockLabel}
                                <span class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-bold text-[9px] sm:text-[10px] py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-full shadow-sm flex items-center gap-1">
                                    <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c.729-2.3 2.615-4.27 4.95-5.32 2.336-1.05 4.975-1.05 7.31 0 2.335 1.05 4.22 3.02 4.95 5.32.729 2.3-.729 4.27-4.95 5.32-2.335 1.05-4.221-3.02-4.95-5.32z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> \u05ea\u05e6\u05d5\u05d7\u05d4 \u05de\u05d4\u05d9\u05e8\u05d4
                                </span>
                            </div>
                            <div class="p-3 sm:p-5">
                                <div class="text-[9px] sm:text-[10px] font-extrabold text-oz-primary uppercase mb-0.5 sm:mb-1 truncate">${catName}</div>
                                <h4 class="font-extrabold text-xs sm:text-base text-slate-800 line-clamp-2 mb-1 sm:mb-2 group-hover:text-oz-primary transition-colors leading-snug">${p.name}</h4>
                                <div class="text-base sm:text-xl font-black text-oz-primary">\u20aa${p.price}</div>
                            </div>
                        </div>

                        <div class="p-2.5 pt-0 sm:p-5 sm:pt-0 flex items-center gap-1.5 sm:gap-2">
                            <button onclick="addToCart(${p.id})" ${!p.inStock ? 'disabled' : ''} class="flex-1 py-2 sm:py-3 bg-oz-primary hover:bg-oz-hover disabled:bg-slate-200 text-white font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 sm:gap-2">
                                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 inline fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                                <span>\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e1\u05dc</span>
                            </button>
                            <a href="https://wa.me/972526867192?text=${encodeURIComponent('שלום מכון עוז, אני מעוניין במוצר: ' + p.name)}" target="_blank" class="py-2 px-2 sm:py-3 sm:px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-emerald-200 transition-colors" title="הזמן בוואטסאפ">
                                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.04-.694c0-.285.064-.565.188-.82a6.002 6.002 0 01-.308-1.806C4.25 13.094 8.28 9.4 13.25 9.4s9 3.694 9 8.25z"/></svg>
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderArticles()
"@

if ($content -match $oldRenderPattern) {
    $content = [regex]::Replace($content, $oldRenderPattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $cleanRenderReplacement })
    Write-Host "Replaced renderProducts logic with mobile-optimized 2-col card layout."
}

# 4. Update updateCartUI to update floating cart widget
$oldUpdateCartPattern = '(?s)function updateCartUI\(\)\s*\{.*?function removeFromCart'

$cleanUpdateCartReplacement = @"
function updateCartUI() {
            const badge = document.getElementById('cart-badge');
            const totalQty = state.cart.reduce((acc, i) => acc + i.qty, 0);
            if (badge) badge.textContent = totalQty;

            const floatingBadge = document.getElementById('floating-cart-badge');
            const floatingTotal = document.getElementById('floating-cart-total');
            const floatingPulse = document.getElementById('floating-cart-pulse');
            if (floatingBadge) floatingBadge.textContent = totalQty;
            if (floatingPulse) {
                if (totalQty > 0) floatingPulse.classList.remove('hidden');
                else floatingPulse.classList.add('hidden');
            }

            const container = document.getElementById('cart-items-container');
            const totalPriceEl = document.getElementById('cart-total-price');

            const hour = new Date().getHours();
            let greeting = "\u05e7\u05e0\u05d9\u05d9\u05d4 \u05e0\u05e2\u05d9\u05de\u05d4 \u05de\u05de\u05db\u05d5\u05df \u05e2\u05d5\u05d6";
            if (hour >= 5 && hour < 12) greeting = "\ud83c\udf1e \u05d1\u05d5\u05e7\u05e8 \u05d8\u05d5\u05d1! \u05e7\u05e0\u05d9\u05d9\u05d4 \u05e0\u05e2\u05d9\u05de\u05d4 \u05de\u05de\u05db\u05d5\u05df \u05e2\u05d5\u05d6";
            else if (hour >= 12 && hour < 18) greeting = "\u2600\ufe0f \u05e6\u05d4\u05e8\u05d9\u05d9\u05dd \u05d8\u05d5\u05d1\u05d9\u05dd! \u05e9\u05de\u05d7\u05d9\u05dd \u05dc\u05e9\u05e8\u05ea \u05d0\u05d5\u05ea\u05da";
            else if (hour >= 18 && hour < 23) greeting = "\ud83c\udf1c \u05e2\u05e8\u05d1 \u05d8\u05d5\u05d1! \u05ea\u05d5\u05d3\u05d4 \u05e9\u05d1\u05d7\u05e8\u05ea \u05de\u05db\u05d5\u05df \u05e2\u05d5\u05d6";
            const greetingEl = document.getElementById('cart-greeting');
            if (greetingEl) greetingEl.textContent = greeting;

            let total = 0;
            if (state.cart.length === 0) {
                if (container) container.innerHTML = '<div class="text-center py-12 text-slate-400"><svg class="w-4 h-4 inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg><p class="text-sm font-medium">\u05d4\u05e1\u05dc \u05e9\u05dc\u05da \u05e8\u05d9\u05e7</p></div>';
                if (totalPriceEl) totalPriceEl.textContent = '\u20aa0';
                if (floatingTotal) floatingTotal.textContent = '\u20aa0';
            } else {
                if (container) {
                    container.innerHTML = state.cart.map(item => {
                        total += item.price * item.qty;
                        return `
                            <div class="flex items-center justify-between p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                                <div class="flex items-center gap-3">
                                    <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover" />
                                    <div>
                                        <h5 class="font-bold text-xs text-slate-800 line-clamp-1">${item.name}</h5>
                                        <div class="text-xs font-extrabold text-oz-primary">\u20aa${item.price} x ${item.qty}</div>
                                    </div>
                                </div>
                                <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 text-xs font-bold p-1">\u2715</button>
                            </div>
                        `;
                    }).join('');
                } else {
                    total = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
                }
                if (totalPriceEl) totalPriceEl.textContent = '\u20aa' + total;
                if (floatingTotal) floatingTotal.textContent = '\u20aa' + total;
            }

            // Free Shipping Bar Update
            const target = 399;
            const remaining = target - total;
            const pct = Math.min(100, Math.round((total / target) * 100));
            const bar = document.getElementById('shipping-bar');
            const pctEl = document.getElementById('shipping-percent');
            const textEl = document.getElementById('shipping-text');
            if (bar) bar.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
            if (textEl) textEl.textContent = remaining > 0 ? '\u05e2\u05d5\u05d3 \u20aa' + remaining + ' \u05dc\u05de\u05e9\u05dc\u05d5\u05d7 \u05d7\u05d9\u05e0\u05dd! \ud83d\ude9a' : '\u05d6\u05db\u05d0\u05d9 \u05dc\u05de\u05e9\u05dc\u05d5\u05d7 \u05d7\u05d9\u05e0\u05dd! \ud83c\udf89';
        }

        function removeFromCart
"@

if ($content -match $oldUpdateCartPattern) {
    $content = [regex]::Replace($content, $oldUpdateCartPattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $cleanUpdateCartReplacement })
    Write-Host "Updated updateCartUI function with floating cart widget sync."
}

[System.IO.File]::WriteAllText($indexPath, $content, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $content, $utf8NoBOM)
Write-Host "Mobile-First Optimization applied and synced successfully."
