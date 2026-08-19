/* Potofilo — dust-layer.js  (Giai đoạn 3 → ALIVE: vũ trụ nền sống)
 * MỘT canvas 2D thuần (#dust-layer, z dưới .bento). 4 nhóm hạt + sao băng + parallax chuột.
 *  - dust   : bụi tàn dư, khởi tạo từ crystallize 70% (start). Giữ condense + hover.
 *  - stars   : sao xa nhấp nháy, khởi tạo khi vào ALIVE (enterAlive). 60 sao đầu seed từ WebGL.
 *  - embers  : than hồng ngoài tiêu cự (2 arc lồng, KHÔNG ctx.filter).
 *  - meteor  : tối đa 1 vệt sao băng, ~mỗi 25–40s.
 * Năng lượng lớp này = 5/100. Biên độ nhỏ, chu kỳ dài, lệch pha. Không đè chữ opacity > 0.4.
 */
(function () {
  'use strict';

  // reduced-motion: KHÔNG stub hẳn — vẫn vẽ 1 khung tĩnh (giữ MÀU + HÌNH: tinh vân, hành tinh, sao),
  // chỉ tắt vòng lặp/chuyển động/tương tác (bất biến hiến pháp).
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var isMobile = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var DUST_COLORS = ['#CDE3FF', '#CDE3FF', '#FFF4D6', '#FFF4D6', '#E84A8A', '#7B2FBF', '#4ECDC4'];
  var STAR_COLORS = ['#CDE3FF', '#FFFFFF', '#FFE9C4'];
  var EMBER_COLORS = ['#FFC864', '#FF8C42', '#E84A8A'];

  var canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  var dust = [], stars = [], embers = [], nDust = 0, nStars = 0, nEmbers = 0;
  var started = false, alive = false, raf = 0, running = false;
  var scrollY = 0, docScroll = 1, lastT = 0, slowFrames = 0, time = 0;
  var attractor = { x: 0, y: 0, active: false };
  var mx = 0, my = 0, px = 0, py = 0;                 // parallax chuột (target/current)
  var cursorX = 0, cursorY = 0, clx = 0, cly = 0, lightAmt = 0, lightTarget = 0; // đèn con trỏ
  var cursorTex = null, prevTiltTile = null;
  var starSeeds = null, bentoEl = null;
  var meteor = { active: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, len: 0 };
  var nextMeteor = 1e9;
  var nebTex = { left: null, rd: null, band: null }, galaxyCoreTex = null, texScheduled = false;
  var bandsTex = null, shadeTex = null, moonTex = null, iceTex = null, rockyTex = null; // thiên thể (procedural fallback)
  var imgAnchor = null, imgIce = null, imgRocky = null, imgMoon = null;                 // ảnh thật (nếu có)
  var cloudBack = null, cloudMid = null, cloudFront = null;                             // mây 3 tấm (procedural/ảnh)
  var corePulse = { active: false, start: 0 }, nextPulse = 1e9;            // xung lõi (sự kiện hiếm)
  var ORB = null, CLIM = null;             // tham số Kepler / Khí hậu (TUNE)
  var aliveT = 0, climT = 0;               // aliveT: light-echo mây · climT: nhịp check khí hậu-tile (0.5s)
  var anchorCX = -1e9, anchorCY = -1e9, anchorAR = 0;                      // vị trí+bán kính anchor (slingshot/khí hậu)
  // Bản đồ khí hậu: tâm+bán kính vùng + màu nhuộm (anchor teal · ice tím · rocky gỉ ẤM — ngoại lệ Trụ 3)
  var CLIMATE = [ { cx: -1e9, cy: -1e9, r: 0, col: [78, 205, 196] },   // anchor
                  { cx: -1e9, cy: -1e9, r: 0, col: [123, 111, 208] },  // ice
                  { cx: -1e9, cy: -1e9, r: 0, col: [196, 128, 64] } ]; // rocky (ấm)
  // Một nguồn sáng = lõi thiên hà. Vị trí RESPONSIVE (ló sau góc lưới) — updateCorePos().
  var LIGHT_DIR = { x: 0.74, y: -0.67 };
  var coreX = 0.72 * 1, coreY = 0.30 * 1;   // px, cập nhật runtime
  var LIGHTP = null;                          // TUNE nhóm "Ánh sáng"
  var heroGlowTex = null;                     // sprite quầng sao hero (bloom)
  var flare = { active: false, star: null, start: 0 }, nextFlare = 1e9; // sự kiện lấp lánh
  function corePos() { return { x: coreX, y: coreY }; }
  function updateCorePos() {
    var bento = document.getElementById('bento');
    if (!bento) { coreX = 0.72 * W; coreY = 0.30 * H; }
    else {
      var gr = bento.getBoundingClientRect(), wingR = W - gr.right;
      if (wingR >= 180) { coreX = gr.right + wingR * 0.45; coreY = 0.22 * H; }          // cánh rộng: lõi trọn
      else { var f = document.querySelector('.tile--featured'); if (f) { var fr = f.getBoundingClientRect(); coreX = fr.right - 24; coreY = fr.top + 18; } else { coreX = gr.right - 40; coreY = 0.18 * H; } } // hẹp: ló sau góc Featured
    }
    var lx = coreX - W / 2, ly = coreY - H / 2, m = Math.hypot(lx, ly) || 1; LIGHT_DIR.x = lx / m; LIGHT_DIR.y = ly / m;
  }
  var DEBUG = false; try { DEBUG = new URLSearchParams(location.search).has('debug'); } catch (e) {}
  var B4ON = true; try { B4ON = new URLSearchParams(location.search).get('b4') !== 'off'; } catch (e) {} // B4-khai-sinh (default ON; ?b4=off = bản an toàn)
  // B4 cầu nối: reveal thiên thể / năng lượng lõi / mây bừng / pre-alive render
  var revealA = { distant: 1, rocky: 1, ice: 1, anchor: 1 }, revealT = { distant: 1, rocky: 1, ice: 1, anchor: 1 };
  var coreEnergyV = 1, coreEnergyTarget = 1;
  var CLOUD_BASE = [0.5, 0.42, 0.28], cloudLit = [0.5, 0.42, 0.28];  // opacity mây (B4: bắt đầu 0.06)
  var preAlive = false;
  if (B4ON) { revealA = { distant: 0, rocky: 0, ice: 0, anchor: 0 }; revealT = { distant: 0, rocky: 0, ice: 0, anchor: 0 }; coreEnergyV = 0.1; coreEnergyTarget = 0.1; cloudLit = [0.06, 0.06, 0.06]; }
  var dbgAcc = 0, dbgN = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function smoothstep(e0, e1, x) { var t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
  function hexRGB(h) { return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) }; }

  // ---- value-noise + fBm (sinh texture 1 lần trong idle) ----
  function makeNoise(seed) {
    var p = new Uint8Array(256); for (var i = 0; i < 256; i++) p[i] = i;
    var s = (seed >>> 0) || 1;
    for (var j = 255; j > 0; j--) { s = (s * 1664525 + 1013904223) >>> 0; var k = s % (j + 1), t = p[j]; p[j] = p[k]; p[k] = t; }
    function fade(x) { return x * x * x * (x * (x * 6 - 15) + 10); }
    function val(ix, iy) { return p[(p[ix & 255] + (iy & 255)) & 255] / 255; }
    function vn(x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      var u = fade(xf), v = fade(yf);
      var a = val(xi, yi) + u * (val(xi + 1, yi) - val(xi, yi));
      var b = val(xi, yi + 1) + u * (val(xi + 1, yi + 1) - val(xi, yi + 1));
      return a + v * (b - a);
    }
    function fbm(x, y) { var f = 0, amp = 0.5, freq = 1, nrm = 0; for (var o = 0; o < 4; o++) { f += amp * vn(x * freq, y * freq); nrm += amp; amp *= 0.5; freq *= 2; } return f / nrm; }
    return fbm;
  }

  function makeNebulaTexture(size, outerHex, coreHex, seed, bias) {
    var fbm = makeNoise(seed), cv = document.createElement('canvas'); cv.width = cv.height = size;
    var g = cv.getContext('2d'), img = g.createImageData(size, size), d = img.data;
    var outer = hexRGB(outerHex), core = hexRGB(coreHex);
    for (var y = 0; y < size; y++) {
      var ny = y / size;
      for (var x = 0; x < size; x++) {
        var nx = x / size;
        var n = fbm(nx * 4, ny * 4), n2 = fbm(nx * 10.8 + 31.4, ny * 10.8 + 47.2);
        var v = n * 0.72 + n2 * 0.28;
        var dist = Math.hypot(nx - 0.5, ny - 0.5) * 2;
        var falloff = 1 - smoothstep(0.55, 1.0, dist);
        var a = Math.pow(smoothstep(0.38, 0.78, v), 1.7) * falloff;
        var mix = smoothstep(0.45, 0.9, v);
        if (bias) { var dot = (nx - 0.5) * LIGHT_DIR.x + (ny - 0.5) * LIGHT_DIR.y; mix = Math.max(0, Math.min(1, mix + bias * dot * 2)); } // lõi ấm nghiêng về nguồn sáng
        var i = (y * size + x) * 4;
        d[i] = outer.r + (core.r - outer.r) * mix;
        d[i + 1] = outer.g + (core.g - outer.g) * mix;
        d[i + 2] = outer.b + (core.b - outer.b) * mix;
        d[i + 3] = a * 255;
      }
    }
    g.putImageData(img, 0, 0); return cv;
  }

  // Lõi thiên hà — 3 lớp radial đồng tâm, bake 1 lần (điểm sáng nhất nền)
  function makeGalaxyCore(size) {
    var cv = document.createElement('canvas'); cv.width = cv.height = size;
    var g = cv.getContext('2d'), c = size / 2;
    function radial(r, stops, op) {
      var grd = g.createRadialGradient(c, c, 0, c, c, r);
      for (var i = 0; i < stops.length; i++) grd.addColorStop(stops[i][0], stops[i][1]);
      g.globalAlpha = op; g.fillStyle = grd; g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2); g.fill();
    }
    radial(size * 0.50, [[0, '#7B2FBF'], [1, 'rgba(123,47,191,0)']], 0.16);          // quầng
    radial(size * 0.28, [[0, '#FFC864'], [0.6, '#E84A8A'], [1, 'rgba(232,74,138,0)']], 0.28); // vành
    radial(size * 0.16, [[0, '#FFE9C4'], [0.6, 'rgba(255,233,196,0)'], [1, 'rgba(255,233,196,0)']], 0.5); // lõi
    g.globalAlpha = 1; return cv;
  }

  function rampN(cols, t) {
    t = Math.max(0, Math.min(1, t)); var n = cols.length - 1, f = t * n, i = Math.floor(f); if (i >= n) i = n - 1;
    var fr = f - i, a = cols[i], b = cols[i + 1];
    return { r: a.r + (b.r - a.r) * fr, g: a.g + (b.g - a.g) * fr, b: a.b + (b.b - a.b) * fr };
  }

  // Hành tinh/trăng — render 1 lần, quang học theo LIGHT_DIR (không shading đối xứng tâm)
  function makePlanetTexture(size, opts) {
    var fbm = makeNoise(opts.seed || 7), cv = document.createElement('canvas'); cv.width = cv.height = size;
    var g = cv.getContext('2d'), img = g.createImageData(size, size), d = img.data;
    var pal = opts.palette.map(hexRGB), vein = opts.vein ? hexRGB(opts.vein) : null;
    var R = size / 2, cx = R, cy = R;
    // Pass 1 — bands / mottling (ImageData 1 lượt)
    for (var y = 0; y < size; y++) {
      var ny = (y - cy) / R;
      for (var x = 0; x < size; x++) {
        var nx = (x - cx) / R, i = (y * size + x) * 4;
        if (nx * nx + ny * ny > 1) { d[i + 3] = 0; continue; }
        var z = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)); // độ phồng mặt cầu
        var lat = Math.asin(Math.max(-1, Math.min(1, ny)));    // vĩ độ thật → sọc tự cong ở rìa
        var v;
        if (opts.isMoon) { v = fbm(nx * 3 + 5, ny * 3 + 5); }
        else {
          var band = Math.sin(lat * 9 + fbm(lat * 3, 0.5) * 2.5);
          var twist = fbm(nx / Math.max(z, 0.15), lat * 6) * 0.35; // sọc nén dần về hai cực
          v = (band * 0.6 + twist + 1.3) / 2.6;
        }
        var col = rampN(pal, v);
        if (vein && !opts.isMoon && Math.abs(Math.sin(lat * 9)) > 0.94) { col.r += (vein.r - col.r) * 0.5; col.g += (vein.g - col.g) * 0.5; col.b += (vein.b - col.b) * 0.5; }
        d[i] = col.r; d[i + 1] = col.g; d[i + 2] = col.b; d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    // Pass 2 — limb darkening (multiply 1.0 tâm → 0.55 rìa)
    g.globalCompositeOperation = 'multiply';
    var lg = g.createRadialGradient(cx, cy, 0, cx, cy, R);
    lg.addColorStop(0, '#ffffff'); lg.addColorStop(0.7, '#c8c8c8'); lg.addColorStop(1, '#808080'); // rìa còn 0.5 độ sáng tâm
    g.fillStyle = lg; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    // Pass 3 — terminator (dọc -LIGHT_DIR, lệch 15% về phía khuất). Moon: mặt khuất không đen đặc.
    g.globalCompositeOperation = 'source-over';
    var litFrac = opts.isMoon ? 0.20 : 0.375, lx = LIGHT_DIR.x, ly = LIGHT_DIR.y;
    var dk = opts.isMoon ? '22,22,42' : '5,5,15', dmax = opts.isMoon ? 0.85 : 0.92;
    var tg = g.createLinearGradient(cx + lx * R, cy + ly * R, cx - lx * R, cy - ly * R);
    tg.addColorStop(0, 'rgba(' + dk + ',0)');
    tg.addColorStop(Math.max(0, litFrac - 0.1), 'rgba(' + dk + ',0)');
    tg.addColorStop(Math.min(1, litFrac + 0.15), 'rgba(' + dk + ',' + (dmax * 0.78).toFixed(2) + ')');
    tg.addColorStop(1, 'rgba(' + dk + ',' + dmax + ')');
    g.fillStyle = tg; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    // Pass 4 — viền khí quyển rìa PHÍA SÁNG (moon: sáng + dày hơn để không thành chấm đen)
    var la = Math.atan2(ly, lx);
    function rim(w, op) { g.globalAlpha = op; g.lineWidth = w; g.strokeStyle = '#CDE3FF'; g.beginPath(); g.arc(cx, cy, R - w * 0.5, la - 1.2, la + 1.2); g.stroke(); }
    if (opts.isMoon) { rim(size * 0.016, 0.35); rim(size * 0.010, 0.7); }
    else { rim(size * 0.012, 0.12); rim(size * 0.006, 0.25); rim(size * 0.003, 0.5); }
    // Pass 5 — specular gần nguồn sáng nhất (bỏ ở moon/máy yếu)
    if (opts.specular && !opts.isMoon) {
      var spx = cx + lx * R * 0.8, spy = cy + ly * R * 0.8;
      var sg = g.createRadialGradient(spx, spy, 0, spx, spy, R * 0.12);
      sg.addColorStop(0, 'rgba(255,244,214,0.25)'); sg.addColorStop(1, 'rgba(255,244,214,0)');
      g.globalAlpha = 1; g.fillStyle = sg; g.beginPath(); g.arc(spx, spy, R * 0.12, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1; g.restore();
    return cv;
  }

  // Hành tinh tự quay: tách bands (sọc, seamless ngang) khỏi shade (ánh sáng, tĩnh)
  function makeBandsTex(w, h, opts) {
    var fbm = makeNoise(opts.seed || 7), cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var g = cv.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    var pal = opts.palette.map(hexRGB), vein = opts.vein ? hexRGB(opts.vein) : null;
    for (var y = 0; y < h; y++) {
      var ny = y / (h - 1) * 2 - 1, lat = Math.asin(Math.max(-1, Math.min(1, ny)));
      var band = Math.sin(lat * 9 + fbm(lat * 3, 0.5) * 2.5); // sọc theo vĩ độ (nén về cực)
      var veinOn = Math.abs(Math.sin(lat * 9)) > 0.94;
      for (var x = 0; x < w; x++) {
        var lon = x / w * 2 * Math.PI, s = Math.cos(lon), c = Math.sin(lon);       // periodic → wrap liền mạch
        var twist = fbm((s + 1.5) * 2, (c + 1.5) * 2 + lat * 3) * 0.35;
        var v = (band * 0.6 + twist + 1.3) / 2.6, col = rampN(pal, v);
        if (vein && veinOn) { col.r += (vein.r - col.r) * 0.5; col.g += (vein.g - col.g) * 0.5; col.b += (vein.b - col.b) * 0.5; }
        var i = (y * w + x) * 4; d[i] = col.r; d[i + 1] = col.g; d[i + 2] = col.b; d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0); return cv;
  }
  function makeShadeTex(size, opts) { // overlay trong suốt: limb + terminator + viền + specular (phụ thuộc ánh sáng)
    var cv = document.createElement('canvas'); cv.width = cv.height = size; var g = cv.getContext('2d');
    var R = size / 2, cx = R, cy = R, lx = LIGHT_DIR.x, ly = LIGHT_DIR.y;
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    var lg = g.createRadialGradient(cx, cy, 0, cx, cy, R); // limb darkening (overlay tối rìa)
    lg.addColorStop(0, 'rgba(5,5,15,0)'); lg.addColorStop(0.7, 'rgba(5,5,15,0)'); lg.addColorStop(1, 'rgba(5,5,15,0.5)');
    g.fillStyle = lg; g.fillRect(0, 0, size, size);
    var litFrac = 0.375, tg = g.createLinearGradient(cx + lx * R, cy + ly * R, cx - lx * R, cy - ly * R); // terminator
    tg.addColorStop(0, 'rgba(5,5,15,0)'); tg.addColorStop(Math.max(0, litFrac - 0.1), 'rgba(5,5,15,0)');
    tg.addColorStop(Math.min(1, litFrac + 0.15), 'rgba(5,5,15,0.72)'); tg.addColorStop(1, 'rgba(5,5,15,0.92)');
    g.fillStyle = tg; g.fillRect(0, 0, size, size);
    var la = Math.atan2(ly, lx);
    function rim(w, op) { g.globalAlpha = op; g.lineWidth = w; g.strokeStyle = '#CDE3FF'; g.beginPath(); g.arc(cx, cy, R - w * 0.5, la - 1.2, la + 1.2); g.stroke(); }
    rim(size * 0.012, 0.12); rim(size * 0.006, 0.25); rim(size * 0.003, 0.5);
    if (opts.specular) { var spx = cx + lx * R * 0.8, spy = cy + ly * R * 0.8; var sg = g.createRadialGradient(spx, spy, 0, spx, spy, R * 0.12); sg.addColorStop(0, 'rgba(255,244,214,0.25)'); sg.addColorStop(1, 'rgba(255,244,214,0)'); g.globalAlpha = 1; g.fillStyle = sg; g.beginPath(); g.arc(spx, spy, R * 0.12, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1; g.restore(); return cv;
  }
  function drawPlanetRot(pcx, pcy, pd, alpha) {
    if (!bandsTex || !shadeTex) return; if (alpha === undefined) alpha = 1;
    var pR = pd / 2, dx = pcx - pR, dy = pcy - pR, sw = bandsTex.width, sh = bandsTex.height;
    var srcW = sw * 0.5, srcX = ((time / 140) % 1) * sw, seg1 = Math.min(srcW, sw - srcX); // quay 140s, wrap liền mạch
    ctx.save(); ctx.beginPath(); ctx.arc(pcx, pcy, pR, 0, Math.PI * 2); ctx.clip();
    ctx.globalAlpha = alpha;
    ctx.drawImage(bandsTex, srcX, 0, seg1, sh, dx, dy, seg1 / srcW * pd, pd);
    if (seg1 < srcW) ctx.drawImage(bandsTex, 0, 0, srcW - seg1, sh, dx + seg1 / srcW * pd, dy, (srcW - seg1) / srcW * pd, pd);
    ctx.restore();
    ctx.globalAlpha = alpha; ctx.drawImage(shadeTex, dx, dy, pd, pd); ctx.globalAlpha = 1;
  }

  // B1 — asset loader (app/assets/celestial/*): có ảnh → dùng, thiếu → procedural fallback
  function loadImg(url, cb) { var im = new Image(); im.onload = function () { cb(im); }; im.onerror = function () { cb(null); }; im.src = url; }
  function tryLoadAssets() {
    var base = './assets/celestial/';
    loadImg(base + 'anchor.webp', function (i) { imgAnchor = i; });
    if (!isMobile) {
      loadImg(base + 'ice.webp', function (i) { imgIce = i; });
      loadImg(base + 'rocky.webp', function (i) { imgRocky = i; });
      loadImg(base + 'moon.webp', function (i) { imgMoon = i; });
      loadImg(base + 'cloud-back.webp', function (i) { if (i) cloudBack = i; });
      loadImg(base + 'cloud-mid.webp', function (i) { if (i) cloudMid = i; });
    }
    loadImg(base + 'cloud-front.webp', function (i) { if (i) cloudFront = i; });
  }

  // Mây thể tích procedural (backlit teal-xanh) — fallback khi thiếu ảnh
  function makeCloudTex(w, h, seed, density, outerHex, coreHex) {
    var fbm = makeNoise(seed), cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var g = cv.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    var outer = hexRGB(outerHex), core = hexRGB(coreHex);
    for (var y = 0; y < h; y++) {
      var vy = y / h, edge = 1 - smoothstep(0.6, 1.0, Math.abs(vy - 0.5) * 2); // mờ dần mép trên/dưới
      for (var x = 0; x < w; x++) {
        var n = fbm(x / w * 6, y / h * 3), n2 = fbm(x / w * 13 + 9, y / h * 6 + 4), v = n * 0.7 + n2 * 0.3;
        var a = Math.pow(smoothstep(0.45, 0.85, v), 1.6) * density * edge;
        var mix = smoothstep(0.5, 0.9, v), i = (y * w + x) * 4;
        d[i] = outer.r + (core.r - outer.r) * mix; d[i + 1] = outer.g + (core.g - outer.g) * mix; d[i + 2] = outer.b + (core.b - outer.b) * mix; d[i + 3] = a * 255;
      }
    }
    g.putImageData(img, 0, 0); return cv;
  }

  function drawCloudLayer(tex, cyF, scale, op, parF) { // mây tĩnh gần, parallax theo lớp
    if (!tex) return;
    var cw = W * scale, ch = cw * (tex.height / tex.width);
    ctx.globalAlpha = op; ctx.drawImage(tex, W / 2 - cw / 2 + px * parF, cyF * H - ch / 2 + py * parF, cw, ch); ctx.globalAlpha = 1;
  }
  function drawClouds() { // lớp 1: mây back/mid + front
    var op0, op1, op2;
    if (B4ON) { op0 = cloudLit[0]; op1 = cloudLit[1]; op2 = cloudLit[2]; } // B4: mây bừng theo cloudLight() sóng
    else { var e0 = Math.max(0, Math.min(1, aliveT / 0.5)), e1 = Math.max(0, Math.min(1, (aliveT - 0.15) / 0.5)), e2 = Math.max(0, Math.min(1, (aliveT - 0.3) / 0.5)); op0 = 0.5 * e0; op1 = 0.42 * e1; op2 = 0.28 * e2; } // bản an-toàn: fade so le ALIVE
    drawCloudLayer(cloudBack, 0.42, 1.35, op0, 0.02);
    drawCloudLayer(cloudMid, 0.58, 1.05, op1, 0.05);
    drawCloudLayer(cloudFront, 0.86, 1.5, op2, 0.11);
  }

  // Xếp hàng idle: tinh vân → lõi (tuần tự, không song song)
  function scheduleTextures() {
    if (texScheduled) return; texScheduled = true;
    var TEX = isMobile ? 384 : 512;
    var idle = window.requestIdleCallback || function (cb) { return setTimeout(function () { cb(); }, 1); };
    var jobs = [];
    jobs.push(function () { nebTex.left = makeNebulaTexture(TEX, '#7B2FBF', '#FF8C42', 101, 0.13); });
    if (!isMobile) jobs.push(function () { nebTex.rd = makeNebulaTexture(TEX, '#2E1A6E', '#4ECDC4', 202); });
    jobs.push(function () { nebTex.band = makeNebulaTexture(TEX, '#3A7BD5', '#E84A8A', 303); });
    jobs.push(function () { galaxyCoreTex = makeGalaxyCore(512); });
    // thiên thể (sau tinh vân, tuần tự): hành tinh bands → shade → trăng
    var pg = { palette: ['#1B1440', '#3A2E6E', '#7B2FBF', '#9a5fd0'], vein: '#E84A8A', seed: 711 };
    jobs.push(function () { bandsTex = makeBandsTex(isMobile ? 1024 : 2048, isMobile ? 512 : 1024, pg); });
    jobs.push(function () { shadeTex = makeShadeTex(isMobile ? 640 : 1024, { specular: !isMobile }); });
    if (!isMobile) {
      jobs.push(function () { moonTex = makePlanetTexture(256, { palette: ['#2A2A3E', '#4A4A66', '#6E6E8A'], isMoon: true, seed: 822 }); });
      jobs.push(function () { iceTex = makePlanetTexture(512, { palette: ['#1A1636', '#2E1A6E', '#3A7BD5', '#6E8FD0'], seed: 911 }); });     // ice: xanh-tím
      jobs.push(function () { rockyTex = makePlanetTexture(384, { palette: ['#241814', '#4A2E22', '#7A4A34'], isMoon: true, seed: 922 }); }); // rocky: gỉ ấm
    }
    // mây 3 tấm procedural (bake nếu chưa có ảnh; ảnh load async sẽ override)
    if (!isMobile) {
      jobs.push(function () { if (!cloudBack) cloudBack = makeCloudTex(1024, 440, 401, 0.55, '#0A2630', '#1E6E7A'); });
      jobs.push(function () { if (!cloudMid) cloudMid = makeCloudTex(1024, 440, 402, 0.5, '#0C2E3A', '#2DB0B0'); });
    }
    jobs.push(function () { if (!cloudFront) cloudFront = makeCloudTex(768, 300, 403, 0.3, '#123844', '#3AD0C4'); });
    (function run() { if (!jobs.length) return; var job = jobs.shift(); idle(function () { job(); run(); }); })();
  }

  function drawTex(tex, cxF, cyF, sizeVw, rot, baseOp, phase) {
    if (!tex) return;
    var w = sizeVw / 100 * W, cx = cxF * W + px * 0.03, cy = cyF * H + py * 0.03;
    ctx.globalAlpha = baseOp * (1 + 0.15 * Math.sin(time * (2 * Math.PI / 22) + phase));
    ctx.save(); ctx.translate(cx, cy); if (rot) ctx.rotate(rot); ctx.drawImage(tex, -w / 2, -w / 2, w, w); ctx.restore();
  }

  // Lớp 1 — khí quyển (mây 3 tấm + tinh vân texture). Vẽ TRƯỚC sao xa.
  function drawNebulaBg() {
    drawClouds();                                        // mây back/mid/front (B1) — nền xa nhất
    ctx.globalCompositeOperation = 'screen';
    drawTex(nebTex.left, 0.30, 0.42, 52, 0, 0.62, 0);
    drawTex(nebTex.rd, 0.92, 0.80, 44, 0, 0.55, 1.7);
    if (nebTex.band) {                                   // dải: kéo giãn ×3/×0.6, rotate -24°
      var w = 40 / 100 * W;
      ctx.globalAlpha = 0.55 * (1 + 0.15 * Math.sin(time * (2 * Math.PI / 22) + 3.1));
      ctx.save(); ctx.translate(W / 2 + px * 0.03, H / 2 + py * 0.03); ctx.rotate(-24 * Math.PI / 180); ctx.scale(3, 0.6);
      ctx.drawImage(nebTex.band, -w / 2, -w / 2, w, w);
      var cyc = time % 32;                                // B.3: cửa sổ sáng chạy dọc dải 28s + 4s nghỉ
      if (cyc < 28) {
        var fr = cyc / 28, winW = 0.18 * w, wx = -w / 2 + fr * w;
        var fg = ctx.createLinearGradient(wx - winW / 2, 0, wx + winW / 2, 0);
        fg.addColorStop(0, 'rgba(255,244,214,0)'); fg.addColorStop(0.5, 'rgba(255,244,214,0.05)'); fg.addColorStop(1, 'rgba(255,244,214,0)');
        ctx.globalAlpha = 1; ctx.fillStyle = fg; ctx.fillRect(wx - winW / 2, -w / 2, winW, w);
      }
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ---- Kepler (định luật tham số, KHÔNG n-body — Trụ 6) ----
  function TP(g, k, def) { return (window.TUNE && window.TUNE.register) ? window.TUNE.register(g, k, def) : { value: def.value }; }
  function initOrbits() {
    if (ORB) return; var G = 'Quỹ đạo';
    ORB = {
      tilt: TP(G, 'tilt', { value: -24, min: -45, max: 0, step: 1, label: 'Nghiêng mặt phẳng (°)' }),
      incline: TP(G, 'incline', { value: 0.26, min: 0.1, max: 0.6, step: 0.01, label: 'Độ dẹt (nhỏ=dẹt)' }),
      aAnchor: TP(G, 'aAnchor', { value: 0.92, min: 0.5, max: 1.4, step: 0.02, label: 'Bán trục anchor (×W)' }),
      ecc: TP(G, 'ecc', { value: 0.34, min: 0, max: 0.6, step: 0.02, label: 'Độ lệch tâm' }),
      anchorPh: TP(G, 'anchorPhase', { value: 0.52, min: 0, max: 1, step: 0.01, label: 'Pha anchor' }),
      Td: TP(G, 'T_distant', { value: 240, min: 60, max: 600, step: 10, label: 'Chu kỳ distant (s)' }),
      Tr: TP(G, 'T_rocky', { value: 420, min: 120, max: 900, step: 10, label: 'Chu kỳ rocky (s)' }),
      Ti: TP(G, 'T_ice', { value: 540, min: 120, max: 1200, step: 10, label: 'Chu kỳ ice (s)' }),
      Ta: TP(G, 'T_anchor', { value: 1200, min: 300, max: 2400, step: 30, label: 'Chu kỳ anchor (s)' }),
      Tm: TP(G, 'T_moon', { value: 150, min: 60, max: 300, step: 5, label: 'Chu kỳ trăng (s)' })
    };
  }
  function initClimate() {
    if (CLIM) return; var G = 'Khí hậu';
    CLIM = {
      radius: TP(G, 'radius', { value: 1.75, min: 1, max: 3, step: 0.05, label: 'Bán kính vùng (×D)' }),
      halo: TP(G, 'halo', { value: 0.06, min: 0, max: 0.12, step: 0.005, label: 'Opacity quầng tint' }),
      dustLerp: TP(G, 'dustLerp', { value: 0.30, min: 0, max: 0.6, step: 0.02, label: '% lerp màu bụi' })
    };
  }
  function updateClimateTiles() { // V5: ô trong vùng khí hậu nào → thấm màu vào viền (mỗi 0.5s)
    if (!CLIM) return;
    var els = document.querySelectorAll('#bento .tile.cosmic-crystallized'), pct = (LIGHTP ? LIGHTP.tileTint.value : 7) + '%';
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, hit = null;
      for (var k = 0; k < 3; k++) { var c = CLIMATE[k]; if (c.r <= 0) continue; if (Math.hypot(cx - c.cx, cy - c.cy) < c.r) { hit = c; break; } }
      if (hit) { els[i].style.setProperty('--climate-tint', 'rgb(' + hit.col[0] + ',' + hit.col[1] + ',' + hit.col[2] + ')'); els[i].style.setProperty('--climate-pct', pct); }
      else els[i].style.removeProperty('--climate-tint');
    }
  }
  function drawClimateHalos() { // quầng tint (bloom 'lighter' — phần ló khỏi grid rực lên)
    if (!CLIM) return;
    ctx.globalCompositeOperation = 'lighter';
    var hb = (CLIM.halo.value) * (LIGHTP ? LIGHTP.bloom.value : 1);
    for (var k = 0; k < 3; k++) {
      var c = CLIMATE[k]; if (c.r <= 0) continue;
      var pre = 'rgba(' + c.col[0] + ',' + c.col[1] + ',' + c.col[2];
      var g = ctx.createRadialGradient(c.cx, c.cy, 0, c.cx, c.cy, c.r);
      g.addColorStop(0, pre + ',' + hb + ')'); g.addColorStop(1, pre + ',0)');
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function solveKepler(M, e) { var E = M; for (var i = 0; i < 5; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; }
  function keplerPos(a, period, phase) { // vị trí = HÀM giải tích của time (an toàn throttle/tua)
    var e = ORB.ecc.value, M = 2 * Math.PI * (((time / period) + phase) % 1), E = solveKepler(M, e);
    var u = a * (Math.cos(E) - e), v = a * Math.sqrt(1 - e * e) * Math.sin(E) * ORB.incline.value;
    var t = ORB.tilt.value * Math.PI / 180, ca = Math.cos(t), sa = Math.sin(t);
    var fx = coreX + px * 0.04, fy = coreY + py * 0.04; // tiêu điểm = lõi (corePos responsive)
    return { x: fx + (u * ca - v * sa), y: fy + (u * sa + v * ca) };
  }
  function drawDistant(p) { // silhouette + rim 1px
    var r = 0.012 * W, la = Math.atan2(LIGHT_DIR.y, LIGHT_DIR.x);
    ctx.globalAlpha = 1; ctx.fillStyle = '#0D0B21'; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.7; ctx.strokeStyle = '#CDE3FF'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, r, la - 1.0, la + 1.0); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawBody(tex, p, size, alpha) { if (tex && (alpha === undefined || alpha > 0.01)) { ctx.globalAlpha = alpha === undefined ? 1 : alpha; ctx.drawImage(tex, p.x - size / 2, p.y - size / 2, size, size); ctx.globalAlpha = 1; } }

  // Lớp thiên thể — hệ Kepler quanh tiêu điểm lõi (v2.0). Vẽ SAU sao xa (che sao sau lưng).
  function drawCelestials() {
    if (!ORB) return;
    var aA = ORB.aAnchor.value * W, base = aA / 4.9;
    // lõi thiên hà = tiêu điểm (parallax 0.04), sáng nhất nền
    if (galaxyCoreTex) {
      var gcx = coreX + px * 0.04, gcy = coreY + py * 0.04, gw = 36 / 100 * W;
      ctx.globalCompositeOperation = 'lighter';          // lõi cộng sáng (nguồn nhìn thấy)
      ctx.globalAlpha = Math.min(1, 0.92 * (1 + 0.08 * Math.sin(time * (2 * Math.PI / 12))) * (LIGHTP ? LIGHTP.core.value * LIGHTP.bloom.value : 1) * (B4ON ? coreEnergyV : 1));
      ctx.save(); ctx.translate(gcx, gcy); ctx.rotate(-24 * Math.PI / 180); ctx.scale(1, 0.6);
      ctx.drawImage(galaxyCoreTex, -gw / 2, -gw / 2, gw, gw); ctx.restore();
      drawCorePulse(gcx, gcy, gw);
      ctx.globalCompositeOperation = 'source-over';
    }
    // vị trí Kepler (xa→gần) + cập nhật bản đồ khí hậu (bám Kepler(t), không bake tọa độ)
    var pa = keplerPos(aA, ORB.Ta.value, ORB.anchorPh.value);
    anchorCX = pa.x; anchorCY = pa.y; var pd = (isMobile ? 0.36 : 0.48) * W; anchorAR = pd / 2;
    var cr = CLIM ? CLIM.radius.value : 1.75;
    CLIMATE[0].cx = anchorCX; CLIMATE[0].cy = anchorCY; CLIMATE[0].r = cr * pd;
    var pRock, pIce;
    if (!isMobile) {
      pRock = keplerPos(1.7 * base, ORB.Tr.value, 0.35); pIce = keplerPos(2.9 * base, ORB.Ti.value, 0.70);
      CLIMATE[1].cx = pIce.x; CLIMATE[1].cy = pIce.y; CLIMATE[1].r = cr * 0.14 * W;
      CLIMATE[2].cx = pRock.x; CLIMATE[2].cy = pRock.y; CLIMATE[2].r = cr * 0.10 * W;
    }
    if (!preAlive) drawClimateHalos();                   // quầng tint (bỏ ở pre-alive)
    if (revealA.distant > 0.01) drawDistant(keplerPos(base, ORB.Td.value, 0.0)); // distant: dot, hiện khi reveal
    if (!isMobile) { drawBody(imgRocky || rockyTex, pRock, 0.10 * W, B4ON ? revealA.rocky : 1); drawBody(imgIce || iceTex, pIce, 0.14 * W, B4ON ? revealA.ice : 1); } // reveal-gated
    var mAng = 2 * Math.PI * ((time / ORB.Tm.value) % 1), moonFront = Math.sin(mAng) > 0;
    var t = ORB.tilt.value * Math.PI / 180, ca = Math.cos(t), sa = Math.sin(t);
    var mrx = Math.cos(mAng) * anchorAR * 1.5, mry = Math.sin(mAng) * anchorAR * 1.5 * ORB.incline.value;
    var moonX = anchorCX + (mrx * ca - mry * sa), moonY = anchorCY + (mrx * sa + mry * ca), md = 0.07 * W;
    var moonG = imgMoon || moonTex, av = B4ON ? revealA.anchor : 1;            // moon reveal cùng anchor
    if (moonG && !moonFront) drawBody(moonG, { x: moonX, y: moonY }, md, av);   // cung XA: sau anchor
    if (av > 0.01) { if (imgAnchor) drawBody(imgAnchor, { x: anchorCX, y: anchorCY }, pd, av); else if (bandsTex) drawPlanetRot(anchorCX, anchorCY, pd, av); }
    if (moonG && moonFront) drawBody(moonG, { x: moonX, y: moonY }, md, av);    // cung GẦN: trước anchor = transit
    ctx.globalAlpha = 1;
  }

  // B.2 — xung lõi thiên hà: vòng ellipse nở mỗi 25–45s, không trùng sao băng
  function drawCorePulse(gcx, gcy, gw) {
    if (!corePulse.active) {
      if (time >= nextPulse && document.visibilityState === 'visible') {
        if (meteor.active || Math.abs(time - nextMeteor) < 1.5) { nextPulse = time + 3; return; } // hoãn nếu trùng sao băng
        corePulse.active = true; corePulse.start = time; buildPingTiles(gcx, gcy); // B6: cache tile để quét
      }
      return;
    }
    var k = (time - corePulse.start) / 4;                 // nở trong 4s (sim-time)
    if (k >= 1) { corePulse.active = false; nextPulse = time + rand(25, 45); return; }
    var r = (gw * 0.5) * (1 + 1.6 * k);
    ctx.save(); ctx.translate(gcx, gcy); ctx.rotate(-24 * Math.PI / 180); ctx.scale(1, 0.6);
    ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(255,200,100,' + (0.06 * (1 - k)).toFixed(3) + ')'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    pingTilesSweep(k);                                    // B6: sóng quét tile theo khoảng cách
  }
  var pingTiles = null;
  function buildPingTiles(gcx, gcy) {
    var els = document.querySelectorAll('#bento .tile.cosmic-crystallized');
    pingTiles = []; var maxD = 1;
    for (var i = 0; i < els.length; i++) { var r = els[i].getBoundingClientRect(); var cx = r.left + r.width / 2, cy = r.top + r.height / 2; var d = Math.hypot(cx - gcx, cy - gcy); maxD = Math.max(maxD, d); pingTiles.push({ el: els[i], d: d, pinged: false }); }
    for (var j = 0; j < pingTiles.length; j++) pingTiles[j].maxD = maxD;
  }
  function pingTilesSweep(k) {
    if (!pingTiles) return;
    for (var i = 0; i < pingTiles.length; i++) {
      var t = pingTiles[i]; if (t.pinged) continue;
      if (k * t.maxD >= t.d) { // sóng lan tới tile này
        t.pinged = true; t.el.classList.add('cosmic-ping');
        (function (el) { setTimeout(function () { el.classList.remove('cosmic-ping'); }, 600); })(t.el); // thở 1 nhịp 0.6s
      }
    }
  }

  function makeDust(p, seed) {
    p.x = seed && seed.x != null ? seed.x : rand(0, W);
    p.y = seed && seed.y != null ? seed.y : rand(0, H);
    var ang = rand(-Math.PI * 0.75, -Math.PI * 0.25), spd = rand(2, 6);
    p.vx = Math.cos(ang) * spd; p.vy = Math.sin(ang) * spd;
    p.size = rand(1, 2.5); p.baseOp = rand(0.15, 0.4);
    p.color = DUST_COLORS[(Math.random() * DUST_COLORS.length) | 0];
    p.rgb = hexRGB(p.color); p.tint = 0; p.tcol = p.rgb; // khí hậu màu (lerp về màu vùng)
    p.tw = Math.random() * Math.PI * 2; p.borrow = null;
    return p;
  }
  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5); } // ~N(0,~0.5)
  function makeFaint(p, seed) {
    if (seed && seed.x != null) { p.x = seed.x; p.y = seed.y; }
    else { p.x = rand(0, W); p.y = rand(0, H); }
    p.tier = 'faint'; p.size = rand(0.6, 1.1); p.baseOp = rand(0.25, 0.5); p.twAmp = rand(0.05, 0.18);
    p.color = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6);
    return p;
  }
  function makeMid(p) {
    p.x = rand(0, W); p.y = rand(0, H);
    p.tier = 'mid'; p.size = rand(1.5, 2.2); p.baseOp = rand(0.5, 0.8); p.twAmp = rand(0.05, 0.18);
    p.color = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6);
    return p;
  }
  function makeHero(p, glint) {
    p.x = Math.random() < 0.5 ? rand(0, 0.25 * W) : rand(0.75 * W, W); // chỉ hai cánh
    p.y = rand(0, H);
    p.tier = 'hero'; p.size = rand(2.5, 3.5); p.baseOp = rand(0.75, 0.95); p.twAmp = 0.06;
    p.color = Math.random() < 0.7 ? (Math.random() < 0.5 ? '#CDE3FF' : '#FFFFFF') : STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6); p.glint = !!glint; p.diamond = !!glint; // 3 ngôi sáng nhất: kim cương 8 cánh
    return p;
  }
  function makeEmber(p) {
    p.x = rand(0, W); p.y = rand(0, H);
    var ang = rand(-Math.PI * 0.75, -Math.PI * 0.25), spd = rand(1, 3);
    p.vx = Math.cos(ang) * spd; p.vy = Math.sin(ang) * spd;
    p.size = rand(3, 5); p.baseOp = rand(0.14, 0.24);
    p.color = EMBER_COLORS[(Math.random() * EMBER_COLORS.length) | 0];
    return p;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    recalcScroll(); updateCorePos();
  }
  function recalcScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    docScroll = Math.max(1, (document.documentElement.scrollHeight - window.innerHeight));
  }
  function densityAt() { return 1 - 0.7 * Math.min(1, scrollY / docScroll); }

  function clusterCenters() {
    return [ { x: 0.30 * W, y: 0.42 * H },   // (a) trong tinh vân trái
             { x: 0.62 * W, y: 0.50 * H },   // (b) trên dải chéo giữa-phải
             { x: coreX, y: coreY } ];       // (c) gần lõi thiên hà (bám corePos)
  }
  function clusterPlace(st, C) {
    var c = C[(Math.random() * 3) | 0], sig = 0.04 * H;
    st.x = c.x + gauss() * 2 * sig; st.y = c.y + gauss() * 2 * sig;
    if (Math.random() < 0.6) st.color = '#FFE9C4'; // ấm hơn nền chung
  }
  function initStars() {
    var sm = LIGHTP ? LIGHTP.starMul.value : 1;
    var nFaint = ((isMobile ? 90 : 200) * sm) | 0, nMid = ((isMobile ? 22 : 50) * sm) | 0, nHero = ((isMobile ? 4 : 9) * sm) | 0;
    nStars = nFaint + nMid + nHero; stars = new Array(nStars); var idx = 0;
    var C = clusterCenters(), sig = 0.04 * H;
    // thứ tự [hero, mid, faint] để auto-reduce (giảm từ cuối) rớt faint trước, giữ hero
    for (var h = 0; h < nHero; h++) {
      var hs = makeHero({}, h < 3);
      if (h === 0) { hs.x = C[1].x + rand(0.03, 0.05) * W; hs.y = C[1].y + gauss() * 2 * sig; } // neo rìa cụm (b)
      else if (h === 1) { hs.x = C[2].x - rand(0.03, 0.05) * W; hs.y = C[2].y + gauss() * 2 * sig; } // rìa cụm (c)
      stars[idx++] = hs;
    }
    for (var m = 0; m < nMid; m++) { var ms = makeMid({}); if (Math.random() < 0.4) clusterPlace(ms, C); stars[idx++] = ms; }
    for (var f = 0; f < nFaint; f++) {
      var seed = starSeeds && starSeeds[f] ? starSeeds[f] : null;
      var fs = makeFaint({}, seed);
      if (!seed && Math.random() < 0.4) clusterPlace(fs, C);
      stars[idx++] = fs;
    }
  }
  function initEmbers() {
    nEmbers = isMobile ? 7 : 14; embers = new Array(nEmbers);
    for (var i = 0; i < nEmbers; i++) embers[i] = makeEmber({});
  }

  function step(now) {
    if (!running) return;
    var dt = Math.min((now - lastT) / 1000, 0.05); lastT = now; time += dt;
    if (alive) { aliveT += dt; climT += dt; if (climT >= 0.5) { climT = 0; updateClimateTiles(); } }
    if (B4ON) b4Lerp(dt);
    if (B4ON && preAlive && !alive) { // pre-alive: chỉ mây + thiên thể đã reveal (VOID/EXPLODE/...)
      ctx.clearRect(0, 0, W, H); drawClouds(); drawCelestials(); ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step); return;
    }

    // perf auto-reduce (P3.2): dt>0.04 liên tiếp 3 frame → giảm dust trước, stars sau, embers không giảm
    if (dt > 0.04) {
      slowFrames++;
      if (slowFrames >= 3) {
        if (nDust > 40) nDust = Math.floor(nDust * 0.7);
        else if (nStars > 40) nStars = Math.floor(nStars * 0.7);
        slowFrames = 0;
      }
    } else slowFrames = 0;

    // parallax chuột (desktop, alive)
    if (!isMobile && alive) {
      px += (mx - px) * 0.05; py += (my - py) * 0.05;
      clx += (cursorX - clx) * 0.06; cly += (cursorY - cly) * 0.06;
      lightAmt += (lightTarget - lightAmt) * Math.min(1, dt * 1.25); // fade ~0.8s
    } else { px *= 0.9; py *= 0.9; }

    var t0 = DEBUG ? performance.now() : 0;
    ctx.clearRect(0, 0, W, H);
    var parallax = -scrollY * 0.25;
    var gmul = densityAt();

    // ---- lớp 1: tinh vân texture (khí quyển) ----
    if (alive) drawNebulaBg();

    // ---- lớp 1b: sao xa (bloom 'lighter', quầng hero mềm, flare) ----
    if (alive) {
      updateFlare();
      ctx.globalCompositeOperation = 'lighter';          // sao cộng sáng
      var glA = LIGHTP ? LIGHTP.glint.value : 0.6, bl = LIGHTP ? LIGHTP.bloom.value : 1;
      for (var s = 0; s < nStars; s++) {
        var st = stars[s];
        var tw = Math.sin(time * st.twSpeed + st.tw) * st.twAmp;
        var sx = st.x + px * 0.05, sy = st.y + py * 0.05, r = st.size, fl = 1, glintNow = st.glint;
        var op = Math.max(0, st.baseOp + tw);
        op *= (1 + 0.08 * Math.sin(time * 0.3 + st.x * 0.002 + st.y * 0.001)); // sóng nhấp nháy không gian
        if (flare.active && flare.star === st) { fl = flareEnv(); op *= (1 + 2 * fl); r *= (1 + 0.6 * fl); glintNow = true; } // flare
        op = Math.min(0.95, op);
        if (lightAmt > 0.01) { var ld = Math.hypot(sx - clx, sy - cly); if (ld < 200) op = Math.min(0.95, op + 0.15 * (1 - ld / 200) * lightAmt); }
        if (op <= 0.01) continue;
        ctx.fillStyle = st.color;
        if (st.tier === 'hero' || (flare.star === st && fl > 0.1)) {
          if (heroGlowTex) { ctx.globalAlpha = Math.min(1, op * 0.9 * bl); ctx.drawImage(heroGlowTex, sx - r * 4, sy - r * 4, r * 8, r * 8); } // quầng mềm
          ctx.globalAlpha = op; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill(); // lõi
          if (glintNow) {
            ctx.globalAlpha = glA * (0.6 + 0.4 * fl); ctx.strokeStyle = st.color; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(sx - r * 5, sy); ctx.lineTo(sx + r * 5, sy); ctx.moveTo(sx, sy - r * 5); ctx.lineTo(sx, sy + r * 5); ctx.stroke();
            if (st.diamond) { ctx.globalAlpha = glA * 0.5; var dd = r * 3; ctx.beginPath(); ctx.moveTo(sx - dd, sy - dd); ctx.lineTo(sx + dd, sy + dd); ctx.moveTo(sx - dd, sy + dd); ctx.lineTo(sx + dd, sy - dd); ctx.stroke(); } // kim cương 8 cánh
          }
        } else {
          ctx.globalAlpha = op; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }

    // ---- lớp 2: thiên thể (che sao sau lưng) ----
    if (alive) drawCelestials();

    // ---- đèn con trỏ (bloom 'lighter') ----
    if (alive && !isMobile && cursorTex && lightAmt > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (LIGHTP ? LIGHTP.cursorOp.value : 0.05) * lightAmt * (LIGHTP ? LIGHTP.bloom.value : 1);
      ctx.drawImage(cursorTex, clx - 300, cly - 300, 600, 600);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }

    // ---- lớp 3: dust (bụi gần camera, trước thiên thể) ----
    for (var i = 0; i < nDust; i++) {
      var p = dust[i];
      if (p.borrow) {
        var b = p.borrow; b.t += dt;
        var k = Math.min(b.t / b.dur, 1), e = 1 - Math.pow(1 - k, 3);
        p.x = b.sx + (b.tx - b.sx) * e; p.y = b.sy + (b.ty - b.sy) * e;
        if (k >= 1) {
          if (b.phase === 'in') { if (b.cb) b.cb(); b.phase = 'out'; b.t = 0; b.sx = p.x; b.sy = p.y; b.tx = p.x + rand(-40, 40); b.ty = p.y + rand(-40, 40); }
          else { p.borrow = null; }
        }
      } else {
        if (attractor.active) {
          var ddx = attractor.x - p.x, ddy = attractor.y - p.y, dist = Math.hypot(ddx, ddy);
          if (dist < 150 && dist > 1) { var force = (1 - dist / 150) * 30; p.vx += (ddx / dist) * force * dt; p.vy += (ddy / dist) * force * dt; }
        }
        if (lightAmt > 0.3 && !isMobile) { // đèn con trỏ hút bụi nhẹ (50% hover)
          var cdx = clx - p.x, cdy = cly - p.y, cdd = Math.hypot(cdx, cdy);
          if (cdd < 150 && cdd > 1) { var cf = (1 - cdd / 150) * 15 * lightAmt; p.vx += (cdx / cdd) * cf * dt; p.vy += (cdy / cdd) * cf * dt; }
        }
        if (anchorAR > 0) { // hấp dẫn nhìn thấy: bụi bẻ cong quanh anchor (slingshot, không rơi vào)
          var adx = p.x - anchorCX, ady = p.y - anchorCY, ad = Math.hypot(adx, ady), reach = anchorAR * 1.6;
          if (ad < reach && ad > 1) { var nxr = adx / ad, nyr = ady / ad, sf = (1 - ad / reach) * 20; p.vx += (-nyr * sf + nxr * sf * 0.3) * dt; p.vy += (nxr * sf + nyr * sf * 0.3) * dt; }
        }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.99; p.vy *= 0.99;
        if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5; else if (p.y > H + 5) p.y = -5;
      }
      var dy = ((p.y + parallax) % H + H) % H;
      var dtw = Math.sin(time * 1.5 + p.tw) * 0.05;
      var dop = Math.max(0, Math.min(0.4, (p.baseOp + dtw) * gmul));
      if (dop <= 0.01) continue;
      // khí hậu màu: dùng CHUNG distance với slingshot — bụi vào vùng lerp về màu vùng ≤30%
      if (CLIM) {
        var zt = null, zbest = 1e9;
        for (var ci = 0; ci < 3; ci++) { var cz = CLIMATE[ci]; if (cz.r <= 0) continue; var zd = Math.hypot(p.x - cz.cx, dy - cz.cy); if (zd < cz.r && zd < zbest) { zbest = zd; zt = cz; } }
        var want = zt ? CLIM.dustLerp.value * (1 - zbest / zt.r) : 0;
        if (zt) p.tcol = zt.col;
        p.tint += (want - p.tint) * Math.min(1, dt * 2);
      }
      if (p.tint > 0.01) {
        var tr = p.rgb.r + (p.tcol[0] - p.rgb.r) * p.tint, tg = p.rgb.g + (p.tcol[1] - p.rgb.g) * p.tint, tb = p.rgb.b + (p.tcol[2] - p.rgb.b) * p.tint;
        ctx.fillStyle = 'rgb(' + (tr | 0) + ',' + (tg | 0) + ',' + (tb | 0) + ')';
      } else ctx.fillStyle = p.color;
      ctx.globalAlpha = dop;
      ctx.beginPath(); ctx.arc(p.x + px * 0.15, dy, p.size, 0, Math.PI * 2); ctx.fill();
    }

    // ---- embers (2 arc lồng, bloom 'lighter') ----
    if (alive) {
      ctx.globalCompositeOperation = 'lighter';
      var eb = LIGHTP ? LIGHTP.bloom.value : 1;
      for (var m = 0; m < nEmbers; m++) {
        var em = embers[m];
        em.x += em.vx * dt; em.y += em.vy * dt; em.vx *= 0.995; em.vy *= 0.995;
        if (em.x < -8) em.x = W + 8; else if (em.x > W + 8) em.x = -8;
        if (em.y < -8) em.y = H + 8; else if (em.y > H + 8) em.y = -8;
        var ey = ((em.y + parallax) % H + H) % H, ex = em.x + px * 0.22;
        ctx.fillStyle = em.color;
        ctx.globalAlpha = em.baseOp * 0.5 * eb;
        ctx.beginPath(); ctx.arc(ex, ey, em.size * 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = em.baseOp * eb;
        ctx.beginPath(); ctx.arc(ex, ey, em.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    // ---- meteor ----
    if (alive) updateMeteor(dt);

    ctx.globalAlpha = 1;

    // ---- bento parallax (ngược hướng chuột, ±3px) ----
    if (bentoEl && !isMobile) {
      var kx = 6 / (W * 0.5 || 1), ky = 6 / (H * 0.5 || 1);
      var bx = Math.max(-6, Math.min(6, -px * kx)), by = Math.max(-6, Math.min(6, -py * ky));
      bentoEl.style.transform = 'translate(' + bx.toFixed(2) + 'px,' + by.toFixed(2) + 'px)';
    }

    if (DEBUG) { dbgAcc += performance.now() - t0; if (++dbgN >= 60) { console.log('[dust] avg draw ' + (dbgAcc / dbgN).toFixed(2) + 'ms  dust=' + nDust + ' stars=' + nStars); dbgAcc = 0; dbgN = 0; } }
    raf = requestAnimationFrame(step);
  }

  function updateMeteor(dt) {
    if (!meteor.active) {
      if (time >= nextMeteor && document.visibilityState === 'visible') {
        var ang = rand(Math.PI / 6, Math.PI * 2 / 9); // 30–40° chéo xuống
        meteor.active = true; meteor.age = 0; meteor.len = rand(90, 140);
        meteor.x = rand(0, W); meteor.y = rand(0, 0.2 * H);
        meteor.vx = Math.cos(ang) * 600; meteor.vy = Math.sin(ang) * 600;
      }
      return;
    }
    meteor.age += dt; meteor.x += meteor.vx * dt; meteor.y += meteor.vy * dt;
    if (meteor.age >= 0.6) { meteor.active = false; nextMeteor = time + rand(25, 40); return; }
    var sp = Math.hypot(meteor.vx, meteor.vy) || 1, dirx = meteor.vx / sp, diry = meteor.vy / sp;
    var tx = meteor.x - dirx * meteor.len, ty = meteor.y - diry * meteor.len;
    var op = 1 - meteor.age / 0.6;
    var grad = ctx.createLinearGradient(meteor.x, meteor.y, tx, ty);
    grad.addColorStop(0, 'rgba(255,255,255,' + (0.7 * op).toFixed(3) + ')');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1; ctx.strokeStyle = grad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  function startLoop() { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(step); }
  function stopLoop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  // ---------------- B4 bridge API ----------------
  var cloudTarget = [0.06, 0.06, 0.06];
  function b4Lerp(dt) { // ramp reveal / coreEnergy / mây bừng (gọi trong step khi B4ON)
    for (var k in revealA) revealA[k] += (revealT[k] - revealA[k]) * Math.min(1, dt / 0.4);
    coreEnergyV += (coreEnergyTarget - coreEnergyV) * Math.min(1, dt / 0.4);
    for (var i = 0; i < 3; i++) cloudLit[i] += (cloudTarget[i] - cloudLit[i]) * Math.min(1, dt / 0.5);
  }
  function formationTargets() { // screen-space tại Kepler(time) hiện tại
    if (!ORB) { updateCorePos(); initOrbits(); initClimate(); }
    var aA = ORB.aAnchor.value * W, base = aA / 4.9;
    var bodies = [
      { name: 'distant', r: 0.012 * W }, { name: 'rocky', r: 0.05 * W },
      { name: 'ice', r: 0.07 * W }, { name: 'anchor', r: (isMobile ? 0.18 : 0.24) * W }
    ];
    var pD = keplerPos(base, ORB.Td.value, 0.0), pR = keplerPos(1.7 * base, ORB.Tr.value, 0.35),
        pI = keplerPos(2.9 * base, ORB.Ti.value, 0.70), pA = keplerPos(aA, ORB.Ta.value, ORB.anchorPh.value);
    bodies[0].x = pD.x; bodies[0].y = pD.y; bodies[1].x = pR.x; bodies[1].y = pR.y;
    bodies[2].x = pI.x; bodies[2].y = pI.y; bodies[3].x = pA.x; bodies[3].y = pA.y;
    return { core: corePos(), bodies: bodies, clouds: [{ x: 0.30 * W, y: 0.42 * H }, { x: 0.58 * W, y: 0.58 * H }, { x: 0.86 * W, y: 0.86 * H }] };
  }
  function reveal(name) { if (revealT[name] !== undefined) revealT[name] = 1; }
  function coreEnergy(v) { coreEnergyTarget = Math.max(0, Math.min(1, v)); }
  function cloudLight(i) { if (i >= 0 && i < 3) cloudTarget[i] = CLOUD_BASE[i]; }
  function pregenTextures() { scheduleTextures(); }
  function startPreAlive() { // B4: render CHỈ mây (+ thiên thể đã reveal) trong intro
    if (alive || preAlive) return;
    canvas = document.getElementById('dust-layer'); if (!canvas) return;
    ctx = canvas.getContext('2d'); resize();
    updateCorePos(); initLight(); initOrbits(); initClimate();
    if (!heroGlowTex) heroGlowTex = makeHeroGlow();
    scheduleTextures();                                   // bake sớm → VOID có mây (diệt pop)
    preAlive = true; startLoop();
  }

  // ---------------- API ----------------
  function start(seedPoints) {
    if (started) return; started = true;
    canvas = document.getElementById('dust-layer'); if (!canvas) return;
    ctx = canvas.getContext('2d'); resize();
    nDust = isMobile ? (rand(60, 80) | 0) : (rand(150, 200) | 0);
    dust = new Array(nDust);
    for (var i = 0; i < nDust; i++) dust[i] = makeDust({}, seedPoints && seedPoints[i] ? seedPoints[i] : null);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', recalcScroll, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopLoop(); else startLoop(); });
    startLoop();
    setupCondense();
    if (!isMobile) setupHover();
  }

  function seedStars(points) { starSeeds = points || null; }

  function drawStarsStatic() {
    for (var s = 0; s < nStars; s++) {
      var st = stars[s], op = Math.min(0.95, st.baseOp); if (op <= 0.01) continue;
      ctx.fillStyle = st.color;
      if (st.tier === 'hero') {
        ctx.globalAlpha = op * 0.18; ctx.beginPath(); ctx.arc(st.x, st.y, st.size * 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = op * 0.32; ctx.beginPath(); ctx.arc(st.x, st.y, st.size * 2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = op; ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2); ctx.fill();
      } else { ctx.globalAlpha = op; ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  function renderReducedStatic() { // time=0, px=py=0 → mọi thứ đứng yên, chỉ MÀU + HÌNH
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    if (nebTex.left || nebTex.band) drawNebulaBg();
    drawStarsStatic();
    drawCelestials();
  }
  function renderReducedUntilLoaded() {
    var frames = 0;
    (function tick() {
      renderReducedStatic();
      var loaded = nebTex.left && nebTex.band && galaxyCoreTex && bandsTex && shadeTex && (isMobile || moonTex);
      if (loaded) frames++;
      if (frames < 3) requestAnimationFrame(tick); // vẽ thêm vài khung sau khi texture load xong rồi DỪNG
    })();
  }

  function enterAlive() {
    if (alive) return; alive = true; preAlive = false;
    if (B4ON) { revealA = { distant: 1, rocky: 1, ice: 1, anchor: 1 }; revealT = { distant: 1, rocky: 1, ice: 1, anchor: 1 }; coreEnergyV = coreEnergyTarget = 1; cloudLit = CLOUD_BASE.slice(); cloudTarget = CLOUD_BASE.slice(); } // ALIVE = hệ hiện đủ mọi path
    if (!canvas) { canvas = document.getElementById('dust-layer'); if (canvas) { ctx = canvas.getContext('2d'); resize(); } }
    if (!canvas) return;
    updateCorePos(); initLight(); heroGlowTex = makeHeroGlow(); initOrbits(); initClimate(); initStars(); scheduleTextures(); tryLoadAssets();
    nextFlare = time + rand(LIGHTP.flareMin.value, LIGHTP.flareMax.value);
    if (reduced) {                                        // reduced: chỉ vẽ tĩnh (không loop, listener, meteor, embers)
      aliveT = 1;                                          // mây hiện đủ (không có loop tăng aliveT)
      window.addEventListener('resize', function () { resize(); renderReducedStatic(); }, { passive: true });
      renderReducedUntilLoaded();
      return;
    }
    initEmbers();
    nextMeteor = time + rand(25, 40); nextPulse = time + rand(25, 45);
    bentoEl = document.querySelector('.bento');
    if (!isMobile) {
      cursorTex = makeCursorTex();
      cursorX = clx = W / 2; cursorY = cly = H / 2;
      window.addEventListener('pointermove', onPointerMove, { passive: true });   // 1 listener: parallax + đèn + tilt
      window.addEventListener('pointerdown', onPointerDown, { passive: true });   // reset tilt trước FLIP expand
      document.addEventListener('mouseleave', function () { lightTarget = 0; if (prevTiltTile) { prevTiltTile.style.transform = ''; prevTiltTile = null; } });
    }
  }
  function makeCursorTex() {
    var s = 256, cv = document.createElement('canvas'); cv.width = cv.height = s; var g = cv.getContext('2d');
    var grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,200,100,1)'); grd.addColorStop(1, 'rgba(255,200,100,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); g.fill(); return cv;
  }
  function makeHeroGlow() { // quầng sao hero mềm (bloom, thay 2-arc đĩa phẳng)
    var s = 64, cv = document.createElement('canvas'); cv.width = cv.height = s; var g = cv.getContext('2d');
    var grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,0.9)'); grd.addColorStop(0.35, 'rgba(255,255,255,0.35)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, s, s); return cv;
  }
  function initLight() {
    if (LIGHTP) return; var G = 'Ánh sáng';
    LIGHTP = {
      bloom: TP(G, 'bloom', { value: 1.0, min: 0.4, max: 2.5, step: 0.05, label: 'Bloom tổng (×alpha)' }),
      core: TP(G, 'core', { value: 1.0, min: 0.5, max: 1.5, step: 0.05, label: 'Độ sáng lõi' }),
      starMul: TP(G, 'starMul', { value: 1.0, min: 0.5, max: 2, step: 0.1, label: 'Số sao (×)' }),
      flareMin: TP(G, 'flareMin', { value: 8, min: 4, max: 30, step: 1, label: 'Flare min (s)' }),
      flareMax: TP(G, 'flareMax', { value: 15, min: 4, max: 30, step: 1, label: 'Flare max (s)' }),
      cursorOp: TP(G, 'cursorOp', { value: 0.05, min: 0.02, max: 0.35, step: 0.01, label: 'Đèn con trỏ opacity' }),
      glint: TP(G, 'glint', { value: 0.6, min: 0.2, max: 1, step: 0.05, label: 'Glint alpha' }),
      tileTint: TP(G, 'tileTint', { value: 7, min: 0, max: 15, step: 1, label: 'Tint viền tile (%)' })
    };
  }
  function bloomA(a) { return a * (LIGHTP ? LIGHTP.bloom.value : 1); } // nhân bloom tổng
  function flareEnv() { var a = time - flare.start; if (a < 0.15) return a / 0.15; if (a < 0.8) return 1 - (a - 0.15) / 0.65; return 0; }
  function updateFlare() { // sự kiện lấp lánh: 1 sao mid/hero lóe rand(8–15)s
    if (!flare.active) {
      if (time >= nextFlare && document.visibilityState === 'visible') {
        if (meteor.active || Math.abs(time - nextMeteor) < 1) { nextFlare = time + 2; return; } // không trùng sao băng
        var cands = []; for (var i = 0; i < nStars; i++) if (stars[i].tier === 'mid' || stars[i].tier === 'hero') cands.push(stars[i]);
        if (cands.length) { flare.star = cands[(Math.random() * cands.length) | 0]; flare.active = true; flare.start = time; }
      }
      return;
    }
    if (time - flare.start >= 0.8) { flare.active = false; flare.star = null; nextFlare = time + rand(LIGHTP.flareMin.value, LIGHTP.flareMax.value); }
  }
  function onPointerMove(e) {
    mx = e.clientX - W / 2; my = e.clientY - H / 2;
    cursorX = e.clientX; cursorY = e.clientY; lightTarget = 1;
    // A.3 tile tilt — áp trực tiếp (rẻ: 1 rect + style)
    var tile = e.target && e.target.closest ? e.target.closest('.tile.cosmic-crystallized') : null;
    if (tile !== prevTiltTile && prevTiltTile) prevTiltTile.style.transform = '';
    if (tile) {
      var r = tile.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      tile.style.transform = 'translateY(-4px) rotateX(' + (-ny * 5).toFixed(2) + 'deg) rotateY(' + (nx * 5).toFixed(2) + 'deg)';
    }
    prevTiltTile = tile;
  }
  function onPointerDown(e) { // reset tilt để bento.js FLIP đo rect ở tilt=0
    var tile = e.target && e.target.closest ? e.target.closest('.tile.cosmic-crystallized') : null;
    if (tile) tile.style.transform = '';
    if (prevTiltTile) { prevTiltTile.style.transform = ''; prevTiltTile = null; }
  }

  // C1 — tiêu đề ngưng tụ 1 lần/section/phiên (chỉ trên nhóm dust)
  function setupCondense() {
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('[data-condense-target]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; if (el._condensed) { io.unobserve(el); return; }
        el._condensed = true; io.unobserve(el);
        var r = el.getBoundingClientRect();
        condense(r.left + r.width / 2, r.top + r.height / 2, isMobile ? 18 : 34, function () { el.classList.add('cosmic-condensed'); });
      });
    }, { threshold: 0.5 });
    for (var i = 0; i < targets.length; i++) io.observe(targets[i]);
  }

  function condense(tx, ty, n, cb) {
    if (!started || !dust.length) { if (cb) cb(); return; }
    var picked = 0, fired = false;
    for (var i = 0; i < nDust && picked < n; i++) {
      var p = dust[i]; if (p.borrow) continue;
      var dy = ((p.y + (-scrollY * 0.25)) % H + H) % H;
      if (Math.hypot(p.x - tx, dy - ty) > 320) continue;
      p.borrow = { sx: p.x, sy: p.y, tx: tx, ty: ty, t: 0, dur: 0.5, phase: 'in',
        cb: (!fired ? (function () { fired = true; if (cb) cb(); }) : null) };
      picked++;
    }
    if (!fired && cb) cb();
  }

  // C2 — hover hút bụi quanh card/CTA (desktop)
  function setupHover() {
    var els = document.querySelectorAll('.tile, .btn');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('mouseenter', onEnter);
      els[i].addEventListener('mousemove', onMove);
      els[i].addEventListener('mouseleave', onLeave);
    }
    function onEnter(e) { attractor.active = true; onMove(e); }
    function onMove(e) { attractor.x = e.clientX; attractor.y = e.clientY; }
    function onLeave() { attractor.active = false; }
  }

  window.CosmicDust = { start: start, condense: condense, seedStars: seedStars, enterAlive: enterAlive,
    formationTargets: formationTargets, reveal: reveal, coreEnergy: coreEnergy, cloudLight: cloudLight,
    pregenTextures: pregenTextures, startPreAlive: startPreAlive };
})();
