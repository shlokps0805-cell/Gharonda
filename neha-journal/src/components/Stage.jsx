// The 1440 × 900 stage every screen is designed on, scaled to fit the window and centred.
// Scale = min(width / 1440, height / 900), kept between 0.6 and 1.6.
import React, { useEffect, useRef, useState } from 'react';

export const STAGE_W = 1440;
export const STAGE_H = 900;

// minScale is lowered for phones ("open it here anyway") so the whole journal fits
function fit(minScale) {
  const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  return Math.max(minScale, Math.min(1.6, s));
}

export default function Stage({ children, className = '', minScale = 0.6 }) {
  const [scale, setScale] = useState(() => fit(minScale));
  const boxRef = useRef(null);
  useEffect(() => {
    const onResize = () => setScale(fit(minScale));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [minScale]);
  // the stage does not clip, so stickers can sit on the desk around the journal; the window
  // clips instead (it only scrolls when the stage is bigger than the window, on phones)
  const fits = STAGE_W * scale <= window.innerWidth + 1 && STAGE_H * scale <= window.innerHeight + 1;
  // when the stage fits, the browser may still try to scroll the window to something past the
  // page edge (a focused element); snap it straight back so the journal never shifts
  const unshift = () => { const el = boxRef.current; if (fits && el && (el.scrollTop || el.scrollLeft)) { el.scrollTop = 0; el.scrollLeft = 0; } };
  return (
    <div ref={boxRef} onScroll={unshift} style={{ position: 'fixed', inset: 0, overflow: fits ? 'hidden' : 'auto', display: 'grid', placeItems: 'center' }} className="nh-hide-scroll">
      <div style={{ width: STAGE_W * scale, height: STAGE_H * scale, position: 'relative', flex: 'none' }}>
        <div
          id="stage"
          className={className}
          style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: '0 0' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
