// One Spotify embed controller for the whole site, wrapped in plain functions.
// The iFrame API script is loaded once from index.html; its ready callback stores the
// API on window.__spotifyIframeApi. If it never arrives (offline, blocked), init()
// resolves false and the site carries on without music.
let controller = null;
let initPromise = null;
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
          ctrl.addListener('playback_update', e => listeners.forEach(cb => cb(e.data || {})));
          ctrl.addListener('ready', () => {
            clearTimeout(giveUp);
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
  if (controller && uri) controller.loadUri(uri);
}

export function play() {
  if (controller) controller.play();
}

export function pause() {
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
