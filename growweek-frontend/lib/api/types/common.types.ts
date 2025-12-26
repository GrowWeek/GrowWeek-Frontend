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

