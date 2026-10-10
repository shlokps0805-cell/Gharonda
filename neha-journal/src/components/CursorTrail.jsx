// The cursor: an 8 px lavender dot in a 28 px white ring, and a trail of music notes.
// The trail code is ported from the design scenes (a note every 34 px of movement,
// floating up 46 px and fading over 900 ms, removed when its animation ends).
// Over anything clickable the cursor becomes the 32 px glass-star sticker (Phase 3 design).
// Off on touch devices; the trail is off with reduced motion.
import React, { useEffect, useRef, useState } from 'react';
import Sticker from '../design/Sticker.jsx';

const NOTES = ['♪', '♫', '♩', '♬'];
const COLOURS = ['#A57BD5', '#FFFFFF', '#C4A8E6', '#FFFFFF'];
const MAX_NOTES = 24;
const CLICKABLE = 'button, a, [role="button"], [role="menuitem"], .nh-sticker-wrap, [data-clickable], summary, label';

export default function CursorTrail({ trail = true }) {
  const cursor = useRef(null);
  const layer = useRef(null);
  const [onLink, setOnLink] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let last = null;
    let glyph = 0;
    let raf = 0;
    let pos = [0, 0];
    const move = e => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      pos = [e.clientX, e.clientY];
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        if (cursor.current) cursor.current.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
      });
      setVisible(true);
      const t = e.target;
      const keep = t && t.closest && t.closest('input, textarea, iframe, .nh-keep-cursor');
      setOnLink(!keep && !!(t && t.closest && t.closest(CLICKABLE)));
      if (keep) setVisible(false);
      if (!trail || !layer.current) return;
      const [x, y] = pos;
      if (last && Math.hypot(x - last[0], y - last[1]) < 34) return;
      last = [x, y];
      if (layer.current.childElementCount >= MAX_NOTES) return;
      const n = document.createElement('span');
      n.textContent = NOTES[glyph++ % 4];
      const size = 14 + Math.round(Math.random() * 4);
      const tilt = (Math.random() - 0.5) * 24;
      n.style.cssText = `position:fixed;left:${x + 8}px;top:${y - 6}px;font:700 ${size}px/1 'DM Sans',sans-serif;color:${COLOURS[Math.floor(Math.random() * COLOURS.length)]};pointer-events:none;text-shadow:0 0 1px #fff,0 1px 2px rgba(19,15,31,.35)`;
      layer.current.appendChild(n);
      const dx = (Math.random() - 0.5) * 30;
      const anim = n.animate(
        [
          { transform: `translate(0,0) scale(.6) rotate(${tilt * 0.3}deg)`, opacity: 0 },
          { transform: `translate(${dx * 0.3}px,-10px) scale(1) rotate(${tilt * 0.6}deg)`, opacity: 1, offset: 0.2 },
          { transform: `translate(${dx}px,-46px) scale(.9) rotate(${tilt}deg)`, opacity: 0 },
        ],
        { duration: 900, easing: 'cubic-bezier(0.25,1,0.5,1)' },
      );
      anim.onfinish = () => n.remove();
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      cancelAnimationFrame(raf);
    };
  }, [trail]);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000 }}>
      <div ref={layer} />
      <div ref={cursor} style={{ position: 'fixed', left: 0, top: 0, opacity: visible ? 1 : 0, transition: 'opacity 120ms' }}>
        {onLink ? (
          <div style={{ position: 'absolute', left: -16, top: -16, animation: 'nh-pop 120ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <Sticker kind="star-glass" size={32} />
          </div>
        ) : (
          <>
            <div style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #FFFFFF', boxShadow: '0 0 0 1px rgba(32,70,112,.3)' }} />
            <div style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: '#A57BD5' }} />
          </>
        )}
      </div>
    </div>
  );
}
