const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

async function main() {
  console.log('=== Step 1: Generating public/products/mezuzah_555_single_original.jpg ===');

  const singleCleanPath = 'mezuzah_555_single_clean.png';
  if (!fs.existsSync(singleCleanPath)) {
    throw new Error('mezuzah_555_single_clean.png not found!');
  }

  // Generate 1024x1024 crisp studio photo for the single mezuzah
  const targetH = 860;
  const targetW = Math.round(targetH * (312 / 1758)); // 153px

  const singleResized = await sharp(singleCleanPath)
    .resize(targetW, targetH)
    .toBuffer();

  // Create soft drop shadow
  const shadowSvg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="contact" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <!-- Soft ambient shadow -->
      <rect x="${(1024 - targetW) / 2 + 14}" y="${(1024 - targetH) / 2 + 15}" width="${targetW}" height="${targetH}" rx="15" fill="rgba(0,0,0,0.18)" filter="url(#soft)" />
      <!-- Contact shadow -->
      <rect x="${(1024 - targetW) / 2 + 4}" y="${(1024 - targetH) / 2 + 5}" width="${targetW}" height="${targetH}" rx="8" fill="rgba(0,0,0,0.22)" filter="url(#contact)" />
    </svg>
  `;

  const shadowBuf = await sharp(Buffer.from(shadowSvg)).png().toBuffer();

  const whiteBgSvg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" fill="#ffffff" />
    </svg>
  `;

  await sharp(Buffer.from(whiteBgSvg))
    .composite([
      { input: shadowBuf, left: 0, top: 0 },
      { input: singleResized, left: Math.round((1024 - targetW) / 2), top: Math.round((1024 - targetH) / 2) }
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile('public/products/mezuzah_555_single_original.jpg');

  console.log('✓ Created public/products/mezuzah_555_single_original.jpg');

  // Also sync to cloudflare_deploy
  const cfDir = 'cloudflare_deploy/public/products';
  if (fs.existsSync(cfDir)) {
    fs.copyFileSync('public/products/mezuzah_555_single_original.jpg', path.join(cfDir, 'mezuzah_555_single_original.jpg'));
    console.log('✓ Synced mezuzah_555_single_original.jpg to cloudflare_deploy');
  }

  console.log('\n=== Step 2: Updating Product 555 (Setting size strictly to 12 cm) ===');
  const prods = JSON.parse(fs.readFileSync('products.json', 'utf8'));

  const p555 = prods.find(p => p.id == 555);
  if (!p555) throw new Error('Product 555 not found in products.json!');

  // Only size 12 available for the 5-pack set
  p555.name = 'סט 5 מזוזות אפוקסי משולב עם עץ זית לבן שמנת עבודת יד (12 ס"מ) – עוז יודאיקה';
  p555.options = [
    {
      name: "גודל בית המזוזה בסט",
      type: "select",
      values: [
        "מתאים לקלף 12 ס״מ (הגודל הסטנדרטי למארז 5 יחידות)"
      ]
    },
    {
      name: "תוספת קלפי מזוזה כשרים לכל הסט (5 יחידות)",
      type: "select",
      values: [
        "ללא קלף (5 בתי מזוזה בלבד)",
        "תוספת 5 קלפי מזוזה 12 ס״מ כשרים למהדרין (+₪1,000)"
      ]
    }
  ];

  p555.short_description = `<p class='mb-3'><strong>סט 5 מזוזות אפוקסי משולב עם עץ זית לבן שמנת עבודת יד (12 ס"מ)</strong> מבית עוז יודאיקה ראש העין הוא מארז יוקרתי של חמישה בתי מזוזה מעוצבים, המשלבים עץ זית ישראלי שורשי עם יציקת אפוקסי בגוון לבן שמנת פנינה עדין בעיבוד ארטיזנלי מוקפד.</p><p class='mb-3'><strong>עיצוב וגימור אומנותי:</strong> כל בית מזוזה הינו פריט יחיד במינו (One of a kind) הנוצר בעבודת יד אומנותית. בחזית בית המזוזה מוטבעת אות ש' מתכתית תלת-ממדית מוזהבת בכתר מלכותי. גב בית המזוזה כולל בית קיבול ייעודי מוגן לקלף המזוזה בגודל 12 ס״מ, עם סגירה נוחה לשמירה על כשרות הקלף לאורך שנים.</p><p class='mb-3'><strong>גודל ותאימות הלכתית:</strong> המארז מיועד לקלפי מזוזה כשרים בגודל 12 ס״מ (הגודל הפופולרי והתקני ביותר לדירות מגורים וחדרים). ניתן להזמין את המארז כבתי מזוזה בלבד או בתוספת 5 קלפי מזוזה 12 ס״מ כשרים למהדרין שנבדקו בהגהת מחשב וגברא.</p><p class='mb-3'><strong>אחריות ומשלוח:</strong> כל הזמנה נארזת במארז מרופד מוגן ומגיעה עם דבק דו-צדדי איכותי וחזק מותקן בגב המזוזה להתקנה קלה ומהירה ללא צורך בקידוח. משלוחים מהירים לכל חלקי הארץ ואחריות מלאה מבית עוז יודאיקה (רחוב שלום מנצורה 48, ראש העין | וואטסאפ: 052-686-7192).</p>`;
  p555.description = p555.short_description;

  console.log('✓ Product 555 options set strictly to 12 cm');

  console.log('\n=== Step 3: Creating Single Mezuzah Product 556 (Options for 12 or 15 cm, 15 cm limited stock) ===');

  // Check if 556 already exists
  const existingIdx = prods.findIndex(p => p.id == 556);

  const product556 = {
    id: 556,
    sku: "OZ-556",
    name: "בית מזוזה אפוקסי משולב עם עץ זית לבן שמנת עבודת יד – דגם יחיד (לבחירה 12 או 15 ס״מ)",
    price: 189,
    regular_price: 220,
    inStock: true,
    image: "public/products/mezuzah_555_single_original.jpg",
    images: [
      "public/products/mezuzah_555_single_original.jpg",
      "public/products/mezuzah_epoxy_555_doorpost_lifestyle.jpg",
      "public/products/mezuzah_epoxy_555_artisan_table.jpg",
      "public/products/mezuzah_epoxy_555_jerusalem_villa.jpg"
    ],
    short_description: `<p class='mb-3'><strong>בית מזוזה אפוקסי משולב עם עץ זית לבן שמנת עבודת יד – פריט יחיד</strong> מבית עוז יודאיקה ראש העין. יצירת מופת יהודית המשלבת עץ זית גלילי ארץ-ישראלי עתיק יחד עם יציקת אפוקסי קריסטלי בגוון לבן שמנת פנינה יוקרתי ואות ש' תלת-ממדית מוזהבת.</p><p class='mb-3'><strong>בחירת גודל:</strong> ניתן להזמין בגודל 12 ס״מ (הסטנדרט לחדרי הבית) או בגודל 15 ס״מ מהודר לכניסה הראשית. <em>שימו לב: גודל 15 ס״מ מיוצר בכמות מוגבלת עקב נדירות עץ הזית העבה – נותרו יחידות בודדות בלבד במלאי!</em></p><p class='mb-3'><strong>התקנה קלה ומהירה:</strong> מגיע עם פס הדבקה דו-צדדי 3M סופר-חזק ועמיד בגב המזוזה להתקנה נקייה ללא צורך בקידוחים. מתאים לקלף כשר וכולל מכסה אחורי מוגן לשמירה על כשרות הקלף.</p>`,
    description: `<p class='mb-3'><strong>בית מזוזה אפוקסי משולב עם עץ זית לבן שמנת עבודת יד – פריט יחיד</strong> מבית עוז יודאיקה ראש העין. יצירת מופת יהודית המשלבת עץ זית גלילי ארץ-ישראלי עתיק יחד עם יציקת אפוקסי קריסטלי בגוון לבן שמנת פנינה יוקרתי ואות ש' תלת-ממדית מוזהבת.</p><p class='mb-3'><strong>עיצוב ואיכות ארטיזנלית:</strong> כל בית מזוזה מיוצר בקפידה בעבודת יד אומנותית (One of a kind), כך שאין שתי מזוזות זהות לחלוטין. הגימור המלוטש מעניק מראה מודרני מרהיב לצד השורשיות של עץ הזית המסורתי.</p><p class='mb-3'><strong>בחירת גודל ומלאי:</strong><br>• <strong>גודל 12 ס״מ:</strong> מתאים לקלף מזוזה תקני 12 ס״מ – מושלם לכל חללי וחדרי הבית (זמין במלאי שוטף).<br>• <strong>גודל 15 ס״מ מהודר:</strong> מתאים לקלף 15 ס״מ – מרהיב לכניסה הראשית לבית או לעסק. <em>שימו לב: גודל 15 ס״מ מוגבל יותר בכמות עקב תהליך הייצור המורכב והמובחר.</em></p><p class='mb-3'><strong>אחריות ומשלוח:</strong> ארוז בקופסת מתנה מהודרת מבית עוז יודאיקה. משלוח מהיר ומבוטח עד פתח הבית (1-3 ימי עסקים למשלוח מהיר או 5-7 ימי עסקים רגיל), או איסוף עצמי חינם מחנות המפעל ברחוב שלום מנצורה 48, ראש העין.</p>`,
    category: "stam",
    category_name: "תשמישי קדושה וסת\"ם",
    subcategory: "בתי מזוזה מאפוקסי",
    options: [
      {
        name: "גודל בית המזוזה לבחירה",
        type: "select",
        values: [
          "מתאים לקלף 12 ס״מ (הגודל הקלאסי לחדרי הבית)",
          "מתאים לקלף 15 ס״מ מהודר לכניסה (+₪30) – מלאי מוגבל אחרון!"
        ]
      },
      {
        name: "תוספת קלף מזוזה כשר למהדרין",
        type: "select",
        values: [
          "ללא קלף (בית מזוזה בלבד)",
          "תוספת קלף מזוזה כשר למהדרין 12 ס״מ (+₪200)",
          "תוספת קלף מזוזה מהודר 15 ס״מ (+₪280)"
        ]
      }
    ],
    faq: [
      {
        q: "האם מדובר בבית מזוזה יחיד או בסט?",
        a: "דגם זה הינו בית מזוזה יחיד (בודד). למי שמעוניין במארז מלא לכל הבית קיים באתר גם סט של 5 מזוזות תואמות."
      },
      {
        q: "מה ההבדל בין גודל 12 ס״מ לגודל 15 ס״מ?",
        a: "גודל 12 ס״מ הוא הגודל הפופולרי והנפוץ ביותר עבור חדרי מגורים וחדרי שינה. גודל 15 ס״מ הוא דגם גדול ומרשים במיוחד המיועד בעיקר לדלת הכניסה הראשית. שימו לב כי גודל 15 ס״מ מיוצר בכמות מוגבלת עקב נדירות עץ הזית הרחב."
      },
      {
        q: "האם בית המזוזה מגיע עם קלף כשר?",
        a: "ניתן לבחור לרכוש את בית המזוזה בלבד, או להוסיף קלף מזוזה כשר למהדרין בגודל התואם (12 או 15 ס״מ) שנכתב על ידי סופר סת\"ם ירא שמיים ונבדק בהגהת מחשב וגברא."
      },
      {
        q: "כיצד מתקינים את המזוזה על המשקוף?",
        a: "גב המזוזה כולל פס הדבקה דו-צדדי בעל עוצמת אחיזה גבוהה במיוחד, המאפשר התקנה יציבה, אסתטית ומהירה על כל סוג משקוף ללא צורך בקידוח."
      }
    ],
    alt: "בית מזוזה אפוקסי משולב עם עץ זית לבן שמנת יוקרתי עבודת יד 12 או 15 ס\"מ – עוז יודאיקה",
    supplier: "עוז יודאיקה (ייצור עצמי וסת\"ם)",
    video: "demos/commercial_9s_mezuzot_olive_wood_epoxy.mp4",
    youtube_id: "TgbbfJIyvkg",
    youtube_url: "https://youtube.com/shorts/TgbbfJIyvkg"
  };

  if (existingIdx !== -1) {
    prods[existingIdx] = product556;
    console.log('✓ Updated existing Product 556 in products.json');
  } else {
    // Insert immediately after 555
    const idx555 = prods.findIndex(p => p.id == 555);
    prods.splice(idx555 + 1, 0, product556);
    console.log('✓ Added new Product 556 right after Product 555 in products.json');
  }

  fs.writeFileSync('products.json', JSON.stringify(prods, null, 2), 'utf8');
  console.log(`✓ products.json saved successfully (Total products: ${prods.length})`);

  // Step 4: Sync to index.html and products_data.js
  console.log('\n=== Step 4: Running update_index_html_products.js ===');
  execSync('node update_index_html_products.js', { stdio: 'inherit' });

  // Step 5: Update feeds & sitemap
  console.log('\n=== Step 5: Updating feeds & sitemap ===');
  execSync('node update_feeds.js', { stdio: 'inherit' });
  execSync('node build_seo_sitemap.js', { stdio: 'inherit' });

  // Step 6: Verify pre-deploy integrity
  console.log('\n=== Step 6: Running verify_pre_deploy.js ===');
  execSync('node verify_pre_deploy.js', { stdio: 'inherit' });

  console.log('\n🎉 ALL UPDATES COMPLETED SUCCESSFULLY FOR PRODUCT 555 & NEW PRODUCT 556!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
