import React from 'react';
import { DC, css } from './dc.js';


export default class SpiralJournal extends DC {
  renderVals() {
    const w = Number(this.props.w ?? 1200), h = Number(this.props.h ?? 800);
    const paper = this.props.paper ?? 'white';
    const coilK = this.props.coil ?? 'silver';
    const edges = this.props.edges ?? true;
    const n = this.props.loops ?? Math.max(8, Math.min(22, Math.round(h / 38)));
    const holes = []; const top = 36, bot = h - 36; for (let i = 0; i < n; i++) holes.push(Math.round(top + (bot - top) * i / (n - 1)));
    const P = {
      white: ['#FFFFFF', '/media/textures/grain.png', '128px 128px', 1, 'normal'],
      lined: ['#FFFFFF', '/media/textures/grain.png', '128px 128px', 1, 'normal'],
      grid: ['#FFFFFF', '/media/textures/grain.png', '128px 128px', 1, 'normal'],
      kraft: ['#CDB79A', '/media/textures/kraft.png', '256px 256px', 1, 'normal'],
      dark: ['#1C1828', '/media/textures/film-grain.png', '200px 200px', 1, 'normal'],
      lavender: ['#EEE7F8', '/media/textures/grain.png', '128px 128px', 1, 'normal'],
      powder: ['#E6EDF4', '/media/textures/grain.png', '128px 128px', 1, 'normal'],
      'cover-navy': ['#204670', '/media/textures/linen-navy.png', '160px 160px', 1, 'normal'],
      'cover-brown': ['#6B4A33', '/media/textures/leather-brown.png', '200px 200px', 1, 'normal'],
      'cover-violet': ['#3B2266', '/media/textures/linen-violet.png', '160px 160px', 1, 'normal'],
      tint: [this.props.tint ?? '#EEE7F8', '/media/textures/grain.png', '128px 128px', 1, 'normal']
    };
    const p = P[paper] || P.white;
    const darkish = ['dark', 'cover-navy', 'cover-violet', 'cover-brown'].includes(paper);
    const silver = 'linear-gradient(180deg,#F4F5F8 0%,#B4BAC6 30%,#7D8492 52%,#C9CED8 72%,#8E95A3 100%)';
    const purple = 'linear-gradient(180deg,#EBE0F8 0%,#C4A8E6 32%,#9277BF 55%,#D6C3EF 76%,#A57BD5 100%)';
    // the page edges under a dark or tinted page are dark too, so no pale sliver shows at the edge
    const tintDark = paper === 'tint' && /^#/.test(this.props.tint || '') && parseInt((this.props.tint || '#ffffff').slice(1, 3), 16) < 0x80;
    const stackC = paper === 'kraft' ? ['#BFA889', '#C9B394', '#B39C7E', '#C4AE8F']
      : paper === 'dark' ? ['#100C18', '#16121F', '#0E0B16', '#14101D']
      : tintDark ? [0.62, 0.7, 0.58, 0.66].map(k => `color-mix(in oklch, ${this.props.tint} ${Math.round(k * 100)}%, #000)`)
      : ['#ECE8E1', '#F4F1EC', '#E3DED6', '#EFEBE5'];
    const stack = edges ? [4, 3, 2, 1].map(i => ({ x: i * 3, y: i * 3, c: stackC[i - 1] })) : [];
    return {
      w, h, ow: w + (edges ? 12 : 0), oh: h + (edges ? 12 : 0) + ((this.props.ribbon ?? false) ? 56 : 0), edges, stack,
      paperBg: p[0], tex: p[1], texS: p[2], texO: p[3], texBlend: p[4],
      lined: paper === 'lined', grid: paper === 'grid', cover: paper.startsWith('cover'),
      gutter: darkish ? 'rgba(0,0,0,.35)' : 'rgba(19,15,31,.09)',
      leak: !!this.props.leak,
      holes, holeBg: this.props.holeColor ?? '#2A2235',
      coil: coilK === 'purple' ? purple : silver,
      coilSh: '0 3px 2px rgba(19,15,31,.32)',
      ribbon: this.props.ribbon ?? false, ribX: Math.round(w * .74), ribY: h - 30, ribL: 86,
      elastic: !!this.props.elastic, elX: w - 64, elH: h + 12
    };
  }
  template(v) {
    return (
      <div style={css(`position:relative;flex:none;width:${v.ow}px;height:${v.oh}px`)}>
        {v.edges ? (<>
          {(v.stack || []).map((e, $index) => (<React.Fragment key={$index}>
            <div style={css(`position:absolute;left:${e.x}px;top:${e.y}px;width:${v.w}px;height:${v.h}px;border-radius:3px 8px 8px 3px;background:${e.c};box-shadow:0 1px 2px rgba(19,15,31,.18)`)} />
          </React.Fragment>))}
        </>) : null}
        <div style={css(`position:absolute;left:0;top:0;width:${v.w}px;height:${v.h}px;border-radius:3px 8px 8px 3px;background:${v.paperBg};box-shadow:0 2px 3px rgba(19,15,31,.22),0 18px 40px rgba(19,15,31,.28);overflow:hidden`)}>
          <div style={css(`position:absolute;inset:0;background:url(${v.tex}) 0 0/${v.texS};opacity:${v.texO};mix-blend-mode:${v.texBlend}`)} />
          {v.lined ? (<>
            <div style={css("position:absolute;left:0;right:0;top:96px;bottom:24px;background:repeating-linear-gradient(180deg,transparent 0 31px,rgba(142,167,201,.45) 31px 32px)")} />
            <div style={css("position:absolute;top:0;bottom:0;left:112px;width:1.5px;background:rgba(201,90,91,.45)")} />
          </>) : null}
          {v.grid ? (<>
            <div style={css("position:absolute;inset:24px 24px 24px 64px;background:repeating-linear-gradient(0deg,transparent 0 23px,rgba(142,167,201,.32) 23px 24px),repeating-linear-gradient(90deg,transparent 0 23px,rgba(142,167,201,.32) 23px 24px)")} />
          </>) : null}
          <div style={css(`position:absolute;top:0;bottom:0;left:0;width:72px;background:linear-gradient(90deg,${v.gutter},rgba(19,15,31,0))`)} />
          {v.cover ? (<>
            <div style={css("position:absolute;inset:14px 14px 14px 52px;border:1px solid rgba(255,255,255,.2);border-radius:4px")} />
          </>) : null}
          {v.leak ? (<>
            <div style={css("position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(196,168,230,.32),rgba(196,168,230,0) 70%)")} />
          </>) : null}
          {(v.holes || []).map((y, $index) => (<React.Fragment key={$index}>
            <div style={css(`position:absolute;left:20px;top:${y}px;width:11px;height:11px;margin-top:-5.5px;border-radius:50%;background:${v.holeBg};box-shadow:inset 0 1.5px 2px rgba(0,0,0,.45)`)} />
          </React.Fragment>))}
        </div>
        {(v.holes || []).map((y, $index) => (<React.Fragment key={$index}>
          <div style={css(`position:absolute;left:-16px;top:${y}px;width:44px;height:11px;margin-top:-8px;border-radius:6px;background:${v.coil};transform:rotate(-9deg);box-shadow:${v.coilSh}`)} />
        </React.Fragment>))}
        {v.ribbon ? (<>
          <div style={css(`position:absolute;left:${v.ribX}px;top:${v.ribY}px;width:20px;height:${v.ribL}px;background:linear-gradient(90deg,#9E2617,#BA2F1F 40%,#C8402F 60%,#9E2617);clip-path:polygon(0 0,100% 0,100% 100%,50% 88%,0 100%);box-shadow:1px 2px 3px rgba(19,15,31,.3)`)} />
        </>) : null}
        {v.elastic ? (<>
          <div style={css(`position:absolute;left:${v.elX}px;top:-6px;width:14px;height:${v.elH}px;border-radius:3px;background:repeating-linear-gradient(180deg,#5E3695 0 2px,#4A2880 2px 4px);box-shadow:inset 2px 0 0 rgba(255,255,255,.16),2px 0 4px rgba(19,15,31,.35)`)} />
        </>) : null}
      </div>
    );
  }
}
