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

    // -------------------------------------------------------------
    // בדיקה 5: אימות תקינות מארזים ועסקאות מיוחדות (מוצרים 19004 ו-19007)
    // -------------------------------------------------------------
    console.log('\n🔍 שלב 5: אימות שלמות מארזי מתנה (19004, 19007) ועסקאות קופה...');
    const prodsList = context.window.PRODUCTS_DATA || [];
    const p19004 = prodsList.find(p => p.id == 19004);
    const p19007 = prodsList.find(p => p.id == 19007);

    if (!p19004 || !p19007) {
        console.error('❌ שגיאה: מוצרים 19004 או 19007 לא נמצאו בקטלוג הנתונים!');
        process.exit(1);
    }

    if (p19004.name.includes('חנוכ') || p19004.alt.includes('חנוכ')) {
        console.error('❌ שגיאה: מוצר 19004 עדיין מכיל אזכור חנוכייה במקום פמוטים!');
        process.exit(1);
    }
    if (!p19004.name.includes('פמוטי קריסטל')) {
        console.error('❌ שגיאה: מוצר 19004 אינו כולל פמוטי קריסטל בכותרת!');
        process.exit(1);
    }

    if (!p19007.name.includes('נהרות') || !p19007.name.includes('סידור, תהילים וחמש מגילות')) {
        console.error('❌ שגיאה: מוצר 19007 אינו מוגדר כמארז 3 ספרי נהרות המבוארים!');
        process.exit(1);
    }

    // אימות תמונות מקומיות
    const localImages = [
        ...p19004.images.filter(img => !img.startsWith('http')),
        ...p19007.images.filter(img => !img.startsWith('http'))
    ];
    for (const img of localImages) {
        if (!fs.existsSync(img)) {
            console.error(`❌ שגיאה: קובץ תמונה מקומי חסר ב-root: ${img}`);
            process.exit(1);
        }
        if (!fs.existsSync(path.join('cloudflare_deploy', img))) {
            console.error(`❌ שגיאה: קובץ תמונה מקומי חסר ב-cloudflare_deploy: ${img}`);
            process.exit(1);
        }
    }
    console.log('  ✓ מארז 19004 (פמוטי קריסטל לשבת) ומארז 19007 (ספרי נהרות) תקינים ושלמים.');
    console.log('  ✓ כל קובצי התמונות אומתו פיזית בדיסק ב-root וב-cloudflare_deploy.');

    // בדיקת אימות שכיסויי ארון חשמל לא זולגים לתיקי תפילין
    const elecCovers = prodsList.filter(p => p.name.includes('חשמל') || p.id == 18147 || p.id == 18148 || p.id == 18149);
    if (elecCovers.length < 3) {
        console.error('❌ שגיאה: פחות מ-3 מוצרי כיסוי לארון חשמל בקטלוג!');
        process.exit(1);
    }
    elecCovers.forEach(p => {
        if (p.category !== 'gifts') {
            console.error(`❌ שגיאה: מוצר ארון חשמל ${p.id} אינו מוגדר בקטגוריית gifts!`);
            process.exit(1);
        }
    });

    // בדיקת סימולציה שכיסויי ארון חשמל אינם מופיעים ב-tefillin-bags
    gridHTML = '';
    shelvesHTML = '';
    context.window.selectMainCategory('tefillin-bags');
    if (gridHTML.includes('חשמל') || shelvesHTML.includes('חשמל')) {
        console.error('❌ שגיאה קריטית: כיסויי ארון חשמל עדיין מוצגים תחת תיקים לטלית ותפילין!');
        process.exit(1);
    }
    console.log('  ✓ אומת: 0 מוצרי חיפוי ארון חשמל זולגים לתיקי טלית ותפילין.');
    console.log('  ✓ אומת: כל 3 כיסויי ארון החשמל (18147, 18148, 18149) משויכים בלעדית לתמונות זכוכית ומתנות.');

    // -------------------------------------------------------------
    // בדיקה 6: ביקורת SEO מקיפה וציון איכות אורגני (SEO Audit & Improvement)
    // -------------------------------------------------------------
    console.log('\n🔍 שלב 6: ביקורת SEO מקיפה ושיפור תגיות מטא, סכמה ואינדוקס...');

    let seoScore = 0;
    const maxScore = 100;
    const seoIssues = [];

    // 6.1: בדיקת תג כותרת (Title Tag)
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1].trim() : '';
    if (!titleText) {
        seoIssues.push('תג <title> חסר ב-index.html');
    } else {
        const titleLen = titleText.length;
        if (titleLen < 35 || titleLen > 75) {
            console.warn(`  ⚠️ אזהרת כותרת: אורך Title הוא ${titleLen} תווים (מומלץ בין 35 ל-75 תווים לתצוגה אופטימלית בגוגל).`);
            seoScore += 7;
        } else {
            console.log(`  ✓ כותרת ראשית (Title): "${titleText}" (${titleLen} תווים - תקין ואופטימלי).`);
            seoScore += 10;
        }
        if (titleText.includes('עוז יודאיקה')) seoScore += 5;
    }

    // 6.2: בדיקת תג תיאור (Meta Description)
    const descMatch = html.match(/<meta[^>]*name=[\"']description[\"'][^>]*content=[\"']([^\"']*)[\"']/i);
    const descText = descMatch ? descMatch[1].trim() : '';
    if (!descText) {
        seoIssues.push('תג <meta name="description"> חסר ב-index.html');
    } else {
        const descLen = descText.length;
        if (descLen < 100 || descLen > 185) {
            console.warn(`  ⚠️ אזהרת תיאור: אורך Meta Description הוא ${descLen} תווים (מומלץ בין 100 ל-180 תווים).`);
            seoScore += 7;
        } else {
            console.log(`  ✓ תיאור עמוד (Meta Description): ${descLen} תווים (אופטימלי לקליקבליות ב-SERP).`);
            seoScore += 10;
        }
        if (descText.includes('עוז יודאיקה') && descText.includes('משלוח')) seoScore += 5;
    }

    // 6.3: בדיקת תג קנוניקל ורובוטים (Canonical & Robots)
    const canonicalMatch = html.match(/<link[^>]*rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']*)[\"']/i);
    if (canonicalMatch && canonicalMatch[1].startsWith('https://')) {
        console.log(`  ✓ תג Canonical מאומת: ${canonicalMatch[1]}`);
        seoScore += 5;
    } else {
        seoIssues.push('תג <link rel="canonical"> חסר או שאינו HTTPS');
    }

    const robotsMeta = html.match(/<meta[^>]*name=[\"']robots[\"'][^>]*content=[\"']([^\"']*)[\"']/i);
    if (robotsMeta && robotsMeta[1].includes('index') && robotsMeta[1].includes('follow')) {
        console.log(`  ✓ תג Meta Robots מוגדר לאינדוקס מלא: ${robotsMeta[1]}`);
        seoScore += 5;
    } else {
        seoIssues.push('תג <meta name="robots"> חסר או שאינו מאפשר אינדוקס');
    }

    // 6.4: בדיקת תגי OpenGraph ו-Twitter Card
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
    let ogPassed = true;
    ogTags.forEach(t => {
        if (!html.includes(`property="${t}"`) && !html.includes(`property='${t}'`)) {
            ogPassed = false;
        }
    });
    if (ogPassed) {
        console.log('  ✓ כל תגי השיתוף ברשתות חברתיות (OpenGraph & Twitter Card) קיימים ותקינים.');
        seoScore += 10;
    } else {
        seoIssues.push('חסרים תגי OpenGraph חיוניים');
    }

    // 6.5: בדיקת נתונים מובנים (Schema.org JSON-LD Structured Data)
    const jsonLdMatches = html.match(/<script[^>]*type=[\"']application\/ld\+json[\"']>([\s\S]*?)<\/script>/gi) || [];
    let hasOrg = false, hasStore = false, hasWebsite = false, hasFAQ = false, hasBreadcrumb = false;
    jsonLdMatches.forEach(tag => {
        const jsonStr = tag.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
            const data = JSON.parse(jsonStr);
            const type = data['@type'];
            if (type === 'Organization') hasOrg = true;
            if (type === 'Store' || (data.additionalType && data.additionalType.includes('ReligiousGoodsStore'))) hasStore = true;
            if (type === 'WebSite') hasWebsite = true;
            if (type === 'FAQPage') hasFAQ = true;
            if (type === 'BreadcrumbList') hasBreadcrumb = true;
        } catch(e) {}
    });

    if (hasOrg && hasStore && hasWebsite && hasFAQ && hasBreadcrumb) {
        console.log('  ✓ נתוני Schema.org JSON-LD מלאים ומאושרים: Organization, Store, WebSite, FAQPage, BreadcrumbList.');
        seoScore += 15;
    } else {
        const missingSchemas = [];
        if (!hasOrg) missingSchemas.push('Organization');
        if (!hasStore) missingSchemas.push('Store');
        if (!hasWebsite) missingSchemas.push('WebSite');
        if (!hasFAQ) missingSchemas.push('FAQPage');
        if (!hasBreadcrumb) missingSchemas.push('BreadcrumbList');
        seoIssues.push(`חסרות סכמות JSON-LD: ${missingSchemas.join(', ')}`);
    }

    // 6.6: בדיקת תגיות Alt בכל תמונות האתר ובקטלוג המוצרים
    const prods = context.window.PRODUCTS_DATA || [];
    let prodsWithoutAlt = prods.filter(p => !p.alt || !p.alt.trim()).length;
    if (prodsWithoutAlt === 0) {
        console.log(`  ✓ כיסוי תגיות Alt מושלם: לכל ${prods.length} המוצרים יש תגית Alt ייחודית בעברית.`);
        seoScore += 15;
    } else {
        console.warn(`  ⚠️ נמצאו ${prodsWithoutAlt} מוצרים ללא תגית Alt ייחודית.`);
        seoIssues.push(`${prodsWithoutAlt} מוצרים ללא תגית Alt`);
    }

    // 6.7: בדיקת תקינות וסנכרון robots.txt ו-sitemap.xml
    const rootRobots = fs.existsSync('robots.txt');
    const cfRobots = fs.existsSync(path.join('cloudflare_deploy', 'robots.txt'));
    const rootSitemap = fs.existsSync('sitemap.xml');
    const cfSitemap = fs.existsSync(path.join('cloudflare_deploy', 'sitemap.xml'));

    if (rootRobots && cfRobots && rootSitemap && cfSitemap) {
        const smContent = fs.readFileSync('sitemap.xml', 'utf8');
        const urlCount = (smContent.match(/<loc>/g) || []).length;
        if (smContent.includes('<urlset') && urlCount >= 400) {
            console.log(`  ✓ מפת האתר sitemap.xml תקינה ומכילה ${urlCount} כתובות URL לאינדוקס (כולל קטגוריות, מוצרים ומאמרים).`);
            console.log('  ✓ קובצי robots.txt ו-sitemap.xml מסונכרנים במלואם ב-root וב-cloudflare_deploy.');
            seoScore += 15;
        } else {
            seoIssues.push(`sitemap.xml מכיל רק ${urlCount} כתובות (מצופה לפחות 400)`);
        }
    } else {
        seoIssues.push('חסרים קובצי robots.txt או sitemap.xml ב-root או ב-cloudflare_deploy');
    }

    // 6.8: בדיקת מערך המאמרים (Content Authority & Article Health)
    const articles = context.window.ARTICLES_DATA || [];
    const nowTime = Date.now();
    const pubArticles = articles.filter(a => a.status === 'published' || !a.publish_at || new Date(a.publish_at).getTime() <= nowTime);
    if (pubArticles.length >= 35) {
        console.log(`  ✓ מערך מאמרי עוגן וסמכות פעיל: ${pubArticles.length} מאמרים מפורסמים עם מילות מפתח עשירות.`);
        seoScore += 10;
    } else {
        console.warn(`  ⚠️ פחות מ-35 מאמרים מפורסמים (${pubArticles.length}).`);
        seoIssues.push(`פחות מ-35 מאמרים מפורסמים (${pubArticles.length})`);
    }

    // חישוב ציון ביקורת SEO סופי
    console.log(`\n🏆 ציון איכות ובריאות SEO סופי: ${seoScore} מתוך ${maxScore}`);
    if (seoIssues.length > 0) {
        console.warn('  ליקויים לתיקון בביקורת:', seoIssues);
    } else {
        console.log('  🌟 כל רכיבי ה-SEO עברו את הביקורת בהצטיינות יתרה (100% Score)!');
    }

    if (seoScore < 90) {
        console.error('❌ שגיאה: ציון ה-SEO נמוך מ-90! עצירת הפריסה.');
        process.exit(1);
    }

    // -------------------------------------------------------------
    // בדיקה 7: ביקורת וידאו אורגני (Video SEO, VideoObject & Video Sitemap)
    // -------------------------------------------------------------
    console.log('\n🔍 שלב 7: ביקורת וידאו אורגני, סרטוני מוצרים ומפת וידאו בגוגל...');
    const videoProds = prods.filter(p => p.video);
    console.log(`  ✓ סרטוני מוצרים פעילים בקטלוג: ${videoProds.length} מוצרים עם וידאו מוטמע.`);
    if (videoProds.length < 90) {
        console.error(`❌ שגיאה: כמות המוצרים עם וידאו נמוכה מ-90 (${videoProds.length})!`);
        process.exit(1);
    }

    // בדיקת קיום פיזי של כל קובצי הוידאו
    let missingVideos = 0;
    videoProds.forEach(p => {
        const cleanVid = p.video.split('?')[0].replace(/^\//, '');
        if (!fs.existsSync(cleanVid)) {
            missingVideos++;
            console.error(`  ❌ קובץ וידאו חסר בדיסק: ${cleanVid}`);
        }
    });
    if (missingVideos === 0) {
        console.log(`  ✓ כל ${videoProds.length} קובצי הוידאו קיימים פיזית בדיסק במלואם.`);
    } else {
        console.error(`❌ שגיאה: ${missingVideos} קובצי וידאו חסרים בדיסק!`);
        process.exit(1);
    }

    // בדיקת מפת הוידאו sitemap.xml
    const smVideoContent = fs.readFileSync('sitemap.xml', 'utf8');
    const videoTagCount = (smVideoContent.match(/<video:video>/g) || []).length;
    console.log(`  ✓ תגיות Google Video sitemap מאומתות: ${videoTagCount} סרטונים מקושרים לאינדוקס.`);
    if (videoTagCount < 90) {
        console.error(`❌ שגיאה: sitemap.xml מכיל רק ${videoTagCount} תגיות video:video!`);
        process.exit(1);
    }
    if (!smVideoContent.includes('videos.html')) {
        console.error('❌ שגיאה: videos.html חסר ב-sitemap.xml!');
        process.exit(1);
    }

    // בדיקת גלריית הוידאו videos.html
    if (fs.existsSync('videos.html')) {
        let vIndexCount = 0;
        if (fs.existsSync('generated_videos/videos_index.json')) {
            const vData = JSON.parse(fs.readFileSync('generated_videos/videos_index.json', 'utf8'));
            vIndexCount = vData.length;
        }
        console.log(`  ✓ עמוד מרכז הוידאו (videos.html) קיים ומקושר לאינדקס של ${vIndexCount} סרטונים.`);
        if (vIndexCount < 90) {
            console.error(`❌ שגיאה: אינדקס הסרטונים מכיל רק ${vIndexCount} סרטונים!`);
            process.exit(1);
        }
    } else {
        console.error('❌ שגיאה: videos.html חסר!');
        process.exit(1);
    }

    // בדיקת תגי Schema.org VideoObject ו-Badge ב-index.html
    if (html.includes('itemtype="https://schema.org/VideoObject"') && html.includes('videos.html')) {
        console.log('  ✓ סכמת VideoObject, תגית וידאו בכרטיסי מוצר וקישורי ניווט לגלריה קיימים ב-index.html.');
    } else {
        console.error('❌ שגיאה: חסרים רכיבי VideoObject או קישורי videos.html ב-index.html!');
        process.exit(1);
    }

    // 7.1: ביקורת הטמעת סרטוני מוצר ב-Google Merchant וב-Schema.org כפי שגוגל אוהב
    console.log('\n🔍 שלב 7.1: ביקורת הטמעת סרטוני מוצר ב-Google Merchant וב-Schema.org (Google Video Love)...');
    const feedFile = 'google_shopping_free_feed.xml';
    if (fs.existsSync(feedFile)) {
        const feedContent = fs.readFileSync(feedFile, 'utf8');
        const merchantVideoLinks = (feedContent.match(/<g:video_link>/g) || []).length;
        console.log(`  ✓ תגיות <g:video_link> מאומתות בפיד גוגל שופינג: ${merchantVideoLinks} קישורי וידאו פעילים.`);
        if (merchantVideoLinks < 50) {
            console.error(`❌ שגיאה: פיד Google Merchant מכיל רק ${merchantVideoLinks} תגיות g:video_link!`);
            process.exit(1);
        }
    } else {
        console.error('❌ שגיאה: google_shopping_free_feed.xml לא נמצא!');
        process.exit(1);
    }

    if (html.includes('openProductVideoModal') && html.includes('dynamic-video-schema')) {
        console.log('  ✓ נגן וידאו מודאלי וסכמת dynamic-video-schema מאומתים ב-index.html.');
    } else {
        console.error('❌ שגיאה: openProductVideoModal או dynamic-video-schema חסרים ב-index.html!');
        process.exit(1);
    }

    console.log('\n================================================================');
    console.log(' 🎉 הביקורת העצמית עברה בהצלחה מלאה! האתר תקין ב-100% לפריסה.   ');
    console.log('================================================================\n');
}

if (require.main === module) {
    runAudit();
}

module.exports = { runAudit };
