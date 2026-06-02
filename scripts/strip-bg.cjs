// Strip baked checker / white background from Gemini PNG exports.
// Heuristic: a pixel is "background" if it's grayscale-ish (R≈G≈B) AND bright (>180).
// Content (maroon roses, green leaves, sepia scenery) has colour saturation → kept.
//
// Usage:  node scripts/strip-bg.js images/cover/rose-tl.png [...more files]
// Writes in-place (overwrites). Also writes alpha edge feather (anti-aliased).

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GRAY_TOL = 14;       // |R-G|, |R-B|, |G-B| all < this → grayscale
const BRIGHT   = 180;      // min luminance to treat as background
const SOFT_LO  = 180;      // start of soft alpha ramp
const SOFT_HI  = 230;      // fully transparent above this (still grayscale)

async function strip(file) {
  const img = sharp(file).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const buf = await img.raw().toBuffer();
  const out = Buffer.from(buf);

  let changed = 0;
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
    const isGray = (maxC - minC) <= GRAY_TOL;
    if (!isGray) continue;

    const lum = (r + g + b) / 3;
    if (lum < SOFT_LO) continue;

    if (lum >= SOFT_HI) {
      out[i + 3] = 0;
      changed++;
    } else {
      // soft ramp: lum SOFT_LO→SOFT_HI = alpha 255→0
      const t = (lum - SOFT_LO) / (SOFT_HI - SOFT_LO);
      out[i + 3] = Math.max(0, Math.min(255, Math.round((1 - t) * 255)));
      changed++;
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file + '.tmp');
  fs.renameSync(file + '.tmp', file);
  console.log(`✓ ${path.basename(file)}  ${w}x${h}  cleared ${(changed * 100 / (w * h)).toFixed(1)}% of pixels`);
}

(async () => {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('usage: node scripts/strip-bg.js <file.png> [...]'); process.exit(1); }
  for (const f of files) await strip(f);
})().catch(e => { console.error(e); process.exit(1); });
