// Validation + defaults for every content file.
// Used by the site (loadContent.js) and by `npm run check` (scripts/check-content.mjs),
// so both apply exactly the same rules.
//
// Rules: every item gets a stable id; missing optional fields get defaults;
// broken items are skipped with a warning (never a crash); unknown fields are kept.
import { FRIEND_SWATCHES, LAYOUTS, DARKROOM_SECTIONS, CONNECTION_COLOURS } from './defaults.js';

export function slug(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const isObj = x => x && typeof x === 'object' && !Array.isArray(x);
const str = (x, d = '') => (typeof x === 'string' ? x : x == null ? d : String(x));
const list = x => (Array.isArray(x) ? x : []);

// relative luminance of a #RRGGBB colour (0 dark .. 1 light)
export function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

// give every item an id; generate one from a name/title when missing
function ensureIds(items, where, warn, nameKeys = ['name', 'title', 'text', 'label']) {
  const seen = new Set();
  return items.map((it, i) => {
    let id = str(it.id).trim();
    if (!id) {
      const base = nameKeys.map(k => it[k]).find(Boolean);
      id = slug(base) || `${where}-${i + 1}`;
      warn(`${where}: item ${i + 1} had no id, using "${id}"`);
    }
    let unique = id;
    let n = 2;
    while (seen.has(unique)) unique = `${id}-${n++}`;
    if (unique !== id) warn(`${where}: duplicate id "${id}", renamed to "${unique}"`);
    seen.add(unique);
    return { ...it, id: unique };
  });
}

// a photo entry: { file, caption, takenBy, alt }. No file = a design placeholder.
function photo(p, i, where, warn, friendsById) {
  if (typeof p === 'string') p = { file: p };
  if (!isObj(p)) {
    warn(`${where}: photo ${i + 1} is not valid, skipped`);
    return null;
  }
  const by = str(p.takenBy);
  const friend = friendsById[by] || Object.values(friendsById).find(f => f.name.toLowerCase() === by.toLowerCase());
  return {
    ...p,
    file: str(p.file).trim(),
    caption: str(p.caption),
    takenBy: by,
    takenByName: friend ? friend.name : by,
    alt: str(p.alt) || str(p.caption) || 'a photo of Neha',
    placeholder: !str(p.file).trim(),
  };
}

function video(v) {
  if (!isObj(v)) return null;
  const file = str(v.file).trim();
  const youtube = str(v.youtube).trim();
  const vimeo = str(v.vimeo).trim();
  return { ...v, file, youtube, vimeo, poster: str(v.poster).trim(), placeholder: !file && !youtube && !vimeo };
}

export function validateSite(raw, warn) {
  const s = isObj(raw) ? raw : {};
  if (!isObj(raw)) warn('site.json: missing or not an object, using defaults');
  const eggs = isObj(s.easterEggs) ? s.easterEggs : {};
  return {
    ...s,
    name: str(s.name, 'Neha'),
    birthday: str(s.birthday, '2026-10-11'),
    coverLine: str(s.coverLine, 'NEHA · THE BIRTHDAY JOURNAL · 11.10.2026'),
    dateLine: str(s.dateLine, '11.10.2026'),
    fromLine: str(s.fromLine).replace(/^by\s*/i, '').replace(/^_+$/, ''),
    envelopeFont: ['Great Vibes', 'Alex Brush', 'Parisienne', 'Mrs Saint Delafield'].includes(s.envelopeFont) ? s.envelopeFont : 'Great Vibes',
    coverPhoto: str(s.coverPhoto).trim(),
    coverNote: str(s.coverNote, 'this whole journal is about you.'),
    coverNote2: str(s.coverNote2, ''),
    contentsWelcome: str(s.contentsWelcome),
    contentsSignoff: str(s.contentsSignoff, '— all of us'),
    contentsPhotoCaption: str(s.contentsPhotoCaption),
    groupPhoto: str(s.groupPhoto).trim(),
    groupName: str(s.groupName, 'all of us'),
    mixtapePhotos: list(s.mixtapePhotos).map(f => str(f).trim()).filter(Boolean).slice(0, 5),
    city: str(s.city),
    spotifyPlaylistUrl: str(s.spotifyPlaylistUrl).trim(),
    nicknames: list(s.nicknames).map(n => str(n).trim()).filter(Boolean),
    easterEggs: {
      nameClicks: { on: true, note: '', ...(eggs.nameClicks || {}) },
      nicknameRain: { on: true, ...(eggs.nicknameRain || {}) },
      secretKeys: { on: false, sequence: '', message: '', ...(eggs.secretKeys || {}) },
    },
  };
}

export function validateFriends(raw, warn) {
  let items = list(raw).filter(f => {
    if (!isObj(f) || !str(f.name).trim()) {
      warn('friends.json: a friend with no name was skipped');
      return false;
    }
    return true;
  });
  items = ensureIds(items, 'friends', warn, ['name']);
  const used = new Set(items.map(f => str(f.colour).toUpperCase()).filter(Boolean));
  let hand = 0;
  items = items.map((f, i) => {
    let colour = /^#[0-9a-f]{6}$/i.test(str(f.colour)) ? f.colour.toUpperCase() : '';
    let colourName = str(f.colourName);
    if (!colour) {
      const free = FRIEND_SWATCHES.find(([c]) => !used.has(c)) || FRIEND_SWATCHES[i % FRIEND_SWATCHES.length];
      colour = free[0];
      used.add(colour);
      colourName = colourName || free[1];
      warn(`friends.json: ${f.name} has no colour, using ${free[1]}`);
    }
    if (!colourName) {
      const sw = FRIEND_SWATCHES.find(([c]) => c === colour);
      colourName = sw ? sw[1] : 'my favourite colour';
    }
    const h = f.hand === 'caveat' || f.hand === 'kalam' ? f.hand : hand % 2 ? 'kalam' : 'caveat';
    hand++;
    const lum = luminance(colour);
    return {
      ...f,
      name: str(f.name).trim(),
      colour,
      colourName,
      hand: h,
      font: h === 'kalam' ? 'Kalam' : 'Caveat',
      order: Number.isFinite(f.order) ? f.order : 1000 + i,
      // text colour on the friend's colour: ink or white, by luminance
      onColour: lum < 0.18 ? '#FFFFFF' : '#130F1F',
      dark: lum < 0.18,
    };
  });
  items.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return items;
}

const byId = items => Object.fromEntries(items.map(x => [x.id, x]));

export function validateTimeline(raw, warn, friends, generated = {}) {
  let eras = list(raw).filter(e => {
    if (!isObj(e) || !(str(e.name) || str(e.year))) {
      warn('timeline.json: an era with no name or year was skipped');
      return false;
    }
    return true;
  });
  eras = ensureIds(eras, 'timeline', warn, ['name', 'year']);
  const friendsById = byId(friends);
  eras.sort((a, b) => (Number.isFinite(a.order) ? a.order : 999) - (Number.isFinite(b.order) ? b.order : 999));
  let prev = null;
  return eras.map((e, i) => {
    let layout = LAYOUTS.includes(e.layout) ? e.layout : null;
    if (!layout) {
      // rotate so neighbouring eras never share a layout
      layout = LAYOUTS[i % LAYOUTS.length];
      if (layout === prev) layout = LAYOUTS[(i + 1) % LAYOUTS.length];
      if (e.layout) warn(`timeline.json: era "${e.id}" has unknown layout "${e.layout}", using ${layout}`);
    }
    prev = layout;
    let photos = list(e.photos);
    if (e.photosFromFolder && Array.isArray(generated[e.id])) {
      const have = new Set(photos.map(p => (typeof p === 'string' ? p : p && p.file)));
      photos = [...photos, ...generated[e.id].filter(p => !have.has(p.file))];
    }
    return {
      ...e,
      name: str(e.name, e.year),
      // shorter label for the year buttons and the era switcher
      shortName: str(e.shortName) || str(e.name, e.year),
      year: str(e.year),
      description: str(e.description),
      layout,
      notes: list(e.notes).map(n => str(n)).filter(Boolean),
      photos: photos.map((p, j) => photo(p, j, `timeline "${e.id}"`, warn, friendsById)).filter(Boolean),
      video: video(e.video),
    };
  });
}

export function validateDarkroom(raw, warn, generated = {}) {
  const given = list(isObj(raw) ? raw.sections : []);
  const sections = DARKROOM_SECTIONS.map(([id, label]) => {
    const s = given.find(x => isObj(x) && x.id === id) || { id, label, photos: [] };
    let photos = list(s.photos);
    if (s.photosFromFolder && Array.isArray(generated[id])) photos = [...photos, ...generated[id]];
    return {
      ...s,
      id,
      label: str(s.label, label),
      photos: photos.map((p, j) => photo(p, j, `darkroom "${id}"`, warn, {})).filter(Boolean),
    };
  });
  given.forEach(x => {
    if (isObj(x) && !DARKROOM_SECTIONS.some(([id]) => id === x.id)) warn(`darkroom.json: unknown section "${x.id}" ignored`);
  });
  return { sections };
}

// text of a Markdown wish -> paragraphs (keeps *emphasis* markers for the renderer)
export function markdownParagraphs(md) {
  return str(md)
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(p => p && !p.startsWith('<!--'));
}

export function validateWishes(raw, warn, friends, markdownById = {}) {
  const friendsById = byId(friends);
  let items = list(raw).filter(w => isObj(w));
  items = ensureIds(items, 'wishes', warn, ['friend', 'headline']);
  // every friend gets a wish slot, even if wishes.json forgot them
  friends.forEach(f => {
    if (!items.some(w => (w.friend || w.id) === f.id)) items.push({ id: f.id, friend: f.id });
  });
  return items
    .map(w => {
      const friend = friendsById[w.friend] || friendsById[w.id];
      if (!friend) {
        warn(`wishes.json: "${w.id}" does not match any friend in friends.json, skipped`);
        return null;
      }
      const paragraphs = markdownParagraphs(markdownById[w.id] ?? markdownById[friend.id] ?? '');
      const v = video(w.video);
      return {
        ...w,
        friend: friend.id,
        friendInfo: friend,
        headline: str(w.headline, `A note from ${friend.name}`),
        photo: str(w.photo).trim(),
        photoCaption: str(w.photoCaption),
        video: v,
        videoNote: str(w.videoNote),
        paragraphs,
        words: paragraphs.join(' ').split(/\s+/).filter(Boolean).length,
        soon: !paragraphs.length && !v,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.friendInfo.order - b.friendInfo.order || a.friendInfo.name.localeCompare(b.friendInfo.name));
}

// open.spotify.com/track/ID?si=.. -> spotify:track:ID
export function spotifyUri(s) {
  s = str(s).trim();
  if (!s) return '';
  if (/^spotify:(track|episode):[A-Za-z0-9]+$/.test(s)) return s;
  const m = s.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|episode)\/([A-Za-z0-9]+)/);
  return m ? `spotify:${m[1]}:${m[2]}` : '';
}

// open.spotify.com/playlist/ID?si=.. -> spotify:playlist:ID (used when no song has its own link)
export function playlistUri(s) {
  const m = str(s).match(/(?:open\.spotify\.com\/(?:intl-[a-z]+\/)?playlist\/|spotify:playlist:)([A-Za-z0-9]+)/);
  return m ? `spotify:playlist:${m[1]}` : '';
}

export function validateSongs(raw, warn, friends) {
  const friendsById = byId(friends);
  let items = list(raw).filter(s => {
    if (!isObj(s) || !str(s.title).trim()) {
      warn('songs.json: a song with no title was skipped');
      return false;
    }
    return true;
  });
  items = ensureIds(items, 'songs', warn, ['title']);
  const half = Math.ceil(items.length / 2);
  return items.map((s, i) => {
    const uri = spotifyUri(s.spotify);
    if (str(s.spotify) && !uri) warn(`songs.json: "${s.title}" has a Spotify link that is not a track link`);
    const friend = friendsById[s.pickedBy];
    return {
      ...s,
      title: str(s.title).trim(),
      artist: str(s.artist),
      uri,
      pickedByName: friend ? friend.name : str(s.pickedBy),
      reason: str(s.reason),
      side: s.side === 'A' || s.side === 'B' ? s.side : i < half ? 'A' : 'B',
    };
  });
}

export function validateJokes(raw, warn, friends) {
  const friendsById = byId(friends);
  let items = list(raw).filter(j => {
    if (!isObj(j) || !str(j.text).trim()) {
      warn('jokes.json: a joke with no text was skipped');
      return false;
    }
    return true;
  });
  items = ensureIds(items, 'jokes', warn, ['text']);
  return items.map(j => {
    const friend = friendsById[j.submittedBy];
    return { ...j, text: str(j.text).trim(), lore: str(j.lore), submittedBy: str(j.submittedBy), submittedByName: friend ? friend.name : str(j.submittedBy) };
  });
}

export function validateConnections(raw, warn) {
  let puzzles = list(raw).filter(isObj);
  puzzles = ensureIds(puzzles, 'connections', warn, ['name']);
  return puzzles.filter(p => {
    const groups = list(p.groups);
    const words = groups.flatMap(g => list(g && g.words).map(w => str(w).trim().toUpperCase()));
    const ok = groups.length === 4 && groups.every(g => isObj(g) && list(g.words).length === 4) && new Set(words).size === 16;
    if (!ok) warn(`connections.json: puzzle "${p.id}" needs 4 groups of 4 different words, skipped`);
    return ok;
  }).map(p => ({
    ...p,
    groups: p.groups.map((g, i) => {
      const level = [1, 2, 3, 4].includes(g.level) ? g.level : i + 1;
      return { ...g, name: str(g.name), level, colour: CONNECTION_COLOURS[level], words: g.words.map(w => str(w).trim().toUpperCase()) };
    }).sort((a, b) => a.level - b.level),
  }));
}

export function validateWordle(raw, warn) {
  const w = isObj(raw) ? raw : {};
  const words = list(w.words).filter(x => {
    const ok = isObj(x) && /^[A-Za-z]{4,7}$/.test(str(x.word).trim());
    if (!ok) warn('wordle.json: an entry needs a word of 4 to 7 letters, skipped');
    return ok;
  }).map(x => ({ ...x, date: str(x.date), word: str(x.word).trim().toUpperCase(), note: str(x.note) }));
  return { ...w, strictWordList: w.strictWordList !== false, hint: str(w.hint), words };
}

export function validateCryptic(raw, warn) {
  return list(raw).filter(c => {
    const ok = isObj(c) && str(c.clue).trim() && /[A-Za-z]/.test(str(c.answer)) && /^\d{4}-\d{2}-\d{2}$/.test(str(c.date));
    if (!ok) warn('cryptic.json: a clue needs a date (YYYY-MM-DD), a clue and an answer, skipped');
    return ok;
  }).map(c => {
    const answer = str(c.answer).toUpperCase().replace(/[^A-Z]/g, '');
    const def = str(c.definition);
    if (def && !str(c.clue).includes(def)) warn(`cryptic.json: the definition "${def}" is not inside the clue for ${c.date}`);
    // a hint is plain text, or { title, text } with its own title, or { title, letters: true }:
    // a hint that shows one more letter of the answer each time it is tapped
    let hints = list(c.hints).map(h => (isObj(h) ? { title: str(h.title), text: str(h.text), letters: h.letters === true } : { title: '', text: str(h), letters: false }));
    if (!hints.some(h => h.title || h.letters)) {
      while (hints.length < 3) hints.push({ title: '', text: '', letters: false });
      hints = hints.slice(0, 3);
    }
    // word breaks come from spaces in the answer: "BIO LAB" -> a gap after the third box
    const breaks = [];
    str(c.answer).toUpperCase().replace(/[^A-Z ]/g, '').trim().split(/\s+/).reduce((n, w) => { breaks.push(n + w.length); return n + w.length; }, 0);
    breaks.pop();
    const par = Number.isFinite(Number(c.par)) && Number(c.par) > 0 ? Number(c.par) : null;
    // optional: `highlight` (shown with hint 2) and `hidden` (lit up once solved) are parts of the clue
    return { ...c, answer, breaks, par, definition: def, hints, wordplay: str(c.wordplay), explanation: str(c.explanation), highlight: str(c.highlight), hidden: str(c.hidden) };
  }).sort((a, b) => a.date.localeCompare(b.date));
}

export function validateWorld(raw) {
  const w = isObj(raw) ? raw : {};
  return { ...w, embedUrl: str(w.embedUrl).trim(), items: list(w.items).filter(isObj).map(i => ({ ...i, label: str(i.label) })) };
}

export function validateStickers(raw, warn) {
  const r = isObj(raw) ? raw : {};
  let sheet = list(r.sheet).filter(s => {
    const ok = isObj(s) && (str(s.file) || s.drawn);
    if (!ok) warn('stickers.json: a sticker needs a "file" (a PNG in public/media/stickers), skipped');
    return ok;
  });
  sheet = ensureIds(sheet, 'stickers', warn, ['file', 'label']).map(s => ({ ...s, group: Number.isFinite(s.group) ? s.group : 1, label: str(s.label, s.id) }));
  const known = new Set(sheet.map(s => s.id));
  const pages = {};
  for (const [pageId, p] of Object.entries(isObj(r.pages) ? r.pages : {})) {
    if (!isObj(p)) continue;
    pages[pageId] = {
      ...p,
      fixed: list(p.fixed).filter(f => {
        const ok = isObj(f) && known.has(f.sticker);
        if (!ok) warn(`stickers.json: page "${pageId}" uses unknown sticker "${f && f.sticker}", skipped`);
        return ok;
      }),
    };
  }
  return { sheet, pages };
}

// Runs every validator. `raw` holds the parsed files; returns { content, warnings }.
export function validateAll(raw) {
  const warnings = [];
  const warn = msg => warnings.push(msg);
  const friends = validateFriends(raw.friends, warn);
  const content = {
    site: validateSite(raw.site, warn),
    friends,
    timeline: validateTimeline(raw.timeline, warn, friends, raw.generated || {}),
    darkroom: validateDarkroom(raw.darkroom, warn, raw.generated || {}),
    wishes: validateWishes(raw.wishes, warn, friends, raw.wishMarkdown || {}),
    songs: validateSongs(raw.songs, warn, friends),
    jokes: validateJokes(raw.jokes, warn, friends),
    connections: validateConnections(raw.connections, warn),
    wordle: validateWordle(raw.wordle, warn),
    cryptic: validateCryptic(raw.cryptic, warn),
    world: validateWorld(raw.world),
    stickers: validateStickers(raw.stickers, warn),
    ui: isObj(raw.ui) ? raw.ui : {},
  };
  return { content, warnings };
}
