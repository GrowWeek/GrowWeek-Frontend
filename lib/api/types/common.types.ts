// API 공통 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// 페이지네이션 응답 타입 (레거시)
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API 에러 타입
export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// 페이지네이션 요청 파라미터 (레거시)
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// 오프셋 기반 페이지 응답
export interface OffsetPageResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  items: T[];
}

// 커서 기반 페이지 응답
export interface CursorPageResponse<T> {
  cursor?: string;
  nextCursor?: string;
  size: number;
  hasNext: boolean;
  items: T[];
}

// 페이지네이션 파라미터 (오프셋 기반)
export interface OffsetPaginationParams {
  page?: number;
  size?: number;
}

// 페이지네이션 파라미터 (커서 기반)
export interface CursorPaginationParams {
  cursor?: string;
  size?: number;
}

