# Contributing

欢迎提交问题和建议。

这个仓库主要维护新网脑图的 AI 智能体 Skill、安装脚本和 SDK。提交改动时请注意：

- 不要提交本机 `~/.config/mind-workspace/device.json`。
- 不要提交 Skill token、JWT、服务器密码、数据库密码或 `.env`。
- 修改 Skill 后，至少运行：

```bash
node --check agent-skills/xw-mindmap/scripts/xw-mindmap.mjs
bash -n agent-skills/install-xw-mindmap.sh
```

- 修改 SDK 后，运行：

```bash
npm --prefix skill-client run build
```

当前安全策略是提案优先。涉及直接修改脑图的能力，应该先考虑权限确认、审计、版本校验和回滚。

