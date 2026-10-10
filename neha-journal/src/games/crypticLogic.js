// Streak maths for the daily cryptic (pure functions, so they can be tested with fixed dates).
import { addDays } from '../lib/dates.js';

// the 14 dots: ten days up to and including today, then four future days (as designed)
export function streakDays(today, clues, results) {
  const withClue = new Set(clues.map(c => c.date));
  return Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i - 9);
    let state;
    if (date > today) state = 'future';
    else if (results[date] === 'solved') state = 'solved';
    else if (date === today) state = 'today';
    else state = 'missed'; // includes revealed days: they do not count
    return { date, state, hasClue: withClue.has(date) };
  });
}

// consecutive solved days ending today (or yesterday, if today is not solved yet)
export function currentStreak(today, results) {
  let day = results[today] === 'solved' ? today : addDays(today, -1);
  let n = 0;
  while (results[day] === 'solved') {
    n += 1;
    day = addDays(day, -1);
  }
  return n;
}
