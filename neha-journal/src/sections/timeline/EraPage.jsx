// The pull-out era page (design: TimelineScene, view "era"): a loose page with punched
// holes slides out of the journal's right edge and scrolls inside itself. No lightbox:
// a photo click enlarges it 1.5x in place; click again or Esc returns it. Back/Esc close.
import React, { useEffect, useRef, useState } from 'react';
import { css } from '../../design/dc.js';
import PhotoFrame from '../../design/PhotoFrame.jsx';
import Fastener from '../../design/Fastener.jsx';
import StickerLayer from '../../components/StickerLayer.jsx';
import VideoTile from './VideoTile.jsx';
import { buildEraLayout, ERA_PAPER } from './eraLayouts.js';

const CONTENT_W = 1050;

export default function EraPage({ era, eras, content, go, reduced }) {
  const { ui } = content;
  const t = ui.timeline;
  const [enlarged, setEnlarged] = useState(-1);
  const [hover, setHover] = useState(-1);
  const backRef = useRef(null);
  const page = buildEraLayout(era);
  const [bg, tex, texS, ink, ink2, fadeTo] = ERA_PAPER[era.layout] || ERA_PAPER.scrapbook;
  const moreTop = page.height + 20;
  const moreRows = Math.ceil(page.more.length / 4);
  const height = page.more.length ? moreTop + 70 + moreRows * 300 : page.height;

  useEffect(() => {
    backRef.current && backRef.current.focus({ preventScroll: true });
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (enlarged >= 0) setEnlarged(-1);
      else go('timeline');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enlarged, go]);

  const photoProps = p => ({
    type: p.t, ratio: p.r, size: p.s, rotate: p.rot, tone: p.tone,
    caption: p.photo ? p.photo.caption : '', by: p.photo && p.photo.takenByName ? `${t.takenBy.toLowerCase()} ${p.photo.takenByName}` : '',
    src: p.photo ? p.photo.file : '', srcs: p.group ? p.group.map(g => g.file) : undefined, alt: p.photo ? p.photo.alt : '',
    label: `photo · ${p.r} · ${p.s >= 600 ? 'hero' : p.s >= 360 ? 'medium' : 'small'}`,
  });

  return (
    <div role="dialog" aria-label={`${era.year} ${era.name}`} style={css('position:absolute;inset:0;z-index:45')}>
      <div onClick={() => go('timeline')} style={css('position:absolute;left:88px;top:28px;width:1180px;height:756px;background:rgba(236,232,242,.55);animation:nh-fade-in 300ms ease-out both')} />
      <div style={{ ...css('position:absolute;left:150px;top:44px;width:1100px;height:740px;filter:drop-shadow(0 4px 6px rgba(19,15,31,.28)) drop-shadow(0 24px 40px rgba(19,15,31,.26))'), animation: reduced ? 'nh-fade-in 200ms linear both' : 'nh-pull-out 500ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <div style={css(`position:absolute;inset:0;border-radius:2px 6px 6px 2px;background:${bg};overflow:hidden;transform:rotate(-.5deg)`)}>
          <div style={css(`position:absolute;inset:0;background:url(${tex}) 0 0/${texS}`)} />
          <div style={css('position:absolute;left:10px;top:30px;bottom:30px;display:flex;flex-direction:column;justify-content:space-between')}>
            {Array.from({ length: 16 }, (_, i) => <div key={i} style={css('width:11px;height:11px;border-radius:50%;background:#1E2B45;box-shadow:inset 0 1.5px 2px rgba(0,0,0,.5)')} />)}
          </div>
          <div style={css('position:absolute;left:44px;top:22px;display:flex;align-items:center;gap:12px;z-index:5')}>
            <button ref={backRef} type="button" className="nh-btn" onClick={() => go('timeline')} style={css("display:inline-flex;align-items:center;height:40px;padding:0 18px;border-radius:999px;border:1.5px solid #204670;background:#FFFFFF;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;white-space:nowrap;cursor:pointer")}>{t.back}</button>
            <span style={css(`font:400 12px/1 'Courier Prime',monospace;color:${ink2}`)}>{t.orEsc}</span>
          </div>
          <div style={css('position:absolute;left:44px;top:80px;right:40px;display:flex;align-items:baseline;gap:18px;white-space:nowrap;overflow:hidden')}>
            <span style={css(`font:700 13px/1 'Courier Prime',monospace;letter-spacing:.16em;color:${ink2}`)}>{era.year}</span>
            <h2 style={css(`margin:0;font:400 44px/1.1 'Libre Caslon Text',serif;color:${ink}`)}>{era.name}</h2>
            <span style={css(`font:600 26px/1 'Caveat',cursive;color:${ink2};overflow:hidden;text-overflow:ellipsis`)}>{era.description}</span>
          </div>

          <div className="nh-hide-scroll" style={css('position:absolute;left:30px;right:20px;top:136px;bottom:66px;overflow-y:auto;overflow-x:hidden')}>
            <div style={css(`position:relative;height:${height}px`)}>
              {page.strings.map((l, i) => <div key={i} style={css(`position:absolute;left:${l.x}px;top:${l.y}px;width:${l.w}px;height:1.5px;background:#CA9AA1;transform-origin:0 50%;transform:rotate(${l.a}deg)`)} />)}

              {page.items.map((p, i) => {
                const big = enlarged === i;
                const dim = enlarged >= 0 && !big;
                const hov = hover === i && p.kind === 'photo' && enlarged < 0;
                return (
                  <div
                    key={i}
                    style={{ ...css(`position:absolute;left:${p.x}px;top:${p.y}px;transform-origin:50% 30%;transition:transform 350ms cubic-bezier(0.34,1.56,0.64,1),opacity 200ms`), zIndex: big ? 90 : i + 1, transform: `scale(${big ? 1.5 : 1})`, opacity: dim ? 0.55 : 1, animation: reduced ? 'none' : `nh-fade-up 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms both` }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(-1)}
                  >
                    {p.kind === 'video' ? (
                      <VideoTile slot={p} video={era.video} ui={t} />
                    ) : (
                      <button type="button" className="nh-btn" aria-label={p.photo.caption || p.photo.alt} aria-pressed={big} onClick={() => setEnlarged(big ? -1 : i)} style={css(`cursor:${big ? 'zoom-out' : 'zoom-in'}`)}>
                        <PhotoFrame {...photoProps(p)} showCaption={!p.noCaption && !hov} onDark={false} />
                      </button>
                    )}
                    {p.pin ? <div style={css('position:absolute;left:50%;top:-6px;margin-left:-10px;pointer-events:none')}><Fastener kind="pin" size={18} /></div> : null}
                    {p.clip ? <div style={css('position:absolute;left:50%;top:-22px;margin-left:-20px;pointer-events:none')}><Fastener kind="binder" /></div> : null}
                    {hov && (p.photo.caption || p.photo.takenByName) ? (
                      <div style={css('position:absolute;left:10px;right:10px;bottom:-34px;display:flex;flex-direction:column;align-items:center;gap:3px;pointer-events:none;animation:nh-fade-in 150ms ease-out')}>
                        {p.photo.caption ? <span style={css("font:400 20px/1 'Kalam',cursive;color:#204670;background:#FFFFFF;padding:3px 8px;border-radius:3px;white-space:nowrap")}>{p.photo.caption}</span> : null}
                        {p.photo.takenByName ? <span style={css("font:700 10px/1 'Courier Prime',monospace;color:#3D4A66;background:#FFFFFF;padding:2px 6px;border-radius:2px;white-space:nowrap;text-transform:uppercase")}>{t.takenBy} {p.photo.takenByName}</span> : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {page.notes.map((n, i) => (
                <div key={'n' + i} style={css(`position:absolute;left:${n.x}px;top:${n.y}px;z-index:40;width:${n.w}px;padding:22px 18px 16px;background:#FFFFFF;transform:rotate(${n.rot}deg);box-shadow:0 1px 2px rgba(19,15,31,.22),0 6px 12px rgba(19,15,31,.12);font:${n.quote ? "italic 400 26px/1.3 'Libre Caslon Text',serif" : "400 22px/1.3 'Kalam',cursive"};color:${n.quote ? '#130F1F' : '#204670'}`)}>
                  {n.text}
                </div>
              ))}

              {page.more.length ? (
                <div style={css(`position:absolute;left:0;top:${moreTop}px;width:${CONTENT_W}px`)}>
                  <div style={css("font:600 30px/1 'Caveat',cursive;color:#5E3695;padding:0 0 20px 10px")}>{t.more}</div>
                  <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:30px 20px')}>
                    {page.more.map((ph, i) => (
                      <div key={i} style={css('display:flex;justify-content:center')}>
                        <PhotoFrame type="taped" ratio="1:1" size={200} rotate={[-2, 2, -1, 3][i % 4]} caption={ph.caption} by={ph.takenByName ? `${t.takenBy.toLowerCase()} ${ph.takenByName}` : ''} showCaption={!!ph.caption} src={ph.file} alt={ph.alt} label="photo · 1:1 · small" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <StickerLayer pageId={`timeline-era-${era.id}`} fixed={content.stickers.pages[`era-${era.layout}`]?.fixed} width={CONTENT_W} height={height} ui={ui.stickerMenu} z={60} />
            </div>
          </div>
          <div style={css(`position:absolute;left:0;right:0;bottom:66px;height:60px;background:linear-gradient(180deg,rgba(255,255,255,0),${fadeTo});pointer-events:none`)} />
          <nav aria-label="eras" style={css('position:absolute;left:44px;right:24px;bottom:14px;height:44px;display:flex;align-items:center;justify-content:center;gap:8px')}>
            {eras.map(e => {
              const on = e.id === era.id;
              return (
                <button key={e.id} type="button" className="nh-btn" aria-current={on ? 'page' : undefined} onClick={() => go(`timeline/era/${e.id}`)} style={css(`height:36px;padding:0 14px;border-radius:999px;border:1.5px solid #204670;background:${on ? '#204670' : '#FFFFFF'};display:flex;align-items:center;gap:8px;cursor:pointer;min-width:0`)}>
                  <span style={css(`font:700 12px/1 'Courier Prime',monospace;color:${on ? '#FFFFFF' : '#204670'}`)}>{e.year}</span>
                  {eras.length <= 6 ? <span style={css(`font:400 16px/1 'Kalam',cursive;color:${on ? '#FFFFFF' : '#204670'};white-space:nowrap`)}>{e.shortName}</span> : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

