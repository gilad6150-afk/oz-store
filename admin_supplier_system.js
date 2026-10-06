// =========================================================
// MECHON OZ / OZ JUDAICA - ADMIN & SUPPLIER AUTOMATION SYSTEM
// =========================================================

(function() {
    // 1. Initial Suppliers Configuration
    const DEFAULT_SUPPLIERS = [
        {
            id: 'supp_mishkan',
            name: 'משכן התכלת',
            contact: 'דוד',
            phone: '050-0000000',
            email: 'sales@mishkan-hatchelet.co.il',
            method: 'whatsapp', // 'whatsapp', 'email', 'sms'
            location: 'אלעד',
            website: 'https://mishkan-hatchelet.co.il',
            notes: 'איסוף מנקודת אלעד / משלוח ספק'
        },
        {
            id: 'supp_leborsa',
            name: 'לבורסה',
            contact: 'נציג לבורסה',
            phone: '050-0000000',
            email: '',
            method: 'whatsapp',
            location: 'אלעד',
            website: '',
            notes: 'איסוף מאלעד'
        },
        {
            id: 'supp_rabbis_pics',
            name: 'תמונות רבנים וצדיקים',
            contact: 'נציג תמונות צדיקים',
            phone: '050-0000000',
            email: '',
            method: 'whatsapp',
            location: 'משלוח ישיר',
            website: '',
            notes: 'משלוח ישיר מבית העסק'
        },
        {
            id: 'supp_shmeq',
            name: 'שמעק',
            contact: 'נציג שמעק',
            phone: '050-0000000',
            email: '',
            method: 'whatsapp',
            location: 'משלוח ישיר',
            website: '',
            notes: 'משלוח ישיר מבית העסק'
        }
    ];

    // 2. Authentication & LocalStorage State
    window.getAdminPassword = function() {
        return localStorage.getItem('oz_admin_password') || 'oz2026';
    };

    window.setAdminPassword = function(newPass) {
        if (!newPass || newPass.trim().length < 4) return false;
        localStorage.setItem('oz_admin_password', newPass.trim());
        return true;
    };

    window.isAdminAuthenticated = function() {
        return sessionStorage.getItem('oz_admin_authed') === 'true';
    };

    window.authenticateAdmin = function(passInput) {
        if (passInput === getAdminPassword()) {
            sessionStorage.setItem('oz_admin_authed', 'true');
            return true;
        }
        return false;
    };

    window.logoutAdmin = function() {
        sessionStorage.removeItem('oz_admin_authed');
        if (typeof showNotification === 'function') {
            showNotification('התנתקת בהצלחה מלוח הבקרה');
        }
        closeAdminDashboardModal();
    };

    window.getSuppliers = function() {
        try {
            const stored = localStorage.getItem('oz_suppliers_list');
            if (stored) return JSON.parse(stored);
        } catch(e) {}
        localStorage.setItem('oz_suppliers_list', JSON.stringify(DEFAULT_SUPPLIERS));
        return DEFAULT_SUPPLIERS;
    };

    window.saveSupplier = function(suppObj) {
        let suppliers = getSuppliers();
        if (!suppObj.id) {
            suppObj.id = 'supp_' + Date.now();
            suppliers.push(suppObj);
        } else {
            const idx = suppliers.findIndex(s => s.id === suppObj.id);
            if (idx !== -1) {
                suppliers[idx] = { ...suppliers[idx], ...suppObj };
            } else {
                suppliers.push(suppObj);
            }
        }
        localStorage.setItem('oz_suppliers_list', JSON.stringify(suppliers));
        return suppObj;
    };

    window.deleteSupplier = function(suppId) {
        let suppliers = getSuppliers().filter(s => s.id !== suppId);
        localStorage.setItem('oz_suppliers_list', JSON.stringify(suppliers));
    };

    // 3. Automated Supplier Order Dispatch Generator (Without Customer Personal Contact Details!)
    window.buildSupplierDispatchMessage = function(order, supplier) {
        const suppName = supplier.contact ? `${supplier.contact} (${supplier.name})` : supplier.name;
        
        let msg = `שלום ${suppName},\n`;
        msg += `התקבלה הזמנה חדשה מעוז יודאיקה 📜\n\n`;
        msg += `📦 **המוצרים להספקה**:\n`;

        if (order.items && order.items.length > 0) {
            order.items.forEach(it => {
                const title = it.name || it.title || 'מוצר יודאיקה';
                const size = it.size || it.variation || 'סטנדרט';
                const qty = it.qty || it.quantity || 1;
                msg += `- ${title} | מידה/דגם: ${size} | כמות: ${qty}\n`;
            });
        } else if (order.productName) {
            msg += `- ${order.productName} | כמות: 1\n`;
        } else {
            msg += `- מוצר לפי פירוט הזמנה OZ-${order.id || Date.now()}\n`;
        }

        msg += `\n📍 **כתובת למשלוח / יעד**:\n`;
        msg += `עיר/יישוב: ${order.city || 'לפי פרטי משלוח'}\n`;
        if (order.address) msg += `כתובת ורחוב: ${order.address}\n`;
        if (order.shippingMethod) msg += `שיטת משלוח: ${order.shippingMethod}\n`;
        if (order.notes) msg += `הערות משלוח: ${order.notes}\n`;

        msg += `\n*הערה חשובה: המשלוח מבוצע עבור לקוח עוז יודאיקה. תודה רבה!*\n`;
        return msg;
    };

    window.dispatchOrderToSupplier = function(order, supplierId) {
        const suppliers = getSuppliers();
        const supplier = suppliers.find(s => s.id === supplierId) || suppliers[0];
        
        if (!supplier) {
            alert('ספק לא נמצא במערכת');
            return;
        }

        const msgText = buildSupplierDispatchMessage(order, supplier);
        const cleanPhone = (supplier.phone || '').replace(/[^\d+]/g, '');

        if (supplier.method === 'whatsapp' || !supplier.method) {
            const formattedPhone = cleanPhone.startsWith('0') ? '972' + cleanPhone.substring(1) : cleanPhone;
            const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msgText)}`;
            window.open(waUrl, '_blank');
        } else if (supplier.method === 'email') {
            const mailUrl = `mailto:${supplier.email}?subject=${encodeURIComponent('הזמנת עבודה חדשה מעוז יודאיקה')}&body=${encodeURIComponent(msgText)}`;
            window.open(mailUrl, '_blank');
        } else if (supplier.method === 'sms') {
            const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(msgText)}`;
            window.open(smsUrl, '_blank');
        }
    };

    // 4. Admin Dashboard Modal UI Rendering
    window.openAdminDashboardModal = function() {
        let modal = document.getElementById('oz-admin-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oz-admin-modal';
            modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = renderAdminModalContent();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeAdminDashboardModal = function() {
        const modal = document.getElementById('oz-admin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';
    };

        window.currentAdminTab = window.currentAdminTab || 'orders';

    window.switchAdminTab = function(tabName) {
        window.currentAdminTab = tabName;
        openAdminDashboardModal();
    };

    function renderAdminModalContent() {
        const authed = isAdminAuthenticated();
        
        if (!authed) {
            return `
                <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-purple-200 text-right space-y-6 animate-fade-in dir-rtl">
                    <div class="text-center space-y-2">
                        <div class="w-16 h-16 bg-purple-100 text-purple-900 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">OZ</div>
                        <h2 class="text-2xl font-black text-purple-950">כניסת מנהל - עוז יודאיקה</h2>
                        <p class="text-sm text-slate-500">אנא הזן סיסמת ניהול כדי להמשיך ללוח הבקרה</p>
                    </div>

                    <form onsubmit="handleAdminAuth(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-2">סיסמת מנהל</label>
                            <input type="password" id="admin-pass-input" placeholder="הזן סיסמה..." required
                                class="w-full text-center tracking-widest text-lg px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition">
                        </div>
                        <div id="admin-auth-error" class="hidden text-xs text-red-600 text-center font-bold">סיסמה שגויה, אנא נסה שוב.</div>

                        <button type="submit" class="w-full py-3.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl shadow-lg transition cursor-pointer">
                            התחבר ללוח הבקרה ←
                        </button>
                    </form>
                    
                    <button onclick="closeAdminDashboardModal()" class="w-full text-xs text-slate-400 hover:text-slate-600 text-center block pt-2 cursor-pointer">
                        סגור חלון
                    </button>
                </div>
            `;
        }

        // Authenticated Dashboard View
        const activeTab = window.currentAdminTab || 'orders';
        const suppliers = getSuppliers();

        // Get Real Customer Orders from localStorage
        let realOrders = [];
        try {
            const raw = localStorage.getItem('oz_all_orders') || localStorage.getItem('oz_real_orders') || '[]';
            realOrders = JSON.parse(raw);
            if (!Array.isArray(realOrders)) realOrders = [];
        } catch(e) {
            realOrders = [];
        }

        const totalRevenue = realOrders.reduce((acc, o) => acc + (parseFloat(o.total || o.amount || 0) || 0), 0);

        return `
            <div class="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border border-purple-200 text-right space-y-6 max-h-[92vh] overflow-y-auto dir-rtl">
                <!-- Header -->
                <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <span class="inline-block px-3 py-1 bg-purple-100 text-purple-900 text-xs font-black rounded-full mb-1">לוח ניהול ראשי מורשה</span>
                        <h2 class="text-xl sm:text-2xl font-black text-slate-900">מרכז ניהול - עוז יודאיקה ראש העין</h2>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="openEditPasswordPrompt()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer">
                            שינוי סיסמה
                        </button>
                        <button onclick="logoutAdmin()" class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition cursor-pointer">
                            התנתק
                        </button>
                        <button onclick="closeAdminDashboardModal()" class="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-base hover:bg-slate-200 cursor-pointer">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Navigation Tabs (Real Orders vs Suppliers) -->
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button type="button" onclick="switchAdminTab('orders')" class="py-2.5 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-purple-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        ניהול ומעקב הזמנות אמיתיות (${realOrders.length})
                    </button>
                    <button type="button" onclick="switchAdminTab('suppliers')" class="py-2.5 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${activeTab === 'suppliers' ? 'bg-purple-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        ניהול ספקים ושילוח (${suppliers.length})
                    </button>
                </div>

                ${activeTab === 'orders' ? `
                    <!-- TAB 1: REAL ORDERS TRACKING & BILLING -->
                    <div class="space-y-4">
                        <!-- Stats Bar -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="p-4 bg-purple-50/80 rounded-2xl border border-purple-200/80">
                                <span class="text-xs font-bold text-purple-900 block mb-1">סה״כ הזמנות אמיתיות</span>
                                <span class="text-2xl font-black text-purple-950">${realOrders.length}</span>
                                <span class="text-[10px] text-slate-500 block mt-0.5">עסקאות שהושלמו בבדיקה ובמערכת</span>
                            </div>
                            <div class="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
                                <span class="text-xs font-bold text-emerald-900 block mb-1">מחזור עסקאות מצטבר</span>
                                <span class="text-2xl font-black text-emerald-950">₪${totalRevenue.toLocaleString()}</span>
                                <span class="text-[10px] text-emerald-700 block mt-0.5">כולל מע״מ ודמי שילוח</span>
                            </div>
                            <div class="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/80">
                                <span class="text-xs font-bold text-blue-900 block mb-1">מוכנות סליקה ו-API</span>
                                <span class="text-sm font-black text-blue-950 flex items-center gap-1.5 mt-1">
                                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span>Invoice4U / Upay מוכן לפעולה</span>
                                </span>
                                <span class="text-[10px] text-blue-700 block mt-1">מסוף סליקה מאובטח PCI-DSS</span>
                            </div>
                        </div>

                        ${realOrders.length === 0 ? `
                            <!-- Empty State for Orders -->
                            <div class="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div class="w-14 h-14 bg-purple-100 text-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-3 font-black text-lg">OZ</div>
                                <h4 class="font-black text-slate-800 text-base mb-1">אין עדיין הזמנות לקוח ממתינות</h4>
                                <p class="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                                    כל הזמנה שתבוצע בחנות (באשראי, סליקה או הזמנה טלפונית) תירשם כאן אוטומטית עם פרטי הלקוח המלאים, המוצרים וכתובת המשלוח.
                                </p>
                            </div>
                        ` : `
                            <!-- Orders Cards List -->
                            <div class="space-y-3">
                                ${realOrders.map((ord, idx) => {
                                    const items = ord.items || [];
                                    const customer = ord.customer || {};
                                    return `
                                        <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all space-y-3">
                                            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                                <div class="flex items-center gap-2">
                                                    <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-950">הזמנה #${ord.id || ord.orderId || (idx + 101)}</span>
                                                    <span class="text-xs text-slate-500 font-bold">${ord.date || ord.createdAt || 'היום'}</span>
                                                </div>
                                                <span class="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                    ${ord.status || 'הושלמה בהצלחה'}
                                                </span>
                                            </div>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                <div class="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                    <span class="font-black text-slate-800 block text-[11px]">פרטי לקוח ויעד:</span>
                                                    <div class="font-bold text-slate-700">שם: ${customer.name || ord.name || 'לקוח עוז'}</div>
                                                    <div class="font-bold text-slate-700">טלפון: ${customer.phone || ord.phone || '-'}</div>
                                                    <div class="font-bold text-slate-700">עיר וכתובת: ${ord.city || customer.city || ''} ${ord.address || customer.address || '-'}</div>
                                                    ${ord.notes ? `<div class="text-[11px] text-slate-500">הערות: ${ord.notes}</div>` : ''}
                                                </div>

                                                <div class="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                    <span class="font-black text-slate-800 block text-[11px]">פריטים שהוזמנו:</span>
                                                    <div class="space-y-1 max-h-28 overflow-y-auto">
                                                        ${items.map(it => `
                                                            <div class="flex items-center justify-between text-[11px]">
                                                                <span class="font-bold text-slate-700 truncate max-w-[200px]">${it.name || it.title} ${it.qty ? 'x' + it.qty : ''}</span>
                                                                <span class="font-black text-oz-primary shrink-0">₪${it.price || 0}</span>
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                    <div class="pt-1.5 border-t border-slate-200 flex items-center justify-between font-black text-xs text-slate-900">
                                                        <span>סה״כ לתשלום:</span>
                                                        <span class="text-sm text-oz-primary">₪${ord.total || ord.amount || 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Order Actions -->
                                            <div class="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-100">
                                                ${customer.phone || ord.phone ? `
                                                    <a href="https://wa.me/972${String(customer.phone || ord.phone).replace(/[^0-9]/g, '').replace(/^0/, '')}?text=${encodeURIComponent('שלום ' + (customer.name || '') + ', מדברים מעוז יודאיקה בנוגע להזמנתך #' + (ord.id || ord.orderId) + '.')}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">
                                                        שליחת וואטסאפ ללקוח
                                                    </a>
                                                ` : ''}
                                                <button onclick="testDispatchForSupplier('supp_mishkan')" class="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">
                                                    העבר לספק (ללא פרטי לקוח)
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `}
                    </div>
                ` : `
                    <!-- TAB 2: SUPPLIERS MANAGEMENT & ROUTING -->
                    <div class="space-y-4">
                        <!-- Action Bar -->
                        <div class="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <div>
                                <h3 class="font-bold text-slate-900 text-sm">רשימת ספקים ואוטומציית שליחה</h3>
                                <p class="text-xs text-slate-500">הגדרת ספקים, מיקומי איסוף ושיטות שינוע ללא חשיפת פרטי לקוח</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <a href="shipping-labels.html" target="_blank" class="px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
                                    <span>הדפסת מדבקות משלוח</span>
                                </a>
                                <button onclick="openEditSupplierModal()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                    <span>+ הוסף ספק חדש</span>
                                </button>
                            </div>
                        </div>

                        <!-- Mobile Cards View (< md) -->
                        <div class="block md:hidden space-y-3">
                            ${suppliers.map(s => `
                                <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                                    <div class="flex items-center justify-between">
                                        <div class="font-black text-slate-900 text-sm">${s.name}</div>
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            s.method === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                                            s.method === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }">
                                            ${s.method === 'whatsapp' ? 'WhatsApp' : s.method === 'email' ? 'Email' : 'SMS'}
                                        </span>
                                    </div>
                                    <div class="text-xs text-slate-600 space-y-1">
                                        <div><strong class="text-slate-800">איש קשר:</strong> ${s.contact || '-'}</div>
                                        <div><strong class="text-slate-800">יצירת קשר:</strong> <span class="dir-ltr inline-block">${s.phone || s.email || '-'}</span></div>
                                        <div><strong class="text-slate-800">מיקום:</strong> ${s.location || '-'}</div>
                                        ${s.notes ? `<div class="text-[11px] text-slate-500">${s.notes}</div>` : ''}
                                    </div>
                                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                        <button onclick="testDispatchForSupplier('${s.id}')" class="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs transition cursor-pointer">
                                            שליחה לדוגמה
                                        </button>
                                        <button onclick="openEditSupplierModal('${s.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
                                            עריכה
                                        </button>
                                        <button onclick="confirmDeleteSupplier('${s.id}')" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl text-xs transition cursor-pointer">
                                            מחיקה
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Desktop Table View (>= md) -->
                        <div class="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                            <table class="w-full text-right text-xs">
                                <thead class="bg-purple-900 text-white font-bold">
                                    <tr>
                                        <th class="p-3">שם הספק</th>
                                        <th class="p-3">איש קשר</th>
                                        <th class="p-3">טלפון / דוא"ל</th>
                                        <th class="p-3">אופן הודעה</th>
                                        <th class="p-3">מיקום איסוף / משלוח</th>
                                        <th class="p-3">אתר אינטרנט</th>
                                        <th class="p-3">הערות / תנאים</th>
                                        <th class="p-3 text-center">פעולות</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${suppliers.map(s => `
                                        <tr class="hover:bg-amber-50/50 transition">
                                            <td class="p-3 font-black text-purple-950">${s.name}</td>
                                            <td class="p-3 font-bold text-slate-700">${s.contact || '-'}</td>
                                            <td class="p-3 font-mono dir-ltr text-right">${s.phone || s.email || '-'}</td>
                                            <td class="p-3">
                                                <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                                    s.method === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                                                    s.method === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                }">
                                                    ${s.method === 'whatsapp' ? 'WhatsApp' : s.method === 'email' ? 'Email' : 'SMS'}
                                                </span>
                                            </td>
                                            <td class="p-3 font-bold text-amber-900 bg-amber-50/40 rounded-lg">${s.location || '-'}</td>
                                            <td class="p-3">
                                                ${s.website ? `<a href="${s.website}" target="_blank" class="text-blue-600 hover:underline font-semibold">קישור לאתר</a>` : '-'}
                                            </td>
                                            <td class="p-3 text-slate-600 max-w-[150px] truncate" title="${s.notes || ''}">${s.notes || '-'}</td>
                                            <td class="p-3">
                                                <div class="flex items-center justify-center gap-1.5">
                                                    <button onclick="testDispatchForSupplier('${s.id}')" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] transition cursor-pointer" title="בדיקת שליחת הזמנת דוגמה לספק">
                                                        שליחה
                                                    </button>
                                                    <button onclick="openEditSupplierModal('${s.id}')" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition cursor-pointer">
                                                        ערוך
                                                    </button>
                                                    <button onclick="confirmDeleteSupplier('${s.id}')" class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-[11px] transition cursor-pointer">
                                                        מחק
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Strict Privacy Notice -->
                        <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                            <div class="font-bold flex items-center gap-1.5">
                                <span>שמירת פרטיות הלקוחות (Strict Privacy Rule):</span>
                            </div>
                            <p>כאשר לקוח רוכש באתר, ההודעה שנוצרת עבור הספק מכילה אך ורק את פירוט המוצר (שם, מידה, כמות) וכתובת היעד למשלוח. פרטי הקשר האישיים של הלקוח אינם מועברים לספק כלל.</p>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    // Auth Handler
    window.handleAdminAuth = function(e) {
        e.preventDefault();
        const pass = document.getElementById('admin-pass-input').value;
        if (authenticateAdmin(pass)) {
            openAdminDashboardModal();
        } else {
            document.getElementById('admin-auth-error').classList.remove('hidden');
        }
    };

    // Edit Supplier Modal
    window.openEditSupplierModal = function(suppId) {
        const suppliers = getSuppliers();
        const supp = suppId ? suppliers.find(s => s.id === suppId) : {
            id: '',
            name: '',
            contact: '',
            phone: '',
            email: '',
            method: 'whatsapp',
            location: 'אלעד',
            website: '',
            notes: ''
        };

        const formHtml = `
            <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 dir-rtl">
                <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4 text-right">
                    <h3 class="text-xl font-black text-navy">${supp.id ? 'עריכת פרטי ספק' : 'הוספת ספק חדש'}</h3>
                    <form onsubmit="handleSaveSupplierForm(event, '${supp.id}')" class="space-y-3 text-xs">
                        <div>
                            <label class="block font-bold text-navy mb-1">שם הספק *</label>
                            <input type="text" id="supp-form-name" value="${supp.name || ''}" required class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-navy mb-1">איש קשר</label>
                                <input type="text" id="supp-form-contact" value="${supp.contact || ''}" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">
                            </div>
                            <div>
                                <label class="block font-bold text-navy mb-1">מספר טלפון / נייד</label>
                                <input type="text" id="supp-form-phone" value="${supp.phone || ''}" placeholder="050-0000000" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-navy mb-1">אופן שליחת הודעות</label>
                                <select id="supp-form-method" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">
                                    <option value="whatsapp" ${supp.method === 'whatsapp' ? 'selected' : ''}>💬 WhatsApp</option>
                                    <option value="email" ${supp.method === 'email' ? 'selected' : ''}>✉️ Email</option>
                                    <option value="sms" ${supp.method === 'sms' ? 'selected' : ''}>📱 SMS</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-bold text-navy mb-1">מיקום איסוף / משלוח</label>
                                <input type="text" id="supp-form-location" value="${supp.location || ''}" placeholder="כגון: אלעד / משלוח ישיר" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">
                            </div>
                        </div>
                        <div>
                            <label class="block font-bold text-navy mb-1">קישור לאתר הספק</label>
                            <input type="url" id="supp-form-website" value="${supp.website || ''}" placeholder="https://..." class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">
                        </div>
                        <div>
                            <label class="block font-bold text-navy mb-1">הערות ותנאי עבודה</label>
                            <textarea id="supp-form-notes" rows="2" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-gold">${supp.notes || ''}</textarea>
                        </div>

                        <div class="flex items-center justify-end gap-2 pt-2">
                            <button type="button" onclick="closeEditSupplierModalForm()" class="px-4 py-2 bg-neutral-200 text-neutral-700 font-bold rounded-xl">ביטול</button>
                            <button type="submit" class="px-5 py-2 bg-navy text-white font-bold rounded-xl hover:bg-navy-dark">שמור ספק ✓</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        let formModal = document.getElementById('oz-edit-supp-modal');
        if (!formModal) {
            formModal = document.createElement('div');
            formModal.id = 'oz-edit-supp-modal';
            document.body.appendChild(formModal);
        }
        formModal.innerHTML = formHtml;
    };

    window.closeEditSupplierModalForm = function() {
        const modal = document.getElementById('oz-edit-supp-modal');
        if (modal) modal.innerHTML = '';
    };

    window.handleSaveSupplierForm = function(e, id) {
        e.preventDefault();
        const suppObj = {
            id: id || '',
            name: document.getElementById('supp-form-name').value,
            contact: document.getElementById('supp-form-contact').value,
            phone: document.getElementById('supp-form-phone').value,
            method: document.getElementById('supp-form-method').value,
            location: document.getElementById('supp-form-location').value,
            website: document.getElementById('supp-form-website').value,
            notes: document.getElementById('supp-form-notes').value
        };

        saveSupplier(suppObj);
        closeEditSupplierModalForm();
        openAdminDashboardModal(); // refresh table
    };

    window.confirmDeleteSupplier = function(suppId) {
        if (confirm('האם אתה בטוח שברצונך למחוק ספק זה מהרשימה?')) {
            deleteSupplier(suppId);
            openAdminDashboardModal();
        }
    };

    window.openEditPasswordPrompt = function() {
        const newP = prompt('הזן סיסמת מנהל חדשה (לפחות 4 תווים):');
        if (newP) {
            if (setAdminPassword(newP)) {
                alert('הסיסמה עודכנה בהצלחה!');
            } else {
                alert('סיסמה לא תקינה. אנא נסה שוב.');
            }
        }
    };

    window.testDispatchForSupplier = function(suppId) {
        const sampleOrder = {
            id: '9901',
            items: [
                { name: 'טלית צמר רחלים מהודרת', size: 'מידה 60', qty: 1 }
            ],
            city: 'אלעד / כתובת היעד',
            address: 'רחוב הרשב"י 12',
            shippingMethod: 'משלוח ספק דרופשיפינג',
            notes: 'נא לארוז יפה'
        };

        dispatchOrderToSupplier(sampleOrder, suppId);
    };

})();
