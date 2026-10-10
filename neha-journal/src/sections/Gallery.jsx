// Development only (#/dev/gallery): every ported design component in its states,
// to check them against the Phase 1 v2 boards quickly.
import React from 'react';
import { css } from '../design/dc.js';
import Sticker from '../design/Sticker.jsx';
import Fastener from '../design/Fastener.jsx';
import PhotoFrame from '../design/PhotoFrame.jsx';
import WaxSeal from '../design/WaxSeal.jsx';
import Envelope from '../design/Envelope.jsx';
import DividerTab from '../design/DividerTab.jsx';
import MiniPlayer from '../design/MiniPlayer.jsx';
import RansomWord from '../design/RansomWord.jsx';
import SpiralJournal from '../design/SpiralJournal.jsx';
import { allStickers } from '../design/stickerSheet.js';

const label = t => <div style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#5E3695;margin:18px 0 10px")}>{t}</div>;

export default function Gallery() {
  return (
    <div className="nh-scroll" style={css('position:absolute;inset:0;overflow:auto;background:#FBF9F5;padding:24px 40px;z-index:100')}>
      {label('STICKERS · THE SHEET')}
      <div style={css('display:flex;flex-wrap:wrap;gap:18px;align-items:center')}>
        {allStickers().map(s => <div key={s.id} title={s.label}><Sticker kind={s.id} size={90} /></div>)}
      </div>
      {label('FASTENERS')}
      <div style={css('display:flex;gap:30px;align-items:center')}>
        {['pin', 'pin-side', 'binder', 'paperclip', 'clothespin', 'corner'].map(k => <Fastener key={k} kind={k} />)}
      </div>
      {label('PHOTO FRAMES')}
      <div style={css('display:flex;gap:30px;align-items:flex-start;flex-wrap:wrap')}>
        {['polaroid', 'booth', 'film', 'slide', 'taped', 'torn', 'corners', 'clipped'].map((t, i) => <PhotoFrame key={t} type={t} ratio="1:1" size={160} tone={i % 3} />)}
      </div>
      {label('WAX SEAL · INTACT / PULSE / CRACKED')}
      <div style={css('display:flex;gap:40px')}>
        {['intact', 'pulse', 'cracked'].map(s => <WaxSeal key={s} state={s} size={96} />)}
      </div>
      {label('ENVELOPES')}
      <div style={css('display:flex;gap:40px;align-items:flex-end;flex-wrap:wrap;padding-top:80px')}>
        <Envelope state="pulse" label="For Neha" stamp />
        {['closed', 'cracked', 'open'].map((s, i) => <Envelope key={s} size="small" state={s} color={['#7A1F2B', '#C4A8E6', '#3D5A8A'][i]} label={`Friend ${i + 1}`} />)}
      </div>
      {label('DIVIDER TABS · REST / HOVER / ACTIVE')}
      <div style={css('display:flex;gap:10px')}>
        {['Cover', 'Timeline', 'Darkroom', 'Wishes', 'Playlist', 'Jokes', 'Games'].map((l, i) => <DividerTab key={l} label={l} state={['default', 'hover', 'active'][i % 3]} />)}
      </div>
      {label('MINI PLAYER · PAUSED / PLAYING / PRESS / SOUND OFF')}
      <div style={css('display:flex;gap:24px;flex-wrap:wrap;padding-top:60px')}>
        {[['paused'], ['playing'], ['press'], ['paused', true]].map(([s, m], i) => <MiniPlayer key={i} state={s} muted={m} title="Song title · Artist" picked="picked by Friend 3" />)}
      </div>
      {label('RANSOM HEADINGS')}
      <RansomWord text="the darkroom" size={54} /> <RansomWord text="the joke archive" size={44} />
      {label('SPIRAL JOURNAL PAPERS')}
      <div style={css('display:flex;gap:20px;flex-wrap:wrap')}>
        {['white', 'lined', 'grid', 'dark', 'cover-brown', 'tint'].map(p => <SpiralJournal key={p} w={220} h={160} paper={p} tint="#DCCBF3" />)}
      </div>
    </div>
  );
}
