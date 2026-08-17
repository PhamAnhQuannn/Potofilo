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

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { window.CosmicDust = { start: function () {}, condense: function () {}, seedStars: function () {}, enterAlive: function () {} }; return; }

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
  var starSeeds = null, bentoEl = null;
  var meteor = { active: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, len: 0 };
  var nextMeteor = 1e9;
  var nebTex = { left: null, rd: null, band: null }, galaxyCoreTex = null, texScheduled = false;
  var planetTex = null, moonTex = null;
  // Một nguồn sáng = lõi thiên hà (0.72W, 0.30H). Nắng song song, chuẩn hóa (screen-space).
  var LIGHT_DIR = (function () { var x = 0.72 - 0.5, y = 0.30 - 0.5, m = Math.hypot(x, y); return { x: x / m, y: y / m }; })();
  var DEBUG = false; try { DEBUG = new URLSearchParams(location.search).has('debug'); } catch (e) {}
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
        var xs = Math.sqrt(Math.max(1e-4, 1 - ny * ny)), sx = nx / xs; // bóp cầu
        var v;
        if (opts.isMoon) { v = fbm(nx * 3 + 5, ny * 3 + 5); }
        else {
          var band = Math.sin(ny * 9 * Math.PI + fbm(ny * 3, 0.5) * 2.5);
          var twist = fbm(sx * 2, ny * 6) * 0.35;
          v = (band * 0.6 + twist + 1.3) / 2.6;
        }
        var col = rampN(pal, v);
        if (vein && !opts.isMoon && Math.abs(Math.sin(ny * 9 * Math.PI)) > 0.94) { col.r += (vein.r - col.r) * 0.5; col.g += (vein.g - col.g) * 0.5; col.b += (vein.b - col.b) * 0.5; }
        d[i] = col.r; d[i + 1] = col.g; d[i + 2] = col.b; d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    // Pass 2 — limb darkening (multiply 1.0 tâm → 0.55 rìa)
    g.globalCompositeOperation = 'multiply';
    var lg = g.createRadialGradient(cx, cy, 0, cx, cy, R);
    lg.addColorStop(0, '#ffffff'); lg.addColorStop(0.7, '#c8c8c8'); lg.addColorStop(1, '#8c8c8c');
    g.fillStyle = lg; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    // Pass 3 — terminator (dọc -LIGHT_DIR, lệch 15% về phía khuất)
    g.globalCompositeOperation = 'source-over';
    var litFrac = opts.isMoon ? 0.20 : 0.375, lx = LIGHT_DIR.x, ly = LIGHT_DIR.y;
    var tg = g.createLinearGradient(cx + lx * R, cy + ly * R, cx - lx * R, cy - ly * R);
    tg.addColorStop(0, 'rgba(5,5,15,0)');
    tg.addColorStop(Math.max(0, litFrac - 0.1), 'rgba(5,5,15,0)');
    tg.addColorStop(Math.min(1, litFrac + 0.15), 'rgba(5,5,15,0.72)');
    tg.addColorStop(1, 'rgba(5,5,15,0.92)');
    g.fillStyle = tg; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    // Pass 4 — viền khí quyển rìa PHÍA SÁNG
    var la = Math.atan2(ly, lx);
    function rim(w, op) { g.globalAlpha = op; g.lineWidth = w; g.strokeStyle = '#CDE3FF'; g.beginPath(); g.arc(cx, cy, R - w * 0.5, la - 1.2, la + 1.2); g.stroke(); }
    rim(size * 0.012, 0.12); rim(size * 0.006, 0.25); rim(size * 0.003, 0.5);
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
    // thiên thể (sau tinh vân, tuần tự): hành tinh khí → trăng
    jobs.push(function () { planetTex = makePlanetTexture(isMobile ? 640 : 1024, { palette: ['#1B1440', '#3A2E6E', '#7B2FBF', '#9a5fd0'], vein: '#E84A8A', specular: !isMobile, seed: 711 }); });
    if (!isMobile) jobs.push(function () { moonTex = makePlanetTexture(256, { palette: ['#2A2A3E', '#4A4A66', '#6E6E8A'], isMoon: true, seed: 822 }); });
    (function run() { if (!jobs.length) return; var job = jobs.shift(); idle(function () { job(); run(); }); })();
  }

  function drawTex(tex, cxF, cyF, sizeVw, rot, baseOp, phase) {
    if (!tex) return;
    var w = sizeVw / 100 * W, cx = cxF * W + px * 0.02, cy = cyF * H + py * 0.02;
    ctx.globalAlpha = baseOp * (1 + 0.15 * Math.sin(time * (2 * Math.PI / 22) + phase));
    ctx.save(); ctx.translate(cx, cy); if (rot) ctx.rotate(rot); ctx.drawImage(tex, -w / 2, -w / 2, w, w); ctx.restore();
  }

  // Lớp 1 — khí quyển (tinh vân texture). Vẽ TRƯỚC sao xa.
  function drawNebulaBg() {
    ctx.globalCompositeOperation = 'screen';
    drawTex(nebTex.left, 0.30, 0.42, 52, 0, 0.62, 0);
    drawTex(nebTex.rd, 0.92, 0.80, 44, 0, 0.55, 1.7);
    if (nebTex.band) {                                   // dải: kéo giãn ×3/×0.6, rotate -24°
      var w = 40 / 100 * W;
      ctx.globalAlpha = 0.55 * (1 + 0.15 * Math.sin(time * (2 * Math.PI / 22) + 3.1));
      ctx.save(); ctx.translate(W / 2 + px * 0.02, H / 2 + py * 0.02); ctx.rotate(-24 * Math.PI / 180); ctx.scale(3, 0.6);
      ctx.drawImage(nebTex.band, -w / 2, -w / 2, w, w); ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // Lớp 2 — thiên thể (hành tinh/trăng/lõi). Vẽ SAU sao xa → che sao sau lưng (decision 0016).
  // Ràng buộc: rìa hành tinh cách bounding-box grid ≥ 40px (viewport hẹp cắt sâu hơn).
  function drawCelestials() {
    var gridLeft = Math.max(0, (W - 1200) / 2), gridRight = Math.min(W, (W + 1200) / 2);
    if (planetTex) {
      var pd = (isMobile ? 0.36 : 0.48) * W, pR = pd / 2;
      var pcx = (gridLeft - 40 - pR) + px * 0.04 + 3 * Math.sin(time * (2 * Math.PI / 90)); // đĩa nằm trái grid ≥40px
      var pcy = 1.05 * H + py * 0.04;
      ctx.globalAlpha = 1; ctx.drawImage(planetTex, pcx - pR, pcy - pR, pd, pd);
    }
    if (moonTex) {
      var md = 0.07 * W, mR = md / 2;
      var mcx = Math.max(0.82 * W, gridRight + 40 + mR) + px * 0.04 + 2 * Math.sin(time * (2 * Math.PI / 110));
      var mcy = 0.22 * H + py * 0.04;
      ctx.globalAlpha = 1; ctx.drawImage(moonTex, mcx - mR, mcy - mR, md, md);
    }
    if (galaxyCoreTex) {                                 // lõi thiên hà — sáng nhất nền
      var gw = 36 / 100 * W;
      ctx.globalAlpha = Math.min(1, 0.92 * (1 + 0.08 * Math.sin(time * (2 * Math.PI / 12))));
      ctx.save(); ctx.translate(0.72 * W + px * 0.04, 0.30 * H + py * 0.04); ctx.rotate(-24 * Math.PI / 180); ctx.scale(1, 0.6);
      ctx.drawImage(galaxyCoreTex, -gw / 2, -gw / 2, gw, gw); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function makeDust(p, seed) {
    p.x = seed && seed.x != null ? seed.x : rand(0, W);
    p.y = seed && seed.y != null ? seed.y : rand(0, H);
    var ang = rand(-Math.PI * 0.75, -Math.PI * 0.25), spd = rand(2, 6);
    p.vx = Math.cos(ang) * spd; p.vy = Math.sin(ang) * spd;
    p.size = rand(1, 2.5); p.baseOp = rand(0.15, 0.4);
    p.color = DUST_COLORS[(Math.random() * DUST_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.borrow = null;
    return p;
  }
  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5); } // ~N(0,~0.5)
  function makeFaint(p, seed) {
    if (seed && seed.x != null) { p.x = seed.x; p.y = seed.y; }
    else { p.x = rand(0, W); p.y = rand(0, H); }
    p.tier = 'faint'; p.size = rand(0.6, 1.1); p.baseOp = rand(0.25, 0.5); p.twAmp = 0.15;
    p.color = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6);
    return p;
  }
  function makeMid(p) {
    p.x = rand(0, W); p.y = rand(0, H);
    p.tier = 'mid'; p.size = rand(1.5, 2.2); p.baseOp = rand(0.5, 0.8); p.twAmp = 0.15;
    p.color = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6);
    return p;
  }
  function makeHero(p, glint) {
    p.x = Math.random() < 0.5 ? rand(0, 0.25 * W) : rand(0.75 * W, W); // chỉ hai cánh
    p.y = rand(0, H);
    p.tier = 'hero'; p.size = rand(2.5, 3.5); p.baseOp = rand(0.75, 0.95); p.twAmp = 0.06;
    p.color = Math.random() < 0.7 ? (Math.random() < 0.5 ? '#CDE3FF' : '#FFFFFF') : STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6); p.glint = !!glint;
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
    recalcScroll();
  }
  function recalcScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    docScroll = Math.max(1, (document.documentElement.scrollHeight - window.innerHeight));
  }
  function densityAt() { return 1 - 0.7 * Math.min(1, scrollY / docScroll); }

  function clusterCenters() {
    return [ { x: 0.30 * W, y: 0.42 * H },   // (a) trong tinh vân trái
             { x: 0.62 * W, y: 0.50 * H },   // (b) trên dải chéo giữa-phải
             { x: 0.72 * W, y: 0.30 * H } ]; // (c) gần lõi thiên hà
  }
  function clusterPlace(st, C) {
    var c = C[(Math.random() * 3) | 0], sig = 0.04 * H;
    st.x = c.x + gauss() * 2 * sig; st.y = c.y + gauss() * 2 * sig;
    if (Math.random() < 0.6) st.color = '#FFE9C4'; // ấm hơn nền chung
  }
  function initStars() {
    var nFaint = isMobile ? 90 : 200, nMid = isMobile ? 22 : 50, nHero = isMobile ? 4 : 9;
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
    if (!isMobile && alive) { px += (mx - px) * 0.04; py += (my - py) * 0.04; }
    else { px *= 0.9; py *= 0.9; }

    var t0 = DEBUG ? performance.now() : 0;
    ctx.clearRect(0, 0, W, H);
    var parallax = -scrollY * 0.25;
    var gmul = densityAt();

    // ---- lớp 1: tinh vân texture (khí quyển) ----
    if (alive) drawNebulaBg();

    // ---- lớp 1b: sao xa (SAU thiên thể — sao ở xa hàng năm ánh sáng, bị hành tinh che) ----
    if (alive) {
      for (var s = 0; s < nStars; s++) {
        var st = stars[s];
        var tw = Math.sin(time * st.twSpeed + st.tw) * st.twAmp;
        var op = Math.max(0, Math.min(0.95, st.baseOp + tw));
        if (op <= 0.01) continue;
        var sx = st.x + px * 0.02, sy = st.y + py * 0.02, r = st.size;
        ctx.fillStyle = st.color;
        if (st.tier === 'hero') {
          // quầng 2 lớp (giả radial, không tạo gradient trong loop) + lõi
          ctx.globalAlpha = op * 0.18; ctx.beginPath(); ctx.arc(sx, sy, r * 4, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = op * 0.32; ctx.beginPath(); ctx.arc(sx, sy, r * 2, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = op; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
          if (st.glint) {
            ctx.globalAlpha = 0.35; ctx.strokeStyle = st.color; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(sx - r * 5, sy); ctx.lineTo(sx + r * 5, sy);
            ctx.moveTo(sx, sy - r * 5); ctx.lineTo(sx, sy + r * 5); ctx.stroke();
          }
        } else {
          ctx.globalAlpha = op; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // ---- lớp 2: thiên thể (che sao sau lưng) ----
    if (alive) drawCelestials();

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
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.99; p.vy *= 0.99;
        if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5; else if (p.y > H + 5) p.y = -5;
      }
      var dy = ((p.y + parallax) % H + H) % H;
      var dtw = Math.sin(time * 1.5 + p.tw) * 0.05;
      var dop = Math.max(0, Math.min(0.4, (p.baseOp + dtw) * gmul));
      if (dop <= 0.01) continue;
      ctx.globalAlpha = dop; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x + px * 0.06, dy, p.size, 0, Math.PI * 2); ctx.fill();
    }

    // ---- embers (2 arc lồng, không filter) ----
    if (alive) {
      for (var m = 0; m < nEmbers; m++) {
        var em = embers[m];
        em.x += em.vx * dt; em.y += em.vy * dt; em.vx *= 0.995; em.vy *= 0.995;
        if (em.x < -8) em.x = W + 8; else if (em.x > W + 8) em.x = -8;
        if (em.y < -8) em.y = H + 8; else if (em.y > H + 8) em.y = -8;
        var ey = ((em.y + parallax) % H + H) % H, ex = em.x + px * 0.12;
        ctx.fillStyle = em.color;
        ctx.globalAlpha = em.baseOp * 0.5;
        ctx.beginPath(); ctx.arc(ex, ey, em.size * 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = em.baseOp;
        ctx.beginPath(); ctx.arc(ex, ey, em.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    // ---- meteor ----
    if (alive) updateMeteor(dt);

    ctx.globalAlpha = 1;

    // ---- bento parallax (ngược hướng chuột, ±3px) ----
    if (bentoEl && !isMobile) {
      var kx = 3 / (W * 0.5 || 1), ky = 3 / (H * 0.5 || 1);
      var bx = Math.max(-3, Math.min(3, -px * kx)), by = Math.max(-3, Math.min(3, -py * ky));
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
    ctx.globalAlpha = 1; ctx.strokeStyle = grad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(tx, ty); ctx.stroke();
  }

  function startLoop() { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(step); }
  function stopLoop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

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

  function enterAlive() {
    if (alive) return; alive = true;
    if (!canvas) { canvas = document.getElementById('dust-layer'); if (canvas) { ctx = canvas.getContext('2d'); resize(); } }
    initStars(); initEmbers(); scheduleTextures();
    nextMeteor = time + rand(25, 40);
    bentoEl = document.querySelector('.bento');
    if (!isMobile) window.addEventListener('mousemove', onMouseParallax, { passive: true });
  }
  function onMouseParallax(e) { mx = e.clientX - W / 2; my = e.clientY - H / 2; }

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

  window.CosmicDust = { start: start, condense: condense, seedStars: seedStars, enterAlive: enterAlive };
})();
