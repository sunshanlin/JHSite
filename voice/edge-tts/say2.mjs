import fs from "node:fs";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const [, , outFile, pitch, ...rest] = process.argv;
const text = rest.join(" ");
const voice = "th-TH-PremwadeeNeural";

const tts = new MsEdgeTTS();
await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
const { audioStream } = tts.toStream(text, { rate: "-4%", pitch });
await new Promise((res, rej) => {
  const w = fs.createWriteStream(outFile);
  audioStream.pipe(w);
  w.on("finish", res).on("error", rej);
  audioStream.on("error", rej);
});
console.log("wrote", outFile, fs.statSync(outFile).size, "bytes");
