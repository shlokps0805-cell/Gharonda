# Deviations

Every place the build intentionally differs from the design files or the final plan, one line each.

## Hosting and setup
- **Hosting is Render, not Vercel/Netlify** (the students asked for Render). `render.yaml` at the repo root replaces `vercel.json`/`netlify.toml`, with the same cache rules (a year for `/assets/` and `/media/optimized/`, no caching for `index.html`) plus an `X-Robots-Tag: noindex` header.
- **The site lives in `neha-journal/`**, not the repository root, because the repository already holds an unrelated project (the Gharonda presentation), which is left untouched. Render builds from that folder (`rootDir`).
- **Built in one pass instead of stopping after each phase**, because the launch is midnight IST tonight (11 Oct 2026). Every phase was still checked in the browser; see `PLAN.md`.
- **Sticker images are WebP, at most 640 px on the long side** (from the exported PNGs, 10 MB → under 1 MB). Pixels are not redrawn, recoloured or re-cut; only scaled and compressed.
- The three retired stickers (navy disco ball, both rats) are not copied into `public/media/stickers/`.
- The Wordle allowed-words list (`src/games/words5.json`, 12,578 five-letter words) is taken from the MIT-licensed `word-list` package by Sindre Sorhus. It is stricter only for five-letter answers; 4, 6 and 7-letter answers accept any guess of the right length.

## Global
- **Brown leather boards behind every open page** (and darker page edges under dark pages), so the journal always reads as one brown book with the spiral at the binding; the designs drew the open pages straight on the desk.
- **Reload keeps her on the section she was on.** A fresh link (no hash) lands on the Cover; a reload keeps the current `#/section`. This is a small, deliberate clarification of "returning visits load the Cover" (brief 3.1).
- **Music-note trail:** ported from the design scenes' code, but with the brief's locked values (14–18 px notes in lavender and white, ±12° tilt) instead of the scenes' 18–28 px multicoloured notes.
- **Cursor hover state:** over anything clickable the cursor becomes the 32 px glass-star sticker, as the Phase 3 global-frame board shows.
- **Sound on/off pauses and resumes** the music: the Spotify embed has no volume control.
- **Page turn:** the turning sheet shows the outgoing page's paper colour (not a copy of its content), turning on the left spiral for single pages and the middle spiral for spreads.
- **Era pages, wishes and games have no page-turn on every sub-step**: the turn plays when the page itself changes (tab, contents link, opening a letter).

## Opening
- **Slower than the Phase 2 annotations**, at the students' request: the seal presses in and splits (900 ms), the flap opens (1 s), the journal bounces up out of the envelope (1.5 s), grows into the birthday cover (1.5 s, letters shimmer at 70 ms each) and the confetti stickers fly out and then fall away. Auto-continue after 5 s instead of 4 s.
- The cover's fixed stickers (ribbon, ticket, rosette, date stamp…) appear when the opening finishes, as the design's "settles" frame shows only the physics pile.
- The sticker pile uses the cover floor (resting below the journal, clear of the player zone) from the start of step 4, instead of first resting on the full floor and then moving.
- "Open your journal" finishes the opening and opens the contents spread; waiting 4 s finishes it on the Cover. With reduced motion there is no auto-advance (as designed).
- **Replay** drops a separate, unsaved pile during the replayed opening; afterwards the cover loads her saved stickers untouched.

## Stickers
- The right-click menu is drawn above the whole page, closes on any click outside it, when another sticker's menu opens or on scroll, as well as with Esc (the design only closed it with Esc).
- Loose stickers resting on one that is moved, peeled or resized fall back down instead of hanging in the air; loose pile stickers saved mid-fall settle again on the next visit.
- **Resize handle is at the sticker's top-right corner** (the design's lavender knob), because the turn handle already sits at the bottom-right.
- New stickers added without a pixel size are measured once in the browser so their aspect ratio is right.
- The opening's 13 desk stickers can be dragged too (they are a sticker layer like every other page).
- The design's sticker drag on its own (`Sticker` movable) is not used; `StickerLayer` handles all dragging, so every sticker behaves the same.

## Sections
- **Timeline, photobooth wall:** each 4-frame strip uses four different photos, so with 9 photos the page shows two strips plus singles (the design showed three strips of placeholders).
- **Timeline:** with more than five eras the clusters lay out in two smaller rows with a straight pencil line; with exactly five they use the design's spots and hand-drawn line.
- **Timeline:** an optional `shortName` field gives the year buttons and switcher a shorter label ("middle school"), as in the design.
- **Darkroom:** the film strips in the header show the first "on film" photos once real photos exist.
- **Darkroom, give it a shake:** polaroids start at the design's develop ramp (95% → 0% darkness across the row) and develop over about 1,200 px of shaking (the design's code used 2,400 px; the brief says 1,200).
- **Wishes:** the photo block in a letter only shows when the wish has a `photo` or `photoCaption`.
- **Wishes:** the "that's everyone" line lets clicks through, so the envelopes can still be opened again.
- **Wishes:** left and right arrow keys move between letters.
- **Playlist:** the cassette insert photos come from `site.json` → `mixtapePhotos`; the nickname scribble uses the first nickname in `site.json`.
- **Playlist:** the "save to your Spotify" button is hidden until `spotifyPlaylistUrl` is set.
- **Back pages:** the back cover is the same **brown leather** as the front, not navy (the navy cover is retired).
- **Back pages:** reached from the contents page (design link) and from a handwritten "the back pages →" link at the end of the joke board (the jokes design shows none).
- **Back pages:** "tap the card" hint under the empty library card, so she knows to click it.
- **Jokes:** "By person" opens a small menu of the friends who submitted jokes.
- **Cryptic:** optional `highlight` and `hidden` fields in `cryptic.json` mark the wordplay (hint 2) and the hidden answer (when solved), which the design hard-coded for its sample clue.
- **Cryptic:** the 14-day streak shows ten days up to today plus four future days, as designed.
- **Neha's World:** the best score is shown if the game reports it with `postMessage({ nehaWorldBest: n })`.

## Not built / still placeholder
- Phone layouts were never designed: phones get the "made for a laptop" card, then the scaled stage.
- Real content (names, photos, songs, wishes, jokes, game clues) has not arrived; everything still says SAMPLE / Friend N.
- No WebKit (Safari engine) browser is installed in the build environment, so the Safari pass could not be run here; the code follows the Safari rules in the brief (prefixed masks and hyphens, feature-detected gesture events) but needs a check on a real Mac.
