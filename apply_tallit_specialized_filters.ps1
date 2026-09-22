[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

Write-Host "=========================================================="
Write-Host "IMPLEMENTING DEDICATED TALLIT & TZITZIT SPECIALIZED FILTERS"
Write-Host "=========================================================="

# 1. Update layout_frame.html to include tallit filter state variables
$framePath = Join-Path $dir "layout_frame.html"
$frameContent = [System.IO.File]::ReadAllText($framePath, [System.Text.Encoding]::UTF8)

if (-not $frameContent.Contains("tallitFilterCert")) {
    $oldState = "inStockOnly: false,"
    $newState = "inStockOnly: false,`n            tallitFilterCert: 'all',`n            tallitFilterFabric: 'all',`n            tallitFilterModel: 'all',`n            tallitFilterStrings: 'all',`n            tallitFilterSize: 'all',"
    $frameContent = $frameContent.Replace($oldState, $newState)
    [System.IO.File]::WriteAllText($framePath, $frameContent, $utf8)
    Write-Host "✅ Updated layout_frame.html state object!"
}

# 2. Update shop_layout.html to include the specialized filter bar HTML
$shopPath = Join-Path $dir "shop_layout.html"
$shopContent = [System.IO.File]::ReadAllText($shopPath, [System.Text.Encoding]::UTF8)

$tallitBarHtml = @"
                <!-- SPECIALIZED TALLIT & TZITZIT FILTER BAR (SCOPED ONLY TO TALLIT & TZITZIT) -->
                <div id="tallit-specialized-filter-bar" class="hidden pt-4 pb-4 border-t border-purple-100 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-4 sm:p-5 rounded-2xl text-white shadow-xl space-y-4 text-right transition-all">
                    <div class="flex items-center justify-between border-b border-purple-800/60 pb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">✡️</span>
                            <div>
                                <h4 class="font-black text-sm sm:text-base text-amber-300">מסנני איכות מתקדמים לטליתות וציציות (ייחודי למחלקה)</h4>
                                <p class="text-[11px] text-purple-200 font-medium">סינון מתקדם לפי הכשרים, סוגי בד, דגמי אריגה, פתילים ומידות</p>
                            </div>
                        </div>
                        <button type="button" onclick="resetTallitSpecialFilters()" class="text-xs font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-xl border border-white/20 transition-all flex items-center gap-1 cursor-pointer">
                            <span>🔄</span>
                            <span>איפוס מסנני טלית</span>
                        </button>
                    </div>

                    <!-- Filter Select Controls Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                        <!-- 1. Badatz / Certifications -->
                        <div class="space-y-1">
                            <label class="font-extrabold text-purple-200 text-[11px] block">📜 הכשר והשגחה:</label>
                            <select id="tallit-cert-select" onchange="filterTallitSpec('cert', this.value)" class="w-full bg-slate-900 border border-purple-500/40 rounded-xl p-2 text-white font-semibold text-xs outline-none focus:border-amber-400 cursor-pointer">
                                <option value="all">כל ההכשרים</option>
                                <option value="העדה החרדית">בד"ץ העדה החרדית</option>
                                <option value="בית יוסף">בד"ץ בית יוסף</option>
                                <option value="לנדא">הרב לנדא</option>
                                <option value="מחפוד">הרב מחפוד</option>
                            </select>
                        </div>

                        <!-- 2. Fabric Type -->
                        <div class="space-y-1">
                            <label class="font-extrabold text-purple-200 text-[11px] block">🧶 סוג בד וחומר:</label>
                            <select id="tallit-fabric-select" onchange="filterTallitSpec('fabric', this.value)" class="w-full bg-slate-900 border border-purple-500/40 rounded-xl p-2 text-white font-semibold text-xs outline-none focus:border-amber-400 cursor-pointer">
                                <option value="all">כל סוגי הבדים</option>
                                <option value="צמר">100% צמר רחלים</option>
                                <option value="כותנה">100% כותנה</option>
                                <option value="דרייפיט">Dry-Fit (מנדף זיעה)</option>
                                <option value="גופיה">גופיית ציצית</option>
                            </select>
                        </div>

                        <!-- 3. Model / Weave -->
                        <div class="space-y-1">
                            <label class="font-extrabold text-purple-200 text-[11px] block">🎨 סגנון אריגה ודגם:</label>
                            <select id="tallit-model-select" onchange="filterTallitSpec('model', this.value)" class="w-full bg-slate-900 border border-purple-500/40 rounded-xl p-2 text-white font-semibold text-xs outline-none focus:border-amber-400 cursor-pointer">
                                <option value="all">כל הדגמים</option>
                                <option value="תשבץ">תשבץ (מונע החלקה)</option>
                                <option value="פאר קל">פאר קל (דוחה כתמים)</option>
                                <option value="בית יוסף">בית יוסף</option>
                                <option value="חבד">חב"ד</option>
                                <option value="בני אור">בני אור</option>
                                <option value="מעלות">מעלות</option>
                            </select>
                        </div>

                        <!-- 4. Strings & Tying -->
                        <div class="space-y-1">
                            <label class="font-extrabold text-purple-200 text-[11px] block">🧵 פתילים וקשירות:</label>
                            <select id="tallit-strings-select" onchange="filterTallitSpec('strings', this.value)" class="w-full bg-slate-900 border border-purple-500/40 rounded-xl p-2 text-white font-semibold text-xs outline-none focus:border-amber-400 cursor-pointer">
                                <option value="all">כל סוגי הקשירות</option>
                                <option value="תכלת">פתיל תכלת</option>
                                <option value="עבודת יד">עבודת יד (לשמה)</option>
                                <option value="מכונה">מכונה מהודרת</option>
                                <option value="חבד">קשירת חב"ד</option>
                                <option value="ספרדי">קשירה ספרדית</option>
                            </select>
                        </div>

                        <!-- 5. Size Selection -->
                        <div class="space-y-1">
                            <label class="font-extrabold text-purple-200 text-[11px] block">📐 מידה מבוקשת:</label>
                            <select id="tallit-size-select" onchange="filterTallitSpec('size', this.value)" class="w-full bg-slate-900 border border-purple-500/40 rounded-xl p-2 text-white font-semibold text-xs outline-none focus:border-amber-400 cursor-pointer">
                                <option value="all">כל המידות</option>
                                <option value="45">מידה 45</option>
                                <option value="50">מידה 50</option>
                                <option value="55">מידה 55</option>
                                <option value="60">מידה 60</option>
                                <option value="70">מידה 70</option>
                                <option value="80">מידה 80</option>
                                <option value="S">S / ילדים</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>
                    </div>
                </div>
"@

if (-not $shopContent.Contains("tallit-specialized-filter-bar")) {
    $targetTag = '<div id="tallit-subcategories"'
    $shopContent = $shopContent.Replace($targetTag, $tallitBarHtml + "`n`n                " + $targetTag)
    [System.IO.File]::WriteAllText($shopPath, $shopContent, $utf8)
    Write-Host "✅ Injected tallit-specialized-filter-bar into shop_layout.html!"
}

# 3. Update clean_render.js with filterTallitSpec, resetTallitSpecialFilters, and visibility scoping logic
$jsPath = Join-Path $dir "clean_render.js"
$jsContent = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)

$specialFns = @"

function filterTallitSpec(type, val) {
    if (!state) return;
    if (type === 'cert') state.tallitFilterCert = val;
    if (type === 'fabric') state.tallitFilterFabric = val;
    if (type === 'model') state.tallitFilterModel = val;
    if (type === 'strings') state.tallitFilterStrings = val;
    if (type === 'size') state.tallitFilterSize = val;
    renderProducts();
}

function resetTallitSpecialFilters() {
    if (!state) return;
    state.tallitFilterCert = 'all';
    state.tallitFilterFabric = 'all';
    state.tallitFilterModel = 'all';
    state.tallitFilterStrings = 'all';
    state.tallitFilterSize = 'all';

    const c = document.getElementById('tallit-cert-select');
    const f = document.getElementById('tallit-fabric-select');
    const m = document.getElementById('tallit-model-select');
    const st = document.getElementById('tallit-strings-select');
    const sz = document.getElementById('tallit-size-select');
    if (c) c.value = 'all';
    if (f) f.value = 'all';
    if (m) m.value = 'all';
    if (st) st.value = 'all';
    if (sz) sz.value = 'all';

    renderProducts();
}
"@

if (-not $jsContent.Contains("filterTallitSpec")) {
    $jsContent += "`n" + $specialFns
}

# Update filterCategory to toggle tallitBar visibility based on selected category
if (-not $jsContent.Contains("tallit-specialized-filter-bar")) {
    $oldFilterCategory = "function filterCategory(cat, btn) {"
    $newFilterCategory = @"
function filterCategory(cat, btn) {
    state.selectedCategory = cat;
    const isTallitCat = (cat === 'tallitot-tzitzit' || cat.startsWith('tallit-') || cat.startsWith('tzitzit-'));
    const tallitBar = document.getElementById('tallit-specialized-filter-bar');
    if (tallitBar) {
        if (isTallitCat) {
            tallitBar.classList.remove('hidden');
        } else {
            tallitBar.classList.add('hidden');
        }
    }
"@
    $jsContent = $jsContent.Replace($oldFilterCategory, $newFilterCategory)
}

# Update renderProducts tallit filtering logic inside clean_render.js
$oldTallitBlock = "else if (state.selectedCategory === 'tallitot-tzitzit' || state.selectedCategory.startsWith('tallit-')) {"
if ($jsContent.Contains($oldTallitBlock) -and -not $jsContent.Contains("state.tallitFilterCert !== 'all'")) {
    $newTallitBlock = @"
else if (state.selectedCategory === 'tallitot-tzitzit' || state.selectedCategory.startsWith('tallit-') || state.selectedCategory.startsWith('tzitzit-')) {
                const isTallit = pCat === 'tallitot-tzitzit' || pCatName.includes('טלית') || pCatName.includes('ציצית') || pName.includes('טלית') || pName.includes('ציצית');
                if (!isTallit) return false;

                const pDesc = (p.short_description || '').toLowerCase();
                const pN = pName.toLowerCase();

                if (state.tallitFilterCert && state.tallitFilterCert !== 'all') {
                    const cert = state.tallitFilterCert.toLowerCase();
                    if (!pN.includes(cert) && !pDesc.includes(cert)) return false;
                }
                if (state.tallitFilterFabric && state.tallitFilterFabric !== 'all') {
                    const fab = state.tallitFilterFabric.toLowerCase();
                    if (!pN.includes(fab) && !pDesc.includes(fab)) return false;
                }
                if (state.tallitFilterModel && state.tallitFilterModel !== 'all') {
                    const mod = state.tallitFilterModel.toLowerCase();
                    if (!pN.includes(mod) && !pDesc.includes(mod)) return false;
                }
                if (state.tallitFilterStrings && state.tallitFilterStrings !== 'all') {
                    const str = state.tallitFilterStrings.toLowerCase();
                    if (!pN.includes(str) && !pDesc.includes(str)) return false;
                }
                if (state.tallitFilterSize && state.tallitFilterSize !== 'all') {
                    const sz = state.tallitFilterSize.toLowerCase();
                    if (!pN.includes(sz) && !pDesc.includes(sz)) return false;
                }
"@
    $jsContent = $jsContent.Replace($oldTallitBlock, $newTallitBlock)
}

# Also update resetFilters function to reset tallit special filters
if (-not $jsContent.Contains("resetTallitSpecialFilters();")) {
    $jsContent = $jsContent.Replace("function resetFilters() {", "function resetFilters() {`n    resetTallitSpecialFilters();")
}

[System.IO.File]::WriteAllText($jsPath, $jsContent, $utf8)
Write-Host "✅ Updated clean_render.js with specialized filter functions and scoped visibility!"

# 4. Rebuild master site index.html
Write-Host "`n[Step 4] Rebuilding master site index.html..."
powershell -ExecutionPolicy Bypass -File rebuild_master_site.ps1

Write-Host "`n=========================================================="
Write-Host "SPECIALIZED TALLIT FILTERS IMPLEMENTED AND REBUILT!"
Write-Host "=========================================================="
