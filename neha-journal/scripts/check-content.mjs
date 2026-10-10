// npm run check
// Validates every content file with the same rules the site uses, checks that every
// referenced media file exists, and prints a friendly summary.
// Exits with code 1 if there are errors (missing media files, broken JSON).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAll } from '../src/content/validators.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quiet = process.argv.includes('--quiet');
const errors = [];

function readJson(rel, fallback) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    errors.push(`${rel} is missing`);
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    errors.push(`${rel} is not valid JSON: ${e.message}`);
    return fallback;
  }
}

function readDir(rel, ext) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs.readdirSync(p).filter(f => f.endsWith(ext)).map(f => [f.replace(ext, '').replace(/^photos-/, ''), fs.readFileSync(path.join(p, f), 'utf8')]),
  );
}

const generated = Object.fromEntries(Object.entries(readDir('content/generated', '.json')).map(([k, v]) => {
  try { return [k, JSON.parse(v)]; } catch { errors.push(`content/generated/photos-${k}.json is not valid JSON`); return [k, []]; }
}));

const raw = {
  site: readJson('content/site.json', {}),
  friends: readJson('content/friends.json', []),
  timeline: readJson('content/timeline.json', []),
  darkroom: readJson('content/darkroom.json', {}),
  wishes: readJson('content/wishes.json', []),
  songs: readJson('content/songs.json', []),
  jokes: readJson('content/jokes.json', []),
  stickers: readJson('content/stickers.json', {}),
  ui: readJson('content/ui-text.json', {}),
  connections: readJson('content/games/connections.json', []),
  wordle: readJson('content/games/wordle.json', {}),
  cryptic: readJson('content/games/cryptic.json', []),
  world: readJson('content/games/neha-world.json', {}),
  wishMarkdown: readDir('content/wishes', '.md'),
  generated,
};

const { content: c, warnings } = validateAll(raw);

// every referenced media file must exist in public/media
const media = rel => path.join(root, 'public', 'media', rel);
function need(file, where) {
  if (file && !/^https?:\/\//.test(file) && !fs.existsSync(media(file))) errors.push(`${where}: file not found: public/media/${file}`);
}
need(c.site.coverPhoto, 'site.json coverPhoto');
need(c.site.groupPhoto, 'site.json groupPhoto');
c.site.mixtapePhotos.forEach(f => need(f, 'site.json mixtapePhotos'));
c.timeline.forEach(e => {
  e.photos.forEach(p => need(p.file, `timeline "${e.id}"`));
  if (e.video) { need(e.video.file, `timeline "${e.id}" video`); need(e.video.poster, `timeline "${e.id}" video poster`); }
});
c.darkroom.sections.forEach(s => s.photos.forEach(p => need(p.file, `darkroom "${s.id}"`)));
c.wishes.forEach(w => { need(w.photo, `wish "${w.id}" photo`); if (w.video) need(w.video.file, `wish "${w.id}" video`); });
c.stickers.sheet.forEach(s => need(s.file, `sticker "${s.id}"`));

// friendly summary
const photos = c.timeline.reduce((n, e) => n + e.photos.length, 0);
const realPhotos = c.timeline.reduce((n, e) => n + e.photos.filter(p => !p.placeholder).length, 0);
const dark = c.darkroom.sections.reduce((n, s) => n + s.photos.length, 0);
const videos = c.wishes.filter(w => w.video).length;
const playable = c.songs.filter(s => s.uri).length;
const samples = JSON.stringify(raw).split('SAMPLE').length - 1;

const lines = [
  `Friends: ${c.friends.length}.`,
  `Timeline: ${c.timeline.length} eras, ${photos} photos (${realPhotos} real, ${photos - realPhotos} placeholders).`,
  `Darkroom: ${dark} photos in ${c.darkroom.sections.filter(s => s.photos.length).length} sections.`,
  `Wishes: ${c.wishes.length} (${videos} video${videos === 1 ? '' : 's'}).`,
  `Songs: ${c.songs.length} (${playable} with a Spotify link).`,
  `Jokes: ${c.jokes.length}.`,
  `Games: ${c.connections.length} Connections puzzle(s), ${c.wordle.words.length} Wordle word(s), ${c.cryptic.length} cryptic clue(s), Neha's World ${c.world.embedUrl ? 'linked' : 'not added yet'}.`,
  `Stickers: ${c.stickers.sheet.length} on the sheet.`,
];

if (!quiet || errors.length || warnings.length) {
  console.log('\n' + lines.join('\n'));
  if (samples) console.log(`(${samples} SAMPLE placeholder text${samples === 1 ? '' : 's'} still waiting for real content)`);
  warnings.forEach(w => console.log('  warning: ' + w));
  errors.forEach(e => console.log('  ERROR: ' + e));
  console.log(`\n${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.\n`);
}
process.exit(errors.length ? 1 : 0);
