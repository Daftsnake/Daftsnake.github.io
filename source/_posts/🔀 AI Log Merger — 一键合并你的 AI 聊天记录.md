---
title: 🔀 AI Log Merger — 一键合并你的 AI 聊天记录
date: 2026-02-10 23:30:00
tags: [AI, 工具,生活]
categories: [科技学习文章]
---

---

> 你用过 ChatGPT 和 Gemini 对话后，是否也面临过聊天记录散落在各种文件里的尴尬？  
> 一个 Markdown，一个 Word 文档，又一个纯文本……  
> **AI Log Merger** 就是为了解决这个痛点而诞生的。

---

## 🤔 为什么做这个工具？

在 AI 时代，我们与不同模型进行对话已经成为日常：今天用 **ChatGPT** 头脑风暴，明天用 **Gemini** 做代码审查，有时还从网页端导出聊天记录做归档。

问题随之而来 ——

- ChatGPT 导出的是 `.md`（Markdown）
- 手动复制粘贴的对话存成了 `.txt`
- 有些日志被整理到了 `.docx`（Word）

当你想把这些散落的碎片 **拼成一份完整的对话归档** 时，手动操作既耗时又容易出错。

于是我写了 **AI Log Merger**：一个轻量级 Python 命令行 + GUI 工具，专注于「读取 → 合并 → 转换」AI 聊天记录。

---

## ✨ 核心功能一览

| 功能 | 说明 |
|------|------|
| 🔄 **多格式读取** | 支持 `.md`、`.txt`、`.docx` 三种输入格式 |
| 📦 **多格式输出** | 合并后可导出为 Markdown、纯文本或 Word 文档 |
| 🧩 **自定义分隔符** | 在合并的文件之间插入分隔符，支持 `{filename}` 占位符 |
| 📂 **自动模式** | 把文件丢到 `input/` 文件夹，运行一行命令即完成 |
| 🖥️ **图形界面 (GUI)** | 提供基于 Tkinter 的暗色主题 GUI，零命令行经验也能用 |
| ⚠️ **友好错误提示** | 文件不存在？格式不支持？都有清晰的 emoji 提示 |

---

## 🏗️ 项目架构

项目遵循 Python 的模块化最佳实践，代码结构清晰：

```
AI_Log_Merger/
├── main.py              # 根目录入口，委托给 src.main
├── requirements.txt     # 唯一外部依赖：python-docx
├── input/               # 放置待合并的聊天记录
├── output/              # 合并后的文件自动保存到这里
└── src/
    ├── __init__.py
    ├── config.py         # 全局配置常量
    ├── main.py           # CLI + GUI 双模式主入口
    ├── gui.py            # Tkinter 图形界面
    ├── modules/
    │   └── merger.py     # 核心合并逻辑
    └── utils/
        ├── file_io.py    # 文件读写工具（.md/.txt/.docx）
        └── logger.py     # 统一日志配置
```

### 设计亮点

1. **单一职责、层次分明**  
   - `config.py` 只管全局常量  
   - `merger.py` 只负责合并逻辑  
   - `file_io.py` 只处理读写  
   - 各模块之间通过清晰的接口通信

2. **CLI 与 GUI 双模式共存**  
   通过 `argparse` 解析参数：无 `--gui` 标志时走命令行逻辑，带标志时启动 Tkinter 界面。两种模式**复用相同的合并引擎**，避免了代码重复。

3. **极简依赖**  
   唯一的第三方依赖是 `python-docx`（用来读写 Word 文件），其余功能全部使用 Python 标准库完成，包括 `pathlib`、`argparse`、`logging`、`tkinter` 等。

---

## 🚀 使用方法

### 安装

```bash
pip install -r requirements.txt
```

### 方式一：最简单 — 自动模式

把聊天日志文件放入 `input/` 文件夹，然后一行命令搞定：

```bash
python main.py
```

程序自动检测 `input/` 中所有支持的文件，按文件名排序后合并，输出到 `output/merged_output.md`。

### 方式二：指定输出格式

```bash
# 输出为 Word 文档
python main.py -o merged.docx

# 输出为纯文本
python main.py -o merged.txt
```

### 方式三：手动指定文件

```bash
python main.py -f chat_gpt.md gemini_log.txt -o output/result.docx
```

### 方式四：图形界面

```bash
python main.py --gui
```

GUI 使用了 **Catppuccin** 风格的暗色配色方案，操作起来非常直观：

1. 点击 **➕ 添加文件** 选择要合并的聊天记录
2. 输入输出文件名，选择目标格式（`.md` / `.txt` / `.docx`）
3. 点击 **🔀 合并 & 导出** 即可

---

## 🔍 技术实现细节

### 文件读写层 (`file_io.py`)

这是整个项目的 I/O 基础设施，核心思路是 **统一接口、按格式分发**：

```python
def read_file(path: str | Path) -> str:
    """根据扩展名自动选择读取策略"""
    ext = path.suffix.lower()
    if ext in {".md", ".txt"}:
        return path.read_text(encoding="utf-8")
    if ext == ".docx":
        doc = Document(str(path))
        return "\n".join(para.text for para in doc.paragraphs)
```

写入时同理——`.md` 和 `.txt` 直接写文本，`.docx` 则通过 `python-docx` 生成带样式的 Word 文档（使用微软雅黑字体、11pt 字号，分隔符行居中加粗）。

### 合并引擎 (`merger.py`)

合并逻辑非常简洁——先读取所有文件内容，再用分隔符拼接：

```python
def merge_files(file_paths, separator="\\n\\n--- {filename} ---\\n\\n"):
    merged_parts = [read_file(fp) for fp in file_paths]
    
    result = []
    for idx, (fp, text) in enumerate(zip(file_paths, merged_parts)):
        if idx > 0:
            result.append(separator.format(filename=Path(fp).name))
        result.append(text)
    return "".join(result)
```

`{filename}` 占位符让分隔符可以自动包含源文件名，方便在合并后的文档中定位每段对话的来源。

### 错误处理

工具定义了自定义异常 `UnsupportedFormatError`，并在 CLI 和 GUI 中统一捕获：

- `FileNotFoundError` → `❌ 文件错误: 文件不存在: xxx.md`
- `UnsupportedFormatError` → `❌ 格式错误: 不支持的文件格式 '.pdf'`
- 未知错误 → 写入日志并给出通用提示

---

## 💡 小结与思考

这个项目虽然体量不大，但我在开发过程中刻意遵循了几个原则：

1. **Pythonic 风格** — `pathlib` 替代 `os.path`，类型注解增强可读性，`__future__.annotations` 保证向前兼容。
2. **够用就好** — 没有引入多余的框架或工具链，`python-docx` 是唯一的外部依赖。
3. **双模式无缝切换** — 同一套核心代码同时服务于 CLI 用户和 GUI 用户。
4. **用户体验优先** — emoji 提示、自动创建文件夹、默认从 `input/` 文件夹读取……都是为了降低使用门槛。

如果你也在日常工作中需要归档和整理 AI 对话记录，不妨试试 **AI Log Merger**。

---

## 📎 链接

- **GitHub 仓库**：[AI_Log_Merger](https://github.com/Daftsnake/AI_Log_Merger)
- **依赖**：[python-docx](https://python-docx.readthedocs.io/)

---
