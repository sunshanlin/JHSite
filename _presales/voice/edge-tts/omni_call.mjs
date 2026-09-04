import fs from "node:fs";

const BASE = "https://k2-fsa-omnivoice.hf.space";
const text = process.argv[2] || "สวัสดีค่ะ นี่คือตัวอย่างเสียงพูดภาษาไทย สำหรับทำคลิปลง YouTube ค่ะ";
const outFile = process.argv[3] || "omni_sample.wav";

const data = [
  text,               // 0 text
  "Thai",             // 1 language
  32,                 // 2 inference steps
  2,                  // 3 guidance scale
  true,               // 4 denoise
  1,                  // 5 speed
  null,               // 6 duration
  true,               // 7 preprocess
  true,               // 8 postprocess
  "Female / 女",       // 9 gender
  "Teenager / 少年",    // 10 age
  "High Pitch / 高音调", // 11 pitch
  "Auto",             // 12 style
  "Auto",             // 13 english accent
  "Auto",             // 14 chinese dialect
];

const postRes = await fetch(`${BASE}/gradio_api/call/_design_fn`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ data }),
});
if (!postRes.ok) {
  console.error("POST failed", postRes.status, await postRes.text());
  process.exit(1);
}
const { event_id } = await postRes.json();
console.log("event_id", event_id);

const streamRes = await fetch(`${BASE}/gradio_api/call/_design_fn/${event_id}`);
const reader = streamRes.body.getReader();
const decoder = new TextDecoder();
let buf = "";
let finalData = null;

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });
  const lines = buf.split("\n");
  buf = lines.pop();
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const payload = line.slice(6);
      try {
        const parsed = JSON.parse(payload);
        console.log("event data:", JSON.stringify(parsed).slice(0, 300));
        if (Array.isArray(parsed)) finalData = parsed;
      } catch {
        console.log("raw:", payload.slice(0, 200));
      }
    }
  }
}

if (!finalData) {
  console.error("no final data received");
  process.exit(1);
}

const audio = finalData[0];
console.log("audio component:", JSON.stringify(audio).slice(0, 500));

let audioUrl = audio?.url || (audio?.path ? `${BASE}/gradio_api/file=${audio.path}` : null);
if (!audioUrl) {
  console.error("could not determine audio url");
  process.exit(1);
}

const fileRes = await fetch(audioUrl);
const buf2 = Buffer.from(await fileRes.arrayBuffer());
fs.writeFileSync(outFile, buf2);
console.log("saved", outFile, buf2.length, "bytes");
