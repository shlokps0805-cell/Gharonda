// Connections, the Neha edition (design: GamesScene "conn-*"), in the original colours.
// Select four tiles and Submit; four mistakes allowed. Progress is saved per puzzle.
import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { css } from '../design/dc.js';
import * as storage from '../lib/storage.js';

const GR = '#EFEFE6', DK = '#5A594E';
const MAX_MISTAKES = 4;
const PALETTE = ['#FFFFFF', '#CED9E4', '#C4A8E6', '#5E3695', '#DEC0C4'];

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function Connections({ content, ui, reduced }) {
  const puzzles = content.connections;
  const [pi, setPi] = useState(puzzles.length - 1); // the newest puzzle is last in the file
  const puzzle = puzzles[pi];
  if (!puzzle) return <div style={css("position:absolute;left:408px;top:240px;font:600 30px/1 'Caveat',cursive;color:#5E3695")}>…</div>;
  return <Board key={puzzle.id} puzzle={puzzle} ui={ui} reduced={reduced} nav={{ pi, count: puzzles.length, setPi }} />;
}

function Board({ puzzle, ui, reduced, nav }) {
  const key = 'connections.' + puzzle.id;
  const saved = storage.get(key, null);
  const [solved, setSolved] = useState(saved ? saved.solved : []); // levels, in solve order
  const [mistakes, setMistakes] = useState(saved ? saved.mistakes : 0);
  const [guesses, setGuesses] = useState(saved ? saved.guesses : []);
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState('');
  const [shake, setShake] = useState(false);
  const allWords = useMemo(() => puzzle.groups.flatMap(g => g.words), [puzzle]);
  const [order, setOrder] = useState(() => shuffle(allWords)); // shuffled on load

  const lost = mistakes >= MAX_MISTAKES;
  const done = solved.length === 4 || lost;
  const solvedWords = new Set(puzzle.groups.filter(g => solved.includes(g.level)).flatMap(g => g.words));
  const bars = lost ? [...solved, ...puzzle.groups.map(g => g.level).filter(l => !solved.includes(l))] : solved;
  const tiles = done ? [] : order.filter(w => !solvedWords.has(w));

  useEffect(() => { storage.set(key, { solved, mistakes, guesses }); }, [key, solved, mistakes, guesses]);
  useEffect(() => {
    if (solved.length === 4 && !reduced) confetti({ particleCount: 90, spread: 80, startVelocity: 40, origin: { x: 0.5, y: 0.5 }, colors: PALETTE, disableForReducedMotion: true });
  }, [solved.length, reduced]);

  const say = msg => { setToast(msg); setTimeout(() => setToast(''), 1800); };
  const toggle = w => {
    if (done) return;
    setSelected(s => (s.includes(w) ? s.filter(x => x !== w) : s.length < 4 ? [...s, w] : s));
  };
  const submit = () => {
    if (selected.length !== 4) return;
    const sig = [...selected].sort().join('|');
    if (guesses.includes(sig)) { say(ui.already); return; }
    setGuesses(g => [...g, sig]);
    const match = puzzle.groups.find(g => g.words.every(w => selected.includes(w)));
    if (match) {
      setSolved(s => [...s, match.level]);
      setSelected([]);
      return;
    }
    const oneAway = puzzle.groups.some(g => g.words.filter(w => selected.includes(w)).length === 3);
    setMistakes(m => m + 1);
    setShake(true);
    setTimeout(() => setShake(false), 320);
    if (oneAway) say(ui.oneAway);
  };

  const rows = Math.ceil(tiles.length / 4);
  const belowY = 212 + bars.length * 88 + rows * 88 + 10;
  const subOn = selected.length === 4;
  const doneText = lost ? ui.lost : mistakes === 0 ? ui.solvedZero : mistakes === 1 ? ui.solvedOne : ui.solved.replace('{n}', mistakes);

  return (
    <>
      <div style={css("position:absolute;left:408px;top:186px;width:624px;text-align:center;font:400 16px/1 'DM Sans',sans-serif;color:#130F1F")}>{ui.intro}</div>
      <div style={css('position:absolute;left:408px;top:212px;width:624px;display:flex;flex-direction:column;gap:8px')}>
        {bars.map(level => {
          const g = puzzle.groups.find(x => x.level === level);
          return (
            <div key={level} style={css(`height:80px;border-radius:8px;background:${g.colour};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;animation:${reduced ? 'none' : 'nh-pop 450ms cubic-bezier(0.34,1.56,0.64,1)'}`)}>
              <div style={css("font:700 17px/1 'DM Sans',sans-serif;color:#000000;letter-spacing:.02em;text-transform:uppercase")}>{g.name}</div>
              <div style={css("font:400 16px/1 'DM Sans',sans-serif;color:#000000")}>{g.words.join(', ')}</div>
            </div>
          );
        })}
        <div style={css('display:grid;grid-template-columns:repeat(4,150px);gap:8px')}>
          {tiles.map(w => {
            const on = selected.includes(w);
            return (
              <button key={w} type="button" className="nh-btn" aria-pressed={on} onClick={() => toggle(w)} style={css(`height:80px;border-radius:8px;background:${on ? DK : GR};display:flex;align-items:center;justify-content:center;font:700 ${w.length > 9 ? 13 : 17}px/1.1 'DM Sans',sans-serif;letter-spacing:.02em;color:${on ? '#FFFFFF' : '#000000'};text-align:center;padding:0 6px;transition:background 120ms;animation:${shake && on ? 'nh-shake 300ms ease-in-out' : 'none'};cursor:pointer`)}>
                {w}
              </button>
            );
          })}
        </div>
      </div>
      <div style={css(`position:absolute;left:408px;top:${belowY}px;width:624px;display:flex;flex-direction:column;align-items:center;gap:14px`)}>
        {toast ? <div role="status" style={css("position:absolute;top:-64px;padding:10px 16px;border-radius:6px;background:#000000;font:700 15px/1 'DM Sans',sans-serif;color:#FFFFFF;animation:nh-pop 120ms ease-out")}>{toast}</div> : null}
        {!done ? (
          <>
            <div style={css('display:flex;align-items:center;gap:10px')}>
              <span style={css("font:400 15px/1 'DM Sans',sans-serif;color:#000000")}>{ui.mistakes}</span>
              {[0, 1, 2, 3].map(i => <div key={i} aria-hidden="true" style={css(`width:14px;height:14px;border-radius:50%;background:${i < MAX_MISTAKES - mistakes ? DK : GR}`)} />)}
              <span className="sr-only">{MAX_MISTAKES - mistakes}</span>
            </div>
            <div style={css('display:flex;gap:10px')}>
              <button type="button" className="nh-btn" onClick={() => setOrder(o => shuffle(o))} style={css("height:46px;padding:0 22px;border-radius:999px;border:1.5px solid #000000;display:flex;align-items:center;font:600 15px/1 'DM Sans',sans-serif;color:#000000;background:#FFFFFF;cursor:pointer")}>{ui.shuffle}</button>
              <button type="button" className="nh-btn" onClick={() => setSelected([])} style={css("height:46px;padding:0 22px;border-radius:999px;border:1.5px solid #000000;display:flex;align-items:center;font:600 15px/1 'DM Sans',sans-serif;color:#000000;background:#FFFFFF;cursor:pointer")}>{ui.deselect}</button>
              <button type="button" className="nh-btn" disabled={!subOn} onClick={submit} style={css(`height:46px;padding:0 24px;border-radius:999px;background:${subOn ? '#000000' : '#FFFFFF'};border:1.5px solid ${subOn ? '#000000' : '#8A8A8A'};display:flex;align-items:center;font:600 15px/1 'DM Sans',sans-serif;color:${subOn ? '#FFFFFF' : '#8A8A8A'};cursor:${subOn ? 'pointer' : 'default'}`)}>{ui.submit}</button>
            </div>
          </>
        ) : (
          <div role="status" style={css("font:600 30px/1 'Caveat',cursive;color:#5E3695;text-align:center")}>{doneText}</div>
        )}
        {nav.count > 1 ? (
          <div style={css('display:flex;gap:16px;align-items:center')}>
            <button type="button" className="nh-btn" disabled={nav.pi === 0} onClick={() => nav.setPi(nav.pi - 1)} aria-label={ui.older} style={css(`font:700 18px/1 'DM Sans',sans-serif;color:${nav.pi === 0 ? '#C9C3D2' : '#204670'};cursor:pointer`)}>←</button>
            <span style={css("font:700 11px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#3D4A66")}>{nav.pi + 1} / {nav.count}</span>
            <button type="button" className="nh-btn" disabled={nav.pi === nav.count - 1} onClick={() => nav.setPi(nav.pi + 1)} aria-label={ui.newer} style={css(`font:700 18px/1 'DM Sans',sans-serif;color:${nav.pi === nav.count - 1 ? '#C9C3D2' : '#204670'};cursor:pointer`)}>→</button>
          </div>
        ) : null}
      </div>
    </>
  );
}
