# AI脑图 Skill

这是 AI脑图给本地 AI 智能体用的 Skill。

它的目标很简单：让 Codex、Claude Code、Hermes、OpenClaw 这类工具可以通过安全的 Skill API 连接 AI脑图，帮你创建脑图、读取内容、提交 AI 提案、监听提案事件。

仓库里只包含公开代码和说明，不包含任何人的本机 token、服务器密码或私人脑图数据。

## 安装

```bash
git clone git@github.com:guanxuewen-eng/ai-xw-mindmap.git
cd ai-xw-mindmap
./agent-skills/install-xw-mindmap.sh codex
```

支持的目标：

```bash
./agent-skills/install-xw-mindmap.sh codex
./agent-skills/install-xw-mindmap.sh claude-code
./agent-skills/install-xw-mindmap.sh hermes
./agent-skills/install-xw-mindmap.sh openclaw
./agent-skills/install-xw-mindmap.sh all
```

安装位置：

- Codex: `~/.codex/skills/xw-mindmap/SKILL.md`
- Claude Code: `~/.claude/skills/xw-mindmap/SKILL.md`
- Hermes: `~/.hermes/skills/xw-mindmap/SKILL.md`
- OpenClaw: `~/.openclaw/skills/xw-mindmap/SKILL.md`

安装后重启智能体应用，让技能列表刷新。

## 第一次运行

需要 Node 18 或更新版本。

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs choose-new
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

运行后，本机身份和 Skill token 会保存在：

```text
~/.config/mind-workspace/device.json
```

这个文件不会被打包，不会上传，也不会因为重新安装 Skill 被清掉。不要把它发给别人。

## 常用提示词

```text
使用 xw-mindmap 技能，创建一个“项目架构设计”脑图。
```

```text
调用 AI脑图技能，打开这个脑图并提交一组结构优化提案。
```

```text
用 xw-mindmap 监听这个脑图 60 秒，看是否有 AI 提案提交事件。
```

## CLI 示例

发现服务能力：

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

按标题打开或创建脑图：

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs open --mode ensure --title "项目架构设计"
```

读取脑图：

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs get --id <mindMapId>
```

提交 AI 提案：

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs propose --file proposal.json
```

监听事件：

```bash
node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs watch --id <mindMapId> --seconds 60
```

## 提案格式

```json
{
  "mindMapId": "uuid",
  "baseRevision": 1,
  "rationale": "Generate a project architecture outline",
  "idempotencyKey": "agent-unique-key",
  "operations": [
    {
      "opId": "op_1",
      "type": "create_node",
      "target": { "parentUid": "root-node-uid" },
      "payload": { "tempUid": "$temp:architecture", "text": "系统架构" },
      "reason": "Add the top-level architecture branch"
    }
  ]
}
```

提交提案前先读取文档，拿到正确的节点 UID 和当前 `revision`，再把 `revision` 作为 `baseRevision`。

## 配置

默认生产 API：

```text
http://183.223.249.216:58003
```

本地开发时可以覆盖：

```bash
XW_MINDMAP_API=http://127.0.0.1:58003 node ~/.codex/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

可选客户端标识：

```bash
XW_MINDMAP_CLIENT=claude-code node ~/.claude/skills/xw-mindmap/scripts/xw-mindmap.mjs discover
```

## 安全模式

- token 只保存在本机，CLI 输出会自动打码。
- 结构修改默认走提案。
- 删除、覆盖等危险操作应该先让用户确认。
- direct command 以后要等权限确认、审计日志、幂等、版本校验和回滚策略补齐后再开放。

## 当前限制

- `watch` 对 AI 提案提交和提案产生的节点事件比较可靠。
- 前端普通保存路径还不一定都有细粒度事件，必要时需要重新读取完整文档。
- 这个版本还不包含直接命令控制。
