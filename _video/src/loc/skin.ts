// Skin of the Localization explainer — "modern" (the owner picked it on 2026-10-19 from flat / modern / 3d styleframes; the paper,
// flat and 3d looks are gone): one soft two-stop neutral grey under every scene since 2026-10-21 (owner: "สีพื้นหลังมันควรเป็นสีเทาๆ",
// then "เทาล้วนไปเลย" — the Field names stay so the scenes need no change, a cut is the iris over the content alone) — deep navy
// type, white cards and pills on soft layered shadows, squircle gradient badges, no outlines.
// LOC-DESIGN-SPEC.md §3 / §8.
import { loadFont } from '@remotion/google-fonts/Prompt';

export const { fontFamily: FONT } = loadFont('normal', { weights: ['500', '600', '700', '800'], subsets: ['thai', 'latin'] });

/** the colour fields, one per scene */
export type Field = 'peach' | 'pink' | 'butter' | 'mint' | 'sky';

export const M = {
  // one neutral grey (owner 2026-10-21 "เทาล้วนไปเลย"); the pastels before it: peach #FFEAF1→#F9CFDF, pink #FBDDEB→#F0BBD3,
  // butter #FFF1CF→#FFDC9A, mint #DDF6EE→#A9E5D4, sky #DCEFFF→#A9D5F5
  bg: Object.fromEntries((['peach', 'pink', 'butter', 'mint', 'sky'] as const).map((k) => [k, ['#F2F2F2', '#DADADA'] as const])) as Record<Field, readonly [string, string]>,
  ink: '#2E3258',
  inkSoft: '#6E75A6',
  mint: '#4FBFAA', // the pictograms' accent: the trailer's jade, pastel
  coral: ['#F7A9C0', '#EC7898', '#C95A7C'] as const, // pastel rose: S0's small accent dot
  grad: 'linear-gradient(90deg, #1F8070 0%, #3FB19E 100%)', // headline word
  gradRose: 'linear-gradient(90deg, #EC7898 0%, #F29BB3 100%)',
  badge: {
    tax: ['#FFDE9E', '#F0B24A'] as const, doc: ['#7FD9C7', '#3FB3A0'] as const, trade: ['#F7A9C0', '#EC7898'] as const,
    purple: ['#F6B6C9', '#E68AA6'] as const, teal: ['#8ADBCB', '#4FBFAA'] as const,
  },
  bokeh: ['#FFFFFF', '#E9E9E9'] as const, // a white light and a soft grey glow on the grey (were mint #A8E3D4, rose #F5B8CE)
};

/** soft layered shadow */
export const soft = (y = 24, a = 0.22) => `0 ${y}px ${y * 2}px -${y * 0.4}px rgba(70,76,120,${a}), 0 6px 14px rgba(70,76,120,0.08)`;
