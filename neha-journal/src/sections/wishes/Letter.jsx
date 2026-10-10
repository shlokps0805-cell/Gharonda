// One friend's wish (design: WishScene "light" / "dark" / "video"). The page is tinted in
// the writer's colour; the letter is a newspaper clipping with two justified, hyphenated
// columns that scroll inside while the headline stays put. Video wishes get a big frame.
import React, { useEffect, useRef } from 'react';
import { css } from '../../design/dc.js';
import SpiralJournal from '../../design/SpiralJournal.jsx';
import Fastener from '../../design/Fastener.jsx';
import StickerLayer from '../../components/StickerLayer.jsx';
import Photo from '../../design/Photo.jsx';
import VideoWish from './VideoWish.jsx';

// *emphasis* and **strong** inside a paragraph
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default function Letter({ wish, wishes, content, go, reduced }) {
  const { site, ui } = content;
  const t = ui.wishes;
  const f = wish.friendInfo;
  const idx = wishes.indexOf(wish);
  const n = wishes.length;
  const prev = wishes[(idx - 1 + n) % n];
  const next = wishes[(idx + 1) % n];
  const ink = f.dark ? '#FFFFFF' : '#320F6F';
  const inkOn = f.dark ? f.colour : '#FFFFFF';
  const tint = f.dark ? f.colour : `color-mix(in oklch, ${f.colour} 30%, #FFFFFF)`;
  const backRef = useRef(null);
  const long = wish.headline.length > 26;
  // short letters keep the newspaper's two columns; longer ones read as one column that scrolls
  // down (two columns in a fixed-height box overflow sideways, so the end could not be reached)
  const twoCols = (wish.words || 0) <= 200 && !wish.photo;
  const showPhoto = !!(wish.photo || wish.photoCaption);

  useEffect(() => {
    backRef.current && backRef.current.focus({ preventScroll: true });
    const onKey = e => {
      if (e.key === 'Escape') go('wishes');
      if (e.target.tagName === 'VIDEO') return;
      if (e.key === 'ArrowRight' && n > 1) go(`wishes/${next.id}`);
      if (e.key === 'ArrowLeft' && n > 1) go(`wishes/${prev.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, next, prev, n]);

  return (
    <>
      <div style={css('position:absolute;left:88px;top:28px')}>
        <SpiralJournal w={1180} h={756} paper="tint" tint={tint} coil="silver" holeColor={f.dark ? '#0E1626' : '#2A2235'} leak={!f.dark} />
      </div>
      <div style={css('position:absolute;left:150px;top:52px;display:flex;align-items:center;gap:12px;z-index:5')}>
        <button ref={backRef} type="button" className="nh-btn" onClick={() => go('wishes')} style={css(`display:inline-flex;align-items:center;height:44px;padding:0 20px;border-radius:999px;border:1.5px solid ${ink};font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:${ink};white-space:nowrap;cursor:pointer`)}>{t.back}</button>
        <span style={css(`font:400 12px/1 'Courier Prime',monospace;color:${ink}`)}>{t.orEsc}</span>
      </div>
      {n > 1 ? (
        <div style={css('position:absolute;left:1040px;top:722px;display:flex;align-items:center;gap:14px;z-index:5')}>
          <button type="button" className="nh-btn" aria-label={t.prev} onClick={() => go(`wishes/${prev.id}`)} style={css(`width:44px;height:44px;border-radius:50%;border:1.5px solid ${ink};display:flex;align-items:center;justify-content:center;font:700 18px/1 'DM Sans',sans-serif;color:${ink};cursor:pointer`)}>←</button>
          <div style={css(`font:700 13px/1 'Courier Prime',monospace;letter-spacing:.12em;color:${ink};white-space:nowrap`)}>{idx + 1} {t.of} {n}</div>
          <button type="button" className="nh-btn" aria-label={t.next} onClick={() => go(`wishes/${next.id}`)} style={css(`width:44px;height:44px;border-radius:50%;background:${ink};display:flex;align-items:center;justify-content:center;font:700 18px/1 'DM Sans',sans-serif;color:${inkOn};cursor:pointer`)}>→</button>
        </div>
      ) : null}

      {wish.video ? (
        <VideoWish wish={wish} ink={ink} no={idx + 1} total={n} ui={t} />
      ) : (
        <>
          <article lang="en" style={{ ...css('position:absolute;left:356px;top:44px;width:860px;height:672px;transform:rotate(-1deg);filter:drop-shadow(0 1px 2px rgba(19,15,31,.3)) drop-shadow(0 12px 24px rgba(19,15,31,.2))'), animation: reduced ? 'nh-fade-in 200ms linear both' : 'nh-drop-in 350ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <div style={css('position:relative;width:100%;height:100%;background:url(/media/textures/newsprint.png) 0 0/256px 256px,#EEEAE0;clip-path:polygon(0 1%,6% 0,14% .6%,22% 0,31% .8%,40% 0,49% .7%,58% 0,67% .9%,76% 0,85% .6%,93% 0,100% .8%,99.4% 12%,100% 25%,99.5% 38%,100% 52%,99.4% 66%,100% 80%,99.5% 93%,100% 100%,92% 99.3%,83% 100%,74% 99.4%,65% 100%,56% 99.3%,47% 100%,38% 99.4%,29% 100%,20% 99.3%,11% 100%,3% 99.4%,0 100%,.5% 88%,0 74%,.6% 60%,0 46%,.5% 32%,0 18%);display:flex;flex-direction:column;padding:32px 44px 0')}>
              <div style={css('display:flex;justify-content:space-between;align-items:center;border-bottom:3px double #130F1F;padding-bottom:10px')}>
                <span style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#130F1F")}>{t.letter} {String(idx + 1).padStart(2, '0')} {t.of} {n}</span>
                <span style={css("font:400 28px/1 'Libre Caslon Text',serif;letter-spacing:.08em;color:#130F1F")}>{t.masthead}</span>
                <span style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#130F1F")}>{t.price}</span>
              </div>
              <div style={css('padding:16px 0 12px;border-bottom:1px solid #130F1F;display:flex;flex-direction:column;gap:8px')}>
                <h1 style={css(`margin:0;font:400 ${long ? 34 : 42}px/1.05 'Libre Caslon Text',serif;color:#130F1F`)}>{wish.headline}</h1>
                <div style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#3D4A66")}>{[site.city, site.dateLine, wish.words ? `${wish.words} ${t.words}` : ''].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="nh-scroll" tabIndex={0} aria-label="the letter" style={css('flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:18px 10px 48px 0')}>
                <div style={css(twoCols ? 'columns:2;column-gap:36px' : 'max-width:690px;margin:0 auto')}>
                {showPhoto ? (
                  <figure style={css('break-inside:avoid;margin:0 0 14px')}>
                    <div style={css('position:relative;height:250px;background:repeating-linear-gradient(135deg,#ACBFD3 0 12px,#B9CADB 12px 24px);display:flex;align-items:flex-end;padding:10px;filter:grayscale(.3);overflow:hidden')}>
                      {wish.photo ? <Photo src={wish.photo} alt={wish.photoCaption || `${f.name} and ${site.name}`} sizes="400px" /> : <span style={css("font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>photo · {f.name} + neha · 3:2 · 372</span>}
                    </div>
                    {wish.photoCaption ? <figcaption style={css("font:italic 400 15px/1.35 'Libre Caslon Text',serif;color:#3D4A66;padding-top:6px")}>{wish.photoCaption}</figcaption> : null}
                  </figure>
                ) : null}
                {wish.soon ? <p style={css(`margin:0;font:400 34px/1.1 '${f.font}',cursive;color:#5E3695`)}>{t.soon}</p> : null}
                {wish.paragraphs.map((p, i) => (
                  <p key={i} style={css("margin:0 0 14px;font:400 18px/1.6 'DM Sans',sans-serif;color:#130F1F;text-align:justify;hyphens:auto;-webkit-hyphens:auto")}>{inline(p)}</p>
                ))}
                {!wish.soon ? <div style={css(`font:400 34px/1.1 '${f.font}',cursive;color:#5E3695;padding-top:4px;break-inside:avoid`)}>{t.signoff} {f.name}</div> : null}
                </div>
              </div>
              <div style={css('position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(180deg,rgba(238,234,224,0),#EEEAE0 80%);pointer-events:none')} />
            </div>
          </article>
          <div style={css('position:absolute;left:740px;top:22px;z-index:3')}><Fastener kind="binder" /></div>
          <div style={css('position:absolute;left:330px;top:640px;width:120px;height:28px;transform:rotate(-38deg);opacity:.88;background:repeating-linear-gradient(90deg,rgba(165,123,213,.5) 0 8px,transparent 8px 16px),repeating-linear-gradient(0deg,rgba(165,123,213,.5) 0 8px,transparent 8px 16px),#F3EEFA;clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%);z-index:3')} />
        </>
      )}
      <StickerLayer pageId={`wish-${wish.id}`} fixed={content.stickers.pages.wish?.fixed} floorY={784} ui={ui.stickerMenu} />
    </>
  );
}

