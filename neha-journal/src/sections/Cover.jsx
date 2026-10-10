// The brown leather cover and the contents spread inside it (design: CoverScene).
// The cover's stickers (fixed ones + the physics pile) live in App's cover StickerLayer
// so the pile that fell during the opening is the same one she plays with here.
import React, { useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import PhotoFrame from '../design/PhotoFrame.jsx';
import Fastener from '../design/Fastener.jsx';
import Sticker from '../design/Sticker.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import { usePrefersReducedMotion } from '../lib/motion.js';

export function CoverPage({ content, onOpen, interactive = true }) {
  const { site, ui } = content;
  const reduced = usePrefersReducedMotion();
  const egg = site.easterEggs.nameClicks;
  const [clicks, setClicks] = useState(0);
  const [lifted, setLifted] = useState(false);
  const [secret, setSecret] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);

  // easter egg: click her name five times -> the letters lift, float and settle, and a note appears
  const clickName = e => {
    e.stopPropagation();
    if (!egg.on || !interactive) return;
    const n = clicks + 1;
    setClicks(n);
    if (n >= 5) {
      setClicks(0);
      setLifted(true);
      setTimeout(() => { setLifted(false); setSecret(true); }, reduced ? 200 : 1200);
    }
  };

  return (
    <>
      <div style={css('position:absolute;left:88px;top:28px')}>
        <SpiralJournal w={1180} h={756} paper="cover-brown" coil="silver" ribbon={true} />
      </div>
      {/* clicking the leather (not the photo, name or note) opens the journal */}
      {interactive ? <div onClick={onOpen} data-clickable style={css('position:absolute;left:120px;top:28px;width:1148px;height:756px;cursor:pointer')} /> : null}
      <div
        style={{ ...css('position:absolute;left:156px;top:58px;transition:transform 200ms cubic-bezier(0.34,1.56,0.64,1)'), transform: photoHover ? 'translateY(-4px)' : 'none' }}
        onMouseEnter={() => setPhotoHover(true)}
        onMouseLeave={() => setPhotoHover(false)}
      >
        <PhotoFrame type="corners" ratio="4:5" size={520} rotate={2} showCaption={false} src={site.coverPhoto} alt={`${site.name}`} eager label="photo · neha · 4:5 · hero 520 × 650" />
      </div>
      <div style={css('position:absolute;left:740px;top:96px;display:flex;flex-direction:column;gap:14px')}>
        <button type="button" className="nh-btn" onClick={clickName} aria-label={site.name} style={css("font:400 170px/1.2 'Pinyon Script',cursive;color:#FFFFFF;text-shadow:0 2px 10px rgba(19,15,31,.25);cursor:pointer")}>
          {[...site.name].map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', transition: `transform ${reduced ? 200 : 600}ms cubic-bezier(0.34,1.56,0.64,1) ${lifted ? i * 60 : 0}ms`, transform: lifted ? `translateY(${-30 - (i % 2) * 18}px) rotate(${i % 2 ? 6 : -6}deg)` : 'none' }}>{ch}</span>
          ))}
        </button>
        <div style={css("font:700 13px/1 'Courier Prime',monospace;letter-spacing:.18em;color:#DCCBF3;white-space:nowrap;padding-left:8px")}>{site.coverLine}</div>
      </div>
      <div style={css('position:absolute;left:770px;top:390px;transform:rotate(-2deg)')}>
        <div style={css("position:relative;width:330px;padding:28px 24px 18px;background:#FFFFFF;box-shadow:0 1px 2px rgba(19,15,31,.3),0 8px 18px rgba(19,15,31,.2);font:600 30px/1.15 'Caveat',cursive;color:#204670")}>
          {site.coverNote}
          <div style={css('position:absolute;left:50%;top:-22px;margin-left:-20px')}>
            <Fastener kind="binder" />
          </div>
        </div>
      </div>
      {secret && egg.note ? (
        <div role="note" style={css("position:absolute;left:760px;top:286px;width:300px;transform:rotate(3deg);padding:18px 16px 14px;background:#ECE3F8;box-shadow:0 1px 2px rgba(19,15,31,.3),0 8px 14px rgba(19,15,31,.18);font:600 26px/1.15 'Caveat',cursive;color:#320F6F;z-index:20;animation:nh-fade-up 300ms ease-out both")}>
          {egg.note}
        </div>
      ) : null}
      {interactive ? (
        <button type="button" className="nh-btn" onClick={onOpen} style={css("position:absolute;left:1046px;top:736px;font:700 13px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#FFFFFF;text-decoration:underline;text-decoration-color:#C4A8E6;text-decoration-thickness:2px;text-underline-offset:6px;white-space:nowrap;cursor:pointer;z-index:5")}>
          {ui.cover.open}
        </button>
      ) : null}
    </>
  );
}

export function ContentsSpread({ content, go, resetToken }) {
  const { site, ui } = content;
  const [hover, setHover] = useState(-1);
  return (
    <>
      <div style={css('position:absolute;left:94px;top:34px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#ECE8E1')} />
      <div style={css('position:absolute;left:88px;top:28px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#FFFFFF;box-shadow:0 2px 3px rgba(19,15,31,.22),0 18px 40px rgba(19,15,31,.24);overflow:hidden')}>
        <div style={css('position:absolute;inset:0;background:url(/media/textures/grain.png) 0 0/128px 128px')} />
        <div style={css('position:absolute;top:0;bottom:0;right:0;width:60px;background:linear-gradient(270deg,rgba(19,15,31,.1),rgba(19,15,31,0))')} />
      </div>
      <div style={css('position:absolute;left:678px;top:28px')}>
        <SpiralJournal w={590} h={756} paper="lined" coil="silver" edges={true} />
      </div>
      <div style={css('position:absolute;left:150px;top:96px')}>
        <PhotoFrame type="polaroid" ratio="3:2" size={400} rotate={-2} caption={site.contentsPhotoCaption} showCaption={false} src={site.groupPhoto} alt={site.contentsPhotoCaption} label="photo · neha + friends · 3:2 · medium" />
      </div>
      <div style={css('position:absolute;left:330px;top:74px')}>
        <Fastener kind="binder" />
      </div>
      <div style={css("position:absolute;left:150px;top:460px;width:450px;transform:rotate(1deg);padding:22px 22px 18px;background:#FFFFFF;background-image:repeating-linear-gradient(180deg,transparent 0 33px,rgba(142,167,201,.45) 33px 34px);background-position:0 18px;box-shadow:0 1px 2px rgba(19,15,31,.22),0 8px 16px rgba(19,15,31,.12);font:600 28px/34px 'Caveat',cursive;color:#204670")}>
        {site.contentsWelcome} <span style={css('white-space:nowrap')}>{site.contentsSignoff}</span>
      </div>
      <h1 style={css("position:absolute;left:770px;top:66px;margin:0;font:400 48px/1 'Libre Caslon Text',serif;color:#130F1F")}>{ui.cover.contents}</h1>
      <div style={css('position:absolute;left:770px;top:150px;display:flex;flex-direction:column;gap:14px;width:440px')}>
        {ui.contents.map((t, i) => (
          <button
            key={t.to}
            type="button"
            className="nh-btn"
            onClick={() => go(t.to)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(-1)}
            style={css('display:flex;align-items:center;gap:14px;height:64px;cursor:pointer;width:100%')}
          >
            <div style={{ ...css('width:52px;display:flex;justify-content:center'), animation: hover === i ? 'nh-wiggle 300ms ease-in-out' : 'none' }}>
              <Sticker kind={t.sticker} size={46} movable={false} />
            </div>
            <span style={css(`font:600 32px/1 'Caveat',cursive;color:#204670;white-space:nowrap;text-decoration:${hover === i ? 'underline' : 'none'};text-decoration-color:#A57BD5;text-decoration-thickness:2px;text-underline-offset:6px`)}>{t.label}</span>
            <span style={css('flex:1;border-bottom:2px dotted #ACBFD3;transform:translateY(8px)')} />
            <span style={css("font:600 30px/1 'Caveat',cursive;color:#5E3695")}>p. {t.page}</span>
          </button>
        ))}
      </div>
      <button type="button" className="nh-btn" onClick={() => go('back')} style={css("position:absolute;left:770px;top:690px;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#5E3695;text-decoration:underline;text-decoration-color:#C4A8E6;text-decoration-thickness:2px;text-underline-offset:5px;cursor:pointer")}>
        {ui.cover.backPages}
      </button>
      <StickerLayer pageId="contents" fixed={content.stickers.pages.contents?.fixed} floorY={784} ui={ui.stickerMenu} resetToken={resetToken} />
    </>
  );
}

export function ResetStickers({ label, onReset }) {
  return (
    <div style={css('position:absolute;left:0;right:0;top:878px;display:flex;justify-content:center;pointer-events:none;z-index:65')}>
      <button type="button" className="nh-btn" onClick={onReset} style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#204670;background:rgba(255,255,255,.88);padding:4px 10px;border-radius:999px;pointer-events:auto;cursor:pointer")}>
        {label}
      </button>
    </div>
  );
}
