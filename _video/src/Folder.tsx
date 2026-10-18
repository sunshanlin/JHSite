// Month folder — the finale's convergence point and the outro's "icon" (approved styleframe f3).
import React from 'react';
import { C, THAI } from './theme';
import { MONTH } from './timeline';

export const FOLDER_W = 420;
export const FOLDER_H = 300;

// open: 0 closed → 1 front panel swung down (the ภ.พ.30 form rises out of it in PP30.tsx)
export const Folder: React.FC<{ open?: number; children?: React.ReactNode; glow?: number }> = ({ open = 0, children, glow = 0 }) => {
  const tabW = FOLDER_W * 0.38;
  return (
    <div style={{ position: 'relative', width: FOLDER_W, height: FOLDER_H }}>
      {/* back panel + tab */}
      <div style={{ position: 'absolute', left: 0, top: -26, width: tabW, height: 46, borderRadius: '18px 18px 0 0', background: C.folder[0] }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '6px 22px 22px 22px',
        background: `linear-gradient(160deg, ${C.folder[0]} 0%, ${C.folder[1]} 60%, ${C.folder[2]} 100%)`,
        boxShadow: `0 40px 90px rgba(14,46,42,${(0.32 + glow * 0.2).toFixed(3)}), 0 0 0 ${(glow * 10).toFixed(1)}px rgba(47,167,154,${(glow * 0.25).toFixed(3)})`,
      }} />
      {/* contents (the form) sit between back and front panels */}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      {/* front panel: glassy, hinged at the bottom edge */}
      <div style={{ position: 'absolute', left: 0, top: 34, width: FOLDER_W, height: FOLDER_H - 34, perspective: 1200, perspectiveOrigin: '50% 100%' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 22, transformOrigin: '50% 100%', transform: `rotateX(${(open * 72).toFixed(2)}deg)`,
          background: `linear-gradient(170deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 100%), linear-gradient(160deg, ${C.c1}, ${C.folder[2]})`,
          borderTop: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontFamily: THAI, padding: '34px 40px', boxSizing: 'border-box',
        }}>
          <div style={{ fontWeight: 600, fontSize: 30, opacity: 0.9 }}>{MONTH}</div>
          <div style={{ fontWeight: 700, fontSize: 64, lineHeight: 1.2, marginTop: 4 }}>ปิดงวด</div>
        </div>
      </div>
    </div>
  );
};
