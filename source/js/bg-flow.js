/**
 * 流动背景：几团柔和的彩色光晕，会随时间缓慢漂移，
 * 并随页面滚动「向上流动」（带惯性），鼠标移动时轻微视差。
 * - 低分辨率绘制再放大，开销很小；限制 30fps；切到后台自动暂停
 * - 跟随 Fluid 的明暗模式切换，并平滑过渡配色
 * - 系统开启「减少动态效果」时只绘制静态画面
 */
(function () {
  'use strict';

  var canvas = document.getElementById('flow-bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d', { alpha: false });
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // ---- 配色 ---------------------------------------------------------------
  var PALETTE = {
    light: {
      base: [244, 242, 251],
      blobs: [[255, 179, 207], [185, 168, 255], [154, 216, 255], [166, 240, 213], [255, 214, 165]],
      alpha: 0.62
    },
    dark: {
      base: [16, 17, 26],
      blobs: [[109, 74, 255], [255, 79, 154], [31, 182, 255], [0, 209, 160], [138, 92, 255]],
      alpha: 0.34
    }
  };

  // 每团光晕：基础位置(0~1)、半径(相对短边)、漂移幅度、速度、相位、滚动流速
  var BLOBS = [
    { x: 0.15, y: 0.20, r: 0.65, ax: 0.10, ay: 0.08, s: 0.050, p: 0.0, f: 0.35 },
    { x: 0.85, y: 0.15, r: 0.55, ax: 0.08, ay: 0.10, s: 0.040, p: 1.7, f: 0.55 },
    { x: 0.70, y: 0.75, r: 0.70, ax: 0.12, ay: 0.07, s: 0.035, p: 3.1, f: 0.25 },
    { x: 0.25, y: 0.85, r: 0.50, ax: 0.09, ay: 0.09, s: 0.060, p: 4.4, f: 0.70 },
    { x: 0.50, y: 0.45, r: 0.45, ax: 0.14, ay: 0.12, s: 0.045, p: 5.6, f: 0.45 }
  ];

  var SCALE = 0.25;        // 绘制分辨率比例，越小越省性能
  var FRAME_MS = 1000 / 30;
  var w = 0, h = 0, vw = 1, vh = 1;
  var scrollTarget = window.scrollY, scrollSmooth = scrollTarget;
  var mouseX = 0.5, mouseY = 0.5, mouseSX = 0.5, mouseSY = 0.5;
  var darkMix = isDark() ? 1 : 0;
  var lastFrame = 0, rafId = 0;

  function isDark() {
    var attr = root.getAttribute('data-user-color-scheme');
    if (attr) return attr === 'dark';
    return darkQuery.matches;
  }

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    w = Math.max(64, Math.round(vw * SCALE));
    h = Math.max(64, Math.round(vh * SCALE));
    canvas.width = w;
    canvas.height = h;
    draw(Date.now() / 1000);
  }

  function mix(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }

  function draw(t) {
    var L = PALETTE.light, D = PALETTE.dark;
    var base = mix(L.base, D.base, darkMix);
    var alpha = L.alpha + (D.alpha - L.alpha) * darkMix;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgb(' + base.join(',') + ')';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = darkMix > 0.5 ? 'lighter' : 'source-over';

    var short = Math.min(w, h);
    var scrollVh = scrollSmooth / vh;
    var mx = (mouseSX - 0.5), my = (mouseSY - 0.5);

    for (var i = 0; i < BLOBS.length; i++) {
      var b = BLOBS[i];
      var color = mix(L.blobs[i], D.blobs[i], darkMix);
      var r = b.r * short * (1 + 0.08 * Math.sin(t * b.s * 3 + b.p));

      var x = b.x + b.ax * Math.sin(t * b.s + b.p) + mx * b.f * 0.12;
      // 随滚动向上流动，并在视口外循环回来
      var span = 1 + b.r * 1.6;
      var y = b.y + b.ay * Math.cos(t * b.s * 0.8 + b.p) - scrollVh * b.f * 0.6 + my * b.f * 0.12;
      y = ((y + b.r * 0.8) % span + span) % span - b.r * 0.8;

      var cx = x * w, cy = y * h;
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      var rgb = color.join(',');
      g.addColorStop(0, 'rgba(' + rgb + ',' + alpha + ')');
      g.addColorStop(0.55, 'rgba(' + rgb + ',' + (alpha * 0.35) + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(now) {
    rafId = 0;
    if (document.hidden) return;
    if (now - lastFrame >= FRAME_MS) {
      lastFrame = now;
      // 惯性平滑
      scrollSmooth += (scrollTarget - scrollSmooth) * 0.08;
      mouseSX += (mouseX - mouseSX) * 0.05;
      mouseSY += (mouseY - mouseSY) * 0.05;
      var targetDark = isDark() ? 1 : 0;
      darkMix += (targetDark - darkMix) * 0.12;
      if (Math.abs(targetDark - darkMix) < 0.002) darkMix = targetDark;
      draw(now / 1000 + (performance.timeOrigin || 0) / 1000);
    }
    schedule();
  }

  function schedule() {
    if (!rafId && !reduceMotion.matches && !document.hidden) rafId = requestAnimationFrame(loop);
  }

  // 静态模式（减少动态效果）下，滚动/切换主题时重绘一次即可
  function staticRedraw() {
    if (!reduceMotion.matches) return;
    scrollSmooth = scrollTarget;
    darkMix = isDark() ? 1 : 0;
    draw(0);
  }

  window.addEventListener('scroll', function () {
    scrollTarget = window.scrollY;
    staticRedraw();
  }, { passive: true });

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mouseX = e.clientX / vw;
    mouseY = e.clientY / vh;
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  document.addEventListener('visibilitychange', schedule);
  new MutationObserver(staticRedraw).observe(root, { attributes: true, attributeFilter: ['data-user-color-scheme'] });
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', staticRedraw);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', function () { staticRedraw(); schedule(); });

  resize();
  schedule();
})();
