# CLAUDE.md

本仓库是 Aaron 的个人作品集网站。它本身也是一个作品，用来证明前端能力、审美和 GLSL。

## 开工前必读

1. `docs/SPEC.md`
2. `docs/TASKS.md`
3. `docs/DECISIONS.md`

## 工作方式

- 每个里程碑先出计划，等 Aaron 确认；视觉改动先给截图
- 一个任务一次提交，Conventional Commits 英文格式
- 项目内容全部放在 `src/content/projects/*.json`（或 MDX），页面只负责渲染

## 常用命令

```bash
npm run dev
npm run build && npm run preview
npm test
npm run lint && npm run typecheck
```

## 硬性规则

- 首屏加载 JS 不超过 150 KB（gzip 后），Lighthouse 四项都在 95 分以上
- GLSL 动效必须尊重 `prefers-reduced-motion`；不支持 WebGL 时显示静态渐变
- 页面不可见时暂停渲染循环，避免耗电
- 无障碍：语义化标签、键盘可操作、颜色对比度达标
- 不引入大型 UI 组件库；样式用 CSS Modules 或原生 CSS 变量
- 不放任何真实联系方式以外的个人信息
