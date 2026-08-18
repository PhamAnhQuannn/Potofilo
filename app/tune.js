/* Potofilo — tune.js  (dev-only TUNE panel, chỉ khi ?tune)
 * Registry window.TUNE: block đăng ký tham số → panel render slider chỉnh LIVE.
 * Không ảnh hưởng người dùng thường (không ?tune = không panel, gần như 0 chi phí).
 */
(function () {
  'use strict';

  var LS_KEY = 'potofilo-tune';
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {}; } catch (e) {}

  var TUNE = {
    params: {},      // { group: { key: {value,min,max,step,label} } }
    _dirty: 0,
    register: function (group, key, def) {
      var g = this.params[group] || (this.params[group] = {});
      if (g[key]) { // idempotent: giữ value hiện tại, cập nhật min/max/label
        g[key].min = def.min; g[key].max = def.max; g[key].step = def.step; g[key].label = def.label || key;
        return g[key];
      }
      var v = (saved[group] && saved[group][key] != null) ? saved[group][key] : def.value;
      g[key] = { value: v, min: def.min, max: def.max, step: def.step || 0.01, label: def.label || key, _def: def.value };
      this._dirty++;
      return g[key];
    },
    val: function (group, key) { return this.params[group] && this.params[group][key] ? this.params[group][key].value : undefined; },
    save: function () {
      var out = {};
      for (var grp in this.params) { out[grp] = {}; for (var k in this.params[grp]) out[grp][k] = this.params[grp][k].value; }
      try { localStorage.setItem(LS_KEY, JSON.stringify(out)); } catch (e) {}
    },
    dump: function () {
      var out = {};
      for (var grp in this.params) { out[grp] = {}; for (var k in this.params[grp]) out[grp][k] = this.params[grp][k].value; }
      return JSON.stringify(out, null, 2);
    }
  };
  window.TUNE = TUNE;

  var showPanel = false; try { showPanel = new URLSearchParams(location.search).has('tune'); } catch (e) {}
  if (!showPanel) return;

  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }

  function build() {
    var wrap = el('div', 'position:fixed;top:12px;right:12px;z-index:100000;width:280px;max-height:90vh;overflow:auto;' +
      'background:rgba(8,8,20,0.92);border:1px solid #2a2350;border-radius:10px;padding:10px 12px;' +
      'font:12px/1.4 system-ui,sans-serif;color:#EDEAF6;pointer-events:auto;box-shadow:0 10px 40px rgba(0,0,0,0.6);');
    wrap.id = 'tune-panel';
    var head = el('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;');
    head.appendChild(el('strong', 'letter-spacing:0.08em;', 'TUNE'));
    var btns = el('div', 'display:flex;gap:6px;');
    var copyBtn = el('button', 'cursor:pointer;background:#1a1440;color:#CDE3FF;border:1px solid #2a2350;border-radius:6px;padding:3px 8px;', 'Copy');
    copyBtn.onclick = function () { var t = TUNE.dump(); try { navigator.clipboard.writeText(t); } catch (e) {} copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy'; }, 900); };
    var resetBtn = el('button', 'cursor:pointer;background:#1a1440;color:#E84A8A;border:1px solid #2a2350;border-radius:6px;padding:3px 8px;', 'Reset');
    resetBtn.onclick = function () { for (var grp in TUNE.params) for (var k in TUNE.params[grp]) TUNE.params[grp][k].value = TUNE.params[grp][k]._def; TUNE.save(); render(); };
    btns.appendChild(copyBtn); btns.appendChild(resetBtn); head.appendChild(btns);
    wrap.appendChild(head);
    var body = el('div'); body.id = 'tune-body'; wrap.appendChild(body);
    document.body.appendChild(wrap);
    return body;
  }

  var body = null, lastDirty = -1;
  function render() {
    if (!body) return;
    body.innerHTML = '';
    var groups = Object.keys(TUNE.params);
    if (!groups.length) { body.appendChild(el('div', 'opacity:0.6;', 'chưa có tham số (block sẽ đăng ký)')); return; }
    groups.forEach(function (grp) {
      body.appendChild(el('div', 'margin:10px 0 4px;color:#FFC864;font-weight:600;', grp));
      var keys = TUNE.params[grp];
      Object.keys(keys).forEach(function (k) {
        var p = keys[k];
        var row = el('div', 'margin:6px 0;');
        var lab = el('div', 'display:flex;justify-content:space-between;', null);
        lab.appendChild(el('span', 'opacity:0.85;', p.label));
        var num = el('span', 'color:#4ECDC4;', String(p.value));
        lab.appendChild(num); row.appendChild(lab);
        var inp = el('input', 'width:100%;');
        inp.type = 'range'; inp.min = p.min; inp.max = p.max; inp.step = p.step; inp.value = p.value;
        inp.addEventListener('input', function () { p.value = parseFloat(inp.value); num.textContent = String(p.value); TUNE.save(); });
        row.appendChild(inp); body.appendChild(row);
      });
    });
  }

  function boot() {
    body = build(); render(); lastDirty = TUNE._dirty;
    setInterval(function () { if (TUNE._dirty !== lastDirty) { lastDirty = TUNE._dirty; render(); } }, 500); // param đăng ký muộn (idle)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
