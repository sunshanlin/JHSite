// Page checks for jwicconsulting.com — run by .github/workflows/page-checks.yml on every push/PR.
// Zero site dependencies: serves the repo with node:http, drives Chrome with playwright-core,
// blocks every non-local request so results never depend on the network.
//
// What fails the build (each check guards something that already broke once, see comments):
//   1. console errors / page errors / CSP violations on the homepage and every article
//   2. horizontal page overflow (a sideways-scrolling page on phones)
//   3. I18N selectors that match nothing (text moved, translation left behind)
//   4. Thai text left on the page in EN mode
//   5. #pricing text that needed the .wrap-rescue safety net (someone forgot <wbr>) or still overflows
//   6. interactive targets smaller than 24×24 CSS px (WCAG 2.2 SC 2.5.8)
//   7. homepage length on a 390px phone over budget (the demos un-collapsed → 25,000px again)
//   8. articles without the LINE/phone CTA or with fewer than two related links
//   9. print (A4) longer than the page budget
//
// Run locally:  npm i --no-save --prefix .github/scripts playwright-core && node .github/scripts/page-checks.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MOBILE_LENGTH_BUDGET = 21000; // px at 390×844, TH, demos collapsed (Sep 2026: ~18,700)
const PRINT_PAGE_BUDGET = 5;        // A4 pages (Sep 2026: 4)
const MIN_TARGET = 24;              // WCAG 2.5.8

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch(process.env.CI ? { channel: 'chrome' } : {});
const failures = [];
const fail = (where, msg) => { failures.push(`${where}: ${msg}`); };

async function open(pathName, width, { lang = 'th', height = 844, mobile = width < 800 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED/.test(m.text())) errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 200)));
  await page.route('**/*', r => (r.request().url().startsWith(BASE) || r.request().url().startsWith('data:')) ? r.continue() : r.abort());
  await page.addInitScript(l => { try { localStorage.setItem('site_lang', l); localStorage.setItem('ga_consent', 'denied'); } catch {} }, lang);
  await page.goto(BASE + pathName, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return { page, ctx, errors };
}

// ---- I18N selectors straight from the source, same parse the page uses
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const i18nBlock = (html.match(/const I18N = \[([\s\S]*?)\n  \];/) || [])[1] || '';
const i18nSelectors = [...i18nBlock.matchAll(/^\s*\['((?:[^'\\]|\\.)*)'/gm)].map(m => m[1].replace(/\\'/g, "'"));
if (!i18nSelectors.length) fail('index.html', 'could not find the I18N dictionary');

const thaiLeftInEn = () => {
  const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim(); if (!/[\u0E00-\u0E7F]/.test(t)) continue;
    const el = n.parentElement;
    // #articles is Thai on purpose; the demos render their own EN; [lang="th"] marks intentional Thai
    if (el.closest('#articles, script, style, noscript, [aria-hidden="true"], .hero-doc, #vat-service, #billing-flow, #web-quote, [lang="th"], .bf-sr')) continue;
    out.push((el.closest('[id]')?.id || '?') + ' › ' + t.slice(0, 40));
  }
  return out;
};
const smallTargets = (min) => {
  const out = [];
  for (const el of document.querySelectorAll('a[href], button, summary, [role="tab"], input, select, textarea')) {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility === 'hidden' || el.closest('[hidden], [aria-hidden="true"]')) continue;
    if (cs.display === 'inline' && el.closest('p, li, dd, td, figcaption, blockquote')) continue; // 2.5.8 inline exception
    if (r.width < min || r.height < min) out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  return out;
};

// ---- 1–4, 6, 7: homepage
for (const width of [320, 390, 768, 1024, 1101, 1280, 1440]) for (const lang of ["th", "en"]) {
  const where = `index ${width}px ${lang}`;
  const { page, ctx, errors } = await open('/', width, { lang });
  if (errors.length) fail(where, 'console errors: ' + errors.join(' | '));
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, H: document.documentElement.scrollHeight }));
  if (m.sw > m.iw) fail(where, `page scrolls sideways (${m.sw}px wide in a ${m.iw}px viewport)`);
  const dead = await page.evaluate(sels => sels.filter(s => { try { return !document.querySelector(s); } catch { return true; } }), i18nSelectors);
  if (dead.length) fail(where, `I18N selectors match nothing: ${dead.join(', ')}`);
  if (lang === 'en') { const left = await page.evaluate(thaiLeftInEn); if (left.length) fail(where, `Thai text left in EN mode: ${left.slice(0, 8).join(' | ')}`); }
  if (width === 390) {
    const small = await page.evaluate(smallTargets, MIN_TARGET);
    if (small.length) fail(where, `targets under ${MIN_TARGET}px: ${small.join(' | ')}`);
    if (lang === 'th' && m.H > MOBILE_LENGTH_BUDGET) fail(where, `page is ${m.H}px long, budget ${MOBILE_LENGTH_BUDGET}px`);
    console.log(`  ${where}: page length ${m.H}px`);
  }
  await ctx.close();
}

// ---- 5: #pricing keeps every Thai line inside its box at every phone and desktop width
for (const width of [320, 360, 390, 414, 768, 1024, 1280, 1440]) {
  const where = `#pricing ${width}px th`;
  const { page, ctx } = await open('/', width, { lang: 'th', mobile: width < 800 });
  await page.evaluate(() => document.querySelectorAll('#pricing details').forEach(d => { d.open = true; }));
  await page.waitForTimeout(250);
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(250);
  const r = await page.evaluate(() => {
    const box = document.getElementById('pricing');
    const rescued = [...box.querySelectorAll('.wrap-rescue')].map(e => e.className.split(' ')[0] + ': ' + e.textContent.trim().slice(0, 30));
    const over = [...box.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return cs.display !== 'inline' && cs.display !== 'contents' && e.clientWidth && e.scrollWidth - e.clientWidth > 4; }).map(e => e.className.split(' ')[0] + ': ' + e.textContent.trim().slice(0, 30));
    return { rescued, over };
  });
  if (r.rescued.length) fail(where, `text needed the .wrap-rescue net — add <wbr> break points: ${r.rescued.join(' | ')}`);
  if (r.over.length) fail(where, `text overflows its box: ${r.over.join(' | ')}`);
  await ctx.close();
}

// ---- 9: print
{
  const { page, ctx } = await open('/', 1400, { lang: 'th', height: 900, mobile: false });
  await page.emulateMedia({ media: 'print' });
  const pdf = await page.pdf({ format: 'A4', margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages > PRINT_PAGE_BUDGET) fail('print A4', `${pages} pages, budget ${PRINT_PAGE_BUDGET}`);
  console.log(`  print A4: ${pages} pages`);
  await ctx.close();
}

// ---- 1, 2, 8: articles
for (const file of fs.readdirSync(path.join(ROOT, 'articles')).filter(f => f.endsWith('.html')).sort()) {
  for (const width of [390, 1400]) {
    const where = `articles/${file} ${width}px`;
    const { page, ctx, errors } = await open('/articles/' + file, width, { height: 900 });
    if (errors.length) fail(where, 'console errors: ' + errors.join(' | '));
    const a = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: innerWidth,
      line: !!document.querySelector('.article-cta a[href*="line.me"]'),
      tel: !!document.querySelector('.article-cta a[href^="tel:"]'),
      related: [...document.querySelectorAll('h2')].filter(h => h.textContent.trim() === 'บทความอื่น').map(h => h.nextElementSibling?.querySelectorAll('a[href^="/articles/"]').length || 0)[0] || 0,
      og: document.querySelector('meta[property="og:image"]')?.content || '',
    }));
    if (a.sw > a.iw) fail(where, `page scrolls sideways (${a.sw}px wide in a ${a.iw}px viewport)`);
    if (width === 390) {
      if (!a.line || !a.tel) fail(where, 'CTA block is missing the LINE or phone link');
      if (a.related < 2) fail(where, `only ${a.related} related article link(s), need 2`);
      const og = a.og.replace('https://www.jwicconsulting.com', '');
      if (!og.startsWith('/') || !fs.existsSync(path.join(ROOT, og))) fail(where, `og:image ${a.og} is not a file in the repo`);
    }
    await ctx.close();
  }
}

await browser.close(); server.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:\n- ` + failures.join('\n- '));
  process.exit(1);
}
console.log('\nall page checks passed');
