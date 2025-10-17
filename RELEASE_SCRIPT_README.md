# LobeChat Release Update Script 使用指南

## 📋 脚本简介

`release-update.sh` 是一个自动化脚本，用于快速完成 LobeChat 项目的发布分支创建流程。它将之前手动执行的多个步骤整合成一个命令，大大提高了发布效率。

## 🚀 主要功能

该脚本会自动执行以下操作：

1. **同步上游代码** - 从 `upstream/main` 获取最新代码并推送到 `origin/main`
2. **功能分支更新** - 将指定功能分支 rebase 到最新 main 分支
3. **创建发布分支** - 基于最新版本自动创建 `release/xd-v{VERSION}` 分支
4. **合并功能代码** - 将功能分支合并到发布分支
5. **推送到远程** - 将所有更改推送到远程仓库

## 📖 使用方法

### 基本用法

```bash
# 使用默认功能分支 (feature/add-auth-redirect)
./release-update.sh

# 指定其他功能分支
./release-update.sh feature/my-new-feature

# 查看帮助信息
./release-update.sh --help
```

### 使用示例

```bash
# 示例1: 使用默认的 Auth Redirect 功能分支
./release-update.sh

# 示例2: 创建包含新功能的发布分支
./release-update.sh feature/add-dark-mode

# 示例3: 创建包含bugfix的发布分支
./release-update.sh feature/fix-login-issue
```

## ⚙️ 前置条件

在运行脚本前，请确保：

1. **Git 仓库配置正确**
   ```bash
   git remote -v
   # 应该看到：
   # origin    https://github.com/[your-username]/lobe-chat.git
   # upstream  https://github.com/lobehub/lobe-chat.git
   ```

2. **工作目录干净**
   ```bash
   git status
   # 应该显示：working tree clean
   ```

3. **功能分支存在**
   ```bash
   git branch -a | grep feature/your-branch-name
   ```

## 🎯 执行流程详解

### 步骤1: 同步上游代码
- 切换到 `main` 分支
- 从 `upstream` 获取最新代码
- 合并 `upstream/main` 到本地 `main`
- 推送更新到 `origin/main`

### 步骤2: 更新功能分支
- 切换到指定功能分支
- 将功能分支 rebase 到最新 `main`
- 强制推送 rebase 后的分支

### 步骤3: 创建发布分支
- 自动获取最新版本号（如 v1.123.1）
- 创建 `release/xd-v1.123.1` 分支
- 推送发布分支到远程

### 步骤4: 合并功能代码
- 将功能分支合并到发布分支
- 推送完整的发布分支

## 🔧 配置选项

脚本内部可配置的变量：

```bash
UPSTREAM_REMOTE="upstream"     # 上游远程仓库名
ORIGIN_REMOTE="origin"         # 自己的远程仓库名
MAIN_BRANCH="main"             # 主分支名
RELEASE_PREFIX="release/xd-v"  # 发布分支前缀
```

## 📊 执行结果

脚本成功执行后会显示：

```
🎉 所有步骤执行完成！

📋 执行总结:
  ✅ 已同步upstream到远程main (版本: v1.123.1)
  ✅ 已将 feature/add-auth-redirect 分支rebase到最新main
  ✅ 已创建release分支: release/xd-v1.123.1
  ✅ 已合并功能分支到release分支
  ✅ 已推送所有更改到远程仓库

🚀 当前状态:
  📍 当前分支: release/xd-v1.123.1
  📦 基于版本: v1.123.1
  🔧 包含功能: add-auth-redirect
  🌐 远程状态: 已同步，可用于部署
```

## ⚠️ 故障排除

### 常见问题

1. **工作目录不干净**
   ```bash
   # 解决方案：提交或储藏未完成的更改
   git add .
   git commit -m "work in progress"
   # 或者
   git stash
   ```

2. **功能分支不存在**
   ```bash
   # 解决方案：检查分支名是否正确
   git branch -a | grep feature
   ```

3. **Rebase 冲突**
   ```bash
   # 脚本会停止，需要手动解决冲突后重新运行
   git status          # 查看冲突文件
   # 编辑冲突文件
   git add .
   git rebase --continue
   ./release-update.sh  # 重新运行脚本
   ```

4. **权限问题**
   ```bash
   # 确保脚本有执行权限
   chmod +x release-update.sh
   ```

## 🔄 定期维护

建议每次发布新版本时使用此脚本：

1. **功能开发完成** → 运行脚本创建发布分支
2. **测试验证** → 在发布分支上进行测试
3. **部署上线** → 使用发布分支进行部署
4. **版本标记** → 为发布分支打标签

## 📝 脚本维护

如需修改脚本配置，编辑 `release-update.sh` 文件：

- 修改默认功能分支名
- 调整发布分支命名规则
- 添加额外的检查逻辑
- 自定义输出格式

---

💡 **提示**: 首次使用建议在测试环境中验证脚本行为，确认符合项目需求后再在正式环境使用。
