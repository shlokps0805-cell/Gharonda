# Adding content to Neha's journal

Everything you see on the site comes from two places:

- **`content/`**: text files (`.json` and `.md`) with names, wishes, songs, jokes and games.
- **`public/media/`**: the actual photos, videos and sticker images.

You never need to touch the code in `src/`.

> **The easiest way:** drop whatever you have (Google Form exports, Word docs, photos, a list of
> Spotify links) into the `inbox/` folder and ask Claude Code: *"run the content intake on the inbox"*.
> It will sort everything into the right files, check it, and tell you what is still missing.

Every placeholder that is still waiting for real content says **SAMPLE** (or "Friend 1", "Friend 2"…).

---

## Before you start: two rules
1. **Never change an `id`** once the site is live (for example `"id": "friend-3"`). Saved things like
   opened envelopes and sticker positions are linked to it. Change names and text freely.
2. After any change, run **`npm run check`** (inside the `neha-journal` folder). It lists any mistakes
   in plain words, for example a photo file name that does not match.

JSON files are picky: text goes in "double quotes", items are separated by commas, and there is **no
comma after the last item** in a list. If `npm run check` says a file "is not valid JSON", look for a
missing or extra comma near the line it mentions.

---

## Friends (names, colours, handwriting) · `content/friends.json`
```json
{ "id": "friend-1", "name": "Asha", "colour": "#7A1F2B", "colourName": "wine", "hand": "caveat", "order": 1 }
```
- `colour` is their envelope and letter colour. `colourName` appears as "you're wine to me".
- `hand` is `caveat` or `kalam` (two handwriting fonts). Leave it out to alternate automatically.
- `order` decides the envelope order. Text on their colour turns white or dark automatically.

## The cover and other site text · `content/site.json`
- `coverPhoto`: the big photo on the cover, e.g. `"photos/cover/cover.jpg"` (put the file in `public/media/photos/cover/`).
- `coverNote`: the white note on the cover. `coverNote2`: the smaller lilac note under the ribbon (leave it `""` to hide it).
- `groupPhoto`: the photo of everyone (contents page, wishes page, back pages).
- `fromLine`: the name on the envelope's "by ____" line.
- `contentsWelcome`: the welcome note on the contents page.
- `mixtapePhotos`: up to five photos for the cassette case (the first is the big black-and-white portrait).
- `spotifyPlaylistUrl`: link for the "save to your Spotify" button (the button hides while this is empty).
- `nicknames`: e.g. `["nehu", "neh"]`. Typing one anywhere makes stickers rain.
- `easterEggs.nameClicks.note`: the secret note that appears after clicking her name five times.
- `easterEggs.secretKeys`: set `"on": true`, a `sequence` (e.g. `"happybirthday"`) and a `message`.
- `envelopeFont`: `Great Vibes` (default), `Alex Brush`, `Parisienne` or `Mrs Saint Delafield`.

## Timeline photos · `content/timeline.json`
Each era looks like this:
```json
{
  "id": "the-trip", "name": "the trip", "shortName": "the trip", "year": "2019",
  "description": "one bus, six of us, zero plans",
  "layout": "feature-grid",
  "photos": [
    { "file": "photos/the-trip/01.jpg", "caption": "beach, again", "takenBy": "friend-2", "alt": "Neha at the beach" }
  ],
  "video": { "file": "photos/the-trip/clip.mp4", "poster": "photos/the-trip/clip.jpg" }
}
```
1. Put the photos in `public/media/photos/<era id>/` (for example `public/media/photos/the-trip/01.jpg`).
2. Add one line per photo to that era's `photos` list. `takenBy` is a friend id. `caption` and `alt` are optional.
3. Run `npm run images` (makes fast, small versions) and `npm run check`.

**Even easier:** add `"photosFromFolder": true` to an era. Then just drop photos into its folder and run
`npm run images`; they appear automatically (you can add captions later).

- `layout` is one of `scrapbook`, `polaroid-scatter`, `feature-grid`, `photobooth-wall`, `pinboard`.
  Leave it out and the site picks one so neighbouring eras look different.
- Each layout has 10 designed spots; more photos go into a tidy "more from this era" grid.
- `video` can be a YouTube video instead: `"video": { "youtube": "VIDEO_ID" }` (the part after `v=` in the link).
- `notes` (optional) is a list of handwritten notes for the page.

## Darkroom photos · `content/darkroom.json`
Seven sections, in order: `on-film`, `photobooth-chaos`, `give-it-a-shake`, `flash-on`, `the-outtakes`,
`slideshow`, `cover-girl-material`. Same idea as the timeline: put files in `public/media/darkroom/<section id>/`
and list them, or use `"photosFromFolder": true`. A section with no photos is hidden. Photobooth strips
use four photos each.

## A wish · `content/wishes.json` + `content/wishes/<friend id>.md`
1. The letter itself goes in a text file named after the friend, e.g. `content/wishes/friend-4.md`.
   Write normally; leave an empty line between paragraphs. `*like this*` makes italics.
2. In `wishes.json` you can set the headline, a photo and a caption:
   ```json
   { "id": "friend-4", "friend": "friend-4", "headline": "A note from Asha", "photo": "wishes/friend-4.jpg", "photoCaption": "us, 2019" }
   ```
3. **A video wish:** `"video": { "file": "wishes/friend-4.mp4" }` or `"video": { "youtube": "VIDEO_ID" }`,
   plus an optional `"videoNote"`. For a vertical phone video add `"vertical": true`.
A friend with no letter yet shows "letter coming soon", so nothing breaks.

## A song · `content/songs.json`
```json
{ "id": "song-16", "title": "Song title", "artist": "Artist", "spotify": "https://open.spotify.com/track/...", "pickedBy": "friend-3", "reason": "the goa bus song", "side": "A" }
```
- `spotify`: in Spotify, click **⋯ > Share > Copy Song Link** and paste it here.
- `side` is `A` or `B` (leave out to split the list in half). Songs with no Spotify link are listed but cannot play.
- **Quickest way to add every link:** in the Spotify desktop app open the playlist, click one song, press Ctrl+A (Cmd+A on a Mac), then Ctrl+C. That copies every song's link, in order; paste them here (or send them to Claude).
- While no song has a link, the player plays the whole playlist from `site.json` → `spotifyPlaylistUrl` instead (play and pause work; Spotify moves through the songs by itself, so next and previous do nothing).

## A joke · `content/jokes.json`
```json
{ "id": "joke-11", "text": "the joke", "submittedBy": "friend-5", "lore": "the origin story on the back" }
```
Leave `lore` as `""` and the note stays face up (it only flips when there is an origin story).

## Stickers · `content/stickers.json`
1. Save a transparent PNG or WebP (background already removed) in `public/media/stickers/`.
2. Add one line to `sheet`:
   ```json
   { "id": "my-sticker", "label": "my sticker", "file": "stickers/my-sticker.png", "group": 1 }
   ```
It then joins the sticker pile that falls on the cover. To place it on a page, add it to that page's
`fixed` list under `pages` with `x`, `y` (top-left on the 1440 × 900 page), `size` and `angle`.

## Games · `content/games/`
- **Connections** (`connections.json`): a puzzle has 4 groups, each with a `name`, 4 `words` and a
  `level` 1–4 (yellow, green, blue, purple). Add a new puzzle at the end; the newest is shown first.
- **Wordle** (`wordle.json`): add `{ "date": "2026-10-12", "word": "CHAIR" }` lines. The site uses
  today's word (India time) or the most recent past one. Words can be 4 to 7 letters. `hint` is the clipped note.
  Add `"note": "bc u are built"` to a word to show an extra line once that word is solved or revealed.
- **Daily cryptic** (`cryptic.json`): one clue per date:
  ```json
  { "date": "2026-10-12", "number": 285, "clue": "Drink hidden in beach air (4)", "answer": "CHAI",
    "definition": "Drink", "highlight": "beach air", "hidden": "ch ai",
    "hints": ["look at the first word.", "hidden word: the answer is inside the clue.", "the third letter is A."],
    "wordplay": "hidden word: beaCH AIr", "explanation": "“hidden in” tells you the answer is inside the next words." }
  ```
  `definition`, `highlight` and `hidden` must be copied exactly from the clue.
  Optional: `"par": 4`, a space in the answer for two words (`"BIO LAB"` shows a gap after the third box),
  and hints with their own titles: `{ "title": "FODDER", "text": "..." }`, or `{ "title": "LETTERS", "letters": true }`
  for a hint that shows one more letter of the answer each time it is tapped. Any number of hints is fine.
- **Neha's World** (`neha-world.json`): `embedUrl` is the game's link. The current game is the single file
  `public/games/nehas-world.html` (`"embedUrl": "games/nehas-world.html"`); to swap it, replace that file.

## All the little labels · `content/ui-text.json`
Every button and heading label ("BACK TO ALL LETTERS", "tap the seal"…) lives here and can be reworded.

---

## Check everything
Inside the `neha-journal` folder:
```
npm run check
```
It prints a summary like *"Timeline: 5 eras, 46 photos. Wishes: 12 (2 videos). Songs: 18."* and lists
any problems. It must say **0 errors** before you publish.

## Publish an update
The site is on Render and connected to GitHub, so **pushing a commit publishes it automatically**
(it takes a minute or two). Ask Claude Code: *"check the content, build, and push the update"*.
If you edit files on github.com directly, Render redeploys as soon as you commit.
