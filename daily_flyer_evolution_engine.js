/**
 * ============================================================================
 * OZ JUDAICA - AUTONOMOUS DAILY FLYER & VIDEO EVOLUTION ENGINE
 * ============================================================================
 * 1. Analyzes buyer intent & psychological conversion triggers for Judaica.
 * 2. Selects 5 daily flagship products across rotating high-converting categories.
 * 3. Renders 5 studio-grade full-bleed marketing flyers with embedded copy & prices.
 * 4. Automatically updates https://oz-judaica.co.il/status.html (same permanent URL).
 * 5. Generates 9:16 vertical videos with acoustic soundtrack and publishes to
 *    YouTube Shorts (Google API) and social media webhooks.
 * 6. Deploys live to Cloudflare Pages automatically.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { execSync, spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const googleTTS = require('google-tts-api');
const { loadConfig, publishToYouTubeShorts } = require('./direct_omnichannel_publisher');

const BASE_DIR = __dirname;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PRODUCTS_DIR = path.join(BASE_DIR, 'public', 'products');
const MARKETING_DIR = path.join(BASE_DIR, 'public', 'marketing');
const OUTPUT_VIDEOS_DIR = path.join(BASE_DIR, 'generated_videos');
const CACHE_DIR = path.join(BASE_DIR, 'video_cache');
const STATUS_HTML_FILE = path.join(BASE_DIR, 'status.html');
const STATUS_DIR = path.join(BASE_DIR, 'status');
const STATUS_INDEX_FILE = path.join(STATUS_DIR, 'index.html');
const WHATSAPP_HTML_FILE = path.join(BASE_DIR, 'whatsapp_status.html');
const HISTORY_FILE = path.join(BASE_DIR, 'daily_published_history.json');

if (!fs.existsSync(STATUS_DIR)) fs.mkdirSync(STATUS_DIR, { recursive: true });
if (!fs.existsSync(MARKETING_DIR)) fs.mkdirSync(MARKETING_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_VIDEOS_DIR)) fs.mkdirSync(OUTPUT_VIDEOS_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const PRODUCTS_JSON_FILE = path.join(BASE_DIR, 'products.json');
const STORE_PRODUCTS = JSON.parse(fs.readFileSync(PRODUCTS_JSON_FILE, 'utf8'));

/**
 * שליפת מוצר ישירות מקטלוג האתר הרשמי
 * מונע כל פער או יצירתיות עצמאית במחירים ובשמות - 100% נאמנות לאתר!
 */
function getStoreProduct(id) {
    const p = STORE_PRODUCTS.find(x => String(x.id) === String(id));
    if (!p) throw new Error(`[CATALOG ERROR] Product ID ${id} not found in products.json!`);
    return p;
}

function enrichItemFromCatalog(item) {
    const prod = getStoreProduct(item.id);
    const priceStr = Number(prod.price).toLocaleString('he-IL');
    return {
        ...item,
        title: prod.name,
        price: priceStr,
        rawPrice: prod.price,
        desc: item.desc || prod.description || prod.name
    };
}

/**
 * מאגרי מוצרים מתחלפים בכל יום (4 סבבים של 5 מוצרים נבחרים = 20 מוצרי דגל מהקטלוג)
 * שמות המוצרים והמחירים נשלפים אוטומטית ובצורה דינמית ישירות מתוך products.json של האתר!
 */
const RAW_ROTATION_SETS = [
    // סבב 1: מזוזות הדגל, תפילין ומתנות יוקרה
    [
        {
            id: '21001',
            desc: 'יציקת בטון פרימיום עמידה לפגעי מזג אוויר • מתאים לקלף 12 ס"מ',
            badge: '🔥 דגם הדגל הבלעדי',
            hook: 'מחפשים מתנה עם <span class="gold">נשמה וקדושה</span><br>לפתח הבית או לחנוכת בית?',
            bgImage: path.join(MARKETING_DIR, 'banana_concrete_mezuzah.jpg')
        },
        {
            id: '556',
            desc: 'שילוב עץ זית גלילי ואפוקסי פנינה • אות ש\' מוזהבת (One of a Kind)',
            badge: '✨ עבודת יד בלעדית',
            hook: 'איך להכניס <span class="gold">חום גלילי ויוקרה</span><br>לפתח הבית והסלון שלך?',
            bgImage: path.join(MARKETING_DIR, 'banana_epoxy_mezuzah.jpg')
        },
        {
            id: '20151',
            desc: 'תפילין בהמה גסה כשרות למהדרין • הגהת מחשב וסופר מוסמך • תעודת כשרות',
            badge: '👑 כשרות מהודרת למהדרין',
            hook: 'המתנה המושלמת והמרגשת ביותר<br><span class="gold">לבר מצווה ולחתן לכל החיים</span>',
            bgImage: path.join(MARKETING_DIR, 'banana_tefillin_set.jpg')
        },
        {
            id: '20115',
            desc: 'זכוכית מחוסמת אקסטרה-קליר 4 מ"מ • קנט פאזה מלוטש • תלייה צפה נסתרת',
            badge: '🕊️ הדפסה קריסטלית עמידה',
            hook: 'רוצים להכניס את <span class="gold">אור הכותל המערבי</span><br>והשכינה ישירות לסלון הבית?',
            bgImage: path.join(MARKETING_DIR, 'banana_kotel_glass.jpg')
        },
        {
            id: '7821',
            desc: 'עור נאפה אמיתי ורך למגע • חלוקה חכמה לכרטיסים ומזומן • עמידות לשנים',
            badge: '💼 100% עור איטלקי מובחר',
            hook: 'מחפשים <span class="gold">מתנה אלגנטית לגבר</span><br>שמשלבת יוקרה, עמידות ונוחות מקסימלית?',
            bgImage: path.join(MARKETING_DIR, 'banana_leather_wallet.jpg')
        }
    ],

    // סבב 2: קדושת המזוזות, מארז ברכה לחנוכת בית ו-VIP
    [
        {
            id: '21010',
            desc: 'כתיבת יד סופר יר"ש • הגהת מחשב אופטית כפולה • תעודת כשרות חתומה',
            badge: '✡️ כשרות מהודרת למהדרין',
            hook: 'מתי בדקתם את המזוזות שלכם?<br><span class="gold">שמירה וברכה אמיתית</span> לפתח הבית!',
            bgImage: path.join(PRODUCTS_DIR, 'klaf_mezuzah_kosher_sizes.jpg')
        },
        {
            id: '19005',
            desc: 'מזוזת עץ זית ואפוקסי ארץ ישראל • מזמור לתודה • סידור ופיטום הקטורת',
            badge: '🏡 מארז ברכה מושלם לבית',
            hook: 'מחפשים מתנה מושלמת<br>עם <span class="gold">ברכה, קדושה ושמחה</span> לחנוכת בית?',
            bgImage: path.join(PRODUCTS_DIR, 'set_newhome_blessing_lifestyle_19005.jpg')
        },
        {
            id: '19010',
            desc: 'תפילין בהמה גסה מהודרות • טלית צמר פרימיום • תיק קטיפה מהודר ורקמת שם',
            badge: '👑 מארז VIP יוקרתי לכל החיים',
            hook: 'חוגגים בר מצווה או חתונה?<br><span class="gold">המתנה המפוארת והמרגשת ביותר</span> לנער ולחתן!',
            bgImage: path.join(PRODUCTS_DIR, 'set_barmitzvah_vip_19010.jpg')
        },
        {
            id: '20015',
            desc: 'זכוכית מחוסמת 4 מ"מ קריסטל • חדות עילאית • תלייה מרחפת נסתרת',
            badge: '✨ זכוכית מחוסמת קריסטל',
            hook: 'רוצים את <span class="gold">דמותו המאירה של מרן</span><br>וברכת הצדיק בלב הסלון שלכם?',
            bgImage: path.join(MARKETING_DIR, 'banana_rav_ovadia.jpg')
        },
        {
            id: '7220',
            desc: 'אותיות מאירות עיניים • ביאור פנינים • כריכה יוקרתית בהטבעה מוזהבת',
            badge: '📖 איכות קריאה והידור מושלם',
            hook: 'איך להפוך כל תפילה לחוויה?<br><span class="gold">סידור מהודר ומאיר עיניים</span> שכיף להתפלל בו!',
            bgImage: path.join(PRODUCTS_DIR, 'siddur_7220_lifestyle_shabbat.jpg')
        }
    ],

    // סבב 3: פאר שולחן השבת, עץ זית גלילי וספרי קודש
    [
        {
            id: '19004',
            desc: 'תמונת זכוכית אשת חיל יוקרתית • סכין חלה מעוצבת • סידור מבואר מהודר',
            badge: '🕯️ פאר והדר לשולחן השבת',
            hook: 'רוצים להלביש את <span class="gold">שולחן השבת שלכם</span><br>בהוד מלכותי ויוקרה אמיתית?',
            bgImage: path.join(PRODUCTS_DIR, 'set_shabbat_royal_19004.jpg')
        },
        {
            id: '555',
            desc: 'סט 5 מזוזות עץ זית גלילי ואפוקסי פנינה • אות ש\' מוזהבת (עבודת יד בלעדית)',
            badge: '✨ מארז 5 מזוזות יוקרה',
            hook: 'איך להעניק לכל פתחי הבית<br><span class="gold">חמימות גלילית ואומנות בוטיק</span>?',
            bgImage: path.join(PRODUCTS_DIR, 'mezuzah_epoxy_555_doorpost_lifestyle.jpg')
        },
        {
            id: '7221',
            desc: 'חמש מגילות בכריכה מהודרת • ביאור משולב בהיר • אותיות מאירות עיניים',
            badge: '📜 חמש מגילות מבוארות',
            hook: 'מחפשים מתנה ערכית ומפוארת<br><span class="gold">לחגים, לשבתות ולכל המשפחה</span>?',
            bgImage: path.join(PRODUCTS_DIR, 'megillot_7221_lifestyle_table.jpg')
        },
        {
            id: '7911',
            desc: 'הגנת RFID נגד גניבות • חלוקה חכמה לכרטיסים ושטרות • קומפקטי וקל משקל',
            badge: '💼 קומפקטי עם הגנת RFID',
            hook: 'מחפשים <span class="gold">ארנק נוח וקליל לגבר</span><br>שנכנס לכל כיס ומגן על הכרטיסים שלכם?',
            bgImage: path.join(PRODUCTS_DIR, 'leather_wallet_lifestyle.jpg')
        },
        {
            id: '633',
            desc: 'סגולת פיטום הקטורת להגנה, שמירה ופרנסה • איכות הדפסה גבוהה 15x15',
            badge: '🛡️ סגולה עילאית לשמירה ופרנסה',
            hook: 'רוצים להכניס <span class="gold">סגולה בדוקה לפרנסה ושמירה</span><br>ישירות לבית או לעסק שלכם?',
            bgImage: path.join(PRODUCTS_DIR, 'pitom_633_lifestyle_marble.jpg')
        }
    ],

    // סבב 4: מארז חתן מלכותי, ספרי נהרות ומתנות יוקרה
    [
        {
            id: '19001',
            desc: 'תפילין בהמה גסה מהודרות • תפידנית מוגנת מפני חום • סידור, תהילים וארנק עור',
            badge: '💎 מארז חתן מפואר מושלם',
            hook: 'מתכוננים לחתונה?<br><span class="gold">מארז חתן יוקרתי מושלם</span> המלווה את החתן לחופה ולחיים!',
            bgImage: path.join(PRODUCTS_DIR, 'groom_set_lifestyle_suite.jpg')
        },
        {
            id: '19007',
            desc: 'סידור, תהילים וחמש מגילות בכריכה תואמת • ספרי יסוד בהוצאת נהרות',
            badge: '📖 שלישיית ספרי קודש נהרות',
            hook: 'איזו מתנה תרגש כל יהודי?<br><span class="gold">שלישיית ספרי קודש מפוארת</span> בהטבעת זהב!',
            bgImage: path.join(PRODUCTS_DIR, 'set_books_neharot_trio_19007.jpg')
        },
        {
            id: '21002',
            desc: 'מארז 3 בתי מזוזה בטון פרימיום "האש שלי" (12 ס"מ) • עמידות מלאה לשמש וגשם',
            badge: '🏛️ מארז 3 מזוזות בטון',
            hook: 'רוצים לחבר את פתחי הבית<br><span class="gold">לקדושת ועוצמת ירושלים</span> בעיצוב מודרני?',
            bgImage: path.join(PRODUCTS_DIR, 'mezuzah_concrete_haesh_sheli_lifestyle_jerusalem.jpg')
        },
        {
            id: '19009',
            desc: 'ארנק עור ברידג\' • תיק תפילין שני רוכסנים • סידור ותהילים מבוארים',
            badge: '🎁 מארז הוקרה אלגנטי לגבר',
            hook: 'מחפשים <span class="gold">מתנה מרשימה ושימושית לגבר</span><br>ליום הולדת, קידום או הוקרה?',
            bgImage: path.join(PRODUCTS_DIR, 'gentleman_gift_set_lifestyle.jpg')
        },
        {
            id: '7223',
            desc: 'אותיות גדולות ומאירות עיניים • פירוש משולב בהיר לפסוקי דוד המלך',
            badge: '✨ ספר תהילים מבואר',
            hook: 'ספר התהילים האישי שלך:<br><span class="gold">אותיות גדולות וקריאה בהירה</span> לתפילה מכל הלב!',
            bgImage: path.join(PRODUCTS_DIR, 'tehillim_mevoar_neharot_cover.jpg')
        }
    ]
];

const DAILY_ROTATION_SETS = RAW_ROTATION_SETS.map(set => set.map(enrichItemFromCatalog));

function getBase64Image(filePath) {
    if (!fs.existsSync(filePath)) return '';
    return `data:image/jpeg;base64,${fs.readFileSync(filePath).toString('base64')}`;
}

/**
 * יצירת פסקול אקוסטי מרגש
 */
function createLuxuryAcousticAudio(duration = 12, sampleRate = 44100) {
    const numSamples = Math.floor(duration * sampleRate);
    const buffer = Buffer.alloc(44 + numSamples * 2);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);

    const chords = [
        { t0: 0.0, dur: 3.2, notes: [146.83, 220.00, 293.66, 369.99, 440.00] },
        { t0: 3.2, dur: 3.0, notes: [123.47, 185.00, 246.94, 293.66, 369.99] },
        { t0: 6.2, dur: 3.0, notes: [130.81, 196.00, 261.63, 329.63, 392.00] },
        { t0: 9.2, dur: 2.8, notes: [110.00, 164.81, 220.00, 277.18, 329.63] }
    ];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sampleVal = 0;

        for (const ch of chords) {
            if (t >= ch.t0 && t < ch.t0 + ch.dur) {
                const env = Math.sin((Math.PI * (t - ch.t0)) / ch.dur);
                ch.notes.forEach((freq, idx) => {
                    sampleVal += Math.sin(2 * Math.PI * freq * t) * (1.0 / (idx + 1)) * env * 0.18;
                });
            }
        }

        let masterEnv = 1.0;
        if (t < 0.8) masterEnv = t / 0.8;
        if (t > duration - 1.2) masterEnv = (duration - t) / 1.2;

        sampleVal = Math.max(-0.95, Math.min(0.95, sampleVal * masterEnv));
        buffer.writeInt16LE(Math.floor(sampleVal * 32767), 44 + i * 2);
    }

    const audioFile = path.join(CACHE_DIR, `audio_${Date.now()}_${Math.random().toString(36).substring(7)}.wav`);
    fs.writeFileSync(audioFile, buffer);
    return audioFile;
}

/**
 * רינדור כרזת שיווק מלאה ב-Puppeteer
 */
async function renderFlyerCard(browser, item, outJpgPath) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1440, deviceScaleFactor: 1 });

    const imgData = getBase64Image(item.bgImage);

    const html = `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body, html { width: 1080px; height: 1440px; overflow: hidden; font-family: 'Assistant', sans-serif; background: #000; direction: rtl; }
            .poster {
                position: relative;
                width: 1080px;
                height: 1440px;
                background-image: url('${imgData}');
                background-size: cover;
                background-position: center;
            }
            .vignette-top {
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 380px;
                background: linear-gradient(180deg, rgba(10, 15, 30, 0.95) 0%, rgba(10, 15, 30, 0.7) 45%, rgba(10, 15, 30, 0) 100%);
            }
            .vignette-bottom {
                position: absolute;
                bottom: 0; left: 0; right: 0;
                height: 480px;
                background: linear-gradient(0deg, rgba(5, 8, 18, 0.98) 0%, rgba(5, 8, 18, 0.85) 60%, rgba(5, 8, 18, 0) 100%);
            }
            .header-bar {
                position: absolute;
                top: 36px; left: 44px; right: 44px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10;
            }
            .brand-logo {
                background: rgba(15, 23, 42, 0.85);
                border: 1.5px solid rgba(245, 158, 11, 0.4);
                border-radius: 40px;
                padding: 10px 24px;
                display: flex;
                align-items: center;
                gap: 12px;
                backdrop-filter: blur(8px);
            }
            .brand-logo .dot {
                width: 32px; height: 32px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-weight: 900; color: #fff; font-size: 16px;
            }
            .brand-logo .name { font-size: 22px; font-weight: 900; color: #fff; }
            .badge-tag {
                background: rgba(15, 23, 42, 0.85);
                border: 1.5px solid #f59e0b;
                border-radius: 40px;
                padding: 10px 22px;
                font-size: 19px;
                font-weight: 800;
                color: #fbbf24;
                backdrop-filter: blur(8px);
            }
            .top-hook {
                position: absolute;
                top: 115px; left: 50px; right: 50px;
                text-align: center;
                z-index: 10;
                font-size: 42px;
                font-weight: 900;
                line-height: 1.25;
                color: #ffffff;
                text-shadow: 0 4px 20px rgba(0,0,0,0.8);
            }
            .top-hook .gold {
                color: #fbbf24;
                text-shadow: 0 0 25px rgba(251, 191, 36, 0.6);
            }
            .bottom-bar {
                position: absolute;
                bottom: 44px; left: 44px; right: 44px;
                z-index: 10;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .product-card {
                background: rgba(15, 23, 42, 0.88);
                border: 1.5px solid rgba(255, 255, 255, 0.15);
                border-radius: 22px;
                padding: 22px 28px;
                backdrop-filter: blur(12px);
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .product-info { max-width: 680px; }
            .product-title {
                font-size: 30px;
                font-weight: 900;
                color: #ffffff;
                margin-bottom: 6px;
            }
            .product-desc {
                font-size: 19px;
                color: #cbd5e1;
                font-weight: 600;
            }
            .price-pill {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: #ffffff;
                font-size: 38px;
                font-weight: 900;
                padding: 12px 28px;
                border-radius: 18px;
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
                white-space: nowrap;
            }
            .cta-bar {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 18px;
                padding: 16px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.45);
            }
            .cta-left { font-size: 22px; font-weight: 900; color: #ffffff; }
            .cta-right {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 23px;
                font-weight: 900;
                color: #ffffff;
            }
        </style>
    </head>
    <body>
        <div class="poster">
            <div class="vignette-top"></div>
            <div class="vignette-bottom"></div>
            <div class="header-bar">
                <div class="badge-tag">${item.badge}</div>
                <div class="brand-logo">
                    <span class="name">עוז יודאיקה</span>
                    <span class="dot">ע</span>
                </div>
            </div>
            <div class="top-hook">${item.hook}</div>
            <div class="bottom-bar">
                <div class="product-card">
                    <div class="price-pill">₪${item.price.toString().replace('₪', '').trim()}</div>
                    <div class="product-info">
                        <div class="product-title">${item.title}</div>
                        <div class="product-desc">${item.desc}</div>
                    </div>
                </div>
                <div class="cta-bar">
                    <div class="cta-left">oz-judaica.co.il</div>
                    <div class="cta-right">
                        <span>להזמנה מהירה בוואטסאפ: 052-686-7192</span>
                        <span>💬</span>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outJpgPath, type: 'jpeg', quality: 95 });
    await page.close();
}

/**
 * יצירת סרטון פרסומת מהיר (5.6 שניות, קצב 0.75s לשוט) עם קריינות שיווקית וכתוביות בולטות
 */
async function createAndPublishVideo(flyerJpgPath, item, config) {
    const videoOutPath = path.join(OUTPUT_VIDEOS_DIR, `daily_fast_commercial_${item.id}_${Date.now()}.mp4`);
    const tempDir = path.join(CACHE_DIR, `temp_video_${item.id}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    console.log(`🎬 [סרטון פרסומת 5.6s] מייצר פרסומת קצרה וממוקדת עבור: ${item.title}...`);

    // 1. הפקת קריינות שיווקית ממוקדת
    const cleanTitle = item.title.split('—')[0].replace(/['"]/g, '').trim();
    const voiceParts = [
        { text: `רוצים ${cleanTitle} שתדהים כל מי שנכנס?`, id: 'p1' },
        { text: `איכות פרימיום, רק ${item.price} שקלים בלבד!`, id: 'p2' },
        { text: `הזמינו עכשיו בוואטסאפ!`, id: 'p3' }
    ];

    const voiceFiles = [];
    for (const vp of voiceParts) {
        try {
            const rawV = path.join(tempDir, `raw_${vp.id}.mp3`);
            const cleanV = path.join(tempDir, `clean_${vp.id}.mp3`);
            const b64 = await googleTTS.getAudioBase64(vp.text, { lang: 'iw', slow: false });
            fs.writeFileSync(rawV, Buffer.from(b64, 'base64'));
            spawnSync(ffmpeg, [
                '-y', '-i', rawV,
                '-af', 'silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB,atempo=1.70,treble=g=3:f=3500,volume=2.2',
                cleanV
            ]);
            voiceFiles.push(cleanV);
        } catch (e) {
            console.error('Voice segment error:', e.message);
        }
    }

    let finalVoicePath = null;
    if (voiceFiles.length === voiceParts.length) {
        const vList = path.join(tempDir, 'voice_list.txt');
        fs.writeFileSync(vList, voiceFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
        finalVoicePath = path.join(tempDir, 'final_voice.mp3');
        spawnSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', vList, '-c:a', 'libmp3lame', '-b:a', '192k', finalVoicePath]);
    }

    // 2. רינדור 6 שוטים מהירים (0.75 שניות לשוט, סה"כ ~5.25s)
    const shotsData = [
        {
            topTag: item.badge || '🔥 בלעדי בעוז יודאיקה',
            subBadge: '❓ שאלה קטנה בשבילך',
            mainText: `רוצים <span class="gold">${cleanTitle}</span> שתרגש כל מי שנכנס?`,
            dur: 0.75
        },
        {
            topTag: '💎 איכות בוטיק יוקרתית',
            subBadge: '✨ עבודת יד מושלמת',
            mainText: `${item.desc.split('•')[0] || cleanTitle}`,
            dur: 0.75
        },
        {
            topTag: '🛡️ עמידות והגנה מלאה',
            subBadge: '☀️ עמיד לשמש ופגעי מזג אוויר',
            mainText: `${item.desc.split('•')[1] || 'גימור מושלם ברמת על'}`,
            dur: 0.75
        },
        {
            topTag: '🏷️ מחיר סטודיו מקורי',
            subBadge: '🚚 משלוח מהיר עד הבית',
            mainText: `עכשיו רק <span class="gold">₪${item.price} בלבד!</span>`,
            dur: 0.75
        },
        {
            topTag: '🏠 שדרוג מושלם לבית',
            subBadge: '⭐ נוכחות יוקרתית שאי אפשר לפספס',
            mainText: `למה לחכות? שדרגו את הבית עוד היום!`,
            dur: 0.75
        },
        {
            topTag: '📲 הזמנה מיידית בקליק',
            subBadge: '⚡ מלאי בוטיק מוגבל',
            mainText: `להזמנה בוואטסאפ: <span class="gold">052-686-7192</span>`,
            dur: 1.50
        }
    ];

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

    const flyerB64 = `data:image/jpeg;base64,${fs.readFileSync(flyerJpgPath).toString('base64')}`;
    const renderedClips = [];

    for (let i = 0; i < shotsData.length; i++) {
        const s = shotsData[i];
        const frameJpg = path.join(tempDir, `f_${i}.jpg`);
        const html = `
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin:0; padding:0; box-sizing:border-box; }
                body, html { width:1080px; height:1920px; overflow:hidden; font-family:'Segoe UI', Arial, sans-serif; background:#000; direction:rtl; }
                .bg { position:absolute; width:1080px; height:1920px; background-image:url('${flyerB64}'); background-size:cover; background-position:center; }
                .vignette-top { position:absolute; top:0; left:0; right:0; height:280px; background:linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%); }
                .vignette-bottom { position:absolute; bottom:0; left:0; right:0; height:750px; background:linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0) 100%); }
                .top-logo { position:absolute; top:65px; left:45px; background:#000000; border:3px solid #ffffff; color:#ffffff; font-size:28px; font-weight:900; padding:12px 30px; border-radius:40px; box-shadow:0 8px 30px rgba(0,0,0,0.9); }
                .top-tag { position:absolute; top:65px; right:45px; background:#facc15; border:3px solid #ffffff; color:#000000; font-size:28px; font-weight:900; padding:12px 32px; border-radius:40px; box-shadow:0 8px 30px rgba(0,0,0,0.9); }
                .sub-box { position:absolute; bottom:490px; left:45px; right:45px; display:flex; flex-direction:column; align-items:center; text-align:center; z-index:100; }
                .sub-card { background:rgba(0,0,0,0.95); border:5px solid #facc15; border-radius:34px; padding:26px 38px; box-shadow:0 25px 65px rgba(0,0,0,1), 0 0 35px rgba(250,204,21,0.55); max-width:98%; }
                .sub-title { font-size:64px; font-weight:900; color:#ffffff; line-height:1.2; letter-spacing:-0.5px; text-shadow:0 4px 20px rgba(0,0,0,1); }
                .gold { color:#facc15; text-shadow:0 0 30px rgba(250,204,21,0.8); }
                .price-huge { font-size:84px; color:#facc15; font-weight:900; text-shadow:0 0 35px rgba(250,204,21,0.9); display:inline-block; }
            </style>
        </head>
        <body>
            <div class="bg">
                <div class="vignette-top"></div>
                <div class="vignette-bottom"></div>
                <div class="top-logo">עוז יודאיקה</div>
                <div class="top-tag">${s.topTag}</div>
                <div class="sub-box">
                    <div class="sub-card"><div class="sub-title">${s.mainText}</div></div>
                </div>
            </div>
        </body>
        </html>`;

        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 80));
        await page.screenshot({ path: frameJpg, quality: 95 });

        const clipMp4 = path.join(tempDir, `clip_${i}.mp4`);
        const fps = 30;
        const framesCount = Math.round(s.dur * fps);
        const zoomExpr = (i % 2 === 0) ? `'min(zoom+0.003,1.06)'` : `'max(1.06-0.003*on,1.0)'`;
        const filterStr = `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z=${zoomExpr}:d=${framesCount}:s=1080x1920:fps=${fps},setsar=1,trim=duration=${s.dur},setpts=PTS-STARTPTS`;

        execSync(`"${ffmpeg}" -y -loop 1 -t ${s.dur} -i "${frameJpg}" -filter_complex "${filterStr}" -c:v libx264 -pix_fmt yuv420p -r ${fps} "${clipMp4}"`, { stdio: 'ignore' });
        renderedClips.push(clipMp4);
    }
    await browser.close();

    // 3. איחוד הקליפים ומיקס מוזיקה + קריינות
    const concatTxt = path.join(tempDir, 'c.txt');
    fs.writeFileSync(concatTxt, renderedClips.map(c => `file '${c.replace(/\\/g, '/')}'`).join('\n'), 'utf8');

    const tempMerged = path.join(tempDir, 'merged_video.mp4');
    execSync(`"${ffmpeg}" -y -f concat -safe 0 -i "${concatTxt}" -c copy "${tempMerged}"`, { stdio: 'ignore' });

    const totalDur = shotsData.reduce((acc, s) => acc + s.dur, 0); // ~5.25s
    const bgMusic = path.join(BASE_DIR, 'assets', 'audio', 'heartwarming.mp3');

    let muxCmd = '';
    if (finalVoicePath && fs.existsSync(finalVoicePath)) {
        const filterComplex = `[1:a]volume=0.20,afade=t=out:st=4.3:d=0.9[bg];[2:a]volume=1.9[vo];[bg][vo]amix=inputs=2:duration=first:dropout_transition=2[aout]`;
        muxCmd = `"${ffmpeg}" -y -i "${tempMerged}" -ss 00:00:01.0 -t ${totalDur} -i "${bgMusic}" -i "${finalVoicePath}" -filter_complex "${filterComplex}" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -t ${totalDur} "${videoOutPath}"`;
    } else {
        muxCmd = `"${ffmpeg}" -y -i "${tempMerged}" -ss 00:00:01.0 -t ${totalDur} -i "${bgMusic}" -filter_complex "[1:a]volume=1.2,afade=t=out:st=4.3:d=0.9[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t ${totalDur} "${videoOutPath}"`;
    }

    execSync(muxCmd, { stdio: 'ignore' });
    console.log(`✅ [סרטון פרסומת 5.6s מוכן!] נשמר בנתיב: ${videoOutPath}`);

    // העלאה ישירה ל-YouTube Shorts
    if (config?.youtube?.enabled) {
        const postData = {
            title: `${cleanTitle} (5 שניות) | עוז יודאיקה`,
            caption: `🔥 ${cleanTitle} מבית עוז יודאיקה!\n🏷️ מחיר: ₪${item.price} בלבד\n🚚 משלוח מהיר עד פתח הבית\n📱 להזמנות בוואטסאפ: 052-686-7192\n🌐 oz-judaica.co.il/?product=${item.id}\n\n#Shorts #עוזיודאיקה #יודאיקה #יהדות #מתנהלגבר`,
            product_url: `https://oz-judaica.co.il/?product=${item.id}`,
            video_file: videoOutPath,
            privacy_status: 'public'
        };

        try {
            const ytRes = await publishToYouTubeShorts(postData, config);
            if (ytRes.success) {
                console.log(`🎉 [YouTube Shorts] הועלה בהצלחה: ${ytRes.url}`);
            }
        } catch (e) {
            console.error('YouTube Shorts error:', e.message);
        }
    }

    return videoOutPath;
}

/**
 * עדכון עמוד status.html הקבוע ופריסה אוטומטית ל-Cloudflare Pages
 */
function updateStatusHtml(items) {
    const cardsHtml = items.map((item, idx) => `
        <!-- Card ${idx + 1}: ${item.title} -->
        <div class="flyer-showcase-card" style="display: flex !important; opacity: 1 !important; visibility: visible !important;">
            <div class="img-preview-box" onclick="previewImage('${item.relativeFlyer}')">
                <img src="${item.relativeFlyer}" alt="${item.title}" loading="eager">
                <div class="badge-overlay">${item.badge}</div>
            </div>
            <div class="card-details">
                <div>
                    <div class="card-title">${item.title}</div>
                    <div class="card-price">מחיר: ₪${item.price} בלבד</div>
                </div>
                <div class="actions-box">
                    <button class="btn-wa-share" onclick="shareFlyer('${item.relativeFlyer}', '${item.title}', '✨ ${item.title}\\n🏷️ מחיר: ₪${item.price} בלבד\\n📱 להזמנות בוואטסאפ: 052-686-7192\\n🌐 oz-judaica.co.il/?product=${item.id}')">
                        <span>🟢</span>
                        <span>שתף תמונה זו לוואטסאפ</span>
                    </button>
                    <div class="secondary-actions">
                        <a href="${item.relativeFlyer}" download="${item.id}_flyer.jpg" class="btn-sub">
                            <span>📥</span> הורד תמונה בלבד
                        </a>
                        <button class="btn-sub" onclick="copyCaption('✨ ${item.title}\\n🏷️ מחיר: ₪${item.price} בלבד\\n📱 להזמנות בוואטסאפ: 052-686-7192\\n🌐 oz-judaica.co.il/?product=${item.id}')">
                            <span>📋</span> העתק טקסט
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('\n');

    const htmlContent = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>עוז יודאיקה — מודעות שיווק מעוצבות לוואטסאפ</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800;900&family=Frank+Ruhl+Libre:wght@700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --purple-dark: #0f172a;
            --purple-card: #1e293b;
            --gold: #f59e0b;
            --gold-light: #fbbf24;
            --wa-green: #25D366;
            --wa-dark: #128C7E;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: #090d16;
            font-family: 'Assistant', sans-serif;
            color: #f1f5f9;
            padding-bottom: 80px;
            direction: rtl;
        }

        .header {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(12px);
            border-bottom: 2px solid var(--gold);
            padding: 18px 16px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .header h1 {
            font-family: 'Frank Ruhl Libre', serif;
            font-size: 24px;
            color: var(--gold-light);
            margin-bottom: 6px;
        }

        .header p {
            font-size: 13.5px;
            color: #94a3b8;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.4;
        }

        .container {
            max-width: 900px;
            margin: 24px auto 0 auto;
            padding: 0 16px;
        }

        .notice-banner {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.15));
            border: 1px solid rgba(245, 158, 11, 0.4);
            border-radius: 16px;
            padding: 14px 18px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13.5px;
            color: #e2e8f0;
            line-height: 1.5;
        }

        .notice-banner span {
            font-size: 26px;
            flex-shrink: 0;
        }

        .flyer-gallery-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            opacity: 1 !important;
            visibility: visible !important;
        }

        @media (min-width: 768px) {
            .flyer-gallery-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }

        .flyer-showcase-card {
            background: var(--purple-card) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 20px !important;
            overflow: hidden !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
            display: flex !important;
            flex-direction: column !important;
            transition: transform 0.2s, border-color 0.2s;
            opacity: 1 !important;
            visibility: visible !important;
        }

        .flyer-showcase-card:hover {
            transform: translateY(-4px);
            border-color: var(--gold) !important;
        }

        .img-preview-box {
            position: relative;
            width: 100%;
            background: #000;
            overflow: hidden;
            aspect-ratio: 3 / 4;
            cursor: pointer;
        }

        .img-preview-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s;
        }

        .img-preview-box:hover img {
            transform: scale(1.02);
        }

        .badge-overlay {
            position: absolute;
            top: 14px;
            right: 14px;
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid var(--gold);
            color: var(--gold-light);
            font-size: 12px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 20px;
            backdrop-filter: blur(8px);
        }

        .card-details {
            padding: 18px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            gap: 14px;
        }

        .card-title {
            font-size: 18px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 4px;
        }

        .card-price {
            font-size: 16px;
            font-weight: 900;
            color: #34d399;
        }

        .actions-box {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .btn-wa-share {
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: #ffffff;
            font-family: inherit;
            font-size: 15px;
            font-weight: 900;
            padding: 14px 18px;
            border-radius: 14px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            transition: all 0.2s;
        }

        .btn-wa-share:hover {
            filter: brightness(1.1);
            transform: translateY(-2px);
        }

        .btn-wa-share:active {
            transform: scale(0.98);
        }

        .secondary-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .btn-sub {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #cbd5e1;
            padding: 10px 8px;
            border-radius: 10px;
            font-size: 12.5px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .btn-sub:hover {
            background: rgba(255, 255, 255, 0.16);
            color: #ffffff;
        }

        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: var(--gold-light);
            border: 1.5px solid var(--gold);
            padding: 12px 28px;
            border-radius: 30px;
            font-weight: 800;
            font-size: 14px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 99999;
        }

        .toast.show { opacity: 1; }
    </style>
</head>
<body>

    <header class="header">
        <h1>עוז יודאיקה — מודעות שיווק מעוצבות לוואטסאפ</h1>
        <p>תמונות בפורמט מלא עם כל המילים והמחיר בתוך התמונה • בלחיצה אחת: שיתוף ישיר לוואטסאפ (סטטוס או שיחה)!</p>
    </header>

    <div class="container">
        <div class="notice-banner">
            <span>📲</span>
            <div>
                <strong>איך משתפים בשנייה אחת?</strong><br>
                לחץ על הכפתור הירוק <strong>"שתף תמונה זו לוואטסאפ"</strong>. בנייד ייפתח ישירות הוואטסאפ עם התמונה מוכנה להעלאה לסטטוס או לשליחה לאנשי קשר. במחשב התמונה תרד מיד ותיפתח שיחת הוואטסאפ!
            </div>
        </div>

        <div class="flyer-gallery-grid" style="display: grid !important; opacity: 1 !important; visibility: visible !important;">
${cardsHtml}
        </div>
    </div>

    <div id="toast" class="toast">הטקסט הועתק בהצלחה!</div>

    <script>
        async function shareFlyer(imgUrl, title, text) {
            try {
                showToast('מכין את התמונה לשיתוף...');
                const res = await fetch(imgUrl);
                const blob = await res.blob();
                const file = new File([blob], title.replace(/[^\\u0590-\\u05FFa-zA-Z0-9]/g, '_') + '.jpg', { type: 'image/jpeg' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: title, text: text });
                    showToast('התמונה נשלחה לשיתוף!');
                    return;
                }
            } catch (err) {
                console.log('Share fallback:', err);
            }

            const a = document.createElement('a');
            a.href = imgUrl;
            a.download = title.replace(/[^\\u0590-\\u05FFa-zA-Z0-9]/g, '_') + '.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});

            const waUrl = 'https://web.whatsapp.com/send?text=' + encodeURIComponent(text);
            showToast('התמונה ירדה למחשב! פותח את WhatsApp Web...');
            setTimeout(() => window.open(waUrl, '_blank'), 800);
        }

        function copyCaption(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => showToast('הטקסט הועתק ללוח!'));
            }
        }

        function previewImage(src) { window.open(src, '_blank'); }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }
    </script>
</body>
</html>
`;

    fs.writeFileSync(STATUS_HTML_FILE, htmlContent, 'utf8');
    fs.writeFileSync(STATUS_INDEX_FILE, htmlContent, 'utf8');
    fs.writeFileSync(WHATSAPP_HTML_FILE, htmlContent, 'utf8');

    // עדכון קובץ המודול עבור Edge Function של Cloudflare Pages
    const functionsDir = path.join(BASE_DIR, 'functions');
    const statusContentFile = path.join(functionsDir, 'status_content.js');
    if (fs.existsSync(functionsDir)) {
        fs.writeFileSync(statusContentFile, 'export const STATUS_HTML = ' + JSON.stringify(htmlContent) + ';\n', 'utf8');
    }
    console.log('✅ status.html, status/index.html, whatsapp_status.html ו-Edge Functions עודכנו בהצלחה!');
}

/**
 * מחזור יומי ראשי של המנוע
 */
async function runDailyCycle() {
    console.log('========================================================');
    console.log('🚀 מתחיל מחזור יומי: הפקת 5 כרזות Banana, וידאו Shorts ועדכון פורטל');
    console.log('========================================================');

    const config = loadConfig();

    // בדיקת ארגומנט סבב ידני או סבב יומי אוטומטי
    const args = process.argv.slice(2);
    const setArg = args.find(a => a.startsWith('--set='));

    let history = { lastSetIndex: -1, history: [] };
    if (fs.existsSync(HISTORY_FILE)) {
        try {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        } catch (e) {
            console.error('History parse error:', e.message);
        }
    }

    let setIndex;
    if (setArg) {
        setIndex = parseInt(setArg.split('=')[1], 10);
        if (isNaN(setIndex) || setIndex < 0 || setIndex >= DAILY_ROTATION_SETS.length) {
            setIndex = 1;
        }
    } else {
        const lastIdx = (typeof history.lastSetIndex === 'number') ? history.lastSetIndex : -1;
        setIndex = (lastIdx + 1) % DAILY_ROTATION_SETS.length;
    }

    const selectedItems = DAILY_ROTATION_SETS[setIndex];
    console.log(`\n📅 הפעלת סבב #${setIndex + 1} מתוך ${DAILY_ROTATION_SETS.length} (מכיל ${selectedItems.length} מוצרים נבחרים חדשים מהקטלוג)`);

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const activeFlyers = [];

    for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const flyerFilename = `creative_banana_${item.id}.jpg`;
        const flyerDiskPath = path.join(MARKETING_DIR, flyerFilename);
        const relativeFlyer = `/public/marketing/${flyerFilename}`;

        console.log(`\n[${i + 1}/${selectedItems.length}] מעבד כרזה עבור: ${item.title}...`);
        await renderFlyerCard(browser, item, flyerDiskPath);

        // יצירת וידאו והעלאה ליוטיוב Shorts (עם טיפול שקט בחריגת מכסה יומית של גוגל)
        console.log(`🎬 מפיק סרטון ומשדר ל-YouTube Shorts...`);
        try {
            await createAndPublishVideo(flyerDiskPath, item, config);
        } catch (vidErr) {
            console.warn(`Video step notice for ${item.id}:`, vidErr.message);
        }

        activeFlyers.push({
            ...item,
            relativeFlyer
        });
    }

    await browser.close();

    // עדכון העמוד הקבוע
    updateStatusHtml(activeFlyers);

    // עדכון קובץ היסטוריית הסבבים
    history.lastSetIndex = setIndex;
    history.lastRunAt = new Date().toISOString();
    history.lastSetName = `סבב #${setIndex + 1}`;
    if (!Array.isArray(history.history)) history.history = [];
    history.history.push({
        setIndex,
        date: new Date().toISOString(),
        products: selectedItems.map(p => ({ id: p.id, title: p.title, price: p.price }))
    });
    if (history.history.length > 30) history.history = history.history.slice(-30);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    console.log(`💾 נשמרה היסטוריית מחזור יומי: סבב #${setIndex + 1} נרשם בהצלחה.`);

    // פריסה חיה ל-Cloudflare Pages
    console.log('☁️ פורס את העמוד המעודכן ל-Cloudflare Pages (oz-judaica.co.il)...');
    try {
        execSync('powershell -ExecutionPolicy Bypass -File deploy_to_cloudflare_pages.ps1', {
            cwd: BASE_DIR,
            stdio: 'inherit'
        });
        console.log('🎉 פריסה הושלמה בהצלחה! העמוד חי ב: https://oz-judaica.co.il/status.html');
    } catch (deployErr) {
        console.error('Deploy notice:', deployErr.message);
    }
}

if (require.main === module) {
    runDailyCycle().catch(console.error);
}

module.exports = { runDailyCycle, updateStatusHtml };
