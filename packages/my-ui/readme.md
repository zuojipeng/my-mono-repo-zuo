技术栈与构建
基于 React + TypeScript + Tailwind CSS v4 + Storybook（Vite）。
构建与 watch：tsup；样式由 Tailwind v4 直接通过 PostCSS 管道编译。
工作区模式：依赖声明在 packages/my-ui/package.json，安装需在仓库根目录运行 pnpm install，启动时在子包目录执行相关脚本。
关键文件
packages/my-ui/package.json：定义导出入口、脚本（build、storybook 等）。
packages/my-ui/postcss.config.cjs："@tailwindcss/postcss" + autoprefixer。
packages/my-ui/tailwind.config.ts：内容扫描 ./src 与 ./.storybook，扩展了 brand 色板、圆角、阴影、字体族（Inter）。
packages/my-ui/src/styles.css：
引入 Inter 字体。
使用 @theme 定义 brand 色系、圆角、阴影、字体变量。
全局基线（body 背景、文字色、标题排版、focus 阴影等）。
Storybook 画布背景渐变。
组件：
src/components/Button.tsx：支持 primary/secondary/outline/ghost 变体及 sm/md/lg 尺寸。
src/components/Input.tsx：现代感圆角、焦点光晕阴影，支持 label/error/hint。
src/components/Badge.tsx：状态徽标，支持多种颜色方案（brand/success/warning/error/neutral）与样式（solid/soft/outline）。
src/components/Card.tsx：基础卡片容器，包含 Header/Title/Description/Content/Footer 子组件，支持 hover 提升效果。
导出：
src/index.ts 导出所有组件、types，并引入全局样式。
类型文件 src/types.ts。
运行与开发
安装：在仓库根执行 pnpm install（确保锁文件与依赖一致）。
组件库打包：cd packages/my-ui && pnpm build。
组件预览与测试：cd apps/ui-app-interface && pnpm dev。
构建产物（含样式）：pnpm -F @zuojipeng/my-ui build（先跑 tailwind，后 tsup）。
设计约束（Radix 风格化）
颜色：brand 50-900（蓝紫系），文本主色 #0f172a，背景渐变淡蓝灰。
圆角：主要 12px（--radius-lg），焦点阴影 --shadow-focus-ring。
阴影：卡片/按钮使用柔和投影（--shadow-card），焦点态用自定义 shadow，避免 v4 的 ring 报错。
字体：全局 Inter，标题加粗、略微负字距。
注意事项
已移除 Tailwind ring 类（如 ring-offset-white），改用自定义 box-shadow 以兼容 Tailwind v4。
若新增颜色/空间/字号 token，请在 @theme 中补充，类名遵循 Tailwind v4 生成规则。
需要更多 Radix 化（尺寸、状态、色彩细节）可在 tailwind.config.ts 扩展或直接调整组件类名。