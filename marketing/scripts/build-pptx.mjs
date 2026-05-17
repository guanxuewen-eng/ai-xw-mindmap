import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pptxgen = require('pptxgenjs')

const root = path.resolve(new URL('../..', import.meta.url).pathname)
const slideDir = path.join(root, 'marketing', 'assets', 'ppt-images')
const outDir = path.join(root, 'marketing', 'ppt')
fs.mkdirSync(outDir, { recursive: true })

const slides = [
  'day1-am-launch-slide.png',
  'day1-pm-install-slide.png',
  'day2-am-codex-slide.png',
  'day2-pm-safety-slide.png',
  'day3-am-efficiency-slide.png',
  'day3-pm-roadmap-slide.png',
]

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'xw-mindmap'
pptx.subject = '新网脑图 AI Skill 小红书三天宣传图'
pptx.title = 'xw-mindmap 小红书三天宣传图'
pptx.company = '新网脑图'
pptx.lang = 'zh-CN'
pptx.theme = {
  headFontFace: 'PingFang SC',
  bodyFontFace: 'PingFang SC',
  lang: 'zh-CN',
}

for (const filename of slides) {
  const slide = pptx.addSlide()
  slide.background = { color: 'F6F8FF' }
  slide.addImage({
    path: path.join(slideDir, filename),
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
  })
}

await pptx.writeFile({ fileName: path.join(outDir, 'xw-mindmap-xiaohongshu-3day-slides.pptx') })
console.log('wrote marketing/ppt/xw-mindmap-xiaohongshu-3day-slides.pptx')
