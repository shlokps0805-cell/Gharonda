// The seven purple divider tabs on the journal's right edge (design: DividerTab).
import React from 'react';
import DividerTab from '../design/DividerTab.jsx';

export const SECTIONS = ['cover', 'timeline', 'darkroom', 'wishes', 'playlist', 'jokes', 'games'];

export default function Tabs({ labels, active, onOpen, slideIn = false, hidden = false }) {
  if (hidden) return null;
  return (
    <nav aria-label="journal sections" style={{ position: 'absolute', left: 1268, top: 110, display: 'flex', flexDirection: 'column', zIndex: 60 }}>
      {SECTIONS.map((id, i) => (
        <div key={id} style={slideIn ? { animation: `nh-tab-in 400ms cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms both` } : undefined}>
          <DividerTab section={id} label={labels[i] || id} state={active === id ? 'active' : 'default'} onClick={() => onOpen(id)} />
        </div>
      ))}
    </nav>
  );
}
