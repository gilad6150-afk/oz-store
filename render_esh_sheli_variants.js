const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const outDir = 'public/products/tmunot';
  const baseImg = path.join(outDir, 'glass_esh_sheli_mockup.jpg');
  if (!fs.existsSync(baseImg)) return;

  console.log('Rendering Esh Sheli square and panoramic variants...');

  // Square
  await sharp(baseImg)
    .resize(1200, 1200, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'glass_esh_sheli_square.jpg'));
  console.log('Saved glass_esh_sheli_square.jpg');

  // Panoramic
  await sharp(baseImg)
    .resize(1400, 750, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'glass_esh_sheli_panoramic.jpg'));
  console.log('Saved glass_esh_sheli_panoramic.jpg');
}

run().catch(console.error);
