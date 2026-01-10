import apiClient from "../client";
import type {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  WeeklyTaskResponse,
  OffsetPageResponse,
  CursorPageResponse,
  OffsetPaginationParams,
  CursorPaginationParams,
} from "../types";

/**
 * 할일 API 서비스
 */
export const taskService = {
  /**
   * 전체 할일 목록 조회 (오프셋 기반 페이지네이션)
   */
  getAll: async (params?: OffsetPaginationParams) => {
    const response = await apiClient.get<OffsetPageResponse<TaskResponse>>(
      "/api/v1/tasks",
      { params }
    );
    return response.data;
  },

  /**
   * 전체 할일 목록 조회 (커서 기반 페이지네이션)
   */
  getAllWithCursor: async (params?: CursorPaginationParams) => {
    const response = await apiClient.get<CursorPageResponse<TaskResponse>>(
      "/api/v1/tasks",
      { params }
    );
    return response.data;
  },

  /**
   * 주간 할일 목록 + 통계 조회
   * @param weekId 주 식별자 (YYYY-Www 형식, 예: 2025-W02)
   */
  getWeekly: async (weekId: string, params?: OffsetPaginationParams) => {
    const response = await apiClient.get<WeeklyTaskResponse>(
      "/api/v1/tasks/weekly",
      { params: { weekId, ...params } }
    );
    return response.data;
  },

  /**
   * 할일 상세 조회
   */
  getById: async (taskId: number) => {
    const response = await apiClient.get<TaskResponse>(
      `/api/v1/tasks/${taskId}`
    );
    return response.data;
  },

  /**
   * 할일 생성
   */
  create: async (data: CreateTaskRequest) => {
    const response = await apiClient.post<TaskResponse>("/api/v1/tasks", data);
    return response.data;
  },

  /**
   * 할일 수정
   */
  update: async (taskId: number, data: UpdateTaskRequest) => {
    const response = await apiClient.put<TaskResponse>(
      `/api/v1/tasks/${taskId}`,
      data
    );
    return response.data;
  },

  /**
   * 할일 상태 변경
   */
  updateStatus: async (taskId: number, data: UpdateTaskStatusRequest) => {
    const response = await apiClient.patch<TaskResponse>(
      `/api/v1/tasks/${taskId}/status`,
      data
    );
    return response.data;
  },

  /**
   * 할일 삭제
   */
  delete: async (taskId: number) => {
    await apiClient.delete(`/api/v1/tasks/${taskId}`);
  },
};

