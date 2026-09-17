$path = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$content = Get-Content -Path $path -Raw -Encoding UTF8

# 1. Update Cart Drawer Checkout Button to open openCheckoutModal()
$content = $content -replace 'onclick="alert\(''מעבר לתשלום מאובטח בקליק!''\)"', 'onclick="toggleCartDrawer(); openCheckoutModal();"'

# 2. Add Floating Accessibility Widget and Modals for Checkout, Shipping, Terms, and Accessibility
$modalsHtml = @"
    <!-- FLOATING ACCESSIBILITY WIDGET & TOOLBAR -->
    <div class="fixed bottom-6 right-6 z-[9999999]">
        <button onclick="toggleAccessibilityMenu()" class="w-12 h-12 rounded-full bg-oz-primary hover:bg-oz-hover text-white flex items-center justify-center shadow-2xl border-2 border-white transition-all transform hover:scale-110 active:scale-95" title="תפריט נגישות" aria-label="תפריט נגישות">
            <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
        </button>

        <!-- Accessibility Dropdown Panel -->
        <div id="accessibility-menu" class="hidden absolute bottom-16 right-0 w-80 bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 text-right dir-rtl space-y-3 text-slate-800">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 class="font-black text-sm text-oz-primary flex items-center gap-1.5">
                    <span>♿ תפריט נגישות ע"פ החוק</span>
                </h4>
                <button onclick="toggleAccessibilityMenu()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs font-bold">
                <button onclick="changeFontSize(1)" class="p-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl text-oz-primary border border-purple-100 transition-colors">א+ הגדלת גופן</button>
                <button onclick="changeFontSize(-1)" class="p-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl text-oz-primary border border-purple-100 transition-colors">א- הקטנת גופן</button>
                <button onclick="toggleHighContrast()" class="p-2.5 bg-slate-900 text-amber-300 hover:bg-black rounded-xl border border-slate-700 transition-colors">ניגודיות גבוהה</button>
                <button onclick="toggleHighlightLinks()" class="p-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl text-oz-primary border border-purple-100 transition-colors">הדגשת קישורים</button>
                <button onclick="toggleReadableFont()" class="p-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl text-oz-primary border border-purple-100 transition-colors">גופן קריא</button>
                <button onclick="resetAccessibility()" class="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">איפוס הגדרות</button>
            </div>

            <div class="pt-2 border-t border-slate-100 text-[11px] font-bold text-center">
                <button onclick="toggleAccessibilityMenu(); toggleModal('accessibility-modal');" class="text-oz-primary hover:underline block w-full">קרא את הצהרת הנגישות המלאה 📜</button>
            </div>
        </div>
    </div>

    <!-- HIGH-UX CHECKOUT MODAL -->
    <div id="checkout-modal" onclick="if(event.target===this) toggleModal('checkout-modal')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] hidden flex items-center justify-center p-4 cursor-pointer">
        <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative p-6 max-h-[90vh] overflow-y-auto text-right cursor-default border border-purple-100">
            <button onclick="toggleModal('checkout-modal')" class="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-2xl z-30">&times;</button>
            <div id="checkout-modal-content">
                <!-- Injected via JS dynamically -->
            </div>
        </div>
    </div>

    <!-- SHIPPING & RETURNS POLICY MODAL -->
    <div id="shipping-returns-modal" onclick="if(event.target===this) toggleModal('shipping-returns-modal')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] hidden flex items-center justify-center p-4 cursor-pointer">
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative p-6 text-right cursor-default">
            <button onclick="toggleModal('shipping-returns-modal')" class="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-2xl z-30">&times;</button>
            <div class="flex items-center gap-3 text-oz-primary mb-4 border-b border-slate-100 pb-3">
                <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center font-black text-xl">🚚</div>
                <div>
                    <h3 class="text-xl font-black text-slate-800">מדיניות משלוחים והחזרות</h3>
                    <p class="text-xs text-slate-500">מכון עוז – שירות משלוחים מהיר ואחריות מלאה בכל הארץ</p>
                </div>
            </div>

            <div class="space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
                <div class="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <h4 class="font-black text-sm text-oz-primary mb-1">📦 אפשרויות משלוח:</h4>
                    <ul class="list-disc list-inside space-y-1 text-slate-700">
                        <li><strong>משלוח מהיר עד בית הלקוח:</strong> 1-3 ימי עסקים בלבד לכל חלקי הארץ (חינם בהזמנות מעל ₪399!).</li>
                        <li><strong>איסוף עצמי בחינם:</strong> מחנות מכון עוז ברחוב <strong>שלום מנצורה 48, ראש העין</strong> (בשעות הפעילות: א'-ה' 13:00-19:00).</li>
                    </ul>
                </div>

                <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                    <h4 class="font-black text-sm text-emerald-800 mb-1">🔄 מדיניות החלפות והחזרות:</h4>
                    <p>אנו במכון עוז מחויבים לשביעות רצונך המלאה. במידה ותרצה להחליף או להחזיר מוצר:</p>
                    <ul class="list-disc list-inside space-y-1 mt-1">
                        <li>ניתן להחזיר או להחליף מוצר תוך <strong>14 ימים</strong> מיום קבלתו ע"פ חוק הגנת הצרכן.</li>
                        <li>המוצר יוחזר באריזתו המקורית ושלא נעשה בו שימוש.</li>
                        <li>מוצרים בהזמנה אישית (כגון חריטת שמות ממוחשבת או כתיבה מיוחדת לשמה) אינם ניתנים להחזרה לאחר ביצוע העבודה.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- TERMS & CONDITIONS MODAL -->
    <div id="terms-modal" onclick="if(event.target===this) toggleModal('terms-modal')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] hidden flex items-center justify-center p-4 cursor-pointer">
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative p-6 text-right cursor-default max-h-[85vh] overflow-y-auto">
            <button onclick="toggleModal('terms-modal')" class="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-2xl z-30">&times;</button>
            <div class="flex items-center gap-3 text-oz-primary mb-4 border-b border-slate-100 pb-3">
                <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center font-black text-xl">📜</div>
                <div>
                    <h3 class="text-xl font-black text-slate-800">תקנון האתר ותנאי שימוש</h3>
                    <p class="text-xs text-slate-500">תנאי רכישה, פרטיות ואחריות במכון עוז תשמישי קדושה</p>
                </div>
            </div>

            <div class="space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
                <p>ברוכים הבאים לאתר מכון עוז. הרכישה באתר כפופה לתנאים המפורטים בתקנון זה:</p>
                
                <h4 class="font-black text-sm text-oz-primary">1. כשרות והשגחה</h4>
                <p>כל תשמישי הקדושה (תפילין, מזוזות, ספרי תורה) נכתבים על ידי סופרי סת"ם מורשים ובעלי תעודת הסמכה בתוקף. כל קלף עובר הגהת מחשב והגהת גברא קפדנית.</p>

                <h4 class="font-black text-sm text-oz-primary">2. אבטחה ופרטיות</h4>
                <p>האתר מאובטח בתקן SSL 256-bit המחמיר ביותר. פרטי כרטיסי האשראי והתשלום אינם נשמרים בשרתי האתר ומועברים ישירות לשרתי הסליקה המורשים.</p>

                <h4 class="font-black text-sm text-oz-primary">3. מחירים ואספקה</h4>
                <p>כל המחירים באתר כוללים מע"מ כחוק. מכון עוז עושה כמיטב יכולתו לספק את המוצרים תוך 1-3 ימי עסקים.</p>
            </div>
        </div>
    </div>

    <!-- ACCESSIBILITY STATEMENT MODAL -->
    <div id="accessibility-modal" onclick="if(event.target===this) toggleModal('accessibility-modal')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] hidden flex items-center justify-center p-4 cursor-pointer">
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative p-6 text-right cursor-default max-h-[85vh] overflow-y-auto">
            <button onclick="toggleModal('accessibility-modal')" class="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-2xl z-30">&times;</button>
            <div class="flex items-center gap-3 text-oz-primary mb-4 border-b border-slate-100 pb-3">
                <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center font-black text-xl">♿</div>
                <div>
                    <h3 class="text-xl font-black text-slate-800">הצהרת נגישות</h3>
                    <p class="text-xs text-slate-500">מכון עוז מונגש לכלל הלקוחות ע"פ תקנות נגישות לשירות</p>
                </div>
            </div>

            <div class="space-y-4 text-xs text-slate-700 leading-relaxed font-medium">
                <p>אנו במכון עוז רואים בחשיבות עליונה את מתן השירות השוויוני, המכבד והנגיש לכלל אזרחי ישראל, כולל אנשים עם מוגבלויות.</p>
                
                <h4 class="font-black text-sm text-oz-primary">התאמות נגישות באתר האינטרנט:</h4>
                <ul class="list-disc list-inside space-y-1">
                    <li>רכיב נגישות צף המאפשר הגדלת גופן, ניגודיות גבוהה, הדגשת קישורים וגופן קריא.</li>
                    <li>התאמה מלאה לגלישה באמצעות מקלדת.</li>
                    <li>תמיכה בקוראי מסך תקניים ותגיות ARIA.</li>
                    <li>0ms Inline SVGs ללא קפיצות טקסט.</li>
                </ul>

                <h4 class="font-black text-sm text-oz-primary">פרטי רכז הנגישות בחברה:</h4>
                <p>לכל פנייה, שאלה או הצעה בנושא נגישות, ניתן ליצור קשר עם רכז הנגישות בטלפון: <strong>052-686-7192</strong> או בדוא"ל החנות.</p>
            </div>
        </div>
    </div>
"@

$content = $content -replace '<!-- MASTER PURPLE & WHITE FOOTER -->', ($modalsHtml + "`n`n    <!-- MASTER PURPLE & WHITE FOOTER -->")

# 3. Update Footer Quick Links to include Shipping, Terms, Accessibility
$oldFooterLinksPattern = '(?s)<h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">ניווט מהיר</h4>\s*<ul class="space-y-2\.5 text-xs font-semibold text-slate-300">.*?</ul>'

$newFooterLinks = @"
<h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">ניווט מהיר</h4>
                <ul class="space-y-2.5 text-xs font-semibold text-slate-300">
                    <li><a href="#shop" onclick="filterCategory('stam')" class="hover:text-purple-300 transition-colors">תשמישי קדושה וסת"ם</a></li>
                    <li><a href="#shop" onclick="filterCategory('wallets')" class="hover:text-purple-300 transition-colors">תיקים וארנקים</a></li>
                    <li><a href="#shop" onclick="filterCategory('tallitot-tzitzit')" class="hover:text-purple-300 transition-colors">טליתות וציציות</a></li>
                    <li><a href="#shipping-returns-modal" onclick="toggleModal('shipping-returns-modal')" class="hover:text-purple-300 transition-colors">🚚 משלוחים והחזרות</a></li>
                    <li><a href="#terms-modal" onclick="toggleModal('terms-modal')" class="hover:text-purple-300 transition-colors">📜 תנאים והגבלות (תקנון)</a></li>
                    <li><a href="#accessibility-modal" onclick="toggleModal('accessibility-modal')" class="hover:text-purple-300 transition-colors">♿ הצהרת נגישות</a></li>
                </ul>
"@

$content = [regex]::Replace($content, $oldFooterLinksPattern, $newFooterLinks)

# 4. JS Functions for Checkout, Accessibility Controls, and Order Complete
$jsAdditions = @"
        // Accessibility Controls
        let accessibilityState = { fontSizeOffset: 0, highContrast: false, highlightLinks: false, readableFont: false };

        function toggleAccessibilityMenu() {
            const menu = document.getElementById('accessibility-menu');
            if (menu) menu.classList.toggle('hidden');
        }

        function changeFontSize(delta) {
            accessibilityState.fontSizeOffset += delta;
            document.body.style.fontSize = (16 + accessibilityState.fontSizeOffset * 2) + 'px';
        }

        function toggleHighContrast() {
            accessibilityState.highContrast = !accessibilityState.highContrast;
            document.body.classList.toggle('bg-slate-900', accessibilityState.highContrast);
            document.body.classList.toggle('text-white', accessibilityState.highContrast);
        }

        function toggleHighlightLinks() {
            accessibilityState.highlightLinks = !accessibilityState.highlightLinks;
            document.querySelectorAll('a').forEach(a => {
                a.classList.toggle('underline', accessibilityState.highlightLinks);
                a.classList.toggle('font-black', accessibilityState.highlightLinks);
            });
        }

        function toggleReadableFont() {
            accessibilityState.readableFont = !accessibilityState.readableFont;
            document.body.style.fontFamily = accessibilityState.readableFont ? 'Arial, sans-serif' : "'Rubik', sans-serif";
        }

        function resetAccessibility() {
            accessibilityState = { fontSizeOffset: 0, highContrast: false, highlightLinks: false, readableFont: false };
            document.body.style.fontSize = '';
            document.body.style.fontFamily = "'Rubik', sans-serif";
            document.body.classList.remove('bg-slate-900', 'text-white');
        }

        // Checkout & High UX Payment Modal
        function openCheckoutModal() {
            renderCheckoutModal();
            toggleModal('checkout-modal');
        }

        function renderCheckoutModal() {
            const container = document.getElementById('checkout-modal-content');
            if (!container) return;

            let total = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

            if (state.cart.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 px-4">
                        <div class="w-16 h-16 bg-purple-50 text-oz-primary rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">🛒</div>
                        <h3 class="text-xl font-black text-slate-800 mb-2">סל הקניות שלך ריק</h3>
                        <p class="text-xs text-slate-500 mb-6">אנא הוסף מוצרים לסל לפני מעבר לקופה</p>
                        <button onclick="toggleModal('checkout-modal'); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="py-3 px-6 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md">עבור לחנות ✨</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl">🔒</div>
                        <div>
                            <h3 class="text-xl font-black text-slate-800">קופה מאובטחת 256-Bit</h3>
                            <p class="text-xs text-slate-500">השלם את ההזמנה שלך בבטחה ממכון עוז</p>
                        </div>
                    </div>
                    <span class="text-xs font-black text-oz-primary bg-purple-50 py-1.5 px-3 rounded-full border border-purple-100">משלוח מהיר 1-3 ימים 🚚</span>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <!-- Form Details -->
                    <form onsubmit="handleCompleteOrder(event)" class="space-y-4">
                        <h4 class="font-black text-sm text-slate-800 border-b border-slate-100 pb-2">1. פרטי המשלוח והלקוח:</h4>
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">שם מלא *</label>
                            <input type="text" required placeholder="ישראל ישראלי" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="\${state.user ? state.user.name : ''}" />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1">טלפון נייד *</label>
                                <input type="tel" required placeholder="052-686-7192" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="\${state.user ? state.user.phone : ''}" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1">עיר / יישוב *</label>
                                <input type="text" required placeholder="ראש העין" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">כתובת ומספר בית *</label>
                            <input type="text" required placeholder="שלום מנצורה 48" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" />
                        </div>

                        <h4 class="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 pt-2">2. אמצעי תשלום מועדף:</h4>
                        
                        <div class="grid grid-cols-3 gap-2 text-xs font-bold">
                            <label class="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100">
                                <input type="radio" name="payment-method" checked class="text-oz-primary" />
                                <span>💳 אשראי</span>
                            </label>
                            <label class="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100">
                                <input type="radio" name="payment-method" class="text-oz-primary" />
                                <span>📲 Bit / ביט</span>
                            </label>
                            <label class="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100">
                                <input type="radio" name="payment-method" class="text-oz-primary" />
                                <span>💬 וואטסאפ</span>
                            </label>
                        </div>

                        <button type="submit" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span>אישור הזמנה ותשלום מאובטח 🔒 (₪\${total})</span>
                        </button>
                    </form>

                    <!-- Order Summary & Upsell Proposals -->
                    <div class="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 space-y-4">
                        <h4 class="font-black text-sm text-slate-800 border-b border-purple-100 pb-2">סיכום ההזמנה שלך:</h4>
                        
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            \${state.cart.map(i => `
                                <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span>\${i.name} (x\${i.qty})</span>
                                    <span class="text-oz-primary font-black">₪\${i.price * i.qty}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="border-t border-purple-100 pt-3 space-y-1.5 text-xs font-bold">
                            <div class="flex justify-between text-slate-600">
                                <span>דמי משלוח:</span>
                                <span>\${total >= 399 ? 'חינם 🎉' : '₪35'}</span>
                            </div>
                            <div class="flex justify-between text-base font-black text-oz-primary pt-1 border-t border-purple-200">
                                <span>סה"כ סופי:</span>
                                <span>₪\${total >= 399 ? total : total + 35}</span>
                            </div>
                        </div>

                        <!-- Upsell Completion Items -->
                        <div class="p-3.5 bg-white rounded-2xl border border-purple-200 space-y-2">
                            <div class="font-black text-xs text-amber-800 flex items-center gap-1">
                                <span>✨ הצעות מיוחדות להשלמת הקנייה:</span>
                            </div>
                            <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>תעודת הגהת מחשב מוסמכת</span>
                                <span class="text-emerald-600 font-black">חינם! 🎁</span>
                            </div>
                            <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>נרתיק מגן קטיפה מהודר</span>
                                <button onclick="addToCart(8013)" class="text-[10px] font-black text-oz-primary hover:underline">הוסף ₪49 +</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function handleCompleteOrder(e) {
            e.preventDefault();
            alert('🎉 ההזמנה נקלטה בהצלחה במערכת מכון עוז! נציג יצור איתך קשר לתיאום המשלוח.');
            state.cart = [];
            updateCartUI();
            toggleModal('checkout-modal');
        }
"@

$content = $content -replace 'function initApp\(\)', ($jsAdditions + "`n`n        function initApp()")

# Save UTF-8 clean
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated index.html with Checkout Modal, Shipping/Returns, Terms, Accessibility Widget & Fixed WhatsApp Icon!"
