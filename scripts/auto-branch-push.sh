#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# auto-branch-push.sh
# 每次迭代后自动创建规范分支、提交、推送、并直接合并到 main
# Cloudflare Pages 监听 main 分支，合并后自动触发部署
#
# 用法：
#   bash scripts/auto-branch-push.sh <type> <scope> "<message>"
#
# type : feat | fix | perf | style | chore | docs | refactor
# scope: 简短英文描述，如 token-expiry / emoji-insert
#
# 示例：
#   bash scripts/auto-branch-push.sh fix emoji-regex "修复emoji正则兼容性"
#   bash scripts/auto-branch-push.sh feat dark-mode "新增深色模式"
# ─────────────────────────────────────────────────────────────────────────────

set -e

# ── 颜色输出 ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── 参数检查 ──────────────────────────────────────────────────────────────────
TYPE="$1"; SCOPE="$2"; MESSAGE="$3"
VALID_TYPES="feat fix perf style chore docs refactor"

if [[ -z "$TYPE" || -z "$SCOPE" || -z "$MESSAGE" ]]; then
  echo ""
  echo "用法: bash scripts/auto-branch-push.sh <type> <scope> \"<message>\""
  echo ""
  echo "  type  : feat | fix | perf | style | chore | docs | refactor"
  echo "  scope : 简短英文描述（连字符），如 token-expiry"
  echo ""
  echo "示例:"
  echo "  bash scripts/auto-branch-push.sh fix emoji-regex \"修复emoji正则兼容性\""
  exit 1
fi

if [[ ! " $VALID_TYPES " =~ " $TYPE " ]]; then
  error "type 无效：'$TYPE'。允许值：$VALID_TYPES"
fi

# ── 进入仓库根目录 ────────────────────────────────────────────────────────────
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"
info "仓库目录：$REPO_DIR"

# ── 检查是否有变更 ────────────────────────────────────────────────────────────
if [[ -z "$(git status --porcelain)" ]]; then
  warn "没有检测到任何变更，退出。"
  exit 0
fi

BRANCH="${TYPE}/${SCOPE}"
COMMIT_MSG="${TYPE}(${SCOPE}): ${MESSAGE}"
CURRENT=$(git branch --show-current)

info "分支名：$BRANCH"
info "提交：$COMMIT_MSG"

# ── 步骤 1：暂存当前变更 ──────────────────────────────────────────────────────
info "暂存当前变更..."
git stash push -u -m "auto-push: $COMMIT_MSG" --quiet

# ── 步骤 2：同步远程 main ─────────────────────────────────────────────────────
info "同步远程 main..."
git fetch origin main --quiet

# ── 步骤 3：从 origin/main 创建/重置 feature 分支 ────────────────────────────
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH" --quiet
  git reset --hard origin/main --quiet
  warn "分支 '$BRANCH' 已重置到 origin/main"
else
  git checkout -b "$BRANCH" origin/main --quiet
  info "已创建分支：$BRANCH"
fi

# ── 步骤 4：恢复变更到新分支 ─────────────────────────────────────────────────
info "应用变更到分支 $BRANCH..."
git stash pop --quiet

# ── 步骤 5：提交 ──────────────────────────────────────────────────────────────
git add -A
echo ""
info "变更文件："
git status --short
echo ""
git commit -m "$COMMIT_MSG"
success "提交完成"

# ── 步骤 6：推送 feature 分支 ─────────────────────────────────────────────────
info "推送 $BRANCH 到 GitHub..."
git push -u origin "$BRANCH" --force 2>&1 | grep -v "^remote:" || true
success "feature 分支推送完成"

# ── 步骤 7：合并到 main ───────────────────────────────────────────────────────
info "合并 $BRANCH → main..."
git checkout main --quiet
git pull origin main --quiet

# 执行 merge（--no-ff 保留分支历史）
git merge "$BRANCH" --no-ff -m "Merge branch '$BRANCH': $MESSAGE" --quiet
success "合并完成"

# ── 步骤 8：推送 main（触发 Cloudflare 自动部署）────────────────────────────
info "推送 main 到 GitHub（触发 Cloudflare 部署）..."
git push origin main 2>&1 | grep -v "^remote:" || true
success "main 分支推送完成 → Cloudflare 将自动部署"

# ── 步骤 9：切回开发分支 ──────────────────────────────────────────────────────
git checkout genspark_ai_developer --quiet 2>/dev/null || \
git checkout main --quiet 2>/dev/null || true

# 同步 genspark_ai_developer 到最新 main
git merge main --ff-only --quiet 2>/dev/null || true

echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ 全部完成！已自动部署到生产环境${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "  分支   : ${YELLOW}$BRANCH${NC}"
echo -e "  提交   : ${YELLOW}$COMMIT_MSG${NC}"
echo -e "  已合并 : ${YELLOW}$BRANCH → main${NC}"
echo -e "  部署   : ${CYAN}Cloudflare Pages 正在自动构建...${NC}"
echo -e "  网址   : ${CYAN}https://www.lauyiu.com${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo ""
