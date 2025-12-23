# TypeDoc 文档生成指南

## 📦 安装依赖

```bash
pnpm add -D typedoc
```

## 🚀 生成文档

```bash
# 生成文档到 docs 文件夹
pnpm docs

# 监听模式（文件变化自动重新生成）
pnpm docs:watch
```

## 📂 查看文档

生成后打开 `docs/index.html` 即可查看文档。

## 🌐 部署文档

### 本地预览

```bash
# 使用任意静态服务器
npx serve docs
# 或
python3 -m http.server 8080 --directory docs
```

### 部署到 GitHub Pages

1. 在项目根目录创建 `.github/workflows/docs.yml`：

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: cd packages/my-hooks && pnpm docs
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./packages/my-hooks/docs
```

2. 访问 `https://your-username.github.io/your-repo/`

## 📝 文档特性

✅ 自动从 JSDoc 注释生成  
✅ 左侧导航菜单  
✅ 类型定义展示  
✅ 代码示例高亮  
✅ 搜索功能  
✅ 响应式设计

