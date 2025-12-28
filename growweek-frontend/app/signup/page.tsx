"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { memberService } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 비밀번호 검증 (최소 8자)
    if (formData.password.length < 8) {
      errors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 닉네임 검증 (2-20자)
    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      errors.nickname = "닉네임은 2-20자 사이여야 합니다.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 회원가입 API 호출
      await memberService.signUp({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });

      // 자동 로그인
      await memberService.login({
        email: formData.email,
        password: formData.password,
      });

      // 사용자 정보 조회 및 저장
      await memberService.getCurrentMember();

      // 대시보드로 이동
      router.push("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "회원가입에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950 py-12">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-emerald-500/30">
            G
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            GrowWeek
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            성장하는 주간을 시작해보세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/50 p-8 border border-zinc-200/50 dark:border-zinc-700/50">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
            회원가입
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="이메일"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              autoComplete="email"
            />

            <Input
              label="닉네임"
              type="text"
              name="nickname"
              placeholder="사용할 닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleChange}
              error={formErrors.nickname}
              helperText="2-20자 사이로 입력해주세요"
              required
              autoComplete="nickname"
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              placeholder="8자 이상의 비밀번호"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              helperText="8자 이상 입력해주세요"
              required
              autoComplete="new-password"
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full !bg-emerald-600 hover:!bg-emerald-700 dark:!bg-emerald-500 dark:hover:!bg-emerald-600"
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <p className="text-center text-zinc-400 dark:text-zinc-500 text-sm mt-8">
          © 2025 GrowWeek. All rights reserved.
        </p>
      </div>
    </div>
  );
}

