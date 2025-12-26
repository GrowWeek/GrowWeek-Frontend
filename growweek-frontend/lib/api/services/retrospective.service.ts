import apiClient from "../client";
import type {
  RetrospectiveResponse,
  RetrospectiveSummaryResponse,
  CreateRetrospectiveRequest,
  WriteAnswerRequest,
  WriteAdditionalNotesRequest,
  MonthlyRetrospectiveResponse,
  OffsetPageResponse,
  CursorPageResponse,
  OffsetPaginationParams,
  CursorPaginationParams,
} from "../types";

/**
 * 회고 API 서비스
 */
export const retrospectiveService = {
  /**
   * 회고 목록 조회 (오프셋 기반 페이지네이션)
   */
  getAll: async (params?: OffsetPaginationParams) => {
    const response = await apiClient.get<
      OffsetPageResponse<RetrospectiveSummaryResponse>
    >("/api/v1/retrospectives", { params });
    return response.data;
  },

  /**
   * 회고 목록 조회 (커서 기반 페이지네이션)
   */
  getAllWithCursor: async (params?: CursorPaginationParams) => {
    const response = await apiClient.get<
      CursorPageResponse<RetrospectiveSummaryResponse>
    >("/api/v1/retrospectives", { params });
    return response.data;
  },

  /**
   * 월간 회고 목록 + 통계 조회
   */
  getMonthly: async (year: number, month: number) => {
    const response = await apiClient.get<MonthlyRetrospectiveResponse>(
      "/api/v1/retrospectives/monthly",
      { params: { year, month } }
    );
    return response.data;
  },

  /**
   * 회고 상세 조회
   */
  getById: async (retrospectiveId: number) => {
    const response = await apiClient.get<RetrospectiveResponse>(
      `/api/v1/retrospectives/${retrospectiveId}`
    );
    return response.data;
  },

  /**
   * 회고 생성
   */
  create: async (data: CreateRetrospectiveRequest) => {
    const response = await apiClient.post<RetrospectiveResponse>(
      "/api/v1/retrospectives",
      data
    );
    return response.data;
  },

  /**
   * AI 질문 생성
   */
  generateQuestions: async (retrospectiveId: number) => {
    const response = await apiClient.post<RetrospectiveResponse>(
      `/api/v1/retrospectives/${retrospectiveId}/generate-questions`
    );
    return response.data;
  },

  /**
   * 답변 작성
   */
  writeAnswer: async (retrospectiveId: number, data: WriteAnswerRequest) => {
    const response = await apiClient.post<RetrospectiveResponse>(
      `/api/v1/retrospectives/${retrospectiveId}/answers`,
      data
    );
    return response.data;
  },

  /**
   * 추가 메모 작성
   */
  writeAdditionalNotes: async (
    retrospectiveId: number,
    data: WriteAdditionalNotesRequest
  ) => {
    const response = await apiClient.put<RetrospectiveResponse>(
      `/api/v1/retrospectives/${retrospectiveId}/additional-notes`,
      data
    );
    return response.data;
  },

  /**
   * 회고 완료 처리
   */
  complete: async (retrospectiveId: number) => {
    const response = await apiClient.post<RetrospectiveResponse>(
      `/api/v1/retrospectives/${retrospectiveId}/complete`
    );
    return response.data;
  },

  /**
   * 회고 삭제
   */
  delete: async (retrospectiveId: number) => {
    await apiClient.delete(`/api/v1/retrospectives/${retrospectiveId}`);
  },
};

