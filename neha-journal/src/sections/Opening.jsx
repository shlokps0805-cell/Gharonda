// The first-visit opening (design: Phase 2 - Opening / OpeningScene).
// Steps: envelope -> rises -> birthday -> confetti -> settles, then onDone().
// The seal click starts the music synchronously (browsers need the click for sound).
// The physics sticker pile is App's cover StickerLayer, dropped when the step is 'confetti'.
import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { css } from '../design/dc.js';
import Envelope from '../design/Envelope.jsx';
import WaxSeal from '../design/WaxSeal.jsx';
import SpiralJournal from '../design/SpiralJournal.jsx';
import Sticker from '../design/Sticker.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import { CoverPage } from './Cover.jsx';
import { useMusic } from '../music/MusicContext.jsx';

// design timings (ms) from the Phase 2 annotations; reduced motion uses quick fades
const T = {
  normal: { rise: 480, birthday: 1500, confetti: 2600, settles: 2200, auto: 4000 },
  reduced: { rise: 0, birthday: 900, confetti: 1200, settles: 1200, auto: 0 },
};
// stickers mixed into the confetti burst (design: "17 approved stickers mixed in")
const AIR = ['star-balloon', 'jelly-star', 'check-star', 'star-felt', 'cookie-bear', 'iconic', 'happy-birthday', 'camera-cat', 'sparkle', 'star-origami', 'core-memory', 'star-glitter-edge', 'cd', 'paint-star', 'star-embroidered', 'lily', 'eight-ball'];
const PALETTE = ['#FFFFFF', '#CED9E4', '#ACBFD3', '#DCCBF3', '#A57BD5', '#5E3695', '#DEC0C4'];

function airStickers() {
  // same seeded placement as the design's birthday frame
  let s = 3 * 9301 + 49297;
  const ar = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return AIR.map((k, i) => {
    const size = k === 'happy-birthday' ? 170 : k === 'core-memory' ? 150 : 64 + Math.round(ar() * 34);
    const side = i % 2, a = (25 + ar() * 50) * Math.PI / 180, r = 250 + ar() * 520;
    let x = Math.round(side ? 1440 - Math.cos(a) * r - size : Math.cos(a) * r);
    const y = Math.round(900 - Math.sin(a) * r - size / 2);
    if (x + size > 420 && x < 1040 && y < 700) x = side ? 1060 + (i % 3) * 40 : 320 - size - (i % 3) * 30;
    return { k, size, r: Math.round(ar() * 40 - 20), x, y, side, delay: i * 40 };
  });
}

export default function Opening({ content, onStep, onDone, reduced }) {
  const { site, ui } = content;
  const music = useMusic();
  const [step, setStep] = useState('envelope');
  const [sealState, setSealState] = useState('pulse');
  const [lit, setLit] = useState(0);
  const timers = useRef([]);
  const light = useRef(null);
  const t = reduced ? T.reduced : T.normal;
  const name = site.name;
  const hbWords = ['Happy Birthday,', name];
  const totalLetters = hbWords.join('').length;
  const air = useRef(airStickers()).current;

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { onStep(step); }, [step, onStep]);

  // a soft highlight follows the cursor across the envelope (80 ms lerp)
  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0, tx = 740, ty = 500, x = 740, y = 500;
    const stage = document.getElementById('stage');
    const move = e => {
      const r = stage.getBoundingClientRect(), k = r.width / 1440;
      tx = (e.clientX - r.left) / k; ty = (e.clientY - r.top) / k;
    };
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      if (light.current) light.current.style.transform = `translate(${x - 210}px,${y - 210}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [reduced]);

  // the gold letters shimmer in one by one, 40 ms each
  useEffect(() => {
    if (step !== 'birthday') return undefined;
    if (reduced) { setLit(totalLetters); return undefined; }
    let n = 0;
    const id = setInterval(() => { n += 1; setLit(n); if (n >= totalLetters) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [step, reduced, totalLetters]);

  function burst() {
    if (reduced) return;
    const opts = { particleCount: 60, spread: 70, startVelocity: 62, gravity: 0.9, ticks: 260, colors: PALETTE, scalar: 1.1, shapes: ['square', 'circle'], disableForReducedMotion: true };
    confetti({ ...opts, angle: 60, origin: { x: 0, y: 1 } });
    confetti({ ...opts, angle: 120, origin: { x: 1, y: 1 } });
  }

  function breakSeal() {
    if (step !== 'envelope') return;
    // must run inside the click, before any timeout: this is the gesture that unlocks audio
    music.start();
    setSealState('cracked');
    later(() => setStep('rises'), t.rise);
    later(() => { setStep('birthday'); burst(); }, t.rise + t.birthday);
    later(() => setStep('confetti'), t.rise + t.birthday + t.confetti);
    later(() => setStep('settles'), t.rise + t.birthday + t.confetti + t.settles);
    if (!reduced) later(() => onDone(false), t.rise + t.birthday + t.confetti + t.settles + t.auto);
  }

  const isEnv = step === 'envelope' || step === 'rises';
  const rises = step === 'rises';
  const bd = step === 'birthday';
  const big = step === 'birthday' || step === 'confetti';
  const fade = reduced ? 'opacity 200ms linear' : 'opacity 500ms ease, transform 700ms cubic-bezier(0.34,1.56,0.64,1), left 700ms cubic-bezier(0.34,1.56,0.64,1), top 700ms cubic-bezier(0.34,1.56,0.64,1)';

  let letterIndex = 0;
  return (
    <div style={css('position:absolute;inset:0')} aria-live="polite">
      {!reduced ? <div ref={light} aria-hidden="true" style={css('position:absolute;left:0;top:0;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.32),rgba(255,255,255,0) 70%);pointer-events:none;z-index:2')} /> : null}

      {isEnv ? <StickerLayer pageId="opening" fixed={content.stickers.pages.opening?.fixed} ui={ui.stickerMenu} z={3} /> : null}

      {/* the envelope: 1.4x, idle float, seal pulsing */}
      <div style={{ ...css('position:absolute;width:560px;height:360px;transform-origin:0 0;z-index:5'), left: rises ? 398 : 328, top: bd ? 740 : rises ? 380 : 190, transform: `scale(${rises ? 1.15 : 1.4})`, opacity: isEnv ? 1 : bd ? 0.85 : 0, transition: bd ? 'top 500ms ease-in, opacity 500ms ease-in' : fade, pointerEvents: isEnv ? 'auto' : 'none' }}>
        <div style={{ animation: step === 'envelope' && !reduced ? 'nh-bob 4000ms ease-in-out infinite' : 'none' }}>
          <Envelope
            state={rises || big ? 'letter' : sealState}
            animate={!reduced}
            label={ui.opening.forName}
            by={site.fromLine}
            nameFont={site.envelopeFont}
            stamp={true}
            onSeal={step === 'envelope' ? breakSeal : undefined}
          />
          {step !== 'birthday' ? (
            <>
              <div style={css('position:absolute;left:-22px;top:-22px')}><Sticker kind="star-felt" size={54} rotate={12} /></div>
              <div style={css('position:absolute;left:-20px;bottom:-16px')}><Sticker kind="star-embroidered" size={52} rotate={-10} /></div>
              <div style={css('position:absolute;right:-24px;bottom:-12px')}><Sticker kind="date-stamp" size={92} rotate={6} /></div>
            </>
          ) : null}
        </div>
      </div>

      {step === 'envelope' ? (
        <div style={css('position:absolute;left:836px;top:330px;display:flex;flex-direction:column;align-items:flex-start;pointer-events:none;z-index:6')}>
          <div style={css("font:600 30px/1 'Caveat',cursive;color:#204670;background:rgba(255,255,255,.9);padding:4px 12px;border-radius:4px;transform:rotate(-3deg);white-space:nowrap")}>{ui.opening.tapTheSeal}</div>
          <div style={{ ...css('position:relative;width:70px;height:110px;margin-left:-4px;transform:scaleX(-1)'), animation: reduced ? 'none' : 'nh-arrow-draw 400ms ease-out both' }}>
            <div style={css('position:absolute;left:0;top:6px;width:60px;height:96px;border-left:2.5px solid #204670;border-bottom:2.5px solid #204670;border-bottom-left-radius:60px')} />
            <div style={css('position:absolute;left:52px;top:94px;width:14px;height:14px;border-top:2.5px solid #204670;border-right:2.5px solid #204670;transform:rotate(45deg)')} />
          </div>
        </div>
      ) : null}

      {/* the broken seal halves drop onto the desk */}
      {rises ? <div style={css('position:absolute;left:670px;top:640px;opacity:.55;transform:translateY(18px);z-index:4;animation:nh-fade-in 400ms ease-out both')}><WaxSeal state="cracked" size={100} /></div> : null}

      {/* the brown journal grows into "Happy Birthday, Neha" */}
      {big ? (
        <div style={{ ...css('position:absolute;left:394px;top:30px;width:652px;height:832px;z-index:8'), '--gx': '120px', '--gy': '420px', animation: reduced ? 'nh-fade-in 200ms linear both' : 'nh-grow 800ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <SpiralJournal w={640} h={820} paper="cover-brown" coil="silver" />
          <div style={css('position:absolute;left:60px;top:84px;width:560px;height:650px;border:1px solid rgba(216,184,94,.55);border-radius:4px')} />
          <div style={css('position:absolute;left:66px;top:90px;width:548px;height:638px;border:1px solid rgba(216,184,94,.3);border-radius:3px')} />
          <div style={css('position:absolute;left:30px;width:620px;top:200px;display:flex;flex-direction:column;align-items:center;overflow:hidden')}>
            <h1 className="sr-only">Happy Birthday, {name}</h1>
            {hbWords.map((w, wi) => (
              <div key={wi} aria-hidden="true" style={css('display:flex;align-items:baseline;justify-content:center;width:100%')}>
                {[...w].map((c, i) => {
                  const n = letterIndex++;
                  return <span key={i} style={css(`font:400 ${wi ? 150 : 74}px/1.25 'Pinyon Script',cursive;color:#E9CF85;text-shadow:0 1px 0 #B08A2E,0 0 10px rgba(246,227,161,.35);opacity:${n < lit || step === 'confetti' ? 1 : 0.12};transition:opacity 200ms;white-space:pre`)}>{c}</span>;
                })}
              </div>
            ))}
            {/* slow foil glint across the lettering */}
            {!reduced && step === 'confetti' ? <div style={css('position:absolute;top:0;bottom:0;left:0;width:30%;background:linear-gradient(105deg,rgba(255,255,255,0) 20%,rgba(255,244,210,.45) 50%,rgba(255,255,255,0) 80%);animation:nh-glint 1200ms ease-in-out both;pointer-events:none')} /> : null}
            <div style={css("font:600 30px/1.1 'Caveat',cursive;color:#DCCBF3;padding-top:20px;white-space:nowrap")}>{site.coverNote}</div>
            <div style={css("font:700 18px/1 'Courier Prime',monospace;letter-spacing:.32em;padding:22px 0 0 .32em;color:#E9CF85")}>{site.dateLine}</div>
          </div>
        </div>
      ) : null}

      {/* stickers mixed into the confetti */}
      {bd && !reduced ? air.map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, zIndex: 9, animation: `nh-pop 450ms cubic-bezier(0.34,1.56,0.64,1) ${s.delay}ms both` }}>
          <Sticker kind={s.k} size={s.size} rotate={s.r} />
        </div>
      )) : null}

      {/* the journal settles and becomes the cover */}
      {step === 'settles' ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, animation: reduced ? 'nh-fade-in 200ms linear both' : 'nh-settle 900ms cubic-bezier(0.65,0,0.35,1) both' }}>
          <CoverPage content={content} interactive={false} />
          <div style={css('position:absolute;left:770px;top:660px;display:flex;align-items:center;gap:14px;animation:nh-fade-up 250ms ease-out 600ms both')}>
            <button type="button" className="nh-btn" onClick={() => onDone(true)} style={css("display:inline-flex;align-items:center;height:44px;padding:0 24px;border-radius:999px;background:#FFFFFF;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;white-space:nowrap;box-shadow:0 2px 6px rgba(19,15,31,.3);cursor:pointer")}>
              OPEN YOUR JOURNAL
            </button>
            {!reduced ? <span style={css("font:400 12px/1 'Courier Prime',monospace;color:#DCCBF3;white-space:nowrap")}>opens itself in 4s</span> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
