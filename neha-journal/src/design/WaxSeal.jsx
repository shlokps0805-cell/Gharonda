import React from 'react';
import { DC, css } from './dc.js';

/* helmet css:
@keyframes nh-seal-pulse{0%{transform:scale(.92);opacity:.95}100%{transform:scale(1.28);opacity:0}}
*/

export default class WaxSeal extends DC {
  renderVals() {
    const size = this.props.size ?? 96;
    const st = this.props.state ?? 'intact';
    const base = this.props.color ?? '#9E2A2B';
    const isCherry = base.toUpperCase() === '#9E2A2B';
    const dark = isCherry ? '#4E1019' : `color-mix(in oklch, ${base} 62%, #000)`;
    const light = `color-mix(in oklch, ${base} 70%, #fff)`;
    return {
      size, s: size / 100, base, dark, light,
      pulse: st === 'pulse', whole: st !== 'cracked', cracked: st === 'cracked',
      halves: [
        { clip: 'polygon(0 0, 52% 0, 46% 30%, 56% 52%, 44% 74%, 50% 100%, 0 100%)', tf: 'translate(-7px,3px) rotate(-7deg)' },
        { clip: 'polygon(52% 0, 100% 0, 100% 100%, 50% 100%, 44% 74%, 56% 52%, 46% 30%)', tf: 'translate(7px,5px) rotate(6deg)' }
      ],
      onClick: this.props.onClick,
      // a real button only when the seal is clickable (the opening envelope)
      Tag: this.props.onClick ? 'button' : 'div', ariaLabel: this.props.ariaLabel ?? 'break the seal'
    };
  }
  template(v) {
    return (
      <v.Tag type={v.onClick ? 'button' : undefined} className={v.onClick ? 'nh-btn' : undefined} aria-label={v.onClick ? v.ariaLabel : undefined} style={css(`position:relative;flex:none;width:${v.size}px;height:${v.size}px`)} onClick={v.onClick}>
        <div style={css(`position:absolute;left:0;top:0;width:100px;height:100px;transform-origin:0 0;transform:scale(${v.s})`)}>
          {v.pulse ? (<>
            <div style={css("position:absolute;inset:-6px;border-radius:50%;border:2px solid #C4A8E6;animation:nh-seal-pulse 1600ms cubic-bezier(0.25,1,0.5,1) infinite")} />
            <div style={css("position:absolute;inset:-12px;border-radius:50%;border:1.5px solid rgba(196,168,230,.5)")} />
          </>) : null}
          {v.whole ? (<>
            <div style={css("position:absolute;inset:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45))")}>
              <div style={css(`position:absolute;left:2px;top:34px;width:26px;height:26px;border-radius:50%;background:${v.base}`)} />
              <div style={css(`position:absolute;left:62px;top:2px;width:24px;height:24px;border-radius:50%;background:${v.base}`)} />
              <div style={css(`position:absolute;left:74px;top:60px;width:24px;height:24px;border-radius:50%;background:${v.dark}`)} />
              <div style={css(`position:absolute;left:24px;top:76px;width:22px;height:22px;border-radius:50%;background:${v.dark}`)} />
              <div style={css(`position:absolute;left:8px;top:8px;width:22px;height:22px;border-radius:50%;background:${v.base}`)} />
              <div style={css(`position:absolute;left:78px;top:30px;width:18px;height:18px;border-radius:50%;background:${v.base}`)} />
              <div style={css(`position:absolute;left:8px;top:8px;width:84px;height:84px;border-radius:50%;background:radial-gradient(circle at 36% 30%,${v.light} 0,${v.base} 42%,${v.dark} 100%)`)} />
              <div style={css(`position:absolute;left:22px;top:22px;width:56px;height:56px;border-radius:50%;background:${v.base};box-shadow:inset 0 3px 5px ${v.dark},inset 0 -2px 2px rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font:400 39px/1 'Libre Caslon Text',serif;color:${v.dark};text-shadow:0 1px 0 rgba(255,255,255,.3),0 -1px 0 rgba(0,0,0,.25)`)}>
                N
              </div>
            </div>
          </>) : null}
          {v.cracked ? (<>
            {(v.halves || []).map((hv, $index) => (<React.Fragment key={$index}>
              <div style={css(`position:absolute;inset:0;clip-path:${hv.clip};transform:${hv.tf};filter:drop-shadow(0 2px 2px rgba(0,0,0,.45))`)}>
                <div style={css(`position:absolute;left:2px;top:34px;width:26px;height:26px;border-radius:50%;background:${v.base}`)} />
                <div style={css(`position:absolute;left:62px;top:2px;width:24px;height:24px;border-radius:50%;background:${v.base}`)} />
                <div style={css(`position:absolute;left:74px;top:60px;width:24px;height:24px;border-radius:50%;background:${v.dark}`)} />
                <div style={css(`position:absolute;left:24px;top:76px;width:22px;height:22px;border-radius:50%;background:${v.dark}`)} />
                <div style={css(`position:absolute;left:8px;top:8px;width:22px;height:22px;border-radius:50%;background:${v.base}`)} />
                <div style={css(`position:absolute;left:78px;top:30px;width:18px;height:18px;border-radius:50%;background:${v.base}`)} />
                <div style={css(`position:absolute;left:8px;top:8px;width:84px;height:84px;border-radius:50%;background:radial-gradient(circle at 36% 30%,${v.light} 0,${v.base} 42%,${v.dark} 100%)`)} />
                <div style={css(`position:absolute;left:22px;top:22px;width:56px;height:56px;border-radius:50%;background:${v.base};box-shadow:inset 0 3px 5px ${v.dark},inset 0 -2px 2px rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font:400 39px/1 'Libre Caslon Text',serif;color:${v.dark};text-shadow:0 1px 0 rgba(255,255,255,.3),0 -1px 0 rgba(0,0,0,.25)`)}>
                  N
                </div>
              </div>
            </React.Fragment>))}
          </>) : null}
        </div>
      </v.Tag>
    );
  }
}
