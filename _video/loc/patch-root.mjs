// Registers the JwicLocalization composition in src/Root.tsx once (idempotent).
import fs from 'node:fs';
const p = new URL('../src/Root.tsx', import.meta.url);
let r = fs.readFileSync(p, 'utf8');
if (!r.includes('JwicLocalization')) {
  r = r.replace(
    "import { Demo, DEMO_TOTAL, DEMO_FPS } from './demo/Demo';",
    "import { Demo, DEMO_TOTAL, DEMO_FPS } from './demo/Demo';\nimport { Loc, LOC_TOTAL } from './loc/Loc';",
  );
  r = r.replace(
    '    <Composition id="JwicDemoBilling"',
    '    <Composition id="JwicLocalization" component={Loc} defaultProps={{ bgm: true }} durationInFrames={rf(LOC_TOTAL)} fps={TRAILER_FPS} width={1920} height={1080} />\n    <Composition id="JwicDemoBilling"',
  );
  fs.writeFileSync(p, r);
  console.log('Root patched');
} else {
  console.log('Root already has JwicLocalization');
}
