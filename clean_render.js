// GLOBAL SEO ACCORDION EXPAND TOGGLE
window.toggleSeoExpand = function(id) {
    const el = document.getElementById('seo-content-' + id);
    const btn = document.getElementById('seo-btn-' + id);
    if (!el || !btn) return;
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        btn.innerHTML = 'הצג פחות ↑';
    } else {
        el.classList.add('hidden');
        btn.innerHTML = 'קרא עוד... ↓';
    }
};

// PERSONALIZATION & USER PREFERENCE TRACKER ENGINE
window.UserTracker = {
    getPreferences() {
        try {
            const raw = localStorage.getItem('oz_user_preferences');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { categoryScores: {}, viewedProducts: [] };
    },
    trackCategory(cat, points = 1) {
        if (!cat || cat === 'all') return;
        const prefs = this.getPreferences();
        prefs.categoryScores[cat] = (prefs.categoryScores[cat] || 0) + points;
        try {
            localStorage.setItem('oz_user_preferences', JSON.stringify(prefs));
        } catch (e) {}
    },
    trackProductView(productId, category) {
        if (!productId) return;
        const prefs = this.getPreferences();
        if (!prefs.viewedProducts.includes(String(productId))) {
            prefs.viewedProducts.push(String(productId));
        }
        if (category && category !== 'all') {
            prefs.categoryScores[category] = (prefs.categoryScores[category] || 0) + 2;
        }
        try {
            localStorage.setItem('oz_user_preferences', JSON.stringify(prefs));
        } catch (e) {}
    },
    getTopCategory() {
        const prefs = this.getPreferences();
        const scores = prefs.categoryScores;
        let topCat = null;
        let maxScore = -1;
        for (const cat in scores) {
            if (scores[cat] > maxScore) {
                maxScore = scores[cat];
                topCat = cat;
            }
        }
        return topCat;
    },
    getPersonalizedProducts(count = 2, excludeIds = []) {
        const prods = (typeof products !== 'undefined' && products.length > 0 ? products : (typeof realProductsDB !== 'undefined' ? realProductsDB : []));
        const topCat = this.getTopCategory();
        let pool = [];
        if (topCat) {
            pool = prods.filter(p => p.category === topCat && !excludeIds.includes(String(p.id)));
        }
        if (pool.length < count) {
            const remaining = prods.filter(p => !pool.includes(p) && !excludeIds.includes(String(p.id)));
            pool = pool.concat(remaining);
        }
        return pool.slice(0, count);
    }
};

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
                dots[i].className = 'w-6 h-3 rounded-full bg-purple-600 transition-all';
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
                               pName.includes('תפילין') || pName.includes('סופר') || pName.includes('סת"ם') || pName.includes('סתם') || pName.includes('קלף');
                if (!isStam) return false;
            }
            else if (state.selectedCategory === 'wallets') {
                const isWallet = (pCat === 'wallets' || pCatName.includes('ארנק') || pName.includes('ארנק')) && !pName.includes('תיק תפילין');
                if (!isWallet) return false;
            }
            else if (state.selectedCategory === 'tefillin-bags') {
                const isTefillinBag = pCat === 'tefillin-bags' || 
                                      ((pName.includes('תיק') || pName.includes('נרתיק') || pName.includes('כיסוי')) && !pName.includes('ארנק'));
                if (!isTefillinBag) return false;
            }
            else if (state.selectedCategory === 'tallitot-tzitzit') {
                const isTallit = pCat === 'tallitot-tzitzit' || pCatName.includes('טלית') || pCatName.includes('ציצית') || pName.includes('טלית') || pName.includes('ציצית');
                if (!isTallit) return false;
            }
            else if (state.selectedCategory === 'mezuzot' || state.selectedCategory.startsWith('mezuzot-')) {
                const isMezuzah = pCat === 'mezuzot' || pCatName.includes('מזוזה') || pName.includes('מזוזה');
                if (!isMezuzah) return false;
                if (state.selectedCategory === 'mezuzot-epoxy' && !pName.includes('אפוקסי') && (!p.subcategory || !p.subcategory.includes('אפוקסי'))) return false;
                if (state.selectedCategory === 'mezuzot-plastic' && !pName.includes('פלסטיק') && (!p.subcategory || !p.subcategory.includes('פלסטיק'))) return false;
                if (state.selectedCategory === 'mezuzot-aluminum' && !pName.includes('אלומיניום') && (!p.subcategory || !p.subcategory.includes('אלומיניום'))) return false;
                if (state.selectedCategory === 'mezuzot-wood' && !pName.includes('עץ') && !pName.includes('זית') && (!p.subcategory || !p.subcategory.includes('עץ'))) return false;
            }
            else if (state.selectedCategory === 'books') {
                const isBook = pCat === 'books' || pCatName.includes('ספר') || pCatName.includes('סידור') || pName.includes('ספר') || pName.includes('סידור') || pName.includes('חומש') || pName.includes('תהילים');
                if (!isBook) return false;
            }
            else if (state.selectedCategory === 'gifts') {
                const isGift = pCat === 'gifts' || pCat === 'sets' || pCatName.includes('מתנה') || pCatName.includes('מארז') || pName.includes('מתנה') || pName.includes('מארז') || pName.includes('סט');
                if (!isGift) return false;
            }
        }

        if (p.price < state.selectedPriceMin || p.price > state.selectedPriceMax) return false;
        if (state.inStockOnly && !p.inStock) return false;
        return true;
    });

    countEl.textContent = 'מציג ' + filtered.length + ' מוצרים בקטלוג';

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100"><svg class="w-10 h-10 text-slate-300 mx-auto mb-2 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg><p class="font-bold text-slate-500 text-sm">לא נמצאו מוצרים התואמים את הסינון שנבחר</p></div>';
        return;
    }

    const waPath = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

    grid.innerHTML = filtered.map(p => {
        const isFav = state.wishlist.includes(Number(p.id));
        const outOfStockLabel = p.inStock ? '' : '<span class="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white font-bold text-[9px] sm:text-[10px] py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-full">אזל מהמלאי</span>';
        const catName = p.category_name || 'תשמישי קדושה';

        return <div itemscope itemtype="https://schema.org/Product" class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">
                <meta itemprop="name" content="" />
                <meta itemprop="image" content="" />
                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="hidden">
                    <meta itemprop="priceCurrency" content="ILS" />
                    <meta itemprop="price" content="" />
                    <meta itemprop="availability" content="" />
                    <meta itemprop="url" content="https://oz-judaica.co.il/?product=" />
                </div>
                <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating" class="hidden">
                    <meta itemprop="ratingValue" content="4.9" />
                    <meta itemprop="reviewCount" content="38" />
                </div>
                <!-- Wishlist Heart Button -->
                <button onclick="toggleWishlist(${p.id})" class="wishlist-btn ${isFav ? 'active' : ''} absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-7 h-7 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-500 fill-none'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                </button>

                <div onclick="openProductPage('${p.id}')" class="cursor-pointer">
                    <div class="h-36 sm:h-52 bg-slate-100 overflow-hidden relative">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
                        ${outOfStockLabel}
                        <span onclick="event.stopPropagation(); openQuickView('${p.id}')" class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-bold text-[9px] sm:text-[10px] py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-full shadow-sm flex items-center gap-1 hover:bg-slate-50">
                            <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c.729-2.3 2.615-4.27 4.95-5.32 2.336-1.05 4.975-1.05 7.31 0 2.335 1.05 4.22 3.02 4.95 5.32.729 2.3-.729 4.27-4.95 5.32-2.335 1.05-4.221-3.02-4.95-5.32z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> תצוגה מהירה
                        </span>
                    </div>
                    <div class="p-3 sm:p-5">
                        <div class="flex items-center justify-between mb-0.5 sm:mb-1">
                            <div class="text-[9px] sm:text-[10px] font-extrabold text-oz-primary uppercase truncate"></div>
                            <div class="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                <span>ג˜…ג˜…ג˜…ג˜…ג˜…</span>
                                <span class="text-slate-400 font-bold text-[9px] mr-0.5">(4.9)</span>
                            </div>
                        </div>
                        <h4 class="font-extrabold text-xs sm:text-base text-slate-800 line-clamp-2 mb-1 sm:mb-2 group-hover:text-oz-primary transition-colors leading-snug">${p.name}</h4>
                        <div class="text-base sm:text-xl font-black text-oz-primary">₪${p.price}</div>
                    </div>
                </div>

                <div class="p-2.5 pt-0 sm:p-5 sm:pt-0 flex items-center gap-1.5 sm:gap-2">
                    <button onclick="addToCart('${p.id}')" ${!p.inStock ? 'disabled' : ''} class="flex-1 py-2 sm:py-3 bg-oz-primary hover:bg-oz-hover disabled:bg-slate-200 text-white font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 sm:gap-2">
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 inline fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>
                        <span>הוסף לסל</span>
                    </button>
                    <a href="https://wa.me/972526867192?text=${encodeURIComponent('שלום מכון עוז, אני מעוניין במוצר: ' + p.name)}" target="_blank" class="py-2 px-2 sm:py-3 sm:px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-emerald-200 transition-colors flex items-center justify-center" title="הזמן בוואטסאפ">
                        <svg class="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24"><path d="${waPath}"/></svg>
                    </a>
                </div>
            </div>`;
    }).join('');
}

// CLIENT-SIDE AUTOMATIC ARTICLE SCHEDULING ENGINE (100% Self-Contained in Site JS)
window.ArticleScheduler = {
    getLaunchDate() {
        let launch = localStorage.getItem('oz_articles_launch_date');
        if (!launch) {
            launch = '2026-09-17T00:00:00';
            localStorage.setItem('oz_articles_launch_date', launch);
        }
        return new Date(launch);
    },
    getIntervalHours() {
        return Number(localStorage.getItem('oz_article_interval_hours') || 4);
    },
    getElapsedHours() {
        const launch = this.getLaunchDate();
        const now = new Date();
        const diffMs = Math.max(0, now - launch);
        return diffMs / (1000 * 60 * 60);
    },
    getVisibleArticles() {
        const db = (typeof articlesDB !== 'undefined' ? articlesDB : (typeof articles !== 'undefined' ? articles : []));
        const previewAll = localStorage.getItem('oz_articles_preview_all') === 'true';
        if (previewAll) return db;

        const elapsedHours = this.getElapsedHours();
        const interval = this.getIntervalHours();

        return db.filter((a, idx) => {
            const requiredHours = idx < 5 ? 0 : (idx - 4) * interval;
            return requiredHours <= elapsedHours;
        });
    }
};

window.toggleArticlePreviewMode = function() {
    const current = localStorage.getItem('oz_articles_preview_all') === 'true';
    localStorage.setItem('oz_articles_preview_all', (!current).toString());
    updateSchedulerStatusUI();
    renderArticles();
};

window.saveArticleIntervalFromUI = function(val) {
    if (val) {
        localStorage.setItem('oz_article_interval_hours', val.toString());
        updateSchedulerStatusUI();
        renderArticles();
    }
};

window.pushArticlesToGoogleAndIndexNow = function() {
    const db = (typeof articlesDB !== 'undefined' ? articlesDB : []);
    const visible = ArticleScheduler.getVisibleArticles();
    const urls = visible.map(a => `https://oz-judaica.co.il/?article=${a.id}`);
    urls.push('https://oz-judaica.co.il/');
    urls.push('https://oz-judaica.co.il/sitemap.xml');

    try {
        fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                host: 'oz-judaica.co.il',
                key: 'ozjudaicasitemapkey2026',
                keyLocation: 'https://oz-judaica.co.il/sitemap.xml',
                urlList: urls
            })
        }).catch(err => console.log('IndexNow ping:', err));

        fetch('https://www.google.com/ping?sitemap=https://oz-judaica.co.il/sitemap.xml', { mode: 'no-cors' })
            .catch(err => console.log('Google ping:', err));

        alert(`🚀 הוגשה בקשת אינדוקס מואצת ל-Google ול-IndexNow עבור ${visible.length} מאמרים גלויים (מתוך ${db.length})!`);
    } catch(e) {
        alert(`🚀 בקשת אינדוקס מואצת הוגשה בהצלחה!`);
    }
};

function updateSchedulerStatusUI() {
    const statusText = document.getElementById('scheduler-status-text');
    const btnText = document.getElementById('preview-mode-btn-text');
    const launchInput = document.getElementById('scheduler-launch-date-input');
    const intervalSelect = document.getElementById('scheduler-interval-select');
    const visibleCountEl = document.getElementById('scheduler-visible-count');
    const totalCountEl = document.getElementById('scheduler-total-count');

    const isPreview = localStorage.getItem('oz_articles_preview_all') === 'true';
    const db = (typeof articlesDB !== 'undefined' ? articlesDB : (typeof articles !== 'undefined' ? articles : []));
    const visible = ArticleScheduler.getVisibleArticles();
    const upcoming = db.length - visible.length;
    const interval = ArticleScheduler.getIntervalHours();

    if (visibleCountEl) visibleCountEl.textContent = isPreview ? `${db.length} (מצב מנהל)` : visible.length;
    if (totalCountEl) totalCountEl.textContent = `${db.length} מאמרים`;

    if (statusText) {
        if (isPreview) {
            statusText.textContent = `מצב תצוגה מקדימה פעיל (מנהל בלבד): מציג את כל ${db.length} המאמרים באתר`;
        } else {
            if (upcoming > 0) {
                statusText.textContent = `פורסמו ${visible.length} מתוך ${db.length} מאמרים | מאמר חדש משתחרר אוטומטית כל ${interval} שעות ⏰ (נותרו עוד ${upcoming} בתור)`;
            } else {
                statusText.textContent = `כל ${db.length} המאמרים פורסמו בהצלחה ופתוחים לציבור ⏰`;
            }
        }
    }

    if (btnText) {
        if (isPreview) {
            btnText.textContent = '🔒 חזור לתזמון אוטומטי (הצג רק מאמרים ששוחררו)';
        } else {
            btnText.textContent = '👁️ מצב תצוגה מקדימה לכל 45 המאמרים (מנהל)';
        }
    }

    if (launchInput) {
        const launch = localStorage.getItem('oz_articles_launch_date') || '2026-09-17';
        launchInput.value = launch.split('T')[0];
    }
    if (intervalSelect) {
        intervalSelect.value = interval.toString();
    }
}

function renderArticles(list) {
    const container = document.getElementById('articles-container');
    if (!container) return;

    updateSchedulerStatusUI();

    const isFilteredOrSearched = Array.isArray(list);
    const itemsToRender = isFilteredOrSearched ? list : ArticleScheduler.getVisibleArticles();

    if (itemsToRender.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-2">
                <div class="text-3xl">🔍</div>
                <h4 class="font-black text-slate-800 text-sm">לא נמצאו מאמרים תואמים לחיפוש שלך</h4>
                <p class="text-xs text-slate-500 font-medium">נסה לכתוב מילת חיפוש אחרת או לבחור בקטגוריה "הכל"</p>
                <button onclick="filterArticleCategory('all')" class="py-2 px-4 bg-oz-primary text-white font-bold text-xs rounded-xl mt-2 cursor-pointer">הצג את כל המאמרים הגלויים</button>
            </div>
        `;
        return;
    }

    container.innerHTML = itemsToRender.map(a => `
        <div class="bg-white rounded-3xl overflow-hidden border border-slate-100 oz-shadow group flex flex-col justify-between hover:border-purple-300 transition-all hover:shadow-lg">
            <div>
                <div class="h-44 overflow-hidden relative cursor-pointer" onclick="openArticleModal(${a.id})">
                    <img src="${a.image}" alt="${a.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                    <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-black py-1 px-3 rounded-full">${a.readTime || '5 דקות קריאה'}</span>
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] font-black text-oz-primary uppercase bg-slate-50 px-2 py-0.5 rounded-md">${a.category}</span>
                        <span class="text-[10px] font-bold text-slate-400">מאמר #OZ-${a.id}</span>
                    </div>
                    <h4 onclick="openArticleModal(${a.id})" class="font-extrabold text-base text-slate-800 mb-2 group-hover:text-oz-primary transition-colors cursor-pointer line-clamp-2 leading-snug">${a.title}</h4>
                    <p class="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">${a.summary}</p>
                </div>
            </div>
            <div class="p-5 pt-0">
                <button onclick="openArticleModal(${a.id})" class="w-full py-2.5 bg-slate-50 hover:bg-oz-primary hover:text-white text-oz-primary font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1">
                    <span>קרא את המאמר המלא</span>
                    <span>←</span>
                </button>
            </div>
        </div>
    `).join('');
}

function filterArticleCategory(cat, btn) {
    document.querySelectorAll('.article-cat-btn').forEach(b => {
        b.classList.remove('bg-oz-primary', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-purple-200');
    });

    if (btn) {
        btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-purple-200');
        btn.classList.add('bg-oz-primary', 'text-white', 'shadow-sm');
    }

    const availableArticles = ArticleScheduler.getVisibleArticles();
    if (cat === 'all') {
        renderArticles(availableArticles);
    } else {
        const filtered = availableArticles.filter(a => a.category === cat);
        renderArticles(filtered);
    }
}

function searchArticles(query) {
    const q = (query || '').toLowerCase().trim();
    const availableArticles = ArticleScheduler.getVisibleArticles();

    if (!q) {
        renderArticles(availableArticles);
        return;
    }

    const filtered = availableArticles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.summary.toLowerCase().includes(q) || 
        a.category.toLowerCase().includes(q) ||
        (a.content && a.content.toLowerCase().includes(q))
    );
    renderArticles(filtered);
}

function openArticleModal(id) {
    const allArticles = (typeof articlesDB !== 'undefined' ? articlesDB : (typeof articles !== 'undefined' ? articles : []));
    const article = allArticles.find(a => Number(a.id) === Number(id));
    if (!article) return;

    const modal = document.getElementById('article-modal');
    const body = document.getElementById('article-modal-body');

    if (!modal || !body) return;

    body.innerHTML = `
        <!-- Article Header Image -->
        <div class="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
            <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-purple-600 text-white font-black text-[10px] py-1 px-3 rounded-full">${article.category}</span>
                    <span class="bg-white/20 backdrop-blur-md text-white font-bold text-[10px] py-1 px-3 rounded-full">${article.readTime || '5 דקות קריאה'}</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">${article.title}</h2>
            </div>
        </div>

        <!-- Halachic Disclaimer Banner -->
        <div class="p-4 bg-purple-50/90 border-r-4 border-purple-600 rounded-2xl text-purple-600 text-xs font-bold leading-relaxed shadow-sm">
            ⚠️ <strong>לתשומת לב הקוראים והלומדים:</strong> התוכן המובא במאמר זה מוגש לשם העשרה, עיון ומידע כללי בלבד. אין לראות בכתוב משום הלכה פסוקה, פסק הלכה מורשה או תחליף להזמנת פסיקה אישית מרב מורה הוראה או דמות סמכותית רוחנית. בכל שאלה מעשית יש לפנות לרב מוסמך.
        </div>

        <!-- Article Summary Box -->
        <div class="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-700 leading-relaxed">
            💡 <strong>תמצית המאמר:</strong> ${article.summary}
        </div>

        <!-- Rich Content Body -->
        <div class="article-rich-content text-slate-800 text-sm leading-relaxed space-y-4">
            ${article.content}
        </div>

        <!-- Dynamic Personalized Embedded Product Recommendations inside Article -->
        ${(() => {
            const recs = UserTracker.getPersonalizedProducts(2);
            if (!recs || recs.length === 0) return '';
            const topCat = UserTracker.getTopCategory();
            return `
            <div class="pt-6 border-t border-slate-200/80 space-y-4">
                <div class="flex items-center justify-between">
                    <h4 class="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <span>🛍️ מוצרים מומלצים מבית מכון עוז (משלוח מהיר עד הבית)</span>
                    </h4>
                    ${topCat ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">✨ מותאם אישית עבורך</span>' : ''}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${recs.map(p => `
                        <div onclick="closeArticleModal(); openProductPage('${p.id}')" class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-oz-primary hover:bg-slate-50/50 transition-all">
                            <img src="${p.image}" alt="${p.name}" class="w-14 h-14 object-cover rounded-xl shrink-0" loading="lazy" decoding="async" />
                            <div class="flex-grow min-w-0">
                                <div class="font-black text-xs text-slate-800 truncate">${p.name}</div>
                                <div class="text-xs font-black text-oz-primary mt-0.5">₪${p.price}</div>
                                <span class="text-[10px] font-bold text-oz-primary underline">צפה במוצר ←</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        })()}

        <!-- Modal Bottom Actions Bar -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <a href="https://wa.me/972526867192?text=${encodeURIComponent('שלום מכון עוז, קראתי את המאמר "' + article.title + '" ואשמח להניע התייעצות')}" target="_blank" class="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>💬 שאל את הרב מורה הוראה בוואטסאפ</span>
            </a>
            <button onclick="closeArticleModal()" class="w-full sm:w-auto py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer">
                חזרה לרשימת המאמרים
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.add('hidden');
}

function filterCategory(cat, btn) {
    state.selectedCategory = cat;
    if (typeof UserTracker !== 'undefined') UserTracker.trackCategory(cat, 2);
    if (btn) {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('bg-slate-50', 'text-oz-primary', 'font-bold'));
        btn.classList.add('bg-slate-50', 'text-oz-primary', 'font-bold');
    }
    closeProductPage();
    closeAccountPage();
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
    closeAccountPage();
    renderProducts();
}

function resetFilters() {
    state.selectedCategory = 'all';
    state.selectedPriceMin = 0;
    state.selectedPriceMax = 99999;
    state.inStockOnly = false;
    closeProductPage();
    closeAccountPage();
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
    if (!document.getElementById('account-page-container')?.classList.contains('hidden')) {
        renderAccountWishlist();
    }
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge');
    const sidebarBadge = document.getElementById('sidebar-wishlist-badge');
    const count = state.wishlist.length;

    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    if (sidebarBadge) {
        if (count > 0) {
            sidebarBadge.textContent = count;
            sidebarBadge.classList.remove('hidden');
        } else {
            sidebarBadge.classList.add('hidden');
        }
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
        resBox.innerHTML = '<div class="text-center py-12 text-slate-400 font-bold text-xs">הקלד שם מוצר או קטגוריה בתיבת החיפוש...</div>';
        return;
    }
    const match = products.filter(p => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category_name || '').toLowerCase();
        const desc = (p.short_description || '').toLowerCase();
        return name.includes(query) || cat.includes(query) || desc.includes(query);
    });
    if (match.length === 0) {
        resBox.innerHTML = '<div class="text-center py-12 text-slate-400 font-bold text-xs">לא נמצאו מוצרים התואמים לחיפוש "' + query + '"</div>';
        return;
    }
    resBox.innerHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' + match.map(p => `
        <div class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
            <img src="${p.image}" class="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer" onclick="toggleModal('search-modal'); openProductPage('${p.id}')" />
            <div class="flex-grow min-w-0">
                <div class="font-extrabold text-xs text-slate-800 truncate cursor-pointer hover:text-oz-primary" onclick="toggleModal('search-modal'); openProductPage('${p.id}')">${p.name}</div>
                <div class="text-[11px] font-black text-oz-primary">₪${p.price}</div>
            </div>
            <div class="flex flex-col gap-1 shrink-0">
                <button onclick="addToCart('${p.id}')" class="py-1.5 px-3 bg-oz-primary text-white font-bold text-[11px] rounded-lg shadow-sm hover:bg-oz-hover">+ לסל</button>
                <button onclick="toggleModal('search-modal'); openProductPage('${p.id}')" class="py-1 px-2 text-[10px] font-bold text-oz-primary hover:underline">לדף המוצר</button>
            </div>
        </div>
    `).join('') + '</div>';
}

function openQuickView(id) {
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;
    if (typeof UserTracker !== 'undefined') UserTracker.trackProductView(p.id, p.category);
    const content = document.getElementById('quick-view-content');
    if (!content) return;

    const isFav = state.wishlist.includes(Number(p.id));

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            <div class="flex flex-col gap-2">
                <div class="h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-inner">
                    <img id="qv-main-img" src="${p.images && p.images.length ? p.images[0] : p.image}" alt="${p.name}" class="w-full h-full object-cover" />
                    <span class="absolute top-3 right-3 bg-oz-primary text-white font-black text-[10px] py-1 px-3 rounded-full shadow-sm">100% כשר מוסמך ✨</span>
                </div>
                ${(p.images && p.images.length > 1) ? `
                <div class="grid grid-cols-4 gap-1.5">
                    ${p.images.slice(0, 4).map((imgUrl, idx) => `
                        <button type="button" onclick="document.getElementById('qv-main-img').src='${imgUrl}'; document.querySelectorAll('.qv-thumb').forEach(t=>t.classList.remove('border-oz-primary','ring-2','ring-purple-300')); this.classList.add('border-oz-primary','ring-2','ring-purple-300')" class="qv-thumb h-14 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-oz-primary ring-2 ring-purple-300' : 'border-slate-200'} transition-all hover:opacity-90">
                            <img src="${imgUrl}" alt="${p.name} - תמונה ${idx+1}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </button>
                    `).join('')}
                </div>
                ` : ''}
                <p class="text-[11px] text-slate-400 font-medium text-center italic mt-0.5">* התמונות להמחשה בלבד</p>
            </div>
            <div class="flex flex-col justify-between space-y-4">
                <div>
                    <span class="text-[10px] font-extrabold text-oz-primary uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md">${p.category_name || 'תשמישי קדושה'}</span>
                    <h3 class="text-xl font-black text-slate-900 mt-2 mb-1">${p.name}</h3>
                    <div class="text-2xl font-black text-oz-primary mb-3">₪${p.price}</div>
                    <p class="text-xs text-slate-600 leading-relaxed">${p.short_description || p.description || ''}</p>
                </div>

                <div class="space-y-3 pt-3 border-t border-slate-100">
                    <div class="flex items-center gap-2">
                        <button onclick="addToCart('${p.id}'); toggleModal('quick-view-modal')" class="flex-1 py-3 bg-oz-primary hover:bg-oz-hover text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
                            <span>הוסף לסל הקניות 🛒</span>
                        </button>
                        <button onclick="toggleWishlist(${p.id}); openQuickView(${p.id})" class="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <svg class="w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'} stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                        </button>
                    </div>
                    <button onclick="toggleModal('quick-view-modal'); openProductPage('${p.id}')" class="w-full py-2 bg-slate-50 hover:bg-purple-100 text-oz-primary font-bold text-xs rounded-xl transition-colors">
                        צפה בדף מוצר מלא ותכונות מורחבות ←
                    </button>
                </div>
            </div>
        </div>
    `;
    toggleModal('quick-view-modal');
}

// PRODUCT DETAIL PAGE (PDP) LOGIC
let pdpSelectedQty = 1;

function updatePDPQty(delta) {
    pdpSelectedQty = Math.max(1, pdpSelectedQty + delta);
    const el = document.getElementById('pdp-qty-val');
    if (el) el.textContent = pdpSelectedQty;
}

function addToCartFromPDP(id) {
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;

    const existing = state.cart.find(i => String(i.id) === String(id) && !i.engraving);
    if (existing) {
        existing.qty += pdpSelectedQty;
    } else {
        state.cart.push({ ...p, qty: pdpSelectedQty });
    }
    showToast('🎉 הוסף לסל: ' + p.name + ' (x' + pdpSelectedQty + ')');
    
    updateCartUI();
    toggleCartDrawer();
}

function buyNowFromPDP(id) {
    addToCartFromPDP(id);
    openCheckoutModal();
}

function toggleWishlistPDP(id) {
    toggleWishlist(id);
    const btn = document.getElementById('pdp-wishlist-btn');
    if (btn) {
        const isFav = state.wishlist.includes(Number(id));
        btn.className = `py-4 px-5 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${isFav ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`;
        btn.innerHTML = isFav ? '❤️ שמור במועדפים' : '🤍 מועדפים';
    }
}

function switchPDPTab(tabName, btn) {
    document.querySelectorAll('.pdp-tab-btn').forEach(b => {
        b.classList.remove('bg-oz-primary', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    });
    btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    btn.classList.add('bg-oz-primary', 'text-white', 'shadow-md');

    document.querySelectorAll('.pdp-tab-pane').forEach(pane => pane.classList.add('hidden'));
    const target = document.getElementById('pdp-tab-' + tabName);
    if (target) target.classList.remove('hidden');
}

function scrollToTarget(target, offset = 80) {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetY = Math.max(0, rect.top + scrollTop - offset);
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });
            }, 80);
        });
    });
}

function openProductPage(id) {
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;
    if (typeof UserTracker !== 'undefined') UserTracker.trackProductView(p.id, p.category);

    pdpSelectedQty = 1;
    if (typeof resetPDPEngravingState === 'function') resetPDPEngravingState();

    const shopGrid = document.getElementById('shop');
    const magazine = document.getElementById('magazine');
    const hero = document.getElementById('hero-banner-container');
    const accountPage = document.getElementById('account-page-container');
    const pdpContainer = document.getElementById('product-page-container');

    if (shopGrid) shopGrid.classList.add('hidden');
    if (magazine) magazine.classList.add('hidden');
    if (hero) hero.classList.add('hidden');
    if (accountPage) accountPage.classList.add('hidden');

    if (pdpContainer) {
        pdpContainer.innerHTML = generateProductPageHTML(p);
        pdpContainer.classList.remove('hidden');
    }

    scrollToTarget('product-page-container', 80);
}

function closeProductPage() {
    const shopGrid = document.getElementById('shop');
    const magazine = document.getElementById('magazine');
    const hero = document.getElementById('hero-banner-container');
    const pdpContainer = document.getElementById('product-page-container');

    if (pdpContainer) pdpContainer.classList.add('hidden');
    if (shopGrid) shopGrid.classList.remove('hidden');
    if (magazine) magazine.classList.remove('hidden');
    if (hero) hero.classList.remove('hidden');

    scrollToTarget('shop', 80);
}

function isStamProduct(p) {
    if (!p) return false;
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const catName = (p.category_name || '').toLowerCase();
    if (name.includes('בית מזוזה') || name.includes('בתי מזוזה')) return false;
    return cat === 'stam' || cat === 'tefillin' || 
           name.includes('תפילין') || name.includes('ספר תורה') || 
           (name.includes('מזוזה') && (name.includes('קלף') || name.includes('כשר')));
}

function generateProductPageHTML(p) {
    const isFav = state.wishlist.includes(Number(p.id));
    const related = products.filter(x => String(x.id) !== String(p.id) && (x.category === p.category || x.category_name === p.category_name)).slice(0, 3);
    const isStam = isStamProduct(p);

    return `
        <div class="space-y-6 text-right dir-rtl pb-8 max-w-5xl mx-auto">
            <!-- Breadcrumbs Nav -->
            <nav class="flex items-center justify-between text-xs font-bold text-slate-500 bg-white p-3 px-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div class="flex items-center gap-2">
                    <button onclick="closeProductPage()" class="hover:text-oz-primary transition-colors">דף הבית</button>
                    <span>/</span>
                    <button onclick="closeProductPage(); filterCategory('${p.category}')" class="hover:text-oz-primary transition-colors">${p.category_name || 'קטיגוריה'}</button>
                    <span>/</span>
                    <span class="text-slate-900 font-extrabold truncate max-w-[200px]">${p.name}</span>
                </div>
                <button onclick="closeProductPage()" class="text-xs font-extrabold text-oz-primary hover:underline">← חזרה לקטלוג</button>
            </nav>

            <!-- MAIN PRODUCT HERO CARD (The primary focus) -->
            <div class="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 oz-shadow grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
                
                <!-- Main Product Image Showcase & Thumbnails -->
                <div class="flex flex-col gap-3">
                    <div class="h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative group">
                        <img id="pdp-main-img" src="${p.images && p.images.length ? p.images[0] : p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ${isStam ? '<span class="absolute top-3 right-3 bg-oz-primary text-white font-black text-[11px] py-1 px-3 rounded-full shadow-md">100% כשר מוסמך ✨</span>' : '<span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white font-black text-[11px] py-1 px-3 rounded-full shadow-md">100% איכות ואחריות ✨</span>'}
                        ${!p.inStock ? '<span class="absolute top-3 left-3 bg-red-600 text-white font-black text-[11px] py-1 px-3 rounded-full shadow-md">אזל מהמלאי</span>' : ''}
                    </div>

                    ${(p.images && p.images.length > 1) ? `
                    <div class="grid grid-cols-4 gap-2">
                        ${p.images.slice(0, 4).map((imgUrl, idx) => `
                            <button type="button" onclick="document.getElementById('pdp-main-img').src='${imgUrl}'; document.querySelectorAll('.pdp-thumb').forEach(t=>t.classList.remove('border-oz-primary','ring-2','ring-purple-300')); this.classList.add('border-oz-primary','ring-2','ring-purple-300')" class="pdp-thumb h-16 sm:h-20 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-oz-primary ring-2 ring-purple-300' : 'border-slate-200'} transition-all hover:opacity-90">
                                <img src="${imgUrl}" alt="${p.name} - תמונה ${idx+1}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                            </button>
                        `).join('')}
                    </div>
                    ` : ''}

                    <p class="text-[11px] text-slate-400 font-medium text-center mt-1 italic">* התמונות להמחשה בלבד</p>
                </div>

                <!-- Product Details & Actions -->
                <div class="space-y-5">
                    <div>
                        <span class="text-[10px] font-black text-oz-primary uppercase tracking-widest bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200/80">${p.category_name || 'תשמישי קדושה'}</span>
                        <h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 mb-2 leading-tight">${p.name}</h1>
                        <div class="flex items-center gap-3">
                            <div class="text-2xl sm:text-3xl font-black text-oz-primary">₪${p.price}</div>
                            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">כולל מע"מ | משלוחים לכל הארץ 🚚</span>
                        </div>
                    </div>

                    <p class="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        ${p.short_description || p.description || 'מוצר איכותי מבית מכון עוז ראש העין. מיוצר ונבדק בקפידה לפי כל דרישות ההלכה והאיכות המרבית.'}
                    </p>

                    <!-- Guarantees Grid & All Shipping Rates -->
                    <div class="space-y-2 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div class="grid grid-cols-2 gap-2 text-[11px] font-extrabold text-slate-700">
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>${isStam ? 'הגהת מחשב וגברא מוסמכת' : '100% איכות וגימור יוקרתי'}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>אחריות מלאה מכון עוז</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>🚀 משלוח מהיר (1-3 ימים) - ₪70</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>🚚 משלוח רגיל (5-10 ימים) - ₪35</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>📦 נקודת איסוף ארצית - ₪19</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>🏪 איסוף עצמי מראש העין - ₪0</span>
                            </div>
                        </div>
                    </div>

                    <!-- Quantity & Action Buttons -->
                    <div class="space-y-3 pt-1">
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-bold text-slate-700">כמות:</span>
                            <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                <button onclick="updatePDPQty(-1)" class="w-8 h-8 font-black text-slate-600 hover:bg-slate-200 transition-colors">-</button>
                                <span id="pdp-qty-val" class="w-8 text-center font-black text-xs text-slate-900">1</span>
                                <button onclick="updatePDPQty(1)" class="w-8 h-8 font-black text-slate-600 hover:bg-slate-200 transition-colors">+</button>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-2.5">
                            <button onclick="addToCartFromPDP('${p.id}')" ${!p.inStock ? 'disabled' : ''} class="flex-1 py-3.5 bg-oz-primary hover:bg-oz-hover disabled:bg-slate-200 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5">
                                <span>+ הוסף לסל הקניות</span>
                            </button>
                            
                            <button onclick="buyNowFromPDP('${p.id}')" ${!p.inStock ? 'disabled' : ''} class="py-3.5 px-5 bg-purple-600 hover:bg-purple-600 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5">
                                <span>קנה עכשיו ⚡</span>
                            </button>

                            <button id="pdp-wishlist-btn" onclick="toggleWishlistPDP('${p.id}')" class="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1">
                                ${isFav ? '❤️ במועדפים' : '🤍 מועדפים'}
                            </button>
                        </div>
                    </div>

                    <!-- Direct Store Consultation -->
                    <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                        <div>
                            <div>ייעוץ ישיר עם הסופר / המוכר:</div>
                            <div class="text-[11px] text-emerald-700 font-medium">שלום מנצורה 48, ראש העין | 052-686-7192</div>
                        </div>
                        <a href="https://wa.me/972526867192?text=${encodeURIComponent('שלום מכון עוז, אני מעוניין לייעוץ לגבי: ' + p.name)}" target="_blank" class="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg shadow-sm transition-colors shrink-0">
                            וואטסאפ 💬
                        </a>
                    </div>
                </div>
            </div>

            <!-- COMPACT TABS SECTION (Specs, Shipping, Warranty) -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 oz-shadow space-y-4">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
                    <button onclick="switchPDPTab('specs', this)" class="pdp-tab-btn py-2.5 px-5 rounded-xl font-black text-xs bg-oz-primary text-white shadow-sm transition-all cursor-pointer">מפרט טכני והלכתי</button>
                    <button onclick="switchPDPTab('shipping', this)" class="pdp-tab-btn py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer">משלוחים ואיסוף עצמי 🚚</button>
                    <button onclick="switchPDPTab('warranty', this)" class="pdp-tab-btn py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer">אחריות וכשרות 🛡️</button>
                </div>

                <!-- Tab 1: Specs -->
                <div id="pdp-tab-specs" class="pdp-tab-pane space-y-3">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div class="p-3 bg-slate-50/40 rounded-xl border border-slate-200/80 flex items-center justify-between">
                            <span class="font-bold text-slate-500">מק"ט מוצר:</span>
                            <span class="font-black text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">OZ-${p.id}</span>
                        </div>
                        <div class="p-3 bg-slate-50/40 rounded-xl border border-slate-200/80 flex items-center justify-between">
                            <span class="font-bold text-slate-500">קטגוריית מוצר:</span>
                            <span class="font-black text-oz-primary">${p.category_name || 'תשמישי קדושה'}</span>
                        </div>
                        <div class="p-3 bg-slate-50/40 rounded-xl border border-slate-200/80 flex items-center justify-between col-span-1 sm:col-span-2">
                            <span class="font-bold text-slate-500">${isStam ? 'רמת כשרות ובדיקה:' : 'תקן איכות ובקרה:'}</span>
                            <span class="font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">${isStam ? '100% כשרות • הגהת מחשב וגברא ✨' : '100% איכות • אחריות בית מכון עוז ✨'}</span>
                        </div>
                        <div class="p-3 bg-slate-50/40 rounded-xl border border-slate-200/80 flex items-center justify-between col-span-1 sm:col-span-2">
                            <span class="font-bold text-slate-500">אחריות יצרן:</span>
                            <span class="font-black text-slate-900">אחריות מלאה בית מכון עוז (שלום מנצורה 48, ראש העין)</span>
                        </div>
                    </div>
                </div>

                <!-- Tab 2: Shipping -->
                <div id="pdp-tab-shipping" class="pdp-tab-pane hidden space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <!-- Option 1: Express -->
                        <div class="p-3.5 bg-gradient-to-br from-purple-50/80 to-purple-100/50 rounded-2xl border border-purple-200/80 flex items-center justify-between shadow-sm hover:border-oz-primary transition-all">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-lg shrink-0">🚀</div>
                                <div>
                                    <div class="font-extrabold text-slate-800 text-xs">משלוח מהיר עד הבית</div>
                                    <div class="text-[11px] text-slate-500 font-medium">אספקה ב-1 עד 3 ימי עסקים בלבד</div>
                                </div>
                            </div>
                            <div class="text-left shrink-0">
                                <span class="font-black text-oz-primary text-sm bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-sm">₪70</span>
                            </div>
                        </div>

                        <!-- Option 2: Standard -->
                        <div class="p-3.5 bg-gradient-to-br from-purple-50/80 to-purple-100/50 rounded-2xl border border-purple-200/80 flex items-center justify-between shadow-sm hover:border-oz-primary transition-all">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-lg shrink-0">🚚</div>
                                <div>
                                    <div class="font-extrabold text-slate-800 text-xs">משלוח רגיל עד הבית</div>
                                    <div class="text-[11px] text-slate-500 font-medium">5-10 ימי עסקים (חינם מעל ₪399)</div>
                                </div>
                            </div>
                            <div class="text-left shrink-0">
                                <span class="font-black text-oz-primary text-sm bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-sm">₪35</span>
                            </div>
                        </div>

                        <!-- Option 3: Pickup Point -->
                        <div class="p-3.5 bg-gradient-to-br from-purple-50/80 to-purple-100/50 rounded-2xl border border-purple-200/80 flex items-center justify-between shadow-sm hover:border-oz-primary transition-all">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-lg shrink-0">📦</div>
                                <div>
                                    <div class="font-extrabold text-slate-800 text-xs">נקודת איסוף בכל הארץ</div>
                                    <div class="text-[11px] text-slate-500 font-medium">מאות נקודות חלוקה בפריסה ארצית</div>
                                </div>
                            </div>
                            <div class="text-left shrink-0">
                                <span class="font-black text-oz-primary text-sm bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-sm">₪19</span>
                            </div>
                        </div>

                        <!-- Option 4: Self Pickup -->
                        <div class="p-3.5 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-2xl border border-emerald-200/80 flex items-center justify-between shadow-sm hover:border-emerald-500 transition-all">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg shrink-0">🏪</div>
                                <div>
                                    <div class="font-extrabold text-slate-800 text-xs">איסוף עצמי מראש העין</div>
                                    <div class="text-[11px] text-slate-500 font-medium">שלום מנצורה 48 (בתאום: 052-686-7192)</div>
                                </div>
                            </div>
                            <div class="text-left shrink-0">
                                <span class="font-black text-emerald-700 text-xs bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-sm">₪0 (חינם)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 3: Warranty -->
                <div id="pdp-tab-warranty" class="pdp-tab-pane hidden space-y-3 text-xs">
                    <div class="p-4 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-2 text-slate-700 font-medium leading-relaxed">
                        <div class="font-black text-sm text-oz-primary flex items-center gap-1.5">
                            <span>🛡️ אחריות ואיכות מקיפה</span>
                        </div>
                        ${isStam ? `
                            <p>כל תשמישי הקדושה והסת"ם (תפילין, מזוזות, ספרי תורה) נכתבים ונבדקים על ידי סופרי סת"ם מורשים ובעלי תעודת הסמכה בתוקף.</p>
                            <p class="text-emerald-700 font-bold">✓ 100% בדיקת מחשב סורק אופטי למניעת דיבוק אותיות</p>
                            <p class="text-emerald-700 font-bold">✓ הגהת גברא קפדנית ע"י מגיה מוסמך</p>
                        ` : `
                            <p>מוצרי החנות מיוצרים ונבחרים בקפידה יתרה תוך שמירה על רמת גימור גבוהה, איכות חומרים משובחת ועמידות לאורך זמן.</p>
                            <p class="text-emerald-700 font-bold">✓ 100% בקרת איכות וגימור יוקרתי</p>
                            <p class="text-emerald-700 font-bold">✓ אחריות מלאה מבית מכון עוז</p>
                        `}
                        <p class="text-slate-500 text-[11px] pt-1">כל הקניות באתר מוגנות באחריות מלאה ובאפשרות החלפה/החזרה ע"פ חוק להגנת הצרכן.</p>
                    </div>
                </div>
            </div>

            <!-- COMPACT RELATED PRODUCTS ROW -->
            ${related.length > 0 ? `
                <div class="bg-white p-4 rounded-2xl border border-slate-200/80 oz-shadow space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <h4 class="font-black text-xs text-slate-900">מוצרים מומלצים נוספים:</h4>
                        <button onclick="closeProductPage()" class="text-[11px] font-bold text-oz-primary hover:underline">לכל הקטלוג ←</button>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        ${related.map(r => `
                            <div onclick="openProductPage('${r.id}')" class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 transition-all cursor-pointer group flex flex-col justify-between">
                                <img src="${r.image}" class="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                                <div>
                                    <h5 class="font-black text-[11px] text-slate-800 line-clamp-1 group-hover:text-oz-primary">${r.name}</h5>
                                    <div class="font-black text-xs text-oz-primary mt-0.5">₪${r.price}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- MINIMALIST COMPACT REVIEWS BAR -->
            <div class="bg-slate-50/60 p-3 px-5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                <div class="flex items-center gap-2">
                    <span class="text-purple-300">⭐⭐⭐⭐⭐</span>
                    <span class="text-slate-900 font-black">4.9/5 דירוג לקוחות</span>
                    <span class="text-slate-500 font-medium hidden sm:inline">• "שירות אדיב ומקצועי ברמה הכי גבוהה, הגהה נקייה ומשלוח סופר מהיר!"</span>
                </div>
                <span class="text-[11px] text-oz-primary font-bold shrink-0">100% לקוחות מרוצים</span>
            </div>

            <!-- EXPANDABLE SEO BOX FOR PDP -->
            <section class="mt-8">
                <div class="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-800/40 dir-rtl text-right">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black text-xl shrink-0">✨</span>
                        <div>
                            <h3 class="font-black text-lg sm:text-xl text-purple-200">מידע נוסף ומפרט איכות | מכון עוז</h3>
                            <p class="text-xs text-slate-300">אחריות מקיפה, בדיקה כפולה ואיכות ללא פשרות</p>
                        </div>
                    </div>

                    <p class="text-xs sm:text-sm leading-relaxed text-slate-200">
                        כל מוצר במכון עוז נבחר ונבדק בקפידה יתרה כדי להבטיח עמידות, הידור מצווה ואיכות ברמה הגבוהה ביותר. בין אם מדובר בתשמישי קדושה וסת"ם ובין אם בארנקי עור ותיקים לגבר, אנו מתחייבים לשביעות רצון מלאה ולמשלוח בטוח עד הבית.
                    </p>

                    <div id="seo-content-pdp" class="hidden mt-4 pt-4 border-t border-purple-800/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <p>
                            <strong>התחייבות לכשרות ואיכות:</strong> מוצרי הסת"ם (תפילין, מזוזות, ספרי תורה) נכתבים על קלף שליל איכותי בהשגחת רבנים מוסמכים ועוברים בדיקת סורק אופטי ממוחשב. מוצרי העור והתיקים עשויים מחומרים משובחים העמידים בפני שחיקה ותנאי מזג אוויר.
                        </p>
                        <p>
                            <strong>ייעוץ והתאמה אישית:</strong> זקוקים לעזרה בהתאמת מידת טלית, בחירת נוסח תפילין (ספרדי/אשכנזי/חב"ד) או התאמת נרתיק מגן? צוות המומחים של מכון עוז בראש העין זמין עבורכם בטלפון 052-686-7192.
                        </p>
                    </div>

                    <div class="mt-4 pt-2 flex justify-center sm:justify-start">
                        <button id="seo-btn-pdp" onclick="toggleSeoExpand('pdp')" class="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 hover:from-purple-600 hover:to-indigo-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                            קרא עוד... ↓
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// CART DRAWER & CART MANAGEMENT LOGIC
function toggleCartDrawer() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const drawer = document.getElementById('cart-drawer');
    if (backdrop) backdrop.classList.toggle('hidden');
    if (drawer) drawer.classList.toggle('translate-x-full');
}

function openCheckoutFromDrawer() {
    toggleCartDrawer();
    openCheckoutModal();
}

function addToCart(id) {
    const numericId = Number(id);
    let item = products.find(p => Number(p.id) === numericId);

    if (!item) return;

    const existing = state.cart.find(i => Number(i.id) === numericId);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ ...item, qty: 1 });
    }

    updateCartUI();
    showToast('🛒 ' + item.name + ' התווסף לסל הקניות!');
}

function changeCartQty(id, delta) {
    const numericId = Number(id);
    const existing = state.cart.find(i => Number(i.id) === numericId);
    if (!existing) return;

    existing.qty += delta;
    if (existing.qty <= 0) {
        state.cart = state.cart.filter(i => Number(i.id) !== numericId);
    }
    updateCartUI();
}

function removeFromCart(id) {
    const numericId = Number(id);
    state.cart = state.cart.filter(i => Number(i.id) !== numericId);
    updateCartUI();
}

function updateCartUI() {
    const itemCount = state.cart.reduce((acc, item) => acc + item.qty, 0);
    const total = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const floatingBadge = document.getElementById('floating-cart-badge');
    const floatingTotal = document.getElementById('floating-cart-total');
    const floatingPulse = document.getElementById('floating-cart-pulse');

    if (floatingBadge) floatingBadge.textContent = itemCount;
    if (floatingTotal) floatingTotal.textContent = `${itemCount} פריטים`;
    if (floatingPulse) {
        if (itemCount > 0) floatingPulse.classList.remove('hidden');
        else floatingPulse.classList.add('hidden');
    }

    const headerBadge = document.getElementById('header-cart-badge');
    const headerTotal = document.getElementById('header-cart-total');
    if (headerBadge) {
        headerBadge.textContent = itemCount;
        if (itemCount > 0) headerBadge.classList.remove('hidden');
        else headerBadge.classList.add('hidden');
    }
    if (headerTotal) headerTotal.textContent = `${itemCount} פריטים`;

    const drawerCount = document.getElementById('cart-drawer-count');
    const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
    const drawerShippingCost = document.getElementById('cart-drawer-shipping-cost');
    const drawerTotal = document.getElementById('cart-drawer-total');
    const drawerItemsContainer = document.getElementById('cart-drawer-items');

    const drawerDiff = document.getElementById('drawer-shipping-diff');
    const drawerProgress = document.getElementById('drawer-shipping-progress');

    const shippingFee = total >= 399 ? 0 : 35;

    if (drawerCount) drawerCount.textContent = `${itemCount} פריטים בסל`;
    if (drawerSubtotal) drawerSubtotal.textContent = `₪${total}`;
    if (drawerShippingCost) drawerShippingCost.textContent = total >= 399 ? 'חינם 🎉' : (total === 0 ? '₪0' : '₪35');
    if (drawerTotal) drawerTotal.textContent = `₪${total === 0 ? 0 : total + shippingFee}`;

    if (drawerDiff && drawerProgress) {
        const pct = Math.min(100, Math.round((total / 399) * 100));
        drawerProgress.style.width = pct + '%';
        if (total >= 399) {
            drawerDiff.textContent = 'זכאי למשלוח חינם! 🎉';
        } else {
            drawerDiff.textContent = `נותרו עוד ₪${399 - total}`;
        }
    }

    if (drawerItemsContainer) {
        if (state.cart.length === 0) {
            drawerItemsContainer.innerHTML = `
                <div class="text-center py-16 px-4">
                    <div class="w-16 h-16 bg-slate-50 text-oz-primary rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">🛒</div>
                    <h4 class="font-black text-slate-800 text-base mb-1">סל הקניות שלך ריק</h4>
                    <p class="text-xs text-slate-500 mb-6 font-medium">הוסף מוצרים מהחנות כדי להתחיל</p>
                    <button onclick="toggleCartDrawer(); closeProductPage(); closeAccountPage()" class="py-3 px-6 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all">עבור לחנות 🛍️</button>
                </div>
            `;
        } else {
            drawerItemsContainer.innerHTML = state.cart.map(item => `
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm relative group">
                    <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl shrink-0" loading="lazy" decoding="async" />
                    <div class="flex-grow min-w-0 text-right">
                        <h4 class="font-black text-xs text-slate-800 truncate">${item.name}</h4>
                        ${item.engraving ? `<div class="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 mt-0.5 inline-block">✍️ הקדשה: "${item.engraving.text}" (${item.engraving.label})</div>` : ''}
                        <div class="text-xs font-black text-oz-primary mt-0.5">₪${item.price}</div>
                    </div>
                    <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0">
                        <button onclick="changeCartQty('${item.id}', -1)" class="w-6 h-6 font-black text-slate-600 hover:bg-slate-100 flex items-center justify-center">-</button>
                        <span class="w-6 text-center text-xs font-black text-slate-900">${item.qty}</span>
                        <button onclick="changeCartQty('${item.id}', 1)" class="w-6 h-6 font-black text-slate-600 hover:bg-slate-100 flex items-center justify-center">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="text-slate-400 hover:text-red-500 p-1 transition-colors" title="הסר פריט">
                        <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            `).join('');
        }
    }
    if (typeof trackAbandonedCart === 'function') {
        trackAbandonedCart();
    }
}

// VIP MY ACCOUNT PAGE LOGIC & RENDERERS
function updateUserLabel() {
    const btn = document.getElementById('user-nav-btn');
    if (!btn) return;

    if (state.user) {
        btn.onclick = openAccountPage;
        btn.innerHTML = `
            <span class="w-8 h-8 rounded-full bg-purple-100 text-oz-primary flex items-center justify-center font-bold text-xs">${state.user.name.charAt(0)}</span>
            <span class="hidden md:inline font-bold text-xs text-oz-primary">שלום, ${state.user.name}</span>
        `;
    } else {
        btn.onclick = openAccountPage;
        btn.innerHTML = `
            <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            <span id="user-label" class="hidden sm:inline font-bold">החשבון שלי</span>
        `;
    }
}

function openAccountPage() {
    if (!state.user) {
        state.user = { name: 'ישראל מירושלים', phone: '052-686-7192' };
        localStorage.setItem('oz_user', JSON.stringify(state.user));
        updateUserLabel();
    }

    const shopGrid = document.getElementById('shop');
    const magazine = document.getElementById('magazine');
    const hero = document.getElementById('hero-banner-container');
    const pdpContainer = document.getElementById('product-page-container');
    const accountPage = document.getElementById('account-page-container');

    if (shopGrid) shopGrid.classList.add('hidden');
    if (magazine) magazine.classList.add('hidden');
    if (hero) hero.classList.add('hidden');
    if (pdpContainer) pdpContainer.classList.add('hidden');

    if (accountPage) {
        accountPage.innerHTML = renderAccountPageHTML();
        accountPage.classList.remove('hidden');
        renderAccountWishlist();
    }

    scrollToTarget('account-page-container', 80);
}

function openAccountPageWithWishlist() {
    openAccountPage();
    switchAccountTab('wishlist');
    scrollToTarget('account-page-container', 80);
}

function closeAccountPage() {
    const shopGrid = document.getElementById('shop');
    const magazine = document.getElementById('magazine');
    const hero = document.getElementById('hero-banner-container');
    const accountPage = document.getElementById('account-page-container');

    if (accountPage) accountPage.classList.add('hidden');
    if (shopGrid) shopGrid.classList.remove('hidden');
    if (magazine) magazine.classList.remove('hidden');
    if (hero) hero.classList.remove('hidden');

    scrollToTarget('shop', 80);
}

function openSitemapPage() {
    const shopGrid = document.getElementById('shop');
    const magazine = document.getElementById('magazine');
    const hero = document.getElementById('hero-banner-container');
    const pdpContainer = document.getElementById('product-page-container');
    const accountPage = document.getElementById('account-page-container');
    const sitemapPage = document.getElementById('sitemap-page-container');

    if (shopGrid) shopGrid.classList.add('hidden');
    if (magazine) magazine.classList.add('hidden');
    if (hero) hero.classList.add('hidden');
    if (pdpContainer) pdpContainer.classList.add('hidden');
    if (accountPage) accountPage.classList.add('hidden');

    if (sitemapPage) {
        sitemapPage.innerHTML = renderSitemapPageHTML();
        sitemapPage.classList.remove('hidden');
    }

    scrollToTarget('sitemap-page-container', 80);
}

function closeSitemapPage() {
    const shopGrid = document.getElementById('shop');
    const magazine = document.getElementById('magazine');
    const hero = document.getElementById('hero-banner-container');
    const sitemapPage = document.getElementById('sitemap-page-container');

    if (sitemapPage) sitemapPage.classList.add('hidden');
    if (shopGrid) shopGrid.classList.remove('hidden');
    if (magazine) magazine.classList.remove('hidden');
    if (hero) hero.classList.remove('hidden');

    scrollToTarget('shop', 80);
}

function renderSitemapPageHTML() {
    const allArticles = (typeof articlesDB !== 'undefined' ? articlesDB : (typeof articles !== 'undefined' ? articles : []));
    const allProds = (typeof products !== 'undefined' ? products : []);

    const categoriesList = [
        { id: 'all', name: '🛒 כל המוצרים בחנות', desc: 'קטלוג המוצרים המלא של מכון עוז' },
        { id: 'stam', name: '📜 תשמישי קדושה וסת"ם', desc: 'קלפי מזוזה כשרים, ספרי תורה ותפילין מהודרות' },
        { id: 'mezuzot', name: '🏠 בתי מזוזה', desc: 'בתי מזוזה יוקרתיים מעץ זית, אפוקסי ואלומיניום' },
        { id: 'tallitot-tzitzit', name: '🧵 טליות וציציות', desc: 'טליתות צמר טהור, ציציות עבודת יד ופתיל תכלת' },
        { id: 'tefillin-bags', name: '💼 תיקים לטלית ולתפילין', desc: 'תיקי עור, תפידניות וכיסויים מהודרים' },
        { id: 'books', name: '📖 ספרי קודש וסידורים', desc: 'סידורים בעור נאפה, חומשים ומחזורים' },
        { id: 'wallets', name: '👛 ארנקים לגבר', desc: 'ארנקי עור פרימיום לגבר עם חריטה אישית' },
        { id: 'gifts', name: '🎁 מתנות ויודאיקה', desc: 'מתנות לבר מצווה, חתנים ואירועים' }
    ];

    return `
        <div class="space-y-8 text-right dir-rtl pb-12 max-w-6xl mx-auto">
            <!-- Breadcrumb Navigation -->
            <div class="flex items-center justify-between bg-white p-3.5 px-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <button onclick="closeSitemapPage()" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>🏠</span> דף הבית
                    </button>
                    <span class="text-slate-300">/</span>
                    <span class="text-oz-primary font-black flex items-center gap-1">
                        <span>🗺️</span> מפת האתר (HTML Sitemap)
                    </span>
                </div>
                <button onclick="closeSitemapPage()" class="py-1.5 px-4 bg-slate-50 hover:bg-purple-100 text-oz-primary font-extrabold text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-1 cursor-pointer">
                    <span>←</span> חזרה לקטלוג החנות
                </button>
            </div>

            <!-- Page Title Hero -->
            <div class="bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0F0D2E] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-purple-400/30 relative overflow-hidden">
                <div class="relative z-10 space-y-3">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-600/20 border border-purple-400/40 text-purple-200 font-extrabold text-xs rounded-full shadow-inner">
                        <span>🗺️ SEO & Google Index Map</span>
                    </div>
                    <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight">מפת האתר המלאה – מכון עוז</h1>
                    <p class="text-xs sm:text-sm text-purple-200 font-medium leading-relaxed max-w-3xl">
                        ברוכים הבאים למפת האתר המקיפה של מכון עוז. כאן תוכלו למצוא מיפוי מובנה ומסודר של כל קטגוריות החנות, המוצרים המהודרים, מאמרי ההלכה והמדריכים, ודפי השירות והמידע – בפורמט מותאם באופן מושלם לסריקה ולאינדוקס במנוע החיפוש Google.
                    </p>
                </div>
            </div>

            <!-- SECTION 1: CATEGORIES -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 oz-shadow space-y-4">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span class="w-8 h-8 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-base shrink-0">🛒</span>
                    <h2 class="font-black text-lg text-slate-900">1. קטגוריות החנות והמוצרים</h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    ${categoriesList.map(cat => `
                        <div onclick="closeSitemapPage(); filterCategory('${cat.id}')" class="p-4 bg-slate-50/70 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-300 rounded-2xl transition-all cursor-pointer group space-y-1.5 shadow-sm">
                            <h3 class="font-black text-xs text-slate-900 group-hover:text-oz-primary transition-colors flex items-center justify-between">
                                <span>${cat.name}</span>
                                <span class="text-purple-600 group-hover:translate-x-[-3px] transition-transform">←</span>
                            </h3>
                            <p class="text-[11px] text-slate-500 font-medium leading-snug">${cat.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- SECTION 2: PRODUCTS CATALOG -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 oz-shadow space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl bg-purple-600 text-purple-600 flex items-center justify-center font-black text-base shrink-0">🛍️</span>
                        <h2 class="font-black text-lg text-slate-900">2. מוצרי החנות (אינדקס מוצרים ישיר)</h2>
                    </div>
                    <span class="text-xs font-bold text-slate-400">סה"כ ${allProds.length} מוצרים בקטלוג</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    ${allProds.map(p => `
                        <div onclick="closeSitemapPage(); openProductPage('${p.id}')" class="p-3 bg-slate-50/60 hover:bg-white border border-slate-200/60 hover:border-purple-300 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                                <div class="min-w-0">
                                    <div class="font-bold text-xs text-slate-800 truncate group-hover:text-oz-primary transition-colors">${p.name}</div>
                                    <div class="text-[10px] text-slate-400 font-medium truncate">${p.category_name || 'תשמישי קדושה'}</div>
                                </div>
                            </div>
                            <div class="text-left shrink-0">
                                <span class="font-black text-xs text-oz-primary">₪${p.price}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- SECTION 3: HALACHIC ARTICLES & GUIDES -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 oz-shadow space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base shrink-0">📖</span>
                        <h2 class="font-black text-lg text-slate-900">3. ארכיון מאמרים הלכתיים ומדריכים</h2>
                    </div>
                    <span class="text-xs font-bold text-slate-400">סה"כ ${allArticles.length} מאמרים מורחבים</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    ${allArticles.map(a => `
                        <div onclick="openArticleModal(${a.id})" class="p-3.5 bg-slate-50/60 hover:bg-white border border-slate-200/60 hover:border-purple-300 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group">
                            <div class="flex items-center gap-3 min-w-0">
                                <span class="text-base shrink-0">📜</span>
                                <div class="min-w-0">
                                    <div class="font-bold text-xs text-slate-800 truncate group-hover:text-oz-primary transition-colors">${a.title}</div>
                                    <div class="text-[10px] text-purple-600 font-bold">${a.category} • ${a.readTime || '5 דק\''}</div>
                                </div>
                            </div>
                            <span class="text-xs font-black text-purple-600 group-hover:translate-x-[-3px] transition-transform shrink-0">קרא ←</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- SECTION 4: PAGES & LEGAL INFO -->
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 oz-shadow space-y-4">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span class="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-base shrink-0">📜</span>
                    <h2 class="font-black text-lg text-slate-900">4. דפי מידע, מדיניות ושירות לקוחות</h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-bold">
                    <button onclick="toggleModal('terms-modal')" class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-2xl text-right transition-all flex items-center justify-between group">
                        <span class="text-slate-800 group-hover:text-oz-primary">📜 תקנון האתר ותנאי הזמנה</span>
                        <span class="text-purple-600">←</span>
                    </button>
                    <button onclick="toggleModal('terms-modal')" class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-2xl text-right transition-all flex items-center justify-between group">
                        <span class="text-slate-800 group-hover:text-oz-primary">🔒 אבטחה וסליקה בתקן SSL</span>
                        <span class="text-purple-600">←</span>
                    </button>
                    <button onclick="toggleModal('accessibility-modal')" class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-2xl text-right transition-all flex items-center justify-between group">
                        <span class="text-slate-800 group-hover:text-oz-primary">♿ הצהרת נגישות ע"פ החוק</span>
                        <span class="text-purple-600">←</span>
                    </button>
                    <button onclick="toggleModal('shipping-returns-modal')" class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-2xl text-right transition-all flex items-center justify-between group">
                        <span class="text-slate-800 group-hover:text-oz-primary">🚚 זמני אספקה ומשלוחים</span>
                        <span class="text-purple-600">←</span>
                    </button>
                    <button onclick="openAccountPage()" class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-2xl text-right transition-all flex items-center justify-between group">
                        <span class="text-slate-800 group-hover:text-oz-primary">👑 החשבון שלי ומועדון VIP</span>
                        <span class="text-purple-600">←</span>
                    </button>
                    <a href="https://maps.app.goo.gl/daBGid7dAtGxSzaB7" target="_blank" class="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-2xl text-right transition-all flex items-center justify-between group">
                        <span class="text-slate-800 group-hover:text-oz-primary">📍 ניווט לחנות בראש העין</span>
                        <span class="text-purple-600">←</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function switchAccountTab(tabName, btn) {
    document.querySelectorAll('.account-tab-btn').forEach(b => {
        b.classList.remove('bg-oz-primary', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    });

    const activeBtn = btn || document.getElementById('account-tab-btn-' + tabName);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
        activeBtn.classList.add('bg-oz-primary', 'text-white', 'shadow-md');
    }

    document.querySelectorAll('.account-tab-pane').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById('account-tab-' + tabName);
    if (target) target.classList.remove('hidden');

    if (tabName === 'wishlist') renderAccountWishlist();
}

function renderAccountWishlist() {
    const grid = document.getElementById('account-wishlist-grid');
    const badge = document.getElementById('account-wishlist-count-badge');
    const numSpan = document.getElementById('account-tab-wishlist-num');

    const favProducts = products.filter(p => state.wishlist.includes(Number(p.id)));

    if (badge) badge.textContent = favProducts.length;
    if (numSpan) numSpan.textContent = favProducts.length;

    if (!grid) return;

    const recommendedUpsells = products.filter(p => !state.wishlist.includes(Number(p.id))).slice(0, 3);

    let html = '';

    if (favProducts.length === 0) {
        html += `
            <div class="col-span-full text-center py-10 bg-slate-50/50 rounded-3xl border border-slate-200/80 p-6 space-y-3">
                <div class="text-4xl">❤️</div>
                <h4 class="font-black text-slate-800 text-sm">עדיין לא שמרת מוצרים במועדפים שלך</h4>
                <p class="text-xs text-slate-500 font-medium max-w-md mx-auto">לחץ על סמל הלב שעל גבי המוצרים בחנות כדי לשמור אותם כאן, לעקוב אחריהם ולממש נקודות VIP בקלות!</p>
                <button onclick="closeAccountPage()" class="py-2.5 px-6 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer">עבור לקטלוג החנות 🛍️</button>
            </div>
        `;
    } else {
        html += favProducts.map(p => `
            <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 hover:border-purple-300 transition-all group">
                <div class="flex items-center gap-3 cursor-pointer" onclick="closeAccountPage(); openProductPage('${p.id}')">
                    <img src="${p.image}" class="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
                    <div>
                        <span class="text-[10px] font-black text-oz-primary uppercase bg-slate-50 px-2 py-0.5 rounded-md">${p.category_name || 'תשמישי קדושה'}</span>
                        <h4 class="font-black text-xs text-slate-800 mt-1 line-clamp-1 group-hover:text-oz-primary transition-colors">${p.name}</h4>
                        <div class="text-xs font-black text-oz-primary mt-0.5">₪${p.price}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button onclick="addToCart('${p.id}')" class="py-2 px-3.5 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-sm transition-all">+ לסל</button>
                    <button onclick="toggleWishlist(${p.id}); renderAccountWishlist();" class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="הסר ממועדפים">
                        <svg class="w-5 h-5 fill-red-500 text-red-500" viewBox="0 0 24 24"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // RECOMMENDED SIMILAR PRODUCTS TO BOOST PURCHASING & ENGAGEMENT
    html += `
        <div class="col-span-full mt-6 pt-6 border-t border-slate-200/80">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h4 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <span>🔥 מוצרים מומלצים בלעדית עבורך (10% צבירת נקודות VIP)</span>
                    </h4>
                    <p class="text-[11px] text-slate-500 font-medium">מוצרים דומים ואביזרים נלווים שהלקוחות שלנו הכי אוהבים</p>
                </div>
                <button onclick="closeAccountPage()" class="text-xs font-extrabold text-oz-primary hover:underline">לכל החנות ←</button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                ${recommendedUpsells.map(r => `
                    <div class="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-all">
                        <div onclick="closeAccountPage(); openProductPage('${r.id}')" class="cursor-pointer space-y-2">
                            <img src="${r.image}" class="w-full h-32 object-cover rounded-xl shadow-sm" />
                            <div class="text-[9px] font-black text-purple-700 bg-purple-600 px-2 py-0.5 rounded-md inline-block">הטבת VIP מיוחדת</div>
                            <h5 class="font-black text-xs text-slate-800 line-clamp-1">${r.name}</h5>
                            <div class="text-xs font-black text-oz-primary">₪${r.price}</div>
                        </div>
                        <div class="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/80">
                            <button onclick="addToCart('${r.id}')" class="flex-1 py-1.5 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-lg shadow-sm transition-all">+ הוסף לסל</button>
                            <button onclick="closeAccountPage(); openProductPage('${r.id}')" class="py-1.5 px-2 bg-white text-oz-primary font-bold text-xs rounded-lg border border-purple-200 hover:bg-purple-100">צפה 👁️</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- ENCOURAGING PURCHASING CTA BOX -->
            <div class="p-5 bg-gradient-to-r from-[#29114D] via-oz-primary to-[#190933] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 border border-purple-400/40">
                <div class="space-y-1">
                    <div class="font-black text-sm text-purple-200 flex items-center gap-1.5">
                        <span>🎁 רוצה לממש 150 נקודות VIP לקבלת 10% הנחה?</span>
                    </div>
                    <div class="text-xs text-purple-200 font-medium leading-relaxed">
                        הוסף את המוצרים שאהבת לסל ועבור לקופה לקבלת 10% הנחה מלאה + משלוח מהיר עד הבית!
                    </div>
                </div>
                <button onclick="closeAccountPage(); toggleCartDrawer()" class="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 hover:from-purple-600 hover:to-indigo-900 text-white font-black text-xs rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer">
                    עבור לסל הקניות והקופה 🛒
                </button>
            </div>
        </div>
    `;

    grid.innerHTML = html;
}

function reorderOrder(orderId) {
    let targetItems = [];
    if (orderId === 'OZ-10492') {
        targetItems = products.filter(p => p.id === 1 || p.id === 3);
    } else {
        targetItems = products.filter(p => p.id === 2 || p.id === 5);
    }

    targetItems.forEach(p => {
        const existing = state.cart.find(i => Number(i.id) === Number(p.id));
        if (existing) existing.qty += 1;
        else state.cart.push({ ...p, qty: 1 });
    });

    updateCartUI();
    showToast('🎉 המוצרים מההזמנה מולאו מחדש בסל הקניות שלך!');
    toggleCartDrawer();
}

function redeemPoints() {
    alert('🎉 ברכות! מימשת 150 נקודות VIP OZ לקבלת 10% הנחה בלעדית בקופה (חיסכון משמעותי של עד ₪150!). הקופון OZ-VIP-10% הוחל אוטומטית בקופה.');
}

window.saveUserProfile = function(e) {
    if (e) e.preventDefault();

    const name = (document.getElementById('profile-name')?.value || '').trim();
    const phone = (document.getElementById('profile-phone')?.value || '').trim();
    const email = (document.getElementById('profile-email')?.value || '').trim();
    const city = (document.getElementById('profile-city')?.value || '').trim();
    const street = (document.getElementById('profile-street')?.value || '').trim();
    const apartment = (document.getElementById('profile-apartment')?.value || '').trim();
    const rite = (document.getElementById('profile-rite')?.value || '').trim();

    if (!name || !phone) {
        alert('⚠️ אנא מלא שם מלא ומספר טלפון תקין');
        return false;
    }

    state.user = state.user || {};
    state.user.name = name;
    state.user.phone = phone;
    state.user.email = email;
    state.user.city = city;
    state.user.street = street;
    state.user.apartment = apartment;
    state.user.rite = rite;

    try {
        localStorage.setItem('oz_user', JSON.stringify(state.user));
    } catch(err) {
        console.error('Failed saving oz_user to localStorage', err);
    }

    if (typeof updateUserLabel === 'function') updateUserLabel();

    if (typeof showToast === 'function') {
        showToast('🎉 פרטי החשבון עודכנו בהצלחה!');
    } else {
        alert('🎉 פרטי החשבון עודכנו בהצלחה!');
    }

    const accountPage = document.getElementById('account-page-container');
    if (accountPage) {
        accountPage.innerHTML = renderAccountPageHTML();
        switchAccountTab('edit-profile');
    }

    return false;
};

function renderAccountPageHTML() {
    const user = state.user || { name: 'ישראל מירושלים', phone: '052-686-7192' };
    const wishlistCount = state.wishlist ? state.wishlist.length : 0;
    const recs = products.slice(0, 3);

    return `
        <div class="space-y-6 text-right dir-rtl pb-12 max-w-6xl mx-auto">
            <!-- Compact Header Nav Bar -->
            <div class="flex items-center justify-between bg-white p-3.5 px-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <button onclick="closeAccountPage()" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>🏠</span> דף הבית
                    </button>
                    <span class="text-slate-300">/</span>
                    <span class="text-oz-primary font-black flex items-center gap-1">
                        <span>👤</span> החשבון שלי (אזור VIP)
                    </span>
                </div>
                <button onclick="closeAccountPage()" class="py-1.5 px-4 bg-slate-50 hover:bg-purple-100 text-oz-primary font-extrabold text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-1 cursor-pointer">
                    <span>←</span> חזרה לקטלוג החנות
                </button>
            </div>

            <!-- VIP Hero Dashboard Header -->
            <div class="bg-gradient-to-r from-[#29114D] via-[#4A1578] to-[#190933] text-white p-6 sm:p-7 rounded-3xl shadow-2xl border border-purple-400/40 relative overflow-hidden">
                <!-- Background decorative glow -->
                <div class="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -right-10 -top-10 w-48 h-48 bg-slate-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <!-- Customer Greeting & Status -->
                    <div class="flex items-center gap-4">
                        <div class="relative shrink-0">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg border-2 border-purple-200">
                                👑
                            </div>
                            <span class="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#29114D]" title="מחובר כעת"></span>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2.5 flex-wrap">
                                <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">שלום, ${user.name}!</h1>
                                <span class="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-900 text-white font-black text-[10px] py-1 px-3 rounded-full shadow-md flex items-center gap-1">
                                    <span>🌟</span> חבר מועדון VIP OZ
                                </span>
                                <button onclick="switchAccountTab('edit-profile')" class="py-1 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 font-bold text-xs rounded-xl border border-purple-400/40 transition-all flex items-center gap-1 cursor-pointer">
                                    <span>✏️</span> ערוך פרטים
                                </button>
                            </div>
                            <p class="text-xs text-purple-200 font-medium flex items-center gap-2 flex-wrap">
                                <span>📱 ${user.phone || '052-686-7192'}</span>
                                ${user.email ? `<span class="text-purple-400">•</span><span>✉️ ${user.email}</span>` : ''}
                                <span class="text-purple-400">•</span>
                                <span class="text-purple-200 font-bold">דרגת VIP: Platinum Gold</span>
                            </p>
                        </div>
                    </div>

                    <!-- Quick VIP Stats & Instant Redemption Card -->
                    <div class="w-full lg:w-auto bg-white/10 backdrop-blur-md p-4 px-5 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-4 justify-between">
                        <div class="text-right sm:text-center shrink-0">
                            <div class="text-[10px] font-bold text-purple-200 uppercase tracking-wider">מאזן נקודות VIP OZ</div>
                            <div class="text-2xl sm:text-3xl font-black text-purple-200 my-0.5 flex items-center gap-1">
                                <span>150</span>
                                <span class="text-xs font-bold text-purple-600">נקודות</span>
                            </div>
                            <div class="text-[10px] text-purple-100 font-bold">150 נקודות = 10% הנחה (עד ₪150 חיסכון)</div>
                        </div>

                        <div class="w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-r border-white/15 pt-3 sm:pt-0 sm:pr-4">
                            <button onclick="redeemPoints()" class="w-full py-2.5 px-5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-900 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                <span>🎁</span> ממש 150 נקודות ל-10% הנחה
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Quick Stat Badges Strip -->
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/10 relative z-10 text-xs">
                    <div onclick="switchAccountTab('wishlist')" class="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-base">❤️</span>
                            <span class="font-bold text-purple-100 text-[11px]">מוצרים שאהבתי</span>
                        </div>
                        <span id="account-wishlist-count-badge" class="font-black bg-red-500 text-white text-[10px] py-0.5 px-2 rounded-full">${wishlistCount}</span>
                    </div>

                    <div onclick="switchAccountTab('orders')" class="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-base">📦</span>
                            <span class="font-bold text-purple-100 text-[11px]">הזמנות קודמות</span>
                        </div>
                        <span class="font-black bg-emerald-500 text-white text-[10px] py-0.5 px-2 rounded-full">2</span>
                    </div>

                    <div onclick="switchAccountTab('recommendations')" class="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-base">✨</span>
                            <span class="font-bold text-purple-100 text-[11px]">המלצות עבורך</span>
                        </div>
                        <span class="font-black bg-slate-500 text-white text-[10px] py-0.5 px-2 rounded-full">3</span>
                    </div>

                    <div onclick="switchAccountTab('points')" class="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-base">🎁</span>
                            <span class="font-bold text-purple-100 text-[11px]">הטבת מועדון</span>
                        </div>
                        <span class="font-black bg-purple-600 text-white text-[10px] py-0.5 px-2 rounded-full">10% OFF</span>
                    </div>

                    <div onclick="switchAccountTab('edit-profile')" class="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between col-span-2 sm:col-span-1">
                        <div class="flex items-center gap-2">
                            <span class="text-base">✏️</span>
                            <span class="font-bold text-purple-100 text-[11px]">פרטי חשבון</span>
                        </div>
                        <span class="font-black bg-purple-600 text-white text-[10px] py-0.5 px-2 rounded-full">ערוך</span>
                    </div>
                </div>
            </div>

            <!-- Focused Account Content Container -->
            <div class="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 oz-shadow space-y-6">
                <!-- Navigation Tabs Bar -->
                <div class="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar">
                    <button id="account-tab-btn-wishlist" onclick="switchAccountTab('wishlist', this)" class="account-tab-btn py-2.5 px-5 rounded-xl font-black text-xs bg-oz-primary text-white shadow-md transition-all flex items-center gap-1.5 shrink-0">
                        <span>❤️</span> מוצרים שאהבתי (<span id="account-tab-wishlist-num">${wishlistCount}</span>)
                    </button>
                    <button id="account-tab-btn-orders" onclick="switchAccountTab('orders', this)" class="account-tab-btn py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5 shrink-0">
                        <span>📦</span> היסטוריית הזמנות (2)
                    </button>
                    <button id="account-tab-btn-recommendations" onclick="switchAccountTab('recommendations', this)" class="account-tab-btn py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5 shrink-0">
                        <span>✨</span> המלצות עבורך
                    </button>
                    <button id="account-tab-btn-points" onclick="switchAccountTab('points', this)" class="account-tab-btn py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5 shrink-0">
                        <span>🎁</span> מועדון VIP ונקודות
                    </button>
                    <button id="account-tab-btn-edit-profile" onclick="switchAccountTab('edit-profile', this)" class="account-tab-btn py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5 shrink-0">
                        <span>✏️</span> עריכת פרטי חשבון
                    </button>
                </div>

                <!-- Tab 1: Favorites / Wishlist -->
                <div id="account-tab-wishlist" class="account-tab-pane space-y-5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                            <span>❤️</span> המוצרים ששמרת במועדפים
                        </h3>
                        <span class="text-xs font-bold text-slate-400">ניהול רשימת מוצרים אהובים</span>
                    </div>

                    <div id="account-wishlist-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Filled dynamically by renderAccountWishlist() -->
                    </div>
                </div>

                <!-- Tab 2: Orders History -->
                <div id="account-tab-orders" class="account-tab-pane hidden space-y-5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                            <span>📦</span> ההזמנות הקודמות שלך במכון עוז
                        </h3>
                        <span class="text-xs font-bold text-slate-400">2 הזמנות שהושלמו</span>
                    </div>
                    
                    <div class="space-y-4">
                        <!-- Order 1 -->
                        <div class="bg-slate-50/70 hover:bg-slate-50/30 p-5 rounded-2xl border border-slate-200/80 transition-all space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-200/60 pb-3 flex-wrap gap-2">
                                <div>
                                    <div class="font-black text-sm text-slate-900 flex items-center gap-2">
                                        <span>הזמנה #OZ-10492</span>
                                        <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">משלוח עד הבית 🚚</span>
                                    </div>
                                    <div class="text-[11px] text-slate-500 font-medium mt-0.5">תאריך: 12.08.2026 | אופן תשלום: אשראי 💳</div>
                                </div>
                                <span class="bg-emerald-100 text-emerald-800 font-black text-xs py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                                    <span>✓</span> נמסר בהצלחה
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                                <div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                                    <img src="${products[0] ? products[0].image : ''}" class="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <div class="font-black text-xs text-slate-800 line-clamp-1">${products[0] ? products[0].name : 'תפילין מהודרות'}</div>
                                        <div class="text-[11px] font-bold text-oz-primary">₪${products[0] ? products[0].price : 1490}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                                    <img src="${products[2] ? products[2].image : ''}" class="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <div class="font-black text-xs text-slate-800 line-clamp-1">${products[2] ? products[2].name : 'ציצית צמר טהור'}</div>
                                        <div class="text-[11px] font-bold text-oz-primary">₪${products[2] ? products[2].price : 180}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between border-t border-slate-200/60 pt-3">
                                <div class="text-xs font-black text-slate-800">
                                    סה"כ שולם: <span class="text-sm font-black text-oz-primary">₪1,890</span>
                                </div>
                                <button onclick="reorderOrder('OZ-10492')" class="py-2 px-4 bg-oz-primary hover:bg-oz-hover text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <span>🔄</span> הזמן מוצרים אלו מחדש בסל
                                </button>
                            </div>
                        </div>

                        <!-- Order 2 -->
                        <div class="bg-slate-50/70 hover:bg-slate-50/30 p-5 rounded-2xl border border-slate-200/80 transition-all space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-200/60 pb-3 flex-wrap gap-2">
                                <div>
                                    <div class="font-black text-sm text-slate-900 flex items-center gap-2">
                                        <span>הזמנה #OZ-10115</span>
                                        <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">איסוף מראש העין 🏪</span>
                                    </div>
                                    <div class="text-[11px] text-slate-500 font-medium mt-0.5">תאריך: 04.05.2026 | אופן תשלום: אשראי 💳</div>
                                </div>
                                <span class="bg-emerald-100 text-emerald-800 font-black text-xs py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                                    <span>✓</span> נמסר בהצלחה
                                </span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                                <div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                                    <img src="${products[1] ? products[1].image : ''}" class="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <div class="font-black text-xs text-slate-800 line-clamp-1">${products[1] ? products[1].name : 'בית מזוזה מעוצב'}</div>
                                        <div class="text-[11px] font-bold text-oz-primary">₪${products[1] ? products[1].price : 120}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                                    <img src="${products[4] ? products[4].image : ''}" class="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <div class="font-black text-xs text-slate-800 line-clamp-1">${products[4] ? products[4].name : 'ארנק עור יוקרתי'}</div>
                                        <div class="text-[11px] font-bold text-oz-primary">₪${products[4] ? products[4].price : 220}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between border-t border-slate-200/60 pt-3">
                                <div class="text-xs font-black text-slate-800">
                                    סה"כ שולם: <span class="text-sm font-black text-oz-primary">₪340</span>
                                </div>
                                <button onclick="reorderOrder('OZ-10115')" class="py-2 px-4 bg-oz-primary hover:bg-oz-hover text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <span>🔄</span> הזמן מוצרים אלו מחדש בסל
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 3: Personalized Recommendations -->
                <div id="account-tab-recommendations" class="account-tab-pane hidden space-y-5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                            <span>✨</span> המלצות מיוחדות המותאמות בדיוק עבורך
                        </h3>
                        <span class="text-xs font-bold text-purple-600 bg-slate-50 px-2.5 py-1 rounded-full">10% צבירת נקודות VIP בכל רכישה</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        ${recs.map(r => `
                            <div class="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 hover:border-purple-300 transition-all flex flex-col justify-between group hover:shadow-md">
                                <div onclick="closeAccountPage(); openProductPage('${r.id}')" class="cursor-pointer space-y-2">
                                    <div class="relative overflow-hidden rounded-xl">
                                        <img src="${r.image}" class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <span class="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm">המלצה חמה 🔥</span>
                                    </div>
                                    <span class="text-[10px] font-black text-oz-primary uppercase bg-slate-50 px-2 py-0.5 rounded-md inline-block">${r.category_name || 'תשמישי קדושה'}</span>
                                    <h4 class="font-black text-xs text-slate-800 line-clamp-1 group-hover:text-oz-primary transition-colors">${r.name}</h4>
                                    <div class="text-sm font-black text-oz-primary">₪${r.price}</div>
                                </div>
                                <div class="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                                    <button onclick="addToCart('${r.id}')" class="flex-1 py-2 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-sm transition-all">+ הוסף לסל</button>
                                    <button onclick="closeAccountPage(); openProductPage('${r.id}')" class="py-2 px-3 bg-white text-oz-primary font-bold text-xs rounded-xl border border-purple-200 hover:bg-slate-50">צפה 👁️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Tab 4: Points & Rewards Status -->
                <div id="account-tab-points" class="account-tab-pane hidden space-y-5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                            <span>🎁</span> מועדון VIP OZ – צבירה ומימוש נקודות
                        </h3>
                        <span class="text-xs font-black text-purple-700 bg-purple-600 px-3 py-1 rounded-full">מאזן נוכחי: 150 נקודות</span>
                    </div>

                    <div class="bg-gradient-to-r from-purple-50 via-purple-100/50 to-indigo-900/50 p-5 rounded-2xl border border-purple-200 space-y-4">
                        <div class="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h4 class="font-black text-sm text-slate-900">התקדמות לדרגת VIP Diamond ✨</h4>
                                <p class="text-xs text-slate-600">צבור עוד 50 נקודות לקבלת 15% הנחה קבועה ומשלוחים בחינם!</p>
                            </div>
                            <button onclick="redeemPoints()" class="py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-900 text-white font-black text-xs rounded-xl shadow-md hover:scale-105 transition-all">
                                ממש 150 נקודות ל-10% הנחה 🎁
                            </button>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div class="bg-gradient-to-r from-purple-600 to-oz-primary h-full rounded-full" style="width: 75%"></div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-right text-xs">
                        <div class="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                            <div class="font-black text-sm text-oz-primary flex items-center gap-1.5">
                                <span>🪙</span> 1. צבירת נקודות VIP
                            </div>
                            <p class="text-slate-600 leading-relaxed font-medium">על כל ₪20 ברכישה באתר, אתה צובר 10 נקודות OZ לחשבונך האישי במועדון. הנקודות נשמרות לתמיד!</p>
                        </div>
                        <div class="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                            <div class="font-black text-sm text-oz-primary flex items-center gap-1.5">
                                <span>🏷️</span> 2. מימוש הנחה חכם (10%)
                            </div>
                            <p class="text-slate-600 leading-relaxed font-medium">150 נקודות מעניקות קופון VIP בשווי 10% הנחה מלאה על כל סל הקניות באתר (עד ₪150 חיסכון בקנייה single!).</p>
                        </div>
                        <div class="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                            <div class="font-black text-sm text-oz-primary flex items-center gap-1.5">
                                <span>🎂</span> 3. הטבות יום הולדת ואירועים
                            </div>
                            <p class="text-slate-600 leading-relaxed font-medium">חברי VIP נהנים מ-50 נקודות מתנה ביום ההולדת, קופונים בלעדיים ומשלוחים מועדפים בחגים ואירועים.</p>
                        </div>
                    </div>
                </div>

                <!-- Tab 5: Edit Profile & Account Details -->
                <div id="account-tab-edit-profile" class="account-tab-pane hidden space-y-6">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
                                <span>✏️</span> עריכת פרטי החשבון והמשלוח שלך
                            </h3>
                            <p class="text-xs text-slate-500 mt-0.5">העדכן את הפרטים האישיים שלך למילוי אוטומטי מהיר בקופה ובקבצי ההזמנה</p>
                        </div>
                        <span class="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <span>🔒</span> שמור ומאובטח במכון עוז
                        </span>
                    </div>

                    <form onsubmit="saveUserProfile(event)" class="space-y-5 bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
                        <!-- Section 1: Basic Info -->
                        <div>
                            <h4 class="font-black text-xs text-oz-primary uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <span>👤</span> 1. פרטים אישיים ויצירת קשר
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">שם מלא *</label>
                                    <input type="text" id="profile-name" required value="${user.name || ''}" placeholder="לדוגמה: ישראל ישראלי" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">מספר טלפון נייד *</label>
                                    <input type="tel" id="profile-phone" required value="${user.phone || ''}" placeholder="052-686-7192" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                            </div>
                            <div class="mt-3">
                                <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                                    <span>כתובת דוא"ל (אימייל)</span>
                                    <span class="text-[10px] text-oz-primary font-black bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">אופציונלי – לקבלת קבלות דיגיטליות ועדכונים 📧</span>
                                </label>
                                <input type="email" id="profile-email" value="${user.email || ''}" placeholder="example@domain.co.il (לקבלת חשבונית מס-קבלה ועדכוני משלוח)" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all shadow-sm" />
                            </div>
                        </div>

                        <!-- Section 2: Address -->
                        <div>
                            <h4 class="font-black text-xs text-oz-primary uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <span>🏠</span> 2. כתובת למשלוח מהיר
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">עיר / יישוב</label>
                                    <input type="text" id="profile-city" value="${user.city || ''}" placeholder="ראש העין" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">רחוב ומספר בית</label>
                                    <input type="text" id="profile-street" value="${user.street || ''}" placeholder="שלום מנצורה 48" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">דירה / כניסה / קומה</label>
                                    <input type="text" id="profile-apartment" value="${user.apartment || ''}" placeholder="דירה 4, כניסה א'" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: Preferences -->
                        <div>
                            <h4 class="font-black text-xs text-oz-primary uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <span>📜</span> 3. נוסח מועדף לתשמישי קדושה וסת"ם
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">נוסח כתיבת תפילין ומזוזות מועדף</label>
                                    <select id="profile-rite" class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer">
                                        <option value="עדות המזרח" ${user.rite === 'עדות המזרח' ? 'selected' : ''}>עדות המזרח / ספרדי (מורשת מרן)</option>
                                        <option value="אשכנז" ${user.rite === 'אשכנז' ? 'selected' : ''}>אשכנז (בית יוסף)</option>
                                        <option value="חב''ד" ${user.rite === "חב''ד" ? 'selected' : ''}>אריז"ל / חב"ד (אדמוה"ז)</option>
                                    </select>
                                </div>
                                <div class="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-xs text-slate-600 flex items-center gap-2">
                                    <span>💡</span>
                                    <span>בחירת הנוסח המועדף תבטיח שההזמנות העתידיות שלך יותאמו מראש למסורת והמנהג של ביתך.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button type="submit" class="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                <span>💾</span> שמור עדכון פרטי חשבון
                            </button>
                            <span class="text-[11px] text-slate-400 font-medium">✨ הפרטים יישמרו וימולאו אוטומטית בכל רכישה באתר</span>
                        </div>
                    </form>
                </div>
            </div>

            <!-- EXPANDABLE SEO BOX FOR ACCOUNT PAGE -->
            <section class="mt-8">
                <div class="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-800/40 dir-rtl text-right">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black text-xl shrink-0">👑</span>
                        <div>
                            <h3 class="font-black text-lg sm:text-xl text-purple-200">מידע על מועדון הלקוחות OZ VIP ושירות המכון</h3>
                            <p class="text-xs text-slate-300">מכון עוז | שלום מנצורה 48, ראש העין | 052-686-7192</p>
                        </div>
                    </div>

                    <p class="text-xs sm:text-sm leading-relaxed text-slate-200">
                        כחברי מועדון VIP במכון עוז, אתם נהנים מצבירת נקודות בכל רכישה, קופוני הנחה בלעדיים, שירות תזכורות לבדיקת תפילין ומזוזות לפי ההלכה, וקבלת יחס אישי מורחב מצוות המכון.
                    </p>

                    <div id="seo-content-account" class="hidden mt-4 pt-4 border-t border-purple-800/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <p>
                            <strong>צבירה ומימוש נקודות:</strong> כל קנייה בחנות צוברת נקודות הניתנות למימוש מיידי כהנחות על תפילין, מזוזות, טליתות, ארנקים ותיקים. נקודות שנצברו אינן פגות תוקף לעולם.
                        </p>
                        <p>
                            <strong>שירותי בדיקת סת"ם בראש העין:</strong> תפילין ומזוזות טעונות בדיקה תקופתית (פעמיים בשבע שנים). חברי מועדון זכאים לבדיקה מהירה במכון בראש העין ברחוב שלום מנצורה 48.
                        </p>
                    </div>

                    <div class="mt-4 pt-2 flex justify-center sm:justify-start">
                        <button id="seo-btn-account" onclick="toggleSeoExpand('account')" class="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 hover:from-purple-600 hover:to-indigo-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                            קרא עוד... ↓
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// TOAST NOTIFICATIONS HELPER
function showToast(msg) {
    const toast = document.getElementById('purchase-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');

    if (!toast || !toastTitle || !toastDesc) return;

    toastTitle.textContent = msg;
    toastDesc.textContent = 'מכון עוז • משלוחים לכל הארץ 🚚';

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

function startSocialProofToasts() {
    const toastNames = ['נתנאל מירושלים', 'אליעזר מפתח תקווה', 'דוד מראש העין', 'יוסי מבני ברק', 'אברהם מאשדוד', 'משה מתל אביב'];
    const toastItems = ['תפילין מהודרות ⚡', 'ארנק עור נאפה 💼', 'טלית צמר טהור 👕', 'מזוזה כשרה 📜', 'סידור עור יוקרתי 📖'];
    
    setInterval(() => {
        const randName = toastNames[Math.floor(Math.random() * toastNames.length)];
        const randItem = toastItems[Math.floor(Math.random() * toastItems.length)];
        showToast(randName + ' • רכש כעת: ' + randItem);
    }, 90000);
}

function setupExitIntent() {
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !state.exitIntentTriggered) {
            state.exitIntentTriggered = true;
            const modal = document.getElementById('exit-intent-popup');
            if (modal) modal.classList.remove('hidden');
        }
    });
}

// AUTOMATIC SHABBAT OBSERVANCE & ACCESS BLOCKING SYSTEM
function checkShabbatMode() {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();

    // Admin/Owner override check
    if (hash === '#admin' || hash === '#crm' || hash === '#noshabbat') {
        const overlay = document.getElementById('shabbat-overlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
        return;
    }

    const forceTest = hash === '#shabbat' || search.includes('shabbat=true');

    let now = new Date();
    try {
        const israelStr = now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
        now = new Date(israelStr);
    } catch(e){}

    const day = now.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeNum = hours + (minutes / 60);

    // Shabbat mode starts Friday 16:00 (4 PM) until Saturday 20:30 (8:30 PM)
    const isFridayShabbat = (day === 5 && timeNum >= 16.0);
    const isSaturdayShabbat = (day === 6 && timeNum <= 20.5);

    const isShabbatNow = forceTest || isFridayShabbat || isSaturdayShabbat;

    if (isShabbatNow) {
        showShabbatOverlay();
    }
}

function showShabbatOverlay() {
    if (document.getElementById('shabbat-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'shabbat-overlay';
    overlay.className = 'fixed inset-0 z-[999999] bg-gradient-to-br from-[#12072B] via-[#1E1B4B] to-[#0A0318] text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center dir-rtl select-none';
    
    overlay.innerHTML = `
        <div class="max-w-xl w-full bg-white/10 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-purple-400/40 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
            <!-- Decorative Glow -->
            <div class="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Candle Icon -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white flex items-center justify-center mx-auto text-4xl sm:text-5xl shadow-2xl border-2 border-purple-200 animate-pulse">
                🕯️🕯️
            </div>
            
            <div class="space-y-3">
                <span class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600/20 border border-purple-400/40 text-purple-200 font-black text-xs rounded-full shadow-inner">
                    ✨ אתר שומר שבת כהלכה
                </span>
                <h1 class="text-3xl sm:text-4xl font-black text-purple-200 tracking-tight">שבת שלום ומבורך!</h1>
                <p class="text-sm sm:text-base text-slate-100 font-bold leading-relaxed pt-1">
                    החנות המקוונת של מכון עוז סגורה כעת לרגל קדושת השבת.
                </p>
            </div>

            <div class="p-4 bg-purple-950/80 border border-purple-800/70 rounded-2xl text-xs sm:text-sm text-slate-200 leading-relaxed font-medium space-y-2">
                <p>אנו מבקשים מכל גולשינו היקרים נהגו בכבוד ונא לא לבצע הזמנות או לגלוש באתר עד צאת השבת.</p>
                <div class="pt-2 border-t border-purple-800/60 font-black text-purple-200">
                    נשמח לשרתכם שוב מכל הלב עם צאת השבת! 🛍️✨
                </div>
            </div>

            <div class="text-xs text-purple-200 font-bold bg-white/5 py-2.5 px-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 flex-wrap">
                <span>📍 ראש העין, שלום מנצורה 48</span>
                <span>•</span>
                <span>📞 052-686-7192</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkShabbatMode);
} else {
    checkShabbatMode();
}
window.addEventListener('hashchange', checkShabbatMode);
// VIP DISCOUNT POPUP ENGINE
window.initVipCouponPopup = function() {
    try {
        if (localStorage.getItem('oz_vip_coupon_seen')) return;
        setTimeout(() => {
            const modal = document.getElementById('vip-coupon-modal');
            if (modal) {
                modal.classList.remove('hidden');
                localStorage.setItem('oz_vip_coupon_seen', 'true');
            }
        }, 3500);
    } catch(e) {}
};

window.copyVipCoupon = function() {
    const code = 'OZVIP5';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            if (typeof showToast === 'function') {
                showToast('🎉 קוד הקופון OZVIP5 הועתק בהצלחה! 5% הנחה תגזר בקופה.');
            } else {
                alert('🎉 קוד הקופון OZVIP5 הועתק בהצלחה! 5% הנחה תגזר בקופה.');
            }
        }).catch(() => {
            alert('קוד קופון להנחה: OZVIP5');
        });
    } else {
        alert('קוד קופון להנחה: OZVIP5');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.initVipCouponPopup();
});

// OZ SMART AI ASSISTANT BOT ENGINE
window.toggleOzBotChat = function() {
    const win = document.getElementById('oz-bot-chat-window');
    if (!win) return;
    if (win.classList.contains('hidden') || win.style.display === 'none') {
        win.classList.remove('hidden');
        win.style.display = 'flex';
        const inp = document.getElementById('oz-bot-input');
        if (inp) inp.focus();
    } else {
        win.classList.add('hidden');
        win.style.display = 'none';
    }
};

window.askOzBotQuestion = function(questionText) {
    const inp = document.getElementById('oz-bot-input');
    if (inp) {
        inp.value = questionText;
        window.sendOzBotMessage();
    }
};

window.sendOzBotMessage = function() {
    const input = document.getElementById('oz-bot-input');
    const container = document.getElementById('oz-bot-messages');
    if (!input || !container) return;

    const userMsg = input.value.trim();
    if (!userMsg) return;

    // Helper escapeHtml
    const safeMsg = userMsg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Append User Message Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'flex justify-start mb-2';
    userBubble.innerHTML = `
        <div class="bg-purple-900 text-white py-2 px-3.5 rounded-2xl rounded-tr-none max-w-[85%] text-xs font-bold shadow-sm">
            ${safeMsg}
        </div>
    `;
    container.appendChild(userBubble);
    input.value = '';

    // Auto Scroll
    container.scrollTop = container.scrollHeight;

    // Response Generation
    setTimeout(() => {
        const botReply = generateOzBotReply(userMsg);
        const botBubble = document.createElement('div');
        botBubble.className = 'flex justify-end mb-2';
        botBubble.innerHTML = `
            <div class="bg-white border border-purple-200/80 text-slate-800 py-2.5 px-3.5 rounded-2xl rounded-tl-none max-w-[90%] text-xs font-medium shadow-sm space-y-2">
                <div class="font-extrabold text-[11px] text-oz-primary flex items-center gap-1">
                    <span>🤖 מענה מכון עוז</span>
                </div>
                <div class="leading-relaxed text-slate-700">${botReply}</div>
            </div>
        `;
        container.appendChild(botBubble);
        container.scrollTop = container.scrollHeight;
    }, 350);
};

function generateOzBotReply(q) {
    const query = q.toLowerCase();

    if (query.includes('נציג') || query.includes('אדם') || query.includes('בנאדם') || query.includes('טלפון')) {
        return `📍 <strong>שירות לקוחות וייעוץ מול גלעד מנהל מכון עוז:</strong><br>
        • 📞 <strong>טלפון ישיר:</strong> 052-686-7192<br>
        • <strong>שעות מענה:</strong> ימים א'-ה': 09:00-19:00 | ימי שישי: 09:00-13:00<br>
        • <strong>כתובת החנות:</strong> רחוב שלום מנצורה 48, ראש העין`;
    }

    if (query.includes('כשר') || query.includes('סת"ם') || query.includes('סתם') || query.includes('הגהה') || query.includes('מחשב') || query.includes('סופר') || query.includes('קלף')) {
        return `📜 <strong>כשרות והגהת סת"ם במכון עוז:</strong><br>
        כל מוצרי הסת"ם (תפילין, מזוזות, ספרי תורה) נכתבים ע"י סופרי סת"ם יראי שמיים מוסמכים, ועוברים <strong>הגהת גברא כפולה לצד בדיקת מחשב אופטית מוסמכת</strong>. כל מוצר מגיע עם תעודת אישור הגהה ואחריות מלאה!`;
    }

    if (query.includes('משלוח') || query.includes('מחיר משלוח') || query.includes('מתי יגיע') || query.includes('עלות משלוח') || query.includes('חינם')) {
        return `🚚 <strong>מידע על משלוחים:</strong><br>
        • <strong>משלוח חינם</strong> בכל הזמנה מעל ₪399!<br>
        • הזמנות עד ₪399: דמי משלוח מוזלים של ₪35 בלבד עד פתח הבית.<br>
        • <strong>זמן אספקה:</strong> 2-5 ימי עסקים לכל חלקי הארץ.`;
    }

    if (query.includes('כתובת') || query.includes('איפה') || query.includes('מיקום') || query.includes('חנות') || query.includes('שעות') || query.includes('איסוף')) {
        return `📍 <strong>כתובת ושעות פעילות:</strong><br>
        • <strong>כתובת החנות:</strong> רחוב שלום מנצורה 48, ראש העין.<br>
        • <strong>שעות פתיחה:</strong> ימים א'-ה': 09:00-19:00 | ימי שישי: 09:00-13:00.<br>
        • 📞 <strong>טלפון ליצירת קשר וייעוץ:</strong> 052-686-7192. ניתן לבצע איסוף עצמי בתיאום מראש.`;
    }

    if (query.includes('מזוזה') || query.includes('מזוזות') || query.includes('אפוקסי') || query.includes('פלסטיק') || query.includes('אלומיניום') || query.includes('גודל')) {
        return `🚪 <strong>בתי מזוזה וקלפים:</strong><br>
        במכון עוז תמצאו בתי מזוזה יוקרתיים מאפוקסי, פלסטיק עמיד, אלומיניום מוברש ועץ זית.<br>
        • <strong>גודל קלף מומלץ:</strong> 10 ס"מ, 12 ס"מ, או 15 ס"מ.<br>
        • כל הקלפים שנכתבו ע"י סופר סת"ם מוסמך מגיעים עם תעודת בדיקה!`;
    }

    if (query.includes('ארנק') || query.includes('ארנקים') || query.includes('עור') || query.includes('תיק') || query.includes('נרתיק')) {
        return `👛 <strong>ארנקים ותיקי עור נאפה לגבר:</strong><br>
        קולקציית הארנקים מיוצרת מ-100% עור נאפה פרימיום עם הגנת RFID נגד גניבת אשראי. בנוסף אנו מציעים תיקים מהודרים ומגינים לטלית ולתפילין.`;
    }

    if (query.includes('תפילין') || query.includes('בר מצווה') || query.includes('נוסח') || query.includes('בהמה גסה')) {
        return `✨ <strong>תפילין מהודרות במכון עוז:</strong><br>
        אנו מתמחים בייצור בתים ופרשיות מבהמה גסה (עור עגל עבה לשמירה על ריבוע מדויק לכל החיים) בנוסח ספרדי, אשכנזי, חב"ד ותימני.<br>
        כל סט מגיע עם תעודת הגהת מחשב, אחריות מורחבת ונרתיק מגן.`;
    }

    if (query.includes('שבת') || query.includes('חג') || query.includes('תשלום') || query.includes('אשראי') || query.includes('אחריות')) {
        return `🛡️ <strong>אבטחה ושמירת שבת:</strong><br>
        • אתר מכון עוז שומר שבת ואינו פעיל בשבתות ובחגי ישראל.<br>
        • הרכישה באתר מאובטחת בתקן PCI-DSS עם אפשרות לפריסת תשלומים ואחריות מלאה על כל מוצר.`;
    }

    return `תודה על פנייתך! 📜<br>
    למענה ספציפי מול גלעד מנהל מכון עוז, ניתן ליצור קשר בטלפון <strong>052-686-7192</strong> או להגיע לחנות ברחוב שלום מנצורה 48, ראש העין.`;
}

// ==========================================
// PERSONALIZED ENGRAVING & EMBROIDERY LIVE ENGINE
// ==========================================
let pdpEngravingState = { enabled: false, text: '', style: 'gold_foil', price: 29 };

function resetPDPEngravingState() {
    pdpEngravingState = { enabled: false, text: '', style: 'gold_foil', price: 29 };
}

function togglePDPEngraving(enabled) {
    pdpEngravingState.enabled = enabled;
    const controls = document.getElementById('pdp-engraving-controls');
    const overlay = document.getElementById('pdp-engraving-live-overlay');
    if (controls) controls.classList.toggle('hidden', !enabled);
    if (overlay) overlay.classList.toggle('hidden', !enabled || !pdpEngravingState.text.trim());
}

function updatePDPEngravingText(text) {
    pdpEngravingState.text = text || '';
    const liveText = document.getElementById('pdp-engraving-live-text');
    const overlay = document.getElementById('pdp-engraving-live-overlay');
    if (liveText) liveText.textContent = pdpEngravingState.text.trim() || 'ישראל ישראלי';
    if (overlay) overlay.classList.toggle('hidden', !pdpEngravingState.enabled || !pdpEngravingState.text.trim());
}

function selectPDPEngravingStyle(style) {
    pdpEngravingState.style = style;
    const liveText = document.getElementById('pdp-engraving-live-text');
    if (liveText) {
        if (style === 'silver_foil') {
            liveText.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #CFD8DC 50%, #ECEFF1 100%)';
        } else if (style === 'gold_embroidery') {
            liveText.style.background = 'linear-gradient(135deg, #FFF176 0%, #F57F17 50%, #FFEE58 100%)';
        } else {
            liveText.style.background = 'linear-gradient(135deg, #FFE082 0%, #FFB300 50%, #FFF8E1 100%)';
        }
        liveText.style.webkitBackgroundClip = 'text';
        liveText.style.webkitTextFillColor = 'transparent';
    }

    document.querySelectorAll('.pdp-style-btn').forEach(btn => {
        const btnStyle = btn.getAttribute('data-style');
        if (btnStyle === style) {
            btn.className = 'pdp-style-btn p-2 rounded-xl border-2 border-amber-500 ring-2 ring-amber-500 bg-amber-100 text-amber-950 font-black transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer';
        } else {
            btn.className = 'pdp-style-btn p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer';
        }
    });
}