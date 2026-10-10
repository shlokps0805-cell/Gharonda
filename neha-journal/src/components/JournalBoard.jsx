// The journal's brown leather boards, behind the pages on every open page, so the
// journal always reads as one book: brown edges around the paper, the spiral at the binding.
import React from 'react';

export default function JournalBoard() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', left: 78, top: 18, width: 1204, height: 788, borderRadius: '10px 12px 12px 10px',
        background: 'url(/media/textures/leather-brown.png) 0 0/200px 200px, #6B4A33',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08), inset 0 -3px 6px rgba(0,0,0,.25), 0 2px 4px rgba(19,15,31,.3), 0 20px 44px rgba(19,15,31,.32)',
      }}
    />
  );
}
