// preview-mode.js — نسخة معاينة للمنصة الجديدة.
// تقرا المنتجات والأقسام والأغلفة من الكتالوج الحقيقي (اللي تعدله الإدارة)،
// وتمنع أي شي ثاني: الطلبات والدفع وتسجيل الدخول والزيارات ما تنرسل للسيرفر.
(function () {
  'use strict';
  const LIVE_HOST = '162-35-27-249.sslip.io';
  const READ_ONLY = new Set(['/catalog', '/catalog/version']);
  const realFetch = window.fetch.bind(window);
  window.PREVIEW_MODE = true;
  window.fetch = function previewFetch(input, options) {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    const method = String(options?.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase();
    if (url.host !== LIVE_HOST) return realFetch(input, options);
    const path = url.pathname.replace(/^\/platform-api/, '');
    if (method === 'GET' && READ_ONLY.has(path)) return realFetch(input, options);
    console.info('[نسخة معاينة] انمنع:', method, path);
    return Promise.resolve(new Response(JSON.stringify({ error: 'هذي نسخة معاينة: الطلبات والدفع وتسجيل الدخول مقفلة. اطلب من الموقع الرسمي figsolives.online' }), { status: 503, headers: { 'Content-Type': 'application/json' } }));
  };
  if (navigator.sendBeacon) navigator.sendBeacon = target => String(target).includes(LIVE_HOST) ? true : false;
  document.addEventListener('DOMContentLoaded', () => {
    const note = document.createElement('div');
    note.className = 'preview-note';
    note.setAttribute('role', 'note');
    note.innerHTML = 'نسخة معاينة للتصميم الجديد · الطلبات مقفلة · <a href="https://figsolives.online/">الموقع الرسمي</a>';
    document.body.append(note);
  });
})();
