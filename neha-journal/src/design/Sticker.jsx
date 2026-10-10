import React from 'react';
import { DC, css } from './dc.js';
import { stickerInfo, measureSticker } from './stickerSheet.js';


export default class Sticker extends DC {
  state = { h: false, dx: 0, dy: 0, drag: false, moved: false, dr: 0, turning: false };
  rootRef = React.createRef();
  componentDidMount() {
    const el = this.rootRef.current; if (!el) return;
    this._wheel = e => { if (!this.movable() || !(e.shiftKey || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))) return; e.preventDefault(); e.stopPropagation(); const d = e.ctrlKey ? -e.deltaY * .6 : (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * .35; this.setState(st => ({ dr: st.dr + d })); };
    this._gs = e => { if (!this.movable()) return; e.preventDefault(); this._g0 = this.state.dr; };
    this._gc = e => { if (!this.movable()) return; e.preventDefault(); this.setState({ dr: (this._g0 || 0) + e.rotation }); };
    el.addEventListener('wheel', this._wheel, { passive: false }); el.addEventListener('gesturestart', this._gs); el.addEventListener('gesturechange', this._gc);
  }
  componentWillUnmount() { this._end && this._end(); const el = this.rootRef.current; if (el) { el.removeEventListener('wheel', this._wheel); el.removeEventListener('gesturestart', this._gs); el.removeEventListener('gesturechange', this._gc); } }
  turn = e => {
    if (e.button !== 0) return; e.stopPropagation(); e.preventDefault();
    const r = this.rootRef.current.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a0 = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI, d0 = this.state.dr;
    const mv = ev => { const a = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI; let d = d0 + a - a0; if (ev.shiftKey) d = Math.round(d / 15) * 15; this.setState({ dr: d, turning: true }); };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); this.setState({ turning: false }); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  grab = e => {
    if (!this.movable() || e.button !== 0) return; e.stopPropagation(); e.preventDefault();
    const host = e.currentTarget, r0 = host.getBoundingClientRect(), k = r0.width / (host.offsetWidth || 1) || 1;
    const sx = e.clientX, sy = e.clientY, ox = this.state.dx, oy = this.state.dy;
    const mv = ev => this.setState({ dx: ox + (ev.clientX - sx) / k, dy: oy + (ev.clientY - sy) / k, drag: true, moved: true });
    const up = () => { this._end(); this.setState({ drag: false }); };
    this._end = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); this._end = null; };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  // In the app, StickerLayer does the dragging, so a Sticker on its own stays put.
  movable() { return this.props.movable ?? false; }
  // outer box (width, height) of a sticker drawn at `size`
  static box(kind, size) {
    const info = stickerInfo(kind);
    const dims = info && info.file ? [info.w || 100, info.h || 100] : (Sticker.CSS[kind] || Sticker.CSS['eight-ball']);
    const sc = size / Math.max(dims[0], dims[1]);
    return [Math.round(dims[0] * sc), Math.round(dims[1] * sc)];
  }
  static CSS = { 'eight-ball':[120,120], 'happy-birthday':[220,72], 'birthday-girl':[200,104], 'iconic':[140,140], 'core-memory':[210,84], 'main-character':[214,76], 'date-1110':[130,130], 'made-with-love':[236,80], 'neha':[220,100], 'vellum-stars':[130,130], 'lace':[230,64], 'date-stamp':[150,104], 'moon-phases':[236,64], 'fav-heart':[124,112], 'sparkles':[130,130], 'collage-dreamy':[150,164], 'collage-us':[150,164], 'collage-bloom':[150,164], 'collage-disco':[150,164], 'washi-stripes':[220,40], 'washi-gingham':[220,40], 'washi-stars':[220,40], 'washi-lavender':[220,40], 'washi-dusty':[220,40], 'ticket-stub':[210,84], 'postage-stamp':[100,124], 'label-tag':[196,72], 'torn-lined':[196,132], 'object-1':[120,120], 'object-2':[120,120], 'object-3':[120,120], 'object-4':[120,120], 'object-5':[120,120], 'object-6':[120,120] };
  static HOLO = new Set(['iconic', 'jelly-star', 'jelly-star-mini', 'cd', 'sparkle', 'neha', 'vellum-stars', 'fav-heart']);
  static PAPER = new Set(['washi-stripes', 'washi-gingham', 'washi-stars', 'washi-lavender', 'washi-dusty', 'ticket-stub', 'postage-stamp', 'label-tag', 'torn-lined']);
  static CLEAR = new Set(['vellum-stars', 'lace', 'date-stamp', 'moon-phases', 'fav-heart', 'sparkles']);
  static GCLIP = { 'fav-heart':'polygon(50% 96%,6% 52%,4% 28%,15% 8%,34% 4%,50% 18%,66% 4%,85% 8%,96% 28%,94% 52%)', 'lace':'inset(10px 0)', 'date-stamp':'inset(10px round 10px)', 'eight-ball':'circle(50% at 50% 50%)', 'date-1110':'circle(50% at 50% 50%)', 'iconic':'circle(50% at 50% 50%)', 'happy-birthday':'inset(6px 26px)', 'neha':'inset(0 round 999px)', 'birthday-girl':'ellipse(50% 50% at 50% 50%)', 'moon-phases':'inset(0 round 999px)', 'vellum-stars':'circle(50% at 50% 50%)', 'sparkles':'inset(0 round 28px)' };
  renderVals() {
    const S = Sticker;
    const kind = this.props.kind ?? 'eight-ball';
    // image stickers come from the sticker sheet (content/stickers.json)
    const info = stickerInfo(kind);
    const isImg = !!(info && info.file);
    if (isImg && !(info.w && info.h)) measureSticker(kind, () => this.forceUpdate());
    const dims = isImg ? [info.w || 100, info.h || 100] : (S.CSS[kind] || S.CSS['eight-ball']);
    const size = Number(this.props.size ?? 120);
    const sc = size / Math.max(dims[0], dims[1]);
    const ow = Math.round(dims[0] * sc), oh = Math.round(dims[1] * sc);
    const w = isImg ? ow : dims[0], h = isImg ? oh : dims[1];
    const s = isImg ? 1 : sc;
    const hov = this.state.h || !!this.props.hover;
    const lifted = !!this.props.lifted || this.state.drag;
    const stuck = this.props.pinned === 'pin' || this.props.pinned === 'tape';
    const lift = lifted ? -10 : hov ? -2 : 0;
    const rot = Number(this.props.rotate ?? 0) + this.state.dr;
    const paper = S.PAPER.has(kind);
    const shBase = paper ? 'drop-shadow(0 1px 1.5px rgba(19,15,31,.28))' : 'drop-shadow(0 2px 4px rgba(19,15,31,.3))';
    const k = n => kind === n;
    const is = {};
    Object.keys(S.CSS).forEach(n => { is[n.replace(/-(\w)/g, (m, c) => c.toUpperCase()).replace(/^(\d)/, 'n$1')] = k(n); });
    return {
      kind, isImg, isCss: !isImg, src: isImg ? `/media/${info.file}` : '', ow, oh, w, h, ml: -w / 2, mt: -h / 2,
      tf: `rotate(${rot}deg) translateY(${lift}px) scale(${s * (lifted ? 1.06 : 1)})`,
      sh: lifted ? 'drop-shadow(0 12px 14px rgba(19,15,31,.4))' : hov ? 'drop-shadow(0 5px 7px rgba(19,15,31,.34))' : stuck ? 'drop-shadow(0 1px 1px rgba(19,15,31,.34))' : shBase,
      cut: paper || S.CLEAR.has(kind) ? 'none' : 'drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(2px 2px 0 #fff) drop-shadow(-2px -2px 0 #fff)',
      gclip: S.GCLIP[kind] || (paper ? 'inset(6px)' : 'inset(0 round 18px)'),
      holo: S.HOLO.has(kind) || !!this.props.holo,
      holoPos: hov ? '100% 50%' : '0% 50%',
      gx: hov ? '190%' : '-120%', gt: hov ? 'transform 420ms cubic-bezier(0.25,1,0.5,1)' : 'none',
      pin: false, tape: false,
      pinS: 16 / s, pinM: -8 / s, tapeW: Math.min(64, ow * .7) / s, tapeH: 18 / s, tapeM: -Math.min(64, ow * .7) / 2 / s,
      rootRef: this.rootRef, turn: this.turn, showTurn: this.movable() && (this.state.h || this.state.turning), grab: this.grab, mv: this.state.moved ? `translate(${this.state.dx}px,${this.state.dy}px)` : 'none', cur: this.movable() ? (this.state.drag ? 'grabbing' : 'grab') : 'default', ta: this.movable() ? 'none' : 'auto', mz: this.state.moved ? 60 : 'auto',
      enter: () => this.setState({ h: true }), leave: () => this.setState({ h: false }),
      is, isObj: /^object-\d$/.test(kind), objN: kind.slice(-1)
    };
  }
  template(v) {
    return (
      <div ref={v.rootRef} data-sticker={v.kind} onPointerDown={v.grab} style={css(`position:relative;flex:none;width:${v.ow}px;height:${v.oh}px;transform:${v.mv};cursor:${v.cur};touch-action:${v.ta};z-index:${v.mz}`)} onMouseEnter={v.enter} onMouseLeave={v.leave}>
        <div style={css(`position:absolute;left:50%;top:50%;width:${v.w}px;height:${v.h}px;margin-left:${v.ml}px;margin-top:${v.mt}px;transform:${v.tf};transform-origin:50% 50%;filter:${v.sh};transition:transform 180ms cubic-bezier(0.34,1.56,0.64,1),filter 180ms ease-out`)}>
          {v.isImg ? (<>
            <img src={v.src} alt="" draggable="false" style={css("position:absolute;inset:0;width:100%;height:100%;display:block;user-select:none")} />
            {v.holo ? (<>
              <div style={css(`position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;opacity:.75;background:linear-gradient(125deg,#9FC3F0 0%,#E4D2FF 22%,#B2B2E5 40%,#CFF1FF 58%,#D0B0F5 76%,#9FC3F0 100%) ${v.holoPos}/240% 240%;transition:background-position 420ms cubic-bezier(0.25,1,0.5,1);mask:url(${v.src}) 0 0/100% 100%;-webkit-mask:url(${v.src}) 0 0/100% 100%`)} />
            </>) : null}
            <div style={css(`position:absolute;inset:0;pointer-events:none;overflow:hidden;mask:url(${v.src}) 0 0/100% 100%;-webkit-mask:url(${v.src}) 0 0/100% 100%`)}>
              <div style={css(`position:absolute;top:-20%;bottom:-20%;left:0;width:60%;background:linear-gradient(105deg,rgba(255,255,255,0) 20%,rgba(255,255,255,.6) 47%,rgba(255,255,255,.12) 56%,rgba(255,255,255,0) 72%);transform:translateX(${v.gx}) skewX(-12deg);transition:${v.gt}`)} />
            </div>
          </>) : null}
          {v.isCss ? (<>
            <div style={css(`position:absolute;inset:0;filter:${v.cut}`)}>
              {v.is.eightBall ? (<>
                <div style={css("position:absolute;left:10px;top:10px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle at 34% 28%,#5A5466 0,#1C1828 45%,#0A0812 100%)")} />
                <div style={css("position:absolute;left:39px;top:26px;width:42px;height:42px;border-radius:50%;background:#FFFFFF;display:flex;align-items:center;justify-content:center;font:700 28px/1 'DM Sans',sans-serif;color:#130F1F")}>
                  8
                </div>
                <div style={css("position:absolute;left:24px;top:24px;width:16px;height:8px;border-radius:50%;background:rgba(255,255,255,.5);transform:rotate(-35deg)")} />
              </>) : null}
              {v.is.happyBirthday ? (<>
                <div style={css("position:absolute;left:2px;top:24px;width:52px;height:40px;background:linear-gradient(180deg,#6A43A0,#4A2880);clip-path:polygon(0 0,100% 0,100% 100%,0 100%,26% 50%)")} />
                <div style={css("position:absolute;right:2px;top:24px;width:52px;height:40px;background:linear-gradient(180deg,#6A43A0,#4A2880);clip-path:polygon(0 0,100% 0,74% 50%,100% 100%,0 100%)")} />
                <div style={css("position:absolute;left:32px;top:56px;width:16px;height:10px;background:#320F6F;clip-path:polygon(0 0,100% 0,100% 100%)")} />
                <div style={css("position:absolute;right:32px;top:56px;width:16px;height:10px;background:#320F6F;clip-path:polygon(0 0,100% 0,0 100%)")} />
                <div style={css("position:absolute;left:32px;right:32px;top:6px;height:50px;background:linear-gradient(180deg,#B99BE2 0%,#8E68C2 40%,#6E47A6 100%);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.4),inset 0 -2px 3px rgba(50,15,111,.35);display:flex;align-items:center;justify-content:center")}>
                  <div style={css("position:absolute;left:6px;right:6px;top:5px;bottom:5px;border-top:1.5px dashed rgba(255,255,255,.55);border-bottom:1.5px dashed rgba(255,255,255,.55)")} />
                  <span style={css("position:relative;font:italic 400 17px/1 'Libre Caslon Text',serif;color:#FFFFFF;white-space:nowrap;letter-spacing:.01em;text-shadow:0 1px 1px rgba(50,15,111,.4)")}>
                    happy birthday
                  </span>
                </div>
              </>) : null}
              {v.is.birthdayGirl ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:50%;background:radial-gradient(ellipse at 40% 30%,#E4D6F6,#C4A8E6 60%,#B092DA);box-shadow:inset 0 2px 0 rgba(255,255,255,.4),inset 0 -2px 4px rgba(50,15,111,.2)")} />
                <div style={css("position:absolute;inset:11px;border-radius:50%;border:1.5px dashed rgba(255,255,255,.85)")} />
                <div style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:400 40px/1 'Pinyon Script',cursive;color:#320F6F;padding-top:4px;white-space:nowrap")}>
                  birthday girl
                </div>
              </>) : null}
              {v.is.iconic ? (<>
                <div style={css("position:absolute;inset:4px;background:conic-gradient(from 20deg,#DCCBF3,#B2B2E5,#CFE6FF,#E4D2FF,#C4A8E6,#F2E8FF,#DCCBF3);clip-path:polygon(50.0% 0.0%,59.1% 10.0%,71.7% 5.0%,75.6% 17.9%,89.1% 18.8%,86.9% 32.2%,98.7% 38.9%,91.0% 50.0%,98.7% 61.1%,86.9% 67.8%,89.1% 81.2%,75.6% 82.1%,71.7% 95.0%,59.1% 90.0%,50.0% 100.0%,40.9% 90.0%,28.3% 95.0%,24.4% 82.1%,10.9% 81.2%,13.1% 67.8%,1.3% 61.1%,9.0% 50.0%,1.3% 38.9%,13.1% 32.2%,10.9% 18.8%,24.4% 17.9%,28.3% 5.0%,40.9% 10.0%)")} />
                <div style={css("position:absolute;inset:22px;border-radius:50%;background:radial-gradient(circle at 40% 32%,#FFFFFF,#F6F1FC 70%,#ECE3F8);box-shadow:inset 0 0 0 2px #A57BD5,inset 0 0 0 5px #FFFFFF,inset 0 0 0 6px #C4A8E6")} />
                <div style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-top:6px")}>
                  <span style={css("font:400 44px/1 'Pinyon Script',cursive;color:#5E3695;transform:rotate(-6deg)")}>
                    iconic
                  </span>
                </div>
                <div style={css("position:absolute;left:92px;top:26px;width:16px;height:16px;background:#FFFFFF;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;left:30px;top:92px;width:12px;height:12px;background:#FFFFFF;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;left:100px;top:92px;width:8px;height:8px;background:#A57BD5;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
              </>) : null}
              {v.is.coreMemory ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:6px;background:linear-gradient(180deg,#D6E0EA,#BCCDDE);mask:radial-gradient(circle 10px at 0 50%,transparent 96%,#000 100%) left/51% 100% no-repeat,radial-gradient(circle 10px at 100% 50%,transparent 96%,#000 100%) right/51% 100% no-repeat;-webkit-mask:radial-gradient(circle 10px at 0 50%,transparent 96%,#000 100%) left/51% 100% no-repeat,radial-gradient(circle 10px at 100% 50%,transparent 96%,#000 100%) right/51% 100% no-repeat;display:flex")}>
                  <div style={css("flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px;padding-left:24px")}>
                    <div style={css("font:700 10px/1 'Courier Prime',monospace;letter-spacing:.2em;color:#204670")}>
                      ADMIT ONE
                    </div>
                    <div style={css("font:italic 400 26px/1 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap")}>
                      core memory
                    </div>
                  </div>
                  <div style={css("width:48px;border-left:2px dashed rgba(32,70,112,.45);display:flex;align-items:center;justify-content:center")}>
                    <span style={css("writing-mode:vertical-rl;font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670")}>
                      No.1110
                    </span>
                  </div>
                </div>
              </>) : null}
              {v.is.mainCharacter ? (<>
                <div style={css("position:absolute;inset:4px;background:linear-gradient(180deg,#C8402F,#BA2F1F 60%,#9E2617);clip-path:polygon(14% 0,100% 0,100% 100%,14% 100%,0 50%);box-shadow:inset 0 1px 0 rgba(255,255,255,.2)")} />
                <div style={css("position:absolute;left:20px;top:31px;width:14px;height:14px;border-radius:50%;background:#FFFFFF;box-shadow:inset 0 1px 2px rgba(0,0,0,.3)")} />
                <div style={css("position:absolute;left:46px;right:14px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:4px")}>
                  <div style={css("font:700 15px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#FFFFFF")}>
                    MAIN
                  </div>
                  <div style={css("font:700 15px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#FFFFFF;white-space:nowrap")}>
                    CHARACTER
                  </div>
                </div>
              </>) : null}
              {v.is.date1110 ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:50%;background:radial-gradient(circle at 38% 30%,#2E5A8C,#204670 55%,#16324F);box-shadow:inset 0 2px 0 rgba(255,255,255,.2)")} />
                <div style={css("position:absolute;inset:12px;border-radius:50%;border:1.5px solid rgba(247,241,230,.7)")} />
                <div style={css("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px")}>
                  <div style={css("font:700 9px/1 'Courier Prime',monospace;letter-spacing:.24em;color:#C4A8E6")}>
                    BIRTHDAY
                  </div>
                  <div style={css("font:400 37px/1 'Libre Caslon Text',serif;color:#F7F1E6")}>
                    11.10
                  </div>
                  <div style={css("font:700 9px/1 'Courier Prime',monospace;letter-spacing:.24em;color:#C4A8E6")}>
                    2026
                  </div>
                </div>
              </>) : null}
              {v.is.madeWithLove ? (<>
                <div style={css("position:absolute;left:4px;right:4px;top:12px;bottom:12px;background:linear-gradient(180deg,#E3C3C8,#CA9AA1 60%,#B9868E);clip-path:polygon(0 0,100% 0,93% 50%,100% 100%,0 100%,7% 50%);box-shadow:inset 0 2px 0 rgba(255,255,255,.35)")} />
                <div style={css("position:absolute;left:22px;right:22px;top:16px;height:1px;background:rgba(255,255,255,.55)")} />
                <div style={css("position:absolute;left:22px;right:22px;bottom:16px;height:1px;background:rgba(122,31,43,.25)")} />
                <div style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:600 31px/1 'Caveat',cursive;color:#6A1A26;white-space:nowrap")}>
                  made with love
                </div>
              </>) : null}
              {v.is.neha ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:999px;background:linear-gradient(180deg,#FFFFFF,#F2EEF8);box-shadow:inset 0 0 0 1.5px #C4A8E6")} />
                <div style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:400 64px/1 'Pinyon Script',cursive;color:#204670;padding:6px 0 0 4px")}>
                  Neha
                </div>
                <div style={css("position:absolute;right:30px;top:18px;width:16px;height:16px;background:#A57BD5;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;right:20px;top:36px;width:8px;height:8px;background:#C4A8E6;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
              </>) : null}
              {v.is.vellumStars ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.62),rgba(236,232,246,.42) 60%,rgba(220,214,238,.38));box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.9)")} />
                <div style={css("position:absolute;left:26px;top:30px;width:56px;height:56px;background:rgba(255,255,255,.95);clip-path:polygon(50.0% 0.0%,67.6% 25.7%,97.6% 34.5%,78.5% 59.3%,79.4% 90.5%,50.0% 80.0%,20.6% 90.5%,21.5% 59.3%,2.4% 34.5%,32.4% 25.7%)")} />
                <div style={css("position:absolute;left:31px;top:36px;width:46px;height:46px;background:rgba(196,168,230,.55);clip-path:polygon(50.0% 0.0%,67.6% 25.7%,97.6% 34.5%,78.5% 59.3%,79.4% 90.5%,50.0% 80.0%,20.6% 90.5%,21.5% 59.3%,2.4% 34.5%,32.4% 25.7%)")} />
                <div style={css("position:absolute;left:78px;top:24px;width:28px;height:28px;background:rgba(255,255,255,.95);clip-path:polygon(50.0% 0.0%,67.6% 25.7%,97.6% 34.5%,78.5% 59.3%,79.4% 90.5%,50.0% 80.0%,20.6% 90.5%,21.5% 59.3%,2.4% 34.5%,32.4% 25.7%)")} />
                <div style={css("position:absolute;left:74px;top:76px;width:22px;height:22px;background:rgba(255,255,255,.95);clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
              </>) : null}
              {v.is.lace ? (<>
                <div style={css("position:absolute;left:4px;right:4px;top:4px;bottom:4px;background:radial-gradient(circle at 50% 100%,rgba(236,228,248,.95) 9px,transparent 9.5px) 0 100%/20px 12px repeat-x,radial-gradient(circle at 50% 0,rgba(236,228,248,.95) 9px,transparent 9.5px) 0 0/20px 12px repeat-x")} />
                <div style={css("position:absolute;left:4px;right:4px;top:12px;bottom:12px;background:radial-gradient(circle 3px at 10px 10px,transparent 96%,rgba(236,228,248,.92) 100%) 0 0/20px 20px,rgba(236,228,248,.92)")} />
                <div style={css("position:absolute;left:4px;right:4px;top:30px;height:4px;background:radial-gradient(circle 1.5px,rgba(196,168,230,.9) 96%,transparent) 0 0/10px 4px")} />
              </>) : null}
              {v.is.dateStamp ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:10px;background:rgba(255,255,255,.28);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85),inset 0 8px 14px rgba(255,255,255,.2)")} />
                <div style={css("position:absolute;inset:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;transform:rotate(-4deg);opacity:.92")}>
                  <div style={css("font:700 10px/1 'Courier Prime',monospace;letter-spacing:.24em;color:#204670;white-space:nowrap;padding-left:.24em")}>
                    RECEIVED
                  </div>
                  <div style={css("font:700 24px/1 'Courier Prime',monospace;color:#204670;white-space:nowrap")}>
                    11.10.26
                  </div>
                  <div style={css("font:700 9px/1 'Courier Prime',monospace;letter-spacing:.2em;color:#204670;white-space:nowrap;padding-left:.2em")}>
                    WITH LOVE
                  </div>
                </div>
              </>) : null}
              {v.is.moonPhases ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:999px;background:rgba(255,255,255,.28);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85)")} />
                <div style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:12px")}>
                  <div style={css("width:28px;height:28px;border-radius:50%;border:1.5px solid #130F1F")} />
                  <div style={css("width:28px;height:28px;border-radius:50%;border:1.5px solid #130F1F;background:linear-gradient(90deg,transparent 70%,#130F1F 70%)")} />
                  <div style={css("width:28px;height:28px;border-radius:50%;border:1.5px solid #130F1F;background:linear-gradient(90deg,transparent 50%,#130F1F 50%)")} />
                  <div style={css("width:28px;height:28px;border-radius:50%;border:1.5px solid #130F1F;background:radial-gradient(circle at 20% 50%,transparent 9px,#130F1F 9.5px)")} />
                  <div style={css("width:28px;height:28px;border-radius:50%;background:#130F1F")} />
                </div>
              </>) : null}
              {v.is.favHeart ? (<>
                <div style={css("position:absolute;inset:4px;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.7),rgba(232,226,246,.42) 60%);mask:radial-gradient(circle 29px at 33px 36px,#000 97%,transparent 100%) no-repeat,radial-gradient(circle 29px at 83px 36px,#000 97%,transparent 100%) no-repeat,conic-gradient(from -45deg at 58px 46px,#000 90deg,transparent 0) 0 56px/116px 48px no-repeat;-webkit-mask:radial-gradient(circle 29px at 33px 36px,#000 97%,transparent 100%) no-repeat,radial-gradient(circle 29px at 83px 36px,#000 97%,transparent 100%) no-repeat,conic-gradient(from -45deg at 58px 46px,#000 90deg,transparent 0) 0 56px/116px 48px no-repeat")} />
                <div style={css("position:absolute;left:0;right:0;top:40px;text-align:center;font:700 26px/1 'Caveat',cursive;color:#5E3695;transform:rotate(-6deg)")}>
                  favourite
                </div>
              </>) : null}
              {v.is.sparkles ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:26px;background:rgba(255,255,255,.26);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85)")} />
                <div style={css("position:absolute;left:22px;top:22px;width:50px;height:50px;background:linear-gradient(135deg,#FFFFFF,#C4A8E6);clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;left:72px;top:58px;width:36px;height:36px;background:linear-gradient(135deg,#FFFFFF,#C4A8E6);clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;left:36px;top:84px;width:20px;height:20px;background:linear-gradient(135deg,#FFFFFF,#C4A8E6);clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;left:88px;top:24px;width:12px;height:12px;background:#C4A8E6;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
              </>) : null}
              {v.is.collageDreamy ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:14px;background:linear-gradient(160deg,#D6E0EA,#ACBFD3)")} />
                <img src="/media/stickers/jellyfish.png" alt="" style={css("position:absolute;left:24px;top:12px;width:104px;height:117px")} />
                <div style={css("position:absolute;left:14px;bottom:16px;padding:5px 9px;background:#FFFFFF;transform:rotate(-4deg);font:700 13px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#204670;box-shadow:0 1px 2px rgba(19,15,31,.25)")}>
                  DREAMY
                </div>
                <div style={css("position:absolute;right:16px;top:16px;width:16px;height:16px;background:#FFFFFF;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                <div style={css("position:absolute;right:28px;top:36px;width:8px;height:8px;background:#FFFFFF;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
              </>) : null}
              {v.is.collageUs ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:14px;background:linear-gradient(160deg,#DCCBF3,#C4A8E6)")} />
                <div style={css("position:absolute;left:30px;top:20px;width:86px;padding:6px 6px 20px;background:#FFFFFF;transform:rotate(5deg);box-shadow:0 1px 3px rgba(19,15,31,.3)")}>
                  <div style={css("height:78px;background:repeating-linear-gradient(135deg,#ACBFD3 0 6px,#BCCDDE 6px 12px)")} />
                </div>
                <img src="/media/stickers/bow.png" alt="" style={css("position:absolute;left:52px;top:4px;width:58px;height:35px;transform:rotate(-8deg)")} />
                <div style={css("position:absolute;left:18px;bottom:14px;font:700 30px/1 'Caveat',cursive;color:#320F6F;transform:rotate(-6deg)")}>
                  us.
                </div>
              </>) : null}
              {v.is.collageBloom ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:14px;background:radial-gradient(circle at 30% 20%,#2E5A8C,#204670 50%,#141E33)")} />
                <img src="/media/stickers/lily.png" alt="" style={css("position:absolute;left:34px;top:6px;width:84px;height:137px;transform:rotate(8deg)")} />
                <div style={css("position:absolute;left:12px;bottom:18px;padding:5px 10px;background:#F7F1E6;transform:rotate(-6deg);font:700 13px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#130F1F;box-shadow:0 1px 2px rgba(0,0,0,.35)")}>
                  11.10
                </div>
              </>) : null}
              {v.is.collageDisco ? (<>
                <div style={css("position:absolute;inset:4px;border-radius:14px;background:radial-gradient(circle at 60% 30%,#2A2140,#130F1F 70%)")} />
                <img src="/media/stickers/disco-violet.png" alt="" style={css("position:absolute;left:18px;top:10px;width:112px;height:124px")} />
                <div style={css("position:absolute;left:8px;right:8px;bottom:16px;padding:6px 0;background:#BA2F1F;transform:rotate(-3deg);text-align:center;font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#FFFFFF")}>
                  MAIN CHARACTER ENERGY
                </div>
              </>) : null}
              {v.is.washiStripes ? (<>
                <div style={css("position:absolute;inset:4px 0;opacity:.88;background:repeating-linear-gradient(90deg,#F7F1E6 0 5px,#ACBFD3 5px 8px);clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%)")} />
              </>) : null}
              {v.is.washiGingham ? (<>
                <div style={css("position:absolute;inset:4px 0;opacity:.9;background:repeating-linear-gradient(90deg,rgba(165,123,213,.5) 0 8px,transparent 8px 16px),repeating-linear-gradient(0deg,rgba(165,123,213,.5) 0 8px,transparent 8px 16px),#F3EEFA;clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%)")} />
              </>) : null}
              {v.is.washiStars ? (<>
                <div style={css("position:absolute;inset:4px 0;opacity:.92;background:radial-gradient(circle 1.6px,#F7F1E6 96%,transparent) 0 0/18px 16px,radial-gradient(circle 1px,#C4A8E6 96%,transparent) 9px 8px/18px 16px,#204670;clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%)")} />
              </>) : null}
              {v.is.washiLavender ? (<>
                <div style={css("position:absolute;inset:4px 0;opacity:.82;background:linear-gradient(180deg,#CDB4EB,#C4A8E6);clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%)")} />
              </>) : null}
              {v.is.washiDusty ? (<>
                <div style={css("position:absolute;inset:4px 0;opacity:.85;background:repeating-linear-gradient(-45deg,rgba(255,255,255,.18) 0 3px,transparent 3px 9px),#ACBFD3;clip-path:polygon(0 10%,3% 0,97% 0,100% 12%,97% 32%,100% 54%,97% 76%,100% 92%,97% 100%,3% 100%,0 88%,3% 68%,0 48%,3% 28%)")} />
              </>) : null}
              {v.is.ticketStub ? (<>
                <div style={css("position:absolute;inset:4px;background:#F7F1E6;mask:radial-gradient(circle 9px at 0 50%,transparent 96%,#000 100%) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 96%,#000 100%) right/51% 100% no-repeat;-webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 96%,#000 100%) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 96%,#000 100%) right/51% 100% no-repeat;display:flex")}>
                  <div style={css("flex:1;padding:12px 0 0 22px;display:flex;flex-direction:column;gap:6px")}>
                    <div style={css("font:700 10px/1 'Courier Prime',monospace;letter-spacing:.2em;color:#BA2F1F")}>
                      ADMIT ONE
                    </div>
                    <div style={css("font:400 22px/1 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap")}>
                      the birthday
                    </div>
                    <div style={css("font:400 10px/1 'Courier Prime',monospace;color:#204670;white-space:nowrap")}>
                      ROW N · SEAT 11
                    </div>
                  </div>
                  <div style={css("width:46px;border-left:2px dashed #ACBFD3;display:flex;align-items:center;justify-content:center")}>
                    <span style={css("writing-mode:vertical-rl;font:700 10px/1 'Courier Prime',monospace;letter-spacing:.1em;color:#130F1F")}>
                      0011
                    </span>
                  </div>
                </div>
              </>) : null}
              {v.is.postageStamp ? (<>
                <div style={css("position:absolute;inset:0;background:radial-gradient(circle at 5px 5px,transparent 3.2px,#FFFFFF 3.8px) 0 0/10px 10px")} />
                <div style={css("position:absolute;inset:6px;background:#FFFFFF;padding:6px;display:flex;flex-direction:column;gap:5px")}>
                  <div style={css("position:relative;flex:1;background:radial-gradient(circle at 70% 26%,#DCCBF3,#B092DD 55%,#8A63BC);overflow:hidden")}>
                    <div style={css("position:absolute;left:18px;top:20px;width:32px;height:32px;background:#F7F1E6;clip-path:polygon(50.0% 0.0%,67.6% 25.7%,97.6% 34.5%,78.5% 59.3%,79.4% 90.5%,50.0% 80.0%,20.6% 90.5%,21.5% 59.3%,2.4% 34.5%,32.4% 25.7%)")} />
                    <div style={css("position:absolute;left:54px;top:46px;width:14px;height:14px;background:#C4A8E6;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)")} />
                    <div style={css("position:absolute;right:6px;bottom:6px;font:400 15px/1 'Libre Caslon Text',serif;color:#F7F1E6")}>
                      26
                    </div>
                  </div>
                  <div style={css("font:700 9px/1 'Courier Prime',monospace;color:#130F1F;text-align:center;letter-spacing:.06em;white-space:nowrap")}>
                    NEHA · 11.10
                  </div>
                </div>
              </>) : null}
              {v.is.labelTag ? (<>
                <div style={css("position:absolute;left:0;top:30px;width:36px;height:1.5px;background:#ACBFD3;transform:rotate(-12deg);transform-origin:right center")} />
                <div style={css("position:absolute;left:30px;top:6px;right:4px;bottom:6px;background:linear-gradient(180deg,#FFFFFF,#F2EEE6);clip-path:polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%);display:flex;align-items:center;padding-left:44px;gap:8px")}>
                  <span style={css("font:600 28px/1 'Caveat',cursive;color:#204670;white-space:nowrap")}>
                    for you
                  </span>
                </div>
                <div style={css("position:absolute;left:44px;top:30px;width:11px;height:11px;border-radius:50%;background:#ACBFD3;box-shadow:inset 0 1px 2px rgba(0,0,0,.25)")} />
              </>) : null}
              {v.is.tornLined ? (<>
                <div style={css("position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 23px,#BCCDDE 23px 24px) 0 20px/100% 100% no-repeat,#FFFFFF;clip-path:polygon(0 8%,7% 3%,13% 9%,21% 2%,29% 7%,36% 1%,45% 8%,53% 3%,61% 9%,69% 2%,77% 7%,85% 1%,93% 7%,100% 3%,100% 100%,0 100%)")} />
                <div style={css("position:absolute;left:22px;top:0;bottom:0;width:1.5px;background:#C95A5B;opacity:.7")} />
                <div style={css("position:absolute;left:34px;top:34px;font:400 26px/24px 'Kalam',cursive;color:#204670")}>
                  remember
                  <br />
                  this?
                </div>
              </>) : null}
              {v.is.object1 ? (<>
                <div style={css("position:absolute;left:72px;top:40px;width:34px;height:42px;border-radius:50%;border:9px solid #2E3B5E")} />
                <div style={css("position:absolute;left:18px;top:22px;width:66px;height:80px;border-radius:6px 6px 22px 22px;background:linear-gradient(110deg,#3D5A8A,#204670 45%,#141E33)")} />
                <div style={css("position:absolute;left:26px;top:28px;width:8px;height:60px;border-radius:4px;background:rgba(255,255,255,.22)")} />
              </>) : null}
              {v.is.object2 ? (<>
                <div style={css("position:absolute;left:12px;top:12px;width:96px;height:96px;border-radius:50%;background:radial-gradient(circle at 34% 30%,#8A63BC,#5E3695 50%,#320F6F)")} />
                <div style={css("position:absolute;left:28px;top:24px;width:24px;height:14px;border-radius:50%;background:rgba(255,255,255,.3);transform:rotate(-30deg)")} />
              </>) : null}
              {v.is.object3 ? (<>
                <div style={css("position:absolute;left:32px;top:6px;width:56px;height:108px;border-radius:28px;background:linear-gradient(100deg,#3D5A8A,#204670 50%,#141E33)")} />
                <div style={css("position:absolute;left:40px;top:16px;width:7px;height:80px;border-radius:4px;background:rgba(255,255,255,.22)")} />
              </>) : null}
              {v.is.object4 ? (<>
                <div style={css("position:absolute;left:18px;top:18px;width:84px;height:84px;border-radius:20px;transform:rotate(10deg);background:linear-gradient(135deg,#A57BD5,#5E3695 60%,#3B2266)")} />
                <div style={css("position:absolute;left:30px;top:28px;width:28px;height:8px;border-radius:4px;background:rgba(255,255,255,.28);transform:rotate(10deg)")} />
              </>) : null}
              {v.is.object5 ? (<>
                <div style={css("position:absolute;left:46px;top:8px;width:28px;height:30px;border-radius:6px;background:#2E3B5E")} />
                <div style={css("position:absolute;left:28px;top:34px;width:64px;height:80px;border-radius:18px;background:linear-gradient(100deg,#A57BD5,#5E3695 55%,#320F6F)")} />
                <div style={css("position:absolute;left:36px;top:44px;width:7px;height:56px;border-radius:4px;background:rgba(255,255,255,.25)")} />
              </>) : null}
              {v.is.object6 ? (<>
                <div style={css("position:absolute;left:8px;top:16px;width:104px;height:90px;border-radius:58% 42% 55% 45% / 45% 55% 45% 55%;background:radial-gradient(circle at 36% 30%,#5A7FB0,#204670 55%,#141E33)")} />
                <div style={css("position:absolute;left:26px;top:28px;width:26px;height:12px;border-radius:50%;background:rgba(255,255,255,.25);transform:rotate(-24deg)")} />
              </>) : null}
              {v.isObj ? (<>
                <div style={css("position:absolute;left:0;right:0;bottom:-2px;display:flex;justify-content:center")}>
                  <div style={css("padding:3px 7px;border-radius:999px;background:#FFFFFF;font:700 10px/1 'Courier Prime',monospace;letter-spacing:.06em;color:#130F1F;white-space:nowrap")}>
                    her object {v.objN}
                  </div>
                </div>
              </>) : null}
            </div>
            <div style={css(`position:absolute;inset:-6px;pointer-events:none;overflow:hidden;clip-path:${v.gclip}`)}>
              {v.holo ? (<>
                <div style={css(`position:absolute;inset:0;mix-blend-mode:soft-light;opacity:.4;background:linear-gradient(125deg,#9FC3F0 0%,#E4D2FF 22%,#B2B2E5 40%,#CFF1FF 58%,#D0B0F5 76%,#9FC3F0 100%) ${v.holoPos}/240% 240%;transition:background-position 420ms cubic-bezier(0.25,1,0.5,1)`)} />
              </>) : null}
              <div style={css(`position:absolute;top:-20%;bottom:-20%;left:0;width:60%;background:linear-gradient(105deg,rgba(255,255,255,0) 20%,rgba(255,255,255,.55) 47%,rgba(255,255,255,.1) 56%,rgba(255,255,255,0) 72%);transform:translateX(${v.gx}) skewX(-12deg);transition:${v.gt}`)} />
            </div>
          </>) : null}
          {v.pin ? (<>
            <div style={css(`position:absolute;left:50%;top:7%;width:${v.pinS}px;height:${v.pinS}px;margin-left:${v.pinM}px;border-radius:50%;background:radial-gradient(circle at 34% 30%,#FFFFFF 0 9%,#DCCBF3 16%,#C4A8E6 46%,#9277BF 100%);box-shadow:0 2px 2px rgba(19,15,31,.35)`)} />
          </>) : null}
          {v.tape ? (<>
            <div style={css(`position:absolute;left:50%;top:-5%;width:${v.tapeW}px;height:${v.tapeH}px;margin-left:${v.tapeM}px;transform:rotate(-7deg);background:repeating-linear-gradient(90deg,rgba(196,168,230,.82) 0 6px,rgba(247,241,230,.82) 6px 12px);clip-path:polygon(0 12%,5% 0,95% 0,100% 14%,96% 34%,100% 54%,96% 76%,100% 92%,95% 100%,5% 100%,0 88%,4% 68%,0 48%,4% 28%);box-shadow:0 1px 1px rgba(19,15,31,.15)`)} />
          </>) : null}
        </div>
        {v.showTurn ? (<>
          <div onPointerDown={v.turn} title="drag to rotate · or two-finger rotate / shift + scroll" style={css("position:absolute;right:-12px;bottom:-12px;width:26px;height:26px;border-radius:50%;background:#FFFFFF;box-shadow:0 1px 3px rgba(19,15,31,.35),inset 0 0 0 1.5px #A57BD5;display:flex;align-items:center;justify-content:center;cursor:alias;z-index:5;touch-action:none")}>
            <div style={css("width:12px;height:12px;border:2px solid #5E3695;border-left-color:transparent;border-radius:50%;transform:rotate(-30deg)")} />
            <div style={css("position:absolute;left:5px;top:6px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:5px solid #5E3695;transform:rotate(-70deg)")} />
          </div>
        </>) : null}
      </div>
    );
  }
}
