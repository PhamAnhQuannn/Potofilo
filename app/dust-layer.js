/* Potofilo — dust-layer.js  (Giai đoạn 3, Khối B + C)
 * Bụi tàn dư bằng Canvas 2D thuần (KHÔNG WebGL). Render vào #dust-layer (fixed, pointer-events:none).
 * B: 150–200 hạt desktop / 60–80 mobile; nhận bàn giao 15% hạt từ vụ nổ; mật độ giảm theo scroll;
 *    parallax ngược 0.25; nhấp nháy nhẹ; pause khi tab ẩn; tự giảm hạt khi tụt FPS.
 * C1: tiêu đề [data-condense-target] ngưng tụ 1 lần/section/phiên. C2: hover hút bụi (desktop).
 * Năng lượng tối đa của lớp này = 5 (rất nhẹ), không đè chữ opacity > 0.4.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { window.CosmicDust = { start: function () {}, condense: function () {} }; return; }

  var isMobile = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var COLORS = ['#CDE3FF', '#CDE3FF', '#FFF4D6', '#FFF4D6', '#E84A8A', '#7B2FBF', '#4ECDC4']; // nghiêng 2 màu đầu

  var canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  var parts = [], count = 0, started = false, raf = 0, running = false;
  var scrollY = 0, docScroll = 1, lastT = 0, slowFrames = 0, time = 0;
  var attractor = { x: 0, y: 0, active: false };

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeParticle(p, seed) {
    p.x = seed && seed.x != null ? seed.x : rand(0, W);
    p.y = seed && seed.y != null ? seed.y : rand(0, H);
    var ang = rand(-Math.PI * 0.75, -Math.PI * 0.25); // hơi nghiêng lên
    var spd = rand(2, 6);
    p.vx = Math.cos(ang) * spd; p.vy = Math.sin(ang) * spd;
    p.size = rand(1, 2.5);
    p.baseOp = rand(0.15, 0.4);
    p.color = COLORS[(Math.random() * COLORS.length) | 0];
    p.tw = Math.random() * Math.PI * 2;
    p.borrow = null; // {tx,ty,t,dur,cb,phase}
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
    var doc = Math.max(1, (document.documentElement.scrollHeight - window.innerHeight));
    docScroll = doc;
  }

  function densityAt(drawY) {
    // gần hero (đầu trang) dày; cuối trang ~30%
    var frac = Math.min(1, scrollY / docScroll);
    var globalMul = 1 - 0.7 * frac; // 1 → 0.3
    return globalMul;
  }

  function step(now) {
    if (!running) return;
    var dt = Math.min((now - lastT) / 1000, 0.05); lastT = now; time += dt;

    // perf auto-reduce
    if (dt > 0.02) { slowFrames++; if (slowFrames >= 3 && count > 40) { count = Math.floor(count * 0.7); slowFrames = 0; } }
    else slowFrames = 0;

    ctx.clearRect(0, 0, W, H);
    var parallax = -scrollY * 0.25;
    var gmul = densityAt();

    for (var i = 0; i < count; i++) {
      var p = parts[i];

      if (p.borrow) {
        var b = p.borrow; b.t += dt;
        var k = Math.min(b.t / b.dur, 1), e = 1 - Math.pow(1 - k, 3);
        p.x = b.sx + (b.tx - b.sx) * e; p.y = b.sy + (b.ty - b.sy) * e;
        if (k >= 1) {
          if (b.phase === 'in') { if (b.cb) b.cb(); b.phase = 'out'; b.t = 0; b.sx = p.x; b.sy = p.y; b.tx = p.x + rand(-40, 40); b.ty = p.y + rand(-40, 40); }
          else { p.borrow = null; }
        }
      } else {
        // hover hút (desktop): lực cong nhẹ về attractor trong 150px
        if (attractor.active) {
          var ddx = attractor.x - p.x, ddy = attractor.y - p.y, dist = Math.hypot(ddx, ddy);
          if (dist < 150 && dist > 1) {
            var force = (1 - dist / 150) * 30; // giảm dần theo khoảng cách
            p.vx += (ddx / dist) * force * dt; p.vy += (ddy / dist) * force * dt;
          }
        }
        p.x += p.vx * dt; p.y += p.vy * dt;
        // ma sát nhẹ để không bị hút bay mất
        p.vx *= 0.99; p.vy *= 0.99;
        // wrap quanh mép
        if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5; else if (p.y > H + 5) p.y = -5;
      }

      // vẽ (parallax + wrap dọc chỉ khi vẽ)
      var dy = ((p.y + parallax) % H + H) % H;
      var tw = Math.sin(time * 1.5 + p.tw) * 0.05;
      var op = Math.max(0, Math.min(0.4, (p.baseOp + tw) * gmul));
      if (op <= 0.01) continue;
      ctx.globalAlpha = op;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, dy, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  }

  function startLoop() { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(step); }
  function stopLoop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  // ---------------- API ----------------
  function start(seedPoints) {
    if (started) return; started = true;
    canvas = document.getElementById('dust-layer');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    count = isMobile ? rand(60, 80) | 0 : rand(150, 200) | 0;
    parts = new Array(count);
    for (var i = 0; i < count; i++) {
      var seed = seedPoints && seedPoints[i] ? seedPoints[i] : null;
      parts[i] = makeParticle({}, seed);
    }
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', recalcScroll, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopLoop(); else startLoop(); });
    startLoop();
    setupCondense();
    if (!isMobile) setupHover();
  }

  // C1 — tiêu đề ngưng tụ 1 lần/section/phiên
  function setupCondense() {
    if (!('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('[data-condense-target]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el._condensed) { io.unobserve(el); return; }
        el._condensed = true; io.unobserve(el);
        var r = el.getBoundingClientRect();
        var tx = r.left + r.width / 2, ty = r.top + r.height / 2;
        condense(tx, ty, isMobile ? 18 : 34, function () { el.classList.add('cosmic-condensed'); });
      });
    }, { threshold: 0.5 });
    for (var i = 0; i < targets.length; i++) io.observe(targets[i]);
  }

  // mượn n hạt gần (tx,ty) bay hội tụ trong 0.5s rồi trả về
  function condense(tx, ty, n, cb) {
    if (!started || !parts.length) { if (cb) cb(); return; }
    var picked = 0, fired = false;
    for (var i = 0; i < count && picked < n; i++) {
      var p = parts[i]; if (p.borrow) continue;
      var dy = ((p.y + (-scrollY * 0.25)) % H + H) % H;
      if (Math.hypot(p.x - tx, dy - ty) > 320) continue; // gần đó
      p.borrow = { sx: p.x, sy: p.y, tx: tx, ty: ty, t: 0, dur: 0.5, phase: 'in',
        cb: (!fired ? (function () { fired = true; if (cb) cb(); }) : null) };
      picked++;
    }
    if (!fired && cb) cb(); // không mượn được hạt nào vẫn fade in tiêu đề
  }

  // C2 — hover hút bụi quanh card/CTA
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

  window.CosmicDust = { start: start, condense: condense };
})();
