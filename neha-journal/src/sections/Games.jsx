// The games spread and the four games (design: GamesScene). URLs: #/games,
// #/games/connections, #/games/wordle, #/games/cryptic, #/games/world.
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import Fastener from '../design/Fastener.jsx';
import Sticker from '../design/Sticker.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import { CONNECTION_COLOURS } from '../content/defaults.js';

const Connections = lazy(() => import('../games/Connections.jsx'));
const Wordle = lazy(() => import('../games/Wordle.jsx'));
const Cryptic = lazy(() => import('../games/Cryptic.jsx'));
const NehasWorld = lazy(() => import('../games/NehasWorld.jsx'));
const GAMES = ['connections', 'wordle', 'cryptic', 'world'];

// tiny previews on the cards, in each game's own colours (design)
const GR = '#EFEFE6', DK = '#5A594E', Y = CONNECTION_COLOURS[1];
const MINI_C = [Y, Y, Y, Y, GR, GR, GR, GR, GR, DK, GR, GR, DK, GR, DK, DK];
const WC = { G: '#6AAA64', Y: '#C9B458', X: '#787C7E' };
const MINI_W = [...'XYXYXGGYXXGGGGG'].map(c => WC[c]);

function Preview({ id, content }) {
  if (id === 'connections') return <div style={css('display:grid;grid-template-columns:repeat(4,36px);gap:4px')}>{MINI_C.map((c, i) => <div key={i} style={css(`height:22px;border-radius:3px;background:${c}`)} />)}</div>;
  if (id === 'wordle') return <div style={css('display:grid;grid-template-columns:repeat(5,26px);gap:4px')}>{MINI_W.map((c, i) => <div key={i} style={css(`height:26px;background:${c};border:1.5px solid ${c}`)} />)}</div>;
  if (id === 'cryptic') {
    const clue = content.cryptic[content.cryptic.length - 1];
    return (
      <div style={css('width:170px;padding:14px;background:#FFFFFF;box-shadow:0 1px 3px rgba(19,15,31,.2);display:flex;flex-direction:column;gap:10px')}>
        <div style={css("font:italic 400 14px/1.3 'Libre Caslon Text',serif;color:#130F1F")}>{clue ? clue.clue : '…'}</div>
        <div style={css('display:flex;gap:4px;flex-wrap:wrap')}>{Array.from({ length: clue ? Math.min(clue.answer.length, 7) : 4 }, (_, i) => <div key={i} style={css('width:22px;height:22px;border:1.5px solid #130F1F')} />)}</div>
      </div>
    );
  }
  return (
    <div style={css('width:190px;height:120px;border-radius:10px;background:#204670;padding:8px')}>
      <div style={css('width:100%;height:100%;border-radius:4px;background:linear-gradient(180deg,#2A3F66,#4A3560 70%,#5E3695);position:relative')}>
        <div style={css('position:absolute;left:0;right:0;bottom:0;height:16px;background:repeating-linear-gradient(90deg,#CED9E4 0 8px,#ACBFD3 8px 16px)')} />
        <div style={css('position:absolute;left:24px;bottom:16px;width:12px;height:20px;border-radius:5px 5px 2px 2px;background:#FBF9F5')} />
      </div>
    </div>
  );
}

function Spread({ content, go, reduced }) {
  const { ui } = content;
  const g = ui.games;
  const [hover, setHover] = useState(-1);
  const tilt = [-1.5, 1.2, -1, 1.6];
  return (
    <>
      <div style={css('position:absolute;left:160px;top:70px;display:flex;flex-direction:column;gap:6px;width:600px')}>
        <h1 style={css("margin:0;font:400 40px/1.05 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap")}>{g.spreadTitle}</h1>
        <div style={css("font:600 26px/1 'Caveat',cursive;color:#5E3695;white-space:nowrap")}>{g.spreadSub}</div>
      </div>
      <div style={css('position:absolute;left:130px;top:216px;display:flex;gap:30px')}>
        {g.cards.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className="nh-btn"
            onClick={() => go(`games/${c.id}`)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            style={css(`position:relative;width:250px;height:420px;padding:28px 22px 22px;background:#FFFFFF;border-radius:4px;box-shadow:0 1px 2px rgba(19,15,31,.22),0 10px 22px rgba(19,15,31,.12);transform:rotate(${hover === i ? 0 : tilt[i]}deg) translateY(${hover === i ? -4 : 0}px);transition:transform 200ms cubic-bezier(0.34,1.56,0.64,1);display:flex;flex-direction:column;gap:12px;cursor:pointer;animation:${reduced ? 'none' : `nh-fade-up 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * 70}ms both`}`)}
          >
            {i % 2 === 0 ? (
              <div style={css('position:absolute;left:50%;top:-20px;margin-left:-20px')}><Fastener kind="binder" /></div>
            ) : (
              <div style={css('position:absolute;left:70px;top:-12px;width:110px;height:26px;transform:rotate(-4deg);opacity:.86;background:repeating-linear-gradient(90deg,#F7F1E6 0 5px,#ACBFD3 5px 8px);clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%)')} />
            )}
            <div style={css("font:400 24px/1.15 'Libre Caslon Text',serif;color:#130F1F")}>{c.name}</div>
            <div style={css("font:600 22px/1.1 'Caveat',cursive;color:#5E3695")}>{c.line}</div>
            <div style={css('margin-top:auto;height:170px;width:100%;border-radius:4px;background:#F4F2F7;display:flex;align-items:center;justify-content:center;overflow:hidden')}>
              <Preview id={c.id} content={content} />
            </div>
            <div style={css('position:absolute;right:-20px;bottom:-22px')}><Sticker kind={c.sticker} size={70} rotate={[8, -6, 8, -4][i]} /></div>
          </button>
        ))}
      </div>
    </>
  );
}

export default function Games({ content, parts, go, reduced }) {
  const { ui } = content;
  const game = GAMES.includes(parts[0]) ? parts[0] : null;
  const g = ui.games;

  useEffect(() => {
    if (!game) return undefined;
    const onKey = e => { if (e.key === 'Escape' && !document.querySelector('[data-world-expanded]')) go('games'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [game, go]);

  const props = { content, go, reduced, ui: g[game] || {} };
  return (
    <>
      <div style={css('position:absolute;left:88px;top:28px')}>
        <SpiralJournal w={1180} h={756} paper={game === 'cryptic' ? 'lined' : 'grid'} coil="silver" />
      </div>
      {game ? (
        <>
          <button type="button" className="nh-btn" onClick={() => go('games')} style={css("position:absolute;left:150px;top:52px;display:inline-flex;align-items:center;height:40px;padding:0 16px;border-radius:0 10px 10px 0;background:#ECE3F8;border-left:4px solid #5E3695;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#320F6F;white-space:nowrap;box-shadow:0 1px 2px rgba(19,15,31,.2);cursor:pointer;z-index:5")}>{g.back}</button>
          <div style={css(`position:absolute;left:400px;top:${game === 'world' ? 48 : 92}px;display:flex;flex-direction:column;gap:6px;width:640px`)}>
            <h1 style={css("margin:0;font:400 40px/1.05 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap")}>{props.ui.title}</h1>
            <div style={css("font:600 26px/1 'Caveat',cursive;color:#5E3695;white-space:nowrap")}>{props.ui.sub}</div>
          </div>
          <Suspense fallback={null}>
            {game === 'connections' && <Connections {...props} />}
            {game === 'wordle' && <Wordle {...props} />}
            {game === 'cryptic' && <Cryptic {...props} />}
            {game === 'world' && <NehasWorld {...props} />}
          </Suspense>
        </>
      ) : (
        <Spread content={content} go={go} reduced={reduced} />
      )}
      <StickerLayer key={game || 'spread'} pageId={game ? `games-${game}` : 'games'} fixed={content.stickers.pages[game ? `games-${game}` : 'games']?.fixed} floorY={784} ui={ui.stickerMenu} z={20} />
    </>
  );
}
