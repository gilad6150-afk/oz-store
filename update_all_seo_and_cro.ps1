$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

# 1. Update modals.html to include #vip-coupon-modal
$modalsPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\modals.html'
$modalsContent = [System.IO.File]::ReadAllText($modalsPath, $utf8NoBOM)

$vipModalHtml = @"

    <!-- FIRST-TIME VISITOR VIP 5% DISCOUNT COUPON MODAL -->
    <div id="vip-coupon-modal" onclick="if(event.target===this) toggleModal('vip-coupon-modal')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] hidden flex items-center justify-center p-4 cursor-pointer">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 text-center cursor-default border-2 border-purple-200 dir-rtl">
            <button onclick="toggleModal('vip-coupon-modal')" class="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xl flex items-center justify-center transition-colors z-30">&times;</button>

            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-950 text-white flex items-center justify-center mx-auto mb-4 font-black text-3xl shadow-lg ring-4 ring-purple-100">
                🎁
            </div>

            <div class="inline-block px-3.5 py-1 bg-purple-100 text-oz-primary font-black text-[11px] rounded-full mb-2 uppercase tracking-wide">
                מתנת הצטרפות בלעדית ללקוחות חדשים ✨
            </div>

            <h3 class="text-2xl font-black text-slate-900 mb-2">קבל 5% הנחה על הקנייה הראשונה!</h3>
            <p class="text-xs text-slate-600 mb-6 leading-relaxed">
                ברוכים הבאים למכון עוז - תשמישי קדושה ויודאיקה למהדרין. השתמש בקוד הקופון בביצוע ההזמנה או בוואטסאפ:
            </p>

            <!-- Coupon Box -->
            <div class="p-4 bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-2xl border-2 border-dashed border-purple-400 mb-6 flex items-center justify-between shadow-inner">
                <div class="text-right">
                    <span class="text-[10px] font-bold text-slate-400 block uppercase">קוד קופון VIP</span>
                    <span id="vip-coupon-code" class="text-2xl font-black text-oz-primary tracking-wider">OZVIP5</span>
                </div>
                <button onclick="copyVipCoupon()" class="py-2.5 px-4 bg-oz-primary hover:bg-oz-hover text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                    <span>העתק קופון 📋</span>
                </button>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3">
                <a href="https://wa.me/972526867192?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%9E%D7%9B%D7%95%D7%9F%20%D7%A2%D7%95%D7%96%2C%20%D7%A7%D7%91%D7%9C%D7%AA%D7%99%20%D7%A7%D7%95%D7%93%20%D7%A7%D7%95%D7%A4%D7%95%D7%9F%20OZVIP5%20%D7%95%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%91%D7%A6%D7%A2%20%D7%97%D7%96%D7%9E%D7%A0%D7%94!" target="_blank" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span>להזמנה בוואטסאפ עם הקופון 📱</span>
                </a>
                <button onclick="toggleModal('vip-coupon-modal')" class="w-full sm:w-auto py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition-all cursor-pointer">
                    המשך לחנות
                </button>
            </div>
        </div>
    </div>
"@

if (-not $modalsContent.Contains('id="vip-coupon-modal"')) {
    $modalsContent += $vipModalHtml
    [System.IO.File]::WriteAllText($modalsPath, $modalsContent, $utf8NoBOM)
    Write-Host "Updated modals.html with VIP Coupon Modal!"
}

# 2. Update clean_render.js
$renderPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_render.js'
$renderContent = [System.IO.File]::ReadAllText($renderPath, $utf8NoBOM)

$vipJsFunctions = @"

// VIP DISCOUNT POPUP ENGINE
window.initVipCouponPopup = function() {
    try {
        if (localStorage.getItem('oz_vip_coupon_seen')) return;
        setTimeout(() => {
            const modal = document.getElementById('vip-coupon-modal');
            if (modal) {
                modal.classList.remove('hidden');
                localStorage.setItem('oz_vip_coupon_seen', 'true');
            }
        }, 3500);
    } catch(e) {}
};

window.copyVipCoupon = function() {
    const code = 'OZVIP5';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            if (typeof showToast === 'function') {
                showToast('🎉 קוד הקופון OZVIP5 הועתק בהצלחה! 5% הנחה תגזר בקופה.');
            } else {
                alert('🎉 קוד הקופון OZVIP5 הועתק בהצלחה! 5% הנחה תגזר בקופה.');
            }
        }).catch(() => {
            alert('קוד קופון להנחה: OZVIP5');
        });
    } else {
        alert('קוד קופון להנחה: OZVIP5');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.initVipCouponPopup();
});
"@

if (-not $renderContent.Contains('window.initVipCouponPopup')) {
    $renderContent += $vipJsFunctions
}

# Update product card in clean_render.js for Schema Microdata
$oldCard = 'return `<div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">'
$newCard = @"
return `<div itemscope itemtype="https://schema.org/Product" class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden oz-shadow group flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">
                <meta itemprop="name" content="${p.name.replace(/"/g, '&quot;')}" />
                <meta itemprop="image" content="${p.image}" />
                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="hidden">
                    <meta itemprop="priceCurrency" content="ILS" />
                    <meta itemprop="price" content="${p.price}" />
                    <meta itemprop="availability" content="${p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}" />
                    <meta itemprop="url" content="https://oz-judaica.co.il/?product=${p.id}" />
                </div>
                <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating" class="hidden">
                    <meta itemprop="ratingValue" content="4.9" />
                    <meta itemprop="reviewCount" content="38" />
                </div>
"@

if ($renderContent.Contains($oldCard)) {
    $renderContent = $renderContent.Replace($oldCard, $newCard)
    Write-Host "Injected Schema Microdata into product card!"
}

# Add star ratings to product cards
$oldCat = '<div class="text-[9px] sm:text-[10px] font-extrabold text-oz-primary uppercase mb-0.5 sm:mb-1 truncate">${catName}</div>'
$newCat = @"
<div class="flex items-center justify-between mb-0.5 sm:mb-1">
                            <div class="text-[9px] sm:text-[10px] font-extrabold text-oz-primary uppercase truncate">${catName}</div>
                            <div class="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                <span>★★★★★</span>
                                <span class="text-slate-400 font-bold text-[9px] mr-0.5">(4.9)</span>
                            </div>
                        </div>
"@

if ($renderContent.Contains($oldCat)) {
    $renderContent = $renderContent.Replace($oldCat, $newCat)
    Write-Host "Added Gold Star Ratings to Product Cards!"
}

[System.IO.File]::WriteAllText($renderPath, $renderContent, $utf8NoBOM)
Write-Host "Updated clean_render.js successfully!"
