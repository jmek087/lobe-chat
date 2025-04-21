#!/bin/bash
set -e

# 请根据实际情况修改这里
UPSTREAM_URL="https://github.com/lobehub/lobe-chat.git"
MAIN_BRANCH=main

# step 1: 检查并添加 upstream
if ! git remote | grep -q upstream; then
  echo "未检测到 upstream 远程仓库，正在添加：$UPSTREAM_URL"
  git remote add upstream "$UPSTREAM_URL"
else
  echo "已检测到 upstream 远程仓库"
fi

echo "=========================="
echo "1. 获取 upstream 主分支最新代码"
git fetch upstream

echo "=========================="
echo "2. 切换到本地主分支 ($MAIN_BRANCH)"
git checkout $MAIN_BRANCH

echo "=========================="
echo "3. 合并 upstream 主分支"
if git merge upstream/$MAIN_BRANCH; then
  echo "=========================="
  echo "4. 合并成功，正在推送到你的 Origin"
  git push origin $MAIN_BRANCH
  echo "✅ 同步成功！"
else
  echo "=========================="
  echo "❗️ 合并出现冲突！请按照以下步骤解决："
  echo
  echo "A. 按照git提示，手动编辑所有有冲突的文件（查找<<<<<< ====== >>>>>>标记并解决冲突）"
  echo "B. 解决后运行: git add 冲突文件 或 git add ."
  echo "C. 然后提交: git commit"
  echo "D. 最后推送到远程: git push origin $MAIN_BRANCH"
  echo
  echo "你可以运行以下命令检查冲突文件："
  echo "    git status"
  echo
  exit 1
fi