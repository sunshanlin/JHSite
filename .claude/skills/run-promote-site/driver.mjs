// Drive the promote-site landing page headless: serve, open in Chrome/Edge, optionally run JS, screenshot.
// Zero dependencies — uses Node's built-in http server, fetch, and WebSocket (Node >= 22).
//
// Usage (from repo root):
//   node .claude/skills/run-promote-site/driver.mjs shot.png
//   node .claude/skills/run-promote-site/driver.mjs shot.png --eval "document.getElementById('cookie-accept').click()"
//   node .claude/skills/run-promote-site/driver.mjs shot.png --full            # full-page screenshot
//   node .claude/skills/run-promote-site/driver.mjs shot.png --print "js"      # eval + print result, before shot

import http from "node:http";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const SITE = path.resolve(import.meta.dirname, "../../..");
const out = process.argv[2] ?? "shot.png";
const argAfter = (flag) => { const i = process.argv.indexOf(flag); return i > 0 ? process.argv[i + 1] : null; };
const evalJs = argAfter("--eval");
const printJs = argAfter("--print");
const fullPage = process.argv.includes("--full");

const MIME = { html: "text/html; charset=utf-8", png: "image/png", jpg: "image/jpeg", svg: "image/svg+xml", css: "text/css", js: "text/javascript", ico: "image/x-icon" };
const server = http.createServer(async (req, res) => {
  const p = path.join(SITE, req.url === "/" ? "index.html" : decodeURIComponent(req.url.split("?")[0]));
  try {
    const body = await readFile(p);
    res.writeHead(200, { "content-type": MIME[path.extname(p).slice(1)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
// e.g. --url index-purple.html — no leading slash needed (Git Bash mangles "/x" into a Windows path)
let urlPath = argAfter("--url") ?? "/";
if (!urlPath.startsWith("/")) urlPath = "/" + urlPath.replace(/^.*[\\/]/, "");
const url = `http://127.0.0.1:${server.address().port}${urlPath}`;

const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
                "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
const profile = await mkdtemp(path.join(os.tmpdir(), "site-drv-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--remote-debugging-port=0",
  `--user-data-dir=${profile}`, "--no-first-run", "--window-size=1400,1000", "about:blank"]);
const wsUrl = await new Promise((resolve, reject) => {
  let buf = "";
  chrome.stderr.on("data", (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) resolve(m[1]); });
  chrome.on("exit", () => reject(new Error("chrome exited\n" + buf)));
  setTimeout(() => reject(new Error("no DevTools banner\n" + buf)), 15000);
});
const port = new URL(wsUrl).port;
const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map(), events = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method && events.has(m.method)) events.get(m.method)();
};
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const i = ++id;
  pending.set(i, (m) => (m.error ? reject(new Error(method + ": " + m.error.message)) : resolve(m.result)));
  ws.send(JSON.stringify({ id: i, method, params }));
});
const waitEvent = (method) => new Promise((r) => events.set(method, r));

await cdp("Page.enable");
// ponytail: 2x DPR so screenshots look crisp; full-page stays 1x to keep the file size sane
const dpr = fullPage ? 1 : 2;
await cdp("Emulation.setDeviceMetricsOverride", { width: 1400, height: 1000, deviceScaleFactor: dpr, mobile: false });
const loaded = waitEvent("Page.loadEventFired");
await cdp("Page.navigate", { url });
await loaded;
await new Promise((r) => setTimeout(r, 1200)); // fonts + entrance animations

const run = (expression) => cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
if (evalJs) { await run(evalJs); await new Promise((r) => setTimeout(r, 400)); }
if (printJs) console.log("print:", JSON.stringify((await run(printJs)).result.value));

let clip;
if (fullPage) {
  const { result } = await run("Math.ceil(document.documentElement.scrollHeight)");
  await cdp("Emulation.setDeviceMetricsOverride", { width: 1400, height: result.value, deviceScaleFactor: dpr, mobile: false });
  await new Promise((r) => setTimeout(r, 300));
}
const shot = await cdp("Page.captureScreenshot", { format: "png" });
await writeFile(out, Buffer.from(shot.data, "base64"));
console.log("screenshot:", path.resolve(out));

ws.close(); chrome.kill(); server.close();
await rm(profile, { recursive: true, force: true }).catch(() => {});
