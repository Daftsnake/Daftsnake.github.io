---
title: 一个由 AI 协助构建的“二次元友好型”温馨博客模板
date: 2026-02-06 03:20:00
tags: [网页,开源,教程]
categories: [科技学习文章]
---

👋 大家好！

今天想和大家分享一个我最近折腾的小项目：Next.js Warm Starter。

这是一个基于 Next.js + Tailwind CSS + MDX 构建的轻量级博客/作品集模板。特别之处在于，它的核心架构和代码逻辑，是在 Antigravity 环境下，由 AI 根据我的一份详细需求文档辅助生成的。

🎯 GitHub 仓库地址：https://github.com/Daftsnake/nextjs-warm-starter

# 💡 为什么做这个模板？

原本只是想要试试antigravity里Gemini 3 pro (high)的前端设计水平如何的（虽然我几乎一点都不知道要如何使用Next.js + Tailwind CSS + MDX来构建网站）。

一开始只是想要考考Gemini但是随着不断的提示修改，测试网页bug，提交修改，越来越觉得网页搞得好像还不错，要不开源出去给别人当模板吧!?于是我把做好的网页开源出来了，虽然简陋，不过GitHub上应该也不乏像我这样的半成品网页吧？

无论如何网页都是我努力过的产物（虽然就是写了个prompt，剩下的都是Gemini做的😅），是我喜欢的风格。比如：

二次元友好：方便我以后把背景换成喜欢的插画，而不会让上面的文字看不清。

写作方便：必须支持 MDX，像写文档一样写博客。

于是，我尝试利用 AI 编程工具 Antigravity，通过预设好的 Prompt，完成了这个模板的初代版本。

# ✨ 核心特性

1. 技术栈 (The Tech Stack)

紧跟目前的现代前端潮流，保证了高性能和开发体验：

Next.js 14+ (App Router)：最新的路由架构，服务端渲染 (RSR) 带来的极速首屏体验。

Tailwind CSS：原子化 CSS，修改样式极其方便。

MDX：在 Markdown 里直接写 React 组件，内容创作的终极形态。

TypeScript：类型安全，代码维护更放心。

2. 设计哲学：Warm & Cozy

不同于常见的冷色调，这个 Starter 默认采用了一套“奶油色”主题：

背景色：使用 Cream (#FDFBF7) 代替纯白，护眼且温馨。

毛玻璃效果 (Glassmorphism)：这是为了“二次元兼容性”特意设计的。所有的卡片和导航栏都采用了半透明 + 背景模糊的处理。这意味着你可以随时在 globals.css 中换上一张大大的全屏背景图（比如你的二次元本命），而内容区域依然清晰可读，且能透出背景的色调。

圆角与阴影：大量的 rounded-2xl 和柔和的阴影，拒绝尖锐的棱角。

3. 开箱即用的架构

AI 帮我生成了非常标准的目录结构，你不需要操心配置，直接在 src/content 文件夹里丢 .mdx 文件就能生成文章。

src/
├── app/          # Next.js App Router 页面
├── components/   # UI 组件 (按钮, 卡片, 布局)
├── content/      # 你的博客文章 (MDX)
└── styles/       # 全局样式


# 🚀 快速开始

如果你也想拥有一个温馨的个人小站，只需三步：

克隆仓库

git clone [https://github.com/Daftsnake/nextjs-warm-starter.git](https://github.com/Daftsnake/nextjs-warm-starter.git)
cd nextjs-warm-starter


安装依赖

npm install
或者 yarn install / pnpm install


启动项目

npm run dev


打开浏览器访问 "http://localhost:3000 "，你就能看到那个温馨的界面了。

📝 它是如何构建的？

这个项目的诞生过程本身就很有趣。我并没有从零开始手写每一个 div，而是编写了一份包含：

视觉风格定义（颜色代码、圆角大小）

文件架构树

功能需求（MDX 集成、响应式布局）

...的详细 Prompt，然后交给 AI 生成了初始骨架。

# 🤝 欢迎 Star 和 PR

这是一个开源项目，虽然目前还比较简单，但作为一个起步模板（Starter）已经足够好用。

如果你喜欢这种温馨的风格，或者想找一个干净的 Next.js 模板练手，欢迎来 GitHub 给我点个 Star ⭐️！也欢迎提交 Issue 或 PR 帮助它变得更好。

👉 传送门：https://github.com/Daftsnake/nextjs-warm-starter