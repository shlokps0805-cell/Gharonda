// If a page fails to load or crashes, show a small note on the journal instead of a blank screen.
// The rest of the site (tabs, player, other pages) keeps working.
import React from 'react';
import { css } from '../design/dc.js';

export default class PageError extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('[page error]', error);
  }

  componentDidUpdate(prev) {
    // moving to another page clears the error
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" style={css('position:absolute;left:400px;top:300px;width:640px;padding:30px 28px 24px;background:#FFFFFF;transform:rotate(-1.5deg);box-shadow:0 2px 4px rgba(19,15,31,.3),0 18px 36px rgba(19,15,31,.25);display:flex;flex-direction:column;gap:16px;align-items:flex-start;z-index:50')}>
        <p style={css("margin:0;font:600 32px/1.15 'Caveat',cursive;color:#204670")}>this page didn’t open properly. try it once more?</p>
        <button type="button" onClick={() => window.location.reload()} style={css("appearance:none;border:1.5px solid #204670;background:#FFFFFF;border-radius:999px;height:40px;padding:0 18px;font:700 12px/1 'Courier Prime',monospace;letter-spacing:.12em;color:#204670;cursor:pointer")}>
          TRY AGAIN
        </button>
      </div>
    );
  }
}
