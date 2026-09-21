const disclaimerHtml = `<div class="p-4 bg-purple-600 border-r-4 border-purple-600 rounded-2xl text-purple-600 text-xs font-bold leading-relaxed mb-6">⚠️ <strong>לתשומת לב הקוראים והלומדים:</strong> התוכן המובא במאמר זה מוגש לשם העשרה, עיון ומידע כללי בלבד. אין לראות בכתוב משום הלכה פסוקה, פסק הלכה מורשה או תחליף להזמנת פסיקה אישית מרב מורה הוראה או דמות סמכותית רוחנית. בכל שאלה מעשית יש לפנות לרב מוסמך.</div>`;

const articlesDB = [
    {
        id: 1,
        title: "איך בוחרים תפילין מהודרות לבר מצווה? מדריך מקיף לסוגי בתים, כתב ורצועות",
        category: "תפילין וסת\"ם",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כל מה שצריך לדעת לפני רכישת תפילין ראשונות לנער בר מצווה: ההבדל בין בהמה גסה לדקה, נוסחאות הכתב, בדיקת מחשב מול הגהת גברא, וטיפים לשמירה לאורך שנים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">רכישת תפילין לבר מצווה – צעד רוחני ומשמעותי בחיים</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הגעה לגיל מצוות היא אחת התחנות המרגשות ביותר בחייו של הנער והמשפחה. מצוות תפילין היא אות וקשר נצחי בין עם ישראל לאבינו שבשמים. כאשר ניגשים לרכוש תפילין, מדובר בהשקעה דורית המשמשת את הנער יום-יום למשך עשרות שנים. לכן, חשוב להבין את הפרמטרים הקובעים את רמת הכשרות, ההידור והעמידות.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">1. סוג הבית: בהמה גסה מול בהמה דקה</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">הבתים מבהמה גסה (עור עגל עבה) חזקים ועמידים במיוחד ואינם מושפעים משינויי טמפרטורה, לחות או זיעה. מומלץ בחום לכל נער בר מצווה. ניתן להתרשם מ<a href="javascript:openProductPage('1')" class="text-oz-primary font-black underline hover:text-oz-hover">תפילין מהודרות מבהמה גסה במכון עוז</a>.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">2. הגהת הפרשיות: הגהת גברא לצד הגהת מחשב</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">כדי שפרשיות התפילין יהיו כשרות למהדרין, חובה שיכתבו על ידי סופר סת"ם ירא שמיים בעל תעודת הסמכה בתוקף. במכון עוז כל פרשייה עוברת הגהה כפולה: הגהת מגהיה מוסמך לצד סורק ממוחשב אופטי.</p>
            <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-oz-primary font-bold mb-4">
                💡 <strong>טיפ זהב מבית מכון עוז:</strong> אל תשכחו להצטייד בנרתיק מגן איכותי! <a href="javascript:openProductPage('9999')" class="underline font-black">נרתיק קטיפה מרופד לתפילין</a> מגן מפני מכות ומכות חום ברכב.
            </div>
            <div class="flex items-center gap-3">
                <button onclick="openProductPage('1')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">צפה בתפילין מהודרות לבר מצווה ←</button>
                <a href="https://wa.me/972526867192" target="_blank" class="py-2.5 px-5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">התייעצות בוואטסאפ 📱</a>
            </div>
        `
    },
    {
        id: 2,
        title: "הלכות ומנהגי בדיקת מזוזות: מתי חובה לבדוק ואיך שומרים על הקלף?",
        category: "מזוזות ובית",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "כללי בדיקת מזוזה תקופתית, השפעת האקלים הישראלי על קלף הסת\"ם, וכיצד להתאים בית מזוזה אוטם ועמיד לפתח הבית.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות מזוזה – שמיכת ההגנה של הבית היהודי</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">המזוזה הנקבעת על פתחי בתינו אינה רק מצווה דאורייתא יקרה, אלא גם מקור ברכה ושמירה על דרי הבית. הקלף שעליו כתובות פרשיות "שמע ישראל" עשוי מעור מעובד בדיו טבעי, ולכן הוא רגיש מאוד לשינויי מזג אוויר, לחות ושמש ישירה.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">מתי חובה לבדוק מזוזות לפי ההלכה?</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">ההלכה קובעת כי מזוזה של אדם פרטי טעונה בדיקה פעמיים בשמיטה (כל 3.5 שנים). עם זאת, פוסקים רבים ממליצים לבדוק מזוזות חיצוניות העמידות בגשם ושמש לפחות פעם בשנה, בפרט בחודש אלול.</p>
            <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-oz-primary font-bold mb-4">
                🛍️ <strong>צריכים מזוזות חדשות?</strong> בדקו את <a href="javascript:openProductPage('2')" class="underline font-black">קלף מזוזה כשר ומוגה 12 ס"מ</a> או צפו במבחר <a href="javascript:openProductPage('5')" class="underline font-black">בתי מזוזה מעוצבים מאפוקסי ועץ זית</a>.
            </div>
            <button onclick="openProductPage('2')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">לרכישת מזוזות כשרות ←</button>
        `
    },
    {
        id: 3,
        title: "סוד קשירת הציצית: עבודת יד למול מכונה, פתיל תכלת ומנהגי הקהילות",
        category: "טליתות וציציות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "הבדלים הלכתיים בין ציצית עבודת יד למכונה, מנהגי הקשרים של הרמב\"ם, הראב\"ד והאר\"י, וכיצד לבחור מידה מדויקת בטלית.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות ציצית – זיכרון לכל מצוות ה'</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חז"ל אמרו שמצוות ציצית שקולה כנגד כל המצוות כולן, שנאמר "וראיתם אותו וזכרתם את כל מצוות ה'". פתילי ציצית עבודת יד מיוצרים לשמה על ידי יראי שמיים.</p>
            <button onclick="openProductPage('3')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">לרכישת טלית צמר טהור ←</button>
        `
    },
    {
        id: 4,
        title: "כתיבת ספר תורה מהודר: תהליך היצירה, סוגי הקלף, הדיו והגהות הסופר",
        category: "ספרי תורה",
        readTime: "9 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "תהליך כתיבת ספר תורה מראשיתו ועד להכנסתו לארון הקודש: בחירת הקלף, סוגי הדיו, כתיבה לשמה, והגהת מחשב כפולה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">כתיבת ספר תורה – המצווה הראשונה והאחרונה בתורה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כתיבת ספר תורה היא אמנות קודש טהורה המצריכה יראת שמיים עמוקה ומומחיות רבה של סופר הסת"ם. במכון עוז אנו מלווים כתיבת ספרי תורה מהודרים לקהילות ולבתי כנסת בכל הארץ.</p>
        `
    },
    {
        id: 5,
        title: "איך לבחור בית מזוזה מעוצב? שילוב בין אסתטיקה מודרנית להלכה צרופה",
        category: "מזוזות ובית",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "סקירת חומרי גלם לבתי מזוזה: עץ זית, אפוקסי, אלומיניום, זכוכית ונירוסטה, וכיצד לשמור על הקלף יבש ושמור.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">בית המזוזה – פאר והידור המצווה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בית המזוזה נועד להגן על הקלף ולהוסיף נוי והידור לפתח הבית. במכון עוז תמצאו מגוון בתי מזוזה מעוצבים מאפוקסי, עץ זית ואלומיניום מוברש.</p>
            <button onclick="openProductPage('5')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">צפה בבתי מזוזה מעוצבים ←</button>
        `
    },
    {
        id: 6,
        title: "מדריך לכיסוי וארנק תפילין: הגנה על התפילין מפני חום, לחות ונפילות",
        category: "תפילין וסת\"ם",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "חשיבות תיק מגן קשיח או נרתיק קטיפה מרופד לתפילין. טיפים למניעת נזקי חום ברכב ושמירה על ריבוע הבתים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">שמירה על התפילין – נרתיקים ותיקי מגן</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">התפילין עשויות מעור רגיש. תיק תפילין איכותי ומרופד מגן מפני מכות, נפילות ושינויי מזג אוויר.</p>
        `
    },
    {
        id: 7,
        title: "טלית צמר רחלים טהורה: סוגי אריג, עטרה, קשרים וטיפול נכון",
        category: "טליתות וציציות",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "יתרונות טלית צמר טהור, סוגי הלבנה ודחיות כתמים, ובחירת מידה מתאימה לפי גובה המתפלל.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">טלית צמר טהור – התעטפות בקדושה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">טלית צמר מבוססת על המנהג המהודר ביותר לפי כל הפוסקים. היא מעניקה תחושת הוד ויראת כבוד בתפילה.</p>
        `
    },
    {
        id: 8,
        title: "בר מצווה בכותל ובבית הכנסת: רשימת ציוד מלאה, הכנות ומנהגים",
        category: "יודאיקה ומתנות",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כל מה שצריך לארגן ליום הבר מצווה: תפילין, טלית, סידור עם חריטת שם, נרתיקים, ורשימת תזכורות לחתן המצווה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">חגיגת בר מצווה – רשימת הכנות מקיפה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">יום הבר מצווה הוא יום משמח ביותר. במכון עוז אנו מציעים סטי בר מצווה שלמים הכוללים את כל מוצרי הקודש הדרושים.</p>
        `
    },
    {
        id: 9,
        title: "פרשיית פיטום הקטורת על קלף: סגולות, הלכות כתיבה וקריאה יומיומית",
        category: "תפילין וסת\"ם",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "סגולת קריאת פיטום הקטורת מתוך קלף כשר שנכתב על ידי סופר סת\"ם: שמירה, פרנסה וביטול מגפות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">סגולת פיטום הקטורת מן הקלף</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חז"ל והזקנים הפליגו בשבחה של אמירת פיטום הקטורת מתוך קלף כשר. מדובר בסגולה בדוקה ומנוסה לפרנסה ולשמירה.</p>
        `
    },
    {
        id: 10,
        title: "מגילת אסתר בכתב ידו של סופר סת\"ם: כשרות, הידור וסוגי הנרתיקים",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד בוחרים מגילת אסתר כשרה לפורים? גובה הקלף (11, 21, 28 שורות), נוסח המלך, ונרתיק עץ זית או כסף.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מגילת אסתר מהודרת לקריאת פורים</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">קריאת המגילה מתוך מגילת קלף כשרה היא מצווה מן המובחר. במכון עוז תמצאו מגילות אסתר שנכתבו בדקדוק רב.</p>
        `
    },
    {
        id: 11,
        title: "כשרות ספרי קודש וסידורים: הדפסה מהודרת, כריכת עור ואחזקה נכונה",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד לבחור סידורים וחומשים בכריכת עור יוקרתית? שמירה על הדפים מפני בלאי, חריטת שמות מזהב, וספרי קודש לכל משפחה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">ספרי קודש וסידורים מהודרים בכריכת עור</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הסידור וספרי הקודש מלווים את האדם בכל תפילה ושיעור תורה. בכריכת עור אמיתית מבית מכון עוז, ספר הקודש נשמר לשנים רבות עם מגע יוקרתי.</p>
        `
    },
    {
        id: 12,
        title: "מזוזה לחדר ילדים ולמשרד: מיקום קביעה, ברכות וכללי הידור",
        category: "מזוזות ובית",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "הנחיות הלכתיות לקביעת מזוזות בחדרי הבית השונים: מתי מברכים ומתי קובעים ללא ברכה, מיקום גובה המזוזה בשליש העליון, ובית מזוזה מותאם לילדים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">קביעת מזוזה בחדרי הבית ובמשרד</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כל שער ופתח המיועד למגורים או לשימוש קבוע חייב במזוזה. במכון עוז תמצאו קלפי מזוזה מוגהים ומאושרים 100%.</p>
        `
    },
    {
        id: 13,
        title: "כיצד שומרים על רצועות תפילין שחורות וכשרות לאורך שנים?",
        category: "תפילין וסת\"ם",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "הלכות השחרת רצועות התפילין, סוגי הדיו הכשר לשחיקת רצועות, שמירה על עור הרצועה מגמישות ובלאי, וחידוש הצבע לשם מצוות תפילין.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">השחרת רצועות תפילין ושמירה על כשרותן</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הלכה למשה מסיני שרצועות התפילין יהיו שחורות מצדן החיצוני. שחיקת הצבע עקב זיעה או שימוש ממושך מצריכה השחרה בדיו כשר במיוחד.</p>
        `
    },
    {
        id: 14,
        title: "גביעי קידוש וסט הבדלה: חומרי גלם (כסף, אפוקסי, עץ זית) ומנהגי השבת",
        category: "יודאיקה ומתנות",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "מנהג הקידוש על היין בכלי מלא וגדוש (כוס של ברכה). סקירת גביעי כסף 925, גביעי עץ זית משולבים אפוקסי, וצלחות הבדלה מעוצבות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">כוס של ברכה – גביעי קידוש וסטים להבדלה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הקידוש בליל שבת ובבוקרו הוא מפתח לברכת השבוע כולו. גביע קידוש מעוצב מוסיף הדר רב לשולחן השבת ולרגע ההבדלה.</p>
        `
    },
    {
        id: 15,
        title: "תפילין של רש\"י ורבינו תם: ההבדלים, מנהגי הקהילות וסדר ההנחה",
        category: "תפילין וסת\"ם",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "מהי מחלוקת רש\"י ורבינו תם בסדר פרשיות התפילין? מתי מתחילים להניח תפילין של רבינו תם, וכיצד מקפידים על חילוף הנרתיקים והבתים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">תפילין של רש"י ותפילין של רבינו תם</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">שתי המעליות הרוחניות בתפילין נובעות מסדר כתיבת ארבע הפרשיות. במכון עוז ניתן להזמין זוגות תפילין רש"י ורבינו תם בהתאמה מלאה.</p>
        `
    },
    {
        id: 16,
        title: "חנוכיות ונרות שבת מעוצבים: אומנות יודאיקה ישראלית משולבת מסורת",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "עיצובי יודאיקה מודרניים לחגים ולשבתות: חנוכיות שמן זית זכוכית ואפוקסי, פמוטי שבת בודדים וזוגיים, ומתנות הוקרה מקוריות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">אומנות היודאיקה – חנוכיות ופמוטי שבת</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">אור הנרות בשבת ובחנוכה מביא שלום בית וקדושה עליונה. מוצרי היודאיקה במכון עוז משלבים עיצוב עכשווי עם שמירה מדוקדקת על דרישות ההלכה.</p>
        `
    },
    {
        id: 17,
        title: "בדיקת מחשב מול הגהת גברא בסת\"ם: למה חובה לשלב את שתיהן?",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "חשיבות השילוב בין מגהיה אנושי מוסמך (גברא) לבדיקת סורק אופטי ממוחשב. כיצד מתגלות אותיות חסרות או מחוברות ומבטיחים כשרות 100%.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">הגהה כפולה בסת"ם – מחשב וגברא</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">סורק ממוחשב מגלה אותיות חסרות או מחוברות במהירות מדהימה, אך רק מגיה אנושי ירא שמיים מבין את צורת האות והידורה. במכון עוז אנו משלבים את שניהם בכל מוצר.</p>
        `
    },
    {
        id: 18,
        title: "מתנות יודאיקה לחתן וכלה: רעיונות מקוריים וערכיים לבית היהודי",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "רעיונות למתנות חתן וכלה: סט הבדלה מעוצב, כיסוי חלה מרשים, מזוזות יוקרתיות לבית החדש, וארנקי עור פרימיום מבית מכון עוז.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מתנות חתן וכלה לבית החדש והמאושר</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הקמת בית נאמן בישראל היא שמחה עצומה. מתנות יודאיקה וארנקי עור פרימיום מבית מכון עוז הן מזכרת ערכית ושימושית לשנים רבות.</p>
        `
    },
    {
        id: 19,
        title: "שופר איל כשר ומהודר: תקיעות ראש השנה, בדיקת סדקים וטיפול",
        category: "חגים ומועדים",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כשרות השופר לפי ההלכה, בדיקת נקבים וסדקים, והבדלים בין שופר איל לשופר תימני (תקיה/קודו) לראש השנה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">קול השופר – התעוררות תשובה וקדושה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">שופר כשר חייב להיות עשוי מקרן איל (זכר לעקידת יצחק) ללא נקבים או סדקים לאורכו. במכון עוז כל השופרות נבדקים ונבחנים בקפידה.</p>
        `
    },
    {
        id: 20,
        title: "כיסוי לחלה ומפת שבת: עיצוב שולחן השבת בהידור וביופי תורני",
        category: "יודאיקה ומתנות",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "מנהג כיסוי החלות בשבת, רקמת זהב וכסף, ועיצוב שולחן השבת ביופי ובקדושה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">כבוד השבת ועונג שבת</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כיסוי החלות מבוסס על מנהג עתיק להסתיר את החלות בזמן קידוש היין. כיסוי חלה מעוטר ברקמה יוקרתית מוסיף הדר רב לשולחן השבת.</p>
        `
    },
    {
        id: 21,
        title: "ארבעת המינים למהדרין: מדריך לבחירת לולב, אתרוג, הדסים וערבות",
        category: "חגים ומועדים",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד לבחור סט ארבעת המינים כשר למהדרין? סימני אתרוג בלתי מורכב, לולב סגור בראשו, הדסים משולשים וערבות נחלים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות ארבעת המינים – שמחת חג הסוכות</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חג הסוכות מתאפיין במצוות נטילת ארבעת המינים: אתרוג, לולב, הדסים וערבות. במכון עוז אנו מספקים סטים ממוינים ומוגהים למהדרין.</p>
        `
    },
    {
        id: 22,
        title: "סדר הנחת תפילין למתחילים: מדריך מפורט צעד אחר צעד עם הברכות",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "מדריך מעשי וברור להנחת תפילין של יד ושל ראש, סדר הכריכות על הזרוע והאצבע, ונוסח הברכות לפי מנהג ספרד ואשכנז.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות תפילין – קשר נצחי בין אדם ליוצרו</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">מצוות תפילין היא מן המצוות היקרות ביותר בתורה. מניחים אותן בימי חול במהלך תפילת שחרית, כשהן מכוונות כנגד הלב והמוח.</p>
        `
    },
    {
        id: 23,
        title: "סגולות המזוזה והגנת הבית: אילו קלפים מתאימים לכל פתח?",
        category: "מזוזות ובית",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד תורמת המזוזה להגנה וברכה בבית? הבדלים בין גודלי קלפים (10, 12, 15 ס\"מ), איכות הכתב, והגנה מפני לחות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">המזוזה – השומר של שערי הבית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">על פי חז"ל והזוהר הקדוש, המזוזה הקבועה על הפתח מגינה על הבית ועל כל הדרים בו. במכון עוז תמצאו קלפי מזוזה כשרים ומהודרים.</p>
        `
    },
    {
        id: 24,
        title: "איך מנקים ושומרים על טלית צמר טהורה? טיפים לשמירת הצבע והציצית",
        category: "טליתות וציציות",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "טיפים מעשיים לשמירה על טלית צמר: מניעת הצהבת הצמר, הסרת כתמי זיעה ויין, שמירת פתילי הציצית וקיפול נכון.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">אחזקה וטיפול בטלית צמר טהור</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">טלית צמר טהור היא פריט קדוש ויוקרתי. כדי שהטלית תישמר צחורה וחדשה לאורך שנים, יש להקפיד על מספר כללי זהב כמו ניקוי יבש מבוקר בלבד.</p>
        `
    },
    {
        id: 25,
        title: "חידוש, הגהה ושיקום ספרי תורה עתיקים: טכנולוגיות מתקדמות בסת\"ם",
        category: "ספרי תורה",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "תהליך חידוש ספר תורה: חיזוק הדיו, תיקון תפירות היריעות, הגהת סורק אופטי והשבת ספר התורה לארון הקודש.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">השבת עטרה ליושנה – חידוש ספרי תורה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בקהילות רבות שמורים ספרי תורה עתיקים שעברו דורות רבים. במכון עוז אנו מציעים מעטפת שיקום מלאה לספרי תורה כולל סריקת מחשב מקיפה.</p>
        `
    },
    {
        id: 26,
        title: "הלכות ומנהגי כתיבת סת\"ם: דיו כשר, נוצה מול קולמוס שמיר וסגולות הקלף",
        category: "תפילין וסת\"ם",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד מייצרים דיו כשר לשמה? הבדלי הקולמוסים (נוצת עוף, קולמוס שמיר, מתכת ופלסטיק) והשפעתם על יופי הכתב בסת\"ם.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">אמנות כתיבת הסת"ם והידוריה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כתיבת ספרי תורה, תפילין ומזוזות מצריכה דיו שחור עמיד ועשוי מרכיבים כשרים לשמה. סופרי מכון עוז משתמשים בכלים המהודרים ביותר לפי כל השיטות.</p>
        `
    },
    {
        id: 27,
        title: "כיצד בוחרים ארנק עור יוקרתי לגבר? עור נאפה 100% מול דמוי עור ואיכות תפרים",
        category: "ארנקים ותיקים",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        summary: "המדריך המלא לבחירת ארנק עור נאפה 100% פרימיום: בדיקת רכות העור, עמידות התפרים, חלוקת תאים חכמה, ואריכות ימים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">ארנקי עור פרימיום לגבר מבית מכון עוז</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">קולקציית הארנקים של מכון עוז מיוצרת מעור נאפה ענק 100% טבעי ואיכותי. העור מתאפיין ברכות יוצאת דופן, גמישות ומראה אלגנטי יוקרתי שאינו נשחק.</p>
            <button onclick="openProductPage('301')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">צפה בארנקי עור פרימיום ←</button>
        `
    },
    {
        id: 28,
        title: "מזוזה לכניסה הראשית מול חדרי שינה: הלכות קביעת מזוזה ונוסח הברכות",
        category: "מזוזות ובית",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "כללי מיקום המזוזה בכניסה הראשית ובחדרים פנימיים: צד ימין של הנכנס, גובה שליש עליון, וזווית ההטיה לפי המנהג.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">הלכות קביעת מזוזה בכל פתחי הבית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">המזוזה הקבועה בכניסה הראשית מסמלת את חוסנו וקדושתו של הבית. במכון עוז ניתן להזמין קלפים מוגהים בגדלים שונים המתאימים לכל בית מזוזה.</p>
        `
    },
    {
        id: 29,
        title: "תפילין לחיילים ולמטיילים: תיק קשיח אטום למים, הגנת חום וטיפים לשטח",
        category: "תפילין וסת\"ם",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד מגינים על התפילין במהלך שירות צבאי או טיולים? תיקי מזוודה קשיחים, נרתיקים אטומים למים, ומניעת נזקי זיעה וחום.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">שמירה על התפילין בתנאי שטח וצבא</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חיילים ומטיילים נחשפים לתנאי מזג אוויר מאתגרים. נרתיק תפילין מגן קשיח מבית מכון עוז מבטיח שהתפילין יישארו שלמות, יבשות וכשרות בכל מקום.</p>
        `
    },
    {
        id: 30,
        title: "חשיבות בדיקת תפילין ומזוזות בחודש אלול: הכנה רוחנית לימים הנוראים",
        category: "תפילין וסת\"ם",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "מנהג ישראל לבדוק את התפילין והמזוזות בחודש אלול לפני ראש השנה ויום כיפור. בדיקת מחשב וגברא במכון עוז בראש העין.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">בדיקת תשמישי קדושה בחודש אלול</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חודש אלול הוא חודש הרחמים והסליחות. בדיקת התפילין והמזוזות היא סגולה נפלאה לשנה טובה ומבורכת ולשמירה מעולה.</p>
        `
    },
    {
        id: 31,
        title: "מנהגי חתן ביום החתונה: טלית חדשה, סט הבדלה ומתנות קודש",
        category: "טליתות וציציות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "הכנות החתן ליום חופתו: התעטפות בטלית חדשה תחת החופה, ברכת שהחיינו, וסטי מתנות מהודרים מבית מכון עוז.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מנהגי חתן – טלית ומוצרי קודש לחופה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">יום החתונה הוא יום מחילת עוונות והתחלה חדשה. במכון עוז אנו מציעים טליתות חתן מהודרות מצמר רחלים טהור וערכות מתנה יוקרתיות.</p>
        `
    },
    {
        id: 32,
        title: "הגנה עתידנית לכרטיסי אשראי: ארנק עור לגבר עם טכנולוגיית הגנת RFID",
        category: "ארנקים ותיקים",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        summary: "מהי טכנולוגיית RFID Blocking בארנקים? כיצד היא מונעת גניבת נתוני אשראי מרחוק, ושילובה בארנקי עור נאפה של מכון עוז.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">ארנקי עור לגבר עם הגנת RFID Blocking</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בעידן התשלומים החכמים, כרטיסי אשראי ללא מגע חשופים לסריקות לא מורשות. ארנקי העור של מכון עוז כוללים שכבת הגנה מתקדמת הבולמת גלי רדיו.</p>
        `
    },
    {
        id: 33,
        title: "כיסוי לטלית ותפילין בעיצוב אישי: רקמת שמות, אותיות זהב ואיכות קטיפה",
        category: "טליתות וציציות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "אפשרויות חריטה ורקמה אישית על גבי נרתיקי טלית ותפילין: רקמת שמות בזהב וכסף, סגירת רוכסן עמידה, ומתנה מרגשת לבר מצווה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">נרתיקי טלית ותפילין עם רקמת שם אישית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">רקמת שם החתן או נער הבר מצווה על גבי נרתיק הקטיפה מעניקה מראה אישי ומרגש. במכון עוז ניתן להזמין רקמות זהב וכסף בעיצוב ייחודי.</p>
        `
    },
    {
        id: 34,
        title: "מהו קלף משוח (שלול) מול קלף נטורל בסת\"ם? הידור מצווה ועמידות לדורות",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "הבדלים הלכתיים ואיכותיים בין קלף משוח בסיד לקלף נטורל טבעי. מדוע פוסקים רבים מעדיפים קלף נטורל ללא משיחה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">סוגי הקלף בסת"ם – נטורל מול משוח</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">עיבוד הקלף הוא היסוד של כתיבת סת"ם כשרה. קלף נטורל אינו מכוסה בשכבת משיחה מלאכותית ולכן הדיו נספג ישירות בעור ונשמר לדורות.</p>
        `
    },
    {
        id: 35,
        title: "ארנק מפתח וארנק כרטיסים אלגנטי: פתרונות ניידות וסדר לגבר המודרני",
        category: "ארנקים ותיקים",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        summary: "פתרונות נשיאה קומפקטיים לגבר: ארנקי כרטיסים נשלפים, ארנקי מפתחות מעור נאפה, ונוחות מקסימלית בכיס.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">ארנקי כרטיסים ומפתחות קומפקטיים מעור נאפה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">למי שמעדיף מראה דק ואינו רוצה ארנק עבה בכיס, מכון עוז מציע קולקציית ארנקי כרטיסים ומפתחות אלגנטיים במיוחד.</p>
        `
    },
    {
        id: 36,
        title: "סגולת שבירת הכוס בחופה וגביע קידוש מכסף טהור: מנהגים ומשמעות רוחנית",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "המנהג העתיק לזכר חורבן ירושלים בחופה, בחירת גביע קידוש מכסף טהור 925, ומזכרת יוקרתית לזוג הצעיר.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">זכר לחורבן וגביעי קידוש מכסף טהור</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">שבירת הכוס תחת החופה מזכירה לנו את ירושלים בשיא השמחה. גביע קידוש כסף טהור הוא נכס משפחתי העובר מדור לדור.</p>
        `
    },
    {
        id: 37,
        title: "מזוזות עמידות לתנאי חוץ: בתי מזוזה מאלומיניום מוברש ואפוקסי אטום",
        category: "מזוזות ובית",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "פתרונות איטום מתקדמים לבתי מזוזה המותקנים בשערים חיצוניים, מרפסות וחצרות: אטם סיליקון, אפוקסי עמיד בשמש, ונירוסטה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">בתי מזוזה עמידים לגשם ולחום שמש ישיר</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">פתחים חיצוניים החשופים לגשם ולשמש מצריכים בית מזוזה אטום במיוחד. במכון עוז תמצאו בתי מזוזה מאלומיניום מוברש ואפוקסי עם איטום סיליקון כפול.</p>
        `
    },
    {
        id: 38,
        title: "סדר לימוד לבר מצווה: קריאת בתורה, הנחת תפילין וקבלת עול מצוות",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד מכינים את נער הבר מצווה לקראת עליתו לתורה? לימוד הטעמים, הנחת התפילין בהתרגשות, וקבלת עול מצוות בשמחה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">הכנת נער הבר מצווה ליום המיוחל</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הלימוד וההכנה לקראת הבר מצווה בונים את זהותו הרוחנית של הנער. רכישת תפילין מהודרות מבית מכון עוז מעניקה לנער תחושת גאווה וחיבור עמוק.</p>
        `
    },
    {
        id: 39,
        title: "ארנק עור עם סגירת מגנט מול רוכסן היקפי: איך לבחור את הדגם המדויק עבורך?",
        category: "ארנקים ותיקים",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        summary: "השוואה בין דגמי ארנקים לגבר: יתרונות סגירת מגנט מהירה מול רוכסן היקפי המגן על שטרות ומטבעות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">סוגי סגירות בארנקי עור פרימיום</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בחירת הארנק המתאים תלויה בהרגלי הנשיאה שלכם. במכון עוז תמצאו ארנקי מגנט דקים לצד ארנקי רוכסן היקפי בעור נאפה משובח.</p>
        `
    },
    {
        id: 40,
        title: "הלכות שבת ויום טוב בחנות אונליין: שמירת שבת כהלכתה במכירות אינטרנט",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "חשיבות סגירת חנות האונליין בשבתות ובחגי ישראל: מנגנון שבת אוטומטי במכון עוז ושמירת קדושת השבת.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">שמירת שבת כהלכתה באתר מכון עוז</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">אתר מכון עוז שומר שבת באופן מלא ואינו פעיל בשבתות ובמועדי ישראל. אנו גאים להוביל מסחר אלקטרוני כשר וערכי.</p>
        `
    },
    {
        id: 41,
        title: "ברכת המזון וברכת מעין שלוש: סידורי כיס מהודרים ומתנות לאורחים באירועים",
        category: "יודאיקה ומתנות",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "מזכרות תורניות לאורחים בבר מצווה, חתונה וברית: שירונים, ברכונים וספרוני ברכת המזון בכריכת עור ואפוקסי.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מזכרות ברכונים וסידורי כיס לאירועים</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חלוקת ברכונים ושירונים מהודרים לאורחים היא מזכרת נפלאה מכל אירוע משפחתי. במכון עוז ניתן להזמין ברכונים בכריכות עור ועיצובים מרהיבים.</p>
        `
    },
    {
        id: 42,
        title: "הבדלים בין כתב בית יוסף, כתב וא\"ו וכתב אדמו\"ר הזקן בתפילין ומזוזות",
        category: "תפילין וסת\"ם",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "סוגי הכתב בסת\"ם לפי הקהילות: כתב וועליש (ספרדי), כתב בית יוסף (אשכנז), וכתב אדמו\"ר הזקן (חב\"ד).",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">נוסחאות הכתב בתפילין ומזוזות</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כל קהילה בישראל שומרת על מנהג אבותיה בצורת הכתב של האותיות. במכון עוז סופרים מוסמכים הכותבים בכל הנוסחאות בהידור רב.</p>
        `
    },
    {
        id: 43,
        title: "שימור וניקוי מוצרי עור נאפה פרימיום: שמירה על המראה היוקרתי והרכות",
        category: "ארנקים ותיקים",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        summary: "טיפים לתחזוקת ארנקי עור נאפה ותיקי עור: שימוש בקרם לחות ייעודי לעור, מניעת כתמים, ושמירה על הגמישות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">אחזקת ארנקי עור נאפה 100% פרימיום</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">מוצרי עור נאפה טבעי משתבחים עם השנים עקב המגע והשימוש. טיפול נכון בקרם עור ייעודי ישמור על רכות העור ומראהו היוקרתי לאורך שנים.</p>
        `
    },
    {
        id: 44,
        title: "מתנות הוקרה ושי לצוות עובדים ומנהלים: סטי יודאיקה וארנקי עור איכותיים",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "רעיונות למתנות לחגים ולרגעי הוקרה בחברות: סטי ארנקי עור עם חריטת לוגו, בתי מזוזות מעוצבים, ומתנות יוקרה לגבר.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מתנות הוקרה ושי לעובדים ומנהלים</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הענקת מתנת עור או יודאיקה מעוצבת לצוות העובדים והמנהלים מביעה הערכה עמוקה. במכון עוז ניתן להזמין מתנות ממותגות בכמויות לפי דרישה.</p>
        `
    },
    {
        id: 45,
        title: "מדריך מקיף לאבחון וטיפול בבעיות כשרות בתפילין: חלודה ברצועות, סדקים ויופי האותיות",
        category: "תפילין וסת\"ם",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד מזהים בעיות בתפילין ישנות? שחיקת הריבוע בבתים, חלודה ברצועות, סדקים בדיו, והצורך בבדיקת מחשב וגברא במכון עוז.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">אבחון וחידוש תפילין במכון עוז בראש העין</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">תפילין שעברו שנים רבות זקוקות לבדיקה תקופתית. במכון עוז אנו מציעים שירות בדיקה וחידוש מקיף כולל צביעת בתים, השחרת רצועות והגהת מחשב 100%.</p>
        `
    }
];
