import apiClient from "../client";
import type {
  SignUpRequest,
  LoginRequest,
  MemberResponse,
  TokenResponse,
} from "../types";

/**
 * 회원 API 서비스
 */
export const memberService = {
  /**
   * 회원가입
   * @param data 회원가입 요청 정보 (email, password, nickname)
   * @returns 생성된 회원 정보
   */
  signUp: async (data: SignUpRequest): Promise<MemberResponse> => {
    const response = await apiClient.post<MemberResponse>(
      "/api/v1/members/signup",
      data
    );
    return response.data;
  },

  /**
   * 로그인
   * @param data 로그인 요청 정보 (email, password)
   * @returns JWT 토큰 정보
   */
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
      "/api/v1/members/login",
      data
    );

    // 토큰을 localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data;
  },

  /**
   * 로그아웃
   * 클라이언트 측 토큰 및 사용자 정보 제거
   */
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("currentUser");
    }
  },

  /**
   * 현재 로그인된 사용자 정보 조회
   * @returns 현재 사용자 정보
   */
  getCurrentMember: async (): Promise<MemberResponse> => {
    const response = await apiClient.get<MemberResponse>("/api/v1/members/me");

    // 사용자 정보를 localStorage에 캐싱
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", String(response.data.id));
      localStorage.setItem("currentUser", JSON.stringify(response.data));
    }

    return response.data;
  },

  /**
   * 로그인 상태 확인
   * @returns 로그인 여부
   */
  isLoggedIn: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  },

  /**
   * 저장된 현재 사용자 정보 가져오기 (캐시된 정보)
   * @returns 캐시된 사용자 정보 또는 null
   */
  getCachedCurrentMember: (): MemberResponse | null => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("currentUser");
    return cached ? JSON.parse(cached) : null;
  },
};

