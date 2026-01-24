# ===== Stage 1: Dependencies =====
FROM node:20-alpine AS deps
WORKDIR /app

# 패키지 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci --only=production

# ===== Stage 2: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# 랜딩 전용 빌드 모드 (기본값: false)
ARG LANDING_ONLY_MODE=false
ENV LANDING_ONLY_MODE=$LANDING_ONLY_MODE
ENV NEXT_PUBLIC_LANDING_ONLY_MODE=$LANDING_ONLY_MODE

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Next.js 빌드 (LANDING_ONLY_MODE에 따라 빌드)
RUN if [ "$LANDING_ONLY_MODE" = "true" ]; then \
      npm run build:landing; \
    else \
      npm run build; \
    fi

# ===== Stage 3: Runner =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안을 위한 non-root 유저 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사 (모두 nextjs:nodejs 소유로)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 엔트리포인트 스크립트 복사
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 런타임 환경변수 (기본값)
ENV API_BASE_URL="http://localhost:8080"

# 엔트리포인트로 실행 (환경변수 주입 후 서버 시작)
ENTRYPOINT ["./docker-entrypoint.sh"]
