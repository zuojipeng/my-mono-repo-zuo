# Web3 大学课程平台 🎓

一个基于区块链的去中心化课程交易平台，使用智能合约实现课程发布、购买和内容存储。

## ✨ 特性

- 🔒 **去中心化**：基于以太坊智能合约，交易透明可信
- 💰 **代币经济**：使用 YD Token 进行课程购买和交易
- 📚 **IPFS 存储**：课程内容存储在 IPFS，永久保存
- 👛 **多钱包支持**：支持 MetaMask 等主流钱包
- 💎 **质押挖矿**：质押代币获取奖励
- 💸 **理财金库**：资产管理和收益优化
- 👤 **链上身份**：用户资料存储在区块链上

## 🛠️ 技术栈

### 前端框架
- **React 19** - 最新的 React 版本
- **TypeScript 5** - 类型安全
- **React Router 7** - 客户端路由
- **Tailwind CSS 4** - 原子化 CSS 框架

### Web3 技术
- **Wagmi 3** - React Hooks for Ethereum
- **Viem 2** - TypeScript Ethereum library
- **TypeChain** - 智能合约类型生成
- **Pinata** - IPFS 文件存储

### 构建工具
- **Webpack 5** - 模块打包
- **SWC** - 快速的 TypeScript/JavaScript 编译器
- **Biome** - 代码格式化和 Lint 工具

### 测试
- **Jest** - 单元测试
- **Cypress** - E2E 测试
- **@testing-library/react** - React 组件测试

## 📦 安装

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask 钱包浏览器扩展

### 克隆项目

```bash
git clone <repository-url>
cd my-frontend-arch
```

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的配置：

```env
# Pinata IPFS 配置（从 https://app.pinata.cloud 获取）
VITE_PINATA_JWT=your_pinata_jwt_token
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key

# 区块链网络选择
USE_LOCAL_CHAIN=false  # false 使用 Sepolia 测试网，true 使用本地 Hardhat 网络
```

3. 如果使用本地开发链，需要先部署智能合约并更新合约地址：

```bash
# 在合约项目中部署
cd ../contracts
npx hardhat node  # 启动本地节点
npx hardhat run scripts/deploy.ts --network localhost

# 将生成的合约地址复制到 frontend-config.json
```

## 🚀 开发

### 启动开发服务器

```bash
npm run client:server
```

访问 http://localhost:8080

### 其他开发命令

```bash
# 开发环境构建（不启动服务器）
npm run client:dev

# 生产环境构建
npm run client:prod

# 代码检查
npm run lint

# 代码格式化
npm run format

# 完整代码检查并自动修复
npm run check

# 运行单元测试
npm test

# 运行 E2E 测试
npm run test:e2e

# 生成 TypeChain 类型
npm run typechain

# 监听合约文件变化并自动生成类型
npm run typechain:watch
```

## 📁 项目结构

```
my-frontend-arch/
├── src/
│   ├── components/         # React 组件
│   │   ├── common/         # 通用组件（Loading, PageNotFound）
│   │   └── contructsCommon/  # 智能合约相关组件
│   ├── hooks/              # 自定义 React Hooks
│   │   ├── useCourses.ts   # 课程列表 Hook
│   │   ├── usePurchase.ts  # 购买逻辑 Hook
│   │   └── useImmer.ts     # Immer 状态管理 Hook
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx    # 首页
│   │   ├── profile.tsx     # 个人中心
│   │   ├── faucet.tsx      # 水龙头
│   │   ├── staking.tsx     # 质押
│   │   └── treasury.tsx    # 理财
│   ├── routers/            # 路由配置
│   ├── lib/                # 工具库
│   │   └── wagmi.ts        # Wagmi 配置
│   ├── types/              # TypeScript 类型定义
│   ├── typechain-types/    # TypeChain 生成的合约类型
│   └── style.css           # 全局样式
├── abis/                   # 智能合约 ABI
├── config/                 # Webpack 配置
├── docs/                   # 项目文档
├── tests/                  # 测试文件
│   ├── unit/               # 单元测试
│   └── cypress/            # E2E 测试
├── public/                 # 静态资源
├── costruct.config.ts      # 合约配置文件
├── webpack.config.js       # Webpack 主配置
├── tsconfig.json           # TypeScript 配置
├── biome.json              # Biome 配置
└── package.json            # 项目依赖
```

## 🎮 功能模块

### 1. 课程市场
- 浏览所有课程
- 查看课程详情
- 使用 YD Token 购买课程
- 创建并发布新课程

### 2. 个人中心
- 查看已购买的课程
- 修改用户名（链上存储）
- 学习统计和进度追踪

### 3. 代币水龙头
- 领取测试代币
- 每次领取 100 YD Token
- Sepolia 测试网可用

### 4. 质押挖矿
- 质押 YD Token 获取奖励
- 查看质押详情和收益
- 随时取消质押

### 5. 理财金库
- 存入代币获取收益
- 灵活取款
- 收益自动复投

## 🔗 智能合约

项目使用以下智能合约：

- **YDToken** - ERC20 代币合约
- **CoursePlatform** - 课程管理合约
- **CoursePurchase** - 课程购买合约
- **UserProfile** - 用户资料合约
- **YDStaking** - 质押挖矿合约
- **YDTreasury** - 理财金库合约

合约地址配置在 `abis/frontend-config.json` 和 `costruct.config.ts` 中。

## 🌐 支持的网络

### Sepolia 测试网（推荐）
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/your-api-key
- 区块浏览器: https://sepolia.etherscan.io

### Hardhat Local（开发）
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545
- 需要本地运行 Hardhat 节点

## 📖 文档

更多详细文档：

- [快速开始指南](docs/GETTING_STARTED.md)
- [TypeChain 集成说明](docs/TYPECHAIN_INTEGRATION.md)
- [环境变量配置](docs/ENVIRONMENT.md)

## 🧪 测试

### 运行单元测试

```bash
npm test
```

测试报告会生成在 `docs/jest-stare/` 目录。

### 运行 E2E 测试

```bash
npm run test:e2e
```

## 🚢 部署

### 构建生产版本

```bash
npm run client:prod
```

构建产物会生成在 `dist/` 目录。

### 部署到 Cloudflare Pages

1. 推送代码到 GitHub
2. 在 Cloudflare Pages 中连接你的仓库
3. 配置构建命令：`npm run client:prod`
4. 配置输出目录：`dist`
5. 添加环境变量（与 `.env` 文件相同）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[ISC License](LICENSE)

## 👥 作者

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

## 🙏 致谢

- [Wagmi](https://wagmi.sh) - React Hooks for Ethereum
- [Viem](https://viem.sh) - TypeScript Ethereum library
- [TypeChain](https://github.com/dethcrypto/TypeChain) - TypeScript bindings for Ethereum smart contracts
- [Pinata](https://pinata.cloud) - IPFS 文件存储服务
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架

---

⚡ Built with ❤️ using React + Web3
