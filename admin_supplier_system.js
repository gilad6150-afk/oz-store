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

    function renderAdminModalContent() {
        const authed = isAdminAuthenticated();
        
        if (!authed) {
            return `
                <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gold/30 text-right space-y-6 animate-fade-in dir-rtl">
                    <div class="text-center space-y-2">
                        <div class="w-16 h-16 bg-navy/10 text-navy rounded-2xl flex items-center justify-center mx-auto text-3xl">🔐</div>
                        <h2 class="text-2xl font-black text-navy">כניסת מנהל - עוז יודאיקה</h2>
                        <p class="text-sm text-neutral-500">אנא הזן סיסמת ניהול כדי להמשיך ללוח הבקרה</p>
                    </div>

                    <form onsubmit="handleAdminAuth(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-navy mb-2">סיסמת מנהל</label>
                            <input type="password" id="admin-pass-input" placeholder="הזן סיסמה..." required
                                class="w-full text-center tracking-widest text-lg px-4 py-3 rounded-xl border border-neutral-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                        </div>
                        <div id="admin-auth-error" class="hidden text-xs text-red-600 text-center font-bold">סיסמה שגויה, אנא נסה שוב.</div>

                        <button type="submit" class="w-full py-3.5 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition">
                            התחבר ללוח הבקרה ←
                        </button>
                    </form>
                    
                    <button onclick="closeAdminDashboardModal()" class="w-full text-xs text-neutral-400 hover:text-neutral-600 text-center block pt-2">
                        סגור חלון
                    </button>
                </div>
            `;
        }

        // Authenticated Dashboard View
        const suppliers = getSuppliers();
        
        return `
            <div class="bg-white rounded-3xl max-w-5xl w-full p-6 md:p-8 shadow-2xl border border-gold/30 text-right space-y-6 max-h-[90vh] overflow-y-auto dir-rtl">
                <!-- Header -->
                <div class="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                        <span class="inline-block px-3 py-1 bg-gold/10 text-gold-dark text-xs font-bold rounded-full mb-1">לוח ניהול מורשה</span>
                        <h2 class="text-2xl font-black text-navy">לוח בקרה מנהל & ניהול ספקים 💼</h2>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="openEditPasswordPrompt()" class="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition">
                            🔑 שינוי סיסמה
                        </button>
                        <button onclick="logoutAdmin()" class="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition">
                            התנתק 🚪
                        </button>
                        <button onclick="closeAdminDashboardModal()" class="w-9 h-9 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center font-bold text-lg hover:bg-neutral-200">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Action Bar -->
                <div class="flex flex-wrap items-center justify-between gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                    <div>
                        <h3 class="font-bold text-navy text-sm">רשימת ספקים ואוטומציית שליחה</h3>
                        <p class="text-xs text-neutral-500">כל ספק מוגדר עם איש קשר, מיקום איסוף/משלוח ואופן שליחת הזמנות ללא פרטי לקוח</p>
                    </div>
                    <button onclick="openEditSupplierModal()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2">
                        <span>+ הוסף ספק חדש</span>
                    </button>
                </div>

                <!-- Supplier Table -->
                <div class="overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-navy text-white font-bold">
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
                        <tbody class="divide-y divide-neutral-200">
                            ${suppliers.map(s => `
                                <tr class="hover:bg-amber-50/50 transition">
                                    <td class="p-3 font-black text-navy">${s.name}</td>
                                    <td class="p-3 font-bold text-neutral-700">${s.contact || '-'}</td>
                                    <td class="p-3 font-mono dir-ltr text-right">${s.phone || s.email || '-'}</td>
                                    <td class="p-3">
                                        <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                            s.method === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                                            s.method === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }">
                                            ${s.method === 'whatsapp' ? '💬 WhatsApp' : s.method === 'email' ? '✉️ Email' : '📱 SMS'}
                                        </span>
                                    </td>
                                    <td class="p-3 font-bold text-amber-900 bg-amber-50/40 rounded-lg">${s.location || '-'}</td>
                                    <td class="p-3">
                                        ${s.website ? `<a href="${s.website}" target="_blank" class="text-blue-600 hover:underline font-semibold">קישור לאתר 🔗</a>` : '-'}
                                    </td>
                                    <td class="p-3 text-neutral-600 max-w-[150px] truncate" title="${s.notes || ''}">${s.notes || '-'}</td>
                                    <td class="p-3">
                                        <div class="flex items-center justify-center gap-1.5">
                                            <button onclick="testDispatchForSupplier('${s.id}')" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] transition" title="בדיקת שליחת הזמנת דוגמה לספק">
                                                🚀 שליחה
                                            </button>
                                            <button onclick="openEditSupplierModal('${s.id}')" class="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg text-[11px] transition">
                                                ✏️ ערוך
                                            </button>
                                            <button onclick="confirmDeleteSupplier('${s.id}')" class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-[11px] transition">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Simulation Info Box -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                    <div class="font-bold flex items-center gap-2">
                        <span>🔒 שמירת פרטיות הלקוחות (Strict Privacy Rule):</span>
                    </div>
                    <p>כאשר לקוח רוכש באתר, ההודעה שנוצרת עבור הספק מכילה **אך ורק** את פירוט המוצר (שם, מידה, כמות) וכתובת היעד למשלוח. מספר הטלפון ושמו של הלקוח אינם מועברים לספק כלל כדי לשמור על הלקוחות אצלך!</p>
                </div>
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
