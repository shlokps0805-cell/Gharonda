// Wordle, the Neha edition (design: GamesScene "wordle-*"), in the original colours.
// The answer is picked by today's date in India time (most recent past entry if today has
// none). On-screen and physical keyboard; the board is saved per date.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '../design/dc.js';
import Fastener from '../design/Fastener.jsx';
import * as storage from '../lib/storage.js';
import { todayIST, pickByDate } from '../lib/dates.js';
import { scoreGuess } from './wordleLogic.js';

const G = '#6AAA64', Y = '#C9B458', X = '#787C7E';
const COLOUR = { G, Y, X };
const ROWS = 6;

export default function Wordle({ content, ui, reduced }) {
  const cfg = content.wordle;
  const today = todayIST();
  const entry = pickByDate(cfg.words, today);
  const answer = entry ? entry.word : '';
  const date = entry ? entry.date || today : today;
  const L = answer.length || 5;
  const key = 'wordle.' + date;

  const [guesses, setGuesses] = useState(() => storage.get(key, { guesses: [] }).guesses || []);
  const [typing, setTyping] = useState('');
  const [toast, setToast] = useState('');
  const [shakeRow, setShakeRow] = useState(false);
  const [revealing, setRevealing] = useState(-1); // row index currently flipping
  const [words, setWords] = useState(null);
  const [copied, setCopied] = useState(false);

  // the allowed-words list is only loaded when Wordle opens
  useEffect(() => {
    let alive = true;
    import('./words5.json').then(m => { if (alive) setWords(new Set(m.default)); });
    return () => { alive = false; };
  }, []);
  useEffect(() => { storage.set(key, { guesses }); }, [key, guesses]);

  const scores = useMemo(() => guesses.map(g => scoreGuess(g, answer)), [guesses, answer]);
  const won = guesses.includes(answer);
  const lost = !won && guesses.length >= ROWS;
  const over = won || lost;

  const say = msg => { setToast(msg); setTimeout(() => setToast(''), 1600); };

  const enter = useCallback(() => {
    if (over || revealing >= 0) return;
    if (typing.length < L) { say(ui.tooShort); setShakeRow(true); setTimeout(() => setShakeRow(false), 320); return; }
    const answers = new Set(cfg.words.map(w => w.word));
    const strict = cfg.strictWordList && L === 5 && words;
    if (strict && !words.has(typing) && !answers.has(typing)) {
      say(ui.notInList);
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 320);
      return;
    }
    const row = guesses.length;
    setGuesses(g => [...g, typing]);
    setTyping('');
    if (!reduced) { setRevealing(row); setTimeout(() => setRevealing(-1), 250 * L + 100); }
  }, [over, revealing, typing, L, cfg, words, guesses.length, reduced, ui]);

  const press = useCallback(k => {
    if (over) return;
    if (k === 'ENTER') return enter();
    if (k === 'BACK') return setTyping(t => t.slice(0, -1));
    if (/^[A-Z]$/.test(k)) setTyping(t => (t.length < L ? t + k : t));
  }, [over, enter, L]);

  useEffect(() => {
    const onKey = e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter') { e.preventDefault(); press('ENTER'); }
      else if (e.key === 'Backspace') press('BACK');
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  // key colours: green beats yellow beats grey (only after the row has flipped)
  const keyState = {};
  guesses.forEach((g, r) => {
    if (r === revealing) return;
    [...g].forEach((ch, i) => {
      const c = scores[r][i], cur = keyState[ch];
      if (cur === 'G' || (cur === 'Y' && c === 'X')) return;
      keyState[ch] = c;
    });
  });

  const cell = 58, gap = 6, gridW = L * cell + (L - 1) * gap;
  const gridX = 717 - gridW / 2;
  const kb = ['QWERTYUIOP', 'ASDFGHJKL', '↵ZXCVBNM⌫'];

  const share = () => {
    const text = `wordle, the neha edition · ${won ? guesses.length : 'X'}/${ROWS}\n` + scores.map(s => s.map(c => (c === 'G' ? '🟩' : c === 'Y' ? '🟨' : '⬜')).join('')).join('\n');
    try { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }); } catch { /* clipboard unavailable */ }
  };

  if (!answer) return null;
  return (
    <>
      <div role="grid" aria-label="wordle board" style={css(`position:absolute;left:${gridX}px;top:180px;display:grid;grid-template-columns:repeat(${L},${cell}px);gap:${gap}px`)}>
        {Array.from({ length: ROWS }, (_, r) => {
          const g = guesses[r];
          const isTyping = r === guesses.length;
          const letters = g || (isTyping ? typing : '');
          return Array.from({ length: L }, (_, i) => {
            const ch = letters[i] || '';
            const sc = g ? scores[r][i] : null;
            const flipping = r === revealing;
            const col = sc ? COLOUR[sc] : null;
            const bounce = won && g === answer && r === guesses.length - 1 && revealing < 0 && !reduced;
            return (
              <div
                key={`${r}-${i}`}
                role="gridcell"
                aria-label={ch ? `${ch}${sc ? (sc === 'G' ? ' correct' : sc === 'Y' ? ' in the word' : ' not in the word') : ''}` : 'empty'}
                style={{
                  ...css(`height:${cell}px;display:flex;align-items:center;justify-content:center;font:700 30px/1 'DM Sans',sans-serif`),
                  background: col || '#FFFFFF',
                  border: `2px solid ${col || (ch ? '#878A8C' : '#D3D6DA')}`,
                  color: col ? '#FFFFFF' : '#000000',
                  animation: flipping ? `nh-flip-tile 250ms ease-in-out ${i * 250}ms both` : bounce ? `nh-bounce 400ms ease-out ${i * 100}ms both` : isTyping && shakeRow ? 'nh-shake 300ms ease-in-out' : 'none',
                }}
              >
                {ch}
              </div>
            );
          });
        })}
      </div>

      {toast ? <div role="status" style={css('position:absolute;left:0;right:0;top:140px;display:flex;justify-content:center;pointer-events:none')}><div style={css("margin-left:-8px;padding:10px 16px;border-radius:6px;background:#000000;font:700 15px/1 'DM Sans',sans-serif;color:#FFFFFF")}>{toast}</div></div> : null}

      <div style={css('position:absolute;left:482px;top:580px;display:flex;flex-direction:column;gap:7px;align-items:center;width:470px')}>
        {kb.map(row => (
          <div key={row} style={css('display:flex;gap:5px')}>
            {[...row].map(k => {
              const big = k === '↵' || k === '⌫';
              const c = COLOUR[keyState[k]];
              const id = k === '↵' ? 'ENTER' : k === '⌫' ? 'BACK' : k;
              return (
                <button key={k} type="button" className="nh-btn" aria-label={id === 'BACK' ? 'backspace' : id.toLowerCase()} onClick={() => press(id)} style={css(`width:${big ? 66 : 40}px;height:52px;border-radius:4px;background:${c || '#D3D6DA'};display:flex;align-items:center;justify-content:center;font:700 ${big ? 12 : 17}px/1 'DM Sans',sans-serif;color:${c ? '#FFFFFF' : '#000000'};cursor:pointer`)}>
                  {k === '↵' ? 'ENTER' : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {over && revealing < 0 ? (
        <div role="status" style={css('position:absolute;left:880px;top:270px;width:300px;padding:22px;background:#FFFFFF;border-radius:6px;box-shadow:0 2px 6px rgba(19,15,31,.2),0 12px 24px rgba(19,15,31,.14);display:flex;flex-direction:column;gap:12px;animation:nh-fade-up 300ms ease-out both;z-index:25')}>
          <div style={css("font:400 26px/1.1 'Libre Caslon Text',serif;color:#130F1F")}>{won ? ui.won.replace('{n}', guesses.length) : ui.lost.replace('{word}', answer)}</div>
          <div style={css('display:flex;flex-direction:column;gap:3px')} aria-hidden="true">
            {scores.map((s, r) => <div key={r} style={css('display:flex;gap:3px')}>{s.map((c, i) => <div key={i} style={css(`width:20px;height:20px;border-radius:2px;background:${COLOUR[c]}`)} />)}</div>)}
          </div>
          <div style={css("font:600 22px/1.1 'Caveat',cursive;color:#5E3695")}>{won ? ui.wonLine : ui.lostLine}</div>
          {entry.note ? <div style={css("font:600 26px/1.15 'Caveat',cursive;color:#320F6F")}>{entry.note}</div> : null}
          <button type="button" className="nh-btn" onClick={share} style={css(`align-self:flex-start;height:40px;padding:0 18px;border-radius:999px;background:${G};display:flex;align-items:center;font:700 14px/1 'DM Sans',sans-serif;color:#FFFFFF;cursor:pointer`)}>{copied ? ui.copied : ui.copy}</button>
        </div>
      ) : null}

      {cfg.hint ? (
        <div style={css("position:absolute;left:160px;top:270px;width:220px;padding:20px 18px 16px;background:#FFFFFF;transform:rotate(-2deg);box-shadow:0 1px 2px rgba(19,15,31,.22),0 6px 12px rgba(19,15,31,.12);font:400 21px/1.3 'Kalam',cursive;color:#204670")}>
          {cfg.hint}
          <div style={css('position:absolute;right:20px;top:-14px')}><Fastener kind="paperclip" rotate={8} /></div>
        </div>
      ) : null}
    </>
  );
}
