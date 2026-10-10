// The mixtape (design: PlaylistScene, approved look with art option A).
// Liner notes list side A and side B; clicking a song plays it through the shared player.
// The one Spotify embed is placed over the designed slot by App (left 150, top 640).
import React, { useEffect, useState } from 'react';
import { css } from '../design/dc.js';
import SpiralJournal from '../design/SpiralJournal.jsx';
import Fastener from '../design/Fastener.jsx';
import Sticker from '../design/Sticker.jsx';
import Photo from '../design/Photo.jsx';
import StickerLayer from '../components/StickerLayer.jsx';
import { useMusic } from '../music/MusicContext.jsx';

// a small photo on the cassette insert (placeholder stripes until a photo is added)
function ArtPhoto({ file, style, stripes, grey }) {
  return (
    <div style={{ ...css(`position:absolute;overflow:hidden;background:${stripes};border:4px solid #FFFFFF;box-shadow:0 1px 4px rgba(19,15,31,.3)`), ...style }}>
      {file ? <Photo src={file} alt="" sizes="200px" style={grey ? { filter: 'grayscale(1)' } : undefined} /> : null}
    </div>
  );
}

export default function Playlist({ content, reduced }) {
  const { songs, site, ui } = content;
  const t = ui.playlist;
  const music = useMusic();
  const [out, setOut] = useState(false);
  const [hover, setHover] = useState(null);
  const playing = music.status === 'playing';
  const art = site.mixtapePhotos || [];
  const nickname = site.nicknames[0] ? `${site.nicknames[0]}!!` : t.nickname;
  const unavailable = music.status === 'unavailable' || !music.hasSongs;

  // the cassette slides halfway out of its case when the page opens
  useEffect(() => { const id = setTimeout(() => setOut(true), reduced ? 0 : 120); return () => clearTimeout(id); }, [reduced]);

  const sides = ['A', 'B'].map(side => ({ side, list: songs.filter(s => s.side === side) })).filter(s => s.list.length);

  return (
    <>
      <div style={css('position:absolute;left:94px;top:34px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#140F1E')} />
      <div style={css('position:absolute;left:88px;top:28px;width:590px;height:756px;border-radius:8px 2px 2px 8px;background:#2A2140;box-shadow:0 2px 3px rgba(0,0,0,.4),0 18px 40px rgba(0,0,0,.4);overflow:hidden')}>
        <div style={css('position:absolute;inset:0;background:url(/media/textures/film-grain.png) 0 0/200px 200px')} />
        <div style={css('position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(202,154,161,.22),rgba(202,154,161,0) 70%)')} />
        <div style={css('position:absolute;top:0;bottom:0;right:0;width:60px;background:linear-gradient(270deg,rgba(0,0,0,.35),rgba(0,0,0,0))')} />
      </div>
      <div style={css('position:absolute;left:678px;top:28px')}>
        <SpiralJournal w={590} h={756} paper="tint" tint="#2A2140" coil="silver" holeColor="#140F1E" />
      </div>
      <div style={css('position:absolute;left:140px;top:52px;display:flex;flex-direction:column;gap:6px')}>
        <div style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#C4A8E6")}>{t.kicker}</div>
        <h1 style={css("margin:0;font:400 40px/1.05 'Libre Caslon Text',serif;color:#FFFFFF;white-space:nowrap")}>{t.title}</h1>
        <div style={css("font:600 26px/1 'Caveat',cursive;color:#DCCBF3;white-space:nowrap")}>{t.sub}</div>
      </div>

      {/* the cassette and its clear case with art option A */}
      <div style={css('position:absolute;left:140px;top:182px;width:470px;height:430px')}>
        <div style={css(`position:absolute;left:${out ? 214 : 30}px;top:150px;width:300px;height:190px;transition:left 600ms cubic-bezier(0.34,1.56,0.64,1)`)}>
          <div style={css('position:absolute;inset:0;border-radius:10px;background:#F4F2F7;box-shadow:0 4px 10px rgba(0,0,0,.45)')} />
          <div style={css('position:absolute;left:14px;top:14px;right:14px;height:86px;border-radius:4px;background:#FFFFFF;display:flex;align-items:center;gap:10px;padding:0 12px;background-image:repeating-linear-gradient(180deg,transparent 0 21px,rgba(142,167,201,.35) 21px 22px)')}>
            <div style={css("width:28px;height:28px;border-radius:50%;background:#204670;color:#FFFFFF;font:700 15px/28px 'DM Sans',sans-serif;text-align:center")}>A</div>
            <span style={css("font:600 34px/1 'Caveat',cursive;color:#204670")}>{t.forName}</span>
          </div>
          <div style={css('position:absolute;left:60px;top:110px;width:180px;height:50px;border-radius:25px;background:#1C1828;display:flex;align-items:center;justify-content:space-between;padding:0 12px')}>
            {[0, 1].map(i => (
              <React.Fragment key={i}>
                <div style={css(`width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#1C1828 0 5px,transparent 5.5px),repeating-conic-gradient(#1C1828 0 14deg,#E9E4EF 14deg 60deg);animation:${playing ? 'nh-rec 2.4s linear infinite' : 'none'}`)} />
                {i === 0 ? <div style={css('flex:1;height:18px;margin:0 8px;background:linear-gradient(90deg,#3E2E2A,#5C4436)')} /> : null}
              </React.Fragment>
            ))}
          </div>
          <div style={css('position:absolute;left:80px;bottom:0;width:140px;height:16px;background:#D6D2DE;clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)')} />
        </div>
        <div style={css('position:absolute;left:0;top:0;width:330px;height:430px;border-radius:6px;background:linear-gradient(135deg,rgba(255,255,255,.4),rgba(255,255,255,.12) 40%,rgba(255,255,255,.28));box-shadow:0 0 0 2px rgba(255,255,255,.55),0 8px 22px rgba(0,0,0,.5);padding:14px 14px 14px 30px')}>
          <div style={css('position:absolute;left:0;top:0;bottom:0;width:22px;border-radius:6px 0 0 6px;background:#204670;display:flex;align-items:center;justify-content:center')}>
            <span style={css("writing-mode:vertical-rl;transform:rotate(180deg);font:700 9px/1 'Courier Prime',monospace;letter-spacing:.16em;color:#FFFFFF;white-space:nowrap")}>{t.spine}</span>
          </div>
          <div style={css('position:relative;width:100%;height:100%;overflow:hidden;border-radius:2px;background:#F2EEF8')}>
            <div style={css('position:absolute;inset:0;background:url(/media/textures/grain.png) 0 0/128px 128px;opacity:.9')} />
            <div style={css('position:absolute;left:62px;top:84px;width:170px;height:212px;background:repeating-linear-gradient(135deg,#C9C6CF 0 10px,#BDB9C4 10px 20px);border:5px solid #FFFFFF;transform:rotate(-2deg);box-shadow:0 2px 6px rgba(19,15,31,.3);display:flex;align-items:flex-end;padding:6px;overflow:hidden')}>
              {art[0] ? <Photo src={art[0]} alt={site.name} sizes="340px" style={{ filter: 'grayscale(1)' }} /> : <span style={css("font:400 10px/1.2 'Courier Prime',monospace;color:#3D4A66;background:rgba(255,255,255,.8);padding:2px 4px")}>portrait · b/w · 4:5</span>}
            </div>
            <ArtPhoto file={art[1]} stripes="repeating-linear-gradient(135deg,#ACBFD3 0 8px,#B9CADB 8px 16px)" style={css('left:10px;top:52px;width:84px;height:84px;transform:rotate(-8deg)')} />
            <ArtPhoto file={art[2]} stripes="repeating-linear-gradient(135deg,#CFC1E8 0 8px,#DAD0EE 8px 16px)" style={css('left:206px;top:60px;width:78px;height:96px;transform:rotate(7deg)')} />
            <ArtPhoto file={art[3]} stripes="repeating-linear-gradient(135deg,#CFC1E8 0 8px,#DAD0EE 8px 16px)" style={css('left:16px;top:250px;width:90px;height:72px;transform:rotate(5deg)')} />
            <ArtPhoto file={art[4]} stripes="repeating-linear-gradient(135deg,#ACBFD3 0 8px,#B9CADB 8px 16px)" style={css('left:200px;top:240px;width:80px;height:80px;transform:rotate(-6deg)')} />
            <div style={css("position:absolute;left:14px;top:12px;right:12px;font:400 22px/1.1 'Libre Caslon Text',serif;color:#130F1F")}>
              {t.artTitle} <span style={css('background:linear-gradient(180deg,transparent 45%,rgba(196,168,230,.85) 45%,rgba(196,168,230,.85) 88%,transparent 88%);padding:0 2px')}>{t.artName}</span>
            </div>
            <div style={css('position:absolute;left:-30px;top:330px;transform:rotate(-24deg)')}><Sticker kind="happy-birthday" size={190} /></div>
            <div style={css('position:absolute;left:220px;top:140px')}><Sticker kind="headphone-cat" size={70} rotate={8} /></div>
            <div style={css('position:absolute;left:110px;top:300px')}><Sticker kind="vinyl-purple" size={64} rotate={-6} /></div>
            <div style={css('position:absolute;left:4px;top:136px')}><Sticker kind="bow" size={70} rotate={-10} /></div>
            <div style={css("position:absolute;right:12px;bottom:40px;font:600 24px/1 'Caveat',cursive;color:#204670;transform:rotate(-4deg)")}>{t.vol}</div>
            <div style={css("position:absolute;right:12px;bottom:14px;font:400 15px/1 'Kalam',cursive;color:#5E3695")}>{t.date}</div>
            <div style={css("position:absolute;left:150px;top:300px;font:400 14px/1.15 'Kalam',cursive;color:#5E3695;transform:rotate(3deg);width:120px")}>{t.from}</div>
            <div style={css("position:absolute;right:18px;top:44px;font:600 18px/1 'Caveat',cursive;color:#A63A48;transform:rotate(12deg)")}>{nickname}</div>
            <div style={css('position:absolute;left:120px;top:56px;width:34px;height:20px;transform:rotate(-12deg)')}>
              <div style={css('position:absolute;left:0;top:0;width:17px;height:11px;background:#CA9AA1;border-radius:70% 40% 20% 50%;opacity:.85')} />
              <div style={css('position:absolute;right:0;top:0;width:17px;height:11px;background:#CA9AA1;border-radius:40% 70% 50% 20%;opacity:.85')} />
              <div style={css('position:absolute;left:2px;top:9px;width:30px;height:10px;background:#CA9AA1;border-radius:0 0 50% 50%;opacity:.85')} />
            </div>
            <div style={css("position:absolute;right:12px;bottom:70px;font:700 9px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#3D4A66")}>{t.sides}</div>
          </div>
        </div>
      </div>

      {/* the Spotify slot: the real embed sits on top of this card once it loads */}
      <div style={css('position:absolute;left:150px;top:640px;display:flex;align-items:flex-end;gap:16px')}>
        <div style={css('position:relative;width:300px;height:80px;border-radius:10px;background:#121212;box-shadow:0 2px 8px rgba(0,0,0,.4);display:flex;align-items:center;gap:12px;padding:0 12px')}>
          <div style={css('width:56px;height:56px;border-radius:4px;background:repeating-linear-gradient(135deg,#3A3046 0 6px,#33293F 6px 12px)')} />
          <div style={css('flex:1;display:flex;flex-direction:column;gap:6px;min-width:0')}>
            <span style={css("font:700 13px/1 'DM Sans',sans-serif;color:#FFFFFF")}>Spotify</span>
            <span style={css("font:400 11px/1.3 'DM Sans',sans-serif;color:#B3B3B3")}>{unavailable ? t.unavailable : '…'}</span>
          </div>
          <div style={css("position:absolute;left:-10px;top:-16px;padding:4px 10px;background:#FFFFFF;transform:rotate(-3deg);font:700 10px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;box-shadow:0 1px 2px rgba(0,0,0,.3);z-index:60")}>{t.nowOn}</div>
        </div>
        {site.spotifyPlaylistUrl ? (
          <a href={site.spotifyPlaylistUrl} target="_blank" rel="noopener noreferrer" style={css("display:inline-flex;align-items:center;height:44px;padding:0 20px;border-radius:999px;border:1.5px solid #FFFFFF;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#FFFFFF;white-space:nowrap;text-decoration:none")}>{t.save}</a>
        ) : null}
      </div>

      {/* liner notes */}
      <div style={css('position:absolute;left:730px;top:60px;width:500px;height:704px;transform:rotate(1deg);background:#FFFFFF;box-shadow:0 2px 4px rgba(0,0,0,.35),0 14px 30px rgba(0,0,0,.35)')}>
        <div style={css('position:absolute;inset:0;background:url(/media/textures/grain.png) 0 0/128px 128px')} />
        <div style={css('position:absolute;left:50%;top:-22px;margin-left:-20px')}><Fastener kind="binder" /></div>
        <div className="nh-hide-scroll" style={css('position:absolute;inset:26px 26px 0;overflow-y:auto;display:flex;flex-direction:column;gap:2px;padding-bottom:60px')}>
          {!songs.length ? <div style={css("font:600 30px/1.2 'Caveat',cursive;color:#5E3695")}>{t.empty}</div> : null}
          {sides.map(({ side, list }, si) => (
            <React.Fragment key={side}>
              <h2 style={css(`margin:0;font:600 30px/1 'Caveat',cursive;color:#5E3695;padding:${si ? '14px 0 6px' : '0 0 6px'}`)}>{side === 'A' ? t.sideA : t.sideB}</h2>
              {list.map((s, i) => {
                const now = music.song && music.song.id === s.id && playing;
                const hov = hover === s.id && !now;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="nh-btn"
                    disabled={!s.uri}
                    aria-label={`play ${s.title}${s.artist ? ' by ' + s.artist : ''}`}
                    onClick={() => music.playSong(s.id)}
                    onMouseEnter={() => setHover(s.id)}
                    onMouseLeave={() => setHover(null)}
                    style={css(`position:relative;display:grid;grid-template-columns:32px 1fr 26px;gap:10px;padding:10px 10px 10px 8px;border-radius:4px;background:${now ? 'rgba(196,168,230,.35)' : 'transparent'};width:100%;cursor:${s.uri ? 'pointer' : 'default'}`)}
                  >
                    <div style={css("font:700 13px/1.4 'Courier Prime',monospace;color:#204670")}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={css('display:flex;flex-direction:column;gap:3px;min-width:0')}>
                      <div style={css('display:flex;align-items:baseline;gap:8px;min-width:0')}>
                        <span style={css("font:400 18px/1.2 'Libre Caslon Text',serif;color:#130F1F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{s.title}</span>
                        <span style={css("font:400 14px/1.2 'DM Sans',sans-serif;color:#3D4A66;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{s.artist}</span>
                      </div>
                      {s.reason ? <div style={css(`font:400 ${i % 2 ? 18 : 22}px/1.2 '${i % 2 ? 'Kalam' : 'Caveat'}',cursive;color:#204670`)}>{s.reason}</div> : null}
                      {s.pickedByName ? <div style={css("font:700 10px/1 'Courier Prime',monospace;letter-spacing:.1em;color:#3D4A66;text-transform:uppercase")}>{t.pickedBy} {s.pickedByName}</div> : null}
                    </div>
                    <div style={css('display:flex;align-items:center;justify-content:center')}>
                      {now ? <div style={css('width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#C4A8E6 0 3px,#130F1F 3.5px 4px,transparent 4.5px),repeating-radial-gradient(circle,#1C1828 0 1.5px,#2E2640 1.5px 2.5px);animation:nh-rec 1.6s linear infinite')} /> : null}
                      {hov && s.uri ? <div style={css('width:22px;height:22px;border-radius:50%;border:1.5px solid #204670;display:flex;align-items:center;justify-content:center')}><div style={css('width:7px;height:9px;margin-left:2px;background:#204670;clip-path:polygon(0 0,100% 50%,0 100%)')} /></div> : null}
                    </div>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={css('position:absolute;left:0;right:0;bottom:0;height:70px;background:linear-gradient(180deg,rgba(255,255,255,0),#FFFFFF 80%);pointer-events:none')} />
      </div>
      <StickerLayer pageId="playlist" fixed={content.stickers.pages.playlist?.fixed} floorY={784} ui={ui.stickerMenu} />
    </>
  );
}
