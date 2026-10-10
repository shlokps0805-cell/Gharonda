import React from 'react';
import { DC, css } from './dc.js';
import Sticker from './Sticker.jsx';

export default class StickerPhysics extends DC {
  root = React.createRef();
  static KINDS = ['disco-violet', 'check-star', 'jelly-star', 'jelly-star-mini', 'sparkle', 'paint-star', 'clef', 'cd', 'headphone-cat', 'jellyfish', 'bow', 'tulips', 'lily', 'lavender', 'camera', 'books', 'iced-coffee', 'bunny', 'raindrop', 'dancers', 'jellyfish-blue', 'shell-turtle', 'patch-red', 'patch-baddie', 'camera-cat', 'dnd', 'piano', 'vinyl-purple', 'cookie-bear', 'star-glitter-edge', 'star-origami', 'star-balloon', 'star-embroidered', 'star-felt', 'star-glass', 'eight-ball', 'happy-birthday', 'core-memory', 'iconic', 'date-stamp'];
  constructor(p) {
    super(p);
    let s = 17; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const big = new Set(['happy-birthday', 'core-memory', 'dnd', 'patch-red', 'patch-baddie', 'dancers', 'piano', 'vinyl-purple', 'disco-violet']);
    const sf = p.floors === 'cover' ? .72 : 1;
    this.b = StickerPhysics.KINDS.map((k, i) => { const size = Math.round((big.has(k) ? 96 + Math.round(rnd() * 20) : 64 + Math.round(rnd() * 22)) * sf); return this.body(k, size, 80 + rnd() * 1280, -60 - i * 38 - rnd() * 80, (rnd() - .5) * 120, (rnd() - .5) * 30, (rnd() - .5) * 120); });
    const n = this.b.length;
    this.state = { n, z: this.b.map((_, i) => i + 1), sizes: this.b.map(b => b.size), stuck: this.b.map(() => false), rots: this.b.map(() => null), drag: -1, menu: null, gone: {}, dying: {} };
    this._refs = [];
  }
  body(k, size, x, y, vx, r, vr) { return { k, size, x, y, vx, vy: 0, r, vr, sleep: false, calm: 0, el: null }; }
  ref(i) { if (!this._refs[i]) this._refs[i] = el => { if (this.b[i]) this.b[i].el = el; }; return this._refs[i]; }
  floor(x) { return this.props.floors === 'cover' && x < 340 ? 784 : 900; }
  componentDidMount() {
    const root = this.root.current; if (!root) return;
    this._run = false;
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting && !this._run) { this._run = true; this._last = performance.now(); this._raf = requestAnimationFrame(this.tick); } }, { threshold: .25 });
    io.observe(root); this._io = io;
    this._mv = e => { const d = this.state.drag; if (d < 0) return; const [x, y] = this.pt(e); const b = this.b[d]; b.x = x - this._off[0]; b.y = y - this._off[1]; };
    this._up = () => { const d = this.state.drag; if (d < 0) return; const b = this.b[d]; b.vx = b.vy = b.vr = 0; this.setState(s => { const st = s.stuck.slice(); st[d] = true; return { drag: -1, stuck: st }; }); };
    this._key = e => { if (e.key === 'Escape') this.setState({ menu: null }); };
    this._wheel = e => { const i = this.b.findIndex(b => b.el && b.el.contains(e.target)); if (i < 0) return; if (!(e.shiftKey || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))) return; e.preventDefault(); const d = e.ctrlKey ? -e.deltaY * .6 : (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * .35; const b = this.b[i]; this.setArr('rots', i, (this.state.rots[i] ?? b.r) + d); };
    root.addEventListener('wheel', this._wheel, { passive: false });
    window.addEventListener('pointermove', this._mv); window.addEventListener('pointerup', this._up); window.addEventListener('keydown', this._key);
  }
  componentWillUnmount() { cancelAnimationFrame(this._raf); this._io && this._io.disconnect(); window.removeEventListener('pointermove', this._mv); window.removeEventListener('pointerup', this._up); window.removeEventListener('keydown', this._key); }
  pt(e) { const r = this.root.current.getBoundingClientRect(), k = r.width / this.root.current.offsetWidth; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; }
  fixed(i) { const S = this.state; return S.stuck[i] || S.drag === i || this.b[i].sleep || S.dying[i]; }
  tick = now => {
    const dt = Math.min(.033, (now - this._last) / 1000); this._last = now;
    const B = this.b, S = this.state, n = B.length, g = 2400;
    for (let i = 0; i < n; i++) { const b = B[i]; if (S.gone[i]) continue; b.size = S.sizes[i] ?? b.size; if (S.rots[i] != null) b.r = S.rots[i];
      if (this.fixed(i)) continue;
      b.vy += g * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt;
      const h = b.size / 2, fl = this.floor(b.x), sink = fl < 900 ? h : h * .8;
      if (b.y + sink >= fl) { b.y = fl - sink; if (b.vy > 120) { b.vy = -b.vy * .35; b.vr *= .5; } else { b.vy = 0; b.vr *= .7; } b.vx *= .82; }
      if (b.x < h * .6) { b.x = h * .6; b.vx = Math.abs(b.vx) * .5; } if (b.x > 1440 - h * .6) { b.x = 1440 - h * .6; b.vx = -Math.abs(b.vx) * .5; }
      const slow = Math.abs(b.vx) < 12 && Math.abs(b.vy) < 12 && Math.abs(b.vr) < 8;
      b.calm = slow ? b.calm + dt : 0; if (b.calm > .25) { b.sleep = true; b.vx = b.vy = b.vr = 0; } }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { if (S.gone[i] || S.gone[j]) continue; const fa = this.fixed(i), fc = this.fixed(j); if (fa && fc) continue;
      const a = B[i], c = B[j]; const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1, min = (a.size + c.size) * .3;
      if (d < min - .5) { const o = (min - d) / 2, nx = dx / d, ny = dy / d;
        if (!fa) { a.x -= nx * o * (fc ? 2 : 1); a.y -= ny * o * (fc ? 2 : 1); } if (!fc) { c.x += nx * o * (fa ? 2 : 1); c.y += ny * o * (fa ? 2 : 1); }
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny; if (rv < 0) { const im = rv * .4; if (!fa) { a.vx += im * nx; a.vy += im * ny; } if (!fc) { c.vx -= im * nx; c.vy -= im * ny; } } } }
    for (let i = 0; i < n; i++) { const b = B[i]; if (b.el) b.el.style.transform = `translate(${Math.round(b.x - b.size / 2)}px,${Math.round(b.y - b.size / 2)}px) rotate(${b.r.toFixed(1)}deg)`; }
    this._raf = requestAnimationFrame(this.tick);
  };
  setArr(key, i, v) { this.setState(s => { const a = s[key].slice(); a[i] = v; return { [key]: a }; }); }
  dup(i) { const o = this.b[i]; const nb = this.body(o.k, this.state.sizes[i], o.x + 24, o.y + 24, 0, o.r, 0); nb.sleep = true; this.b.push(nb);
    this.setState(s => ({ n: s.n + 1, z: [...s.z, Math.max(...s.z) + 1], sizes: [...s.sizes, s.sizes[i]], stuck: [...s.stuck, true], rots: [...s.rots, s.rots[i]] })); }
  drop(i) { const b = this.b[i]; b.sleep = false; b.calm = 0; b.vy = 0; this.setArr('stuck', i, false); this.setArr('rots', i, null); }
  del(i) { this.setState(s => ({ dying: { ...s.dying, [i]: true } })); setTimeout(() => this.setState(s => ({ gone: { ...s.gone, [i]: true } })), 440); }
  renderVals() {
    const S = this.state, m = S.menu;
    const items = this.b.map((b, i) => S.gone[i] ? null : ({ k: b.k, size: S.sizes[i], z: S.z[i], ref: this.ref(i), lift: S.drag === i, pin: S.stuck[i] && S.drag !== i ? 'pin' : 'none',
      dying: !!S.dying[i], peel: S.dying[i] ? 'perspective(500px) rotate3d(1,-1,0,62deg) translate(18px,-22px) scale(.82)' : 'none', op: S.dying[i] ? 0 : 1,
      turn: e => { e.stopPropagation(); e.preventDefault(); const r = b.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, a0 = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI, d0 = S.rots[i] ?? b.r; b.sleep = true; const mv = ev => { let d = d0 + Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI - a0; if (ev.shiftKey) d = Math.round(d / 15) * 15; this.setArr('rots', i, d); }; const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); },
      down: e => { if (e.button !== 0) return; e.stopPropagation(); const [x, y] = this.pt(e); this._off = [x - b.x, y - b.y]; b.sleep = false; this.setArr('z', i, Math.max(...S.z) + 1); this.setState({ drag: i, menu: null }); },
      ctx: e => { e.preventDefault(); e.stopPropagation(); const [x, y] = this.pt(e); this.setState({ menu: { i, x: Math.min(x + 8, 1440 - 252), y: Math.min(y + 8, 900 - 360) } }); } })).filter(Boolean);
    const row = (l, fn, dis, c) => ({ l, c: dis ? 'rgba(19,15,31,.35)' : (c || '#130F1F'), go: dis ? () => {} : () => { fn(); this.setState({ menu: null }); } });
    let menu = { open: false, rows: [], sizes: [], size: 0, rot: 0, slide: () => {}, spin: () => {} };
    if (m) { const i = m.i, sz = S.sizes[i], rot = Math.round(S.rots[i] ?? this.b[i].r);
      menu = { open: true, x: m.x, y: m.y, size: sz, rot: ((rot + 540) % 360) - 180,
        slide: e => this.setArr('sizes', i, +e.target.value), spin: e => this.setArr('rots', i, +e.target.value),
        rows: [row('Stick here', () => this.setArr('stuck', i, true), S.stuck[i]), row('Let it fall', () => this.drop(i), !S.stuck[i]), row('Duplicate', () => this.dup(i)), row('Bring to front', () => this.setArr('z', i, Math.max(...S.z) + 1)), row('Peel off (delete)', () => this.del(i), false, '#A63A48')],
        sizes: [['S', 76], ['M', 124], ['L', 200]].map(([l, v]) => ({ l, bg: Math.abs(sz - v) < 20 ? '#204670' : '#FFFFFF', fg: Math.abs(sz - v) < 20 ? '#FFFFFF' : '#204670', go: () => this.setArr('sizes', i, v) })) }; }
    return { root: this.root, items, menu, pe: 'none', noCtx: e => e.preventDefault(), bgDown: () => this.setState({ menu: null }), stop: e => e.stopPropagation() };
  }
  template(v) {
    return (
      <div ref={v.root} onContextMenu={v.noCtx} onPointerDown={v.bgDown} style={css(`position:absolute;inset:0;touch-action:none;user-select:none;pointer-events:${v.pe}`)}>
        {(v.items || []).map((s, $index) => (<React.Fragment key={$index}>
          <div ref={s.ref} onPointerDown={s.down} onContextMenu={s.ctx} style={css(`position:absolute;left:0;top:0;z-index:${s.z};cursor:grab;pointer-events:auto;will-change:transform;transform:translate(-400px,-400px);transform-style:preserve-3d`)}>
            <div style={css(`position:relative;transform-origin:15% 15%;transform:${s.peel};opacity:${s.op};transition:transform 420ms cubic-bezier(0.25,1,0.5,1),opacity 420ms ease-out`)}>
              <Sticker kind={s.k} size={s.size} lifted={s.lift} pinned={s.pin} movable={false} />
              <div onPointerDown={s.turn} title="drag to rotate" style={css("position:absolute;right:-10px;bottom:-10px;width:26px;height:26px;border-radius:50%;background:#FFFFFF;box-shadow:0 1px 3px rgba(19,15,31,.35),inset 0 0 0 1.5px #A57BD5;display:flex;align-items:center;justify-content:center;cursor:alias;opacity:0;transition:opacity 150ms")} data-style-hover="opacity:1">
                <div style={css("width:12px;height:12px;border:2px solid #5E3695;border-left-color:transparent;border-radius:50%;transform:rotate(-30deg)")} />
              </div>
              {s.dying ? (<>
                <div style={css("position:absolute;inset:0;pointer-events:none;transform:scaleX(-1) rotate(180deg);clip-path:polygon(0 0,62% 0,0 62%);filter:brightness(0) invert(1) drop-shadow(-2px -2px 3px rgba(19,15,31,.35))")}>
                  <Sticker kind={s.k} size={s.size} movable={false} />
                </div>
              </>) : null}
            </div>
          </div>
        </React.Fragment>))}
        {v.menu.open ? (<>
          <div onPointerDown={v.stop} style={css(`position:absolute;left:${v.menu.x}px;top:${v.menu.y}px;z-index:9999;width:236px;padding:8px 0;background:#FFFFFF;border-radius:8px;box-shadow:0 1px 2px rgba(19,15,31,.25),0 10px 24px rgba(19,15,31,.22);display:flex;flex-direction:column;pointer-events:auto`)}>
            {(v.menu.rows || []).map((r, $index) => (<React.Fragment key={$index}>
              <div onClick={r.go} style={css(`padding:9px 16px;font:700 13px/1 'Courier Prime',monospace;letter-spacing:.06em;color:${r.c};cursor:pointer`)} data-style-hover="text-decoration:underline;text-decoration-color:#C4A8E6;text-decoration-thickness:2px;text-underline-offset:5px">
                {r.l}
              </div>
            </React.Fragment>))}
            <div style={css("padding:8px 16px 4px;border-top:1px solid #ECE8F2;margin-top:4px;display:flex;align-items:center;gap:8px")}>
              <span style={css("width:44px;font:700 12px/1 'Courier Prime',monospace;color:#3D4A66")}>
                SIZE
              </span>
              {(v.menu.sizes || []).map((z, $index) => (<React.Fragment key={$index}>
                <div onClick={z.go} style={css(`width:32px;height:28px;border-radius:999px;border:1.5px solid #204670;background:${z.bg};color:${z.fg};display:flex;align-items:center;justify-content:center;font:700 12px/1 'Courier Prime',monospace;cursor:pointer`)}>
                  {z.l}
                </div>
              </React.Fragment>))}
            </div>
            <div style={css("padding:4px 16px 6px;display:flex;align-items:center;gap:10px")}>
              <span style={css("width:44px")} />
              <input type="range" min="40" max="320" value={v.menu.size} onChange={v.menu.slide} style={css("flex:1;min-width:0;accent-color:#5E3695")} />
              <span style={css("font:700 12px/1 'Courier Prime',monospace;color:#130F1F;min-width:32px;text-align:right")}>
                {v.menu.size}
              </span>
            </div>
            <div style={css("padding:4px 16px 10px;display:flex;align-items:center;gap:10px")}>
              <span style={css("width:44px;font:700 12px/1 'Courier Prime',monospace;color:#3D4A66")}>
                ANGLE
              </span>
              <input type="range" min="-180" max="180" value={v.menu.rot} onChange={v.menu.spin} style={css("flex:1;min-width:0;accent-color:#5E3695")} />
              <span style={css("font:700 12px/1 'Courier Prime',monospace;color:#130F1F;min-width:32px;text-align:right")}>
                {v.menu.rot}°
              </span>
            </div>
          </div>
        </>) : null}
      </div>
    );
  }
}
