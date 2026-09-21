$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$filePath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\animated_hero.html'

$updatedHeroHtml = @"
    <!-- ULTRA LUXURY ROYAL HERO BANNER WITH ANIMATED VISUAL SHOWCASE SLIDER -->
    <section id="hero" class="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] py-16 md:py-24 border-b border-purple-900/50 shadow-2xl text-white">
        <!-- Ambient Glowing Background Accents -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <!-- Text Content -->
                <div class="space-y-6 text-right">
                    <div class="inline-flex items-center gap-2 py-1.5 px-4 bg-white/10 backdrop-blur-md text-purple-200 font-extrabold text-xs rounded-full border border-purple-400/30 shadow-lg">
                        <svg class="w-4 h-4 fill-purple-300" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span>מכון עוז – הידור מצווה, כשרות מוקפדת ואיכות פרימיום</span>
                    </div>

                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-wide">
                        תשמישי קדושה, יודאיקה <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">ומתנות יוקרה לגבר</span>
                    </h1>

                    <p class="text-base sm:text-lg text-purple-100/90 font-medium leading-relaxed max-w-xl">
                        חוויית קנייה אונליין יוקרתית ומובילה: תפילין מהודרות בהגהת מחשב וגברא, מזוזות כשרות בהשגחה, טליתות צמר, וארנקי עור נאפה לגבר. אחריות מלאה ומשלוח מהיר לכל הארץ.
                    </p>

                    <!-- Feature Badges Bar -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold">
                        <a href="#seo-box-content-stam" onclick="toggleSEOBox('stam')" class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-purple-400/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-purple-100">
                            <svg class="w-5 h-5 text-purple-300 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>
                            <span>100% כשרות והגהה</span>
                        </a>

                        <a href="#shop" onclick="filterCategory('all')" class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-purple-400/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-purple-100">
                            <svg class="w-5 h-5 text-purple-300 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3-3h-1.5m0 0l-1.12-4.48A1.125 1.125 0 013.006 5.5H16.5a1.125 1.125 0 011.08 1.42l-1.5 6a1.125 1.125 0 01-1.08.83H7.5z"/></svg>
                            <span>משלוח חינם מעל ₪399</span>
                        </a>

                        <a href="tel:0526867192" class="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-purple-400/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-purple-100">
                            <svg class="w-5 h-5 text-purple-300 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.828-1.41-5.123-3.705-6.533-6.533l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                            <span>052-686-7192</span>
                        </a>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap items-center gap-4 pt-2">
                        <a href="#shop" onclick="filterCategory('all'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="py-4 px-8 bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#581C87] text-white hover:from-purple-500 hover:to-indigo-800 font-black text-base rounded-2xl shadow-xl shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-2">
                            <span>עבור לקטלוג המוצרים המלא</span>
                            <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                        </a>
                        <a href="https://wa.me/972526867192?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%9D%D7%9B%D7%95%D7%9F%20%D7%A2%D7%95%D7%96%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%99%D7%99%D7%A2%D7%95%D7%A5" target="_blank" rel="noopener noreferrer" class="py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-2">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.755.002-2.61-1.01-5.063-2.853-6.908-1.843-1.843-4.293-2.859-6.904-2.86-5.437 0-9.863 4.37-9.866 9.756-.001 1.777.473 3.5 1.372 5.018l-.993 3.634 3.756-.986z"/></svg>
                            <span>ייעוץ והזמנה בוואטסאפ</span>
                        </a>
                    </div>
                </div>

                <!-- Animated Luxury Visual Showcase Carousel -->
                <div class="relative flex justify-center">
                    <div class="w-full max-w-md rounded-3xl bg-gradient-to-tr from-purple-600 via-purple-700 to-indigo-900 p-1 shadow-2xl shadow-purple-950/80 transform hover:scale-[1.02] transition-all duration-500 relative">
                        <div class="w-full bg-[#1A0B2E]/95 backdrop-blur-xl rounded-[22px] overflow-hidden p-4 relative border border-purple-400/20 text-center flex flex-col items-center">
                            
                            <!-- Slide Image Wrapper with Auto Animation -->
                            <div class="w-full h-80 rounded-2xl overflow-hidden relative shadow-lg group cursor-pointer" onclick="filterCategory('all'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" title="לחץ לצפייה במוצרים">
                                <!-- Dynamic Slides -->
                                <div id="hero-slides-container" class="w-full h-full relative">
                                    <!-- Slide 1: Royal Heritage Showcase -->
                                    <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-100">
                                        <img src="public/hero_option_1.jpg" alt="מכון עוז - תשמישי קדושה ויודאיקה" class="w-full h-full object-cover" />
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-right">
                                            <span class="bg-purple-600 text-white font-black text-[10px] py-1 px-3 rounded-full w-max mb-1">מראה מלכותי • 100% כשרות והגהה</span>
                                            <h4 class="font-black text-lg text-white">תשמישי קדושה, תפילין ויודאיקה</h4>
                                            <p class="text-xs text-purple-200">תפילין מהודרות, טליתות, מזוזות וארנקי עור</p>
                                        </div>
                                    </div>
                                    <!-- Slide 2: Modern Luxury E-Commerce -->
                                    <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-0 pointer-events-none">
                                        <img src="public/hero_option_2.jpg" alt="חנות קונספט מודרנית" class="w-full h-full object-cover" />
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-right">
                                            <span class="bg-purple-600 text-white font-black text-[10px] py-1 px-3 rounded-full w-max mb-1">עיצוב מודרני מבריק</span>
                                            <h4 class="font-black text-lg text-white">מזוזות מעוצבות ומתנות יוקרה</h4>
                                            <p class="text-xs text-purple-200">בתי מזוזה עץ זית ואפוקסי, גביעים וארנקי עור</p>
                                        </div>
                                    </div>
                                    <!-- Slide 3: Bar Mitzvah & Groom Gift Set -->
                                    <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-0 pointer-events-none">
                                        <img src="public/hero_option_3.jpg" alt="מארזי מתנות לבר מצווה ולחתן" class="w-full h-full object-cover" />
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-right">
                                            <span class="bg-purple-600 text-white font-black text-[10px] py-1 px-3 rounded-full w-max mb-1">מארז יוקרתי בר מצווה/חתן</span>
                                            <h4 class="font-black text-lg text-white">סטים מלאים לבר מצווה ולחתן</h4>
                                            <p class="text-xs text-purple-200">תפילין, נרתיקי קטיפה, סידורים וארנקים</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Carousel Slide Indicator Dots -->
                            <div class="flex items-center gap-2 mt-3" id="hero-dots-container">
                                <button onclick="setHeroSlide(0)" class="w-3 h-3 rounded-full bg-purple-600 transition-all"></button>
                                <button onclick="setHeroSlide(1)" class="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all"></button>
                                <button onclick="setHeroSlide(2)" class="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
"@

[System.IO.File]::WriteAllText($filePath, $updatedHeroHtml, $utf8NoBOM)
Write-Host "Updated animated_hero.html with all 3 high-res custom visual hero options!"
