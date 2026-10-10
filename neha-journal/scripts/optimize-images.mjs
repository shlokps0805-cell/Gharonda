// npm run images
// 1. For every photo in public/media/photos, darkroom and wishes, makes WebP versions at
//    800 px and 1600 px on the long side in public/media/optimized/ (rotation fixed from
//    EXIF; files already done are skipped). PhotoFrame uses them automatically.
// 2. For eras / darkroom sections with "photosFromFolder": true, lists every image in their
//    folder into content/generated/photos-<id>.json, so photos can be added by dropping
//    them in the folder.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const media = path.join(root, 'public', 'media');
const outDir = path.join(media, 'optimized');
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?|heic)$/i;
const SIZES = [800, 1600];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : IMAGE.test(d.name) ? [p] : [];
  });
}

const rel = p => path.relative(media, p).split(path.sep).join('/');
const sources = ['photos', 'darkroom', 'wishes'].flatMap(f => walk(path.join(media, f)));
let made = 0, skipped = 0, failed = 0;
const done = [];

for (const file of sources) {
  const r = rel(file);
  const base = path.join(outDir, r.replace(/\.[^.]+$/, ''));
  const targets = SIZES.map(s => `${base}-${s}.webp`);
  if (targets.every(t => fs.existsSync(t) && fs.statSync(t).mtimeMs >= fs.statSync(file).mtimeMs)) {
    skipped++;
    done.push(r);
    continue;
  }
  try {
    fs.mkdirSync(path.dirname(base), { recursive: true });
    for (const [i, s] of SIZES.entries()) {
      await sharp(file).rotate().resize({ width: s, height: s, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(targets[i]);
    }
    made++;
    done.push(r);
  } catch (e) {
    failed++;
    console.log(`  could not convert ${r}: ${e.message}`);
  }
}
fs.mkdirSync(path.join(root, 'content', 'generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'content', 'generated', 'optimized.json'), JSON.stringify(done.sort(), null, 2) + '\n');

// photosFromFolder: list the folder's images for the loader to merge in
const readJson = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const lists = [];
for (const era of readJson('content/timeline.json')) {
  if (era.photosFromFolder) lists.push([era.id, path.join(media, 'photos', era.id)]);
}
for (const sec of readJson('content/darkroom.json').sections || []) {
  if (sec.photosFromFolder) lists.push([sec.id, path.join(media, 'darkroom', sec.id)]);
}
for (const [id, dir] of lists) {
  const photos = walk(dir).sort().map(f => ({ file: rel(f), caption: '' }));
  fs.writeFileSync(path.join(root, 'content', 'generated', `photos-${id}.json`), JSON.stringify(photos, null, 2) + '\n');
  console.log(`  listed ${photos.length} photo(s) from ${rel(dir)}/`);
}

console.log(`\nImages: ${made} converted, ${skipped} already done${failed ? `, ${failed} failed` : ''}.\n`);
