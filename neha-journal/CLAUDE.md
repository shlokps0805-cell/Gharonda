# CLAUDE.md: project rules for "NEHA, the birthday journal"

A birthday website for Neha: a spiral journal on a desk. Static site, **Vite + React 18 (plain JSX)**,
hosted on **Render** (see `render.yaml` at the repo root). The people running Claude Code here are
students with no coding experience: explain in plain words, do the technical work yourself.

Full brief: `handoff/BUILD_BRIEF.md`. Design export: `handoff/design/`. Final plan: `handoff/final-plan.md`.

## Order of authority (when sources disagree)
1. Locked decisions in the brief (sections 2 and 3) and its technical rules (4, 7, 8, 9).
2. `handoff/final-plan.md`.
3. The Claude Design files (`handoff/design/*.dc.html`): the visual source of truth.
4. The per-phase descriptions in the brief (section 6).
5. `handoff/briefs/` (background only).

Write one line in `DEVIATIONS.md` whenever you resolve a conflict or differ from the design.

## Locked decisions (summary)
- Colour tokens in `src/styles/tokens.css` are fixed. Blue, purple, white, black; cherry red only as a small pop.
- Desks: gingham photo (day), black→red (Darkroom), midnight→wine (Playlist). Cross-fade 400 ms.
- Fonts: Pinyon Script (name), Libre Caslon Text (headings), Caveat 600 / Kalam 400 (handwriting, ≥ 22 px),
  Courier Prime 700 (labels), DM Sans (body), Great Vibes at 84% height (envelope). No Instrument Serif.
- Stage: fixed 1440 × 900, scaled to the window (0.6–1.6). Journal 1180 × 756 at (88, 28). Silver spiral. Brown leather cover.
- Divider tabs: 64 × 96, `--tab-1`…`--tab-7`, gold clip on the active tab.
- Fasteners are gold and hold only paper and photos. **Stickers never get pins or tape.**
- Cursor: lavender dot + white ring, music-note trail every 34 px (off with reduced motion and on touch).
- Mini player 280 × 80 bottom-left, slides in from the left, random song each load.
- The opening's wax seal is `--wax-red`; wish seals are a deeper shade of each envelope (students' request, see DEVIATIONS.md).

**Retired, never build:** name gate, hidden joke, joke favourites, lightbox, crossword, stamps/stars as
status markers, selfies section and phone frames, light-table glow, any "skip intro" link, sparkle trail,
navy cover, cherry as a hero colour, pins/tape on stickers, magazine elements, the retired stickers
(navy disco ball, rats, mini collages, her-object placeholders, ticket stub, "for you" tag, torn lined
paper, other word stickers, other clear vinyl), navy-fabric desk, throwing stickers, re-dropping the pile
on every cover visit.

## How the code is organised
- `src/design/`: components ported from Claude Design. Each keeps the design's `renderVals()` logic and
  its markup as JSX in `template(v)`; `css('...')` turns the design's inline style strings into style objects.
  Change these only to feed real data, add real interaction, or fix browser problems.
- `src/components/`: app pieces (Stage, Desk, Tabs, PageTurn, CursorTrail, StickerLayer, PlayerDock...).
- `src/sections/`: one file (or folder) per section. `src/games/`: the four games.
- `src/music/`: the single Spotify controller and the music context.
- `src/content/`: `loadContent.js` + `validators.js` + `defaults.js`. **Components never import content files directly.**
- `src/lib/`: `storage.js` (prefix `neha.v1.`, safe), `dates.js` (`todayIST()`), `motion.js`, `hashRoute.js`.

## Code rules
- Readable first: clear names, small components, short comments that explain why.
- Data in, UI out. No content strings in components; fixed labels live in `content/ui-text.json`.
- Storage only through `src/lib/storage.js`. Dates only through `src/lib/dates.js` (IST).
- Every animation respects `usePrefersReducedMotion()` (200 ms fades instead).
- Clickable things are real `button`/`a`; Esc closes overlays; lavender focus rings.
- No console errors or warnings.

## Content
All content is in `content/` (JSON + Markdown) and `public/media/` (files). See `CONTENT_GUIDE.md`.
Never change an existing item's `id` (saved state is keyed by it). Never invent content: real content
arrives in `inbox/`; follow the intake process in the brief, section 9.

## Commands (run inside `neha-journal/`)
- `npm run dev`: local preview at http://localhost:5173 (add `?reset-opening` to see the opening again)
- `npm run check`: validate all content and media files
- `npm run images`: make optimized WebP photos (and list "photosFromFolder" photos)
- `npm run build`: production build into `dist/` (runs the content check first)
- `npm run test`: Playwright checks in Chromium
- `#/dev/gallery` (dev only): every design component in its states
