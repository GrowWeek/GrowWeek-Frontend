/**
 * 회원가입 요청 DTO
 */
export interface SignUpRequest {
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 닉네임 */
  nickname: string;
}

/**
 * 로그인 요청 DTO
 */
export interface LoginRequest {
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
}

/**
 * 회원 응답 DTO
 */
export interface MemberResponse {
  /** 회원 고유 식별자 */
  id: number;
  /** 이메일 */
  email: string;
  /** 닉네임 */
  nickname: string;
  /** 생성 일시 (yyyy-MM-ddTHH:mm:ss) */
  createdAt: string;
}

/**
 * 토큰 응답 DTO
 */
export interface TokenResponse {
  /** 액세스 토큰 */
  accessToken: string;
  /** 토큰 타입 (예: Bearer) */
  tokenType: string;
  /** 만료 시간 (초) */
  expiresIn: number;
}

