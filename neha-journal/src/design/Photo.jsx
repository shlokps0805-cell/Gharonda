// A photo filling its frame. Uses the optimized WebP versions made by `npm run images`
// (800 and 1600 px) when they exist, and falls back to the original file.
// If the image fails to load, it hides itself so the frame's soft placeholder shows instead.
import React, { useState } from 'react';

const manifests = import.meta.glob('../../content/generated/optimized.json', { import: 'default', eager: true });
const optimized = new Set(Object.values(manifests)[0] || []);
// photos keep their file names when replaced, so each build adds its own ?v= to their links
const V = typeof __MEDIA_VERSION__ === 'string' ? `?v=${__MEDIA_VERSION__}` : '';

export function mediaUrl(file) {
  if (!file) return '';
  if (/^(https?:)?\/\//.test(file) || file.startsWith('/')) return file;
  return '/media/' + file + V;
}

export function srcSet(file) {
  if (!optimized.has(file)) return undefined;
  const base = '/media/optimized/' + file.replace(/\.[^.]+$/, '');
  return `${base}-800.webp${V} 800w, ${base}-1600.webp${V} 1600w`;
}

export default function Photo({ src, alt = '', sizes = '600px', style, eager = false, onLoad }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return null;
  return (
    <img
      src={mediaUrl(src)}
      srcSet={srcSet(src)}
      sizes={srcSet(src) ? sizes : undefined}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
      onLoad={onLoad}
      onError={() => setBroken(true)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
    />
  );
}
