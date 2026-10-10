// The timeline spread: title, year buttons, a pencil line with a photo cluster per era
// (design: TimelineScene, view "page"). Clicking a year button or a cluster opens the era's
// pull-out page at #/timeline/era/<id>.
import React, { useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import PhotoFrame from '../design/PhotoFrame.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import EraPage from './timeline/EraPage.jsx';

// the design's five cluster spots and pencil line (used as-is for five eras)
const SPOTS = [[150, 300, 'corners'], [400, 440, 'clipped'], [710, 380, 'corners'], [960, 90, 'clipped'], [980, 450, 'corners']];
const DESIGN_PATH = 'M200 470 C 300 600, 420 640, 520 590 S 760 520, 840 560 S 1000 300, 1120 290 S 1180 560, 1080 640';
const ROT = [-3, 2, -2, 3, -1];

// any other number of eras: an even zig-zag across both pages, smaller clusters when crowded
function clusterSpots(n) {
  if (n <= 5) return SPOTS.slice(0, n).map(([x, y, t]) => ({ x, y, t, scale: 1 }));
  const scale = n <= 8 ? 0.72 : 0.58;
  const perRow = Math.ceil(n / 2);
  const left = 140, right = 1240 - 264 * scale;
  return Array.from({ length: n }, (_, i) => {
    const row = i < perRow ? 0 : 1, col = row ? i - perRow : i, cols = row ? n - perRow : perRow;
    const x = cols > 1 ? left + (right - left) * col / (cols - 1) : left;
    return { x: Math.round(x), y: row ? 520 : 270 + (col % 2) * 40, t: i % 2 ? 'clipped' : 'corners', scale };
  });
}

export default function Timeline({ content, parts, go, reduced }) {
  const { timeline: eras, ui } = content;
  const t = ui.timeline;
  const [hover, setHover] = useState(-1);
  const openId = parts[0] === 'era' ? parts[1] : null;
  const openEra = eras.find(e => e.id === openId);
  const spots = clusterSpots(eras.length);
  const path = eras.length === 5 ? DESIGN_PATH : spots.length > 1 ? 'M' + spots.map(s => `${s.x + 132 * s.scale} ${s.y + 130 * s.scale}`).join(' L ') : '';

  return (
    <>
      <div style={css('position:absolute;left:94px;top:34px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#ECE8E1')} />
      <div style={css('position:absolute;left:88px;top:28px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background-color:#FFFFFF;background-image:repeating-linear-gradient(0deg,transparent 0 23px,rgba(142,167,201,.3) 23px 24px),repeating-linear-gradient(90deg,transparent 0 23px,rgba(142,167,201,.3) 23px 24px);box-shadow:0 2px 3px rgba(19,15,31,.22),0 18px 40px rgba(19,15,31,.24)')}>
        <div style={css('position:absolute;top:0;bottom:0;right:0;width:60px;background:linear-gradient(270deg,rgba(19,15,31,.1),rgba(19,15,31,0))')} />
      </div>
      <div style={css('position:absolute;left:678px;top:28px')}>
        <SpiralJournal w={590} h={756} paper="grid" coil="silver" />
      </div>

      <div style={css('position:absolute;left:140px;top:62px;display:flex;flex-direction:column;gap:8px')}>
        <div style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#204670")}>{t.kicker}</div>
        <h1 style={css("margin:0;font:400 48px/1.05 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap")}>{t.title} <span style={css('font-style:italic')}>{t.titleItalic}</span></h1>
        <div style={css("font:600 28px/1 'Caveat',cursive;color:#5E3695")}>{eras.length ? t.pick : t.empty}</div>
      </div>

      {/* year buttons: year in Courier Prime, era name in Kalam */}
      <div style={css(`position:absolute;left:140px;top:206px;display:flex;flex-wrap:wrap;gap:8px;width:${eras.length > 5 ? 520 : 560}px`)}>
        {eras.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className="nh-btn"
            onClick={() => go(`timeline/era/${e.id}`)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            style={css(`width:98px;padding:9px 8px 8px;background:${openId === e.id ? '#204670' : '#FFFFFF'};border-radius:3px;box-shadow:0 1px 2px rgba(19,15,31,.22);transform:translateY(${hover === i ? -2 : 0}px) rotate(${[-2, 1, -1, 2, -1][i % 5]}deg);transition:transform 150ms;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer`)}
          >
            <span style={css(`font:700 14px/1 'Courier Prime',monospace;letter-spacing:.08em;color:${openId === e.id ? '#FFFFFF' : '#204670'}`)}>{e.year}</span>
            <span style={css(`font:400 15px/1.35 'Kalam',cursive;padding-bottom:2px;color:${openId === e.id ? '#DCCBF3' : '#5E3695'};text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;text-decoration-line:${hover === i ? 'underline' : 'none'};text-decoration-color:#A57BD5;text-decoration-thickness:2px;text-underline-offset:4px`)}>{e.shortName}</span>
          </button>
        ))}
      </div>

      {path ? (
        <svg width="1440" height="900" aria-hidden="true" style={css('position:absolute;left:0;top:0;pointer-events:none')}>
          <path d={path} fill="none" stroke="#6E7F9C" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" style={{ strokeDashoffset: 0, animation: reduced ? 'none' : 'nh-fade-in 900ms ease-out both' }} />
        </svg>
      ) : null}

      {eras.map((e, i) => {
        const sp = spots[i];
        const first = e.photos[0];
        return (
          <button
            key={e.id}
            type="button"
            className="nh-btn"
            aria-label={`${e.year} ${e.name}`}
            onClick={() => go(`timeline/era/${e.id}`)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            style={{ ...css(`position:absolute;left:${sp.x}px;top:${sp.y}px;width:264px;height:300px;cursor:zoom-in;transform-origin:0 0;transition:transform 200ms cubic-bezier(0.34,1.56,0.64,1)`), transform: `scale(${sp.scale}) translateY(${hover === i ? -4 : 0}px)`, animation: reduced ? 'none' : `nh-fade-up 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * 70}ms both` }}
          >
            <div style={css('position:absolute;left:18px;top:12px;width:240px;height:240px;background:#FFFFFF;transform:rotate(-7deg);box-shadow:0 1px 2px rgba(19,15,31,.2)')} />
            <div style={css('position:absolute;left:4px;top:4px;width:240px;height:240px;background:#FFFFFF;transform:rotate(5deg);box-shadow:0 1px 2px rgba(19,15,31,.2)')} />
            <div style={css('position:absolute;left:6px;top:0')}>
              <PhotoFrame type={sp.t} ratio="1:1" size={240} rotate={ROT[i % 5]} tone={i % 3} showCaption={false} src={first && first.file} alt={first && first.alt} label={`photo · ${e.name} · 1:1 · small`} />
            </div>
            <div style={css('position:absolute;left:0;top:262px;display:flex;align-items:baseline;gap:8px')}>
              <span style={css("font:700 13px/1 'Courier Prime',monospace;letter-spacing:.08em;color:#FFFFFF;background:#204670;padding:4px 7px;border-radius:2px")}>{e.year}</span>
              <span style={css("font:400 20px/1 'Kalam',cursive;color:#204670;white-space:nowrap")}>{e.name}</span>
            </div>
          </button>
        );
      })}

      <StickerLayer pageId="timeline" fixed={content.stickers.pages.timeline?.fixed} floorY={784} ui={ui.stickerMenu} />

      {openEra ? <EraPage key={openEra.id} era={openEra} eras={eras} content={content} go={go} reduced={reduced} /> : null}
    </>
  );
}
