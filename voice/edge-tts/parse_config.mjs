import fs from "node:fs";
const dir = "C:\\Users\\Admin\\AppData\\Local\\Temp\\claude\\d--JHLinkedin\\6b5bbeab-5393-412a-91cf-503ba4c70148\\scratchpad\\tts";
const d = JSON.parse(fs.readFileSync(`${dir}\\omni_config.json`, "utf-8"));
console.log("version", d.version);
console.log("deps", (d.dependencies || []).length);
const compById = {};
for (const c of d.components || []) compById[c.id] = c;

for (const dep of d.dependencies || []) {
  if (dep.api_name !== "_design_fn") continue;
  console.log("=== inputs ===");
  dep.inputs.forEach((id, i) => {
    const c = compById[id];
    console.log(i, c?.type, c?.props?.label, String(JSON.stringify(c?.props?.value)).slice(0, 100));
  });
  console.log("=== dropdown choices ===");
  [1, 9, 10, 11, 12].forEach((idx) => {
    const c = compById[dep.inputs[idx]];
    console.log(idx, c?.props?.label, JSON.stringify(c?.props?.choices));
  });
  console.log("=== outputs ===");
  dep.outputs.forEach((id, i) => {
    const c = compById[id];
    console.log(i, c?.type, c?.props?.label);
  });
}
