# API 마이그레이션 계획서: WeekId 기반 기간 관리

## 개요

백엔드에서 기존 날짜 범위 기반(`startDate`, `endDate`, `weekStart`, `weekEnd`) 기간 관리를 **WeekId** 기반으로 변경함에 따른 프론트엔드 수정 계획서입니다.

### WeekId 형식
- **형식**: `YYYY-Www` (ISO 8601 Week Date)
- **예시**: `2025-W02` (2025년 2주차)

---

## 1. 주요 변경사항 요약

### 1.1 Task API 변경

| 항목 | 기존 | 변경 후 |
|------|------|---------|
| 주간 할일 조회 파라미터 | `weekStart` (yyyy-MM-dd) | `weekId` (YYYY-Www) |
| TaskResponse 필드 | `startDate`, `dueDate` | `weekId`, `dueDate` |
| WeeklyTaskResponse 필드 | `weekStart`, `weekEnd`, `tasks`, `statistics` | `weekId`, `tasks`, `statistics` |
| CreateTaskRequest 필드 | `startDate`, `dueDate`, ... | `dueDate`, ... (weekId 자동 계산) |

### 1.2 Retrospective API 변경

| 항목 | 기존 | 변경 후 |
|------|------|---------|
| RetrospectiveResponse 필드 | `startDate`, `endDate` | `weekId` |
| RetrospectiveSummaryResponse 필드 | `startDate`, `endDate` | `weekId` |
| CreateRetrospectiveRequest 필드 | `startDate`, `endDate`, `questionCount` | `weekId`, `questionCount` |

### 1.3 새로운 응답 필드

**TaskResponse**:
- `hasRetrospective`: boolean (회고 작성 여부)

**RetrospectiveSummaryResponse**:
- `answeredCount`: number (답변 완료된 질문 수)

---

## 2. 수정 대상 파일 목록

### 2.1 타입 정의 파일

#### `lib/api/types/task.ts`
```typescript
// 변경 전
interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  sensitivityLevel: SensitivityLevel;
  priority: number;
  startDate: string;      // 제거
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// 변경 후
interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  sensitivityLevel: SensitivityLevel;
  priority: number;
  weekId: string;         // 추가 (YYYY-Www)
  dueDate: string;
  hasRetrospective: boolean;  // 추가
  createdAt: string;
  updatedAt: string;
}
```

```typescript
// 변경 전
interface WeeklyTaskResponse {
  weekStart: string;
  weekEnd: string;
  tasks: TaskResponse[];
  statistics: TaskStatisticsResponse;
}

// 변경 후
interface WeeklyTaskResponse {
  weekId: string;         // YYYY-Www 형식
  tasks: TaskResponse[];
  statistics: TaskStatisticsResponse;
}
```

```typescript
// 변경 전
interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: number;
  startDate: string;      // 제거
  dueDate: string;
  sensitivityLevel?: SensitivityLevel;
}

// 변경 후
interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: number;
  dueDate: string;        // 이 날짜로 weekId 자동 계산
  sensitivityLevel?: SensitivityLevel;
}
```

#### `lib/api/types/retrospective.ts`
```typescript
// 변경 전
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

// 변경 후
interface RetrospectiveResponse {
  id: number;
  weekId: string;         // YYYY-Www 형식
  status: RetrospectiveStatus;
  questionCount: number;
  questions: QuestionResponse[];
  answers: AnswerResponse[];
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
```

```typescript
// 변경 전
interface RetrospectiveSummaryResponse {
  id: number;
  startDate: string;
  endDate: string;
  status: RetrospectiveStatus;
  questionCount: number;
  createdAt: string;
}

// 변경 후
interface RetrospectiveSummaryResponse {
  id: number;
  weekId: string;         // YYYY-Www 형식
  status: RetrospectiveStatus;
  questionCount: number;
  answeredCount: number;  // 추가
  createdAt: string;
}
```

```typescript
// 변경 전
interface CreateRetrospectiveRequest {
  startDate: string;
  endDate: string;
  questionCount: number;
}

// 변경 후
interface CreateRetrospectiveRequest {
  weekId: string;         // YYYY-Www 형식
  questionCount: number;
}
```

---

### 2.2 API 서비스 파일

#### `lib/api/services/task.service.ts`
```typescript
// 변경 전
async getWeekly(weekStart: string): Promise<WeeklyTaskResponse> {
  const response = await apiClient.get('/api/v1/tasks/weekly', {
    params: { weekStart }
  });
  return response.data;
}

// 변경 후
async getWeekly(weekId: string): Promise<WeeklyTaskResponse> {
  const response = await apiClient.get('/api/v1/tasks/weekly', {
    params: { weekId }
  });
  return response.data;
}
```

#### `lib/api/services/retrospective.service.ts`
- `create()` 메서드: `startDate`, `endDate` 대신 `weekId` 사용
- 기존 로직에서 날짜 범위로 회고를 찾는 부분 → `weekId`로 변경

---

### 2.3 유틸리티 파일

#### `lib/utils/date.ts` - 새로운 함수 추가 필요

```typescript
/**
 * 주어진 날짜의 WeekId를 반환합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns WeekId (YYYY-Www 형식, 예: 2025-W02)
 */
export function getWeekId(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  // ISO 8601 week number 계산
  const temp = new Date(d.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - (temp.getDay() + 6) % 7);
  const week1 = new Date(temp.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(
    ((temp.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7
  );

  // ISO 8601에서 연도는 주가 속한 연도 (1월 1일이 아님)
  const year = temp.getFullYear();

  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * 현재 주의 WeekId를 반환합니다.
 * @returns WeekId (YYYY-Www 형식)
 */
export function getCurrentWeekId(): string {
  return getWeekId(new Date());
}

/**
 * WeekId를 파싱하여 해당 주의 시작일(월요일)과 종료일(일요일)을 반환합니다.
 * @param weekId WeekId (YYYY-Www 형식)
 * @returns { start: Date, end: Date }
 */
export function parseWeekId(weekId: string): { start: Date; end: Date } {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid weekId format: ${weekId}`);
  }

  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);

  // ISO 8601: 1월 4일이 포함된 주가 1주차
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // 일요일을 7로 변환

  // 1주차의 월요일 계산
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - dayOfWeek + 1);

  // 원하는 주의 월요일 계산
  const start = new Date(week1Monday);
  start.setDate(week1Monday.getDate() + (week - 1) * 7);
  start.setHours(0, 0, 0, 0);

  // 일요일 계산
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * WeekId를 한국어 형식으로 표시합니다.
 * @param weekId WeekId (YYYY-Www 형식)
 * @returns "M월 D일 ~ M월 D일" 형식
 */
export function formatWeekIdKorean(weekId: string): string {
  const { start, end } = parseWeekId(weekId);
  return formatDateRangeKorean(formatDate(start), formatDate(end));
}

/**
 * 두 WeekId가 같은지 비교합니다.
 */
export function isSameWeek(weekId1: string, weekId2: string): boolean {
  return weekId1 === weekId2;
}

/**
 * 주어진 날짜가 특정 WeekId에 속하는지 확인합니다.
 */
export function isDateInWeek(date: Date | string, weekId: string): boolean {
  return getWeekId(date) === weekId;
}
```

---

### 2.4 페이지 컴포넌트 파일

#### `app/page.tsx` (대시보드)
```typescript
// 변경 전
const weekStart = formatDate(getWeekStart());
const weekEnd = formatDate(getWeekEnd());
const tasksData = await taskService.getWeekly(weekStart);
const currentWeekRetro = retrospectives.items.find(
  r => r.startDate === weekStart || r.endDate === weekEnd
);

// 변경 후
const currentWeekId = getCurrentWeekId();
const tasksData = await taskService.getWeekly(currentWeekId);
const currentWeekRetro = retrospectives.items.find(
  r => r.weekId === currentWeekId
);
```

#### `app/tasks/page.tsx` (할일 관리)
```typescript
// 변경 전
const weekStart = formatDate(getWeekStart());
const weekEnd = formatDate(getWeekEnd());
const weeklyData = await taskService.getWeekly(weekStart);
const currentWeekRetro = retrospectives.items.find(
  r => r.startDate === weekStart || r.endDate === weekEnd
);

// 변경 후
const currentWeekId = getCurrentWeekId();
const weeklyData = await taskService.getWeekly(currentWeekId);
const currentWeekRetro = retrospectives.items.find(
  r => r.weekId === currentWeekId
);

// 할일 생성 시
// 변경 전
const createData = {
  title, description, priority, startDate, dueDate, sensitivityLevel
};

// 변경 후
const createData = {
  title, description, priority, dueDate, sensitivityLevel
  // startDate 제거, weekId는 서버에서 dueDate 기반으로 자동 계산
};
```

#### `app/retrospective/page.tsx` (회고 목록)
```typescript
// 표시 로직 변경
// 변경 전
const dateRange = `${formatDateKorean(r.startDate)} ~ ${formatDateKorean(r.endDate)}`;

// 변경 후
const dateRange = formatWeekIdKorean(r.weekId);
// 또는
const { start, end } = parseWeekId(r.weekId);
const dateRange = formatDateRangeKorean(formatDate(start), formatDate(end));
```

#### `app/retrospective/write/page.tsx` (회고 작성)
```typescript
// 변경 전
const weekStart = formatDate(getWeekStart());
const weekEnd = formatDate(getWeekEnd());
const existingRetro = list.items.find(
  r => r.startDate === weekStart || r.endDate === weekEnd
);
const created = await retrospectiveService.create({
  startDate: weekStart,
  endDate: weekEnd,
  questionCount: 3
});

// 변경 후
const currentWeekId = getCurrentWeekId();
const existingRetro = list.items.find(
  r => r.weekId === currentWeekId
);
const created = await retrospectiveService.create({
  weekId: currentWeekId,
  questionCount: 3
});
```

#### `app/retrospective/[id]/page.tsx` (회고 상세)
```typescript
// 표시 로직 변경
// 변경 전
const dateRange = `${formatDateKorean(retrospective.startDate)} ~ ${formatDateKorean(retrospective.endDate)}`;

// 변경 후
const dateRange = formatWeekIdKorean(retrospective.weekId);
```

---

### 2.5 회고 작성 기간 관련 로직 수정

`lib/utils/date.ts`의 회고 작성 기간 관련 함수들은 WeekId와 함께 동작하도록 수정이 필요합니다.

```typescript
/**
 * 특정 WeekId의 회고 작성 기간을 반환합니다.
 * 작성 가능 기간: 해당 주의 금요일 00:00 ~ 다음 주 월요일 00:00
 */
export function getRetrospectiveWritePeriodForWeek(weekId: string): {
  startTime: Date;
  endTime: Date;
  isWithinPeriod: boolean;
} {
  const { start } = parseWeekId(weekId);

  // 금요일 00:00 (월요일 + 4일)
  const friday = new Date(start);
  friday.setDate(start.getDate() + 4);
  friday.setHours(0, 0, 0, 0);

  // 다음 주 월요일 00:00 (월요일 + 7일)
  const nextMonday = new Date(start);
  nextMonday.setDate(start.getDate() + 7);
  nextMonday.setHours(0, 0, 0, 0);

  const now = new Date();
  const isWithinPeriod = now >= friday && now < nextMonday;

  return { startTime: friday, endTime: nextMonday, isWithinPeriod };
}

/**
 * 특정 WeekId의 회고 작성 기간이 만료되었는지 확인합니다.
 */
export function isRetrospectiveExpiredForWeek(weekId: string): {
  isExpired: boolean;
  deadline: Date;
} {
  const { start } = parseWeekId(weekId);

  // 마감: 다음 주 월요일 00:00
  const deadline = new Date(start);
  deadline.setDate(start.getDate() + 7);
  deadline.setHours(0, 0, 0, 0);

  const now = new Date();
  return { isExpired: now >= deadline, deadline };
}
```

---

## 3. 구현 순서

### Phase 1: 기반 작업
1. `lib/utils/date.ts`에 WeekId 관련 유틸리티 함수 추가
2. 타입 정의 파일 수정 (`lib/api/types/task.ts`, `lib/api/types/retrospective.ts`)

### Phase 2: API 서비스 수정
3. `lib/api/services/task.service.ts` 수정
4. `lib/api/services/retrospective.service.ts` 수정

### Phase 3: 페이지 컴포넌트 수정
5. `app/page.tsx` (대시보드) 수정
6. `app/tasks/page.tsx` (할일 관리) 수정
7. `app/retrospective/page.tsx` (회고 목록) 수정
8. `app/retrospective/write/page.tsx` (회고 작성) 수정
9. `app/retrospective/[id]/page.tsx` (회고 상세) 수정

### Phase 4: 테스트 및 검증
10. 각 페이지 기능 테스트
11. 빌드 확인

---

## 4. 주의사항

### 4.1 호환성
- 백엔드 API가 완전히 전환된 후 프론트엔드 배포 필요
- 기존 데이터 마이그레이션 여부 확인 필요

### 4.2 WeekId 계산 일관성
- ISO 8601 표준을 따르므로, 연초/연말에 주 번호가 이전/다음 연도에 속할 수 있음
  - 예: 2024년 12월 30일 → 2025-W01에 속함
- 백엔드와 동일한 WeekId 계산 로직 사용 필수

### 4.3 UI 표시
- WeekId 자체를 사용자에게 직접 보여주지 않고, 날짜 범위로 변환하여 표시
- 예: `2025-W02` → `1월 6일 ~ 1월 12일`

### 4.4 기존 로직 제거
- `startDate`, `endDate` 관련 로직 완전 제거
- 날짜 범위 비교 로직 → WeekId 문자열 비교로 단순화

---

## 5. 영향 받지 않는 부분

- 회원 인증 API (`/api/v1/members/*`)
- 할일 상세 조회/수정/삭제 (`/api/v1/tasks/{taskId}`)
- 회고 상세 조회/삭제 (`/api/v1/retrospectives/{id}`)
- AI 질문 생성 (`/api/v1/retrospectives/{id}/generate-questions`)
- 답변 작성 (`/api/v1/retrospectives/{id}/answers`)
- 추가 메모 작성 (`/api/v1/retrospectives/{id}/additional-notes`)
- 회고 완료 (`/api/v1/retrospectives/{id}/complete`)
- 페이지네이션 구조 (오프셋/커서 방식 동일)

---

## 6. 변경 요약 체크리스트

### 타입 정의
- [ ] `TaskResponse`: `startDate` 제거, `weekId`, `hasRetrospective` 추가
- [ ] `WeeklyTaskResponse`: `weekStart`, `weekEnd` 제거, `weekId` 추가
- [ ] `CreateTaskRequest`: `startDate` 제거
- [ ] `RetrospectiveResponse`: `startDate`, `endDate` 제거, `weekId` 추가
- [ ] `RetrospectiveSummaryResponse`: `startDate`, `endDate` 제거, `weekId`, `answeredCount` 추가
- [ ] `CreateRetrospectiveRequest`: `startDate`, `endDate` 제거, `weekId` 추가

### 유틸리티 함수
- [ ] `getWeekId(date)` 추가
- [ ] `getCurrentWeekId()` 추가
- [ ] `parseWeekId(weekId)` 추가
- [ ] `formatWeekIdKorean(weekId)` 추가
- [ ] `isSameWeek(weekId1, weekId2)` 추가
- [ ] `isDateInWeek(date, weekId)` 추가
- [ ] `getRetrospectiveWritePeriodForWeek(weekId)` 추가
- [ ] `isRetrospectiveExpiredForWeek(weekId)` 추가

### API 서비스
- [ ] `taskService.getWeekly()`: 파라미터 `weekStart` → `weekId`
- [ ] `retrospectiveService.create()`: 파라미터 변경

### 페이지 컴포넌트
- [ ] 대시보드: WeekId 기반으로 변경
- [ ] 할일 관리: WeekId 기반으로 변경
- [ ] 회고 목록: WeekId 표시 방식 변경
- [ ] 회고 작성: WeekId 기반 생성 및 조회
- [ ] 회고 상세: WeekId 표시 방식 변경
