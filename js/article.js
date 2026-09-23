/* หน้าบทความ: แถบขอความยินยอมคุกกี้ + GA4 + event ของปุ่มติดต่อ
   - ค่า ga_consent ใน localStorage ใช้ร่วมกับหน้าแรก (origin เดียวกัน) กดยอมรับ/ปฏิเสธที่หน้าไหนก็มีผลทั้งเว็บ
   - GA โหลดหลังยินยอมเท่านั้น เหมือน index.html · GA_ID ต้องตรงกับใน index.html
   - CSP ของบทความต้องมี script-src 'self' https://www.googletagmanager.com และ connect-src ของ GA */
(function () {
  var GA_ID = 'G-NGDPEC4BZ1';
  var KEY = 'ga_consent';
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (typeof window.gtag === 'function') return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
  function track(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); }

  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'การใช้คุกกี้');
  bar.hidden = true;
  bar.innerHTML = '<p>เราขอใช้คุกกี้วิเคราะห์ (Google Analytics) เพื่อปรับปรุงเว็บไซต์ ปฏิเสธได้โดยไม่กระทบการอ่าน</p>'
    + '<div class="cookie-actions"><button type="button" class="accept">ยอมรับ</button><button type="button" class="decline">ปฏิเสธ</button></div>';
  document.body.appendChild(bar);

  var consent = getConsent();
  if (consent === 'granted') loadGA();
  else if (!consent) bar.hidden = false;

  bar.querySelector('.accept').addEventListener('click', function () { setConsent('granted'); bar.hidden = true; loadGA(); });
  bar.querySelector('.decline').addEventListener('click', function () {
    var had = getConsent() === 'granted';
    setConsent('denied'); bar.hidden = true;
    // ถอนความยินยอมหลัง GA โหลดไปแล้ว สคริปต์ยังค้างในหน้า ต้องโหลดใหม่ให้หลุด
    if (had) location.reload();
  });
  var manage = document.querySelector('footer .cookie-manage');
  if (manage) {
    manage.hidden = false;
    manage.addEventListener('click', function () { bar.hidden = false; bar.querySelector('.accept').focus(); });
  }

  var slug = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var where = a.closest('.article-cta') ? 'article_cta' : a.closest('footer') ? 'article_footer' : 'article_body';
    if (href.indexOf('tel:') === 0) track('contact_click', { method: 'phone', location: where, article: slug });
    else if (href.indexOf('mailto:') === 0) track('contact_click', { method: 'email', location: where, article: slug });
    else if (href.indexOf('line.me') > -1) track('contact_click', { method: 'line', location: where, article: slug });
    else if (/\/#(contact|pricing)$/.test(href)) track('cta_click', { location: where, target: href.split('#')[1], article: slug });
    else if (/\/articles\/[\w-]+\.html$/.test(href)) track('article_click', { from: slug, to: href.split('/').pop().replace(/\.html$/, '') });
  });
})();
