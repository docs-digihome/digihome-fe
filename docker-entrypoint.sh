#!/bin/sh
set -eu

# Normalize env vars from docker-compose environment.
# Compose may set BASE_URL, API_BASE_URL, ASSETS_BASE_URL or their VITE_ variants.
# Precedence for API: API_BASE_URL > BASE_URL > VITE_API_BASE_URL > VITE_BASE_URL
# Precedence for ASSETS: ASSETS_BASE_URL > VITE_ASSETS_BASE_URL > VITE_ASSETS_BASED_URL

# Ensure BASE_URL exists for template substitution
if [ -z "${BASE_URL:-}" ]; then
  if [ -n "${VITE_BASE_URL:-}" ]; then
    BASE_URL="$VITE_BASE_URL"
  else
    BASE_URL=""
  fi
fi

if [ -z "${API_BASE_URL:-}" ]; then
  if [ -n "${BASE_URL:-}" ] && [ "$BASE_URL" != "" ]; then
    API_BASE_URL="$BASE_URL"
  elif [ -n "${VITE_API_BASE_URL:-}" ]; then
    API_BASE_URL="$VITE_API_BASE_URL"
  elif [ -n "${VITE_BASE_URL:-}" ]; then
    API_BASE_URL="$VITE_BASE_URL"
  else
    API_BASE_URL=""
  fi
fi

# If API was set but BASE is empty, propagate for template completeness
if [ -z "${BASE_URL:-}" ] && [ -n "${API_BASE_URL:-}" ]; then
  BASE_URL="$API_BASE_URL"
fi

if [ -z "${ASSETS_BASE_URL:-}" ]; then
  if [ -n "${VITE_ASSETS_BASE_URL:-}" ]; then
    ASSETS_BASE_URL="$VITE_ASSETS_BASE_URL"
  elif [ -n "${VITE_ASSETS_BASED_URL:-}" ]; then
    ASSETS_BASE_URL="$VITE_ASSETS_BASED_URL"
  else
    ASSETS_BASE_URL=""
  fi
fi

export BASE_URL API_BASE_URL ASSETS_BASE_URL

TEMPLATE="/usr/share/nginx/html/config.template.js"
TARGET="/usr/share/nginx/html/config.js"

if [ ! -f "$TEMPLATE" ] && [ -f "/app/public/config.template.js" ]; then
  TEMPLATE="/app/public/config.template.js"
fi

if [ -f "$TEMPLATE" ]; then
  if command -v envsubst >/dev/null 2>&1; then
    envsubst < "$TEMPLATE" > "$TARGET"
  else
    esc_base=$(printf '%s' "$BASE_URL" | sed -e 's/[\/&]/\\&/g')
    esc_api=$(printf '%s' "$API_BASE_URL" | sed -e 's/[\/&]/\\&/g')
    esc_assets=$(printf '%s' "$ASSETS_BASE_URL" | sed -e 's/[\/&]/\\&/g')
    sed -e "s|\${BASE_URL}|${esc_base}|g" -e "s|\${API_BASE_URL}|${esc_api}|g" -e "s|\${ASSETS_BASE_URL}|${esc_assets}|g" "$TEMPLATE" > "$TARGET"
  fi
else
  cat > "$TARGET" <<EOF
window.__RUNTIME_CONFIG__ = {
  BASE_URL: "${BASE_URL}",
  API_BASE_URL: "${API_BASE_URL}",
  ASSETS_BASE_URL: "${ASSETS_BASE_URL}",
}
EOF
fi

exec "$@"
