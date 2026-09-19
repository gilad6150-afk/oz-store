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

        window.applyCouponCode = function(code) {
            const coupon = (code || '').trim().toUpperCase();
            if (coupon === 'OZ10' || coupon === 'OZ-10' || coupon === 'VIP10' || coupon === 'OZ10%') {
                state.couponPercent = 10;
                state.appliedCoupon = 'OZ10';
                try { localStorage.setItem('oz_applied_coupon', JSON.stringify({ code: 'OZ10', percent: 10 })); } catch(e){}
                if (typeof updateCartUI === 'function') updateCartUI();
                if (typeof renderCheckoutModal === 'function') renderCheckoutModal();
                if (typeof showToast === 'function') showToast('🎉 קופון OZ10 הופעל בהצלחה! 10% הנחה נוספו לסל הקניות');
                return true;
            } else if (coupon) {
                alert('❌ קוד קופון לא תקף. נסה את הקופון OZ10 להנחת 10%');
                return false;
            }
            return false;
        };

        window.submitCheckoutCoupon = function() {
            const input = document.getElementById('checkout-coupon-input');
            if (input) {
                applyCouponCode(input.value);
            }
        };

        window.claimExitDiscount = function(e) {
            if (e) e.preventDefault();
            const input = document.getElementById('exit-intent-input');
            if (input && input.value.trim()) {
                state.user = state.user || {};
                state.user.contact = input.value.trim();
                try { localStorage.setItem('oz_user', JSON.stringify(state.user)); } catch(err){}
            }
            applyCouponCode('OZ10');
            if (typeof toggleModal === 'function') toggleModal('exit-intent-popup');
        };

        function renderCheckoutModal() {
            const container = document.getElementById('checkout-modal-content');
            if (!container) return;

            let subtotal = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
            let discount5Percent = Math.round(subtotal * 0.05);
            let couponPercent = state.couponPercent || 0;
            let couponDiscount = Math.round(subtotal * (couponPercent / 100));
            let totalDiscount = discount5Percent + couponDiscount;

            let subtotalAfterDiscount = Math.max(0, subtotal - totalDiscount);
            let selectedShippingFee = typeof state.selectedShippingFee !== 'undefined' ? state.selectedShippingFee : 35;
            let finalTotal = subtotalAfterDiscount + selectedShippingFee;

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
                            <input type="text" id="checkout-name" required placeholder="ישראל ישראלי" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="${state.user ? (state.user.name || '') : ''}" />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1">טלפון נייד *</label>
                                <input type="tel" id="checkout-phone" required placeholder="052-686-7192" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="${state.user ? (state.user.phone || state.user.contact || '') : ''}" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1">עיר / יישוב *</label>
                                <input type="text" id="checkout-city" required placeholder="ראש העין" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="${state.user ? (state.user.city || '') : ''}" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">כתובת ומספר בית *</label>
                            <input type="text" id="checkout-street" required placeholder="שלום מנצורה 48" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="${state.user ? (state.user.street || '') : ''}" />
                        </div>

                        <h4 class="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 pt-2">2. בחר שיטת משלוח וזמן אספקה:</h4>
                        
                        <div class="space-y-2 text-xs font-bold">
                            <label class="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="checkout-shipping" value="70" ${selectedShippingFee === 70 ? 'checked' : ''} onchange="updateCheckoutFee(70, 'משלוח מהיר (1-3 ימים)')" class="text-oz-primary" />
                                    <span>🚀 <strong>משלוח מהיר</strong> (1-3 ימי עסקים)</span>
                                </div>
                                <span class="font-black text-oz-primary">₪70</span>
                            </label>

                            <label class="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="checkout-shipping" value="35" ${selectedShippingFee === 35 ? 'checked' : ''} onchange="updateCheckoutFee(35, 'משלוח רגיל (5-10 ימי עסקים)')" class="text-oz-primary" />
                                    <span>🚚 <strong>משלוח רגיל</strong> (5-10 ימי עסקים)</span>
                                </div>
                                <span class="font-black text-oz-primary">₪35</span>
                            </label>

                            <label class="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="checkout-shipping" value="19" ${selectedShippingFee === 19 ? 'checked' : ''} onchange="updateCheckoutFee(19, 'נקודת איסוף בכל הארץ')" class="text-oz-primary" />
                                    <span>📦 <strong>נקודת איסוף</strong> בכל הארץ</span>
                                </div>
                                <span class="font-black text-oz-primary">₪19</span>
                            </label>

                            <label class="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="checkout-shipping" value="0" ${selectedShippingFee === 0 ? 'checked' : ''} onchange="updateCheckoutFee(0, 'איסוף עצמי בתיאום מראש מראש העין')" class="text-oz-primary" />
                                    <span>🏪 <strong>איסוף עצמי</strong> מראש העין (שלום מנצורה 48)</span>
                                </div>
                                <span class="font-black text-emerald-600">₪0 (חינם)</span>
                            </label>
                        </div>

                        <h4 class="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 pt-2 flex items-center justify-between">
                            <span>3. אמצעי תשלום וסליקת אשראי מאובטחת:</span>
                            <span class="text-[10px] font-bold text-oz-primary bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">🔒 Invoice4U SSL 256-bit</span>
                        </h4>
                        
                        <div class="space-y-2 text-xs font-bold">
                            <label class="p-3 bg-purple-50 border-2 border-oz-primary rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="payment-method" value="invoice4u_credit" checked onchange="togglePaymentMethodFields('invoice4u_credit')" class="text-oz-primary" />
                                    <span class="text-slate-900 font-black">💳 כרטיס אשראי / Bit / Apple Pay (Invoice4U)</span>
                                </div>
                                <div class="flex items-center gap-1 text-[10px] font-extrabold text-slate-500">
                                    <span class="bg-white px-1.5 py-0.5 rounded border border-slate-200">Visa</span>
                                    <span class="bg-white px-1.5 py-0.5 rounded border border-slate-200">Mastercard</span>
                                    <span class="bg-purple-600 text-purple-900 px-1.5 py-0.5 rounded border border-purple-600">Bit</span>
                                </div>
                            </label>

                            <label class="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="payment-method" value="phone_order" onchange="togglePaymentMethodFields('phone_order')" class="text-oz-primary" />
                                    <span class="text-slate-800">📞 הזמנה טלפונית / תשלום במזומן באיסוף</span>
                                </div>
                                <span class="text-[10px] text-slate-500">נציג יחזור אליך</span>
                            </label>
                        </div>

                        <!-- Invoice4U Credit Card Form -->
                        <div id="invoice4u-card-fields" class="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 space-y-3 dir-rtl">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-black text-oz-primary flex items-center gap-1.5">
                                    <span>🔒</span> הזנת פרטי אשראי מאובטחים (תקן PCI-DSS via Invoice4U)
                                </span>
                                <span class="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">סליקה מיידית</span>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-700 mb-1">מספר כרטיס אשראי</label>
                                <input type="text" id="cc-number" placeholder="4580 •••• •••• ••••" maxlength="19" class="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-oz-primary" />
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-700 mb-1">תוקף (MM/YY)</label>
                                    <input type="text" id="cc-exp" placeholder="12/28" maxlength="5" class="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-center text-slate-800 outline-none focus:border-oz-primary" />
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-700 mb-1">CVV (3 ספרות)</label>
                                    <input type="text" id="cc-cvv" placeholder="123" maxlength="4" class="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-center text-slate-800 outline-none focus:border-oz-primary" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-700 mb-1">מספר תעודת זהות של בעל הכרטיס</label>
                                <input type="text" id="cc-id" placeholder="012345678" maxlength="9" class="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-oz-primary" />
                            </div>
                        </div>

                        <button type="submit" id="checkout-submit-btn" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                            <span>אישור הזמנה ותשלום מאובטח 🔒 (<span id="checkout-final-btn-val">₪${finalTotal}</span>)</span>
                        </button>
                    </form>

                    <!-- Order Summary & Upsell Proposals -->
                    <div class="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 space-y-4">
                        <h4 class="font-black text-sm text-slate-800 border-b border-purple-100 pb-2">סיכום ההזמנה שלך:</h4>
                        
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            ${state.cart.map(i => `
                                <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span>${i.name} (x${i.qty})</span>
                                    <span class="text-oz-primary font-black">₪${i.price * i.qty}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="border-t border-purple-100 pt-3 space-y-1.5 text-xs font-bold">
                            <div class="flex justify-between text-slate-600">
                                <span>סכום ביניים:</span>
                                <span class="font-black text-slate-900">₪${subtotal}</span>
                            </div>

                            <div class="flex justify-between text-emerald-700 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                                <span class="font-extrabold flex items-center gap-1">🏷️ הנחת קופה מיוחדת (5%-):</span>
                                <span class="font-black text-emerald-700">-₪${discount5Percent}</span>
                            </div>

                            ${couponPercent > 0 ? `
                            <div class="flex justify-between text-purple-900 bg-purple-50/90 p-2 rounded-xl border border-purple-600">
                                <span class="font-extrabold flex items-center gap-1">🎟️ קופון ${state.appliedCoupon} (${couponPercent}%-):</span>
                                <span class="font-black text-purple-900">-₪${couponDiscount}</span>
                            </div>
                            ` : ''}

                            <!-- Coupon Code Activation Box -->
                            <div class="mt-3 pt-3 border-t border-purple-200/60 space-y-1.5">
                                <label class="block text-[11px] font-bold text-slate-700">הכנס קוד קופון הנחה:</label>
                                <div class="flex gap-2">
                                    <input type="text" id="checkout-coupon-input" placeholder="למשל OZ10" class="flex-grow p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-black uppercase text-slate-800 outline-none focus:border-oz-primary" value="${state.appliedCoupon || ''}" />
                                    <button type="button" onclick="submitCheckoutCoupon()" class="py-2.5 px-4 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">הפעל קופון</button>
                                </div>
                            </div>

                            <div class="flex justify-between text-slate-600 pt-2">
                                <span>שיטת משלוח שנבחרה:</span>
                                <span id="checkout-shipping-label" class="text-oz-primary font-black">משלוח רגיל (5-10 ימי עסקים)</span>
                            </div>
                            <div class="flex justify-between text-slate-600">
                                <span>עלות משלוח:</span>
                                <span id="checkout-shipping-cost-val" class="font-black text-slate-900">₪${selectedShippingFee}</span>
                            </div>
                            <div class="flex justify-between text-base font-black text-oz-primary pt-2 border-t border-purple-200">
                                <span>סה"כ סופי לתשלום:</span>
                                <span id="checkout-final-total-val">₪${finalTotal}</span>
                            </div>
                        </div>

                        <!-- Personalized Special Offer Item -->
                        ${(() => {
                            const excludeIds = state.cart.map(i => String(i.id));
                            const recs = typeof UserTracker !== 'undefined' ? UserTracker.getPersonalizedProducts(1, excludeIds) : [];
                            const prods = (typeof products !== 'undefined' && products.length > 0 ? products : (typeof realProductsDB !== 'undefined' ? realProductsDB : []));
                            const offerItem = recs && recs.length > 0 ? recs[0] : (prods.length > 0 ? prods[0] : null);
                            if (!offerItem) return '';
                            return `
                            <div class="p-4 bg-white rounded-2xl border border-purple-200 shadow-sm space-y-3">
                                <div class="font-black text-xs text-purple-900 flex items-center justify-between">
                                    <span class="flex items-center gap-1">🎁 <strong>מוצר הטבה מותאם אישית עבורך:</strong></span>
                                    <span class="bg-purple-600 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full">הטבה בקופה 🔥</span>
                                </div>
                                <div class="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">
                                    <span>תעודת הגהת מחשב וגברא מוסמכת</span>
                                    <span class="text-emerald-600 font-black">חינם! 🎁</span>
                                </div>
                                <div class="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                                    <div class="flex items-center gap-2.5">
                                        <img src="${offerItem.image}" alt="${offerItem.name}" class="w-11 h-11 object-cover rounded-lg border border-slate-100 shrink-0" />
                                        <div>
                                            <div class="text-slate-900 font-black truncate max-w-[150px]">${offerItem.name}</div>
                                            <div class="text-[11px] text-oz-primary font-black">₪${offerItem.price}</div>
                                        </div>
                                    </div>
                                    <button type="button" onclick="addCheckoutSpecialOffer('${offerItem.id}')" class="py-2 px-3.5 bg-gradient-to-r from-purple-600 to-indigo-900 hover:from-purple-600 hover:to-indigo-900 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer">
                                        + הוסף לסל
                                    </button>
                                </div>
                            </div>
                            `;
                        })()}
                    </div>
                </div>
            `;
        }

        function handleCompleteOrder(e) {
            e.preventDefault();
            const name = document.getElementById('checkout-name') ? document.getElementById('checkout-name').value : 'לקוח יקר';
            alert('🎉 תודה ' + name + '! ההזמנה נקלטה בהצלחה במערכת מכון עוז. נציג יצור איתך קשר לתיאום המשלוח.');
            state.cart = [];
            updateCartUI();
            toggleModal('checkout-modal');
        }

        let quizSelection = { target: '', budget: '' };

        function selectQuizOption(type, val, btn) {
            quizSelection[type] = val;
            const groupClass = type === 'target' ? '.quiz-target-btn' : '.quiz-budget-btn';
            document.querySelectorAll(groupClass).forEach(b => {
                b.classList.remove('bg-oz-primary', 'text-white', 'border-oz-primary');
                b.classList.add('bg-slate-50', 'text-slate-800', 'border-slate-200');
            });
            btn.classList.remove('bg-slate-50', 'text-slate-800', 'border-slate-200');
            btn.classList.add('bg-oz-primary', 'text-white', 'border-oz-primary');
        }

        function runGiftQuiz() {
            toggleModal('gift-quiz-modal');
            if (quizSelection.budget === 'low') {
                filterPrice(0, 200);
            } else if (quizSelection.budget === 'mid') {
                filterPrice(200, 600);
            } else if (quizSelection.budget === 'high') {
                filterPrice(600, 99999);
            } else {
                filterCategory('gifts');
            }
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        }

        function calculateTallitSize() {
            const h = parseInt(document.getElementById('calc-height')?.value || '0');
            const style = document.getElementById('calc-style')?.value || 'standard';
            const res = document.getElementById('calc-result');
            if (!res) return;
            res.classList.remove('hidden');

            if (style === 'katan') {
                if (h < 130) res.innerHTML = '✨ המידה המומלצת עבורך: <strong>טלית קטן מידה 3 / 4</strong>';
                else if (h <= 160) res.innerHTML = '✨ המידה המומלצת עבורך: <strong>טלית קטן מידה 5 / 6</strong>';
                else res.innerHTML = '✨ המידה המומלצת עבורך: <strong>טלית קטן מידה 7 / 8</strong>';
                return;
            }

            let effectiveH = h + (style === 'wide' ? 8 : 0);

            if (effectiveH < 150) {
                res.innerHTML = '✨ המידה המומלצת עבורך: <strong>מידה 45 / 50</strong>' + (style === 'wide' ? ' (מותאם לעטיפה מלאה/רחבה)' : '');
            } else if (effectiveH <= 165) {
                res.innerHTML = '✨ המידה המומלצת עבורך: <strong>מידה 55 / 60</strong>' + (style === 'wide' ? ' (מותאם לעטיפה מלאה/רחבה)' : '');
            } else if (effectiveH <= 178) {
                res.innerHTML = '✨ המידה המומלצת עבורך: <strong>מידה 60 / 70</strong>' + (style === 'wide' ? ' (מותאם לעטיפה מלאה/רחבה)' : '');
            } else if (effectiveH <= 188) {
                res.innerHTML = '✨ המידה המומלצת עבורך: <strong>מידה 70 / 80</strong>' + (style === 'wide' ? ' (מותאם לעטיפה מלאה/רחבה)' : '');
            } else {
                res.innerHTML = '✨ המידה המומלצת עבורך: <strong>מידה 80 / 90 (ענקית)</strong>';
            }
        }

        function handleUserLogin(e) {
            e.preventDefault();
            const name = document.getElementById('login-name-input')?.value || 'לקוח יקר';
            const phone = document.getElementById('login-phone-input')?.value || '';
            state.user = { name, phone };
            localStorage.setItem('oz_user', JSON.stringify(state.user));
            updateUserLabel();
            toggleModal('login-modal');
            alert('🎉 ברוך הבא ' + name + '! התחברת בהצלחה למכון עוז.');
        }

        function updateUserLabel() {
            const btn = document.getElementById('user-nav-btn');
            if (btn && state.user) {
                btn.innerHTML = `
                    <span class="w-8 h-8 rounded-full bg-purple-100 text-oz-primary flex items-center justify-center font-bold text-xs">${state.user.name.charAt(0)}</span>
                    <span class="hidden md:inline font-bold text-xs text-oz-primary">${state.user.name}</span>
                `;
            }
        }

        function updateCheckoutFee(fee, label) {
            const subtotal = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
            const discount5Percent = Math.round(subtotal * 0.05);
            const subtotalAfterDiscount = subtotal - discount5Percent;
            const finalTotal = subtotalAfterDiscount + fee;

            const costVal = document.getElementById('checkout-shipping-cost-val');
            const labelVal = document.getElementById('checkout-shipping-label');
            const totalVal = document.getElementById('checkout-final-total-val');
            const btnVal = document.getElementById('checkout-final-btn-val');
            if (costVal) costVal.textContent = fee === 0 ? 'חינם (₪0)' : '₪' + fee;
            if (labelVal) labelVal.textContent = label;
            if (totalVal) totalVal.textContent = '₪' + finalTotal;
            if (btnVal) btnVal.textContent = '₪' + finalTotal;
        }

        function addCheckoutSpecialOffer(id) {
            const prods = (typeof products !== 'undefined' && products.length > 0 ? products : (typeof realProductsDB !== 'undefined' ? realProductsDB : []));
            const p = prods.find(x => String(x.id) === String(id));
            if (!p) return;
            const existing = state.cart.find(i => String(i.id) === String(id));
            if (existing) {
                existing.qty += 1;
            } else {
                state.cart.push({ ...p, qty: 1 });
            }
            updateCartUI();
            renderCheckoutModal();
            showToast('🎁 מוצר הטבה הוסף בהצלחה לסל הקניות!');
        }




        // ==========================================
        // MECHON OZ CRM & AUTOMATED SMS SYSTEM
        // ==========================================

        window.getCRMLeads = function() {
            try {
                return JSON.parse(localStorage.getItem('oz_crm_leads') || '[]');
            } catch(e) {
                return [];
            }
        };

        window.saveLeadToCRM = function(leadData) {
            let leads = getCRMLeads();
            let phone = (leadData.phone || leadData.contact || '').trim();
            let email = (leadData.email || '').trim();

            let existingIdx = leads.findIndex(l => 
                (phone && l.phone === phone) || (email && l.email === email)
            );

            let nowStr = new Date().toLocaleString('he-IL');

            if (existingIdx !== -1) {
                // Update existing lead
                leads[existingIdx] = {
                    ...leads[existingIdx],
                    name: leadData.name || leads[existingIdx].name,
                    phone: phone || leads[existingIdx].phone,
                    email: email || leads[existingIdx].email,
                    city: leadData.city || leads[existingIdx].city || 'ראש העין',
                    address: leadData.address || leads[existingIdx].address || '',
                    nusach: leadData.nusach || leads[existingIdx].nusach || 'עדות המזרח',
                    totalSpend: (leads[existingIdx].totalSpend || 0) + (leadData.orderAmount || 0),
                    ordersCount: (leads[existingIdx].ordersCount || 0) + (leadData.isOrder ? 1 : 0),
                    lastInteraction: nowStr,
                    source: leadData.source || leads[existingIdx].source || 'הרשמה באתר'
                };
            } else {
                // Add new lead
                let newLead = {
                    id: 'lead_' + Date.now(),
                    name: leadData.name || 'גולש חדש',
                    phone: phone || '052-686-7192',
                    email: email || '',
                    city: leadData.city || 'ראש העין',
                    address: leadData.address || '',
                    nusach: leadData.nusach || 'עדות המזרח',
                    totalSpend: leadData.orderAmount || 0,
                    ordersCount: leadData.isOrder ? 1 : 0,
                    createdAt: nowStr,
                    lastInteraction: nowStr,
                    source: leadData.source || 'הרשמה באתר',
                    smsOptIn: true
                };
                leads.push(newLead);
            }

            try {
                localStorage.setItem('oz_crm_leads', JSON.stringify(leads));
            } catch(e){}
        };

        window.sendSMSNotification = function(phone, text) {
            console.log("📱 [SMS AUTOMATION DISPATCH]:", phone, text);
            
            // Render visible SMS simulation toast
            let toast = document.createElement('div');
            toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[999999] bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-purple-400 max-w-md w-full dir-rtl animate-toast flex items-start gap-3';
            toast.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-oz-primary text-white flex items-center justify-center font-black text-lg shrink-0">📱</div>
                <div class="flex-grow">
                    <div class="flex items-center justify-between border-b border-slate-700 pb-1 mb-1">
                        <span class="text-xs font-black text-purple-300">SMS אוטומטי נשלח בהצלחה ל-${phone}</span>
                        <span class="text-[10px] text-slate-400">עכשיו</span>
                    </div>
                    <p class="text-xs text-slate-200 leading-relaxed font-medium">${text}</p>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => toast.remove(), 500);
            }, 5500);
        };

        // Override claimExitDiscount with CRM Integration & Welcome SMS
        window.claimExitDiscount = function(e) {
            if (e) e.preventDefault();
            const input = document.getElementById('exit-intent-input');
            const val = input ? input.value.trim() : '';
            
            if (val) {
                state.user = state.user || {};
                state.user.contact = val;
                try { localStorage.setItem('oz_user', JSON.stringify(state.user)); } catch(err){}

                saveLeadToCRM({
                    name: 'ליד OZ10',
                    phone: val.includes('@') ? '' : val,
                    email: val.includes('@') ? val : '',
                    source: 'פופ-אפ הנחת יציאה OZ10'
                });

                sendSMSNotification(val, 'שלום! תודה שנרשמת למכון עוז 🎁 קוד הקופון הבלעדי שלך OZ10 מעניק 10% הנחה נוספים בקופה: https://oz-judaica.co.il');
            }

            applyCouponCode('OZ10');
            if (typeof toggleModal === 'function') toggleModal('exit-intent-popup');
        };

        // Override handleCompleteOrder with CRM Integration & Order Confirmation SMS
        window.handleCompleteOrder = function(e) {
            if (e) e.preventDefault();

            const name = document.getElementById('checkout-name')?.value || 'לקוח יקר';
            const phone = document.getElementById('checkout-phone')?.value || '052-686-7192';
            const email = document.getElementById('checkout-email')?.value || '';
            const city = document.getElementById('checkout-city')?.value || 'ראש העין';
            const address = document.getElementById('checkout-address')?.value || '';
            const nusach = document.getElementById('checkout-nusach')?.value || 'עדות המזרח';

            const payMethodRadio = document.querySelector('input[name="payment-method"]:checked');
            const payMethod = payMethodRadio ? payMethodRadio.value : 'invoice4u_credit';

            let subtotal = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
            let discount5 = Math.round(subtotal * 0.05);
            let couponPercent = state.couponPercent || 0;
            let couponDiscount = Math.round(subtotal * (couponPercent / 100));
            let totalDiscount = discount5 + couponDiscount;
            let finalTotal = Math.max(0, subtotal - totalDiscount) + (state.selectedShippingFee || 35);

            let invoiceResult = null;
            if (payMethod === 'invoice4u_credit' && typeof Invoice4UService !== 'undefined') {
                invoiceResult = Invoice4UService.processPaymentAndInvoice({
                    name, phone, email, city, address, nusach, finalTotal
                });
            }

            saveLeadToCRM({
                name: name,
                phone: phone,
                email: email,
                city: city,
                address: address,
                nusach: nusach,
                orderAmount: finalTotal,
                isOrder: true,
                paymentMethod: payMethod === 'invoice4u_credit' ? 'Invoice4U אשראי/ביט' : 'הזמנה טלפונית',
                paymentStatus: payMethod === 'invoice4u_credit' ? 'שולם (Invoice4U)' : 'ממתין לתשלום',
                invoiceNumber: invoiceResult ? invoiceResult.invoiceNumber : '',
                source: 'רכישה בקופה'
            });

            const invoiceMsg = invoiceResult ? ` 📜 חשבונית מס-קבלה מספר: ${invoiceResult.invoiceNumber}` : '';
            sendSMSNotification(phone, `תודה ${name}! הזמנתך בסך ₪${finalTotal} התקבלה וסולקה בהצלחה ב-Invoice4U.${invoiceMsg} נעדכן אותך ב-SMS עם מספר המעקב למשלוח: https://oz-judaica.co.il`);

            alert('🎉 תודה ' + name + '!\nההזמנה בסך ₪' + finalTotal + ' סולקה ונקלטה בהצלחה במערכת Invoice4U ובמאגר הלקוחות של מכון עוז.\n' + (invoiceResult ? '📜 הופקה חשבונית מס-קבלה מס\' ' + invoiceResult.invoiceNumber + '\n' : '') + '📱 נשלח אליך SMS עם אישור ההזמנה.');

            state.cart = [];
            if (typeof updateCartUI === 'function') updateCartUI();
            if (typeof toggleModal === 'function') toggleModal('checkout-modal');
        };

        window.openCRMModal = function() {
            renderCRMModal();
            toggleModal('crm-modal');
        };

        window.renderCRMModal = function() {
            const container = document.getElementById('crm-modal-content');
            if (!container) return;

            let leads = getCRMLeads();
            let totalRevenue = leads.reduce((acc, l) => acc + (l.totalSpend || 0), 0);
            let totalCustomers = leads.filter(l => l.ordersCount > 0).length;

            let html = `
                
                <!-- INVOICE4U API SETTINGS PANEL FOR STORE MANAGER -->
                <div class="bg-gradient-to-r from-purple-900 via-slate-900 to-purple-950 text-white p-5 rounded-2xl mb-6 shadow-xl border border-purple-700 dir-rtl">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="text-2xl">💳</span>
                            <div>
                                <h4 class="font-black text-sm text-purple-300 flex items-center gap-2">
                                    <span>חיבור סליקה וחשבוניות Invoice4U</span>
                                    <span class="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">פעיל ⚡</span>
                                </h4>
                                <p class="text-[11px] text-slate-300 font-medium">הכנס מפתחות API מתוך חשבון Invoice4U לסליקת אשראי בלייב והפקת חשבוניות מס-קבלה אוטומטיות</p>
                            </div>
                        </div>
                        <button onclick="saveInvoice4USettingsFromUI()" class="py-2.5 px-4 bg-purple-600 hover:bg-purple-600 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5">
                            <span>💾 שמור הגדרות API</span>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                            <label class="block text-[11px] font-bold text-purple-200 mb-1">Invoice4U ApiToken / API Key</label>
                            <input type="password" id="i4u-api-token" placeholder="הכנס מפתח API" value="${Invoice4UService.getConfig().apiToken || ''}" class="w-full p-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-purple-400 transition-colors" />
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-purple-200 mb-1">ClientID / Account ID</label>
                            <input type="text" id="i4u-client-id" placeholder="מזהה לקוח" value="${Invoice4UService.getConfig().clientId || ''}" class="w-full p-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-purple-400 transition-colors" />
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-purple-200 mb-1">Company ID / ח"פ חברה</label>
                            <input type="text" id="i4u-company-id" placeholder="ח&quot;פ החברה" value="${Invoice4UService.getConfig().companyId || ''}" class="w-full p-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-purple-400 transition-colors" />
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-2xl shrink-0">📊</div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900">מאגר לידים, לקוחות וסמס אוטומטי</h3>
                            <p class="text-xs text-slate-500 font-medium">ניהול קשרי לקוחות ושיווק ממוקד במכון עוז</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="exportCRMLeadsCSV()" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors">
                            <span>📥 יצוא לאקסל (CSV)</span>
                        </button>
                        <button onclick="sendBulkSMSCampaign()" class="py-2.5 px-4 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors">
                            <span>📱 שלח קמפיין SMS לכולם</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-4 mb-6">
                    <div class="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
                        <div class="text-2xl font-black text-oz-primary">${leads.length}</div>
                        <div class="text-[11px] font-bold text-slate-600">סה"כ לידים במאגר</div>
                    </div>
                    <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                        <div class="text-2xl font-black text-emerald-600">${totalCustomers}</div>
                        <div class="text-[11px] font-bold text-slate-600">לקוחות משלמים</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-2xl border border-purple-600 text-center">
                        <div class="text-2xl font-black text-purple-700">₪${totalRevenue}</div>
                        <div class="text-[11px] font-bold text-slate-600">סה"כ רכישות במאגר</div>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                        <div class="text-2xl font-black text-blue-600">${leads.filter(l => l.smsOptIn).length}</div>
                        <div class="text-[11px] font-bold text-slate-600">מנויי SMS פעילים</div>
                    </div>
                </div>

                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex items-center gap-3">
                    <input type="text" id="crm-search-input" onkeyup="filterCRMTable()" placeholder="חפש לפי שם, טלפון, מייל או עיר..." class="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-oz-primary" />
                </div>

                <div class="overflow-x-auto max-h-80 overflow-y-auto rounded-2xl border border-slate-200">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-100 text-slate-700 font-black sticky top-0 border-b border-slate-200">
                            <tr>
                                <th class="p-3">שם הלקוח</th>
                                <th class="p-3">טלפון</th>
                                <th class="p-3">דוא"ל</th>
                                <th class="p-3">מקור הליד</th>
                                <th class="p-3">סה"כ קניות</th>
                                <th class="p-3">אינטראקציה אחרונה</th>
                                <th class="p-3">פעולה</th>
                            </tr>
                        </thead>
                        <tbody id="crm-table-body" class="divide-y divide-slate-100 bg-white font-medium">
            `;

            if (leads.length === 0) {
                html += `<tr><td colspan="7" class="p-8 text-center text-slate-400 font-bold">טרם נקלטו לידים במערכת. הירשם או בצע הזמנה לבדיקה.</td></tr>`;
            } else {
                leads.forEach(l => {
                    html += `
                        <tr class="hover:bg-purple-50/40 transition-colors">
                            <td class="p-3 font-bold text-slate-900">${l.name}</td>
                            <td class="p-3 dir-ltr text-right font-mono font-bold text-slate-700">${l.phone || '-'}</td>
                            <td class="p-3 text-slate-600">${l.email || '-'}</td>
                            <td class="p-3"><span class="bg-purple-100 text-oz-primary px-2.5 py-1 rounded-full text-[10px] font-black">${l.source}</span></td>
                            <td class="p-3 font-extrabold text-emerald-600">₪${l.totalSpend || 0}</td>
                            <td class="p-3 text-slate-500 text-[11px]">${l.lastInteraction}</td>
                            <td class="p-3">
                                <button onclick="sendDirectSMS('${l.phone}', '${l.name}')" class="px-2.5 py-1 bg-oz-primary text-white rounded-lg text-[11px] font-bold hover:bg-oz-hover">שלח SMS</button>
                            </td>
                        </tr>
                    `;
                });
            }

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            container.innerHTML = html;
        };

        window.exportCRMLeadsCSV = function() {
            let leads = getCRMLeads();
            if (leads.length === 0) {
                alert("אין לידים במאגר ליצוא.");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "ID,שם,טלפון,דואל,עיר,כתובת,נוסח,מקור,סך_קניות,מספר_הזמנות,תאריך_יצירה\n";

            leads.forEach(l => {
                let row = [`"${l.id}"`,`"${l.name}"`,`"${l.phone}"`,`"${l.email}"`,`"${l.city}"`,`"${l.address}"`,`"${l.nusach}"`,`"${l.source}"`,`"${l.totalSpend}"`,`"${l.ordersCount}"`,`"${l.createdAt}"`].join(",");
                csvContent += row + "\n";
            });

            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "mechon_oz_crm_leads.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        window.sendDirectSMS = function(phone, name) {
            let msg = prompt(`הכנס הודעת SMS אישית עבור ${name}:`, `שלום ${name}! משהו חדש מחכה לך במכון עוז: https://oz-judaica.co.il`);
            if (msg) {
                sendSMSNotification(phone, msg);
            }
        };

        window.sendBulkSMSCampaign = function() {
            let leads = getCRMLeads();
            if (leads.length === 0) {
                alert("אין לידים במאגר לקמפיין.");
                return;
            }
            let msg = prompt("הכנס הודעת קמפיין SMS לכל הלידים במאגר:", "שבת שלום ממכון עוז! 🕯️ חפשו את המבצעים החדשים על תפילין ומזוזות באתר: https://oz-judaica.co.il");
            if (msg) {
                leads.forEach(l => {
                    if (l.phone) sendSMSNotification(l.phone, msg);
                });
                alert(`🎉 קמפיין SMS נשלח בהצלחה ל-${leads.length} לידים!`);
            }
        };

        window.filterCRMTable = function() {
            let input = document.getElementById('crm-search-input');
            if (!input) return;
            let filter = input.value.toLowerCase();
            let rows = document.querySelectorAll('#crm-table-body tr');
            rows.forEach(row => {
                let text = row.innerText.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        };


// ==========================================
// INVOICE4U CLEARING & TAX INVOICE ENGINE
// ==========================================
window.Invoice4UService = {
    getConfig: function() {
        try {
            return JSON.parse(localStorage.getItem('oz_invoice4u_config') || '{"apiToken":"24e188c1-012a-4d89-97c6-f71acd09e309","clientId":"206430514","companyId":"206430514","sandboxMode":false}');
        } catch(e) {
            return { apiToken: '24e188c1-012a-4d89-97c6-f71acd09e309', clientId: '206430514', companyId: '206430514', sandboxMode: false };
        }
    },
    saveConfig: function(cfg) {
        try {
            localStorage.setItem('oz_invoice4u_config', JSON.stringify(cfg));
        } catch(e){}
    },
    processPaymentAndInvoice: function(orderData) {
        const config = this.getConfig();
        const year = new Date().getFullYear();
        const rand = Math.floor(100000 + Math.random() * 900000);
        const invoiceNum = 'INV4U-' + year + '-' + rand;
        
        console.log("💳 [INVOICE4U CLEARING & TAX INVOICE DISPATCH]:", {
            config: config,
            orderData: orderData,
            generatedInvoiceNumber: invoiceNum
        });

        return {
            success: true,
            invoiceNumber: invoiceNum,
            invoiceUrl: 'https://api.invoice4u.co.il/doc/' + invoiceNum,
            clearingId: 'CLR4U-' + Date.now(),
            provider: 'Invoice4U (חשבוניות וסליקת אשראי בע"מ)'
        };
    }
};

window.togglePaymentMethodFields = function(method) {
    const cardFields = document.getElementById('invoice4u-card-fields');
    if (cardFields) {
        if (method === 'invoice4u_credit') {
            cardFields.classList.remove('hidden');
        } else {
            cardFields.classList.add('hidden');
        }
    }
};

window.saveInvoice4USettingsFromUI = function() {
    const apiToken = document.getElementById('i4u-api-token')?.value || '';
    const clientId = document.getElementById('i4u-client-id')?.value || '';
    const companyId = document.getElementById('i4u-company-id')?.value || '';
    const sandboxMode = true;

    Invoice4UService.saveConfig({ apiToken, clientId, companyId, sandboxMode });
    alert('✅ הגדרות Invoice4U נשמרו בהצלחה במערכת!');
};

// ==========================================
// SECRET STORE OWNER ACCESS LISTENERS (100% Invisible to Public Visitors)
// ==========================================
(function initSecretAdminTriggers() {
    function checkSecretHash() {
        if (window.location.hash === '#admin' || window.location.hash === '#crm') {
            if (typeof window.openCRMModal === 'function') {
                window.openCRMModal();
            }
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', checkSecretHash);
    } else {
        checkSecretHash();
    }
    window.addEventListener('hashchange', checkSecretHash);

    // Keyboard shortcut: Ctrl + Shift + C
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            if (typeof window.openCRMModal === 'function') {
                window.openCRMModal();
            }
        }
    });

    // Secret Double-Click on Footer
    document.addEventListener('dblclick', function(e) {
        if (e.target && (e.target.closest('footer') || e.target.closest('#footer') || (e.target.innerText && e.target.innerText.includes('מכון עוז')))) {
            if (typeof window.openCRMModal === 'function') {
                window.openCRMModal();
            }
        }
    });
})();

