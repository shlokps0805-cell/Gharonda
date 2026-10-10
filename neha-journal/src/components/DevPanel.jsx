// Development only: shows content warnings in a small corner panel.
import React, { useState } from 'react';
import { warnings } from '../content/loadContent.js';

export default function DevPanel() {
  const [open, setOpen] = useState(false);
  if (!warnings.length) return null;
  return (
    <div style={{ position: 'fixed', right: 8, bottom: 8, zIndex: 200000, maxWidth: 420, font: '12px/1.4 monospace' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ background: '#5E3695', color: '#fff', border: 0, borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>
        {warnings.length} content warning{warnings.length === 1 ? '' : 's'}
      </button>
      {open ? (
        <ul style={{ background: '#fff', color: '#130F1F', margin: '4px 0 0', padding: '8px 8px 8px 22px', borderRadius: 4, maxHeight: 300, overflow: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,.25)' }}>
          {warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
