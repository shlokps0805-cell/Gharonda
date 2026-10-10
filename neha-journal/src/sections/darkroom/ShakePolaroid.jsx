// "Give it a shake": the polaroid starts dark and blurry; dragging it back and forth
// develops it (darkness and blur clear with movement, 0 -> 1 over about 1200 px).
// Ported from the design's shake() handler; the developed amount is saved per photo.
import React, { useRef } from 'react';
import { css } from '../../design/dc.js';
import PhotoFrame from '../../design/PhotoFrame.jsx';

const DISTANCE = 1200;

export default function ShakePolaroid({ item, start, developed, onDevelop, frameProps }) {
  const wobble = useRef(null);
  const dark = Math.max(0, start * (1 - developed));

  const grab = e => {
    if (e.button !== 0) return;
    e.preventDefault();
    let lx = e.clientX, ly = e.clientY, dev = developed;
    const mv = ev => {
      const dx = ev.clientX - lx, dist = Math.hypot(dx, ev.clientY - ly);
      lx = ev.clientX; ly = ev.clientY;
      dev = Math.min(1, dev + dist / DISTANCE);
      onDevelop(dev);
      if (wobble.current) wobble.current.style.transform = `rotate(${Math.max(-8, Math.min(8, dx * 0.6))}deg)`;
    };
    const up = () => {
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerup', up);
      if (wobble.current) wobble.current.style.transform = 'none';
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  };

  return (
    <div ref={wobble} onPointerDown={grab} style={css(`position:relative;cursor:${dark > 0 ? 'grab' : 'default'};touch-action:none;transition:transform 120ms ease-out`)} aria-label={dark > 0 ? 'shake to develop' : undefined}>
      <PhotoFrame {...frameProps} />
      {dark > 0 ? (
        <div style={css(`position:absolute;left:14px;top:14px;width:${item.s}px;height:${item.s}px;background:radial-gradient(circle at 50% 45%,rgba(60,42,52,${dark}),rgba(28,20,30,${Math.min(1, dark + 0.1)}));backdrop-filter:blur(${Math.round(dark * 6)}px);-webkit-backdrop-filter:blur(${Math.round(dark * 6)}px);transform:rotate(${item.rot}deg);pointer-events:none`)} />
      ) : null}
    </div>
  );
}
