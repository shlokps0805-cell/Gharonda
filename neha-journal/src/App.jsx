// The whole journal: desk, scaled stage, the current section, tabs, player, cursor.
//
// First visit: the opening plays (envelope -> journal -> birthday -> stickers -> cover),
// then neha.v1.opened = true. Every later visit goes straight to the section in the
// URL hash (or the Cover). The opening is a state, not a page: there is no #/opening.
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import content from './content/loadContent.js';
import * as storage from './lib/storage.js';
import { navigate, useHashRoute } from './lib/hashRoute.js';
import { usePrefersReducedMotion, isTouchDevice } from './lib/motion.js';
import { MusicProvider, useMusic } from './music/MusicContext.jsx';
import Stage from './components/Stage.jsx';
import Desk from './components/Desk.jsx';
import Tabs, { SECTIONS } from './components/Tabs.jsx';
import PageTurn from './components/PageTurn.jsx';
import PlayerDock from './components/PlayerDock.jsx';
import CursorTrail from './components/CursorTrail.jsx';
import StickerLayer from './components/StickerLayer.jsx';
import EasterEggs from './components/EasterEggs.jsx';
import JournalBoard from './components/JournalBoard.jsx';
import PhoneNotice from './components/PhoneNotice.jsx';
import DevPanel from './components/DevPanel.jsx';
import Opening from './sections/Opening.jsx';
import { CoverPage, ContentsSpread, ResetStickers } from './sections/Cover.jsx';

// every section's code loads only when it is first visited
const Timeline = lazy(() => import('./sections/Timeline.jsx'));
const Darkroom = lazy(() => import('./sections/Darkroom.jsx'));
const Wishes = lazy(() => import('./sections/Wishes.jsx'));
const Playlist = lazy(() => import('./sections/Playlist.jsx'));
const Jokes = lazy(() => import('./sections/Jokes.jsx'));
const BackPages = lazy(() => import('./sections/BackPages.jsx'));
const Games = lazy(() => import('./sections/Games.jsx'));
const Gallery = import.meta.env.DEV ? lazy(() => import('./sections/Gallery.jsx')) : null;

// page order for the page-turn direction; paper colour and layout for the turning sheet
const PAGES = {
  cover: { n: 0, paper: '#6B4A33', spread: false },
  contents: { n: 0.5, paper: '#FFFFFF', spread: true },
  timeline: { n: 1, paper: '#FFFFFF', spread: true },
  darkroom: { n: 2, paper: '#1C1828', spread: true },
  wishes: { n: 3, paper: '#FFFFFF', spread: false },
  wish: { n: 3.5, paper: '#EEE9F4', spread: false },
  playlist: { n: 4, paper: '#2A2140', spread: true },
  jokes: { n: 5, paper: '#B7A9D3', spread: false },
  games: { n: 6, paper: '#FFFFFF', spread: false },
  back: { n: 7, paper: '#FFFFFF', spread: true },
};

const NO_STICKERS = [];
const deskFor = section => (section === 'darkroom' ? 'darkroom' : section === 'playlist' ? 'playlist' : 'day');

function phoneSized() {
  return window.innerWidth < 900 || (isTouchDevice() && Math.min(window.innerWidth, window.innerHeight) < 700);
}

if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reset-opening')) {
  storage.remove('opened');
}

export default function App() {
  const hostRef = useRef(null);
  return (
    <MusicProvider songs={content.songs} hostRef={hostRef}>
      <Journal hostRef={hostRef} />
    </MusicProvider>
  );
}

function Journal({ hostRef }) {
  const route = useHashRoute();
  const music = useMusic();
  const reduced = usePrefersReducedMotion();
  const touch = useMemo(isTouchDevice, []);
  const { ui } = content;

  const [opening, setOpening] = useState(() => !storage.get('opened', false));
  const [openingStep, setOpeningStep] = useState('envelope');
  const [firstDrop, setFirstDrop] = useState(false); // drop the cover pile (opening, replay)
  const [replaying, setReplaying] = useState(false);
  const [coverReset, setCoverReset] = useState(0);
  const [phone, setPhone] = useState(phoneSized);
  const [phoneAnyway, setPhoneAnyway] = useState(false);
  const [turn, setTurn] = useState(null);
  const [slideIn, setSlideIn] = useState(true);
  const lastPage = useRef(null);

  // which page is showing
  let section = SECTIONS.includes(route.section) || route.section === 'back' ? route.section : 'cover';
  if (route.section === 'dev' && import.meta.env.DEV) section = 'dev';
  let page = section;
  if (section === 'cover' && route.parts[0] === 'contents') page = 'contents';
  // opening a letter turns the page to that friend's spread
  if (section === 'wishes' && route.parts[0] && route.parts[0] !== 'page') page = 'wish';

  // a fresh link lands on the Cover; unknown hashes go to the Cover too
  useEffect(() => {
    if (opening) return;
    if (!route.section || (!SECTIONS.includes(route.section) && route.section !== 'back' && !(route.section === 'dev' && import.meta.env.DEV))) navigate('cover', { replace: true });
  }, [route.section, opening]);

  // the page turn plays whenever the page changes
  useEffect(() => {
    const prev = lastPage.current;
    lastPage.current = page;
    if (!prev || prev === page || opening || !PAGES[prev] || !PAGES[page]) return;
    const d = PAGES[page].n - PAGES[prev].n;
    setTurn({ id: Date.now(), from: PAGES[prev], dir: d >= 0 ? 1 : -1, pages: Math.abs(d) > 1.2 ? Math.min(3, Math.round(Math.abs(d))) : 1 });
  }, [page, opening]);
  useEffect(() => {
    if (!turn) return undefined;
    const t = setTimeout(() => setTurn(null), reduced ? 220 : 450 + (turn.pages - 1) * 120 + 60);
    return () => clearTimeout(t);
  }, [turn, reduced]);

  // return visits: the player pulses "tap to start the music" until the first click or key
  useEffect(() => {
    if (opening) return undefined;
    music.askForTap();
    const go = () => { music.start(); off(); };
    const off = () => { window.removeEventListener('pointerdown', go, true); window.removeEventListener('keydown', go, true); };
    window.addEventListener('pointerdown', go, true);
    window.addEventListener('keydown', go, true);
    return off;
    // run once when the journal (not the opening) is showing
  }, [opening]);

  useEffect(() => {
    const onResize = () => setPhone(phoneSized());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // the music-note cursor replaces the normal one everywhere on the page, desk included
  useEffect(() => {
    document.documentElement.classList.toggle('nh-custom-cursor', !touch);
  }, [touch]);

  const go = useCallback(path => navigate(path), []);

  const finishOpening = useCallback((toContents = false) => {
    storage.set('opened', true);
    setOpening(false);
    setReplaying(false);
    setFirstDrop(false);
    setSlideIn(false);
    navigate(toContents ? 'cover/contents' : 'cover', { replace: true });
  }, []);

  const replayOpening = useCallback(() => {
    setFirstDrop(false);
    setReplaying(true);
    setOpeningStep('envelope');
    setOpening(true);
  }, []);

  const onOpeningStep = useCallback(step => {
    setOpeningStep(step);
    if (step === 'confetti') setFirstDrop(true);
  }, []);

  if (phone && !phoneAnyway) return <PhoneNotice ui={ui.phone} onAnyway={() => setPhoneAnyway(true)} />;

  const physicsInstant = reduced || (phone && phoneAnyway);
  const showCoverPile = opening ? openingStep === 'confetti' || openingStep === 'settles' : page === 'cover';
  const showChrome = !opening || openingStep === 'settles';
  const desk = opening ? 'opening' : deskFor(section);
  const customCursor = !touch;

  let body = null;
  if (opening) {
    body = <Opening content={content} onStep={onOpeningStep} onDone={finishOpening} reduced={reduced} />;
  } else if (page === 'cover') {
    body = <CoverPage content={content} onOpen={() => go('cover/contents')} />;
  } else if (page === 'contents') {
    body = <ContentsSpread content={content} go={go} />;
  } else {
    const props = { content, parts: route.parts, go, reduced };
    body = (
      <Suspense fallback={null}>
        {section === 'timeline' && <Timeline {...props} />}
        {section === 'darkroom' && <Darkroom {...props} />}
        {section === 'wishes' && <Wishes {...props} />}
        {section === 'playlist' && <Playlist {...props} />}
        {section === 'jokes' && <Jokes {...props} />}
        {section === 'back' && <BackPages {...props} onReplay={replayOpening} />}
        {section === 'games' && <Games {...props} />}
        {section === 'dev' && Gallery && <Gallery {...props} />}
      </Suspense>
    );
  }

  return (
    <>
      <Desk kind={desk} />
      <Stage minScale={phone && phoneAnyway ? 0.2 : 0.6}>
        {!opening && page !== 'cover' && section !== 'dev' ? <JournalBoard /> : null}
        <main key={opening ? 'opening' : page} style={{ position: 'absolute', inset: 0 }}>
          {body}
        </main>
        {showCoverPile ? (
          <StickerLayer
            // a replay drops a separate, unsaved pile so her saved stickers stay untouched
            key={replaying ? 'cover-replay' : 'cover-pile'}
            pageId="cover"
            persist={!replaying}
            physics
            pileScale={content.stickers.pages.cover?.scale || 0.72}
            floors="cover"
            fixed={opening ? NO_STICKERS : content.stickers.pages.cover?.fixed}
            drop={firstDrop}
            instant={physicsInstant}
            resetToken={coverReset}
            ui={ui.stickerMenu}
            z={40}
          />
        ) : null}
        {page === 'cover' && !opening ? <ResetStickers label={ui.cover.reset} onReset={() => setCoverReset(n => n + 1)} /> : null}
        <PageTurn turn={turn} reduced={reduced} />
        <Tabs labels={ui.tabs} active={page === 'contents' ? 'cover' : section} onOpen={id => go(id)} hidden={!showChrome || section === 'dev'} slideIn={opening} />
        <PlayerDock ui={ui.player} show={showChrome} slideIn={slideIn || opening} noteColor={desk === 'darkroom' || desk === 'playlist' ? '#FFFFFF' : '#204670'} />
        {/* the one Spotify embed: shown in the Playlist's slot, otherwise kept playing out of view */}
        <div
          ref={hostRef}
          className="nh-keep-cursor"
          data-spotify-host
          style={page === 'playlist' && !opening
            ? { position: 'absolute', left: 150, top: 640, width: 300, height: 80, zIndex: 50, borderRadius: 10, overflow: 'hidden' }
            : { position: 'absolute', left: 20, top: 1000, width: 300, height: 80, opacity: 0, pointerEvents: 'none' }}
        />
      </Stage>
      {customCursor ? <CursorTrail trail={!reduced && !(phone && phoneAnyway)} /> : null}
      <EasterEggs site={content.site} ui={ui.eggs} reduced={reduced} />
      {import.meta.env.DEV ? <DevPanel /> : null}
    </>
  );
}
