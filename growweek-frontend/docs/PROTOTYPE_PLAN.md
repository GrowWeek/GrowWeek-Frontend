# GrowWeek 프론트엔드 프로토타입 계획서

## 📋 개요

GrowWeek는 **주간 단위 할일 관리 및 회고 시스템**입니다. 사용자는 매주 할일을 작성하고, 칸반 보드를 통해 진행 상태를 관리하며, 주간 회고를 통해 성장을 기록합니다.

### 참고 문서
- [전체 플로우](https://www.notion.so/robinjoon/2cb26f51b6c080f298c8cb701bdbe7de)
- [할일 비즈니스 규칙](https://www.notion.so/robinjoon/2cb26f51b6c08048a835d1f202c20dfe)
- [회고 비즈니스 규칙](https://www.notion.so/robinjoon/2cb26f51b6c080729cf6e6cdb4961ea8)
- API 문서: `http://localhost:8080/v3/api-docs`

---

## 🎯 핵심 기능 요약

### 전체 플로우
1. 매주 할일 작성
2. 매일 할일 추가 작성 및 칸반차트 이동 및 추가 코멘트 작성
3. 매주 금요일에 그 주 회고 작성
4. 매월 회고를 모아서 볼 수 있음

---

## 📊 도메인 모델 (API 기준)

### 1. 할일 (Task)

#### 상태 (TaskStatus)
| 상태 | 설명 |
|------|------|
| `TODO` | 할 일 |
| `IN_PROGRESS` | 진행 중 |
| `DONE` | 완료 |
| `CANCEL` | 취소 |

> 각 단계별 이동은 제약 없이 가능

#### 민감도 수준 (SensitivityLevel)
| 값 | 설명 |
|------|------|
| `NONE` | 민감하지 않음 |
| `TITLE_ONLY` | 제목만 민감 |
| `NEVER` | 항상 민감 |

#### TaskResponse (응답 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `id` | number (int64) | 할일 고유 식별자 | ✅ |
| `title` | string | 할일 제목 | ✅ |
| `description` | string | 할일 설명 | ❌ |
| `status` | TaskStatus | 할일 상태 | ✅ |
| `sensitivityLevel` | SensitivityLevel | 민감도 수준 | ✅ |
| `priority` | number (int32) | 우선순위 (1 이상, 작을수록 높음) | ✅ |
| `startDate` | string (yyyy-MM-dd) | 시작 날짜 | ✅ |
| `dueDate` | string (yyyy-MM-dd) | 마감 날짜 | ✅ |
| `hasRetrospective` | boolean | 회고 작성 여부 | ✅ |
| `createdAt` | string (ISO 8601) | 생성 일시 | ✅ |
| `updatedAt` | string (ISO 8601) | 수정 일시 | ✅ |

#### CreateTaskRequest (생성 요청 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `title` | string | 할일 제목 | ✅ |
| `description` | string | 할일 설명 | ❌ |
| `priority` | number (int32) | 우선순위 | ✅ |
| `startDate` | string (yyyy-MM-dd) | 시작 날짜 | ✅ |
| `dueDate` | string (yyyy-MM-dd) | 마감 날짜 | ✅ |
| `sensitivityLevel` | SensitivityLevel | 민감도 수준 | ❌ |

#### UpdateTaskRequest (수정 요청 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `title` | string | 할일 제목 | ❌ |
| `description` | string | 할일 설명 | ❌ |
| `status` | TaskStatus | 할일 상태 | ❌ |
| `priority` | number (int32) | 우선순위 | ❌ |
| `dueDate` | string (yyyy-MM-dd) | 마감 날짜 | ❌ |
| `sensitivityLevel` | SensitivityLevel | 민감도 수준 | ❌ |

#### TaskStatisticsResponse (통계 응답 DTO)
| 필드 | 타입 | 설명 |
|------|------|------|
| `total` | number | 전체 할일 수 |
| `todo` | number | TODO 상태 수 |
| `inProgress` | number | IN_PROGRESS 상태 수 |
| `done` | number | DONE 상태 수 |
| `cancel` | number | CANCEL 상태 수 |

#### WeeklyTaskResponse (주간 할일 응답 DTO)
| 필드 | 타입 | 설명 |
|------|------|------|
| `weekStart` | string (yyyy-MM-dd) | 주 시작일 |
| `weekEnd` | string (yyyy-MM-dd) | 주 종료일 |
| `tasks` | TaskResponse[] | 해당 주 할일 목록 |
| `statistics` | TaskStatisticsResponse | 해당 주 할일 통계 |

#### 비즈니스 규칙
- ⚠️ **`hasRetrospective`가 true인 할일은 수정 불가**

---

### 2. 회고 (Retrospective)

#### 상태 (RetrospectiveStatus)
| 상태 | 설명 |
|------|------|
| `TODO` | 최초 상태 |
| `BEFORE_GENERATE_QUESTION` | 질문 생성 전 |
| `AFTER_GENERATE_QUESTION` | 질문 생성 후, 답변 작성 전 |
| `IN_PROGRESS` | 질문 생성 후, 답변 작성 중 |
| `DONE` | 회고 완료 |

#### RetrospectiveResponse (상세 응답 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `id` | number (int64) | 회고 고유 식별자 | ✅ |
| `startDate` | string (yyyy-MM-dd) | 회고 시작일 | ✅ |
| `endDate` | string (yyyy-MM-dd) | 회고 종료일 | ✅ |
| `status` | RetrospectiveStatus | 회고 상태 | ✅ |
| `questionCount` | number (int32) | 질문 수 | ✅ |
| `questions` | QuestionResponse[] | 질문 목록 | ✅ |
| `answers` | AnswerResponse[] | 답변 목록 | ✅ |
| `additionalNotes` | string | 추가 메모 | ❌ |
| `createdAt` | string (ISO 8601) | 생성 일시 | ✅ |
| `updatedAt` | string (ISO 8601) | 수정 일시 | ✅ |

#### QuestionResponse (질문 응답 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `id` | number (int64) | 질문 고유 식별자 | ✅ |
| `content` | string | 질문 내용 | ✅ |
| `order` | number (int32) | 질문 순서 | ✅ |
| `createdAt` | string (ISO 8601) | 생성 일시 | ✅ |

#### AnswerResponse (답변 응답 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `id` | number (int64) | 답변 고유 식별자 (미답변 시 null) | ❌ |
| `questionId` | number (int64) | 질문 식별자 | ✅ |
| `content` | string | 답변 내용 | ❌ |
| `createdAt` | string (ISO 8601) | 생성 일시 | ✅ |
| `updatedAt` | string (ISO 8601) | 수정 일시 | ✅ |

#### CreateRetrospectiveRequest (생성 요청 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `startDate` | string (yyyy-MM-dd) | 회고 시작일 | ✅ |
| `endDate` | string (yyyy-MM-dd) | 회고 종료일 | ✅ |
| `questionCount` | number (int32) | 생성할 질문 수 (기본값: 3) | ✅ |

#### WriteAnswerRequest (답변 작성 요청 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `questionId` | number (int64) | 질문 식별자 | ✅ |
| `content` | string | 답변 내용 (null이면 답변 삭제) | ❌ |

#### WriteAdditionalNotesRequest (추가 메모 요청 DTO)
| 필드 | 타입 | 설명 | 필수 |
|------|------|------|------|
| `notes` | string | 추가 메모 내용 | ✅ |

#### RetrospectiveSummaryResponse (요약 응답 DTO)
| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number (int64) | 회고 고유 식별자 |
| `startDate` | string (yyyy-MM-dd) | 회고 시작일 |
| `endDate` | string (yyyy-MM-dd) | 회고 종료일 |
| `status` | RetrospectiveStatus | 회고 상태 |
| `questionCount` | number (int32) | 질문 수 |
| `answeredCount` | number (int32) | 답변 완료된 질문 수 |
| `createdAt` | string (ISO 8601) | 생성 일시 |

#### RetrospectiveStatisticsResponse (통계 응답 DTO)
| 필드 | 타입 | 설명 |
|------|------|------|
| `total` | number | 전체 회고 수 |
| `completed` | number | 완료된 회고 수 |
| `inProgress` | number | 진행 중인 회고 수 |
| `notStarted` | number | 시작하지 않은 회고 수 |

#### MonthlyRetrospectiveResponse (월간 회고 응답 DTO)
| 필드 | 타입 | 설명 |
|------|------|------|
| `year` | number (int32) | 년도 |
| `month` | number (int32) | 월 (1-12) |
| `retrospectives` | RetrospectiveSummaryResponse[] | 해당 월 회고 목록 |
| `statistics` | RetrospectiveStatisticsResponse | 해당 월 회고 통계 |

#### 비즈니스 규칙
- ⚠️ 회고 작성은 **매주 월요일 0시 0분**까지 작성 가능
- 일부 질문에만 작성 가능
- 답변 작성은 질문 순서대로 하지 않아도 됨

---

## 🔗 API 엔드포인트

### 인증
모든 API 요청에는 `X-User-Id` 헤더가 필요합니다.

```
X-User-Id: {userId} (number, int64)
```

### Task API

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/v1/tasks` | 전체 할일 목록 조회 (페이지네이션) |
| `POST` | `/api/v1/tasks` | 할일 생성 |
| `GET` | `/api/v1/tasks/{taskId}` | 할일 상세 조회 |
| `PUT` | `/api/v1/tasks/{taskId}` | 할일 수정 |
| `DELETE` | `/api/v1/tasks/{taskId}` | 할일 삭제 |
| `PATCH` | `/api/v1/tasks/{taskId}/status` | 할일 상태 변경 |
| `GET` | `/api/v1/tasks/weekly` | 주간 할일 목록 + 통계 조회 |

### Retrospective API

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/v1/retrospectives` | 회고 목록 조회 (페이지네이션) |
| `POST` | `/api/v1/retrospectives` | 회고 생성 |
| `GET` | `/api/v1/retrospectives/{retrospectiveId}` | 회고 상세 조회 |
| `DELETE` | `/api/v1/retrospectives/{retrospectiveId}` | 회고 삭제 |
| `POST` | `/api/v1/retrospectives/{retrospectiveId}/generate-questions` | AI 질문 생성 |
| `POST` | `/api/v1/retrospectives/{retrospectiveId}/answers` | 답변 작성 |
| `PUT` | `/api/v1/retrospectives/{retrospectiveId}/additional-notes` | 추가 메모 작성 |
| `POST` | `/api/v1/retrospectives/{retrospectiveId}/complete` | 회고 완료 처리 |
| `GET` | `/api/v1/retrospectives/monthly` | 월간 회고 목록 + 통계 조회 |

### 페이지네이션
두 가지 방식 지원:

**오프셋 기반:**
```
?page=0&size=20
```

**커서 기반:**
```
?cursor={cursor}&size=20
```

---

## 🗂️ 페이지 구조

```
/                           # 대시보드 (주간 요약)
├── /tasks                  # 할일 목록 (칸반 보드)
│   └── /tasks/[id]         # 할일 상세/수정
├── /retrospective          # 회고 목록
│   ├── /retrospective/write    # 회고 작성
│   └── /retrospective/[id]     # 회고 상세
├── /calendar               # 월간 캘린더 뷰
└── /settings               # 설정
```

---

## 🖼️ 화면 설계

### Phase 1: MVP (핵심 기능)

#### 1.1 대시보드 (`/`)
- 현재 주차 정보 표시 (`weekStart`, `weekEnd`)
- 이번 주 할일 통계 (`TaskStatisticsResponse` 활용)
- 회고 작성 상태 표시 (`RetrospectiveStatus`)
- 빠른 할일 추가 버튼

#### 1.2 칸반 보드 (`/tasks`)
- 4개 컬럼: TODO, IN_PROGRESS, DONE, CANCEL
- 드래그 앤 드롭으로 상태 변경 (`PATCH /api/v1/tasks/{taskId}/status`)
- 할일 카드 표시: `title`, `priority`, `dueDate`, `hasRetrospective`
- 할일 추가 모달/사이드패널

#### 1.3 할일 상세 (`/tasks/[id]`)
- 모든 필드 조회/수정
- `hasRetrospective`가 true면 수정 잠금 표시
- 삭제 기능

#### 1.4 회고 작성 (`/retrospective/write`)
- 회고 생성 (`POST /api/v1/retrospectives`)
- AI 질문 생성 버튼 (`POST .../generate-questions`)
- 질문 목록 표시 (`QuestionResponse[]`)
- 답변 입력 (`POST .../answers`)
- 추가 메모 입력 (`PUT .../additional-notes`)
- 회고 완료 버튼 (`POST .../complete`)

#### 1.5 회고 상세 (`/retrospective/[id]`)
- 질문-답변 목록 표시 (`questions`, `answers`)
- 기간 정보 (`startDate`, `endDate`)
- 진행률 표시 (`questionCount`, `answeredCount`)

### Phase 2: 확장 기능

#### 2.1 월간 회고 목록 (`/retrospective`)
- `GET /api/v1/retrospectives/monthly` 활용
- 월별 회고 목록 (`RetrospectiveSummaryResponse[]`)
- 통계 표시 (`RetrospectiveStatisticsResponse`)

#### 2.2 캘린더 뷰 (`/calendar`)
- 월간 캘린더
- 할일 `dueDate` 표시
- 회고 기간 (`startDate` ~ `endDate`) 표시

---

## 🛠️ 기술 구현 계획

### 컴포넌트 구조

```
components/
├── common/                    # 공통 컴포넌트
│   ├── Button/
│   ├── Card/
│   ├── Modal/
│   ├── Input/
│   └── Badge/
├── layout/                    # 레이아웃
│   ├── Header/
│   ├── Sidebar/
│   └── PageLayout/
├── task/                      # 할일 관련
│   ├── TaskCard/
│   ├── TaskForm/
│   ├── TaskKanban/
│   ├── TaskColumn/
│   └── TaskStatistics/
└── retrospective/             # 회고 관련
    ├── RetroCard/
    ├── RetroForm/
    ├── QuestionItem/
    ├── AnswerInput/
    └── RetroStatistics/
```

### TypeScript 타입 정의

```typescript
// types/task.ts
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCEL';
type SensitivityLevel = 'NONE' | 'TITLE_ONLY' | 'NEVER';

interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  sensitivityLevel: SensitivityLevel;
  priority: number;
  startDate: string;
  dueDate: string;
  hasRetrospective: boolean;
  createdAt: string;
  updatedAt: string;
}

// types/retrospective.ts
type RetrospectiveStatus = 
  | 'TODO' 
  | 'BEFORE_GENERATE_QUESTION' 
  | 'AFTER_GENERATE_QUESTION' 
  | 'IN_PROGRESS' 
  | 'DONE';

interface QuestionResponse {
  id: number;
  content: string;
  order: number;
  createdAt: string;
}

interface AnswerResponse {
  id?: number;
  questionId: number;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

interface RetrospectiveResponse {
  id: number;
  startDate: string;
  endDate: string;
  status: RetrospectiveStatus;
  questionCount: number;
  questions: QuestionResponse[];
  answers: AnswerResponse[];
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### API 서비스 구조

```
lib/api/services/
├── task.service.ts           # 할일 API
├── retrospective.service.ts  # 회고 API
└── types/
    ├── task.types.ts         # Task 관련 타입
    ├── retrospective.types.ts # Retrospective 관련 타입
    └── common.types.ts       # 페이지네이션 등 공통 타입
```

### 상태 관리
- **서버 상태**: React Query 또는 SWR 도입 검토
- **클라이언트 상태**: React Context 또는 Zustand
- **인증**: `X-User-Id` 헤더 관리

---

## 📅 개발 마일스톤

### Week 1: 기반 구축
- [ ] 프로젝트 구조 설정
- [ ] TypeScript 타입 정의 (API 기준)
- [ ] 공통 컴포넌트 개발 (Button, Card, Modal, Input)
- [ ] 레이아웃 컴포넌트 개발
- [ ] API 서비스 레이어 구현

### Week 2: 할일 기능
- [ ] 칸반 보드 UI 구현
- [ ] 드래그 앤 드롭 기능 (상태 변경 API 연동)
- [ ] 할일 CRUD API 연동
- [ ] 할일 상세 페이지
- [ ] 주간 할일 조회 + 통계 표시

### Week 3: 회고 기능
- [ ] 회고 생성 폼 UI
- [ ] AI 질문 생성 연동
- [ ] 질문-답변 컴포넌트
- [ ] 추가 메모 입력
- [ ] 회고 완료 처리
- [ ] 회고 상세 페이지

### Week 4: 대시보드 & 마무리
- [ ] 대시보드 UI (통계 표시)
- [ ] 월간 회고 목록
- [ ] 반응형 대응
- [ ] 테스트 및 버그 수정

---

## 🎨 UI/UX 고려사항

### 디자인 원칙
1. **직관적인 칸반 보드**: 드래그 앤 드롭으로 쉬운 상태 변경
2. **명확한 상태 표시**: 색상 코드로 진행 상태 구분
3. **마감일 강조**: 임박한 `dueDate` 시각적 알림
4. **회고 유도**: 금요일에 회고 작성 리마인더
5. **수정 잠금 표시**: `hasRetrospective`가 true인 할일 시각적 구분

### 색상 체계 (예시)
| 상태 | 색상 |
|------|------|
| TODO | Gray |
| IN_PROGRESS | Blue |
| DONE | Green |
| CANCEL | Red |

### 우선순위 표시
| priority | 표시 |
|----------|------|
| 1 | 🔴 높음 |
| 2 | 🟡 중간 |
| 3+ | 🟢 낮음 |

### 반응형 대응
- Desktop: 4컬럼 칸반 보드
- Tablet: 2컬럼 또는 스크롤 가능한 4컬럼
- Mobile: 세로 스크롤 리스트 뷰

---

## ⚠️ 주의사항

### 비즈니스 규칙 준수
1. **할일 수정 제한**: `hasRetrospective === true`인 할일은 읽기 전용으로 표시
2. **회고 마감**: 월요일 0시 이후 이전 주 회고 작성 불가 처리
3. **상태 전환**: 모든 TaskStatus 간 자유로운 이동 허용

### 에러 처리
- 네트워크 오류 시 재시도 옵션
- 유효성 검사 실패 시 명확한 에러 메시지
- 권한 없는 수정 시도 시 안내 메시지 (hasRetrospective 체크)

### 헤더 관리
- 모든 API 요청에 `X-User-Id` 헤더 필수 포함
- API 클라이언트 인터셉터에서 자동 처리

---

## 📝 다음 단계

1. ✅ **API 명세 확인 완료**
2. **타입 정의 파일 생성**: `lib/api/types/` 폴더에 TypeScript 타입 정의
3. **서비스 레이어 구현**: 실제 API 엔드포인트에 맞춘 서비스 파일 작성
4. **프로토타입 구현**: Phase 1 MVP 개발 시작

---

*문서 최종 수정일: 2025-12-26*
*API 버전: v0 (OpenAPI 3.1.0)*
