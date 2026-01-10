// 회고 상태
export type RetrospectiveStatus =
  | "TODO"
  | "BEFORE_GENERATE_QUESTION"
  | "AFTER_GENERATE_QUESTION"
  | "IN_PROGRESS"
  | "DONE";

// 질문 응답 DTO
export interface QuestionResponse {
  id: number;
  content: string;
  order: number;
  createdAt: string;
}

// 답변 응답 DTO
export interface AnswerResponse {
  id?: number;
  questionId: number;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

// 회고 상세 응답 DTO
export interface RetrospectiveResponse {
  id: number;
  weekId: string; // YYYY-Www 형식 (예: 2025-W02)
  status: RetrospectiveStatus;
  questionCount: number;
  questions: QuestionResponse[];
  answers: AnswerResponse[];
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// 회고 요약 응답 DTO
export interface RetrospectiveSummaryResponse {
  id: number;
  weekId: string; // YYYY-Www 형식 (예: 2025-W02)
  status: RetrospectiveStatus;
  questionCount: number;
  answeredCount: number;
  createdAt: string;
}

// 회고 생성 요청 DTO
export interface CreateRetrospectiveRequest {
  weekId: string; // YYYY-Www 형식 (예: 2025-W02)
  questionCount: number;
}

// 답변 작성 요청 DTO
export interface WriteAnswerRequest {
  questionId: number;
  content?: string;
}

// 추가 메모 작성 요청 DTO
export interface WriteAdditionalNotesRequest {
  notes: string;
}

// 회고 통계 응답 DTO
export interface RetrospectiveStatisticsResponse {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

// 월간 회고 응답 DTO
export interface MonthlyRetrospectiveResponse {
  year: number;
  month: number;
  retrospectives: RetrospectiveSummaryResponse[];
  statistics: RetrospectiveStatisticsResponse;
}

