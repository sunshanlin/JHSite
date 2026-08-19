import fs from "node:fs";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const tts = new MsEdgeTTS();
await tts.setMetadata("en-US-AvaMultilingualNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
const text = "Hi there, I'm just recording a quick sample of my voice for a test.";
const { audioStream } = tts.toStream(text, { rate: "-4%" });
await new Promise((res, rej) => {
  const w = fs.createWriteStream("en_ref.mp3");
  audioStream.pipe(w);
  w.on("finish", res).on("error", rej);
  audioStream.on("error", rej);
});
console.log("wrote en_ref.mp3, transcript:", text);
