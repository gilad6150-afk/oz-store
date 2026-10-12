// ============================================================================
// MECHON OZ / OZ JUDAICA - ADMIN, STANDALONE CLEARING TERMINAL & CRM SYSTEM
// ============================================================================
// מערכת ניהול מרכזית: מסוף סליקה עצמאי, מאגר לקוחות מלא (CRM), ניהול הזמנות וספקים
// ============================================================================

(function() {
    // ------------------------------------------------------------------------
    // 1. Initial Suppliers Configuration
    // ------------------------------------------------------------------------
    const DEFAULT_SUPPLIERS = [
        {
            id: 'supp_mishkan',
            name: 'משכן התכלת',
            contact: 'דוד',
            phone: '050-0000000',
            email: 'sales@mishkan-hatchelet.co.il',
            method: 'whatsapp',
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

    // ------------------------------------------------------------------------
    // 2. Authentication & Admin Password
    // ------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------
    // 3. Central Customer (CRM) & Normalization Helpers
    // ------------------------------------------------------------------------
    window.cleanPhone = function(p) {
        if (!p) return '';
        let digits = String(p).replace(/[^0-9]/g, '');
        if (digits.startsWith('972')) digits = '0' + digits.substring(3);
        return digits;
    };

    window.formatIsraeliPhone = function(p) {
        const c = cleanPhone(p);
        if (c.length === 10 && c.startsWith('05')) {
            return c.substring(0, 3) + '-' + c.substring(3, 6) + '-' + c.substring(6);
        }
        return p || '';
    };

    window.getCRMLeads = function() {
        try {
            const raw = localStorage.getItem('oz_crm_leads');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch(e) {}
        return [];
    };

    window.saveLeadToCRM = function(leadData) {
        if (!leadData) return [];
        let leads = window.getCRMLeads();
        let phone = (leadData.phone || leadData.contact || '').trim();
        let cleanP = cleanPhone(phone);
        let email = (leadData.email || '').trim().toLowerCase();

        let existingIdx = leads.findIndex(l => {
            let lCleanP = cleanPhone(l.phone);
            let lEmail = (l.email || '').trim().toLowerCase();
            return (cleanP && lCleanP && cleanP === lCleanP) || (email && lEmail && email === lEmail);
        });

        let nowStr = new Date().toLocaleString('he-IL');
        let orderAmt = parseFloat(leadData.orderAmount) || 0;

        let txRecord = null;
        if (orderAmt > 0 || leadData.isOrder || leadData.transaction) {
            txRecord = {
                id: leadData.approvalNum || ('OZ-TX-' + Math.floor(100000 + Math.random() * 900000)),
                date: nowStr,
                amount: orderAmt,
                method: leadData.paymentMethod || 'סליקה',
                status: leadData.paymentStatus || 'הושלם בהצלחה',
                source: leadData.source || 'עסקה במערכת',
                desc: leadData.desc || leadData.itemsSummary || (leadData.productName ? leadData.productName : 'הזמנת יודאיקה'),
                installments: leadData.installments || 1,
                last4: leadData.last4 || '',
                notes: leadData.notes || ''
            };
        }

        if (existingIdx !== -1) {
            let existing = leads[existingIdx];
            let existingTxs = Array.isArray(existing.transactions) ? existing.transactions : [];
            if (txRecord) {
                existingTxs.unshift(txRecord);
            }

            leads[existingIdx] = {
                ...existing,
                name: (leadData.name && leadData.name !== 'גולש חדש' && leadData.name !== 'לקוח יקר') ? leadData.name : existing.name,
                phone: phone || existing.phone,
                email: email || existing.email,
                city: leadData.city || existing.city || 'ראש העין',
                address: leadData.address || existing.address || '',
                nusach: leadData.nusach || existing.nusach || 'עדות המזרח',
                totalSpend: (parseFloat(existing.totalSpend) || 0) + orderAmt,
                ordersCount: (parseInt(existing.ordersCount) || 0) + (leadData.isOrder ? 1 : 0),
                lastPaymentMethod: leadData.paymentMethod || existing.lastPaymentMethod || '',
                lastInteraction: nowStr,
                source: existing.source || leadData.source || 'הרשמה באתר',
                transactions: existingTxs
            };
        } else {
            let newLead = {
                id: 'lead_' + Date.now(),
                name: leadData.name || 'לקוח חדש',
                phone: phone || '',
                email: email || '',
                city: leadData.city || 'ראש העין',
                address: leadData.address || '',
                nusach: leadData.nusach || 'עדות המזרח',
                totalSpend: orderAmt,
                ordersCount: leadData.isOrder ? 1 : 0,
                lastPaymentMethod: leadData.paymentMethod || '',
                createdAt: nowStr,
                lastInteraction: nowStr,
                source: leadData.source || 'סליקה / הרשמה',
                smsOptIn: true,
                transactions: txRecord ? [txRecord] : []
            };
            leads.unshift(newLead);
        }

        try {
            localStorage.setItem('oz_crm_leads', JSON.stringify(leads));
        } catch(e){}
        return leads;
    };

    // ------------------------------------------------------------------------
    // 4. Suppliers Storage & Dispatch
    // ------------------------------------------------------------------------
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
        const cleanP = (supplier.phone || '').replace(/[^\d+]/g, '');

        if (supplier.method === 'whatsapp' || !supplier.method) {
            const formattedPhone = cleanP.startsWith('0') ? '972' + cleanP.substring(1) : cleanP;
            const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msgText)}`;
            window.open(waUrl, '_blank');
        } else if (supplier.method === 'email') {
            const mailUrl = `mailto:${supplier.email}?subject=${encodeURIComponent('הזמנת עבודה חדשה מעוז יודאיקה')}&body=${encodeURIComponent(msgText)}`;
            window.open(mailUrl, '_blank');
        } else if (supplier.method === 'sms') {
            const smsUrl = `sms:${cleanP}?body=${encodeURIComponent(msgText)}`;
            window.open(smsUrl, '_blank');
        }
    };

    // ------------------------------------------------------------------------
    // 5. Admin Dashboard Modal UI Rendering & Tabs
    // ------------------------------------------------------------------------
    window.currentAdminTab = window.currentAdminTab || 'terminal';

    window.openAdminDashboardModal = function(tabName) {
        if (tabName) {
            window.currentAdminTab = tabName;
        }
        let modal = document.getElementById('oz-admin-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oz-admin-modal';
            modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = renderAdminModalContent();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Auto focus search or amount if in terminal
        if (window.currentAdminTab === 'terminal') {
            setTimeout(() => {
                const searchEl = document.getElementById('terminal-cust-search');
                if (searchEl) searchEl.focus();
            }, 100);
        }
    };

    window.openManualTerminalModal = function() {
        window.openAdminDashboardModal('terminal');
    };

    window.openCustomersRegistryModal = function() {
        window.openAdminDashboardModal('customers');
    };

    window.closeAdminDashboardModal = function() {
        const modal = document.getElementById('oz-admin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';
    };

    window.switchAdminTab = function(tabName) {
        window.currentAdminTab = tabName;
        openAdminDashboardModal();
    };

    // ------------------------------------------------------------------------
    // 6. Main Modal Content Generator
    // ------------------------------------------------------------------------
    function renderAdminModalContent() {
        const authed = isAdminAuthenticated();
        
        if (!authed) {
            return `
                <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-purple-200 text-right space-y-6 animate-fade-in dir-rtl">
                    <div class="text-center space-y-2">
                        <div class="w-16 h-16 bg-purple-100 text-purple-900 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">OZ</div>
                        <h2 class="text-2xl font-black text-purple-950">כניסת מנהל - עוז יודאיקה</h2>
                        <p class="text-sm text-slate-500">אנא הזן סיסמת ניהול כדי להמשיך ללוח הבקרה ולמסוף הסליקה</p>
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
        const activeTab = window.currentAdminTab || 'terminal';
        const suppliers = getSuppliers();
        const customers = getCRMLeads();

        // Get All Customer Orders (Online + Manual Terminal)
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
            <div class="bg-white rounded-3xl max-w-6xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border border-purple-200 text-right space-y-6 max-h-[94vh] overflow-y-auto dir-rtl">
                <!-- Header -->
                <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="inline-block px-3 py-1 bg-purple-100 text-purple-900 text-xs font-black rounded-full">מערכת ניהול, סליקה ו-CRM</span>
                            <span class="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">פעיל 100%</span>
                        </div>
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

                <!-- Navigation Tabs (Terminal, Customers, Orders, Suppliers) -->
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                    <button type="button" onclick="switchAdminTab('terminal')" class="py-2.5 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${activeTab === 'terminal' ? 'bg-purple-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        💳 מסוף סליקה עצמאי
                    </button>
                    <button type="button" onclick="switchAdminTab('customers')" class="py-2.5 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${activeTab === 'customers' ? 'bg-purple-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        👥 מאגר לקוחות מלא (${customers.length})
                    </button>
                    <button type="button" onclick="switchAdminTab('orders')" class="py-2.5 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${activeTab === 'orders' ? 'bg-purple-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        📦 הזמנות ועסקאות (${realOrders.length})
                    </button>
                    <button type="button" onclick="switchAdminTab('suppliers')" class="py-2.5 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${activeTab === 'suppliers' ? 'bg-purple-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                        🚚 ניהול ספקים ושילוח (${suppliers.length})
                    </button>
                </div>

                <!-- TAB CONTENT RENDERING -->
                ${activeTab === 'terminal' ? renderManualClearingTerminal() : ''}
                ${activeTab === 'customers' ? renderCustomersRegistry() : ''}
                ${activeTab === 'orders' ? renderOrdersManagementTab(realOrders, totalRevenue) : ''}
                ${activeTab === 'suppliers' ? renderSuppliersTab(suppliers) : ''}
            </div>
        `;
    }

    // ------------------------------------------------------------------------
    // 7. TAB 1: STANDALONE MANUAL CLEARING TERMINAL
    // ------------------------------------------------------------------------
    function renderManualClearingTerminal() {
        const leads = getCRMLeads();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Info Banner -->
                <div class="p-4 sm:p-5 bg-gradient-to-l from-purple-900 via-purple-950 to-slate-900 text-white rounded-2xl shadow-lg border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="w-8 h-8 rounded-lg bg-amber-400 text-purple-950 font-black flex items-center justify-center text-lg">💳</span>
                            <h3 class="text-base sm:text-lg font-black text-amber-300">מסוף סליקה עצמאי וחיוב לקוחות (חנות / טלפון / וואטסאפ)</h3>
                        </div>
                        <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
                            כאן ניתן לסלוק ולחייב לקוחות בכל אמצעי תשלום (כרטיס אשראי, ביט, פייבוקס, העברה בנקאית, מזומן).
                            <strong>כל לקוח ועסקה שתבצע כאן יישמרו אוטומטית במאגר המרכזי של עוז יודאיקה</strong> ויופקו עבורו קבלה ואישור לשליחה מהירה בוואטסאפ בלחיצה אחת!
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="switchAdminTab('customers')" class="px-3.5 py-2 bg-purple-800/80 hover:bg-purple-700 text-amber-300 text-xs font-bold rounded-xl border border-amber-400/40 transition cursor-pointer">
                            👥 צפה בכל הלקוחות שנשמרו (${leads.length})
                        </button>
                    </div>
                </div>

                <!-- Step 1: Search Existing Customer or Enter New -->
                <div class="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <label class="block text-xs font-black text-purple-950">
                            🔍 שליפה מהירה ממאגר הלקוחות (אופציונלי):
                        </label>
                        <span class="text-[11px] text-slate-500 font-medium">הקלד שם או טלפון כדי לשלוף לקוח קיים או המשך למילוי לקוח חדש</span>
                    </div>

                    <div class="relative">
                        <input type="text" id="terminal-cust-search" oninput="filterTerminalCustomers(this.value)" placeholder="חפש לקוח קיים לפי שם, טלפון או עיר..."
                            class="w-full px-4 py-2.5 bg-white border border-purple-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-purple-400 text-slate-900 transition">
                        
                        <div id="terminal-cust-dropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
                            <!-- Populated dynamically via filterTerminalCustomers -->
                        </div>
                    </div>

                    <div id="terminal-selected-badge" class="hidden p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950 font-bold">
                        <span id="terminal-selected-info"></span>
                        <button type="button" onclick="resetTerminalCustomerSelection()" class="text-[11px] text-red-600 hover:underline font-bold cursor-pointer">נקה / לקוח חדש ✕</button>
                    </div>
                </div>

                <!-- Step 2: Clearing & Customer Form -->
                <form id="terminal-charge-form" onsubmit="processManualCharge(event)" class="space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Column 1: Customer Details -->
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h4 class="font-black text-sm text-purple-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                <span>👤 פרטי הלקוח (נשמרים אוטומטית במאגר)</span>
                            </h4>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">שם מלא של הלקוח *</label>
                                <input type="text" id="terminal-name" required placeholder="למשל: ישראל ישראלי" oninput="updateLiveReceiptPreview()"
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">מספר טלפון / נייד *</label>
                                    <input type="tel" id="terminal-phone" required placeholder="050-0000000" oninput="updateLiveReceiptPreview()"
                                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition text-left dir-ltr">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">כתובת אימייל</label>
                                    <input type="email" id="terminal-email" placeholder="customer@gmail.com" oninput="updateLiveReceiptPreview()"
                                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition text-left dir-ltr">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">עיר / יישוב</label>
                                    <input type="text" id="terminal-city" value="ראש העין" oninput="updateLiveReceiptPreview()"
                                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">כתובת ורחוב</label>
                                    <input type="text" id="terminal-address" placeholder="רחוב ומספר בית" oninput="updateLiveReceiptPreview()"
                                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">נוסח תפילה / מנהג</label>
                                <select id="terminal-nusach" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                                    <option value="עדות המזרח">עדות המזרח (ספרדי)</option>
                                    <option value="ספרד">נוסח ספרד (חסידי)</option>
                                    <option value="אשכנז">נוסח אשכנז</option>
                                    <option value="תימן">נוסח תימן (בלדי / שאמי)</option>
                                    <option value="כללי">כללי</option>
                                </select>
                            </div>
                        </div>

                        <!-- Column 2: Clearing & Transaction Details -->
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h4 class="font-black text-sm text-purple-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                <span>💰 פרטי הסליקה והחיוב</span>
                            </h4>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">סכום העסקה לתשלום (₪) *</label>
                                <div class="relative">
                                    <input type="number" step="0.5" id="terminal-amount" required placeholder="0.00" oninput="updateLiveReceiptPreview()"
                                        class="w-full text-2xl font-black text-purple-950 px-4 py-2.5 bg-amber-50/50 border-2 border-amber-400 rounded-xl outline-none focus:border-purple-600 focus:bg-white transition text-left dir-ltr">
                                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-amber-700">₪</span>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">פירוט המוצרים / שירות שסופק *</label>
                                <textarea id="terminal-desc" rows="2" required placeholder="למשל: תפילין מהודרות כתיבה ספרדית + בדיקת מזוזות" oninput="updateLiveReceiptPreview()"
                                    class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition"></textarea>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">אופן התשלום *</label>
                                    <select id="terminal-method" onchange="updateLiveReceiptPreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                                        <option value="credit_card">💳 כרטיס אשראי (סליקה טלפונית/ידנית)</option>
                                        <option value="bit">📱 ביט (Bit)</option>
                                        <option value="paybox">🅿️ פייבוקס (PayBox)</option>
                                        <option value="bank_transfer">🏦 העברה בנקאית</option>
                                        <option value="cash">💵 מזומן (קופה בחנות)</option>
                                        <option value="pos">📟 מסוף אשראי חיצוני (POS פיזי)</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">מספר תשלומים</label>
                                    <select id="terminal-installments" onchange="updateLiveReceiptPreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                                        <option value="1">1 תשלום (רגיל)</option>
                                        <option value="2">2 תשלומים</option>
                                        <option value="3">3 תשלומים</option>
                                        <option value="4">4 תשלומים</option>
                                        <option value="5">5 תשלומים</option>
                                        <option value="6">6 תשלומים</option>
                                        <option value="12">12 תשלומים</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">4 ספרות אשראי</label>
                                    <input type="text" maxlength="4" id="terminal-last4" placeholder="1234" oninput="updateLiveReceiptPreview()"
                                        class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold outline-none focus:border-purple-600 focus:bg-white transition text-center">
                                </div>
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-bold text-slate-700 mb-1">מספר אישור / אסמכתא (אופציונלי)</label>
                                    <input type="text" id="terminal-approval" placeholder="יווצר אוטומטית אם ריק" oninput="updateLiveReceiptPreview()"
                                        class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold outline-none focus:border-purple-600 focus:bg-white transition dir-ltr">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">מקור העסקה</label>
                                    <select id="terminal-source" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none">
                                        <option value="חנות פיזית (ראש העין)">🏬 חנות פיזית (ראש העין)</option>
                                        <option value="הזמנה טלפונית">📞 הזמנה טלפונית</option>
                                        <option value="הזמנת וואטסאפ">💬 הזמנת וואטסאפ</option>
                                        <option value="יריד / מכירה מיוחדת">🎪 יריד / מכירה מיוחדת</option>
                                        <option value="מסוף סליקה עצמאי">💳 מסוף סליקה עצמאי</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-700 mb-1">הערות פנימיות לעסקה</label>
                                    <input type="text" id="terminal-notes" placeholder="הערות לתיעוד פנימי..."
                                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 focus:bg-white transition">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Live Digital Receipt Preview Card -->
                    <div class="bg-amber-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200/80 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-black text-amber-950 flex items-center gap-1.5">
                                <span>🧾 תצוגה מקדימה של הקבלה הדיגיטלית שתישלח ללקוח בוואטסאפ:</span>
                            </span>
                            <span class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">מתעדכן בזמן אמת</span>
                        </div>

                        <div id="terminal-receipt-preview" class="bg-white p-4 rounded-xl border border-amber-300/80 shadow-xs font-mono text-xs text-slate-800 space-y-1.5 leading-relaxed dir-rtl">
                            <div class="text-center font-bold text-purple-950 border-b border-slate-200 pb-1 text-sm">
                                עוז יודאיקה - מרכז סת״ם ויודאיקה ראש העין
                            </div>
                            <div class="flex justify-between text-[11px] text-slate-500">
                                <span>תאריך: <strong id="prev-date">היום</strong></span>
                                <span>אסמכתא: <strong id="prev-txid">OZ-TX-XXXX</strong></span>
                            </div>
                            <div class="text-[11px]">לקוח: <strong id="prev-customer">ישראל ישראלי (050-0000000)</strong></div>
                            <div class="text-[11px]">פריטים: <strong id="prev-desc">עסקת סליקה יודאיקה</strong></div>
                            <div class="text-[11px]">אופן תשלום: <strong id="prev-method">כרטיס אשראי</strong></div>
                            <div class="border-t border-slate-200 pt-1 flex justify-between font-black text-sm text-purple-950">
                                <span>סה״כ לתשלום שולם:</span>
                                <span class="text-emerald-700">₪<span id="prev-amount">0.00</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Submission Action Bar -->
                    <div class="flex flex-wrap items-center justify-end gap-3 pt-2">
                        <button type="button" onclick="resetTerminalCustomerSelection()" class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer">
                            איפוס טופס ↺
                        </button>
                        <button type="submit" id="terminal-submit-btn" class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-2 cursor-pointer">
                            <span>בצע סליקה ושמור לקוח במערכת 💳 ✓</span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // ------------------------------------------------------------------------
    // 8. TAB 2: COMPLETE CUSTOMERS REGISTRY (CRM)
    // ------------------------------------------------------------------------
    function renderCustomersRegistry() {
        const leads = getCRMLeads();
        const totalSpendAll = leads.reduce((acc, l) => acc + (parseFloat(l.totalSpend) || 0), 0);
        const payingCustomers = leads.filter(l => (l.ordersCount > 0) || (l.totalSpend > 0));
        const avgOrder = payingCustomers.length > 0 ? Math.round(totalSpendAll / payingCustomers.length) : 0;

        return `
            <div class="space-y-4 animate-fade-in">
                <!-- Metrics Bar -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center">
                        <span class="text-[11px] font-bold text-purple-900 block mb-1">סה״כ לקוחות במאגר</span>
                        <span class="text-2xl font-black text-purple-950">${leads.length}</span>
                        <span class="text-[10px] text-slate-500 block mt-0.5">אתר + מסוף סליקה + חנות</span>
                    </div>
                    <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                        <span class="text-[11px] font-bold text-emerald-900 block mb-1">לקוחות שביצעו סליקה</span>
                        <span class="text-2xl font-black text-emerald-950">${payingCustomers.length}</span>
                        <span class="text-[10px] text-emerald-700 block mt-0.5">לקוחות משלמים בפועל</span>
                    </div>
                    <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                        <span class="text-[11px] font-bold text-amber-900 block mb-1">מחזור רכישות מצטבר</span>
                        <span class="text-2xl font-black text-amber-950">₪${totalSpendAll.toLocaleString()}</span>
                        <span class="text-[10px] text-amber-700 block mt-0.5">כלל עסקאות הלקוחות</span>
                    </div>
                    <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                        <span class="text-[11px] font-bold text-blue-900 block mb-1">ממוצע רכישה ללקוח</span>
                        <span class="text-2xl font-black text-blue-950">₪${avgOrder.toLocaleString()}</span>
                        <span class="text-[10px] text-blue-700 block mt-0.5">סל לקוח ממוצע</span>
                    </div>
                </div>

                <!-- Controls & Search -->
                <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div class="flex-grow max-w-md">
                        <input type="text" id="customers-table-search" oninput="filterCustomersTable()" placeholder="חפש לקוח לפי שם, טלפון, אימייל או עיר..."
                            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-purple-600 transition">
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="openAddCustomerModal()" class="px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5">
                            <span>+ הוסף לקוח ידנית</span>
                        </button>
                        <button type="button" onclick="exportCustomersCSV()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5">
                            <span>📥 יצוא לאקסל (CSV)</span>
                        </button>
                        <button type="button" onclick="switchAdminTab('terminal')" class="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5">
                            <span>💳 פתח מסוף סליקה</span>
                        </button>
                    </div>
                </div>

                <!-- Customers Table View -->
                <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs max-h-96 overflow-y-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-purple-900 text-white font-bold sticky top-0 z-10">
                            <tr>
                                <th class="p-3">שם הלקוח</th>
                                <th class="p-3">טלפון / נייד</th>
                                <th class="p-3">עיר וכתובת</th>
                                <th class="p-3">נוסח</th>
                                <th class="p-3">סה״כ קניות</th>
                                <th class="p-3">עסקאות</th>
                                <th class="p-3">אינטראקציה אחרונה</th>
                                <th class="p-3">מקור</th>
                                <th class="p-3 text-center">פעולות מהירות</th>
                            </tr>
                        </thead>
                        <tbody id="customers-table-body" class="divide-y divide-slate-200 bg-white">
                            ${leads.length === 0 ? `
                                <tr>
                                    <td colspan="9" class="p-8 text-center text-slate-400 font-bold">
                                        טרם נרשמו לקוחות במערכת. בצע סליקה ראשונה במסוף או הזמן מהאתר.
                                    </td>
                                </tr>
                            ` : leads.map(l => {
                                const cleanP = cleanPhone(l.phone);
                                const waUrl = cleanP ? `https://wa.me/972${cleanP.replace(/^0/, '')}` : '#';
                                const totalSpend = parseFloat(l.totalSpend || 0).toLocaleString();
                                const ordersCount = parseInt(l.ordersCount || 0);

                                return `
                                    <tr class="hover:bg-purple-50/50 transition">
                                        <td class="p-3 font-black text-slate-900">
                                            <div>${l.name || 'לקוח עוז'}</div>
                                            ${l.email ? `<div class="text-[10px] text-slate-400 font-normal dir-ltr text-right">${l.email}</div>` : ''}
                                        </td>
                                        <td class="p-3 font-mono dir-ltr text-right">
                                            <a href="tel:${l.phone}" class="text-purple-900 hover:underline font-bold">${formatIsraeliPhone(l.phone)}</a>
                                        </td>
                                        <td class="p-3 font-medium text-slate-700">
                                            ${l.city || 'ראש העין'} ${l.address ? '• ' + l.address : ''}
                                        </td>
                                        <td class="p-3">
                                            <span class="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-slate-100 text-slate-700">
                                                ${l.nusach || 'עדות המזרח'}
                                            </span>
                                        </td>
                                        <td class="p-3 font-black text-emerald-700 text-sm">
                                            ₪${totalSpend}
                                        </td>
                                        <td class="p-3 font-bold text-slate-700">
                                            ${ordersCount}
                                        </td>
                                        <td class="p-3 text-[11px] text-slate-500">
                                            ${l.lastInteraction || l.createdAt || '-'}
                                        </td>
                                        <td class="p-3">
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                String(l.source).includes('מסוף') ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                                String(l.source).includes('סליקה') ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                                                'bg-purple-100 text-purple-900 border border-purple-200'
                                            }">
                                                ${l.source || 'הרשמה'}
                                            </span>
                                        </td>
                                        <td class="p-3">
                                            <div class="flex items-center justify-center gap-1.5">
                                                <button onclick="quickChargeCustomer('${l.phone}')" title="חיוב לקוח זה במסוף הסליקה"
                                                    class="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[11px] transition shadow-xs cursor-pointer">
                                                    💳 חייב במסוף
                                                </button>
                                                <button onclick="openCustomerHistoryModal('${l.phone}')" title="צפה בהיסטוריית עסקאות הלקוח"
                                                    class="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold rounded-lg text-[11px] transition cursor-pointer">
                                                    📜 היסטוריה
                                                </button>
                                                ${cleanP ? `
                                                    <a href="${waUrl}" target="_blank" title="שלח וואטסאפ ללקוח"
                                                        class="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold transition flex items-center justify-center">
                                                        💬
                                                    </a>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ------------------------------------------------------------------------
    // 9. TAB 3: REAL ORDERS TRACKING & TRANSACTIONS
    // ------------------------------------------------------------------------
    function renderOrdersManagementTab(realOrders, totalRevenue) {
        return `
            <div class="space-y-4 animate-fade-in">
                <!-- Stats Bar -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="p-4 bg-purple-50/80 rounded-2xl border border-purple-200/80">
                        <span class="text-xs font-bold text-purple-900 block mb-1">סה״כ הזמנות ועסקאות</span>
                        <span class="text-2xl font-black text-purple-950">${realOrders.length}</span>
                        <span class="text-[10px] text-slate-500 block mt-0.5">עסקאות אתר ומסוף סליקה</span>
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
                            <span>Grow / Make / מסוף עצמאי פעיל</span>
                        </span>
                        <span class="text-[10px] text-blue-700 block mt-1">סליקה מאובטחת ועצמאית</span>
                    </div>
                </div>

                ${realOrders.length === 0 ? `
                    <div class="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div class="w-14 h-14 bg-purple-100 text-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-3 font-black text-lg">OZ</div>
                        <h4 class="font-black text-slate-800 text-base mb-1">אין עדיין הזמנות במערכת</h4>
                        <p class="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                            כל הזמנה שתבוצע בחנות (באשראי, סליקה או מסוף עצמאי) תירשם כאן אוטומטית עם פרטי הלקוח המלאים, המוצרים וכתובת המשלוח.
                        </p>
                    </div>
                ` : `
                    <div class="space-y-3">
                        ${realOrders.map((ord, idx) => {
                            const items = ord.items || [];
                            const customer = ord.customer || {};
                            const cleanP = cleanPhone(customer.phone || ord.phone);
                            const waUrl = cleanP ? `https://wa.me/972${cleanP.replace(/^0/, '')}?text=${encodeURIComponent('שלום ' + (customer.name || ord.name || '') + ', מדברים מעוז יודאיקה בנוגע לעסקתך #' + (ord.id || ord.orderId) + '.')}` : '#';

                            return `
                                <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all space-y-3">
                                    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                        <div class="flex items-center gap-2">
                                            <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-950">עסקה #${ord.id || ord.orderId || (idx + 101)}</span>
                                            <span class="text-xs text-slate-500 font-bold">${ord.date || ord.createdAt || 'היום'}</span>
                                            ${ord.isManualClearing ? `
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                                    מסוף סליקה עצמאי
                                                </span>
                                            ` : ''}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                ${ord.paymentStatus || ord.status || 'הושלמה בהצלחה'}
                                            </span>
                                            <span class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                                ${ord.paymentMethod || 'סליקה'}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div class="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                            <span class="font-black text-slate-800 block text-[11px]">פרטי לקוח ויעד:</span>
                                            <div class="font-bold text-slate-700">שם: ${customer.name || ord.name || 'לקוח עוז'}</div>
                                            <div class="font-bold text-slate-700">טלפון: ${formatIsraeliPhone(customer.phone || ord.phone || '-')}</div>
                                            <div class="font-bold text-slate-700">עיר וכתובת: ${ord.city || customer.city || ''} ${ord.address || customer.address || '-'}</div>
                                            ${ord.notes ? `<div class="text-[11px] text-slate-500">הערות: ${ord.notes}</div>` : ''}
                                        </div>

                                        <div class="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                            <span class="font-black text-slate-800 block text-[11px]">פריטים שהוזמנו / נסלקו:</span>
                                            <div class="space-y-1 max-h-28 overflow-y-auto">
                                                ${items.length > 0 ? items.map(it => `
                                                    <div class="flex items-center justify-between text-[11px]">
                                                        <span class="font-bold text-slate-700 truncate max-w-[200px]">${it.name || it.title} ${it.qty ? 'x' + it.qty : ''}</span>
                                                        <span class="font-black text-purple-900 shrink-0">₪${it.price || 0}</span>
                                                    </div>
                                                `).join('') : `
                                                    <div class="text-[11px] text-slate-700 font-bold">${ord.productName || 'עסקת יודאיקה'}</div>
                                                `}
                                            </div>
                                            <div class="pt-1.5 border-t border-slate-200 flex items-center justify-between font-black text-xs text-slate-900">
                                                <span>סה״כ לתשלום:</span>
                                                <span class="text-sm text-emerald-700 font-black">₪${ord.total || ord.amount || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Order Actions -->
                                    <div class="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-100">
                                        ${cleanP ? `
                                            <a href="${waUrl}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">
                                                שליחת וואטסאפ ללקוח
                                            </a>
                                        ` : ''}
                                        <button onclick="openDigitalReceiptModal(${JSON.stringify(ord).replace(/"/g, '&quot;')})" class="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer">
                                            הפק קבלה דיגיטלית 🧾
                                        </button>
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
        `;
    }

    // ------------------------------------------------------------------------
    // 10. TAB 4: SUPPLIERS MANAGEMENT & ROUTING
    // ------------------------------------------------------------------------
    function renderSuppliersTab(suppliers) {
        return `
            <div class="space-y-4 animate-fade-in">
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

                <!-- Desktop Table View -->
                <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
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

                <!-- Privacy Notice -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                    <div class="font-bold flex items-center gap-1.5">
                        <span>שמירת פרטיות הלקוחות (Strict Privacy Rule):</span>
                    </div>
                    <p>כאשר לקוח רוכש באתר, ההודעה שנוצרת עבור הספק מכילה אך ורק את פירוט המוצר (שם, מידה, כמות) וכתובת היעד למשלוח. פרטי הקשר האישיים של הלקוח אינם מועברים לספק כלל.</p>
                </div>
            </div>
        `;
    }

    // ------------------------------------------------------------------------
    // 11. TERMINAL INTERACTION HANDLERS & AUTOCOMPLETE
    // ------------------------------------------------------------------------
    window.filterTerminalCustomers = function(query) {
        const dropdown = document.getElementById('terminal-cust-dropdown');
        if (!dropdown) return;
        const q = (query || '').trim().toLowerCase();
        if (!q || q.length < 1) {
            dropdown.classList.add('hidden');
            return;
        }

        const leads = getCRMLeads();
        const matches = leads.filter(l => {
            const name = (l.name || '').toLowerCase();
            const phone = (l.phone || '').replace(/[^0-9]/g, '');
            const city = (l.city || '').toLowerCase();
            const email = (l.email || '').toLowerCase();
            return name.includes(q) || phone.includes(q) || city.includes(q) || email.includes(q);
        }).slice(0, 6);

        if (matches.length === 0) {
            dropdown.innerHTML = `<div class="p-3 text-xs text-slate-400 text-center">לא נמצאו לקוחות קיימים התואמים לחיפוש (המשך למילוי רגיל)</div>`;
            dropdown.classList.remove('hidden');
            return;
        }

        dropdown.innerHTML = matches.map(m => `
            <div onclick="selectTerminalCustomer('${m.phone || m.id}')" class="p-3 hover:bg-purple-50 cursor-pointer transition flex items-center justify-between text-xs">
                <div>
                    <span class="font-black text-slate-900">${m.name}</span>
                    <span class="text-slate-500 font-mono text-[11px] mr-2 dir-ltr inline-block">${formatIsraeliPhone(m.phone)}</span>
                    <span class="text-[11px] text-slate-400">(${m.city || 'ראש העין'})</span>
                </div>
                <div class="text-left font-bold text-emerald-700">
                    ₪${parseFloat(m.totalSpend || 0).toLocaleString()} (${m.ordersCount || 0} רכישות)
                </div>
            </div>
        `).join('');
        dropdown.classList.remove('hidden');
    };

    window.selectTerminalCustomer = function(identifier) {
        const leads = getCRMLeads();
        const cleanIdent = cleanPhone(identifier);
        const customer = leads.find(l => cleanPhone(l.phone) === cleanIdent || l.id === identifier);
        
        const dropdown = document.getElementById('terminal-cust-dropdown');
        if (dropdown) dropdown.classList.add('hidden');

        if (!customer) return;

        // Populate Form
        if (document.getElementById('terminal-name')) document.getElementById('terminal-name').value = customer.name || '';
        if (document.getElementById('terminal-phone')) document.getElementById('terminal-phone').value = customer.phone || '';
        if (document.getElementById('terminal-email')) document.getElementById('terminal-email').value = customer.email || '';
        if (document.getElementById('terminal-city')) document.getElementById('terminal-city').value = customer.city || 'ראש העין';
        if (document.getElementById('terminal-address')) document.getElementById('terminal-address').value = customer.address || '';
        if (document.getElementById('terminal-nusach')) document.getElementById('terminal-nusach').value = customer.nusach || 'עדות המזרח';

        // Show Badge
        const badge = document.getElementById('terminal-selected-badge');
        const badgeInfo = document.getElementById('terminal-selected-info');
        if (badge && badgeInfo) {
            badgeInfo.innerHTML = `✨ נבחר לקוח קיים: <strong>${customer.name}</strong> (${formatIsraeliPhone(customer.phone)}) • מחזור קודם: <strong>₪${parseFloat(customer.totalSpend || 0).toLocaleString()}</strong> (${customer.ordersCount || 0} עסקאות)`;
            badge.classList.remove('hidden');
        }

        updateLiveReceiptPreview();

        // Focus amount input
        const amountEl = document.getElementById('terminal-amount');
        if (amountEl) amountEl.focus();
    };

    window.resetTerminalCustomerSelection = function() {
        const badge = document.getElementById('terminal-selected-badge');
        if (badge) badge.classList.add('hidden');
        
        const form = document.getElementById('terminal-charge-form');
        if (form) form.reset();

        const searchEl = document.getElementById('terminal-cust-search');
        if (searchEl) searchEl.value = '';

        if (document.getElementById('terminal-city')) document.getElementById('terminal-city').value = 'ראש העין';
        if (document.getElementById('terminal-nusach')) document.getElementById('terminal-nusach').value = 'עדות המזרח';

        updateLiveReceiptPreview();
    };

    window.updateLiveReceiptPreview = function() {
        const name = (document.getElementById('terminal-name') ? document.getElementById('terminal-name').value : '') || 'ישראל ישראלי';
        const phone = (document.getElementById('terminal-phone') ? document.getElementById('terminal-phone').value : '') || '050-0000000';
        const amount = (document.getElementById('terminal-amount') ? document.getElementById('terminal-amount').value : '') || '0.00';
        const desc = (document.getElementById('terminal-desc') ? document.getElementById('terminal-desc').value : '') || 'עסקת סליקה יודאיקה';
        const methodEl = document.getElementById('terminal-method');
        const method = methodEl ? methodEl.options[methodEl.selectedIndex].text : 'כרטיס אשראי';
        const approval = (document.getElementById('terminal-approval') ? document.getElementById('terminal-approval').value : '') || 'OZ-TX-LIVE';

        if (document.getElementById('prev-customer')) document.getElementById('prev-customer').innerText = `${name} (${phone})`;
        if (document.getElementById('prev-amount')) document.getElementById('prev-amount').innerText = parseFloat(amount || 0).toFixed(2);
        if (document.getElementById('prev-desc')) document.getElementById('prev-desc').innerText = desc;
        if (document.getElementById('prev-method')) document.getElementById('prev-method').innerText = method;
        if (document.getElementById('prev-txid')) document.getElementById('prev-txid').innerText = approval;
        if (document.getElementById('prev-date')) document.getElementById('prev-date').innerText = new Date().toLocaleDateString('he-IL');
    };

    // ------------------------------------------------------------------------
    // 12. PROCESS MANUAL CHARGE SUBMISSION
    // ------------------------------------------------------------------------
    window.processManualCharge = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        
        const name = (document.getElementById('terminal-name').value || '').trim();
        const phone = (document.getElementById('terminal-phone').value || '').trim();
        const email = (document.getElementById('terminal-email').value || '').trim();
        const city = (document.getElementById('terminal-city').value || 'ראש העין').trim();
        const address = (document.getElementById('terminal-address').value || '').trim();
        const nusach = (document.getElementById('terminal-nusach').value || 'עדות המזרח').trim();
        
        const amountVal = parseFloat(document.getElementById('terminal-amount').value);
        if (!amountVal || amountVal <= 0) {
            alert('אנא הזן סכום תקין לחיוב (גדול מ-0 ₪)');
            return;
        }
        if (!name || !phone) {
            alert('אנא הזן שם לקוח ומספר טלפון');
            return;
        }

        const desc = (document.getElementById('terminal-desc').value || 'עסקת יודאיקה במסוף').trim();
        const method = document.getElementById('terminal-method').value;
        const installments = parseInt(document.getElementById('terminal-installments').value) || 1;
        const last4 = (document.getElementById('terminal-last4').value || '').trim();
        const customApproval = (document.getElementById('terminal-approval').value || '').trim();
        const source = (document.getElementById('terminal-source').value || 'מסוף סליקה עצמאי (חנות/טלפון)').trim();
        const notes = (document.getElementById('terminal-notes').value || '').trim();

        const txId = customApproval || ('OZ-TX-' + Math.floor(100000 + Math.random() * 900000));
        const nowStr = new Date().toLocaleString('he-IL');

        // Payment Method Display Label
        const methodLabels = {
            'credit_card': `כרטיס אשראי${last4 ? ' (סיום ' + last4 + ')' : ''}`,
            'bit': 'ביט (Bit)',
            'paybox': 'פייבוקס (PayBox)',
            'bank_transfer': 'העברה בנקאית',
            'cash': 'מזומן (קופה בחנות)',
            'pos': 'מסוף אשראי חיצוני (POS פיזי)'
        };
        const methodText = methodLabels[method] || method;

        // Build Transaction Order Record
        const orderRecord = {
            id: txId,
            orderId: txId,
            date: nowStr,
            createdAt: new Date().toISOString(),
            customer: { name, phone, email, city, address, nusach },
            name: name,
            phone: phone,
            email: email,
            city: city,
            address: address,
            nusach: nusach,
            items: [{ name: desc, price: amountVal, qty: 1 }],
            productName: desc,
            total: amountVal,
            finalTotal: amountVal,
            amount: amountVal,
            paymentMethod: methodText,
            paymentStatus: 'שולם ואושר (מסוף סליקה)',
            source: source,
            installments: installments,
            last4: last4,
            approvalNum: txId,
            notes: notes,
            isManualClearing: true
        };

        // 1. Save to oz_all_orders
        try {
            let allOrders = JSON.parse(localStorage.getItem('oz_all_orders') || '[]');
            allOrders.unshift(orderRecord);
            localStorage.setItem('oz_all_orders', JSON.stringify(allOrders.slice(0, 150)));
            localStorage.setItem('oz_completed_orders_count', allOrders.length.toString());
        } catch(err) {
            console.error('Error saving to oz_all_orders:', err);
        }

        // 2. Save to oz_manual_transactions
        try {
            let manualTxs = JSON.parse(localStorage.getItem('oz_manual_transactions') || '[]');
            manualTxs.unshift(orderRecord);
            localStorage.setItem('oz_manual_transactions', JSON.stringify(manualTxs.slice(0, 150)));
        } catch(err) {}

        // 3. Save/Update Customer in oz_crm_leads (Central CRM)
        window.saveLeadToCRM({
            name: name,
            phone: phone,
            email: email,
            city: city,
            address: address,
            nusach: nusach,
            orderAmount: amountVal,
            isOrder: true,
            paymentMethod: methodText,
            paymentStatus: 'שולם במסוף סליקה',
            approvalNum: txId,
            source: source,
            desc: desc,
            installments: installments,
            last4: last4,
            notes: notes
        });

        // 4. Send Webhook to Make.com in background
        try {
            const webhookUrl = 'https://hook.eu1.make.com/5rb89ooxpchjtbhmat3wrh63c8vdv5pk';
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `סליקת מסוף - ${name} (${desc})`,
                    eventType: 'MANUAL_CLEARING_TRANSACTION',
                    transactionId: txId,
                    customer: { name, phone, email, city, address, nusach },
                    amount: amountVal,
                    description: desc,
                    paymentMethod: methodText,
                    installments: installments,
                    source: source,
                    notes: notes,
                    timestamp: new Date().toISOString()
                })
            }).catch(e => console.warn('Make webhook manual tx dispatch:', e));
        } catch(e) {}

        // 5. Play celebration sound if available
        if (typeof window.playPurchaseSuccessSound === 'function') {
            window.playPurchaseSuccessSound();
        }

        // 6. Open Digital Receipt & WhatsApp Dispatch Modal
        window.openDigitalReceiptModal(orderRecord);
    };

    // ------------------------------------------------------------------------
    // 13. DIGITAL RECEIPT & WHATSAPP DISPATCH MODAL
    // ------------------------------------------------------------------------
    window.openDigitalReceiptModal = function(order) {
        if (!order) return;
        
        let modal = document.getElementById('oz-digital-receipt-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oz-digital-receipt-modal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto dir-rtl';
            document.body.appendChild(modal);
        }

        const cleanP = cleanPhone(order.phone || (order.customer && order.customer.phone));
        const custName = order.name || (order.customer && order.customer.name) || 'לקוח יקר';
        const txId = order.id || order.orderId || order.approvalNum || ('OZ-TX-' + Date.now().toString().slice(-6));
        const amount = parseFloat(order.total || order.amount || order.finalTotal || 0).toLocaleString();
        const desc = (order.items && order.items[0] && order.items[0].name) || order.productName || 'רכישת פריטי יודאיקה';
        const method = order.paymentMethod || 'סליקה מאושרת';
        const dateStr = order.date || new Date().toLocaleString('he-IL');

        // WhatsApp Formatted Receipt Message
        const waReceiptText = 
`שלום ${custName},
תודה שבחרת בעוז יודאיקה - מרכז סת״ם ויודאיקה ראש העין! 📜
להלן אישור סליקה וקבלה על רכישתך:

🧾 אסמכתא / קבלה: ${txId}
📅 תאריך: ${dateStr}
💳 אופן תשלום: ${method}
📦 פירוט העסקה: ${desc}
💰 סה״כ שולם: ₪${amount}

נשמח לעמוד לשירותך תמיד!
עוז יודאיקה • 052-686-7192 • https://oz-judaica.co.il`;

        const waUrl = cleanP ? `https://wa.me/972${cleanP.replace(/^0/, '')}?text=${encodeURIComponent(waReceiptText)}` : '#';

        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-400 space-y-5 text-right animate-scale-up">
                <!-- Success Header -->
                <div class="text-center space-y-2 border-b border-slate-100 pb-4">
                    <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                        ✓
                    </div>
                    <h3 class="text-xl font-black text-slate-900">הסליקה הושלמה והלקוח נשמר במערכת!</h3>
                    <p class="text-xs text-slate-500">פרטי העסקה והלקוח נרשמו בהצלחה בבסיס הנתונים המרכזי של עוז יודאיקה.</p>
                </div>

                <!-- Printable Receipt Box -->
                <div id="printable-receipt-area" class="bg-slate-50 p-5 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2 leading-relaxed">
                    <div class="text-center border-b border-slate-200 pb-2">
                        <div class="font-black text-sm text-purple-950">עוז יודאיקה - מרכז סת״ם ראש העין</div>
                        <div class="text-[11px] text-slate-500">עוסק מורשה | טלפון: 052-686-7192</div>
                    </div>

                    <div class="flex justify-between text-[11px]">
                        <span>מספר אסמכתא:</span>
                        <strong class="dir-ltr text-purple-950">${txId}</strong>
                    </div>
                    <div class="flex justify-between text-[11px]">
                        <span>תאריך ושעה:</span>
                        <span>${dateStr}</span>
                    </div>
                    <div class="flex justify-between text-[11px]">
                        <span>שם הלקוח:</span>
                        <strong class="text-slate-900">${custName}</strong>
                    </div>
                    <div class="flex justify-between text-[11px]">
                        <span>טלפון:</span>
                        <span class="dir-ltr">${formatIsraeliPhone(order.phone || cleanP)}</span>
                    </div>
                    ${order.city ? `
                        <div class="flex justify-between text-[11px]">
                            <span>עיר וכתובת:</span>
                            <span>${order.city} ${order.address || ''}</span>
                        </div>
                    ` : ''}

                    <div class="border-t border-slate-200 pt-2 text-[11px]">
                        <span class="text-slate-500 block mb-0.5">פירוט פריטים / שירות:</span>
                        <strong class="text-slate-900 block">${desc}</strong>
                    </div>

                    <div class="flex justify-between text-[11px] pt-1">
                        <span>אופן התשלום:</span>
                        <strong>${method}</strong>
                    </div>

                    <div class="border-t-2 border-slate-300 pt-2 flex justify-between font-black text-base text-purple-950">
                        <span>סה״כ שולם:</span>
                        <span class="text-emerald-700">₪${amount}</span>
                    </div>
                </div>

                <!-- Actions: WhatsApp, Print, Done -->
                <div class="space-y-2.5 pt-2">
                    ${cleanP ? `
                        <a href="${waUrl}" target="_blank" onclick="closeDigitalReceiptModal()" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
                            <span>📲 שלח קבלה ללקוח בוואטסאפ (WhatsApp) בלחיצה אחת</span>
                        </a>
                    ` : `
                        <button disabled class="w-full py-3 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl">
                            לא הוזן מספר טלפון לשליחת וואטסאפ
                        </button>
                    `}

                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" onclick="window.print()" class="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
                            <span>🖨️ הדפס קבלה</span>
                        </button>
                        <button type="button" onclick="closeDigitalReceiptModal(); switchAdminTab('customers');" class="py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
                            <span>👥 צפה בכרטיס הלקוח במאגר</span>
                        </button>
                    </div>

                    <button type="button" onclick="closeDigitalReceiptModal(); resetTerminalCustomerSelection();" class="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer">
                        סגור וחזור למסוף הסליקה ←
                    </button>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
    };

    window.closeDigitalReceiptModal = function() {
        const modal = document.getElementById('oz-digital-receipt-modal');
        if (modal) modal.classList.add('hidden');
    };

    // ------------------------------------------------------------------------
    // 14. CUSTOMER HISTORY MODAL & QUICK CHARGE
    // ------------------------------------------------------------------------
    window.quickChargeCustomer = function(phone) {
        window.currentAdminTab = 'terminal';
        openAdminDashboardModal('terminal');
        setTimeout(() => {
            selectTerminalCustomer(phone);
        }, 150);
    };

    window.openCustomerHistoryModal = function(identifier) {
        const leads = getCRMLeads();
        const cleanIdent = cleanPhone(identifier);
        const customer = leads.find(l => cleanPhone(l.phone) === cleanIdent || l.id === identifier);

        if (!customer) {
            alert('לקוח לא נמצא');
            return;
        }

        // Pull past orders from oz_all_orders that match phone
        let allOrders = [];
        try {
            allOrders = JSON.parse(localStorage.getItem('oz_all_orders') || '[]');
        } catch(e){}

        const matchingOrders = allOrders.filter(o => {
            const oPhone = cleanPhone((o.customer && o.customer.phone) || o.phone);
            return oPhone && oPhone === cleanIdent;
        });

        const txs = (customer.transactions && customer.transactions.length > 0) ? customer.transactions : matchingOrders;

        let modal = document.getElementById('oz-cust-history-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oz-cust-history-modal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto dir-rtl';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-5 text-right animate-scale-up max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <span class="text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full mb-1 inline-block">כרטיס לקוח והיסטוריית עסקאות</span>
                        <h3 class="text-xl font-black text-slate-900">${customer.name}</h3>
                        <p class="text-xs text-slate-500">${formatIsraeliPhone(customer.phone)} • ${customer.city || 'ראש העין'} ${customer.address || ''}</p>
                    </div>
                    <button onclick="closeCustomerHistoryModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer">
                        ✕
                    </button>
                </div>

                <!-- Customer Overview Cards -->
                <div class="grid grid-cols-3 gap-3 text-center">
                    <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <span class="text-[10.5px] font-bold text-purple-900 block">סה״כ קניות מצטבר</span>
                        <span class="text-lg font-black text-purple-950">₪${parseFloat(customer.totalSpend || 0).toLocaleString()}</span>
                    </div>
                    <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span class="text-[10.5px] font-bold text-emerald-900 block">מספר עסקאות</span>
                        <span class="text-lg font-black text-emerald-950">${customer.ordersCount || txs.length}</span>
                    </div>
                    <div class="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span class="text-[10.5px] font-bold text-amber-900 block">נוסח תפילה</span>
                        <span class="text-sm font-black text-amber-950 mt-1 block">${customer.nusach || 'עדות המזרח'}</span>
                    </div>
                </div>

                <!-- Transactions List -->
                <div class="space-y-3">
                    <h4 class="font-bold text-xs text-slate-800">היסטוריית עסקאות וסליקה:</h4>
                    
                    ${txs.length === 0 ? `
                        <div class="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-400 font-bold border border-slate-200">
                            אין עדיין עסקאות מתועדות עבור לקוח זה.
                        </div>
                    ` : `
                        <div class="space-y-2.5 max-h-64 overflow-y-auto">
                            ${txs.map((t, idx) => `
                                <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <div class="space-y-0.5">
                                        <div class="flex items-center gap-2">
                                            <span class="font-black text-slate-900">עסקה #${t.id || (idx + 1)}</span>
                                            <span class="text-[10px] text-slate-500 font-bold">${t.date || 'היום'}</span>
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${t.status || 'שולם'}</span>
                                        </div>
                                        <div class="text-slate-600 text-[11px]">${t.desc || (t.items && t.items[0] && t.items[0].name) || 'פריט יודאיקה'} • אופן: ${t.method || t.paymentMethod || 'סליקה'}</div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <span class="font-black text-emerald-700 text-sm">₪${parseFloat(t.amount || t.total || 0).toLocaleString()}</span>
                                        <button onclick="resendWhatsAppReceipt('${customer.phone}', '${customer.name}', '${t.id || ''}', '${t.amount || t.total || 0}', '${(t.desc || 'רכישת יודאיקה').replace(/'/g, "\\'")}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold cursor-pointer">
                                            שלח קבלה 💬
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onclick="closeCustomerHistoryModal(); quickChargeCustomer('${customer.phone}')" class="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer">
                        💳 בצע סליקה חדשה ללקוח זה
                    </button>
                    <button onclick="closeCustomerHistoryModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                        סגור
                    </button>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
    };

    window.closeCustomerHistoryModal = function() {
        const modal = document.getElementById('oz-cust-history-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.resendWhatsAppReceipt = function(phone, name, txId, amount, desc) {
        const cleanP = cleanPhone(phone);
        if (!cleanP) {
            alert('אין מספר טלפון תקין לשליחה');
            return;
        }

        const msg = 
`שלום ${name},
מצורפת קבלה/אישור סליקה מעוז יודאיקה ראש העין 📜:

🧾 אסמכתא: ${txId || 'OZ-TX'}
📦 פירוט: ${desc || 'פריטי יודאיקה'}
💰 סכום: ₪${parseFloat(amount || 0).toLocaleString()}

עוז יודאיקה • 052-686-7192 • https://oz-judaica.co.il`;

        window.open(`https://wa.me/972${cleanP.replace(/^0/, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // ------------------------------------------------------------------------
    // 15. CUSTOMER FILTERING & CSV EXPORT
    // ------------------------------------------------------------------------
    window.filterCustomersTable = function() {
        const q = (document.getElementById('customers-table-search').value || '').trim().toLowerCase();
        const rows = document.querySelectorAll('#customers-table-body tr');
        rows.forEach(r => {
            const text = r.innerText.toLowerCase();
            if (!q || text.includes(q)) {
                r.style.display = '';
            } else {
                r.style.display = 'none';
            }
        });
    };

    window.exportCustomersCSV = function() {
        const leads = getCRMLeads();
        if (!leads || leads.length === 0) {
            alert('אין נתוני לקוחות לייצוא');
            return;
        }

        let csvContent = '\uFEFF'; // UTF-8 BOM for Hebrew support in Excel
        csvContent += 'מזהה,שם הלקוח,טלפון,דוא"ל,עיר,כתובת,נוסח,סה"כ קניות (₪),מספר עסקאות,מועד אחרון,מקור\n';

        leads.forEach(l => {
            const row = [
                `"${l.id || ''}"`,
                `"${(l.name || '').replace(/"/g, '""')}"`,
                `"${formatIsraeliPhone(l.phone)}"`,
                `"${l.email || ''}"`,
                `"${(l.city || 'ראש העין').replace(/"/g, '""')}"`,
                `"${(l.address || '').replace(/"/g, '""')}"`,
                `"${l.nusach || 'עדות המזרח'}"`,
                `"${l.totalSpend || 0}"`,
                `"${l.ordersCount || 0}"`,
                `"${l.lastInteraction || l.createdAt || ''}"`,
                `"${(l.source || 'אתר').replace(/"/g, '""')}"`
            ];
            csvContent += row.join(',') + '\n';
        });

        const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `oz_judaica_customers_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ------------------------------------------------------------------------
    // 16. ADD CUSTOMER MANUALLY MODAL
    // ------------------------------------------------------------------------
    window.openAddCustomerModal = function() {
        let modal = document.getElementById('oz-add-cust-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oz-add-cust-modal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 dir-rtl';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 text-right animate-scale-up">
                <h3 class="text-xl font-black text-purple-950">הוספת לקוח חדש למאגר</h3>
                <form onsubmit="saveNewCustomerDirectly(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">שם הלקוח *</label>
                        <input type="text" id="add-cust-name" required class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">מספר טלפון / נייד *</label>
                        <input type="tel" id="add-cust-phone" required placeholder="050-0000000" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600 dir-ltr text-left">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">דוא"ל</label>
                        <input type="email" id="add-cust-email" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600 dir-ltr text-left">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">עיר</label>
                            <input type="text" id="add-cust-city" value="ראש העין" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">נוסח</label>
                            <select id="add-cust-nusach" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                                <option value="עדות המזרח">עדות המזרח</option>
                                <option value="ספרד">ספרד</option>
                                <option value="אשכנז">אשכנז</option>
                                <option value="תימן">תימן</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">כתובת</label>
                        <input type="text" id="add-cust-address" placeholder="רחוב ומספר בית" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                    </div>

                    <div class="flex items-center justify-end gap-2 pt-2">
                        <button type="button" onclick="closeAddCustomerModal()" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer">ביטול</button>
                        <button type="submit" class="px-5 py-2 bg-purple-900 text-white font-bold rounded-xl hover:bg-purple-950 cursor-pointer">שמור לקוח ✓</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.remove('hidden');
    };

    window.closeAddCustomerModal = function() {
        const modal = document.getElementById('oz-add-cust-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.saveNewCustomerDirectly = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        const name = (document.getElementById('add-cust-name').value || '').trim();
        const phone = (document.getElementById('add-cust-phone').value || '').trim();
        const email = (document.getElementById('add-cust-email').value || '').trim();
        const city = (document.getElementById('add-cust-city').value || 'ראש העין').trim();
        const nusach = (document.getElementById('add-cust-nusach').value || 'עדות המזרח').trim();
        const address = (document.getElementById('add-cust-address').value || '').trim();

        if (!name || !phone) {
            alert('אנא הזן שם וטלפון');
            return;
        }

        saveLeadToCRM({
            name: name,
            phone: phone,
            email: email,
            city: city,
            address: address,
            nusach: nusach,
            orderAmount: 0,
            isOrder: false,
            source: 'הוספה ידנית בלוח ניהול'
        });

        closeAddCustomerModal();
        openAdminDashboardModal('customers');
    };

    // ------------------------------------------------------------------------
    // 17. SUPPLIER EDIT MODALS & HELPERS
    // ------------------------------------------------------------------------
    window.handleAdminAuth = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        const pass = document.getElementById('admin-pass-input').value;
        if (authenticateAdmin(pass)) {
            openAdminDashboardModal();
        } else {
            document.getElementById('admin-auth-error').classList.remove('hidden');
        }
    };

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
                <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4 text-right animate-scale-up">
                    <h3 class="text-xl font-black text-purple-950">${supp.id ? 'עריכת פרטי ספק' : 'הוספת ספק חדש'}</h3>
                    <form onsubmit="handleSaveSupplierForm(event, '${supp.id}')" class="space-y-3 text-xs">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">שם הספק *</label>
                            <input type="text" id="supp-form-name" value="${supp.name || ''}" required class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">איש קשר</label>
                                <input type="text" id="supp-form-contact" value="${supp.contact || ''}" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">מספר טלפון / נייד</label>
                                <input type="text" id="supp-form-phone" value="${supp.phone || ''}" placeholder="050-0000000" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600 dir-ltr text-left">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">אופן שליחת הודעות</label>
                                <select id="supp-form-method" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                                    <option value="whatsapp" ${supp.method === 'whatsapp' ? 'selected' : ''}>💬 WhatsApp</option>
                                    <option value="email" ${supp.method === 'email' ? 'selected' : ''}>✉️ Email</option>
                                    <option value="sms" ${supp.method === 'sms' ? 'selected' : ''}>📱 SMS</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">מיקום איסוף / משלוח</label>
                                <input type="text" id="supp-form-location" value="${supp.location || ''}" placeholder="כגון: אלעד / משלוח ישיר" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">
                            </div>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">קישור לאתר הספק</label>
                            <input type="url" id="supp-form-website" value="${supp.website || ''}" placeholder="https://..." class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600 dir-ltr text-left">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">הערות ותנאי עבודה</label>
                            <textarea id="supp-form-notes" rows="2" class="w-full px-3 py-2 border rounded-xl outline-none focus:border-purple-600">${supp.notes || ''}</textarea>
                        </div>

                        <div class="flex items-center justify-end gap-2 pt-2">
                            <button type="button" onclick="closeEditSupplierModalForm()" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer">ביטול</button>
                            <button type="submit" class="px-5 py-2 bg-purple-900 text-white font-bold rounded-xl hover:bg-purple-950 cursor-pointer">שמור ספק ✓</button>
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
        if (e && e.preventDefault) e.preventDefault();
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
        openAdminDashboardModal('suppliers');
    };

    window.confirmDeleteSupplier = function(suppId) {
        if (confirm('האם אתה בטוח שברצונך למחוק ספק זה מהרשימה?')) {
            deleteSupplier(suppId);
            openAdminDashboardModal('suppliers');
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

    // ------------------------------------------------------------------------
    // 18. URL Hash Change Listener (#admin / #terminal / #customers)
    // ------------------------------------------------------------------------
    function checkAdminHash() {
        const hash = window.location.hash;
        if (hash === '#admin') {
            openAdminDashboardModal('terminal');
        } else if (hash === '#terminal') {
            openAdminDashboardModal('terminal');
        } else if (hash === '#customers') {
            openAdminDashboardModal('customers');
        } else if (hash === '#suppliers') {
            openAdminDashboardModal('suppliers');
        }
    }

    window.addEventListener('hashchange', checkAdminHash);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        checkAdminHash();
    } else {
        window.addEventListener('DOMContentLoaded', checkAdminHash);
    }

})();
