// The 1440 × 900 stage every screen is designed on, scaled to fit the window and centred.
// Scale = min(width / 1440, height / 900), kept between 0.6 and 1.6.
import React, { useEffect, useState } from 'react';

export const STAGE_W = 1440;
export const STAGE_H = 900;

function fit() {
  const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  return Math.max(0.6, Math.min(1.6, s));
}

export default function Stage({ children, className = '' }) {
  const [scale, setScale] = useState(fit);
  useEffect(() => {
    const onResize = () => setScale(fit());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'auto', display: 'grid', placeItems: 'center' }} className="nh-hide-scroll">
      <div style={{ width: STAGE_W * scale, height: STAGE_H * scale, position: 'relative', flex: 'none' }}>
        <div
          id="stage"
          className={className}
          style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: '0 0', overflow: 'hidden' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
