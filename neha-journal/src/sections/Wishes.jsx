// Wishes: the envelope grid on one wide lined page (design: WishScene "grid"), and each
// friend's letter at #/wishes/<friend-id>. Opened envelopes stay opened (saved).
// Up to 12 friends: 4 x 3. 13-16: 4 x 4, scaled to fit. More: further pages of 16.
import React, { useEffect, useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import PhotoFrame from '../design/PhotoFrame.jsx';
import Fastener from '../design/Fastener.jsx';
import Envelope from '../design/Envelope.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import Letter from './wishes/Letter.jsx';
import * as storage from '../lib/storage.js';

const TILT = [-2, 1.5, -1, 2, 1, -2, 1.5, -1.5, -1, 2, -1.5, 1];
const PER_PAGE = 16;

export default function Wishes({ content, parts, go, reduced }) {
  const { wishes, site, ui } = content;
  const t = ui.wishes;
  const [opened, setOpened] = useState(() => new Set(storage.get('wishes.opened', [])));
  const [anim, setAnim] = useState({}); // id -> 'cracked' | 'open' while an envelope opens
  const [hover, setHover] = useState(null);
  const [showEnd, setShowEnd] = useState(false);

  const markOpened = id => setOpened(prev => {
    if (prev.has(id)) return prev;
    const next = new Set(prev).add(id);
    storage.set('wishes.opened', [...next]);
    return next;
  });

  const current = parts[0] && parts[0] !== 'page' ? wishes.find(w => w.id === parts[0]) : null;
  useEffect(() => { if (current) markOpened(current.id); }, [current]);

  const openedCount = wishes.filter(w => opened.has(w.id)).length;
  const allOpened = wishes.length > 0 && openedCount === wishes.length;
  // the end line appears when she comes back from the last letter, then stays
  useEffect(() => { if (!current && allOpened) setShowEnd(true); }, [current, allOpened]);

  if (current) {
    return <Letter key={current.id} wish={current} wishes={wishes} content={content} go={go} reduced={reduced} />;
  }

  const pageNo = parts[0] === 'page' ? Math.max(1, Number(parts[1]) || 1) : 1;
  const pages = Math.max(1, Math.ceil(wishes.length / PER_PAGE));
  const onPage = wishes.slice((pageNo - 1) * PER_PAGE, pageNo * PER_PAGE);
  const fourRows = onPage.length > 12;
  const scale = fourRows ? 0.8 : 1;
  const spot = i => fourRows
    ? { x: 230 + (i % 4) * 236, y: 270 + Math.floor(i / 4) * 122 }
    : { x: 210 + (i % 4) * 250, y: 300 + Math.floor(i / 4) * 160 };

  const open = w => {
    if (anim[w.id]) return;
    if (reduced) { go(`wishes/${w.id}`); return; }
    // seal presses and cracks, the flap folds open, then the page turns to the letter
    setAnim(a => ({ ...a, [w.id]: 'cracked' }));
    setTimeout(() => setAnim(a => ({ ...a, [w.id]: 'open' })), 400);
    setTimeout(() => go(`wishes/${w.id}`), 950);
  };

  return (
    <>
      <div style={css('position:absolute;left:88px;top:28px')}>
        <SpiralJournal w={1180} h={756} paper="lined" coil="silver" />
      </div>
      <div style={css('position:absolute;left:160px;top:56px;display:flex;flex-direction:column;gap:8px')}>
        <div style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#204670")}>{t.kicker}</div>
        <h1 style={css("margin:0;font:400 48px/1.05 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap")}>{t.title}</h1>
        <div style={css("font:600 28px/1 'Caveat',cursive;color:#5E3695")}>{t.sub}</div>
      </div>
      <div style={css("position:absolute;left:720px;top:74px;font:700 13px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#FFFFFF;background:#204670;padding:7px 12px;border-radius:2px")}>
        {openedCount} {t.of} {wishes.length} {t.opened}
      </div>
      <div style={css('position:absolute;left:964px;top:40px')}>
        <PhotoFrame type="polaroid" ratio="3:2" size={240} rotate={3} showCaption={false} caption={site.groupName} src={site.groupPhoto} alt={site.groupName} label="photo · the group · 3:2" />
      </div>
      <div style={css('position:absolute;left:1066px;top:24px')}><Fastener kind="binder" /></div>

      {onPage.map((w, i) => {
        const p = spot(i);
        const f = w.friendInfo;
        const state = anim[w.id] || (opened.has(w.id) ? 'open' : 'closed');
        const hov = hover === w.id;
        return (
          <button
            key={w.id}
            type="button"
            className="nh-btn"
            aria-label={`${t.letter.toLowerCase()} from ${f.name}${opened.has(w.id) ? ' (opened)' : ''}`}
            onClick={() => open(w)}
            onMouseEnter={() => setHover(w.id)}
            onMouseLeave={() => setHover(null)}
            style={css(`position:absolute;left:${p.x}px;top:${p.y}px;transform:translateY(${hov ? -4 : 0}px) rotate(${TILT[i % 12] + (hov ? (i % 2 ? 2 : -2) : 0)}deg) scale(${scale});transform-origin:0 0;transition:transform 200ms cubic-bezier(0.34,1.56,0.64,1);cursor:pointer`)}
          >
            <Envelope size="small" state={state} animate={state === 'open' && !!anim[w.id]} color={f.colour} label={f.name} handFont={f.font} />
          </button>
        );
      })}

      {pages > 1 ? (
        <button type="button" className="nh-btn" onClick={() => go(pageNo < pages ? `wishes/page/${pageNo + 1}` : 'wishes')} style={css("position:absolute;left:1020px;top:740px;font:600 28px/1 'Caveat',cursive;color:#5E3695;cursor:pointer")}>
          {pageNo < pages ? t.more : '← ' + t.title}
        </button>
      ) : null}

      <StickerLayer pageId="wishes" fixed={content.stickers.pages.wishes?.fixed} floorY={784} ui={ui.stickerMenu} />

      {showEnd ? (
        <div style={css('position:absolute;left:88px;top:28px;width:1180px;height:756px;background:rgba(255,255,255,.72);display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:35;animation:nh-fade-in 600ms ease-out both')}>
          <div style={css('display:flex;flex-direction:column;align-items:center;gap:18px;transform:rotate(-2deg)')}>
            <div style={{ ...css("font:600 72px/1.1 'Caveat',cursive;color:#204670;white-space:nowrap"), animation: reduced ? 'none' : 'nh-write 1200ms ease-out both' }}>{t.end}</div>
            <div style={css("font:400 26px/1 'Kalam',cursive;color:#5E3695")}>— {site.groupName}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
