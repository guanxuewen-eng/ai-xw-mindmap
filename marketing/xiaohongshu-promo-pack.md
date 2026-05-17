# 新网脑图 AI Skill 小红书宣传材料

这份材料按“小红书直接可发”的方式写。语气尽量真实、克制，让用户知道这是能下载、能安装、能验证的东西，不是概念图。

## 核心定位

一句话：

```text
我给新网脑图做了一个 AI 智能体技能包，让 Codex、Claude Code、Hermes、OpenClaw 可以直接连接脑图，帮你创建、读取、提交修改提案。
```

更短版本：

```text
让 AI 真正接入你的脑图，而不是只在聊天框里给建议。
```

安全感版本：

```text
默认是“AI 先提案，你再确认”，不会静默乱改你的脑图。
```

## 小红书封面标题

可以挑一个做封面大字：

1. `我把 AI 接进了脑图`
2. `新网脑图 AI Skill 开放下载`
3. `让 Codex 直接帮你做脑图`
4. `AI 不只聊天，也能整理脑图`
5. `脑图 + AI Agent，我做了一个可下载版本`
6. `给本地智能体装一个脑图技能`
7. `AI 先提案，你确认后再改脑图`
8. `这个 Skill，让 AI 看得懂你的脑图`

封面小字：

```text
支持 Codex / Claude Code / Hermes / OpenClaw
```

```text
GitHub 已开放，默认提案优先，安全可控
```

## 第一篇：发布官宣

标题：

```text
我把新网脑图的 AI Skill 开放下载了
```

正文：

```text
这几天我把新网脑图的 AI 智能体能力整理成了一个可以下载的 Skill 包。

现在它可以给 Codex、Claude Code、Hermes、OpenClaw 这类本地智能体用。

它能做的事情比较直接：

- 创建或打开脑图
- 读取当前脑图内容
- 提交 AI 修改提案
- 监听 AI 提案事件

我没有做成“AI 静默直接乱改”的模式。

现在默认是：AI 先生成结构化提案，你在网页里确认后再应用。

这样更适合真实项目，也更安全。

仓库里只放公开 Skill、SDK 和安装说明，不包含我的本机 token、服务器密码、私人脑图数据。

如果你也在用 Codex 或 Claude Code，可以下载试试：

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap

后续我会继续补两块：

1. 前端普通编辑保存时生成更细的事件
2. direct command 能力，但会先做好权限确认和审计

我想做的不是一个“AI 生成脑图图片”的工具，而是让 AI 真的接入脑图工作流。
```

标签：

```text
#AI工具 #脑图 #思维导图 #Codex #ClaudeCode #程序员工具 #效率工具 #GitHub开源 #AI智能体 #新网脑图
```

## 第二篇：面向程序员

标题：

```text
给 Codex 装了一个脑图技能，能直接读写项目结构
```

正文：

```text
我最近在做一个实验：让本地 AI 智能体真正接入脑图，而不是只在聊天框里输出一段 Markdown。

现在做出了第一版：

新网脑图 xw-mindmap Agent Skill。

安装后，你可以直接对 Codex 说：

“使用 xw-mindmap 技能，创建一个项目架构脑图。”

或者：

“打开当前脑图，帮我提交一组结构优化提案。”

它背后不是截图识别，也不是复制粘贴。

它走的是 Skill API：

- discover：发现服务能力
- open：打开或创建脑图
- get：读取当前文档
- propose：提交 AI 修改提案
- watch：监听提案事件

我现在没有默认开放 direct command。

原因很简单：直接改用户数据这件事，必须先有权限确认、审计、版本校验和回滚策略。

所以第一版先做成提案优先。

AI 可以很积极，但最终修改权还在用户手里。

仓库已经放到 GitHub：

github.com/guanxuewen-eng/ai-xw-mindmap

支持 Codex、Claude Code、Hermes、OpenClaw 的本地技能目录。
```

标签：

```text
#Codex #ClaudeCode #AI编程 #Agent #AI智能体 #开源项目 #程序员日常 #效率工具 #思维导图 #脑图
```

## 第三篇：面向效率用户

标题：

```text
我想让 AI 帮我整理脑图，不只是生成一段文字
```

正文：

```text
很多 AI 工具都能生成大纲。

但我真正想要的是：

AI 能打开我的脑图，读懂现在的结构，然后给我一个可以确认的修改方案。

所以我给新网脑图做了一个 AI Skill。

目前它可以：

- 创建脑图
- 打开已有脑图
- 读取当前节点结构
- 生成修改提案
- 等我确认后再应用

我比较在意的一点是安全感。

所以这个版本不是让 AI 在后台偷偷改，而是让 AI 先提交提案。

你可以看它要改什么，再决定要不要接受。

适合这些场景：

- 整理项目架构
- 梳理产品功能
- 拆解学习计划
- 重构会议纪要
- 把一堆想法变成层级结构

如果你本来就在用 Codex、Claude Code 这类本地智能体，可以试试这个技能包。

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap
```

标签：

```text
#效率工具 #AI工具 #思维导图 #脑图工具 #学习方法 #项目管理 #产品经理 #知识管理 #AI智能体
```

## 第四篇：技术拆解

标题：

```text
我为什么没让 AI 直接改脑图？
```

正文：

```text
新网脑图 AI Skill 第一版已经能用了，但我没有把它做成“AI 直接静默修改脑图”。

不是不能做，而是不应该一上来就这样做。

因为脑图是用户的数据结构。

如果 AI 能直接改，就必须同时解决这些问题：

- 谁授权了这次操作？
- 改的是哪一个版本？
- 如果用户同时在前端编辑怎么办？
- 操作失败怎么恢复？
- 用户怎么知道 AI 改了什么？
- 误删节点怎么回滚？

所以我现在做的是 proposal-first。

AI 先提交结构化提案：

- 要创建哪些节点
- 要移动哪些节点
- 为什么这么改
- 基于哪个 revision

然后用户在网页里确认。

这个方式慢一点，但更适合真实项目。

后续 direct command 我也会做，但前提是权限确认、审计日志、幂等、版本校验和回滚策略都补齐。

我希望这个项目不是 Demo，而是真的能长期用。

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap
```

标签：

```text
#AI安全 #Agent #AI智能体 #产品设计 #程序员 #开源项目 #思维导图 #Codex #ClaudeCode
```

## 评论区置顶文案

```text
仓库地址：github.com/guanxuewen-eng/ai-xw-mindmap

安装后记得重启 Codex / Claude Code，让它重新扫描技能列表。

本机 token 保存在 ~/.config/mind-workspace/device.json，不会被仓库打包，也不要发给别人。
```

## 私信回复模板

别人问“怎么下载”：

```text
GitHub 搜 ai-xw-mindmap，或者直接打开：
github.com/guanxuewen-eng/ai-xw-mindmap

如果你用 Codex，clone 后执行：
./agent-skills/install-xw-mindmap.sh codex

装完重启 Codex 就行。
```

别人问“安全吗”：

```text
默认是提案模式，AI 不会静默乱改脑图。

本机授权文件在 ~/.config/mind-workspace/device.json，不会上传到 GitHub，也不要手动发给别人。
```

别人问“支持 Claude Code 吗”：

```text
支持本地 skills 目录安装。

可以执行：
./agent-skills/install-xw-mindmap.sh claude-code

装完重启 Claude Code，让它重新扫描技能。
```

别人问“是不是开源”：

```text
这个 Skill 分发包和 SDK 已经放 GitHub 了。

现在主要是 Skill、安装脚本、Node SDK 和说明文档。

脑图服务端能力还在继续补 direct command 和更细的事件流。
```

## 图片建议

建议做 6 张图：

1. 封面：`我把 AI 接进了脑图`
2. 问题：`以前 AI 只能给大纲，不能真正操作脑图`
3. 方案：`xw-mindmap Agent Skill`
4. 能力：`打开 / 读取 / 提案 / 监听`
5. 安全：`AI 先提案，你确认后再改`
6. 下载：`GitHub: guanxuewen-eng/ai-xw-mindmap`

视觉风格建议：

- 不要做得太像广告。
- 用真实界面截图加少量标注。
- 颜色用蓝白灰，突出“工具感”和“可信”。
- 每张图只讲一个点。

## 发布节奏

建议先发 4 篇，不要一天全发：

1. 第 1 天：发布官宣，说明是什么。
2. 第 3 天：面向程序员，讲 Codex / Claude Code 怎么用。
3. 第 5 天：面向效率用户，讲场景。
4. 第 7 天：技术拆解，讲为什么提案优先。

中间根据评论再补：

- 安装教程
- 实际创建脑图案例
- 和普通 AI 生成大纲的区别
- direct command 后续计划

