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
  var DEBUG = false; try { DEBUG = new URLSearchParams(location.search).has('debug'); } catch (e) {}
  var dbgAcc = 0, dbgN = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

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
  function makeStar(p, seed) {
    p.x = seed && seed.x != null ? seed.x : rand(0, W);
    p.y = seed && seed.y != null ? seed.y : rand(0, H);
    p.size = rand(0.6, 1.2); p.baseOp = rand(0.2, 0.5);
    p.color = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2; p.twSpeed = (2 * Math.PI) / rand(3, 6);
    return p;
  }
  function makeEmber(p) {
    p.x = rand(0, W); p.y = rand(0, H);
    var ang = rand(-Math.PI * 0.75, -Math.PI * 0.25), spd = rand(1, 3);
    p.vx = Math.cos(ang) * spd; p.vy = Math.sin(ang) * spd;
    p.size = rand(3, 5); p.baseOp = rand(0.10, 0.18);
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

  function initStars() {
    nStars = isMobile ? 70 : 140; stars = new Array(nStars);
    for (var i = 0; i < nStars; i++) { var seed = starSeeds && starSeeds[i] ? starSeeds[i] : null; stars[i] = makeStar({}, seed); }
  }
  function initEmbers() {
    nEmbers = isMobile ? 5 : 10; embers = new Array(nEmbers);
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

    // ---- stars ----
    if (alive) {
      for (var s = 0; s < nStars; s++) {
        var st = stars[s];
        var tw = Math.sin(time * st.twSpeed + st.tw) * 0.15;
        var op = Math.max(0, Math.min(0.4, st.baseOp + tw));
        if (op <= 0.01) continue;
        ctx.globalAlpha = op; ctx.fillStyle = st.color;
        ctx.beginPath(); ctx.arc(st.x + px * 0.02, st.y + py * 0.02, st.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    // ---- dust ----
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
    initStars(); initEmbers();
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
