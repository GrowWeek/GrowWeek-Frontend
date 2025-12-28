import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { config } from "@/lib/config";

// 인증이 필요 없는 API 경로
const PUBLIC_PATHS = [
  "/api/v1/members/signup",
  "/api/v1/members/login",
];

// API 클라이언트 인스턴스 생성
// baseURL은 요청 시점에 동적으로 결정됨 (런타임 환경변수 지원)
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 시점에 baseURL 설정 (런타임 환경변수 반영)
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    if (!requestConfig.baseURL) {
      requestConfig.baseURL = config.apiBaseUrl;
    }
    return requestConfig;
  }
);

// 요청 인터셉터 - 인증 헤더 설정
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublicPath = PUBLIC_PATHS.some((path) =>
      config.url?.includes(path)
    );

    // 토큰이 필요한 경우 헤더에 추가
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token && config.headers && !isPublicPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // X-User-Id 헤더 추가 (API 인증용, 인증된 사용자의 경우)
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("userId")
        : null;

    if (userId && config.headers && !isPublicPath) {
      config.headers["X-User-Id"] = userId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 401 에러 처리 (인증 만료)
    if (error.response?.status === 401) {
      // 토큰 관련 정보 제거
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("currentUser");

        // 로그인 페이지가 아닌 경우에만 리다이렉트
        const isLoginPage = window.location.pathname === "/login";
        const isSignupPage = window.location.pathname === "/signup";

        if (!isLoginPage && !isSignupPage) {
          window.location.href = "/login";
        }
      }
    }

    // 에러 메시지 추출
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "알 수 없는 오류가 발생했습니다.";

    console.error("[API Error]", {
      status: error.response?.status,
      message: errorMessage,
      url: originalRequest?.url,
    });

    return Promise.reject(error);
  }
);

export default apiClient;

