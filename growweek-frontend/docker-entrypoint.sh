#!/bin/sh
set -e

# 런타임 환경변수를 JavaScript 파일로 생성
# 이 파일은 클라이언트에서 window.__ENV__로 접근 가능

cat <<EOF > /app/public/env-config.js
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-http://localhost:8080}",
  LANDING_ONLY_MODE: ${LANDING_ONLY_MODE:-false},
  EMAIL_COLLECTION_API_URL: "${EMAIL_COLLECTION_API_URL:-}",
  UX_LOG_API_URL: "${UX_LOG_API_URL:-https://uxlog.team.io.kr}",
  UX_LOG_PROJECT_ID: ${UX_LOG_PROJECT_ID:-2}
};
EOF

echo "Runtime environment config generated:"
cat /app/public/env-config.js

# Next.js 서버 실행
exec node server.js

