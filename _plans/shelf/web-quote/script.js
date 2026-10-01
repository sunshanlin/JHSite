/* #web-quote — JS ยกจาก index.html คอมมิต 3eb9201 ตามตัวอักษร (อ่าน README.md ก่อนกู้)
   บล็อกหลัก → วางก่อนบรรทัด "// ── Bilingual TH/EN" · bahtText() ที่บล็อกนี้เรียกยังอยู่ใน index.html */
  /* ---- #web-quote (Highlight Feature 3) --------------------------------
     เดโมฝั่งลูกค้า: กดเลือกสินค้า แล้วเห็นใบเสนอราคาที่ Business Central สร้างให้
     คิดเลขในเบราว์เซอร์ล้วน ไม่ยิงระบบจริงสักครั้ง · ผู้ขายในเอกสารเป็นบริษัทสมมติ
     (ข้อยกเว้นเดียวกับใบกำกับภาษีจำลองใน hero — ไม่ใช่ราคาของ JWIC จึงมี VAT ได้)
     คำแปลอยู่ในตัวเองเหมือน #vat-service เพราะ applyLang() เขียนทับ innerHTML
     แล้วจำนวนที่ผู้ใช้กดค้างไว้จะหายหมด — applyLang เรียก window.renderWebQuote แทน */
  (() => {
    const itemBox = document.getElementById('wq-items');
    if (!itemBox) return;

    /* แคตตาล็อก ราคา และจำนวนตั้งต้นชุดเดียวกับใบเสนอราคาจริง QG000010 ที่ออกจากระบบทดสอบ
       at = ลำดับที่ลูกค้ากดเพิ่มลงตะกร้า ใบเสนอราคาเรียงบรรทัดตามนี้เหมือนของจริง
       เปิดมากดส่งเลยโดยไม่แตะอะไร = ได้ใบเดียวกับภาพหลักฐานทุกบรรทัด */
    const GROUPS = ['Laboratory Analyzers', 'Medical Devices'];
    const ITEMS = [
      { g: 0, code: 'LA-001', name: 'Hematology Analyzer', price: 850000, qty: 2, at: 1 },
      { g: 0, code: 'LA-002', name: 'Chemistry Analyzer', price: 1200000, qty: 1, at: 9 },
      { g: 0, code: 'LA-003', name: 'Immunoassay Analyzer', price: 1500000, qty: 1, at: 2 },
      { g: 0, code: 'LA-004', name: 'Electrolyte Analyzer', price: 350000, qty: 1, at: 8 },
      { g: 1, code: 'MD-001', name: 'Patient Monitor', price: 95000, qty: 1, at: 3 },
      { g: 1, code: 'MD-002', name: 'Infusion Pump', price: 45000, qty: 1, at: 4 },
      { g: 1, code: 'MD-003', name: 'ECG Machine', price: 110000, qty: 1, at: 5 },
      { g: 1, code: 'MD-004', name: 'Examination Light', price: 28000, qty: 1, at: 6 },
      { g: 1, code: 'MD-005', name: 'Medical Suction Unit', price: 35000, qty: 1, at: 7 }
    ];

    const WHO = [
      { tab: { th: 'ลูกค้าเดิม', en: 'Existing customer' },
        cust: { th: 'โรงพยาบาลเมดิคอลพาร์ค กรุงเทพฯ', en: 'Medical Park Hospital Bangkok' },
        sub: { th: 'ลูกค้ารหัส C00123 · ผู้ติดต่อ คุณวาริณ', en: 'Customer C00123 · contact: Khun Warin' },
        bc: { th: 'เจอเลขผู้เสียภาษีในระบบ ใช้ลูกค้า C00123 ที่อยู่ เครดิต และเงื่อนไขชำระเดิม',
              en: 'Tax ID matched — customer C00123 is reused with its address, credit limit and terms' } },
      { tab: { th: 'นิติบุคคลใหม่', en: 'New company' },
        cust: { th: 'บริษัท พรีเมียร์แล็บ จำกัด', en: 'Premier Lab Co., Ltd.' },
        sub: { th: 'ลูกค้าใหม่ · สร้างเป็น Contact', en: 'New buyer · created as a Contact' },
        bc: { th: 'ไม่เคยมีเลขนี้ในระบบ สร้าง Contact ใหม่จากข้อมูลที่ลูกค้ากรอก',
              en: 'Tax ID not on file — a Contact is created from what the buyer typed' } },
      { tab: { th: 'บุคคลธรรมดา', en: 'Individual' },
        cust: { th: 'คุณมุก ศรีสุวรรณ', en: 'Ms. Mook Srisuwan' },
        sub: { th: 'ลูกค้าใหม่ · ไม่มีเลขนิติบุคคล', en: 'New buyer · no company tax ID' },
        bc: { th: 'สร้าง Contact แบบบุคคลธรรมดา ไม่บังคับเลขผู้เสียภาษี 13 หลัก ใบเสนอราคายังออกได้',
              en: 'An individual Contact is created — no 13-digit company ID required, the quote still goes out' } }
    ];

    const SELLER = { th: 'บริษัท ตัวอย่างการค้า จำกัด', en: 'Sample Trading Co., Ltd.' };
    const DISCOUNT = 0.20, VAT = 0.07;

    const T = {
      kicker: { th: 'Highlight Feature 3', en: 'Highlight Feature 3' },
      h2: { th: 'ขอใบเสนอราคาผ่าน LIFF <span class="wq-h2-note">(LINE Front-end Framework)</span>', en: 'Quote Requests via LIFF <span class="wq-h2-note">(LINE Front-end Framework)</span>' },
      sub: { th: 'ลูกค้าเลือกสินค้าเองใน LINE แล้ว Business Central สร้างใบเสนอราคาตามคำขอ ไม่มีใครต้องคีย์ซ้ำ ลองกดเป็นลูกค้าดูได้เลย',
             en: 'Buyers pick their items inside LINE, and Business Central creates the quote from the request — nobody retypes a thing. Try it below as the buyer.' },
      archSr: { th: 'ลำดับการทำงาน: Business Central ส่งข้อมูลสินค้าไปไว้ที่ Cloudflare Workers ให้ลูกค้าเห็นใน LINE (LIFF) ลูกค้าเข้าสู่ระบบแล้วส่งคำขอใบเสนอราคา คำขอไปพักที่ Cloudflare Workers จน Business Central ดึงไปสร้างใบเสนอราคา',
                en: 'How it flows: Business Central syncs item data to Cloudflare Workers so the buyer sees them in LINE (LIFF); the buyer signs in and sends a quote request, which waits on Cloudflare Workers until Business Central fetches it and creates the quote' },
      flowReq: { th: 'คำขอใบเสนอราคา', en: 'Quote request' },
      flowItems: { th: 'สินค้า', en: 'Items' },
      s1: { th: 'เลือกสินค้า', en: 'Pick the items' },
      s1hint: { th: 'รายการสินค้าชุดเดียวกับที่ลูกค้าเห็นบน LINE', en: 'The same item list the buyer sees in LINE' },
      s2: { th: 'คุณเป็น', en: 'You are' },
      s2hint: { th: 'ตัวเลือกนี้เปลี่ยนสิ่งที่ Business Central ทำกับคำขอ', en: 'This changes what Business Central does with the request' },
      send: { th: 'ส่งคำขอราคา', en: 'Send the request' },
      pdpa: { th: 'ข้อมูลที่คุณส่งมาพร้อมคำขอนี้ใช้เพื่อจัดทำใบเสนอราคาและติดต่อกลับเท่านั้น',
              en: 'Details sent with this request are used only to prepare the quote and get back to you' },
      sendAgain: { th: 'ส่งคำขออีกครั้ง', en: 'Send another request' },
      plus: { th: 'เพิ่มจำนวน', en: 'Add one' },
      minus: { th: 'ลดจำนวน', en: 'Remove one' },
      qtyNow: { th: 'ขณะนี้', en: 'now' },
      nodeLine: { th: 'LINE (LIFF)', en: 'LINE (LIFF)' },
      nodeWorker: { th: 'Cloudflare Worker', en: 'Cloudflare Worker' },
      nodeBc: { th: 'Business Central', en: 'Business Central' },
      idleLine: { th: 'รอคำขอจากลูกค้า', en: 'Waiting for a request' },
      idleWorker: { th: 'ไม่มีเซิร์ฟเวอร์ให้ดูแล ทำงานเมื่อมีคำขอเท่านั้น', en: 'No server to babysit — it runs only when a request arrives' },
      idleBc: { th: 'ยังไม่มีเอกสารใหม่', en: 'No new document yet' },
      doneLine: { th: 'รับคำขอ {n} รายการ พร้อมข้อมูลผู้ซื้อ', en: 'Request received — {n} line(s) plus the buyer details' },
      doneWorker: { th: 'ตรวจข้อมูล จับคู่รหัสสินค้า แล้วเก็บคำขอไว้รอ Business Central มาดึง', en: 'Validated, item codes matched, and held for Business Central to fetch' },
      bcFetch: { th: 'ดึงคำขอใหม่เข้าระบบ', en: 'Fetched the new request' },
      bcIssue: { th: 'ออกใบเสนอราคา', en: 'issued quote' },
      empty: { th: 'กด “ส่งคำขอราคา” เพื่อดูใบเสนอราคาที่ Business Central สร้างให้', en: 'Press “Send the request” to see the quote Business Central writes' },
      emptyNone: { th: 'เลือกอย่างน้อยหนึ่งรายการก่อนส่งคำขอ', en: 'Pick at least one item before sending' },
      docTitle: { th: 'ใบเสนอราคา', en: 'Sales Quote' },
      docBy: { th: 'ออกโดย', en: 'Issued by' },
      docDate: { th: 'วันที่เอกสาร', en: 'Document date' },
      colQty: { th: 'จำนวน', en: 'Qty' },
      sumNet: { th: 'รวมเป็นเงิน', en: 'Subtotal' },
      sumDisc: { th: 'ส่วนลด 20%', en: 'Discount 20%' },
      sumAfter: { th: 'จำนวนเงินหลังหักส่วนลด', en: 'After discount' },
      sumVat: { th: 'ภาษีมูลค่าเพิ่ม 7%', en: 'VAT 7%' },
      sumTotal: { th: 'จำนวนเงินรวมทั้งสิ้น (THB)', en: 'Grand total (THB)' },
      baht: { th: '', en: 'Thai baht text, written by the system: ' },
      proof: { th: 'ของจริงทำงานแล้ว ใบ QG000010 จากระบบทดสอบตรงกับที่นำเสนอด้านบนทุกบรรทัด',
               en: 'Already running — quote QG000010 from the test system, line for line the same as the demo above' },
      proof1: { th: 'ลูกค้ากรอกคำขอใน LINE', en: 'The buyer fills in the request on LINE' },
      proof2: { th: 'Business Central ออกใบเสนอราคาให้เอง', en: 'Business Central writes the quote' },
      proofZoom: { th: 'คลิกที่ภาพเพื่อดูขนาดเต็ม', en: 'Click an image for full size' },
      note: { th: 'ตัวเลขที่นำเสนอด้านบนคำนวณในเบราว์เซอร์ ไม่ได้ต่อระบบจริง · ผู้ขายในเอกสารเป็นบริษัทสมมติ · ขอบเขตและราคาประเมินแยกเป็นโครงการตาม Requirement · เทคโนโลยีที่ใช้ <a href="https://developers.line.biz/en/docs/liff/overview/" target="_blank" rel="noopener">LIFF</a> และ <a href="https://www.cloudflare.com/products/workers/" target="_blank" rel="noopener">Cloudflare Worker</a>',
              en: 'The demo does its arithmetic in the browser and touches nothing live · the seller on the document is a fictional company · scope and pricing are quoted per project against your Requirement · built with <a href="https://developers.line.biz/en/docs/liff/overview/" target="_blank" rel="noopener">LIFF</a> and <a href="https://www.cloudflare.com/products/workers/" target="_blank" rel="noopener">Cloudflare Worker</a>' }
    };

    const money = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const byId = (id) => document.getElementById(id);
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const ico = (id) => '<svg class="wq-ic"><use href="#' + id + '"/></svg>';
    const slow = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lang = 'th', who = 0, sent = false, step = 0, quoteNo = 10, seq = ITEMS.length;
    let timers = [];

    const lines = () => ITEMS.filter((it) => it.qty > 0).sort((a, b) => a.at - b.at);
    const stop = () => { timers.forEach(clearTimeout); timers = []; };
    /* แตะอะไรก็ตามหลังส่งแล้ว = กลับไปสถานะยังไม่ส่ง ผู้ดูจะได้เห็นว่าเอกสารมาจากการกดส่ง ไม่ใช่โผล่เอง */
    const reset = () => { stop(); sent = false; step = 0; };

    function drawItems() {
      let last = -1;
      itemBox.innerHTML = ITEMS.map((it, i) => {
        const head = it.g !== last ? '<p class="wq-grp">' + GROUPS[it.g] + '</p>' : '';
        last = it.g;
        return head + '<div class="wq-item' + (it.qty ? ' on' : '') + '">' + ico('wqi-box')
        + '<span class="wq-name"><b>' + esc(it.name) + '</b><span><code>' + it.code + '</code> · '
        + 'EA</span></span>'
        + '<span class="wq-qty">'
        + '<button type="button" data-i="' + i + '" data-d="-1" aria-label="' + T.minus[lang] + ' ' + it.code
        + ' · ' + T.qtyNow[lang] + ' ' + it.qty + '"' + (it.qty ? '' : ' disabled') + '>&minus;</button>'
        + '<output>' + it.qty + '</output>'
        + '<button type="button" data-i="' + i + '" data-d="1" aria-label="' + T.plus[lang] + ' ' + it.code
        + ' · ' + T.qtyNow[lang] + ' ' + it.qty + '">+</button>'
        + '</span></div>';
      }).join('');
      itemBox.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
        const i = b.dataset.i, d = b.dataset.d, it = ITEMS[+i], was = it.qty;
        it.qty = Math.max(0, Math.min(99, it.qty + (+d)));
        if (!was && it.qty) it.at = ++seq;
        reset(); render();
        const same = itemBox.querySelector('button[data-i="' + i + '"][data-d="' + d + '"]');
        (same && !same.disabled ? same : itemBox.querySelector('button[data-i="' + i + '"][data-d="1"]')).focus();
      }));
    }

    function drawWho() {
      const bar = byId('wq-who');
      bar.innerHTML = WHO.map((w, i) =>
        '<button type="button" data-i="' + i + '" aria-pressed="' + (i === who) + '">' + esc(w.tab[lang]) + '</button>').join('');
      bar.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
        who = +b.dataset.i; reset(); render();
        bar.querySelector('button[data-i="' + who + '"]').focus();
      }));
    }

    function node(key, on, name, text) {
      return '<div class="wq-node wq-node-' + key + (on ? ' on' : '') + '"><span class="wq-dot"></span>'
        + '<span class="wq-txt"><b>' + name + '</b><span>' + text + '</span></span></div>';
    }

    function drawPipe() {
      byId('wq-pipe').innerHTML =
        node('line', step >= 1, T.nodeLine[lang], step >= 1 ? T.doneLine[lang].replace('{n}', lines().length) : T.idleLine[lang])
        + node('cf', step >= 2, T.nodeWorker[lang], step >= 2 ? T.doneWorker[lang] : T.idleWorker[lang])
        + node('bc', step >= 3, T.nodeBc[lang], step >= 3
            ? T.bcFetch[lang] + ' · ' + WHO[who].bc[lang] + ' · ' + T.bcIssue[lang] + ' ' + quoteId()
            : T.idleBc[lang]);
    }

    const quoteId = () => 'QG' + String(quoteNo).padStart(6, '0');

    function drawResult() {
      const el = byId('wq-result');
      if (!sent || step < 3) {
        el.innerHTML = '<div class="wq-empty">' + ico('wqi-doc') + '<span>'
          + (lines().length ? T.empty[lang] : T.emptyNone[lang]) + '</span></div>';
        return;
      }
      const sub = lines().reduce((a, it) => a + it.price * it.qty, 0);
      const disc = sub * DISCOUNT, after = sub - disc, vat = after * VAT, tot = after + vat;
      const d = new Date();
      const date = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
      el.innerHTML = '<div class="wq-doc in">'
        + '<div class="wq-doc-head"><span><b>' + T.docTitle[lang] + '</b>'
        + '<span>' + T.docBy[lang] + ' ' + esc(SELLER[lang]) + '</span></span>'
        + '<span class="wq-doc-no">' + quoteId() + '<span>' + T.docDate[lang] + ' ' + date + '</span></span></div>'
        + '<p class="wq-doc-cust"><b>' + esc(WHO[who].cust[lang]) + '</b><br>' + esc(WHO[who].sub[lang]) + '</p>'
        + lines().map((it) => '<div class="wq-line"><code>' + it.code + '</code><span>' + esc(it.name) + '</span>'
            + '<i>' + it.qty + '</i><em>' + money(it.price * it.qty) + '</em></div>').join('')
        + '<dl class="wq-sum">'
        + '<dt>' + T.sumNet[lang] + '</dt><dd>' + money(sub) + '</dd>'
        + '<dt>' + T.sumDisc[lang] + '</dt><dd>' + money(disc) + '</dd>'
        + '<dt>' + T.sumAfter[lang] + '</dt><dd>' + money(after) + '</dd>'
        + '<dt>' + T.sumVat[lang] + '</dt><dd>' + money(vat) + '</dd>'
        + '<dt class="tot">' + T.sumTotal[lang] + '</dt><dd class="tot">' + money(tot) + '</dd>'
        + '</dl>'
        + '<p class="wq-baht">' + T.baht[lang] + '(' + bahtText(tot) + ')</p>'
        + '</div>';
    }

    function render() {
      document.querySelectorAll('[data-wq]').forEach((el) => { el.innerHTML = T[el.dataset.wq][lang]; });
      drawItems();
      drawWho();
      drawPipe();
      drawResult();
      const btn = byId('wq-send');
      btn.disabled = !lines().length;
      btn.querySelector('[data-wq="send"]').innerHTML = sent && step >= 3 ? T.sendAgain[lang] : T.send[lang];
    }

    function send() {
      if (!lines().length) return;
      stop();
      quoteNo++;
      sent = true;
      if (slow) { step = 3; render(); return; }
      step = 1; render();
      timers.push(setTimeout(() => { step = 2; render(); }, 480));
      timers.push(setTimeout(() => { step = 3; render(); }, 980));
    }

    byId('wq-send').addEventListener('click', send);
    window.renderWebQuote = (l) => { lang = l; render(); };
    render();
  })();

// ---- บรรทัดเดี่ยวที่ต้องคืนตามจุด (ตามตัวอักษร) ----
// applyLang(): ต่อจากบรรทัด renderBillingFlow
//    if (window.renderWebQuote) window.renderWebQuote(lang);
// I18N_ATTR: ต่อจาก ['#vs-cases', …]
//    ['#wq-who', 'aria-label', 'Buyer type'],
// I18N_ATTR: ต่อจาก ['.ci-photo', …]
//    ['img[src*="bc-liff-form"]', 'alt', 'Quote request screen in LINE from the test system — delivery date, note, phone number and contact person entered by the customer; the email field is blurred'],
//    ['img[src*="bc-liff-quote"]', 'alt', 'Quote QG000010 created by Business Central from that request — nine lines, grand total THB 4,333,928.00, stamped as test data; the email field is blurred'],
// รายการ demo_use: เติม 'web-quote' (บรรทัดเดิม)
//  ['billing-flow', 'vat-service', 'web-quote'].forEach(id => {
// @media print: เติม #web-quote ในรายการซ่อน (บรรทัดเดิม)
//    #billing-flow, #vat-service, #web-quote, #faq, #about, #articles,
