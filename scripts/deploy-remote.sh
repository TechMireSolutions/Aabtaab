#!/usr/bin/env bash
# Runs on the production VPS after checkout. Invoked by GitHub Actions deploy workflow.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/aabtaab_next}"
DEPLOY_SHA="${DEPLOY_SHA:?DEPLOY_SHA is required}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000}"
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL_SEC="${HEALTH_INTERVAL_SEC:-2}"
# Cap Node heap so the Linux OOM killer is less likely during `next build` on small VPS.
# Exit 139 (SIGSEGV) during webpack usually means native OOM under memory pressure — not a JS exception.
NODE_BUILD_HEAP_MB="${NODE_BUILD_HEAP_MB:-1536}"
# Other PM2 apps on the same host that hold RAM during our build (space-separated).
PM2_STOP_DURING_BUILD="${PM2_STOP_DURING_BUILD:-darulquran-next}"

cd "$APP_DIR"

echo "==> Deploying ${DEPLOY_SHA} in ${APP_DIR}"

git fetch origin --prune
git reset --hard "$DEPLOY_SHA"
git clean -fd -e '.env.local' -e '.env.production.local' -e '.next.bak'

ensure_node() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    if [ -f .nvmrc ]; then
      nvm install --no-progress
      nvm use
    fi
  fi

  local version major minor
  version="$(node -v | sed 's/^v//')"
  major="${version%%.*}"
  minor="${version#*.}"
  minor="${minor%%.*}"

  if [ "$major" -lt 22 ] || { [ "$major" -eq 22 ] && [ "$minor" -lt 12 ]; }; then
    echo "::error::Node v${version} is too old (Sanity 6 and lockfile require >=22.12)."
    echo "Install nvm on the VPS, then: cd ${APP_DIR} && nvm install && nvm use"
    exit 1
  fi

  echo "==> Node $(node -v) · npm $(npm -v)"
}

log_memory() {
  echo "==> Memory before build"
  free -m || true
  if command -v pm2 >/dev/null 2>&1; then
    pm2 list || true
  fi
}

STOPPED_SIBLINGS=()

stop_siblings_for_build() {
  STOPPED_SIBLINGS=()
  if [ -z "${PM2_STOP_DURING_BUILD// }" ]; then
    return 0
  fi
  echo "==> Stopping sibling PM2 apps during build: ${PM2_STOP_DURING_BUILD}"
  local app
  for app in $PM2_STOP_DURING_BUILD; do
    if pm2 describe "$app" >/dev/null 2>&1; then
      pm2 stop "$app" >/dev/null 2>&1 || true
      STOPPED_SIBLINGS+=("$app")
    fi
  done
}

restart_siblings_after_build() {
  if [ "${#STOPPED_SIBLINGS[@]}" -eq 0 ]; then
    return 0
  fi
  local app
  for app in "${STOPPED_SIBLINGS[@]}"; do
    echo "==> Restarting sibling PM2 app: ${app}"
    pm2 start "$app" >/dev/null 2>&1 || pm2 restart "$app" >/dev/null 2>&1 || true
  done
  pm2 save >/dev/null 2>&1 || true
}

restore_previous_build() {
  if [ -d .next.bak ]; then
    echo "==> Restoring previous .next from backup"
    rm -rf .next
    mv .next.bak .next
  fi
}

start_pm2() {
  pm2 delete aabtaab-next >/dev/null 2>&1 || true
  pm2 start ecosystem.config.cjs --update-env
  pm2 save
}

run_build() {
  local mode="$1"
  # Low-mem webpack: single compile thread + smaller native threadpool.
  export NEXT_BUILD_LOW_MEM=1
  export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-2}"
  export NODE_OPTIONS="--max-old-space-size=${NODE_BUILD_HEAP_MB}${NODE_OPTIONS:+ ${NODE_OPTIONS}}"

  if [ "$mode" = "turbo" ]; then
    echo "==> Building with Turbopack (fallback · Node heap ≤ ${NODE_BUILD_HEAP_MB}MB)"
    npm run build:turbo
    return $?
  fi

  echo "==> Building with Webpack (Node heap ≤ ${NODE_BUILD_HEAP_MB}MB, low-mem=1)"
  npm run build
  return $?
}

ensure_node

if [ -f .env.production.local ]; then
  echo "==> Loading .env.production.local"
  set -a
  # shellcheck disable=SC1091
  source .env.production.local
  set +a
elif [ -f .env.local ]; then
  echo "==> Loading .env.local"
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

echo "==> Installing dependencies"
# Build needs devDependencies (Tailwind, PostCSS, TypeScript). Do not set NODE_ENV=production before install.
npm ci --no-audit --no-fund --include=dev

export NODE_ENV=production

# Free RAM before build — a concurrent `next start` + webpack OOMs / segfaults small VPS (exit 137/139).
echo "==> Stopping PM2 before build (free memory)"
pm2 stop aabtaab-next >/dev/null 2>&1 || true
stop_siblings_for_build
log_memory

if [ -d .next ]; then
  echo "==> Backing up .next → .next.bak"
  rm -rf .next.bak
  mv .next .next.bak
fi

set +e
run_build webpack
build_status=$?
set -e

# Webpack SIGSEGV (139) / OOM kill (137): retry once with Turbopack after freeing what we can.
if [ "$build_status" -eq 139 ] || [ "$build_status" -eq 137 ]; then
  echo "::warning::Webpack build exited ${build_status} (memory pressure). Retrying with Turbopack..."
  rm -rf .next
  sync || true
  sleep 2
  log_memory
  set +e
  run_build turbo
  build_status=$?
  set -e
fi

if [ "$build_status" -ne 0 ]; then
  echo "::error::Build failed with exit ${build_status} — restoring previous release"
  restore_previous_build
  start_pm2
  restart_siblings_after_build
  exit "$build_status"
fi

rm -rf .next.bak

echo "==> Restarting PM2"
start_pm2
restart_siblings_after_build

echo "==> Health check ${HEALTH_URL}"
for attempt in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS "$HEALTH_URL" -o /tmp/aabtaab-health.html; then
    # Ensure HTML references a static chunk that actually returns JS (not text/plain 500).
    chunk_path="$(
      /usr/bin/python3 - <<'PY'
import re
html = open("/tmp/aabtaab-health.html").read()
m = re.search(r"/_next/static/chunks/[^\"']+\.js", html)
print(m.group(0) if m else "")
PY
    )"
    if [ -n "$chunk_path" ]; then
      ct="$(curl -fsSI "${HEALTH_URL}${chunk_path}" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print tolower($2); exit}')"
      if echo "$ct" | grep -q 'javascript\|ecmascript\|octet-stream'; then
        echo "==> Health check passed (attempt ${attempt}/${HEALTH_RETRIES})"
        echo "==> Static chunk OK: ${chunk_path} (${ct})"
        echo "==> Deployed $(git rev-parse --short HEAD) - $(git log -1 --format=%s)"
        exit 0
      fi
      echo "==> Static chunk bad content-type: ${ct:-missing} for ${chunk_path}"
    else
      echo "==> Health HTML OK but no /_next/static chunk found yet"
    fi
  fi
  sleep "$HEALTH_INTERVAL_SEC"
done

echo "::error::Health check failed after ${HEALTH_RETRIES} attempts"
pm2 logs aabtaab-next --lines 40 --nostream || true
exit 1
