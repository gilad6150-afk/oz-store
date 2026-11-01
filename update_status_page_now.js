const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const MARKETING_DIR = '/public/marketing';

// 21 Flagship Products with 100% exact authentic catalog prices
const ALL_STATUS_ADS = [
    // --- נבחרת היום החדשה (חדשים לחלוטין שלא הוצגו אתמול!) ---
    {
        id: 19001,
        isNewToday: true,
        categoryKey: 'sets',
        categoryName: 'מארזים ומתנות',
        badge: '👑 חדש היום • מארז חתן מפואר',
        title: 'סט חתן מלכותי פרימיום – תפילין מהודרות, תפידנית מוגנת, סידור, תהילים וארנק עור נאפה',
        price: '2,863',
        rawPrice: 2863,
        specs: 'תפילין בהמה גסה • תפידנית מוגנת מפני חום • סידור ותהילים נהרות • ארנק עור איטלקי',
        hook: 'מתכוננים לחתונה? מחפשים מתנה שתרגש את החתן עד דמעות ותלווה אותו לכל החיים?',
        img: `${MARKETING_DIR}/creative_banana_19001.jpg`
    },
    {
        id: 19010,
        isNewToday: true,
        categoryKey: 'sets',
        categoryName: 'מארזים ומתנות',
        badge: '✨ חדש היום • סט בר מצווה VIP',
        title: 'סט בר מצווה יוקרתי אקסקלוסיבי – תפילין מהודרות א.א, תפידנית מוגנת, סידור, תהילים וארנק עור נאפה',
        price: '3,105',
        rawPrice: 3105,
        specs: 'תפילין בהמה גסה א.א • תפידנית מרופדת • סידור ותהילים בכריכה מהודרת • ארנק עור יוקרתי',
        hook: 'הבן מגיע לגיל מצוות? העניקו לו חוויית קדושה מרגשת ומושלמת ליום העלייה לתורה.',
        img: `${MARKETING_DIR}/creative_banana_19010.jpg`
    },
    {
        id: 20151,
        isNewToday: true,
        categoryKey: 'stam',
        categoryName: 'תשמישי קדושה וסת"ם',
        badge: '✡️ חדש היום • הידור שיא למהדרין',
        title: 'תפילין בהמה גסה חרוצות מהודרות במיוחד – עוז יודאיקה',
        price: '4,500',
        rawPrice: 4500,
        specs: 'בהמה גסה חרוצות מובחרת • כתיבת סופר יר"ש • הגהת מחשב וגברא • תעודת כשרות מלאה',
        hook: 'מחפשים תפילין של פעם בחיים? הידור הלכתי עילאי ללא שמץ פשרה באיכות הכתיבה והבתים.',
        img: `${MARKETING_DIR}/creative_banana_20151.jpg`
    },
    {
        id: 21001,
        isNewToday: true,
        categoryKey: 'stam',
        categoryName: 'תשמישי קדושה וסת"ם',
        badge: '🏛️ חדש היום • דגם הדגל',
        title: 'בית מזוזה יוקרתי מבטון אדריכלי – "האש שלי" (12 ס"מ)',
        price: '99',
        rawPrice: 99,
        specs: 'בטון אדריכלי פרימיום • עמיד לחלוטין לשמש וגשם • הטבעת "האש שלי" בלעדית',
        hook: 'איך להכניס עיצוב מודרני מרהיב, עוצמה וקדושה לפתח הבית שלך?',
        img: `${MARKETING_DIR}/creative_banana_21001.jpg`
    },
    {
        id: 21002,
        isNewToday: true,
        categoryKey: 'stam',
        categoryName: 'תשמישי קדושה וסת"ם',
        badge: '🏡 חדש היום • מארז 3 מזוזות',
        title: 'מארז 3 בתי מזוזה בטון אדריכלי – "האש שלי" (12 ס"מ)',
        price: '276',
        rawPrice: 276,
        specs: 'שלישיית בתי מזוזה תואמים • מתאים לקלף 12 ס"מ • אטימה הרמטית מלאה',
        hook: 'משפצים או נכנסים לבית חדש? שדרגו את כל הפתחים המרכזיים בקו עיצובי נקי, עמיד ומלא השראה.',
        img: `${MARKETING_DIR}/creative_banana_21002.jpg`
    },
    {
        id: 19007,
        isNewToday: true,
        categoryKey: 'books',
        categoryName: 'ספרי קודש וסגולות',
        badge: '📖 חדש היום • ספרי יסוד נהרות',
        title: 'מארז ספרי קודש מבוארים מהודר – סידור, תהילים וחמש מגילות (ספרי יסוד בהוצאת נהרות)',
        price: '116',
        rawPrice: 116,
        specs: 'שלישיית ספרים מהודרת • ביאור בהיר משולב • אותיות מאירות עיניים • הטבעת זהב יוקרתית',
        hook: 'מחפשים מתנה ערכית ומרגשת לכל בית יהודי? שלישיית ספרי היסוד של נהרות במארז מושלם.',
        img: `${MARKETING_DIR}/creative_banana_19007.jpg`
    },
    {
        id: 19009,
        isNewToday: true,
        categoryKey: 'sets',
        categoryName: 'מארזים ומתנות',
        badge: '💼 חדש היום • מארז ג\'נטלמן',
        title: "מארז הוקרה אלגנטי לגבר – ארנק עור ברידג', תיק תפילין שני רוכסנים, סידור ותהילים מבוארים",
        price: '399',
        rawPrice: 399,
        specs: 'ארנק עור ברידג\' איכותי • תיק תפילין מרווח • סידור ותהילים מבוארים בכריכה תואמת',
        hook: 'מתנה מושלמת לגבר ליום הולדת, קידום, חג או הוקרה – שילוב מנצח של פרקטיקה וקדושה.',
        img: `${MARKETING_DIR}/creative_banana_19009.jpg`
    },
    {
        id: 20116,
        isNewToday: true,
        categoryKey: 'pictures',
        categoryName: 'תמונות קודש מזכוכית',
        badge: '🕊️ חדש היום • פנורמת הכותל',
        title: 'תמונת זכוכית פנורמית – פנורמת הכותל המערבי ורחבת התפילה באור יום צלול',
        price: '400',
        rawPrice: 400,
        specs: 'זכוכית מחוסמת קריסטל 4 מ"מ • הדפסה פנורמית חדה במיוחד • תלייה צפה נסתרת',
        hook: 'רוצים להרגיש את הוד הכותל המערבי והקדושה של ירושלים בסלון הבית בכל יום מחדש?',
        img: `${MARKETING_DIR}/creative_banana_20116.jpg`
    },
    {
        id: 7821,
        isNewToday: true,
        categoryKey: 'wallets',
        categoryName: 'ארנקי עור וגברים',
        badge: '💼 חדש היום • עור נאפה איטלקי',
        title: 'ארנק עור נאפה מעוצב לגבר עם תא שטרות מורחב – שחור אלגנטי',
        price: '129',
        rawPrice: 129,
        specs: '100% עור נאפה אמיתי ורך למגע • חלוקה חכמה לכרטיסים ומזומן • תפירה כפולה עמידה',
        hook: 'מחפשים ארנק איכותי באמת שלא יתבלה אחרי חודשיים? עור נאפה אמיתי בעיצוב אלגנטי ונקי.',
        img: `${MARKETING_DIR}/creative_banana_7821.jpg`
    },
    {
        id: 7223,
        isNewToday: true,
        categoryKey: 'books',
        categoryName: 'ספרי קודש וסגולות',
        badge: '✨ חדש היום • תהילים מבואר',
        title: 'ספר תהילים המבואר – פירוש משולב לפסוקי דוד המלך – עוז יודאיקה',
        price: '45',
        rawPrice: 45,
        specs: 'אותיות גדולות ומאירות עיניים • פירוש בהיר משולב בפסוקים • כריכה יוקרתית בהטבעה מוזהבת',
        hook: 'התהילים שתרצו לקחת איתכם לכל מקום: קריאה חלקה, אותיות ברורות ופירוש שמחבר את הלב.',
        img: `${MARKETING_DIR}/creative_banana_7223.jpg`
    },
    {
        id: 556,
        isNewToday: true,
        categoryKey: 'stam',
        categoryName: 'תשמישי קדושה וסת"ם',
        badge: '🌿 חדש היום • עץ זית ואפוקסי',
        title: 'בית מזוזה אפוקסי משולב עם עץ זית לבן שמנת עבודת יד – דגם יחיד (לבחירה 12 או 15 ס״מ)',
        price: '189',
        rawPrice: 189,
        specs: 'עץ זית גלילי מקורי • אפוקסי פנינה יצוק ידנית • אות ש\' מוזהבת • יחיד במינו (One of a Kind)',
        hook: 'להכניס חמימות גלילית ואומנות בוטיק יוקרתית לדלת הכניסה שלך – כל פריט הוא יצירה חד-פעמית.',
        img: `${MARKETING_DIR}/creative_banana_556.jpg`
    },

    // --- שאר מוצרי הדגל המבוקשים ---
    {
        id: 21010,
        isNewToday: false,
        categoryKey: 'stam',
        categoryName: 'תשמישי קדושה וסת"ם',
        badge: '✡️ כשרות מהודרת למהדרין',
        title: 'קלף מזוזה כשר למהדרין – בהגהת מחשב וסופר סת״ם יר״ש (גדלים לבחירה)',
        price: '250',
        rawPrice: 250,
        specs: 'כתיבת יד סופר יר"ש • דיו שחור עמיד • הגהת מחשב דיגיטלית כפולה • תעודת כשרות חתומה',
        hook: 'מתי בדקתם את המזוזות שלכם לאחרונה? קלף כשר למהדרין המבטיח שמירה וברכה אמיתית לבית.',
        img: `${MARKETING_DIR}/creative_banana_21010.jpg`
    },
    {
        id: 19005,
        isNewToday: false,
        categoryKey: 'sets',
        categoryName: 'מארזים ומתנות',
        badge: '🏡 מארז ברכה לחנוכת בית',
        title: 'סט חנוכת בית וזוג צעיר – מזוזת עץ זית ואפוקסי ארץ ישראל, מזמור לתודה, סידור ופיטום הקטורת',
        price: '409',
        rawPrice: 409,
        specs: 'בית מזוזה עץ זית ואפוקסי • תמונת מזמור לתודה • סידור מבואר • ברכת פיטום הקטורת',
        hook: 'המתנה המושלמת לחנוכת בית או לזוג צעיר – שילוב מושלם של קדושה, ברכה ועיצוב מרהיב.',
        img: `${MARKETING_DIR}/creative_banana_19005.jpg`
    },
    {
        id: 20015,
        isNewToday: false,
        categoryKey: 'pictures',
        categoryName: 'תמונות קודש מזכוכית',
        badge: '👑 דמותו המאירה של מרן',
        title: 'תמונת זכוכית – מרן רבנו עובדיה יוסף זיע"א פוסק הדור (מלבן)',
        price: '220',
        rawPrice: 220,
        specs: 'זכוכית מחוסמת קריסטל 4 מ"מ • קנט מלוטש • תלייה מרחפת נסתרת • חדות צבעים מושלמת',
        hook: 'ברכת הצדיק בלב הסלון שלכם: דמותו הקדושה של מרן פוסק הדור בתמונת זכוכית קריסטלית מרשימה.',
        img: `${MARKETING_DIR}/creative_banana_20015.jpg`
    },
    {
        id: 20115,
        isNewToday: false,
        categoryKey: 'pictures',
        categoryName: 'תמונות קודש מזכוכית',
        badge: '🕊️ אבני הכותל המערבי',
        title: 'תמונת זכוכית – אבני הכותל המערבי הוד קדומים (תקריב קריסטלי מאקרו)',
        price: '220',
        rawPrice: 220,
        specs: 'זכוכית מחוסמת אקסטרה-קליר • תקריב מאקרו מרהיב • תלייה ללא מסגרת • מראה צף יוקרתי',
        hook: 'לגעת באבני הכותל בכל מבט: תמונת זכוכית עוצרת נשימה של שריד בית מקדשנו לסלון הבית.',
        img: `${MARKETING_DIR}/creative_banana_20115.jpg`
    },
    {
        id: 7220,
        isNewToday: false,
        categoryKey: 'books',
        categoryName: 'ספרי קודש וסגולות',
        badge: '📖 הסידור המבואר',
        title: 'הסידור המבואר – תפילת ימות השבוע ושבת קודש – עוז יודאיקה',
        price: '45',
        rawPrice: 45,
        specs: 'אותיות גדולות ומאירות עיניים • ביאור פנינים בהיר • כריכה מוטבעת זהב • נוסח מדויק ומדוקדק',
        hook: 'להתפלל מתוך שמחה ובהירות: סידור מהודר שהופך כל תפילה לחוויה רוחנית מרוממת.',
        img: `${MARKETING_DIR}/creative_banana_7220.jpg`
    },
    {
        id: 19004,
        isNewToday: false,
        categoryKey: 'sets',
        categoryName: 'מארזים ומתנות',
        badge: '🕯️ פאר והדר לשולחן השבת',
        title: 'סט שבת קודש מהודר – תמונת זכוכית אשת חיל, סכין חלה וסידור מבואר',
        price: '275',
        rawPrice: 275,
        specs: 'תמונת זכוכית אשת חיל יוקרתית • סכין חלה מעוצבת וחדה • סידור מבואר מהודר לשבת',
        hook: 'רוצים להלביש את שולחן השבת בהוד מלכותי? מארז שבת קודש יוקרתי ומלא שמחה לכל המשפחה.',
        img: `${MARKETING_DIR}/creative_banana_19004.jpg`
    },
    {
        id: 555,
        isNewToday: false,
        categoryKey: 'stam',
        categoryName: 'תשמישי קדושה וסת"ם',
        badge: '✨ מארז 5 מזוזות יוקרה',
        title: 'סט 5 מזוזות אפוקסי משולב עם עץ זית לבן שמנת עבודת יד (12 ס"מ) – עוז יודאיקה',
        price: '850',
        rawPrice: 850,
        specs: 'חמישה בתי מזוזה תואמים • עץ זית גלילי ואפוקסי פנינה • אות ש\' מוזהבת • קו עיצובי אחיד',
        hook: 'הפתרון המושלם לכל חדרי הבית: מראה יוקרתי, חם ואחיד לכל פתחי הבית בעבודת יד מרהיבה.',
        img: `${MARKETING_DIR}/creative_banana_555.jpg`
    },
    {
        id: 7221,
        isNewToday: false,
        categoryKey: 'books',
        categoryName: 'ספרי קודש וסגולות',
        badge: '📜 חמש מגילות מבוארות',
        title: 'חמש מגילות מבוארות – עם ביאור משולב – עוז יודאיקה',
        price: '35',
        rawPrice: 35,
        specs: 'חמש המגילות בכרך אחד מהודר • פירוש בהיר משולב • אותיות מאירות עיניים • כריכה יוקרתית',
        hook: 'מתנה ערכית ושימושית לשבתות, למועדים ולכל ימות השנה בביאור בהיר ומאיר עיניים.',
        img: `${MARKETING_DIR}/creative_banana_7221.jpg`
    },
    {
        id: 7911,
        isNewToday: false,
        categoryKey: 'wallets',
        categoryName: 'ארנקי עור וגברים',
        badge: '💼 קומפקטי עם הגנת RFID',
        title: 'ארנק דמוי עור לגבר בעיצוב קומפקטי – אפור עכבר',
        price: '80',
        rawPrice: 80,
        specs: 'הגנת RFID נגד גניבות מידע • עיצוב דק במיוחד הנכנס לכל כיס • חלוקה חכמה לכרטיסים ושטרות',
        hook: 'נמאס מארנקים מגושמים ומנופחים בכיס? ארנק קומפקטי, אלגנטי, מוגן וקל משקל.',
        img: `${MARKETING_DIR}/creative_banana_7911.jpg`
    },
    {
        id: 633,
        isNewToday: false,
        categoryKey: 'books',
        categoryName: 'ספרי קודש וסגולות',
        badge: '🛡️ סגולה עילאית לפרנסה ושמירה',
        title: 'פיטום הקטורת פיו 15*15',
        price: '40',
        rawPrice: 40,
        specs: 'סגולת פיטום הקטורת המפורסמת להגנה, שמירה ופרנסה ברווח • פורמט מהודר 15x15 מתאים לכל חדר',
        hook: 'סגולה בדוקה לפרנסה, שמירה והצלחה: הציבו את פיטום הקטורת בבית, במשרד או בעסק לשפע וברכה.',
        img: `${MARKETING_DIR}/creative_banana_633.jpg`
    }
];

function generateStatusPage() {
    console.log(`Generating status page with ${ALL_STATUS_ADS.length} marketing flyers...`);

    const cardsHtml = ALL_STATUS_ADS.map((ad, idx) => {
        const shareText = `✨ ${ad.title}\n🏷️ מחיר: ₪${ad.price} בלבד\n📱 להזמנות בוואטסאפ: 052-686-7192\n🌐 oz-judaica.co.il/?product=${ad.id}`;
        const escapedShareText = shareText.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');

        return `
        <!-- Card ${idx + 1}: ${ad.title} -->
        <article class="flyer-showcase-card ${ad.isNewToday ? 'is-new-today' : ''}" data-category="${ad.categoryKey}" data-new="${ad.isNewToday ? 'true' : 'false'}">
            <div class="img-preview-box" onclick="previewImage('${ad.img}')">
                <img src="${ad.img}" alt="${ad.title}" loading="lazy">
                <div class="badge-overlay">${ad.badge}</div>
                ${ad.isNewToday ? '<div class="new-glow-pill">🌟 חדש היום</div>' : ''}
            </div>
            <div class="card-details">
                <div>
                    <div class="category-chip">${ad.categoryName}</div>
                    <h2 class="card-title">${ad.title}</h2>
                    <div class="card-price">מחיר: ₪${ad.price} בלבד</div>
                    <div class="card-specs">${ad.specs}</div>
                    <p class="card-hook">"${ad.hook}"</p>
                </div>
                <div class="actions-box">
                    <button class="btn-wa-share" onclick="shareFlyer('${ad.img}', '${ad.title.replace(/'/g, "\\'")}', '${escapedShareText}')">
                        <span>🟢</span>
                        <span>שתף ישיר לוואטסאפ (תמונה + טקסט)</span>
                    </button>
                    <div class="secondary-actions">
                        <a href="${ad.img}" download="${ad.id}_flyer.jpg" class="btn-sub">
                            <span>📥</span> הורד כרזה
                        </a>
                        <button class="btn-sub" onclick="copyCaption('${escapedShareText}')">
                            <span>📋</span> העתק טקסט
                        </button>
                        <a href="https://oz-judaica.co.il/?product=${ad.id}" target="_blank" rel="noopener" class="btn-sub btn-store">
                            <span>🌐</span> צפה באתר
                        </a>
                    </div>
                </div>
            </div>
        </article>
        `;
    }).join('\n');

    const htmlContent = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>עוז יודאיקה — מרכז כרזות שיווק מעוצבות לוואטסאפ</title>
    <meta name="description" content="פורטל השיווק הרשמי של עוז יודאיקה: כרזות שיווק מעוצבות באיכות סטודיו לשיתוף מיידי בוואטסאפ (סטטוס ושיחות), עם מחירים אמיתיים וקישורים ישירים.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800;900&family=Frank+Ruhl+Libre:wght@700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --purple-dark: #0a0f1d;
            --purple-card: #151e32;
            --gold: #f59e0b;
            --gold-light: #fbbf24;
            --gold-glow: rgba(245, 158, 11, 0.35);
            --wa-green: #25D366;
            --wa-dark: #128C7E;
            --slate-border: rgba(255, 255, 255, 0.12);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: #070b14;
            font-family: 'Assistant', sans-serif;
            color: #f1f5f9;
            padding-bottom: 90px;
            direction: rtl;
            min-height: 100vh;
        }

        .header {
            background: rgba(10, 15, 29, 0.96);
            backdrop-filter: blur(14px);
            border-bottom: 2px solid var(--gold);
            padding: 20px 16px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 6px 24px rgba(0,0,0,0.6);
        }

        .header-inner {
            max-width: 960px;
            margin: 0 auto;
        }

        .header h1 {
            font-family: 'Frank Ruhl Libre', serif;
            font-size: 26px;
            color: var(--gold-light);
            margin-bottom: 6px;
            text-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .header p {
            font-size: 14px;
            color: #94a3b8;
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.45;
        }

        .date-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(245, 158, 11, 0.12);
            border: 1px solid var(--gold);
            color: var(--gold-light);
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 12.5px;
            font-weight: 800;
            margin-top: 10px;
        }

        .container {
            max-width: 960px;
            margin: 24px auto 0 auto;
            padding: 0 16px;
        }

        .quick-filter-bar {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 12px;
            margin-bottom: 24px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
        }

        .quick-filter-bar::-webkit-scrollbar { display: none; }

        .filter-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--slate-border);
            color: #cbd5e1;
            padding: 8px 16px;
            border-radius: 25px;
            font-family: inherit;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .filter-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            color: #ffffff;
        }

        .filter-btn.active {
            background: linear-gradient(135deg, var(--gold) 0%, #d97706 100%);
            color: #070b14;
            border-color: var(--gold-light);
            font-weight: 900;
            box-shadow: 0 4px 15px var(--gold-glow);
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

        .notice-banner span.emoji {
            font-size: 28px;
            flex-shrink: 0;
        }

        .flyer-gallery-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 28px;
        }

        @media (min-width: 768px) {
            .flyer-gallery-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 32px;
            }
        }

        .flyer-showcase-card {
            background: var(--purple-card);
            border: 1.5px solid var(--slate-border);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .flyer-showcase-card:hover {
            transform: translateY(-4px);
            border-color: var(--gold);
            box-shadow: 0 14px 40px rgba(245, 158, 11, 0.2);
        }

        .flyer-showcase-card.is-new-today {
            border-color: rgba(245, 158, 11, 0.5);
            position: relative;
        }

        .flyer-showcase-card.hidden {
            display: none !important;
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
            transition: transform 0.35s ease;
        }

        .img-preview-box:hover img {
            transform: scale(1.025);
        }

        .badge-overlay {
            position: absolute;
            top: 14px;
            right: 14px;
            background: rgba(10, 15, 29, 0.88);
            border: 1px solid var(--gold);
            color: var(--gold-light);
            font-size: 12px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 20px;
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .new-glow-pill {
            position: absolute;
            top: 14px;
            left: 14px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            font-size: 11px;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 20px;
            box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);
            letter-spacing: 0.5px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.85; transform: scale(1.04); }
        }

        .card-details {
            padding: 18px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            gap: 14px;
        }

        .category-chip {
            font-size: 11.5px;
            font-weight: 800;
            color: var(--gold-light);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .card-title {
            font-size: 17px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.35;
            margin-bottom: 6px;
        }

        .card-price {
            font-size: 18px;
            font-weight: 900;
            color: #34d399;
            margin-bottom: 6px;
        }

        .card-specs {
            font-size: 12.5px;
            color: #94a3b8;
            line-height: 1.4;
            margin-bottom: 6px;
        }

        .card-hook {
            font-size: 13px;
            font-style: italic;
            color: #cbd5e1;
            line-height: 1.4;
            background: rgba(255, 255, 255, 0.04);
            padding: 8px 12px;
            border-radius: 10px;
            border-right: 3px solid var(--gold);
        }

        .actions-box {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 4px;
        }

        .btn-wa-share {
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: #ffffff;
            font-family: inherit;
            font-size: 15px;
            font-weight: 900;
            padding: 13px 18px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.35);
            transition: all 0.2s;
        }

        .btn-wa-share:hover {
            filter: brightness(1.1);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
        }

        .btn-wa-share:active {
            transform: scale(0.98);
        }

        .secondary-actions {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 6px;
        }

        .btn-sub {
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid var(--slate-border);
            color: #cbd5e1;
            padding: 9px 6px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }

        .btn-sub:hover {
            background: rgba(255, 255, 255, 0.14);
            color: #ffffff;
        }

        .btn-store {
            color: var(--gold-light);
            border-color: rgba(245, 158, 11, 0.3);
        }

        .btn-store:hover {
            background: rgba(245, 158, 11, 0.15);
            border-color: var(--gold);
        }

        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #151e32;
            color: var(--gold-light);
            border: 1.5px solid var(--gold);
            padding: 12px 28px;
            border-radius: 30px;
            font-weight: 800;
            font-size: 14px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.7);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 99999;
        }

        .toast.show { opacity: 1; }

        /* Lightbox modal */
        .lightbox-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.92);
            z-index: 100000;
            justify-content: center;
            align-items: center;
            padding: 20px;
            cursor: pointer;
        }

        .lightbox-modal.active {
            display: flex;
        }

        .lightbox-modal img {
            max-width: 95%;
            max-height: 90vh;
            border-radius: 16px;
            border: 2px solid var(--gold);
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            object-fit: contain;
        }
    </style>
</head>
<body>

    <header class="header">
        <div class="header-inner">
            <h1>עוז יודאיקה — מרכז כרזות שיווק מעוצבות לוואטסאפ</h1>
            <p>כרזות סטודיו איכותיות בפורמט מלא עם כל הפרטים והמחירים • בלחיצה אחת: שיתוף ישיר לוואטסאפ (סטטוס או שיחה)!</p>
            <div class="date-badge">
                <span>📅</span>
                <span>מהדורה מעודכנת • 1 בנובמבר 2026</span>
            </div>
        </div>
    </header>

    <div class="container">
        
        <!-- Quick Category & Filter Tabs -->
        <nav class="quick-filter-bar" aria-label="סינון קטגוריות כרזות">
            <button class="filter-btn active" onclick="filterGallery('new', this)">
                <span>🌟</span> נבחרת היום החדשה
            </button>
            <button class="filter-btn" onclick="filterGallery('all', this)">
                <span>🔥</span> הכל (${ALL_STATUS_ADS.length} כרזות)
            </button>
            <button class="filter-btn" onclick="filterGallery('sets', this)">
                <span>🎁</span> מארזים ומתנות
            </button>
            <button class="filter-btn" onclick="filterGallery('stam', this)">
                <span>✡️</span> תפילין, מזוזות וסת"ם
            </button>
            <button class="filter-btn" onclick="filterGallery('books', this)">
                <span>📖</span> ספרי קודש וסגולות
            </button>
            <button class="filter-btn" onclick="filterGallery('pictures', this)">
                <span>🖼️</span> תמונות זכוכית
            </button>
            <button class="filter-btn" onclick="filterGallery('wallets', this)">
                <span>💼</span> ארנקים וגברים
            </button>
        </nav>

        <div class="notice-banner">
            <span class="emoji">💡</span>
            <div>
                <strong>איך משתפים בשניות?</strong>
                לוחצים על הכפתור הירוק <strong>"שתף ישיר לוואטסאפ"</strong>. מהנייד תיפתח לכם האפליקציה לשיתוף התמונה עם הטקסט בסטטוס או לקבוצות! ניתן גם להוריד את התמונה או להעתיק את הטקסט בלבד.
            </div>
        </div>

        <main class="flyer-gallery-grid" id="galleryGrid">
            ${cardsHtml}
        </main>

    </div>

    <!-- Lightbox Modal -->
    <div class="lightbox-modal" id="lightboxModal" onclick="closeLightbox()">
        <img id="lightboxImg" src="" alt="תצוגה מוגדלת">
    </div>

    <div id="toast" class="toast">הטקסט הועתק בהצלחה!</div>

    <script>
        function filterGallery(category, btnEl) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            if (btnEl) btnEl.classList.add('active');

            const cards = document.querySelectorAll('.flyer-showcase-card');
            cards.forEach(card => {
                if (category === 'all') {
                    card.classList.remove('hidden');
                } else if (category === 'new') {
                    if (card.getAttribute('data-new') === 'true') {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                } else {
                    if (card.getAttribute('data-category') === category) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        }

        // Default filter: Show new items on top
        document.addEventListener('DOMContentLoaded', () => {
            const initialBtn = document.querySelector('.filter-btn.active');
            if (initialBtn) filterGallery('new', initialBtn);
        });

        async function shareFlyer(imgUrl, title, text) {
            try {
                showToast('מכין את התמונה לשיתוף...');
                const res = await fetch(imgUrl);
                const blob = await res.blob();
                const file = new File([blob], title.replace(/[^\\u0590-\\u05FFa-zA-Z0-9]/g, '_') + '.jpg', { type: 'image/jpeg' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: title,
                        text: text
                    });
                    showToast('התמונה שותפה בהצלחה!');
                    return;
                }
            } catch (err) {
                console.log('Native share canceled or unsupported:', err);
            }

            // Fallback: Open WhatsApp Web / App with text and product link
            window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
        }

        function copyCaption(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('הטקסט הועתק בהצלחה! הדבק בסטטוס או בשיחה');
            }).catch(() => {
                showToast('שגיאה בהעתקה, נסה שנית');
            });
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
        }

        function previewImage(src) {
            const modal = document.getElementById('lightboxModal');
            const img = document.getElementById('lightboxImg');
            img.src = src;
            modal.classList.add('active');
        }

        function closeLightbox() {
            const modal = document.getElementById('lightboxModal');
            modal.classList.remove('active');
        }
    </script>
</body>
</html>`;

    // Write to all target locations
    const targets = [
        path.join(BASE_DIR, 'status.html'),
        path.join(BASE_DIR, 'whatsapp_status.html'),
        path.join(BASE_DIR, 'status', 'index.html'),
        path.join(BASE_DIR, 'cloudflare_deploy', 'status.html'),
        path.join(BASE_DIR, 'cloudflare_deploy', 'status', 'index.html')
    ];

    targets.forEach(t => {
        fs.mkdirSync(path.dirname(t), { recursive: true });
        fs.writeFileSync(t, htmlContent, 'utf8');
        console.log(`[OK] Written to ${t}`);
    });

    // Also update Edge Worker function content
    const jsContent = 'export const STATUS_HTML = ' + JSON.stringify(htmlContent) + ';\n';
    const funcTargets = [
        path.join(BASE_DIR, 'functions', 'status_content.js'),
        path.join(BASE_DIR, 'cloudflare_deploy', 'functions', 'status_content.js')
    ];
    funcTargets.forEach(ft => {
        fs.mkdirSync(path.dirname(ft), { recursive: true });
        fs.writeFileSync(ft, jsContent, 'utf8');
        console.log(`[OK] Edge Function updated: ${ft}`);
    });

    console.log('SUCCESS: All status pages updated with 21 new & flagship ads!');
}

generateStatusPage();
