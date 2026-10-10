import { useEffect, useState } from 'react';

const query = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

// true when the visitor has asked for less motion; every animation checks it
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia(query);
    } catch {
      return undefined;
    }
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange));
  }, []);
  return reduced;
}

// touch devices (no hover): normal cursor, no music-note trail
export function isTouchDevice() {
  try {
    return window.matchMedia('(hover: none)').matches;
  } catch {
    return false;
  }
}
