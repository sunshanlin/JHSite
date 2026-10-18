import React from 'react';
import { staticFile } from 'remotion';

// A region of a document page, cut out of the page raster (the texture is never redrawn — Q1).
// Region and page are in page fractions (0–1); the crop is drawn at the page's on-screen size pw × ph.
export type Frac = { x: number; y: number; w: number; h: number };

export const DocCrop: React.FC<{ src: string; r: Frac; pw: number; ph: number; style?: React.CSSProperties }> = ({ src, r, pw, ph, style }) => (
  <div style={{
    position: 'absolute', left: r.x * pw, top: r.y * ph, width: r.w * pw, height: r.h * ph,
    backgroundImage: `url(${staticFile(src)})`, backgroundSize: `${pw}px ${ph}px`, backgroundPosition: `${-r.x * pw}px ${-r.y * ph}px`,
    ...style,
  }} />
);

export const box = (r: Frac, pw: number, ph: number) => ({ x: r.x * pw, y: r.y * ph, w: r.w * pw, h: r.h * ph });
