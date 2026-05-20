# xw-mindmap Release Artifacts

这里放的是AI脑图 Skill 的离线下载包。可以放心下载，包里不包含本机 token、服务器密码或私人脑图数据。

## Files

- `xw-mindmap-agent-skill-0.1.6.tgz`
  给 Codex、Claude Code、Hermes、OpenClaw 使用的 Skill 离线包。

- `mind-workspace-skill-client-0.1.0.tgz`
  `@mind-workspace/skill-client` 的 npm tarball。

## 手动安装 Skill 包

```bash
mkdir -p ~/.codex/skills
tar -xzf xw-mindmap-agent-skill-0.1.6.tgz -C ~/.codex/skills
```

Claude Code 示例：

```bash
mkdir -p ~/.claude/skills
tar -xzf xw-mindmap-agent-skill-0.1.6.tgz -C ~/.claude/skills
```

tar 包里也包含 `install-xw-mindmap.sh`，解压后可以继续用脚本安装到其它智能体目录。

## 安装 SDK 包

```bash
npm install ./mind-workspace-skill-client-0.1.0.tgz
```

## 安全说明

这些包不包含本机设备 token。运行时 token 只保存在：

```text
~/.config/mind-workspace/device.json
```
