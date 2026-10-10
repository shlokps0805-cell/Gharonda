import React from 'react';
import { DC, css } from './dc.js';
import Sticker from './Sticker.jsx';
import WaxSeal from './WaxSeal.jsx';

export default class Envelope extends DC {
  lum(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 1;
    const n = parseInt(m[1], 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  }
  renderVals() {
    const hero = (this.props.size ?? 'hero') === 'hero';
    const st = this.props.state ?? 'closed';
    const base = this.props.color ?? '#F4EDE0';
    const cream = base.toUpperCase() === '#F4EDE0';
    const dark = this.lum(base) < .18;
    const w = hero ? 560 : 200, h = hero ? 360 : 130;
    const nameTop = this.props.namePos ? this.props.namePos === 'top' : hero;
    return {
      w, h, hero, base,
      shade: cream ? '#E9DFCD' : `color-mix(in oklch, ${base} 88%, #130F1F)`,
      edge: cream ? '#D8CAB2' : `color-mix(in oklch, ${base} 76%, #130F1F)`,
      interior: cream ? '#C2B094' : `color-mix(in oklch, ${base} 62%, #130F1F)`,
      ink: dark ? '#FFFFFF' : (cream ? '#204670' : '#320F6F'),
      edgeLine: this.props.edgeLine ?? dark,
      closed: st === 'closed' || st === 'cracked' || st === 'pulse',
      open: st === 'open' || st === 'letter', letter: st === 'letter', openOnly: st === 'open',
      sealState: st === 'cracked' ? 'cracked' : st === 'pulse' ? 'pulse' : 'intact',
      sealSize: hero ? 92 : 36,
      sealColor: this.props.sealColor ?? '#9E2A2B',
      name: this.props.label ?? (hero ? 'For Neha' : 'Friend 1'),
      showName: !(nameTop && (st === 'open' || st === 'letter')),
      nameSize: hero ? (this.props.nameFont === 'Mrs Saint Delafield' ? 64 : 56) : Math.max(22, Math.min(28, Math.round(280 / Math.max(1, (this.props.label || '').length)))), nameFF: hero ? `'${this.props.nameFont ?? 'Great Vibes'}',cursive` : `'${this.props.handFont ?? 'Caveat'}',cursive`, nameW: hero || this.props.handFont === 'Kalam' ? 400 : 600, nameSq: hero ? .84 : 1,
      showBy: hero && (this.props.showBy ?? true), by: this.props.by ?? '', bySize: 26, byW: 150, byY: nameTop ? '23%' : '86%',
      nameX: hero ? '7%' : '8%', nameY: nameTop ? (hero ? '9%' : '10%') : (hero ? '74%' : '68%'),
      stamp: (this.props.stamp ?? false) && !(st === 'open' || st === 'letter'), stampSize: hero ? 84 : 34,
      lineGap: hero ? 28 : 12, lineGap1: hero ? 29 : 13, lineTop: hero ? 56 : 14, letterPad: hero ? 24 : 8,
      onSeal: this.props.onSeal,
      // the flap folds open in 3D when the state changes to open (design: rotateX 0 → 180°, 500ms spring)
      // the small brown journal rises out 150 ms after the flap (700 ms spring)
      riseAnim: this.props.animate ? 'nh-rise 1500ms cubic-bezier(0.22,1,0.36,1) 100ms both' : 'none',
      flapAnim: this.props.animate ? 'nh-flap 1000ms cubic-bezier(0.34,1.4,0.64,1) both' : 'none'
    };
  }
  template(v) {
    return (
      <div style={css(`position:relative;flex:none;width:${v.w}px;height:${v.h}px`)}>
        <div style={css("position:absolute;inset:0;filter:drop-shadow(0 2px 3px rgba(19,15,31,.3)) drop-shadow(0 12px 22px rgba(19,15,31,.22))")}>
          {v.open ? (<>
            <div style={css(`position:absolute;left:0;bottom:100%;width:100%;height:58%;background:${v.shade};clip-path:polygon(0 100%,100% 100%,50% 0);margin-bottom:-1px;transform-origin:50% 100%;animation:${v.flapAnim}`)} />
          </>) : null}
          <div style={css(`position:absolute;inset:0;background:${v.interior};border-radius:4px`)} />
          {v.letter ? (<>
            <div style={{ ...css("position:absolute;left:30%;width:40%;top:-72%;height:84%;transform:rotate(-4deg);transform-origin:50% 100%"), animation: v.riseAnim }}>
              <div style={css("position:absolute;left:4px;top:4px;right:-4px;bottom:-4px;border-radius:2px 6px 6px 2px;background:#ECE8E1")} />
              <div style={css("position:absolute;inset:0;border-radius:2px 6px 6px 2px;background:url(/media/textures/leather-brown.png) 0 0/200px 200px,#6B4A33;box-shadow:0 2px 4px rgba(19,15,31,.3),inset 0 0 0 1px rgba(255,255,255,.12)")}>
                <div style={css("position:absolute;inset:12px 12px 12px 22px;border:1px solid rgba(216,184,94,.45);border-radius:3px")} />
                {v.hero ? (<>
                  <div style={css("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding-left:10px")}>
                    <div style={css("font:400 50px/1 'Pinyon Script',cursive;background:linear-gradient(100deg,#B08A2E,#F6E3A1 35%,#D8B85E 55%,#FBEFC4 70%,#B08A2E);-webkit-background-clip:text;background-clip:text;color:transparent")}>
                      Neha
                    </div>
                    <div style={css("font:700 8px/1 'Courier Prime',monospace;letter-spacing:.2em;color:#DCCBF3;white-space:nowrap")}>
                      THE BIRTHDAY JOURNAL
                    </div>
                  </div>
                </>) : null}
              </div>
              <div style={css("position:absolute;right:-6px;top:22px;width:22px;height:22px;background:linear-gradient(135deg,#FBEFC4,#D8B85E 50%,#8A6A1E);clip-path:polygon(0 0,100% 0,100% 100%);filter:drop-shadow(1px 1px 1px rgba(19,15,31,.3))")} />
              <div style={css("position:absolute;left:6px;top:6%;bottom:6%;display:flex;flex-direction:column;justify-content:space-between")}>
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
                <div style={css("width:16px;height:5px;margin-left:-11px;border-radius:3px;background:linear-gradient(180deg,#F4F5F8,#B4BAC6 35%,#7D8492 60%,#C9CED8)")} />
              </div>
            </div>
          </>) : null}
          <div style={css(`position:absolute;inset:0;background:${v.shade};clip-path:polygon(0 0,52% 54%,0 100%);border-radius:4px`)} />
          <div style={css(`position:absolute;inset:0;background:${v.shade};clip-path:polygon(100% 0,48% 54%,100% 100%);border-radius:4px`)} />
          <div style={css(`position:absolute;inset:0;background:${v.edge};clip-path:polygon(0 100%,50% 43.4%,100% 100%);border-radius:4px`)} />
          <div style={css(`position:absolute;inset:0;background:${v.base};clip-path:polygon(0 100%,50% 44.2%,100% 100%);border-radius:4px`)} />
          {v.closed ? (<>
            <div style={css(`position:absolute;inset:0;background:${v.edge};clip-path:polygon(0 0,100% 0,50% 59%);border-radius:4px`)} />
            <div style={css(`position:absolute;inset:0;background:${v.base};clip-path:polygon(0 0,100% 0,50% 58%);border-radius:4px`)} />
          </>) : null}
          <div style={css("position:absolute;inset:0;border-radius:4px;pointer-events:none;opacity:.55;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http%3A//www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22p%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 .07 0 0 0 0 .06 0 0 0 0 .08 0 0 0 .09 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23p)%22/%3E%3C/svg%3E')")} />
        </div>
        {v.edgeLine ? (<>
          <div style={css("position:absolute;inset:0;border:1px solid rgba(255,255,255,.55);border-radius:4px;pointer-events:none")} />
        </>) : null}
        {v.showName ? (<>
          <div style={css(`position:absolute;left:${v.nameX};top:${v.nameY};font:${v.nameW} ${v.nameSize}px/${v.hero ? 1 : 1.4} ${v.nameFF};margin-top:${v.hero ? 0 : -6}px;color:${v.ink};transform:rotate(-3deg) scaleY(${v.nameSq});transform-origin:0 50%;white-space:nowrap;max-width:${v.hero ? 520 : 168}px;overflow:hidden;text-overflow:ellipsis;padding-bottom:4px`)}>
            {v.name}
          </div>
          {v.showBy ? (<>
            <div style={css(`position:absolute;left:${v.nameX};top:${v.byY};display:flex;align-items:baseline;gap:8px;transform:rotate(-3deg);white-space:nowrap`)}>
              <span style={css(`font:400 ${v.bySize}px/1 'Kalam',cursive;color:${v.ink}`)}>
                by
              </span>
              <span style={css(`min-width:${v.byW}px;border-bottom:1.5px solid ${v.ink};font:400 ${v.bySize}px/1 'Kalam',cursive;color:${v.ink};padding:0 4px 2px`)}>
                {v.by}
              </span>
            </div>
          </>) : null}
        </>) : null}
        {v.stamp ? (<>
          <div style={css("position:absolute;right:6%;top:7%")}>
            <Sticker kind="postage-stamp" size={v.stampSize} rotate={5} />
          </div>
        </>) : null}
        {v.closed ? (<>
          <div style={css("position:absolute;left:50%;top:58%;transform:translate(-50%,-50%)")}>
            <WaxSeal size={v.sealSize} state={v.sealState} color={v.sealColor} onClick={v.onSeal} animate={this.props.animate} />
          </div>
        </>) : null}
        {v.openOnly ? (<>
          <div style={css("position:absolute;left:50%;top:-50%;transform:translate(-50%,-50%) scale(.8)")}>
            <WaxSeal size={v.sealSize} state="cracked" color={v.sealColor} />
          </div>
        </>) : null}
      </div>
    );
  }
}
