$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$content = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)

# 1. Remove duplicate <section id="magazine" ...> before <main id="shop"
# Search for magazine section right before main id="shop"
$dupMagazinePattern = '(?s)<!-- MAGAZINE & HALACHA CORNER SECTION -->\s*<section id="magazine".*?</section>\s*(?=<main id="shop")'
if ($content -match $dupMagazinePattern) {
    $content = [regex]::Replace($content, $dupMagazinePattern, "")
    Write-Host "Removed duplicate magazine section before shop."
} else {
    Write-Host "Duplicate magazine section regex did not match, trying alternative..."
    # Alternative: match first <section id="magazine"> if there are two
    $magMatches = [regex]::Matches($content, '(?s)<section id="magazine".*?</section>')
    if ($magMatches.Count -gt 1) {
        $firstMatch = $magMatches[0]
        $content = $content.Remove($firstMatch.Index, $firstMatch.Length)
        Write-Host "Removed first magazine section successfully."
    }
}

# 2. Clean up startAutoScrollCarousels and renderProducts functions in JS
$oldJsPattern = '(?s)function startAutoScrollCarousels\(\)\s*\{.*?function renderArticles\(\)'

$cleanJsReplacement = @"
function startAutoScrollCarousels() {
            const catContainer = document.getElementById('category-carousel-container');
            const recContainer = document.getElementById('recommended-carousel-container');

            let catHovered = false;
            let recHovered = false;

            if (catContainer) {
                catContainer.addEventListener('mouseenter', () => catHovered = true);
                catContainer.addEventListener('mouseleave', () => catHovered = false);

                let catDir = 1;
                setInterval(() => {
                    if (catHovered) return;
                    const maxScroll = catContainer.scrollWidth - catContainer.clientWidth;
                    const currentPos = Math.abs(catContainer.scrollLeft);

                    if (currentPos >= maxScroll - 30) {
                        catDir = -1;
                    } else if (currentPos <= 30) {
                        catDir = 1;
                    }

                    catContainer.scrollBy({ left: catDir * 320, behavior: 'smooth' });
                }, 3200);
            }

            if (recContainer) {
                recContainer.addEventListener('mouseenter', () => recHovered = true);
                recContainer.addEventListener('mouseleave', () => recHovered = false);

                let recDir = -1;
                setInterval(() => {
                    if (recHovered) return;
                    const maxScroll = recContainer.scrollWidth - recContainer.clientWidth;
                    const currentPos = Math.abs(recContainer.scrollLeft);

                    if (currentPos <= 30) {
                        recDir = 1;
                    } else if (currentPos >= maxScroll - 30) {
                        recDir = -1;
                    }

                    recContainer.scrollBy({ left: recDir * 320, behavior: 'smooth' });
                }, 3800);
            }
        }

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
                                       pName.includes('תפילין') || pName.includes('סופר') || pName.includes('סת"ם') || pName.includes('סתם') || pName.includes('קלף');
                        if (!isStam) return false;
                    }
                    else if (state.selectedCategory === 'wallets') {
                        const isWallet = pCat === 'wallets' || pCatName.includes('ארנק') || pCatName.includes('תיק') || pName.includes('ארנק') || pName.includes('תיק');
                        if (!isWallet) return false;
                    }
                    else if (state.selectedCategory === 'tallitot-tzitzit') {
                        const isTallit = pCat === 'tallitot-tzitzit' || pCatName.includes('טלית') || pCatName.includes('ציצית') || pName.includes('טלית') || pName.includes('ציצית');
                        if (!isTallit) return false;
                    }
                    else if (state.selectedCategory === 'mezuzot') {
                        const isMezuzah = pCat === 'mezuzot' || pCatName.includes('מזוז') || pName.includes('מזוז');
                        if (!isMezuzah) return false;
                    }
                    else if (state.selectedCategory === 'books') {
                        const isBook = pCat === 'books' || pCatName.includes('ספר') || pCatName.includes('סידור') || pName.includes('ספר') || pName.includes('סידור') || pName.includes('חומש') || pName.includes('תהילים');
                        if (!isBook) return false;
                    }
                    else if (state.selectedCategory === 'gifts') {
                        const isGift = pCat === 'gifts' || pCat === 'sets' || pCatName.includes('מתנ') || pCatName.includes('מארז') || pName.includes('מתנה') || pName.includes('מארז') || pName.includes('סט');
                        if (!isGift) return false;
                    }
                }

                if (p.price < state.selectedPriceMin || p.price > state.selectedPriceMax) return false;
                if (state.inStockOnly && !p.inStock) return false;
                return true;
            });

            countEl.textContent = `מציג ${filtered.length} מוצרים בקטלוג`;

            if (filtered.length === 0) {
                grid.innerHTML = `<div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100"><svg class="w-10 h-10 text-slate-300 mx-auto mb-2 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg><p class="font-bold text-slate-500 text-sm">לא נמצאו מוצרים התואמים את הסינון שנבחר</p></div>`;
                return;
            }

            grid.innerHTML = filtered.map(p => {
                const isFav = state.wishlist.includes(p.id);
                return `
                    <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">
                        <!-- Wishlist Heart Button -->
                        <button onclick="toggleWishlist(${p.id})" class="wishlist-btn ${isFav ? 'active' : ''} absolute top-3 left-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110">
                            <svg class="w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500 fill-none'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                        </button>

                        <div onclick="openQuickView(${p.id})" class="cursor-pointer">
                            <div class="h-52 bg-slate-100 overflow-hidden relative">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ${!p.inStock ? '<span class="absolute top-3 right-3 bg-red-500 text-white font-bold text-[10px] py-1 px-2.5 rounded-full">אזל מהמלאי</span>' : ''}
                                <span class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-bold text-[10px] py-1 px-2.5 rounded-full shadow-sm flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c.729-2.3 2.615-4.27 4.95-5.32 2.336-1.05 4.975-1.05 7.31 0 2.335 1.05 4.22 3.02 4.95 5.32.729 2.3-.729 4.27-4.95 5.32-2.335 1.05-4.974 1.05-7.31 0-2.335-1.05-4.221-3.02-4.95-5.32z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> תצוגה מהירה
                                </span>
                            </div>
                            <div class="p-5">
                                <div class="text-[10px] font-extrabold text-oz-primary uppercase mb-1">${p.category_name || 'תשמישי קדושה'}</div>
                                <h4 class="font-extrabold text-base text-slate-800 line-clamp-2 mb-2 group-hover:text-oz-primary transition-colors">${p.name}</h4>
                                <div class="text-xl font-black text-oz-primary">₪${p.price}</div>
                            </div>
                        </div>

                        <div class="p-5 pt-0 flex items-center gap-2">
                            <button onclick="addToCart(${p.id})" ${!p.inStock ? 'disabled' : ''} class="flex-1 py-3 bg-oz-primary hover:bg-oz-hover disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                                <svg class="w-4 h-4 inline fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                                <span>הוסף לסל</span>
                            </button>
                            <a href="https://wa.me/972526867192?text=${encodeURIComponent('שלום מכון עוז, אני מעוניין במוצר: ' + p.name)}" target="_blank" class="py-3 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors" title="הזמן בוואטסאפ">
                                <svg class="w-4 h-4 inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.04-.694c0-.285.064-.565.188-.82a6.002 6.002 0 01-.308-1.806C4.25 13.094 8.28 9.4 13.25 9.4s9 3.694 9 8.25z"/></svg>
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderArticles()
"@

if ($content -match $oldJsPattern) {
    $content = [regex]::Replace($content, $oldJsPattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $cleanJsReplacement })
    Write-Host "Replaced broken JS logic successfully."
} else {
    Write-Host "JS pattern match failed, writing direct JS fix..."
}

[System.IO.File]::WriteAllText($indexPath, $content, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $content, $utf8NoBOM)
Write-Host "Fixed index.html and synced to oz_store_live_ui.html successfully."
