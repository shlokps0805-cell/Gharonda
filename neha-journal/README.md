# NEHA · the birthday journal

A spiral-bound birthday journal for Neha on a gingham desk: an envelope to open, her photos,
letters from her friends, a mixtape, a joke board, games, and stickers she can play with on every page.

Built with Vite + React from the Claude Design screens in `handoff/design/`. It runs best in Chrome
on a laptop and also works in Safari.

- **Adding content:** see [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) (or drop files in `inbox/` and ask Claude Code to run the intake).
- **Rules for future Claude Code sessions:** [`CLAUDE.md`](CLAUDE.md).
- **What differs from the design, and why:** [`DEVIATIONS.md`](DEVIATIONS.md).

---

## Put it online with Render (free)

Render builds the site from GitHub and gives you a public `https://` link. Static sites on Render
are free and never go to sleep. You only do this once; after that, every push to GitHub updates the site.

1. Go to **https://render.com** and click **Get Started**. Choose **GitHub** and sign in with the
   GitHub account that owns this repository (`shlokps0805-cell/Gharonda`).
2. In the Render dashboard, click **New +** (top right) → **Blueprint**.
3. Under **Connect a repository**, find **Gharonda** and click **Connect**. If you don't see it,
   click **Configure account** / **Connect GitHub**, allow Render to see the Gharonda repository, and come back.
4. Pick the **branch** that has the journal: `claude/birthday-celebration-website-sek67i`
   (or `main`, once the pull request has been merged).
5. Render reads the `render.yaml` file and shows one service called **neha-journal**.
   Give the blueprint any name (for example *neha*) and click **Apply** (or **Deploy Blueprint**).
6. Wait about two minutes. When the status says **Live**, click the link at the top of the
   neha-journal page, something like **https://neha-journal.onrender.com** (Render adds a few
   letters if that name is taken). That is the link to send.

**If the Blueprint option gives you trouble**, do it by hand instead: **New +** → **Static Site** →
pick the Gharonda repository and branch, then fill in:
- **Root Directory:** `neha-journal`
- **Build Command:** `npm ci --include=dev && npm run build`
- **Publish Directory:** `dist`

and click **Create Static Site**.

### Updating it later
Push a commit to the same branch on GitHub and Render rebuilds by itself (watch it under **Events**).
The build stops with a clear message if `npm run check` finds a content mistake, so a broken file
never goes live; the old version stays up until it is fixed.

### Before you send the link
- [ ] Open the link in a fresh **incognito/private window**: envelope → tap the seal → music → happy birthday → stickers → cover.
- [ ] Reload: it should go straight to the cover, with the stickers where you left them.
- [ ] Open it in Chrome while **logged into Spotify** (full songs; logged out, Spotify only plays 30-second previews).
- [ ] Click through every tab, and open it once on a phone.
- [ ] Send it with a note like: *"open this on your laptop in Chrome, with the sound on."*

---

## Working on it (Claude Code does this for you)
Inside `neha-journal/`:

| Command | What it does |
|---|---|
| `npm install` | install everything (first time only) |
| `npm run dev` | live preview at http://localhost:5173 (add `?reset-opening` to the address to see the opening again) |
| `npm run check` | check all content and photo files |
| `npm run images` | make small, fast versions of new photos |
| `npm run build` | build the site into `dist/` |
| `npm run test` | run the browser checks |
