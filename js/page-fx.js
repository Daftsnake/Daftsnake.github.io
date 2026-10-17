/**
 * 页面交互特效
 *  1. 进场：内容由模糊到清晰（CSS 驱动，此处负责收尾移除状态类）
 *  2. 离场：点击站内链接时，内容虚化 + 毛玻璃遮罩，再跳转
 *  3. 悬停预取站内页面，让切换更顺滑
 *  4. 首页：把侧边栏放到文章列表旁边；整张卡片可点击
 *  5. 卡片 / 列表滚动进入视口时柔和浮现
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEAVE_MS = 300;

  // ---- 1. 进场 -----------------------------------------------------------
  function finishEnter() { root.classList.remove('fx-enter'); }
  setTimeout(finishEnter, 1000);

  // 浏览器前进/后退命中 bfcache 时，恢复页面状态
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      root.classList.remove('fx-leave');
      finishEnter();
    }
  });

  // ---- 2. 离场 -----------------------------------------------------------
  var SKIP_EXT = /\.(?:jpe?g|png|gif|webp|avif|svg|pdf|zip|rar|7z|xml|json|txt|mp4|mp3)$/i;

  function shouldHandle(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0) return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download') || a.hasAttribute('data-toggle') || a.hasAttribute('data-fancybox')) return false;
    var raw = a.getAttribute('href');
    if (!raw || raw.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(raw)) return false;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    if (SKIP_EXT.test(url.pathname)) return false;
    if (url.pathname === location.pathname && url.search === location.search) return false;
    return url;
  }

  function navigate(href) {
    if (reduceMotion) { location.href = href; return; }
    root.classList.add('fx-leave');
    setTimeout(function () { location.href = href; }, LEAVE_MS);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    var url = shouldHandle(a, e);
    if (!url) return;
    e.preventDefault();
    navigate(url.href);
  });

  // ---- 3. 预取 -----------------------------------------------------------
  var prefetched = {};
  function prefetch(e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || SKIP_EXT.test(url.pathname)) return;
    var key = url.pathname + url.search;
    if (prefetched[key] || key === location.pathname + location.search) return;
    prefetched[key] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = key;
    document.head.appendChild(link);
  }
  document.addEventListener('mouseover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });

  // ---- 4 & 5. DOM 就绪后 ---------------------------------------------------
  function onReady() {
    // 首页侧边栏
    var aside = document.getElementById('home-aside');
    var firstCard = document.querySelector('#board .index-card');
    if (aside && firstCard) {
      var col = firstCard.parentElement;
      var row = col.parentElement;
      col.className = 'home-main';
      row.className = 'home-row';
      row.appendChild(aside);
      aside.hidden = false;
    }

    // 整张卡片可点击
    document.querySelectorAll('.index-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var link = card.querySelector('.index-header a');
        if (link) navigate(link.href);
      });
    });

    // 滚动浮现
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll(
      '.index-card, .aside-card, .list-group-item, .category, .links-card, .post-prevnext, .license-box'
    );
    var io = new IntersectionObserver(function (entries) {
      var delay = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(delay, 360) + 'ms';
        delay += 60;
        el.classList.add('is-in');
        io.unobserve(el);
        setTimeout(function () { el.style.transitionDelay = ''; }, 1200);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) {
      el.classList.add('fx-reveal');
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
