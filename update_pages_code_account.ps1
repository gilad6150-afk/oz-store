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
                        <div class="w-16 h-16 bg-purple-50 text-oz-primary rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">נ›’</div>
                        <h3 class="text-xl font-black text-slate-800 mb-2">׳¡׳ ׳”׳§׳ ׳™׳•׳× ׳©׳׳ ׳¨׳™׳§</h3>
                        <p class="text-xs text-slate-500 mb-6 font-medium">׳׳ ׳ ׳”׳•׳¡׳£ ׳׳•׳¦׳¨׳™׳ ׳׳¡׳ ׳׳₪׳ ׳™ ׳׳¢׳‘׳¨ ׳׳§׳•׳₪׳”</p>
                        <button onclick="toggleModal('checkout-modal'); closeAccountPage(); document.getElementById('shop').scrollIntoView({behavior:'smooth'})" class="py-3 px-6 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md">׳¢׳‘׳•׳¨ ׳׳—׳ ׳•׳× ג¨</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl">נ”’</div>
                        <div>
                            <h3 class="text-xl font-black text-slate-800">׳§׳•׳₪׳” ׳׳׳•׳‘׳˜׳—׳× 256-Bit</h3>
                            <p class="text-xs text-slate-500 font-medium">׳”׳©׳׳ ׳׳× ׳”׳”׳–׳׳ ׳” ׳©׳׳ ׳‘׳‘׳˜׳—׳” ׳׳׳›׳•׳ ׳¢׳•׳–</p>
                        </div>
                    </div>
                    <span class="text-xs font-black text-oz-primary bg-purple-50 py-1.5 px-3 rounded-full border border-purple-100">׳׳©׳׳•׳— ׳׳”׳™׳¨ 1-3 ׳™׳׳™׳ נ</span>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <!-- Form Details -->
                    <form onsubmit="handleCompleteOrder(event)" class="space-y-4">
                        <h4 class="font-black text-sm text-slate-800 border-b border-slate-100 pb-2">1. ׳₪׳¨׳˜׳™ ׳”׳׳©׳׳•׳— ׳•׳”׳׳§׳•׳—:</h4>
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">׳©׳ ׳׳׳ *</label>
                            <input type="text" id="checkout-name" required placeholder="׳™׳©׳¨׳׳ ׳™׳©׳¨׳׳׳™" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="${state.user ? state.user.name : ''}" />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1">׳˜׳׳₪׳•׳ ׳ ׳™׳™׳“ *</label>
                                <input type="tel" id="checkout-phone" required placeholder="052-686-7192" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" value="${state.user ? state.user.phone : ''}" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1">׳¢׳™׳¨ / ׳™׳™׳©׳•׳‘ *</label>
                                <input type="text" required placeholder="׳¨׳׳© ׳”׳¢׳™׳" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">׳›׳×׳•׳‘׳× ׳•׳׳¡׳₪׳¨ ׳‘׳™׳× *</label>
                            <input type="text" required placeholder="׳©׳׳•׳ ׳׳ ׳¦׳•׳¨׳” 48" class="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-oz-primary" />
                        </div>

                        <h4 class="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 pt-2">2. ׳׳׳¦׳¢׳™ ׳×׳©׳׳•׳ ׳׳•׳¢׳“׳£:</h4>
                        
                        <div class="grid grid-cols-3 gap-2 text-xs font-bold">
                            <label class="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100">
                                <input type="radio" name="payment-method" checked class="text-oz-primary" />
                                <span>נ’³ ׳׳©׳¨׳׳™</span>
                            </label>
                            <label class="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100">
                                <input type="radio" name="payment-method" class="text-oz-primary" />
                                <span>נ“² Bit / ׳‘׳™׳˜</span>
                            </label>
                            <label class="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-100">
                                <input type="radio" name="payment-method" class="text-oz-primary" />
                                <span>נ’¬ ׳•׳•׳׳˜׳¡׳׳₪</span>
                            </label>
                        </div>

                        <button type="submit" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span>׳׳™׳©׳•׳¨ ׳”׳–׳׳ ׳” ׳•׳×׳©׳׳•׳ ׳׳׳•׳‘׳˜׳— נ”’ (ג‚×${total >= 399 ? total : total + 35})</span>
                        </button>
                    </form>

                    <!-- Order Summary & Upsell Proposals -->
                    <div class="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 space-y-4">
                        <h4 class="font-black text-sm text-slate-800 border-b border-purple-100 pb-2">׳¡׳™׳›׳•׳ ׳”׳”׳–׳׳ ׳” ׳©׳׳:</h4>
                        
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            ${state.cart.map(i => `
                                <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span>${i.name} (x${i.qty})</span>
                                    <span class="text-oz-primary font-black">ג‚×${i.price * i.qty}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="border-t border-purple-100 pt-3 space-y-1.5 text-xs font-bold">
                            <div class="flex justify-between text-slate-600">
                                <span>׳“׳׳™ ׳׳©׳׳•׳—:</span>
                                <span>${total >= 399 ? '׳—׳™׳ ׳ נ‰' : 'ג‚×35'}</span>
                            </div>
                            <div class="flex justify-between text-base font-black text-oz-primary pt-1 border-t border-purple-200">
                                <span>׳¡׳”"׳› ׳¡׳•׳₪׳™:</span>
                                <span>ג‚×${total >= 399 ? total : total + 35}</span>
                            </div>
                        </div>

                        <!-- Upsell Completion Items -->
                        <div class="p-4 bg-white rounded-2xl border border-purple-200 shadow-sm space-y-3">
                            <div class="font-black text-xs text-amber-900 flex items-center gap-1">
                                <span>ג¨ ׳”׳¦׳¢׳•׳× ׳׳™׳•׳—׳“׳•׳× ׳׳”׳©׳׳׳× ׳”׳§׳ ׳™׳™׳”:</span>
                            </div>
                            <div class="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">
                                <span>׳×׳¢׳•׳“׳× ׳”׳’׳”׳× ׳׳—׳©׳‘ ׳׳•׳¡׳׳›׳×</span>
                                <span class="text-emerald-600 font-black">׳—׳™׳ ׳! נ</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                                <div>
                                    <div class="text-slate-900 font-black">׳ ׳¨׳×׳™׳§ ׳׳’׳ ׳§׳˜׳™׳₪׳” ׳׳×׳₪׳™׳׳™׳</div>
                                    <div class="text-[11px] text-oz-primary font-black">ג‚×49</div>
                                </div>
                                <button onclick="addToCart(9999)" class="py-2 px-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all active:scale-95">
                                    + ׳”׳•׳¡׳£ ׳׳¡׳
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function handleCompleteOrder(e) {
            e.preventDefault();
            const name = document.getElementById('checkout-name') ? document.getElementById('checkout-name').value : (state.user ? state.user.name : '׳׳§׳•׳— ׳™׳§׳¨');
            const total = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
            
            // Add new order to user history & award points
            if (state.user) {
                const newOrder = {
                    id: 'OZ-' + Math.floor(10000 + Math.random() * 90000),
                    date: new Date().toLocaleDateString('he-IL'),
                    status: '׳‘׳˜׳™׳₪׳•׳ ג³',
                    total: total,
                    items: [...state.cart]
                };
                if (!state.user.orders) state.user.orders = [];
                state.user.orders.unshift(newOrder);
                state.user.points = (state.user.points || 0) + Math.round(total / 10);
                localStorage.setItem('oz_user', JSON.stringify(state.user));
            }

            alert('נ‰ ׳×׳•׳“׳” ' + name + '! ׳”׳”׳–׳׳ ׳” ׳ ׳§׳׳˜׳” ׳‘׳”׳¦׳׳—׳” ׳‘׳׳¢׳¨׳›׳× ׳׳›׳•׳ ׳¢׳•׳–. ׳¦׳‘׳¨׳× ׳ ׳§׳•׳“׳•׳× VIP ׳׳§׳ ׳™׳™׳” ׳”׳‘׳׳”!');
            state.cart = [];
            updateCartUI();
            toggleModal('checkout-modal');
            if (state.user) openAccountPage();
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
            closeAccountPage();
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        }

        function calculateTallitSize() {
            const h = parseInt(document.getElementById('calc-height')?.value || '0');
            const style = document.getElementById('calc-style')?.value || 'standard';
            const res = document.getElementById('calc-result');
            if (!res) return;
            res.classList.remove('hidden');

            if (style === 'katan') {
                if (h < 130) res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ״§„…׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳˜׳׳™׳× ׳§׳˜׳ ׳׳™׳“׳” 3 / 4</strong>';
                else if (h <= 160) res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳˜׳׳™׳× ׳§׳˜׳ ׳׳™׳“׳” 5 / 6</strong>';
                else res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳˜׳׳™׳× ׳§׳˜׳ ׳׳™׳“׳” 7 / 8</strong>';
                return;
            }

            let effectiveH = h + (style === 'wide' ? 8 : 0);

            if (effectiveH < 150) {
                res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳׳™׳“׳” 45 / 50</strong>' + (style === 'wide' ? ' (׳׳•׳×׳׳ ׳׳¢׳˜׳™׳₪׳” ׳׳׳׳”/׳¨׳—׳‘׳”)' : '');
            } else if (effectiveH <= 165) {
                res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳׳™׳“׳” 55 / 60</strong>' + (style === 'wide' ? ' (׳׳•׳×׳׳ ׳׳¢׳˜׳™׳₪׳” ׳׳׳׳”/׳¨׳—׳‘׳”)' : '');
            } else if (effectiveH <= 178) {
                res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳׳™׳“׳” 60 / 70</strong>' + (style === 'wide' ? ' (׳׳•׳×׳׳ ׳׳¢׳˜׳™׳₪׳” ׳׳׳׳”/׳¨׳—׳‘׳”)' : '');
            } else if (effectiveH <= 188) {
                res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳׳™׳“׳” 70 / 80</strong>' + (style === 'wide' ? ' (׳׳•׳×׳׳ ׳׳¢׳˜׳™׳₪׳” ׳׳׳׳”/׳¨׳—׳‘׳”)' : '');
            } else {
                res.innerHTML = 'ג¨ ׳”׳׳™׳“׳” ׳”׳׳•׳׳׳¦׳× ׳¢׳‘׳•׳¨׳: <strong>׳׳™׳“׳” 80 / 90 (׳¢׳ ׳§׳™׳×)</strong>';
            }
        }

        function handleUserLogin(e) {
            if (e) e.preventDefault();
            const nameInput = document.getElementById('login-name-input')?.value || '';
            const phoneInput = document.getElementById('login-phone-input')?.value || '';
            const name = nameInput.trim() || '׳׳׳™׳¢׳–׳¨ ׳›׳”׳';
            const phone = phoneInput.trim() || '052-686-7192';

            state.user = {
                name: name,
                phone: phone,
                tier: '׳—׳‘׳¨ VIP ׳–׳”׳‘ נ‘‘',
                points: (state.user && state.user.points) ? state.user.points : 150,
                orders: (state.user && state.user.orders && state.user.orders.length > 0) ? state.user.orders : [
                    {
                        id: 'OZ-10492',
                        date: '14/09/2026',
                        status: '׳ ׳׳¡׳¨ ׳‘׳”׳¦׳׳—׳” נ',
                        total: 459,
                        items: [
                            { id: 1, name: '׳×׳₪׳™׳׳™׳ ׳׳”׳•׳“׳¨׳•׳× ׳‘׳”׳©׳’׳—׳” - ׳ ׳•׳¡׳— ׳¡׳₪׳¨׳“', qty: 1, price: 459 }
                        ]
                    },
                    {
                        id: 'OZ-09821',
                        date: '02/08/2026',
                        status: '׳ ׳׳¡׳¨ ׳‘׳”׳¦׳׳—׳” נ',
                        total: 169,
                        items: [
                            { id: 7941, name: '׳׳¨׳ ׳§ ׳¢׳•׳¨ ׳ ׳׳₪׳” ׳¢׳ ׳§ ׳׳₪׳•׳¨ LB98229', qty: 1, price: 169 }
                        ]
                    }
                ]
            };
            localStorage.setItem('oz_user', JSON.stringify(state.user));
            updateUserLabel();
            toggleModal('login-modal');
            openAccountPage();
        }

        function updateUserLabel() {
            const btn = document.getElementById('user-nav-btn');
            if (!btn) return;

            if (state.user && state.user.name) {
                const cleanName = String(state.user.name).trim();
                btn.onclick = function() { openAccountPage(); };
                btn.className = "flex items-center gap-2 p-2 px-3 rounded-2xl bg-purple-100/80 hover:bg-purple-200 text-oz-primary transition-all text-xs font-black cursor-pointer border border-purple-200 shadow-sm";
                btn.title = "׳׳–׳•׳¨ ׳׳™׳©׳™ VIP - " + cleanName;
                
                btn.innerHTML = `
                    <span class="w-7 h-7 rounded-full bg-oz-primary text-white flex items-center justify-center font-black text-xs shadow-inner">${cleanName.charAt(0)}</span>
                    <span class="hidden sm:inline font-black text-xs text-oz-primary">׳©׳׳•׳, ${cleanName}</span>
                `;
            } else {
                btn.onclick = function() { toggleModal('login-modal'); };
                btn.className = "flex items-center gap-2 p-2 px-3 rounded-2xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-oz-primary transition-colors text-xs font-bold cursor-pointer";
                btn.title = "׳”׳×׳—׳‘׳¨׳•׳× / ׳”׳¨׳©׳׳”";
                
                btn.innerHTML = `
                    <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                    <span id="user-label" class="hidden sm:inline font-bold">׳”׳×׳—׳‘׳¨׳•׳×</span>
                `;
            }
        }

        // DEDICATED VIP MY ACCOUNT PAGE SYSTEM
        function openAccountPage() {
            if (!state.user) {
                toggleModal('login-modal');
                return;
            }

            const hero = document.getElementById('hero') || document.getElementById('animated-hero');
            const shop = document.getElementById('shop');
            const magazine = document.getElementById('magazine');
            const pdp = document.getElementById('product-page-container');
            const account = document.getElementById('account-page-container');

            if (!account) return;

            if (hero) hero.classList.add('hidden');
            if (shop) shop.classList.add('hidden');
            if (magazine) magazine.classList.add('hidden');
            if (pdp) pdp.classList.add('hidden');

            account.classList.remove('hidden');
            account.innerHTML = generateAccountPageHTML();

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function closeAccountPage() {
            const hero = document.getElementById('hero') || document.getElementById('animated-hero');
            const shop = document.getElementById('shop');
            const magazine = document.getElementById('magazine');
            const account = document.getElementById('account-page-container');

            if (account) account.classList.add('hidden');
            if (hero) hero.classList.remove('hidden');
            if (shop) shop.classList.remove('hidden');
            if (magazine) magazine.classList.remove('hidden');

            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }

        function logoutUser() {
            state.user = null;
            localStorage.removeItem('oz_user');
            updateUserLabel();
            closeAccountPage();
        }

        function switchAccountTab(tabName) {
            const tabs = ['favorites', 'orders', 'points', 'recs'];
            tabs.forEach(t => {
                const btn = document.getElementById('acc-tab-btn-' + t);
                const content = document.getElementById('acc-tab-content-' + t);
                if (btn && content) {
                    if (t === tabName) {
                        btn.className = 'py-3.5 px-6 font-black text-xs text-oz-primary border-b-2 border-oz-primary bg-purple-50/70 rounded-t-2xl transition-all';
                        content.classList.remove('hidden');
                    } else {
                        btn.className = 'py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-2xl transition-all';
                        content.classList.add('hidden');
                    }
                }
            });
        }

        function reorderOrder(orderId) {
            const ord = state.user?.orders?.find(o => o.id === orderId);
            if (!ord) return;
            ord.items.forEach(item => {
                addToCart(item.id || item.name);
            });
            alert('נ‰ ׳›׳ ׳₪׳¨׳™׳˜׳™ ׳”׳”׳–׳׳ ׳” ' + orderId + ' ׳ ׳•׳¡׳₪׳• ׳‘׳”׳¦׳׳—׳” ׳׳¡׳ ׳”׳§׳ ׳™׳•׳× ׳©׳׳!');
        }

        function removeFromWishlistAcc(id) {
            toggleWishlist(id);
            openAccountPage();
        }

        function generateAccountPageHTML() {
            const user = state.user || { name: '׳׳§׳•׳— VIP', phone: '052-686-7192', points: 150, tier: '׳—׳‘׳¨ VIP ׳–׳”׳‘ נ‘‘' };
            const cleanName = String(user.name).trim();
            const points = user.points || 150;
            const orders = user.orders || [];

            // Wishlist products array
            const favProducts = products.filter(p => state.wishlist.includes(Number(p.id)));

            // Recommendations (4 items)
            const recs = products.slice(0, 4);

            return `
                <div class="space-y-8 animate-toast text-right dir-rtl">
                    
                    <!-- Breadcrumbs Navigation Bar -->
                    <div class="flex items-center justify-between flex-wrap gap-4 bg-white p-4 px-6 rounded-3xl border border-purple-100 oz-shadow">
                        <nav class="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <button onclick="closeAccountPage()" class="hover:text-oz-primary transition-colors flex items-center gap-1">
                                <span>נ  ׳“׳£ ׳”׳‘׳™׳×</span>
                            </button>
                            <span>/</span>
                            <span class="text-oz-primary font-black">׳׳–׳•׳¨ ׳׳™׳©׳™ VIP</span>
                            <span>/</span>
                            <span class="text-slate-800 font-extrabold">${cleanName}</span>
                        </nav>
                        <button onclick="closeAccountPage()" class="py-2.5 px-4 bg-purple-50 hover:bg-oz-primary hover:text-white text-oz-primary font-black text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-2 shadow-sm">
                            <span>ג† ׳—׳–׳•׳¨ ׳׳§׳˜׳׳•׳’ ׳”׳׳•׳¦׳¨׳™׳</span>
                        </button>
                    </div>

                    <!-- VIP ROYAL HERO BANNER -->
                    <div class="bg-gradient-to-r from-[#190933] via-[#2D1254] to-[#120526] text-white p-6 sm:p-10 rounded-3xl border border-amber-400/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                        
                        <!-- Glowing Accents -->
                        <div class="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div class="flex items-center gap-5 z-10">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl border-2 border-amber-200 shrink-0">
                                ${cleanName.charAt(0)}
                            </div>
                            <div class="space-y-1">
                                <div class="inline-flex items-center gap-1.5 py-1 px-3 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 text-[11px] font-black">
                                    <span>נ‘‘ ${user.tier || '׳—׳‘׳¨ VIP ׳–׳”׳‘'}</span>
                                </div>
                                <h1 class="text-2xl sm:text-3xl font-black text-white">׳‘׳¨׳•׳ ׳”׳‘׳, ${cleanName}! ג¨</h1>
                                <p class="text-xs text-purple-200 font-medium">׳©׳׳•׳ ׳׳ ׳¦׳•׳¨׳” 48, ׳¨׳׳© ׳”׳¢׳™׳ ג€¢ ${user.phone}</p>
                            </div>
                        </div>

                        <!-- Rewards Points Badge Card -->
                        <div class="z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-amber-400/30 text-center space-y-2 min-w-[220px]">
                            <div class="text-[11px] font-black text-amber-300 uppercase tracking-wider">׳™׳×׳¨׳× ׳ ׳§׳•׳“׳•׳× ׳¢׳•׳– VIP:</div>
                            <div class="text-3xl font-black text-amber-400">${points} <span class="text-xs text-white font-normal">׳ ׳§׳•׳“׳•׳×</span></div>
                            <div class="text-[10px] text-emerald-300 font-bold">׳©׳•׳•׳” ג‚×${points} ׳”׳ ׳—׳” ׳‘׳§׳ ׳™׳™׳” ׳”׳‘׳׳”! נ‰</div>
                            <button onclick="logoutUser()" class="mt-2 text-[11px] font-bold text-purple-200 hover:text-white underline block mx-auto">׳”׳×׳ ׳×׳§ ׳׳”׳—׳©׳‘׳•׳ נ×</button>
                        </div>
                    </div>

                    <!-- MAIN TABBED ACCOUNT CONTENT -->
                    <div class="bg-white rounded-3xl border border-purple-100 oz-shadow overflow-hidden">
                        
                        <!-- Account Tab Buttons -->
                        <div class="flex border-b border-purple-100 bg-slate-50/50 overflow-x-auto no-scrollbar">
                            <button id="acc-tab-btn-favorites" onclick="switchAccountTab('favorites')" class="py-3.5 px-6 font-black text-xs text-oz-primary border-b-2 border-oz-primary bg-purple-50/70 rounded-t-2xl transition-all whitespace-nowrap">
                                ג₪ן¸ ׳”׳׳•׳¦׳¨׳™׳ ׳©׳׳”׳‘׳×׳™ (${favProducts.length})
                            </button>
                            <button id="acc-tab-btn-orders" onclick="switchAccountTab('orders')" class="py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-2xl transition-all whitespace-nowrap">
                                נ“¦ ׳”׳™׳¡׳˜׳•׳¨׳™׳™׳× ׳”׳–׳׳ ׳•׳× (${orders.length})
                            </button>
                            <button id="acc-tab-btn-points" onclick="switchAccountTab('points')" class="py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-2xl transition-all whitespace-nowrap">
                                נ ׳׳•׳¢׳“׳•׳ ׳ ׳§׳•׳“׳•׳× ׳•׳”׳˜׳‘׳•׳× (${points} ׳ ׳§׳•׳“׳•׳×)
                            </button>
                            <button id="acc-tab-btn-recs" onclick="switchAccountTab('recs')" class="py-3.5 px-6 font-bold text-xs text-slate-500 hover:text-slate-800 border-b-2 border-transparent rounded-t-2xl transition-all whitespace-nowrap">
                                ג­ ׳”׳׳׳¦׳•׳× ׳׳™׳©׳™׳•׳× ׳‘׳©׳‘׳™׳׳
                            </button>
                        </div>

                        <!-- Tab Contents Container -->
                        <div class="p-6 sm:p-8">

                            <!-- TAB 1: FAVORITES (WISHLIST) -->
                            <div id="acc-tab-content-favorites" class="space-y-6">
                                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 class="text-lg font-black text-slate-900">׳¨׳©׳™׳׳× ׳”׳׳•׳¦׳¨׳™׳ ׳©׳׳”׳‘׳× ג₪ן¸</h3>
                                        <p class="text-xs text-slate-500 font-medium">׳׳•׳¦׳¨׳™׳ ׳©׳©׳׳¨׳× ׳‘׳׳—׳™׳¦׳” ׳¢׳ ׳”׳׳‘ - ׳–׳׳™׳ ׳™׳ ׳׳¨׳›׳™׳©׳” ׳׳”׳™׳¨׳” ׳‘׳׳—׳™׳¦׳” ׳׳—׳×</p>
                                    </div>
                                    <span class="text-xs font-black text-oz-primary bg-purple-50 py-1.5 px-3 rounded-full border border-purple-100">${favProducts.length} ׳׳•׳¦׳¨׳™׳ ׳ ׳©׳׳¨׳•</span>
                                </div>

                                ${favProducts.length === 0 ? `
                                    <div class="text-center py-14 bg-slate-50 rounded-3xl border border-slate-200/60 p-6 space-y-3">
                                        <div class="w-16 h-16 rounded-full bg-purple-100 text-oz-primary text-3xl flex items-center justify-center mx-auto">נ₪</div>
                                        <h4 class="font-black text-slate-800 text-base">׳¢׳“׳™׳™׳ ׳׳ ׳”׳•׳¡׳₪׳× ׳׳•׳¦׳¨׳™׳ ׳׳׳•׳¢׳“׳₪׳™׳ ׳©׳׳</h4>
                                        <p class="text-xs text-slate-500 font-medium max-w-md mx-auto">׳׳—׳¥ ׳¢׳ ׳”׳׳‘ נ₪ ׳‘׳›׳¨׳˜׳™׳¡׳™ ׳”׳׳•׳¦׳¨׳™׳ ׳‘׳—׳ ׳•׳× ׳›׳“׳™ ׳׳©׳׳•׳¨ ׳׳•׳×׳ ׳›׳׳ ׳׳’׳™׳©׳” ׳׳”׳™׳¨׳” ׳‘׳›׳ ׳¢׳×.</p>
                                        <button onclick="closeAccountPage()" class="py-3 px-6 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all">׳¢׳‘׳•׳¨ ׳׳§׳˜׳׳•׳’ ׳”׳׳•׳¦׳¨׳™׳ נ›ן¸</button>
                                    </div>
                                ` : `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        ${favProducts.map(p => `
                                            <div class="bg-white border border-purple-100 rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between p-4 relative">
                                                <button onclick="removeFromWishlistAcc('${p.id}')" class="absolute top-3 left-3 z-10 w-8 h-8 bg-white/90 rounded-full border border-slate-200 flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform" title="׳”׳¡׳¨ ׳׳”׳׳•׳¢׳“׳₪׳™׳">
                                                    ג•
                                                </button>
                                                
                                                <div onclick="openProductPage('${p.id}')" class="cursor-pointer">
                                                    <img src="${p.image}" alt="${p.name}" class="w-full h-44 object-cover rounded-2xl mb-3 group-hover:scale-105 transition-transform" />
                                                    <span class="text-[10px] font-black text-oz-primary uppercase bg-purple-50 px-2 py-0.5 rounded-md">${p.category_name || '׳×׳©׳׳™׳©׳™ ׳§׳“׳•׳©׳”'}</span>
                                                    <h4 class="font-extrabold text-sm text-slate-800 line-clamp-2 mt-1 group-hover:text-oz-primary transition-colors">${p.name}</h4>
                                                    <div class="text-lg font-black text-oz-primary mt-2">ג‚×${p.price}</div>
                                                </div>

                                                <div class="pt-3 border-t border-slate-100 flex items-center gap-2 mt-3">
                                                    <button onclick="addToCart('${p.id}')" class="flex-1 py-2.5 bg-oz-primary hover:bg-oz-hover text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5">
                                                        <span>׳”׳•׳¡׳£ ׳׳¡׳ נ›’</span>
                                                    </button>
                                                    <button onclick="openProductPage('${p.id}')" class="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-oz-primary font-bold text-xs rounded-xl border border-purple-200 transition-colors">
                                                        נ‘ן¸
                                                    </button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                `}
                            </div>

                            <!-- TAB 2: ORDER HISTORY -->
                            <div id="acc-tab-content-orders" class="hidden space-y-6">
                                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 class="text-lg font-black text-slate-900">׳”׳™׳¡׳˜׳•׳¨׳™׳™׳× ׳”׳”׳–׳׳ ׳•׳× ׳©׳׳ נ“¦</h3>
                                        <p class="text-xs text-slate-500 font-medium">׳׳¢׳§׳‘ ׳׳׳ ׳׳—׳¨ ׳”׳”׳–׳׳ ׳•׳× ׳©׳‘׳™׳¦׳¢׳× ׳‘׳׳›׳•׳ ׳¢׳•׳–</p>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    ${orders.map(ord => `
                                        <div class="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 space-y-4">
                                            <div class="flex items-center justify-between flex-wrap gap-2 border-b border-purple-100 pb-3">
                                                <div class="flex items-center gap-3">
                                                    <span class="w-10 h-10 rounded-2xl bg-purple-100 text-oz-primary flex items-center justify-center font-black text-sm">נ“¦</span>
                                                    <div>
                                                        <h4 class="font-black text-sm text-slate-900">׳”׳–׳׳ ׳” ׳׳¡' ${ord.id}</h4>
                                                        <span class="text-xs text-slate-500 font-bold">׳×׳׳¨׳™׳: ${ord.date}</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <span class="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">${ord.status}</span>
                                                    <span class="font-black text-base text-oz-primary">ג‚×${ord.total}</span>
                                                </div>
                                            </div>

                                            <div class="space-y-2">
                                                ${ord.items.map(item => `
                                                    <div class="flex items-center justify-between text-xs font-bold text-slate-700 bg-white p-3 rounded-2xl border border-slate-100">
                                                        <span>ג€¢ ${item.name} (x${item.qty})</span>
                                                        <span class="text-oz-primary font-black">ג‚×${item.price * item.qty}</span>
                                                    </div>
                                                `).join('')}
                                            </div>

                                            <div class="flex justify-end pt-1">
                                                <button onclick="reorderOrder('${ord.id}')" class="py-2.5 px-5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
                                                    <span>׳”׳–׳׳ ׳©׳•׳‘ נ”„</span>
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- TAB 3: POINTS & REWARDS CLUB -->
                            <div id="acc-tab-content-points" class="hidden space-y-6">
                                <div class="bg-gradient-to-r from-purple-50 via-amber-50/80 to-purple-50 p-6 rounded-3xl border border-amber-300/80 space-y-4">
                                    <div class="flex items-center justify-between flex-wrap gap-4">
                                        <div class="flex items-center gap-4">
                                            <div class="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-800 flex items-center justify-center font-black text-3xl shrink-0 shadow-inner">
                                                נ†
                                            </div>
                                            <div>
                                                <h3 class="text-xl font-black text-slate-900">׳׳•׳¢׳“׳•׳ ׳”׳”׳˜׳‘׳•׳× ׳•׳”׳ ׳§׳•׳“׳•׳× ׳¢׳•׳– VIP</h3>
                                                <p class="text-xs text-slate-600 font-bold">׳¦׳‘׳•׳¨ ׳ ׳§׳•׳“׳•׳× ׳‘׳›׳ ׳§׳ ׳™׳™׳” ׳•׳׳™׳׳•׳© ׳”׳ ׳—׳•׳× ׳‘׳׳¢׳“׳™׳•׳×</p>
                                            </div>
                                        </div>
                                        <div class="bg-white p-4 rounded-2xl border border-amber-200 text-center shadow-sm">
                                            <div class="text-[10px] font-black text-slate-500 uppercase">׳׳׳–׳ ׳ ׳§׳•׳“׳•׳× ׳–׳׳™׳:</div>
                                            <div class="text-2xl font-black text-oz-primary">${points} ׳ ׳§׳•׳“׳•׳×</div>
                                            <div class="text-[11px] font-black text-emerald-600">׳©׳•׳•׳” ג‚×${points} ׳”׳ ׳—׳”!</div>
                                        </div>
                                    </div>

                                    <!-- Progress to next VIP Tier -->
                                    <div class="space-y-1.5">
                                        <div class="flex justify-between text-xs font-bold text-slate-700">
                                            <span>׳”׳×׳§׳“׳׳•׳× ׳׳“׳¨׳’׳× VIP Diamond נ’ (300 ׳ ׳§׳•׳“׳•׳×):</span>
                                            <span class="text-oz-primary font-black">${points} / 300</span>
                                        </div>
                                        <div class="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500" style="width: ${Math.min(100, Math.round((points / 300) * 100))}%"></div>
                                        </div>
                                    </div>

                                    <!-- Benefits Grid -->
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                        <div class="bg-white p-4 rounded-2xl border border-purple-100 text-xs font-bold text-slate-800 space-y-1">
                                            <div class="text-amber-500 font-black">נ›ן¸ 10% ׳¦׳‘׳™׳¨׳”</div>
                                            <div class="text-slate-500 font-medium">10 ׳ ׳§׳•׳“׳•׳× ׳¢׳ ׳›׳ ג‚×100 ׳‘׳§׳ ׳™׳™׳” ׳‘׳—׳ ׳•׳×</div>
                                        </div>
                                        <div class="bg-white p-4 rounded-2xl border border-purple-100 text-xs font-bold text-slate-800 space-y-1">
                                            <div class="text-amber-500 font-black">נ‚ 50 ׳ ׳§׳•׳“׳•׳× ׳׳×׳ ׳”</div>
                                            <div class="text-slate-500 font-medium">׳”׳˜׳‘׳× ׳™׳•׳ ׳”׳•׳׳“׳× ׳—׳’׳™׳’׳™׳× ׳׳‘׳™׳× ׳׳›׳•׳ ׳¢׳•׳–</div>
                                        </div>
                                        <div class="bg-white p-4 rounded-2xl border border-purple-100 text-xs font-bold text-slate-800 space-y-1">
                                            <div class="text-amber-500 font-black">נ ׳׳©׳׳•׳—׳™׳ ׳׳•׳¢׳“׳₪׳™׳</div>
                                            <div class="text-slate-500 font-medium">׳˜׳™׳₪׳•׳ ׳‘׳¢׳“׳™׳₪׳•׳× ׳¢׳׳™׳•׳ ׳” ׳׳›׳ ׳”׳”׳–׳׳ ׳•׳× ׳©׳׳</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- TAB 4: PERSONAL RECOMMENDATIONS -->
                            <div id="acc-tab-content-recs" class="hidden space-y-6">
                                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 class="text-lg font-black text-slate-900">׳”׳׳׳¦׳•׳× ׳׳•׳×׳׳׳•׳× ׳׳™׳©׳™׳× ׳‘׳©׳‘׳™׳׳ ג­</h3>
                                        <p class="text-xs text-slate-500 font-medium">׳׳•׳¦׳¨׳™׳ ׳©׳ ׳‘׳—׳¨׳• ׳‘׳׳™׳•׳—׳“ ׳¢׳‘׳•׳¨׳ ׳׳‘׳™׳× ׳׳›׳•׳ ׳¢׳•׳–</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    ${recs.map(r => `
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

                        </div>
                    </div>

                </div>
            `;
        }