#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# auto-branch-push.sh
# 每次迭代后自动创建规范分支、提交变更、推送到 GitHub
#
# 用法：
#   bash scripts/auto-branch-push.sh <type> <scope> "<message>"
#
# 参数：
#   type     feat | fix | perf | style | chore | docs | refactor
#   scope    简短英文描述，用连字符连接，例如：token-expiry / emoji-insert
#   message  提交说明（中英文均可）
#
# 示例：
#   bash scripts/auto-branch-push.sh fix token-expiry "修复登录30分钟过期问题"
#   bash scripts/auto-branch-push.sh feat emoji-insert "表情包支持插入任意光标位置"
#   bash scripts/auto-branch-push.sh style remove-hint-text "移除表情选择器提示文字"
# ─────────────────────────────────────────────────────────────────────────────

set -e

# ── 颜色输出 ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── 参数检查 ──────────────────────────────────────────────────────────────────
TYPE="$1"
SCOPE="$2"
MESSAGE="$3"

VALID_TYPES="feat fix perf style chore docs refactor"

if [[ -z "$TYPE" || -z "$SCOPE" || -z "$MESSAGE" ]]; then
  echo ""
  echo "用法: bash scripts/auto-branch-push.sh <type> <scope> \"<message>\""
  echo ""
  echo "  type    : feat | fix | perf | style | chore | docs | refactor"
  echo "  scope   : 简短英文描述（连字符），如 token-expiry"
  echo "  message : 提交说明"
  echo ""
  echo "示例:"
  echo "  bash scripts/auto-branch-push.sh fix token-expiry \"修复登录30分钟过期问题\""
  echo "  bash scripts/auto-branch-push.sh feat emoji-insert \"表情包支持插入任意光标位置\""
  exit 1
fi

if [[ ! " $VALID_TYPES " =~ " $TYPE " ]]; then
  error "type 无效：'$TYPE'。允许的值：$VALID_TYPES"
fi

# ── 进入仓库根目录 ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
cd "$REPO_DIR"
info "工作目录：$REPO_DIR"

# ── 检查是否有未暂存的变更 ───────────────────────────────────────────────────
if [[ -z "$(git status --porcelain)" ]]; then
  warn "没有检测到任何变更，退出。"
  exit 0
fi

# ── 生成分支名 ────────────────────────────────────────────────────────────────
BRANCH="${TYPE}/${SCOPE}"
info "目标分支：$BRANCH"

# ── 确保在 main 上创建新分支（避免在旧分支叠加）────────────────────────────
CURRENT=$(git branch --show-current)
info "当前分支：$CURRENT"

# 拉取最新 main
info "同步远程 main..."
git fetch origin main --quiet

# 从 origin/main 创建新分支（如已存在则切换并 reset）
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  warn "分支 '$BRANCH' 已存在，切换并重置到 origin/main"
  git checkout "$BRANCH" --quiet
  git reset --hard origin/main --quiet
else
  info "从 origin/main 创建新分支..."
  git checkout -b "$BRANCH" origin/main --quiet
fi

success "已切换到分支：$BRANCH"

# ── 还原工作区变更（从原分支携带过来）───────────────────────────────────────
# 把原分支未提交的变更 cherry 过来
if [[ "$CURRENT" != "$BRANCH" ]]; then
  info "将 '$CURRENT' 上的未提交变更应用到新分支..."
  git checkout "$CURRENT" -- . 2>/dev/null || true
fi

# ── 暂存所有变更 ──────────────────────────────────────────────────────────────
git add -A
info "已暂存变更："
git status --short

# ── 提交 ──────────────────────────────────────────────────────────────────────
COMMIT_MSG="${TYPE}(${SCOPE}): ${MESSAGE}"
git commit -m "$COMMIT_MSG"
success "提交完成：$COMMIT_MSG"

# ── 推送到 GitHub ─────────────────────────────────────────────────────────────
info "推送到 origin/$BRANCH ..."
git push -u origin "$BRANCH" --force-with-lease 2>/dev/null || \
  git push -u origin "$BRANCH" --force
success "推送完成！"

# ── 创建或更新 PR ─────────────────────────────────────────────────────────────
info "检查是否已有 PR..."

EXISTING_PR=$(gh pr list --head "$BRANCH" --json number,url --jq '.[0].url' 2>/dev/null || echo "")

if [[ -n "$EXISTING_PR" ]]; then
  warn "PR 已存在，更新描述..."
  gh pr edit "$EXISTING_PR" \
    --title "$COMMIT_MSG" \
    --body "## 变更说明

**分支**：\`$BRANCH\`
**类型**：\`$TYPE\`

$MESSAGE

---
*由 auto-branch-push.sh 自动生成*" 2>/dev/null || true
  echo ""
  success "PR 已更新：$EXISTING_PR"
else
  info "创建新 PR..."
  PR_URL=$(gh pr create \
    --title "$COMMIT_MSG" \
    --body "## 变更说明

**分支**：\`$BRANCH\`
**类型**：\`$TYPE\`

$MESSAGE

---
*由 auto-branch-push.sh 自动生成*" \
    --base main \
    --head "$BRANCH" 2>/dev/null || echo "")

  if [[ -n "$PR_URL" ]]; then
    echo ""
    success "PR 已创建：$PR_URL"
  else
    warn "PR 创建失败（可能已存在或无 gh 权限），请手动在 GitHub 创建 PR"
  fi
fi

# ── 切回 genspark_ai_developer（开发主分支）──────────────────────────────────
git checkout genspark_ai_developer --quiet 2>/dev/null || \
  git checkout main --quiet 2>/dev/null || true

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ 完成！${NC}"
echo -e "${GREEN}  分支：${YELLOW}$BRANCH${NC}"
echo -e "${GREEN}  提交：${YELLOW}$COMMIT_MSG${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
