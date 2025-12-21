#!/usr/bin/env node

/**
 * 生产构建验证脚本
 * 用于检查 webpack 配置和依赖是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始验证生产构建配置...\n');

let hasError = false;

// 1. 检查 Node 版本
console.log('1️⃣  检查 Node 版本...');
const nodeVersion = process.version;
const requiredVersion = 18;
const currentVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (currentVersion >= requiredVersion) {
  console.log(`   ✅ Node 版本: ${nodeVersion} (>= ${requiredVersion}.x.x)\n`);
} else {
  console.log(`   ❌ Node 版本: ${nodeVersion} (需要 >= ${requiredVersion}.x.x)`);
  console.log(`   💡 运行: nvm install ${requiredVersion} && nvm use ${requiredVersion}\n`);
  hasError = true;
}

// 2. 检查必需的依赖
console.log('2️⃣  检查必需的依赖...');
const requiredDeps = [
  'webpack',
  'webpack-cli',
  'html-webpack-plugin',
  'terser-webpack-plugin',
  'mini-css-extract-plugin',
  'swc-loader',
];

requiredDeps.forEach(dep => {
  const depPath = path.resolve(__dirname, '../node_modules', dep);
  if (fs.existsSync(depPath)) {
    console.log(`   ✅ ${dep}`);
  } else {
    console.log(`   ❌ ${dep} 未安装`);
    hasError = true;
  }
});
console.log('');

// 3. 检查配置文件
console.log('3️⃣  检查配置文件...');
const configFiles = [
  'webpack.config.js',
  'config/webpack.production.js',
  'config/webpack.development.js',
  'public/index.html',
  'tsconfig.json',
  'package.json',
];

configFiles.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} 不存在`);
    hasError = true;
  }
});
console.log('');

// 4. 检查 webpack.production.js 配置
console.log('4️⃣  检查 webpack.production.js 配置...');
try {
  const prodConfig = require('../config/webpack.production.js');
  
  if (prodConfig.mode === 'production') {
    console.log('   ✅ mode: production');
  }
  
  if (prodConfig.optimization && prodConfig.optimization.minimize) {
    console.log('   ✅ 代码压缩已启用');
  }
  
  if (prodConfig.optimization && prodConfig.optimization.splitChunks) {
    console.log('   ✅ 代码分割已配置');
  }
  
  if (prodConfig.output && prodConfig.output.clean) {
    console.log('   ✅ 构建前清理已启用');
  }
  
  console.log('');
} catch (error) {
  console.log(`   ❌ 配置文件有语法错误: ${error.message}\n`);
  hasError = true;
}

// 5. 检查环境变量
console.log('5️⃣  检查环境变量配置...');
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env 文件存在');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const hasJWT = envContent.includes('VITE_PINATA_JWT');
  const hasApiKey = envContent.includes('VITE_PINATA_API_KEY');
  
  if (hasJWT && hasApiKey) {
    console.log('   ✅ Pinata 配置已设置');
  } else {
    console.log('   ⚠️  Pinata 配置可能不完整');
  }
} else {
  console.log('   ⚠️  .env 文件不存在（可选）');
  console.log('   💡 运行: cp env.example.txt .env');
}
console.log('');

// 6. 检查源文件
console.log('6️⃣  检查源文件...');
const srcFiles = [
  'src/index.tsx',
  'src/style.css',
];

srcFiles.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} 不存在`);
    hasError = true;
  }
});
console.log('');

// 7. 总结
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (hasError) {
  console.log('❌ 验证失败：存在需要修复的问题\n');
  process.exit(1);
} else {
  console.log('✅ 验证通过！可以执行生产构建\n');
  console.log('📦 运行以下命令开始构建：');
  console.log('   yarn client:prod\n');
  console.log('🧪 构建完成后测试：');
  console.log('   npx serve -s dist -p 8080\n');
  process.exit(0);
}




