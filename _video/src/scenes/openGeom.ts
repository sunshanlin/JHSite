// Card-stack geometry shared by the Opening scene and the calendar hand-off (Calendar.tsx).
// Numbers are CardStack.tsx's (320 px cards, fan 6.5° / 138 px, camera 1.06 → 0.88 → ×1.017),
// with N = 7 (odd, the calendar is the centre card).
export const N = 7;
export const FEATURED = 3;
export const CW = 320;
export const CH = 452; // A4 ratio
export const CX = 960;
export const CY = 640;
export const ROT = 6.5;
export const TX = 138;
// hero 4:5 (final review 2026-10-13): the fan is narrowed so both outer cards' chips sit inside the hero's crop
export const TX_HERO = 118;
export const LIFT = 72;
export const ORIGIN = { x: CX, y: CY + 120 };

export const TILE_W = 300; // CalendarTile native size
export const TILE_H = 352;
export const TILE_S = CW / TILE_W;

// Camera at the end of the opening hold (the demo's 0.88 × 1.017 settles by f150).
export const CAM_END = 0.88 * 1.017;

// Screen rect of the featured calendar card at rest, top-left + scale relative to CalendarTile.
export const featuredRect = (cam = CAM_END) => {
  const tileTop = CY - CH / 2 + (CH - TILE_H * TILE_S) / 2 - LIFT;
  return {
    x: ORIGIN.x + (CX - CW / 2 - ORIGIN.x) * cam,
    y: ORIGIN.y + (tileTop - ORIGIN.y) * cam,
    s: TILE_S * cam,
  };
};
