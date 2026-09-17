$path = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$content = Get-Content -Path $path -Raw -Encoding UTF8

$oldNavPattern = '(?s)<!-- NAVIGATION LINKS WITH MEGA MENU DROPDOWNS -->.*?<!-- HEADER ACTIONS'

$newNav = @"
<!-- NAVIGATION LINKS WITH MEGA MENU DROPDOWNS FOR ALL CATEGORIES -->
            <nav class="hidden lg:flex items-center gap-6 xl:gap-8 font-extrabold text-xs sm:text-sm text-slate-700">
                
                <!-- Category 1: STAM & Tefillin (With Mega Menu) -->
                <div class="relative group/menu py-6">
                    <a href="#shop" onclick="filterCategory('stam'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>תשמישי קדושה וסת"ם</span>
                        <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </a>
                    <div class="mega-menu absolute top-full right-0 w-[480px] bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 grid grid-cols-2 gap-3 z-50 text-right dir-rtl">
                        <div onclick="filterCategory('stam'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">תפילין מהודרות</div>
                                <div class="text-[11px] text-slate-500 font-medium">לבר מצווה / אשכנז / ספרד</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('mezuzot'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">מזוזות ובתי מזוזה</div>
                                <div class="text-[11px] text-slate-500 font-medium">קלפים כשרים 10-15 ס"מ</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('stam'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">ציוד לסופרי סת"ם</div>
                                <div class="text-[11px] text-slate-500 font-medium">שולחנות, דיו וקולמוסים</div>
                            </div>
                        </div>

                        <div onclick="toggleSEOBox('stam'); document.getElementById('seo-box-content-stam').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <div class="w-12 h-12 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-lg shrink-0">✨</div>
                            <div>
                                <div class="font-black text-xs text-slate-800">הגהת מחשב וגברא</div>
                                <div class="text-[11px] text-slate-500 font-medium">בדיקה מוסמכת במקום</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category 2: Wallets (With Mega Menu) -->
                <div class="relative group/menu py-6">
                    <a href="#shop" onclick="filterCategory('wallets'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>תיקים וארנקים</span>
                        <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </a>
                    <div class="mega-menu absolute top-full right-0 w-[450px] bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 grid grid-cols-2 gap-3 z-50 text-right dir-rtl">
                        <div onclick="filterCategory('wallets'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">ארנקי עור נאפה</div>
                                <div class="text-[11px] text-slate-500 font-medium">עור אמיתי 100% איכותי</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('wallets'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">ארנקי מגנט לגבר</div>
                                <div class="text-[11px] text-slate-500 font-medium">עיצוב דק ואלגנטי</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('wallets'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100 col-span-2">
                            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg shrink-0">🎒</div>
                            <div>
                                <div class="font-black text-xs text-slate-800">תיקים ונרתיקי טלית ותפילין</div>
                                <div class="text-[11px] text-slate-500 font-medium">תיקי עור פרימיום מוגנים לרחוב ולבית הכנסת</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category 3: Tallitot (With Mega Menu) -->
                <div class="relative group/menu py-6">
                    <a href="#shop" onclick="filterCategory('tallitot-tzitzit'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>טליתות וציציות</span>
                        <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </a>
                    <div class="mega-menu absolute top-full right-0 w-[450px] bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 grid grid-cols-2 gap-3 z-50 text-right dir-rtl">
                        <div onclick="filterCategory('tallitot-tzitzit'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">טליתות צמר טהור</div>
                                <div class="text-[11px] text-slate-500 font-medium">בית יוסף / תשבץ / פאר קל</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('tallitot-tzitzit'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <div class="w-12 h-12 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-lg shrink-0">👕</div>
                            <div>
                                <div class="font-black text-xs text-slate-800">גופיות ציצית עבודת יד</div>
                                <div class="text-[11px] text-slate-500 font-medium">ציציות כותנה וצמר לשמה</div>
                            </div>
                        </div>

                        <div onclick="toggleModal('tallit-calc-modal')" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-purple-100 col-span-2 bg-purple-50/50">
                            <div class="w-12 h-12 rounded-xl bg-oz-primary text-white flex items-center justify-center font-black text-lg shrink-0">📐</div>
                            <div>
                                <div class="font-black text-xs text-oz-primary">מחשבון התאמת גודל טלית</div>
                                <div class="text-[11px] text-slate-600 font-medium">לחץ כאן לחישוב המידה המדויקת לפי הגובה שלך</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category 4: Books (With Mega Menu) -->
                <div class="relative group/menu py-6">
                    <a href="#shop" onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>ספרי קודש וסידורים</span>
                        <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </a>
                    <div class="mega-menu absolute top-full right-0 w-[450px] bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 grid grid-cols-2 gap-3 z-50 text-right dir-rtl">
                        <div onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">סידורים בכריכת עור</div>
                                <div class="text-[11px] text-slate-500 font-medium">עדות המזרח / אשכנז / ספרד</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg shrink-0">📖</div>
                            <div>
                                <div class="font-black text-xs text-slate-800">חומשים ותהילים</div>
                                <div class="text-[11px] text-slate-500 font-medium">כריכות יוקרתיות עם עיטורי זהב</div>
                            </div>
                        </div>

                        <div onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100 col-span-2">
                            <div class="w-12 h-12 rounded-xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-lg shrink-0">✍️</div>
                            <div>
                                <div class="font-black text-xs text-slate-800">ברכונים והקדשות אישיות</div>
                                <div class="text-[11px] text-slate-500 font-medium">חריטת שמות ממוחשבת לשמחות ואירועים</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category 5: Gifts (With Mega Menu) -->
                <div class="relative group/menu py-6">
                    <a href="#shop" onclick="filterCategory('gifts'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                        <span>מתנות ויודאיקה</span>
                        <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </a>
                    <div class="mega-menu absolute top-full left-0 lg:right-auto w-[450px] bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 grid grid-cols-2 gap-3 z-50 text-right dir-rtl">
                        <div onclick="filterCategory('gifts'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-3 rounded-2xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=120&q=80" class="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                            <div>
                                <div class="font-black text-xs text-slate-800">מארזי לבר מצווה וחתנים</div>
                                <div class="text-[11px] text-slate-500 font-medium">סטי יודאיקה ותשמישי קדושה</div>
                            </div>
                        </div>

                        <div onclick="toggleModal('gift-quiz-modal')" class="p-3 rounded-2xl hover:bg-amber-50 cursor-pointer flex items-center gap-3 transition-colors border border-amber-200 bg-amber-50/40">
                            <div class="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-lg shrink-0">🎁</div>
                            <div>
                                <div class="font-black text-xs text-amber-900">שאלון התאמת מתנה חכם</div>
                                <div class="text-[11px] text-amber-700 font-medium">מצא מתנה לפי אירוע ותקציב</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Magazine & Tools -->
                <a href="#magazine" class="hover:text-oz-primary transition-colors text-purple-700 font-black flex items-center gap-1 shrink-0">
                    <span>📖 מגזין והלכה</span>
                </a>
            </nav>

            <!-- HEADER ACTIONS
"@

$content = [regex]::Replace($content, $oldNavPattern, $newNav)

# Save UTF-8 clean
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated header navigation with complete Mega Menu dropdowns for ALL categories!"
