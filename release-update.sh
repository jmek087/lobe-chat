#!/bin/bash

# =============================================================================
# LobeChat Release Update Script
# 自动化发布分支创建脚本
# =============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
FEATURE_BRANCH=${1:-"feature/add-auth-redirect"}  # 默认功能分支，可通过参数传入
UPSTREAM_REMOTE="upstream"
ORIGIN_REMOTE="origin"
MAIN_BRANCH="main"
RELEASE_PREFIX="release/xd-v"

# 函数：打印彩色信息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "\n${YELLOW}🚀 步骤$1: $2${NC}"
}

# 函数：获取最新版本号
get_latest_version() {
    local version=$(git tag --sort=-version:refname | head -1 | sed 's/^v//')
    echo $version
}

# 函数：检查git仓库状态
check_git_status() {
    if [[ -n $(git status --porcelain) ]]; then
        print_error "工作目录不干净，请先提交或储藏您的更改"
        exit 1
    fi
}

# 函数：检查分支是否存在
branch_exists() {
    git rev-parse --verify "$1" >/dev/null 2>&1
}

# 函数：检查远程分支是否存在
remote_branch_exists() {
    git ls-remote --heads $ORIGIN_REMOTE "$1" | grep -q "$1"
}

# 主函数
main() {
    print_info "开始执行 LobeChat Release 更新流程..."
    print_info "功能分支: $FEATURE_BRANCH"
    
    # 检查git状态
    check_git_status
    
    # ==========================================
    # 步骤1: 同步upstream到远程main分支
    # ==========================================
    print_step "1" "同步upstream到远程main分支"
    
    print_info "切换到main分支..."
    git checkout $MAIN_BRANCH
    
    print_info "从upstream获取最新代码..."
    git fetch $UPSTREAM_REMOTE
    
    print_info "合并upstream/main到本地main..."
    git merge $UPSTREAM_REMOTE/$MAIN_BRANCH
    
    print_info "推送更新到origin/main..."
    git push $ORIGIN_REMOTE $MAIN_BRANCH
    
    print_success "步骤1完成 - upstream代码已同步到远程main"
    
    # ==========================================
    # 步骤2: Rebase功能分支到最新main
    # ==========================================
    print_step "2" "将功能分支rebase到最新main"
    
    if ! branch_exists "$FEATURE_BRANCH"; then
        print_error "功能分支 '$FEATURE_BRANCH' 不存在"
        exit 1
    fi
    
    print_info "切换到功能分支: $FEATURE_BRANCH"
    git checkout $FEATURE_BRANCH
    
    print_info "将功能分支rebase到最新main..."
    if git rebase $MAIN_BRANCH; then
        print_success "Rebase成功完成"
    else
        print_error "Rebase过程中遇到冲突，请手动解决后重新运行脚本"
        exit 1
    fi
    
    print_info "强制推送rebase后的功能分支..."
    git push -f $ORIGIN_REMOTE $FEATURE_BRANCH
    
    print_success "步骤2完成 - 功能分支已rebase到最新main"
    
    # ==========================================
    # 步骤3: 创建新的release分支
    # ==========================================
    print_step "3" "创建新的release分支"
    
    print_info "切换回main分支..."
    git checkout $MAIN_BRANCH
    
    print_info "获取最新版本号..."
    LATEST_VERSION=$(get_latest_version)
    RELEASE_BRANCH="${RELEASE_PREFIX}${LATEST_VERSION}"
    
    print_info "最新版本: v$LATEST_VERSION"
    print_info "创建release分支: $RELEASE_BRANCH"
    
    # 检查release分支是否已存在
    if branch_exists "$RELEASE_BRANCH"; then
        print_warning "Release分支 '$RELEASE_BRANCH' 已存在，删除旧分支..."
        git branch -D "$RELEASE_BRANCH"
    fi
    
    # 检查远程release分支是否存在
    if remote_branch_exists "$RELEASE_BRANCH"; then
        print_warning "远程release分支存在，删除远程分支..."
        git push $ORIGIN_REMOTE --delete "$RELEASE_BRANCH"
    fi
    
    print_info "基于最新main创建release分支..."
    git checkout -b "$RELEASE_BRANCH"
    
    print_info "推送release分支到远程..."
    git push $ORIGIN_REMOTE "$RELEASE_BRANCH"
    
    print_success "步骤3完成 - Release分支已创建: $RELEASE_BRANCH"
    
    # ==========================================
    # 步骤4: 合并功能分支到release分支
    # ==========================================
    print_step "4" "合并功能分支到release分支"
    
    print_info "合并功能分支到release分支..."
    if git merge $FEATURE_BRANCH; then
        print_success "功能分支合并成功"
    else
        print_error "合并过程中遇到冲突，请手动解决"
        exit 1
    fi
    
    print_info "推送完整的release分支..."
    git push $ORIGIN_REMOTE "$RELEASE_BRANCH"
    
    print_success "步骤4完成 - 功能分支已合并到release分支"
    
    # ==========================================
    # 完成总结
    # ==========================================
    echo -e "\n${GREEN}🎉 所有步骤执行完成！${NC}"
    echo -e "\n📋 执行总结:"
    echo -e "  ${GREEN}✅${NC} 已同步upstream到远程main (版本: v$LATEST_VERSION)"
    echo -e "  ${GREEN}✅${NC} 已将 $FEATURE_BRANCH 分支rebase到最新main"
    echo -e "  ${GREEN}✅${NC} 已创建release分支: $RELEASE_BRANCH"
    echo -e "  ${GREEN}✅${NC} 已合并功能分支到release分支"
    echo -e "  ${GREEN}✅${NC} 已推送所有更改到远程仓库"
    
    echo -e "\n🚀 当前状态:"
    echo -e "  📍 当前分支: $RELEASE_BRANCH"
    echo -e "  📦 基于版本: v$LATEST_VERSION"
    echo -e "  🔧 包含功能: $(echo $FEATURE_BRANCH | sed 's/feature\///')"
    echo -e "  🌐 远程状态: 已同步，可用于部署"
    
    echo -e "\n💡 下次运行命令:"
    echo -e "  ${BLUE}./release-update.sh${NC}                    # 使用默认功能分支"
    echo -e "  ${BLUE}./release-update.sh feature/my-feature${NC}  # 指定其他功能分支"
}

# 函数：显示帮助信息
show_help() {
    echo "LobeChat Release Update Script"
    echo ""
    echo "用法:"
    echo "  $0 [FEATURE_BRANCH]"
    echo ""
    echo "参数:"
    echo "  FEATURE_BRANCH    要合并的功能分支名称 (默认: feature/add-auth-redirect)"
    echo ""
    echo "示例:"
    echo "  $0                           # 使用默认功能分支"
    echo "  $0 feature/new-feature      # 使用指定功能分支"
    echo ""
    echo "该脚本将执行以下操作："
    echo "  1. 同步upstream/main到origin/main"
    echo "  2. 将功能分支rebase到最新main"
    echo "  3. 创建新的release分支"
    echo "  4. 合并功能分支到release分支"
    echo "  5. 推送所有更改到远程仓库"
}

# 检查参数
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# 执行主函数
main "$@"
