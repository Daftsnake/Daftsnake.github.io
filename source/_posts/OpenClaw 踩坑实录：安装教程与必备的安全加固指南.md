
---

title: OpenClaw 踩坑实录：安装教程与必备的安全加固指南

date: 2026-03-05 02:19:00

tags: [教程, Openclaw, AI]

categories: [科技学习文章]

---


最近在折腾 **OpenClaw**，这是一个本地优先的个人 AI 助手。它可以接入 WhatsApp、Telegram、Discord 等社交平台，让大模型在后台帮忙处理消息甚至执行本地脚本。

功能确实很强大，但由于它需要较高的系统操作权限，安全隐患不容忽视。今年初，OpenClaw 曝出过严重的漏洞（如 ClawJacked）。如果按默认配置直接运行，一旦误点恶意链接，本地环境极易被接管。

这篇文章记录了我的安装流程，以及如何进行必要的安全隔离与加固，希望能帮准备使用这款工具的朋友少走弯路。



{% note info %}

**阅读提示**：本文涉及一些基础的终端命令操作。如果你对命令行不太熟悉，可以直接复制下方代码框中的命令执行。

{% endnote %}

## **1\. 基础安装流程**

{% note danger %}

**安全预警**：近期搜索引擎和某些第三方社区中出现了带有恶意程序的 OpenClaw 伪造包。请务必使用官方的 npm 命令进行安装，不要下载来路不明的“一键安装包”。

{% endnote %}

### **准备 Node.js 环境**

OpenClaw 依赖 Node.js 环境。

* **Mac 用户**：直接打开自带的“终端”。  
* **Windows 用户**：建议使用 WSL。在 PowerShell (管理员) 中运行 wsl \--install ，重启后打开 Ubuntu 终端。

在终端中依次执行以下命令来安装 Node.js 22：

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

\# 下载并安装 nvm 环境管理器 (如果网络不通请开启代理)  
curl \-o- \[https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh\](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh) | bash

\# 重新加载配置  
source \~/.bashrc 2\>/dev/null || source \~/.zshrc 2\>/dev/null

\# 安装 Node.js 22  
nvm install 22

\# 验证安装结果（输出 v22.x.x 即表示成功）  
node \-v

</div>

### **安装 OpenClaw**

环境就绪后，通过 npm 全局安装最新版本：

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

npm install \-g openclaw@latest

</div>

运行初始化向导，按提示完成模型等基础设置：

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

openclaw onboard \--install-daemon

</div>

*(加上 \--install-daemon 参数会将其注册为后台服务，开机会自动启动。)*

可以通过发送一条简单的测试消息来验证是否安装成功：

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

openclaw agent \--message "你好，请用一句话介绍你自己。"

</div>

## **2\. 核心：安全加固**

默认配置下，OpenClaw 拥有过高的操作权限。我们必须对其进行限制和隔离。

### **创建独立的受限用户**

不要使用平时的主力账号或 Root 权限直接运行它。建议为它创建一个专用的、权限受限的系统账户。

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

\# 创建名为 openclaw\_agent 的受限账户  
sudo useradd \-m \-s /bin/bash openclaw\_agent

\# 切换到该账户  
sudo su \- openclaw\_agent

</div>

*(注意：后续所有关于 OpenClaw 的配置修改，都需要先切换到这个账户下进行。)*

### **环境变量管理 API 密钥**

绝对不要将 OpenAI 或 Anthropic 的 API Key 明文写在配置文件里，否则极易因为越权读取漏洞导致 Token 被盗刷。将它们写入环境变量是更安全的做法：

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

\# 将密钥写入配置文件（请替换为你自己的真实密钥）  
echo 'export OPENAI\_API\_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"' \>\> \~/.bashrc  
echo 'export OPENAI\_API\_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"' \>\> \~/.zshrc

\# 刷新配置生效  
source \~/.bashrc 2\>/dev/null || source \~/.zshrc 2\>/dev/null

</div>

## **3\. 配置文件与渠道接入**

OpenClaw 的核心行为由<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;"> \~/.openclaw/openclaw.json </div>文件控制。接下来我们需要修改这个文件，关闭不必要的网络暴露，并设置通讯软件的接入规则。

使用 nano 编辑器打开文件：

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

nano \~/.openclaw/openclaw.json

</div>

为避免 JSON 格式错误（比如漏写逗号），你可以先清空原文件内容，直接复制以下我整理好的安全配置模板，然后将里面的 ID 和 Token 替换成你自己的。

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">

```javascript

{
  // json5 ==========================================
  // 1. 网关与安全设置
  // ==========================================
  gateway: {
    bind: "loopback", // 强制仅本地访问，勿改
    auth: {
      mode: "password", // 开启密码保护
      allowTailscale: false
    }
  },

  // ==========================================
  // 2. 隔离沙箱设置
  // ==========================================
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main" // 强制在 Docker 沙箱中运行
      }
    }
  },

  // ==========================================
  // 3. 通讯渠道接入 (按需修改或保留)
  // ==========================================
  channels: {
    
    // ---- Telegram ----
    telegram: {
      botToken: "替换为_BotFather_获取的_Token", 
      dmPolicy: "pairing", // 开启配令人模式，防止陌生人调用
      allowFrom: ["替换为你的纯数字ID"], // (可通过 @userinfobot 获取)
      streaming: "partial" 
    },

    // ---- Discord ----
    discord: {
      token: "替换为_Discord_Bot_Token",
      dmPolicy: "pairing",
      allowFrom: ["替换为你的用户数字ID"] // (在开发者模式下右键头像获取)
    },

    // ---- WhatsApp ----
    whatsapp: {
      allowFrom: ["+8613800138000"], // 替换为你带区号的手机号
      groupPolicy: "allowlist", 
      groups: {
        "1234567890-123456@g.us": { requireMention: true } 
      }
    }
  }
}

```

</div>

修改完成后，按  Ctrl+O ，回车保存，然后按 Ctrl+X 退出编辑器。

{% note warning %}

**必须重启服务**

配置文件的修改不会实时生效，编辑完成后需要在终端执行以下命令重启网关：


openclaw gateway \--port 18789


{% endnote %}

## **写在最后**

以上就是 OpenClaw 的基本配置和安全加固流程。

让 AI 深入参与到本地系统和社交软件中确实能带来极大的便利，但涉及本地执行权限时，安全隔离永远是第一位的。希望这份记录能对你有所帮助。