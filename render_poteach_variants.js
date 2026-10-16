const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const outDir = 'public/products/tmunot';
  const baseImg = path.join(outDir, 'glass_poteach_et_yadecha_mockup.jpg');
  if (!fs.existsSync(baseImg)) return;

  console.log('Rendering Poteach Et Yadecha variants...');

  // Square
  await sharp(baseImg)
    .resize(1200, 1200, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'glass_poteach_square.jpg'));
  console.log('Saved glass_poteach_square.jpg');

  // Panoramic
  await sharp(baseImg)
    .resize(1400, 750, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'glass_poteach_panoramic.jpg'));
  console.log('Saved glass_poteach_panoramic.jpg');

  // Circle
  const circleMask = Buffer.from(`
    <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="600" cy="600" r="580" fill="#ffffff" />
    </svg>
  `);
  const squareArt = await sharp(baseImg)
    .resize(1200, 1200, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();

  const circleArt = await sharp(squareArt)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // render on luxury wall
  // Or simple circle jpeg on dark bg
  await sharp({
    create: {
      width: 1200,
      height: 1200,
      channels: 4,
      background: { r: 24, g: 20, b: 18, alpha: 1 }
    }
  })
  .composite([{ input: circleArt }])
  .jpeg({ quality: 95 })
  .toFile(path.join(outDir, 'glass_poteach_circle.jpg'));

  console.log('Saved glass_poteach_circle.jpg');
}

run().catch(console.error);
