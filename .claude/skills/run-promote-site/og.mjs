// สร้างภาพ og:image 1200×630 ของบทความทุกชิ้นลง img/og/<slug>.png
// อ่าน <h1> กับ .tag จากบทความเอง แล้วเรนเดอร์ og-template.html ผ่าน driver.mjs (ไม่มี dependency)
// ทำเฉพาะบทความที่ og:image ชี้ไป img/og/ — บทความที่ใช้ภาพหน้าจอจริงเป็นภาพแชร์อยู่แล้วไม่แตะ
// node .claude/skills/run-promote-site/og.mjs            → ทุกบทความ
// node .claude/skills/run-promote-site/og.mjs slug1 slug2 → เฉพาะที่ระบุ
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
const SITE = path.resolve(import.meta.dirname, "../../..");
const only = process.argv.slice(2);
mkdirSync(path.join(SITE, "img/og"), { recursive: true });
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
for (const f of readdirSync(path.join(SITE, "articles")).filter((x) => x.endsWith(".html"))) {
  const slug = f.replace(/\.html$/, "");
  if (only.length && !only.includes(slug)) continue;
  const html = readFileSync(path.join(SITE, "articles", f), "utf8");
  if (!html.includes(`/img/og/${slug}.png`)) continue;
  const t = strip((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || slug);
  const tag = strip((html.match(/<span class="tag">([\s\S]*?)<\/span>/) || [])[1] || "");
  const url = `.claude/skills/run-promote-site/og-template.html?t=${encodeURIComponent(t)}&tag=${encodeURIComponent(tag)}`;
  execFileSync(process.execPath, [path.join(import.meta.dirname, "driver.mjs"), path.join(SITE, "img/og", slug + ".png"),
    "--url", url, "--width", "1200", "--height", "630", "--dpr", "1"], { stdio: "inherit" });
  console.log("img/og/" + slug + ".png ←", t);
}
