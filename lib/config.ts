/**
 * 런타임 환경 설정
 * 
 * 이 모듈은 런타임에 주입되는 환경변수를 관리합니다.
 * Docker 환경에서는 docker-entrypoint.sh가 window.__ENV__를 설정합니다.
 */

// 환경 설정 타입 정의
export interface EnvConfig {
  API_BASE_URL: string;
  LANDING_ONLY_MODE: boolean;
  EMAIL_COLLECTION_API_URL?: string;
  UX_LOG_API_URL: string;
  UX_LOG_PROJECT_ID: number;
}

// 기본값 (로컬 개발용)
const defaultConfig: EnvConfig = {
  API_BASE_URL: 'http://localhost:8080',
  LANDING_ONLY_MODE: false,
  EMAIL_COLLECTION_API_URL: undefined,
  UX_LOG_API_URL: 'https://uxlog.team.io.kr',
  UX_LOG_PROJECT_ID: 2,
};

/**
 * 환경 설정을 가져옵니다.
 * 
 * 우선순위:
 * 1. window.__ENV__ (런타임 주입)
 * 2. process.env.NEXT_PUBLIC_* (빌드 시점, 개발 환경)
 * 3. 기본값
 */
export function getConfig(): EnvConfig {
  // 서버 사이드에서는 process.env 사용
  if (typeof window === 'undefined') {
    return {
      API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || defaultConfig.API_BASE_URL,
      LANDING_ONLY_MODE: process.env.LANDING_ONLY_MODE === 'true' || process.env.NEXT_PUBLIC_LANDING_ONLY_MODE === 'true' || defaultConfig.LANDING_ONLY_MODE,
      EMAIL_COLLECTION_API_URL: process.env.EMAIL_COLLECTION_API_URL || process.env.NEXT_PUBLIC_EMAIL_COLLECTION_API_URL || defaultConfig.EMAIL_COLLECTION_API_URL,
      UX_LOG_API_URL: process.env.UX_LOG_API_URL || defaultConfig.UX_LOG_API_URL,
      UX_LOG_PROJECT_ID: Number(process.env.UX_LOG_PROJECT_ID) || defaultConfig.UX_LOG_PROJECT_ID,
    };
  }

  // 클라이언트 사이드: window.__ENV__ 우선, 없으면 빌드 시점 환경변수
  const runtimeEnv = (window as Window & { __ENV__?: Partial<EnvConfig> }).__ENV__;

  const landingOnlyMode = runtimeEnv?.LANDING_ONLY_MODE !== undefined
    ? runtimeEnv.LANDING_ONLY_MODE
    : (process.env.NEXT_PUBLIC_LANDING_ONLY_MODE === 'true' || defaultConfig.LANDING_ONLY_MODE);

  return {
    API_BASE_URL: runtimeEnv?.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || defaultConfig.API_BASE_URL,
    LANDING_ONLY_MODE: landingOnlyMode,
    EMAIL_COLLECTION_API_URL: runtimeEnv?.EMAIL_COLLECTION_API_URL || process.env.NEXT_PUBLIC_EMAIL_COLLECTION_API_URL || defaultConfig.EMAIL_COLLECTION_API_URL,
    UX_LOG_API_URL: runtimeEnv?.UX_LOG_API_URL || defaultConfig.UX_LOG_API_URL,
    UX_LOG_PROJECT_ID: runtimeEnv?.UX_LOG_PROJECT_ID || defaultConfig.UX_LOG_PROJECT_ID,
  };
}

// 편의를 위한 개별 getter
export const config = {
  get apiBaseUrl(): string {
    return getConfig().API_BASE_URL;
  },
};

