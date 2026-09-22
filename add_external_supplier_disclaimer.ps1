$cleanRenderPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js'
$utf8 = New-Object System.Text.UTF8Encoding($false)

$content = [System.IO.File]::ReadAllText($cleanRenderPath, $utf8)

# 1. Add isExternalSupplierProduct helper function if not existing
$helperJs = @"

window.isExternalSupplierProduct = function(p) {
    if (!p) return false;
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const catName = (p.category_name || '').toLowerCase();
    const sub = (p.subcategory || '').toLowerCase();

    return cat === 'tefillin-bags' || cat === 'tallitot-tzitzit' || cat === 'wallets' || cat === 'books' || cat === 'gifts' ||
           name.includes('שמעק') || name.includes('משכן') || name.includes('לבורסה') || name.includes('תמונות') ||
           catName.includes('תיק') || catName.includes('טלית') || catName.includes('ציצית');
};

window.getExternalSupplierNoticeHTML = function(p) {
    if (!isExternalSupplierProduct(p)) return '';
    return `<div class="mt-2.5 text-[10.5px] text-slate-600 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-1.5 leading-tight shadow-sm">
        <span class="text-amber-700 font-bold text-xs shrink-0">ℹ️</span>
        <span><strong>הבהרת אספקה:</strong> מוצר זה מסופק/מיוצר באמצעות ספק מורשה חיצוני. ייתכנו שינויים קלים בלוחות הזמנים של המשלוח בהתאם לזמינות מלאי הספק.</span>
    </div>`;
};
"@

if ($content -notmatch 'isExternalSupplierProduct') {
    $content = $helperJs + "`n" + $content
}

# 2. Add disclosure to openQuickView HTML inside clean_render.js
$qvOld = '<p class="text-xs text-slate-600 leading-relaxed">${p.short_description || p.description || \'\'}</p>'
$qvNew = '<p class="text-xs text-slate-600 leading-relaxed">${p.short_description || p.description || \'\'}</p>${getExternalSupplierNoticeHTML(p)}'

$content = $content.Replace($qvOld, $qvNew)

# 3. Add disclosure to generateProductPageHTML
$pdpOld = '${p.short_description || p.description || \'מוצר איכותי מבית מכון עוז ראש העין. מיוצר ונבדק בקפידה לפי כל דרישות ההלכה והאיכות המרבית.\'}'
$pdpNew = '${p.short_description || p.description || \'מוצר איכותי מבית מכון עוז ראש העין. מיוצר ונבדק בקפידה לפי כל דרישות ההלכה והאיכות המרבית.\'}
                    </p>
                    ${getExternalSupplierNoticeHTML(p)}'

# Adjust tag closing if needed
if ($content.Contains($pdpOld)) {
    $content = $content.Replace($pdpOld + "`n                    </p>", $pdpNew)
}

[System.IO.File]::WriteAllText($cleanRenderPath, $content, $utf8)
Write-Host "Updated clean_render.js with external supplier disclaimer HTML!"
