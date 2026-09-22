$cleanRenderPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js'
$labelsPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\labels.json'
$utf8 = New-Object System.Text.UTF8Encoding($false)

$rawJs = [System.IO.File]::ReadAllText($cleanRenderPath, $utf8)

$disclaimerFunction = @"

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
    return '<div class="mt-2 text-[10.5px] text-amber-950 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-1.5 leading-tight shadow-sm"><span class="text-amber-700 font-bold text-xs shrink-0">ℹ️</span><span><strong>הבהרת אספקה:</strong> מוצר זה מסופק/מיוצר באמצעות ספק מורשה חיצוני. ייתכנו שינויים קלים בלוחות הזמנים של המשלוח בהתאם לזמינות מלאי הספק.</span></div>';
};
"@

if (-not $rawJs.Contains('isExternalSupplierProduct')) {
    $rawJs = $disclaimerFunction + "`n" + $rawJs
}

# Update QuickView
$target1 = 'p.short_description || p.description || ' + "''"
if ($rawJs.Contains($target1)) {
    $rawJs = $rawJs.Replace('<p class="text-xs text-slate-600 leading-relaxed">${' + $target1 + '}</p>', '<p class="text-xs text-slate-600 leading-relaxed">${' + $target1 + '}</p>${getExternalSupplierNoticeHTML(p)}')
}

[System.IO.File]::WriteAllText($cleanRenderPath, $rawJs, $utf8)
Write-Host "Updated clean_render.js with supplier disclaimer!"
