#!/bin/sh
set -eu

# Support both plain and VITE_ prefixed env vars from docker-compose environment.
# Precedence: API_BASE_URL > VITE_API_BASE_URL > VITE_BASE_URL
#            ASSETS_BASE_URL > VITE_ASSETS_BASE_URL > VITE_ASSETS_BASED_URL (typo kept for compat)
if [ -z "${API_BASE_URL:-}" ]; then
  if [ -n "${VITE_API_BASE_URL:-}" ]; then
    API_BASE_URL="$VITE_API_BASE_URL"
  elif [ -n "${VITE_BASE_URL:-}" ]; then
    API_BASE_URL="$VITE_BASE_URL"
  else
    API_BASE_URL=""
  fi
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

export API_BASE_URL ASSETS_BASE_URL

TEMPLATE="/usr/share/nginx/html/config.template.js"
TARGET="/usr/share/nginx/html/config.js"

# Fallback: if nginx html not yet populated (e.g. running outside container), try repo path
if [ ! -f "$TEMPLATE" ] && [ -f "/app/public/config.template.js" ]; then
  TEMPLATE="/app/public/config.template.js"
fi

if [ -f "$TEMPLATE" ]; then
  if command -v envsubst >/dev/null 2>&1; then
    envsubst < "$TEMPLATE" > "$TARGET"
  else
    # POSIX sed fallback — escape & and / in values
    esc_api=$(printf '%s' "$API_BASE_URL" | sed -e 's/[\/&]/\\&/g')
    esc_assets=$(printf '%s' "$ASSETS_BASE_URL" | sed -e 's/[\/&]/\\&/g')
    sed -e "s|\${API_BASE_URL}|${esc_api}|g" -e "s|\${ASSETS_BASE_URL}|${esc_assets}|g" "$TEMPLATE" > "$TARGET"
  fi
else
  # No template — generate directly
  cat > "$TARGET" <<EOF
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}",
  ASSETS_BASE_URL: "${ASSETS_BASE_URL}",
}
EOF
fi

exec "$@"
