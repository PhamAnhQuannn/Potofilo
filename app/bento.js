/* Potofilo — bento.js
 * Click ô bento → phóng to (FLIP 0.35s) thành overlay chi tiết. Escape / X / nền → đóng.
 * Chỉ là FLIP + hút bụi nhẹ (năng lượng ~30), KHÔNG phải vụ nổ mới.
 */
(function () {
  'use strict';

  var overlay = document.getElementById('tile-overlay');
  var panel = document.getElementById('tile-overlay-panel');
  var closeBtn = overlay ? overlay.querySelector('.tile-overlay__close') : null;
  if (!overlay || !panel) return;

  var current = null; // tile đang mở

  function buildContent(tile) {
    var accent = tile.style.getPropertyValue('--accent') || 'var(--hot-1)';
    panel.style.setProperty('--accent', accent);
    var html = '';
    var label = tile.querySelector('.tile__label');
    var title = tile.querySelector('.tile__title, .tile__name');
    var body = tile.querySelector('.tile__body');
    var detail = tile.querySelector('.tile__detail');
    if (label) html += '<span class="tile__label">' + label.textContent + '</span>';
    if (title) html += '<h2>' + title.textContent + '</h2>';
    if (body) html += '<p class="tile__body">' + body.innerHTML + '</p>';
    if (detail) html += detail.innerHTML;
    panel.innerHTML = html;
  }

  function open(tile) {
    if (current) return;
    current = tile;
    buildContent(tile);
    var first = tile.getBoundingClientRect();
    overlay.hidden = false;
    var last = panel.getBoundingClientRect();
    var dx = first.left - last.left, dy = first.top - last.top;
    var sx = Math.max(0.1, first.width / last.width), sy = Math.max(0.1, first.height / last.height);
    panel.style.transition = 'none';
    panel.style.transformOrigin = 'top left';
    panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    panel.style.opacity = '0.5';
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      panel.style.transition = 'transform 0.35s cubic-bezier(.2,.7,.2,1), opacity 0.35s ease';
      panel.style.transform = 'none'; panel.style.opacity = '1';
    }); });
    if (closeBtn) closeBtn.focus();
    // hút bụi nhẹ theo chuyển động phóng to
    if (window.CosmicDust && window.CosmicDust.condense) {
      window.CosmicDust.condense(first.left + first.width / 2, first.top + first.height / 2, 10, null);
    }
  }

  function close() {
    if (!current) return;
    var tile = current;
    var first = tile.getBoundingClientRect();
    var last = panel.getBoundingClientRect();
    var dx = first.left - last.left, dy = first.top - last.top;
    var sx = Math.max(0.1, first.width / last.width), sy = Math.max(0.1, first.height / last.height);
    panel.style.transition = 'transform 0.3s cubic-bezier(.4,0,.6,1), opacity 0.3s ease';
    panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    panel.style.opacity = '0';
    var done = function () {
      overlay.hidden = true; panel.style.transition = 'none'; panel.style.transform = 'none'; panel.style.opacity = '1';
      panel.removeEventListener('transitionend', done);
      if (tile && tile.focus) tile.focus();
      current = null;
    };
    panel.addEventListener('transitionend', done);
  }

  var tiles = document.querySelectorAll('#bento .tile');
  for (var i = 0; i < tiles.length; i++) {
    (function (tile) {
      tile.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('a')) return; // link trong ô: để nguyên
        open(tile);
      });
      tile.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(tile); }
      });
    })(tiles[i]);
  }
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
})();
