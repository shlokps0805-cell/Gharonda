import React from 'react';
import { DC, css } from './dc.js';


export default class Fastener extends DC {
  renderVals() {
    const kind = this.props.kind ?? 'pin';
    const ps = this.props.size ?? 16;
    const D = { pin: [ps + 4, ps + 5], pinSide: [28, 40], binder: [40, 38], paperclip: [16, 48], clothespin: [16, 50], corner: [28, 28] };
    const key = kind === 'pin-side' ? 'pinSide' : kind;
    const d = D[key] || D.pin;
    return { bw: d[0], bh: d[1], ps, rot: this.props.rotate ?? 0, is: { pin: key === 'pin', pinSide: key === 'pinSide', binder: key === 'binder', paperclip: key === 'paperclip', clothespin: key === 'clothespin', corner: key === 'corner' } };
  }
  template(v) {
    return (
      <div style={css(`position:relative;flex:none;width:${v.bw}px;height:${v.bh}px;transform:rotate(${v.rot}deg)`)}>
        {v.is.pin ? (<>
          <div style={css(`position:absolute;left:4px;top:5px;width:${v.ps}px;height:${v.ps}px;border-radius:50%;background:rgba(19,15,31,.28);filter:blur(1.5px)`)} />
          <div style={css(`position:absolute;left:0;top:0;width:${v.ps}px;height:${v.ps}px;border-radius:50%;background:radial-gradient(circle at 34% 30%,#FFFFFF 0 9%,#FBEFC4 17%,#D8B85E 48%,#8A6A1E 100%)`)} />
        </>) : null}
        {v.is.pinSide ? (<>
          <div style={css("position:absolute;left:13px;top:20px;width:2px;height:20px;background:linear-gradient(90deg,#8D93A0,#E9ECF2,#8D93A0);border-radius:0 0 1px 1px")} />
          <div style={css("position:absolute;left:6px;top:14px;width:16px;height:8px;border-radius:2px;background:linear-gradient(90deg,#B08A2E,#F2DC92,#8A6A1E)")} />
          <div style={css("position:absolute;left:9px;top:6px;width:10px;height:10px;background:linear-gradient(90deg,#B08A2E,#F2DC92,#8A6A1E)")} />
          <div style={css("position:absolute;left:3px;top:0;width:22px;height:8px;border-radius:50%;background:linear-gradient(90deg,#B08A2E,#FBEFC4,#8A6A1E)")} />
        </>) : null}
        {v.is.binder ? (<>
          <div style={css("position:absolute;left:8px;top:0;width:12px;height:18px;border:2px solid #D9BE6E;border-bottom:none;border-radius:6px 6px 0 0;transform:rotate(-14deg);transform-origin:bottom center")} />
          <div style={css("position:absolute;right:8px;top:0;width:12px;height:18px;border:2px solid #A88632;border-bottom:none;border-radius:6px 6px 0 0;transform:rotate(14deg);transform-origin:bottom center")} />
          <div style={css("position:absolute;left:0;top:14px;width:40px;height:24px;background:linear-gradient(180deg,#F4E2A0,#D8B85E 45%,#B08A2E);clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);box-shadow:0 1px 0 rgba(255,255,255,.5) inset")} />
          <div style={css("position:absolute;left:4px;top:15px;width:32px;height:2px;background:rgba(255,255,255,.55);border-radius:1px")} />
        </>) : null}
        {v.is.paperclip ? (<>
          <div style={css("position:absolute;left:0;top:0;width:16px;height:48px;border:2.5px solid #B08A2E;border-radius:8px;box-shadow:1px 1px 0 rgba(19,15,31,.15)")} />
          <div style={css("position:absolute;left:4px;top:8px;width:8px;height:34px;border:2.5px solid #D8B85E;border-top:none;border-radius:0 0 5px 5px")} />
        </>) : null}
        {v.is.clothespin ? (<>
          <div style={css("position:absolute;left:0;top:0;width:7px;height:50px;border-radius:3px 2px 2px 4px;background:linear-gradient(90deg,#B08A2E,#F2DC92 60%,#D8B85E)")} />
          <div style={css("position:absolute;left:8px;top:0;width:7px;height:50px;border-radius:2px 3px 4px 2px;background:linear-gradient(90deg,#D8B85E,#FBEFC4 40%,#B08A2E)")} />
          <div style={css("position:absolute;left:-2px;top:20px;width:19px;height:7px;border-radius:3px;background:linear-gradient(180deg,#E9ECF2,#A88632);box-shadow:0 1px 1px rgba(19,15,31,.3)")} />
        </>) : null}
        {v.is.corner ? (<>
          <div style={css("position:absolute;inset:0;background:linear-gradient(135deg,#F2DC92,#D8B85E 50%,#B08A2E);clip-path:polygon(0 0,100% 0,0 100%);filter:drop-shadow(1px 1px 1px rgba(19,15,31,.3))")} />
          <div style={css("position:absolute;left:3px;top:3px;width:18px;height:1.5px;background:rgba(255,255,255,.6);transform:rotate(-45deg);transform-origin:0 0;top:21px")} />
        </>) : null}
      </div>
    );
  }
}
