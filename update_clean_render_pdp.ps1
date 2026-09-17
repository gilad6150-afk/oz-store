        // HERO BANNER SHOWCASE AUTO-SLIDER (Auto-rotates every 2.5s)
        let currentHeroSlideIndex = 0;
        let heroSlideTimer = null;
        let heroHovered = false;

        function showHeroSlide(index) {
            const slides = document.querySelectorAll('#hero-slides-container .hero-slide');
            const dotsContainer = document.getElementById('hero-dots-container');
            if (!slides || slides.length === 0) return;
            
            currentHeroSlideIndex = (index + slides.length) % slides.length;
            
            slides.forEach((slide, idx) => {
                if (idx === currentHeroSlideIndex) {
                    slide.classList.remove('opacity-0', 'pointer-events-none');
                    slide.classList.add('opacity-100');
                } else {
                    slide.classList.remove('opacity-100');
                    slide.classList.add('opacity-0', 'pointer-events-none');
                }
            });
            
            if (dotsContainer) {
                const dots = dotsContainer.children;
                for (let i = 0; i < dots.length; i++) {
                    if (i === currentHeroSlideIndex) {
                        dots[i].className = 'w-6 h-3 rounded-full bg-amber-400 transition-all';
                    } else {
                        dots[i].className = 'w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all';
                    }
                }
            }
        }

        function setHeroSlide(index) {
            showHeroSlide(index);
            if (heroSlideTimer) clearInterval(heroSlideTimer);
            heroSlideTimer = setInterval(() => {
                if (!heroHovered) nextHeroSlide();
            }, 2500);
        }

        function nextHeroSlide() {
            showHeroSlide(currentHeroSlideIndex + 1);
        }

        function startHeroSlider() {
            const showcase = document.getElementById('hero-slides-container');
            if (showcase) {
                showcase.addEventListener('mouseenter', () => heroHovered = true);
                showcase.addEventListener('mouseleave', () => heroHovered = false);
            }
            showHeroSlide(0);
            if (heroSlideTimer) clearInterval(heroSlideTimer);
            heroSlideTimer = setInterval(() => {
                if (!heroHovered) nextHeroSlide();
            }, 2500);
        }

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
                                       pName.includes('׳×׳₪׳™׳׳™׳') || pName.includes('׳¡׳•׳₪׳¨') || pName.includes('׳¡׳×"׳') || pName.includes('׳¡׳×׳') || pName.includes('׳§׳׳£');
                        if (!isStam) return false;
                    }
                    else if (state.selectedCategory === 'wallets') {
                        const isWallet = pCat === 'wallets' || pCatName.includes('׳׳¨׳ ׳§') || pCatName.includes('׳×׳™׳§') || pName.includes('׳׳¨׳ ׳§') || pName.includes('׳×׳™׳§');
                        if (!isWallet) return false;
                    }
                    else if (state.selectedCategory === 'tallitot-tzitzit') {
                        const isTallit = pCat === 'tallitot-tzitzit' || pCatName.includes('׳˜׳׳™׳×') || pCatName.includes('׳¦׳™׳¦׳™׳×') || pName.includes('׳˜׳׳™׳×') || pName.includes('׳¦׳™׳¦׳™׳×');
                        if (!isTallit) return false;
                    }
                    else if (state.selectedCategory === 'mezuzot') {
                        const isMezuzah = pCat === 'mezuzot' || pCatName.includes('׳׳–׳•׳–׳”') || pName.includes('׳׳–׳•׳–׳”');
                        if (!isMezuzah) return false;
                    }
                    else if (state.selectedCategory === 'books') {
                        const isBook = pCat === 'books' || pCatName.includes('׳¡׳₪׳¨') || pCatName.includes('׳¡׳™׳“׳•׳¨') || pName.includes('׳¡׳₪׳¨') || pName.includes('׳¡׳™׳“׳•׳¨') || pName.includes('׳—׳•׳׳©') || pName.includes('׳×׳”׳™׳׳™׳');
                        if (!isBook) return false;
                    }
                    else if (state.selectedCategory === 'gifts') {
                        const isGift = pCat === 'gifts' || pCat === 'sets' || pCatName.includes('׳׳×׳ ') || pCatName.includes('׳׳׳¨׳–') || pName.includes('׳׳×׳ ׳”') || pName.includes('׳׳׳¨׳–') || pName.includes('׳¡׳˜');
                        if (!isGift) return false;
                    }
                }

                if (p.price < state.selectedPriceMin || p.price > state.selectedPriceMax) return false;
                if (state.inStockOnly && !p.inStock) return false;
                return true;
            });

            countEl.textContent = '׳׳¦׳™׳’ ' + filtered.length + ' ׳׳•׳¦׳¨׳™׳ ׳‘׳§׳˜׳׳•׳’';

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100"><svg class="w-10 h-10 text-slate-300 mx-auto mb-2 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg><p class="font-bold text-slate-500 text-sm">׳׳ ׳ ׳׳¦׳׳• ׳׳•׳¦׳¨׳™׳ ׳”׳×׳•׳׳׳™׳ ׳׳× ׳”׳¡׳™׳ ׳•׳ ׳©׳ ׳‘׳—׳¨</p></div>';
                return;
            }

            const waPath = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

            grid.innerHTML = filtered.map(p => {
                const isFav = state.wishlist.includes(p.id);
                const outOfStockLabel = p.inStock ? '' : '<span class="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white font-bold text-[9px] sm:text-[10px] py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-full">׳׳–׳ ׳׳”׳׳׳׳™</span>';
                const catName = p.category_name || '׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳”';

                return `<div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">
                        <!-- Wishlist Heart Button -->
                        <button onclick="toggleWishlist(${p.id})" class="wishlist-btn ${isFav ? 'active' : ''} absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-7 h-7 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500 fill-none'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                        </button>

                        <div onclick="openProductPage('${p.id}')" class="cursor-pointer">
                            <div class="h-36 sm:h-52 bg-slate-100 overflow-hidden relative">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ${outOfStockLabel}
                                <span onclick="event.stopPropagation(); openQuickView('${p.id}')" class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-bold text-[9px] sm:text-[10px] py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-full shadow-sm flex items-center gap-1 hover:bg-purple-50">
                                    <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c.729-2.3 2.615-4.27 4.95-5.32 2.336-1.05 4.975-1.05 7.31 0 2.335 1.05 4.22 3.02 4.95 5.32.729 2.3-.729 4.27-4.95 5.32-2.335 1.05-4.221-3.02-4.95-5.32z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> ׳×׳¦׳•׳’׳” ׳׳”׳™׳¨׳”
                                </span>
                            </div>
                            <div class="p-3 sm:p-5">
                                <div class="text-[9px] sm:text-[10px] font-extrabold text-oz-primary uppercase mb-0.5 sm:mb-1 truncate">${catName}</div>
                                <h4 class="font-extrabold text-xs sm:text-base text-slate-800 line-clamp-2 mb-1 sm:mb-2 group-hover:text-oz-primary transition-colors leading-snug">${p.name}</h4>
                                <div class="text-base sm:text-xl font-black text-oz-primary">ג‚×${p.price}</div>
                            </div>
                        </div>

                        <div class="p-2.5 pt-0 sm:p-5 sm:pt-0 flex items-center gap-1.5 sm:gap-2">
                            <button onclick="addToCart('${p.id}')" ${!p.inStock ? 'disabled' : ''} class="flex-1 py-2 sm:py-3 bg-oz-primary hover:bg-oz-hover disabled:bg-slate-200 text-white font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 sm:gap-2">
                                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 inline fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                                <span>׳”׳•׳¡׳£ ׳׳¡׳</span>
                            </button>
                            <a href="https://wa.me/972526867192?text=${encodeURIComponent('׳©׳׳•׳ ׳׳›׳•׳ ׳¢׳•׳–, ׳׳ ׳™ ׳׳¢׳•׳ ׳™׳™׳ ׳‘׳׳•׳¦׳¨: ' + p.name)}" target="_blank" class="py-2 px-2 sm:py-3 sm:px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-emerald-200 transition-colors flex items-center justify-center" title="׳”׳–׳׳ ׳‘׳•׳•׳׳˜׳¡׳׳₪">
                                <svg class="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24"><path d="${waPath}"/></svg>
                            </a>
                        </div>
                    </div>`;
            }).join('');
        }

        function renderArticles() {
            const container = document.getElementById('articles-container');
            if (!container) return;
            container.innerHTML = articles.map(a => `<div class="bg-white rounded-3xl overflow-hidden border border-slate-100 oz-shadow group flex flex-col justify-between">
                    <div>
                        <div class="h-44 overflow-hidden relative">
                            <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-oz-primary text-[10px] font-black py-1 px-3 rounded-full">${a.readTime}</span>
                        </div>
                        <div class="p-5">
                            <div class="text-[10px] font-black text-amber-600 uppercase mb-1">${a.category}</div>
                            <h4 class="font-extrabold text-base text-slate-800 mb-2 group-hover:text-oz-primary transition-colors">${a.title}</h4>
                            <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">${a.summary}</p>
                        </div>
                    </div>
                    <div class="p-5 pt-0">
                        <button onclick="openArticleModal(${a.id})" class="w-full py-2.5 bg-purple-50 hover:bg-oz-primary hover:text-white text-oz-primary font-bold text-xs rounded-xl transition-all">׳§׳¨׳ ׳׳× ׳”׳׳׳׳¨ ׳”׳׳׳ ג†</button>
                    </div>
                </div>`).join('');
        }

        function filterCategory(cat, btn) {
            state.selectedCategory = cat;
            if (btn) {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('bg-purple-50', 'text-oz-primary', 'font-bold'));
                btn.classList.add('bg-purple-50', 'text-oz-primary', 'font-bold');
            }
            closeProductPage();
            renderProducts();
        }

        function filterPrice(min, max, btn) {
            document.querySelectorAll('.price-chip').forEach(b => b.classList.remove('active'));
            if (state.selectedPriceMin === min && state.selectedPriceMax === max) {
                state.selectedPriceMin = 0;
                state.selectedPriceMax = 99999;
            } else {
                state.selectedPriceMin = min;
                state.selectedPriceMax = max;
                if (btn) btn.classList.add('active');
            }
            closeProductPage();
            renderProducts();
        }

        function resetFilters() {
            state.selectedCategory = 'all';
            state.selectedPriceMin = 0;
            state.selectedPriceMax = 99999;
            state.inStockOnly = false;
            closeProductPage();
            renderProducts();
        }

        function toggleInStock(cb) {
            state.inStockOnly = cb.checked;
            renderProducts();
        }

        function toggleWishlist(id) {
            const numericId = Number(id);
            const idx = state.wishlist.indexOf(numericId);
            if (idx === -1) state.wishlist.push(numericId);
            else state.wishlist.splice(idx, 1);
            localStorage.setItem('oz_wishlist', JSON.stringify(state.wishlist));
            updateWishlistBadge();
            renderProducts();
        }

        function updateWishlistBadge() {
            const badge = document.getElementById('wishlist-badge');
            if (!badge) return;
            if (state.wishlist.length > 0) {
                badge.textContent = state.wishlist.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        function toggleModal(id) {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden');
        }

        function handleSearch(q) {
            const resBox = document.getElementById('search-results');
            if (!resBox) return;
            const query = (q || '').trim().toLowerCase();
            if (query.length < 2) {
                resBox.innerHTML = '<div class="text-center py-12 text-slate-400 font-bold text-xs">׳”׳§׳׳“ ׳©׳ ׳׳•׳¦׳¨ ׳׳• ׳§׳˜׳’׳•׳¨׳™׳” ׳‘׳×׳™׳‘׳× ׳”׳—׳™׳₪׳•׳©...</div>';
                return;
            }
            const match = products.filter(p => {
                const name = (p.name || '').toLowerCase();
                const cat = (p.category_name || '').toLowerCase();
                const desc = (p.short_description || '').toLowerCase();
                return name.includes(query) || cat.includes(query) || desc.includes(query);
            });
            if (match.length === 0) {
                resBox.innerHTML = '<div class="text-center py-12 text-slate-400 font-bold text-xs">׳׳ ׳ ׳׳¦׳׳• ׳׳•׳¦׳¨׳™׳ ׳×׳•׳׳׳™׳ ׳׳—׳™׳₪׳•׳© "' + query + '"</div>';
                return;
            }
            resBox.innerHTML = match.map(p => `
                <div class="p-4 bg-slate-50/80 hover:bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between gap-4 transition-colors">
                    <div onclick="openProductPage('${p.id}'); toggleModal('search-modal')" class="flex items-center gap-4 cursor-pointer flex-grow">
                        <img src="${p.image}" class="w-16 h-16 object-cover rounded-xl shrink-0 shadow-sm" />
                        <div class="text-right">
                            <span class="text-[10px] font-black text-oz-primary uppercase bg-purple-100 px-2 py-0.5 rounded-md">${p.category_name || '׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳”'}</span>
                            <h4 class="font-extrabold text-sm text-slate-900 mt-1 hover:text-oz-primary transition-colors">${p.name}</h4>
                            <div class="text-xs text-slate-500 line-clamp-1 mt-0.5">${p.short_description || ''}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <span class="font-black text-base text-oz-primary">ג‚×${p.price}</span>
                        <button onclick="addToCart('${p.id}'); toggleModal('search-modal')" class="py-2 px-3.5 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5">
                            <span>׳”׳•׳¡׳£ ׳׳¡׳ נ›’</span>
                        </button>
                        <button onclick="openProductPage('${p.id}'); toggleModal('search-modal')" class="py-2 px-3 bg-purple-100 hover:bg-purple-200 text-oz-primary font-bold text-xs rounded-xl transition-colors" title="׳¦׳₪׳” ׳‘׳“׳£ ׳”׳׳•׳¦׳¨">
                            <span>׳“׳£ ׳׳•׳¦׳¨ נ‘ן¸</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function openQuickView(id) {
            const product = products.find(p => String(p.id) === String(id));
            if (!product) return;
            const container = document.getElementById('quick-view-content');
            if (!container) return;

            const waText = encodeURIComponent('׳©׳׳•׳ ׳׳›׳•׳ ׳¢׳•׳–, ׳׳ ׳™ ׳׳¢׳•׳ ׳™׳™׳ ׳‘׳׳•׳¦׳¨: ' + product.name);

            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <!-- Product Image -->
                    <div class="bg-slate-50 p-4 rounded-3xl border border-purple-100 text-center relative overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-cover rounded-2xl shadow-md" />
                        <span class="absolute top-4 right-4 bg-emerald-500 text-white font-black text-xs py-1 px-3 rounded-full shadow">׳‘׳׳׳׳™ ג€¢ ׳׳©׳׳•׳— ׳׳”׳™׳¨ נ</span>
                    </div>

                    <!-- Product Info & Actions -->
                    <div class="space-y-5 text-right">
                        <div>
                            <span class="text-xs font-black text-oz-primary uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100">${product.category_name || '׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳”'}</span>
                            <h2 class="text-2xl font-black text-slate-900 mt-3">${product.name}</h2>
                            <div class="text-2xl font-black text-oz-primary mt-2">ג‚×${product.price} <span class="text-xs text-slate-400 font-normal">׳›׳•׳׳ ׳׳¢"׳</span></div>
                        </div>

                        <div class="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs text-slate-700 leading-relaxed font-medium">
                            ${product.short_description || '׳׳•׳¦׳¨ ׳₪׳¨׳™׳׳™׳•׳ ׳׳‘׳™׳× ׳׳›׳•׳ ׳¢׳•׳– ׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳” (׳¨׳׳© ׳”׳¢׳™׳) ג€“ ׳׳™׳›׳•׳× ׳׳׳ ׳₪׳©׳¨׳•׳×, ׳׳—׳¨׳™׳•׳× ׳׳׳׳” ׳•׳›׳©׳¨׳•׳× ׳׳•׳¡׳׳›׳×.'}
                        </div>

                        <div class="space-y-2 text-xs font-bold text-slate-700">
                            <div class="flex items-center gap-2 text-emerald-600">
                                <span>ג“</span> <span>׳‘׳“׳™׳§׳× ׳”׳’׳”׳× ׳׳—׳©׳‘ ׳•׳’׳‘׳¨׳ ׳׳•׳¡׳׳›׳× ׳‘׳׳§׳•׳</span>
                            </div>
                            <div class="flex items-center gap-2 text-emerald-600">
                                <span>ג“</span> <span>׳׳—׳¨׳™׳•׳× ׳׳׳׳” ׳©׳ ׳׳›׳•׳ ׳¢׳•׳– (׳©׳׳•׳ ׳׳ ׳¦׳•׳¨׳” 48, ׳¨׳׳© ׳”׳¢׳™׳)</span>
                            </div>
                            <div class="flex items-center gap-2 text-emerald-600">
                                <span>ג“</span> <span>׳׳©׳׳•׳— ׳—׳™׳ ׳ ׳‘׳›׳ ׳”׳–׳׳ ׳” ׳׳¢׳ ג‚×399</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="pt-3 space-y-3">
                            <button onclick="openProductPage('${product.id}'); toggleModal('quick-view-modal')" class="w-full py-3.5 bg-purple-100 hover:bg-purple-200 text-oz-primary font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2">
                                <span>׳¦׳₪׳” ׳‘׳“׳£ ׳”׳׳•׳¦׳¨ ׳”׳׳׳ נ‘ן¸</span>
                            </button>

                            <button onclick="addToCart('${product.id}'); toggleModal('quick-view-modal')" class="w-full py-4 bg-oz-primary hover:bg-oz-hover text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <span>׳”׳•׳¡׳£ ׳׳¡׳ ׳”׳§׳ ׳™׳•׳× נ›’</span>
                            </button>

                            <a href="https://wa.me/972526867192?text=${waText}" target="_blank" class="w-full py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                                <span>׳”׳–׳׳ ׳“׳¨׳ ׳•׳•׳׳˜׳¡׳׳₪ נ’¬</span>
                            </a>
                        </div>

                        <div class="pt-2 text-center">
                            <button onclick="toggleModal('quick-view-modal')" class="text-xs font-bold text-slate-500 hover:text-oz-primary underline">ג† ׳—׳–׳•׳¨ ׳׳§׳˜׳׳•׳’ ׳”׳׳•׳¦׳¨׳™׳</button>
                        </div>
                    </div>
                </div>
            `;

            toggleModal('quick-view-modal');
        }

        // DEDICATED FULL PRODUCT DETAIL PAGE (PDP) LOGIC
        let pdpCurrentQty = 1;

        function updatePDPQty(delta) {
            pdpCurrentQty = Math.max(1, pdpCurrentQty + delta);
            const qtyEl = document.getElementById('pdp-qty-val');
            if (qtyEl) qtyEl.textContent = pdpCurrentQty;
        }

        function addToCartFromPDP(id) {
            const product = products.find(p => String(p.id) === String(id));
            if (!product) return;
            const qty = pdpCurrentQty || 1;
            const existing = state.cart.find(item => String(item.id) === String(id));
            if (existing) {
                existing.qty += qty;
            } else {
                state.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty: qty
                });
            }
            updateCartUI();
            toggleCartDrawer();
        }

        function buyNowFromPDP(id) {
            addToCartFromPDP(id);
            openCheckoutModal();
        }

        function toggleWishlistPDP(id) {
            toggleWishlist(id);
            const isFav = state.wishlist.includes(Number(id));
            const btn = document.getElementById('pdp-wishlist-btn');
            if (btn) {
                btn.innerHTML = `<svg class="w-6 h-6 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 fill-none'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>`;
            }
        }

        function switchPDPTab(tabName) {
            const tabs = ['desc', 'specs', 'shipping'];
            tabs.forEach(t => {
                const btn = document.getElementById('pdp-tab-btn-' + t);
                const content = document.getElementById('pdp-tab-content-' + t);
                if (btn && content) {
                    if (t === tabName) {
                        btn.className = 'py-3.5 px-6 font-black text-xs text-oz-primary border-b-2 border-oz-primary bg-purple-50/50 rounded-t-xl transition-all';
                        content.classList.remove('hidden');
                    } else {
                        btn.className = 'py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-xl transition-all';
                        content.classList.add('hidden');
                    }
                }
            });
        }

        function openProductPage(id) {
            const product = products.find(p => String(p.id) === String(id));
            if (!product) return;

            const hero = document.getElementById('hero') || document.getElementById('animated-hero');
            const shop = document.getElementById('shop');
            const magazine = document.getElementById('magazine');
            const pdp = document.getElementById('product-page-container');

            if (!pdp) return;

            if (hero) hero.classList.add('hidden');
            if (shop) shop.classList.add('hidden');
            if (magazine) magazine.classList.add('hidden');

            pdp.classList.remove('hidden');
            pdp.innerHTML = generateProductPageHTML(product);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function closeProductPage() {
            const hero = document.getElementById('hero') || document.getElementById('animated-hero');
            const shop = document.getElementById('shop');
            const magazine = document.getElementById('magazine');
            const pdp = document.getElementById('product-page-container');

            if (pdp) pdp.classList.add('hidden');
            if (hero) hero.classList.remove('hidden');
            if (shop) shop.classList.remove('hidden');
            if (magazine) magazine.classList.remove('hidden');

            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }

        function generateProductPageHTML(product) {
            pdpCurrentQty = 1;
            const isFav = state.wishlist.includes(Number(product.id));
            const catName = product.category_name || '׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳”';
            const waText = encodeURIComponent('׳©׳׳•׳ ׳׳›׳•׳ ׳¢׳•׳–, ׳׳ ׳™ ׳׳¢׳•׳ ׳™׳™׳ ׳‘׳׳•׳¦׳¨: ' + product.name + ' (׳׳—׳™׳¨: ג‚×' + product.price + ')');
            const waUrl = 'https://wa.me/972526867192?text=' + waText;

            const related = products.filter(p => String(p.id) !== String(product.id) && (p.category === product.category || p.category_name === product.category_name)).slice(0, 4);
            if (related.length < 4) {
                const extra = products.filter(p => String(p.id) !== String(product.id) && !related.includes(p)).slice(0, 4 - related.length);
                related.push(...extra);
            }

            const freeShippingNotice = product.price >= 399 ? 
                '<span class="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">נ‰ ׳–׳›׳׳™ ׳׳׳©׳׳•׳— ׳—׳™׳ ׳ ׳¢׳“ ׳”׳‘׳™׳×!</span>' : 
                '<span class="bg-amber-50 text-amber-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-200">נ ׳׳©׳׳•׳— ׳—׳™׳ ׳ ׳‘׳¨׳›׳™׳©׳” ׳׳¢׳ ג‚×399</span>';

            return `
                <div class="space-y-8 animate-toast text-right">
                    <!-- Breadcrumbs Navigation Bar -->
                    <div class="flex items-center justify-between flex-wrap gap-4 bg-white p-4 px-6 rounded-3xl border border-purple-100 oz-shadow">
                        <nav class="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <button onclick="closeProductPage()" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                                <span>נ  ׳“׳£ ׳”׳‘׳™׳×</span>
                            </button>
                            <span>/</span>
                            <button onclick="closeProductPage(); filterCategory('${product.category || 'all'}')" class="hover:text-oz-primary transition-colors text-oz-primary font-bold">
                                ${catName}
                            </button>
                            <span>/</span>
                            <span class="text-slate-800 font-extrabold truncate max-w-[200px] sm:max-w-md">${product.name}</span>
                        </nav>
                        <button onclick="closeProductPage()" class="py-2.5 px-4 bg-purple-50 hover:bg-oz-primary hover:text-white text-oz-primary font-black text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-2 shadow-sm">
                            <span>ג† ׳—׳–׳•׳¨ ׳׳§׳˜׳׳•׳’ ׳”׳׳•׳¦׳¨׳™׳</span>
                        </button>
                    </div>

                    <!-- MAIN PRODUCT HERO SECTION (2 Columns) -->
                    <div class="bg-white p-6 sm:p-10 rounded-3xl border border-purple-100 oz-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        <!-- Left Column: Visual Gallery & Badges (Lg: 5/12) -->
                        <div class="lg:col-span-5 space-y-4">
                            <div class="bg-slate-50 rounded-3xl border border-purple-100 p-4 relative overflow-hidden group">
                                <img id="pdp-main-image" src="${product.image}" alt="${product.name}" class="w-full h-80 sm:h-[420px] object-cover rounded-2xl shadow-md transition-transform duration-500 group-hover:scale-105" />
                                
                                <div class="absolute top-6 right-6 flex flex-col gap-2 items-start z-10">
                                    <span class="bg-emerald-500 text-white font-black text-[11px] py-1 px-3 rounded-full shadow-md flex items-center gap-1">
                                        ג“ ׳‘׳׳׳׳™ ׳׳׳©׳׳•׳— ׳׳™׳™׳“׳™
                                    </span>
                                    <span class="bg-amber-400 text-slate-950 font-black text-[11px] py-1 px-3 rounded-full shadow-md flex items-center gap-1">
                                        ג­ 100% ׳›׳©׳¨׳•׳× ׳•׳׳™׳›׳•׳×
                                    </span>
                                </div>

                                <button onclick="toggleWishlistPDP('${product.id}')" id="pdp-wishlist-btn" class="absolute top-6 left-6 z-10 w-11 h-11 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                                    <svg class="w-6 h-6 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 fill-none'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                                </button>
                            </div>

                            <!-- Alternate Thumbnails Bar -->
                            <div class="grid grid-cols-4 gap-2">
                                <button onclick="document.getElementById('pdp-main-image').src='${product.image}'" class="border-2 border-oz-primary rounded-xl overflow-hidden h-20 bg-slate-50 p-1">
                                    <img src="${product.image}" class="w-full h-full object-cover rounded-lg" />
                                </button>
                                <button onclick="document.getElementById('pdp-main-image').src='${product.image}'" class="border border-slate-200 hover:border-oz-primary rounded-xl overflow-hidden h-20 bg-slate-50 p-1 opacity-80 hover:opacity-100 transition-all">
                                    <img src="${product.image}" class="w-full h-full object-cover rounded-lg filter contrast-125" />
                                </button>
                                <button onclick="document.getElementById('pdp-main-image').src='${product.image}'" class="border border-slate-200 hover:border-oz-primary rounded-xl overflow-hidden h-20 bg-slate-50 p-1 opacity-80 hover:opacity-100 transition-all">
                                    <img src="${product.image}" class="w-full h-full object-cover rounded-lg filter brightness-110" />
                                </button>
                                <div class="border border-purple-100 rounded-xl bg-purple-50/50 flex flex-col items-center justify-center p-1 text-[10px] font-black text-oz-primary text-center">
                                    <span>׳׳›׳•׳ ׳¢׳•׳–</span>
                                    <span class="text-[9px] text-slate-500 font-normal">׳¨׳׳© ׳”׳¢׳™׳</span>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Specs & Purchasing Options (Lg: 7/12) -->
                        <div class="lg:col-span-7 space-y-6">
                            <div>
                                <div class="flex items-center gap-3 flex-wrap">
                                    <span class="text-xs font-black text-oz-primary uppercase bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200 tracking-wide">${catName}</span>
                                    <span class="text-xs font-bold text-slate-400">׳׳§"׳˜: OZ-${product.id}</span>
                                </div>

                                <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-3 leading-snug">${product.name}</h1>

                                <div class="flex items-center gap-2 mt-2">
                                    <div class="flex text-amber-400 text-sm">ג˜…ג˜…ג˜…ג˜…ג˜…</div>
                                    <span class="text-xs font-extrabold text-slate-700">5.0</span>
                                    <span class="text-xs font-medium text-slate-400">(28 ׳—׳•׳•׳× ׳“׳¢׳× ׳׳׳•׳׳×׳•׳×)</span>
                                </div>
                            </div>

                            <!-- Price & Free Shipping Container -->
                            <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <div class="text-3xl sm:text-4xl font-black text-oz-primary">ג‚×${product.price}</div>
                                    <div class="text-xs text-slate-500 font-bold mt-0.5">׳׳—׳™׳¨ ׳›׳•׳׳ ׳׳¢"׳ ׳›׳—׳•׳§</div>
                                </div>
                                <div>
                                    ${freeShippingNotice}
                                </div>
                            </div>

                            <!-- Short Description Box -->
                            <div class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-100">
                                ${product.short_description || product.description || '׳׳•׳¦׳¨ ׳™׳•׳§׳¨׳×׳™ ׳•׳׳¢׳•׳׳” ׳׳‘׳™׳× ׳׳›׳•׳ ׳¢׳•׳– (׳©׳׳•׳ ׳׳ ׳¦׳•׳¨׳” 48, ׳¨׳׳© ׳”׳¢׳™׳). ׳׳™׳•׳¦׳¨ ׳×׳—׳× ׳”׳©׳’׳—׳” ׳§׳₪׳“׳ ׳™׳×, ׳×׳•׳ ׳“׳’׳© ׳¢׳ ׳”׳™׳“׳•׳¨ ׳׳¦׳•׳•׳” ׳•׳׳™׳›׳•׳× ׳׳׳ ׳₪׳©׳¨׳•׳×.'}
                            </div>

                            <!-- Quantity Selector & Actions -->
                            <div class="space-y-4 pt-2">
                                <div class="flex items-center gap-4">
                                    <span class="text-xs font-black text-slate-700">׳›׳׳•׳× ׳׳‘׳—׳™׳¨׳”:</span>
                                    <div class="flex items-center border-2 border-purple-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                        <button onclick="updatePDPQty(-1)" class="w-10 h-10 font-black text-slate-700 text-lg hover:bg-purple-100 transition-colors">-</button>
                                        <span id="pdp-qty-val" class="w-12 text-center font-black text-sm text-oz-primary">1</span>
                                        <button onclick="updatePDPQty(1)" class="w-10 h-10 font-black text-slate-700 text-lg hover:bg-purple-100 transition-colors">+</button>
                                    </div>
                                </div>

                                <!-- Main Action Buttons Grid -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button onclick="addToCartFromPDP('${product.id}')" class="py-4 px-6 bg-oz-primary hover:bg-oz-hover text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                                        <span>׳”׳•׳¡׳£ ׳׳¡׳ ׳”׳§׳ ׳™׳•׳× נ›’</span>
                                    </button>

                                    <button onclick="buyNowFromPDP('${product.id}')" class="py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <span>ג¡ ׳¨׳›׳•׳© ׳¢׳›׳©׳™׳• (׳׳§׳•׳₪׳”)</span>
                                    </button>
                                </div>

                                <!-- WhatsApp Direct Order -->
                                <a href="${waUrl}" target="_blank" class="w-full py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                    <span>׳”׳–׳׳ ׳” ׳׳”׳™׳¨׳” ׳•׳™׳™׳¢׳•׳¥ ׳׳™׳©׳™ ׳‘׳•׳•׳׳˜׳¡׳׳₪ נ’¬</span>
                                </a>
                            </div>

                            <!-- Guarantee & Trust Badges Grid -->
                            <div class="grid grid-cols-3 gap-3 pt-4 border-t border-purple-100 text-center">
                                <div class="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                                    <div class="text-xl mb-1">נ</div>
                                    <div class="text-[11px] font-black text-slate-800">׳׳©׳׳•׳— ׳׳”׳™׳¨</div>
                                    <div class="text-[9px] text-slate-500 font-bold">1-3 ׳™׳׳™ ׳¢׳¡׳§׳™׳</div>
                                </div>
                                <div class="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                                    <div class="text-xl mb-1">נ“</div>
                                    <div class="text-[11px] font-black text-slate-800">100% ׳›׳©׳¨׳•׳×</div>
                                    <div class="text-[9px] text-slate-500 font-bold">׳”׳’׳”׳× ׳׳—׳©׳‘ ׳•׳’׳‘׳¨׳</div>
                                </div>
                                <div class="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                                    <div class="text-xl mb-1">נ›¡ן¸</div>
                                    <div class="text-[11px] font-black text-slate-800">׳׳—׳¨׳™׳•׳× ׳¢׳•׳–</div>
                                    <div class="text-[9px] text-slate-500 font-bold">׳¨׳׳© ׳”׳¢׳™׳</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TABBED SPECIFICATIONS & INFORMATION SECTION -->
                    <div class="bg-white rounded-3xl border border-purple-100 oz-shadow overflow-hidden">
                        <!-- Tab Headers -->
                        <div class="flex border-b border-purple-100 bg-slate-50/50">
                            <button id="pdp-tab-btn-desc" onclick="switchPDPTab('desc')" class="py-3.5 px-6 font-black text-xs text-oz-primary border-b-2 border-oz-primary bg-purple-50/50 rounded-t-xl transition-all">
                                נ“„ ׳×׳™׳׳•׳¨ ׳׳•׳¨׳—׳‘
                            </button>
                            <button id="pdp-tab-btn-specs" onclick="switchPDPTab('specs')" class="py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-xl transition-all">
                                נ“‹ ׳׳₪׳¨׳˜ ׳˜׳›׳ ׳™ ׳•׳”׳©׳’׳—׳”
                            </button>
                            <button id="pdp-tab-btn-shipping" onclick="switchPDPTab('shipping')" class="py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-xl transition-all">
                                נ ׳׳©׳׳•׳—׳™׳ ׳•׳׳™׳¡׳•׳£ ׳¢׳¦׳׳™
                            </button>
                        </div>

                        <!-- Tab Contents -->
                        <div class="p-6 sm:p-8">
                            <!-- Tab 1: Detailed Description -->
                            <div id="pdp-tab-content-desc" class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                                <h3 class="text-base font-black text-slate-900">׳›׳ ׳׳” ׳©׳¦׳¨׳™׳ ׳׳“׳¢׳× ׳¢׳ ${product.name}</h3>
                                <p>
                                    ${product.description || product.short_description || '׳׳•׳¦׳¨ ׳–׳” ׳ ׳‘׳—׳¨ ׳‘׳§׳₪׳™׳“׳” ׳¢׳ ׳™׳“׳™ ׳¡׳•׳₪׳¨׳™ ׳”׳¡׳×"׳ ׳•׳”׳׳•׳׳—׳™׳ ׳©׳ ׳׳›׳•׳ ׳¢׳•׳–. ׳׳ ׳• ׳׳×׳—׳™׳™׳‘׳™׳ ׳׳׳™׳›׳•׳× ׳׳׳ ׳₪׳©׳¨׳•׳×, ׳’׳™׳׳•׳¨ ׳׳•׳©׳׳ ׳•׳¢׳׳™׳“׳” ׳‘׳›׳ ׳›׳׳׳™ ׳”׳”׳׳›׳” ׳•׳”׳™׳“׳•׳¨ ׳”׳׳¦׳•׳•׳”.'}
                                </p>
                                <div class="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2 text-xs font-bold text-slate-800">
                                    <div class="text-oz-primary font-black">ג¨ ׳“׳’׳©׳™׳ ׳׳™׳•׳—׳“׳™׳ ׳©׳ ׳׳›׳•׳ ׳¢׳•׳–:</div>
                                    <div>ג€¢ ׳›׳ ׳׳•׳¦׳¨׳™ ׳”׳¡׳×"׳ ׳ ׳‘׳“׳§׳™׳ ׳׳™׳©׳™׳× ׳‘׳”׳’׳”׳” ׳׳׳•׳—׳©׳‘׳× ׳•׳‘׳”׳’׳”׳× ׳’׳‘׳¨׳ ׳׳•׳¡׳׳›׳×.</div>
                                    <div>ג€¢ ׳׳¨׳™׳–׳” ׳׳”׳•׳“׳¨׳× ׳•׳׳™׳›׳•׳×׳™׳× ׳”׳׳×׳׳™׳׳” ׳’׳ ׳›׳׳×׳ ׳” ׳׳™׳•׳—׳“׳× ׳׳‘׳¨ ׳׳¦׳•׳•׳”, ׳—׳×׳ ׳׳• ׳׳™׳¨׳•׳¢ ׳×׳•׳¨׳ ׳™.</div>
                                    <div>ג€¢ ׳©׳™׳¨׳•׳× ׳׳§׳•׳—׳•׳× ׳׳™׳©׳™ ׳•׳׳¢׳ ׳” ׳”׳׳›׳×׳™ ׳׳׳ ׳‘׳›׳×׳•׳‘׳×׳ ׳•: ׳©׳׳•׳ ׳׳ ׳¦׳•׳¨׳” 48, ׳¨׳׳© ׳”׳¢׳™׳.</div>
                                </div>
                            </div>

                            <!-- Tab 2: Specs Table -->
                            <div id="pdp-tab-content-specs" class="hidden">
                                <table class="w-full text-right text-xs text-slate-700 border-collapse">
                                    <tbody>
                                        <tr class="border-b border-slate-100">
                                            <td class="py-3 font-black text-slate-900 w-1/3">׳׳§"׳˜ ׳”׳׳•׳¦׳¨:</td>
                                            <td class="py-3 text-slate-600 font-bold">OZ-${product.id}</td>
                                        </tr>
                                        <tr class="border-b border-slate-100">
                                            <td class="py-3 font-black text-slate-900">׳§׳˜׳’׳•׳¨׳™׳”:</td>
                                            <td class="py-3 text-slate-600 font-bold">${catName}</td>
                                        </tr>
                                        <tr class="border-b border-slate-100">
                                            <td class="py-3 font-black text-slate-900">׳¨׳׳× ׳›׳©׳¨׳•׳× ׳•׳”׳©׳’׳—׳”:</td>
                                            <td class="py-3 text-emerald-700 font-black">100% ׳›׳©׳¨׳•׳× ׳׳•׳¡׳׳›׳× ג€¢ ׳”׳’׳”׳× ׳׳—׳©׳‘ ׳•׳’׳‘׳¨׳</td>
                                        </tr>
                                        <tr class="border-b border-slate-100">
                                            <td class="py-3 font-black text-slate-900">׳׳—׳¨׳™׳•׳×:</td>
                                            <td class="py-3 text-slate-600 font-bold">׳׳—׳¨׳™׳•׳× ׳׳׳׳” ׳©׳ ׳׳›׳•׳ ׳¢׳•׳– (׳¨׳׳© ׳”׳¢׳™׳)</td>
                                        </tr>
                                        <tr>
                                            <td class="py-3 font-black text-slate-900">׳׳₪׳©׳¨׳•׳× ׳׳©׳׳•׳—:</td>
                                            <td class="py-3 text-slate-600 font-bold">׳׳©׳׳•׳— ׳׳”׳™׳¨ ׳¢׳“ ׳”׳‘׳™׳× ׳׳• ׳׳™׳¡׳•׳£ ׳¢׳¦׳׳™ ׳‘׳×׳™׳׳•׳ ׳׳¨׳׳©</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Tab 3: Shipping Policy -->
                            <div id="pdp-tab-content-shipping" class="hidden space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
                                <div class="flex items-start gap-3">
                                    <span class="text-lg">נ</span>
                                    <div>
                                        <h4 class="font-black text-slate-900 text-sm mb-0.5">׳׳©׳׳•׳—׳™׳ ׳¢׳“ ׳₪׳×׳— ׳”׳‘׳™׳×:</h4>
                                        <p>׳׳ ׳• ׳׳¡׳₪׳§׳™׳ ׳׳©׳׳•׳—׳™׳ ׳׳”׳™׳¨׳™׳ ׳׳›׳ ׳—׳׳§׳™ ׳”׳׳¨׳¥ ׳×׳•׳ 1-3 ׳™׳׳™ ׳¢׳¡׳§׳™׳. ׳׳©׳׳•׳— ׳—׳™׳ ׳ ׳‘׳”׳–׳׳ ׳” ׳׳¢׳ ג‚×399! ׳‘׳¨׳›׳™׳©׳” ׳׳×׳—׳× ׳-ג‚×399 ׳“׳׳™ ׳”׳׳©׳׳•׳— ׳”׳™׳ ׳ ג‚×35 ׳‘׳׳‘׳“.</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 pt-2 border-t border-slate-100">
                                    <span class="text-lg">נ¬</span>
                                    <div>
                                        <h4 class="font-black text-slate-900 text-sm mb-0.5">׳׳™׳¡׳•׳£ ׳¢׳¦׳׳™ ׳׳׳ ׳¢׳׳•׳×:</h4>
                                        <p>׳ ׳™׳×׳ ׳׳׳¡׳•׳£ ׳׳× ׳”׳”׳–׳׳ ׳” ׳‘׳׳•׳₪׳ ׳¢׳¦׳׳™ ׳׳׳›׳•׳ ׳¢׳•׳– ׳‘׳›׳×׳•׳‘׳× <strong>׳©׳׳•׳ ׳׳ ׳¦׳•׳¨׳” 48, ׳¨׳׳© ׳”׳¢׳™׳</strong> ׳‘׳×׳™׳׳•׳ ׳׳¨׳׳© ׳‘׳˜׳׳₪׳•׳ <strong>052-686-7192</strong>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RELATED PRODUCTS GRID SECTION -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-black text-slate-900">׳׳•׳¦׳¨׳™׳ ׳׳•׳׳׳¦׳™׳ ׳ ׳•׳¡׳₪׳™׳ ׳©׳׳•׳׳™ ׳×׳׳”׳‘:</h3>
                            <button onclick="closeProductPage()" class="text-xs font-bold text-oz-primary hover:underline">׳׳›׳ ׳”׳׳•׳¦׳¨׳™׳ ׳‘׳§׳˜׳׳•׳’ ג†</button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            ${related.map(r => `
                                <div onclick="openProductPage('${r.id}')" class="bg-white p-4 rounded-2xl border border-purple-100 oz-shadow hover:-translate-y-1 transition-transform cursor-pointer group flex flex-col justify-between">
                                    <div>
                                        <img src="${r.image}" alt="${r.name}" class="w-full h-36 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform" />
                                        <span class="text-[10px] font-black text-oz-primary uppercase bg-purple-50 px-2 py-0.5 rounded-md">${r.category_name || '׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳”'}</span>
                                        <h4 class="font-bold text-xs text-slate-800 line-clamp-2 mt-1 group-hover:text-oz-primary transition-colors">${r.name}</h4>
                                    </div>
                                    <div class="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                                        <span class="font-black text-sm text-oz-primary">ג‚×${r.price}</span>
                                        <span class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">׳¦׳₪׳” ׳‘׳׳•׳¦׳¨ נ‘ן¸</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- CUSTOMER REVIEWS & TRUST SECTION -->
                    <div class="bg-purple-50/60 p-6 rounded-3xl border border-purple-100 space-y-4">
                        <div class="text-center">
                            <span class="text-xs font-black text-oz-primary uppercase tracking-widest bg-white py-1 px-3 rounded-full border border-purple-200">׳—׳•׳•׳× ׳“׳¢׳× ׳׳׳•׳׳×׳•׳×</span>
                            <h3 class="text-xl font-black text-slate-900 mt-2">׳׳” ׳׳•׳׳¨׳™׳ ׳”׳׳§׳•׳—׳•׳× ׳©׳ ׳׳›׳•׳ ׳¢׳•׳–?</h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                            <div class="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-2">
                                <div class="text-amber-400 text-xs">ג˜…ג˜…ג˜…ג˜…ג˜…</div>
                                <p class="text-xs text-slate-700 font-medium">"׳”׳–׳׳ ׳×׳™ ׳×׳₪׳™׳׳™׳ ׳׳‘׳ ׳©׳׳™ ׳׳‘׳¨ ׳”׳׳¦׳•׳•׳”. ׳©׳™׳¨׳•׳× ׳׳“׳™׳‘ ׳•׳׳§׳¦׳•׳¢׳™ ׳‘׳¨׳׳” ׳”׳›׳™ ׳’׳‘׳•׳”׳”, ׳”׳’׳”׳” ׳ ׳§׳™׳™׳” ׳•׳׳©׳׳•׳— ׳¡׳•׳₪׳¨ ׳׳”׳™׳¨!"</p>
                                <div class="text-[11px] font-black text-slate-900">ג€” ׳ ׳×׳ ׳׳ ׳›׳”׳, ׳™׳¨׳•׳©׳׳™׳</div>
                            </div>
                            <div class="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-2">
                                <div class="text-amber-400 text-xs">ג˜…ג˜…ג˜…ג˜…ג˜…</div>
                                <p class="text-xs text-slate-700 font-medium">"׳׳¨׳ ׳§ ׳¢׳•׳¨ ׳׳“׳”׳™׳! ׳”׳¢׳•׳¨ ׳¨׳ ׳•׳׳™׳›׳•׳×׳™ ׳‘׳˜׳™׳¨׳•׳£, ׳”׳’׳™׳¢ ׳¢׳˜׳•׳£ ׳™׳₪׳”׳₪׳”. ׳×׳•׳“׳” ׳¨׳‘׳” ׳¢׳•׳–!"</p>
                                <div class="text-[11px] font-black text-slate-900">ג€” ׳׳׳™׳¢׳–׳¨ ׳©., ׳₪׳×׳— ׳×׳§׳•׳•׳”</div>
                            </div>
                            <div class="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-2">
                                <div class="text-amber-400 text-xs">ג˜…ג˜…ג˜…ג˜…ג˜…</div>
                                <p class="text-xs text-slate-700 font-medium">"׳׳–׳•׳–׳•׳× ׳›׳©׳¨׳•׳× ׳‘׳”׳©׳’׳—׳” ׳׳¢׳•׳׳”. ׳”׳©׳™׳¨׳•׳× ׳©׳ ׳©׳׳•׳ ׳”׳™׳” ׳׳“׳™׳‘ ׳•׳¡׳‘׳׳ ׳™ ׳׳›׳ ׳©׳׳׳”. ׳׳•׳׳׳¥ ׳‘׳—׳•׳."</p>
                                <div class="text-[11px] font-black text-slate-900">ג€” ׳“׳•׳“ ׳׳ ׳—׳, ׳¨׳׳© ׳”׳¢׳™׳</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function toggleCartDrawer() {
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-drawer-backdrop');
            if (!drawer) return;
            const isHidden = drawer.classList.contains('translate-x-full') || drawer.style.transform === 'translateX(100%)' || drawer.style.transform === '';
            if (isHidden) {
                drawer.classList.remove('translate-x-full');
                drawer.style.transform = 'translateX(0%)';
                if (backdrop) backdrop.classList.remove('hidden');
            } else {
                drawer.classList.add('translate-x-full');
                drawer.style.transform = 'translateX(100%)';
                if (backdrop) backdrop.classList.add('hidden');
            }
        }

        function openCheckoutFromDrawer() {
            toggleCartDrawer();
            openCheckoutModal();
        }

        function addToCart(id) {
            const product = products.find(p => String(p.id) === String(id));
            if (!product) return;
            const existing = state.cart.find(item => String(item.id) === String(id));
            if (existing) {
                existing.qty += 1;
            } else {
                state.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty: 1
                });
            }
            updateCartUI();
            toggleCartDrawer();
        }

        function changeCartQty(id, delta) {
            const item = state.cart.find(i => String(i.id) === String(id));
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) {
                state.cart = state.cart.filter(i => String(i.id) !== String(id));
            }
            updateCartUI();
        }

        function removeFromCart(id) {
            state.cart = state.cart.filter(i => String(i.id) !== String(id));
            updateCartUI();
        }

        function updateCartUI() {
            let total = 0;
            let itemCount = 0;
            state.cart.forEach(item => {
                total += item.price * item.qty;
                itemCount += item.qty;
            });

            const itemLabel = itemCount === 1 ? '׳₪׳¨׳™׳˜ 1' : `${itemCount} ׳₪׳¨׳™׳˜׳™׳`;

            // 1. Floating Cart Button
            const floatingBadge = document.getElementById('floating-cart-badge');
            const floatingTotal = document.getElementById('floating-cart-total');
            const floatingPulse = document.getElementById('floating-cart-pulse');
            if (floatingBadge) floatingBadge.textContent = itemCount;
            if (floatingTotal) floatingTotal.textContent = itemLabel;
            if (floatingPulse) {
                if (itemCount > 0) floatingPulse.classList.remove('hidden');
                else floatingPulse.classList.add('hidden');
            }

            // 2. Header Cart Badge & Total
            const headerBadge = document.getElementById('header-cart-badge');
            const headerTotal = document.getElementById('header-cart-total');
            if (headerBadge) {
                headerBadge.textContent = itemCount;
                if (itemCount > 0) headerBadge.classList.remove('hidden');
                else headerBadge.classList.add('hidden');
            }
            if (headerTotal) headerTotal.textContent = itemLabel;

            // 3. Cart Drawer Elements
            const drawerItems = document.getElementById('cart-drawer-items');
            const drawerCount = document.getElementById('cart-drawer-count');
            const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
            const drawerShippingCost = document.getElementById('cart-drawer-shipping-cost');
            const drawerTotal = document.getElementById('cart-drawer-total');
            const drawerProgress = document.getElementById('drawer-shipping-progress');
            const drawerDiff = document.getElementById('drawer-shipping-diff');

            if (drawerCount) drawerCount.textContent = `${itemCount} ׳₪׳¨׳™׳˜׳™׳ ׳‘׳¡׳`;
            if (drawerSubtotal) drawerSubtotal.textContent = `ג‚×${total}`;

            const shippingFee = total >= 399 || total === 0 ? 0 : 35;
            if (drawerShippingCost) drawerShippingCost.textContent = total >= 399 ? '׳—׳™׳ ׳ נ‰' : (total === 0 ? 'ג‚×0' : 'ג‚×35');
            if (drawerTotal) drawerTotal.textContent = `ג‚×${total === 0 ? 0 : total + shippingFee}`;

            if (drawerProgress) {
                const pct = Math.min(100, Math.round((total / 399) * 100));
                drawerProgress.style.width = `${pct}%`;
            }

            if (drawerDiff) {
                if (total >= 399) {
                    drawerDiff.textContent = '׳–׳›׳׳™ ׳׳׳©׳׳•׳— ׳—׳™׳ ׳! נ‰';
                    drawerDiff.className = 'text-emerald-600 font-black';
                } else {
                    drawerDiff.textContent = `׳ ׳•׳×׳¨׳• ׳¢׳•׳“ ג‚×${399 - total}`;
                    drawerDiff.className = 'text-oz-primary font-black';
                }
            }

            if (drawerItems) {
                if (state.cart.length === 0) {
                    drawerItems.innerHTML = `
                        <div class="text-center py-16 px-4">
                            <div class="w-16 h-16 bg-purple-50 text-oz-primary rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">נ›’</div>
                            <h4 class="font-black text-slate-800 text-base mb-1">׳¡׳ ׳”׳§׳ ׳™׳•׳× ׳©׳׳ ׳¨׳™׳§</h4>
                            <p class="text-xs text-slate-500 mb-6 font-medium">׳”׳•׳¡׳£ ׳׳•׳¦׳¨׳™׳ ׳׳”׳—׳ ׳•׳× ׳›׳“׳™ ׳׳”׳×׳—׳™׳</p>
                            <button onclick="toggleCartDrawer(); closeProductPage()" class="py-3 px-6 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all">׳¢׳‘׳•׳¨ ׳׳—׳ ׳•׳× נ›ן¸</button>
                        </div>
                    `;
                } else {
                    drawerItems.innerHTML = state.cart.map(item => `
                        <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
                            <img src="${item.image}" class="w-14 h-14 object-cover rounded-xl shrink-0 shadow-sm" />
                            <div class="flex-grow text-right">
                                <h4 class="font-bold text-xs text-slate-800 line-clamp-1">${item.name}</h4>
                                <div class="text-xs font-black text-oz-primary mt-0.5">ג‚×${item.price}</div>
                                <div class="flex items-center gap-2 mt-2">
                                    <button onclick="changeCartQty('${item.id}', -1)" class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center hover:bg-purple-100 transition-colors">-</button>
                                    <span class="text-xs font-black text-slate-800 px-1">${item.qty}</span>
                                    <button onclick="changeCartQty('${item.id}', 1)" class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center hover:bg-purple-100 transition-colors">+</button>
                                </div>
                            </div>
                            <button onclick="removeFromCart('${item.id}')" class="text-slate-400 hover:text-red-500 p-1 transition-colors" title="׳”׳¡׳¨ ׳₪׳¨׳™׳˜">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    `).join('');
                }
            }
        }