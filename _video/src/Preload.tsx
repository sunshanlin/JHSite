// Captures painted as CSS backgrounds (DocCrop, the BC screens) are invisible to Remotion's render wait, so a tab that
// mounts a scene mid-chunk can capture its first frames before the PNG has loaded: the master render of 2026-10-14
// showed the Payment Journal as a blank white panel for f475–479. Mounting every capture once as a hidden <Img> makes
// each frame wait until they are loaded; the backgrounds then paint from the browser's memory cache.
import React from 'react';
import { Img, getStaticFiles, staticFile } from 'remotion';

const CAPTURES = getStaticFiles()
  .map((f) => f.name.replace(/\\/g, '/'))
  .filter((n) => /^(docs|screens)\/[^/]+\.png$/.test(n));

export const Preload: React.FC = () => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
    {CAPTURES.map((n) => <Img key={n} src={staticFile(n)} style={{ width: 1, height: 1 }} />)}
  </div>
);
