const disclaimerHtml = `<div class="p-4 bg-amber-50 border-r-4 border-amber-500 rounded-2xl text-amber-900 text-xs font-bold leading-relaxed mb-6">⚠️ <strong>לתשומת לב הקוראים והלומדים:</strong> התוכן המובא במאמר זה מוגש לשם העשרה, עיון ומידע כללי בלבד. אין לראות בכתוב משום הלכה פסוקה, פסק הלכה מורשה או תחליף להזמנת פסיקה אישית מרב מורה הוראה או דמות סמכותית רוחנית. בכל שאלה מעשית יש לפנות לרב מוסמך.</div>`;

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
            <p class="text-xs text-slate-600 leading-relaxed mb-3">הבתים של התפילין הם הקופסאות השחורות שבהן מונחות הפרשיות. קיימים שני סוגים עיקריים:</p>
            <ul class="list-disc list-inside space-y-2 text-xs font-bold text-slate-700 mb-4">
                <li><span class="text-oz-primary font-black">תפילין מבהמה גסה (עור עגל):</span> בתים חזקים ועמידים במיוחד. עור הבהמה הגסה עבה מאוד, ואינו מושפע משינויי טמפרטורה, לחות או זיעה. הבתים שומרים על ריבועם המדויק לכל החיים. מומלץ בחום לכל נער בר מצווה. ניתן להתרשם מ<a href="javascript:openProductPage('1')" class="text-oz-primary font-black underline hover:text-oz-hover">תפילין מהודרות מבהמה גסה במכון עוז</a>.</li>
                <li><span class="text-oz-primary font-black">תפילין מבהמה דקה (כבש/עז):</span> בתים קלים יותר המיוצרים מעור דק. קלים לעיבוד אך פגיעים יותר לחבלות ולחות, ועלולים לאבד את הטרפז או הריבוע עם השנים.</li>
            </ul>

            <h4 class="font-black text-base text-oz-primary mb-2">2. הגהת הפרשיות: הגהת גברא לצד הגהת מחשב</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">כדי שפרשיות התפילין יהיו כשרות למהדרין, חובה שיכתבו על ידי סופר סת"ם ירא שמיים בעל תעודת הסמכה בתוקף. במכון עוז כל פרשייה עוברת הגהה כפולה:</p>
            <ol class="list-decimal list-inside space-y-2 text-xs text-slate-700 mb-4">
                <li><strong>הגהת מגהיה מוסמך (גברא):</strong> בדיקה מדוקדקת של צורת האותיות, הכתר (תגין), וקוצו של יו"ד.</li>
                <li><strong>הגהת מחשב סורק אופטי:</strong> בדיקה ממוחשבת לוודא שאין אות חסרה, יתירה או דיבוק אותיות שאינו נראה בעין אנושית.</li>
            </ol>

            <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-oz-primary font-bold mb-4">
                💡 <strong>טיפ זהב מבית מכון עוז:</strong> אל תשכחו להצטייד בנרתיק מגן איכותי! <a href="javascript:openProductPage('9999')" class="underline font-black">נרתיק קטיפה מרופד לתפילין</a> מגן מפני מכות ומכות חום ברכב.
            </div>

            <h4 class="font-black text-base text-slate-900 mb-2">סיכום והמלצת קנייה</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כשאתם קונים תפילין, דפדפו בקטלוג החנות שלנו או צרו קשר עם מומחי מכון עוז בראש העין. ניתן להזמין מראש כולל חריטת שם הנער על הנרתיק ומשלוח מהיר עד הבית.</p>
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
            <p class="text-xs text-slate-600 leading-relaxed mb-4">המזוזה הנקבעת על פתחי בתינו אינה רק מצווה דאורייתא יקרה, אלא גם מקור ברכה ושמירה על דרי הבית. הקלף שעליו כתובות פרשיות "שמע ישראל" ו"והיה אם שמוע" עשוי מעור מעובד בדיו טבעי, ולכן הוא רגיש מאוד לשינויי מזג אוויר, לחות ושמש ישירה.</p>

            <h4 class="font-black text-base text-oz-primary mb-2">מתי חובה לבדוק מזוזות לפי ההלכה?</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">ההלכה קובעת כי מזוזה של אדם פרטי טעונה בדיקה פעמיים בשמיטה (כל 3.5 שנים). עם זאת, פוסקים רבים ממליצים לבדוק מזוזות חיצוניות העמידות בגשם ושמש לפחות פעם בשנה, בפרט בחודש אלול לפני ימי הרחמים והסליחות.</p>

            <h4 class="font-black text-base text-oz-primary mb-2">סיבות שכיחות לפסילת מזוזות:</h4>
            <ul class="list-disc list-inside space-y-2 text-xs font-bold text-slate-700 mb-4">
                <li><strong>סדקים בדיו:</strong> עקב חום כבד בדיו מתייבש ומתפורר, במיוחד באותיות עם גג רחב.</li>
                <li><strong>רטיבות וחדירת מים:</strong> מים שחודרים לבית המזוזה גורמים למחיקת אותיות ולטשטוש הכתב.</li>
                <li><strong>חרקים ועובש:</strong> באזורים לחים עלול להתפתח עובש המשתלט על גבי הקלף.</li>
            </ul>

            <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-oz-primary font-bold mb-4">
                🛍️ <strong>צריכים מזוזות חדשות?</strong> בדקו את <a href="javascript:openProductPage('2')" class="underline font-black">קלף מזוזה כשר ומוגה 12 ס"מ</a> או צפו במבחר <a href="javascript:openProductPage('5')" class="underline font-black">בתי מזוזה מעוצבים מאפוקסי ועץ זית</a>.
            </div>

            <h4 class="font-black text-base text-slate-900 mb-2">כיצד קובעים את המזוזה בצורה נכונה?</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">את המזוזה קובעים שליש עליון של הפתח, בצידו הימני של הנכנס, כשהיא מוטה מעט לכיוון פנים הבית (לפי מנהג אשכנז) או זקופה (לפי מנהג ספרד). מברכים "אשר קדשנו במצוותיו וציוונו לקבוע מזוזה".</p>
            <div class="flex items-center gap-3">
                <button onclick="openProductPage('2')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">לרכישת מזוזות כשרות ←</button>
                <button onclick="openAccountPageWithWishlist()" class="py-2.5 px-5 bg-purple-50 text-oz-primary font-bold text-xs rounded-xl border border-purple-200 cursor-pointer">שמור במועדפים VIP ❤️</button>
            </div>
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
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חז"ל אמרו שמצוות ציצית שקולה כנגד כל המצוות כולן, שנאמר "וראיתם אותו וזכרתם את כל מצוות ה'". הציצית מזכירה לאדם בכל רגע את חובתו ועבודתו לשם שמים.</p>

            <h4 class="font-black text-base text-oz-primary mb-2">פתילים עבודת יד לשמה מול עבודת מכונה</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">בעוד שציצית מכונה מותרת לפי עיקר הדין, גדולי הפוסקים המליצו להדר וללבוש פתילי ציצית שנטוו ונתלו בעבודת יד על ידי אדם ירא שמיים שאמר בפירוש "לשם מצוות ציצית". במכון עוז אנו משתמשים אך ורק בציציות עבודת יד מהודרות.</p>

            <h4 class="font-black text-base text-oz-primary mb-2">מנהגי הקשרים והחוליות</h4>
            <ul class="list-disc list-inside space-y-2 text-xs font-bold text-slate-700 mb-4">
                <li><strong>מנהג אשכנז/ספרד הנפוץ:</strong> 7-8-11-13 כריכות בין 5 קשרים כפולים (סך הכל 39 כריכות כמניין "ה' אחד").</li>
                <li><strong>מנהג חב"ד:</strong> כריכות מיוחדות לפי סידור אדמו"ר הזקן.</li>
                <li><strong>מנהג הרמב"ם:</strong> חוליות של 3 כריכות עם פתיל תכלת.</li>
            </ul>

            <div class="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-oz-primary font-bold mb-4">
                📐 <strong>מתלבטים לגבי המידה?</strong> היכנסו ל-<a href="javascript:openTallitCalcModal()" class="underline font-black">מחשבון מידות טלית online</a> וגלו את המידה המדויקת לפי הגובה שלכם!
            </div>

            <p class="text-xs text-slate-600 leading-relaxed mb-4">לרכישת <a href="javascript:openProductPage('3')" class="text-oz-primary font-black underline">טלית צמר טהור מהודרת</a> או טלית קטן צמר, בקרו בחנות המקוונת של מכון עוז.</p>
            <button onclick="openProductPage('3')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">לרכישת טלית צמר טהור ←</button>
        `
    },
    {
        id: 4,
        title: "כתיבת ספר תורה מהודר: תהליך היצירה, סוגי הקלף, הדיו והגהות הסופר",
        category: "ספרי תורה",
        readTime: "10 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "מסע מרתק אל כתיבת ספר תורה: משלב עיבוד הקלף, דרך סוד הדיו והקולמוס, ועד לתגין ולסיום האותיות בטקס הכנסת ספר תורה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">המצווה התרי"ג: כתיבת ספר תורה אישי</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">המצווה האחרונה בתורה היא "ועתה כתבו לכם את השירה הזאת". כתיבת ספר תורה היא פסגת האומנות וההלכה היהודית, שבה משקיע סופר הסת"ם מאות שעות עבודה בדחילו ורחימו.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">שלבי יצירת ספר תורה:</h4>
            <ol class="list-decimal list-inside space-y-2 text-xs text-slate-700 mb-4">
                <li><strong>עיבוד הקלף:</strong> קלף שליל או גוויל מעובד בעפצים לשמה.</li>
                <li><strong>שרטוט היריעות:</strong> שרטוט בסרגל ועץ כדי ששורות הכתב יצאו ישרות ומדויקות.</li>
                <li><strong>כתיבת האותיות:</strong> בקולמוס נוצה או קנה בדיו שחור עמיד ועז.</li>
                <li><strong>הגהה כפולה:</strong> הגהת גברא מוסמכת והגהת מחשב סורק.</li>
            </ol>
            <p class="text-xs text-slate-600 leading-relaxed">מכון עוז מלווה תורמים וקהילות בכתיבת ספרי תורה מהודרים מתחילה ועד חגיגת הכנסת ספר התורה.</p>
        `
    },
    {
        id: 5,
        title: "איך לבחור בית מזוזה מעוצב? שילוב בין אסתטיקה מודרנית להלכה צרופה",
        category: "מזוזות ובית",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד לבחור בית מזוזה המתאים לעיצוב הבית? סקירת חומרים: עץ זית, יציקת אפוקסי, אלומיניום יוקרתי וכסף טהור.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">יופי והידור בפתח הבית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בשנים האחרונות הפך בית המזוזה לפריט עיצובי מרכזי בכניסה לבית ובחדרים. לצד החובה ההלכתית שהבית יגן על הקלף, קיים ערך רב של "זה אלי ואנווהו" – התנאות במצווה.</p>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בחנות מכון עוז תמצאו <a href="javascript:openProductPage('5')" class="text-oz-primary font-black underline">בתי מזוזה מעץ זית ואפוקסי בעבודת יד</a> המתאימים לכל סגנון אדריכלי.</p>
        `
    },
    {
        id: 6,
        title: "מדריך לכיסוי וארנק תפילין: הגנה על התפילין מפני חום, לחות ונפילות",
        category: "תפילין וסת\"ם",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "למה חשוב להשקיע בתיק תפילין איכותי? הגנה תרמית, מניעת שחיקה ברצועות וארנקי עור יוקרתיים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">שמירה על הציוד המקודש ביותר</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">התפילין הן תשמיש קדושה יקר ערך, הן רוחנית והן כספית. אחד הגורמים הרסניים ביותר לתפילין הוא חום כבד ברכב או נפילה פיזית. תיק תפילין מרופד היטב מגן על הבתים והפרשיות.</p>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">רוצים להגן על התפילין שלכם? צפו ב<a href="javascript:openProductPage('4')" class="text-oz-primary font-black underline">ארנק עור יוקרתי לתפילין</a> בחנות שלנו.</p>
        `
    },
    {
        id: 7,
        title: "טלית צמר רחלים טהורה: סוגי אריג, עטרה, קשרים וטיפול נכון",
        category: "טליתות וציציות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "כל מה שצריך לדעת על אריג צמר רחלים, מניעת החלקה בכתפיים, עטרות כסף וטיפים לניקוי יבש נכון.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">התעטפות במצוות הטלית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">אריג צמר טהור איכותי מעניק תחושת אצילות ונוחות במהלך התפילה. טליתות מודרניות כוללות אריגה מיוחדת למניעת החלקה מהכתפיים וציפוי דוחה כתמים.</p>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">למדידה והתאמה אישית השתמשו ב<a href="javascript:openTallitCalcModal()" class="text-oz-primary font-black underline">מחשבון מידות הטלית המקוון</a>.</p>
        `
    },
    {
        id: 8,
        title: "בר מצווה בכותל ובבית הכנסת: רשימת ציוד מלאה, הכנות ומנהגים",
        category: "בר מצווה ואירועים",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "צ'ק ליסט מלא למשפחה החוגגת בר מצווה: תפילין, טלית, סידור עור, כיפה, וארגון העלייה לתורה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מזל טוב! מגיעים לרגע הגדול</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חגיגת בר מצווה דורשת היערכות מוקדמת הן בלימוד הקריאה והן בהצטיידות בתשמישי קדושה מהודרים. במכון עוז אנו מציעים סט בר מצווה שלם הכולל תפילין, טלית, סידור ונרתיק במחיר מיוחד.</p>
            <button onclick="openProductPage('1')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">לצפייה בסט תפילין לבר מצווה ←</button>
        `
    },
    {
        id: 9,
        title: "פרשיית פיטום הקטורת על קלף: סגולות, הלכות כתיבה וקריאה יומיומית",
        category: "ספרי תורה",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "סגולת פרשת פיטום הקטורת הכתובה על קלף עובד לשמה: שמירה, פרנסה ורפואה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">סגולת הקטורת – שמירה וברכה בבית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">קריאת פיטום הקטורת מתוך קלף כשר הכתוב על ידי סופר סת"ם ידועה בספרים כסגולה נפלאה לפרנסה, לרפואה ולביטול מגפות ומזיקים.</p>
        `
    },
    {
        id: 10,
        title: "מגילת אסתר בכתב ידו של סופר סת\"ם: כשרות, הידור וסוגי הנרתיקים",
        category: "ספרי תורה",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד בוחרים מגילת אסתר כשרה לפורים? גודל האותיות, מספר השורות (11, 21, 28) ונרתיקי כסף ועץ.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות מקרא מגילה מתוך קלף כשר</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">קריאת המגילה בפורים מתוך קלף כשר הכתוב כהלכה מעניקה חוויה רוחנית נעלה ומקיימת את המצווה מן המובחר.</p>
        `
    },
    {
        id: 11,
        title: "כשרות ספרי קודש וסידורים: הדפסה מהודרת, כריכת עור ואחזקה נכונה",
        category: "יודאיקה ומתנות",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "איך שומרים על סידורים וחומשים בכריכת עור? שמירת קדושת הספר, גניזה והטבעת שמות בזהב.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">כבוד ספרי הקודש</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">ספרי קודש בכריכת עור יוקרתית הם מתנה נפלאה לכל אירוע. יש להקפיד על אחסונם במקום מכובד ולמנוע נפילתם ארצה.</p>
        `
    },
    {
        id: 12,
        title: "מזוזה לחדר ילדים ולמשרד: מיקום קביעה, ברכות וכללי הידור",
        category: "מזוזות ובית",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "האם חובה לקבוע מזוזה בחדרי ארונות, משרדים ומרפסות? מדריך מפורט לפי פסיקת ההלכה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מזוזות בכל חדרי הבית והמשרד</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">כל חדר המשמש למגורים או לעבודה ששטחו מעל 1.60x1.60 מטרים חייב במזוזה. בחדרי ילדים מומלץ לקבוע מזוזה כשרה מוגהת היטב לשמירה ולברכה.</p>
        `
    },
    {
        id: 13,
        title: "כיצד שומרים על רצועות תפילין שחורות וכשרות לאורך שנים?",
        category: "תפילין וסת\"ם",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "חשיבות הפיגמנט השחור ברצועות התפילין, השחרת רצועות תקופתית ופתרון לרצועות שחוקות.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">הלכת רצועות תפילין שחורות</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הלכה למשה מסיני שרצועות התפילין יהיו שחורות מצידן החיצוני. אם הצבע השחור התקלף או דהה, יש להשחירו בצבע כשר לתפילין.</p>
        `
    },
    {
        id: 14,
        title: "גביעי קידוש וסט הבדלה: חומרי גלם (כסף, אפוקסי, עץ זית) ומנהגי השבת",
        category: "יודאיקה ומתנות",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "בחירת גביע קידוש לשבת: שיעור רביעית (86 גרם/סמ\"ק), עיצובים מודרניים ומסורתיים.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">לקדש על היין בהידור</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">גביע הקידוש מסמל את קדושת השבת בבית היהודי. שיעור הגביע המינימלי לקידוש הוא רביעית (כ-86 מ"ל).</p>
        `
    },
    {
        id: 15,
        title: "תפילין של רש\"י ורבינו תם: ההבדלים, מנהגי הקהילות וסדר ההנחה",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "סדר הפרשיות בתפילין לפי רש\"י ולפי רבינו תם, מתי מתחילים להניח תפילין של רבינו תם ואיך מניחים אותם.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">מחלוקת רש"י ורבינו תם בסדר הפרשיות</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">שני גדולי הראשונים נחלקו בסדר הפרשיות בתפילין: רש"י סובר כסדר המקרא ("והיה כי יביאך" ואז "שמע"), ואילו רבינו תם סובר ש"שמע" קודם ל"והיה כי יביאך". יראי שמיים מקפידים להניח את שניהם.</p>
        `
    },
    {
        id: 16,
        title: "חנוכיות ונרות שבת מעוצבים: אומנות יודאיקה ישראלית משולבת מסורת",
        category: "חגים ומועדים",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "עיצוב חנוכיות כשרות לפי ההלכה (קנה אחד בגובה אחיד) ושילוב חומרים חדשניים ביודאיקה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">אור החנוכה והשבת בבית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">הדלקת נרות חנוכה ונרות שבת מביאה אור וקדושה לבית. חשוב לוודא שהחנוכייה כשרה וכי כל הנרות עומדים בשורה אחת בגובה שווה.</p>
        `
    },
    {
        id: 17,
        title: "בדיקת מחשב מול הגהת גברא בסת\"ם: למה חובה לשלב את שתיהן?",
        category: "תפילין וסת\"ם",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "מדוע המחשב אינו יכול להחליף את עין האדם, ולמה הגהת אדם אינה מספיקה ללא סורק ממוחשב?",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">שילוב טכנולוגיה ומסורת בהגהת סת"ם</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">סריקת מחשב מגלה אותיות חסרות או מחוברות במהירות מדהימה, אך רק מגיה אנושי יכול להבחין בצורת האות ובשרטוט כהלכה. במכון עוז משלבים את שניהם 100%.</p>
        `
    },
    {
        id: 18,
        title: "מתנות יודאיקה לחתן וכלה: רעיונות מקוריים וערכיים לבית היהודי",
        category: "בר מצווה ואירועים",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "רעיונות למתנות יוקרתיות ומלאות משמעות לזוג צעיר: סדרת מזוזות לבית החדש, סט קידוש והבדלה.",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">בניין עדי עד – מתנות לבית החדש</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">מתנה תורנית לחתן וכלה מעניקה יופי וברכה לביתם החדש. צפו במגוון <a href="javascript:openProductPage('5')" class="text-oz-primary font-black underline">בתי המזוזה והמתנות שלנו</a>.</p>
        `
    },
    {
        id: 19,
        title: "שופר איל כשר ומהודר: תקיעות ראש השנה, בדיקת סדקים וטיפול",
        category: "חגים ומועדים",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כשרות השופר לפי ההלכה, בדיקת נקבים וסדקים, והבדלים בין שופר איל לשופר תימני (תקיה/קודו).",
        content: disclaimerHtml + `
            <h3 class="font-black text-xl text-slate-900 mb-3">קול השופר – התעוררות תשובה</h3>
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
    }
];
