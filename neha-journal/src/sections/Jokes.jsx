// The joke archive (design: JokesScene "board"): a lavender felt board of notes, each on a
// gold pin, with one red thread running pin to pin. Click a note to flip it to its origin
// story. Filters: All, or by person. Any number of jokes: the board grows and scrolls.
import React, { useEffect, useMemo, useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import RansomWord from '../design/RansomWord.jsx';
import { mediaUrl } from '../design/Photo.jsx';
import Fastener from '../design/Fastener.jsx';
import StickerLayer from '../components/StickerLayer.jsx';

// the design's ten note spots [x, y, width, tilt]; further jokes repeat the pattern lower down
const POS = [[150, 180, 230, -3], [410, 170, 200, 2], [640, 150, 270, -2], [950, 160, 250, 3], [140, 410, 220, 2], [390, 390, 300, -1], [720, 420, 210, 3], [960, 430, 240, -3], [210, 610, 290, 1], [560, 620, 260, -2]];
const SNAKE = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9]; // thread order within each block of ten
const BLOCK = 640;

function layout(jokes) {
  return jokes.map((j, i) => {
    const [x, y, w, r] = POS[i % 10];
    const len = j.text.length;
    const pics = j.images && j.images.length;
    return { j, i, x, y: y + Math.floor(i / 10) * BLOCK, w: len > 120 || pics ? Math.max(w, 300) : w, r, h: (len > 50 ? 150 : len > 30 ? 120 : 96) + (pics ? 140 : 0) };
  });
}

// one SVG path, sagging a little between pins (design: quadratic curve per pair)
function threadPath(notes) {
  const order = [];
  for (let b = 0; b * 10 < notes.length; b++) SNAKE.forEach(k => { if (notes[b * 10 + k]) order.push(notes[b * 10 + k]); });
  const pts = order.map(n => [n.x + n.w / 2, n.y + 4]);
  if (pts.length < 2) return { d: '', pins: pts };
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let k = 1; k < pts.length; k++) {
    const [px, py] = pts[k - 1], [qx, qy] = pts[k];
    d += ` Q${(px + qx) / 2} ${Math.max(py, qy) + 26 + Math.abs(qx - px) * 0.06} ${qx} ${qy}`;
  }
  return { d, pins: pts };
}

export default function Jokes({ content, go, reduced }) {
  const { jokes, friends, ui } = content;
  const t = ui.jokes;
  const [person, setPerson] = useState('');
  const [menu, setMenu] = useState(false);
  const [flipped, setFlipped] = useState(null);
  const [hover, setHover] = useState(null);
  const shown = person ? jokes.filter(j => j.submittedBy === person) : jokes;
  const notes = useMemo(() => layout(shown), [shown]);
  const { d, pins } = useMemo(() => threadPath(notes), [notes]);
  const people = friends.filter(f => jokes.some(j => j.submittedBy === f.id));
  // Esc closes the "by person" menu
  useEffect(() => {
    if (!menu) return undefined;
    const onKey = e => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);
  const H = Math.max(756, ...notes.map(n => n.y + n.h + 120)) + 40;

  return (
    <>
      <div style={css('position:absolute;left:88px;top:28px')}>
        <SpiralJournal w={1180} h={756} paper="tint" tint="#B7A9D3" coil="silver" holeColor="#3B2266" />
      </div>
      <div style={css('position:absolute;left:120px;top:30px;width:1148px;height:752px;pointer-events:none;background:url(/media/textures/film-grain.png) 0 0/200px 200px;opacity:.9')} />
      <div className="nh-hide-scroll" style={css('position:absolute;left:0;top:18px;width:1440px;height:788px;overflow-y:auto;overflow-x:hidden')}>
        <div style={css(`position:relative;left:0;top:-18px;width:1440px;height:${H}px;margin-bottom:-18px`)}>
          <h1 style={css('position:absolute;left:150px;top:46px;margin:0')} aria-label={t.title}><RansomWord text={t.title} size={44} /></h1>
          <div style={css("position:absolute;left:162px;top:128px;font:700 13px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#320F6F")}>{jokes.length ? `${jokes.length} ${t.count}` : t.empty}</div>
          <div style={css('position:absolute;left:760px;top:64px;display:flex;gap:8px;z-index:50')}>
            <button type="button" className="nh-btn" aria-pressed={!person} onClick={() => { setPerson(''); setMenu(false); }} style={css(`height:36px;padding:0 14px;border-radius:6px 6px 2px 2px;background:${!person ? '#320F6F' : '#FFFFFF'};display:flex;align-items:center;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.1em;color:${!person ? '#FFFFFF' : '#320F6F'};box-shadow:0 1px 2px rgba(19,15,31,.25);cursor:pointer`)}>{t.all}</button>
            <div style={css('position:relative')}>
              <button type="button" className="nh-btn" aria-expanded={menu} onClick={() => setMenu(m => !m)} style={css(`height:36px;padding:0 14px;border-radius:6px 6px 2px 2px;background:${person ? '#320F6F' : '#FFFFFF'};display:flex;align-items:center;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.1em;color:${person ? '#FFFFFF' : '#320F6F'};box-shadow:0 1px 2px rgba(19,15,31,.25);cursor:pointer;white-space:nowrap`)}>
                {person ? `${(friends.find(f => f.id === person) || {}).name || ''} ▾` : t.byPerson}
              </button>
              {menu ? (
                <div role="menu" style={css('position:absolute;left:0;top:40px;min-width:180px;max-height:300px;overflow:auto;padding:6px 0;background:#FFFFFF;border-radius:8px;box-shadow:0 1px 2px rgba(19,15,31,.25),0 10px 24px rgba(19,15,31,.22);animation:nh-pop 120ms cubic-bezier(0.34,1.56,0.64,1)')}>
                  {people.map(f => (
                    <button key={f.id} type="button" role="menuitem" className="nh-btn nh-hover-underline" onClick={() => { setPerson(f.id); setMenu(false); setFlipped(null); }} style={css(`width:100%;padding:8px 14px;font:${f.hand === 'kalam' ? "400 22px/1.1 'Kalam'" : "600 24px/1.1 'Caveat'"},cursive;color:#320F6F;cursor:pointer;white-space:nowrap`)}>
                      <span style={css(`display:inline-block;width:10px;height:10px;border-radius:50%;background:${f.colour};margin-right:8px`)} />{f.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {notes.map(n => {
            // a joke without an origin story stays face up
            const canFlip = !!n.j.lore;
            const isFlipped = canFlip && flipped === n.j.id;
            const hov = hover === n.j.id;
            const face = css(`grid-area:1/1;padding:24px 20px 16px;border-radius:2px;display:flex;flex-direction:column;gap:12px;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:${hov ? '0 4px 8px rgba(19,15,31,.3),0 18px 30px rgba(19,15,31,.25)' : '0 1px 2px rgba(19,15,31,.3),0 6px 12px rgba(19,15,31,.16)'}`);
            return (
              <button
                key={n.j.id}
                type="button"
                className="nh-btn"
                aria-pressed={canFlip ? isFlipped : undefined}
                aria-label={isFlipped ? n.j.lore : n.j.text}
                onClick={() => { if (canFlip) setFlipped(isFlipped ? null : n.j.id); }}
                onMouseEnter={() => setHover(n.j.id)}
                onMouseLeave={() => setHover(null)}
                style={css(`position:absolute;left:${n.x}px;top:${n.y}px;width:${n.w}px;min-height:${n.h}px;transform:rotate(${n.r}deg) translateY(${hov ? -6 : 0}px);transition:transform 200ms cubic-bezier(0.34,1.56,0.64,1);z-index:${hov ? 30 : n.i + 1};perspective:900px;cursor:${canFlip ? 'pointer' : 'default'}`)}
              >
                <div style={css(`display:grid;width:100%;min-height:${n.h}px;transform-style:preserve-3d;transition:transform ${reduced ? 0 : 400}ms cubic-bezier(0.65,0,0.35,1);transform:rotateY(${isFlipped ? 180 : 0}deg)`)}>
                  {/* front: the joke (sizes the note) */}
                  <div style={{ ...face, minHeight: n.h, background: n.i % 3 === 2 ? '#FBF9F5' : '#FFFFFF', backgroundImage: n.i % 3 === 1 ? 'repeating-linear-gradient(180deg,transparent 0 27px,rgba(142,167,201,.35) 27px 28px)' : 'none' }}>
                    <div style={css(`font:${n.i % 2 ? "400 22px/1.3 'Kalam',cursive" : "500 17px/1.45 'DM Sans',sans-serif"};color:#130F1F`)}>{n.j.text}</div>
                    {n.j.images.length ? (
                      <div style={css('display:flex;gap:8px')}>
                        {n.j.images.map(src => <img key={src} src={mediaUrl(src)} alt="" draggable="false" style={css('flex:1;min-width:0;height:130px;object-fit:cover;border-radius:2px;display:block')} />)}
                      </div>
                    ) : null}
                    {n.j.submittedByName ? <div style={css("margin-top:auto;font:700 10px/1 'Courier Prime',monospace;letter-spacing:.1em;color:#3D4A66;text-transform:uppercase")}>{t.submittedBy} {n.j.submittedByName}</div> : null}
                  </div>
                  {/* back: the origin story on lilac paper */}
                  <div style={{ ...face, background: '#ECE3F8', transform: 'rotateY(180deg)' }}>
                    <div style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#4A3560")}>{t.origin}</div>
                    <div style={css(`font:600 ${n.j.lore.length > 60 ? 22 : 26}px/1.15 'Caveat',cursive;color:#320F6F`)}>{n.j.lore}</div>
                  </div>
                </div>
              </button>
            );
          })}

          <svg width="1440" height={H} aria-hidden="true" style={css('position:absolute;left:0;top:0;pointer-events:none;z-index:40')}>
            {d ? <path d={d} fill="none" stroke="#B3242C" strokeWidth="1.6" strokeLinecap="round" opacity=".92" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 0, animation: reduced ? 'none' : 'nh-thread 900ms ease-out 300ms both' }} /> : null}
          </svg>
          {pins.map(([x, y], i) => <div key={i} style={css(`position:absolute;left:${x - 10}px;top:${y - 10}px;z-index:41;pointer-events:none`)}><Fastener kind="pin" size={18} /></div>)}

          {jokes.length ? (
            <button type="button" className="nh-btn" onClick={() => go('back')} style={css(`position:absolute;left:1000px;top:${H - 70}px;font:600 30px/1 'Caveat',cursive;color:#320F6F;cursor:pointer;text-decoration:underline;text-decoration-color:#FFFFFF;text-decoration-thickness:2px;text-underline-offset:5px`)}>
              {t.backPages}
            </button>
          ) : null}
          <StickerLayer pageId="jokes" fixed={content.stickers.pages.jokes?.fixed} width={1440} height={H} floorY={H} ui={ui.stickerMenu} z={45} />
        </div>
      </div>
    </>
  );
}
