// The darkroom: a long photo wall on the black-to-red desk (design: DarkroomScene).
// The page scrolls inside the journal; the spiral, tabs and player stay fixed.
// Seven sections, each in its own frame style; gentle parallax; click to enlarge in place.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import RansomWord from '../design/RansomWord.jsx';
import Fastener from '../design/Fastener.jsx';
import PhotoFrame from '../design/PhotoFrame.jsx';
import Photo from '../design/Photo.jsx';
import Sticker from '../design/Sticker.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import ShakePolaroid from './darkroom/ShakePolaroid.jsx';
import ContactSheet from './darkroom/ContactSheet.jsx';
import { buildSection } from './darkroom/darkroomLayouts.js';
import * as storage from '../lib/storage.js';

const RAMP = [0.95, 0.8, 0.55, 0.3, 0.1, 0]; // the design's visible develop ramp
const STRIPS = [{ x: 210, y: 226, r: -3, n: 3 }, { x: 470, y: 222, r: 2, n: 2 }, { x: 780, y: 220, r: -2, n: 3 }, { x: 1040, y: 218, r: 3, n: 2 }];

export default function Darkroom({ content, reduced }) {
  const { darkroom, ui } = content;
  const t = ui.darkroom;
  const scroller = useRef(null);
  const secRefs = useRef({});
  const [enlarged, setEnlarged] = useState(null);
  const [seen, setSeen] = useState({});
  const [dev, setDev] = useState(() => storage.get('darkroom.developed', {}));

  // lay out the sections down the page (design: start at y 500, 100 px between sections)
  const sections = useMemo(() => {
    let y = 500;
    return darkroom.sections.map((s, i) => {
      const built = buildSection(s.id, s.photos);
      if (!built) return null;
      const sec = { ...s, ...built, y, name: s.label || t.codes[i], code: `0${i + 1} · ${t.codes[i] || s.label.toUpperCase()}` };
      y += built.h + 100;
      return sec;
    }).filter(Boolean);
  }, [darkroom, t.codes]);
  const last = sections[sections.length - 1];
  const H = last ? last.y + last.h + 260 : 900;

  // section stickers are stored relative to their section
  const stickers = useMemo(() => (content.stickers.pages.darkroom?.fixed || []).map(f => {
    const sec = sections.find(s => s.id === f.section);
    return sec ? { ...f, x: 140 + f.x, y: sec.y + f.y } : null;
  }).filter(Boolean), [content.stickers.pages.darkroom, sections]);

  // one scroll listener: parallax (at most 15%) and "entering view" effects
  useEffect(() => {
    const el = scroller.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = el.scrollTop, mid = top + 378;
      const nowSeen = {};
      sections.forEach(s => {
        const node = secRefs.current[s.id];
        if (!node) return;
        if (s.y < top + 700) nowSeen[s.id] = true;
        if (!reduced) node.style.transform = `translateY(${Math.max(-60, Math.min(60, (s.y + s.h / 2 - mid) * -0.08))}px)`;
      });
      setSeen(prev => (Object.keys(nowSeen).every(k => prev[k]) ? prev : { ...prev, ...nowSeen }));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    el.addEventListener('scroll', onScroll, { passive: true });
    update();
    const onKey = e => { if (e.key === 'Escape') setEnlarged(null); };
    window.addEventListener('keydown', onKey);
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey); };
  }, [sections, reduced]);

  const scrollTo = y => scroller.current.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  const develop = (key, v) => setDev(d => { const n = { ...d, [key]: v }; storage.set('darkroom.developed', n); return n; });
  const film = (darkroom.sections.find(s => s.id === 'on-film') || { photos: [] }).photos;

  const frame = (sec, it) => ({
    type: it.t, ratio: it.r, size: it.s, rotate: it.rot, tone: it.i % 3, onDark: true,
    caption: it.photo.caption, showCaption: false, src: it.photo.file, alt: it.photo.alt,
    srcs: it.group ? it.group.map(g => g.file) : undefined, label: `photo · ${it.r} · small`,
  });

  return (
    <>
      {/* fixed: one dark page with the spiral on the left (no middle coils behind the content) */}
      <div style={css('position:absolute;left:88px;top:28px')}>
        <SpiralJournal w={1180} h={756} paper="dark" coil="silver" holeColor="#0E0B16" />
      </div>
      <div style={css('position:absolute;left:120px;top:30px;width:1146px;height:752px;pointer-events:none;background:url(/media/textures/film-grain.png) 0 0/200px 200px;opacity:.9')} />

      <div ref={scroller} className="nh-hide-scroll" style={css('position:absolute;left:0;top:18px;width:1440px;height:788px;overflow-y:auto;overflow-x:hidden')}>
        <div style={css(`position:relative;left:0;top:-18px;width:1440px;height:${H}px;margin-bottom:-18px`)}>
          <div style={css('position:absolute;left:420px;top:-120px;width:600px;height:420px;border-radius:50%;background:radial-gradient(ellipse,rgba(166,58,72,.32),rgba(166,58,72,0) 70%);pointer-events:none')} />
          <h1 style={css('position:absolute;left:150px;top:64px;margin:0')} aria-label={t.title}><RansomWord text={t.title} size={54} /></h1>
          <div style={css("position:absolute;left:160px;top:160px;font:600 30px/1 'Caveat',cursive;color:#DCCBF3")}>{sections.length ? t.sub : t.empty}</div>
          <div style={css('position:absolute;left:120px;top:218px;width:1130px;height:2px;background:#5C6B85;transform:rotate(-.6deg)')} />
          {STRIPS.map((s, si) => (
            <div key={si} style={css(`position:absolute;left:${s.x}px;top:${s.y}px;transform:rotate(${s.r}deg);transform-origin:50% 0`)}>
              <div style={css('position:absolute;left:50%;top:-14px;margin-left:-8px;z-index:2')}><Fastener kind="clothespin" /></div>
              <div style={css('width:120px;padding:10px 14px;background:#0A0812;display:flex;flex-direction:column;gap:8px;box-shadow:0 4px 10px rgba(0,0,0,.5);background-image:repeating-linear-gradient(180deg,transparent 0 6px,#C9C3D2 6px 11px),repeating-linear-gradient(180deg,transparent 0 6px,#C9C3D2 6px 11px);background-size:6px 100%,6px 100%;background-position:3px 0,111px 0;background-repeat:repeat-y')}>
                {Array.from({ length: s.n }, (_, f) => {
                  const p = film[(si * 3 + f) % Math.max(1, film.length)];
                  return <div key={f} style={css('position:relative;height:68px;overflow:hidden;background:repeating-linear-gradient(135deg,#3A3046 0 8px,#33293F 8px 16px)')}>{p ? <Photo src={p.file} alt="" sizes="100px" style={{ filter: 'sepia(.3) contrast(1.1)' }} /> : null}</div>;
                })}
              </div>
            </div>
          ))}
          <nav aria-label="darkroom sections" style={css('position:absolute;left:150px;top:400px;display:flex;flex-wrap:wrap;gap:8px;width:1080px')}>
            {sections.map((s, i) => (
              <button key={s.id} type="button" className="nh-btn" onClick={() => scrollTo(s.y - 40)} style={css(`padding:8px 12px;background:#FFFFFF;border-radius:2px;transform:rotate(${[-2, 1, -1, 2, -2, 1, 2][i % 7]}deg);box-shadow:0 1px 2px rgba(0,0,0,.4);font:700 11px/1 'Courier Prime',monospace;letter-spacing:.1em;color:#204670;white-space:nowrap;cursor:pointer`)}>
                {s.name}
              </button>
            ))}
          </nav>

          {sections.map(sec => (
            <section key={sec.id} ref={el => { secRefs.current[sec.id] = el; }} aria-label={sec.label} style={css(`position:absolute;left:140px;top:${sec.y}px;width:1110px;height:${sec.h}px;will-change:transform`)}>
              <div style={css('position:absolute;left:10px;top:0;display:flex;align-items:baseline;gap:14px')}>
                <h2 style={css("margin:0;font:600 38px/1 'Caveat',cursive;color:#FFFFFF;white-space:nowrap")}>{sec.label}</h2>
                <span style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#ACBFD3;white-space:nowrap")}>{sec.code}</span>
                {sec.id === 'give-it-a-shake' ? <span style={css("font:400 20px/1 'Kalam',cursive;color:#DCCBF3")}>{t.shakeHint}</span> : null}
              </div>
              {sec.contact ? <ContactSheet photos={sec.photos} reduced={reduced} /> : null}
              {sec.items.map((it, n) => {
                const key = `${sec.id}-${n}`;
                const big = enlarged === key;
                const enter = !reduced && seen[sec.id];
                const anim = !enter ? 'none'
                  : sec.id === 'photobooth-chaos' ? `nh-print 700ms ease-out ${n * 150}ms both`
                  : sec.id === 'slideshow' ? `nh-pop 350ms cubic-bezier(0.34,1.56,0.64,1) ${n * 80}ms both`
                  : sec.id === 'cover-girl-material' ? `nh-flutter 600ms cubic-bezier(0.34,1.56,0.64,1) ${n * 90}ms both`
                  : 'none';
                return (
                  <div key={key} style={{ ...css(`position:absolute;left:${it.x}px;top:${it.y}px;transform-origin:50% 40%;transition:transform 350ms cubic-bezier(0.34,1.56,0.64,1)`), zIndex: big ? 50 : n + 1, transform: big ? 'scale(1.5)' : 'none', animation: anim }}>
                    {sec.id === 'give-it-a-shake' ? (
                      <ShakePolaroid item={it} start={RAMP[n % 6]} developed={dev[key] || 0} onDevelop={v => develop(key, v)} frameProps={frame(sec, it)} />
                    ) : (
                      <button type="button" className="nh-btn" aria-pressed={big} aria-label={it.photo.caption || it.photo.alt} onClick={() => setEnlarged(big ? null : key)} style={css(`cursor:${big ? 'zoom-out' : 'zoom-in'}`)}>
                        <PhotoFrame {...frame(sec, it)} />
                      </button>
                    )}
                    {sec.id === 'flash-on' ? (
                      <div style={css(`position:absolute;left:12px;top:12px;width:${it.s}px;height:${Math.round(it.s * 1.25)}px;background:radial-gradient(circle at 48% 40%,rgba(255,255,255,.55),rgba(255,255,255,0) 55%);transform:rotate(${it.rot}deg);pointer-events:none`)}>
                        <div style={css("position:absolute;right:12px;bottom:10px;font:700 15px/1 'Courier Prime',monospace;color:#E86A5A;text-shadow:0 0 4px rgba(232,106,90,.6)")}>'26 10 11</div>
                        {/* shutter blink as each appears */}
                        {enter ? <div style={css(`position:absolute;inset:0;background:#000;animation:nh-flash 60ms linear ${n * 120}ms both`)} /> : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {sec.words ? t.coverWords.map((w, i) => (
                <div key={w} style={css(`position:absolute;left:${[470, 520, 430][i % 3]}px;top:${470 + i * 70}px;z-index:20`)}><RansomWord text={w} size={34} /></div>
              )) : null}
            </section>
          ))}

          {last ? (
            <button type="button" className="nh-btn" onClick={() => scrollTo(0)} style={css(`position:absolute;left:1120px;top:${H - 200}px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer`)}>
              <Sticker kind="camera" size={110} rotate={-6} />
              <span style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#FFFFFF")}>{t.backToTop}</span>
            </button>
          ) : null}

          <StickerLayer pageId="darkroom" fixed={stickers} width={1440} height={H} ui={ui.stickerMenu} z={40} />
        </div>
      </div>
    </>
  );
}
