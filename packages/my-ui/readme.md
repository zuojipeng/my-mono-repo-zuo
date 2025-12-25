# @zuojipeng/my-ui

基于 **React + TypeScript + Tailwind CSS v4** 的 UI 组件库（配套 Storybook 预览），适用于项目快速搭建与一致性设计落地。

## 安装

> 本包为 ESM（`"type": "module"`），请确保你的项目构建链支持 ESM。

```bash
pnpm add @zuojipeng/my-ui
```

### Peer Dependencies

你的业务项目需要自行安装（或已安装）：

- `react`
- `react-dom`

## 快速开始

### 1) 引入样式

本包会产出一个可直接引用的样式文件：

```ts
import "@zuojipeng/my-ui/styles.css";
```

> 建议在应用入口（如 `main.tsx` / `app.tsx`）最早位置引入一次即可。

### 2) 使用组件

```tsx
import { Badge, Button, Card, Input } from "@zuojipeng/my-ui";

export function Demo() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Badge color="brand" variant="soft">
          New
        </Badge>
        <Button variant="primary" size="md">
          Primary
        </Button>
        <Button variant="outline" size="md">
          Outline
        </Button>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
          <Card.Description>Update your information</Card.Description>
        </Card.Header>
        <Card.Content>
          <Input label="Email" placeholder="you@example.com" hint="We never share it." />
        </Card.Content>
      </Card>
    </div>
  );
}
```

## 导出内容

- **组件**：`Button` / `Input` / `Badge` / `Card`
- **类型**：从包入口导出（`src/types.ts`）
- **样式**：`@zuojipeng/my-ui/styles.css`

> 组件与类型均从 `@zuojipeng/my-ui` 包入口导出。

## 开发与构建（Monorepo）

本仓库使用 pnpm workspace，建议在仓库根目录安装依赖：

```bash
pnpm install
```

### 构建组件库

```bash
pnpm -F @zuojipeng/my-ui build
```

> `build` 会先编译 Tailwind CSS，再使用 `tsup` 产出 ESM/CJS 与类型声明。

### 本地预览（Storybook）

在 `apps/ui-app-interface` 运行 Storybook：

```bash
pnpm -C apps/ui-app-interface dev
```

## 技术栈与关键文件（维护者）

- **打包**：`tsup`
- **样式**：Tailwind CSS v4（通过 PostCSS 管道编译）
- **关键文件**：
  - `packages/my-ui/package.json`：导出入口与脚本
  - `packages/my-ui/src/index.ts`：统一导出组件与类型
  - `packages/my-ui/src/styles.css`：全局样式与 token（`@theme`）

## 设计约束（Radix 风格化）

- **颜色**：brand 50-900（蓝紫系），文本主色 `#0f172a`，背景渐变淡蓝灰
- **圆角**：主要 12px（`--radius-lg`），焦点阴影 `--shadow-focus-ring`
- **阴影**：卡片/按钮使用柔和投影（`--shadow-card`），焦点态用自定义 shadow
- **字体**：全局 Inter，标题加粗、略微负字距

## 注意事项

- **Tailwind v4 ring**：已移除 ring 类（如 `ring-offset-white`），改用自定义 `box-shadow` 以避免 v4 下的 ring 相关问题
- **扩展 Token**：新增颜色/空间/字号等 token 请在 `@theme` 中补充，并遵循 Tailwind v4 类名生成规则

## License

ISC