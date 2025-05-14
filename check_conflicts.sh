#!/bin/bash
set -e

# 设置上游仓库URL
UPSTREAM_URL="https://github.com/lobehub/lobe-chat.git"
MAIN_BRANCH=main

# 1. 确保upstream远程存在
if ! git remote | grep -q upstream; then
  echo "添加上游仓库: $UPSTREAM_URL"
  git remote add upstream "$UPSTREAM_URL"
fi

# 2. 获取上游最新代码
echo "获取上游最新代码..."
git fetch upstream

# 3. 创建临时分支来测试合并
TEMP_BRANCH="temp_merge_test_$(date +%s)"
echo "创建临时分支: $TEMP_BRANCH"
git checkout -b $TEMP_BRANCH

# 4. 尝试合并但不提交
echo "模拟合并测试..."
if git merge upstream/$MAIN_BRANCH --no-commit --no-ff > /dev/null 2>&1; then
  echo "✅ 无冲突! 合并将顺利进行。"
  CONFLICT=0
else
  echo "⚠️ 检测到潜在冲突!"
  echo "以下文件可能会有冲突:"
  git diff --name-only --diff-filter=U
  CONFLICT=1
fi

# 5. 中止合并并返回原分支
git merge --abort
git checkout $MAIN_BRANCH
git branch -D $TEMP_BRANCH

# 6. 显示更详细的信息
echo -e "\n详细信息:"
echo "1. 您修改的文件:"
git diff --name-only upstream/$MAIN_BRANCH...HEAD

echo -e "\n2. 上游修改的文件:"
git diff --name-only HEAD...upstream/$MAIN_BRANCH

echo -e "\n3. 双方都修改的文件 (潜在冲突区域):"
git diff --name-only HEAD...upstream/$MAIN_BRANCH | sort > upstream_files
git diff --name-only upstream/$MAIN_BRANCH...HEAD | sort > local_files
comm -12 local_files upstream_files
rm local_files upstream_files

exit $CONFLICT 