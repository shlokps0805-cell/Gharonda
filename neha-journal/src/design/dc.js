// Tiny runtime for components ported from Claude Design.
//
// Each design file had a `class Component extends DCLogic` with a renderVals()
// method plus an HTML template. We keep that logic exactly as designed:
// a ported component extends DC, keeps renderVals(), and gets a template(v)
// method holding the original markup as JSX. `v` is the props merged with
// renderVals(), the same as in the design tool.
import React from 'react';

export class DC extends React.Component {
  renderVals() {
    return {};
  }
  template() {
    return null;
  }
  render() {
    return this.template({ ...this.props, ...this.renderVals() });
  }
}

// css('position:absolute;left:4px') -> { position: 'absolute', left: '4px' }
// Lets the ported markup keep the design's inline style strings verbatim.
const cache = new Map();

export function css(str) {
  if (!str) return undefined;
  const hit = cache.get(str);
  if (hit) return hit;
  const out = {};
  for (const decl of splitDecls(str)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || value === '' || value === 'undefined') continue;
    out[toCamel(prop)] = value;
  }
  if (cache.size > 4000) cache.clear();
  cache.set(str, out);
  return out;
}

function toCamel(prop) {
  if (prop.startsWith('--')) return prop;
  if (prop.startsWith('-webkit-')) prop = 'Webkit-' + prop.slice(8);
  return prop.replace(/-(\w)/g, (m, c) => c.toUpperCase());
}

// split on ';' that are not inside brackets or quotes (data: URLs, gradients)
function splitDecls(str) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) {
      parts.push(str.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(str.slice(start));
  return parts;
}
