#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# auto-branch-push.sh  v2.0
# 每次代码修改后自动执行：
#   1. 创建规范 feature 分支（type/scope）
#   2. 提交所有变更（conventional commit 格式）
#   3. 推送 feature 分支到 GitHub
#   4. 合并到 main（--no-ff 保留分支历史）
#   5. 推送 main → 触发 Cloudflare Pages 自动部署
#   6. 同步 genspark_ai_developer 分支
#
# 用法：
#   bash scripts/auto-branch-push.sh <type> <scope> "<message>"
#
# type : feat | fix | perf | style | chore | docs | refactor
# scope: 简短英文描述（用连字符），如 token-expiry / emoji-insert
#
# 示例：
#   bash scripts/auto-branch-push.sh fix emoji-regex "修复emoji正则兼容性"
#   bash scripts/auto-branch-push.sh feat dark-mode "新增深色模式"
#   bash scripts/auto-branch-push.sh chore kv-binding "绑定 Cloudflare KV 持久化存储"
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── 颜色输出 ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
step()    { echo -e "\n${BOLD}── $1${NC}"; }

# ── 参数检查 ──────────────────────────────────────────────────────────────────
TYPE="${1:-}"
SCOPE="${2:-}"
MESSAGE="${3:-}"
VALID_TYPES="feat fix perf style chore docs refactor"

if [[ -z "$TYPE" || -z "$SCOPE" || -z "$MESSAGE" ]]; then
  echo ""
  echo -e "${BOLD}用法:${NC} bash scripts/auto-branch-push.sh <type> <scope> \"<message>\""
  echo ""
  echo "  type  : feat | fix | perf | style | chore | docs | refactor"
  echo "  scope : 简短英文描述（连字符），如 token-expiry / kv-binding"
  echo ""
  echo -e "${BOLD}示例:${NC}"
  echo "  bash scripts/auto-branch-push.sh fix   emoji-regex  \"修复emoji正则兼容性\""
  echo "  bash scripts/auto-branch-push.sh feat  dark-mode    \"新增深色模式\""
  echo "  bash scripts/auto-branch-push.sh chore kv-binding   \"绑定 KV 持久化存储\""
  echo ""
  exit 1
fi

if [[ ! " $VALID_TYPES " =~ " $TYPE " ]]; then
  error "type 无效：'$TYPE'。允许值：$VALID_TYPES"
fi

# ── 进入仓库根目录 ────────────────────────────────────────────────────────────
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"
info "仓库目录：$REPO_DIR"

REMOTE="origin"
MAIN_BRANCH="main"
DEV_BRANCH="genspark_ai_developer"
BRANCH="${TYPE}/${SCOPE}"
COMMIT_MSG="${TYPE}(${SCOPE}): ${MESSAGE}"

info "分支名：${YELLOW}$BRANCH${NC}"
info "提交：${YELLOW}$COMMIT_MSG${NC}"

# ── 检查是否有变更（已暂存 + 未暂存都算）────────────────────────────────────
STAGED=$(git diff --cached --name-only 2>/dev/null)
UNSTAGED=$(git status --porcelain 2>/dev/null)

if [[ -z "$STAGED" && -z "$UNSTAGED" ]]; then
  warn "没有检测到任何变更，退出。"
  exit 0
fi

# ── 步骤 1：暂存所有变更 ──────────────────────────────────────────────────────
step "步骤 1/6：暂存变更"
# 如果有已 staged 的文件，先把 unstaged 的也加进来
git add -A
STASH_MSG="auto-push-$(date +%s): $COMMIT_MSG"
git stash push -m "$STASH_MSG" --quiet
success "变更已暂存"

# ── 步骤 2：同步远程 main ─────────────────────────────────────────────────────
step "步骤 2/6：同步远程 main"
git fetch "$REMOTE" "$MAIN_BRANCH" --quiet
success "远程 main 已拉取"

# ── 步骤 3：创建 / 重置 feature 分支 ─────────────────────────────────────────
step "步骤 3/6：准备 feature 分支 $BRANCH"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH" --quiet
  git reset --hard "$REMOTE/$MAIN_BRANCH" --quiet
  warn "分支 '$BRANCH' 已重置到 origin/main"
else
  git checkout -b "$BRANCH" "$REMOTE/$MAIN_BRANCH" --quiet
  success "已创建新分支：$BRANCH"
fi

# ── 步骤 4：恢复变更并提交 ───────────────────────────────────────────────────
step "步骤 4/6：提交变更"
git stash pop --quiet

git add -A
echo ""
info "变更文件列表："
git status --short
echo ""

git commit -m "$COMMIT_MSG"
success "提交完成：$COMMIT_MSG"

# ── 步骤 5：推送 feature 分支 ─────────────────────────────────────────────────
step "步骤 5/6：推送 feature 分支到 GitHub"
git push -u "$REMOTE" "$BRANCH" --force-with-lease 2>&1 | grep -v "^remote:" || \
git push -u "$REMOTE" "$BRANCH" --force 2>&1 | grep -v "^remote:" || true
success "feature 分支已推送：$BRANCH"

# ── 步骤 6：合并到 main 并推送 ───────────────────────────────────────────────
step "步骤 6/6：合并到 main → 触发 Cloudflare 部署"
git checkout "$MAIN_BRANCH" --quiet
git pull "$REMOTE" "$MAIN_BRANCH" --quiet

# --no-ff 保留完整分支历史，方便回溯
git merge "$BRANCH" --no-ff -m "Merge branch '$BRANCH': $MESSAGE" --quiet
success "合并完成：$BRANCH → $MAIN_BRANCH"

# 推送 main，Cloudflare Pages 监听此分支自动部署
git push "$REMOTE" "$MAIN_BRANCH" 2>&1 | grep -v "^remote:" || true
success "main 已推送 → Cloudflare Pages 开始自动构建"

# ── 收尾：同步 genspark_ai_developer ─────────────────────────────────────────
if git show-ref --verify --quiet "refs/heads/$DEV_BRANCH"; then
  git checkout "$DEV_BRANCH" --quiet 2>/dev/null || true
  git merge "$MAIN_BRANCH" --ff-only --quiet 2>/dev/null || \
  git merge "$MAIN_BRANCH" --no-ff -m "sync: merge main into $DEV_BRANCH" --quiet 2>/dev/null || true
  git push "$REMOTE" "$DEV_BRANCH" --quiet 2>&1 | grep -v "^remote:" || true
  success "$DEV_BRANCH 已同步到最新 main"
fi

# ── 完成摘要 ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ✅ 全部完成！代码已自动部署到生产环境${NC}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════${NC}"
echo -e "  feature 分支 : ${YELLOW}$BRANCH${NC}  （已保留在 GitHub）"
echo -e "  提交信息     : ${YELLOW}$COMMIT_MSG${NC}"
echo -e "  合并路径     : ${YELLOW}$BRANCH → $MAIN_BRANCH${NC}"
echo -e "  开发分支     : ${YELLOW}$DEV_BRANCH${NC}  （已同步）"
echo -e "  Cloudflare   : ${CYAN}自动构建中，约 1-2 分钟生效${NC}"
echo -e "  生产地址     : ${CYAN}https://www.lauyiu.com${NC}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════${NC}"
echo ""
