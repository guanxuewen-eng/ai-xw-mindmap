# ai-xw-mindmap

这是 **AI脑图 xw-mindmap 的 AI 智能体技能包**。
给 Codex、Claude Code、Hermes、OpenClaw 这类本地智能体用，让它们可以连接 AI脑图，帮你创建脑图、读取脑图内容、提交 AI 修改提案，并监听提案事件。

我把安装脚本、Skill 文件、SDK 和离线下载包都放在这里了。你可以放心下载，仓库里不包含我的本机密钥、服务器密码、Skill token 或任何私人脑图数据。

## 现在能做什么

- 让智能体发现 AI脑图服务能力。
- 在本机创建或复用一个 Skill 身份。
- 打开或创建脑图项目。
- 读取当前脑图文档和版本号。
- 提交可审核的 AI 修改提案。
- 监听 AI 提案提交、通过、拒绝以及提案产生的节点事件。

现在默认是“先提案、再确认”的安全模式。也就是说，AI 不会静默乱改你的脑图，它会先提交结构化提案，由你在网页里确认后再生效。

## 支持哪些智能体

安装脚本目前支持这些目录：

- Codex: `~/.codex/skills/xw-mindmap`
- Claude Code: `~/.claude/skills/xw-mindmap`
- Hermes: `~/.hermes/skills/xw-mindmap`
- OpenClaw: `~/.openclaw/skills/xw-mindmap`

如果你的工具也支持 `SKILL.md` 形式的本地技能，一般也可以手动复制 `agent-skills/xw-mindmap` 过去使用。

## 快速安装

```bash
git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git
cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex
```

安装到其它智能体：

```bash
./agent-skills/install-xw-mindmap.sh claude-code
./agent-skills/install-xw-mindmap.sh hermes
./agent-skills/install-xw-mindmap.sh openclaw
./agent-skills/install-xw-mindmap.sh all
```

安装后重启对应的智能体应用，让它重新扫描技能列表。

## 第一次运行

Codex 示例：

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs choose-new
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

如果 `discover` 能返回服务能力，说明网络和 Skill API 是通的。

## 本机密钥放在哪里

运行时会在本机生成设备身份和 Skill token：

```text
~/.config/mind-workspace/device.json
```

这个文件只在你的电脑上，不在仓库里，也不会被安装脚本上传。以后更新或重新安装这个 Skill，也不会清掉这个文件。

请不要把这个文件发到网上，也不要把里面的 token 贴到聊天窗口。

## 常用提示词

可以直接这样对 Codex 或其它智能体说：

```text
使用 xw-mindmap 技能，创建一个“项目架构设计”脑图。
```

```text
调用 AI脑图技能，打开当前项目，并提交一组结构优化提案。
```

```text
用 xw-mindmap 监听这个脑图 60 秒，看有没有 AI 提案事件。
```

## 下载包

`release/` 目录里已经放了两个包：

- `release/xw-mindmap-agent-skill-0.1.0.tgz`：Skill 离线包。
- `release/mind-workspace-skill-client-0.1.0.tgz`：Node SDK 包。

手动安装 Skill 包：

```bash
mkdir -p ~/.codex/skills
tar -xzf release/xw-mindmap-agent-skill-0.1.0.tgz -C ~/.codex/skills
```

安装 SDK 包：

```bash
npm install ./release/mind-workspace-skill-client-0.1.0.tgz
```

## 仓库结构

- `agent-skills/xw-mindmap/SKILL.md`：智能体读取的技能说明。
- `agent-skills/xw-mindmap/scripts/xw-mindmap.mjs`：内置命令行工具。
- `agent-skills/install-xw-mindmap.sh`：多智能体安装脚本。
- `skill-client`：Skill API 的 Node SDK。
- `release`：离线下载包。
- `docs`：分发、发布和检查说明。

## 当前限制

- `watch` 主要覆盖 AI 提案和提案提交后产生的节点事件。
- 用户在前端直接拖拽、改名、移动后，如果走普通保存路径，可能还需要重新读取完整文档才能严谨同步。
- 直接命令执行能力还没有作为默认功能开放。后续需要权限确认、审计、版本校验和回滚策略完整后再放。

## 安全说明

可以放心下载这个仓库，里面只放公开 Skill、SDK 和说明文件。

我特意没有放这些内容：

- 本机 `~/.config/mind-workspace/device.json`
- Skill token
- JWT
- 服务器密码
- 数据库密码
- `.env`
- 私人脑图数据

内置 CLI 在正常输出里也会把 token、secret、password、key 这类字段自动打码。

## 相关文档

- [Skill 安装和使用说明](agent-skills/README.md)
- [多智能体分发说明](docs/AGENT_SKILL_DISTRIBUTION.md)
- [GitHub 发布检查清单](docs/GITHUB_RELEASE_CHECKLIST.md)
- [SDK 使用说明](skill-client/README.md)
