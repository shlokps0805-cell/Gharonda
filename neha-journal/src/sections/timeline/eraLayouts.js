// The five era-page layouts from the Phase 4 design (TimelineScene.layout()).
// Each layout has designed slots in priority order. An era fills the first N slots;
// with fewer photos the page simply ends sooner, with more than the designed slots
// the extra photos flow into a "more from this era" grid below.
// Slot: [frameType, ratio, size, rotation, x, y, extras]

const SLOTS = {
  scrapbook: [
    ['taped', '3:2', 620, -2, 0, 10], ['torn', '4:5', 300, 3, 700, 0], ['clipped', '1:1', 260, -3, 40, 520, { clip: true }], ['taped', '3:4', 260, 4, 360, 500],
    ['torn', '1:1', 250, -4, 680, 430], ['polaroid', '4:5', 260, 2, 0, 900], ['taped', '3:2', 380, -3, 320, 860], ['clipped', '1:1', 250, 3, 760, 800, { clip: true }],
    ['torn', '3:4', 250, -2, 60, 1300], ['taped', '1:1', 260, 4, 700, 1240],
  ],
  'polaroid-scatter': [[0, 0, -6], [330, 30, 5], [660, 0, -3], [40, 400, 4], [360, 430, -7], [690, 390, 6], [10, 800, -4], [340, 820, 3], [680, 790, -5], [360, 1190, 4]]
    .map(([x, y, r], i) => ['polaroid', i % 4 === 1 ? '4:5' : '1:1', 280, r, x, y, { clip: i % 3 === 0, noCaption: true }]),
  'feature-grid': [
    ['corners', '4:5', 500, -1, 0, 0],
    ...[[560, 180], [820, 180], [560, 520], [820, 520], [0, 720], [280, 760], [560, 860], [820, 860], [280, 1100]].map(([x, y], i) => ['corners', '1:1', 240, i % 2 ? 1 : -1, x, y, { noCaption: true }]),
  ],
  'photobooth-wall': [
    ['booth', '1:1', 170, -2, 0, 40, { clip: true, noCaption: true }], ['booth', '1:1', 170, 3, 230, 0, { clip: true, noCaption: true }], ['booth', '1:1', 170, -1, 460, 80, { clip: true, noCaption: true }],
    ['polaroid', '4:5', 260, 4, 700, 20], ['taped', '1:1', 250, -3, 710, 470], ['polaroid', '1:1', 240, 3, 120, 880], ['taped', '3:2', 360, -2, 450, 900],
  ],
  pinboard: [[0, 10, '3:2', 380, -3], [440, 40, '1:1', 260, 4], [740, 0, '4:5', 260, -2], [60, 420, '1:1', 250, 3], [380, 440, '3:4', 260, -4], [720, 420, '1:1', 250, 2], [0, 820, '4:5', 260, 4], [330, 860, '3:2', 360, -2], [760, 820, '1:1', 250, 3], [400, 1220, '1:1', 250, -3]]
    .map(([x, y, r, s, rot]) => ['clipped', r, s, rot, x, y, { pin: true, noCaption: true }]),
};

// handwritten notes and the pull-quote (positions from the design)
const NOTE_SPOTS = {
  scrapbook: [[420, 1330, -3, 230], [720, 1180, 3, 230]],
  pinboard: [[780, 1240, 2, 220]],
  'feature-grid': [[560, 0, 0, 460, true]],
};

// page paper per layout: [background, texture, texture size, ink, ink 2, fade colour]
export const ERA_PAPER = {
  scrapbook: ['#FFFFFF', '/media/textures/grain.png', '128px 128px', '#130F1F', '#5E3695', '#FFFFFF'],
  'polaroid-scatter': ['#ECE8F2', '/media/textures/grain.png', '128px 128px', '#130F1F', '#5E3695', '#ECE8F2'],
  'feature-grid': ['#FFFFFF', '/media/textures/grain.png', '128px 128px', '#130F1F', '#204670', '#FFFFFF'],
  'photobooth-wall': ['#E6EDF4', '/media/textures/grain.png', '128px 128px', '#130F1F', '#204670', '#E6EDF4'],
  pinboard: ['#9FB3CB', '/media/textures/film-grain.png', '200px 200px', '#130F1F', '#320F6F', '#9FB3CB'],
};

// outer width/height of a PhotoFrame (same maths as the design's fw()/fh())
export function frameW(t, s) {
  return t === 'polaroid' ? s + 2 * Math.max(10, Math.round(s * 0.05)) : t === 'slide' ? s + 2 * Math.round(s * 0.12) : t === 'film' ? s + 28 : t === 'corners' ? s + 12 : t === 'torn' ? s + 16 : s + 20;
}
export function frameH(t, s, r) {
  const [a, b] = r.split(':').map(Number), ph = Math.round(s * b / a);
  return t === 'polaroid' ? ph + Math.max(10, Math.round(s * 0.05)) + Math.min(84, Math.max(52, Math.round(s * 0.17))) + 28 : t === 'slide' ? ph + Math.round(s * 0.34) + 60 : t === 'film' ? ph + 52 + 60 : t === 'booth' ? ph * 4 + 24 + 42 + 60 : ph + 26 + 60;
}

// Builds the page: { items, more, strings, height }
// Photobooth strips take four photos each; the video tile takes the design's video slot.
export function buildEraLayout(era) {
  const layout = era.layout;
  const slots = SLOTS[layout] || SLOTS.scrapbook;
  const photos = [...era.photos];
  const items = [];
  const video = era.video;
  const videoSlot = layout === 'photobooth-wall' ? 4 : layout === 'feature-grid' ? 5 : 4;

  slots.forEach((slot, i) => {
    const [t, r, s, rot, x, y, ex = {}] = slot;
    if (video && i === videoSlot) {
      items.push({ kind: 'video', t: t === 'booth' ? 'taped' : t, r, s, rot, x, y, ...ex, noCaption: true });
      return;
    }
    if (!photos.length) return;
    if (t === 'booth') {
      if (photos.length < 4 && items.some(it => it.t === 'booth')) return;
      const group = photos.splice(0, 4);
      items.push({ kind: 'photo', t, r, s, rot, x, y, tone: i % 3, ...ex, photo: group[0], group });
    } else {
      items.push({ kind: 'photo', t, r, s, rot, x, y, tone: i % 3, ...ex, photo: photos.shift() });
    }
  });

  const notes = (era.notes || []).map((text, i) => {
    const spot = (NOTE_SPOTS[layout] || [])[i];
    return spot ? { kind: 'note', text, x: spot[0], y: spot[1], rot: spot[2], w: spot[3], quote: !!spot[4] } : null;
  }).filter(Boolean);

  // the page ends after the lowest item
  const bottoms = items.map(p => p.y + frameH(p.t, p.s, p.r)).concat(notes.map(n => n.y + 160));
  const height = Math.max(600, ...bottoms) + 40;

  // pinboard: dusty-rose string joining the pins
  const strings = [];
  if (layout === 'pinboard') {
    const pts = items.filter(p => p.pin).map(p => [p.x + frameW(p.t, p.s) / 2, p.y + 4]);
    for (let i = 1; i < pts.length; i++) {
      const [a, b] = pts[i - 1], [c, d] = pts[i];
      strings.push({ x: a, y: b, w: Math.hypot(c - a, d - b), a: Math.atan2(d - b, c - a) * 180 / Math.PI });
    }
  }
  return { items, notes, more: photos, strings, height };
}
