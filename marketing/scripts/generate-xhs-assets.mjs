import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('../..', import.meta.url).pathname)
const outRoot = path.join(root, 'marketing', 'assets')
const coverDir = path.join(outRoot, 'covers')
const slideDir = path.join(outRoot, 'ppt-images')

fs.mkdirSync(coverDir, { recursive: true })
fs.mkdirSync(slideDir, { recursive: true })

const posts = [
  {
    id: 'day1-am-launch',
    day: 'Day 1 上午',
    theme: '发布官宣',
    title: '我把 AI 接进了脑图',
    subtitle: '新网脑图 AI Skill 开放下载',
    eyebrow: '支持 Codex / Claude Code / Hermes / OpenClaw',
    points: ['创建或打开脑图', '读取当前脑图结构', '提交 AI 修改提案', '监听提案事件'],
    accent: '#2154D4',
    bg: '#F6F8FF',
  },
  {
    id: 'day1-pm-install',
    day: 'Day 1 下午',
    theme: '安装教程',
    title: '3 步装好脑图 Skill',
    subtitle: 'clone 仓库，运行脚本，重启智能体',
    eyebrow: 'Codex 示例',
    points: ['git clone 仓库', './agent-skills/install-xw-mindmap.sh codex', '重启 Codex 刷新技能列表', '运行 discover 验证连接'],
    accent: '#0F766E',
    bg: '#F2FFFC',
  },
  {
    id: 'day2-am-codex',
    day: 'Day 2 上午',
    theme: '程序员场景',
    title: '让 Codex 直接整理项目架构',
    subtitle: '不只是输出 Markdown，而是接入真实脑图工作流',
    eyebrow: '项目架构 / 产品结构 / 知识树',
    points: ['打开项目脑图', '读取已有节点', '生成结构优化提案', '你确认后再应用'],
    accent: '#6D28D9',
    bg: '#FAF7FF',
  },
  {
    id: 'day2-pm-safety',
    day: 'Day 2 下午',
    theme: '安全解释',
    title: '为什么 AI 先提案？',
    subtitle: '真实项目里，数据修改必须可确认、可追踪',
    eyebrow: 'Proposal-first',
    points: ['不静默乱改', '基于 revision 提交', '每个操作都有 reason', '后续再开放 direct command'],
    accent: '#B45309',
    bg: '#FFF8EF',
  },
  {
    id: 'day3-am-efficiency',
    day: 'Day 3 上午',
    theme: '效率用户',
    title: '把零散想法变成脑图',
    subtitle: '让 AI 帮你整理层级，而不是只给一段文字',
    eyebrow: '学习计划 / 会议纪要 / 产品功能',
    points: ['读取当前结构', '补全缺失分支', '整理层级关系', '提交可审核方案'],
    accent: '#BE123C',
    bg: '#FFF5F7',
  },
  {
    id: 'day3-pm-roadmap',
    day: 'Day 3 下午',
    theme: '后续计划',
    title: '下一步：更实时的脑图智能体',
    subtitle: '补细粒度事件、direct command、权限确认和审计',
    eyebrow: 'Roadmap',
    points: ['前端普通编辑生成事件', '更完整的 watch 能力', '权限确认机制', '安全 direct command'],
    accent: '#334155',
    bg: '#F8FAFC',
  },
]

function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function coverSvg(post) {
  const pointEls = post.points.map((point, index) => {
    const y = 885 + index * 74
    return `
      <g>
        <circle cx="118" cy="${y - 10}" r="10" fill="${post.accent}"/>
        <text x="145" y="${y}" class="point">${esc(point)}</text>
      </g>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1440" viewBox="0 0 1080 1440" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1440" fill="${post.bg}"/>
  <rect x="54" y="54" width="972" height="1332" rx="56" fill="#FFFFFF" stroke="#D9E2F2" stroke-width="2"/>
  <rect x="96" y="110" width="354" height="58" rx="29" fill="${post.accent}" fill-opacity="0.1"/>
  <text x="124" y="150" class="eyebrow" fill="${post.accent}">${esc(post.day)} · ${esc(post.theme)}</text>
  <text x="96" y="315" class="title">${esc(post.title)}</text>
  <text x="96" y="415" class="subtitle">${esc(post.subtitle)}</text>
  <text x="96" y="505" class="support">${esc(post.eyebrow)}</text>
  <g transform="translate(96 610)">
    <rect width="888" height="176" rx="32" fill="${post.accent}" fill-opacity="0.08"/>
    <text x="40" y="70" class="mini-title" fill="${post.accent}">xw-mindmap Agent Skill</text>
    <text x="40" y="122" class="mini-copy">AI 先提案，你确认后再改脑图</text>
  </g>
  ${pointEls}
  <line x1="96" y1="1238" x2="984" y2="1238" stroke="#E5EAF3" stroke-width="2"/>
  <text x="96" y="1300" class="repo">github.com/guanxuewen-eng/ai-xw-mindmap</text>
  <text x="96" y="1352" class="safe">不包含本机 token / 私人脑图数据 / 服务器密码</text>
  <style>
    text { font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif; }
    .eyebrow { font-size: 28px; font-weight: 700; }
    .title { font-size: 82px; font-weight: 900; fill: #111827; letter-spacing: 0; }
    .subtitle { font-size: 42px; font-weight: 700; fill: #334155; letter-spacing: 0; }
    .support { font-size: 30px; font-weight: 600; fill: #64748B; }
    .mini-title { font-size: 34px; font-weight: 800; }
    .mini-copy { font-size: 32px; font-weight: 700; fill: #111827; }
    .point { font-size: 34px; font-weight: 700; fill: #1F2937; }
    .repo { font-size: 30px; font-weight: 800; fill: #111827; }
    .safe { font-size: 26px; font-weight: 600; fill: #64748B; }
  </style>
</svg>`
}

function slideSvg(post) {
  const cards = post.points.map((point, index) => {
    const x = 96 + (index % 2) * 704
    const y = 430 + Math.floor(index / 2) * 172
    return `
      <g>
        <rect x="${x}" y="${y}" width="610" height="120" rx="22" fill="#FFFFFF" stroke="#D8E0EC" stroke-width="2"/>
        <rect x="${x + 28}" y="${y + 34}" width="52" height="52" rx="16" fill="${post.accent}" fill-opacity="0.12"/>
        <text x="${x + 46}" y="${y + 71}" class="num" fill="${post.accent}">${index + 1}</text>
        <text x="${x + 104}" y="${y + 75}" class="card-text">${esc(point)}</text>
      </g>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="${post.bg}"/>
  <rect x="56" y="56" width="1488" height="788" rx="36" fill="#FFFFFF" stroke="#D9E2F2" stroke-width="2"/>
  <rect x="96" y="100" width="360" height="50" rx="25" fill="${post.accent}" fill-opacity="0.1"/>
  <text x="124" y="134" class="eyebrow" fill="${post.accent}">${esc(post.day)} · ${esc(post.theme)}</text>
  <text x="96" y="244" class="title">${esc(post.title)}</text>
  <text x="98" y="315" class="subtitle">${esc(post.subtitle)}</text>
  <text x="100" y="374" class="support">${esc(post.eyebrow)}</text>
  ${cards}
  <text x="96" y="806" class="footer">github.com/guanxuewen-eng/ai-xw-mindmap</text>
  <text x="1040" y="806" class="footer-right">AI 先提案，你确认后再改</text>
  <style>
    text { font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif; }
    .eyebrow { font-size: 24px; font-weight: 800; }
    .title { font-size: 64px; font-weight: 900; fill: #111827; letter-spacing: 0; }
    .subtitle { font-size: 32px; font-weight: 700; fill: #334155; letter-spacing: 0; }
    .support { font-size: 24px; font-weight: 700; fill: #64748B; }
    .num { font-size: 26px; font-weight: 900; }
    .card-text { font-size: 28px; font-weight: 800; fill: #1F2937; }
    .footer { font-size: 22px; font-weight: 800; fill: #111827; }
    .footer-right { font-size: 22px; font-weight: 800; fill: #64748B; }
  </style>
</svg>`
}

for (const post of posts) {
  fs.writeFileSync(path.join(coverDir, `${post.id}-cover.svg`), coverSvg(post))
  fs.writeFileSync(path.join(slideDir, `${post.id}-slide.svg`), slideSvg(post))
}

const index = `# 小红书图片资产

本目录由 \`marketing/scripts/generate-xhs-assets.mjs\` 生成。

## 竖版封面

${posts.map(post => `- [${post.day} ${post.theme}](covers/${post.id}-cover.svg)`).join('\n')}

## PPT 风格横版图

${posts.map(post => `- [${post.day} ${post.theme}](ppt-images/${post.id}-slide.svg)`).join('\n')}

## 转 PNG

如果本机安装了 ImageMagick：

\`\`\`bash
magick marketing/assets/covers/day1-am-launch-cover.svg marketing/assets/covers/day1-am-launch-cover.png
magick marketing/assets/ppt-images/day1-am-launch-slide.svg marketing/assets/ppt-images/day1-am-launch-slide.png
\`\`\`
`

fs.writeFileSync(path.join(outRoot, 'README.md'), index)
console.log(`Generated ${posts.length * 2} SVG assets in ${outRoot}`)
