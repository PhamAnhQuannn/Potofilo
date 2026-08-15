/* Cosmic Intro — core (module dùng chung). Cần THREE (r128) + window.CosmicIntroConfig đã nạp trước. */
(function () {
  'use strict';

  // ---------- Config + defaults ----------
  var DEFAULTS = {
    particleCount: { desktop: 18000, mobile: 7000 },
    durations: { idleAuto: 6.0, charge: 2.6, explode: 2.2, gather: 3.2, uiFadeIn: 2.2 },
    palette: {
      bg: ['#050510', '#0A0A1A', '#0D0B21', '#141031'],
      hot: ['#FFFFFF', '#FFF4D6', '#FFC864', '#FF8C42'],
      plasma: ['#FF5E3A', '#C2273D', '#E84A8A', '#7B2FBF'],
      nebula: ['#4ECDC4', '#3A7BD5', '#2E1A6E', '#7B2FBF'],
      stars: { hot: '#CDE3FF', neutral: '#FFFFFF', cool: '#FFE9C4' },
      coreGlow: '#FFC864',
      shockwave: { fast: '#FFF4D6', slow: '#E84A8A' },
      flash: '#FFFFFF'
    },
    planets: [
      { color: '#4ECDC4', radius: 0.65, orbit: 2.6, speed: 0.55 },
      { color: '#3A7BD5', radius: 0.85, orbit: 3.9, speed: 0.36 },
      { color: '#E84A8A', radius: 0.50, orbit: 5.1, speed: 0.27 },
      { color: '#FFC864', radius: 0.40, orbit: 1.6, speed: 0.80 }
    ],
    starField: { count: 900, near: 40, far: 100, minOpacity: 0.35, maxOpacity: 1.0 },
    nebulaClouds: { count: 4, minOpacity: 0.1, maxOpacity: 0.3, zNear: -13, zFar: -16 },
    flags: { cameraShake: true, oncePerSession: true, respectReducedMotion: true, showSkipButton: true },
    ui: { eyebrow: 'PORTFOLIO', title: '[TÊN WEBSITE]', tagline: '[Mô tả ngắn]', cta: 'Khám phá', hint: '[Chạm để kích hoạt]', skip: 'Bỏ qua' },
    sphereRadius: 4.0,
    particleSize: 0.09,
    onComplete: function () {}
  };

  function deepMerge(base, over) {
    if (!over) return base;
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (var k in over) {
      if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && typeof base[k] === 'object') {
        out[k] = deepMerge(base[k], over[k]);
      } else {
        out[k] = over[k];
      }
    }
    return out;
  }
  var CFG = deepMerge(DEFAULTS, window.CosmicIntroConfig || {});

  // ---------- DOM refs ----------
  var root = document.getElementById('cosmic-intro');
  var flashEl = document.getElementById('ci-flash');
  var hintEl = document.getElementById('ci-hint');
  var skipEl = document.getElementById('ci-skip');
  var uiEl = document.getElementById('ci-ui');
  document.getElementById('ci-eyebrow').textContent = CFG.ui.eyebrow;
  document.getElementById('ci-title').textContent = CFG.ui.title;
  document.getElementById('ci-tagline').textContent = CFG.ui.tagline;
  document.getElementById('ci-cta').textContent = CFG.ui.cta;
  hintEl.textContent = CFG.ui.hint;
  skipEl.textContent = CFG.ui.skip;
  uiEl.style.setProperty('--fade', CFG.durations.uiFadeIn + 's');
  if (!CFG.flags.showSkipButton) skipEl.style.display = 'none';

  var SESSION_KEY = 'cosmicIntroSeen';

  function finish() {
    try { if (CFG.flags.oncePerSession) sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    if (typeof CFG.onComplete === 'function') CFG.onComplete();
  }
  function removeIntro() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
  }

  // ---------- Guards: session / WebGL ----------
  var alreadySeen = false;
  try { alreadySeen = CFG.flags.oncePerSession && sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}
  if (alreadySeen) { removeIntro(); if (typeof CFG.onComplete === 'function') CFG.onComplete(); return; }

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  if (typeof THREE === 'undefined' || !webglOK()) { removeIntro(); finish(); return; }

  var reduceMotion = CFG.flags.respectReducedMotion &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Helpers ----------
  function hexColor(h) { return new THREE.Color(h); }
  // Lấy màu trên dải gradient (mảng hex) tại t in [0,1]
  function sampleGradient(hexArr, t) {
    t = Math.max(0, Math.min(1, t));
    var n = hexArr.length - 1;
    var f = t * n;
    var i = Math.floor(f);
    if (i >= n) return hexColor(hexArr[n]);
    var c = hexColor(hexArr[i]).clone();
    return c.lerp(hexColor(hexArr[i + 1]), f - i);
  }
  function isMobile() {
    return (window.innerWidth < 820) || (window.devicePixelRatio > 2 && window.innerWidth < 1100)
      || /Mobi|Android/i.test(navigator.userAgent);
  }
  // Sprite tròn mềm 64x64 (radial gradient trắng -> trong)
  function softSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    var tex = new THREE.CanvasTexture(c); tex.needsUpdate = true; return tex;
  }
  // Sprite tinh vân (radial gradient màu -> trong)
  function nebulaSprite(hex) {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var g = c.getContext('2d');
    var col = hexColor(hex);
    var r = Math.round(col.r * 255), gr = Math.round(col.g * 255), b = Math.round(col.b * 255);
    var grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(' + r + ',' + gr + ',' + b + ',0.9)');
    grd.addColorStop(0.4, 'rgba(' + r + ',' + gr + ',' + b + ',0.35)');
    grd.addColorStop(1, 'rgba(' + r + ',' + gr + ',' + b + ',0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    var tex = new THREE.CanvasTexture(c); tex.needsUpdate = true; return tex;
  }

  // ---------- Renderer / scene / camera ----------
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.insertBefore(renderer.domElement, root.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 0, 12);
  var camBase = camera.position.clone();

  var sprite = softSprite();

  // ---------- Star field ----------
  (function buildStars() {
    var sc = CFG.starField, N = sc.count;
    var pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    var tones = [hexColor(CFG.palette.stars.hot), hexColor(CFG.palette.stars.neutral), hexColor(CFG.palette.stars.cool)];
    for (var i = 0; i < N; i++) {
      var u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      var r = sc.near + Math.random() * (sc.far - sc.near);
      pos[i*3] = Math.cos(th) * s * r; pos[i*3+1] = u * r; pos[i*3+2] = Math.sin(th) * s * r;
      var c = tones[(Math.random() * 3) | 0], o = sc.minOpacity + Math.random() * (sc.maxOpacity - sc.minOpacity);
      col[i*3] = c.r * o; col[i*3+1] = c.g * o; col[i*3+2] = c.b * o;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    var mat = new THREE.PointsMaterial({ size: 0.55, map: sprite, vertexColors: true,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    var pts = new THREE.Points(geo, mat); scene.add(pts);
  })();

  // ---------- Nebula clouds ----------
  (function buildNebula() {
    var nc = CFG.nebulaClouds;
    for (var i = 0; i < nc.count; i++) {
      var hex = CFG.palette.nebula[i % CFG.palette.nebula.length];
      var m = new THREE.SpriteMaterial({ map: nebulaSprite(hex), transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
        opacity: nc.minOpacity + Math.random() * (nc.maxOpacity - nc.minOpacity) });
      var sp = new THREE.Sprite(m);
      var z = nc.zNear + Math.random() * (nc.zFar - nc.zNear);
      sp.position.set((Math.random() - 0.5) * 26, (Math.random() - 0.5) * 16, z);
      var s = 14 + Math.random() * 12; sp.scale.set(s, s, 1);
      scene.add(sp);
    }
  })();

  // ---------- Core glow ----------
  var coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite,
    color: hexColor(CFG.palette.coreGlow), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.45 }));
  coreGlow.scale.set(6, 6, 1); scene.add(coreGlow);

  // ---------- Particle sphere ----------
  var R = CFG.sphereRadius;
  var N = isMobile() ? CFG.particleCount.mobile : CFG.particleCount.desktop;
  var colorStops = CFG.palette.hot.concat(CFG.palette.plasma); // Lớp 2 -> Lớp 3

  var positions = new Float32Array(N * 3);
  var colors = new Float32Array(N * 3);
  var dir = new Float32Array(N * 3);      // hướng đơn vị từ tâm
  var baseR = new Float32Array(N);        // bán kính gốc trong cầu
  var seed = new Float32Array(N);         // pha nhịp đập riêng
  var isRay = new Uint8Array(N);          // 12% là "tia"
  var vel = new Float32Array(N * 3);      // vận tốc (explode)
  var baseCol = new Float32Array(N * 3);  // màu palette gốc
  var planetIdx = new Int8Array(N);       // thuộc hành tinh nào
  var offset = new Float32Array(N * 3);   // vị trí trên bề mặt hành tinh
  var gStart = new Float32Array(N * 3);   // vị trí lúc bắt đầu GATHER

  var planetPhase = CFG.planets.map(function () { return Math.random() * Math.PI * 2; });

  for (var i = 0; i < N; i++) {
    var u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    var dx = Math.cos(th) * s, dy = u, dz = Math.sin(th) * s;
    var rr = Math.pow(Math.random(), 0.42) * R; // lệch về vỏ, vẫn có lõi đặc
    dir[i*3] = dx; dir[i*3+1] = dy; dir[i*3+2] = dz;
    baseR[i] = rr;
    positions[i*3] = dx * rr; positions[i*3+1] = dy * rr; positions[i*3+2] = dz * rr;

    var c = sampleGradient(colorStops, rr / R); // lõi trắng-vàng -> vỏ magenta-tím
    baseCol[i*3] = c.r; baseCol[i*3+1] = c.g; baseCol[i*3+2] = c.b;
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;

    seed[i] = Math.random() * Math.PI * 2;
    isRay[i] = Math.random() < 0.12 ? 1 : 0;

    var pi = i % CFG.planets.length; planetIdx[i] = pi;
    var pr = CFG.planets[pi].radius;
    var u2 = Math.random() * 2 - 1, th2 = Math.random() * Math.PI * 2, s2 = Math.sqrt(1 - u2 * u2);
    offset[i*3] = Math.cos(th2) * s2 * pr; offset[i*3+1] = u2 * pr; offset[i*3+2] = Math.sin(th2) * s2 * pr;
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  var mat = new THREE.PointsMaterial({ size: CFG.particleSize, map: sprite, vertexColors: true,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  var points = new THREE.Points(geo, mat);
  scene.add(points);

  // ---------- Shockwave rings ----------
  function makeRing(hex) {
    var g = new THREE.RingGeometry(0.9, 1.0, 96);
    var m = new THREE.MeshBasicMaterial({ color: hexColor(hex), transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(g, m); mesh.visible = false; scene.add(mesh); return mesh;
  }
  var ring1 = makeRing(CFG.palette.shockwave.fast);
  var ring2 = makeRing(CFG.palette.shockwave.slow);

  // ---------- Planet center (DONE / GATHER target) ----------
  var _pc = new THREE.Vector3();
  function planetCenter(pi, time) {
    var p = CFG.planets[pi], a = time * p.speed + planetPhase[pi];
    _pc.set(Math.cos(a) * p.orbit, Math.sin(a) * p.orbit * 0.38, 0);
    return _pc;
  }
  // offset xoay quanh Y theo thời gian (hành tinh tự quay)
  function rotOffsetY(ox, oz, ang) {
    var ca = Math.cos(ang), sa = Math.sin(ang);
    return [ox * ca - oz * sa, oz * ca + ox * sa];
  }

  function writeColorsFrom(arr) { geo.attributes.color.array.set(arr); geo.attributes.color.needsUpdate = true; }

  // Đặt toàn bộ hạt vào trạng thái DONE tại thời điểm `time` (dùng cho reduced-motion + vòng DONE)
  var white = new THREE.Color(0xffffff);
  function placeDone(time) {
    for (var i = 0; i < N; i++) {
      var pi = planetIdx[i];
      var pc = planetCenter(pi, time);
      var ang = time * CFG.planets[pi].speed;
      var ro = rotOffsetY(offset[i*3], offset[i*3+2], ang);
      positions[i*3] = pc.x + ro[0];
      positions[i*3+1] = pc.y + offset[i*3+1];
      positions[i*3+2] = pc.z + ro[1];
    }
    geo.attributes.position.needsUpdate = true;
  }
  function setPlanetColors() {
    for (var i = 0; i < N; i++) {
      var c = hexColor(CFG.planets[planetIdx[i]].color);
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    writeColorsFrom(colors);
  }

  function showUI() { uiEl.classList.add('show'); }

  // ---------- Reduced motion: vào thẳng DONE tĩnh ----------
  if (reduceMotion) {
    coreGlow.visible = false;
    setPlanetColors();
    placeDone(0);
    renderer.render(scene, camera);
    showUI();
    hintEl.style.display = 'none';
    bindResize();
    bindFinishHandlers();
    return;
  }

  // ---------- State machine ----------
  var PHASE = { IDLE: 0, CHARGE: 1, EXPLODE: 2, GATHER: 3, DONE: 4 };
  var phase = PHASE.IDLE;
  var phaseT = 0;      // thời gian trong giai đoạn hiện tại
  var globalT = 0;     // thời gian tổng
  var spin = 0;        // góc xoay Y tích lũy
  var interacted = false;

  hintEl.style.opacity = 1;

  function toPhase(next) {
    phase = next; phaseT = 0;
    if (next === PHASE.CHARGE) { hintEl.style.display = 'none'; }
    if (next === PHASE.EXPLODE) { bakeAndExplode(); }
    if (next === PHASE.GATHER) { gStart.set(positions); }
    if (next === PHASE.DONE) { setPlanetColors(); showUI(); }
  }

  // Nén rotation vào tọa độ thế giới rồi gán vận tốc nổ
  function bakeAndExplode() {
    points.updateMatrixWorld(true);
    var m = points.matrixWorld;
    var v = new THREE.Vector3();
    for (var i = 0; i < N; i++) {
      v.set(positions[i*3], positions[i*3+1], positions[i*3+2]).applyMatrix4(m);
      positions[i*3] = v.x; positions[i*3+1] = v.y; positions[i*3+2] = v.z;
      var len = Math.hypot(v.x, v.y, v.z) || 1e-4;
      var sp = 3.5 + Math.random() * 8.5; if (isRay[i]) sp *= 2.2;
      vel[i*3] = (v.x / len) * sp; vel[i*3+1] = (v.y / len) * sp; vel[i*3+2] = (v.z / len) * sp;
    }
    points.rotation.set(0, 0, 0); points.position.set(0, 0, 0);
    geo.attributes.position.needsUpdate = true;

    // Flash 2-3 frame rồi fade
    flashEl.style.transition = 'none'; flashEl.style.opacity = '0.95';
    var frames = 0;
    (function hold() {
      frames++;
      if (frames < 3) { requestAnimationFrame(hold); }
      else { flashEl.style.transition = 'opacity 0.9s ease-out'; flashEl.style.opacity = '0'; }
    })();

    ring1.visible = ring2.visible = true;
    ring1.material.opacity = ring2.material.opacity = 0.9;
    ring1.scale.set(0.6, 0.6, 0.6); ring2.scale.set(0.6, 0.6, 0.6);
  }

  function lerpColorsWhiteTo(baseArr, k) {
    // color = lerp(white, base, k) ; k in [0,1]
    for (var i = 0; i < N; i++) {
      colors[i*3]   = 1 + (baseArr[i*3]   - 1) * k;
      colors[i*3+1] = 1 + (baseArr[i*3+1] - 1) * k;
      colors[i*3+2] = 1 + (baseArr[i*3+2] - 1) * k;
    }
    writeColorsFrom(colors);
  }
  function lerpColorsToWhite(baseArr, k) {
    // color = lerp(base, white, k)
    for (var i = 0; i < N; i++) {
      colors[i*3]   = baseArr[i*3]   + (1 - baseArr[i*3])   * k;
      colors[i*3+1] = baseArr[i*3+1] + (1 - baseArr[i*3+1]) * k;
      colors[i*3+2] = baseArr[i*3+2] + (1 - baseArr[i*3+2]) * k;
    }
    writeColorsFrom(colors);
  }

  var clock = new THREE.Clock();
  var running = true;

  function frame() {
    if (!running) return;
    var dt = Math.min(clock.getDelta(), 0.05);
    globalT += dt; phaseT += dt;
    var D = CFG.durations;

    if (phase === PHASE.IDLE) {
      spin += 0.25 * dt;
      points.rotation.y = spin;
      points.rotation.x = Math.sin(globalT * 0.3) * 0.15;
      var amp = 0.05;
      for (var i = 0; i < N; i++) {
        var b = baseR[i] * (1 + Math.sin(globalT * 1.6 + seed[i]) * amp);
        positions[i*3] = dir[i*3] * b; positions[i*3+1] = dir[i*3+1] * b; positions[i*3+2] = dir[i*3+2] * b;
      }
      geo.attributes.position.needsUpdate = true;
      coreGlow.material.opacity = 0.4 + Math.sin(globalT * 1.6) * 0.08;
      coreGlow.scale.setScalar(6 + Math.sin(globalT * 1.6) * 0.4);
      if (phaseT >= D.idleAuto || interacted) toPhase(PHASE.CHARGE);

    } else if (phase === PHASE.CHARGE) {
      var k = Math.min(phaseT / D.charge, 1);
      var freq = 1.6 + (8.6 - 1.6) * k;
      var amp2 = 0.05 + (0.15 - 0.05) * k;
      var shrink = 1 - 0.22 * k;
      spin += (0.25 * (1 + 5 * k)) * dt;
      points.rotation.y = spin;
      for (var j = 0; j < N; j++) {
        var bb = baseR[j] * shrink * (1 + Math.sin(globalT * freq + seed[j]) * amp2);
        positions[j*3] = dir[j*3] * bb; positions[j*3+1] = dir[j*3+1] * bb; positions[j*3+2] = dir[j*3+2] * bb;
      }
      geo.attributes.position.needsUpdate = true;
      lerpColorsToWhite(baseCol, k * 0.75); // tối đa 75% trắng
      coreGlow.material.opacity = 0.45 + 0.5 * k;
      coreGlow.scale.setScalar(6 * shrink + 2 * k);
      if (phaseT >= D.charge) toPhase(PHASE.EXPLODE);

    } else if (phase === PHASE.EXPLODE) {
      var drag = Math.pow(0.92, dt * 60);
      for (var m2 = 0; m2 < N; m2++) {
        positions[m2*3] += vel[m2*3] * dt;
        positions[m2*3+1] += vel[m2*3+1] * dt;
        positions[m2*3+2] += vel[m2*3+2] * dt;
        vel[m2*3] *= drag; vel[m2*3+1] *= drag; vel[m2*3+2] *= drag;
      }
      geo.attributes.position.needsUpdate = true;
      // redshift: nguội từ trắng về palette gốc trong 80% thời gian
      var coolT = Math.min(phaseT / (D.explode * 0.8), 1);
      lerpColorsWhiteTo(baseCol, coolT);
      coreGlow.material.opacity = Math.max(0, 0.95 * (1 - phaseT / (D.explode * 0.5)));

      // sóng xung kích
      var e = phaseT / D.explode;
      var s1 = 0.6 + e * 26;
      var s2 = 0.6 + e * 26 * 0.72; // vòng 2 chậm hơn ~28%
      ring1.scale.set(s1, s1, s1); ring2.scale.set(s2, s2, s2);
      ring1.material.opacity = Math.max(0, 0.9 * (1 - e));
      ring2.material.opacity = Math.max(0, 0.9 * (1 - e * 0.85));

      // camera shake 0.3s đầu
      if (CFG.flags.cameraShake && phaseT < 0.3) {
        var f = (1 - phaseT / 0.3) * 0.25;
        camera.position.set(camBase.x + (Math.random()-0.5)*f, camBase.y + (Math.random()-0.5)*f, camBase.z);
      } else { camera.position.copy(camBase); }

      if (phaseT >= D.explode) { ring1.visible = ring2.visible = false; coreGlow.visible = false; toPhase(PHASE.GATHER); }

    } else if (phase === PHASE.GATHER) {
      var t = Math.min(phaseT / D.gather, 1);
      var ease = 1 - Math.pow(1 - t, 3);
      for (var g = 0; g < N; g++) {
        var pi = planetIdx[g];
        var pc = planetCenter(pi, globalT);
        var ang = globalT * CFG.planets[pi].speed;
        var ro = rotOffsetY(offset[g*3], offset[g*3+2], ang);
        var tx = pc.x + ro[0], ty = pc.y + offset[g*3+1], tz = pc.z + ro[1];
        positions[g*3]   = gStart[g*3]   + (tx - gStart[g*3])   * ease;
        positions[g*3+1] = gStart[g*3+1] + (ty - gStart[g*3+1]) * ease;
        positions[g*3+2] = gStart[g*3+2] + (tz - gStart[g*3+2]) * ease;
        // màu nguội về màu hành tinh
        var c = hexColor(CFG.planets[pi].color);
        colors[g*3]   = baseCol[g*3]   + (c.r - baseCol[g*3])   * ease;
        colors[g*3+1] = baseCol[g*3+1] + (c.g - baseCol[g*3+1]) * ease;
        colors[g*3+2] = baseCol[g*3+2] + (c.b - baseCol[g*3+2]) * ease;
      }
      geo.attributes.position.needsUpdate = true;
      writeColorsFrom(colors);
      if (phaseT >= D.gather) toPhase(PHASE.DONE);

    } else if (phase === PHASE.DONE) {
      placeDone(globalT);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  // ---------- Interaction ----------
  function onInteract() { if (phase === PHASE.IDLE) interacted = true; }
  root.addEventListener('pointerdown', onInteract);
  window.addEventListener('keydown', onInteract);

  function bindFinishHandlers() {
    document.getElementById('ci-cta').addEventListener('click', function () { running = false; removeIntro(); finish(); });
    skipEl.addEventListener('click', function () { running = false; removeIntro(); finish(); });
  }
  function bindResize() {
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      camBase = camera.position.clone();
      if (reduceMotion) renderer.render(scene, camera);
    });
  }

  bindFinishHandlers();
  bindResize();
  requestAnimationFrame(frame);
})();
