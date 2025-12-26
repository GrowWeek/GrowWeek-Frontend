import apiClient from "../client";
import { ApiResponse, PaginatedResponse, PaginationParams } from "../types";

// 예시 데이터 타입
interface ExampleItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface CreateExampleDto {
  title: string;
  description: string;
}

interface UpdateExampleDto {
  title?: string;
  description?: string;
}

/**
 * 예시 API 서비스
 * 실제 API 엔드포인트에 맞게 수정하여 사용하세요.
 */
export const exampleService = {
  // 목록 조회
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<ExampleItem>>(
      "/examples",
      { params }
    );
    return response.data;
  },

  // 단일 조회
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<ExampleItem>>(
      `/examples/${id}`
    );
    return response.data;
  },

  // 생성
  create: async (data: CreateExampleDto) => {
    const response = await apiClient.post<ApiResponse<ExampleItem>>(
      "/examples",
      data
    );
    return response.data;
  },

  // 수정
  update: async (id: number, data: UpdateExampleDto) => {
    const response = await apiClient.patch<ApiResponse<ExampleItem>>(
      `/examples/${id}`,
      data
    );
    return response.data;
  },

  // 삭제
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/examples/${id}`
    );
    return response.data;
  },
};

