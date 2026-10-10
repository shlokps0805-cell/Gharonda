// "The outtakes": a contact sheet on black with a 160 px gold-rimmed loupe at 2x
// that follows the cursor (design: DarkroomScene contact section).
import React, { useRef, useState } from 'react';
import { css } from '../../design/dc.js';
import Photo from '../../design/Photo.jsx';

const LOUPE = 160;

function Sheet({ photos }) {
  return (
    <div style={css('width:980px;padding:28px;background:#0A0812;border-radius:3px;display:grid;grid-template-columns:repeat(8,1fr);gap:14px 10px;box-shadow:0 6px 18px rgba(0,0,0,.5)')}>
      {photos.map((p, i) => (
        <div key={i} style={css('display:flex;flex-direction:column;gap:4px')}>
          <div style={css(`position:relative;aspect-ratio:3/2;overflow:hidden;background:repeating-linear-gradient(135deg,${i % 3 ? '#4A3F58' : '#57496A'} 0 6px,${i % 3 ? '#423850' : '#4E4160'} 6px 12px)`)}>
            <Photo src={p.file} alt={p.alt} sizes="120px" />
          </div>
          <span style={css("font:700 8px/1 'Courier Prime',monospace;color:#E86A5A")}>{i + 1}A</span>
        </div>
      ))}
    </div>
  );
}

export default function ContactSheet({ photos, reduced }) {
  const box = useRef(null);
  const [at, setAt] = useState(null);
  const move = e => {
    const el = box.current;
    const r = el.getBoundingClientRect(), k = r.width / el.offsetWidth;
    setAt([(e.clientX - r.left) / k, (e.clientY - r.top) / k]);
  };
  return (
    <div ref={box} onPointerMove={move} onPointerLeave={() => setAt(null)} style={css('position:absolute;left:60px;top:90px;cursor:zoom-in')}>
      <Sheet photos={photos} />
      {at ? (
        <div aria-hidden="true" style={{ ...css(`position:absolute;width:${LOUPE}px;height:${LOUPE}px;border-radius:50%;border:4px solid #D9BE6E;box-shadow:0 0 0 2px rgba(0,0,0,.4),0 10px 24px rgba(0,0,0,.5);overflow:hidden;background:#0A0812;z-index:30;pointer-events:none`), left: at[0] - LOUPE / 2, top: at[1] - LOUPE / 2, transition: reduced ? 'none' : 'left 40ms linear, top 40ms linear' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${LOUPE / 2 - 4 - at[0] * 2}px,${LOUPE / 2 - 4 - at[1] * 2}px) scale(2)` }}>
            <Sheet photos={photos} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
