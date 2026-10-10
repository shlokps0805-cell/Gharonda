import React from 'react';
import { DC, css } from './dc.js';
import Fastener from './Fastener.jsx';
import Photo from './Photo.jsx';

export default class PhotoFrame extends DC {
  renderVals() {
    const type = this.props.type ?? 'polaroid';
    const ratio = this.props.ratio ?? '4:5';
    const [rw, rh] = ratio.split(':').map(Number);
    let pw = Number(this.props.size ?? 300);
    const ph = Math.round(pw * rh / rw);
    const short = Math.min(pw, ph);
    const cls = pw >= 600 ? 'hero' : Math.max(pw, ph) >= 360 ? 'medium' : 'small';
    const pad = Math.max(10, Math.round(pw * .05));
    const capH = Math.min(84, Math.max(52, Math.round(pw * .17)));
    const pad2 = Math.round(pw * .12), pad3 = Math.round(pw * .22);
    let fw = pw, fh = ph;
    if (type === 'polaroid') fw = pw + pad * 2;
    else if (type === 'booth') fw = pw + 20;
    else if (type === 'film') fw = pw + 28;
    else if (type === 'slide') fw = pw + pad2 * 2;
    else if (type === 'phone') fw = pw + 16;
    else if (type === 'taped' || type === 'clipped') fw = pw + 20;
    else if (type === 'torn') { fw = pw + 16; fh = ph + 16; }
    else if (type === 'corners') fw = pw + 12;
    const dark = !!this.props.onDark;
    const caption = this.props.caption ?? 'caption goes here';
    const by = this.props.by ?? 'taken by Friend 1';
    const showCap = this.props.showCaption ?? true;
    const tones = ['repeating-linear-gradient(135deg,#BCCDDE 0 12px,#C9D6E3 12px 24px)', 'repeating-linear-gradient(135deg,#CFC1E8 0 12px,#DAD0EE 12px 24px)', 'repeating-linear-gradient(135deg,#ACBFD3 0 12px,#B9CADB 12px 24px)'];
    const ti = this.props.tone ?? 0;
    return {
      is: { polaroid: type === 'polaroid', booth: type === 'booth', film: type === 'film', slide: type === 'slide', phone: type === 'phone', taped: type === 'taped', torn: type === 'torn', corners: type === 'corners', clipped: type === 'clipped' },
      pw, ph, fw, fh, pad, capH, capF: Math.min(34, Math.max(24, Math.round(pw * .085))), pad2, pad3,
      rot: Number(this.props.rotate ?? 0),
      ph_bg: tones[ti % 3],
      label: this.props.label ?? `photo · ${ratio} · ${cls}`,
      four: ['photo 1', 'photo 2', 'photo 3', 'photo 4'],
      caption, by, src: this.props.src ?? '', hasSrc: !!this.props.src, noSrc: !this.props.src, alt: this.props.alt ?? '', sizes: `${pw * 2}px`, eager: !!this.props.eager,
      srcs: (this.props.srcs || []).concat(['', '', '', '']).slice(0, 4),
      outsideCap: showCap && type !== 'polaroid', polaroidBy: showCap && type === 'polaroid',
      capColor: dark ? '#FFFFFF' : '#130F1F', byColor: dark ? '#ACBFD3' : '#3D4A66'
    };
  }
  template(v) {
    return (
      <div style={css(`position:relative;flex:none;display:flex;flex-direction:column;align-items:center;gap:8px;width:${v.fw}px;transform:rotate(${v.rot}deg)`)}>
        {v.is.polaroid ? (<>
          <div style={css(`width:${v.fw}px;padding:${v.pad}px ${v.pad}px 0;background:#FFFFFF;box-shadow:0 1px 2px rgba(19,15,31,.25),0 8px 18px rgba(19,15,31,.18)`)}>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;overflow:hidden;background:${v.ph_bg}`)}>
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : null}
              {v.noSrc ? (<>
                <div style={css("position:absolute;left:10px;bottom:10px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                  {v.label}
                </div>
              </>) : null}
            </div>
            <div style={css(`height:${v.capH}px;display:flex;align-items:center;justify-content:center;font:600 ${v.capF}px/1 'Caveat',cursive;color:#130F1F;white-space:nowrap`)}>
              {v.caption}
            </div>
          </div>
        </>) : null}
        {v.is.booth ? (<>
          <div style={css(`width:${v.fw}px;padding:10px;background:#FFFFFF;display:flex;flex-direction:column;gap:8px;box-shadow:0 1px 2px rgba(19,15,31,.25),0 8px 18px rgba(19,15,31,.18)`)}>
            {(v.four || []).map((f, $index) => (<React.Fragment key={$index}>
              <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;background:${v.ph_bg};overflow:hidden`)}>
                {v.srcs[$index] ? <Photo src={v.srcs[$index]} alt={v.alt} sizes="200px" /> : (
                <div style={css("position:absolute;left:8px;bottom:8px;font:400 11px/1 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 5px")}>
                  {f}
                </div>
                )}
              </div>
            </React.Fragment>))}
            <div style={css("height:22px;display:flex;align-items:center;justify-content:center;font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#5E3695;white-space:nowrap")}>
              NEHA · 11.10.26
            </div>
          </div>
        </>) : null}
        {v.is.film ? (<>
          <div style={css(`position:relative;width:${v.fw}px;padding:26px 14px;background:#130F1F;box-shadow:0 1px 2px rgba(19,15,31,.3),0 8px 18px rgba(19,15,31,.22)`)}>
            <div style={css("position:absolute;left:0;right:0;top:8px;height:10px;background:repeating-linear-gradient(90deg,transparent 0 8px,#E9E4EF 8px 17px);border-radius:2px")} />
            <div style={css("position:absolute;left:0;right:0;bottom:8px;height:10px;background:repeating-linear-gradient(90deg,transparent 0 8px,#E9E4EF 8px 17px)")} />
            <div style={css("position:absolute;right:16px;top:19px;font:700 7px/1 'Courier Prime',monospace;color:#A57BD5")}>
              24A ▸
            </div>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;background:${v.ph_bg}`)}>
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
              <div style={css("position:absolute;left:10px;top:10px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                {v.label}
              </div>
              )}
              <div style={css("position:absolute;right:10px;bottom:8px;font:700 15px/1 'Courier Prime',monospace;color:#E86A5A;letter-spacing:.06em;text-shadow:0 0 4px rgba(232,106,90,.6)")}>
                '26 10 11
              </div>
            </div>
          </div>
        </>) : null}
        {v.is.slide ? (<>
          <div style={css(`position:relative;width:${v.fw}px;padding:${v.pad2}px ${v.pad2}px ${v.pad3}px;background:#FFFFFF;border-radius:10px;box-shadow:0 1px 2px rgba(19,15,31,.25),0 8px 18px rgba(19,15,31,.18)`)}>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;border-radius:12px;overflow:hidden;background:${v.ph_bg};box-shadow:inset 0 1px 4px rgba(19,15,31,.4)`)}>
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
              <div style={css("position:absolute;left:10px;bottom:10px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                {v.label}
              </div>
              )}
            </div>
            <div style={css(`position:absolute;left:${v.pad2}px;right:${v.pad2}px;bottom:12px;display:flex;justify-content:space-between;font:700 11px/1 'Courier Prime',monospace;color:#130F1F;letter-spacing:.08em`)}>
              <span>
                NEHA · 26
              </span>
              <span>
                07
              </span>
            </div>
          </div>
        </>) : null}
        {v.is.phone ? (<>
          <div style={css(`position:relative;width:${v.fw}px;padding:8px;background:#130F1F;border-radius:30px;box-shadow:0 1px 2px rgba(19,15,31,.3),0 8px 18px rgba(19,15,31,.22)`)}>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;border-radius:23px;overflow:hidden;background:${v.ph_bg}`)}>
              <div style={css("position:absolute;left:16px;right:16px;top:12px;display:flex;justify-content:space-between;font:700 13px/1 'DM Sans',sans-serif;color:#130F1F")}>
                <span>
                  11:10
                </span>
                <span style={css("display:flex;gap:4px;align-items:center")}>
                  <span style={css("width:16px;height:9px;border-radius:2px;border:1.5px solid #130F1F")} />
                </span>
              </div>
              <div style={css("position:absolute;left:50%;top:10px;width:70px;height:20px;margin-left:-35px;border-radius:10px;background:#130F1F")} />
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
              <div style={css("position:absolute;left:14px;top:46px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                {v.label}
              </div>
              )}
              <div style={css("position:absolute;left:50%;bottom:16px;width:48px;height:48px;margin-left:-24px;border-radius:50%;border:3px solid #FFFFFF;box-shadow:inset 0 0 0 3px rgba(19,15,31,.25),inset 0 0 0 30px rgba(255,255,255,.85)")} />
            </div>
          </div>
        </>) : null}
        {v.is.taped ? (<>
          <div style={css(`position:relative;width:${v.fw}px;padding:10px;background:#FFFFFF;box-shadow:0 1px 2px rgba(19,15,31,.25),0 8px 18px rgba(19,15,31,.18)`)}>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;background:${v.ph_bg}`)}>
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
              <div style={css("position:absolute;left:10px;bottom:10px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                {v.label}
              </div>
              )}
            </div>
            <div style={css("position:absolute;left:-22px;top:6px;width:84px;height:24px;transform:rotate(-38deg);opacity:.88;background:repeating-linear-gradient(90deg,#F7F1E6 0 5px,#ACBFD3 5px 8px);clip-path:polygon(0 10%,4% 0,96% 0,100% 12%,96% 32%,100% 54%,96% 76%,100% 92%,96% 100%,4% 100%,0 88%,4% 68%,0 48%,4% 28%)")} />
            <div style={css("position:absolute;right:-22px;bottom:6px;width:84px;height:24px;transform:rotate(-38deg);opacity:.85;background:linear-gradient(180deg,#CDB4EB,#C4A8E6);clip-path:polygon(0 10%,4% 0,96% 0,100% 12%,96% 32%,100% 54%,96% 76%,100% 92%,96% 100%,4% 100%,0 88%,4% 68%,0 48%,4% 28%)")} />
          </div>
        </>) : null}
        {v.is.torn ? (<>
          <div style={css("filter:drop-shadow(0 1px 1.5px rgba(19,15,31,.3)) drop-shadow(0 6px 10px rgba(19,15,31,.16))")}>
            <div style={css(`position:relative;width:${v.fw}px;height:${v.fh}px;padding:8px;background:#FFFFFF;clip-path:polygon(2% 1%,14% 0,27% 2%,41% 0,56% 2%,70% 0,84% 2%,98% 0,100% 12%,98% 26%,100% 40%,98% 55%,100% 70%,98% 84%,100% 99%,86% 100%,72% 98%,58% 100%,43% 98%,28% 100%,14% 98%,0 100%,2% 86%,0 72%,2% 57%,0 42%,2% 27%,0 13%)`)}>
              <div style={css(`position:relative;width:100%;height:100%;background:${v.ph_bg};clip-path:polygon(1% 1%,15% 0,28% 2%,42% 0,57% 2%,71% 0,85% 2%,99% 0,100% 13%,98% 27%,100% 41%,98% 56%,100% 71%,98% 85%,99% 99%,85% 100%,71% 98%,57% 100%,42% 98%,27% 100%,13% 98%,1% 99%,2% 85%,0 71%,2% 56%,0 41%,2% 26%,0 12%)`)}>
                {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
                <div style={css("position:absolute;left:14px;bottom:14px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                  {v.label}
                </div>
                )}
              </div>
            </div>
          </div>
        </>) : null}
        {v.is.corners ? (<>
          <div style={css(`position:relative;width:${v.fw}px;padding:0;box-shadow:0 1px 2px rgba(19,15,31,.22),0 6px 14px rgba(19,15,31,.14)`)}>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;background:${v.ph_bg};border:6px solid #FFFFFF`)}>
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
              <div style={css("position:absolute;left:12px;bottom:12px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                {v.label}
              </div>
              )}
            </div>
            <div style={css("position:absolute;left:-6px;top:-6px")}>
              <Fastener kind="corner" />
            </div>
            <div style={css("position:absolute;right:-6px;top:-6px")}>
              <Fastener kind="corner" rotate={90} />
            </div>
            <div style={css("position:absolute;right:-6px;bottom:-6px")}>
              <Fastener kind="corner" rotate={180} />
            </div>
            <div style={css("position:absolute;left:-6px;bottom:-6px")}>
              <Fastener kind="corner" rotate={270} />
            </div>
          </div>
        </>) : null}
        {v.is.clipped ? (<>
          <div style={css(`position:relative;width:${v.fw}px;padding:10px;background:#FFFFFF;box-shadow:0 1px 2px rgba(19,15,31,.25),0 8px 18px rgba(19,15,31,.18)`)}>
            <div style={css(`position:relative;width:${v.pw}px;height:${v.ph}px;background:${v.ph_bg}`)}>
              {v.hasSrc ? <Photo src={v.src} alt={v.alt} sizes={v.sizes} eager={v.eager} /> : (
              <div style={css("position:absolute;left:10px;bottom:10px;font:400 12px/1.3 'Courier Prime',monospace;color:#204670;background:rgba(255,255,255,.75);padding:3px 6px")}>
                {v.label}
              </div>
              )}
            </div>
            <div style={css("position:absolute;left:50%;top:-24px;margin-left:-20px")}>
              <Fastener kind="binder" />
            </div>
          </div>
        </>) : null}
        {v.outsideCap ? (<>
          <div style={css("display:flex;flex-direction:column;align-items:center;gap:4px;padding-top:4px")}>
            <div style={css(`font:600 24px/1 'Caveat',cursive;color:${v.capColor};white-space:nowrap`)}>
              {v.caption}
            </div>
            <div style={css(`font:400 12px/1 'Courier Prime',monospace;letter-spacing:.06em;color:${v.byColor};white-space:nowrap`)}>
              {v.by}
            </div>
          </div>
        </>) : null}
        {v.polaroidBy ? (<>
          <div style={css(`font:400 12px/1 'Courier Prime',monospace;letter-spacing:.06em;color:${v.byColor};white-space:nowrap`)}>
            {v.by}
          </div>
        </>) : null}
      </div>
    );
  }
}
