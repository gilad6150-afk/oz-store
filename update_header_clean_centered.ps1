$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

# 1. Update clean_nav.html
$cleanNavPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_nav.html"
$cleanNavContent = Get-Content -Path $cleanNavPath -Raw -Encoding UTF8

# Replace "בדיקה מוסמכת במקום" with "בדיקה מוסמכת ומחשב"
$cleanNavContent = $cleanNavContent -replace 'בדיקה מוסמכת במקום', 'בדיקה מוסמכת ומחשב'

# Build new centered nav block with 5 clean categories (and no magazine)
$newNavBlock = @'
                <!-- NAVIGATION LINKS WITH SLEEK MEGA MENU DROPDOWNS FOR ALL CATEGORIES (CENTERED) -->
                <nav class="hidden lg:flex items-center justify-center gap-6 xl:gap-9 font-bold text-xs xl:text-[13px] text-slate-800 flex-grow text-center">
                    
                    <!-- Category 1: STAM & Tefillin (With Mega Menu) -->
                    <div class="relative group/menu py-4 sm:py-5">
                        <a href="#shop" onclick="filterCategory('stam'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-purple-50/60">
                            <span>תשמישי קדושה וסת"ם</span>
                            <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 text-slate-400 group-hover/menu:text-oz-primary group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                        </a>
                        <div class="mega-menu absolute top-full right-0 w-[480px] bg-white rounded-2xl p-4 shadow-xl border border-purple-100/90 grid grid-cols-2 gap-2.5 z-50 text-right dir-rtl">
                            <div onclick="filterCategory('stam'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">תפילין מהודרות</div>
                                    <div class="text-[11px] text-slate-500 font-medium">לבר מצווה / אשכנז / ספרד</div>
                                </div>
                            </div>

                            <div onclick="filterCategory('mezuzot'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">מזוזות ובתי מזוזה</div>
                                    <div class="text-[11px] text-slate-500 font-medium">קלפים כשרים 10-15 ס"מ</div>
                                </div>
                            </div>

                            <div onclick="filterCategory('stam'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">ציוד לסופרי סת"ם</div>
                                    <div class="text-[11px] text-slate-500 font-medium">שולחנות, דיו וקולמוסים</div>
                                </div>
                            </div>

                            <div class="p-2.5 rounded-xl bg-purple-50/50 flex items-center gap-3 border border-purple-100/60">
                                <div class="w-11 h-11 rounded-lg bg-purple-100 text-oz-primary flex items-center justify-center shrink-0"><svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                                <div>
                                    <div class="font-black text-xs text-slate-800">הגהת מחשב וגברא</div>
                                    <div class="text-[11px] text-slate-500 font-medium">בדיקה מוסמכת ומחשב</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Category 2: Bags & Wallets (Combined cleanly) -->
                    <div class="relative group/menu py-4 sm:py-5">
                        <a href="#shop" onclick="filterCategory('tefillin-bags'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-purple-50/60">
                            <span>תיקים וארנקים</span>
                            <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 text-slate-400 group-hover/menu:text-oz-primary group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                        </a>
                        <div class="mega-menu absolute top-full right-0 w-[450px] bg-white rounded-2xl p-4 shadow-xl border border-purple-100/90 grid grid-cols-2 gap-2.5 z-50 text-right dir-rtl">
                            <div onclick="filterCategory('tefillin-bags'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">תיקים לתפילין וטלית</div>
                                    <div class="text-[11px] text-slate-500 font-medium">תיקי קטיפה, דמוי עור ומזוודה</div>
                                </div>
                            </div>
                            <div onclick="filterCategory('wallets'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">ארנקים לגבר</div>
                                    <div class="text-[11px] text-slate-500 font-medium">עור נאפה, מגנט ודק</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Category 3: Tallitot & Tzitzit -->
                    <div class="relative group/menu py-4 sm:py-5">
                        <a href="#shop" onclick="filterCategory('tallitot-tzitzit'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-purple-50/60">
                            <span>טליות וציציות</span>
                            <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 text-slate-400 group-hover/menu:text-oz-primary group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                        </a>
                        <div class="mega-menu absolute top-full right-0 w-[450px] bg-white rounded-2xl p-4 shadow-xl border border-purple-100/90 grid grid-cols-2 gap-2.5 z-50 text-right dir-rtl">
                            <div onclick="filterCategory('tallitot-tzitzit'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">טליתות צמר טהור</div>
                                    <div class="text-[11px] text-slate-500 font-medium">בית יוסף / תשבץ / פאר קל</div>
                                </div>
                            </div>

                            <div onclick="filterCategory('tallitot-tzitzit'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">גופיות ציצית עבודת יד</div>
                                    <div class="text-[11px] text-slate-500 font-medium">ציציות כותנה וצמר לשמה</div>
                                </div>
                            </div>

                            <div onclick="toggleModal('tallit-calc-modal')" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-purple-100 col-span-2 bg-purple-50/50">
                                <div class="w-11 h-11 rounded-lg bg-oz-primary text-white flex items-center justify-center shrink-0"><svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-6h6"/></svg></div>
                                <div>
                                    <div class="font-black text-xs text-oz-primary">מחשבון התאמת גודל טלית</div>
                                    <div class="text-[11px] text-slate-600 font-medium">לחץ כאן לחישוב המידה המדויקת לפי הגובה שלך</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Category 4: Holy Books & Siddurim -->
                    <div class="relative group/menu py-4 sm:py-5">
                        <a href="#shop" onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-purple-50/60">
                            <span>ספרי קודש וסידורים</span>
                            <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 text-slate-400 group-hover/menu:text-oz-primary group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                        </a>
                        <div class="mega-menu absolute top-full right-0 w-[450px] bg-white rounded-2xl p-4 shadow-xl border border-purple-100/90 grid grid-cols-2 gap-2.5 z-50 text-right dir-rtl">
                            <div onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">סידורים בכריכת עור</div>
                                    <div class="text-[11px] text-slate-500 font-medium">עדות המזרח / אשכנז / ספרד</div>
                                </div>
                            </div>

                            <div onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">חומשים ותהילים</div>
                                    <div class="text-[11px] text-slate-500 font-medium">כריכות יוקרתיות עם עיטורי זהב</div>
                                </div>
                            </div>

                            <div onclick="filterCategory('books'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100 col-span-2">
                                <div class="w-11 h-11 rounded-lg bg-purple-100 text-oz-primary flex items-center justify-center shrink-0"><svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"/></svg></div>
                                <div>
                                    <div class="font-black text-xs text-slate-800">ברכונים והקדשות אישיות</div>
                                    <div class="text-[11px] text-slate-500 font-medium">חריטת שמות ממוחשבת לשמחות ואירועים</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Category 5: Gifts & Judaica -->
                    <div class="relative group/menu py-4 sm:py-5">
                        <a href="#shop" onclick="filterCategory('gifts'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="hover:text-oz-primary transition-colors flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-purple-50/60">
                            <span>מתנות ויודאיקה</span>
                            <svg class="w-3.5 h-3.5 inline stroke-current stroke-2 text-slate-400 group-hover/menu:text-oz-primary group-hover/menu:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                        </a>
                        <div class="mega-menu absolute top-full left-0 lg:right-auto w-[450px] bg-white rounded-2xl p-4 shadow-xl border border-purple-100/90 grid grid-cols-2 gap-2.5 z-50 text-right dir-rtl">
                            <div onclick="filterCategory('gifts'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center gap-3 transition-colors border border-transparent hover:border-purple-100">
                                <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=120&q=80" class="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0" />
                                <div>
                                    <div class="font-black text-xs text-slate-800">מארזי לבר מצווה וחתנים</div>
                                    <div class="text-[11px] text-slate-500 font-medium">סטי יודאיקה ותשמישי קדושה</div>
                                </div>
                            </div>

                            <div onclick="toggleModal('gift-quiz-modal')" class="p-2.5 rounded-xl hover:bg-amber-50 cursor-pointer flex items-center gap-3 transition-colors border border-amber-200 bg-amber-50/40">
                                <div class="w-11 h-11 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0"><svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0v13.875"/></svg></div>
                                <div>
                                    <div class="font-black text-xs text-amber-900">שאלון התאמת מתנה חכם</div>
                                    <div class="text-[11px] text-amber-700 font-medium">מצא מתנה לפי אירוע ותקציב</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
'@

# Replace nav block in clean_nav.html
$cleanNavContent = $cleanNavContent -replace '<!-- NAVIGATION LINKS WITH SLEEK MEGA MENU DROPDOWNS FOR ALL CATEGORIES -->[\s\S]*?<!-- HEADER ACTIONS & ICONS', "$newNavBlock`n`n                <!-- HEADER ACTIONS & ICONS"
[System.IO.File]::WriteAllText($cleanNavPath, $cleanNavContent, $utf8NoBOM)

# 2. Update shop_layout.html and index.html to remove "שירות בדיקת תפילין ומזוזות במקום"
$shopLayoutPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\shop_layout.html"
if (Test-Path $shopLayoutPath) {
    $sl = Get-Content -Path $shopLayoutPath -Raw -Encoding UTF8
    $sl = $sl -replace 'שירות בדיקת תפילין ומזוזות במקום', 'שירות בדיקת תפילין ומזוזות מוסמכת'
    [System.IO.File]::WriteAllText($shopLayoutPath, $sl, $utf8NoBOM)
}

$indexPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
if (Test-Path $indexPath) {
    $idx = Get-Content -Path $indexPath -Raw -Encoding UTF8
    $idx = $idx -replace 'בדיקה מוסמכת במקום', 'בדיקה מוסמכת ומחשב'
    $idx = $idx -replace 'שירות בדיקת תפילין ומזוזות במקום', 'שירות בדיקת תפילין ומזוזות מוסמכת'
    [System.IO.File]::WriteAllText($indexPath, $idx, $utf8NoBOM)
}

Write-Host "Nav header updated successfully with 5 centered categories and removed 'במקום'!"
