# Claude Code build brief: "NEHA, the birthday journal"

## 0. Read this first

### 0.1 Who you are working with
You are building a birthday website for a girl named Neha, from designs already finished in Claude Design. The people running you are **two students with no coding experience**. That means:

- **Explain in plain words.** What you did, what to check, and how to see it.
- **Do the technical work yourself.** Run commands, install packages, fix errors and test. Never hand them a command to run unless they truly must do it themselves (for example, logging into a hosting account), and even then give exact click-by-click steps.
- **Prefer simple, readable code over clever code.** A future Claude Code session, or a curious friend, should be able to open any file and understand it.

### 0.2 What you are building
- A **static website** (no server, no database), built with **Vite + React (JavaScript)**.
- It will be hosted publicly on a free host (Vercel or Netlify) and shared as a link.
- It runs **best in Chrome on a laptop**, and must also work in Safari, which is Neha's browser.
- **All content lives in data files**, separate from the code. Adding a photo, a wish, a joke or a song later must mean editing a data file or dropping in a file. It must never mean editing components.
- Launch target: **midnight IST, 11 October 2026**.

### 0.3 The files you are given

| Location | What it is |
|---|---|
| `handoff/design/` | **The design export from Claude Design.** Phase files: `Phase 1 v2 - Journal Foundations`, `Phase 2 - Opening`, `Phase 3 - Cover`, `Phase 4 - Timeline`, `Phase 5 - Darkroom`, `Phase 6 - Wishes and Playlist`, `Phase 7a - Jokes and Extras`, `Phase 7b - Games`. Shared components: `Sticker`, `StickerPhysics`, `SpiralJournal`, `DividerTab`, `Fastener`, `PhotoFrame`, `Envelope`, `WaxSeal`, `MiniPlayer`, `RansomWord`. |
| `handoff/final-plan.md` | **The final design plan.** Lists every place the agreed design differs from the briefs. |
| `handoff/briefs/` | The Claude Design briefs (Phase 1 follow-up, Phase 2 onwards). Background detail only. |
| `handoff/assets/` | The gingham desk image, sticker images (background already removed) and any other art. |
| `inbox/` | **Raw content from the team**, dropped in at any time: spreadsheets, CSV exports from Google Forms, Word documents, text files, photos, videos. Section 9 explains how to sort it. |

If any of these are missing or named differently, find the closest match, tell me what you found, and carry on.

### 0.4 Order of authority (when sources disagree)
1. **The locked decisions in sections 2 and 3 of this brief** (taken from the final plan), and the technical rules in sections 4, 7, 8 and 9.
2. **`handoff/final-plan.md`.**
3. **The Claude Design files.** These are the visual source of truth for every screen: layout, sizes, colours, fonts, which elements exist, and their states and timings.
4. **The per-phase descriptions in section 6 of this brief.** These describe behaviour and were partly written from the older briefs.
   - If a phase description mentions a **visual element** that has no frame in the design files (for example a label, a decoration or an extra page), do not invent its look. Build it only if it is needed for the feature to work, style it with existing design components, and note it in `DEVIATIONS.md`.
   - If the design shows something this brief does not mention, build what the design shows.
5. `handoff/briefs/` (Phase 2 onwards, then Phase 1). Background only.

When you resolve a conflict, write one line about it in `DEVIATIONS.md` (section 4.4).

### 0.5 How you work
1. **Build in the phases in section 6, one at a time.** At the end of each phase:
   - run that phase's checks
   - commit to git
   - give me the short phase report (section 6.0)
   - **stop and wait** for my reply

   If I write "continue through phase X", run several phases back to back, still checking and committing each one.
2. **Port the design code; do not redesign.** Reuse the Claude Design components and styles as directly as possible (section 5).
3. **Keep the app working at the end of every phase.** No phase may leave the site broken.
4. **Never invent content.** Use the sample or placeholder content from the design files until real content arrives through `inbox/`.
5. **Ask only when truly blocked.** Otherwise make the sensible choice, note it in the phase report and `DEVIATIONS.md`, and keep going.
6. **Test in a real browser.** Use Playwright with the preinstalled Chromium to load pages, click through flows, take screenshots at 1440 × 900 and compare them with the design frames. Do a WebKit (Safari engine) pass in the QA phase if WebKit is available.

---

## 1. The project in one page

A spiral-bound journal lying on a desk, filled with photos, notes and stickers from Neha's friends.

1. **First visit:**
   1. A cream envelope sits on a gingham desk, with a red wax seal pulsing and "tap the seal".
   2. She clicks the seal. Music starts.
   3. A small brown journal rises out and grows into "Happy Birthday, Neha" in gold.
   4. Confetti bursts and the stickers fall and settle.
   5. The journal settles onto the desk as the brown leather cover, with tabs and player sliding in.
2. **Returning visits:** go straight to the Cover in its settled state. Stickers are exactly where she left them. No envelope, no birthday moment, no skip link.
3. **Seven sections**, reached by the purple divider tabs on the right:
   - **Cover:** with a contents spread inside.
   - **Timeline:** five eras; pull-out era pages in five different collage layouts.
   - **Darkroom:** a long photo wall in seven photo styles, on a black-to-red desk.
   - **Wishes:** 12 envelopes, each opening a full newspaper-style letter tinted in the writer's colour.
   - **Playlist:** a mixtape with liner notes and a Spotify player, on a midnight-to-wine desk.
   - **Jokes:** a felt board of pinned joke notes joined by red thread; plus the back pages.
   - **Games:** Connections, Wordle, Daily cryptic and a slot for "Neha's World" (a platformer made elsewhere).
4. **Always present:**
   - the music-note cursor trail
   - the mini mixtape player (bottom-left)
   - stickers she can drag, rotate, resize, stick, drop, duplicate and peel off, on every page

---

## 2. Locked decisions (follow exactly; these override the briefs)

These come from the final plan and the design review comments. **Do not undo, "improve" or reinterpret them.**

### 2.1 Colour tokens
Use exactly these as CSS variables in `src/styles/tokens.css`. Keep any additional tokens from the Phase 1 v2 design file, but never change these values.

```css
:root {
  --ink: #130F1F;
  --paper: #FFFFFF;
  --cream: #F7F1E6;
  --powder: #CED9E4;
  --dusty-blue: #ACBFD3;
  --navy: #204670;
  --lilac: #DCCBF3;
  --soft-purple: #C4A8E6;
  --lavender: #A57BD5;
  --violet: #5E3695;
  --deep-violet: #320F6F;
  --dusty-rose: #DEC0C4;
  --cherry: #BA2F1F;          /* small pops only, under 10% of a screen */
  --wax-red: #9E2A2B;         /* every wax seal on the site */
  --text-secondary: #3D4A66;
  --envelope-cream: #F4EDE0;  /* the opening envelope */
  --leather: #6B4A33;         /* the journal cover */
  /* divider tabs, light (top) to dark (bottom) */
  --tab-1: #ECE3F8; --tab-2: #DCCBF3; --tab-3: #C9B2EA; --tab-4: #B092DD;
  --tab-5: #8A63BC; --tab-6: #6A43A0; --tab-7: #4A2880;
}
```

- **Overall palette:** blue, purple, white and black, with red only as a small pop.
- **Games exception:** Connections uses its original yellow, green, blue and purple groups with grey tiles. Wordle uses its original green, yellow and grey. Take the exact values from the Phase 7b design file.

### 2.2 Desks (backgrounds)

| Desk | Used on | How it is made |
|---|---|---|
| **Day desk** | Opening, Cover, Timeline, Wishes, Jokes, back pages, Games | The user's gingham image, `background-size: cover`, never repainted. On top: a white veil of 12 to 30% (take the exact value from the design), a soft navy vignette, and 4% film grain. |
| **Darkroom desk** | Darkroom only | `linear-gradient(180deg, #0B0910, #1E0E14 45%, #4A141C 78%, #6E1A24)` |
| **Playlist desk** | Playlist only | `linear-gradient(160deg, #141E33, #24203A 50%, #3E1E2E)` |

When she changes section, the desk cross-fades (about 400 ms) at the same time as the page turn.

### 2.3 Typography
Load from Google Fonts, with `display=swap` and `preconnect`:

| Role | Font | Details |
|---|---|---|
| Her name | **Pinyon Script** | 150 to 170 px on the cover |
| Headings | **Libre Caslon Text** | h1 48 px, h2 31 px italic, h3 20 px |
| Handwriting (friend style A) | **Caveat** 600 | never below 22 px |
| Handwriting (friend style B) | **Kalam** 400 | never below 22 px |
| Labels, tabs, buttons | **Courier Prime** 700 | capitals, letter spacing +0.12em |
| Body | **DM Sans** | 18 px, line height 1.6 |
| "For Neha" on the envelope | **Great Vibes** | squashed to 84% height (`transform: scaleY(0.84)`) |

- Keep the alternative envelope fonts (Alex Brush, Parisienne, Mrs Saint Delafield) as a single setting in `content/site.json` (`envelopeFont`), defaulting to Great Vibes.
- **Ransom headings** ("the darkroom", "the joke archive") use only blues, purples and whites, with one black letter. **No red.**
- **Instrument Serif was replaced by Libre Caslon Text.** If any exported design file still loads or references Instrument Serif (or any other font not in this table), switch it to the matching font here and remove the old font link.

### 2.4 The stage and the journal
- Every screen is designed on a **1440 × 900 stage**. Build it as a fixed-size 1440 × 900 element, scaled with CSS `transform: scale()` to fit the browser window and centred (letterboxing filled by the desk).
  - This is the simplest way to match the designs exactly.
  - Scale = `min(windowWidth / 1440, windowHeight / 900)`, capped between 0.6 and 1.6.
  - The desk background fills the whole window, outside the stage too.
- **Journal:** 1180 × 756 at position (88, 28) on the stage.
- **Spiral:** silver.
- **Paper types:**
  - plain white with lines (default)
  - grid (Timeline and Games)
  - dark (Darkroom)
  - tinted per friend (wishes)
  - lavender felt (Jokes)
- **Cover:** brown leather (`--leather` plus the leather texture from the design). The small journal that rises from the envelope is the same brown book.

### 2.5 Divider tabs
- 64 × 96 px in a 72 px zone on the right edge.
- Colours `--tab-1` to `--tab-7`, top to bottom: COVER, TIMELINE, DARKROOM, WISHES, PLAYLIST, JOKES, GAMES.
- Ink text on the first four, white text on the last three.
- **States:** hover slides out 6 px; active slides out a further 12 px and gets a **gold clip**.
- **Keyboard:** tabs are focusable buttons, and Enter opens them.

### 2.6 Fasteners
- All pins, binder clips, paper clips, clothespins and photo corners are **realistic gold** (use the design's `Fastener` component).
- Fasteners hold **only paper and photos**. **Stickers never get pins or tape.**

### 2.7 Cursor: music notes
- **The cursor:** an 8 px lavender dot with a 28 px white ring follows the mouse. Hide the system cursor with `cursor: none` on the stage, but keep the normal cursor over text inputs and the Spotify iframe.
- **The trail:** a **music-note trail** of ♪ ♫ ♩ ♬, cycling, is created every **34 px** of mouse movement. Each note floats up **46 px** and fades out over **900 ms**, on **every page**.
  - Notes are small (14 to 18 px) in lavender and white, with a slight random tilt (±12°).
  - **Implementation:** one absolutely positioned container. Each note is a `span` animated with the Web Animations API and removed when its animation finishes. Never more than about 24 notes at once.
- **Turned off** when reduced motion is on, and on touch devices (`(hover: none)`), where the normal cursor is used.
- **Hover state:** over clickable things, use the cursor hover state shown in the design file, if there is one. If the design shows none, keep the dot and ring unchanged.
- There is no sparkle trail.
- **If the exported design code already contains a working cursor or music-note trail, port it** (section 5.4) instead of writing a new one.

### 2.8 Mini player
- 280 × 80 px, bottom-left.
- **Slides in from the left edge** when the journal settles (and on every load for returning visits).
- **Starts on a random song** from the playlist on every page load.
- Full behaviour in section 7.

### 2.9 Envelope and seals
- The opening envelope is **off-white cream** (`--envelope-cream`), with a **postage stamp** whose picture is lavender and purple.
- **Every wax seal on the site is `--wax-red`**, including the Wishes envelopes.
- The envelope front shows "For Neha" (Great Vibes) and a "by ____" line, filled from `content/site.json` (`fromLine`).

### 2.10 Retired features: never build these
- the name or nickname gate, wrong-answer replies, the "Who is this for?" input
- the hidden joke (folded note) and the "today's joke is hiding" line
- joke favourites (hearts, favourites chip, empty state)
- the lightbox
- the crossword (replaced by Wordle)
- stamps and stars on games or anywhere as status markers
- the selfies section and all phone frames
- the light-table glow behind the slideshow
- any "skip intro" or "skip to the journal" link
- the sparkle cursor trail
- a navy journal cover
- cherry as a hero colour
- pins or tape on stickers
- magazine elements (masthead, barcode, cover lines)
- these stickers:
  - the navy disco ball
  - both rats
  - all mini collages
  - her-object placeholders
  - the plain ticket-stub paper piece (the "core memory" ticket word sticker is kept)
  - the "for you" tag
  - torn lined paper
  - every word sticker except "happy birthday", "core memory" and "iconic"
  - every clear-vinyl sticker except the date stamp
- the navy-fabric desk option
- Instrument Serif
- throwing stickers so they fly and keep bouncing after a drag (a dragged sticker stays where it is dropped)
- re-dropping the physics sticker pile every time the cover is opened (section 3.8)

---

## 3. Feature decisions per section (from the final plan)

### 3.1 Opening (Phase 2 design)
- **Steps:**
  1. Envelope
  2. Journal rises
  3. Birthday
  4. Confetti turns into stickers
  5. Journal settles

  There is also a reduced-motion version.
- **No name gate.** The seal pulses from the start, with "tap the seal" and a drawn arrow.
- **Envelope:** shown at 1.4× (784 × 504 on the stage), with 13 desk stickers around it and 3 stuck on its corners.
- **Clicking the seal:**
  1. Starts the music (section 7).
  2. Cracks the seal and opens the flap.
  3. A small brown journal rises out.
  4. The journal grows into "Happy Birthday, Neha" in gold.
  5. Confetti bursts.
  6. All approved stickers fall with physics and settle.
  7. The journal settles and becomes the brown cover; the tabs and player slide in.
- **First full opening done:** set `localStorage` key `neha.v1.opened = "true"`.
- **Every later visit:** load straight into the **Cover** in its settled state: desk, brown cover, tabs out, player sliding in, and every sticker exactly where she left it (position, size, angle, stuck state). No envelope, seal, confetti or birthday moment, and no skip link.
- **The opening is a state, not a page.** There is no `#/opening` URL, so a bookmarked or shared link can never replay it by accident.
  - On load: if `neha.v1.opened` is not set, play the opening.
  - Otherwise, open the section in the URL hash. If there is none, open the Cover.
  - In practice, opening the link fresh lands on the Cover, while a reload keeps her on the section she was on.
  - Write this reload behaviour in `DEVIATIONS.md` as a small, deliberate clarification of "returning visits load the Cover".
- **Replay:** only from a small "replay the opening" link in the back pages. It plays the opening and then returns to the cover with her saved stickers untouched.
- **Reduced motion:** the same steps as quick fades.

### 3.2 Cover and contents (Phase 3 design)
- **There is no hidden joke.**
- **The cover:**
  - the hero photo, 520 × 650, in gold photo corners
  - her name in Pinyon Script
  - a clipped note
  - fixed stickers and the physics sticker pile
  - "open the journal →"
  - "reset stickers"
- **Contents spread:**
  - left page: plain white inside cover
  - right page: lined, with six handwritten links (sticker doodles and page numbers) that turn to each section

### 3.3 Timeline (Phase 4 design)
- **No lightbox.** Clicking a year button or any photo opens a **pull-out era page** (punched holes, no divider tab) that scrolls inside itself.
- **Five layouts**, each structurally different: Scrapbook, Polaroid scatter, Feature grid, Photobooth wall, Pinboard (gold pins and dusty-rose string).
- **Each era page has:**
  - 8 to 10 photos and one video tile
  - click to enlarge in place (1.5×), click again or Esc to return
  - an era switcher
  - Back and Esc to close

### 3.4 Darkroom (Phase 5 design)
- Uses the black-to-red desk.
- **Seven sections:** on film, photobooth chaos, give it a shake, flash on, the outtakes (contact sheet with a loupe), slideshow, cover girl material.
  - **No selfies section, no phone frames, no light-table glow.**
- **"Give it a shake" is interactive:**
  - She drags or shakes a polaroid back and forth, and it develops: darkness and blur clear as she moves it.
  - Track total drag distance; development goes from 0 to 1 over about 1200 px of movement.
  - The polaroid stays developed afterwards, and that is saved.

### 3.5 Wishes and Playlist (Phase 6 design)
**Wishes**
- The grid sits on **one wide lined page**: 4 × 3 envelopes at 200 × 130.
- **An opened wish:**
  - a newspaper clipping in **two justified columns** (about 42 characters per line, with hyphenation)
  - the page tinted in the writer's colour
  - previous, next and back controls
- Opened envelopes stay opened (saved).

**Playlist**
- **Keep the approved look exactly:** cassette case, liner notes, Spotify slot, art option A.

### 3.6 Jokes and back pages (Phase 7a design)
- **No hidden joke and no favourites.**
- **Joke notes:** every note has a **gold pin**, and a **red thread runs from pin to pin** across the board. Draw the thread with one SVG path layer, recalculated from the pin positions whenever jokes change.
- **Back pages:**
  - the signed-by list
  - the group photo
  - the library card ("due back: never")
  - the small "replay the opening" link
- **How she reaches the back pages:** use whatever navigation the Phase 7a design shows. If the design shows none, add a small handwritten link "the back pages →" at the bottom of the contents page (using existing design styles) and on the last page of Jokes, and note it in `DEVIATIONS.md`. The back pages have no divider tab.

### 3.7 Games (Phase 7b design)
- **Four games:** Connections, Wordle, Daily cryptic and Neha's World.
- **Game cards:** 250 × 420, with no stamps or stars.
- **Original colours** for Connections and Wordle; everything around them is the journal.
- **Daily cryptic:**
  - a clue card with letter boxes
  - Check and Reveal buttons
  - three fold-out hints, opening one at a time
  - an explanation shown once solved
  - a 14-day streak
- **Neha's World:** a framed slot for a game made elsewhere (section 8.12).

### 3.8 Stickers (everywhere)
**The set**
- The user's sticker images, background removed only. **Never redraw or restyle them.**
- **Kept:**
  - three word stickers: "happy birthday" (violet ribbon), "core memory" (ticket), "iconic" (holo rosette)
  - the clear-vinyl date stamp ("RECEIVED / 11.10.26 / WITH LOVE")
  - five washi strips and the postage stamp (as paper pieces)
  - the 8-ball
- **The sheet is open-ended:** new stickers are added to group 1 by dropping a PNG in and adding one line to `content/stickers.json`.

**Behaviour (every page, not only the cover)**
- **Drag** any sticker; it **stays exactly where it is dropped** (sticks; no pin).
- **Physics stickers** come to rest and **sleep**, with no jitter.
- **Rotate:**
  - a round turn handle at the bottom-right appears on hover; drag it around, and Shift snaps to 15°
  - two-finger rotate on trackpads (Safari `gesturechange` events, where available)
  - Shift + scroll wheel, or a sideways two-finger swipe
- **Resize:** presets S 76 / M 124 / L 200 px, plus free size 40 to 320 px (slider and a corner handle).
- **Right-click menu:**
  - Stick here
  - Let it fall
  - Duplicate
  - Bring to front
  - Size (S / M / L plus slider)
  - Angle slider (−180° to 180°)
  - Peel off (delete)
- **Peel off follows the sticker's own outline:** a 3D curl from one corner, showing a white back in the sticker's shape (section 8.3).
- **Physics on the cover and opening:**
  - all approved stickers (about 40 in the current sheet, plus any added later) fall when the frame enters view; they overlap, bounce (restitution 0.35) and settle along the bottom
  - on the cover they fall at 72% size and rest below the journal, **never over the player**
- **When the pile falls:** only during the first-visit opening, after "reset stickers", and during "replay the opening". At all other times (returning visits, or coming back to the cover from another tab), the stickers appear exactly where they were saved, already at rest.
- **Dragging a physics sticker:** when dropped, it **sticks where it was dropped** (it becomes static). It is not thrown. "Let it fall" gives it physics again, so it drops and settles.
- **Sticker images are used exactly as exported** in `handoff/assets/`: backgrounds already removed, white die-cut edges already added where needed, and the dancer's skirt in "the two of them" already repaired. Never re-cut, redraw, recolour or add borders to them.
- **Every sticker's state is saved per page:** position, size, angle, stuck or falling, duplicates, deleted. "reset stickers" restores that page's defaults.

---

## 4. Project setup and code rules

### 4.1 Stack (keep it this simple)
- **Vite + React 18, plain JavaScript (JSX).** No TypeScript, no state-management library, no CSS framework.
- **Styling:** plain CSS files per component (or CSS modules), plus `tokens.css` for variables. If the design export uses inline styles or a specific styling method, keep that method for ported components rather than rewriting.
- **Libraries (only these, unless the design code already depends on something else):**
  - `matter-js`: sticker physics, **only if** the exported `StickerPhysics` component cannot be made to meet section 3.8
  - `canvas-confetti`: the birthday confetti, **only if** the exported opening has no working confetti of its own
  - `sharp` (development only): the image optimisation script
  - `papaparse` and `mammoth` (development only): reading CSV and Word files in the content import scripts
  - `@playwright/test` (development only): browser checks
- **Navigation:** no router library. Use the URL hash for sections (`#/cover`, `#/timeline`, `#/timeline/era/the-trip`, `#/wishes/friend-3`, `#/games/wordle` and so on), handled in one small `useHashRoute` hook. Back and forward buttons must work.

### 4.2 Folder structure
```
/
├─ CLAUDE.md                 # project rules for future Claude Code sessions (section 4.5)
├─ PLAN.md                   # the phase plan with ticks
├─ DEVIATIONS.md             # every intentional difference from the design, one line each
├─ CONTENT_GUIDE.md          # plain-English guide to adding content (section 9.4)
├─ handoff/                  # design export, final plan, briefs, assets (read-only)
├─ inbox/                    # raw content dropped in by the team (read-only to the app)
├─ content/                  # ALL site content as clean JSON and Markdown (section 8)
├─ public/
│  └─ media/
│     ├─ photos/<era-id>/        # timeline photos
│     ├─ darkroom/<section-id>/  # darkroom photos
│     ├─ wishes/                 # wish photos and videos
│     ├─ stickers/               # sticker PNGs (transparent)
│     ├─ textures/               # gingham, leather, paper, felt, grain
│     └─ optimized/              # generated by the image script; never edit by hand
├─ scripts/
│  ├─ optimize-images.mjs    # resize and convert photos to WebP
│  ├─ check-content.mjs      # validates every content file
│  └─ import-*.mjs           # converters for CSV, Word and spreadsheet intake
├─ src/
│  ├─ main.jsx, App.jsx
│  ├─ styles/ (tokens.css, fonts.css, global.css)
│  ├─ design/                # components ported from Claude Design (section 5)
│  ├─ components/            # app-level pieces (Stage, Desk, CursorTrail, StickerLayer, ...)
│  ├─ sections/              # Opening, Cover, Contents, Timeline, Darkroom, Wishes, Playlist, Jokes, BackPages, Games
│  ├─ games/                 # Connections, Wordle, Cryptic, NehasWorld
│  ├─ music/                 # spotifyController.js, MusicContext.jsx
│  ├─ content/               # loadContent.js, validators.js, defaults.js
│  └─ lib/                   # storage.js, dates.js, motion.js, hashRoute.js
└─ tests/                    # Playwright checks
```

### 4.3 Code rules
- **Readable first.** Use clear names, small components (aim for under about 250 lines per file), and short comments that explain why something is done, not what.
- **No clever abstractions.** Prefer three clear components over one generic one with ten options.
- **Data in, UI out.** Components receive content as props from the loaded content. **No content strings in components**, except fixed interface labels (for example "Check", "Reveal", "back to all letters"), which live in `content/ui-text.json` so they can be edited too.
- **Storage is always safe.** Use one helper, `src/lib/storage.js`, with `get(key, fallback)` and `set(key, value)`. It wraps `localStorage` in try/catch, uses the prefix `neha.v1.`, and stores JSON. If storage fails (private mode), the site still works without saving.
- **Dates are always IST.** Use one helper, `src/lib/dates.js`, with `todayIST()`, which returns `YYYY-MM-DD` using `Intl.DateTimeFormat` with `timeZone: 'Asia/Kolkata'`. All daily features use it.
- **Reduced motion:** one hook, `usePrefersReducedMotion()`. Every animation checks it and falls back to simple 200 ms fades. The cursor trail and confetti are off.
- **Accessibility basics:**
  - every clickable thing is a real `button` or `a`
  - images have `alt` text from the data (or empty `alt` for pure decoration)
  - Esc closes overlays, and focus returns to what opened them
  - visible focus rings in lavender
- **Performance:**
  - lazy-load images below the first screen (`loading="lazy"`)
  - load each section's code only when first visited (`React.lazy`)
  - preload the cover assets and the first-visit opening assets
  - keep physics bodies asleep when still
  - remove finished animation elements
- **No console errors or warnings** at the end of any phase.

### 4.4 Records you keep
- **`PLAN.md`:** the phase list from section 6, ticked as you go.
- **`DEVIATIONS.md`:** every place the build intentionally differs from the design or the final plan, with the reason (for example "Spotify sound toggle pauses instead of muting: the embed has no volume control").
- **Git:** one commit per phase, with a clear message, for example "Phase 4: opening sequence".

### 4.5 `CLAUDE.md` (create in Phase 0)
Write a short project-rules file so any future Claude Code session follows the same rules. Include:
- the order of authority (section 0.4)
- the locked decisions (section 2) and retired features (2.10), summarised
- the code rules (4.3)
- where content lives and how to add it (link to `CONTENT_GUIDE.md`)
- the commands: `npm run dev`, `npm run check`, `npm run images`, `npm run build`, `npm run test`

---

## 5. Using the Claude Design code

1. **Inventory first (Phase 0).** Open every file in `handoff/design/` and write `handoff/DESIGN_MAP.md`, listing:
   - the format (React JSX, HTML and CSS, or other), and any libraries it uses
   - every component, what it renders, its props and which phase frames use it
   - every frame and screen state, mapped to the section and component that will build it
   - every asset each file references, and whether it exists in `handoff/assets/`
2. **Port, do not rewrite.**
   - Copy the shared components (`Sticker`, `StickerPhysics`, `SpiralJournal`, `DividerTab`, `Fastener`, `PhotoFrame`, `Envelope`, `WaxSeal`, `MiniPlayer`, `RansomWord`) into `src/design/` and keep their markup, sizes and styles.
   - Then make only these changes:
     - replace hard-coded sample content with props fed from `content/`
     - replace design-only scaffolding (frame labels, annotation boxes, artboard wrappers, multiple states shown side by side) with real state and interaction
     - fix anything that does not run in a real browser
     - split very large files into smaller ones
3. **If the export is plain HTML and CSS:** convert each screen into React components while keeping the class names, structure and CSS values the same.
4. **Annotations become behaviour.** Where the design shows several states of one element side by side (default, hover, open), build one element with real states. Use the design's annotated timings and easing.
5. **Match the screens.** At the end of each section phase, screenshot the built page at 1440 × 900 and compare it with the matching design frame. Fix visible differences (position, size, colour, font, missing elements). Note anything you cannot match in `DEVIATIONS.md`.
6. **Keep a "design gallery" page** at `#/dev/gallery` (only in development builds) showing every ported component in all its states. This makes checking easy.

### 5.1 What to expect in the export, and how to handle it
- **Count check:** the final audit says there are **38 components** across the phase files, plus the 10 shared ones named in 0.3. Confirm all 38 appear in `DESIGN_MAP.md`, and report any that are missing.
- **Browser-only React:** if the files load React, ReactDOM or Babel from a CDN and use `<script type="text/babel">` or global variables (for example `window.Sticker`), convert each component into a normal ES module with `import` and `export`, remove the CDN script tags, and keep the component code itself the same.
- **Design-tool extras:** strip anything that exists only for the design tool:
  - artboard and frame wrappers, frame titles and labels
  - annotation boxes and audit notes
  - "tweak" or edit-mode panels and controls
  - side-by-side state displays

  Settings exposed as tweaks (for example the envelope font alternatives) become fields in `content/site.json`.
- **Embedded assets:** if images, textures or fonts are embedded as base64 or data URLs, extract them into `public/media/` (or `src/assets/`) as real files with clear names, and reference them by path.
- **Absolute positions on 1440 × 900 artboards:** keep them. The scaled stage (2.4) uses the same coordinates, so positions copy across directly.
- **Placeholder content inside components:** move it into the matching `content/` file (section 8) as the starting SAMPLE data, then read it from there.
- **Fonts loaded by the design:** keep only the fonts in 2.3.

### 5.2 Keep the design's own behaviour code where it works
- If the export already implements a behaviour, **port its implementation** and only fix or extend it to meet this brief: for example physics in `StickerPhysics`, the peel-off curl, the music-note trail, confetti, the page turn, the envelope animation, the shake-to-develop polaroid or the Wordle logic.
- The technical notes in sections 2, 3 and 8 (for example the CSS-mask peel-off or `matter-js`) are **fallbacks**, for use only when the design has no working version.
- Record which approach you used for each in `DESIGN_MAP.md`.

### 5.3 Design frames for comparison
To compare screens, open each design file in Playwright (Chromium) and screenshot every frame at 1440 × 900 into `handoff/frames/`, named after the frame. Use these as the reference images in every phase report.

---

## 6. The build plan (phase by phase)

### 6.0 Every phase ends with
1. **Checks:** the phase's own checklist, plus:
   - `npm run check` (content validation) passes
   - the app builds (`npm run build`)
   - the Playwright checks for the phase pass
   - no console errors
2. **A git commit.**
3. **A short report to me:**
   - what now works (3 to 6 bullets)
   - how to see it: the exact preview link, and what to click
   - screenshots of the new screens next to their design frames
   - anything that differs from the design, or is still placeholder
   - the next phase, in one line

Then **stop and wait** for my reply.

| Phase | Name | Main design file |
|---|---|---|
| 0 | Inventory, setup and rules | all |
| 1 | Design system and content layer | Phase 1 v2 |
| 2 | App shell: stage, desks, journal, tabs, page turns, cursor | Phase 1 v2, Phase 3 |
| 3 | Music engine and mini player | Phase 6 (player), Phase 1 v2 |
| 4 | Opening sequence and first-visit logic | Phase 2 |
| 5 | Sticker system and the Cover and Contents | Phase 3, Phase 1 v2 |
| 6 | Timeline and era pages | Phase 4 |
| 7 | Darkroom | Phase 5 |
| 8 | Wishes | Phase 6 |
| 9 | Playlist page | Phase 6 |
| 10 | Jokes, back pages and easter eggs | Phase 7a |
| 11 | Games | Phase 7b |
| 12 | Phone fallback, performance, accessibility, cross-browser QA | all |
| 13 | Real content intake | `inbox/` |
| 14 | Deploy and share | n/a |

---

### Phase 0: inventory, setup and rules

**Goal:** understand everything before building, and set up a clean project.

1. Read this brief, `handoff/final-plan.md`, then the design files.
2. Write `handoff/DESIGN_MAP.md` (section 5.1).
3. Create the Vite + React project, the folder structure (4.2), `CLAUDE.md`, `PLAN.md`, `DEVIATIONS.md` and an empty `CONTENT_GUIDE.md`.
4. Initialise git.
5. Add npm scripts: `dev`, `build`, `preview`, `check`, `images`, `test`.
6. Copy the assets from `handoff/assets/` into `public/media/` (stickers, textures, gingham).
7. **List anything missing** (fonts, textures, stickers or components the design references but the export lacks).

**Checks**
- `npm run dev` shows a blank stage on the gingham desk.
- `DESIGN_MAP.md` lists every phase file, component and frame.

**Report:** include the list of missing items and any conflicts between the design and section 2.

---

### Phase 1: design system and content layer

**Goal:** the tokens, fonts and ported components exist, and the site can load all content from files.

**Design system**
1. Create `tokens.css` (section 2.1 plus the extra tokens from the design), `fonts.css` (2.3) and `global.css`.
2. Port the shared components into `src/design/` (section 5.2).
3. Build the `#/dev/gallery` page showing every component and state.

**Content layer**
1. Create every content file in section 8, filled with **the placeholder content from the design files** (Friend 1 to 12, SAMPLE text, placeholder photos).
2. Write `src/content/loadContent.js`:
   - import every JSON file at build time (Vite JSON imports) and Markdown wishes as raw text (`?raw`)
   - pass everything through `validators.js` and `defaults.js`
3. **Validation and defaults (the key to adding data safely later):**
   - Every item needs a stable `id` (lowercase, hyphenated). If one is missing, generate it from the name or title and warn.
   - Missing optional fields get defaults (for example, a photo with no caption has an empty caption; a friend with no colour gets the next unused swatch; an era with no layout gets the next layout in rotation).
   - Items with broken required fields (for example, a photo file that does not exist) are **skipped with a warning**, never crashing the page.
   - Unknown fields are kept and ignored, so newer data never breaks older code.
   - In development, warnings appear in the console and in a small dev panel. In the live site they are silent.
4. Write `scripts/check-content.mjs` (`npm run check`). It:
   - validates every content file with the same rules
   - checks that every referenced media file exists
   - flags duplicate ids
   - prints a friendly summary, for example: "Timeline: 5 eras, 46 photos. Wishes: 12 (2 videos). Songs: 18. Jokes: 31. 0 errors, 2 warnings."
5. Write `scripts/optimize-images.mjs` (`npm run images`). For every photo in `public/media/photos`, `darkroom` and `wishes`, it:
   - makes WebP versions at 800 px and 1600 px on the long side in `public/media/optimized/`
   - fixes rotation from EXIF data
   - skips files already done

   The `PhotoFrame` component uses `srcset` with these. If an optimized file is missing, it falls back to the original.

**Checks**
- The gallery shows every ported component matching the Phase 1 v2 boards.
- `npm run check` passes on the placeholder content.
- Deleting a required field from a test item produces a warning, not a crash.

---

### Phase 2: app shell

**Goal:** the journal on the desk, the tabs, page turns, navigation and the cursor all work, with empty section pages.

1. **`Stage`:** a 1440 × 900 scaled stage (2.4), re-scaling on window resize.
2. **`Desk`:** day, Darkroom and Playlist desks (2.2), cross-fading on section change.
3. **`SpiralJournal`:** at 1180 × 756 (88, 28), with the silver spiral and the paper type per section (2.4).
4. **`DividerTab`s:** colours, states and the gold clip on the active tab (2.5).
5. **Navigation with `useHashRoute`:**
   - **page turn:** the page lifts from the right edge and flips over the spiral, about 450 ms, using the design's keyframes; backwards reverses it
   - jumping several sections plays a quick riffle of 2 or 3 pages
   - reduced motion uses a fade
   - browser back and forward work
6. **`CursorTrail`:** the music-note cursor (2.7).
7. **Placeholder section pages**, each showing its title, so navigation can be tested end to end.

**Checks**
- All seven tabs open the right section, with the right desk and paper.
- The URL hash updates, and reloading keeps her on the same section.
- The music-note trail works on every page, stops with reduced motion, and is hidden on touch.
- The stage scales correctly at 1280 × 800, 1440 × 900 and 1920 × 1080.

---

### Phase 3: music engine and mini player

**Goal:** music that starts as reliably as browsers allow, keeps playing across sections, and never breaks the site. Build this early so it can be tested properly. Full details are in section 7.

1. `src/music/spotifyController.js`: loads the Spotify iFrame API, creates **one** controller and wraps it with simple functions.
2. `MusicContext.jsx`: holds the current song, the playing state and the controls, for the whole app.
3. **`MiniPlayer`:**
   - the design component, wired up
   - slides in from the left edge
   - starts on a random song
   - title and "picked by" come from our data
   - previous, play or pause, next, and sound on or off
   - all four states, including the "tap to start the music" pulse
4. **Autoplay unlocking (section 7.4):** first visit on the seal click (wired in Phase 4); returning visits on the first click or key press anywhere.
5. **Automatic next song** when a song ends.

**Checks**
- In Chrome, after one click on the page, music starts.
- Next and previous work, the reels turn while playing, and music continues while changing sections.
- With no internet, or a blocked Spotify, the player shows a calm "music unavailable" state and nothing else breaks.
- **Report honestly what happens in Chrome and in WebKit**, logged in and logged out of Spotify (logged-out embeds play 30-second previews).

---

### Phase 4: opening sequence and first-visit logic

**Goal:** the opening exactly as designed in `Phase 2 - Opening`, plus the returning-visit behaviour.

1. Build the five steps (3.1) as one `Opening` section, driven by a simple step state (`'envelope' | 'rising' | 'birthday' | 'confetti' | 'settling'`), using the design's timings.
2. **The envelope:** 784 × 504 (1.4×) with the cream colour, postage stamp, "For Neha" in Great Vibes at 84% height, the "by ____" line from `site.json`, the pulsing red seal, "tap the seal" with the drawn arrow, 13 desk stickers and 3 on its corners.
3. **Seal click:**
   - unlocks and starts the music (section 7)
   - crack, flap, then the brown journal rises
   - "Happy Birthday, Neha" in gold
   - confetti with `canvas-confetti`, in palette colours only: white, powder, dusty blue, lilac, lavender, violet, dusty rose
   - all approved stickers fall with physics (the sticker system's physics mode from Phase 5; for now a simple drop, upgraded in Phase 5)
   - the journal settles into the cover; the tabs and player slide in
4. **On finish:** save `neha.v1.opened = "true"` and navigate to `#/cover`.
5. **On load:** follow the rule in 3.1. If `opened` is set, show the section from the hash, or the settled Cover if there is none, with no opening. **No skip link anywhere, and no `#/opening` URL.**
6. **Reduced-motion version:** steps as quick fades.
7. **A development-only reset** (`?reset-opening` in the URL during development) to test the first visit again.

**Checks**
- The first visit plays the whole sequence. A reload goes straight to the cover. Clearing storage shows the opening again.
- Screenshots of each step match the design frames.

---

### Phase 5: sticker system, Cover and Contents

**Goal:** the full sticker behaviour (3.8), working on every page, and the cover and contents exactly as designed.

**The sticker system** (section 8.3 for the data and technical notes)
1. **`StickerLayer`:** one layer per page, rendering that page's stickers from `content/stickers.json` (defaults) merged with the saved state.
2. **Drag:** pointer events; the sticker follows the pointer and stays where dropped. Saved on release.
3. **Rotate:**
   - the turn handle on hover (Shift snaps 15°)
   - Safari `gesturestart` and `gesturechange` for trackpad rotate (feature-detected)
   - Shift + wheel, or a horizontal wheel over a hovered sticker
4. **Resize:** a corner handle (40 to 320 px) and the S / M / L presets.
5. **Right-click menu:** a custom context menu on stickers only, with Stick here, Let it fall, Duplicate, Bring to front, Size, Angle and Peel off. Elsewhere the normal browser menu works.
6. **Physics (cover and opening only):** port the exported `StickerPhysics`, and use `matter-js` only if that cannot meet these rules:
   - one world with walls and a floor below the journal
   - restitution 0.35
   - stickers at 72% size on the cover
   - sleeping enabled
   - the player zone blocked by a static body, so stickers never land on it
   - "Stick here", or dropping after a drag, makes a body static; "Let it fall" makes it dynamic again
   - the pile only falls on the first opening, after reset and on replay; otherwise saved positions load already at rest (3.8)
7. **"Let it fall" on pages without physics:** the sticker drops with a short gravity-like animation to the bottom edge of the journal page, and stays there.
8. **Peel off:** the outline-following curl (8.3), then removal; saved as deleted.
9. **Duplicate:** a copy appears 24 px away, with a new instance id.
10. **Saving:** every change saves that page's sticker state under `neha.v1.stickers.<pageId>`.
11. **"reset stickers":** restores that page's defaults.

**Cover**
- hero photo 520 × 650 in gold corners
- her name in Pinyon Script
- the clipped note
- fixed stickers and the physics pile
- "open the journal →"
- "reset stickers"

**Contents spread**
- plain white inside cover on the left; lined page on the right
- six handwritten links with sticker doodles and page numbers, each turning to its section

**Checks**
- Drag, rotate (handle, Shift + wheel), resize (handle, presets, slider) and every menu item work.
- State survives a reload. "reset stickers" works.
- Physics stickers settle and stop moving (no jitter after 3 seconds), and never cover the player.
- The cover and contents match the Phase 3 frames.
- **Two-finger trackpad rotate:** works in Safari if available. Note in the report that it needs a test on a real Mac.

---

### Phase 6: Timeline and era pages

**Goal:** the timeline page and five pull-out era pages, as designed in `Phase 4 - Timeline`.

1. **Timeline page:** the title, a row of year buttons (one per era, from `content/timeline.json`) and the timeline body with small photo clusters.
2. **Opening an era:** clicking a year button or any photo opens the **pull-out era page** (punched holes, no tab), sliding out from the right edge (about 500 ms). URL: `#/timeline/era/<id>`.
3. **Five layout components:** `Scrapbook`, `PolaroidScatter`, `FeatureGrid`, `PhotoboothWall`, `Pinboard`. Each takes a list of photos and places them using the layout's slot positions from the design.
4. **Handling any number of photos (essential for adding data later):**
   - Each layout defines **10 designed slots**.
   - With fewer photos, it uses the first N slots, in the design's priority order.
   - With more than 10, the extra photos flow into a tidy "more from this era" grid below the designed area, inside the page's scroll.
5. **Video tile:** plays in place. Uses a local MP4 if given, or an embedded YouTube or Vimeo link.
6. **Enlarge in place:** a click scales the photo 1.5× above the others; a click again or Esc returns it.
7. **Era switcher** at the bottom, and Back plus Esc to close.
8. **Layout per era:** chosen in data (`layout`); if missing, rotated so neighbouring eras differ.
9. **Each era page:** has its own sticker layer.

**Checks**
- All five layouts match their design frames with 10 photos.
- They also look tidy with 3 and with 14 photos (test with temporary data, then remove it).
- Captions and "taken by" appear on hover.

---

### Phase 7: Darkroom

**Goal:** the long photo wall from `Phase 5 - Darkroom`.

1. The black-to-red desk and the dark page. The page scrolls inside the journal; the spiral and tabs stay fixed.
2. **Header:** "the darkroom" as a `RansomWord` heading, film strips on gold clothespins, and the style index (seven labels that scroll to each section).
3. **Seven sections**, in the order in 3.4. Each renders its photos from `content/darkroom.json` in that section's frame style and behaviour (per the design): film strip, photobooth strips, shake polaroids, flash blink, contact sheet with loupe, slideshow mounts, cut-outs.
4. **"Give it a shake":** drag a polaroid back and forth; development rises with total movement (3.4). Saved per photo.
5. **Gentle parallax** (at most 15%), using one scroll listener with `requestAnimationFrame`. Turned off with reduced motion.
6. **Click a photo** to enlarge it in place (1.5×). There is no lightbox.
7. **The "back to top" film canister.**
8. **Any number of photos per section:** they flow in the section's pattern. An empty section is hidden.

**Checks**
- Matches the design frames.
- Scrolling is smooth (no frame drops on a normal laptop).
- The loupe follows the cursor.
- Shake development works with a mouse and a trackpad.

---

### Phase 8: Wishes

**Goal:** the envelope grid and full letters from `Phase 6 - Wishes and Playlist`.

1. **The grid:** on one wide lined page, 4 × 3 envelopes (200 × 130), each in the friend's colour, with that friend's handwriting font, the name, and a red wax seal.
2. **More or fewer than 12 friends:**
   - Up to 12: the 4 × 3 grid.
   - 13 to 16: 4 × 4, with the envelopes scaled to fit the page.
   - More than 16: the grid continues on a second page, reached by a "more letters →" link.
   - Envelope order comes from `order` in the data, then by name.
3. **Counter:** "X OF N OPENED".
4. **Opening:** the seal cracks, the flap opens, and the page turns to that wish. URL: `#/wishes/<friend-id>`.
5. **The letter page:**
   - the page is tinted in the writer's colour (soft for light colours, rich for dark ones, as designed)
   - the newspaper clipping: masthead "THE NEHA TIMES", the headline, the dateline, **two justified columns** (`text-align: justify; hyphens: auto; lang="en"`), the sign-off in the friend's handwriting, an optional photo, and a "you're [colour name] to me" line
   - long text scrolls inside the clipping while the headline stays visible
   - wish text comes from Markdown files (`content/wishes/<friend-id>.md`), so long letters with paragraphs are easy to add
   - **video wishes:** a large frame with play controls; MP4 or a YouTube link
   - controls: back to all letters (and Esc), previous and next, and the counter
6. **Saved state:** opened envelopes are remembered.
7. **End page:** when all are opened, "that's everyone. we love you." appears, as designed.

**Checks**
- Matches the design.
- 600-word wishes read well, with no large justification gaps (test with sample text).
- Contrast is readable on all 12 placeholder colours.

---

### Phase 9: Playlist page

**Goal:** the approved mixtape page, exactly as designed (art option A), wired to the music engine.

1. The midnight-to-wine desk.
2. The cassette case with art option A, the spine and the cassette.
3. **Liner notes:**
   - side A and side B from `content/songs.json`
   - hover shows a play icon
   - a click plays that song through the shared controller
   - the playing song gets the highlight bar and spinning record icon
   - a long list scrolls inside the paper
4. **The Spotify slot:** the single shared Spotify embed is shown here, inside the designed slot (section 7.3), and kept hidden elsewhere.
5. **"save to your Spotify":** links to the playlist URL from `site.json`, opening in a new tab.
6. The cassette slides out on page open, and the reels turn while playing.

**Checks**
- Matches the design.
- Clicking any song plays it, and the mini player updates.
- The next song starts automatically.

---

### Phase 10: Jokes, back pages and easter eggs

**Goal:** the joke board and back pages from `Phase 7a - Jokes and Extras`.

**Jokes**
1. The lavender felt board. Notes sized by joke length, each with a gold pin, and the **red thread** drawn pin to pin (3.6).
2. **Flip** a note to see "the origin story" (lore), with a 3D flip of about 400 ms.
3. **Filters:** All, and By person. There are no favourites.
4. **Any number of jokes:** notes flow in the board's pattern. The board grows and scrolls inside the page, and the thread updates.

**Back pages**
- the signed-by list (each friend in their colour and handwriting font)
- the group photo
- the library card: clicking it types "due back: never" line by line
- "replay the opening"
- reached as described in 3.6 (design navigation, or a "the back pages →" link)

**Easter eggs**
Keep them small and safe. Each is turned on or off in `site.json`.
- They are behaviours, not new screens. Build them only from elements that already exist in the design (the name, the stickers, a handwritten note).
- If the Phase 7a design shows easter eggs differently, follow the design.
- **Her name on the cover clicked five times:** the letters lift and settle back, revealing a short secret note (text from `site.json`).
- **Typing one of her nicknames anywhere:** a 2-second rain of stickers (nicknames from `site.json`; off if the list is empty).
- **A secret key sequence** (set in `site.json`): shows a message from the group.

**Checks**
- Matches the design.
- The thread lines up with the pins at all window sizes.
- The easter eggs never interfere with typing in games.

---

### Phase 11: Games

**Goal:** the games spread and four games from `Phase 7b - Games`, using original colours for Connections and Wordle.

1. **Games spread:** four cards at 250 × 420 (no stamps or stars), on grid paper. URLs: `#/games/connections`, `#/games/wordle`, `#/games/cryptic`, `#/games/world`.
2. **Connections:**
   - 16 tiles from `content/games/connections.json`, shuffled on load
   - select 4 and Submit; four mistakes allowed
   - "one away..." and "already guessed" messages
   - Shuffle and Deselect all
   - solved groups become coloured bars in difficulty order
   - when all four are solved, palette confetti and "solved with N mistakes"
   - progress saved for the current puzzle id
   - several puzzles may be listed; the newest is shown, and older ones are reachable with small arrows
3. **Wordle:**
   - **The answer:** chosen by date from `content/games/wordle.json` (a list of `{date, word}`). If today has no entry, use the most recent past entry. If there are none, use the first word.
   - **The grid:** 6 rows of 5 letters (letter count taken from the word, so 4 to 7 letters also work).
   - **Keyboard:** the on-screen keyboard plus the physical keyboard; Enter and Backspace work.
   - **Colouring rules:** exact matches green first, then yellow up to the remaining letter count, then grey.
   - **Guess checking:** guesses are checked against an allowed-words list (a common five-letter list bundled as a JSON file, plus every answer). The "not in word list" shake shows otherwise. A setting `strictWordList` can be turned off.
   - **Animation:** tiles flip one after another (about 250 ms each).
   - **End states:** solved shows "you got it in N"; not solved reveals the word.
   - **Saving:** the board is saved per date.
4. **Daily cryptic:**
   - **Clue choice:** the clue for `todayIST()` from `content/games/cryptic.json`. If today has none, show the most recent past clue.
   - **Clue card:** the clue with its letter count, and letter boxes (typing moves forward; Backspace moves back).
   - **Check:** wrong letters shake; when correct, the solve shows.
   - **Reveal:** fills in the answer and marks the day "revealed", which does not count for the streak.
   - **Three fold-out hints**, one at a time, as designed: definition underlined, the trick, a letter.
   - **Explanation:** unfolds once solved or revealed.
   - **14-day streak:** shows the last 14 days (solved, today, missed, future) and the current streak count, from saved results.
   - Past clues are playable from the streak row.
5. **Neha's World:** the framed slot (8.12).
6. **Typing in games:** must never trigger the nickname easter egg or page navigation keys.

**Checks**
- Connections and Wordle logic tested with Playwright: a full win and a full loss.
- Wordle colouring is correct for repeated letters.
- The cryptic streak counts correctly across simulated dates (test the date helper with fixed dates).
- Everything matches the design frames.

---

### Phase 12: phone fallback, performance, accessibility and QA

**Goal:** a polished, reliable site. The phone layouts were not designed, so phones get a simple, friendly fallback.

1. **Phone and narrow screens** (width under 900 px, or `(hover: none)` with a small screen):
   - First, a small card in the journal style: "this journal is made for a laptop screen. open it on your laptop for the full experience."
   - Below it, a button: "open it here anyway". This shows the same scaled stage. Pinch zoom is allowed, and the cursor trail and sticker physics are off.
   - The opening and music still work.
2. **Performance:**
   - run a Lighthouse check on the production build (`npm run build && npm run preview`)
   - aim for a fast first load of the opening and cover: preload the gingham, leather and seal images and the fonts
   - all other photos lazy-load at the optimized sizes
3. **Accessibility pass:** keyboard navigation of the tabs and buttons, Esc on every overlay, alt text, focus rings, reduced motion everywhere.
4. **Cross-browser:**
   - full Playwright run in Chromium
   - a WebKit run if available
   - check fonts, `scaleY` on Great Vibes, justified text with hyphenation, 3D transforms (page turn, peel, flips), `mask-image` (with `-webkit-` prefix), and Safari gesture events
5. **Visual pass:** screenshot every section at 1440 × 900 and 1920 × 1080 next to its design frame. Fix the differences.
6. **Robustness pass:**
   - empty data for every section shows a gentle empty state, never a crash
   - a broken image shows a soft placeholder, not a broken icon
   - storage disabled: the site still works

**Checks:** all of the above, plus a final full click-through (section 11).

---

### Phase 13: real content intake

**Goal:** turn the team's real files in `inbox/` into clean content. Run this whenever new content arrives, as often as needed (section 9).

1. Follow the intake process in section 9.
2. Run `npm run images` and `npm run check`.
3. Click through every section with the real content, and fix any layout problem the real content causes (long names, long captions, unusual photo ratios), using data-safe fixes such as truncation, wrapping or fit rules, never one-off hacks.
4. **Report:** what was added, what is still missing (by section), and any content you could not place.

---

### Phase 14: deploy and share

**Goal:** a public link that works worldwide, ready to send.

1. **Production build:** `npm run build`, then `npm run preview`, then a final click-through.
2. **Privacy:**
   - add `<meta name="robots" content="noindex, nofollow">` to `index.html`
   - add a `robots.txt` with `Disallow: /`, so search engines do not list the site
3. **Hosting (prefer Vercel; Netlify is the backup).** Both are free, serve the site from a worldwide network, and give a public `https://` link.
   - Add the config file (`vercel.json` or `netlify.toml`) with long cache headers for `/assets/` and `/media/optimized/`, and no caching for `index.html`.
   - Since navigation uses the URL hash, no special redirect rules are needed.
4. **Deploy steps for the students:** write them out click by click.
   - Either the Vercel CLI (`npx vercel`, which asks them to log in once in the browser), or GitHub plus the Vercel dashboard ("Import Project").
   - Netlify alternative: drag the `dist` folder onto app.netlify.com/drop.
   - Do the parts you can do yourself. Pause only for the steps that need their login.
5. **Updating later:** document in `CONTENT_GUIDE.md` how to publish an update after adding content (run the checks, build, redeploy). With GitHub connected to Vercel, pushing a commit redeploys automatically.
6. **Final live checks on the real URL:**
   - first visit (in a fresh incognito window)
   - returning visit
   - music start
   - every section
   - a phone check
7. **Report:** the live link, how to update it, and a short "before you send it" checklist.
   - test in Chrome logged into Spotify
   - send the link with a note suggesting Chrome on a laptop with sound on

---

## 7. Spotify music: how it must work

### 7.1 The honest limits (build around them; do not fight them)
- **Browsers block sound until the visitor clicks or presses a key** on the page. No website can autoplay music with sound on a fresh visit. "Autoplay" therefore means: **music starts on her very first interaction.**
- **The Spotify embed** plays full songs only when the visitor is logged into Spotify in that browser. Otherwise it plays 30-second previews. The code must handle both (moving to the next song when a preview ends).
- **The Spotify embed has no volume control.** The "sound on or off" button therefore pauses and resumes. Record this in `DEVIATIONS.md`.
- **Spotify must stay visible** where its player is shown (the Playlist slot). Do not hide its branding there.

### 7.2 One controller, created once
- Load `https://open.spotify.com/embed/iframe-api/v1` once, from `index.html`, with `async`.
- In `window.onSpotifyIframeApiReady`, create **one** controller with `IFrameAPI.createController(element, { width: 300, height: 80, uri: firstSongUri }, callback)`.
- Wrap it in `spotifyController.js` with plain functions:
  - `load(uri)`
  - `play()`
  - `pause()`
  - `resume()`
  - `toggle()`
  - `onUpdate(callback)`: listens to the controller's `playback_update` event, which reports paused state, position and duration
- **Ending detection:** when the position comes within 600 ms of the duration and was moving, call `next()`, with a guard so it fires only once per song.

### 7.3 Where the embed lives
- The embed's container is created **once** at the app root and never unmounted, so music never stops when she changes sections.
- **On the Playlist page:** the container is positioned exactly over the designed Spotify slot (calculate the slot's position from its element, and update on resize and scroll), so it appears in place.
- **On every other page:** it stays rendered, but moved out of view inside the stage (opacity 0, `pointer-events: none`, normal size, never `display: none`, which can stop playback).

### 7.4 Starting the music
- **First visit:** the seal click handler calls `music.start()` **synchronously inside the click** (before any `await` or timeout). It loads the random first song and calls `play()`.
- **Returning visit:**
  - Add a one-time listener for the first `pointerdown` or `keydown` anywhere, which calls `music.start()`.
  - Until then, the mini player shows the pulsing "tap to start the music" state.
- **Confirming it worked:**
  - After calling `play()`, wait up to 2.5 seconds for a `playback_update` with `isPaused: false`.
  - If it never arrives, show the "tap to start the music" pulse. One tap on the mini player retries `play()` directly inside that click.
- **If the API fails to load** (blocked or offline): the mini player shows "music unavailable", with the song list still visible on the Playlist page as liner notes, and **nothing else on the site is affected**.

### 7.5 Song order and controls
- **Starting song:** on each page load, pick a random song.
- **Next and previous:** next goes through a shuffled order that starts from that song; previous goes back through the order.
- **Playlist clicks:** clicking a song on the Playlist page plays it and continues from there.
- **Display:** the mini player shows the title and "picked by" from `songs.json`, not Spotify's metadata.
- **Nothing about playback is remembered between visits:** every load starts on a new random song, as the design requires.

### 7.6 Testing
In the Phase 3 and 14 reports, state exactly what you observed:
- Chrome, logged out
- WebKit or Safari, if available
- the fallback path

The students will test logged in on their own laptop.

---

## 8. Content files: the data model

All content lives in `content/` (data) and `public/media/` (files). **Media paths in content files are relative to `public/media/`.**

Every list item has a stable `id`. Optional fields can be left out. **The site must work with any number of items, including zero** (showing a gentle empty state).

### 8.1 `content/site.json`
```json
{
  "name": "Neha",
  "birthday": "2026-10-11",
  "coverLine": "NEHA · THE BIRTHDAY JOURNAL · 11.10.2026",
  "fromLine": "by ____",
  "envelopeFont": "Great Vibes",
  "coverPhoto": "photos/cover/cover.jpg",
  "coverNote": "this whole journal is about you.",
  "contentsWelcome": "SAMPLE welcome note from the group",
  "groupPhoto": "photos/cover/group.jpg",
  "spotifyPlaylistUrl": "https://open.spotify.com/playlist/...",
  "nicknames": [],
  "easterEggs": {
    "nameClicks": { "on": true, "note": "SAMPLE secret note" },
    "nicknameRain": { "on": true },
    "secretKeys": { "on": false, "sequence": "", "message": "" }
  }
}
```

### 8.2 `content/friends.json`
```json
[
  { "id": "friend-1", "name": "Friend 1", "colour": "#ACBFD3", "colourName": "dusty blue", "hand": "caveat", "order": 1 }
]
```
- `hand` is `caveat` or `kalam`. If it is missing, alternate between them.
- If `colour` is missing, use the next unused swatch from the design's 12 friend colours.
- Text colour on the friend's colour is chosen automatically for contrast: ink or white, by luminance.

### 8.3 `content/stickers.json` and sticker technical notes
```json
{
  "sheet": [
    { "id": "eight-ball", "file": "stickers/eight-ball.png", "group": 1, "defaultSize": 124 }
  ],
  "pages": {
    "cover": { "physics": true, "use": "all", "scale": 0.72 },
    "opening": { "physics": true, "use": "all" },
    "timeline": { "fixed": [ { "sticker": "eight-ball", "x": 1180, "y": 120, "size": 96, "angle": -8 } ] }
  }
}
```
- **Adding a sticker:** drop a transparent PNG into `public/media/stickers/` and add one line to `sheet` (group 1 for new stickers). It then automatically joins the physics piles ("use": "all") and is available to place on pages.
- **Fixed page stickers:** default positions per page, from the design frames.
- **Saved state** (`neha.v1.stickers.<pageId>`) stores, per instance id: `x`, `y`, `size`, `angle`, `stuck`, `deleted`, plus any duplicates.
  - When the sticker sheet changes later, **merge**: keep saved instances whose sticker still exists, add new default stickers, and drop instances of removed stickers.
  - Never crash on old saved data.
  - Include `"version": 1` in saved data. If the version ever changes, migrate or reset that page only.
- **Peel-off effect (keep it simple):**
  - Duplicate the sticker image into a "back" element filled white, using the sticker PNG as a CSS mask (`mask-image` and `-webkit-mask-image`), so the back has the sticker's exact outline.
  - Animate the front with a 3D rotation around a diagonal axis from one corner (perspective about 600 px) over about 450 ms, revealing the white back. Then fade out and remove.
  - This follows the outline without any complex code.

### 8.4 `content/timeline.json`
```json
[
  {
    "id": "the-trip",
    "name": "the trip",
    "year": "2023",
    "description": "SAMPLE one line about this era",
    "layout": "polaroid-scatter",
    "order": 3,
    "photos": [
      { "file": "photos/the-trip/01.jpg", "caption": "SAMPLE", "takenBy": "friend-2", "alt": "Neha at the beach" }
    ],
    "video": { "file": "photos/the-trip/clip.mp4", "poster": "photos/the-trip/clip.jpg" }
  }
]
```
- `layout` is one of `scrapbook`, `polaroid-scatter`, `feature-grid`, `photobooth-wall`, `pinboard`.
- `video` may use `"youtube": "VIDEO_ID"` instead of `file`.
- **Shortcut for adding photos:** if an era has `"photosFromFolder": true`, the image script lists every image in `public/media/photos/<era-id>/` into a generated file, `content/generated/photos-<era-id>.json`, which the loader merges in. Photos can then be added by just dropping them in the folder and running `npm run images`. Captions can be added later.

### 8.5 `content/darkroom.json`
```json
{
  "sections": [
    { "id": "on-film", "label": "on film", "photos": [ { "file": "darkroom/on-film/01.jpg", "caption": "" } ] }
  ]
}
```
- **Section ids, in order:** `on-film`, `photobooth-chaos`, `give-it-a-shake`, `flash-on`, `the-outtakes`, `slideshow`, `cover-girl-material`.
- The same `photosFromFolder` shortcut works here.

### 8.6 Wishes: `content/wishes.json` plus `content/wishes/<friend-id>.md`
```json
[
  { "id": "friend-1", "friend": "friend-1", "headline": "A note from Friend 1", "photo": "wishes/friend-1.jpg", "video": null }
]
```
- The letter body is the Markdown file `content/wishes/friend-1.md` (paragraphs, simple emphasis).
- A video wish sets `"video": { "file": "wishes/friend-4.mp4" }` or `{ "youtube": "ID" }`.
- A wish with no Markdown file and no video shows "letter coming soon" in handwriting, so it never breaks.

### 8.7 `content/songs.json`
```json
[
  { "id": "song-1", "title": "Song title", "artist": "Artist", "spotify": "spotify:track:XXXXXXXX", "pickedBy": "friend-3", "reason": "SAMPLE reason", "side": "A" }
]
```
- `spotify` accepts a track URI or a full `open.spotify.com/track/...` link (convert links to URIs in the loader).
- If `side` is missing, split the list in half (A then B).

### 8.8 `content/jokes.json`
```json
[
  { "id": "joke-1", "text": "SAMPLE joke", "submittedBy": "friend-5", "lore": "SAMPLE origin story" }
]
```

### 8.9 `content/games/connections.json`
```json
[
  {
    "id": "puzzle-1",
    "groups": [
      { "name": "SAMPLE", "words": ["A","B","C","D"], "level": 1 },
      { "name": "SAMPLE", "words": ["E","F","G","H"], "level": 2 },
      { "name": "SAMPLE", "words": ["I","J","K","L"], "level": 3 },
      { "name": "SAMPLE", "words": ["M","N","O","P"], "level": 4 }
    ]
  }
]
```
- Levels 1 to 4 map to yellow, green, blue and purple.
- Validate that each puzzle has 4 groups of 4 unique words.

### 8.10 `content/games/wordle.json`
```json
{ "strictWordList": true, "words": [ { "date": "2026-10-11", "word": "NEHAS" } ] }
```
(The example word is a placeholder.)

### 8.11 `content/games/cryptic.json`
```json
[
  {
    "date": "2026-10-11",
    "clue": "SAMPLE clue (5)",
    "answer": "SAMPLE",
    "definition": "the part of the clue to underline",
    "hints": ["the definition is underlined", "the trick: SAMPLE", "a letter: S"],
    "explanation": "SAMPLE how the clue works"
  }
]
```
- The letter count is taken from the answer.
- The underline is applied by finding `definition` inside `clue`.

### 8.12 `content/games/neha-world.json` (the platformer slot)
```json
{ "embedUrl": "", "items": [ { "label": "item 1: double jump", "sticker": null } ] }
```
- **If `embedUrl` is empty:** show the designed empty state, "the game arrives here soon".
- **If it is set:** load it in an `iframe` (960 × 540, expanding to 1280 × 720) with `allow="autoplay; fullscreen; gamepad"` and the designed loading state.
- Pause the site music while the game is expanded, and offer to resume after.
- The game can be hosted anywhere (for example itch.io, or a folder in `public/neha-world/` for a self-contained HTML game).

### 8.13 `content/ui-text.json`
Every fixed interface label (buttons, counters, empty states, hint titles) in one place, so wording can be changed without touching code.

---

## 9. Content intake: bringing in files from the team

The team will send content in whatever form is easiest for them. **Your job is to sort it into the data model in section 8, correctly and safely.**

### 9.1 What may arrive in `inbox/`
- A Google Form export (CSV or XLSX): friend names, colours, wishes, jokes and lore, songs and reasons.
- Word documents (`.docx`) or text files with long wishes.
- Photos and videos, maybe in folders named by era or style, maybe all mixed.
- A list of Spotify links.
- Game content (Connections groups, Wordle words, cryptic clues), as a document or spreadsheet.
- Sticker PNGs (her objects and others).

### 9.2 The intake process (follow every time)
1. **Inventory.**
   - List every new file in `inbox/` and guess what each one is.
   - For spreadsheets, print the column headers and the first two rows; for documents, the first lines.
2. **Map.**
   - Write `inbox/INTAKE_PLAN.md`: for each file, where its data will go (which content file and fields) and how columns map to fields.
   - **If a mapping is genuinely unclear** (for example, you cannot tell which era a photo belongs to), list it as a question and **ask me before importing that part**. Import everything that is clear.
3. **Convert.**
   - Use small, readable scripts in `scripts/` (`import-form.mjs`, `import-wishes.mjs` and so on), reusable for the next batch, rather than editing JSON by hand for large amounts.
   - Keep each friend's words exactly as written: fix only obvious encoding problems, never rewrite.
4. **Media.**
   - Copy media into the right `public/media/` folder, with clean file names (lowercase, hyphens, numbered).
   - Convert iPhone HEIC photos to JPEG.
   - Re-encode videos to MP4 (H.264 and AAC) if they are in another format and ffmpeg is available. If not, list them for the students.
5. **Match friends.**
   - Link wishes, jokes and songs to friends by name, using `friends.json` ids, ignoring capitals and extra spaces.
   - Report any name that matches no friend.
6. **Merge, never overwrite blindly.**
   - Add new items, and update existing items with the same id.
   - **Never delete existing content** unless the students ask.
   - Keep placeholders only where real content has not arrived yet. Remove the SAMPLE placeholder for a slot once real content fills it.
7. **Run** `npm run images` and `npm run check`, then click through the affected sections.
8. **Report:**
   - what was added (counts per section)
   - what was skipped and why
   - which placeholders remain

   Then move the processed files to `inbox/processed/<date>/`.

### 9.3 Adding content over time without glitches
These rules make later additions safe:
- **Stable ids:** never change the id of an existing item, because saved state (opened envelopes, sticker positions, game progress) is keyed by id.
- **Any count works:** every layout handles zero items and more items than designed (sections 6 and 8).
- **Validation before publishing:** `npm run check` must pass before every deploy.
- **Saved-data merging:** sticker and game saves merge with new content and ignore anything that no longer exists.
- **Daily features:** Wordle and the cryptic use dated lists with fallback to the most recent past entry, so adding future dates is enough to keep them running.

### 9.4 `CONTENT_GUIDE.md`
Write a plain-English guide for the students, with examples:
- how to add a photo to an era or Darkroom section (drop it in the folder, run `npm run images`)
- how to add a wish, joke, song, sticker or game clue (which file, and a copy-paste example)
- how to change a friend's colour or name
- how to check everything (`npm run check`)
- how to publish the update (Phase 14)
- the easiest way: "drop the files in `inbox/` and ask Claude Code to run the intake"

---

## 10. Chrome first, Safari safe
- **Chrome on a laptop** is the main target: test everything there first.
- **Safari rules:**
  - `-webkit-mask-image` alongside `mask-image`
  - `-webkit-backdrop-filter` only if the design uses it (avoid heavy blur)
  - fonts via `font-display: swap`
  - videos with `playsinline` and `muted` where they autoplay silently
  - no reliance on `:has()` for anything essential
  - feature-detect `gesturechange`
  - `hyphens: auto` with `-webkit-hyphens`
- **Never** depend on a newer browser feature without a simple fallback.
- **Keep the frame rate smooth:**
  - animate only `transform` and `opacity` where possible
  - one `requestAnimationFrame` loop for the physics, paused when the cover is not visible
  - stop the cursor trail loop when the mouse is still

---

## 11. Final click-through checklist (Phase 12 and after deploy)

**First visit and returning visit**
- [ ] First visit in a fresh incognito window: envelope, seal pulse, click, music starts (or the pulse appears), journal rises, birthday, confetti, stickers settle, cover with tabs and player.
- [ ] Reload: straight to the cover, stickers where they were left, music starts on the first click.

**Global**
- [ ] Music-note cursor trail on every page; the normal cursor over the Spotify player and inputs.
- [ ] Every tab: the right desk, paper and page turn; browser back and forward work.

**Stickers**
- [ ] Drag, rotate, resize, Stick here, Let it fall, Duplicate, Bring to front, Angle, Peel off on the cover and one other page; saved after reload; reset works.

**Sections**
- [ ] Timeline: year buttons and photos open the era page; all five layouts; enlarge in place; switcher; Esc.
- [ ] Darkroom: style index, all seven sections, shake polaroid, loupe, parallax, enlarge.
- [ ] Wishes: grid, open, letter, previous and next, video, counter, end page, saved opened state.
- [ ] Playlist: the song plays from the liner notes; the mini player follows; the next song starts automatically; save-to-Spotify link.
- [ ] Jokes: pins and thread, flip for lore, filter by person.
- [ ] Back pages: signed-by list, library card, replay the opening.
- [ ] Games: Connections win and loss; Wordle win and loss with repeated letters; cryptic hints, check, reveal, explanation, streak; Neha's World empty state (or the loaded game).

**Quality**
- [ ] Reduced motion on: everything uses fades, with no trail or confetti.
- [ ] 1280, 1440 and 1920 widths look right; the phone fallback card works.
- [ ] No console errors; `npm run check` passes; Lighthouse performance is reasonable.

---

## 12. Begin

Start with **Phase 0**. Read everything, write `DESIGN_MAP.md`, set up the project, and report what you found, including anything missing or conflicting. Then stop and wait for my reply.
