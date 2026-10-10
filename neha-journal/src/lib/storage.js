// Safe localStorage: every key is prefixed "neha.v1." and stored as JSON.
// If storage is unavailable (private mode, blocked), reads return the fallback
// and writes are silently skipped, so the site still works without saving.
const PREFIX = 'neha.v1.';

export function get(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: carry on without saving */
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
