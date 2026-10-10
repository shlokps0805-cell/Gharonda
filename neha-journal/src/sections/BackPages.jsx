// The back pages (design: JokesScene "back"): the signed-by list, the group photo, the
// library card ("due back: never", typed line by line when clicked) and the small
// "replay the opening" link. Reached from the contents page and the end of the jokes.
import React, { useEffect, useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import PhotoFrame from '../design/PhotoFrame.jsx';
import StickerLayer from '../components/StickerLayer.jsx';

const TILT = [-2, 1, 2, -1, 1, -2, 2, -1, -1, 2, 1, -2];

export default function BackPages({ content, onReplay, reduced }) {
  const { friends, site, ui } = content;
  const t = ui.back;
  const lines = t.cardLines || [];
  const full = lines.map(([d, i]) => d + '|' + i).join('\n');
  const [typed, setTyped] = useState(0); // characters typed so far
  const [started, setStarted] = useState(false);

  // 40 ms per character, Courier, line by line
  useEffect(() => {
    if (!started) return undefined;
    if (reduced) { setTyped(full.length); return undefined; }
    const id = setInterval(() => setTyped(n => { if (n >= full.length) { clearInterval(id); return n; } return n + 1; }), 40);
    return () => clearInterval(id);
  }, [started, reduced, full.length]);

  const shown = full.slice(0, typed).split('\n');
  const rows = [0, 1, 2].map(r => {
    const [d = '', i = ''] = (shown[r] || '').split('|');
    return { d, i };
  });
  const twoCols = friends.length > 12;

  return (
    <>
      <div style={css('position:absolute;left:94px;top:34px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#ECE8E1')} />
      <div style={css('position:absolute;left:88px;top:28px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#FFFFFF;box-shadow:0 2px 3px rgba(19,15,31,.22),0 18px 40px rgba(19,15,31,.24);overflow:hidden')}>
        <div style={css('position:absolute;inset:0;background:url(/media/textures/grain.png) 0 0/128px 128px')} />
      </div>
      <div style={css('position:absolute;left:678px;top:28px')}>
        <SpiralJournal w={590} h={756} paper="cover-brown" coil="silver" />
      </div>
      <div style={css('position:absolute;left:150px;top:62px;display:flex;flex-direction:column;gap:6px')}>
        <div style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#204670")}>{t.kicker}</div>
        <h1 style={css("margin:0;font:400 44px/1 'Libre Caslon Text',serif;color:#130F1F")}>{t.signedBy}</h1>
      </div>
      <ul style={css(`position:absolute;left:150px;top:170px;width:470px;margin:0;padding:0;list-style:none;display:grid;grid-template-columns:${twoCols ? '1fr 1fr 1fr' : '1fr 1fr'};gap:${twoCols ? '8px 16px' : '14px 24px'}`)}>
        {friends.map((f, i) => {
          // light colours are hard to read as signatures on white: a 45% deeper shade, with a true-colour dot
          const ink = f.dark ? f.colour : `color-mix(in oklch, ${f.colour} 45%, #130F1F)`;
          const font = f.hand === 'kalam' ? `400 ${twoCols ? 20 : 26}px/1.1 'Kalam',cursive` : `600 ${twoCols ? 23 : 30}px/1.1 'Caveat',cursive`;
          return (
            <li key={f.id} style={css(`display:flex;align-items:center;gap:8px;transform:rotate(${TILT[i % 12]}deg);min-width:0`)}>
              <span style={css(`width:10px;height:10px;border-radius:50%;background:${f.colour};flex:none`)} />
              <span style={css(`font:${font};color:${ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>{f.name}</span>
            </li>
          );
        })}
      </ul>
      <div style={css('position:absolute;left:180px;top:520px')}>
        <PhotoFrame type="corners" ratio="3:2" size={360} rotate={-2} showCaption={false} src={site.groupPhoto} alt={site.groupName} label="photo · all of us · 3:2 · medium" />
      </div>
      <button type="button" className="nh-btn" onClick={onReplay} style={css("position:absolute;left:150px;top:752px;font:700 11px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#5E3695;text-transform:uppercase;text-decoration:underline;text-decoration-color:#C4A8E6;text-decoration-thickness:2px;text-underline-offset:4px;cursor:pointer")}>
        {t.replay}
      </button>

      {/* the library card in its kraft pocket */}
      <div style={css('position:absolute;left:770px;top:120px;width:380px;height:470px;transform:rotate(1deg)')}>
        <button type="button" className="nh-btn" aria-label={t.cardHint} onClick={() => setStarted(true)} style={css('position:absolute;left:38px;top:-70px;width:304px;height:400px;transform:rotate(-3deg);background:#FBF9F5;border:1px solid #DCCBF3;box-shadow:0 1px 2px rgba(19,15,31,.2);padding:18px 18px;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-start')}>
          <div style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#204670;text-align:center;padding-bottom:10px;border-bottom:1.5px solid #204670")}>{t.cardTitle}</div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #ACBFD3')}>
            <span style={css("font:700 10px/1 'Courier Prime',monospace;color:#3D4A66;padding:8px 0")}>{t.dateDue}</span>
            <span style={css("font:700 10px/1 'Courier Prime',monospace;color:#3D4A66;padding:8px 0")}>{t.issuedTo}</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={css('display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #DDE5F0;height:30px;align-items:center')}>
              <span style={css("font:400 15px/1 'Courier Prime',monospace;color:#130F1F;white-space:nowrap")}>{r.d}</span>
              <span style={css("font:400 15px/1 'Courier Prime',monospace;color:#130F1F;white-space:nowrap")}>{r.i}</span>
            </div>
          ))}
          {!started ? <div style={css("margin-top:18px;font:600 24px/1 'Caveat',cursive;color:#5E3695;text-align:center")}>{t.cardHint}</div> : null}
        </button>
        <div style={css('position:absolute;left:0;top:180px;width:380px;height:290px;background:url(/media/textures/kraft.png) 0 0/256px 256px;border-radius:2px 2px 8px 8px;box-shadow:0 2px 4px rgba(0,0,0,.35);clip-path:polygon(0 12%,40% 0,60% 0,100% 12%,100% 100%,0 100%);pointer-events:none')}>
          <div style={css("position:absolute;left:0;right:0;top:110px;text-align:center;font:400 30px/1 'Libre Caslon Text',serif;color:#3D2A1E")}>{t.returnTo}</div>
          <div style={css("position:absolute;left:0;right:0;top:152px;text-align:center;font:400 54px/1.2 'Pinyon Script',cursive;color:#3D2A1E")}>{t.allOfUs}</div>
        </div>
      </div>
      <StickerLayer pageId="back" fixed={content.stickers.pages.back?.fixed} floorY={784} ui={ui.stickerMenu} />
    </>
  );
}
