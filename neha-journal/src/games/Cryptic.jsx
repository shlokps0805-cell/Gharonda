// Daily cryptic (design: GamesScene "cry-*"): today's clue (India time) with letter boxes,
// Check and Reveal, fold-out hints (three by default, or the clue's own list), an explanation once solved and a 14-day streak.
// Past clues can be played from the streak row. Revealed days do not count for the streak.
import React, { useEffect, useRef, useState } from 'react';
import { css } from '../design/dc.js';
import Fastener from '../design/Fastener.jsx';
import * as storage from '../lib/storage.js';
import { todayIST, dotted, weekdayInitial, pickByDate } from '../lib/dates.js';
import { streakDays, currentStreak } from './crypticLogic.js';

// the clue with the definition underlined (hint 1), the wordplay tinted (hint 2)
// and the hidden answer lit up once solved
function ClueText({ clue, hints, solved }) {
  const text = clue.clue;
  const marks = [];
  const mark = (part, kind) => { const at = part ? text.indexOf(part) : -1; if (at >= 0) marks.push({ at, end: at + part.length, kind }); };
  if (hints >= 1) mark(clue.definition, 'def');
  if (hints >= 2) mark(clue.highlight, 'hl');
  if (solved) mark(clue.hidden, 'hid');
  const cuts = [...new Set([0, text.length, ...marks.flatMap(m => [m.at, m.end])])].sort((a, b) => a - b);
  const pieces = [];
  for (let k = 0; k < cuts.length - 1; k++) {
    const a = cuts[k], b = cuts[k + 1];
    const on = marks.filter(m => m.at <= a && m.end >= b).map(m => m.kind);
    const st = {};
    if (on.includes('def')) Object.assign(st, css('text-decoration:underline;text-decoration-color:#5E3695;text-decoration-thickness:3px;text-underline-offset:6px'));
    if (on.includes('hl')) st.background = 'rgba(196,168,230,.25)';
    if (on.includes('hid')) st.background = 'rgba(196,168,230,.7)';
    pieces.push(<span key={k} style={st}>{text.slice(a, b)}</span>);
  }
  return <>{pieces}</>;
}

export default function Cryptic({ content, ui, reduced }) {
  const clues = content.cryptic;
  const today = todayIST();
  const [date, setDate] = useState(() => (pickByDate(clues, today) || {}).date);
  const clue = clues.find(c => c.date === date);
  const [results, setResults] = useState(() => storage.get('cryptic.results', {}));
  if (!clue) return <div style={css("position:absolute;left:160px;top:240px;font:600 34px/1 'Caveat',cursive;color:#5E3695")}>{ui.none}</div>;
  return <Clue key={clue.date} clue={clue} clues={clues} ui={ui} reduced={reduced} today={today} results={results} setResults={setResults} onPick={setDate} />;
}

function Clue({ clue, clues, ui, reduced, today, results, setResults, onPick }) {
  const n = clue.answer.length;
  const [letters, setLetters] = useState(() => (results[clue.date] ? [...clue.answer] : Array(n).fill('')));
  const [hints, setHints] = useState(() => storage.get('cryptic.hints.' + clue.date, 0));
  const [shown, setShown] = useState(() => storage.get('cryptic.letters.' + clue.date, 0)); // letters given by a letters hint
  const [open, setOpen] = useState(-1); // which unfolded hint is being read
  const [wrong, setWrong] = useState(null); // indexes of wrong letters after Check
  const [shake, setShake] = useState(false);
  const boxes = useRef([]);
  const status = results[clue.date]; // 'solved' | 'revealed' | undefined
  const finished = !!status;

  useEffect(() => { storage.set('cryptic.hints.' + clue.date, hints); }, [hints, clue.date]);
  useEffect(() => { storage.set('cryptic.letters.' + clue.date, shown); }, [shown, clue.date]);
  const total = clue.hints.length;
  const reading = open >= 0 && open < hints ? open : hints - 1;
  // a letters hint fills the boxes from the left, one letter per tap
  const giveLetter = () => {
    const next = Math.min(n, shown + 1);
    setShown(next);
    setLetters(l => { const c = [...l]; for (let k = 0; k < next; k++) c[k] = clue.answer[k]; return c; });
  };
  const unfold = i => {
    if (i < hints) { if (clue.hints[i].letters && i === reading && !finished && shown < n) giveLetter(); setOpen(i); return; }
    setHints(h => Math.min(total, h + 1));
    setOpen(i);
    if (clue.hints[i].letters && !finished) giveLetter();
  };
  useEffect(() => { if (!finished) boxes.current[0] && boxes.current[0].focus({ preventScroll: true }); }, [finished]);

  const finish = kind => {
    const next = { ...results, [clue.date]: kind };
    storage.set('cryptic.results', next);
    setResults(next);
  };
  const type = (i, value) => {
    const ch = value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
    setWrong(null);
    setLetters(l => { const c = [...l]; c[i] = ch; return c; });
    if (ch && i < n - 1) boxes.current[i + 1].focus();
  };
  const key = (i, e) => {
    if (e.key === 'Backspace' && !letters[i] && i > 0) { boxes.current[i - 1].focus(); setLetters(l => { const c = [...l]; c[i - 1] = ''; return c; }); e.preventDefault(); }
    if (e.key === 'ArrowLeft' && i > 0) boxes.current[i - 1].focus();
    if (e.key === 'ArrowRight' && i < n - 1) boxes.current[i + 1].focus();
    if (e.key === 'Enter') check();
  };
  const check = () => {
    const bad = letters.map((ch, i) => (ch !== clue.answer[i] ? i : -1)).filter(i => i >= 0);
    if (!bad.length) { finish('solved'); return; }
    setWrong(bad);
    setShake(true);
    setTimeout(() => setShake(false), 320);
  };
  const reveal = () => { setLetters([...clue.answer]); setHints(total); finish('revealed'); };

  const days = streakDays(today, clues, results);
  const streak = currentStreak(today, results);
  const isToday = clue.date === today;
  const titles = ui.hintTitles || [];

  return (
    <>
      <div style={css('position:absolute;left:160px;top:200px;width:620px;display:flex;flex-direction:column;gap:20px')}>
        <div style={css('position:relative;transform:rotate(-1deg);padding:42px 40px 30px;background:#FFFFFF;box-shadow:0 1px 2px rgba(19,15,31,.25),0 10px 20px rgba(19,15,31,.12);display:flex;flex-direction:column;gap:20px')}>
          <div style={css('position:absolute;left:50%;top:-22px;margin-left:-20px')}><Fastener kind="binder" /></div>
          <div style={css('display:flex;justify-content:space-between')}>
            <span style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#5E3695")}>{isToday ? `${ui.today} · ` : ''}{dotted(clue.date)}</span>
            {clue.par ? <span style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#3D4A66")}>{ui.par} {clue.par}</span> : null}
            {clue.number ? <span style={css("font:700 12px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#3D4A66")}>{ui.clueNo} {clue.number}</span> : null}
          </div>
          <div style={css("font:400 36px/1.25 'Libre Caslon Text',serif;color:#130F1F")}><ClueText clue={clue} hints={hints} solved={finished} /></div>
          <div style={{ ...css('display:flex;gap:8px;flex-wrap:wrap'), animation: shake ? 'nh-shake 300ms ease-in-out' : 'none' }}>
            {letters.map((ch, i) => (
              <input
                key={i}
                ref={el => { boxes.current[i] = el; }}
                value={ch}
                disabled={finished || i < shown}
                inputMode="text"
                autoComplete="off"
                aria-label={`letter ${i + 1} of ${n}`}
                onChange={e => type(i, e.target.value)}
                onKeyDown={e => key(i, e)}
                onFocus={e => e.target.select()}
                style={css(`width:${n > 8 ? 52 : 66}px;height:${n > 8 ? 52 : 66}px;border-radius:4px;margin-right:${clue.breaks.includes(i + 1) ? 18 : 0}px;background:${finished || i < shown ? '#ECE3F8' : '#FFFFFF'};border:1.5px solid ${wrong && wrong.includes(i) ? '#A63A48' : '#130F1F'};text-align:center;font:700 32px/1 'DM Sans',sans-serif;color:#130F1F;text-transform:uppercase;padding:0;outline-offset:2px`)}
              />
            ))}
          </div>
          {!finished ? (
            <div style={css('display:flex;align-items:center;gap:12px')}>
              <button type="button" className="nh-btn" onClick={check} style={css("height:44px;padding:0 24px;border-radius:999px;background:#204670;display:flex;align-items:center;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#FFFFFF;cursor:pointer")}>{ui.check}</button>
              <button type="button" className="nh-btn" onClick={reveal} style={css("height:44px;padding:0 22px;border-radius:999px;border:1.5px solid #204670;display:flex;align-items:center;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;cursor:pointer")}>{ui.reveal}</button>
            </div>
          ) : (
            <>
              <div role="status" style={css("font:600 28px/1 'Caveat',cursive;color:#5E3695")}>{status === 'solved' ? ui.solved : ui.revealed}</div>
              <div style={{ ...css('display:grid;grid-template-columns:auto 1fr;gap:8px 16px;padding:18px;border-radius:4px;background:#ECE8F2;transform-origin:50% 0'), animation: reduced ? 'none' : 'nh-unfold 400ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
                {clue.definition ? <><span style={css("font:700 11px/1.5 'Courier Prime',monospace;letter-spacing:.1em;color:#5E3695")}>{ui.definition}</span><span style={css("font:400 17px/1.4 'DM Sans',sans-serif;color:#130F1F")}>{clue.definition.toLowerCase()}</span></> : null}
                {clue.wordplay ? <><span style={css("font:700 11px/1.5 'Courier Prime',monospace;letter-spacing:.1em;color:#5E3695")}>{ui.wordplay}</span><span style={css("font:400 17px/1.4 'DM Sans',sans-serif;color:#130F1F")}>{clue.wordplay}</span></> : null}
                {clue.explanation ? <><span style={css("font:700 11px/1.5 'Courier Prime',monospace;letter-spacing:.1em;color:#5E3695")}>{ui.how}</span><span style={css("font:400 17px/1.4 'DM Sans',sans-serif;color:#130F1F")}>{clue.explanation}</span></> : null}
              </div>
            </>
          )}
        </div>
        {/* the folded hint strip: each click unfolds the next fold; an unfolded one can be read again */}
        <div style={css('display:flex;flex-direction:column;gap:8px')}>
          <div style={css('display:flex;gap:6px')}>
            {clue.hints.map((h, i) => {
              const isOpen = i < hints;
              const next = i === hints && !finished;
              return (
                <button
                  key={i}
                  type="button"
                  className="nh-btn"
                  disabled={!isOpen && !next}
                  aria-expanded={isOpen && i === reading}
                  onClick={() => unfold(i)}
                  style={css(`flex:1;min-height:44px;padding:10px 12px;background:${isOpen && i === reading ? '#FFFFFF' : next ? '#ECE8F2' : isOpen ? '#FBF9F5' : '#F4F2F7'};border-radius:2px;box-shadow:0 1px 2px rgba(19,15,31,.18);transform:${isOpen ? 'none' : i % 2 ? 'skewY(-1deg)' : 'skewY(1deg)'};display:flex;align-items:center;cursor:${isOpen || next ? 'pointer' : 'default'}`)}
                >
                  <span style={css("font:700 11px/1.3 'Courier Prime',monospace;letter-spacing:.1em;color:#4A3560;text-align:left")}>{ui.hint} {i + 1} · {isOpen ? h.title || titles[i] || '' : next ? ui.tapToUnfold : ui.folded}</span>
                </button>
              );
            })}
          </div>
          {reading >= 0 ? (
            <div key={reading} style={{ ...css('padding:14px 18px;background:#FFFFFF;border-radius:2px;box-shadow:0 1px 2px rgba(19,15,31,.18);display:flex;flex-direction:column;gap:10px;transform-origin:50% 0'), animation: reduced ? 'none' : 'nh-unfold 300ms ease-out both' }}>
              {clue.hints[reading].text ? <span style={css("font:400 16px/1.45 'DM Sans',sans-serif;color:#204670")}>{clue.hints[reading].text}</span> : null}
              {clue.hints[reading].letters ? (
                <div style={css('display:flex;align-items:center;gap:12px')}>
                  <span style={css("font:700 13px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#204670")}>{shown} / {n}</span>
                  {!finished && shown < n ? <button type="button" className="nh-btn" onClick={giveLetter} style={css("height:34px;padding:0 16px;border-radius:999px;border:1.5px solid #204670;display:flex;align-items:center;font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;cursor:pointer")}>{ui.anotherLetter}</button> : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div style={css('position:absolute;left:840px;top:220px;width:360px;display:flex;flex-direction:column;gap:12px')}>
        <div style={css('display:flex;justify-content:space-between;align-items:baseline')}>
          <span style={css("font:700 13px/1 'Courier Prime',monospace;letter-spacing:.14em;color:#204670")}>{ui.streak} {streak}</span>
          <span style={css("font:400 12px/1 'Courier Prime',monospace;color:#3D4A66")}>{ui.last14}</span>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(7,1fr);gap:8px')}>
          {days.map(d => {
            const playable = d.hasClue && d.state !== 'future';
            const filled = d.state === 'solved';
            return (
              <button key={d.date} type="button" className="nh-btn" disabled={!playable} onClick={() => onPick(d.date)} aria-label={`${dotted(d.date)} ${d.state}`} style={css(`display:flex;flex-direction:column;align-items:center;gap:4px;opacity:${d.state === 'future' ? 0.4 : 1};cursor:${playable ? 'pointer' : 'default'}`)}>
                <div style={css(`width:34px;height:34px;border-radius:50%;background:${filled ? '#C4A8E6' : '#FFFFFF'};border:2px solid ${d.date === today ? '#204670' : filled ? '#A57BD5' : '#C9C3D2'};box-shadow:${d.date === clue.date ? '0 0 0 3px rgba(165,123,213,.35)' : 'none'}`)} />
                <span style={css("font:700 10px/1 'Courier Prime',monospace;color:#3D4A66")}>{weekdayInitial(d.date)}</span>
              </button>
            );
          })}
        </div>
        <div style={css("display:flex;gap:14px;font:400 12px/1.4 'Courier Prime',monospace;color:#3D4A66")}>
          {(ui.legend || []).map((l, i) => <span key={i} style={i === 3 ? { opacity: 0.5 } : undefined}>{l}</span>)}
        </div>
      </div>
    </>
  );
}

