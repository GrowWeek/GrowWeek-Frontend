// 할일 상태
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCEL";

// 민감도 수준
export type SensitivityLevel = "NONE" | "TITLE_ONLY" | "NEVER";

// 할일 응답 DTO
export interface TaskResponse {
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

// 할일 생성 요청 DTO
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: number;
  startDate: string;
  dueDate: string;
  sensitivityLevel?: SensitivityLevel;
}

// 할일 수정 요청 DTO
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
  dueDate?: string;
  sensitivityLevel?: SensitivityLevel;
}

// 할일 상태 변경 요청 DTO
export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

// 할일 통계 응답 DTO
export interface TaskStatisticsResponse {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  cancel: number;
}

// 주간 할일 응답 DTO
export interface WeeklyTaskResponse {
  weekStart: string;
  weekEnd: string;
  tasks: TaskResponse[];
  statistics: TaskStatisticsResponse;
}

