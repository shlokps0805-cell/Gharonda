import React from 'react';
import { DC, css } from './dc.js';


export default class RansomWord extends DC {
  renderVals() {
    const text = this.props.text ?? 'The Darkroom';
    const size = this.props.size ?? 64;
    const override = (this.props.cherry ?? '').toString().split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
    const S = [
      { bg: '#DCCBF3', fg: '#320F6F', ff: "'Libre Caslon Text', serif", fw: 700, fs: 'normal', k: 1.0, up: true },
      { bg: '#FBF9F5', fg: '#130F1F', ff: "'Libre Caslon Text', serif", fw: 600, fs: 'italic', k: 1.02, up: false },
      { bg: '#CED9E4', fg: '#130F1F', ff: "'DM Sans', sans-serif", fw: 800, fs: 'normal', k: .9, up: true },
      { bg: '#FFFFFF', fg: '#130F1F', ff: "'Courier Prime', monospace", fw: 500, fs: 'normal', k: .88, up: true },
      { bg: '#204670', fg: '#FBF9F5', ff: "'Libre Caslon Text', serif", fw: 900, fs: 'normal', k: 1.04, up: false },
      { bg: '#FBF9F5', fg: '#130F1F', ff: "'Libre Caslon Text', serif", fw: 500, fs: 'italic', k: 1.08, up: false },
      { bg: '#C4A8E6', fg: '#320F6F', ff: "'DM Sans', sans-serif", fw: 500, fs: 'normal', k: .94, up: true }
    ];
    const CH = { bg: '#130F1F', fg: '#FFFFFF', ff: "'DM Sans', sans-serif", fw: 800, fs: 'normal', k: 1.0, up: true };
    const CH2 = { bg: '#5E3695', fg: '#FFFFFF', ff: "'DM Sans', sans-serif", fw: 800, fs: 'normal', k: 1.0, up: true };
    const ROT = [-4, 3, -2, 5, -3, 2, -5, 4, -1];
    const DY = [0, -3, 2, -2, 3, -1];
    const CLIP = ['polygon(2% 4%, 96% 0%, 100% 92%, 4% 100%)', 'polygon(0 2%, 100% 6%, 97% 100%, 3% 95%)', 'polygon(0 6%, 22% 0, 48% 4%, 76% 0, 100% 5%, 97% 100%, 70% 96%, 40% 100%, 12% 95%, 3% 100%)', 'polygon(4% 0, 100% 3%, 96% 97%, 0 100%)', 'polygon(0 0, 92% 3%, 100% 100%, 6% 96%)'];
    let g = 0;
    const words = text.split(' ').filter(Boolean).map((word, wi) => {
      const ci = override[wi] ?? Math.floor(word.length / 2);
      const letters = [...word].map((c, i) => {
        const st = i === ci ? (wi === 0 ? CH : CH2) : S[(g * 3 + wi * 2) % 7];
        const n = g++;
        const fz = Math.round(size * st.k);
        return {
          ch: st.up ? c.toUpperCase() : c, bg: st.bg, fg: st.fg, ff: st.ff, fw: st.fw, fs: st.fs, size: fz,
          rot: ROT[n % ROT.length], dy: DY[n % DY.length] * size / 64,
          pad: `${Math.round(size * .14)}px ${Math.round(size * .14)}px ${Math.round(size * .12)}px`,
          minW: Math.round(size * .78), clip: CLIP[n % CLIP.length]
        };
      });
      return { letters, gap: Math.max(1, Math.round(size * .03)) };
    });
    return { words, wordGap: Math.round(size * .32), rowGap: Math.round(size * .14), padV: Math.round(size * .1) };
  }
  template(v) {
    return (
      <div style={css(`display:inline-flex;flex-wrap:wrap;align-items:center;row-gap:${v.rowGap}px;column-gap:${v.wordGap}px;padding:${v.padV}px 4px`)}>
        {(v.words || []).map((w, $index) => (<React.Fragment key={$index}>
          <div style={css(`display:inline-flex;align-items:center;gap:${w.gap}px`)}>
            {(w.letters || []).map((l, $index) => (<React.Fragment key={$index}>
              <span style={css(`display:inline-block;filter:drop-shadow(0 1px 1.5px rgba(19,15,31,.35));transform:rotate(${l.rot}deg) translateY(${l.dy}px)`)}>
                <span style={css(`display:inline-flex;align-items:center;justify-content:center;min-width:${l.minW}px;background:${l.bg};color:${l.fg};font-family:${l.ff};font-weight:${l.fw};font-style:${l.fs};font-size:${l.size}px;line-height:1;padding:${l.pad};clip-path:${l.clip}`)}>
                  {l.ch}
                </span>
              </span>
            </React.Fragment>))}
          </div>
        </React.Fragment>))}
      </div>
    );
  }
}
