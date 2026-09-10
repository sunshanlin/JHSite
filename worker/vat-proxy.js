/* ตัวกลางระหว่างหน้าเว็บกับ VAT Service ของกรมสรรพากร
 *
 * ทำไมต้องมี: rdws.rd.go.th ไม่ส่ง Access-Control-Allow-Origin เลยสักหัวเดียว
 * (ตรวจแล้ว ทั้ง preflight และ POST) เบราว์เซอร์จึงเรียกตรงไม่ได้ ไม่ว่าจะเขียน fetch ยังไง
 * Worker ตัวนี้ยิง SOAP แทน แล้วแปะ CORS ให้ตอนส่งกลับ
 *
 * deploy:  npx wrangler deploy            (ครั้งแรกจะเปิดเบราว์เซอร์ให้ล็อกอิน Cloudflare)
 * ลองในเครื่อง: npx wrangler dev          แล้วยิง http://localhost:8787/?tin=0107544000108
 */

const RD = 'https://rdws.rd.go.th/JsonRD/VATserviceRD3.asmx';
const NS = 'https://rdws.rd.go.th/JserviceRD3/vatserviceRD3';

/* โดเมนที่เรียกได้ — localhost คือ dev server ของ driver.mjs ที่สุ่มพอร์ต */
const OK_ORIGIN = (o) => !!o && (
  /^https:\/\/(www\.)?jwicconsulting\.com$/.test(o) ||
  /^https:\/\/[a-z0-9-]+\.github\.io$/.test(o) ||
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o)
);

const cors = (origin) => ({
  'Access-Control-Allow-Origin': OK_ORIGIN(origin) ? origin : 'https://www.jwicconsulting.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
});

const json = (body, status, origin, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', ...cors(origin), ...extra }
});

/* ค่าจาก RD มาเป็น array ทุกช่อง และช่องว่างมาเป็น "-" */
const one = (v) => { const s = Array.isArray(v) ? v[0] : v; const t = String(s ?? '').trim(); return t === '-' ? '' : t; };

function address(r) {
  const bits = [
    one(r.HouseNumber) && 'เลขที่ ' + one(r.HouseNumber),
    one(r.MooNumber) && 'หมู่ ' + one(r.MooNumber),
    one(r.BuildingName), one(r.FloorNumber) && 'ชั้น ' + one(r.FloorNumber),
    one(r.RoomNumber) && 'ห้อง ' + one(r.RoomNumber), one(r.VillageName),
    one(r.SoiName) && 'ซอย' + one(r.SoiName), one(r.StreetName) && 'ถนน' + one(r.StreetName)
  ].filter(Boolean).join(' ');
  const bkk = one(r.Province) === 'กรุงเทพมหานคร';
  const area = [
    one(r.Thambol) && (bkk ? 'แขวง' : 'ตำบล') + one(r.Thambol),
    one(r.Amphur) && (bkk ? 'เขต' : 'อำเภอ') + one(r.Amphur)
  ].filter(Boolean).join(' ');
  return { line1: bits, line2: area, province: one(r.Province), post: one(r.PostCode) };
}

export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get('Origin');
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== 'GET') return json({ error: 'method' }, 405, origin);

    /* เว็บอื่นเรียกไม่ได้ — ไม่มี Origin (same-origin หรือ curl) ปล่อยผ่านให้ rate limit จัดการ */
    if (origin && !OK_ORIGIN(origin)) return json({ error: 'origin' }, 403, origin);

    /* กันเอาไปไล่ขูดทะเบียนทั้งกรม — 20 ครั้ง/นาที/IP ถ้าไม่ผูก binding ไว้ก็ข้าม */
    if (env && env.RL) {
      const ip = req.headers.get('CF-Connecting-IP') || '0';
      const { success } = await env.RL.limit({ key: ip });
      if (!success) return json({ ok: false, code: 'rate', message: 'ค้นถี่เกินไป รอสักครู่แล้วลองใหม่' }, 429, origin);
    }

    const q = new URL(req.url).searchParams;
    const tin = (q.get('tin') || '').replace(/\D/g, '');
    const branch = (q.get('branch') || '').replace(/\D/g, '');
    if (tin.length !== 13) return json({ ok: false, code: 'badtin', message: 'เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก' }, 400, origin);

    /* กันยิงซ้ำใส่กรมสรรพากร — ทะเบียนไม่ได้เปลี่ยนรายวินาที */
    const key = new Request(new URL('/v1/' + tin + '/' + (branch || '0'), req.url).toString(), { method: 'GET' });
    const hit = await caches.default.match(key);
    if (hit) { const h = new Headers(hit.headers); Object.entries(cors(origin)).forEach(([k, v]) => h.set(k, v)); h.set('x-cache', 'hit');
      return new Response(hit.body, { status: hit.status, headers: h }); }

    const env_ = env || {};
    const body = '<?xml version="1.0" encoding="utf-8"?>'
      + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
      + '<soap:Body><Service xmlns="' + NS + '">'
      + '<username>' + (env_.RD_USER || 'anonymous') + '</username>'
      + '<password>' + (env_.RD_PASS || 'anonymous') + '</password>'
      + '<TIN>' + tin + '</TIN><Name></Name>'
      + '<ProvinceCode>0</ProvinceCode>'
      + '<BranchNumber>' + (branch ? Number(branch) : 0) + '</BranchNumber>'
      + '<AmphurCode>0</AmphurCode>'
      + '</Service></soap:Body></soap:Envelope>';

    let xml;
    try {
      const r = await fetch(RD, {
        method: 'POST', body,
        headers: { 'content-type': 'text/xml; charset=utf-8', 'SOAPAction': '"' + NS + '/Service"' },
        signal: AbortSignal.timeout(20000)
      });
      if (!r.ok) return json({ ok: false, code: 'rd', message: 'กรมสรรพากรตอบ ' + r.status }, 502, origin);
      xml = await r.text();
    } catch (e) {
      return json({ ok: false, code: 'net', message: 'ต่อกรมสรรพากรไม่ได้ในตอนนี้' }, 504, origin);
    }

    const m = xml.match(/<ServiceResult[^>]*>([\s\S]*?)<\/ServiceResult>/);
    if (!m) return json({ ok: false, code: 'parse', message: 'อ่านคำตอบจากกรมสรรพากรไม่ออก' }, 502, origin);
    const raw = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

    let d;
    try { d = JSON.parse(raw); } catch { return json({ ok: false, code: 'parse', message: 'อ่านคำตอบจากกรมสรรพากรไม่ออก' }, 502, origin); }

    const clean = (x) => String(x).split(/<br\s*\/?>/i)[0].replace(/<[^>]*>/g, '').trim();
    const err = (d.msgerr || []).map(clean).filter(Boolean);
    if (err.length || !one(d.Name)) {
      return json({ ok: false, code: 'notfound', message: err[0] || 'ไม่พบเลขประจำตัวผู้เสียภาษีนี้ในทะเบียน' }, 200, origin);
    }

    const out = {
      ok: true, tin: one(d.NID) || tin,
      name: [one(d.TitleName), one(d.Name)].filter(Boolean).join(' '),
      surname: one(d.Surname),
      branchNumber: String(Array.isArray(d.BranchNumber) ? d.BranchNumber[0] : d.BranchNumber ?? 0).padStart(5, '0'),
      branchName: [one(d.BranchTitleName), one(d.BranchName)].filter(Boolean).join(' '),
      vatFrom: one(d.BusinessFirstDate),
      ...address(d)
    };
    const res = json(out, 200, origin, { 'cache-control': 'public, max-age=21600' });
    ctx.waitUntil(caches.default.put(key, res.clone()));
    return res;
  }
};
