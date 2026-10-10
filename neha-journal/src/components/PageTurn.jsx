// The spiral page turn: a page lifts from the right edge and flips over the spiral
// (450 ms, cubic-bezier(0.65,0,0.35,1)). Going backwards reverses it. Jumping several
// sections riffles 2-3 pages at 120 ms each. With reduced motion it is a 200 ms fade.
// `turn` = { id, from: {paper, spread}, dir: 1 | -1, pages: 1-3 }
import React from 'react';

// journal rectangles on the stage: single pages turn on the left spiral, spreads on the middle one
const SINGLE = { left: 88, width: 1180 };
const SPREAD = { left: 678, width: 590 };

export default function PageTurn({ turn, reduced }) {
  if (!turn) return null;
  if (reduced) {
    return <div key={turn.id} aria-hidden="true" style={{ position: 'absolute', left: 88, top: 28, width: 1180, height: 756, background: turn.from.paper, animation: 'nh-flash 200ms linear both', pointerEvents: 'none', zIndex: 55 }} />;
  }
  const r = turn.from.spread ? SPREAD : SINGLE;
  const pages = Array.from({ length: turn.pages }, (_, i) => i);
  const dur = turn.pages > 1 ? 300 : 450;
  const name = turn.dir > 0 ? 'nh-turn-fwd' : 'nh-turn-back';
  return (
    <div key={turn.id} aria-hidden="true" style={{ position: 'absolute', left: r.left, top: 28, width: r.width, height: 756, perspective: 2400, pointerEvents: 'none', zIndex: 55 }}>
      {pages.map(i => (
        <div key={i} style={{ position: 'absolute', inset: 0, transformOrigin: '0 50%', transformStyle: 'preserve-3d', animation: `${name} ${dur}ms cubic-bezier(0.65,0,0.35,1) ${i * 120}ms both` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '3px 8px 8px 3px', background: turn.from.paper, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', boxShadow: '4px 3px 8px rgba(19,15,31,.25)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '8px 3px 3px 8px', background: '#EEE9F4', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', boxShadow: '-3px 3px 6px rgba(19,15,31,.2)' }} />
        </div>
      ))}
    </div>
  );
}
