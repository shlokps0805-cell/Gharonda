// The mini player, bottom-left, wired to the music engine. Slides in from the left edge.
import React from 'react';
import MiniPlayer from '../design/MiniPlayer.jsx';
import { useMusic } from '../music/MusicContext.jsx';

export default function PlayerDock({ ui, show, slideIn, noteColor }) {
  const m = useMusic();
  if (!show) return null;
  let state = 'paused';
  if (m.status === 'playing') state = 'playing';
  else if (m.status === 'press') state = m.needsSpotifyTap ? 'paused' : 'press'; // Spotify's own player is shown instead
  else if (m.status === 'unavailable' || m.status === 'nosongs') state = 'unavailable';
  const title = !m.hasSongs ? ui.noSongs : m.status === 'unavailable' ? ui.unavailable : m.song ? `${m.song.title}${m.song.artist ? ' · ' + m.song.artist : ''}` : '';
  const picked = m.song && m.song.pickedByName ? `${ui.pickedBy} ${m.song.pickedByName}` : '';
  // when the music is unavailable the play button just retries; it never breaks anything
  return (
    <div data-player style={{ position: 'absolute', left: 24, top: 796, zIndex: 70, animation: slideIn ? 'nh-slide-in-left 450ms cubic-bezier(0.34,1.56,0.64,1) both' : undefined }}>
      <MiniPlayer
        ui={ui}
        state={state}
        muted={m.muted}
        title={title}
        picked={picked}
        noteColor={noteColor}
        onToggle={m.status === 'press' ? m.start : m.toggle}
        onNext={m.next}
        onPrev={m.prev}
        onMute={m.toggleMute}
      />
    </div>
  );
}
