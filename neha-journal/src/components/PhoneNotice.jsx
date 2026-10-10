// Phones and narrow screens get a small card first (the phone layouts were never designed).
import React from 'react';
import { css } from '../design/dc.js';
import Sticker from '../design/Sticker.jsx';

export default function PhoneNotice({ ui, onAnyway }) {
  return (
    <div style={css('position:fixed;inset:0;background:url(/media/textures/gingham.jpeg) center/cover;display:flex;align-items:center;justify-content:center;padding:16px')}>
      <div style={css('position:absolute;inset:0;background:radial-gradient(ellipse 62% 64% at 50% 48%,rgba(251,249,245,.42) 0%,rgba(251,249,245,.22) 55%,rgba(32,70,112,.16) 100%)')} />
      <div style={css('position:relative;max-width:360px;width:100%;padding:34px 26px 26px;background:#FFFFFF;transform:rotate(-1.5deg);box-shadow:0 1px 2px rgba(19,15,31,.3),0 12px 24px rgba(19,15,31,.22);display:flex;flex-direction:column;gap:18px;align-items:flex-start')}>
        <div style={css('position:absolute;right:-22px;top:-30px')}><Sticker kind="check-star" size={70} rotate={10} /></div>
        <p style={css("margin:0;font:600 28px/1.15 'Caveat',cursive;color:#204670")}>{ui.note}</p>
        <button type="button" onClick={onAnyway} style={css("appearance:none;border:1.5px solid #204670;background:#FFFFFF;border-radius:999px;height:44px;padding:0 20px;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;text-transform:uppercase;cursor:pointer")}>
          {ui.anyway}
        </button>
      </div>
    </div>
  );
}
