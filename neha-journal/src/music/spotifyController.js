// One Spotify embed controller for the whole site, wrapped in plain functions.
// The iFrame API script is loaded once from index.html; its ready callback stores the
// API on window.__spotifyIframeApi. If it never arrives (offline, blocked), init()
// resolves false and the site carries on without music.
let controller = null;
let initPromise = null;
let playWhenReady = false;
const listeners = new Set();

function waitForApi(timeoutMs) {
  return new Promise(resolve => {
    if (window.__spotifyIframeApi) return resolve(window.__spotifyIframeApi);
    const t = setTimeout(() => resolve(null), timeoutMs);
    window.addEventListener('spotify-api-ready', () => {
      clearTimeout(t);
      resolve(window.__spotifyIframeApi);
    }, { once: true });
  });
}

// element: the (never unmounted) container div. Resolves true when the controller is ready.
export function init(element, firstUri) {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const api = await waitForApi(10000);
    if (!api || !element) return false;
    return new Promise(resolve => {
      const giveUp = setTimeout(() => resolve(false), 10000);
      try {
        api.createController(element, { width: 300, height: 80, uri: firstUri }, ctrl => {
          controller = ctrl;
          ctrl.addListener('playback_update', e => {
            if (e.data && e.data.isPaused === false) playWhenReady = false;
            listeners.forEach(cb => cb(e.data || {}));
          });
          ctrl.addListener('ready', () => {
            clearTimeout(giveUp);
            // the embed fires 'ready' again after each new song loads: start it if asked to
            if (playWhenReady) { playWhenReady = false; ctrl.play(); }
            resolve(true);
          });
        });
      } catch {
        clearTimeout(giveUp);
        resolve(false);
      }
    });
  })();
  return initPromise;
}

export function isReady() {
  return !!controller;
}

export function load(uri) {
  if (controller && uri) {
    playWhenReady = false;
    controller.loadUri(uri);
  }
}

// play() is called straight away (inside the click, for the browser's sound rules) and
// once more when a freshly loaded song reports ready
export function play() {
  if (!controller) return;
  playWhenReady = true;
  controller.play();
}

export function pause() {
  playWhenReady = false;
  if (controller) controller.pause();
}

export function resume() {
  if (controller) controller.resume();
}

export function toggle() {
  if (controller) controller.togglePlay();
}

// callback receives { isPaused, isBuffering, position, duration } (ms)
export function onUpdate(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
