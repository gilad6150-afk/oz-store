import os

clean_render_path = r"C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js"

with open(clean_render_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Engraving State & Functions
engraving_functions = """
// ==========================================
// PERSONALIZED ENGRAVING & EMBROIDERY LIVE ENGINE
// ==========================================
let pdpEngravingState = { enabled: false, text: '', style: 'gold_foil', price: 29 };

function resetPDPEngravingState() {
    pdpEngravingState = { enabled: false, text: '', style: 'gold_foil', price: 29 };
}

function togglePDPEngraving(enabled) {
    pdpEngravingState.enabled = enabled;
    const controls = document.getElementById('pdp-engraving-controls');
    const overlay = document.getElementById('pdp-engraving-live-overlay');
    if (controls) controls.classList.toggle('hidden', !enabled);
    if (overlay) overlay.classList.toggle('hidden', !enabled || !pdpEngravingState.text.trim());
}

function updatePDPEngravingText(text) {
    pdpEngravingState.text = text || '';
    const liveText = document.getElementById('pdp-engraving-live-text');
    const overlay = document.getElementById('pdp-engraving-live-overlay');
    if (liveText) liveText.textContent = pdpEngravingState.text.trim() || 'ישראל ישראלי';
    if (overlay) overlay.classList.toggle('hidden', !pdpEngravingState.enabled || !pdpEngravingState.text.trim());
}

function selectPDPEngravingStyle(style) {
    pdpEngravingState.style = style;
    const liveText = document.getElementById('pdp-engraving-live-text');
    if (liveText) {
        if (style === 'silver_foil') {
            liveText.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #CFD8DC 50%, #ECEFF1 100%)';
        } else if (style === 'gold_embroidery') {
            liveText.style.background = 'linear-gradient(135deg, #FFF176 0%, #F57F17 50%, #FFEE58 100%)';
        } else {
            liveText.style.background = 'linear-gradient(135deg, #FFE082 0%, #FFB300 50%, #FFF8E1 100%)';
        }
        liveText.style.webkitBackgroundClip = 'text';
        liveText.style.webkitTextFillColor = 'transparent';
    }

    document.querySelectorAll('.pdp-style-btn').forEach(btn => {
        const btnStyle = btn.getAttribute('data-style');
        if (btnStyle === style) {
            btn.className = 'pdp-style-btn p-2 rounded-xl border-2 border-amber-500 ring-2 ring-amber-500 bg-amber-100 text-amber-950 font-black transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer';
        } else {
            btn.className = 'pdp-style-btn p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer';
        }
    });
}
"""

if "let pdpEngravingState" not in content:
    content += "\n" + engraving_functions

# 2. Add Live Engraving Overlay to Main Image in PDP
pdp_img_target = '<img id="pdp-main-img" src="${p.images && p.images.length ? p.images[0] : p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />'
pdp_img_replacement = pdp_img_target + """
                        <div id="pdp-engraving-live-overlay" class="hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-400/50 shadow-2xl text-center transition-all pointer-events-none z-20">
                            <span id="pdp-engraving-live-text" class="text-sm sm:text-base font-black tracking-wider leading-none" style="background: linear-gradient(135deg, #FFE082 0%, #FFB300 50%, #FFF8E1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.9));">
                                ישראל ישראלי
                            </span>
                        </div>"""

if pdp_img_target in content and "pdp-engraving-live-overlay" not in content:
    content = content.replace(pdp_img_target, pdp_img_replacement)

# 3. Add Engraving Box to PDP Right Before Quantity Box
pdp_qty_target = '<!-- Quantity & Action Buttons -->'
pdp_engraving_box_html = """<!-- Personalized Engraving & Embroidery Live Selector -->
                    <div class="p-4 bg-gradient-to-br from-amber-50/90 via-purple-50/40 to-amber-50/90 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3 text-right dir-rtl">
                        <div class="flex items-center justify-between">
                            <label class="flex items-center gap-2 cursor-pointer font-black text-xs text-slate-900">
                                <input type="checkbox" id="pdp-engraving-toggle" onchange="togglePDPEngraving(this.checked)" class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer" />
                                <span class="flex items-center gap-1.5">✍️ הוסף חריטה / רקמה אישית בלייב</span>
                            </label>
                            <span class="text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-sm">+₪29 בלבד</span>
                        </div>

                        <div id="pdp-engraving-controls" class="hidden space-y-2.5 pt-1">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-700 mb-1">הקלד שם או הקדשה להדמיה בלייב:</label>
                                <input type="text" id="pdp-engraving-input" oninput="updatePDPEngravingText(this.value)" placeholder="למשל: ישראל ישראלי" maxlength="30" class="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all shadow-inner" />
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-700 mb-1">בחר גוון / סגנון חריטה:</label>
                                <div class="grid grid-cols-3 gap-2 text-[11px] font-bold">
                                    <button type="button" onclick="selectPDPEngravingStyle('gold_foil')" class="pdp-style-btn p-2 rounded-xl border-2 border-amber-500 ring-2 ring-amber-500 bg-amber-100 text-amber-950 font-black transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer" data-style="gold_foil">
                                        <span>🌟 זהב</span>
                                    </button>
                                    <button type="button" onclick="selectPDPEngravingStyle('silver_foil')" class="pdp-style-btn p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer" data-style="silver_foil">
                                        <span>🪙 כסף</span>
                                    </button>
                                    <button type="button" onclick="selectPDPEngravingStyle('gold_embroidery')" class="pdp-style-btn p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 transition-all flex items-center justify-center gap-1 cursor-pointer" data-style="gold_embroidery">
                                        <span>🧵 רקמה</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    """ + pdp_qty_target

if pdp_qty_target in content and "pdp-engraving-controls" not in content:
    content = content.replace(pdp_qty_target, pdp_engraving_box_html)

# 4. Replace addToCartFromPDP implementation to handle Engraving
old_add_to_cart_pdp = """function addToCartFromPDP(id) {
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;
    const existing = state.cart.find(i => String(i.id) === String(id));
    if (existing) {
        existing.qty += pdpSelectedQty;
    } else {
        state.cart.push({ ...p, qty: pdpSelectedQty });
    }
    updateCartUI();
    showToast('🎉 הוסף לסל: ' + p.name + ' (x' + pdpSelectedQty + ')');
    toggleCartDrawer();
}"""

new_add_to_cart_pdp = """function addToCartFromPDP(id) {
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;

    if (pdpEngravingState.enabled && pdpEngravingState.text.trim()) {
        const engravingText = pdpEngravingState.text.trim();
        const styleLabel = pdpEngravingState.style === 'silver_foil' ? 'חריטת כסף' : (pdpEngravingState.style === 'gold_embroidery' ? 'רקמת זהב' : 'חריטת זהב');
        const customizedItem = {
            ...p,
            id: p.id + '_eng_' + Date.now(),
            name: p.name + ' (כולל הקדשה)',
            price: p.price + 29,
            originalPrice: p.price,
            engraving: {
                text: engravingText,
                style: pdpEngravingState.style,
                label: styleLabel,
                price: 29
            },
            qty: pdpSelectedQty
        };
        state.cart.push(customizedItem);
        showToast('🎉 הוסף לסל: ' + p.name + ' כולל ' + styleLabel + ' ("' + engravingText + '")');
    } else {
        const existing = state.cart.find(i => String(i.id) === String(id) && !i.engraving);
        if (existing) {
            existing.qty += pdpSelectedQty;
        } else {
            state.cart.push({ ...p, qty: pdpSelectedQty });
        }
        showToast('🎉 הוסף לסל: ' + p.name + ' (x' + pdpSelectedQty + ')');
    }
    
    updateCartUI();
    toggleCartDrawer();
}"""

if old_add_to_cart_pdp in content:
    content = content.replace(old_add_to_cart_pdp, new_add_to_cart_pdp)

# 5. Add engraving badge to cart drawer item rendering in updateCartUI
cart_item_title_target = '<h4 class="font-black text-xs text-slate-800 truncate">${item.name}</h4>'
cart_item_title_replacement = cart_item_title_target + """
                        ${item.engraving ? `<div class="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 mt-0.5 inline-block">✍️ הקדשה: "${item.engraving.text}" (${item.engraving.label})</div>` : ''}"""

if cart_item_title_target in content and "✍️ הקדשה" not in content:
    content = content.replace(cart_item_title_target, cart_item_title_replacement)

# 6. Reset Engraving State in openProductPage
open_pdp_target = "pdpSelectedQty = 1;"
open_pdp_replacement = "pdpSelectedQty = 1;\n    resetPDPEngravingState();"
if open_pdp_target in content and "resetPDPEngravingState" not in content:
    content = content.replace(open_pdp_target, open_pdp_replacement)

with open(clean_render_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Personalized Engraving & Embroidery Live engine applied to clean_render.js!")
