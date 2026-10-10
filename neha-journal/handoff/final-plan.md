# NEHA · The Birthday Journal — final plan for the build

This lists every place where the agreed design **differs from the original briefs** (Phase 1 v3 follow-up brief and the Phase 2-onwards brief). Where this file and a brief disagree, **this file wins**. Design files are the visual source of truth; everything not listed here follows the briefs as written.

Files: `Phase 1 v2 - Journal Foundations` · `Phase 2 - Opening` · `Phase 3 - Cover` · `Phase 4 - Timeline` · `Phase 5 - Darkroom` · `Phase 6 - Wishes and Playlist` · `Phase 7a - Jokes and Extras` · `Phase 7b - Games`. Shared components: `Sticker`, `StickerPhysics`, `SpiralJournal`, `DividerTab`, `Fastener`, `PhotoFrame`, `Envelope`, `WaxSeal`, `MiniPlayer`, `RansomWord`.

---

## Final audit (all phases)

| Phase | Spec | Craft | Cohesion | Open items |
|---|---|---|---|---|
| 1 Foundations | 5 | 4 | 4 | — |
| 2 Opening | 5 | 4 | 4 | — |
| 3 Cover | 5 | 4 | 4 | Sticker-menu frame label fixed 4×; last fix out for review |
| 4 Timeline | 5 | 4 | 4 | — |
| 5 Darkroom | 5 | 4 | 4 | — |
| 6 Wishes + Playlist | 5 | 4 | 4 | — |
| 7a Jokes + Back pages | 5 | 4 | 4 | — |
| 7b Games | 5 | 4 | 4 | — |
| 8 Mobile + handoff sheet | 0 | — | — | **Not built** (brief Phase 8) |

Checked after all comment rounds (automated scan of every phase file against the frame list): Phase 1 12/12 boards · Phase 2 6/6 · Phase 3 5/5 · Phase 4 9/9 · Phase 5 3/3 · Phase 6 11/11 · Phase 7a 4/4 · Phase 7b 13/13 frames/states; every imported component exists; every sticker referenced exists in the sheet. All 38 components present; every phase file renders its frames; no lightbox, name gate, hidden joke, favourites, phone frames, navy disco or her-object placeholders remain in any phase file. Placeholder names/colours/nicknames still to come from the team’s file.

---

## 1. Global system

**Colour**
- Palette is **blue + purple + white + black**, red only as a small pop (< 10%). Sampled from the user’s gingham background and stickers.
- Key tokens: ink `#130F1F`, paper `#FFFFFF`, cream `#F7F1E6`, powder `#CED9E4`, dusty blue `#ACBFD3`, navy `#204670`, lilac `#DCCBF3`, soft purple `#C4A8E6`, lavender `#A57BD5`, violet `#5E3695`, deep violet `#320F6F`, dusty rose `#DEC0C4`, cherry `#BA2F1F`, wax red `#9E2A2B`, secondary text `#3D4A66`.
- **Day desk** (Cover, Timeline, Wishes, Jokes, Games, opening): the user’s gingham image, cover-fit, 12–30% white veil + soft navy vignette + 4% film grain. Never repainted.
- **Darkroom desk**: black at the top → deep red at the bottom: `linear-gradient(180deg,#0B0910,#1E0E14 45%,#4A141C 78%,#6E1A24)`.
- **Playlist desk**: midnight → wine `linear-gradient(160deg,#141E33,#24203A 50%,#3E1E2E)` (approved, keep as is).
- Navy-fabric desk option was dropped.

**Type** (replaces brief fonts)
- Her name: **Pinyon Script** (cover 150–170px).
- Headings: **Libre Caslon Text** (h1 48, h2 31 italic, h3 20). Replaced Instrument Serif; sizes are ~85% of the brief because Caslon runs wider.
- Handwriting: **Caveat** 600 (friend A) and **Kalam** 400 (friend B), never below 22px.
- Labels/tabs/buttons: **Courier Prime** 700, caps, +0.12em.
- Body: **DM Sans** 18/1.6.
- Envelope “For Neha”: **Great Vibes** squished to 84% height (alternatives wired as a tweak: Alex Brush, Parisienne, Mrs Saint Delafield).
- Ransom headings (“the darkroom”, “the joke archive”): only blues, purples, whites, one black letter. **No red.**

**Journal**
- Size **1180 × 756** at (88, 28) on the 1440 × 900 frame (kept from Phase 1 v2; brief said 1200 × 800). Leaves the player zone clear.
- Paper: **plain white with lines** by default; grid for Timeline/Games; dark for Darkroom; tinted per friend on wishes; lavender felt for Jokes.
- Spiral coil: **silver** everywhere (brief offered purple).
- Cover: **brown leather** (`#6B4A33` + leather texture), not navy. The small journal that rises from the envelope is the same brown book.

**Divider tabs**
- 64 × 96 in a 72px right-edge zone, colour-graded **light purple (top) → dark purple (bottom)**: `#ECE3F8, #DCCBF3, #C9B2EA, #B092DD, #8A63BC, #6A43A0, #4A2880`. Ink text on the light four, white on the dark three. Active tab gets a gold clip.

**Fasteners**
- All pins, binder clips, paper clips, clothespins and photo corners are **realistic gold**.
- Fasteners only hold **paper and photos**. **Stickers never get pins or tape.**

**Cursor**
- 8px lavender dot + 28px white ring. **Music-note trail** (♪ ♫ ♩ ♬) every 34px, floats up 46px, fades 900ms, on **every page** (brief said sparkles). Off for reduced motion.

**Mini player**
- 280 × 80, bottom-left, **slides in from the left edge** (not from below).
- Starts on a **random song** from the playlist each page load.

**Envelope + seals**
- Envelope colour: **off-white cream** `#F4EDE0` (not lilac).
- **All wax seals are the same red** `#9E2A2B`, including the Wishes envelopes (brief: seal = darker friend colour).
- Postage stamp is back on the opening envelope; its picture is lavender/purple.

---

## 2. Stickers

- Source stickers: user’s images, **background removed only**, never redrawn or restyled. New white die-cut edges were added only where none existed. One manual repair: the left dancer’s black skirt in “the two of them”.
- **Removed**: navy disco ball, both rats, all mini collages, her-object placeholders, ticket stub, “for you” tag, torn lined paper, all word stickers except the three below, all clear-vinyl except the date stamp, phone frames.
- **Words kept**: “happy birthday” as a **violet ribbon** (text sized to sit inside it), “core memory” ticket, “iconic” as a **holo rosette**.
- Clear vinyl kept: **date stamp** (no inner black border, navy text “RECEIVED / 11.10.26 / WITH LOVE”).
- Washi ×5 and postage stamp kept as paper pieces.
- Kept from v1: only the **8-ball**.
- Sheet is open-ended: more user stickers will be added to group 1.

**Behaviour (everywhere, not only the cover)**
- Drag any sticker; it **stays exactly where dropped** (sticks; no pin). Works for fixed page stickers and physics stickers.
- Physics stickers come to rest and **sleep** — no jitter.
- **Rotate**: round turn handle at the sticker’s bottom-right on hover (drag around; Shift snaps 15°), **two-finger rotate** on trackpads (Safari gesture events), sideways two-finger swipe or Shift + scroll.
- **Resize**: S 76 / M 124 / L 200 presets **plus free size 40–320** (slider and corner handle).
- Right-click menu: **Stick here · Let it fall · Duplicate · Bring to front · Size (S/M/L + slider) · Angle slider (−180° to 180°) · Peel off (delete)**.
- **Peel-off follows the sticker’s own outline** (3D curl from one corner, white back in the sticker’s shape) — not a square curl.
- Physics: all 40 approved stickers fall when the cover/opening frame enters view; they overlap, bounce (restitution .35) and settle along the bottom. On the cover they fall at 72% size and rest below the journal, never over the player.

---

## 3. Per phase

**Phase 1 (Foundations)** — locked as above: journal size, white lined paper, silver coil, gold fasteners, purple-gradient tabs, cream envelope, chosen fonts, grid paper for games, buttons (navy primary, violet night primary, navy outline secondary).

**Phase 2 (Opening)**
- **No name gate.** The “Who is this for?” input, wrong-answer replies and nickname matching are removed. The seal pulses from the start with “tap the seal” + drawn arrow.
- Steps are now **1 Envelope · 2 Journal rises · 3 Birthday · 4 Confetti → stickers · 5 Journal settles**, plus a reduced-motion strip.
- Envelope shown at **1.4× (784 × 504)** so it leads the desk; 13 desk stickers around it, 3 stuck on its corners.
- A small **brown** journal rises out (not a letter or navy book), grows into “Happy Birthday, Neha” in gold, then becomes the brown cover.
- **Returning visits skip the opening entirely.** After the first full opening, the site remembers it (local storage flag, e.g. `neha.opened = true`). On every later visit it loads straight to the **Cover (Phase 3, 02-Cover/Default)** in its settled state: desk, brown cover, tabs out, player in, stickers exactly where she left them (positions, sizes, angles and stuck state saved per sticker). No envelope, seal, confetti or birthday moment, and no “skip” link. The opening can be replayed only from a small “replay the opening” link in the back pages. Reduced-motion and first-visit behaviour are unchanged.

**Phase 3 (Cover + Contents)**
- **No hidden joke** (no folded note on the cover, no “today’s joke is hiding” line).
- Cover: hero photo 520 × 650 in gold corners, Pinyon name, clipped note, fixed stickers + physics pile, “open the journal →”, “reset stickers”.
- Contents spread: plain white inside-cover left, lined right; six handwritten links with sticker doodles and page numbers.

**Phase 4 (Timeline)**
- **No lightbox.** Clicking a year button or any photo opens a **pull-out era page** (punched holes, no divider tab) that scrolls inside the page.
- Five structurally different layouts: Scrapbook, Polaroid scatter, Feature grid, Photobooth wall, Pinboard (gold pins + dusty-rose string). 8–10 photos each, one video tile, enlarge-in-place 1.5×, era switcher + back/Esc.

**Phase 5 (Darkroom)**
- Black → red desk.
- **Selfies section and all phone frames removed.** Seven sections: on film, photobooth chaos, give it a shake, flash on, the outtakes (contact sheet + loupe), slideshow, cover girl material.
- **Light-table glow behind the slideshow removed.**
- **Give it a shake** is interactive: drag/shake a polaroid back and forth and it develops (darkness + blur clear with motion).

**Phase 6 (Wishes + Playlist)**
- Wishes grid stays on **one wide lined page** (4 × 3 envelopes of 200 × 130 don’t fit half a spread).
- Full wish: newspaper clipping, **two justified columns** (~42 characters per line, under the brief’s 60–75; the torn-paper style meets 60–75 if preferred). Page tinted by writer colour.
- Playlist: **approved look, keep as is** (cassette case, liner notes, Spotify slot, art option A).

**Phase 7a (Jokes + back pages)**
- **No hidden joke** and **no favourites** (hearts, favourites chip and empty state removed).
- Every joke note has a **gold pin**, and a **red thread runs pin to pin** across the board.
- Back pages: signed-by list, group photo, library card (“due back: never”).

**Phase 7b (Games)**
- Four games: **Connections, Wordle, Daily cryptic, Neha’s World** (crossword replaced by Wordle).
- Connections and Wordle use their **original game colours** (yellow/green/blue/purple; green/yellow/grey); everything around them is the journal.
- Daily cryptic fully designed: clue card, letter boxes, Check/Reveal, three fold-out hints, explanation on solve, 14-day streak.
- Game cards are **250 × 420** (four 320px cards don’t fit one page).
- No stamps or stars on games.

---

## 4. Still to do
- Phase 8: mobile versions, whole-journal audit sheet, handoff spec sheet.
- Real content: names, friend colours, nicknames, photos, songs, jokes, wishes (all placeholders marked SAMPLE / Friend N).
- Trackpad rotate needs a test on a real Mac (two-finger rotate may be Safari-only).
