/* Potofilo — site.js
 * Chỉ TĂNG CƯỜNG. Site phải dùng được đầy đủ khi tắt JS.
 * - Toggle menu mobile
 * - Đánh dấu mục nav đang xem (aria-current)
 * - Cập nhật năm footer
 */
(function () {
  'use strict';

  // Năm footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Toggle menu mobile
  var navbar = document.querySelector('.navbar');
  var toggle = document.querySelector('.navbar__toggle');
  if (navbar && toggle) {
    toggle.addEventListener('click', function () {
      var open = navbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Bấm 1 link → đóng menu mobile
    navbar.querySelectorAll('.navbar__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        navbar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Đánh dấu mục nav theo section đang xem
  var links = Array.prototype.slice.call(document.querySelectorAll('.navbar__links a'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (id) byId[id] = a;
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = byId[e.target.id];
        if (a && e.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
  }
})();
