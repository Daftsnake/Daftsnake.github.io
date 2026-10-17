/* global hexo */
/**
 * 博客外观定制层（不修改 node_modules 中的 Fluid 主题，方便日后升级）
 *
 *  - head      : 尽早写入进场动画状态，避免首帧闪烁
 *  - bodyBegin : 流动背景画布 + 页面切换时的毛玻璃遮罩
 *  - bodyEnd   : 首页侧边栏（个人卡片 / 统计 / 分类 / 标签），由 page-fx.js 挪到正确位置
 */
'use strict';

hexo.extend.filter.register('theme_inject', function (injects) {
  injects.head.raw('fx-head', `
<meta name="theme-color" content="#f4f2fb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#12131c" media="(prefers-color-scheme: dark)">
<script>
  (function () {
    var d = document.documentElement;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('fx-enter');
  })();
</script>`);

  injects.bodyBegin.raw('fx-background', `
<canvas id="flow-bg" aria-hidden="true"></canvas>
<div id="fx-veil" aria-hidden="true"></div>`);

  injects.bodyEnd.raw('home-aside', `
<% if (is_home()) { %>
<aside id="home-aside" class="home-aside" hidden>
  <section class="aside-card profile-card">
    <img class="profile-avatar" src="<%= url_for(theme.about.avatar) %>" alt="avatar" data-nolazyload>
    <div class="profile-name"><%- theme.about.name || config.author %></div>
    <div class="profile-intro"><%- theme.about.intro %></div>
    <div class="profile-stats">
      <a href="<%= url_for(config.archive_dir + '/') %>"><b><%= site.posts.length %></b><span>文章</span></a>
      <a href="<%= url_for(config.category_dir + '/') %>"><b><%= site.categories.length %></b><span>分类</span></a>
      <a href="<%= url_for(config.tag_dir + '/') %>"><b><%= site.tags.length %></b><span>标签</span></a>
    </div>
    <% if ((theme.about.icons || []).length) { %>
    <div class="profile-links">
      <% for (const each of theme.about.icons) { if (!each.link) continue; %>
        <a href="<%= url_for(each.link) %>" target="_blank" rel="noopener" aria-label="<%= each.tip || '' %>"><i class="<%= each.class %>"></i></a>
      <% } %>
    </div>
    <% } %>
  </section>

  <% if (site.categories.length) { %>
  <section class="aside-card">
    <div class="aside-title"><i class="iconfont icon-category-fill"></i> 分类</div>
    <div class="aside-cats">
      <% site.categories.sort('length', -1).each(function (cat) { %>
        <a href="<%= url_for(cat.path) %>"><span><%= cat.name %></span><em><%= cat.length %></em></a>
      <% }) %>
    </div>
  </section>
  <% } %>

  <% if (site.tags.length) { %>
  <section class="aside-card">
    <div class="aside-title"><i class="iconfont icon-tags-fill"></i> 标签</div>
    <div class="aside-tags">
      <% site.tags.sort('length', -1).limit(24).each(function (tag) { %>
        <a href="<%= url_for(tag.path) %>">#<%= tag.name %></a>
      <% }) %>
    </div>
  </section>
  <% } %>
</aside>
<% } %>`);
});
