#!/usr/bin/env bash
# Runs on the production VPS after checkout. Invoked by GitHub Actions deploy workflow.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/aabtaab_next}"
DEPLOY_SHA="${DEPLOY_SHA:?DEPLOY_SHA is required}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000}"
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL_SEC="${HEALTH_INTERVAL_SEC:-2}"

cd "$APP_DIR"

echo "==> Deploying ${DEPLOY_SHA} in ${APP_DIR}"

git fetch origin --prune
git reset --hard "$DEPLOY_SHA"
git clean -fd -e '.env.local' -e '.env.production.local'

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

echo "==> Building"
npm run build

echo "==> Restarting PM2"
pm2 startOrRestart ecosystem.config.cjs --update-env
pm2 save

echo "==> Health check ${HEALTH_URL}"
for attempt in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS "$HEALTH_URL" -o /dev/null; then
    echo "==> Health check passed (attempt ${attempt}/${HEALTH_RETRIES})"
    echo "==> Deployed $(git rev-parse --short HEAD) — $(git log -1 --format='%s')"
    exit 0
  fi
  sleep "$HEALTH_INTERVAL_SEC"
done

echo "::error::Health check failed after ${HEALTH_RETRIES} attempts"
pm2 logs aabtaab-next --lines 40 --nostream || true
exit 1
