// Small, safe easter eggs (each can be switched off in content/site.json):
//  - typing one of her nicknames anywhere: a 2-second rain of stickers that fade on landing
//  - a secret key sequence: a message from the group
// Keys typed into inputs or while a game is open never count.
import React, { useEffect, useRef, useState } from 'react';
import Sticker from '../design/Sticker.jsx';
import { pileStickers } from '../design/stickerSheet.js';
import { css } from '../design/dc.js';

function ignoreKeys(e) {
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return true;
  return window.location.hash.startsWith('#/games/');
}

export default function EasterEggs({ site, ui, reduced }) {
  const typed = useRef('');
  const [rain, setRain] = useState(null);
  const [message, setMessage] = useState(false);
  const eggs = site.easterEggs;
  const nicknames = eggs.nicknameRain.on ? site.nicknames.map(n => n.toLowerCase().replace(/\s+/g, '')) : [];
  const secret = eggs.secretKeys.on ? String(eggs.secretKeys.sequence || '').toLowerCase().replace(/\s+/g, '') : '';

  useEffect(() => {
    if (!nicknames.length && !secret) return undefined;
    const onKey = e => {
      if (ignoreKeys(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') { setMessage(false); return; }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key === 'ArrowUp' ? '↑' : e.key === 'ArrowDown' ? '↓' : e.key === 'ArrowLeft' ? '←' : e.key === 'ArrowRight' ? '→' : '';
      if (!k || k === ' ') return;
      typed.current = (typed.current + k).slice(-40);
      if (nicknames.some(n => n && typed.current.endsWith(n))) {
        typed.current = '';
        startRain();
      }
      if (secret && typed.current.endsWith(secret)) {
        typed.current = '';
        setMessage(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function startRain() {
    if (reduced) return;
    const kinds = pileStickers();
    const drops = Array.from({ length: 22 }, (_, i) => ({
      k: kinds[Math.floor(Math.random() * kinds.length)].id,
      x: Math.random() * 96,
      delay: Math.random() * 1400,
      size: 50 + Math.round(Math.random() * 40),
      r: Math.round(Math.random() * 60 - 30),
      id: i,
    }));
    setRain({ id: Date.now(), drops });
    setTimeout(() => setRain(null), 3600);
  }

  return (
    <>
      {rain ? (
        <div key={rain.id} aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 90000, overflow: 'hidden' }}>
          {rain.drops.map(d => (
            <div key={d.id} style={{ position: 'absolute', left: `${d.x}%`, top: -120, animation: `nh-rain 1800ms cubic-bezier(.5,0,.75,0) ${d.delay}ms both` }}>
              <Sticker kind={d.k} size={d.size} rotate={d.r} />
            </div>
          ))}
        </div>
      ) : null}
      {message ? (
        <div role="dialog" aria-label={ui.fromGroup} onClick={() => setMessage(false)} style={css('position:fixed;inset:0;z-index:90001;background:rgba(20,30,51,.45);display:flex;align-items:center;justify-content:center;padding:16px')}>
          <div style={css('max-width:420px;padding:30px 28px 24px;background:#FFFFFF;transform:rotate(-1.5deg);box-shadow:0 2px 4px rgba(19,15,31,.3),0 18px 36px rgba(19,15,31,.3);display:flex;flex-direction:column;gap:12px')}>
            <span style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#5E3695;text-transform:uppercase")}>{ui.fromGroup}</span>
            <p style={css("margin:0;font:600 30px/1.15 'Caveat',cursive;color:#204670")}>{eggs.secretKeys.message}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
