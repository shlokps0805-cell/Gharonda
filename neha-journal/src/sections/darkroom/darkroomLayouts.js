// Section patterns from the Phase 5 design (DarkroomScene). Each section repeats its
// designed pattern for any number of photos; an empty section is hidden.
// Item: { t: frame type, r: ratio, s: size, x, y, rot, photo | group }
// Photos go in rows of three, the second row offset, as in the design.

function rowsOf3(photos, { t, r, s, rowH, top, rots, xs }) {
  return photos.map((photo, i) => {
    const block = Math.floor(i / 6), k = i % 6;
    return { t, r, s, photo, x: xs[k], y: top + block * rowH * 2 + (k < 3 ? 0 : rowH), rot: rots[k], i };
  });
}

export function buildSection(id, photos) {
  if (!photos.length) return null;
  switch (id) {
    case 'on-film': {
      const items = rowsOf3(photos, { t: 'film', r: '3:2', s: 300, rowH: 260, top: 70, rots: [-1, 1, -2, 2, -1, 1], xs: [0, 370, 740, 185, 555, 845] });
      return { items, h: bottom(items, 260) + 60 };
    }
    case 'photobooth-chaos': {
      // one strip per four photos
      const items = [];
      for (let g = 0; g * 4 < photos.length; g++) {
        const k = g % 4, row = Math.floor(g / 4);
        items.push({ t: 'booth', r: '1:1', s: 170, group: photos.slice(g * 4, g * 4 + 4), photo: photos[g * 4], x: [40, 300, 560, 820][k], y: [80, 40, 100, 60][k] + row * 760, rot: [-2, 3, -1, 2][k], i: g });
      }
      return { items, h: bottom(items, 760) + 60 };
    }
    case 'give-it-a-shake': {
      const items = rowsOf3(photos, { t: 'polaroid', r: '1:1', s: 260, rowH: 310, top: 70, rots: [-4, 3, -2, 5, -3, 2], xs: [0, 370, 740, 185, 555, 865] });
      return { items, h: bottom(items, 330) + 60 };
    }
    case 'flash-on': {
      const items = rowsOf3(photos, { t: 'taped', r: '4:5', s: 250, rowH: 270, top: 70, rots: [-3, 2, -4, 3, -2, 4], xs: [0, 370, 740, 185, 555, 865] });
      return { items, h: bottom(items, 330) + 60 };
    }
    case 'the-outtakes': {
      const rows = Math.ceil(photos.length / 8);
      return { contact: true, items: [], h: 90 + 56 + rows * 92 + 120 };
    }
    case 'slideshow': {
      const items = rowsOf3(photos, { t: 'slide', r: '1:1', s: 240, rowH: 280, top: 100, rots: [-2, 1, 3, -3, 2, -1], xs: [40, 380, 720, 210, 550, 850] });
      return { items, h: bottom(items, 340) + 40 };
    }
    case 'cover-girl-material': {
      const P = [[0, 80, -4], [300, 120, 3], [620, 70, -2], [160, 400, 4], [820, 380, -3]];
      const items = photos.map((photo, i) => {
        const [x, y, rot] = P[i % 5];
        return { t: 'torn', r: '4:5', s: 250, photo, x, y: y + Math.floor(i / 5) * 660, rot, i };
      });
      return { items, words: true, h: Math.max(720, bottom(items, 380) + 60) };
    }
    default:
      return null;
  }
}

function bottom(items, last) {
  return Math.max(...items.map(it => it.y)) + last;
}
