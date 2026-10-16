const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 3x3 matrix inversion for homography
function invert3x3(m) {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const D = -(b * i - c * h), E = a * i - c * g, F = -(a * h - b * g);
  const G = b * f - c * e, H = -(a * f - c * d), I = a * e - b * d;
  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-10) throw new Error('Singular matrix');
  return [A / det, D / det, G / det, B / det, E / det, H / det, C / det, F / det, I / det];
}

// Compute 3x3 homography matrix from 4 source points to 4 destination points
function getHomography(src, dst) {
  const A = [];
  for (let i = 0; i < 4; i++) {
    const { x: sx, y: sy } = src[i];
    const { x: dx, y: dy } = dst[i];
    A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy, -dx]);
    A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy, -dy]);
  }
  const M = A.map(row => [...row.slice(0, 8), -row[8]]);
  for (let i = 0; i < 8; i++) {
    let maxRow = i;
    for (let r = i + 1; r < 8; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[maxRow][i])) maxRow = r;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];
    const pivot = M[i][i];
    for (let c = i; c <= 8; c++) M[i][c] /= pivot;
    for (let r = 0; r < 8; r++) {
      if (r !== i) {
        const factor = M[r][i];
        for (let c = i; c <= 8; c++) M[r][c] -= factor * M[i][c];
      }
    }
  }
  const h = M.map(row => row[8]);
  h.push(1);
  return h;
}

// Warp source image onto destination quad with bilinear sampling
function warpImage(sData, sW, sH, dstPoints, outW, outH) {
  const src = [
    { x: 0, y: 0 },
    { x: sW, y: 0 },
    { x: sW, y: sH },
    { x: 0, y: sH }
  ];
  const H = getHomography(src, dstPoints);
  const invH = invert3x3(H);
  const outBuf = Buffer.alloc(outW * outH * 4);

  for (let dy = 0; dy < outH; dy++) {
    for (let dx = 0; dx < outW; dx++) {
      const denom = invH[6] * dx + invH[7] * dy + invH[8];
      const sx = (invH[0] * dx + invH[1] * dy + invH[2]) / denom;
      const sy = (invH[3] * dx + invH[4] * dy + invH[5]) / denom;

      if (sx >= 0 && sx < sW - 1 && sy >= 0 && sy < sH - 1) {
        const x0 = Math.floor(sx), x1 = x0 + 1;
        const y0 = Math.floor(sy), y1 = y0 + 1;
        const fx = sx - x0, fy = sy - y0;

        const i00 = (y0 * sW + x0) * 4;
        const i10 = (y0 * sW + x1) * 4;
        const i01 = (y1 * sW + x0) * 4;
        const i11 = (y1 * sW + x1) * 4;

        const outIdx = (dy * outW + dx) * 4;
        for (let c = 0; c < 4; c++) {
          const val = (1 - fx) * (1 - fy) * sData[i00 + c] +
                      fx * (1 - fy) * sData[i10 + c] +
                      (1 - fx) * fy * sData[i01 + c] +
                      fx * fy * sData[i11 + c];
          outBuf[outIdx + c] = Math.round(val);
        }
      }
    }
  }
  return outBuf;
}

async function renderAll() {
  console.log('--- Generating 3 Authentic Lifestyle Images for Product 633 (פיטום הקטורת פיו 15*15) ---');

  const brainDir = 'C:/Users/97254/.gemini/antigravity/brain/b7c38b2f-8855-418f-a6aa-14dfb9dfdd6f';
  const cleanProdPath = 'pitom_633_clean.png';
  const { data: sData, info: sInfo } = await sharp(cleanProdPath).raw().toBuffer({ resolveWithObject: true });

  // Ensure public/products exists
  if (!fs.existsSync('public/products')) fs.mkdirSync('public/products', { recursive: true });

  // =========================================================================
  // SCENE 1: Shabbat Credenza (Warm Domestic Setting)
  // =========================================================================
  {
    console.log('Rendering Scene 1: Shabbat Credenza...');
    const bgPath = path.join(brainDir, 'pitom_shabbat_bg_1792138236300.jpg');

    // Placed securely on the walnut credenza top surface (shifted back from edge)
    const dstPoints = [
      { x: 440, y: 495 },  // top-left
      { x: 690, y: 460 },  // top-right
      { x: 720, y: 700 },  // bottom-right
      { x: 450, y: 750 }   // bottom-left
    ];

    const warpedBuf = warpImage(sData, sInfo.width, sInfo.height, dstPoints, 1024, 1024);

    // Directional shadow from candles (offset down-right)
    const shadowPoints = [
      { x: 448, y: 505 },
      { x: 705, y: 468 },
      { x: 745, y: 720 },
      { x: 460, y: 768 }
    ];

    const shadowSvg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="occlusionBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <!-- Ambient soft shadow -->
        <polygon points="${shadowPoints.map(p => `${p.x},${p.y}`).join(' ')}" fill="rgba(25, 12, 5, 0.65)" filter="url(#shadowBlur)" />
        <!-- Contact occlusion shadow -->
        <polygon points="${dstPoints.map(p => `${p.x},${p.y + 4}`).join(' ')}" fill="rgba(10, 5, 2, 0.75)" filter="url(#occlusionBlur)" />
      </svg>
    `;

    // Warm candlelight ambiance overlay on the white cover
    const warmGlowSvg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="warmGrad" x1="0.3" y1="0.4" x2="0.8" y2="0.8">
            <stop offset="0%" stop-color="#ffe2a8" stop-opacity="0.22" />
            <stop offset="60%" stop-color="#ffd080" stop-opacity="0.10" />
            <stop offset="100%" stop-color="#d47020" stop-opacity="0.04" />
          </linearGradient>
        </defs>
        <polygon points="${dstPoints.map(p => `${p.x},${p.y}`).join(' ')}" fill="url(#warmGrad)" />
      </svg>
    `;

    const shadowBuf = await sharp(Buffer.from(shadowSvg)).png().toBuffer();
    const warmBuf = await sharp(Buffer.from(warmGlowSvg)).png().toBuffer();
    const bookBuf = await sharp(warpedBuf, { raw: { width: 1024, height: 1024, channels: 4 } }).png().toBuffer();

    await sharp(bgPath)
      .composite([
        { input: shadowBuf, left: 0, top: 0 },
        { input: bookBuf, left: 0, top: 0 },
        { input: warmBuf, left: 0, top: 0 }
      ])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile('public/products/pitom_633_lifestyle_shabbat.jpg');

    console.log('✓ Created public/products/pitom_633_lifestyle_shabbat.jpg');
  }

  // =========================================================================
  // SCENE 2: Luxury Carrara Marble Showcase (Showroom / Gallery Display)
  // =========================================================================
  {
    console.log('Rendering Scene 2: Marble Showcase Pedestal...');
    const bgPath = path.join(brainDir, 'pitom_marble_bg_1792138260106.jpg');

    // Stand upright in the center of the Carrara marble counter
    const targetW = 340;
    const targetH = Math.round(targetW * (sInfo.height / sInfo.width)); // 356px

    const resizedProd = await sharp(cleanProdPath)
      .resize(targetW, targetH)
      .toBuffer({ resolveWithObject: true });

    const posX = Math.round((1024 - targetW) / 2); // 342
    const posY = 385; // Base lands at 385 + 356 = 741 on the marble top

    // Subtle marble reflection fading downwards
    const reflectionH = 90;
    const flippedBuf = await sharp(resizedProd.data)
      .flip()
      .extract({ left: 0, top: 0, width: targetW, height: reflectionH })
      .toBuffer({ resolveWithObject: true });

    const reflectionSvg = `
      <svg width="${targetW}" height="${reflectionH}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="reflFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.32" />
            <stop offset="50%" stop-color="#fff" stop-opacity="0.10" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0.0" />
          </linearGradient>
          <mask id="reflMask">
            <rect width="${targetW}" height="${reflectionH}" fill="url(#reflFade)" />
          </mask>
        </defs>
        <image href="data:image/png;base64,${flippedBuf.data.toString('base64')}"
               width="${targetW}" height="${reflectionH}" mask="url(#reflMask)" />
      </svg>
    `;
    const reflectionBuf = await sharp(Buffer.from(reflectionSvg)).png().toBuffer();

    // Contact occlusion shadow and ambient shadow beneath the standing item
    const shadowW = targetW + 60;
    const shadowH = 32;
    const shadowSvg = `
      <svg width="${shadowW}" height="${shadowH}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="occl" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#111" stop-opacity="0.80" />
            <stop offset="40%" stop-color="#222" stop-opacity="0.55" />
            <stop offset="80%" stop-color="#555" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#888" stop-opacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="${shadowW / 2}" cy="${shadowH / 2}" rx="${targetW * 0.48}" ry="${shadowH * 0.42}" fill="url(#occl)" />
      </svg>
    `;
    const contactShadowBuf = await sharp(Buffer.from(shadowSvg)).png().toBuffer();

    // Discreet transparent acrylic display stand base (tiny clear notches)
    const acrylicStandSvg = `
      <svg width="${targetW + 20}" height="24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="acrylic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.7)" />
            <stop offset="40%" stop-color="rgba(220,230,240,0.3)" />
            <stop offset="80%" stop-color="rgba(180,200,220,0.4)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.6)" />
          </linearGradient>
        </defs>
        <!-- Left notch -->
        <rect x="40" y="6" width="22" height="14" rx="3" fill="url(#acrylic)" stroke="rgba(255,255,255,0.85)" stroke-width="1" />
        <!-- Right notch -->
        <rect x="${targetW - 42}" y="6" width="22" height="14" rx="3" fill="url(#acrylic)" stroke="rgba(255,255,255,0.85)" stroke-width="1" />
      </svg>
    `;
    const acrylicBuf = await sharp(Buffer.from(acrylicStandSvg)).png().toBuffer();

    await sharp(bgPath)
      .composite([
        // Marble reflection
        { input: reflectionBuf, left: posX, top: posY + targetH - 2 },
        // Contact occlusion shadow
        { input: contactShadowBuf, left: Math.round((1024 - shadowW) / 2), top: posY + targetH - 14 },
        // Main authentic product
        { input: resizedProd.data, left: posX, top: posY },
        // Acrylic stand feet
        { input: acrylicBuf, left: posX - 10, top: posY + targetH - 12 }
      ])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile('public/products/pitom_633_lifestyle_marble.jpg');

    console.log('✓ Created public/products/pitom_633_lifestyle_marble.jpg');
  }

  // =========================================================================
  // SCENE 3: Traditional Study Desk / Beit Midrash (Scholar Setting)
  // =========================================================================
  {
    console.log('Rendering Scene 3: Scholar Study Desk...');
    const bgPath = path.join(brainDir, 'pitom_study_bg_1792138290480.jpg');

    // On the oak study desk, resting naturally in tabletop reading perspective
    const dstPoints = [
      { x: 380, y: 580 },  // top-left (narrower at top)
      { x: 630, y: 565 },  // top-right
      { x: 700, y: 785 },  // bottom-right (wider at bottom)
      { x: 340, y: 810 }   // bottom-left
    ];

    const warpedBuf = warpImage(sData, sInfo.width, sInfo.height, dstPoints, 1024, 1024);

    // Lamp is on the left (x ~ 170, y ~ 450) -> casts shadow to the right and back
    const shadowPoints = [
      { x: 395, y: 588 },
      { x: 660, y: 572 },
      { x: 735, y: 800 },
      { x: 355, y: 825 }
    ];

    const shadowSvg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="deskBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="deskOccl" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <!-- Soft shadow thrown rightwards by lamp -->
        <polygon points="${shadowPoints.map(p => `${p.x},${p.y}`).join(' ')}" fill="rgba(30, 18, 8, 0.65)" filter="url(#deskBlur)" />
        <!-- Occlusion shadow under desk contact -->
        <polygon points="${dstPoints.map(p => `${p.x},${p.y + 3}`).join(' ')}" fill="rgba(15, 8, 3, 0.78)" filter="url(#deskOccl)" />
      </svg>
    `;

    // Warm lamp lighting gradient across the cover (bright warm gold on left, softer on right)
    const lampGlowSvg = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lampGrad" x1="0.3" y1="0.5" x2="0.75" y2="0.5">
            <stop offset="0%" stop-color="#ffeaae" stop-opacity="0.25" />
            <stop offset="40%" stop-color="#ffd580" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#b86820" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points="${dstPoints.map(p => `${p.x},${p.y}`).join(' ')}" fill="url(#lampGrad)" />
      </svg>
    `;

    const shadowBuf = await sharp(Buffer.from(shadowSvg)).png().toBuffer();
    const lampBuf = await sharp(Buffer.from(lampGlowSvg)).png().toBuffer();
    const bookBuf = await sharp(warpedBuf, { raw: { width: 1024, height: 1024, channels: 4 } }).png().toBuffer();

    await sharp(bgPath)
      .composite([
        { input: shadowBuf, left: 0, top: 0 },
        { input: bookBuf, left: 0, top: 0 },
        { input: lampBuf, left: 0, top: 0 }
      ])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile('public/products/pitom_633_lifestyle_study.jpg');

    console.log('✓ Created public/products/pitom_633_lifestyle_study.jpg');
  }

  console.log('\n🎉 ALL 3 PRODUCT 633 LIFESTYLE IMAGES GENERATED WITH 100% AUTHENTICITY!');
}

renderAll().catch(err => {
  console.error('Error generating lifestyles:', err);
  process.exit(1);
});
