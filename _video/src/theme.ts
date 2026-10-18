import type React from 'react';
import { loadFont } from '@remotion/google-fonts/NotoSansThai';
import { LOOKS } from './fx/Look';

// Noto Sans Thai for every Thai and Latin glyph on screen (DESIGN-SPEC §3).
export const { fontFamily: THAI } = loadFont('normal', { weights: ['400', '500', '600', '700'], subsets: ['thai', 'latin'] });

export const L = LOOKS.jade;

// Palette "Jade + Rose" — approved 2026-10-12 (sf/palettes.png, row 2).
export const C = {
  c1: '#1F7A70', // jade
  c2: '#2FA79A', // jade light
  c3: '#C25470', // rose
  c4: '#E08CA2', // pink
  c5: '#F2C48D', // sand
  c6: '#7FB8B0', // sage
  c7: '#A6C0BD', // mist
  folder: ['#0F5A52', '#14716A', '#1F8A80'] as const,
  sky: ['#EEF5F3', '#E1EDEA', '#F1E7EA', '#F8EEF0'] as const,
  bokeh: ['#BFDCD7', '#F1C9D4'] as const,
  ink: '#1B1F3B',
  muted: '#5A6190',
  green: '#0B4F48', // text green — owner 2026-10-13: green type darker than the jade accent
};

// owner 2026-10-13: green type darker — the gradient now runs within deep greens (was jade → jade light → rose)
export const TITLE_GRAD = `linear-gradient(90deg, #0B4F48 0%, #0F5A52 55%, #14716A 100%)`;

// Gradient text: the approved title treatment (ครบทั้งเดือน / ในระบบเดียว).
export const gradFill: React.CSSProperties = {
  backgroundImage: TITLE_GRAD,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};
// For Thai words: background-clip:text only paints glyph parts inside the element's box, so stacked marks
// (ซื้อ, ทั้ง) above the line box vanish. Pad the box out and pull the layout back with the same margin.
export const gradText: React.CSSProperties = { ...gradFill, padding: '0.22em 0.04em 0.14em', margin: '-0.22em -0.04em -0.14em' };

export const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)',
  border: '1.5px solid rgba(255,255,255,0.9)',
  backdropFilter: 'blur(24px) saturate(150%)',
  boxShadow: '0 30px 70px rgba(14,46,42,0.14), inset 0 1px 0 #fff',
};
