// Neha's World (design: GamesScene "world-*"): a framed 960 x 540 slot in a navy console
// for a platformer made elsewhere. Empty embedUrl -> "the game arrives here soon".
// Expanding grows it to 1280 x 720 over a dimmed desk and pauses the site music.
import React, { useEffect, useState } from 'react';
import { css } from '../design/dc.js';
import Fastener from '../design/Fastener.jsx';
import Sticker from '../design/Sticker.jsx';
import * as storage from '../lib/storage.js';
import { useMusic } from '../music/MusicContext.jsx';

export default function NehasWorld({ content, ui }) {
  const world = content.world;
  const music = useMusic();
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [offerResume, setOfferResume] = useState(false);
  const [best, setBest] = useState(() => storage.get('world.best', null));

  // a game can report its best score with postMessage({ nehaWorldBest: 1234 })
  useEffect(() => {
    const onMsg = e => {
      const v = e.data && e.data.nehaWorldBest;
      if (typeof v === 'number') setBest(b => { const n = Math.max(b || 0, v); storage.set('world.best', n); return n; });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = e => { if (e.key === 'Escape') collapse(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const expand = () => {
    if (music.pauseForGame()) setOfferResume(false);
    setExpanded(true);
  };
  const collapse = () => {
    setExpanded(false);
    if (music.status === 'paused') setOfferResume(true);
  };

  const screen = world.embedUrl ? (
    <>
      <iframe
        title={ui.title}
        src={world.embedUrl}
        allow="autoplay; fullscreen; gamepad"
        onLoad={() => setLoaded(true)}
        className="nh-keep-cursor"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
      {!loaded ? (
        <div style={css('position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#141E33')}>
          <div style={css("font:700 13px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#FFFFFF")}>{ui.loading}</div>
          <div style={css('width:360px;height:12px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden')}><div style={css('width:62%;height:100%;border-radius:6px;background:#C4A8E6;animation:nh-load 1400ms ease-in-out infinite alternate')} /></div>
        </div>
      ) : null}
    </>
  ) : (
    <div style={css('position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px')}>
      <Sticker kind="camera-cat" size={120} rotate={-6} />
      <div style={css("font:600 34px/1 'Caveat',cursive;color:#FFFFFF")}>{ui.soon}</div>
    </div>
  );

  return (
    <>
      {expanded ? <div onClick={collapse} style={css('position:absolute;inset:0;background:rgba(20,30,51,.6);z-index:80;animation:nh-fade-in 300ms ease-out')} /> : null}
      <div
        data-world-expanded={expanded || undefined}
        style={{ ...css('position:absolute;border-radius:22px;background:linear-gradient(180deg,#2A5687,#204670 50%,#17355A);box-shadow:inset 0 2px 0 rgba(255,255,255,.18),0 2px 3px rgba(19,15,31,.3),0 14px 28px rgba(19,15,31,.25);transition:all 450ms cubic-bezier(0.34,1.56,0.64,1)'), ...(expanded ? { left: 60, top: 70, width: 1320, height: 764, transform: 'none', zIndex: 81 } : { left: 156, top: 146, width: 1000, height: 584, transform: 'rotate(-.6deg)' }) }}
      >
        <div style={{ ...css('position:absolute;left:20px;top:22px;border-radius:8px;overflow:hidden;background:#141E33;box-shadow:inset 0 0 0 3px #0E1626;transition:all 450ms cubic-bezier(0.34,1.56,0.64,1)'), width: expanded ? 1280 : 960, height: expanded ? 720 : 540 }}>
          {screen}
        </div>
        <div style={css('position:absolute;left:120px;top:-18px')}><Fastener kind="binder" /></div>
        <div style={css('position:absolute;right:120px;top:-18px')}><Fastener kind="binder" /></div>
      </div>
      <div style={css(`position:absolute;left:960px;top:62px;display:flex;align-items:center;gap:12px;z-index:${expanded ? 82 : 5}`)}>
        <span style={css(`font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:${expanded ? '#FFFFFF' : '#204670'};white-space:nowrap`)}>{ui.best} · {best != null ? String(best).padStart(6, '0').replace(/(\d{3})(\d{3})$/, '$1 $2') : '— —'}</span>
        {world.embedUrl ? (
          <button type="button" className="nh-btn" onClick={expanded ? collapse : expand} style={css(`height:40px;padding:0 16px;border-radius:999px;border:1.5px solid ${expanded ? '#FFFFFF' : '#204670'};display:flex;align-items:center;font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:${expanded ? '#FFFFFF' : '#204670'};white-space:nowrap;cursor:pointer`)}>{expanded ? ui.shrink : ui.expand}</button>
        ) : null}
      </div>
      {!expanded ? (
        <div style={css('position:absolute;left:330px;top:742px;display:flex;align-items:center;gap:24px')}>
          <div style={css('display:flex;align-items:center;gap:8px;padding:8px 14px;background:#FFFFFF;border-radius:6px;box-shadow:0 1px 2px rgba(19,15,31,.2)')}>
            {(ui.keys || []).map(([k, l]) => (
              <div key={k} style={css('display:flex;align-items:center;gap:6px')}>
                <div style={css("min-width:32px;height:30px;padding:0 8px;border-radius:6px;background:#FBF9F5;box-shadow:inset 0 -3px 0 #CED9E4,0 0 0 1.5px #204670;display:flex;align-items:center;justify-content:center;font:700 12px/1 'DM Sans',sans-serif;color:#130F1F")}>{k}</div>
                <span style={css("font:700 10px/1 'Courier Prime',monospace;color:#3D4A66;white-space:nowrap")}>{l}</span>
              </div>
            ))}
          </div>
          <div style={css('display:flex;align-items:center;gap:12px')}>
            {world.items.map((it, i) => (
              <div key={i} style={css('display:flex;align-items:center;gap:6px')}>
                <div style={css('width:30px;height:30px;border:1.5px dashed #5E3695;border-radius:6px;background:rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center')}>{it.sticker ? <Sticker kind={it.sticker} size={26} /> : null}</div>
                <span style={css("font:600 20px/1 'Caveat',cursive;color:#204670;white-space:nowrap")}>{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {offerResume && !expanded && music.status !== 'playing' ? (
        <button type="button" className="nh-btn" onClick={() => { setOfferResume(false); music.toggle(); }} style={css("position:absolute;left:156px;top:100px;height:36px;padding:0 14px;border-radius:999px;background:#FFFFFF;box-shadow:0 1px 3px rgba(19,15,31,.25);font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;cursor:pointer;z-index:6")}>
          ♪ {ui.resumeYes}
        </button>
      ) : null}
    </>
  );
}
