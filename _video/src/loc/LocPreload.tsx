// Preload for the explainer only: the 8 captures its scenes use. The shared Preload (../Preload.tsx) mounts every PNG under
// docs/ and screens/ — 40 files, most of them the billing demo's 1080p/4K screens — and Chrome fails to decode about half of them
// at once ("EncodingError: The source image cannot be decoded", 21 per render, seen on a still of S0 that uses none of them).
// A failed decode of a capture the scenes DO use would leave a blank page in a long render, so this one keeps the list short.
import React from 'react';
import { Img, staticFile } from 'remotion';

const CAPTURES = [
  'screens/posted-sales-invoice-clean.png', 'screens/direct-wht-info.png', 'screens/billing-board.png',
  'docs/tax-invoice.png', 'docs/sales-vat.png', 'docs/pp30.png', 'docs/wht-cert.png', 'docs/billing-note.png',
];

export const LocPreload: React.FC = () => (
  <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
    {CAPTURES.map((n) => <Img key={n} src={staticFile(n)} style={{ width: 1, height: 1 }} />)}
  </div>
);
