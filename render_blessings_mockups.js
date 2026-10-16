const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CANVAS_W = 1400;
const CANVAS_H = 1400;

function getLuxuryWallSvg(w, h) {
  return `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="wallLight" cx="50%" cy="36%" r="68%">
        <stop offset="0%" stop-color="#3c3734" />
        <stop offset="35%" stop-color="#2c2825" />
        <stop offset="70%" stop-color="#1b1816" />
        <stop offset="100%" stop-color="#100e0d" />
      </radialGradient>
      <linearGradient id="spotCone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff0de" stop-opacity="0.18" />
        <stop offset="35%" stop-color="#ffdcb6" stop-opacity="0.06" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b2d22" />
        <stop offset="40%" stop-color="#281e16" />
        <stop offset="100%" stop-color="#140f0b" />
      </linearGradient>
      <linearGradient id="credenzaTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22201e" />
        <stop offset="100%" stop-color="#0e0d0c" />
      </linearGradient>
    </defs>

    <rect width="${w}" height="${h}" fill="url(#wallLight)" />
    <polygon points="${w/2 - 160},0 ${w/2 + 160},0 ${w},${h*0.8} 0,${h*0.8}" fill="url(#spotCone)" />
    <rect y="${h - 180}" width="${w}" height="180" fill="url(#floor)" />
    <rect y="${h - 192}" width="${w}" height="12" fill="#181615" />
    <line x1="0" y1="${h - 192}" x2="${w}" y2="${h - 192}" stroke="#443e3a" stroke-width="1.5" />
    <rect x="${w*0.08}" y="${h - 260}" width="${w*0.84}" height="80" rx="3" fill="url(#credenzaTop)" stroke="#2f2b28" stroke-width="1.5" />
    <rect x="${w*0.08 - 10}" y="${h - 266}" width="${w*0.84 + 20}" height="8" rx="2" fill="#3a3532" />
  </svg>
  `;
}

function prepareBlessingArtwork(targetW, targetH, shapeType, title, lines, subtitle = '') {
  const isCircle = (shapeType === 'circle');
  const isPanoramic = (shapeType === 'panoramic');

  const titleFontSize = isPanoramic ? 40 : (isCircle ? 42 : 44);
  const lineFontSize = isPanoramic ? 21 : (isCircle ? 20 : 22);
  const lineSpacing = isPanoramic ? 34 : (isCircle ? 38 : 42);

  const startY = isPanoramic 
    ? Math.round((targetH - (lines.length * lineSpacing + 60)) / 2 + 50)
    : Math.round((targetH - (lines.length * lineSpacing + 80)) / 2 + 65);

  const artBgSvg = `
  <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep dark imperial onyx marble gradient -->
      <radialGradient id="artBg" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#241e19" />
        <stop offset="45%" stop-color="#14110e" />
        <stop offset="85%" stop-color="#0a0807" />
        <stop offset="100%" stop-color="#030302" />
      </radialGradient>

      <!-- Radiant center glow -->
      <radialGradient id="glowCenter" cx="50%" cy="48%" r="45%">
        <stop offset="0%" stop-color="#e2b453" stop-opacity="0.18" />
        <stop offset="50%" stop-color="#c99532" stop-opacity="0.06" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Gold foil gradient for letters -->
      <linearGradient id="goldText" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fff5d6" />
        <stop offset="25%" stop-color="#eed898" />
        <stop offset="50%" stop-color="#fffdf5" />
        <stop offset="75%" stop-color="#cf9f3e" />
        <stop offset="100%" stop-color="#f5dc93" />
      </linearGradient>

      <linearGradient id="goldBorder" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#eed898" stop-opacity="0.85" />
        <stop offset="50%" stop-color="#a87f32" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#eed898" stop-opacity="0.85" />
      </linearGradient>

      <filter id="goldGlow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.9" />
      </filter>
    </defs>

    <!-- Base artwork background -->
    <rect width="${targetW}" height="${targetH}" fill="url(#artBg)" />
    <rect width="${targetW}" height="${targetH}" fill="url(#glowCenter)" />

    ${isCircle ? `
      <!-- Circular gold border -->
      <circle cx="${targetW/2}" cy="${targetH/2}" r="${targetW/2 - 20}" fill="none" stroke="url(#goldBorder)" stroke-width="2.5" />
      <circle cx="${targetW/2}" cy="${targetH/2}" r="${targetW/2 - 28}" fill="none" stroke="url(#goldBorder)" stroke-width="1" stroke-dasharray="6,4" opacity="0.6" />
      <circle cx="${targetW/2}" cy="${targetH/2}" r="${targetW/2 - 36}" fill="none" stroke="url(#goldBorder)" stroke-width="0.7" opacity="0.4" />
    ` : `
      <!-- Rectangle / Square / Panoramic gold border -->
      <rect x="20" y="20" width="${targetW - 40}" height="${targetH - 40}" rx="3" fill="none" stroke="url(#goldBorder)" stroke-width="2" />
      <rect x="26" y="26" width="${targetW - 52}" height="${targetH - 52}" rx="2" fill="none" stroke="url(#goldBorder)" stroke-width="1" stroke-dasharray="6,4" opacity="0.6" />
      <rect x="32" y="32" width="${targetW - 64}" height="${targetH - 64}" rx="2" fill="none" stroke="url(#goldBorder)" stroke-width="0.7" opacity="0.4" />
    `}

    <!-- Hebrew Typography (100% correct, vector crisp, NO gibberish!) -->
    <g filter="url(#goldGlow)" text-anchor="middle" font-family="'Assistant', 'Heebo', 'Rubik', 'Segoe UI', Arial" direction="rtl">
      <!-- Title -->
      <text x="${targetW/2}" y="${startY}" font-size="${titleFontSize}" font-weight="900" fill="url(#goldText)" letter-spacing="1.5">
        ${title}
      </text>

      ${subtitle ? `
      <text x="${targetW/2}" y="${startY + 32}" font-size="${titleFontSize * 0.45}" font-weight="700" fill="#eed898" letter-spacing="1" opacity="0.9">
        ${subtitle}
      </text>
      ` : ''}

      <!-- Decorative gold divider -->
      <line x1="${targetW/2 - 120}" y1="${startY + (subtitle ? 46 : 22)}" x2="${targetW/2 + 120}" y2="${startY + (subtitle ? 46 : 22)}" stroke="url(#goldBorder)" stroke-width="1.5" />
      <circle cx="${targetW/2}" cy="${startY + (subtitle ? 46 : 22)}" r="3" fill="#edd087" />

      <!-- Body Lines -->
      ${lines.map((l, i) => `
        <text x="${targetW/2}" y="${startY + (subtitle ? 78 : 56) + (i * lineSpacing)}" font-size="${lineFontSize}" font-weight="700" fill="url(#goldText)" letter-spacing="0.5">
          ${l}
        </text>
      `).join('')}
    </g>
  </svg>
  `;

  return Buffer.from(artBgSvg);
}

async function renderGlassMockup(artworkBuf, shapeType, glassW, glassH) {
  const isCircle = (shapeType === 'circle');
  const isPanoramic = (shapeType === 'panoramic');
  const glassX = Math.round((CANVAS_W - glassW) / 2);
  const glassY = Math.round((CANVAS_H - 180 - glassH) / 2 + 10);

  let shadowSvg = '';
  if (isCircle) {
    shadowSvg = `
    <svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="floatShadow" x="-25%" y="-25%" width="160%" height="160%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000000" flood-opacity="0.55" />
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35" />
        </filter>
      </defs>
      <circle cx="${glassX + glassW/2}" cy="${glassY + glassH/2}" r="${glassW/2}" fill="#000000" filter="url(#floatShadow)" />
    </svg>
    `;
  } else {
    shadowSvg = `
    <svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="floatShadow" x="-25%" y="-25%" width="160%" height="160%">
          <feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#000000" flood-opacity="0.55" />
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35" />
        </filter>
      </defs>
      <rect x="${glassX}" y="${glassY}" width="${glassW}" height="${glassH}" rx="2" fill="#000000" filter="url(#floatShadow)" />
    </svg>
    `;
  }

  let glassOverlaySvg = '';
  if (isCircle) {
    const radius = glassW / 2;
    const sDist = Math.round(radius * 0.62);

    glassOverlaySvg = `
    <svg width="${glassW}" height="${glassH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.30" />
          <stop offset="30%" stop-color="#ffffff" stop-opacity="0.09" />
          <stop offset="55%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="75%" stop-color="#ffffff" stop-opacity="0.07" />
          <stop offset="90%" stop-color="#ffffff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04" />
        </linearGradient>
        <linearGradient id="bevelLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.6" />
        </linearGradient>
        <radialGradient id="screwChrome" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="45%" stop-color="#d4d8dd" />
          <stop offset="80%" stop-color="#7a828a" />
          <stop offset="100%" stop-color="#40464d" />
        </radialGradient>
      </defs>

      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="url(#glassGloss)" />
      <circle cx="${radius}" cy="${radius}" r="${radius - 1.5}" fill="none" stroke="url(#bevelLight)" stroke-width="3" />
      <circle cx="${radius}" cy="${radius}" r="${radius - 3.5}" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.5" />

      ${[
        { cx: radius - sDist, cy: radius - sDist },
        { cx: radius + sDist, cy: radius - sDist },
        { cx: radius - sDist, cy: radius + sDist },
        { cx: radius + sDist, cy: radius + sDist }
      ].map(s => `
        <circle cx="${s.cx}" cy="${s.cy + 2}" r="11" fill="#000000" opacity="0.35" />
        <circle cx="${s.cx}" cy="${s.cy}" r="10" fill="url(#screwChrome)" stroke="#9aa0a6" stroke-width="1" />
        <circle cx="${s.cx}" cy="${s.cy}" r="4" fill="#3c4043" opacity="0.6" />
        <circle cx="${s.cx - 2}" cy="${s.cy - 2}" r="2" fill="#ffffff" opacity="0.7" />
      `).join('')}
    </svg>
    `;
  } else {
    const cornerPad = 26;
    const screws = [
      { cx: cornerPad, cy: cornerPad },
      { cx: glassW - cornerPad, cy: cornerPad },
      { cx: cornerPad, cy: glassH - cornerPad },
      { cx: glassW - cornerPad, cy: glassH - cornerPad }
    ];
    if (isPanoramic) {
      screws.push({ cx: Math.round(glassW / 2), cy: cornerPad });
      screws.push({ cx: Math.round(glassW / 2), cy: glassH - cornerPad });
    }

    glassOverlaySvg = `
    <svg width="${glassW}" height="${glassH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28" />
          <stop offset="28%" stop-color="#ffffff" stop-opacity="0.08" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="72%" stop-color="#ffffff" stop-opacity="0.06" />
          <stop offset="88%" stop-color="#ffffff" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03" />
        </linearGradient>
        <radialGradient id="screwChrome" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="45%" stop-color="#d4d8dd" />
          <stop offset="80%" stop-color="#7a828a" />
          <stop offset="100%" stop-color="#40464d" />
        </radialGradient>
      </defs>

      <rect width="${glassW}" height="${glassH}" fill="url(#glassGloss)" />
      <rect x="0" y="0" width="${glassW}" height="2.5" fill="#ffffff" opacity="0.9" />
      <rect x="0" y="0" width="2.5" height="${glassH}" fill="#ffffff" opacity="0.8" />
      <rect x="0" y="${glassH - 2.5}" width="${glassW}" height="2.5" fill="#000000" opacity="0.45" />
      <rect x="${glassW - 2.5}" y="0" width="2.5" height="${glassH}" fill="#000000" opacity="0.4" />
      <polygon points="0,0 28,0 0,28" fill="#ffffff" opacity="0.4" />

      ${screws.map(s => `
        <circle cx="${s.cx}" cy="${s.cy + 2}" r="11" fill="#000000" opacity="0.35" />
        <circle cx="${s.cx}" cy="${s.cy}" r="10" fill="url(#screwChrome)" stroke="#9aa0a6" stroke-width="1" />
        <circle cx="${s.cx}" cy="${s.cy}" r="4" fill="#3c4043" opacity="0.6" />
        <circle cx="${s.cx - 2}" cy="${s.cy - 2}" r="2" fill="#ffffff" opacity="0.7" />
      `).join('')}
    </svg>
    `;
  }

  let artBuf = await sharp(artworkBuf).png().toBuffer();
  if (isCircle) {
    const circleMask = Buffer.from(`
    <svg width="${glassW}" height="${glassH}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${glassW/2}" cy="${glassH/2}" r="${glassW/2}" fill="#ffffff" />
    </svg>
    `);
    artBuf = await sharp(artBuf).composite([{ input: circleMask, blend: 'dest-in' }]).png().toBuffer();
  }

  const glassPanelWithArt = await sharp(artBuf)
    .composite([{ input: Buffer.from(glassOverlaySvg), blend: 'over' }])
    .png()
    .toBuffer();

  const wallBgBuf = await sharp(Buffer.from(getLuxuryWallSvg(CANVAS_W, CANVAS_H))).png().toBuffer();
  const shadowBuf = await sharp(Buffer.from(shadowSvg)).png().toBuffer();

  return await sharp(wallBgBuf)
    .composite([
      { input: shadowBuf, left: 0, top: 0 },
      { input: glassPanelWithArt, left: glassX, top: glassY }
    ])
    .jpeg({ quality: 95 })
    .toBuffer();
}

const BLESSINGS = [
  {
    key: 'mizmor_letoda',
    title: 'מִזְמוֹר לְתוֹדָה',
    subtitle: 'תְּהִלִּים מִזְמוֹר ק׳',
    lines: [
      'הָרִיעוּ לַיהוָה כָּל הָאָרֶץ',
      'עִבְדוּ אֶת יְהוָה בְּשִׂמְחָה בֹּאוּ לְפָנָיו בִּרְנָנָה',
      'דְּעוּ כִּי יְהוָה הוּא אֱלֹהִים',
      'הוּא עָשָׂנוּ וְלוֹ אֲנַחְנוּ עַמּוֹ וְצֹאן מַרְעִיתוֹ',
      'בֹּאוּ שְׁעָרָיו בְּתוֹדָה חֲצֵרֹתָיו בִּתְהִלָּה',
      'הוֹדוּ לוֹ בָּרְכוּ שְׁמוֹ',
      'כִּי טוֹב יְהוָה לְעוֹלָם חַסְדּוֹ וְעַד דֹּר וָדֹר אֱמוּנָתוֹ'
    ],
    shapes: ['rectangle', 'square', 'circle', 'panoramic']
  },
  {
    key: 'birkat_habayit',
    title: 'בִּרְכַּת הַבַּיִת',
    subtitle: 'שָׁלוֹם, שַׁלְוָה וּבְרָכָה בִּמְעוֹנְכֶם',
    lines: [
      'בְּזֶה הַשַּׁעַר לֹא יָבוֹא צַעַר',
      'בְּזֹאת הַדִּירָה לֹא תָבוֹא צָרָה',
      'בְּזֹאת הַדֶּלֶת לֹא תָבוֹא בֶּהָלָה',
      'בְּזֹאת הַמַּחְלָקָה לֹא תָבוֹא מַחְלוֹקֶת',
      'בְּזֶה הַמָּקוֹם תְּהִי בְרָכָה וְשָׁלוֹם'
    ],
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'birkat_haeisek',
    title: 'בִּרְכַּת הָעֵסֶק',
    subtitle: 'שֶׁפַע, פַּרְנָסָה וְהַצְלָחָה בְּכָל מַעֲשֵׂי יָדֶיךָ',
    lines: [
      'יְהִי רָצוֹן שֶׁתִּשְׁרֶה בְּרָכָה וְהַצְלָחָה בְּזֶה הַמָּקוֹם',
      'וְיִתְבָּרֵךְ הָעֵסֶק הַזֶּה בְּפַרְנָסָה טוֹבָה וּבְרֶוַח',
      'וּבְשָׁלוֹם וְאַחֲוָה, שֶׁפַע וּבְרָכָה מִמְּקוֹר הַבְּרָכוֹת'
    ],
    shapes: ['rectangle', 'panoramic']
  },
  {
    key: 'shema_yisrael',
    title: 'שְׁמַע יִשְׂרָאֵל',
    subtitle: 'יְסוֹד הָאֱמוּנָה וְקַבָּלַת עֹל מַלְכוּת שָׁמַיִם',
    lines: [
      'יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד',
      'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד',
      'וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ'
    ],
    shapes: ['rectangle', 'circle']
  },
  {
    key: 'ana_bekoach',
    title: 'תְּפִלַּת אָנָּא בְּכֹחַ',
    subtitle: 'שֵׁם מ״ב הַקָּדוֹשׁ וְהַטָּהוֹר',
    lines: [
      'אָנָּא בְּכֹחַ גְּדֻלַּת יְמִינְךָ תַּתִּיר צְרוּרָה',
      'קַבֵּל רִנַּת עַמְּךָ שַׂגְּבֵנוּ טַהֲרֵנוּ נוֹרָא',
      'נָא גִבּוֹר דּוֹרְשֵׁי יִחוּדְךָ כְּבָבַת שָׁמְרֵם',
      'בָּרְכֵם טַהֲרֵם רַחֲמֵי צִדְקָתְךָ תָּמִיד גָּמְלֵם',
      'חֲסִין קָדוֹשׁ בְּרוֹב טוּבְךָ נַהֵל עֲדָתֶךָ',
      'יָחִיד גֵּאֶה לְעַמְּךָ פְּנֵה זוֹכְרֵי קְדֻשָּׁתֶךָ',
      'שַׁוְעָתֵנוּ קַבֵּל וּשְׁמַע צַעֲקָתֵנוּ יוֹדֵעַ תַּעֲלוּמוֹת',
      'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד'
    ],
    shapes: ['rectangle', 'square']
  },
  {
    key: 'eshet_chayil',
    title: 'אֵשֶׁת חַיִל',
    subtitle: 'מִשְׁלֵי ל״א – בִּרְכַּת עֲטֶרֶת תִּפְאֶרֶת',
    lines: [
      'אֵשֶׁת חַיִל מִי יִמְצָא וְרָחֹק מִפְּנִינִים מִכְרָהּ',
      'בָּטַח בָּהּ לֵב בַּעְלָהּ וְשָׁלָל לֹא יֶחְסָר',
      'גְּמָלַתְהוּ טוֹב וְלֹא רָע כֹּל יְמֵי חַיֶּיהָ',
      'רַבּוֹת בָּנוֹת עָשׂוּ חָיִל וְאַתְּ עָלִית עַל כֻּלָּנָה',
      'שֶׁקֶר הַחֵן וְהֶבֶל הַיֹּפִי אִשָּׁה יִרְאַת יְהוָה הִיא תִתְהַלָּל'
    ],
    shapes: ['rectangle', 'square']
  },
  {
    key: 'shir_lamaalot',
    title: 'שִׁיר לַמַּעֲלוֹת',
    subtitle: 'תְּהִלִּים מִזְמוֹר קכ״א',
    lines: [
      'אֶשָּׂא עֵינַי אֶל הֶהָרִים מֵאַיִן יָבֹא עֶזְרִי',
      'עֶזְרִי מֵעִם יְהוָה עֹשֵׂה שָׁמַיִם וָאָרֶץ',
      'אַל יִתֵּן לַמּוֹט רַגְלֶךָ אַל יָנוּם שֹׁמְרֶךָ',
      'הִנֵּה לֹא יָנוּם וְלֹא יִישָׁן שׁוֹמֵר יִשְׂרָאֵל',
      'יְהוָה יִשְׁמָרְךָ מִכָּל רָע יִשְׁמֹר אֶת נַפְשֶׁךָ',
      'יְהוָה יִשְׁמָר צֵאתְךָ וּבוֹאֶךָ מֵעַתָּה וְעַד עוֹלָם'
    ],
    shapes: ['rectangle', 'circle']
  },
  {
    key: 'birkat_kohanim',
    title: 'בִּרְכַּת כֹּהֲנִים',
    subtitle: 'שְׁלוֹשֶׁת פְּסוּקֵי הַבְּרָכָה מֵהַתּוֹרָה',
    lines: [
      'יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ',
      'יָאֵר יְהוָה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ',
      'יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם'
    ],
    shapes: ['rectangle', 'panoramic']
  },
  {
    key: 'pitum_haketoret',
    title: 'פִּטּוּם הַקְּטֹרֶת',
    subtitle: 'סְגֻלָּה נִפְלָאָה לְפַרְנָסָה, רְפוּאָה וּשְׁמִירָה מִכָּל פֶּגַע',
    lines: [
      'אַתָּה הוּא יְהוָה אֱלֹהֵינוּ שֶׁהִקְטִירוּ אֲבוֹתֵינוּ לְפָנֶיךָ אֶת קְטֹרֶת הַסַּמִּים',
      'הַצֳּרִי וְהַצִּפּוֹרֶן הַחֶלְבְּנָה וְהַלְּבוֹנָה מִשְׁקַל שִׁבְעִים שִׁבְעִים מָנֶה',
      'מוֹר וּקְצִיעָה שִׁבּוֹלֶת נֵרְדְּ וְכַרְכֹּם מִשְׁקַל שִׁשָּׁה עָשָׂר שִׁשָּׁה עָשָׂר מָנֶה',
      'קֻשְׂטְ שְׁנֵים עָשָׂר, קִלּוּפָה שְׁלֹשָׁה, קִנָּמוֹן תִּשְׁעָה',
      'בּוֹרִית כַּרְשִׁינָא תִּשְׁעָה קַבִּין, יֵין קַפְרִיסִין סְאִין תְּלָת וְקַבִּין תְּלָתָא',
      'מֶלַח סְדוֹמִית רוֹבַע, מַעֲלֶה עָשָׁן כָּל שֶׁהוּא',
      'יְהוָה צְבָאוֹת עִמָּנוּ מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶלָה'
    ],
    shapes: ['rectangle', 'panoramic']
  },
  {
    key: 'shiviti',
    title: 'שִׁוִּיתִי יְהוָה לְנֶגְדִּי תָמִיד',
    subtitle: 'כִּי מִימִינִי בַּל אֶמּוֹט',
    lines: [
      'לָכֵן שָׂמַח לִבִּי וַיָּגֶל כְּבוֹדִי אַף בְּשָׂרִי יִשְׁכֹּן לָבֶטַח',
      'תּוֹדִיעֵנִי אֹרַח חַיִּים שׂבַע שְׂמָחוֹת אֶת פָּנֶיךָ נְעִימוֹת בִּימִינְךָ נֶצַח'
    ],
    shapes: ['rectangle']
  },
  {
    key: 'parashat_haman',
    title: 'סְגֻלַּת פָּרָשַׁת הַמָּן',
    subtitle: 'פַּרְנָסָה טוֹבָה בְּרֶוַח וּבְכָבוֹד מִיָּדוֹ הָרְחָבָה',
    lines: [
      'וַיֹּאמֶר יְהוָה אֶל מֹשֶׁה הִנְנִי מַמְטִיר לָכֶם לֶחֶם מִן הַשָּׁמָיִם',
      'וְיָצָא הָעָם וְלָקְטוּ דְּבַר יוֹם בְּיוֹמוֹ',
      'פּוֹתֵחַ אֶת יָדֶךָ וּמַשְׂבִּיעַ לְכָל חַי רָצוֹן',
      'יְהוָה רֹעִי לֹא אֶחְסָר בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי'
    ],
    shapes: ['rectangle']
  },
  {
    key: 'asher_yatzar',
    title: 'בִּרְכַּת אֲשֶׁר יָצָר',
    subtitle: 'הוֹדָיָה עַל נִפְלְאוֹת גּוּף הָאָדָם וּבְרִיאוּתוֹ',
    lines: [
      'אֲשֶׁר יָצַר אֶת הָאָדָם בְּחָכְמָה וּבָרָא בוֹ נְקָבִים נְקָבִים חֲלוּלִים חֲלוּלִים',
      'גָּלוּי וְיָדוּעַ לִפְנֵי כִסֵּא כְבוֹדֶךָ שֶׁאִם יִפָּתֵחַ אֶחָד מֵהֶם אוֹ יִסָּתֵם אֶחָד מֵהֶם',
      'אִי אֶפְשָׁר לְהִתְקַיֵּם וְלַעֲמוֹד לְפָנֶיךָ אֲפִלּוּ שָׁעָה אֶחָת',
      'בָּרוּךְ אַתָּה יְהוָה רוֹפֵא כָל בָּשָׂר וּמַפְלִיא לַעֲשׂוֹת'
    ],
    shapes: ['rectangle']
  }
];

async function run() {
  const outDir = 'public/products/tmunot';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const shapeDims = {
    rectangle: { w: 680, h: 950 },
    square: { w: 820, h: 820 },
    circle: { w: 840, h: 840 },
    panoramic: { w: 1080, h: 560 }
  };

  for (const b of BLESSINGS) {
    console.log(`\n=== Processing ${b.key} (${b.title}) ===`);

    for (const shape of b.shapes) {
      const outFile = path.join(outDir, `glass_${b.key}_${shape}.jpg`);
      const dims = shapeDims[shape];
      console.log(`Rendering ${shape} (${dims.w}x${dims.h}) -> ${outFile}...`);
      try {
        const art = prepareBlessingArtwork(dims.w, dims.h, shape, b.title, b.lines, b.subtitle);
        const mockup = await renderGlassMockup(art, shape, dims.w, dims.h);
        fs.writeFileSync(outFile, mockup);
        console.log(`Saved: ${outFile} (${fs.statSync(outFile).size} bytes)`);
      } catch(err) {
        console.error(`Error rendering ${b.key} ${shape}:`, err.message);
      }
    }
  }

  // OVERWRITE CORRUPTED PLACEHOLDERS:
  console.log('\n--- Overwriting corrupted placeholder assets ---');
  // 1. glass_art_placeholder.jpg -> use glass_mizmor_letoda_rectangle.jpg
  const cleanMizmor = fs.readFileSync(path.join(outDir, 'glass_mizmor_letoda_rectangle.jpg'));
  fs.writeFileSync(path.join(outDir, 'glass_art_placeholder.jpg'), cleanMizmor);
  console.log('Overwrote glass_art_placeholder.jpg with clean Mizmor LeToda (NO gibberish!)');

  // 2. glass_blessing_mockup.jpg -> use glass_birkat_habayit_rectangle.jpg
  const cleanBirkatHabayit = fs.readFileSync(path.join(outDir, 'glass_birkat_habayit_rectangle.jpg'));
  fs.writeFileSync(path.join(outDir, 'glass_blessing_mockup.jpg'), cleanBirkatHabayit);
  console.log('Overwrote glass_blessing_mockup.jpg with clean Birkat HaBayit (NO gibberish!)');

  // 3. glass_circle_mockup.jpg -> use glass_mizmor_letoda_circle.jpg
  const cleanCircle = fs.readFileSync(path.join(outDir, 'glass_mizmor_letoda_circle.jpg'));
  fs.writeFileSync(path.join(outDir, 'glass_circle_mockup.jpg'), cleanCircle);
  console.log('Overwrote glass_circle_mockup.jpg with clean circle (NO gibberish!)');

  console.log('\nAll Blessings mockups and clean placeholders completed!');
}

run().catch(console.error);
