import React from 'react';
import { DC, css } from './dc.js';

/* helmet css:
@keyframes nh-spin{to{transform:rotate(360deg)}}@keyframes nh-ring{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.7);opacity:0}}
*/

export default class MiniPlayer extends DC {
  // Driven by the music engine (src/music/MusicContext.jsx):
  // state: 'paused' | 'playing' | 'press' (tap to start) | 'unavailable'
  renderVals() {
    const st = this.props.state ?? 'paused';
    const muted = !!this.props.muted;
    const playing = st === 'playing';
    const ui = this.props.ui || {};
    return {
      title: this.props.title ?? '',
      picked: this.props.picked ?? '',
      playing, notPlaying: !playing, press: st === 'press', muted, soundOn: !muted,
      pressText: ui.tapToStart || '{v.pressText}',
      titleColor: muted || st === 'unavailable' ? '#ACBFD3' : '#FFFFFF', noteColor: this.props.noteColor ?? '#204670',
      spin: playing && !muted ? 'nh-spin 2.4s linear infinite' : 'none',
      togglePlay: this.props.onToggle, toggleMute: this.props.onMute, prev: this.props.onPrev, next: this.props.onNext,
      disabled: st === 'unavailable'
    };
  }
  template(v) {
    return (
      <div style={css("position:relative;flex:none;width:280px;height:80px")}>
        {v.press ? (<>
          <div style={css("position:absolute;left:96px;bottom:84px;display:flex;align-items:flex-end;gap:6px;pointer-events:none")}>
            <div style={css(`font:600 26px/1 'Caveat',cursive;color:${v.noteColor};transform:rotate(-3deg);white-space:nowrap`)}>
              {v.pressText}
            </div>
            <div style={css(`width:18px;height:26px;border-right:2px solid ${v.noteColor};border-bottom:2px solid ${v.noteColor};border-bottom-right-radius:18px;transform:rotate(18deg) translateY(10px)`)} />
          </div>
        </>) : null}
        <div style={css("position:absolute;inset:0;background:#141E33;border-radius:12px;border:1px solid rgba(255,255,255,.1);box-shadow:0 2px 4px rgba(0,0,0,.35),0 10px 20px rgba(0,0,0,.25);padding:12px;display:flex;align-items:center;gap:12px")}>
          <div style={css("position:relative;flex:none;width:52px;height:36px;border-radius:5px;background:#130F1F;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)")}>
            <div style={css("position:absolute;left:4px;top:4px;width:44px;height:19px;border-radius:2px;background:#DCCBF3")} />
            <div style={css("position:absolute;left:11px;top:9px;width:30px;height:11px;border-radius:6px;background:#130F1F")} />
            <div style={css(`position:absolute;left:13px;top:10px;width:9px;height:9px;border-radius:50%;background:repeating-conic-gradient(#130F1F 0 18deg,#FFFFFF 18deg 60deg);animation:${v.spin}`)} />
            <div style={css(`position:absolute;left:30px;top:10px;width:9px;height:9px;border-radius:50%;background:repeating-conic-gradient(#130F1F 0 18deg,#FFFFFF 18deg 60deg);animation:${v.spin}`)} />
            <div style={css("position:absolute;left:15px;top:27px;width:22px;height:6px;background:#2E3B5E;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%)")} />
          </div>
          <div style={css("flex:1;min-width:0;display:flex;flex-direction:column;gap:6px")}>
            <div style={css("display:flex;align-items:center;gap:8px")}>
              <div style={css(`flex:1;min-width:0;font:600 14px/1.2 'DM Sans',sans-serif;color:${v.titleColor};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>
                {v.title}
              </div>
              <button type="button" className="nh-btn" aria-label={v.muted ? 'sound on' : 'sound off'} aria-pressed={v.muted} disabled={v.disabled} style={css("position:relative;flex:none;width:20px;height:20px;cursor:pointer")} onClick={v.toggleMute}>
                <div style={css("position:absolute;left:2px;top:7px;width:4px;height:6px;background:#FFFFFF")} />
                <div style={css("position:absolute;left:5px;top:3px;width:6px;height:14px;background:#FFFFFF;clip-path:polygon(0 30%,100% 0,100% 100%,0 70%)")} />
                {v.soundOn ? (<>
                  <div style={css("position:absolute;left:9px;top:6px;width:6px;height:8px;border-right:2px solid #FFFFFF;border-radius:0 50% 50% 0")} />
                  <div style={css("position:absolute;left:10px;top:3px;width:9px;height:14px;border-right:2px solid #FFFFFF;border-radius:0 50% 50% 0")} />
                </>) : null}
                {v.muted ? (<>
                  <div style={css("position:absolute;left:12px;top:9px;width:8px;height:2px;background:#FFFFFF;transform:rotate(45deg)")} />
                  <div style={css("position:absolute;left:12px;top:9px;width:8px;height:2px;background:#FFFFFF;transform:rotate(-45deg)")} />
                </>) : null}
              </button>
            </div>
            <div style={css("display:flex;align-items:center;gap:8px")}>
              <div style={css("flex:1;min-width:0;font:400 12px/1.2 'DM Sans',sans-serif;color:#ACBFD3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                {v.picked}
              </div>
              <div style={css("display:flex;align-items:center;gap:6px")}>
                <button type="button" className="nh-btn" aria-label="previous song" disabled={v.disabled} onClick={v.prev} style={css("display:flex;align-items:center;width:18px;height:22px;justify-content:center;cursor:pointer")}>
                  <div style={css("width:2px;height:10px;background:#FFFFFF")} />
                  <div style={css("width:8px;height:10px;background:#FFFFFF;clip-path:polygon(100% 0,0 50%,100% 100%)")} />
                </button>
                <button type="button" className="nh-btn" aria-label={v.playing ? 'pause' : 'play'} onClick={v.togglePlay} style={css("position:relative;width:28px;height:28px;cursor:pointer")}>
                  {v.press ? (<>
                    <div style={css("position:absolute;inset:-3px;border-radius:50%;border:2px solid #C4A8E6;animation:nh-ring 1400ms cubic-bezier(0.25,1,0.5,1) infinite")} />
                    <div style={css("position:absolute;inset:-3px;border-radius:50%;border:2px solid #C4A8E6")} />
                  </>) : null}
                  <div style={css("position:absolute;inset:0;border-radius:50%;background:#FFFFFF;display:flex;align-items:center;justify-content:center;gap:3px")}>
                    {v.playing ? (<>
                      <div style={css("width:3px;height:11px;background:#130F1F")} />
                      <div style={css("width:3px;height:11px;background:#130F1F")} />
                    </>) : null}
                    {v.notPlaying ? (<>
                      <div style={css("width:10px;height:12px;margin-left:2px;background:#130F1F;clip-path:polygon(0 0,100% 50%,0 100%)")} />
                    </>) : null}
                  </div>
                </button>
                <button type="button" className="nh-btn" aria-label="next song" disabled={v.disabled} onClick={v.next} style={css("display:flex;align-items:center;width:18px;height:22px;justify-content:center;cursor:pointer")}>
                  <div style={css("width:8px;height:10px;background:#FFFFFF;clip-path:polygon(0 0,100% 50%,0 100%)")} />
                  <div style={css("width:2px;height:10px;background:#FFFFFF")} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
