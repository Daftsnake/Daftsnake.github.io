---
title: Git 入门与实操指南：从零到协作
date: 2026-02-13 21:50:00
tags: [Git, 教程, 学习]
categories: [科技学习文章]
---

Git 入门与实操指南：从零到协作

这份指南旨在帮助你从零开始建立 Git 工作流。Git 不仅仅是备份工具，它更像是一台“代码时光机”，记录你项目的每一步演进。

# 一、 环境开启：安装与配置

在开始使用 Git 之前，你需要先在电脑上搭建好环境。

## 1.1 安装 Git
Windows: 前往 git-scm.com 下载并安装。安装完成后，在文件夹空白处右键，你会看到 "Git Bash Here"，这就是你以后操作 Git 的主要窗口。
macOS: 在终端输入 git --version，如果未安装，系统会提示你进行安装。

## 1.2 配置“名片”
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

Git 需要知道每次提交是谁做的。打开 Git Bash（或终端），输入以下命令：

* 配置全局用户名
git config --global user.name "你的名字"


* 配置全局邮箱
git config --global user.email "你的邮箱@example.com"

* 确认配置
git config --list
</div>

# 二、 开启项目：初始化与克隆

你有两种方式开始一个 Git 项目。

## 2.1 方式 A：本地新建项目 (git init)

如果你本地已经有一个文件夹，想让 Git 开始管理它：

进入该文件夹。

右键选择 Git Bash Here。

输入：git init。
此时文件夹内会出现一个隐藏的 .git 文件夹，这代表仓库已建立。

## 2.2 方式 B：从云端拉取 (git clone)

如果你想参与别人的项目，或者把 GitHub/GitLab 上的代码拉下来：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git clone <仓库的URL地址>
</div>

# 三、 核心工作流：存入“时光机”

Git 的工作逻辑分为三个区域：工作区 (Working Directory) -> 暂存区 (Staging Area) -> 版本库 (Git Directory)。

## 第一步：查看现状

在任何操作前后，都建议养成输入 git status 的习惯，查看哪些文件被修改了，哪些还没被追踪。

## 第二步：添加至暂存区

就像打包行李一样，你先把想提交的文件放入“包裹”：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git add <文件名>   # 添加单个文件

git add .         # 添加当前目录下所有修改
</div>

## 第三步：正式提交

将“包裹”封箱并贴上标签：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git commit -m "描述你这次做了什么（例如：修复了登录页的Bug）"
</div>

# 四、 分支管理：并行开发

分支是 Git 的灵魂。它允许你在不干扰主代码（master/main）的情况下，开启一个“平行世界”开发新功能。

## 4.1 创建与切换

### 创建并切换到一个名为 dev 的新分支
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git checkout -b dev
</div>

### 或者使用新版命令
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git switch -c dev
</div>

## 4.2 合并分支

当你在 dev 分支写好了功能，想把它合并回主分支时：

先切回主分支：git checkout master

合并 dev：git merge dev

# 五、 远程协作：同步到云端

当你需要和队友合作，或者备份到 GitHub 时：

关联远程仓库（仅需做一次）：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git remote add origin <仓库URL>
</div>

推送代码：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git push -u origin master
</div>

当队友更新了代码，你需要拉取最新代码同步到本地：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git pull origin master
</div>

# 六、 常用避坑与“后悔药”

## 6.1 代码写乱了，想回到上次提交的状态
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git restore <文件名>
</div>

## 6.2 刚提交完发现有个错别字，想改掉又不产生新提交
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git commit --amend
</div>

## 6.3 临时要去修 Bug，但现在的代码还没写完

你可以把当前的进度“存入保险箱”：
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git stash        # 存起来
git stash pop    # 忙完回来，取出来继续写
</div>

# 七、 总结：每日必用口诀
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">
git pull (上班第一件事，同步他人进展)

编写代码...

git status (看一眼改了啥)

git add . (打包)

git commit -m "..." (写备注)

git push (下班前发给云端)
</div>