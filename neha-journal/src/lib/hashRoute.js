import { useEffect, useState } from 'react';

// Sections live in the URL hash: #/cover, #/timeline/era/the-trip, #/wishes/friend-3 ...
// parseHash('#/timeline/era/the-trip') -> { section: 'timeline', parts: ['era', 'the-trip'] }
export function parseHash(hash) {
  const clean = (hash || '').replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);
  return { section: parts[0] || '', parts: parts.slice(1) };
}

export function navigate(path, { replace = false } = {}) {
  const target = '#/' + path.replace(/^\/+/, '');
  if (window.location.hash === target) return;
  if (replace) window.history.replaceState(null, '', target);
  else window.location.hash = target;
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
