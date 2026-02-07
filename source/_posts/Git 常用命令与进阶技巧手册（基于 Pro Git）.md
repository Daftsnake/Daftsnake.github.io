---

title: Git 常用命令与进阶技巧手册（基于 Pro Git）

date: 2026-02-08 01:19:00

tags: [开发环境, Windows, Git,避坑指南,教程]

categories: [科技学习文章]

---


这份指南参考了 Git 官方权威教材 Pro Git，旨在为你提供一个高效的日常开发备忘录。

# 一、 基础工作流：从初始化到提交

Git 的核心在于“暂存区”（Staging Area）的概念。

1.1 初始化与配置

初始化仓库：git init

克隆远程仓库：git clone <url>

配置用户信息：
  
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"


查看配置列表：git config --list

1.2 记录更新

检查当前状态：git status（建议常用，了解哪些文件在暂存区）

追踪/暂存文件：

暂存单个文件：git add <file>

暂存所有变化：git add .

提交更新：

标准提交：git commit -m "提交说明"

跳过暂存区直接提交（仅限已追踪文件）：git commit -a -m "快速提交"

查看差异：

查看尚未暂存的修改：git diff

查看已暂存待提交的修改：git diff --cached

# 二、 分支管理：Git 的灵魂

分支是 Git 最强大的特性，切换分支几乎是瞬间完成的。

2.1 分支操作

查看分支：git branch（加 -v 查看最后一次提交）

创建分支：git branch <branch-name>

切换分支：git checkout <branch-name> 或新版命令 git switch <branch-name>

创建并切换：git checkout -b <branch-name> 或 git switch -c <branch-name>

删除分支：git branch -d <branch-name>

2.2 合并与变基

合并分支（将某分支合并进当前分支）：git merge <branch-name>

变基（整理提交历史）：git rebase <master>

注意：不要对已经推送到公共仓库的提交进行变基。

# 三、 远程仓库：协作开发

3.1 远程交互

查看远程仓库：git remote -v

拉取更新但不合并：git fetch <remote>

拉取并自动合并：git pull（本质是 fetch + merge）

推送到远程：git push <remote> <branch>

查看远程分支详情：git remote show origin

# 四、 撤消与回滚：后悔药

Git 几乎所有的操作都是可逆的。

修补最近一次提交：git commit --amend（可以修改说明或补报文件）

取消暂存文件：git reset HEAD <file> 或 git restore --staged <file>

撤消对文件的修改（恢复成上次提交状态）：git checkout -- <file> 或 git restore <file>

强制回退版本：

回退到上一个版本（保留修改在工作区）：git reset --soft HEAD~1

彻底回退（丢弃所有本地修改）：git reset --hard <commit-id>

# 五、 进阶技巧与常用命令

5.1 储藏 (Stashing)

当你正在开发 A 功能，突然需要切换到 B 分支修复 Bug，但 A 功能还没写完不想提交时：

储藏当前修改：git stash

查看储藏列表：git stash list

应用最近的储藏并删除记录：git stash pop

仅应用不删除：git stash apply

5.2 历史查询

简洁日志：git log --oneline --graph --all（以图形化单行显示所有分支历史）

查看某个文件的历史修改：git log -p <file>

查看谁在什么时候修改了哪一行：git blame <file>

5.3 别名 (Aliases) — 提升效率的神器

你可以为冗长的命令设置缩写：

git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
甚至可以设置复杂的逻辑
git config --global alias.last 'log -1 HEAD'


5.4 找回丢失的提交 (Reflog)

如果你不小心 reset --hard 丢弃了代码，或者误删了分支：

查看操作记录：git reflog

找到对应的 commit-id 后，通过 git checkout <id> 即可找回。

# 六、 最佳实践建议

频繁提交，早点推送：小步快跑，降低冲突风险。

写好 Commit Message：推荐使用 feat:, fix:, docs: 等前缀，让历史清晰可读。

善用分支：任何新功能或 Bug 修复都应该开启新分支。

不要提交大二进制文件：如视频、大型模型文件，应使用 Git LFS。

更多详细内容请参考：Git Book 官网