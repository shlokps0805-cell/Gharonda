# Design map

What is in the Claude Design export (`handoff/design/`) and where each piece lives in the build.

## Format
Every file is a **`.dc.html` design component**: an `<x-dc>` HTML template (with `{{ }}` values,
`<sc-if>`, `<sc-for>` and `<dc-import>`) plus a `class Component extends DCLogic` script with a
`renderVals()` method. The files run in the browser through `support.js` (the design tool's runtime),
which loads React 18.3.1 from a CDN. Fonts come from Google Fonts. No other libraries.

**How it was ported:** a converter turned each template into JSX with the design's inline style strings
kept verbatim (`css('…')`), and each `DCLogic` class into a React class component that keeps its
`renderVals()` code (`src/design/dc.js`). Scenes were then split into the app's sections, with the
design-only parts (frame labels, annotation cards, side-by-side states, the per-scene tabs/player/desk)
replaced by real state and shared components.

## Files (39 design files + `support.js`)

| File | What it renders | Used by / built as |
|---|---|---|
| `Phase 1 v2 - Journal Foundations` | board page: imports the 12 foundation boards | reference |
| `Phase 2 - Opening` | board page: 5 opening steps + reduced-motion strip | `src/sections/Opening.jsx` |
| `Phase 3 - Cover` | board page: cover default, sticker menu, stuck/resized, contents, global frame | `Cover.jsx`, `StickerLayer`, `Tabs`, `PageTurn`, `CursorTrail`, `PlayerDock` |
| `Phase 4 - Timeline` | board page: spread, hover, 5 era layouts, 8 vs 10 photos, enlarged | `Timeline.jsx`, `timeline/*` |
| `Phase 5 - Darkroom` | board page: full wall, contact loupe, polaroid develop | `Darkroom.jsx`, `darkroom/*` |
| `Phase 6 - Wishes and Playlist` | board page: grid, hover, light/dark/video wish, end, opening keys, playlist states, art A/B | `Wishes.jsx`, `wishes/*`, `Playlist.jsx` |
| `Phase 7a - Jokes and Extras` | board page: board, flipped note, back pages, easter eggs | `Jokes.jsx`, `BackPages.jsx`, `EasterEggs.jsx` |
| `Phase 7b - Games` | board page: spread, Connections, Wordle, Cryptic, Neha's World (+13 state thumbnails) | `Games.jsx`, `src/games/*` |
| `OpeningScene` | the 1440 × 900 opening at each step (+ the music-note trail code) | `Opening.jsx`; trail → `CursorTrail.jsx` |
| `CoverScene` | cover / sticker menu / stuck / contents | `Cover.jsx` |
| `TimelineScene` | spread and era pages, `layout()` slot maths | `Timeline.jsx`, `timeline/eraLayouts.js` |
| `DarkroomScene` | the long wall, `shake()` develop handler | `Darkroom.jsx`, `darkroom/*` |
| `WishScene` | grid, letters, video, end | `Wishes.jsx`, `wishes/Letter.jsx`, `wishes/VideoWish.jsx` |
| `PlaylistScene` | mixtape, liner notes, Spotify slot | `Playlist.jsx` |
| `JokesScene` | joke board with thread, back pages | `Jokes.jsx`, `BackPages.jsx` |
| `GamesScene` | all game frames and states | `Games.jsx`, `src/games/*` |
| `Sticker` | every sticker (images + drawn ones), gloss, holo, turn handle | `src/design/Sticker.jsx` |
| `StickerPhysics` | the falling pile: tick loop, collisions, sleep, menu, peel | extended into `src/components/StickerLayer.jsx` + `StickerMenu.jsx` |
| `SpiralJournal` | journal with silver coil, papers (white, lined, grid, dark, tint, covers) | `src/design/SpiralJournal.jsx` |
| `DividerTab` | the purple tabs, rest/hover/active + gold clip | `src/design/DividerTab.jsx` |
| `Fastener` | gold pin, side pin, binder clip, paperclip, clothespin, photo corner | `src/design/Fastener.jsx` |
| `PhotoFrame` | polaroid, booth strip, film, slide, phone, taped, torn, corners, clipped | `src/design/PhotoFrame.jsx` (+ real photos via `Photo.jsx`) |
| `Envelope` | hero opening envelope and small wish envelopes | `src/design/Envelope.jsx` |
| `WaxSeal` | intact / pulse / cracked seal | `src/design/WaxSeal.jsx` |
| `MiniPlayer` | the 280 × 80 player in four states | `src/design/MiniPlayer.jsx` |
| `RansomWord` | ransom-note headings | `src/design/RansomWord.jsx` |
| `F-Direction` | journal, coils, paper, tabs, page turn, envelope | reference for `SpiralJournal`, `PageTurn` |
| `F-Palette`, `F-Colour` | palette options, colour map, friend colours | `tokens.css`, `content/defaults.js` |
| `F-Backgrounds` | desk options (4a chosen) | `Desk.jsx` |
| `F-Type` | type scale | `fonts.css` |
| `F-Stickers` | the sticker sheet (groups G1–G5, labels) | `content/stickers.json` |
| `F-CompA` | buttons, fasteners, photo frames | gallery |
| `F-CompB` | full-page wish styles | `wishes/Letter.jsx` (newspaper style chosen) |
| `F-CompC` | live sticker playground, menu, player, cursor | `StickerLayer`, `StickerMenu`, `CursorTrail` |
| `F-CompD` | envelopes, seals, timeline eras, games, platformer | reference |
| `F-Sample` | a sample page | reference |
| `F-Tokens` | tokens for the build (colours, type, shadows, motion) | `tokens.css` |

**Count check:** the export has 39 design files (8 phase pages, 8 scenes, 10 shared components, 13
foundation boards). The final audit's "38 components" matches all of these except the top-level
`Phase 1 v2` board page, which only imports the other boards. Nothing it imports is missing.

## Behaviour code: ported or new
| Behaviour | Approach |
|---|---|
| Sticker physics (gravity, bounce .35, sleep, collisions) | ported from `StickerPhysics` |
| Sticker menu, peel-off curl, duplicate, bring to front | ported from `StickerPhysics` |
| Turn handle, Shift + wheel, Safari gesture rotate | ported from `Sticker` / `StickerPhysics` |
| Sticker saving, reset, fixed page stickers, resize handle | new (brief 3.8) |
| Music-note trail | ported from the scenes' `componentDidMount` |
| Shake to develop | ported from `DarkroomScene.shake()` |
| Era layouts, photo frame maths | ported from `TimelineScene.layout()` / `fw()` / `fh()` |
| Red thread (pin to pin, sag) | ported from `JokesScene` |
| Wordle colouring, Connections and Cryptic logic | new (the design shows states only) |
| Confetti | `canvas-confetti` (the design has static confetti frames only) |
| Page turn | new, using the design's 450 ms / cubic-bezier(0.65,0,0.35,1) and three keyframes |
| Envelope flap and rising journal | CSS keyframes from the Phase 2 annotations |

## Assets
All referenced assets exist in `handoff/assets/`: `bg/gingham.jpeg`, the textures in `tex/`
(grain, film-grain, leather-brown, kraft, newsprint, linen-navy, linen-violet, linen-white, denim-desk)
and 39 sticker PNGs (three of them retired). Missing from the export: **no real photos, videos, songs
or names** (expected; they come through `inbox/`). Fonts load from Google Fonts.

## Conflicts found between the design and the brief
- The back pages' back cover is navy in the design; the navy cover is retired, so it is brown leather (see `DEVIATIONS.md`).
- The music-note trail in the scenes uses 18–28 px multicoloured notes; the brief locks 14–18 px lavender and white.
- The shake polaroid in the design develops over 2,400 px; the brief says about 1,200 px.
- The design has no navigation to the back pages from the jokes; a handwritten link was added.
