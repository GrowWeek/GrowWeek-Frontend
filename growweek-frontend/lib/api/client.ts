import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 토큰이 필요한 경우 헤더에 추가
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // 토큰 갱신 로직이 필요한 경우 여기에 추가
      // 예: refreshToken을 사용하여 새 accessToken 발급
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        // 로그인 페이지로 리다이렉트 등의 처리
        // window.location.href = "/login";
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

