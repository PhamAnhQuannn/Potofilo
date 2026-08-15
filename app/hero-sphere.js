/* Potofilo — hero-sphere.js  (redesign: vụ nổ KHAI SINH trang bento)
 * Phase: void → charge → explode → crystallize → alive
 * Canvas WebGL full-screen (#cosmic-stage). Hạt kết tinh thành 7 ô bento rồi TAN — quả cầu HÓA THÀNH trang.
 * Giữ: palette, dust handover, session, mọi lối thoát. Bỏ: planets/navbar/labels.
 */
(function () {
  'use strict';

  var TILE_KEYS = ['identity', 'featured', 'education', 'experience', 'projects', 'skills', 'contact'];

  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    function v(n, f) { var s = cs.getPropertyValue(n); return (s && s.trim()) || f; }
    return {
      ramp: [ v('--sphere-core','#FFFFFF'), v('--sphere-cream','#FFF4D6'), v('--hot-1','#FFC864'),
        v('--hot-2','#FF8C42'), v('--sphere-plasma','#FF5E3A'), v('--cool-3','#E84A8A'), v('--cool-4','#7B2FBF') ],
      rampStops: [0, 0.18, 0.38, 0.58, 0.74, 0.88, 1.0],
      coreGlow: v('--hot-1','#FFC864'), shockFast: v('--sphere-cream','#FFF4D6'), shockSlow: v('--cool-3','#E84A8A'),
      stars: [ v('--star-hot','#CDE3FF'), v('--sphere-core','#FFFFFF'), v('--star-cool','#FFE9C4') ],
      tileAccent: [ v('--hot-1','#FFC864'), v('--hot-2','#FF8C42'), v('--cool-1','#4ECDC4'),
        v('--cool-2','#3A7BD5'), v('--cool-3','#E84A8A'), v('--cool-4','#7B2FBF'), v('--cool-1','#4ECDC4') ]
    };
  }
  function softSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d');
    var grd = g.createRadialGradient(32,32,0,32,32,32);
    grd.addColorStop(0,'rgba(255,255,255,1)'); grd.addColorStop(0.25,'rgba(255,255,255,0.85)');
    grd.addColorStop(0.5,'rgba(255,255,255,0.35)'); grd.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0,0,64,64);
    var tex = new THREE.CanvasTexture(c); tex.needsUpdate = true; return tex;
  }
  function sampleRamp(cols, stops, t) {
    t = Math.max(0, Math.min(1, t));
    for (var i = 0; i < stops.length - 1; i++) {
      if (t <= stops[i+1]) { var f = (t-stops[i])/(stops[i+1]-stops[i]||1); return cols[i].clone().lerp(cols[i+1], f); }
    }
    return cols[cols.length-1].clone();
  }

  // ======================= CosmicSphere =======================
  function CosmicSphere() {
    this.phase = 'void'; this._raf = 0; this._running = false; this._last = 0;
    this.time = 0; this.phaseTime = 0; this._spinY = 0; this.callbacks = {};
    this._disposed = false; this._v = new THREE.Vector3(); this._revealed = {};
  }

  CosmicSphere.prototype.init = function (stageEl, options) {
    options = options || {};
    this.stage = stageEl;
    this.isMobile = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    this.palette = options.palette || readPalette();
    this.R = 1.3; this.count = options.particleCount || (this.isMobile ? 6000 : 14000);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 3.4);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    stageEl.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    this.sprite = softSprite();
    this._buildParticles(); this._buildStars(); this._buildGlow(); this._buildRings();
    return this;
  };

  CosmicSphere.prototype._buildParticles = function () {
    var N = this.count, R = this.R;
    var rampCols = this.palette.ramp.map(function (h) { return new THREE.Color(h); });
    this.tileColors = this.palette.tileAccent.map(function (h) { return new THREE.Color(h); });
    this.baseDir = new Float32Array(N*3); this.baseR = new Float32Array(N);
    this.seed = new Float32Array(N); this.baseColor = new Float32Array(N*3);
    this.vel = new Float32Array(N*3); this.isRay = new Uint8Array(N);
    this.tileIdx = new Int8Array(N); this.tgt = new Float32Array(N*3); this.cStart = new Float32Array(N*3);
    var positions = new Float32Array(N*3), colors = new Float32Array(N*3);

    // trọng số theo diện tích ô (featured lớn nhất)
    var weights = [1, 2.2, 1, 1, 1.4, 1, 1], wsum = 0, cum = [];
    for (var w = 0; w < weights.length; w++) { wsum += weights[w]; cum.push(wsum); }

    for (var i = 0; i < N; i++) {
      var u = Math.random()*2-1, th = Math.random()*Math.PI*2, s = Math.sqrt(1-u*u);
      var dx = Math.cos(th)*s, dy = u, dz = Math.sin(th)*s;
      var rr = Math.pow(Math.random(), 0.42) * R;
      this.baseDir[i*3]=dx; this.baseDir[i*3+1]=dy; this.baseDir[i*3+2]=dz;
      this.baseR[i]=rr; this.seed[i]=Math.random()*Math.PI*2;
      positions[i*3]=dx*rr; positions[i*3+1]=dy*rr; positions[i*3+2]=dz*rr;
      var c = sampleRamp(rampCols, this.palette.rampStops, rr/R);
      this.baseColor[i*3]=c.r; this.baseColor[i*3+1]=c.g; this.baseColor[i*3+2]=c.b;
      colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
      this.isRay[i] = Math.random() < 0.12 ? 1 : 0;
      if (Math.random() < 0.15) { this.tileIdx[i] = -1; }
      else { var r = Math.random()*wsum, pi = 0; while (pi < cum.length-1 && r > cum[pi]) pi++; this.tileIdx[i] = pi; }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry = geo; this.positions = positions; this.colors = colors;
    this.material = new THREE.PointsMaterial({ size: 0.02, map: this.sprite, vertexColors: true,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.points = new THREE.Points(geo, this.material);
    this.group = new THREE.Group(); this.group.add(this.points); this.scene.add(this.group);
  };

  CosmicSphere.prototype._buildStars = function () {
    var tones = this.palette.stars.map(function (h) { return new THREE.Color(h); });
    var M = 260; this.starBase = new Float32Array(M*3); this.starPos = new Float32Array(M*3);
    var col = new Float32Array(M*3);
    for (var i = 0; i < M; i++) {
      var u = Math.random()*2-1, th = Math.random()*Math.PI*2, s = Math.sqrt(1-u*u);
      var r = 4 + Math.random()*5;
      var x = Math.cos(th)*s*r, y = u*r, z = -Math.abs(Math.sin(th)*s*r)-2;
      this.starBase[i*3]=x; this.starBase[i*3+1]=y; this.starBase[i*3+2]=z;
      this.starPos[i*3]=x; this.starPos[i*3+1]=y; this.starPos[i*3+2]=z;
      var c = tones[(Math.random()*tones.length)|0], o = 0.35+Math.random()*0.65;
      col[i*3]=c.r*o; col[i*3+1]=c.g*o; col[i*3+2]=c.b*o;
    }
    this.starCount = M;
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.starPos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.starGeo = g;
    this.starMat = new THREE.PointsMaterial({ size: 0.035, map: this.sprite, vertexColors: true,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.stars = new THREE.Points(g, this.starMat); this.scene.add(this.stars);
  };

  CosmicSphere.prototype._buildGlow = function () {
    this.coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.sprite,
      color: new THREE.Color(this.palette.coreGlow), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.45 }));
    this.coreGlow.scale.set(2.0, 2.0, 1); this.group.add(this.coreGlow);
  };
  CosmicSphere.prototype._buildRings = function () {
    var self = this;
    function mk(hex) {
      var g = new THREE.RingGeometry(0.9, 1.0, 96);
      var m = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex), transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      var mesh = new THREE.Mesh(g, m); mesh.visible = false; self.scene.add(mesh); return mesh;
    }
    this.ring1 = mk(this.palette.shockFast); this.ring2 = mk(this.palette.shockSlow);
  };

  CosmicSphere.prototype.projectToScreen = function (x, y, z) {
    this._v.set(x, y, z).project(this.camera);
    return { x: (this._v.x*0.5+0.5)*window.innerWidth, y: (-this._v.y*0.5+0.5)*window.innerHeight };
  };
  CosmicSphere.prototype.screenToWorldZ0 = function (sx, sy) {
    var ndcx = (sx/window.innerWidth)*2-1, ndcy = -((sy/window.innerHeight)*2-1);
    this._v.set(ndcx, ndcy, 0.5).unproject(this.camera);
    var dir = this._v.sub(this.camera.position), t = -this.camera.position.z / dir.z;
    return { x: this.camera.position.x + dir.x*t, y: this.camera.position.y + dir.y*t };
  };

  // Tính đích world cho mỗi hạt = điểm ngẫu nhiên trong hình chữ nhật ô của nó
  CosmicSphere.prototype._computeTileTargets = function () {
    var rects = {};
    for (var k = 0; k < TILE_KEYS.length; k++) {
      var el = document.querySelector('.tile[data-tile="' + TILE_KEYS[k] + '"]');
      rects[k] = el ? el.getBoundingClientRect() : null;
    }
    var N = this.count;
    for (var i = 0; i < N; i++) {
      var ti = this.tileIdx[i]; if (ti === -1) continue;
      var r = rects[ti]; if (!r) { this.tgt[i*3]=0; this.tgt[i*3+1]=0; this.tgt[i*3+2]=0; continue; }
      var sx = r.left + Math.random()*r.width, sy = r.top + Math.random()*r.height;
      var wp = this.screenToWorldZ0(sx, sy);
      this.tgt[i*3]=wp.x; this.tgt[i*3+1]=wp.y; this.tgt[i*3+2]=0;
    }
  };

  CosmicSphere.prototype.getDustHandover = function () {
    var out = [], N = this.count, pos = this.positions;
    for (var i = 0; i < N && out.length < 400; i++) {
      if (this.tileIdx[i] !== -1) continue;
      var s = this.projectToScreen(pos[i*3], pos[i*3+1], pos[i*3+2]);
      out.push({ x: s.x, y: s.y });
    }
    return out;
  };

  // ---------------- phase enter ----------------
  CosmicSphere.prototype.setPhase = function (name) {
    this.phase = name; this.phaseTime = 0;
    if (name === 'explode') this._enterExplode();
    if (name === 'crystallize') { this.cStart.set(this.positions); if (this.callbacks.onCrystallize) this.callbacks.onCrystallize(this.getDustHandover()); }
    if (name === 'alive') this._enterAlive();
    if (this.callbacks.onPhase) this.callbacks.onPhase(name);
  };

  CosmicSphere.prototype._enterExplode = function () {
    this._computeTileTargets();
    this.points.updateMatrixWorld(true);
    var m = this.points.matrixWorld, v = this._v, pos = this.positions, N = this.count;
    for (var i = 0; i < N; i++) {
      v.set(pos[i*3], pos[i*3+1], pos[i*3+2]).applyMatrix4(m);
      pos[i*3]=v.x; pos[i*3+1]=v.y; pos[i*3+2]=v.z;
      var len = Math.hypot(v.x, v.y, v.z) || 1e-4;
      var rdx = v.x/len, rdy = v.y/len, rdz = v.z/len;
      // nghiêng ~15% về phía ô đích (vụ nổ hỗn loạn nhưng có chủ đích)
      if (this.tileIdx[i] !== -1) {
        var tx = this.tgt[i*3]-v.x, ty = this.tgt[i*3+1]-v.y, tz = this.tgt[i*3+2]-v.z;
        var tl = Math.hypot(tx, ty, tz) || 1e-4;
        rdx += (tx/tl)*0.4; rdy += (ty/tl)*0.4; rdz += (tz/tl)*0.4;
        var nl = Math.hypot(rdx, rdy, rdz) || 1e-4; rdx/=nl; rdy/=nl; rdz/=nl;
      }
      var sp = 3.5 + Math.random()*8.5; if (this.isRay[i]) sp *= 2.2;
      this.vel[i*3]=rdx*sp; this.vel[i*3+1]=rdy*sp; this.vel[i*3+2]=rdz*sp;
    }
    this.group.rotation.set(0,0,0);
    this.geometry.attributes.position.needsUpdate = true;
    this.ring1.visible = this.ring2.visible = true;
    this.ring1.material.opacity = this.ring2.material.opacity = 0.9;
    this.ring1.scale.set(0.6,0.6,0.6); this.ring2.scale.set(0.6,0.6,0.6);
    this.coreGlow.material.opacity = 0;
    if (this.callbacks.onFlash) this.callbacks.onFlash();
  };

  CosmicSphere.prototype._enterAlive = function () {
    this.points.visible = false; this.stars.visible = false;
    this.ring1.visible = this.ring2.visible = false; this.coreGlow.visible = false;
    if (this.callbacks.onAlive) this.callbacks.onAlive();
  };

  // ---------------- update per phase ----------------
  CosmicSphere.prototype.update = function (dt) {
    this.time += dt; this.phaseTime += dt;
    switch (this.phase) {
      case 'void': this._void(dt); break;
      case 'charge': this._charge(dt); break;
      case 'explode': this._explode(dt); break;
      case 'crystallize': this._crystallize(dt); break;
      case 'alive': break;
      default: this._void(dt);
    }
  };

  CosmicSphere.prototype._void = function (dt) {
    var t = this.time, N = this.count;
    this._spinY += 0.25 * dt; this.group.rotation.y = this._spinY;
    this.group.rotation.x = Math.sin(t*0.2)*0.12;
    var pos = this.positions, d = this.baseDir, br = this.baseR, sd = this.seed;
    for (var i = 0; i < N; i++) { var b = br[i]*(1+Math.sin(t*1.6+sd[i])*0.05); pos[i*3]=d[i*3]*b; pos[i*3+1]=d[i*3+1]*b; pos[i*3+2]=d[i*3+2]*b; }
    this.geometry.attributes.position.needsUpdate = true;
    this.coreGlow.material.opacity = 0.45 + Math.sin(t*1.6)*0.05;
    this.coreGlow.scale.setScalar(2.0 + Math.sin(t*1.6)*0.1);
  };

  CosmicSphere.prototype._charge = function (dt) {
    var k = Math.min(this.phaseTime/this._dur.charge, 1), t = this.time, N = this.count;
    var freq = 1.6 + (8.5-1.6)*k, amp = 0.05 + 0.10*k, shrink = 1 - 0.22*k;
    this._spinY += 0.25*(1+5*k)*dt; this.group.rotation.y = this._spinY;
    var pos = this.positions, d = this.baseDir, br = this.baseR, sd = this.seed;
    for (var i = 0; i < N; i++) { var b = br[i]*shrink*(1+Math.sin(t*freq+sd[i])*amp); pos[i*3]=d[i*3]*b; pos[i*3+1]=d[i*3+1]*b; pos[i*3+2]=d[i*3+2]*b; }
    this.geometry.attributes.position.needsUpdate = true;
    var bc = this.baseColor, col = this.colors, kk = k*0.75;
    for (var j = 0; j < N; j++) { col[j*3]=bc[j*3]+(1-bc[j*3])*kk; col[j*3+1]=bc[j*3+1]+(1-bc[j*3+1])*kk; col[j*3+2]=bc[j*3+2]+(1-bc[j*3+2])*kk; }
    this.geometry.attributes.color.needsUpdate = true;
    // sao bị hút nhẹ về tâm 2–4%
    var suck = 1 - 0.04*k, sp = this.starPos, sb = this.starBase, M = this.starCount;
    for (var s2 = 0; s2 < M; s2++) { sp[s2*3]=sb[s2*3]*suck; sp[s2*3+1]=sb[s2*3+1]*suck; sp[s2*3+2]=sb[s2*3+2]*suck; }
    this.starGeo.attributes.position.needsUpdate = true;
    this.coreGlow.material.opacity = 0.45 + 0.5*k;
  };

  CosmicSphere.prototype._explode = function (dt) {
    var N = this.count, drag = Math.pow(0.92, dt*60), pos = this.positions, vel = this.vel;
    for (var i = 0; i < N; i++) {
      pos[i*3]+=vel[i*3]*dt; pos[i*3+1]+=vel[i*3+1]*dt; pos[i*3+2]+=vel[i*3+2]*dt;
      vel[i*3]*=drag; vel[i*3+1]*=drag; vel[i*3+2]*=drag;
    }
    this.geometry.attributes.position.needsUpdate = true;
    var coolT = Math.min(this.phaseTime/(this._dur.explode*0.8), 1), bc = this.baseColor, col = this.colors;
    for (var j = 0; j < N; j++) { col[j*3]=1+(bc[j*3]-1)*coolT; col[j*3+1]=1+(bc[j*3+1]-1)*coolT; col[j*3+2]=1+(bc[j*3+2]-1)*coolT; }
    this.geometry.attributes.color.needsUpdate = true;
    var e = this.phaseTime/this._dur.explode, s1 = 0.6+e*28, s2 = 0.6+e*28*0.72;
    this.ring1.scale.set(s1,s1,s1); this.ring2.scale.set(s2,s2,s2);
    this.ring1.material.opacity = Math.max(0, 0.9*(1-e)); this.ring2.material.opacity = Math.max(0, 0.9*(1-e*0.85));
    if (this.phaseTime < 0.3) { var f = (1-this.phaseTime/0.3)*0.06; this.camera.position.x=(Math.random()-0.5)*f; this.camera.position.y=(Math.random()-0.5)*f; }
    else { this.camera.position.x=0; this.camera.position.y=0; }
  };

  CosmicSphere.prototype._crystallize = function (dt) {
    var N = this.count, dur = this._dur.crystallize, stagger = 0.12;
    var move = Math.max(0.4, dur - stagger*6);
    var pos = this.positions, col = this.colors, bc = this.baseColor, cs = this.cStart, tg = this.tgt;
    for (var i = 0; i < N; i++) {
      var ti = this.tileIdx[i]; if (ti === -1) continue;
      var delay = ti * stagger;
      var lt = Math.max(0, Math.min((this.phaseTime - delay) / move, 1));
      var e = 1 - Math.pow(1-lt, 3);
      pos[i*3]   = cs[i*3]   + (tg[i*3]   - cs[i*3])   * e;
      pos[i*3+1] = cs[i*3+1] + (tg[i*3+1] - cs[i*3+1]) * e;
      pos[i*3+2] = cs[i*3+2] + (tg[i*3+2] - cs[i*3+2]) * e;
      var pc = this.tileColors[ti];
      col[i*3]=bc[i*3]+(pc.r-bc[i*3])*e; col[i*3+1]=bc[i*3+1]+(pc.g-bc[i*3+1])*e; col[i*3+2]=bc[i*3+2]+(pc.b-bc[i*3+2])*e;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    // reveal ô khi hạt của nó đạt ~70%
    for (var k = 0; k < TILE_KEYS.length; k++) {
      if (this._revealed[k]) continue;
      var d2 = k*stagger;
      if (this.phaseTime >= d2 + move*0.7) { this._revealed[k] = true; if (this.callbacks.onRevealTile) this.callbacks.onRevealTile(TILE_KEYS[k]); }
    }
    // hạt tan mờ 30% cuối
    this.material.opacity = Math.max(0, 1 - Math.max(0, (this.phaseTime/dur - 0.7)/0.3));
  };

  CosmicSphere.prototype.onResize = function () {
    if (!this.renderer) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth/window.innerHeight; this.camera.updateProjectionMatrix();
    if (!this._running) this.renderStatic();
  };
  CosmicSphere.prototype.renderStatic = function () { if (this.renderer) this.renderer.render(this.scene, this.camera); };

  CosmicSphere.prototype.start = function () {
    if (this._running || this._disposed) return;
    this._running = true; this._last = performance.now(); var self = this;
    function loop(now) {
      if (!self._running) return;
      var dt = Math.min((now-self._last)/1000, 0.05); self._last = now;
      self.update(dt); self.renderer.render(self.scene, self.camera);
      self._raf = requestAnimationFrame(loop);
    }
    this._raf = requestAnimationFrame(loop);
  };
  CosmicSphere.prototype.stop = function () { this._running = false; if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; } };

  CosmicSphere.prototype.dispose = function () {
    this._disposed = true; this.stop();
    var d = [this.geometry, this.material, this.starGeo, this.starMat, this.sprite,
      this.ring1&&this.ring1.geometry, this.ring1&&this.ring1.material, this.ring2&&this.ring2.geometry,
      this.ring2&&this.ring2.material, this.coreGlow&&this.coreGlow.material];
    for (var i = 0; i < d.length; i++) { if (d[i] && d[i].dispose) d[i].dispose(); }
    if (this.renderer) { this.renderer.dispose(); if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas); }
    // giải phóng buffer lớn
    this.positions = this.colors = this.baseDir = this.baseR = this.seed = this.baseColor =
      this.vel = this.tgt = this.cStart = null;
  };

  // ======================= Bootstrap =======================
  function revealAllTiles() {
    var tiles = document.querySelectorAll('#bento .tile');
    for (var i = 0; i < tiles.length; i++) tiles[i].classList.add('cosmic-crystallized');
  }
  function revealTile(key) {
    var el = document.querySelector('.tile[data-tile="' + key + '"]');
    if (el) el.classList.add('cosmic-crystallized');
  }

  // Cubic-bezier evaluator (bisection) — dùng cho easing hút vào lõi
  function makeBezier(x1, y1, x2, y2) {
    function bez(t, a, b) { var mt = 1 - t; return 3 * mt * mt * t * a + 3 * mt * t * t * b + t * t * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 20; i++) { var xe = bez(t, x1, x2) - x; if (Math.abs(xe) < 1e-4) break; if (xe > 0) hi = t; else lo = t; t = (lo + hi) / 2; }
      return bez(t, y1, y2);
    };
  }

  // Lời chào "HELLO → I'M QUAN" — driven by sim-time của CosmicSphere (throttle-safe)
  function makeGreeting(sphere, root) {
    if (!root) return { update: function () {}, destroy: function () {} };
    var easeSuck = makeBezier(0.55, 0, 1, 0.45);
    var STAGGER_IN = 0.04, T_HELLO = 0.30, T_SWAP = 1.30, T_SWAP_MID = 1.42;
    var T_SUCK = 2.40, T_SUCK_END = 2.90, SUCK_STAG = 0.035;
    var chars = [], done = false, suckData = null;
    var built = { hello: false, swap: false, swapMid: false, suckInit: false, cleared: false };

    function place() { var b = sphere.projectToScreen(0, -sphere.R, 0); root.style.top = (b.y + 40) + 'px'; }
    function renderWord(str, visibleNow) {
      root.innerHTML = ''; chars = [];
      for (var i = 0; i < str.length; i++) {
        var sp = document.createElement('span');
        sp.className = 'cg-char' + (visibleNow ? ' cg-in' : '');
        sp.textContent = str[i] === ' ' ? ' ' : str[i];
        root.appendChild(sp); chars.push(sp);
      }
    }
    function onResize() { if (!done) place(); }
    function initSuck() {
      var c = sphere.projectToScreen(0, 0, 0), n = chars.length; suckData = [];
      for (var i = 0; i < n; i++) {
        chars[i].style.transition = 'none';
        var r = chars[i].getBoundingClientRect();
        suckData.push({ dx: c.x - (r.left + r.width / 2), dy: c.y - (r.top + r.height / 2), delay: Math.min(i, n - 1 - i) * SUCK_STAG });
      }
    }
    window.addEventListener('resize', onResize); place();

    return {
      update: function (t) {
        if (done) return;
        if (!built.hello && t >= T_HELLO) { renderWord('HELLO', false); built.hello = true; }
        if (built.hello && !built.swap) {
          for (var i = 0; i < chars.length; i++)
            if (t >= T_HELLO + i * STAGGER_IN && chars[i].className.indexOf('cg-in') < 0) chars[i].className = 'cg-char cg-in';
        }
        if (!built.swap && t >= T_SWAP) { root.classList.add('cg-swapout'); built.swap = true; }
        if (built.swap && !built.swapMid && t >= T_SWAP_MID) { renderWord("I'M QUAN", true); root.classList.remove('cg-swapout'); built.swapMid = true; }
        if (built.swapMid && t >= T_SUCK) {
          if (!built.suckInit) { initSuck(); built.suckInit = true; }
          for (var j = 0; j < chars.length; j++) {
            var d = suckData[j];
            var lt = (t - (T_SUCK + d.delay)) / (T_SUCK_END - (T_SUCK + d.delay));
            lt = lt < 0 ? 0 : (lt > 1 ? 1 : lt);
            var e = easeSuck(lt);
            chars[j].style.transform = 'translate(' + (d.dx * e) + 'px,' + (d.dy * e) + 'px) scale(' + (1 - 0.8 * e) + ')';
            chars[j].style.opacity = (0.85 * (1 - e)).toFixed(3);
            chars[j].style.filter = 'blur(' + (2 * e).toFixed(2) + 'px)';
          }
        }
        if (!built.cleared && t >= T_SUCK_END) { root.innerHTML = ''; chars = []; built.cleared = true; done = true; window.removeEventListener('resize', onResize); }
      },
      destroy: function () {
        if (done) return; done = true; root.innerHTML = ''; chars = [];
        root.classList.remove('cg-swapout'); window.removeEventListener('resize', onResize);
      }
    };
  }

  function boot() {
    var stage = document.getElementById('cosmic-stage');
    var bento = document.getElementById('bento');
    if (!bento) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen = false; // intro replay mỗi lần reload (không nhớ phiên)
    var webgl = false; try { var tc = document.createElement('canvas'); webgl = !!(window.WebGLRenderingContext && (tc.getContext('webgl') || tc.getContext('experimental-webgl'))); } catch (e) {}

    // D3 reduced / D4 no-WebGL/THREE → bento tĩnh ngay, không intro, không dust
    if (reduce || typeof THREE === 'undefined' || !webgl) { revealAllTiles(); return; }

    // D2 lần 2 trong phiên → bento ngay + dust, không intro
    if (seen) { revealAllTiles(); if (window.CosmicDust) window.CosmicDust.start(null); return; }

    // ---- Auto-play intro khai sinh ----
    // Reload: chặn trình duyệt khôi phục vị trí cuộn (scroll restoration) —
    // nó phát 'scroll' event tức thì → onSkip() bỏ intro. Đưa về top trước khi gắn listener.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.classList.add('cosmic-intro-running');
    var sphere = new CosmicSphere(); sphere.init(stage); window.cosmicSphere = sphere;
    var greet = makeGreeting(sphere, document.getElementById('cosmic-greet'));
    var dur = sphere.isMobile
      ? { void: 1.0, charge: 1.3, explode: 1.3, crystallize: 1.6 }
      : { void: 1.5, charge: 1.8, explode: 1.7, crystallize: 2.0 };
    sphere._dur = dur;
    var order = ['void', 'charge', 'explode', 'crystallize'];
    var bounds = [dur.void, dur.charge, dur.explode, dur.crystallize];

    var flash = document.getElementById('ci-flash-overlay');
    var skipBtn = document.getElementById('skip-intro');
    var finished = false;

    sphere.callbacks = {
      onFlash: function () { if (!flash) return; flash.style.transition = 'none'; flash.style.opacity = '0.95';
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ flash.style.transition='opacity 0.9s ease-out'; flash.style.opacity='0'; }); }); },
      onCrystallize: function (points) { if (window.CosmicDust) window.CosmicDust.start(points); },
      onRevealTile: function (key) { revealTile(key); }
    };

    var elapsed = 0, phaseI = 0;
    sphere.setPhase('void');
    var origUpdate = CosmicSphere.prototype.update.bind(sphere);
    sphere.update = function (dt) {
      if (!finished) {
        elapsed += dt;
        var acc = 0, target = 0;
        for (var i = 0; i < bounds.length; i++) { acc += bounds[i]; if (elapsed < acc) { target = i; break; } target = i + 1; }
        if (target >= order.length) { finishIntro(false); return; }
        if (target !== phaseI) { phaseI = target; sphere.setPhase(order[phaseI]); if (order[phaseI] === 'explode') greet.destroy(); }
        greet.update(elapsed);
      }
      origUpdate(dt);
    };

    function finishIntro(fast) {
      if (finished) return; finished = true;
      greet.destroy();
      sphere.setPhase('alive');
      revealAllTiles();
      if (window.CosmicDust) window.CosmicDust.start(null);
      if (skipBtn) skipBtn.style.display = 'none'; // nút Bỏ qua BIẾN MẤT (sửa lỗi bản cũ)
      if (stage) { stage.classList.add('cosmic-stage-out'); }
      cleanup();
      setTimeout(function () {
        document.body.classList.remove('cosmic-intro-running');
        sphere.stop(); sphere.dispose();
      }, fast ? 300 : 650);
    }

    function onSkip() { if (!finished) finishIntro(true); }
    function onKey(e) { if (e.key === 'Escape') onSkip(); }
    function onScroll() { onSkip(); }
    if (skipBtn) skipBtn.addEventListener('click', onSkip);
    document.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    function cleanup() {
      window.removeEventListener('wheel', onScroll); window.removeEventListener('touchmove', onScroll);
      window.removeEventListener('scroll', onScroll); document.removeEventListener('keydown', onKey);
    }
    document.addEventListener('visibilitychange', function () { if (finished) return; if (document.hidden) sphere.stop(); else if (!sphere._disposed) sphere.start(); });
    window.addEventListener('resize', function () { if (!sphere._disposed) sphere.onResize(); });
    window.addEventListener('beforeunload', function () { if (!sphere._disposed) sphere.dispose(); });

    sphere.start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
