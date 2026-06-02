/* eslint-disable no-console */
/**
 * scripts/optimize-images.cjs
 *
 * One-shot image optimizer for the wedding invitation. Generates a `.webp`
 * sibling next to every PNG/JPG under `images/cover/` (and other selected
 * folders) at a sensible quality. The originals are kept as fallback.
 *
 * Run:
 *   npm i -D sharp
 *   node scripts/optimize-images.cjs
 *
 * After running, optionally swap `.png` references in components for `.webp`
 * (e.g. /cover/batik-top.webp). Browsers that don't support WebP will still
 * have the originals to fall back to if you keep them.
 */
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('Missing dependency "sharp". Install it first:\n\n  npm i -D sharp\n');
  process.exit(1);
}

const ROOTS = [
  path.join(__dirname, '..', 'images', 'cover'),
  path.join(__dirname, '..', 'images'),
];

const EXT = new Set(['.png', '.jpg', '.jpeg']);
const SKIP_DIRS = new Set(['gemini', 'audio']);

async function walk(dir, out) {
  let entries;
  try { entries = await fs.promises.readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(full, out);
    } else if (EXT.has(path.extname(e.name).toLowerCase())) {
      out.push(full);
    }
  }
}

async function convert(file) {
  const webp = file.replace(/\.(png|jpe?g)$/i, '.webp');
  if (fs.existsSync(webp)) return { file, skipped: true };
  const buf = await sharp(file)
    .webp({ quality: 78, effort: 5 })
    .toBuffer();
  await fs.promises.writeFile(webp, buf);
  const before = (await fs.promises.stat(file)).size;
  const after = buf.length;
  return { file, before, after, ratio: after / before };
}

(async () => {
  const files = [];
  for (const root of ROOTS) await walk(root, files);
  // De-duplicate (the two ROOTS overlap)
  const unique = Array.from(new Set(files));
  console.log(`Converting ${unique.length} image(s) to WebP\u2026`);
  let savedBytes = 0;
  for (const f of unique) {
    try {
      const r = await convert(f);
      if (r.skipped) {
        console.log(`  skip  ${path.relative(process.cwd(), f)} (webp already exists)`);
      } else {
        savedBytes += (r.before - r.after);
        const kb = (n) => (n / 1024).toFixed(1) + ' KB';
        console.log(`  ok    ${path.relative(process.cwd(), f)}  ${kb(r.before)} \u2192 ${kb(r.after)}  (${(r.ratio * 100).toFixed(0)}%)`);
      }
    } catch (err) {
      console.warn(`  fail  ${f}: ${err.message}`);
    }
  }
  console.log(`\nDone. Saved \u2248 ${(savedBytes / 1024 / 1024).toFixed(2)} MB.`);
})();
