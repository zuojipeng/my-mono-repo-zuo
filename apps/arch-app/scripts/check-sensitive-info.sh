#!/bin/bash

# 敏感信息检查脚本
# 用于在推送到 GitHub 前检查是否有敏感信息

echo "🔍 开始检查敏感信息..."
echo ""

has_error=0

# 检查 1: .env 文件是否会被提交
echo "1️⃣  检查 .env 文件..."
if git check-ignore .env > /dev/null 2>&1; then
    echo "   ✅ .env 已在 .gitignore 中"
else
    echo "   ❌ 警告: .env 可能会被提交！"
    has_error=1
fi
echo ""

# 检查 2: 检查是否有硬编码的密钥
echo "2️⃣  检查源代码中的硬编码密钥..."
suspicious_patterns=(
    "pinata_jwt.*[:=].*['\"][a-zA-Z0-9]{20,}"
    "api_key.*[:=].*['\"][a-zA-Z0-9]{20,}"
    "secret.*[:=].*['\"][a-zA-Z0-9]{20,}"
    "JWT['\"]:\s*['\"][a-zA-Z0-9]{20,}"
)

found_hardcoded=0
for pattern in "${suspicious_patterns[@]}"; do
    if grep -rE "$pattern" src/ --exclude-dir=node_modules > /dev/null 2>&1; then
        echo "   ⚠️  发现可疑的硬编码内容（模式: $pattern）"
        found_hardcoded=1
    fi
done

if [ $found_hardcoded -eq 0 ]; then
    echo "   ✅ 未发现硬编码的密钥"
else
    echo "   ❌ 请检查并移除硬编码的密钥！"
    has_error=1
fi
echo ""

# 检查 3: 检查将要提交的文件
echo "3️⃣  检查将要提交的文件..."
if git diff --cached --name-only | grep -E "\.env$|\.env\..*$" > /dev/null 2>&1; then
    echo "   ❌ 警告: 发现 .env 文件在暂存区！"
    echo "   运行: git reset HEAD .env"
    has_error=1
else
    echo "   ✅ 暂存区没有 .env 文件"
fi
echo ""

# 检查 4: 检查文档文件
echo "4️⃣  检查文档文件..."
doc_files=$(git diff --cached --name-only | grep -E "\.md$" | grep -v "README.md")
if [ -n "$doc_files" ]; then
    echo "   ⚠️  以下文档文件将被提交:"
    echo "$doc_files" | sed 's/^/      - /'
    echo "   💡 如果这些文档只想保留本地，运行:"
    echo "      git reset HEAD *.md"
    echo "      git add README.md"
else
    echo "   ✅ 只有 README.md 会被提交"
fi
echo ""

# 检查 5: 检查 node_modules 和 dist
echo "5️⃣  检查构建产物..."
if git diff --cached --name-only | grep -E "node_modules/|dist/" > /dev/null 2>&1; then
    echo "   ❌ 警告: node_modules 或 dist 在暂存区！"
    has_error=1
else
    echo "   ✅ node_modules 和 dist 不会被提交"
fi
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $has_error -eq 1 ]; then
    echo "❌ 发现安全问题，请修复后再提交！"
    echo ""
    exit 1
else
    echo "✅ 安全检查通过！可以安全推送到 GitHub"
    echo ""
    echo "📝 建议的提交命令："
    echo "   git status"
    echo "   git add ."
    echo "   git commit -m 'chore: production ready'"
    echo "   git push origin main"
    echo ""
    exit 0
fi

