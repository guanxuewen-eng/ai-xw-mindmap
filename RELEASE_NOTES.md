# xw-mindmap Agent Skill v0.1.0

这是新网脑图 AI 智能体 Skill 的第一版公开包。

## 适合谁下载

如果你在用 Codex、Claude Code、Hermes、OpenClaw，或者其它支持本地 `SKILL.md` 的智能体，可以下载这个仓库，把新网脑图能力装进你的本地智能体。

安装后，智能体可以帮你：

- 创建或打开脑图。
- 读取当前脑图内容。
- 生成结构化修改提案。
- 监听 AI 提案相关事件。

## 安全边界

这个版本默认是“提案优先”。AI 先提交修改提案，你再确认是否应用。这样更稳，也更适合真实项目。

这个仓库不包含：

- 本机 Skill token
- 服务器密码
- 数据库密码
- 私人脑图数据
- `.env`

本机授权文件在 `~/.config/mind-workspace/device.json`，不会被安装脚本上传或清掉。

## 下载文件

- `xw-mindmap-agent-skill-0.1.0.tgz`：Skill 离线安装包。
- `mind-workspace-skill-client-0.1.0.tgz`：Node SDK 安装包。

## 安装

推荐从仓库安装：

```bash
git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git
cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex
```

也可以下载 `release/xw-mindmap-agent-skill-0.1.0.tgz` 后手动解压到你的智能体技能目录。

## 已知限制

- 监听能力目前主要覆盖 AI 提案和提案生成的节点事件。
- 前端普通拖拽、改名、移动保存后，还需要后续补齐细粒度事件。
- 直接命令执行能力还没开放，后续会配合权限确认和审计再做。

