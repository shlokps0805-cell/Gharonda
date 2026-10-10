// One layer of stickers for one page. Ported from the design's StickerPhysics
// (same tick loop, collision, sleep, menu and peel) and extended so that it:
//  - holds the page's fixed stickers as well as the physics pile
//  - saves every change under neha.v1.stickers.<pageId> and restores it
//  - only drops the pile when asked (first opening, reset, replay); otherwise
//    saved stickers load exactly where they were left, already at rest
//  - adds a resize handle, Safari trackpad rotate and the first-drag hint
import React from 'react';
import Sticker from '../design/Sticker.jsx';
import StickerMenu from './StickerMenu.jsx';
import { stickerInfo, pileStickers } from '../design/stickerSheet.js';
import * as storage from '../lib/storage.js';
import { css } from '../design/dc.js';

const VERSION = 1;
const GRAVITY = 2400;
const BIG = new Set(['happy-birthday', 'core-memory', 'dnd', 'patch-red', 'patch-baddie', 'dancers', 'piano', 'vinyl-purple', 'disco-violet']);
const clampSize = n => Math.max(40, Math.min(320, Math.round(n)));

export default class StickerLayer extends React.Component {
  root = React.createRef();
  els = {};
  state = { v: 0, menu: null, drag: null, resizing: null, hint: null };

  componentDidMount() {
    this.build(this.props.drop);
    this._key = e => { if (e.key === 'Escape' && this.state.menu) this.setState({ menu: null }); };
    this._mv = e => this.onMove(e);
    this._up = e => this.onUp(e);
    this._wheel = e => this.onWheel(e);
    this._gs = e => this.onGesture(e, true);
    this._gc = e => this.onGesture(e, false);
    window.addEventListener('keydown', this._key);
    window.addEventListener('pointermove', this._mv);
    window.addEventListener('pointerup', this._up);
    const root = this.root.current;
    root.addEventListener('wheel', this._wheel, { passive: false });
    // Safari trackpad two-finger rotate (feature-detected: only Safari fires these)
    root.addEventListener('gesturestart', this._gs);
    root.addEventListener('gesturechange', this._gc);
  }

  componentDidUpdate(prev) {
    if (prev.fixed !== this.props.fixed) this.syncFixed();
    if (prev.resetToken !== this.props.resetToken) {
      storage.remove(this.key());
      this.build(true);
    } else if (!prev.drop && this.props.drop && this.props.physics) {
      // replay: drop the pile again, keep stuck stickers where they are
      this.b.forEach(b => { if (b.pile && !b.stuck && !b.deleted) this.launch(b, this.b.indexOf(b)); });
      this.start();
    }
    if (prev.active !== this.props.active) this.props.active ? this.start() : this.stop();
  }

  componentWillUnmount() {
    this.stop();
    this.save();
    clearTimeout(this._saveT);
    clearTimeout(this._hintT);
    window.removeEventListener('keydown', this._key);
    window.removeEventListener('pointermove', this._mv);
    window.removeEventListener('pointerup', this._up);
    const root = this.root.current;
    if (root) {
      root.removeEventListener('wheel', this._wheel);
      root.removeEventListener('gesturestart', this._gs);
      root.removeEventListener('gesturechange', this._gc);
    }
  }

  key() { return 'stickers.' + this.props.pageId; }
  W() { return this.props.width || 1440; }
  H() { return this.props.height || 900; }

  // ---------- building the bodies ----------

  defaults() {
    const out = (this.props.fixed || []).map((f, i) => {
      const [ow, oh] = Sticker.box(f.sticker, f.size);
      return { id: `fixed-${i}-${f.sticker}`, k: f.sticker, size: f.size, x: f.x + ow / 2, y: f.y + oh / 2, r: f.angle || 0, stuck: true, pile: false };
    });
    if (this.props.physics) {
      let s = 17;
      const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
      const sf = this.props.pileScale || 1;
      pileStickers().forEach(st => {
        const size = Math.round((BIG.has(st.id) ? 96 + Math.round(rnd() * 20) : 64 + Math.round(rnd() * 22)) * sf);
        out.push({ id: `pile-${st.id}`, k: st.id, size, x: 0, y: 0, r: 0, stuck: false, pile: true, seed: [rnd(), rnd(), rnd(), rnd(), rnd()] });
      });
    }
    return out;
  }

  body(d) {
    return { vx: 0, vy: 0, vr: 0, sleep: false, calm: 0, deleted: false, dying: false, z: 1, ...d };
  }

  // start a pile sticker above the page so it falls in
  launch(b, i) {
    const [a, c, e, f, g] = b.seed || [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    b.x = 80 + a * (this.W() - 160);
    b.y = -60 - (i % 40) * 38 - c * 80;
    b.vx = (e - 0.5) * 120;
    b.vy = 0;
    b.r = (f - 0.5) * 30;
    b.vr = (g - 0.5) * 120;
    b.sleep = false;
    b.calm = 0;
  }

  build(drop) {
    const defs = this.defaults();
    const saved = this.props.persist === false ? null : storage.get(this.key(), null);
    const useSaved = saved && saved.version === VERSION && Array.isArray(saved.items) && !drop;
    const savedById = useSaved ? Object.fromEntries(saved.items.map(it => [it.id, it])) : {};
    const exists = k => !!stickerInfo(k);
    let bodies = [];
    defs.forEach((d, i) => {
      const sv = savedById[d.id];
      if (sv && exists(sv.k)) {
        // saved stickers come back exactly where they were, already at rest
        bodies.push(this.body({ ...d, x: sv.x, y: sv.y, size: sv.size, r: sv.r, stuck: !!sv.stuck, deleted: !!sv.deleted, z: sv.z || 1, sleep: true }));
      } else {
        const b = this.body(d);
        if (b.pile) this.launch(b, i);
        bodies.push(b);
      }
    });
    if (useSaved) {
      saved.items.filter(it => it.dup && exists(it.k)).forEach(it => bodies.push(this.body({ ...it, sleep: true })));
    }
    this.b = bodies;
    this.setState(s => ({ v: s.v + 1, menu: null }));
    if (this.props.instant) this.settleNow();
    this.start();
    if (!useSaved) this.queueSave();
  }

  // the page's fixed stickers changed (the cover's appear when the opening settles):
  // add any that are missing, from saved state when there is one
  syncFixed() {
    if (!this.b) return;
    const saved = this.props.persist === false ? null : storage.get(this.key(), null);
    const savedById = saved && Array.isArray(saved.items) ? Object.fromEntries(saved.items.map(it => [it.id, it])) : {};
    const have = new Set(this.b.map(b => b.id));
    this.defaults().filter(d => !d.pile && !have.has(d.id)).forEach(d => {
      const sv = savedById[d.id];
      this.b.push(this.body(sv ? { ...d, x: sv.x, y: sv.y, size: sv.size, r: sv.r, stuck: !!sv.stuck, deleted: !!sv.deleted, z: sv.z || 1, sleep: true } : d));
    });
    this.refresh();
  }

  // run the simulation without drawing until everything rests (reduced motion, phones)
  settleNow() {
    for (let i = 0; i < 2400 && this.anyMoving(); i++) this.step(1 / 60);
    this.paint();
  }

  // ---------- simulation (ported from StickerPhysics) ----------

  floor(x) {
    if (this.props.physics && this.props.floors === 'cover') return x < 340 ? 784 : 900;
    return this.props.floorY ?? this.H();
  }

  isFixed(b) {
    const d = this.state.drag;
    return b.stuck || b.sleep || b.dying || b.deleted || (d && d.b === b);
  }

  anyMoving() { return this.b && this.b.some(b => !this.isFixed(b)); }

  step(dt) {
    const B = this.b;
    const n = B.length;
    for (let i = 0; i < n; i++) {
      const b = B[i];
      if (this.isFixed(b)) continue;
      b.vy += GRAVITY * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt;
      const h = b.size / 2, fl = this.floor(b.x), sink = fl < this.H() ? h : h * 0.8;
      if (b.y + sink >= fl) {
        b.y = fl - sink;
        if (b.vy > 120) { b.vy = -b.vy * 0.35; b.vr *= 0.5; } else { b.vy = 0; b.vr *= 0.7; }
        b.vx *= 0.82;
      }
      if (b.x < h * 0.6) { b.x = h * 0.6; b.vx = Math.abs(b.vx) * 0.5; }
      if (b.x > this.W() - h * 0.6) { b.x = this.W() - h * 0.6; b.vx = -Math.abs(b.vx) * 0.5; }
      const slow = Math.abs(b.vx) < 12 && Math.abs(b.vy) < 12 && Math.abs(b.vr) < 8;
      b.calm = slow ? b.calm + dt : 0;
      if (b.calm > 0.25) { b.sleep = true; b.vx = b.vy = b.vr = 0; }
    }
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = B[i], c = B[j];
        if (a.deleted || c.deleted) continue;
        const fa = this.isFixed(a), fc = this.isFixed(c);
        if (fa && fc) continue;
        // stuck stickers never push physics ones around (they are flat on the paper)
        if ((a.stuck && !a.pile) || (c.stuck && !c.pile)) continue;
        const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1, min = (a.size + c.size) * 0.3;
        if (d < min - 0.5) {
          const o = (min - d) / 2, nx = dx / d, ny = dy / d;
          if (!fa) { a.x -= nx * o * (fc ? 2 : 1); a.y -= ny * o * (fc ? 2 : 1); }
          if (!fc) { c.x += nx * o * (fa ? 2 : 1); c.y += ny * o * (fa ? 2 : 1); }
          const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
          if (rv < 0) {
            const im = rv * 0.4;
            if (!fa) { a.vx += im * nx; a.vy += im * ny; }
            if (!fc) { c.vx -= im * nx; c.vy -= im * ny; }
          }
        }
      }
    }
  }

  transformOf(b) {
    const [ow, oh] = Sticker.box(b.k, b.size);
    return `translate(${Math.round(b.x - ow / 2)}px,${Math.round(b.y - oh / 2)}px) rotate(${b.r.toFixed(1)}deg)`;
  }

  paint() {
    this.b.forEach(b => {
      const el = this.els[b.id];
      if (el) el.style.transform = this.transformOf(b);
    });
  }

  tick = now => {
    const dt = Math.min(0.033, (now - this._last) / 1000);
    this._last = now;
    this.step(dt);
    this.paint();
    if (this.anyMoving()) this._raf = requestAnimationFrame(this.tick);
    else { this._raf = null; this.queueSave(); }
  };

  start() {
    if (this._raf || !this.b || this.props.active === false || !this.anyMoving()) return;
    this._last = performance.now();
    this._raf = requestAnimationFrame(this.tick);
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  // ---------- saving ----------

  queueSave() {
    clearTimeout(this._saveT);
    this._saveT = setTimeout(() => this.save(), 300);
  }

  save() {
    if (!this.b || this.props.persist === false) return;
    const items = this.b.map(b => ({
      id: b.id, k: b.k, x: Math.round(b.x), y: Math.round(b.y), size: b.size, r: Math.round(b.r * 10) / 10,
      stuck: b.stuck, deleted: b.deleted, z: b.z, ...(b.dup ? { dup: true } : {}),
    }));
    storage.set(this.key(), { version: VERSION, items });
  }

  refresh() { this.setState(s => ({ v: s.v + 1 })); this.queueSave(); }

  // ---------- pointer interaction ----------

  pt(e) {
    const el = this.root.current;
    const r = el.getBoundingClientRect(), k = r.width / el.offsetWidth || 1;
    return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
  }

  top() { return Math.max(1, ...this.b.map(b => b.z)) + 1; }

  down(e, b) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    const [x, y] = this.pt(e);
    b.sleep = false;
    b.z = this.top();
    this.setState({ drag: { b, off: [x - b.x, y - b.y], moved: false }, menu: null });
  }

  onMove(e) {
    const d = this.state.drag;
    if (d) {
      const [x, y] = this.pt(e);
      d.b.x = x - d.off[0];
      d.b.y = y - d.off[1];
      d.moved = true;
      const el = this.els[d.b.id];
      if (el) el.style.transform = this.transformOf(d.b);
      return;
    }
    const rz = this.state.resizing;
    if (rz) {
      const [x, y] = this.pt(e);
      const dist = Math.hypot(x - rz.b.x, y - rz.b.y);
      rz.b.size = clampSize(rz.size0 * (dist / rz.d0));
      this.setState({ v: this.state.v + 1 });
    }
  }

  onUp() {
    const d = this.state.drag;
    if (d) {
      // a dragged sticker sticks exactly where it is dropped (no throwing)
      d.b.vx = d.b.vy = d.b.vr = 0;
      d.b.stuck = true;
      this.setState({ drag: null });
      if (d.moved) this.firstDragHint(d.b);
      this.refresh();
    }
    if (this.state.resizing) {
      this.setState({ resizing: null });
      this.refresh();
    }
  }

  firstDragHint(b) {
    if (storage.get('stickerHintSeen', false) || !this.props.ui) return;
    storage.set('stickerHintSeen', true);
    this.setState({ hint: { x: Math.min(b.x + b.size / 2 + 10, this.W() - 260), y: Math.max(10, b.y - 60) } });
    this._hintT = setTimeout(() => this.setState({ hint: null }), 5000);
  }

  turn(e, b) {
    e.stopPropagation();
    e.preventDefault();
    const el = this.els[b.id];
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a0 = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI, d0 = b.r;
    b.sleep = true;
    const mv = ev => {
      let d = d0 + Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI - a0;
      if (ev.shiftKey) d = Math.round(d / 15) * 15;
      b.r = d;
      el.style.transform = this.transformOf(b);
    };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); this.refresh(); };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  }

  resize(e, b) {
    e.stopPropagation();
    e.preventDefault();
    const [x, y] = this.pt(e);
    b.sleep = true;
    this.setState({ resizing: { b, size0: b.size, d0: Math.max(10, Math.hypot(x - b.x, y - b.y)) }, menu: null });
  }

  hovered(target) {
    return this.b.find(b => !b.deleted && this.els[b.id] && this.els[b.id].contains(target));
  }

  onWheel(e) {
    const b = this.hovered(e.target);
    if (!b) return;
    if (!(e.shiftKey || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))) return;
    e.preventDefault();
    const d = e.ctrlKey ? -e.deltaY * 0.6 : (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.35;
    b.r += d;
    b.sleep = true;
    const el = this.els[b.id];
    if (el) el.style.transform = this.transformOf(b);
    this.queueSave();
  }

  onGesture(e, startNow) {
    const b = startNow ? this.hovered(e.target) : this._gb;
    if (!b) return;
    e.preventDefault();
    if (startNow) { this._gb = b; this._g0 = b.r; return; }
    b.r = this._g0 + e.rotation;
    const el = this.els[b.id];
    if (el) el.style.transform = this.transformOf(b);
    this.queueSave();
  }

  // ---------- menu actions ----------

  openMenu(e, b) {
    e.preventDefault();
    e.stopPropagation();
    const [x, y] = this.pt(e);
    this.setState({ menu: { b, x: Math.min(x + 8, this.W() - 252), y: Math.min(y + 8, this.H() - 300) } });
  }

  act = (what, value) => {
    const m = this.state.menu;
    if (!m) return;
    const b = m.b;
    if (what === 'stick') { b.stuck = true; b.sleep = true; }
    if (what === 'fall') { b.stuck = false; b.sleep = false; b.calm = 0; b.vy = 0; this.start(); }
    if (what === 'dup') {
      const nb = this.body({ id: `dup-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`, k: b.k, size: b.size, x: b.x + 24, y: b.y + 24, r: b.r, stuck: true, sleep: true, pile: false, dup: true, z: this.top() });
      this.b.push(nb);
    }
    if (what === 'front') b.z = this.top();
    if (what === 'size') { b.size = clampSize(value); b.sleep = true; }
    if (what === 'angle') { b.r = value; b.sleep = true; }
    if (what === 'peel') {
      b.dying = true;
      setTimeout(() => { b.deleted = true; b.dying = false; this.refresh(); }, 440);
    }
    const keepOpen = what === 'size' || what === 'angle';
    this.setState(s => ({ v: s.v + 1, menu: keepOpen ? s.menu : null }));
    this.queueSave();
  };

  // ---------- render ----------

  render() {
    const { menu, drag, resizing, hint } = this.state;
    const ui = this.props.ui || {};
    const items = (this.b || []).filter(b => !b.deleted);
    return (
      <div
        ref={this.root}
        data-sticker-layer={this.props.pageId}
        onPointerDown={() => menu && this.setState({ menu: null })}
        style={{ position: 'absolute', left: 0, top: 0, width: this.W(), height: this.H(), pointerEvents: 'none', userSelect: 'none', zIndex: this.props.z ?? 30 }}
      >
        {items.map(b => {
          const lifted = drag && drag.b === b;
          const sizing = resizing && resizing.b === b;
          return (
            <div
              key={b.id}
              ref={el => { if (el) this.els[b.id] = el; else delete this.els[b.id]; }}
              className="nh-sticker-wrap"
              data-sticker-id={b.id}
              onPointerDown={e => this.down(e, b)}
              onContextMenu={e => this.openMenu(e, b)}
              style={{ position: 'absolute', left: 0, top: 0, zIndex: b.z, cursor: lifted ? 'grabbing' : 'grab', pointerEvents: 'auto', touchAction: 'none', willChange: 'transform', transform: this.transformOf(b), transformStyle: 'preserve-3d' }}
            >
              <div style={{ position: 'relative', transformOrigin: '15% 15%', transform: b.dying ? 'perspective(500px) rotate3d(1,-1,0,62deg) translate(18px,-22px) scale(.82)' : 'none', opacity: b.dying ? 0 : 1, transition: 'transform 420ms cubic-bezier(0.25,1,0.5,1),opacity 420ms ease-out' }}>
                <Sticker kind={b.k} size={b.size} lifted={lifted} pinned={b.stuck && !lifted ? 'pin' : 'none'} movable={false} />
                {/* turn handle (design) */}
                <div className="nh-show-on-hover" onPointerDown={e => this.turn(e, b)} title={ui.turnTitle} style={css('position:absolute;right:-10px;bottom:-10px;width:26px;height:26px;border-radius:50%;background:#FFFFFF;box-shadow:0 1px 3px rgba(19,15,31,.35),inset 0 0 0 1.5px #A57BD5;display:flex;align-items:center;justify-content:center;cursor:alias;touch-action:none;z-index:5')}>
                  <div style={css('width:12px;height:12px;border:2px solid #5E3695;border-left-color:transparent;border-radius:50%;transform:rotate(-30deg)')} />
                  <div style={css('position:absolute;left:5px;top:6px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:5px solid #5E3695;transform:rotate(-70deg)')} />
                </div>
                {/* resize handle (design: Cover "stuck and resized" frame) */}
                <div className="nh-show-on-hover" onPointerDown={e => this.resize(e, b)} title="drag to resize" style={{ ...css('position:absolute;right:-12px;top:-12px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 34% 30%,#FFFFFF 0 10%,#C4A8E6 45%,#9277BF);box-shadow:0 1px 3px rgba(19,15,31,.4);cursor:nesw-resize;touch-action:none;z-index:5'), opacity: sizing ? 1 : undefined }} />
                {sizing ? (
                  <>
                    <div style={css('position:absolute;inset:-8px;border:1.5px dashed #DCCBF3;border-radius:10px;pointer-events:none')} />
                    <div style={css("position:absolute;right:-70px;bottom:-30px;font:700 12px/1 'Courier Prime',monospace;color:#FFFFFF;background:#5E3695;padding:5px 8px;border-radius:999px;white-space:nowrap;pointer-events:none")}>{b.size} PX</div>
                  </>
                ) : null}
                {b.dying ? (
                  <div style={css('position:absolute;inset:0;pointer-events:none;transform:scaleX(-1) rotate(180deg);clip-path:polygon(0 0,62% 0,0 62%);filter:brightness(0) invert(1) drop-shadow(-2px -2px 3px rgba(19,15,31,.35))')}>
                    <Sticker kind={b.k} size={b.size} movable={false} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {menu ? (
          <StickerMenu
            ui={ui}
            x={menu.x}
            y={menu.y}
            size={menu.b.size}
            angle={Math.round(menu.b.r)}
            stuck={menu.b.stuck}
            onAct={this.act}
          />
        ) : null}
        {hint ? (
          <div style={{ ...css("position:absolute;width:240px;transform:rotate(2deg);padding:20px 16px 14px;background:#FFFFFF;box-shadow:0 1px 2px rgba(19,15,31,.3),0 8px 14px rgba(19,15,31,.18);font:600 21px/1.1 'Caveat',cursive;color:#204670;z-index:9998;pointer-events:none;animation:nh-fade-in 300ms ease-out"), left: hint.x, top: hint.y }}>
            {ui.hint}
          </div>
        ) : null}
      </div>
    );
  }
}
