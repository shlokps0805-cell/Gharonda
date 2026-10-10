// Looks up a sticker on the sheet (content/stickers.json).
// Image stickers have a file and their pixel size (w, h) for the aspect ratio;
// "drawn" stickers (8-ball, the word stickers, washi...) are drawn in CSS by Sticker.jsx.
import content from '../content/loadContent.js';

const byId = Object.fromEntries(content.stickers.sheet.map(s => [s.id, s]));
const measured = {};

export function stickerInfo(kind) {
  return byId[kind] || null;
}

export function allStickers() {
  return content.stickers.sheet;
}

// stickers that fall in the physics pile: everything except paper pieces (group 5)
export function pileStickers() {
  return content.stickers.sheet.filter(s => s.group !== 5);
}

// New stickers added without w/h: measure the image once so the aspect ratio is right.
export function measureSticker(kind, onDone) {
  const s = byId[kind];
  if (!s || !s.file || (s.w && s.h) || measured[kind]) return;
  measured[kind] = true;
  const img = new Image();
  img.onload = () => {
    s.w = img.naturalWidth;
    s.h = img.naturalHeight;
    onDone && onDone();
  };
  img.src = '/media/' + s.file;
}
