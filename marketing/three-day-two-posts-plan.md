# 小红书三天投放计划：每天两条

主题：新网脑图 xw-mindmap AI Skill 开放下载。  
目标：让用户知道这不是概念演示，而是可以下载、可以安装、可以验证的本地智能体技能包。

## 发布总原则

- 语气真实，不做夸张承诺。
- 每条只讲一个核心点。
- 强调安全边界：AI 默认先提案，用户确认后再应用。
- 每条都带 GitHub 地址：`github.com/guanxuewen-eng/ai-xw-mindmap`。
- 评论区置顶安装提醒和 token 安全提醒。

## Day 1 上午：发布官宣

定位：告诉大家“我做了什么，现在能下载了”。

标题：

```text
我把新网脑图的 AI Skill 开放下载了
```

封面：

```text
我把 AI 接进了脑图
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
```

配图：

- 竖版封面：`marketing/assets/covers/day1-am-launch-cover.svg`
- PPT 图：`marketing/assets/ppt-images/day1-am-launch-slide.svg`

标签：

```text
#AI工具 #脑图 #思维导图 #Codex #ClaudeCode #程序员工具 #效率工具 #GitHub开源 #AI智能体 #新网脑图
```

## Day 1 下午：安装教程

定位：降低下载门槛，告诉用户 3 步能跑起来。

标题：

```text
新网脑图 AI Skill 怎么安装？3 步就够
```

封面：

```text
3 步装好脑图 Skill
```

正文：

```text
很多人问新网脑图 AI Skill 怎么装。

如果你用 Codex，可以这样：

第一步，clone 仓库：

git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git

第二步，进入目录执行安装：

cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex

第三步，重启 Codex，让它重新扫描技能列表。

然后可以运行：

node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover

如果能看到服务能力，说明已经连通。

Claude Code、Hermes、OpenClaw 也有对应安装参数：

./agent-skills/install-xw-mindmap.sh claude-code
./agent-skills/install-xw-mindmap.sh hermes
./agent-skills/install-xw-mindmap.sh openclaw

注意：本机 token 保存在 ~/.config/mind-workspace/device.json，不会被仓库打包，也不要发给别人。
```

配图：

- 竖版封面：`marketing/assets/covers/day1-pm-install-cover.svg`
- PPT 图：`marketing/assets/ppt-images/day1-pm-install-slide.svg`

标签：

```text
#AI工具教程 #Codex #ClaudeCode #GitHub开源 #程序员工具 #效率工具 #思维导图 #AI智能体
```

## Day 2 上午：程序员场景

定位：让程序员理解“这个 Skill 有真实工作流价值”。

标题：

```text
给 Codex 装了一个脑图技能，能直接整理项目架构
```

封面：

```text
让 Codex 直接整理项目架构
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

第一版我先做成提案优先。

AI 可以很积极，但最终修改权还在用户手里。

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap
```

配图：

- 竖版封面：`marketing/assets/covers/day2-am-codex-cover.svg`
- PPT 图：`marketing/assets/ppt-images/day2-am-codex-slide.svg`

标签：

```text
#Codex #ClaudeCode #AI编程 #Agent #AI智能体 #开源项目 #程序员日常 #效率工具 #思维导图 #脑图
```

## Day 2 下午：安全解释

定位：解释为什么不是“AI 直接改”，建立可信感。

标题：

```text
我为什么没让 AI 直接改脑图？
```

封面：

```text
为什么 AI 先提案？
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

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap
```

配图：

- 竖版封面：`marketing/assets/covers/day2-pm-safety-cover.svg`
- PPT 图：`marketing/assets/ppt-images/day2-pm-safety-slide.svg`

标签：

```text
#AI安全 #Agent #AI智能体 #产品设计 #程序员 #开源项目 #思维导图 #Codex #ClaudeCode
```

## Day 3 上午：效率用户场景

定位：让非程序员也理解它能处理学习、会议、产品梳理。

标题：

```text
我想让 AI 帮我整理脑图，不只是生成一段文字
```

封面：

```text
把零散想法变成脑图
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

适合这些场景：

- 整理项目架构
- 梳理产品功能
- 拆解学习计划
- 重构会议纪要
- 把一堆想法变成层级结构

我比较在意的一点是安全感。

所以这个版本不是让 AI 在后台偷偷改，而是让 AI 先提交提案。

你可以看它要改什么，再决定要不要接受。

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap
```

配图：

- 竖版封面：`marketing/assets/covers/day3-am-efficiency-cover.svg`
- PPT 图：`marketing/assets/ppt-images/day3-am-efficiency-slide.svg`

标签：

```text
#效率工具 #AI工具 #思维导图 #脑图工具 #学习方法 #项目管理 #产品经理 #知识管理 #AI智能体
```

## Day 3 下午：路线图

定位：告诉关注者这个项目会继续做，吸引收藏和关注。

标题：

```text
新网脑图 AI Skill 下一步做什么？
```

封面：

```text
下一步：更实时的脑图智能体
```

正文：

```text
新网脑图 AI Skill 第一版已经开放下载。

现在能做到：

- 创建或打开脑图
- 读取当前文档
- 提交 AI 修改提案
- 监听 AI 提案事件

但我还不想把它说成“已经像人一样实时控制所有脑图操作”。

原因是目前 watch 主要覆盖 AI proposal 的事件。

用户在前端直接拖拽、改名、移动后，如果走普通保存路径，还不一定都有细粒度事件。

所以下一步我准备补：

1. 前端普通编辑保存时生成细粒度事件
2. 更完整的 watch 能力
3. direct command 接口
4. 权限确认机制
5. 操作审计和版本校验

我希望它最终不是一个 Demo，而是一个真正能进入工作流的脑图智能体能力。

GitHub：github.com/guanxuewen-eng/ai-xw-mindmap
```

配图：

- 竖版封面：`marketing/assets/covers/day3-pm-roadmap-cover.svg`
- PPT 图：`marketing/assets/ppt-images/day3-pm-roadmap-slide.svg`

标签：

```text
#AI智能体 #Agent #产品路线图 #开源项目 #思维导图 #Codex #ClaudeCode #效率工具 #AI工具
```

## 每条通用置顶评论

```text
仓库地址：github.com/guanxuewen-eng/ai-xw-mindmap

安装后记得重启 Codex / Claude Code，让它重新扫描技能列表。

本机 token 保存在 ~/.config/mind-workspace/device.json，不会被仓库打包，也不要发给别人。
```

## 三天节奏建议

- Day 1 上午 10:30：官宣，目标是收藏和转发。
- Day 1 晚上 20:30：安装教程，承接想试用的人。
- Day 2 上午 10:30：程序员场景，强调 Skill API 和真实工作流。
- Day 2 晚上 20:30：安全解释，建立信任。
- Day 3 上午 10:30：效率用户场景，扩大受众。
- Day 3 晚上 20:30：路线图，拉关注和后续期待。

