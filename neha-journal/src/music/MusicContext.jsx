// Music for the whole site: the current song, playing state and controls.
// Browsers only allow sound after a click or key press, so start() must be called
// synchronously inside that click (the seal on a first visit, any click on a return visit).
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as spotify from './spotifyController.js';

const MusicContext = createContext(null);
export const useMusic = () => useContext(MusicContext);

// shuffled order that starts from `first`
function shuffledFrom(count, first) {
  const rest = [...Array(count).keys()].filter(i => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

export function MusicProvider({ songs, playlist, hostRef, children }) {
  // songs with their own Spotify link; if none have one yet, the whole playlist plays as one item
  // (Spotify then moves through it by itself, so next / previous have nothing to do)
  const playable = useMemo(() => {
    const withLinks = songs.filter(s => s.uri);
    return withLinks.length || !playlist ? withLinks : [{ ...playlist, uri: playlist.uri, isPlaylist: true }];
  }, [songs, playlist]);
  const playlistMode = !!(playable[0] && playable[0].isPlaylist);
  // a new random song on every page load; nothing about playback is remembered
  const [order, setOrder] = useState(() => (playable.length ? shuffledFrom(playable.length, Math.floor(Math.random() * playable.length)) : []));
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState(playable.length ? 'idle' : 'nosongs');
  const [muted, setMuted] = useState(false);
  const [tried, setTried] = useState(false); // a start was attempted (so 'press' means the browser held the sound back)
  const ready = useRef(false);
  const wanted = useRef(false); // start() was called before the controller was ready
  const loadedUri = useRef('');
  const confirmT = useRef(null);
  const endGuard = useRef('');
  const lastPos = useRef(0);
  const pausedForGame = useRef(false);
  const started = useRef(''); // the loaded item has already played, so play again means resume
  const state = useRef({});
  state.current = { order, pos, status, playlistMode };

  const song = playable.length ? playable[order[pos]] : null;

  // wait up to 2.5 s for Spotify to report playing; otherwise ask for a tap
  const confirmPlaying = useCallback(() => {
    clearTimeout(confirmT.current);
    confirmT.current = setTimeout(() => {
      if (state.current.status !== 'playing') setStatus('press');
    }, 2500);
  }, []);

  const playAt = useCallback(p => {
    const s = playable[state.current.order[p]];
    if (!s) return;
    setPos(p);
    setMuted(false);
    setTried(true);
    if (!ready.current) { wanted.current = true; setStatus('loading'); return; }
    if (loadedUri.current !== s.uri) { spotify.load(s.uri); loadedUri.current = s.uri; endGuard.current = ''; lastPos.current = 0; started.current = ''; }
    // after a pause, carry on from the same spot instead of starting the song (or playlist) over
    if (started.current === s.uri && state.current.status === 'paused') spotify.resume();
    else spotify.play();
    setStatus('loading');
    confirmPlaying();
  }, [playable, confirmPlaying]);

  // create the one controller, with the random first song
  useEffect(() => {
    if (!playable.length) return undefined;
    let alive = true;
    const first = playable[order[0]];
    // Spotify replaces the element it is given with its iframe, so hand it a plain
    // child div that React does not manage. The host itself is never unmounted.
    const el = document.createElement('div');
    if (hostRef.current) hostRef.current.appendChild(el);
    spotify.init(el, first.uri).then(ok => {
      if (!alive) return;
      if (!ok) { setStatus('unavailable'); return; }
      ready.current = true;
      loadedUri.current = first.uri;
      if (wanted.current) {
        wanted.current = false;
        spotify.play();
        confirmPlaying();
      }
    });
    const off = spotify.onUpdate(d => {
      if (d.isPaused === false) {
        started.current = loadedUri.current;
        clearTimeout(confirmT.current);
        setStatus('playing');
      } else if (d.isPaused === true && state.current.status === 'playing') {
        setStatus('paused');
      }
      // ending detection: within 600 ms of the end while moving -> next song, once per song
      const { position = 0, duration = 0 } = d;
      // some songs stop and jump back to the start instead of reporting the last moment
      const stoppedAtEnd = !state.current.playlistMode && d.isPaused === true && duration > 0 && lastPos.current >= duration - 1500 && position < 1000 && state.current.status === 'playing';
      if (stoppedAtEnd && endGuard.current !== loadedUri.current) {
        endGuard.current = loadedUri.current;
        lastPos.current = 0;
        const n = state.current.order.length;
        if (n) playAt((state.current.pos + 1) % n);
        return;
      }
      if (state.current.playlistMode) return;
      const moving = position > lastPos.current;
      lastPos.current = position;
      const id = loadedUri.current;
      if (duration > 0 && moving && duration - position <= 600 && endGuard.current !== id) {
        endGuard.current = id;
        const n = state.current.order.length;
        if (n) playAt((state.current.pos + 1) % n);
      }
    });
    return () => { alive = false; off(); clearTimeout(confirmT.current); };
  }, []);

  const start = useCallback(() => {
    const st = state.current.status;
    if (!playable.length || st === 'playing' || st === 'unavailable') return;
    playAt(state.current.pos);
  }, [playable.length, playAt]);

  const pause = useCallback(() => {
    clearTimeout(confirmT.current);
    spotify.pause();
    setStatus('paused');
  }, []);

  const toggle = useCallback(() => {
    if (state.current.status === 'playing') pause();
    else playAt(state.current.pos);
  }, [pause, playAt]);

  const next = useCallback(() => { if (state.current.playlistMode) return; const n = state.current.order.length; if (n) playAt((state.current.pos + 1) % n); }, [playAt]);
  const prev = useCallback(() => { if (state.current.playlistMode) return; const n = state.current.order.length; if (n) playAt((state.current.pos - 1 + n) % n); }, [playAt]);

  // the embed has no volume control, so "sound off" pauses and "sound on" resumes
  const toggleMute = useCallback(() => {
    if (!muted) { pause(); setMuted(true); } else { setMuted(false); playAt(state.current.pos); }
  }, [muted, pause, playAt]);

  // Playlist clicks: play that song and continue from there
  const playSong = useCallback(songId => {
    const idx = playable.findIndex(s => s.id === songId);
    if (idx < 0) return;
    const cur = state.current.order;
    const at = cur.indexOf(idx);
    if (at >= 0) playAt(at);
    else { setOrder([...cur, idx]); setTimeout(() => playAt(cur.length), 0); }
  }, [playable, playAt]);

  const pauseForGame = useCallback(() => {
    pausedForGame.current = state.current.status === 'playing';
    if (pausedForGame.current) pause();
    return pausedForGame.current;
  }, [pause]);

  const value = {
    status, muted, song, songs, playable, hasSongs: playable.length > 0, playlistMode,
    // Spotify would not start from our click: show its own player so one tap on its ▶ starts it
    needsSpotifyTap: tried && status === 'press',
    start, toggle, next, prev, toggleMute, playSong, pauseForGame, pause,
    // until the first click on a return visit, the player pulses "tap to start the music"
    askForTap: () => setStatus(s => (s === 'idle' ? 'press' : s)),
  };
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
