# Build plan

Phases from the build brief (section 6). Ticked = built and checked in the browser (Chromium).

- [x] **0 · Inventory, setup and rules**: `handoff/DESIGN_MAP.md`, Vite + React project, `CLAUDE.md`, records, assets copied.
- [x] **1 · Design system and content layer**: tokens, fonts, 10 shared components ported, `#/dev/gallery`, every content file with the design's placeholders, validators + defaults, `npm run check`, `npm run images`.
- [x] **2 · App shell**: scaled 1440 × 900 stage, three desks cross-fading, spiral journal, divider tabs, page turn + riffle, hash navigation with back/forward, music-note cursor.
- [x] **3 · Music engine and mini player**: one Spotify controller, random first song, next/previous, auto-next on song end, sound on/off (pause), "tap to start the music" pulse, calm "music unavailable" state.
- [x] **4 · Opening and first-visit logic**: envelope → journal rises → birthday → confetti and stickers → settles; `neha.v1.opened`; returning visits skip it; `?reset-opening` in development; reduced-motion fades.
- [x] **5 · Sticker system, Cover and Contents**: drag (sticks where dropped), rotate (handle, Shift + wheel, sideways swipe, Safari gesture), resize (handle, S/M/L, slider), right-click menu, peel-off curl, duplicate, physics pile with sleeping, saved per page, reset; cover and contents as designed.
- [x] **6 · Timeline and era pages**: spread, year buttons, clusters, pull-out era page, five layouts with 10 designed slots + "more from this era", video tile, enlarge in place, switcher, Esc.
- [x] **7 · Darkroom**: black → red desk, ransom title, film strips, style index, seven sections, shake-to-develop (saved), loupe, parallax, enlarge, back to top.
- [x] **8 · Wishes**: envelope grid (4 × 3, 4 × 4, more pages), counter, opening animation, tinted newspaper letters with justified hyphenated columns, video wishes, previous/next, saved opened state, end line.
- [x] **9 · Playlist**: mixtape (art option A), liner notes with play-on-click, playing highlight, Spotify slot, save-to-Spotify link, cassette slide-out, turning reels.
- [x] **10 · Jokes, back pages and easter eggs**: felt board, gold pins, red thread, flip to origin story, filter by person; signed-by list, group photo, library card, replay link; name × 5, nickname rain, secret keys.
- [x] **11 · Games**: spread; Connections, Wordle (word list, repeated letters, saved per date), Daily cryptic (hints, check, reveal, explanation, 14-day streak, past clues), Neha's World slot.
- [x] **12 · Phone fallback, performance, accessibility, QA**: phone card + "open it here anyway"; sections lazy-loaded; lazy images; keyboard and Esc everywhere; reduced motion; Playwright checks. *Not possible here:* WebKit/Safari pass (no WebKit browser installed) and a Lighthouse run against the live URL.
- [ ] **13 · Real content intake**: waiting for the team's files in `inbox/`.
- [ ] **14 · Deploy and share**: `render.yaml` is ready; the students connect Render to GitHub (steps in `README.md`), then the final live checks.
