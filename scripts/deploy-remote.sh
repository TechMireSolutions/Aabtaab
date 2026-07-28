#!/usr/bin/env bash
# Runs on the production VPS after checkout. Invoked by GitHub Actions deploy workflow.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/aabtaab_next}"
DEPLOY_SHA="${DEPLOY_SHA:?DEPLOY_SHA is required}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000}"
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL_SEC="${HEALTH_INTERVAL_SEC:-2}"
# Cap Node heap so the Linux OOM killer is less likely during `next build` on small VPS.
NODE_BUILD_HEAP_MB="${NODE_BUILD_HEAP_MB:-1536}"

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

# Free RAM before build — a concurrent `next start` + Turbopack build OOMs small VPS (exit 137).
echo "==> Stopping PM2 before build (free memory)"
pm2 stop aabtaab-next >/dev/null 2>&1 || true

if [ -d .next ]; then
  echo "==> Backing up .next → .next.bak"
  rm -rf .next.bak
  mv .next .next.bak
fi

echo "==> Building (Node heap ≤ ${NODE_BUILD_HEAP_MB}MB)"
# Webpack build uses less peak RAM than default Turbopack on 1–2GB VPS hosts.
set +e
NODE_OPTIONS="--max-old-space-size=${NODE_BUILD_HEAP_MB}${NODE_OPTIONS:+ ${NODE_OPTIONS}}" \
  npm run build
build_status=$?
set -e

if [ "$build_status" -ne 0 ]; then
  echo "::error::Build failed with exit ${build_status} — restoring previous release"
  restore_previous_build
  start_pm2
  exit "$build_status"
fi

rm -rf .next.bak

echo "==> Restarting PM2"
start_pm2

echo "==> Health check ${HEALTH_URL}"
for attempt in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS "$HEALTH_URL" -o /tmp/aabtaab-health.html; then
    # Ensure HTML references a static chunk that actually returns JS (not text/plain 500).
    chunk_path="$(
      /usr/bin/python3 - <<'PY' 2>/dev/null || true
import re
html=open("/tmp/aabtaab-health.html").read()
m=re.search(r'/_next/static/chunks/[^"\']+\.js', html)
print(m.group(0) if m else "")
PY
    )"
    if [ -n "$chunk_path" ]; then
      ct="$(curl -fsSI "${HEALTH_URL}${chunk_path}" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print tolower($2); exit}')"
      if echo "$ct" | grep -q 'javascript\|ecmascript\|octet-stream'; then
        echo "==> Health check passed (attempt ${attempt}/${HEALTH_RETRIES})"
        echo "==> Static chunk OK: ${chunk_path} (${ct})"
        echo "==> Deployed $(git rev-parse --short HEAD) — $(git log -1 --format='%s')"
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
