$path = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$content = Get-Content -Path $path -Raw -Encoding UTF8

# 1. Remove Google Material Symbols font link from head
$content = $content -replace '<link href="https://fonts.googleapis.com/css2\?family=Material\+Symbols\+Outlined:[^"]*" rel="stylesheet">', ''
$content = $content -replace '@font-face\s*\{\s*font-family:\s*''Material Symbols Outlined'';[\s\S]*?\}', ''
$content = $content -replace '\.material-symbols-outlined\s*\{[^}]*\}', ''
$content = $content -replace '\.wishlist-btn\.active \.material-symbols-outlined\s*\{[^}]*\}', '.wishlist-btn.active svg { fill: #EF4444; stroke: #EF4444; }'

# 2. Replace expand_more in header menu
$expandSvg = '<svg class="w-3.5 h-3.5 inline stroke-current stroke-2" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>'
$content = $content -replace '<span class="material-symbols-outlined text-xs">expand_more</span>', $expandSvg

# 3. Replace Hero section completely with Ultra-Luxury Hero
$heroPattern = '(?s)<!-- LUXURY HERO BANNER -->.*?<!-- CATEGORY SLIDER / CAROUSEL BAR'
$newHero = @"
<!-- ULTRA LUXURY ROYAL HERO BANNER -->
    <section id="hero" class="relative overflow-hidden bg-gradient-to-br from-[#190933] via-[#29114D] to-[#120526] py-16 md:py-24 border-b border-purple-900/50 shadow-2xl text-white">
        <!-- Ambient Glowing Background Accents -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <!-- Text Content -->
                <div class="space-y-6 text-right">
                    <div class="inline-flex items-center gap-2 py-1.5 px-4 bg-white/10 backdrop-blur-md text-amber-300 font-extrabold text-xs rounded-full border border-amber-400/30 shadow-lg">
                        <svg class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span>מכון עוז – הידור מצווה, כשרות מוקפדת ואיכות פרימיום</span>
                    </div>

                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-wide">
                        הידור מצווה ואיכות פרימיום <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">משלוחים ישירים לכל הארץ</span>
                    </h1>

                    <p class="text-base sm:text-lg text-purple-100/90 font-medium leading-relaxed max-w-xl">
                        חוויית קנייה ייחודית ויוקרתית: תפילין מהודרות בהגהת מחשב וגברא, מזוזות כשרות בהשגחה, וארנקי עור נאפה פרימיום לגבר. אחריות מלאה ומשלוח עד הבית.
                    </p>

                    <!-- Feature Badges Bar -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold">
                        <a href="#seo-box-content-stam" onclick="toggleSEOBox('stam')" class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-purple-400/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-purple-100">
                            <svg class="w-5 h-5 text-amber-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>
                            <span>100% כשרות והגהה</span>
                        </a>

                        <a href="#shop" onclick="filterCategory('all')" class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-purple-400/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-purple-100">
                            <svg class="w-5 h-5 text-amber-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3-3h-1.5m0 0l-1.12-4.48A1.125 1.125 0 013.006 5.5H16.5a1.125 1.125 0 011.08 1.42l-1.5 6a1.125 1.125 0 01-1.08.83H7.5z"/></svg>
                            <span>משלוח חינם מעל ₪399</span>
                        </a>

                        <a href="tel:0526867192" class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-purple-400/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-purple-100">
                            <svg class="w-5 h-5 text-amber-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.828-1.41-5.123-3.705-6.533-6.533l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                            <span>052-686-7192</span>
                        </a>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap items-center gap-4 pt-2">
                        <a href="#shop" onclick="filterCategory('all'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="py-4 px-8 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-2">
                            <span>עבור לקטלוג המוצרים המלא</span>
                            <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                        </a>
                        <a href="https://wa.me/972526867192?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%9D%D7%9B%D7%95%D7%9F%20%D7%A2%D7%95%D7%96%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%99%D7%99%D7%A2%D7%95%D7%A5" target="_blank" rel="noopener noreferrer" class="py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-2">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.755.002-2.61-1.01-5.063-2.853-6.908-1.843-1.843-4.293-2.859-6.904-2.86-5.437 0-9.863 4.37-9.866 9.756-.001 1.777.473 3.5 1.372 5.018l-.993 3.634 3.756-.986z"/></svg>
                            <span>ייעוץ והזמנה בוואטסאפ</span>
                        </a>
                    </div>
                </div>

                <!-- Showcase Luxury Visual Card -->
                <div class="relative flex justify-center cursor-pointer" onclick="filterCategory('all'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" title="לחץ למעבר לקטלוג המוצרים">
                    <div class="w-full max-w-md rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 p-1 shadow-2xl shadow-purple-950/80 transform hover:scale-105 transition-all duration-500 group">
                        <div class="w-full bg-[#1A0B2E]/95 backdrop-blur-xl rounded-[22px] overflow-hidden p-8 text-center flex flex-col items-center justify-center relative border border-amber-400/20">
                            <span class="absolute top-4 left-4 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black py-1 px-3 rounded-full group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">לחץ לקטלוג ✨</span>
                            
                            <img src="public/oz_logo_transparent.png" alt="לוגו מכון עוז" class="h-28 w-auto object-contain mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]" />
                            
                            <h3 class="text-2xl font-black text-white mb-1 group-hover:text-amber-300 transition-colors">מכון עוז - מכון לקדושה</h3>
                            <p class="text-xs font-bold text-amber-300 mb-4">תפילין • מזוזות • תשמישי קדושה • ארנקים</p>
                            
                            <div class="w-full pt-4 border-t border-purple-800/60 flex justify-around text-center text-xs font-bold text-purple-200">
                                <div class="group-hover:translate-y-[-2px] transition-transform">
                                    <div class="text-amber-300 font-black text-xl">100%</div>
                                    <div>כשרות והגהה</div>
                                </div>
                                <div class="group-hover:translate-y-[-2px] transition-transform">
                                    <div class="text-amber-400 font-black text-xl">★ 5.0</div>
                                    <div>ביקורות גוגל</div>
                                </div>
                                <div class="group-hover:translate-y-[-2px] transition-transform">
                                    <div class="text-amber-300 font-black text-xl">מהיר</div>
                                    <div>משלוח ארצי</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CATEGORY SLIDER / CAROUSEL BAR
"@

$content = [regex]::Replace($content, $heroPattern, $newHero)

# 4. Replace Chevron right/left in carousels
$chevRight = '<svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>'
$chevLeft = '<svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>'
$arrowBackSmall = '<svg class="w-3.5 h-3.5 inline stroke-current stroke-2" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>'

$content = $content -replace '<span class="material-symbols-outlined text-xl">chevron_right</span>', $chevRight
$content = $content -replace '<span class="material-symbols-outlined text-xl">chevron_left</span>', $chevLeft
$content = $content -replace '<span class="material-symbols-outlined text-sm">arrow_back</span>', $arrowBackSmall

# 5. Replace shopping_cart in HTML buttons
$cartSvg = '<svg class="w-4 h-4 inline fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>'
$content = $content -replace '<span class="material-symbols-outlined text-base">shopping_cart</span>', $cartSvg

# 6. Replace Filter icons (tune, category, payments, chevron_left in buttons)
$tuneSvg = '<svg class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75"/></svg>'
$categorySvg = '<svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>'
$paymentsSvg = '<svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15iA2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z"/></svg>'
$chevLeftSmall = '<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none inline" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>'

$content = $content -replace '<span class="material-symbols-outlined text-2xl">tune</span>', $tuneSvg
$content = $content -replace '<span class="material-symbols-outlined text-base text-oz-primary">category</span>', $categorySvg
$content = $content -replace '<span class="material-symbols-outlined text-base text-oz-primary">payments</span>', $paymentsSvg
$content = $content -replace '<span class="material-symbols-outlined text-sm">chevron_left</span>', $chevLeftSmall

# 7. Replace SEO Accordion icons (verified, home_pin, dry_cleaning, wallet, menu_book, card_giftcard)
$verifiedSvg = '<svg class="w-5 h-5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>'
$homePinSvg = '<svg class="w-5 h-5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>'
$dryCleaningSvg = '<svg class="w-5 h-5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>'
$walletSvg = '<svg class="w-5 h-5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"/></svg>'
$menuBookSvg = '<svg class="w-5 h-5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>'
$giftSvg = '<svg class="w-5 h-5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-9-13.5h18"/></svg>'

$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-xl">verified</span>', $verifiedSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-xl">home_pin</span>', $homePinSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-xl">dry_cleaning</span>', $dryCleaningSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-xl">wallet</span>', $walletSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-xl">menu_book</span>', $menuBookSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-xl">card_giftcard</span>', $giftSvg
$content = $content -replace '<span class="material-symbols-outlined text-emerald-600 text-sm">verified</span>', $verifiedSvg

# 8. Replace Modal & Drawer Icons
$straightenSvg = '<svg class="w-6 h-6 text-oz-primary stroke-current stroke-2 fill-none inline" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0L20.25 20.25m0-16.5v16.5m0 0H3.75"/></svg>'
$giftQuizSvg = '<svg class="w-6 h-6 text-amber-600 stroke-current stroke-2 fill-none inline" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-9-13.5h18"/></svg>'
$searchSvg = '<svg class="w-6 h-6 text-oz-primary stroke-current stroke-2 fill-none inline" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>'
$shoppingBagSvg = '<svg class="w-5 h-5 text-oz-primary stroke-current stroke-2 fill-none inline" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>'

$content = $content -replace '<span class="material-symbols-outlined text-2xl">straighten</span>', $straightenSvg
$content = $content -replace '<span class="material-symbols-outlined text-2xl">featured_seasonal_and_gifts</span>', $giftQuizSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary text-2xl">search</span>', $searchSvg
$content = $content -replace '<span class="material-symbols-outlined text-oz-primary">shopping_bag</span>', $shoppingBagSvg
$content = $content -replace '<span class="material-symbols-outlined text-sm">auto_awesome</span>', '✨'
$content = $content -replace '<span class="material-symbols-outlined text-xl">shopping_basket</span>', $shoppingBagSvg

# 9. Replace Footer icons
$truckAccent = '<svg class="w-4 h-4 text-oz-accent inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3-3h-1.5m0 0l-1.12-4.48A1.125 1.125 0 013.006 5.5H16.5a1.125 1.125 0 011.08 1.42l-1.5 6a1.125 1.125 0 01-1.08.83H7.5z"/></svg>'
$callAccent = '<svg class="w-4 h-4 text-oz-accent inline stroke-current stroke-2 fill-none group-hover:scale-125 transition-transform" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.828-1.41-5.123-3.705-6.533-6.533l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>'
$locAccent = '<svg class="w-4 h-4 text-oz-accent inline stroke-current stroke-2 fill-none group-hover:scale-125 transition-transform" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>'
$schedAccent = '<svg class="w-4 h-4 text-oz-accent inline stroke-current stroke-2 fill-none group-hover:scale-125 transition-transform" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'

$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-accent">local_shipping</span>', $truckAccent
$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-accent group-hover:scale-125 transition-transform">call</span>', $callAccent
$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-accent group-hover:scale-125 transition-transform">location_on</span>', $locAccent
$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-accent group-hover:scale-125 transition-transform">schedule</span>', $schedAccent

# 10. Replace JS inline material icon strings inside renderProducts & openQuickView
$jsHeartSvg = '<svg class="w-5 h-5 text-slate-400 group-hover:text-red-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>'
$jsEyeSvg = '<svg class="w-3.5 h-3.5 text-oz-primary inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c.729-2.3 2.615-4.27 4.95-5.32 2.336-1.05 4.975-1.05 7.31 0 2.335 1.05 4.22 3.02 4.95 5.32.729 2.3-.729 4.27-4.95 5.32-2.335 1.05-4.974 1.05-7.31 0-2.335-1.05-4.221-3.02-4.95-5.32z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
$jsCartSvg = '<svg class="w-4 h-4 inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"/></svg>'
$jsChatSvg = '<svg class="w-4 h-4 inline stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.04-.694c0-.285.064-.565.188-.82a6.002 6.002 0 01-.308-1.806C4.25 13.094 8.28 9.4 13.25 9.4s9 3.694 9 8.25z"/></svg>'
$jsSearchOff = '<svg class="w-10 h-10 text-slate-300 mx-auto mb-2 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>'

$content = $content -replace '<span class="material-symbols-outlined text-slate-400 hover:text-red-500 text-lg">favorite</span>', $jsHeartSvg
$content = $content -replace '<span class="material-symbols-outlined text-xs text-oz-primary">visibility</span>', $jsEyeSvg
$content = $content -replace '<span class="material-symbols-outlined text-base">shopping_cart</span>', $jsCartSvg
$content = $content -replace '<span class="material-symbols-outlined text-base">chat</span>', $jsChatSvg
$content = $content -replace '<span class="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>', $jsSearchOff
$content = $content -replace '<span class="material-symbols-outlined text-5xl mb-2 text-slate-300">shopping_cart</span>', $jsCartSvg
$content = $content -replace '<span class="material-symbols-outlined text-lg">shopping_cart</span>', $jsCartSvg
$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-primary">verified</span>', $verifiedSvg
$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-primary">local_shipping</span>', $truckAccent
$content = $content -replace '<span class="material-symbols-outlined text-sm text-oz-primary">edit_note</span>', '✍️'

# Save file UTF8 clean
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated index.html with inline SVGs and luxury Hero banner!"
