import * as m from 'file:///C:/Users/Admin/AppData/Local/Temp/claude/d--BC-Project-JHCore/0e7a63b0-e8de-4298-bf9f-fce2e86e3c8b/scratchpad/sfx_bundle.mjs';
import fs from 'fs';
fs.writeFileSync('C:/Users/Admin/AppData/Local/Temp/claude/d--BC-Project-JHCore/0e7a63b0-e8de-4298-bf9f-fce2e86e3c8b/scratchpad/sfx_targets.json', JSON.stringify({ sfx: m.SFX, targets: m.SFX_TARGETS }, null, 1));
console.log(m.SFX_TARGETS.length, 'targets');
console.log(m.SFX_TARGETS.filter((t) => /Billing|TO BILL/.test(t.note)));
