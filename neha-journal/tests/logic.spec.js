// Pure logic: Wordle colouring, the cryptic streak, IST dates and content validation.
import { test, expect } from '@playwright/test';
import { scoreGuess } from '../src/games/wordleLogic.js';
import { streakDays, currentStreak } from '../src/games/crypticLogic.js';
import { todayIST, addDays, pickByDate } from '../src/lib/dates.js';
import { validateAll, spotifyUri } from '../src/content/validators.js';

test('wordle: greens first, then yellows up to the remaining count', () => {
  expect(scoreGuess('MANGO', 'MANGO').join('')).toBe('GGGGG');
  expect(scoreGuess('SOLAR', 'MANGO').join('')).toBe('XYXYX');
  // repeated letters: only one A is left after the green, so the second A is grey
  expect(scoreGuess('MAMMA', 'MANGO').join('')).toBe('GGXXX');
  expect(scoreGuess('ALLEY', 'LLAMA').join('')).toBe('YGYXX');
  expect(scoreGuess('EERIE', 'THREE').join('')).toBe('YXGXG');
});

test('dates are India time', () => {
  // 18:40 UTC on 10 Oct is already 00:10 on 11 Oct in India
  expect(todayIST(new Date('2026-10-10T18:40:00Z'))).toBe('2026-10-11');
  expect(todayIST(new Date('2026-10-10T18:20:00Z'))).toBe('2026-10-10');
  expect(addDays('2026-10-11', -12)).toBe('2026-09-29');
  const list = [{ date: '2026-10-11', word: 'A' }, { date: '2026-10-13', word: 'B' }];
  expect(pickByDate(list, '2026-10-12').word).toBe('A');
  expect(pickByDate(list, '2026-10-01').word).toBe('A');
  expect(pickByDate(list, '2026-10-20').word).toBe('B');
});

test('cryptic streak counts consecutive solved days only', () => {
  const r = { '2026-10-08': 'solved', '2026-10-09': 'solved', '2026-10-10': 'revealed', '2026-10-11': 'solved' };
  expect(currentStreak('2026-10-11', r)).toBe(1); // revealed breaks it
  expect(currentStreak('2026-10-10', { '2026-10-08': 'solved', '2026-10-09': 'solved' })).toBe(2); // today not done yet
  const days = streakDays('2026-10-11', [{ date: '2026-10-11' }], r);
  expect(days).toHaveLength(14);
  expect(days[9]).toMatchObject({ date: '2026-10-11', state: 'solved', hasClue: true });
  expect(days[8].state).toBe('missed');
  expect(days[13].state).toBe('future');
});

test('broken content is skipped with a warning, never a crash', () => {
  const { content, warnings } = validateAll({
    friends: [{ name: 'Asha' }, { id: 'x' }],
    timeline: [{ name: 'trip', photos: [{ file: 'a.jpg' }, 42] }],
    songs: [{ title: 'Song', spotify: 'https://open.spotify.com/track/abc123?si=1' }, { artist: 'no title' }],
    jokes: [{ text: '' }],
    connections: [{ id: 'p', groups: [{ words: ['A', 'B', 'C', 'D'] }] }],
  });
  expect(content.friends).toHaveLength(1);
  expect(content.friends[0].id).toBe('asha');
  expect(content.friends[0].colour).toMatch(/^#/);
  expect(content.timeline[0].layout).toBe('scrapbook');
  expect(content.timeline[0].photos).toHaveLength(1);
  expect(content.songs[0].uri).toBe('spotify:track:abc123');
  expect(content.jokes).toHaveLength(0);
  expect(content.connections).toHaveLength(0);
  expect(warnings.length).toBeGreaterThan(3);
  expect(spotifyUri('spotify:track:XYZ')).toBe('spotify:track:XYZ');
});
