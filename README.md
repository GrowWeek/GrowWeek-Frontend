# GrowWeek Frontend

GrowWeek 프로젝트의 프론트엔드 애플리케이션입니다.

## 기술 스택

### Core

| 기술 | 버전 | 설명 |
|------|------|------|
| [Next.js](https://nextjs.org) | 16.1.1 | React 기반 풀스택 프레임워크 (App Router) |
| [React](https://react.dev) | 19.2.3 | UI 라이브러리 |
| [TypeScript](https://www.typescriptlang.org) | ^5 | 정적 타입 언어 |

### Styling

| 기술 | 버전 | 설명 |
|------|------|------|
| [Tailwind CSS](https://tailwindcss.com) | ^4 | 유틸리티 기반 CSS 프레임워크 |
| [PostCSS](https://postcss.org) | - | CSS 변환 도구 |

### HTTP Client

| 기술 | 버전 | 설명 |
|------|------|------|
| [Axios](https://axios-http.com) | ^1.13.2 | Promise 기반 HTTP 클라이언트 |

### Development Tools

| 기술 | 버전 | 설명 |
|------|------|------|
| [ESLint](https://eslint.org) | ^9 | JavaScript/TypeScript 린터 |
| [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) | 16.1.1 | Next.js ESLint 설정 |

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   └── globals.css         # 전역 스타일
├── lib/                    # 유틸리티 및 설정
│   └── api/                # API 관련
│       ├── client.ts       # Axios 인스턴스 & 인터셉터
│       ├── types.ts        # 공통 타입 정의
│       ├── index.ts        # Export 모음
│       └── services/       # API 서비스 모듈
│           └── example.service.ts
├── public/                 # 정적 파일
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

## 시작하기

### 사전 요구사항

- Node.js 18.17 이상
- npm, yarn, pnpm 또는 bun

### 설치

```bash
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

### 린트 검사

```bash
npm run lint
```

## API 클라이언트 사용법

### 기본 사용

```typescript
import { apiClient } from "@/lib/api";

// GET 요청
const response = await apiClient.get("/users");

// POST 요청
const result = await apiClient.post("/users", { name: "John" });
```

### 서비스 모듈 사용

```typescript
import { exampleService } from "@/lib/api/services/example.service";

// 목록 조회
const items = await exampleService.getAll({ page: 1, limit: 10 });

// 단일 조회
const item = await exampleService.getById(1);

// 생성
const newItem = await exampleService.create({ title: "New", description: "..." });

// 수정
const updated = await exampleService.update(1, { title: "Updated" });

// 삭제
await exampleService.delete(1);
```

## 경로 별칭

`tsconfig.json`에 설정된 경로 별칭을 사용할 수 있습니다:

```typescript
// @/* -> ./*
import { apiClient } from "@/lib/api";
import MyComponent from "@/app/components/MyComponent";
```

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
