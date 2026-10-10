// The era's video tile: a frame with a soft play button that plays in place.
// Uses a local MP4 (public/media/...) or a YouTube / Vimeo link from the era's data.
import React, { useState } from 'react';
import { css } from '../../design/dc.js';
import PhotoFrame from '../../design/PhotoFrame.jsx';
import { mediaUrl } from '../../design/Photo.jsx';

export default function VideoTile({ slot, video, ui }) {
  const [playing, setPlaying] = useState(false);
  const [soon, setSoon] = useState(false);
  const [a, b] = slot.r.split(':').map(Number);
  const w = slot.s, h = Math.round(slot.s * b / a);

  const play = () => {
    if (video.placeholder) { setSoon(true); setTimeout(() => setSoon(false), 2200); return; }
    setPlaying(true);
  };

  if (playing) {
    const box = css(`width:${w + 20}px;padding:10px;background:#FFFFFF;transform:rotate(${slot.rot}deg);box-shadow:0 1px 2px rgba(19,15,31,.25),0 8px 18px rgba(19,15,31,.18);animation:nh-fade-in 300ms ease-out`);
    return (
      <div style={box}>
        {video.file ? (
          <video src={mediaUrl(video.file)} poster={video.poster ? mediaUrl(video.poster) : undefined} controls autoPlay playsInline style={{ width: w, height: h, display: 'block', background: '#130F1F', objectFit: 'cover' }} />
        ) : (
          <iframe
            title="video"
            src={video.youtube ? `https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&playsinline=1` : `https://player.vimeo.com/video/${video.vimeo}?autoplay=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            style={{ width: w, height: h, border: 0, display: 'block' }}
          />
        )}
      </div>
    );
  }
  return (
    <button type="button" className="nh-btn" aria-label="play the video" onClick={play} style={css('position:relative;cursor:pointer')}>
      <PhotoFrame type={slot.t} ratio={slot.r} size={slot.s} rotate={slot.rot} showCaption={false} src={video.poster} label={`video · ${slot.r}`} />
      <div style={css('position:absolute;left:50%;top:42%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(255,255,255,.9);box-shadow:0 2px 10px rgba(19,15,31,.25);display:flex;align-items:center;justify-content:center')}>
        <div style={css('width:20px;height:24px;margin-left:5px;background:#204670;clip-path:polygon(0 0,100% 50%,0 100%)')} />
      </div>
      {soon ? <div style={css("position:absolute;left:50%;top:62%;transform:translateX(-50%) rotate(-3deg);font:600 24px/1 'Caveat',cursive;color:#204670;background:#FFFFFF;padding:4px 10px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 3px rgba(19,15,31,.25)")}>{ui.videoSoon}</div> : null}
    </button>
  );
}
