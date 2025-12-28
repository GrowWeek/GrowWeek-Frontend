# GrowWeek Frontend - Kubernetes 배포 가이드

## 개요

이 문서는 GrowWeek Frontend 애플리케이션을 Kubernetes 클러스터에 Helm 차트로 배포하는 방법을 설명합니다.

---

## 1. 사전 준비사항

### 필수 도구
- Docker (이미지 빌드용)
- kubectl (K8s 클러스터 접근용)
- Helm 3.x
- Container Registry 접근 권한 (Docker Hub, Harbor, ECR 등)

### 환경 변수
배포 전 다음 환경 변수들을 확인하세요:
- `API_BASE_URL`: 백엔드 API 서버 URL (런타임에 주입됨)

> **참고**: 이 프로젝트는 **런타임 환경변수 주입** 방식을 사용합니다.
> 하나의 Docker 이미지로 개발/운영 환경 모두 배포할 수 있습니다.

---

## 2. Docker 이미지 빌드

### 2.1 Dockerfile

프로젝트 루트의 `Dockerfile` (런타임 환경변수 주입 지원):

```dockerfile
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

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Next.js 빌드 (환경변수 없이 빌드 - 런타임에 주입됨)
RUN npm run build

# ===== Stage 3: Runner =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안을 위한 non-root 유저 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사
COPY --from=builder /app/public ./public
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
```

### 2.2 docker-entrypoint.sh

컨테이너 시작 시 환경변수를 JavaScript 파일로 주입하는 스크립트:

```bash
#!/bin/sh
set -e

# 런타임 환경변수를 JavaScript 파일로 생성
# 이 파일은 클라이언트에서 window.__ENV__로 접근 가능

cat <<EOF > /app/public/env-config.js
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-http://localhost:8080}"
};
EOF

echo "Runtime environment config generated:"
cat /app/public/env-config.js

# Next.js 서버 실행
exec node server.js
```

### 2.3 .dockerignore

불필요한 파일을 제외하기 위해 `.dockerignore`를 생성합니다:

```
node_modules
.next
.git
.gitignore
README.md
docs/
*.log
.env*
.DS_Store
```

### 2.4 Next.js 설정 업데이트

Standalone 모드를 활성화하기 위해 `next.config.ts`를 수정합니다:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

### 2.5 이미지 빌드 & 푸시

```bash
# 이미지 빌드 (환경변수 없이 - 런타임에 주입됨)
docker build -t your-registry.com/growweek-frontend:v0.1.0 .

# 레지스트리에 푸시
docker push your-registry.com/growweek-frontend:v0.1.0
```

### 2.6 로컬에서 Docker 테스트

```bash
# 개발 API 서버로 테스트
docker run -p 3000:3000 \
  -e API_BASE_URL=https://api-dev.your-domain.com \
  your-registry.com/growweek-frontend:v0.1.0

# 운영 API 서버로 테스트 (같은 이미지!)
docker run -p 3000:3000 \
  -e API_BASE_URL=https://api.your-domain.com \
  your-registry.com/growweek-frontend:v0.1.0
```

---

## 3. Helm 차트 구성

### 3.1 차트 디렉토리 구조

```
helm/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── _helpers.tpl
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    ├── hpa.yaml
    └── NOTES.txt
```

### 3.2 Chart.yaml

```yaml
apiVersion: v2
name: growweek-frontend
description: GrowWeek Frontend Application Helm Chart
type: application
version: 0.1.0
appVersion: "0.1.0"
```

### 3.3 values.yaml (기본 설정)

```yaml
# 기본 설정
replicaCount: 2

image:
  repository: your-registry.com/growweek-frontend
  tag: "v0.1.0"
  pullPolicy: IfNotPresent

imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""

# 서비스 설정
service:
  type: ClusterIP
  port: 80
  targetPort: 3000

# Ingress 설정
ingress:
  enabled: true
  className: nginx  # 또는 traefik, istio 등
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    # TLS 사용시
    # cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: growweek.your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls: []
  # - secretName: growweek-tls
  #   hosts:
  #     - growweek.your-domain.com

# 리소스 제한
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi

# Autoscaling 설정
autoscaling:
  enabled: false
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80

# 환경 변수 (런타임에 주입됨)
env:
  API_BASE_URL: "https://api.your-domain.com"

# 헬스체크 설정
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3

# Pod 스케줄링 설정
nodeSelector: {}
tolerations: []
affinity: {}

# Pod 보안 설정
podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1001
  fsGroup: 1001

securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: false
  capabilities:
    drop:
      - ALL
```

### 3.4 templates/_helpers.tpl

```yaml
{{/*
앱 이름
*/}}
{{- define "growweek-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
풀네임
*/}}
{{- define "growweek-frontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
차트 라벨
*/}}
{{- define "growweek-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
공통 라벨
*/}}
{{- define "growweek-frontend.labels" -}}
helm.sh/chart: {{ include "growweek-frontend.chart" . }}
{{ include "growweek-frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
셀렉터 라벨
*/}}
{{- define "growweek-frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "growweek-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

### 3.5 templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "growweek-frontend.fullname" . }}
  labels:
    {{- include "growweek-frontend.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "growweek-frontend.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "growweek-frontend.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
              protocol: TCP
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          livenessProbe:
            {{- toYaml .Values.livenessProbe | nindent 12 }}
          readinessProbe:
            {{- toYaml .Values.readinessProbe | nindent 12 }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

### 3.6 templates/service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "growweek-frontend.fullname" . }}
  labels:
    {{- include "growweek-frontend.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
      protocol: TCP
      name: http
  selector:
    {{- include "growweek-frontend.selectorLabels" . | nindent 4 }}
```

### 3.7 templates/ingress.yaml

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "growweek-frontend.fullname" . }}
  labels:
    {{- include "growweek-frontend.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .Values.ingress.className }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "growweek-frontend.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
```

### 3.8 templates/hpa.yaml (선택적)

```yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "growweek-frontend.fullname" . }}
  labels:
    {{- include "growweek-frontend.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "growweek-frontend.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    {{- end }}
    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
    {{- end }}
{{- end }}
```

### 3.9 templates/NOTES.txt

```
GrowWeek Frontend가 성공적으로 배포되었습니다!

1. 애플리케이션 URL 확인:
{{- if .Values.ingress.enabled }}
{{- range $host := .Values.ingress.hosts }}
  http{{ if $.Values.ingress.tls }}s{{ end }}://{{ $host.host }}
{{- end }}
{{- else if contains "NodePort" .Values.service.type }}
  export NODE_PORT=$(kubectl get --namespace {{ .Release.Namespace }} -o jsonpath="{.spec.ports[0].nodePort}" services {{ include "growweek-frontend.fullname" . }})
  export NODE_IP=$(kubectl get nodes --namespace {{ .Release.Namespace }} -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
{{- else if contains "ClusterIP" .Values.service.type }}
  kubectl --namespace {{ .Release.Namespace }} port-forward svc/{{ include "growweek-frontend.fullname" . }} 8080:{{ .Values.service.port }}
  echo "http://localhost:8080"
{{- end }}

2. Pod 상태 확인:
  kubectl get pods -n {{ .Release.Namespace }} -l "app.kubernetes.io/name={{ include "growweek-frontend.name" . }}"

3. 로그 확인:
  kubectl logs -n {{ .Release.Namespace }} -l "app.kubernetes.io/name={{ include "growweek-frontend.name" . }}" -f
```

---

## 4. 배포 명령어

### 4.1 Helm 차트 검증

```bash
# 문법 검사
helm lint ./helm

# 렌더링된 매니페스트 확인
helm template growweek-frontend ./helm -f ./helm/values.yaml
```

### 4.2 배포 (Install)

```bash
# 기본 배포
helm install growweek-frontend ./helm \
  --namespace growweek \
  --create-namespace

# 환경별 values 파일 사용
helm install growweek-frontend ./helm \
  --namespace growweek-dev \
  --create-namespace \
  -f ./helm/values-dev.yaml

# 특정 값 오버라이드
helm install growweek-frontend ./helm \
  --namespace growweek \
  --set image.tag=v0.2.0 \
  --set ingress.hosts[0].host=growweek.example.com
```

### 4.3 업그레이드

```bash
# 이미지 태그만 업데이트
helm upgrade growweek-frontend ./helm \
  --namespace growweek \
  --set image.tag=v0.2.0

# 전체 values 파일로 업그레이드
helm upgrade growweek-frontend ./helm \
  --namespace growweek \
  -f ./helm/values-prod.yaml
```

### 4.4 롤백

```bash
# 이전 버전 확인
helm history growweek-frontend -n growweek

# 특정 리비전으로 롤백
helm rollback growweek-frontend 1 -n growweek
```

### 4.5 삭제

```bash
helm uninstall growweek-frontend -n growweek
```

---

## 5. 환경별 설정 예시

### values-dev.yaml

```yaml
replicaCount: 1

resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 200m
    memory: 256Mi

env:
  API_BASE_URL: "https://api-dev.your-domain.com"

ingress:
  hosts:
    - host: growweek-dev.your-domain.com
      paths:
        - path: /
          pathType: Prefix
```

### values-prod.yaml

```yaml
replicaCount: 3

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10

resources:
  requests:
    cpu: 200m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi

env:
  API_BASE_URL: "https://api.your-domain.com"

ingress:
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: growweek.your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: growweek-tls
      hosts:
        - growweek.your-domain.com
```

---

## 6. CI/CD 파이프라인 예시

### GitHub Actions (.github/workflows/deploy.yaml)

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

env:
  REGISTRY: your-registry.com
  IMAGE_NAME: growweek-frontend

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha,prefix=

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./growweek-frontend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          # 환경변수는 런타임에 주입되므로 build-args 불필요
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - uses: actions/checkout@v4

      - name: Set up Helm
        uses: azure/setup-helm@v3

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to Kubernetes
        run: |
          helm upgrade --install growweek-frontend ./helm \
            --namespace growweek \
            --set image.tag=${GITHUB_REF#refs/tags/} \
            -f ./helm/values-prod.yaml \
            --wait --timeout 5m
```

---

## 7. 트러블슈팅

### 일반적인 문제들

**1. 이미지 Pull 실패**
```bash
# imagePullSecrets 설정 확인
kubectl get secret regcred -n growweek

# Secret 생성 (필요시)
kubectl create secret docker-registry regcred \
  --docker-server=your-registry.com \
  --docker-username=user \
  --docker-password=pass \
  -n growweek
```

**2. Pod CrashLoopBackOff**
```bash
# 로그 확인
kubectl logs -n growweek deployment/growweek-frontend --previous

# 컨테이너 진입
kubectl exec -it -n growweek deployment/growweek-frontend -- sh
```

**3. Ingress 접근 불가**
```bash
# Ingress Controller 확인
kubectl get pods -n ingress-nginx

# Ingress 상태 확인
kubectl describe ingress -n growweek growweek-frontend
```

---

## 8. 보안 고려사항

1. **이미지 스캐닝**: 배포 전 취약점 스캔 (Trivy, Snyk 등)
2. **Secret 관리**: Kubernetes Secrets 또는 외부 시크릿 관리 도구 (Vault, Sealed Secrets)
3. **Network Policy**: Pod 간 통신 제한
4. **RBAC**: 최소 권한 원칙 적용
5. **Pod Security Standards**: restricted 또는 baseline 정책 적용

---

## 9. 체크리스트

### 배포 전
- [ ] Docker 이미지 빌드 및 테스트 완료
- [ ] 이미지가 레지스트리에 푸시됨
- [ ] Helm 차트 lint 통과
- [ ] 환경별 values 파일 준비
- [ ] TLS 인증서 준비 (필요시)

### 배포 후
- [ ] Pod가 Running 상태인지 확인
- [ ] 헬스체크 통과 확인
- [ ] Ingress를 통한 외부 접근 확인
- [ ] 로그에 에러 없음 확인
- [ ] 모니터링 연동 확인 (Prometheus, Grafana 등)

