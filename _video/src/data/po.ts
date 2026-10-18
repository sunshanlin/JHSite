// Purchase order of the December demo month (company TEST, capture/dec). Owner 2026-10-13 ("มันควรมีหน้าจอ bc ซัก
// หน่อย"): the crash zoom now plays on BC's own Purchase Order page (screens/po-page.png, 2× capture) instead of the
// printed form. PAGE = the page panel in CSS px of the capture (below the app bar, so no product wordmark);
// TOT = the Total Excl. VAT / Total VAT / Total Incl. VAT column in page px (capture/dec/layout.json totals + fgrid).
export const PO_NO = 'PO26120001';
export const PO_DATE = '1 ธ.ค. 2569';
export const PO_TOTAL = '10,700.00';
export const PO_VENDOR = 'บริษัท ทาร์กอน จำกัด';
export const PO_SCREEN = 'screens/po-page.png';
export const PO_PAGE = { x: 296, y: 48, w: 1328, h: 1032 };
export const PO_TOT = { x: 776 - 296, y: 880 - 48, w: 392, h: 116 };
