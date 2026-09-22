const fs = require('fs');

const cleanRenderPath = 'C:\\Users\\97254\\.gemini\\antigravity\\scratch\\oz-store\\clean_render.js';
let content = fs.readFileSync(cleanRenderPath, 'utf8');

const helperJs = `
window.isExternalSupplierProduct = function(p) {
    if (!p) return false;
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const catName = (p.category_name || '').toLowerCase();

    return cat === 'tefillin-bags' || cat === 'tallitot-tzitzit' || cat === 'wallets' || cat === 'books' || cat === 'gifts' ||
           name.includes('שמעק') || name.includes('משכן') || name.includes('לבורסה') || name.includes('תמונות') ||
           catName.includes('תיק') || catName.includes('טלית') || catName.includes('ציצית');
};

window.getExternalSupplierNoticeHTML = function(p) {
    if (!isExternalSupplierProduct(p)) return '';
    return '<div class="mt-2.5 text-[10.5px] text-slate-600 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-1.5 leading-tight shadow-sm"><span class="text-amber-700 font-bold text-xs shrink-0">ℹ️</span><span><strong>הבהרת אספקה:</strong> מוצר זה מסופק/מיוצר באמצעות ספק מורשה חיצוני. ייתכנו שינויים קלים בלוחות הזמנים של המשלוח בהתאם לזמינות מלאי הספק.</span></div>';
};
`;

if (!content.includes('isExternalSupplierProduct')) {
    content = helperJs + '\n' + content;
}

// 1. QuickView modal disclaimer
const qvTarget = `<p class="text-xs text-slate-600 leading-relaxed">\${p.short_description || p.description || ''}</p>`;
const qvReplacement = `<p class="text-xs text-slate-600 leading-relaxed">\${p.short_description || p.description || ''}</p>\${getExternalSupplierNoticeHTML(p)}`;

if (content.includes(qvTarget)) {
    content = content.replace(qvTarget, qvReplacement);
    console.log('Successfully added disclaimer to QuickView modal');
}

// 2. Product Detail Page (PDP) disclaimer
const pdpTarget = `\${p.short_description || p.description || 'מוצר איכותי מבית מכון עוז ראש העין. מיוצר ונבדק בקפידה לפי כל דרישות ההלכה והאיכות המרבית.'}\n                    </p>`;
const pdpReplacement = `\${p.short_description || p.description || 'מוצר איכותי מבית מכון עוז ראש העין. מיוצר ונבדק בקפידה לפי כל דרישות ההלכה והאיכות המרבית.'}\n                    </p>\n                    \${getExternalSupplierNoticeHTML(p)}`;

if (content.includes(pdpTarget)) {
    content = content.replace(pdpTarget, pdpReplacement);
    console.log('Successfully added disclaimer to PDP page');
}

fs.writeFileSync(cleanRenderPath, content, 'utf8');
console.log('Saved clean_render.js cleanly!');
