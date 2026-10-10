// Browser checks: first visit, return visit, navigation, games. Spotify is not reachable in
// tests, so the player shows its calm "unavailable" / "songs coming soon" state.
import { test, expect } from '@playwright/test';

function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|spotify/i.test(m.text())) errors.push(m.text()); });
  return errors;
}
const opened = page => page.addInitScript(() => localStorage.setItem('neha.v1.opened', 'true'));

test('first visit plays the opening, then a reload goes straight to the cover', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await expect(page.getByText('tap the seal')).toBeVisible();
  // the envelope floats gently, so it is never 'stable' for the test robot
  await page.getByRole('button', { name: 'break the seal' }).click({ force: true });
  await expect(page.getByRole('button', { name: 'OPEN YOUR JOURNAL' })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'OPEN YOUR JOURNAL' }).click();
  await expect(page).toHaveURL(/#\/cover\/contents$/);
  expect(await page.evaluate(() => localStorage.getItem('neha.v1.opened'))).toBe('true');
  await page.goto('/');
  await expect(page).toHaveURL(/#\/cover$/);
  await expect(page.getByText('tap the seal')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('every tab opens its section and the hash survives a reload', async ({ page }) => {
  const errors = watchErrors(page);
  await opened(page);
  await page.goto('/#/cover');
  for (const [tab, hash] of [['Timeline', 'timeline'], ['Darkroom', 'darkroom'], ['Wishes', 'wishes'], ['Playlist', 'playlist'], ['Jokes', 'jokes'], ['Games', 'games'], ['Cover', 'cover']]) {
    await page.getByRole('navigation', { name: 'journal sections' }).getByRole('button', { name: tab }).click();
    await expect(page).toHaveURL(new RegExp(`#/${hash}$`));
  }
  await page.goto('/#/jokes');
  await page.reload();
  await expect(page).toHaveURL(/#\/jokes$/);
  await page.goBack();
  expect(errors).toEqual([]);
});

test('timeline era page opens, enlarges a photo and closes with Esc', async ({ page }) => {
  await opened(page);
  await page.goto('/#/timeline');
  await page.getByRole('button', { name: /^2014/ }).first().click();
  await expect(page).toHaveURL(/#\/timeline\/era\/the-beginning$/);
  await page.getByRole('dialog').getByRole('button', { name: /first day, wrong classroom/ }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: /first day, wrong classroom/, pressed: true })).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#\/timeline$/);
});

test('connections: a full win, then a loss on a fresh board', async ({ page }) => {
  await opened(page);
  await page.goto('/#/games/connections');
  const groups = [['CHAI', 'FRIES', 'MANGO', 'NACHOS'], ['DISCO', 'RAIN', 'BIRDS', 'TRUMPET'], ['VINYL', 'CHAIR', 'PLATE', 'PEN'], ['BLORP', 'ZEST', 'FLIM', 'OOF']];
  for (const g of groups) {
    for (const w of g) await page.getByRole('button', { name: w, exact: true }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
  }
  await expect(page.getByText(/solved with no mistakes/)).toBeVisible();
  await page.evaluate(() => localStorage.removeItem('neha.v1.connections.puzzle-1'));
  await page.reload();
  const wrong = [['CHAI', 'DISCO', 'VINYL', 'BLORP'], ['FRIES', 'RAIN', 'CHAIR', 'ZEST'], ['MANGO', 'BIRDS', 'PLATE', 'FLIM'], ['NACHOS', 'TRUMPET', 'PEN', 'OOF']];
  for (const g of wrong) {
    for (const w of g) await page.getByRole('button', { name: w, exact: true }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(350);
    const deselect = page.getByRole('button', { name: 'Deselect all' });
    if (await deselect.count()) await deselect.click();
  }
  await expect(page.getByText(/next time/)).toBeVisible();
});

test('wordle: a win and a loss', async ({ page }) => {
  await opened(page);
  await page.goto('/#/games/wordle');
  await page.waitForTimeout(500);
  for (const w of ['SOLAR', 'MAMMA', 'MANGO']) {
    await page.keyboard.type(w);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }
  await expect(page.getByText('you got it in 3')).toBeVisible();
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('neha.v1.wordle.')).forEach(k => localStorage.removeItem(k)));
  await page.reload();
  await page.waitForTimeout(500);
  await page.keyboard.type('QQQQQ');
  await page.keyboard.press('Enter');
  await expect(page.getByText('not in word list')).toBeVisible();
  for (let i = 0; i < 5; i++) await page.keyboard.press('Backspace');
  for (const w of ['SOLAR', 'MAGIC', 'MANOR', 'MAMBO', 'MANIA', 'MACRO']) {
    await page.keyboard.type(w);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }
  await expect(page.getByText('the word was MANGO')).toBeVisible();
});

test('cryptic: hints unfold one at a time, reveal shows the explanation', async ({ page }) => {
  await opened(page);
  await page.goto('/#/games/cryptic');
  await page.getByRole('button', { name: /TAP TO UNFOLD/ }).click();
  await expect(page.getByText('look at the first word.')).toBeVisible();
  await page.getByRole('button', { name: 'REVEAL' }).click();
  await expect(page.getByText('HOW IT WORKS')).toBeVisible();
});

test('wishes: opening a letter shows the clipping and is remembered', async ({ page }) => {
  await opened(page);
  await page.goto('/#/wishes');
  await page.getByRole('button', { name: /from Friend 2/ }).click();
  await expect(page).toHaveURL(/#\/wishes\/friend-2$/);
  await expect(page.getByText('THE NEHA TIMES')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText('1 OF 12 OPENED')).toBeVisible();
});
