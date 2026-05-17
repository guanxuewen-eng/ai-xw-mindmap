# Security

这个仓库不应该包含任何本机密钥或服务端密钥。

请不要提交：

- `~/.config/mind-workspace/device.json`
- Skill token
- JWT
- 服务器 SSH 密码或私钥
- 数据库密码
- `.env`
- 私人脑图数据

如果你发现泄露风险，请先不要公开贴出 token 或密码内容，可以只描述文件路径、提交号和风险类型。

## 本机 token

xw-mindmap Skill 的本机授权文件默认在：

```text
~/.config/mind-workspace/device.json
```

这个文件只应该保留在用户自己的电脑上。更新 Skill、重新安装 Skill、下载 GitHub 包，都不需要删除它。

## 默认修改策略

当前版本采用提案优先：

- AI 生成结构化修改提案。
- 用户在网页里确认。
- 服务端再提交变更。

直接命令执行能力后续需要配套权限确认、审计日志、幂等键、版本校验和回滚策略。

