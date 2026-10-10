// Wordle colouring: exact matches are green first, then yellow up to the number of that
// letter still unmatched in the answer, then grey. Returns ['G'|'Y'|'X', ...].
export function scoreGuess(guess, answer) {
  const g = [...guess];
  const a = [...answer];
  const result = Array(g.length).fill('X');
  const left = {};
  a.forEach((ch, i) => {
    if (g[i] === ch) result[i] = 'G';
    else left[ch] = (left[ch] || 0) + 1;
  });
  g.forEach((ch, i) => {
    if (result[i] === 'G') return;
    if (left[ch] > 0) {
      result[i] = 'Y';
      left[ch] -= 1;
    }
  });
  return result;
}
