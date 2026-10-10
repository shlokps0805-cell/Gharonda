// All daily features use India time, so the day changes at midnight IST.
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });

// "YYYY-MM-DD" for the given moment (default: now) in IST
export function todayIST(now = new Date()) {
  return fmt.format(now);
}

// add whole days to a "YYYY-MM-DD" string
export function addDays(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

// "2026-10-11" -> "11.10.2026"
export function dotted(ymd) {
  const [y, m, d] = ymd.split('-');
  return `${d}.${m}.${y}`;
}

// weekday initial for a "YYYY-MM-DD" (M T W T F S S)
export function weekdayInitial(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return 'SMTWTFS'[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// latest entry whose date is on or before today, else the first entry
export function pickByDate(list, today) {
  const sorted = [...list].filter(x => x && x.date).sort((a, b) => a.date.localeCompare(b.date));
  let best = null;
  for (const x of sorted) if (x.date <= today) best = x;
  return best || sorted[0] || list[0] || null;
}
