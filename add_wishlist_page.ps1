$path = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$content = Get-Content -Path $path -Raw -Encoding UTF8

# 1. Add Wishlist Modal HTML before exit-intent popup
$wishlistModalHtml = @"
    <!-- DEDICATED WISHLIST & COMPLEMENTARY RECOMMENDATIONS MODAL -->
    <div id="wishlist-modal" onclick="if(event.target===this) toggleModal('wishlist-modal')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] hidden flex items-center justify-center p-4 cursor-pointer">
        <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative p-6 max-h-[90vh] overflow-y-auto text-right cursor-default border border-purple-100">
            <button onclick="toggleModal('wishlist-modal')" class="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-2xl z-30">&times;</button>
            <div id="wishlist-modal-content">
                <!-- Injected via JS dynamically -->
            </div>
        </div>
    </div>

    <!-- EXIT INTENT DISCOUNT POPUP -->
"@

$content = $content -replace '<!-- EXIT INTENT DISCOUNT POPUP -->', $wishlistModalHtml

# 2. Update showWishlistModal in JS and add renderWishlistModal & addAllWishlistToCart
$oldWishlistJsPattern = '(?s)function showWishlistModal\(\)\s*\{[^}]*\}'

$newWishlistJs = @"
        function showWishlistModal() {
            renderWishlistModal();
            toggleModal('wishlist-modal');
        }

        function renderWishlistModal() {
            const container = document.getElementById('wishlist-modal-content');
            if (!container) return;

            const favProducts = products.filter(p => state.wishlist.includes(p.id));

            if (favProducts.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 px-4">
                        <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">❤️</div>
                        <h3 class="text-2xl font-black text-slate-800 mb-2">רשימת המועדפים שלך ריקה</h3>
                        <p class="text-xs text-slate-500 mb-6 font-medium max-w-md mx-auto">לחץ על הלב שעל גבי המוצרים בחנות כדי לשמור אותם ברשימה האישית שלך לרכישה מהירה בהמשך.</p>
                        <button onclick="toggleModal('wishlist-modal'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="py-3.5 px-8 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95">
                            עבור לקטלוג המוצרים ✨
                        </button>
                    </div>
                `;
                return;
            }

            // Determine complementary recommendations based on categories in wishlist
            const favCategories = [...new Set(favProducts.map(p => p.category))];
            const recProducts = products.filter(p => !state.wishlist.includes(p.id) && (favCategories.includes(p.category) || p.price < 300)).slice(0, 3);

            container.innerHTML = `
                <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-black">❤️</div>
                        <div>
                            <h3 class="text-xl font-black text-slate-800">המוצרים שאהבתי (${favProducts.length})</h3>
                            <p class="text-xs text-slate-500">רשימת המועדפים האישית שלך במכון עוז</p>
                        </div>
                    </div>
                    <button onclick="addAllWishlistToCart()" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2">
                        <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                        <span>הוסף את כל המועדפים לסל הקניות 🛒</span>
                    </button>
                </div>

                <!-- Wishlist Items Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    ` + favProducts.map(p => `
                        <div class="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 flex flex-col justify-between relative group hover:shadow-md transition-all">
                            <div>
                                <div class="h-40 rounded-xl overflow-hidden mb-3 relative bg-slate-100">
                                    <img src="` + p.image + `" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <button onclick="toggleWishlist(` + p.id + `); renderWishlistModal();" class="absolute top-2 left-2 bg-white/90 text-red-500 hover:text-red-700 w-8 h-8 rounded-full flex items-center justify-center shadow-sm font-black" title="הסר ממועדפים">
                                        ✕
                                    </button>
                                </div>
                                <span class="text-[10px] font-extrabold text-oz-primary uppercase block mb-1">` + (p.category_name || 'מועדפים') + `</span>
                                <h4 class="font-bold text-sm text-slate-800 line-clamp-1 mb-1">` + p.name + `</h4>
                                <div class="text-base font-black text-oz-primary mb-3">₪` + p.price + `</div>
                            </div>
                            <button onclick="addToCart(` + p.id + `)" class="w-full py-2.5 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                <svg class="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                                <span>הוסף לסל</span>
                            </button>
                        </div>
                    `).join('') + `
                </div>

                <!-- Complementary / Recommended Section -->
                <div class="border-t border-slate-100 pt-6">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-black text-amber-700 bg-amber-100 py-1 px-3 rounded-full border border-amber-200">✨ מוצרים משלימים ומומלצים עבורך</span>
                        <span class="text-xs font-bold text-slate-400">השלם את ההזמנה שלך</span>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        ` + recProducts.map(r => `
                            <div class="bg-white border border-purple-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                                <img src="` + r.image + `" class="w-14 h-14 rounded-xl object-cover shrink-0" />
                                <div class="flex-1 min-w-0">
                                    <h5 class="font-bold text-xs text-slate-800 line-clamp-1">` + r.name + `</h5>
                                    <div class="text-xs font-black text-oz-primary">₪` + r.price + `</div>
                                    <button onclick="addToCart(` + r.id + `)" class="mt-1 text-[10px] font-black text-oz-primary hover:underline">הוסף לסל +</button>
                                </div>
                            </div>
                        `).join('') + `
                    </div>
                </div>
            `;
        }

        function addAllWishlistToCart() {
            if (state.wishlist.length === 0) return;
            state.wishlist.forEach(id => {
                const prod = products.find(p => p.id === id);
                if (prod) {
                    const existing = state.cart.find(i => i.id === id);
                    if (existing) existing.qty += 1;
                    else state.cart.push({ ...prod, qty: 1 });
                }
            });
            updateCartUI();
            toggleModal('wishlist-modal');
            toggleCartDrawer();
        }
"@

$content = [regex]::Replace($content, $oldWishlistJsPattern, $newWishlistJs)

# Save UTF-8 clean
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully added interactive Wishlist Page & Complementary Recommendations!"
