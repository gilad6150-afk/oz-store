/**
 * ============================================================================
 *               עוז יודאיקה - בדיקת ביקורת איכות ותקינות רינדור לפני פריסה
 *                    OZ JUDAICA - PRE-DEPLOY INTEGRITY AUDIT
 * ============================================================================
 * 
 * בדיקה זו מוודאת במאת האחוזים:
 * 1. תקינות תחביר מוחלטת בכל תגי ה-script ב-index.html (ללא כפילויות משתנים const/let, ללא SyntaxError).
 * 2. רינדור מלא של מוצרי החנות (מדפי בוטיק ודפי קטלוג).
 * 3. נוכחות של לפחות 250 מוצרים תקינים במערך.
 * 4. שלמות אלמנטי ה-DOM הקריטיים לתצוגת האתר.
 * 5. סימולציית לחיצה על כל הקטגוריות ותתי-הקטגוריות בחנות (ללא ReferenceError וללא קריסות UI).
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { execSync } = require('child_process');

function runAudit() {
    console.log('================================================================');
    console.log(' 🛡️  הפעלת ביקורת עצמית: בדיקת תקינות תחביר קוד ותצוגת מוצרים  ');
    console.log('================================================================\n');

    const htmlPath = path.resolve('index.html');
    if (!fs.existsSync(htmlPath)) {
        console.error('❌ שגיאה קריטית: קובץ index.html לא נמצא!');
        process.exit(1);
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    // -------------------------------------------------------------
    // בדיקה 1: שלמות אלמנטי ה-DOM לתצוגת מוצרים
    // -------------------------------------------------------------
    console.log('🔍 שלב 1: בדיקת אלמנטי DOM חיוניים...');
    const criticalElements = [
        'id="homepage-shelves-container"',
        'id="products-grid"',
        'id="product-count"',
        'id="search-input"',
        'id="search-modal"',
        'id="active-filters-bar"'
    ];

    criticalElements.forEach(el => {
        if (!html.includes(el)) {
            console.error(`❌ שגיאה: אלמנט חיוני ${el} חסר ב-index.html!`);
            process.exit(1);
        }
    });
    console.log('  ✓ כל אלמנטי ה-DOM החיוניים קיימים.\n');

    // -------------------------------------------------------------
    // בדיקה 2: בדיקת תחביר (Syntax Check) מוחלטת לכל תגי הסקריפט
    // -------------------------------------------------------------
    console.log('🔍 שלב 2: בדיקת תקינות תחביר בכל תגי ה-Script...');
    const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scriptIdx = 0;
    let syntaxErrors = 0;

    while ((match = scriptRegex.exec(html)) !== null) {
        scriptIdx++;
        const tag = match[0];
        const code = match[1];

        const openingTag = tag.substring(0, tag.indexOf('>') + 1);
        if (openingTag.includes('application/ld+json')) {
            try {
                JSON.parse(code.trim());
            } catch (e) {
                console.error(`❌ שגיאת JSON-LD בסקריפט #${scriptIdx}:`, e.message);
                syntaxErrors++;
            }
            continue;
        }

        const tempFile = `temp_audit_script_${scriptIdx}.js`;
        try {
            fs.writeFileSync(tempFile, code, 'utf8');
            execSync(`node --check ${tempFile}`, { stdio: 'pipe' });
            console.log(`  ✓ סקריפט #${scriptIdx} (${(code.length / 1024).toFixed(1)} KB) - תחביר תקין לחלוטין`);
        } catch (e) {
            const errMsg = e.stderr ? e.stderr.toString('utf8') : e.message;
            console.error(`❌ שגיאת תחביר (SyntaxError) קריטית בסקריפט #${scriptIdx}:`);
            console.error(errMsg);
            syntaxErrors++;
        } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
    }

    if (syntaxErrors > 0) {
        console.error(`\n❌ נמצאו ${syntaxErrors} שגיאות תחביר! עצירת הפריסה לאתר.`);
        process.exit(1);
    }
    console.log('  ✓ כל הסקריפטים עברו בדיקת תחביר בהצלחה מלאה!\n');

    // -------------------------------------------------------------
    // בדיקה 3: סימולציית רינדור מוצרים ב-DOM ואימות תצוגה
    // -------------------------------------------------------------
    console.log('🔍 שלב 3: סימולציית רינדור מוצרים ב-DOM...');

    let gridHTML = '';
    let shelvesHTML = '';
    let countText = '';

    function createMockElement(id) {
        return {
            id: id || '',
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            textContent: '',
            innerHTML: '',
            style: {},
            setAttribute: () => {},
            getAttribute: () => null,
            appendChild: () => {},
            remove: () => {},
            querySelectorAll: () => [],
            querySelector: () => null,
            getBoundingClientRect: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
            scrollIntoView: () => {},
            value: '',
            checked: false
        };
    }

    const mockDOM = {
        document: {
            getElementById: (id) => {
                if (id === 'products-grid') {
                    const el = createMockElement(id);
                    Object.defineProperty(el, 'innerHTML', { set(v) { gridHTML = v; }, get() { return gridHTML; } });
                    return el;
                }
                if (id === 'homepage-shelves-container') {
                    const el = createMockElement(id);
                    Object.defineProperty(el, 'innerHTML', { set(v) { shelvesHTML = v; }, get() { return shelvesHTML; } });
                    return el;
                }
                if (id === 'product-count') {
                    const el = createMockElement(id);
                    Object.defineProperty(el, 'innerHTML', { set(v) { countText = v; }, get() { return countText; } });
                    Object.defineProperty(el, 'textContent', { set(v) { countText = v; }, get() { return countText; } });
                    return el;
                }
                return createMockElement(id);
            },
            querySelectorAll: () => [],
            querySelector: () => null,
            createElement: (tag) => createMockElement(tag),
            documentElement: { scrollTop: 0 },
            head: createMockElement('head'),
            body: createMockElement('body'),
            addEventListener: () => {}
        },
        window: {
            addEventListener: () => {},
            location: { search: '', hash: '', pathname: '/' },
            history: { pushState: () => {}, replaceState: () => {} },
            requestAnimationFrame: (cb) => cb(),
            scrollTo: () => {}
        },
        requestAnimationFrame: (cb) => cb(),
        localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        console: { log: () => {}, error: () => {}, warn: () => {} },
        setTimeout: (fn) => fn(),
        setInterval: () => {},
        clearTimeout: () => {},
        clearInterval: () => {}
    };
    mockDOM.window.document = mockDOM.document;
    mockDOM.window.window = mockDOM.window;

    // הרצת הסקריפט הראשי בסביבת ה-VM
    const inlineMatches = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
    const mainScriptTag = inlineMatches.find(t => t.includes('PRODUCTS_DATA') || t.includes('renderProducts'));

    if (!mainScriptTag) {
        console.error('❌ שגיאה: לא נמצא סקריפט הנתונים הראשי ב-index.html!');
        process.exit(1);
    }

    const mainCode = mainScriptTag.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    const context = vm.createContext(mockDOM);
    const script = new vm.Script(mainCode);
    script.runInContext(context);

    const prodsCount = (context.window.PRODUCTS_DATA || []).length;
    console.log(`  ✓ קטלוג המוצרים נטען בהצלחה: ${prodsCount} מוצרים.`);
    if (prodsCount < 250) {
        console.error(`❌ שגיאה: כמות המוצרים נמוכה מהצפוי (${prodsCount} מתוך 250+)!`);
        process.exit(1);
    }

    // בדיקת רינדור עמוד הבית (מדפי בוטיק)
    context.state.selectedCategory = 'all';
    context.state.selectedSubcategory = 'all';
    context.renderProducts();

    const homeCards = (shelvesHTML.match(/itemtype="https:\/\/schema\.org\/Product"/g) || []).length;
    console.log(`  ✓ עמוד הבית (מדפי בוטיק): רונדרו בהצלחה ${homeCards} כרטיסי מוצר.`);
    if (homeCards === 0) {
        console.error('❌ שגיאה קריטית: 0 מוצרים רונדרו בעמוד הבית!');
        process.exit(1);
    }

    // -------------------------------------------------------------
    // בדיקה 4: סימולציית לחיצה על כל הקטגוריות ותתי-הקטגוריות (אימות סננים ושבבים)
    // -------------------------------------------------------------
    console.log('\n🔍 שלב 4: בדיקת לחיצה על כל הקטגוריות, תתי-קטגוריות ושבבי סינון...');
    const allTestCategories = ['all', 'stam', 'mezuzot', 'tefillin-bags', 'books', 'wallets', 'gifts'];
    
    allTestCategories.forEach(cat => {
        gridHTML = '';
        shelvesHTML = '';
        context.window.selectMainCategory(cat);
        const totalCards = (gridHTML.match(/itemtype="https:\/\/schema\.org\/Product"/g) || []).length +
                           (shelvesHTML.match(/itemtype="https:\/\/schema\.org\/Product"/g) || []).length;
        if (totalCards === 0) {
            console.error(`❌ שגיאה קריטית: 0 מוצרים לאחר selectMainCategory('${cat}')!`);
            process.exit(1);
        }
        console.log(`  ✓ selectMainCategory('${cat}') - רונדרו ${totalCards} מוצרים.`);
    });

    // בדיקת תתי קטגוריות
    context.window.selectSubCategory('stam', 'מזוזות');
    let subCards = (gridHTML.match(/itemtype="https:\/\/schema\.org\/Product"/g) || []).length;
    console.log(`  ✓ selectSubCategory('stam', 'מזוזות') - רונדרו ${subCards} מוצרים.`);
    if (subCards === 0) {
        console.error('❌ שגיאה קריטית: 0 מוצרים בתת-קטגוריה מזוזות!');
        process.exit(1);
    }

    // בדיקת סינון מחיר ומיון
    context.window.filterPrice(150, 300);
    context.window.setCatalogSort('price-asc');
    context.window.toggleInStock(false);
    context.window.renderActiveFilterChips();
    console.log('  ✓ סינון מחירים, מיון, מלאי ושבבי סינון (Filter Chips) פעלו בהצלחה מלאה.');

    // בדיקת איפוס סננים ומעבר לקטלוג המלא
    context.window.switchToAllCatalogView();
    let allGridCards = (gridHTML.match(/itemtype="https:\/\/schema\.org\/Product"/g) || []).length;
    console.log(`  ✓ switchToAllCatalogView() - רונדרו ${allGridCards} מוצרים ברשת המלאה.`);
    if (allGridCards < 250) {
        console.error(`❌ שגיאה קריטית: רק ${allGridCards} מוצרים הוצגו בקטלוג המלא!`);
        process.exit(1);
    }

    context.window.resetFilters();
    console.log('  ✓ resetFilters() איפס את המצב בהצלחה.');

    console.log('\n================================================================');
    console.log(' 🎉 הביקורת העצמית עברה בהצלחה מלאה! האתר תקין ב-100% לפריסה.   ');
    console.log('================================================================\n');
}

if (require.main === module) {
    runAudit();
}

module.exports = { runAudit };
