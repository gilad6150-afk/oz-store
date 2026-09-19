$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$filePath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\articles_data.js'
$content = [System.IO.File]::ReadAllText($filePath, $utf8NoBOM)

$newArticlesJs = @"
    },
    {
        id: 21,
        title: "ארבעת המינים למהדרין: מדריך לבחירת לולב, אתרוג, הדסים וערבות",
        category: "חגים ומועדים",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד לבחור סט ארבעת המינים כשר למהדרין? סימני אתרוג בלתי מורכב, לולב סגור בראשו, הדסים משולשים וערבות נחלים.",
        content: `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות ארבעת המינים – שמחת חג הסוכות</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">חג הסוכות מתאפיין במצוות נטילת ארבעת המינים: אתרוג, לולב, הדסים וערבות. כל אחד ממינים אלו מסמל סוג שונה בעם ישראל, וביחד הם יוצרים אחדות שאינה ניתנת לניתוק.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">1. הכללים לבחירת אתרוג מהודר</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">אתרוג כשר למהדרין חייב להיות מפרדס מוחזק כבלתי מורכב. יש להקפיד שה"חוטם" (החלק העליון המשתפע אל הפיטם) יהיה נקי לחלוטין מנקודות שחורות או בלעטער.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">2. לולב, הדסים וערבות</h4>
            <ul class="list-disc list-inside space-y-2 text-xs text-slate-700 mb-4">
                <li><strong>לולב:</strong> ישר לחלוטין, שדרה קשה, וראש התיומת סגור ולא כפול או נחלק.</li>
                <li><strong>הדסים:</strong> "משולשים" – שלושה עלים יוצאים מקן אחד באותו גובה בדיוק לאורך רוב השיעור (3 טפחים).</li>
                <li><strong>ערבות:</strong> עלה משוך, פי עלה חלק (לא משונן כמשור), וקנה אדום.</li>
            </ul>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">לייעוץ והזמנת סטים ממוינים למהדרין לפני חג הסוכות, פנו אל מומחי <a href="https://wa.me/972526867192" target="_blank" class="text-oz-primary font-black underline">מכון עוז בראש העין</a>.</p>
        `
    },
    {
        id: 22,
        title: "סדר הנחת תפילין למתחילים: מדריך מפורט צעד אחר צעד עם הברכות",
        category: "תפילין וסת\"ם",
        readTime: "7 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "מדריך מעשי וברור להנחת תפילין של יד ושל ראש, סדר הכריכות על הזרוע והאצבע, ונוסח הברכות לפי מנהג ספרד ואשכנז.",
        content: `
            <h3 class="font-black text-xl text-slate-900 mb-3">מצוות תפילין – קשר נצחי בין אדם ליוצרו</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">מצוות תפילין היא מן המצוות היקרות ביותר בתורה. מניחים אותם בימי חול במהלך תפילת שחרית, כשהם מכוונים כנגד הלב וכנגד המוח – שעבוד המחשבה והרגש לקב"ה.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">סדר ההנחה בקצרה:</h4>
            <ol class="list-decimal list-inside space-y-2 text-xs text-slate-700 mb-4">
                <li>מניחים את הבית של תפילין של יד על הקיבורת (השריר התפוח בזרוע).</li>
                <li>מברכים "להניח תפילין" (הספרדים מברכים רק ברכה זו, האשכנזים מוסיפים ברכת "על מצוות תפילין" על ראש).</li>
                <li>מהדקים את הקשר וכורכים 7 כריכות על הזרוע.</li>
                <li>מניחים תפילין של ראש בדיוק במרכז המצח מעל שורש השיער.</li>
                <li>כורכים 3 כריכות על האצבע האמצעית (אמה).</li>
            </ol>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">מחפשים תפילין איכותיות וכשרות למהדרין? צפו ב<a href="javascript:openProductPage('1')" class="text-oz-primary font-black underline">סט תפילין מהודר מבהמה גסה במכון עוז</a>.</p>
        `
    },
    {
        id: 23,
        title: "סגולות המזוזה והגנת הבית: אילו קלפים מתאימים לכל פתח?",
        category: "מזוזות ובית",
        readTime: "6 דקות קריאה",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        summary: "כיצד תורמת המזוזה להגנה וברכה בבית? הבדלים בין גודלי קלפים (10, 12, 15 ס\"ם), איכות הכתב, והגנה מפני לחות.",
        content: `
            <h3 class="font-black text-xl text-slate-900 mb-3">המזוזה – השומר של שערי הבית</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">על פי חז"ל והזוהר הקדוש, המזוזה הקבועה על הפתח מגינה על הבית ועל כל הדרים בו בין בצאתם ובין בבואם. האותיות ש-ד-י הרשומות לגב הקלף מרמזות על "שומר דלתות ישראל".</p>
            <h4 class="font-black text-base text-oz-primary mb-2">איזה גודל קלף מומלץ?</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">ככל שהקלף גדול יותר (למשל 12 ס"ם או 15 ס"ם), כך קל יותר לסופר לכתוב את האותיות בבהירות, והסיכוי לפסילת האותיות עקב דיבוק או שחיקה יורד באופן משמעותי.</p>
            <button onclick="openProductPage('2')" class="py-2.5 px-5 bg-oz-primary text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">להזמנת קלף מזוזה 12 ס"ם כשר למהדרין ←</button>
        `
    },
    {
        id: 24,
        title: "איך מנקים ושומרים על טלית צמר טהורה? טיפים לשמירת הצבע והציצית",
        category: "טליתות וציציות",
        readTime: "5 דקות קריאה",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        summary: "טיפים מעשיים לשמירה על טלית צמר: מניעת הצהבת הצמר, הסרת כתמי זיעה ויין, שמירת פתילי הציצית וקיפול נכון.",
        content: `
            <h3 class="font-black text-xl text-slate-900 mb-3">אחזקה וטיפול בטלית צמר טהור</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">טלית צמר טהור היא פריט קדוש ויוקרתי. כדי שהטלית תישמר צחורה וחדשה לאורך שנים, יש להקפיד על מספר כללי זהב:</p>
            <ul class="list-disc list-inside space-y-2 text-xs text-slate-700 mb-4">
                <li><strong>אל תכבסו במכונת כביסה:</strong> כביסה במכונה תכווץ את הצמר ותהרוס את פתילי הציצית.</li>
                <li><strong>ניקוי יבש מקצועי בלבד:</strong> השתמשו בשירותי ניקוי יבש המתמחים בטליתות.</li>
                <li><strong>מגן ציצית פלסטיק:</strong> בעת האוורור או הניקוי, עטפו את ארבע פתילי הציצית במגני פלסטיק כדי למנוע פרימה.</li>
            </ul>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">צריכים טלית חדשה שדוחה כתמים? בדקו את <a href="javascript:openProductPage('3')" class="text-oz-primary font-black underline">קולקציית הטליתות של מכון עוז</a>.</p>
        `
    },
    {
        id: 25,
        title: "חידוש, הגהה ושיקום ספרי תורה עתיקים: טכנולוגיות מתקדמות בסת\"ם",
        category: "ספרי תורה",
        readTime: "8 דקות קריאה",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        summary: "תהליך חידוש ספר תורה: חיזוק הדיו, תיקון תפירות היריעות, הגהת סורק אופטי והשבת ספר התורה לארון הקודש.",
        content: `
            <h3 class="font-black text-xl text-slate-900 mb-3">השבת עטרה ליושנה – חידוש ספרי תורה</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">בקהילות רבות שמורים ספרי תורה עתיקים שעברו דורות רבים. עקב פגעי הזמן, הדיו עלול להתפורר או להיסדק, והגידים שביריעות עלולים להינתק. במכון עוז אנו מציעים מעטפת שיקום מלאה לספרי תורה.</p>
            <h4 class="font-black text-base text-oz-primary mb-2">שלבי התיקון במכון עוז:</h4>
            <ol class="list-decimal list-inside space-y-2 text-xs text-slate-700 mb-4">
                <li>בדיקה ממוחשבת מלאה לזיהוי אותיות חסרות או מחוברות.</li>
                <li>הגהת אדם מוסמך על כל היריעות.</li>
                <li>חיזוק אותיות דהויות בדיו כשר לשמה ותפירת יריעות בגידי בהמה כשרים.</li>
            </ol>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">להזמנת בדיקת ספר תורה לקהילה או לבית כנסת, פנו אלינו בטלפון <strong>052-686-7192</strong> או בוואטסאפ.</p>
        `
    }
];
"@

if (-not $content.Contains('id: 25,')) {
    $content = $content.Replace('    }' + "`n" + '];', $newArticlesJs)
    [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBOM)
    Write-Host "Successfully added 5 new articles (IDs 21-25) to articles_data.js!"
} else {
    Write-Host "Articles 21-25 already present in articles_data.js"
}
