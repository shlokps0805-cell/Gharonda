// The right-click sticker menu, markup ported from the design's StickerPhysics.
import React from 'react';
import { css } from '../design/dc.js';

const SIZES = [['S', 76], ['M', 124], ['L', 200]];

export default function StickerMenu({ ui, x, y, size, angle, stuck, onAct }) {
  const row = (label, what, disabled, colour) => (
    <button
      type="button"
      role="menuitem"
      className="nh-btn nh-hover-underline"
      disabled={disabled}
      onClick={() => onAct(what)}
      style={css(`width:100%;padding:9px 16px;font:700 13px/1 'Courier Prime',monospace;letter-spacing:.06em;color:${disabled ? 'rgba(19,15,31,.35)' : colour || '#130F1F'};cursor:pointer`)}
    >
      {label}
    </button>
  );
  const shownAngle = ((angle + 540) % 360) - 180;
  return (
    <div
      role="menu"
      aria-label="sticker menu"
      onPointerDown={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
      style={{ ...css('position:absolute;z-index:9999;width:236px;padding:8px 0;background:#FFFFFF;border-radius:8px;box-shadow:0 1px 2px rgba(19,15,31,.25),0 10px 24px rgba(19,15,31,.22);display:flex;flex-direction:column;pointer-events:auto;cursor:auto;animation:nh-pop 120ms cubic-bezier(0.34,1.56,0.64,1)'), left: x, top: y }}
    >
      {row(ui.stick || 'Stick here', 'stick', stuck)}
      {row(ui.fall || 'Let it fall', 'fall', !stuck)}
      {row(ui.duplicate || 'Duplicate', 'dup')}
      {row(ui.front || 'Bring to front', 'front')}
      {row(ui.peel || 'Peel off (delete)', 'peel', false, '#A63A48')}
      <div style={css('padding:8px 16px 4px;border-top:1px solid #ECE8F2;margin-top:4px;display:flex;align-items:center;gap:8px')}>
        <span style={css("width:44px;font:700 12px/1 'Courier Prime',monospace;color:#3D4A66")}>{ui.size || 'SIZE'}</span>
        {SIZES.map(([l, v]) => {
          const on = Math.abs(size - v) < 20;
          return (
            <button key={l} type="button" className="nh-btn" aria-label={`size ${l}`} onClick={() => onAct('size', v)} style={css(`width:32px;height:28px;border-radius:999px;border:1.5px solid #204670;background:${on ? '#204670' : '#FFFFFF'};color:${on ? '#FFFFFF' : '#204670'};display:flex;align-items:center;justify-content:center;font:700 12px/1 'Courier Prime',monospace;cursor:pointer`)}>
              {l}
            </button>
          );
        })}
      </div>
      <div style={css('padding:4px 16px 6px;display:flex;align-items:center;gap:10px')}>
        <span style={css('width:44px')} />
        <input type="range" min="40" max="320" value={size} aria-label="sticker size" onChange={e => onAct('size', +e.target.value)} style={css('flex:1;min-width:0;accent-color:#5E3695')} />
        <span style={css("font:700 12px/1 'Courier Prime',monospace;color:#130F1F;min-width:32px;text-align:right")}>{size}</span>
      </div>
      <div style={css('padding:4px 16px 10px;display:flex;align-items:center;gap:10px')}>
        <span style={css("width:44px;font:700 12px/1 'Courier Prime',monospace;color:#3D4A66")}>{ui.angle || 'ANGLE'}</span>
        <input type="range" min="-180" max="180" value={shownAngle} aria-label="sticker angle" onChange={e => onAct('angle', +e.target.value)} style={css('flex:1;min-width:0;accent-color:#5E3695')} />
        <span style={css("font:700 12px/1 'Courier Prime',monospace;color:#130F1F;min-width:32px;text-align:right")}>{shownAngle}°</span>
      </div>
    </div>
  );
}
