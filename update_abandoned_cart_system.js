const fs = require('fs');

const pagesCodePath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\pages_code.js';
let content = fs.readFileSync(pagesCodePath, 'utf8');

// 1. Add Abandoned Cart System Core Functions if not already present
const abandonedCartCode = `
        // ==========================================
        // ABANDONED CART RECOVERY SYSTEM (אוטומציית שחזור סלים נטושים)
        // ==========================================
        window.trackAbandonedCart = function(customName, customPhone) {
            if (!window.state || !state.cart || state.cart.length === 0) {
                try { localStorage.removeItem('oz_abandoned_cart'); } catch(e){}
                return;
            }
            const nameInput = document.getElementById('checkout-name');
            const phoneInput = document.getElementById('checkout-phone');
            const name = customName || (nameInput ? nameInput.value.trim() : '') || (state.user ? state.user.name : '') || '';
            const phone = customPhone || (phoneInput ? phoneInput.value.trim() : '') || (state.user ? (state.user.phone || state.user.contact) : '') || '';
            
            const items = state.cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, image: i.image }));
            const total = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
            
            const abandonedData = {
                id: 'ab_' + Date.now(),
                timestamp: Date.now(),
                dateStr: new Date().toLocaleString('he-IL'),
                name: name || 'גולש אורח',
                phone: phone || '',
                items: items,
                total: total,
                status: 'pending'
            };

            try {
                localStorage.setItem('oz_abandoned_cart', JSON.stringify(abandonedData));
            } catch(e){}

            // Update CRM Abandoned Carts log
            try {
                let crmCarts = JSON.parse(localStorage.getItem('oz_crm_abandoned_carts') || '[]');
                let idx = crmCarts.findIndex(c => (phone && c.phone === phone) || (c.name === name && c.name !== 'גולש אורח' && c.status === 'pending'));
                if (idx !== -1) {
                    crmCarts[idx] = { ...crmCarts[idx], items, total, dateStr: abandonedData.dateStr, timestamp: Date.now() };
                } else {
                    crmCarts.unshift(abandonedData);
                }
                localStorage.setItem('oz_crm_abandoned_carts', JSON.stringify(crmCarts.slice(0, 50)));
            } catch(e){}
        };

        window.clearAbandonedCartOnOrder = function() {
            try {
                localStorage.removeItem('oz_abandoned_cart');
                let crmCarts = JSON.parse(localStorage.getItem('oz_crm_abandoned_carts') || '[]');
                let phoneInput = document.getElementById('checkout-phone')?.value || '';
                let nameInput = document.getElementById('checkout-name')?.value || '';
                crmCarts.forEach(c => {
                    if ((phoneInput && c.phone === phoneInput) || (nameInput && c.name === nameInput) || c.status === 'pending') {
                        c.status = 'recovered';
                    }
                });
                localStorage.setItem('oz_crm_abandoned_carts', JSON.stringify(crmCarts));
            } catch(e){}
        };

        window.checkAbandonedCartRecoveryOnLoad = function() {
            try {
                const saved = localStorage.getItem('oz_abandoned_cart');
                if (!saved) return;
                const abandonedData = JSON.parse(saved);
                if (!abandonedData || !abandonedData.items || abandonedData.items.length === 0) return;
                
                // If current cart is empty, restore items
                if (!state.cart || state.cart.length === 0) {
                    state.cart = abandonedData.items;
                    if (typeof updateCartUI === 'function') updateCartUI();
                }

                // Render non-intrusive recovery notification banner
                if (document.getElementById('abandoned-cart-banner')) return;
                const banner = document.createElement('div');
                banner.id = 'abandoned-cart-banner';
                banner.className = 'fixed top-20 right-4 sm:top-24 sm:right-6 z-[9999999] bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-purple-400 max-w-sm w-full dir-rtl flex items-center justify-between gap-3 animate-toast';
                banner.innerHTML = \`
                    <div class="flex items-center gap-2.5">
                        <span class="text-2xl">🛒</span>
                        <div>
                            <h4 class="font-black text-xs text-purple-200">שמרנו את הסל שלך!</h4>
                            <p class="text-[11px] text-slate-200 font-medium">\${abandonedData.name && abandonedData.name !== 'גולש אורח' ? 'שלום ' + abandonedData.name + ', ' : ''}\${abandonedData.items.length} פריטים (₪\${abandonedData.total}) מחכים לך בסל</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button onclick="openCheckoutModal(); document.getElementById('abandoned-cart-banner')?.remove();" class="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer">
                            להשלמה ⚡
                        </button>
                        <button onclick="document.getElementById('abandoned-cart-banner')?.remove();" class="text-slate-400 hover:text-white font-bold text-sm px-1.5">&times;</button>
                    </div>
                \`;
                document.body.appendChild(banner);
                setTimeout(() => {
                    banner.classList.add('opacity-0', 'transition-opacity');
                    setTimeout(() => banner.remove(), 500);
                }, 15000);
            } catch(e){}
        };

        window.sendWhatsAppCartRecovery = function(cartId) {
            try {
                let crmCarts = JSON.parse(localStorage.getItem('oz_crm_abandoned_carts') || '[]');
                let cart = crmCarts.find(c => c.id === cartId || String(c.timestamp) === String(cartId));
                if (!cart) {
                    alert('סל נטוש לא נמצא');
                    return;
                }

                let phone = (cart.phone || '052-686-7192').replace(/[^0-9]/g, '');
                if (phone.startsWith('0')) {
                    phone = '972' + phone.substring(1);
                }
                
                const itemNames = cart.items ? cart.items.map(i => i.name).join(', ') : 'מוצרי קודש';
                const nameStr = cart.name && cart.name !== 'גולש אורח' ? \`שלום \${cart.name}\` : 'שלום יקר';
                
                const message = \`\${nameStr}, ראינו ששמרת סל קניות במכון עוז (\${itemNames} בסך ₪\${cart.total}). 🛒\\nהאם תרצה שנעזור לך להשלים את ההזמנה בביטחון עם משלוח מהיר?\\n\\nלחץ כאן לחזרה לסל הקניות שלך:\\nhttps://oz-judaica.co.il\`;
                
                cart.status = 'reminder_sent';
                localStorage.setItem('oz_crm_abandoned_carts', JSON.stringify(crmCarts));

                const waUrl = \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
                window.open(waUrl, '_blank');
                
                if (typeof renderCRMModal === 'function') renderCRMModal();
            } catch(e) {
                console.error(e);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(window.checkAbandonedCartRecoveryOnLoad, 1200));
        } else {
            setTimeout(window.checkAbandonedCartRecoveryOnLoad, 1200);
        }
`;

if (!content.includes('window.trackAbandonedCart')) {
    content += '\n' + abandonedCartCode;
}

// 2. Ensure clearAbandonedCartOnOrder is called in handleCompleteOrder
if (content.includes('window.handleCompleteOrder = function(e) {')) {
    content = content.replace(
        'window.handleCompleteOrder = function(e) {',
        'window.handleCompleteOrder = function(e) {\n            if (typeof clearAbandonedCartOnOrder === "function") clearAbandonedCartOnOrder();'
    );
}

// 3. Add input listener bindings for checkout form in renderCheckoutModal
if (content.includes('id="checkout-name"')) {
    content = content.replace(
        'id="checkout-name" required',
        'id="checkout-name" oninput="if(typeof trackAbandonedCart===\'function\') trackAbandonedCart()" required'
    );
}
if (content.includes('id="checkout-phone"')) {
    content = content.replace(
        'id="checkout-phone" required',
        'id="checkout-phone" oninput="if(typeof trackAbandonedCart===\'function\') trackAbandonedCart()" required'
    );
}

// 4. Enhance renderCRMModal with Abandoned Carts Table
const crmTableInsertMarker = 'container.innerHTML = html;';
const crmAbandonedSectionCode = `
            // ABANDONED CARTS SECTION
            let crmCarts = [];
            try { crmCarts = JSON.parse(localStorage.getItem('oz_crm_abandoned_carts') || '[]'); } catch(e){}
            let pendingCarts = crmCarts.filter(c => c.status !== 'recovered');
            let pendingRevenue = pendingCarts.reduce((acc, c) => acc + (c.total || 0), 0);

            html += \`
                <div class="mt-8 pt-6 border-t-2 border-purple-100 dir-rtl">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2.5">
                            <span class="text-2xl">🛒</span>
                            <div>
                                <h4 class="font-black text-base text-slate-900 flex items-center gap-2">
                                    <span>סלים נטושים ושחזור בלחיצה (Abandoned Cart Recovery)</span>
                                    <span class="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">\${pendingCarts.length} סלים ממתינים</span>
                                </h4>
                                <p class="text-xs text-slate-500">שליחת תזכורת WhatsApp / SMS חכמה ומעוצבת להחזרת 15%-25% מהלקוחות שנטשו</p>
                            </div>
                        </div>
                        <div class="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-black text-amber-900">
                            פוטנציאל הכנסה נטושה: ₪\${pendingRevenue}
                        </div>
                    </div>

                    <div class="overflow-x-auto max-h-64 overflow-y-auto rounded-2xl border border-purple-100 bg-white shadow-sm">
                        <table class="w-full text-right text-xs">
                            <thead class="bg-purple-50 text-slate-700 font-black sticky top-0 border-b border-purple-200">
                                <tr>
                                    <th class="p-3">שם הלקוח</th>
                                    <th class="p-3">טלפון</th>
                                    <th class="p-3">פריטים בסל</th>
                                    <th class="p-3">סה"כ סל</th>
                                    <th class="p-3">תאריך נטישה</th>
                                    <th class="p-3">סטטוס</th>
                                    <th class="p-3">פעולת שחזור 🚀</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 font-medium">
            \`;

            if (crmCarts.length === 0) {
                html += \`<tr><td colspan="7" class="p-6 text-center text-slate-400 font-bold">טרם נרשמו סלים נטושים במערכת. הוסף מוצר לסל לבדיקה.</td></tr>\`;
            } else {
                crmCarts.forEach(c => {
                    const itemNames = c.items ? c.items.map(i => i.name).join(', ') : 'מוצרים בסל';
                    const statusBadge = c.status === 'recovered'
                        ? \`<span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-black">שוחזר ונקנה 🎉</span>\`
                        : (c.status === 'reminder_sent'
                            ? \`<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-black">נשלחה תזכורת 💬</span>\`
                            : \`<span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-black">ממתין לתזכורת ⏳</span>\`);

                    html += \`
                        <tr class="hover:bg-purple-50/50 transition-colors">
                            <td class="p-3 font-bold text-slate-900">\${c.name || 'גולש אורח'}</td>
                            <td class="p-3 dir-ltr text-right font-mono font-bold text-slate-700">\${c.phone || '-'}</td>
                            <td class="p-3 text-slate-600 max-w-xs truncate" title="\${itemNames}">\${itemNames}</td>
                            <td class="p-3 font-extrabold text-oz-primary">₪\${c.total || 0}</td>
                            <td class="p-3 text-slate-500 text-[11px]">\${c.dateStr || '-'}</td>
                            <td class="p-3">\${statusBadge}</td>
                            <td class="p-3 flex items-center gap-1.5">
                                <button onclick="sendWhatsAppCartRecovery('\${c.id}')" class="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer">
                                    <span>💬 WhatsApp</span>
                                </button>
                                <button onclick="sendDirectSMS('\${c.phone}', '\${c.name || 'לקוח'}')" class="py-1 px-2 bg-slate-700 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition-all">
                                    📱 SMS
                                </button>
                            </td>
                        </tr>
                    \`;
                });
            }

            html += \`
                            </tbody>
                        </table>
                    </div>
                </div>
            \`;
            container.innerHTML = html;
`;

if (!content.includes('ABANDONED CARTS SECTION')) {
    content = content.replace(crmTableInsertMarker, crmAbandonedSectionCode);
}

fs.writeFileSync(pagesCodePath, content, 'utf8');
console.log("SUCCESS: Updated pages_code.js with Abandoned Cart Recovery System!");
