---

title: Python 开发者必读：Docker 零基础入门实战指南(Windows版)

date: 2026-02-05 02:09:00

tags: [Python, 开发环境, Windows, Docker,避坑指南,教程]

categories: [科技学习文章]

---

作为一名 Python 开发者（尤其是对运维和 AI 感兴趣的），你是否遇到过这些问题：

* “在我的电脑上能跑，在服务器上就报错？”  
* 安装各种库把电脑环境搞得乱七八糟？  
* 想学习 Linux 环境，但不想重装系统或搞复杂的虚拟机？

**Docker** 就是为了解决这些问题而生的。它就像一个\*\*“轻量级沙盒”\*\*，能把你的代码和运行环境打包在一起，用完即焚，不留垃圾。

本文记录了在 **Windows 系统** 下配合 **VS Code** 从零配置 Docker 的全过程。

\<\!-- more \--\>

## **🛠️ 第一部分：开发环境准备 (IDE 与 终端)**

在开始 Docker 之前，我们需要把“武器”准备好。

### **1\. IDE 选择与配置**

我们强烈推荐使用 **VS Code**，它是目前对 Docker 支持最好的轻量级编辑器。

* **Visual Studio Code (VS Code)**  
  * **推荐插件**：在左侧插件市场搜索并安装 Docker (Microsoft 出品)。  
  * **作用**：它能让 Dockerfile 高亮显示（变色），不再是黑白文本，还能自动联想命令，极大地降低手写错误的概率。  
  * **终端快捷键**：Ctrl \+ \~ (波浪号键) 可快速打开/关闭底部终端。  
* *(可选) PyCharm 专业版*  
  * 如果你使用 PyCharm，Docker 插件是内置的，但社区版（免费版）对 Docker 支持有限，需要手动配置更多内容。建议新手先用 VS Code 入门。

### **2\. 终端 (Terminal) 的选择：到底该用哪个黑窗口？**

Windows 下有很多种终端，新手容易晕。**做 Docker 开发时，请遵循以下优先级**：

* **🥇 PowerShell (推荐)**：功能最全，权限管理方便。VS Code 默认终端通常就是这个。  
* **🥈 WSL (Ubuntu/Debian)**：如果你已经精通 Linux，可以直接在 WSL 里操作，体验最原生。  
* **🥉 CMD (命令提示符)**：老旧，不支持某些新命令，**不推荐**。  
* **❌ Git Bash**：在 Docker 交互模式下（-it）有时会出现按键不灵的问题，**慎用**。

## **🏗️ 第二部分：Docker 安装与设置**

### **1\. 下载与安装**

* **官方下载地址**：[Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)  
* **安装关键点**：  
  * 安装向导中务必勾选 **"Use WSL 2 instead of Hyper-V"**（这是性能的关键）。  
  * **BIOS 设置**：如果安装后报错，请检查电脑 BIOS 中是否开启了“虚拟化技术” (Virtualization/VT-x/AMD-V)。

### **2\. 启动与验证**

* 安装完成后启动 Docker Desktop，点击 **"Accept"**。  
* 等待左下角鲸鱼图标变为 **绿色 (Engine Running)**。  
* **验证命令**：  
  在 VS Code 终端 (PowerShell) 输入：  
  docker \--version  
  \# 输出示例：Docker version 29.x.x, build ... 表示成功

## **📦 第三部分：实战——打包 Python 脚本**

假设我们有一个监控服务器的脚本 monitor.py，我们需要将它打包进容器。

### **Step 1: 编写 Dockerfile (避坑重点！)**

在项目根目录下（与 .py 文件同级），创建一个名为 Dockerfile 的文件。

**🛑 Windows 新手必看：文件后缀名陷阱**

Windows 默认会隐藏文件后缀名。你以为你创建了 Dockerfile，其实系统偷偷把它叫成了 Dockerfile.txt。

**检查方法**：在文件夹里点击“查看” \-\> 勾选“文件扩展名”。**确保这个文件没有任何 .txt 或 .py 后缀！**

**文件内容：**

\# 1\. 基础镜像：使用官方精简版 Python 3.11 (Linux环境)  
FROM python:3.11-slim

\# 2\. 工作目录：容器内部的“家”  
WORKDIR /app

\# 3\. 复制文件：把当前 Windows 文件夹的所有内容放入容器的 /app  
COPY . /app

\# 4\. 安装依赖：使用阿里云镜像源加速，避免卡顿  
RUN pip install psutil \-i \[https://mirrors.aliyun.com/pypi/simple/\](https://mirrors.aliyun.com/pypi/simple/)

\# 5\. 启动命令：容器启动时执行的指令  
CMD \["python", "monitor.py"\]

### **Step 2: 构建镜像 (Build)**

将“配方”变成“光盘”（镜像）。在终端运行：

\# 注意最后那个点 (.) 不能漏，代表“当前目录”  
docker build \-t my-monitor .

* \-t my-monitor: 给镜像起个名字。  
* **多系统提示**：如果你是在 Mac (M1/M2) 芯片上构建，想给 Linux 服务器用，需要加 \--platform linux/amd64 参数。Windows 用户通常不需要。

### **Step 3: 运行容器 (Run)**

启动沙盒运行程序：

docker run \-it \--rm my-monitor

* \-it: 交互模式（能看到输出，能按 Ctrl+C）。  
* \--rm: **用完即删**（停止运行后自动删除容器，不占硬盘）。

## **🌍 第四部分：进阶——如何在其他电脑上一键运行？**

这是 Docker 最强大的地方。你不再需要教别人“先装 Python，再 pip install...”，只需要给他一个镜像。

### **方法一：使用 Docker Hub（推荐，类似 GitHub）**

只要你有 Docker Hub 账号，就可以把镜像推送到云端。

1. **注册与登录**：在终端输入 docker login 登录你的账号。  
2. **打标签 (Tag)**：  
   \# 格式：docker tag \[本地镜像名\] \[你的用户名\]/\[仓库名\]:\[版本\]  
   docker tag my-monitor milen/server-monitor:v1

3. **上传 (Push)**：  
   docker push milen/server-monitor:v1

4. **在任意电脑上运行（一键还原）**：  
   无论对方是 Windows、Mac 还是 Linux，只要装了 Docker，只需输入这一行命令，Docker 会自动下载并运行，环境与你完全一致：  
   docker run \-it \--rm milen/server-monitor:v1

### **方法二：离线文件传输（无需网络）**

如果是在没有外网的服务器上，可以把镜像保存为文件。

1. **导出**：docker save \-o my\_monitor.tar my-monitor  
2. **传输**：把生成的 my\_monitor.tar 文件用 U 盘或 scp 传给对方。  
3. **导入**：docker load \-i my\_monitor.tar

## **🧹 第五部分：日常管理与清理（如何删除容器）**

在使用过程中，如果不加 \--rm 参数，停止的容器会一直占用空间。我们需要定期清理。

### **1\. 常用清理命令**

* **查看正在运行**：docker ps  
* **查看所有(含已停止)**：docker ps \-a  
* **停止容器**：docker stop \[容器ID前4位\]  
* **删除容器**：docker rm \[容器ID前4位\] (注意：运行中的容器不能删，必须先 stop)  
* **删除镜像**：docker rmi \[镜像名\]

### **2\. 核弹级清理：一键释放空间 (慎用！)**

如果你发现 Docker 占用了几十 GB 空间，想把所有**没在使用**的容器、镜像、缓存全部清空：

docker system prune

* 它会提示你确认，输入 y 即可。

## **⚠️ 第六部分：新手避坑指南 (常见错误与解决方案)**

### **1\. PowerShell 脚本无法运行 (Activate.ps1 报错)**

* **现象**：VS Code 打开终端时提示红色报错“在此系统上禁止运行脚本”。  
* **解决**：在 PowerShell 中执行以下命令（只需做一次）：  
  Set-ExecutionPolicy \-ExecutionPolicy RemoteSigned \-Scope CurrentUser

### **2\. 构建报错 "Dockerfile cannot be empty"**

* **原因**：VS Code 中修改了 Dockerfile 但**忘记保存**（标签栏有小白点）。  
* **解决**：养成随手按 Ctrl \+ S 的好习惯。

### **3\. 环境隔离的“假象”**

* **现象**：Python 脚本在 Docker 里读取到的磁盘空间、CPU 占用与 Windows 本地不一致。  
* **原因**：**这是正常的！** Docker 容器看不到宿主机的 C 盘，只能看到容器内的虚拟文件系统。

## **📝 附录：Docker 常用命令速查表 (Cheat Sheet)**

| 场景 | 命令 | 说明 |
| :---- | :---- | :---- |
| **构建与启动** | docker build \-t \<名字\> . | 根据当前目录 Dockerfile 构建镜像 |
|  | docker run \-it \--rm \<名字\> | 运行容器，用完自动删除 (推荐测试用) |
|  | docker run \-d \<名字\> | 后台静默运行 (推荐服务器部署用) |
| **查看状态** | docker ps | 查看正在运行的容器 |
|  | docker ps \-a | 查看所有容器 (含已停止) |
|  | docker images | 查看本地所有镜像 |
| **调试与排错** | docker logs \<容器ID\> | **最重要！** 查看程序打印的报错日志 |
|  | docker exec \-it \<容器ID\> bash | **进入容器内部** (像远程连接一样操作) |
| **清理** | docker stop \<容器ID\> | 停止容器 |
|  | docker rm \<容器ID\> | 删除容器 |
|  | docker rmi \<镜像名\> | 删除镜像 |

