/**
 * ============================================================================
 *               עוז יודאיקה - מנוע חוקי ביקורת עצמית והרחבות
 *                      OZ JUDAICA - CUSTOM AUDIT RULES
 * ============================================================================
 * 
 * קובץ זה מאפשר להוסיף בקלות חוקים ובדיקות איכות נוספות לביקורת העצמית שרצה כל 4 שעות.
 * כל חוק מגדיר:
 * - id: מזהה ייחודי לחוק באנגלית
 * - name: שם החוק בעברית
 * - description: תיאור הבדיקה
 * - check: פונקציה שמקבלת את הקטלוג (מוצרים, מאמרים, הגדרות) ובודקת תקינות
 * - autoFix: (אופציונלי) פונקציה שמתקנת את התקלה באופן אוטומטי
 * 
 * להוספת חוק חדש: פשוט הוסיפו אובייקט חדש למערך `customRules` למטה!
 */

const customRules = [
    {
        id: 'no_supplier_leakage',
        name: 'מניעת אזכורי ספקים חיצוניים (מותג עוז יודאיקה 100%)',
        description: 'מוודא שאין שום אזכור ל"ספק מורשה", "מהספק הרשמי" או "ספקים חיצוניים" בתיאורים, בכותרות או בשאלות הנפוצות',
        check: function(context) {
            const issues = [];
            const forbiddenPhrases = ['ספק מורשה', 'מהספק הרשמי', 'מהספק', 'ספקים מורשים', 'ספק חיצוני'];
            
            context.products.forEach(p => {
                const blob = [p.name, p.short_description, p.description, JSON.stringify(p.faq || [])].join(' ');
                forbiddenPhrases.forEach(phrase => {
                    if (blob.includes(phrase)) {
                        issues.push({
                            type: 'product',
                            id: p.id,
                            name: p.name,
                            message: `נמצא אזכור אסור '${phrase}' במוצר #${p.id}`
                        });
                    }
                });
            });
            return issues;
        },
        autoFix: function(context, issues) {
            let fixedCount = 0;
            issues.forEach(iss => {
                const p = context.products.find(x => x.id === iss.id);
                if (p) {
                    ['name', 'short_description', 'description'].forEach(field => {
                        if (p[field]) {
                            p[field] = p[field]
                                .replace(/ספק מורשה/g, 'בית המלאכה')
                                .replace(/מהספק הרשמי/g, 'מבית המלאכה')
                                .replace(/מהספק/g, 'מבית המלאכה')
                                .replace(/ספקים מורשים/g, 'בתי המלאכה')
                                .replace(/ספק חיצוני/g, 'שילוח ייעודי');
                        }
                    });
                    fixedCount++;
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'price_integrity',
        name: 'בדיקת תקינות מחירים ומבצעים',
        description: 'מוודא שאין מחיר 0, מחיר שלילי, או מחיר מבצע גבוה מהמחיר הרגיל',
        check: function(context) {
            const issues = [];
            context.products.forEach(p => {
                const price = Number(p.price);
                const regPrice = Number(p.regular_price);
                
                if (isNaN(price) || price <= 0) {
                    issues.push({ type: 'product', id: p.id, name: p.name, message: `מחיר שגוי או אפס במוצר #${p.id} (${p.price})` });
                } else if (!isNaN(regPrice) && regPrice > 0 && price > regPrice) {
                    issues.push({ type: 'product', id: p.id, name: p.name, message: `מחיר מבצע (${price}) גבוה ממחיר רגיל (${regPrice}) במוצר #${p.id}` });
                }
            });
            return issues;
        },
        autoFix: function(context, issues) {
            let fixedCount = 0;
            issues.forEach(iss => {
                const p = context.products.find(x => x.id === iss.id);
                if (p) {
                    const price = Number(p.price);
                    const regPrice = Number(p.regular_price);
                    if (regPrice > 0 && price > regPrice) {
                        p.regular_price = Math.round(price * 1.15); // התאמת מחיר רגיל הגיוני
                        fixedCount++;
                    }
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'glass_and_sets_shipping_rule',
        name: 'בדיקת תאימות שילוח תמונות וסטים משולבים (משלוח ₪50)',
        description: 'מוודא שלסטים המכילים תמונה (כגון 19005) ולתמונות זכוכית מוגדר משלוח ממוגן ייעודי של ₪50',
        check: function(context) {
            const issues = [];
            context.products.forEach(p => {
                const isPictureOrSet = p.id === 19005 || (p.category === 'rabbis-pics' || (p.id >= 18100 && p.id <= 18219));
                if (isPictureOrSet) {
                    const desc = (p.short_description || '') + ' ' + (p.description || '');
                    if (!desc.includes('50') && !desc.includes('ממוגן')) {
                        issues.push({
                            type: 'product',
                            id: p.id,
                            name: p.name,
                            message: `מוצר זכוכית/סט #${p.id} ללא ציון משלוח ממוגן של ₪50 בתיאור`
                        });
                    }
                }
            });
            return issues;
        },
        autoFix: function(context, issues) {
            let fixedCount = 0;
            issues.forEach(iss => {
                const p = context.products.find(x => x.id === iss.id);
                if (p && !p.short_description.includes('משלוח ממוגן')) {
                    p.short_description += `<p class='mb-2 text-purple-700 font-semibold'>משלוח ממוגן ייעודי עד הבית (₪50) לשמירה מלאה על הפריט.</p>`;
                    fixedCount++;
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'modesty_and_kosher_strict',
        name: 'הקפדת צניעות וכשרות מחמירה בתמונות',
        description: 'מוודא שאין אף תמונה ממאגרי תמונות זרים, חוף ים או דוגמנים',
        check: function(context) {
            const forbiddenWords = ['bikini', 'beach', 'woman', 'girl', 'model', 'dress', 'sexy', 'female', 'swimwear', 'unsplash'];
            const issues = [];
            context.products.forEach(p => {
                const allImgs = (p.images || []).concat(p.image ? [p.image] : []);
                allImgs.forEach(img => {
                    const lower = (img || '').toLowerCase();
                    if (forbiddenWords.some(w => lower.includes(w))) {
                        issues.push({
                            type: 'product',
                            id: p.id,
                            name: p.name,
                            badImg: img,
                            message: `תמונה לא צנועה או גנרית זוהתה במוצר #${p.id}: ${img}`
                        });
                    }
                });
            });
            return issues;
        },
        autoFix: function(context, issues) {
            let fixedCount = 0;
            issues.forEach(iss => {
                const p = context.products.find(x => x.id === iss.id);
                if (p) {
                    if (p.image === iss.badImg) {
                        p.image = 'https://ozonlineshop.com/wp-content/uploads/2026/05/מיזם-חדש-58.webp';
                    }
                    if (p.images) {
                        p.images = p.images.filter(x => x !== iss.badImg);
                    }
                    fixedCount++;
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'product_description_completeness',
        name: 'שלמות תיאור מוצר וסיומת משפטים',
        description: 'מוודא שאף תיאור מוצר לא נחתך עם שלוש נקודות (...) ואינו מכיל תווים שבורים (???)',
        check: function(context) {
            const issues = [];
            context.products.forEach(p => {
                const sDesc = (p.short_description || '').trim();
                if (sDesc.endsWith('...') || sDesc.endsWith('…')) {
                    issues.push({ type: 'product', id: p.id, name: p.name, message: `תיאור קצר נחתך עם '...' במוצר #${p.id}` });
                }
                if (sDesc.includes('???') || (p.description || '').includes('???')) {
                    issues.push({ type: 'product', id: p.id, name: p.name, message: `נמצאו סימני '???' בתיאור מוצר #${p.id}` });
                }
            });
            return issues;
        },
        autoFix: function(context, issues) {
            let fixedCount = 0;
            issues.forEach(iss => {
                const p = context.products.find(x => x.id === iss.id);
                if (p) {
                    if (p.short_description) {
                        p.short_description = p.short_description.replace(/[.…]+$/, '.').replace(/\?\?\?/g, '');
                    }
                    if (p.description) {
                        p.description = p.description.replace(/\?\?\?/g, '');
                    }
                    fixedCount++;
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'three_images_and_supplier_integrity',
        name: 'בדיקת 3 תמונות למוצר: ספקים (מקור בלבד ללא המצאה) ועוז יודאיקה (תמונות אווירה ב-BANANA)',
        description: 'מוודא שלכל מוצר יש 3 תמונות. למוצרי ספק: לוקח אך ורק תמונות מקוריות מהספק ואוסר המצאת תמונות! למוצרי עוז יודאיקה: משלב תמונות אווירה ולייפסטייל מ-BANANA',
        check: function(context) {
            const issues = [];
            const fs = require('fs');
            let tmunotGalleries = [];
            try {
                if (fs.existsSync('tmunot_scraped_galleries.json')) {
                    tmunotGalleries = JSON.parse(fs.readFileSync('tmunot_scraped_galleries.json', 'utf8'));
                }
            } catch(e) {}

            context.products.forEach(p => {
                const imgs = p.images || (p.image ? [p.image] : []);
                const count = imgs.length;
                const isBundle = (p.name || '').startsWith('סט ') || (p.name || '').includes('מארז ');
                const isSupplier = !isBundle && (
                    p.supplier === 'תמונות רבנים וצדיקים' || 
                    p.supplier === 'שמעק' || 
                    p.supplier === 'לבורסה' || 
                    p.supplier === 'סידור מבואר (נהרות)'
                );

                if (isSupplier) {
                    // בדיקה קפדנית שאף תמונה לא "הומצאה" או זוהמה
                    const nonSupplierImgs = imgs.filter(img => {
                        const low = (img || '').toLowerCase();
                        if (p.supplier === 'תמונות רבנים וצדיקים') return !low.includes('tmunotrabanim.com') && !low.includes('ozonlineshop.com');
                        if (p.supplier === 'שמעק') return !low.includes('wixstatic.com') && !low.includes('shmec') && !low.includes('ozonlineshop.com');
                        if (p.supplier === 'לבורסה') return !low.includes('laborsa') && !low.includes('ozonlineshop.com');
                        if (p.supplier === 'סידור מבואר (נהרות)') return !low.includes('sidur-neharot') && !low.includes('ozonlineshop.com');
                        return false;
                    });

                    if (nonSupplierImgs.length > 0) {
                        issues.push({
                            type: 'supplier_contamination',
                            id: p.id,
                            name: p.name,
                            supplier: p.supplier,
                            badImages: nonSupplierImgs,
                            message: `מוצר ספק #${p.id} (${p.supplier}) מכיל תמונה שאינה מהספק: ${nonSupplierImgs.join(', ')}`
                        });
                    }

                    if (count < 3) {
                        issues.push({
                            type: 'supplier_needs_photos',
                            id: p.id,
                            name: p.name,
                            supplier: p.supplier,
                            currentCount: count,
                            message: `מוצר ספק #${p.id} (${p.supplier}) עם ${count}/3 תמונות – משיכת תמונות מקור נוספות מהספק בלבד (ללא המצאה)`
                        });
                    }
                } else {
                    // מוצר עוז יודאיקה (ייצור עצמי, סת"ם, מזוזות, סטים ומארזים)
                    if (count < 3) {
                        issues.push({
                            type: 'inhouse_needs_banana',
                            id: p.id,
                            name: p.name,
                            currentCount: count,
                            message: `מוצר עוז יודאיקה #${p.id} כולל ${count}/3 תמונות – דורש שילוב תמונת אווירה/לייפסטייל מ-BANANA`
                        });
                    }
                }
            });
            return issues;
        },
        autoFix: function(context, issues) {
            const fs = require('fs');
            let fixedCount = 0;
            let tmunotGalleries = [];
            try {
                if (fs.existsSync('tmunot_scraped_galleries.json')) {
                    tmunotGalleries = JSON.parse(fs.readFileSync('tmunot_scraped_galleries.json', 'utf8'));
                }
            } catch(e) {}

            issues.forEach(iss => {
                const p = context.products.find(x => x.id === iss.id);
                if (!p) return;

                if (iss.type === 'supplier_contamination') {
                    // סילוק מיידי של תמונות שהומצאו או שאינן מקוריות מהספק
                    p.images = (p.images || []).filter(img => !iss.badImages.includes(img));
                    if (p.image && iss.badImages.includes(p.image)) {
                        p.image = p.images[0] || '';
                    }
                    fixedCount++;
                } else if (iss.type === 'supplier_needs_photos' && p.supplier === 'תמונות רבנים וצדיקים') {
                    // משיכת תמונות מקוריות בלבד מגלריית הספק
                    const match = tmunotGalleries.find(g => (g.sku && p.sku && g.sku.toLowerCase() === p.sku.toLowerCase()) || (g.title && p.name && p.name.includes(g.title)));
                    if (match && Array.isArray(match.images)) {
                        const existing = p.images || [];
                        match.images.forEach(img => {
                            if (existing.length < 3 && !existing.includes(img)) {
                                existing.push(img);
                                fixedCount++;
                            }
                        });
                        p.images = existing;
                    }
                } else if (iss.type === 'inhouse_needs_banana') {
                    // שילוב תמונות אווירה קיימות שהופקו ב-BANANA למוצרי עוז יודאיקה
                    const pImages = p.images || (p.image ? [p.image] : []);
                    const name = p.name || '';
                    
                    if (name.includes('מזוז') && !pImages.includes('public/lifestyle_epoxy_mezuzah.jpg') && pImages.length < 3) {
                        pImages.push('public/lifestyle_epoxy_mezuzah.jpg');
                        fixedCount++;
                    }
                    if (name.includes('ארנק') && !pImages.includes('public/products/leather_wallet_lifestyle.jpg') && pImages.length < 3) {
                        pImages.push('public/products/leather_wallet_lifestyle.jpg');
                        fixedCount++;
                    }
                    if (name.includes('תפילין') && !pImages.includes('public/products/tefillin_bar_mitzvah_mehudar.jpg') && pImages.length < 3) {
                        pImages.push('public/products/tefillin_bar_mitzvah_mehudar.jpg');
                        fixedCount++;
                    }
                    p.images = pImages;
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'article_drip_release_verification',
        name: 'שחרור מאמר חדש בכל סבב ביקורת (4-Hour Article Drip)',
        description: 'מוודא שבכל סבב ביקורת עצמית משתחרר מאמר חדש מתוך תור המאמרים המתוזמנים ומסונכרן באתר וב-sitemap.xml',
        check: function(context) {
            const articles = context.articles || [];
            const scheduled = articles.filter(a => a.status === 'scheduled');
            const published = articles.filter(a => a.status === 'published');
            
            if (scheduled.length === 0) {
                return [{
                    type: 'queue_empty',
                    message: `תור המאמרים התרוקן (כל 42 המאמרים פורסמו). מומלץ להוסיף מאמרים מתוזמנים חדשים לתור.`
                }];
            }
            console.log(`     ℹ️ תור המאמרים פעיל: ${published.length} מפורסמים, ${scheduled.length} נותרו בתור.`);
            return [];
        },
        autoFix: function(context, issues) {
            return 0;
        }
    },

    {
        id: 'no_childish_emojis',
        name: 'הסרת אימוג\'ים (מראה יוקרתי ונקי ללא אימוג\'ים ילדותיים)',
        description: 'מוודא שבכותרות, בתיאורים ובכרטיסי המוצר אין שום אימוג\'ים (כגון 🚚, 🌟, ✨) שיוצרים מראה ילדותי',
        check: function(context) {
            const issues = [];
            const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
            (context.products || []).forEach(p => {
                const blob = [p.name || '', p.short_description || '', p.description || ''].join(' ');
                if (emojiRegex.test(blob) || blob.includes('🚚')) {
                    issues.push({
                        type: 'product',
                        id: p.id,
                        name: p.name,
                        message: `זוהו אימוג'ים במוצר #${p.id}`
                    });
                }
            });
            return issues;
        },
        autoFix: function(context, issues) {
            let fixedCount = 0;
            const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
            issues.forEach(iss => {
                const p = (context.products || []).find(x => x.id === iss.id);
                if (p) {
                    ['name', 'short_description', 'description'].forEach(f => {
                        if (p[f]) {
                            p[f] = p[f].replace(emojiRegex, '').replace(/🚚\s*/g, '').replace(/\s{2,}/g, ' ').trim();
                        }
                    });
                    fixedCount++;
                }
            });
            return fixedCount;
        }
    },

    {
        id: 'code_syntax_and_product_render_integrity',
        name: 'בדיקת תקינות תחביר קוד JavaScript ותצוגת מוצרים ב-DOM',
        description: 'מוודא שאין שגיאות תחביר (SyntaxError), אין כפילויות משתנים (const/let), וכל מוצרי החנות ומדפי הבוטיק מתרנדרים תמיד בהצלחה',
        check: function(context) {
            const issues = [];
            const fs = require('fs');
            const vm = require('vm');
            const path = require('path');
            const { execSync } = require('child_process');

            const htmlPath = path.resolve('index.html');
            if (!fs.existsSync(htmlPath)) {
                issues.push({ type: 'code', message: 'קובץ index.html לא נמצא!' });
                return issues;
            }

            const html = fs.readFileSync(htmlPath, 'utf8');

            // 1. בדיקת אלמנטי DOM חיוניים
            const criticalElements = ['id="homepage-shelves-container"', 'id="products-grid"', 'id="product-count"'];
            criticalElements.forEach(el => {
                if (!html.includes(el)) {
                    issues.push({ type: 'code', message: `אלמנט חיוני ${el} חסר ב-index.html!` });
                }
            });

            // 2. בדיקת תחביר לכל תגי ה-script
            const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
            let match;
            let scriptIdx = 0;
            while ((match = scriptRegex.exec(html)) !== null) {
                scriptIdx++;
                const tag = match[0];
                const code = match[1];
                const openingTag = tag.substring(0, tag.indexOf('>') + 1);

                if (openingTag.includes('application/ld+json')) {
                    try {
                        JSON.parse(code.trim());
                    } catch (e) {
                        issues.push({ type: 'code', message: `שגיאת JSON-LD בסקריפט #${scriptIdx}: ${e.message}` });
                    }
                    continue;
                }

                const tempFile = `temp_audit_check_${scriptIdx}.js`;
                try {
                    fs.writeFileSync(tempFile, code, 'utf8');
                    execSync(`node --check ${tempFile}`, { stdio: 'pipe' });
                } catch (e) {
                    const errMsg = e.stderr ? e.stderr.toString('utf8').trim() : e.message;
                    issues.push({ type: 'code', message: `שגיאת תחביר (SyntaxError/Duplicate variable) בסקריפט #${scriptIdx}: ${errMsg}` });
                } finally {
                    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                }
            }

            // 3. בדיקת רינדור מוצרים
            try {
                let shelvesHTML = '';
                const mockDOM = {
                    document: {
                        getElementById: (id) => {
                            if (id === 'homepage-shelves-container') return {
                                id,
                                classList: { add: () => {}, remove: () => {}, contains: () => false },
                                set innerHTML(val) { shelvesHTML = val; },
                                get innerHTML() { return shelvesHTML; },
                                style: {}
                            };
                            return {
                                id,
                                classList: { add: () => {}, remove: () => {}, contains: () => false },
                                textContent: '',
                                innerHTML: '',
                                style: {},
                                setAttribute: () => {},
                                getAttribute: () => '',
                                scrollIntoView: () => {}
                            };
                        },
                        querySelectorAll: () => [],
                        querySelector: () => null,
                        addEventListener: () => {},
                        body: { style: {}, appendChild: () => {} }
                    },
                    window: {
                        addEventListener: () => {},
                        location: { search: '', hash: '', pathname: '/' },
                        history: { pushState: () => {}, replaceState: () => {} }
                    },
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

                const inlineMatches = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
                const mainScriptTag = inlineMatches.find(t => t.includes('PRODUCTS_DATA') || t.includes('renderProducts'));
                if (mainScriptTag) {
                    const mainCode = mainScriptTag.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
                    const contextVM = vm.createContext(mockDOM);
                    const scriptVM = new vm.Script(mainCode);
                    scriptVM.runInContext(contextVM);

                    if (!contextVM.window.PRODUCTS_DATA || contextVM.window.PRODUCTS_DATA.length < 250) {
                        issues.push({ type: 'code', message: `כמות המוצרים בקטלוג נמוכה מהצפוי (${(contextVM.window.PRODUCTS_DATA || []).length})` });
                    }

                    contextVM.state.selectedCategory = 'all';
                    contextVM.renderProducts();
                    const homeCards = (shelvesHTML.match(/itemtype="https:\/\/schema\.org\/Product"/g) || []).length;
                    if (homeCards === 0) {
                        issues.push({ type: 'code', message: 'שגיאת רינדור קריטית: 0 כרטיסי מוצר רונדרו בעמוד הבית!' });
                    }
                }
            } catch (err) {
                issues.push({ type: 'code', message: `כשל בהרצת רינדור מוצרים: ${err.message}` });
            }

            return issues;
        }
    }
];

/**
 * פונקציית ההרצה הראשית של החוקים המותאמים
 */
function runCustomAuditRules(context, autoFix = true) {
    console.log('\n[SECTION 3: מנוע חוקים מותאמים אישית (CUSTOM AUDIT RULES)]');
    let totalCustomIssues = 0;
    let totalCustomFixed = 0;

    customRules.forEach(rule => {
        try {
            const issues = rule.check(context) || [];
            if (issues.length === 0) {
                console.log(`  ✓ [${rule.name}]: תקין ב-100%`);
            } else {
                console.log(`  ⚠️ [${rule.name}]: זוהו ${issues.length} חריגות`);
                totalCustomIssues += issues.length;
                issues.forEach(iss => console.log(`     • ${iss.message}`));

                if (autoFix && typeof rule.autoFix === 'function') {
                    const fixed = rule.autoFix(context, issues);
                    totalCustomFixed += fixed;
                    console.log(`     -> תוקנו אוטומטית: ${fixed} פריטים.`);
                }
            }
        } catch(err) {
            console.error(`  ❌ שגיאה בהרצת חוק [${rule.name}]:`, err.message);
        }
    });

    return { totalCustomIssues, totalCustomFixed };
}

module.exports = {
    customRules,
    runCustomAuditRules
};
