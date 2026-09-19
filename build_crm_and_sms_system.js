const fs = require('fs');

const pagesCodePath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\pages_code.js';
let pagesCode = fs.readFileSync(pagesCodePath, 'utf8');

const crmEngineCode = `
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
            toast.innerHTML = \`
                <div class="w-10 h-10 rounded-full bg-oz-primary text-white flex items-center justify-center font-black text-lg shrink-0">📱</div>
                <div class="flex-grow">
                    <div class="flex items-center justify-between border-b border-slate-700 pb-1 mb-1">
                        <span class="text-xs font-black text-purple-600">SMS אוטומטי נשלח בהצלחה ל-\${phone}</span>
                        <span class="text-[10px] text-slate-400">עכשיו</span>
                    </div>
                    <p class="text-xs text-slate-200 leading-relaxed font-medium">\${text}</p>
                </div>
            \`;
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

            let subtotal = state.cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
            let discount5 = Math.round(subtotal * 0.05);
            let couponPercent = state.couponPercent || 0;
            let couponDiscount = Math.round(subtotal * (couponPercent / 100));
            let totalDiscount = discount5 + couponDiscount;
            let finalTotal = Math.max(0, subtotal - totalDiscount) + (state.selectedShippingFee || 35);

            saveLeadToCRM({
                name: name,
                phone: phone,
                email: email,
                city: city,
                address: address,
                nusach: nusach,
                orderAmount: finalTotal,
                isOrder: true,
                source: 'רכישה בקופה'
            });

            sendSMSNotification(phone, \`תודה \${name}! הזמנתך בסך ₪\${finalTotal} התקבלה בהצלחה במכון עוז. נעדכן אותך ב-SMS עם מספר המעקב למשלוח: https://oz-judaica.co.il\`);

            alert('🎉 תודה ' + name + '! ההזמנה בסך ₪' + finalTotal + ' נקלטה בהצלחה במאגר הלקוחות של מכון עוז. נשלח אליך SMS עם אישור ההזמנה.');

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

            let html = \`
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
                        <div class="text-2xl font-black text-oz-primary">\${leads.length}</div>
                        <div class="text-[11px] font-bold text-slate-600">סה"כ לידים במאגר</div>
                    </div>
                    <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                        <div class="text-2xl font-black text-emerald-600">\${totalCustomers}</div>
                        <div class="text-[11px] font-bold text-slate-600">לקוחות משלמים</div>
                    </div>
                    <div class="bg-purple-600 p-4 rounded-2xl border border-purple-600 text-center">
                        <div class="text-2xl font-black text-purple-600">₪\${totalRevenue}</div>
                        <div class="text-[11px] font-bold text-slate-600">סה"כ רכישות במאגר</div>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                        <div class="text-2xl font-black text-blue-600">\${leads.filter(l => l.smsOptIn).length}</div>
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
            \`;

            if (leads.length === 0) {
                html += \`<tr><td colspan="7" class="p-8 text-center text-slate-400 font-bold">טרם נקלטו לידים במערכת. הירשם או בצע הזמנה לבדיקה.</td></tr>\`;
            } else {
                leads.forEach(l => {
                    html += \`
                        <tr class="hover:bg-purple-50/40 transition-colors">
                            <td class="p-3 font-bold text-slate-900">\${l.name}</td>
                            <td class="p-3 dir-ltr text-right font-mono font-bold text-slate-700">\${l.phone || '-'}</td>
                            <td class="p-3 text-slate-600">\${l.email || '-'}</td>
                            <td class="p-3"><span class="bg-purple-100 text-oz-primary px-2.5 py-1 rounded-full text-[10px] font-black">\${l.source}</span></td>
                            <td class="p-3 font-extrabold text-emerald-600">₪\${l.totalSpend || 0}</td>
                            <td class="p-3 text-slate-500 text-[11px]">\${l.lastInteraction}</td>
                            <td class="p-3">
                                <button onclick="sendDirectSMS('\${l.phone}', '\${l.name}')" class="px-2.5 py-1 bg-oz-primary text-white rounded-lg text-[11px] font-bold hover:bg-oz-hover">שלח SMS</button>
                            </td>
                        </tr>
                    \`;
                });
            }

            html += \`
                        </tbody>
                    </table>
                </div>
            \`;

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
                let row = [\`"\${l.id}"\`,\`"\${l.name}"\`,\`"\${l.phone}"\`,\`"\${l.email}"\`,\`"\${l.city}"\`,\`"\${l.address}"\`,\`"\${l.nusach}"\`,\`"\${l.source}"\`,\`"\${l.totalSpend}"\`,\`"\${l.ordersCount}"\`,\`"\${l.createdAt}"\`].join(",");
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
            let msg = prompt(\`הכנס הודעת SMS אישית עבור \${name}:\`, \`שלום \${name}! משהו חדש מחכה לך במכון עוז: https://oz-judaica.co.il\`);
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
                alert(\`🎉 קמפיין SMS נשלח בהצלחה ל-\${leads.length} לידים!\`);
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
`;

// Append CRM engine code to pages_code.js
pagesCode += "\n" + crmEngineCode;
fs.writeFileSync(pagesCodePath, pagesCode, 'utf8');
console.log("Appended CRM and SMS Automation engine to pages_code.js!");
