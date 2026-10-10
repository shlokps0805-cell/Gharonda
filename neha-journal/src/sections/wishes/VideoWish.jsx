// A video wish (design: WishScene "video"): a 760 x 428 frame in a clipped white print,
// with a short handwritten note beneath. Local MP4 or a YouTube link; vertical phone
// videos use 9:16 at 360 px wide.
import React, { useState } from 'react';
import { css } from '../../design/dc.js';
import Fastener from '../../design/Fastener.jsx';
import { mediaUrl } from '../../design/Photo.jsx';

export default function VideoWish({ wish, ink, no, total, ui }) {
  const v = wish.video;
  const [playing, setPlaying] = useState(false);
  const vertical = v.vertical === true;
  const w = vertical ? 360 : 760, h = vertical ? 640 : 428;
  const scale = vertical ? 0.62 : 1;
  return (
    <>
      <div style={css('position:absolute;left:370px;top:96px;display:flex;flex-direction:column;gap:6px')}>
        <div style={css(`font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:${ink}`)}>{ui.videoLetter} · {no} {ui.of} {total}</div>
        <h1 style={css(`margin:0;font:400 44px/1 'Libre Caslon Text',serif;color:${ink}`)}>{wish.headline}</h1>
      </div>
      <div style={{ ...css('position:absolute;left:356px;top:186px;padding:14px;background:#FFFFFF;transform-origin:0 0;box-shadow:0 2px 3px rgba(19,15,31,.3),0 14px 28px rgba(19,15,31,.28)'), transform: `rotate(-1deg) scale(${scale})` }}>
        <div style={css(`position:relative;width:${w}px;height:${h}px;background:repeating-linear-gradient(135deg,#2E3B5E 0 14px,#34436A 14px 28px);overflow:hidden`)}>
          {playing && v.file ? (
            <video src={mediaUrl(v.file)} poster={v.poster ? mediaUrl(v.poster) : undefined} controls autoPlay playsInline style={{ width: '100%', height: '100%', display: 'block', background: '#130F1F' }} />
          ) : playing && (v.youtube || v.vimeo) ? (
            <iframe title={wish.headline} src={v.youtube ? `https://www.youtube-nocookie.com/embed/${v.youtube}?autoplay=1&playsinline=1&cc_load_policy=1` : `https://player.vimeo.com/video/${v.vimeo}?autoplay=1`} allow="autoplay; fullscreen; picture-in-picture" style={{ width: '100%', height: '100%', border: 0 }} />
          ) : (
            <button type="button" className="nh-btn" aria-label="play the video" onClick={() => setPlaying(true)} style={css('position:absolute;inset:0;cursor:pointer')}>
              {v.poster ? <img src={mediaUrl(v.poster)} alt="" style={css('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} /> : <div style={css("position:absolute;left:14px;top:14px;font:400 12px/1.3 'Courier Prime',monospace;color:#CED9E4")}>{v.placeholder ? ui.videoSoon : `video · ${vertical ? '9:16' : '16:9'}`}</div>}
              <div style={css('position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center')}>
                <div style={css('width:26px;height:30px;margin-left:6px;background:#204670;clip-path:polygon(0 0,100% 50%,0 100%)')} />
              </div>
            </button>
          )}
          {playing && v.placeholder ? (
            <div style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:600 40px/1 'Caveat',cursive;color:#FFFFFF")}>{ui.videoSoon}</div>
          ) : null}
        </div>
        <div style={css('position:absolute;left:50%;top:-24px;margin-left:-20px')}><Fastener kind="binder" /></div>
      </div>
      {wish.videoNote ? <div style={css(`position:absolute;left:380px;top:${vertical ? 620 : 654}px;width:640px;font:400 28px/1.25 'Kalam',cursive;color:${ink}`)}>{wish.videoNote}</div> : null}
    </>
  );
}
