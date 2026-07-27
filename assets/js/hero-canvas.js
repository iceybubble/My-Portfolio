/*!
 * hero-canvas.js — Interactive particle constellation background
 * Vanilla Canvas 2D, zero deps. Auto-inits on canvas#hero-canvas.
 */
(function () {
  'use strict';

  var GOLD = '#D4A574', AMBER = '#E8B988';
  var FRAME_MIN_MS = 1000 / 60;

  function isMobile() { return window.innerWidth < 768; }

  function getConfig() {
    var m = isMobile();
    return {
      count: m ? 35 : 85,
      linkDist: m ? 110 : 160,
      mouseRepel: 130,
      mouseLink: m ? 120 : 170,
      maxSpeed: 0.45,
      minSize: 1,
      maxSize: 2.8
    };
  }

  function makeParticle(w, h, cfg) {
    var layer = Math.random();
    var size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
    var speedScale = 0.4 + layer * 0.6;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * cfg.maxSpeed * speedScale,
      vy: (Math.random() - 0.5) * cfg.maxSpeed * speedScale,
      r: size, rBase: size,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      color: Math.random() < 0.6 ? GOLD : AMBER,
      layer: layer
    };
  }

  function hexToRgba(hex, a) {
    var h = hex.charAt(0) === '#' ? hex.slice(1) : hex;
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function HeroCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cfg = getConfig();
    this.particles = [];
    this.mouse = { x: -9999, y: -9999, active: false };
    this.lastTime = 0;
    this.running = false;
    this.rafId = 0;

    this._loop = this.loop.bind(this);
    var self = this;
    this._onResize = function () { self.resize(); };
    this._onMove = function (e) {
      var r = self.canvas.getBoundingClientRect();
      self.mouse.x = e.clientX - r.left;
      self.mouse.y = e.clientY - r.top;
      self.mouse.active = true;
    };
    this._onLeave = function () { self.mouse.x = self.mouse.y = -9999; self.mouse.active = false; };
    this._onVis = function () {
      if (document.hidden) self.stop();
      else if (!self.canvas.hasAttribute('data-paused')) self.start();
    };

    this.resize();
    this.spawn();
    this.bind();
    this.start();
  }

  HeroCanvas.prototype.bind = function () {
    window.addEventListener('resize', this._onResize);
    window.addEventListener('mousemove', this._onMove);
    window.addEventListener('mouseleave', this._onLeave);
    document.addEventListener('visibilitychange', this._onVis);
  };

  HeroCanvas.prototype.unbind = function () {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('mousemove', this._onMove);
    window.removeEventListener('mouseleave', this._onLeave);
    document.removeEventListener('visibilitychange', this._onVis);
  };

  HeroCanvas.prototype.resize = function () {
    var parent = this.canvas.parentElement || document.body;
    this.w = parent.clientWidth || window.innerWidth;
    this.h = parent.clientHeight || window.innerHeight;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    this.cfg = getConfig();
    if (this.particles.length === 0) this.spawn();
  };

  HeroCanvas.prototype.spawn = function () {
    this.particles = [];
    for (var i = 0; i < this.cfg.count; i++) {
      this.particles.push(makeParticle(this.w, this.h, this.cfg));
    }
  };

  HeroCanvas.prototype.update = function () {
    var w = this.w, h = this.h, cfg = this.cfg;
    var mx = this.mouse.x, my = this.mouse.y;

    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];

      p.pulsePhase += p.pulseSpeed;
      p.r = p.rBase + Math.sin(p.pulsePhase) * 0.4;

      if (this.mouse.active) {
        var dx = p.x - mx, dy = p.y - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.mouseRepel && dist > 0) {
          var force = (1 - dist / cfg.mouseRepel) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      else if (p.y > h + 10) p.y = -10;
    }
  };

  HeroCanvas.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.w, this.h);
    var pCount = this.particles.length, cfg = this.cfg;

    // Draw particle links
    for (var i = 0; i < pCount; i++) {
      var p1 = this.particles[i];
      for (var j = i + 1; j < pCount; j++) {
        var p2 = this.particles[j];
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.linkDist) {
          var alpha = (1 - dist / cfg.linkDist) * 0.25;
          this.ctx.strokeStyle = hexToRgba(GOLD, alpha);
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw mouse links
    if (this.mouse.active) {
      for (var k = 0; k < pCount; k++) {
        var p = this.particles[k];
        var mdx = p.x - this.mouse.x, mdy = p.y - this.mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < cfg.mouseLink) {
          var mAlpha = (1 - mDist / cfg.mouseLink) * 0.4;
          this.ctx.strokeStyle = hexToRgba(AMBER, mAlpha);
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw particle nodes
    for (var n = 0; n < pCount; n++) {
      var pt = this.particles[n];
      this.ctx.fillStyle = hexToRgba(pt.color, 0.7);
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, Math.max(0.5, pt.r), 0, Math.PI * 2);
      this.ctx.fill();
    }
  };

  HeroCanvas.prototype.loop = function (now) {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this._loop);

    if (!now) now = performance.now();
    var delta = now - this.lastTime;
    if (delta < FRAME_MIN_MS) return;
    this.lastTime = now - (delta % FRAME_MIN_MS);

    this.update();
    this.draw();
  };

  HeroCanvas.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this._loop);
  };

  HeroCanvas.prototype.stop = function () {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var c = document.getElementById('hero-canvas');
    if (c) window.heroCanvasInstance = new HeroCanvas(c);
  });
})();
