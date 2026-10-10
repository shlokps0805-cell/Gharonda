# Claude Design brief: "NEHA, The Birthday Issue" (version 2)

## 0. Read this first: your role and how to work

You are the art director and lead designer for a one-of-a-kind birthday website, designed as a digital magazine for a girl named Neha. You will design every screen, state and component of the site, so that a separate build step (Claude Code) can turn your designs into a working website without guessing.

The website launches at midnight IST on 11 October 2026. Time is short, so quality comes from working in focused phases, not from doing everything at once. The level of finish must stay the same from the first phase to the last: the final screens deserve the same care as the cover.

### Working rules

1. **Work in the phases in section 10, one at a time.** At the end of each phase, run the three-layer audit (section 11), fix what it finds, then present the phase and **stop and wait** for my reply. Do not start the next phase until I say "continue" or give feedback.
   - Exception: if I write "continue through phase X", you may run several phases back to back, still auditing each one.
2. **Build the design system first (Phase 1) and reuse it everywhere.** Every later screen must use the same colour tokens, type styles, stickers and components, so that one change in the system updates the whole site.
3. **Name everything clearly and consistently** using the naming scheme in section 12. I will comment on frames by name.
4. **When I give feedback, change only what I asked for.** Do not redesign untouched parts. After a change, list in one or two lines what changed.
5. **Keep all text as live, editable text**, not baked into images (except the ransom-note headings, which may be built from shapes but must keep their wording noted beside them).
6. **Use placeholders where real content does not exist yet** (section 9). Real photos, stickers of her objects and wishes will be swapped in later.
7. **Annotate interactions and animation** beside each frame: trigger, what moves, duration, easing. The build step depends on these notes.
8. **If something in this brief is impossible or would look worse, say so briefly and propose the better option**, instead of silently changing it.
9. **Ask questions only if you are truly blocked.** Otherwise make the best choice, note it in the phase summary, and keep going.

### Inputs you may receive alongside this brief
- **Sticker style reference image(s):** study the style closely (section 3.3), but never copy the images.
- **Photos of Neha's objects:** turn them into black-and-white die-cut stickers in the same style as the sticker set.
- **Real photos of Neha and her friends:** use them in place of placeholders where they fit; keep them out of reserved zones.
- **The "About Neha" notes in section 1.1**, if filled in. Use them to make the art personal (especially the cover, mixtape art and stickers).

If any input is missing, use the placeholders in section 9 and carry on.

---

## 1. Project context

- **What it is:** a birthday website for Neha, made by her friends, styled as one special magazine issue called "The Birthday Issue".
- **Who sees it:** Neha, on a laptop. Primary design size is **1440 × 900**. Layouts must also hold at **1280 wide** and **1920 wide** (content stays centred within a maximum width of 1600 px on very wide screens; the background continues). Simplified phone versions come in the last phase, because her friends will open it on phones.
- **Browser:** built and tested in Chrome; must also work in Safari. Avoid design choices that depend on heavy blur, large animated shadows or many stacked filters.
- **Main experience:** she opens a sealed envelope, types a nickname, breaks a wax seal, gets a "Happy Birthday" moment with confetti, then lands on a magazine cover. Index tabs lead to seven sections: Cover, Timeline, Darkroom, Wishes, Playlist, Jokes, Games.
- **Expected content amounts (design for these):** about 12 friends (design must also work for 8 to 20), 7 eras, 8 to 20 photos per era, 50 to 80 Darkroom photos, 12 to 25 songs, 20 to 40 jokes.

### 1.1 About Neha (filled in by the team; use what is here, use placeholders for the rest)
- Nicknames: [to be added]
- Objects that represent her: [to be added, for example a drink she always orders, an accessory, a pet, a doodle]
- Things she loves (music, shows, places, aesthetics): [to be added]
- Her age this birthday: [to be added; if blank, do not show an age anywhere]

When these are blank, design the slots so they are easy to fill later (clearly labelled placeholders).

---

## 2. Creative direction

### 2.1 The feeling: "a chic magazine at a party"
- **Chic:** the dark charcoal base, a high-contrast fashion-magazine serif, restraint, generous space in the centre of each screen. Think of the layout confidence of a fashion magazine cover and editorial spread: big type, deliberate empty space, one strong image.
- **Bubbly:** sharp black-and-white die-cut stickers, springy motion, small cherry and gold pops, handwritten notes in friends' voices.
- **Density:** between minimalist and maximalist. Many elements on a screen, but arranged so the **centre breathes** and the **busy clusters live at the edges and corners**.
- **Physical:** everything should feel like real objects on a dark table: paper, polaroids, tape, wax, vinyl stickers, film, a cassette. Small, tight shadows. Fine paper grain on the background. Paper has slight texture and soft edges, not flat rectangles.
- **Personal, not template-y.** Every screen should have at least one detail that could only belong to Neha: a nickname, one of her object stickers, a friend's handwriting, an inside reference. Avoid generic birthday templates: no balloons-and-cake clip art, no rainbow confetti, no bunting banners.

### 2.2 Mood words
- **Yes:** editorial, glossy, inky, tactile, cheeky, collected, warm, confident, a little rebellious.
- **No:** childish, pastel-sweet, corporate, sterile, cluttered, neon, gothic, generic.

### 2.3 Composition principles (apply to every screen)
- One clear focal point per screen.
- Clear hierarchy: masthead or heading, then main content, then decoration.
- A 12-column grid on the 1440 frame, 96 px side margins (excluding the reserved zones below), 24 px gutters.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. Do not invent other values.
- Rotations on paper items and stickers stay within −8° to +8°, varied so nothing looks mechanically aligned. Text blocks that must be read stay within −3° to +3°.
- Overlap is allowed only where it is intentional collage overlap, and it must never hide text, faces in photos, buttons or the focal point. Intentional overlap should cover no more than about a quarter of the item underneath.
- **Reserved zones (nothing else may sit in them):**
  - Right edge, 72 px wide, full height: index tabs.
  - Bottom-left, 280 × 80 px, 24 px from the left and bottom edges: mini mixtape player.

---

## 3. Design system

### 3.1 Colour: the allowed range

**Core palette (Direction A, approved). This is the default on every screen.**

| Token | Hex | Use for | Never for |
|---|---|---|---|
| charcoal | #1F1C22 | Main background everywhere | Text |
| smoke | #2E2A32 | Cards, panels, joke board, game table, dividers | Things that must stand out |
| cream | #F3ECE2 | All "paper": envelope, letters, polaroid frames, notes, labels. Main text on charcoal | Large flat background areas |
| cherry | #B3121E | Hero colour: wax seals, active tab, buttons (with cream text), underlines, cherry-accent stickers | Small text on charcoal (contrast too low) |
| gold | #C8A24A | Tiny touches: issue date, stars, small labels, "correct" moments | Large areas, long text |

**Supporting shades**

| Token | Hex | Use for |
|---|---|---|
| ink | #111014 | Black in stickers, ink on paper, text on cream |
| ash | #8C8791 | Secondary text on charcoal: captions, "picked by", timestamps |
| deep-cherry | #7E0C16 | Hover and pressed states of cherry, envelope shading, seal shadow |
| cream-shade | #E2D6C4 | Folds, the back of notes and envelopes, paper edges, lines on letter paper |

**Extended options (from the client's colour list). Only in the places listed.**

| Token | Hex | Allowed places |
|---|---|---|
| night-plum | #261D2E | Alternative background for one section only (suggested: Playlist) |
| orchid | #9B6BD3 | One Connections group colour; at most two stickers on the whole site |
| lilac | #C9B3E6 | One Connections group colour; crossword current-word highlight; soft selected states |
| sunny-yellow | #F4C246 | Celebration moments only: puzzle solved, confetti in games, highlighter marks in the Darkroom |

**Friend colours (12 swatches, used only for each friend's envelope on the Wishes page).** Each friend picks the colour that represents Neha to them.
Cherry #B3121E, Wine #6E1A2B, Rose #D98A9A, Peach #E8A97E, Gold #C8A24A, Butter #EBD58A, Sage #9FAF8C, Teal #3E7C78, Sky #8DB3D1, Navy #26365A, Lilac #C9B3E6, Orchid #9B6BD3.

**Colour rules**
- Balance per screen: about 60% charcoal, 25% cream paper and black-and-white stickers, 15% cherry and gold.
- Per screen: cherry plus at most one other bright colour. Extended options never appear together on one screen.
- Reading text: cream on charcoal, ink on cream. Button text on cherry is cream.
- Stickers are black and white by default. About one in five gets a single cherry accent.
- Sage is not part of the site palette; it appears only if a friend picks it as their envelope colour.
- **Two planned exceptions to the one-bright-colour rule:** the Wishes envelopes (all 12 friend swatches together) and the Connections solved bars (gold, lilac, orchid, cherry). Keep everything else on those screens quiet (charcoal, cream, ink) so the colours read as intentional.

**Your colour task in Phase 1:** within this range, build three palette combinations (section 10, Phase 1), test them on the same sample screen, and recommend the best. Judge them on: how chic the screen feels, how well the black-and-white stickers pop, readability, and whether cherry stays the hero. Then produce a **section colour map**: for each section, its background, main accent and (if any) one extended colour.

### 3.2 Typography (free Google Fonts)

| Role | Font | Notes |
|---|---|---|
| Masthead, big headings | Bodoni Moda | High-contrast fashion serif. Masthead in capitals with wide tracking |
| Subheadings, cover lines | Fraunces | Italic for cover lines and pull-quotes |
| Handwritten notes, captions, wrong-nickname replies, labels on paper | Caveat | Never below 22 px |
| Body, buttons, tabs, game tiles | DM Sans | Tabs, buttons and small labels in capitals with 8 to 12% letter spacing |
| Special headings (3 only: "The Darkroom", "The Joke Archive", and the "NEHA" word sticker) | Ransom-note letters | Each letter cut from a different paper scrap and font: mostly black and cream, exactly one cherry letter per word |

**Starting type scale** (adjust if needed, but keep five sizes plus the masthead):
- Masthead: 180 to 220 px, Bodoni Moda.
- H1: 64 px, Bodoni Moda (section headings).
- H2: 36 px, Fraunces (subheadings, era titles, cover lines).
- H3: 24 px, Fraunces or DM Sans bold (card titles, song titles).
- Body: 17 px DM Sans, line height 1.5.
- Small: 13 px DM Sans capitals (labels, "picked by", counters).
- Handwriting: 24 to 40 px Caveat depending on use.

Close alternatives are fine if a font does not work, but keep the combination: high-contrast serif, editorial serif, handwriting, clean sans.

### 3.3 Stickers and decorations

**Reference style:** a Y2K retro black-and-white vintage vinyl sticker pack (if a reference image is attached, study it). It is a style reference only. Design original stickers; do not copy any product images.

**Sticker look**
- Die-cut shapes that follow the outline of the object, with a thick white border (about 6 px on a 120 px sticker), like real vinyl stickers.
- High-contrast black and white: photo cut-outs turned crisp black and white with deep blacks and clean whites, plus bold simple illustrations with thick outlines.
- A small, tight shadow (about 0 2 px 3 px at 35% black) so they sit on top of the surface.
- Sharp and clearly visible. Never faded, smoky, blurred or low-opacity.
- Hover state: a soft diagonal gloss highlight sweeping across the sticker (about 400 ms), and the sticker lifts 2 px.
- Sizes on the 1440 frame: small 64 to 88 px, medium 96 to 140 px, large 160 to 200 px (large only on the cover and envelope).

**Sticker set to design (Phase 1 sticker sheet, 26 stickers)**
- **Style motifs (16):** checkered heart, scribbled heart, disco ball, butterfly, headphones, crescent moon, classical statue bust (with a cheeky detail like sunglasses or a party hat drawn on), film camera, 8-ball, pair of dice, star cluster, alarm clock, vinyl record, cherries (cherry accent), lipstick kiss mark (cherry accent), cassette tape.
- **Word stickers (4):** "happy birthday" (bold DM Sans on a black pill), "birthday girl" (Caveat on a cream oval), "iconic" (Bodoni italic on a starburst), "NEHA" (ransom-note letters).
- **Her objects (6):** placeholders labelled "her object 1" to "her object 6", designed in the same black-and-white die-cut style (a simple silhouette with a label) so real photos of her things can be swapped in later. Where section 1.1 lists her objects, draw those instead.

**Paper decorations:** washi tape strips (cream, black-and-white check, cherry, slightly translucent with torn ends), paper clips (silver-grey), staples, a push pin (cherry head), torn paper edges, a postage stamp (with a tiny portrait placeholder and "NEHA · 11.10" printed), a barcode, ticket stubs, a red string.

**How many and where**
- Cover: 15 to 20 physics stickers (Neha can move them; show them resting along the bottom edge and corners).
- Every other screen: 4 to 8 fixed stickers and paper items per screen, only in margins and corners, never over text, buttons or faces in photos, taking up no more than about 10% of the screen.
- Section-specific stickers: headphones, record and cassette on Playlist; dice and 8-ball on Games; film camera and moon on Darkroom; postage stamps and lipstick kiss on Wishes; scribbled heart and alarm clock on Timeline; disco ball and "iconic" on Jokes.
- Her object stickers appear on every screen at least once (they are the personal thread through the issue).

### 3.4 Background
- Charcoal with a very fine paper grain (subtle, about 3 to 5% visible noise), so it feels physical and not flat digital black.
- No random shapes, no dot patterns, no smoky textures. Decoration comes only from stickers and paper items at the edges.
- Playlist may use night-plum (decide in the colour map).

### 3.5 Motion language (annotate on frames)
- **Springy entrances:** slight overshoot, for example cubic-bezier(0.34, 1.56, 0.64, 1) or an equivalent spring.
- **Calm exits:** ease-out, slightly faster than entrances.
- One main animation at a time; small details may move alongside.
- Timings: hovers 150 to 200 ms; page changes 350 to 450 ms; big reveals 600 to 900 ms; staggered items 40 to 80 ms apart.
- Reduced-motion version: simple fades of 200 ms, no movement, no confetti.

### 3.6 Components to build in Phase 1 (with all states)
- **Index tab:** cream paper tab about 64 px wide and 96 px tall, ink DM Sans capitals running vertically, a tiny sticker icon above the label. Icons: Cover (star), Timeline (alarm clock), Darkroom (film camera), Wishes (postage stamp), Playlist (cassette), Jokes (8-ball), Games (dice). States: default, hover (slides out 6 px), active (cherry, cream text, sticks out a further 12 px).
- **Buttons:** primary (cherry fill, cream capitals), secondary (cream outline on charcoal, or ink outline on cream), text link with cherry underline that draws in on hover. States: default, hover (deep-cherry or slight lift), pressed (pressed down 1 px). Height 44 px, padding 16 by 24 px.
- **Envelope:** closed with seal, seal cracked, flap open, letter sliding out. Two sizes: hero (about 560 × 360 px, for the opening) and small (about 200 × 130 px, for Wishes). Back of envelope shows the triangular flap and cream-shade folds.
- **Wax seal:** cherry wax with uneven edges and a stamped "N"; states: intact, soft pulse (glow ring in gold), cracked into two halves.
- **Photo frames:** polaroid (thicker bottom strip for a caption), photobooth strip (4 frames, cream border, small stamp at the bottom), 35 mm film frame (sprocket holes, frame number, orange date stamp), slide mount (cream square with a rounded window and tiny printed label), phone-camera selfie frame (rounded corners, small camera icons, timestamp), taped print (white border, tape on two corners), torn cut-out (rough edge, no border).
- **Paper:** torn cream note (front and back in cream-shade), lined letter paper (cream with faint cream-shade lines and a cherry margin line), handwritten label tag (with a hole and string).
- **Mini mixtape player** (280 × 80 px): a small cassette illustration on the left with two visible reels, song title (DM Sans, truncated with ellipsis) and "picked by" in ash, controls (previous, play or pause, next, sound on or off) in cream. States: paused, playing (reels turning), "press play" pulsing state (cherry ring pulsing around the play button, with a Caveat note "tap to start the music"), sound off.
- **Custom cursor:** default (a small cherry dot, about 8 px, with a thin cream ring, about 28 px); hover-on-clickable (turns into a tiny sticker, about 32 px, of one of her objects); a trail of 3 to 4 tiny gold sparkles that fade within 300 ms.
- **Sticker context menu (right-click):** a small cream paper card with ink DM Sans items: Pin here, Unpin, Bring to front, Hide this sticker. Hovered row has a cherry underline. Appears beside the cursor with a quick pop (120 ms).
- **Pinned sticker state:** the sticker with a small cherry push pin or a tape piece on top.
- **Hint toast:** a small torn note in Caveat that appears beside the first dragged sticker: "psst, right-click to pin it (two-finger click on a Mac trackpad)". Fades out after 5 seconds.
- **Game tiles and cells:** Connections tile (cream, ink DM Sans capitals) in default, selected (ink fill, cream text), and solved bar. Crossword cell (48 px) in empty, active (cherry outline), in-current-word (lilac fill), filled, correct (brief gold flash).
- **Stamps and toggles:** star toggle (outline, then filled gold with a small burst), "found" stamp (round, cherry ink, slightly rotated), "solved" stamp (rectangular, cherry ink, rough edges).
- **Lightbox:** the page dims to 85% charcoal; the photo shows large in a cream frame with a Caveat caption and "taken by Friend X" in ash; left and right arrows; counter like "3 / 14" in small DM Sans; close button (cream "×" in a circle). Keyboard arrows and Esc annotated.

---

## 4. Opening sequence (design each step as a keyframe)

| Step | What she sees | Animation to annotate |
|---|---|---|
| 1. Envelope | Charcoal screen. One hero envelope centred. Cherry wax seal stamped "N". "For Neha" handwritten in the top-left of the envelope front. Stuck on like a real letter: a postage stamp sticker top-right, a checkered heart sticker and a "birthday girl" sticker on the lower corners. Two or three of her object stickers scattered on the charcoal around it. | Envelope floats about 6 px up and down on a 4 s loop. A soft light highlight shifts across the paper as the cursor moves. |
| 2. Nickname gate | In the address area of the envelope: "Who is this for?" in Caveat, with an ink line to type on and a blinking cherry caret. | Correct: the typed name turns gold, the seal gives one soft gold pulse, and a small Caveat note "tap the seal" appears with an arrow pointing to it. Wrong: the envelope wiggles left and right (300 ms) and a funny reply appears below in Caveat (replies rotate), then the field clears. |
| 3. Breaking the seal | She clicks the seal. The music starts on this click. | Seal presses in, cracks into two halves that fall away and fade; the flap folds open in 3D (500 ms); a cream card slides up out of the envelope (600 ms, springy). |
| 4. Happy birthday | The card grows to fill the screen (a cream paper card with a fine border, small stickers on its corners): "Happy Birthday, Neha" in large Bodoni, one handwritten line beneath, "11.10.2026" in gold. | Letters drop in one by one with a bounce (40 ms apart). Confetti bursts from both lower corners: about 120 small paper bits (rectangles, circles, tiny stars) in cherry, gold and cream, plus 15 to 20 black-and-white stickers mixed in. |
| 5. Confetti to stickers | Paper bits flutter and fade over about 2 seconds; the stickers fall and settle along the bottom edge. | Physics: land, bounce, settle. These stickers stay and become the cover's physics stickers. |
| 6. Into the cover | A small "open your issue" button appears (auto-continues after 4 seconds). | The card turns over like a magazine page to reveal the cover; index tabs slide in from the right one after another (60 ms apart); the mini player slides up into the bottom-left. |

Also design:
- The gate in four states: empty, typing, wrong with reply, correct.
- The **returning-visit** version: the same envelope with a small "skip to the cover" link in the top-right corner, and the nickname already filled in (her browser remembers her).

---

## 5. Always present on every main screen
- **Index tabs** in the right reserved zone, in this order: COVER, TIMELINE, DARKROOM, WISHES, PLAYLIST, JOKES, GAMES (component in 3.6).
- **Page change:** the current page slides left and tilts slightly (about 2°) while the next slides in from the right, like turning a page (about 400 ms).
- **Custom cursor** (3.6).
- **Mini mixtape player** in the bottom-left reserved zone (3.6). It keeps playing across all sections.
- **Today's hidden joke:** a small folded note hidden in one spot on the site each day (6.7).
- **Decorative stickers** per the rules in 3.3.

---

## 6. Screens and what each must contain

### 6.1 Cover (home)
- **Masthead** "NEHA" across the top in Bodoni capitals, very large, cream. The top of the cover photo may overlap the bottom of the masthead slightly (a classic magazine layering), as long as every letter stays readable.
- **Issue line** beneath the masthead in small gold DM Sans capitals: "THE BIRTHDAY ISSUE · 11 OCTOBER 2026 · VOL. 1 · MUMBAI EDITION".
- **Cover photo** slightly right of centre: a large print (about 520 × 660 px) in a cream frame, tilted about 3°, with washi tape at two corners.
- **Lead cover line** beside the photo in large Fraunces italic: "everything we love about her, in one issue".
- **Cover lines** down the left in Fraunces italic, each with a small gold page number like a real magazine, each linking to a section:
  - "Then, now, always" · p. 02 (Timeline)
  - "Rare footage inside" · p. 03 (Darkroom)
  - "Letters from her people" · p. 04 (Wishes)
  - "The soundtrack of Neha" · p. 05 (Playlist)
  - "Exclusive: every inside joke, ranked" · p. 06 (Jokes)
  - "Can you solve her?" · p. 07 (Games)
- **Barcode sticker** in the bottom-right (above the reserved zones), magazine detail and easter egg.
- **Hidden-joke stamp:** a small round cherry-ink stamp near the cover lines: "today's joke is hiding somewhere".
- **Physics stickers** (15 to 20) resting along the bottom edge, including at least two of her objects.
- **"reset stickers"** text link in small ash text at the very bottom centre.
- **States to show:**
  - Cover-line hover (cherry underline draws in, page number turns cherry).
  - Cover photo tilted toward the cursor (gentle 3D tilt, at most 6°).
  - A sticker being dragged (lifted, larger shadow, gloss).
  - The right-click context menu open on a sticker.
  - Two pinned stickers placed by "Neha" higher on the page.
  - The first-drag hint toast.

### 6.2 Timeline
- **Header:** "Then, now, always" in Bodoni (H1) top-left, with a Caveat line: "scroll to time travel →".
- **Strip view:** a horizontal row of 7 eras hung on a thin cream string with small wooden or metal clips, like photos drying, across the middle of the screen. Each era is a small preview collage (about 260 × 300 px) of 3 to 5 photos **in the same style as that era's spread**, so the preview hints at what opens. Each has a cream tag with era name in Caveat and years in small DM Sans. A thin cream progress line at the bottom shows position, with a small cherry marker. Scrolling down moves the strip sideways (annotate).
- **Hover state:** the hovered preview fans out (photos spread apart and straighten), its tag lifts, and the other eras dim to about 60%.
- **Era spreads:** clicking an era zooms its preview up into a full-screen collage spread. Every spread has:
  - An era header: era name in Bodoni H1, years in gold small capitals, and one handwritten line describing the era (Caveat).
  - **Bigger photos** (2 to 3 times preview size) and every photo and video from that era (8 to 20 items). The spread may be taller than one screen and scroll vertically.
  - Handwritten captions on hover, with "taken by" in ash.
  - Video tiles with a cherry circular play button; videos play in place.
  - A "back to the timeline" tab on the left edge (Esc also closes), and small "previous era" and "next era" arrows so she can move between spreads directly.
- **Seven spread layouts**, each clearly different in structure, not just decoration:

| Layout | Look | Entrance animation |
|---|---|---|
| Scrapbook page | A large cream paper sheet on charcoal; photos taped at angles; handwritten notes, doodled arrows and underlines in ink between them; a few cut-out words | Photos drop on one by one; tape sticks on after; doodles draw themselves |
| Photobooth wall | Five or six 4-frame vertical strips side by side at varied heights, some overlapping slightly; small stamps at the bottom of each | Strips slide down as if printing from a booth |
| Film contact sheet | A black film sheet with rows of small frames and frame numbers; three frames circled in cherry grease pencil and shown as large prints beside the sheet | Frames flash in like a camera; circles draw themselves; prints slide out |
| Polaroid table | Large polaroids scattered on the dark table, overlapping, captions written on the bottom strip | Polaroids slide in from the edges and land with a small bounce |
| Editorial spread | One huge hero photo filling one side, a Fraunces italic pull-quote, and a neat grid of smaller photos with thin cream borders on the other side | Hero fades up; grid ripples in |
| Corkboard | Photos pinned to a dark board with cherry push pins, linked with red string, plus ticket stubs and small notes | Pins pop in; string draws between them |
| TV room | A retro television (black-and-white illustration) playing an era video, photos stuck around the TV frame and on the wall around it | TV flickers on; photos pop out around it |

- **Lightbox** (3.6) opened from a spread.
- **Placeholder eras:** "The beginning", "Grade 8", "The trip", "Summer of chaos", "Last year", "Now", "Bonus round". Assign layouts so no two neighbours share one.

### 6.3 Darkroom (photo wall)
A long vertical scroll of photos grouped by **style, not date**: the Timeline is about when; the Darkroom is about mood. Expected length: about 6 to 8 screen heights.
- **Top:** "The Darkroom" in ransom-note letters, a small red safelight glow at the top centre (the only glow on the site), and a line of film strips hanging from clothespins across the width. A Caveat line: "developed with love".
- **Style index:** under the header, eight small sticker-style labels (one per section) that jump to each section when clicked.
- **Below:** eight style sections flowing down the page as loose clusters across the width (not a rigid grid), each with a Caveat label and a sticker or two beside it, and about 96 to 128 px between sections. Some sections drift slightly slower or faster than the scroll (annotate parallax, at most 15% difference).

| Style section | Label (Caveat) | Look | Behaviour to annotate |
|---|---|---|---|
| Selfies | "selfies, obviously" | Phone-camera frame (rounded corners, tiny camera icons, timestamp) | White flash blink on entering view; hover shows the caption as a text-message bubble |
| Film shots | "on film" | 35 mm borders, sprocket holes, frame numbers, warm grain, orange date stamp | The strip slides sideways while scrolling; hover enlarges a frame |
| Photobooth | "photobooth chaos" | 4-frame strips with cream borders and a small stamp at the bottom | Strips "print" downward out of a slot |
| Dissolving polaroids | "give it a shake" | Polaroids that start dark and blurry, then develop into the photo | Develop on entering view (about 2 s); hover develops faster |
| Disposable camera | "flash on" | Harsh flash look, high contrast, sunny-yellow date stamp | Shutter blink on appearing |
| Contact sheet | "the outtakes" | Grid of tiny frames on black with frame numbers | A circular loupe (about 160 px, 2× zoom) follows the cursor |
| Slide film | "slideshow" | Photos in cream slide mounts on a softly lit lightbox panel | Slides drop onto the lightbox |
| Magazine cut-outs | "cover girl material" | Photos with torn and cut edges, taped onto paper with cut-out headline words | Pieces flutter in and settle |

- Each section shows 6 to 12 photos.
- Hover on any photo: lifts and straightens. Click: the lightbox, which browses the whole Darkroom.
- A small floating "back to top" film canister at the bottom-right (above the reserved zones).
- Design as one long frame plus close-up frames of each section's states.

### 6.4 Wishes
- **Header:** "Letters from her people" in Bodoni with a Caveat line beneath: "one from each of us. open them all."
- **Counter:** small DM Sans capitals: "3 OF 12 OPENED".
- **Envelope grid:** a loose grid of small envelopes (4 or 5 per row, rows staggered, each rotated slightly), each in the colour that friend picked for Neha (3.1). On the front: the friend's name handwritten, a small wax seal in a darker shade of the envelope colour, and postage-stamp stickers on some.
- **Contrast:** name text is cream on dark swatches (Wine, Navy, Teal, Cherry, Orchid) and ink on light ones. Dark swatches get a thin cream edge so they stand out from the charcoal.
- **States:**
  - Default and hover (lifts and sways).
  - Opening: seal cracks, flap opens, letter slides up.
  - **Letter open (text):** the page dims to 80% charcoal; a lined cream letter in the centre (about 640 px wide) with "Dear Neha," at the top, the wish in Caveat, the sign-off "love, Friend 1", a small line in the friend's colour reading "you're cherry to me" (using that friend's colour name), and one sticker in the corner.
  - **Letter open (video):** the same letter with a short note and the video inside a polaroid frame, with play controls.
  - Letter controls: "fold it back" (and Esc), plus previous and next arrows to read the letters in order.
  - Opened envelopes look opened (flap up, seal broken).
- **End state:** when all are opened, a handwritten note appears at the bottom: "that's everyone. we love you."
- Show 12 envelopes using all 12 swatches so the colour harmony can be judged.

### 6.5 Playlist (the mixtape)
- **Header:** "songs that sound like neha" in Bodoni, with a Caveat line: "made by her people, side A and side B".
- **Left: the cassette case and mixtape art.** A large cassette case, slightly open, with the cassette sliding halfway out.
  - **Mixtape cover art (the case's front insert, the most personal art on the site).** Design it like a real handmade mixtape insert:
    - A black-and-white cut-out collage of Neha: 3 to 5 photo cut-outs of her (placeholders now), including one larger central portrait.
    - Her object stickers and two or three style motifs (headphones, vinyl record, cherries) layered around the photos.
    - The title "songs that sound like neha" in ransom-note letters, with one cherry letter, or in Bodoni with a cherry highlighter-style mark behind one word.
    - Handwritten details in Caveat as if written by her friends: "vol. 1", "11.10.26", "for neha, from her people", and her nickname scribbled in a corner.
    - A cherry lipstick kiss mark and a strip of washi tape across one corner.
    - Small printed "SIDE A / SIDE B" text in DM Sans capitals.
    - Paper texture with slight wear, so it looks handmade, not printed.
  - **Spine** of the case: "NEHA · THE BIRTHDAY MIX · 2026" in DM Sans capitals.
  - **The cassette itself** (visible half out): a cream label with "for neha" in Caveat, "A" in a circle, and the two reels visible through the window.
  - Design **two options** for the cover art (for example, one photo-led and one type-led) and recommend one.
- **Right: liner notes.** The tracklist on cream paper split into "Side A" and "Side B" headings. Each entry: track number, song title (Fraunces), artist (small DM Sans), the reason in Caveat (1 to 2 lines), and "picked by Friend X" in ash. Hovering an entry shows a small play icon; the playing entry gets a cherry highlight bar and a tiny spinning record icon. If the list is long, the paper scrolls within itself.
- **Below the case:** a frame for the **official Spotify player** (compact embed, about 300 × 80 px; keep it visible, and design a cream frame or label around it so it sits inside the design) and a **"Save to your Spotify"** secondary button.
- **States:** tab opening (cassette slides halfway out of its case), a track playing (highlight bar, reels turning in both the big cassette and the mini player), "press play" fallback.
- **Background** per the colour map (charcoal or night-plum).

### 6.6 Jokes
- **Header:** "The Joke Archive" in ransom-note letters, with a small DM Sans line: "37 JOKES, ALL CANON" (number from data).
- **Filter row:** paper-tab style chips: All, Starred, and "by person" (a small dropdown of friend names).
- **Board:** a smoke-coloured board filling the main area, covered in jokes as torn cream notes of varied sizes (size follows joke length), pinned with cherry or ink push pins or taped at slight angles. Each note: the joke in DM Sans or Caveat (vary for texture), "submitted by Friend X" in ash at the bottom, a small star toggle in the top-right corner.
- **States:**
  - Hover (note lifts with a larger shadow).
  - **Flipped note:** the note turns over (3D flip, 400 ms) to show its lore on the back in Caveat: "the origin story", 1 to 2 lines, on cream-shade paper.
  - Star on (gold burst).
  - A "found" stamp on a joke that was found as a daily hidden joke.
  - Starred filter view, including its empty state: "star a joke to keep it here".

### 6.7 Today's hidden joke
- **Closed note:** a small folded cream note (about 48 × 36 px) with a cherry tab peeking out, so it is findable but not obvious. Hover: a small wiggle.
- **Hiding spots (about 10, annotate the list):** behind the corner of the cover photo; under the barcode; tucked behind a timeline era tag; pinned on the corkboard spread; in the Darkroom's hanging film strip; under the "Letters from her people" heading; inside the cassette case on Playlist; on the corner of the joke board; under a sticker on the Games table; beside the masthead.
- **Opened note:** it unfolds (about 500 ms) into a note about 360 px wide with "today's joke" in small gold capitals, the joke, "submitted by Friend X", and a "found it" stamp; a close button.
- **Show:** the note hidden in two example spots (behind the cover photo corner, and under a sticker on the Games table), plus the opened note.
- **Annotate:** one joke and one hiding spot per day, chosen by date (IST).

### 6.8 Games
- **Games table:** heading "Can you solve her?" in Bodoni. Three game cards laid on a smoke table like puzzle-book pages (about 320 × 420 px each), each with: game name in Fraunces, a one-line description in Caveat, a difficulty row of three small dots, a section sticker, and a space for the "solved" stamp. A back tab returns to the table from any game.
- **Connections, "the Neha edition":**
  - 16 cream tiles in a 4 × 4 grid (about 150 × 80 px each), words in DM Sans capitals.
  - Above: "Create four groups of four" in small DM Sans. Below: "Mistakes remaining" with four cherry dots.
  - Buttons: Shuffle, Deselect all (secondary), Submit (primary).
  - Messages as small Caveat toasts: "one away...", "already guessed", "nice."
  - Solved groups become full-width coloured bars above the grid, with the group name in Fraunces and the four words in DM Sans, in difficulty order: gold, lilac, orchid, cherry.
  - **States:** default, four selected, wrong guess (tiles shake), one group solved, all solved (sunny-yellow confetti, "solved" stamp, a line like "solved with 2 mistakes").
- **Criss-cross crossword:**
  - About 8 to 12 answers crossing freely on cream paper, with black squares only where needed and tiny numbers in the top-left of starting cells.
  - A clue bar above the grid showing the current clue. Clue lists (Across and Down) beside the grid, with the active clue highlighted.
  - Current word highlighted in lilac; active cell with a cherry outline.
  - Buttons: Check, Reveal (secondary). A small timer in DM Sans.
  - **States:** in progress, completed (a gold wave across the grid, small confetti, "solved" stamp, time taken).
- **Daily cryptic clue:**
  - Heading "Daily cryptic" with today's date in gold small capitals.
  - The clue in large Fraunces with its letter count, for example "(5)".
  - Letter boxes beneath (one per letter).
  - Hint buttons styled as small paper tags: "show the definition" (underlines the definition part of the clue), "what's the trick?" (names the wordplay type), "give me a letter". Plus "reveal answer".
  - After solving: an explanation card breaking the clue into definition and wordplay.
  - A calendar strip of 7 days: solved (small gold check), available, locked (tiny lock icon with "come back tomorrow" on hover).
  - **States:** unsolved, hint 1 shown (definition underlined), solved with the explanation card.

### 6.9 Easter eggs (small frames or annotations)
- **Masthead clicked five times:** the letters of NEHA scatter and fall like stickers, then fly back into place, revealing a small secret note in Caveat.
- **Barcode clicked:** a scanning line passes over it and a price tag pops up: "priceless (obviously)".
- **A nickname typed anywhere:** a short rain of her-object stickers (about 2 seconds).
- **A secret key combination:** a message from the whole group (annotation only; no frame needed).

### 6.10 Phone versions (final phase)
Simplified versions at 390 wide for: envelope (with the phone keyboard open for the gate), cover, one timeline spread, Wishes with a letter open, and Playlist.
- Tabs become a bottom bar of seven small sticker icons, with the active one in cherry; the mini player sits as a slim bar just above it.
- Collages become a single column with slight rotations kept.
- Fewer stickers (3 to 4 per screen) and none draggable.
- Text sizes adjusted for reading; nothing smaller than 14 px.
- Note for the build step: Darkroom, Jokes and Games follow the same rules (single column, tiles resized).

---

## 7. Copy deck (use these words; keep everything editable)

**Opening:** "For Neha" · gate: "Who is this for?" · after correct: "tap the seal" · wrong-nickname replies (rotate): "nice try.", "she would never.", "who sent you?", "close, but no.", "try the one we actually use." · birthday card: "Happy Birthday, Neha", handwritten line: "this whole issue is about you.", date "11.10.2026" · button: "open your issue" · returning visit: "skip to the cover"

**Global:** tab labels: COVER, TIMELINE, DARKROOM, WISHES, PLAYLIST, JOKES, GAMES · mini player fallback: "tap to start the music" · hint toast: "psst, right-click to pin it (two-finger click on a Mac trackpad)" · sticker menu: "Pin here", "Unpin", "Bring to front", "Hide this sticker"

**Cover:** masthead "NEHA" · issue line "THE BIRTHDAY ISSUE · 11 OCTOBER 2026 · VOL. 1 · MUMBAI EDITION" · lead line "everything we love about her, in one issue" · cover lines and page numbers in 6.1 · stamp "today's joke is hiding somewhere" · "reset stickers"

**Timeline:** "Then, now, always" · "scroll to time travel →" · "back to the timeline" · "previous era", "next era"

**Darkroom:** "The Darkroom" · "developed with love" · section labels in 6.3

**Wishes:** "Letters from her people" · "one from each of us. open them all." · "3 OF 12 OPENED" · "Dear Neha," · "love, Friend 1" · "you're cherry to me" · "fold it back" · "that's everyone. we love you."

**Playlist:** "songs that sound like neha" · "made by her people, side A and side B" · "Side A", "Side B" · "picked by Friend X" · "Save to your Spotify" · cassette label "for neha" · spine "NEHA · THE BIRTHDAY MIX · 2026"

**Jokes:** "The Joke Archive" · "37 JOKES, ALL CANON" · filters "All", "Starred", "By person" · "submitted by Friend X" · "the origin story" · "star a joke to keep it here" · hidden joke: "today's joke", "found it"

**Games:** "Can you solve her?" · "Connections, the Neha edition" · "Create four groups of four" · "Mistakes remaining" · "Shuffle", "Deselect all", "Submit" · "one away...", "already guessed", "nice." · "Check", "Reveal" · "Daily cryptic" · "show the definition", "what's the trick?", "give me a letter", "reveal answer" · "come back tomorrow" · "solved"

**Easter eggs:** "priceless (obviously)"

**Tone:** warm, witty, lowercase in handwritten bits, elegant in headings. No clichés like "you light up our lives".

---

## 8. Personal thread (how the issue stays about her)
- Her object stickers appear on every screen at least once.
- Her nicknames appear in at least three places: the gate, a scribble on the mixtape art, and one word sticker.
- Friends' handwriting (Caveat) appears on every screen: captions, notes, labels.
- The colour each friend chose for her appears on their envelope and inside their letter.

---

## 9. Placeholders

- **Photos:** neutral placeholder blocks in realistic aspect ratios (portrait 4:5, landscape 3:2, square) with a small ash label such as "photo · the trip · portrait". Vary sizes so layouts look real. Where a mood is needed (film, flash, polaroid), apply the frame and treatment around the placeholder.
- **Her object stickers:** the six "her object" placeholder stickers from Phase 1 (or her real objects if listed in 1.1).
- **Friends:** "Friend 1" to "Friend 12".
- **Text content:** short realistic sample text marked "SAMPLE", at the length real content will have: jokes 5 to 20 words, lore 1 to 2 lines, song reasons 1 to 2 lines, text wishes 40 to 120 words, era descriptions one line.
- **Songs:** "Song title · Artist" placeholders, 15 entries split across Side A and Side B.
- **Game content:** sample words, groups and clues marked "SAMPLE".

---

## 10. Phase plan (stop after each phase)

**Phase 1: Foundations**
1. Three palette combinations within the allowed range, each applied to the same sample screen (a mini cover with masthead, a photo, two stickers, a button and a note):
   - Combination 1 "Classic": charcoal, cream, cherry, gold.
   - Combination 2 "Plum night": charcoal with night-plum moments, cream, cherry, orchid accents.
   - Combination 3 "Bright pop": charcoal, cream, cherry, sunny-yellow highlights.
2. Your recommendation with two or three reasons, and the **section colour map** (section, background, main accent, extended colour if any).
3. Type specimen: all five roles, the scale, and one ransom-note heading.
4. Sticker sheet: all 26 stickers (default and hover gloss) and the paper decorations.
5. Component sheet: every component and state in 3.6.
6. Tokens frame: colours, type scale, spacing scale, shadows (sticker, paper, lifted), corner radii, rotation ranges, motion timings and easings.

**Phase 2: Opening sequence:** all keyframes in section 4, the four gate states, and the returning visit.

**Phase 3: Cover and the global frame:** 6.1 with all states, plus the index tabs, mini player, cursor and page-change annotation from section 5. This screen sets the quality bar for every later phase.

**Phase 4: Timeline**
- 4a: header, strip view, hover state, and the first three spreads (Scrapbook, Polaroid table, Editorial). Stop.
- 4b: the other four spreads (Photobooth wall, Contact sheet, Corkboard, TV room) and the lightbox.

**Phase 5: Darkroom:** 6.3 as the full long frame plus close-ups of each section's states.

**Phase 6: Wishes and Playlist:** 6.4 and 6.5 with all states, including the two mixtape art options.

**Phase 7: Jokes, hidden joke, Games and easter eggs:** 6.6, 6.7, 6.8 with all states; easter-egg frames from 6.9.

**Phase 8: Phone versions, whole-issue audit and handoff:** 6.10; the final whole-issue audit (section 11); the handoff sheet (section 12).

---

## 11. The three-layer audit (run before presenting every phase)

Run all three layers on every frame in the phase. Fix every problem found, then re-run layers 2 and 3 once more on the fixed frames. Score each layer from 1 to 5; **anything under 4 must be fixed before you present.**

### Layer 1: Spec check (is everything there?)
- Every element, state and annotation listed for these screens in sections 4 to 6 is present. Tick through the list line by line.
- Copy matches the copy deck (section 7); placeholders follow section 9.
- The personal thread (section 8) is present on every screen in the phase.
- Frames are named per section 12; components come from the Phase 1 system (no one-off variants).
- Reserved zones (index tabs, mini player) are empty of other content.
- Animation notes exist for every interactive element (trigger, movement, duration, easing).

### Layer 2: Craft check (does it look clean and intentional?)
- **Overlap:** nothing overlaps unless it is intentional collage overlap; no overlap hides text, buttons, faces or the focal point; intentional overlap covers no more than about a quarter of the item beneath. Check sticker edges against text especially.
- **Clutter:** the centre of the screen is clear; stickers and paper items stay in margins and corners and take up no more than about 10% of the screen (cover physics stickers excepted).
- **Colour:** cherry plus at most one other bright colour (except the two planned exceptions in 3.1); extended colours only in their allowed places; balance close to 60/25/15.
- **Contrast:** all reading text is cream on charcoal or ink on cream; no small cherry text on charcoal; gold only for short labels.
- **Type:** five sizes maximum plus masthead; clear hierarchy; Caveat never below 22 px.
- **Grid and spacing:** aligned to the 12-column grid; only spacing-scale values; consistent margins.
- **Stickers:** sharp, high-contrast, white die-cut borders, tight shadows; rotations varied within −8° to +8°; readable text blocks within −3° to +3°.
- **Widths:** the layout still works at 1280 and 1920 wide.

### Layer 3: Cohesion and feeling (does it belong to this issue?)
- Place the new frames next to every previously approved frame. Do they look like pages of the same magazine?
- **Consistency of finish:** is this phase as detailed and polished as the Phase 3 cover? If anything looks simpler or rushed in comparison, bring it up to the same level before presenting.
- Is the balance right: chic first, bubbly second? If it feels flat, try one alternative accent from the allowed range on a copy of the frame and keep the better one. If it feels loud, remove decoration before adding anything.
- Would Neha want to screenshot this screen? Is there one moment on it that feels personal and delightful?
- Is anything generic, clichéd or template-like? Replace it with something more specific to a magazine made about her.
- Is it obvious what to click and where to go next?

### Phase 8: the whole-issue audit
Lay every final frame side by side in section order and check:
- The same palette proportions, type scale, sticker style and shadow style throughout.
- No section is noticeably busier or emptier than the others.
- The flow from envelope to cover to each section feels like one continuous issue.
- Every item in sections 4 to 8 has a frame or annotation somewhere.

### What to show me at the end of each phase
1. The frames for the phase.
2. **Audit notes:** the three scores and 3 to 6 bullets of "found → fixed".
3. **Decisions I should know about:** any choice you made that I did not specify (one line each).
4. **What's next:** one line naming the next phase.

Keep this summary short. The designs should do the talking.

---

## 12. Naming, editability and handoff

**Frame naming:** `[number]-[Section]/[screen or state]`, for example:
- `00-System/Palette-options`, `00-System/Colour-map`, `00-System/Type`, `00-System/Stickers`, `00-System/Components`, `00-System/Tokens`
- `01-Opening/1-Envelope`, `01-Opening/2-Gate-wrong`, `01-Opening/Returning`
- `02-Cover/Default`, `02-Cover/Sticker-menu`, `02-Cover/Pinned`
- `03-Timeline/Strip-hover`, `03-Timeline/Spread-Scrapbook`, `03-Timeline/Lightbox`
- `04-Darkroom/Full`, `04-Darkroom/Contact-loupe`
- `05-Wishes/Grid`, `05-Wishes/Letter-text`, `05-Wishes/Letter-video`
- `06-Playlist/Default`, `06-Playlist/Playing`, `06-Playlist/Art-option-A`
- `07-Jokes/Board`, `07-Jokes/Note-flipped`, `07-Jokes/Hidden-joke-open`
- `08-Games/Table`, `08-Games/Connections-solved`, `08-Games/Crossword`, `08-Games/Cryptic-solved`
- `09-Phone/Cover`

**Editability**
- Colours and type always applied from the Phase 1 tokens and styles.
- Repeated items (tabs, envelopes, notes, tiles, frames, stickers, buttons) built as reusable components.
- All text live and editable.
- Placeholders clearly labelled so real content can replace them one by one.

**Handoff sheet (Phase 8)**, one frame that lists:
- All tokens: colour hex values, type styles (font, size, weight, line height, letter spacing), spacing scale, shadows, radii, rotation ranges.
- Every component with its states.
- Every animation: element, trigger, movement, duration, easing.
- The sticker and decoration asset list with names, to be exported as transparent PNGs at 2× size with the white border included.
- Data fields each section needs, for example:
  - Era: name, years, description, layout type, photos (file, caption, taken by), videos.
  - Darkroom photo: file, style, caption.
  - Wish: friend name, colour, text or video, date.
  - Song: title, artist, Spotify link, picked by, reason, side.
  - Joke: text, submitted by, lore, starred, found.
  - Games: Connections groups (name, four words, difficulty), crossword answers and clues, cryptic clue (date, clue, answer, definition, wordplay explanation).
- The hidden-joke spot list (6.7).
- Breakpoints: 1280, 1440, 1920 and phone 390.

---

## 13. Hard rules (never break these)
- No sage in the site palette; no gradient backgrounds (the small red safelight glow at the top of the Darkroom is the only glow allowed); no dot patterns, random shapes or smoky textures.
- No more than cherry plus one other bright colour per screen, except the two planned exceptions in 3.1.
- No small cherry text on charcoal.
- Nothing in the reserved zones except tabs and the mini player.
- Stickers never cover text, buttons or faces (except where Neha herself drags them on the cover).
- No copied product images, brand logos (other than a plain "Save to your Spotify" label and the Spotify player area) or copyrighted characters.
- No generic birthday clip art: balloons, bunting, rainbow confetti, cartoon cakes.
- No age shown anywhere unless section 1.1 gives it.
- Do not start the next phase without my go-ahead.

Begin with Phase 1.
