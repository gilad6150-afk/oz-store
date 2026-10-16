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

    <!-- Wall background -->
    <rect width="${w}" height="${h}" fill="url(#wallLight)" />

    <!-- Architectural downlight spot cone -->
    <polygon points="${w/2 - 160},0 ${w/2 + 160},0 ${w},${h*0.8} 0,${h*0.8}" fill="url(#spotCone)" />

    <!-- Floor -->
    <rect y="${h - 180}" width="${w}" height="180" fill="url(#floor)" />

    <!-- Skirting board -->
    <rect y="${h - 192}" width="${w}" height="12" fill="#181615" />
    <line x1="0" y1="${h - 192}" x2="${w}" y2="${h - 192}" stroke="#443e3a" stroke-width="1.5" />

    <!-- Sleek modern credenza shelf / sideboard at bottom -->
    <rect x="${w*0.08}" y="${h - 260}" width="${w*0.84}" height="80" rx="3" fill="url(#credenzaTop)" stroke="#2f2b28" stroke-width="1.5" />
    <rect x="${w*0.08 - 10}" y="${h - 266}" width="${w*0.84 + 20}" height="8" rx="2" fill="#3a3532" />
  </svg>
  `;
}

async function prepareRabbiArtwork(rabbiImgPath, targetW, targetH, shapeType, rabbiNameHebrew, rabbiSubtitleHebrew) {
  const isCircle = (shapeType === 'circle');
  const isPanoramic = (shapeType === 'panoramic');

  const textY1 = isCircle ? targetH - 100 : (isPanoramic ? targetH - 65 : targetH - 85);
  const textY2 = isCircle ? targetH - 68 : (isPanoramic ? targetH - 40 : targetH - 58);

  const artBgSvg = `
  <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep dark imperial onyx marble gradient -->
      <radialGradient id="artBg" cx="50%" cy="42%" r="65%">
        <stop offset="0%" stop-color="#2a231d" />
        <stop offset="45%" stop-color="#181310" />
        <stop offset="85%" stop-color="#0d0b09" />
        <stop offset="100%" stop-color="#050504" />
      </radialGradient>

      <!-- Radiant holy golden halo behind Rabbi head -->
      <radialGradient id="holyHalo" cx="50%" cy="38%" r="42%">
        <stop offset="0%" stop-color="#ffe8a3" stop-opacity="0.85" />
        <stop offset="35%" stop-color="#d49b35" stop-opacity="0.50" />
        <stop offset="70%" stop-color="#8b5e1b" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Gold foil gradient for letters -->
      <linearGradient id="goldText" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fdf3cd" />
        <stop offset="25%" stop-color="#edd087" />
        <stop offset="50%" stop-color="#fff9e6" />
        <stop offset="75%" stop-color="#c99532" />
        <stop offset="100%" stop-color="#fad97f" />
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

    <!-- Radiant golden halo -->
    <rect width="${targetW}" height="${targetH}" fill="url(#holyHalo)" />

    ${isCircle ? `
      <!-- Circular gold border -->
      <circle cx="${targetW/2}" cy="${targetH/2}" r="${targetW/2 - 20}" fill="none" stroke="url(#goldBorder)" stroke-width="2.5" />
      <circle cx="${targetW/2}" cy="${targetH/2}" r="${targetW/2 - 26}" fill="none" stroke="url(#goldBorder)" stroke-width="1" stroke-dasharray="6,4" opacity="0.6" />
    ` : `
      <!-- Rectangle / Square / Panoramic gold border -->
      <rect x="20" y="20" width="${targetW - 40}" height="${targetH - 40}" rx="3" fill="none" stroke="url(#goldBorder)" stroke-width="2" />
      <rect x="26" y="26" width="${targetW - 52}" height="${targetH - 52}" rx="2" fill="none" stroke="url(#goldBorder)" stroke-width="1" stroke-dasharray="6,4" opacity="0.6" />
    `}

    <!-- Hebrew Typography (100% correct, vector crisp, NO gibberish!) -->
    <g filter="url(#goldGlow)" text-anchor="middle" font-family="'Assistant', 'Heebo', 'Rubik', 'Segoe UI', Arial" direction="rtl">
      <text x="${targetW/2}" y="${textY1}" font-size="${isPanoramic ? 32 : (isCircle ? 36 : 34)}" font-weight="900" fill="url(#goldText)" letter-spacing="1">
        ${rabbiNameHebrew}
      </text>
      ${rabbiSubtitleHebrew ? `
      <text x="${targetW/2}" y="${textY2}" font-size="${isPanoramic ? 20 : (isCircle ? 22 : 20)}" font-weight="700" fill="#edd087" opacity="0.95" letter-spacing="0.5">
        ${rabbiSubtitleHebrew}
      </text>
      ` : ''}
    </g>
  </svg>
  `;

  const artBgBuf = await sharp(Buffer.from(artBgSvg)).png().toBuffer();

  const portW = Math.round(targetW * (isCircle ? 0.65 : (isPanoramic ? 0.45 : 0.72)));
  const portH = Math.round(targetH * (isCircle ? 0.80 : (isPanoramic ? 0.72 : 0.72)));

  const featherMaskSvg = Buffer.from(`
  <svg width="${portW}" height="${portH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fMask" cx="50%" cy="45%" r="48%">
        <stop offset="45%" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="75%" stop-color="#ffffff" stop-opacity="0.8" />
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="${portW}" height="${portH}" fill="url(#fMask)" />
  </svg>
  `);

  let tintedPortrait;
  try {
    tintedPortrait = await sharp(rabbiImgPath)
      .resize(portW, portH, { fit: 'cover', position: 'top' })
      .modulate({ brightness: 1.05, contrast: 1.35 })
      .tint({ r: 245, g: 220, b: 180 })
      .composite([{ input: featherMaskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();
  } catch(e) {
    // fallback if tint fails
    tintedPortrait = await sharp(rabbiImgPath)
      .resize(portW, portH, { fit: 'cover', position: 'top' })
      .composite([{ input: featherMaskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();
  }

  const left = Math.round((targetW - portW) / 2);
  const top = isPanoramic ? Math.round((targetH - portH) / 2 - 25) : Math.round((targetH - portH) / 2 - 35);

  let compositeArt = await sharp(artBgBuf)
    .composite([
      { input: tintedPortrait, left, top }
    ])
    .png()
    .toBuffer();

  if (isCircle) {
    const circleMask = Buffer.from(`
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${targetW/2}" cy="${targetH/2}" r="${targetW/2}" fill="#ffffff" />
    </svg>
    `);
    compositeArt = await sharp(compositeArt)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toBuffer();
  }

  return compositeArt;
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

  const glassPanelWithArt = await sharp(artworkBuf)
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

const RABBIS = [
  {
    key: 'baba_sali',
    portrait: 'authentic_rabbis_portraits/baba_sali.jpg',
    name: 'רבנו ישראל אבוחצירא זיע״א',
    subtitle: 'הבבא סאלי הקדוש',
    shapes: ['rectangle', 'square', 'circle', 'panoramic']
  },
  {
    key: 'abir_yaakov',
    portrait: 'authentic_rabbis_portraits/abir_yaakov.jpg',
    name: 'רבנו יעקב אבוחצירא זיע״א',
    subtitle: 'בעל אביר יעקב',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'lubavitch',
    portrait: 'authentic_rabbis_portraits/lubavitcher_rebbe.jpg',
    name: 'רבנו מנחם מענדל שניאורסאהן',
    subtitle: 'הרבי מליובאוויטש מלך המשיח',
    shapes: ['rectangle', 'square', 'circle', 'panoramic']
  },
  {
    key: 'rav_ovadia',
    portrait: 'authentic_rabbis_portraits/rav_ovadia.jpg',
    name: 'מרן רבנו עובדיה יוסף זיע״א',
    subtitle: 'פוסק הדור ובעל יביע אומר',
    shapes: ['rectangle', 'square', 'circle', 'panoramic']
  },
  {
    key: 'rav_yoram',
    portrait: 'authentic_rabbis_portraits/rav_yoram_abergel.jpg',
    name: 'רבנו יורם מיכאל אברג׳ל זיע״א',
    subtitle: 'המאיר פנים לכל ישראל',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'rav_eliyahu',
    portrait: 'authentic_rabbis_portraits/rav_mordechai_eliyahu.jpg',
    name: 'מרן רבנו מרדכי אליהו זיע״א',
    subtitle: 'הראשון לציון ואביהם של ישראל',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'chida',
    portrait: 'authentic_rabbis_portraits/chida.jpg',
    name: 'רבנו חיים יוסף דוד אזולאי זיע״א',
    subtitle: 'איש האשכולות החיד״א',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'rav_kaduri',
    portrait: 'authentic_rabbis_portraits/rav_kaduri.jpg',
    name: 'רבנו יצחק כדורי זיע״א',
    subtitle: 'זקן המקובלים',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'pinto',
    portrait: 'authentic_rabbis_portraits/chaim_pinto.jpg',
    name: 'רבנו חיים פינטו זיע״א',
    subtitle: 'הצדיק ממוגאדור',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'rashbi',
    portrait: 'authentic_rabbis_portraits/rashbi_meron.jpg',
    name: 'התנא האלוקי רבי שמעון בר יוחאי',
    subtitle: 'ציון קדשו במירון זיע״א',
    shapes: ['rectangle', 'square', 'circle', 'panoramic']
  },
  {
    key: 'meir_baal_hanes',
    portrait: 'authentic_rabbis_portraits/rabbi_meir_tomb.jpg',
    name: 'רבי מאיר בעל הנס זיע״א',
    subtitle: 'אלהא דמאיר ענני',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'kerestir',
    portrait: 'authentic_rabbis_portraits/reb_yeshaya_kerestir.jpg',
    name: 'רבנו ישעיה בן ר׳ משה זיע״א',
    subtitle: 'סגולת הפרנסה והשמירה',
    shapes: ['rectangle', 'square', 'circle', 'panoramic']
  },
  {
    key: 'nachman',
    portrait: 'authentic_rabbis_portraits/rabbi_nachman.jpg',
    name: 'רבנו נחמן מברסלב זיע״א',
    subtitle: 'נ נח נחמ נחמן מאומן',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'yanuka',
    portrait: 'authentic_rabbis_portraits/yanuka.jpg',
    name: 'הגאון הרב שלמה יהודה בארי שליט״א',
    subtitle: 'הינוקא',
    shapes: ['rectangle', 'square', 'circle']
  },
  {
    key: 'kanievsky',
    portrait: 'authentic_rabbis_portraits/rav_chaim_kanievsky.jpg',
    name: 'מרן רבנו חיים קנייבסקי זיע״א',
    subtitle: 'שר התורה ועמוד החסד',
    shapes: ['rectangle', 'square']
  },
  {
    key: 'baba_meir',
    portrait: 'authentic_rabbis_portraits/baba_meir.jpg',
    name: 'רבנו מאיר אבוחצירא זיע״א',
    subtitle: 'הבבא מאיר קודש הקודשים',
    shapes: ['rectangle', 'square']
  },
  {
    key: 'baba_chaki',
    portrait: 'authentic_rabbis_portraits/baba_chaki.jpg',
    name: 'רבנו יצחק אבוחצירא זיע״א',
    subtitle: 'הבבא חאקי רבה של רמלה',
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

  for (const r of RABBIS) {
    console.log(`\n=== Processing ${r.key} (${r.name}) ===`);
    if (!fs.existsSync(r.portrait)) {
      console.error(`Portrait missing: ${r.portrait}`);
      continue;
    }

    for (const shape of r.shapes) {
      const outFile = path.join(outDir, `glass_${r.key}_${shape}.jpg`);
      if (fs.existsSync(outFile)) {
        console.log(`Already exists: ${outFile}`);
        continue;
      }
      const dims = shapeDims[shape];
      console.log(`Rendering ${shape} (${dims.w}x${dims.h}) -> ${outFile}...`);
      try {
        const art = await prepareRabbiArtwork(r.portrait, dims.w, dims.h, shape, r.name, r.subtitle);
        const mockup = await renderGlassMockup(art, shape, dims.w, dims.h);
        fs.writeFileSync(outFile, mockup);
        console.log(`Saved: ${outFile} (${fs.statSync(outFile).size} bytes)`);
      } catch(err) {
        console.error(`Error rendering ${r.key} ${shape}:`, err.message);
      }
    }
  }

  console.log('\nAll Rabbis mockups generation completed!');
}

run().catch(console.error);
