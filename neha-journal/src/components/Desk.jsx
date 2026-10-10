// The desk behind the journal. Fills the whole window, outside the stage too.
// Day desk: the gingham photo (cover-fit, never repainted) + white veil + navy vignette + grain.
// Darkroom and Playlist have their own gradients. Desks cross-fade over 400 ms.
import React from 'react';

const DESKS = {
  day: {
    background: 'url(/media/textures/gingham.jpeg) center/cover',
    veil: 'radial-gradient(ellipse 62% 64% at 50% 48%,rgba(251,249,245,.3) 0%,rgba(251,249,245,.14) 60%,rgba(32,70,112,.16) 100%)',
  },
  opening: {
    background: 'url(/media/textures/gingham.jpeg) center/cover',
    veil: 'radial-gradient(ellipse 62% 64% at 50% 48%,rgba(251,249,245,.42) 0%,rgba(251,249,245,.22) 55%,rgba(32,70,112,.16) 100%)',
  },
  darkroom: { background: 'linear-gradient(180deg,#0B0910 0%,#1E0E14 45%,#4A141C 78%,#6E1A24 100%)', veil: 'none' },
  playlist: { background: 'linear-gradient(160deg,#141E33 0%,#24203A 50%,#3E1E2E 100%)', veil: 'none' },
};

export default function Desk({ kind = 'day' }) {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: '#ACBFD3' }}>
      {Object.entries(DESKS).map(([k, d]) => (
        <div key={k} data-desk={k} style={{ position: 'absolute', inset: 0, background: d.background, opacity: k === kind ? 1 : 0, transition: 'opacity 400ms ease' }}>
          <div style={{ position: 'absolute', inset: 0, background: d.veil }} />
        </div>
      ))}
      {/* 4% film grain, the design's film-grain texture */}
      <div style={{ position: 'absolute', inset: 0, background: 'url(/media/textures/film-grain.png) 0 0/200px 200px' }} />
    </div>
  );
}
