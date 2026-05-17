# 小红书图片资产

本目录由 `marketing/scripts/generate-xhs-assets.mjs` 生成。

## 竖版封面

- [Day 1 上午 发布官宣](covers/day1-am-launch-cover.svg)
- [Day 1 下午 安装教程](covers/day1-pm-install-cover.svg)
- [Day 2 上午 程序员场景](covers/day2-am-codex-cover.svg)
- [Day 2 下午 安全解释](covers/day2-pm-safety-cover.svg)
- [Day 3 上午 效率用户](covers/day3-am-efficiency-cover.svg)
- [Day 3 下午 后续计划](covers/day3-pm-roadmap-cover.svg)

## PPT 风格横版图

- [Day 1 上午 发布官宣](ppt-images/day1-am-launch-slide.svg)
- [Day 1 下午 安装教程](ppt-images/day1-pm-install-slide.svg)
- [Day 2 上午 程序员场景](ppt-images/day2-am-codex-slide.svg)
- [Day 2 下午 安全解释](ppt-images/day2-pm-safety-slide.svg)
- [Day 3 上午 效率用户](ppt-images/day3-am-efficiency-slide.svg)
- [Day 3 下午 后续计划](ppt-images/day3-pm-roadmap-slide.svg)

## PNG 文件

同目录下的 `.png` 文件是从 SVG 导出的可直接上传版本：

```bash
marketing/assets/covers/*.png
marketing/assets/ppt-images/*.png
```

重新导出 PNG：

```bash
./marketing/scripts/export-png-chrome.sh
```

## PPTX

横版图也已经整理成一个 PPTX：

```text
marketing/ppt/xw-mindmap-xiaohongshu-3day-slides.pptx
```
