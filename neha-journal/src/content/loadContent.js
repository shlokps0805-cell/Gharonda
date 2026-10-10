// Loads every content file at build time and passes it through the validators.
// Components never import content files directly; they get `content` from here.
import site from '../../content/site.json';
import friends from '../../content/friends.json';
import timeline from '../../content/timeline.json';
import darkroom from '../../content/darkroom.json';
import wishes from '../../content/wishes.json';
import songs from '../../content/songs.json';
import jokes from '../../content/jokes.json';
import stickers from '../../content/stickers.json';
import ui from '../../content/ui-text.json';
import connections from '../../content/games/connections.json';
import wordle from '../../content/games/wordle.json';
import cryptic from '../../content/games/cryptic.json';
import world from '../../content/games/neha-world.json';
import { validateAll } from './validators.js';

// content/wishes/<friend-id>.md, as raw text
const wishFiles = import.meta.glob('../../content/wishes/*.md', { query: '?raw', import: 'default', eager: true });
// content/generated/photos-<id>.json, written by `npm run images` for "photosFromFolder"
const generatedFiles = import.meta.glob('../../content/generated/photos-*.json', { import: 'default', eager: true });

const fileId = path => path.split('/').pop().replace(/\.(md|json)$/, '').replace(/^photos-/, '');

const wishMarkdown = Object.fromEntries(Object.entries(wishFiles).map(([p, text]) => [fileId(p), text]));
const generated = Object.fromEntries(Object.entries(generatedFiles).map(([p, data]) => [fileId(p), data]));

const { content, warnings } = validateAll({
  site, friends, timeline, darkroom, wishes, songs, jokes, stickers, ui,
  connections, wordle, cryptic, world, wishMarkdown, generated,
});

if (import.meta.env.DEV && warnings.length) {
  console.groupCollapsed(`[content] ${warnings.length} warning(s)`);
  warnings.forEach(w => console.warn(w));
  console.groupEnd();
}

export { warnings };
export default content;
