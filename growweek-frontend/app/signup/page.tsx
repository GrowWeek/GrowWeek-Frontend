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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (formData.password.length < 8) {
      errors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

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
      await memberService.signUp({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });

      await memberService.login({
        email: formData.email,
        password: formData.password,
      });

      await memberService.getCurrentMember();
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
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 py-8">
      <div className="w-full max-w-sm mx-4">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lime-400 mb-4">
            <svg className="w-6 h-6 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            GrowWeek
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            성장하는 주간을 시작해보세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-5">
            회원가입
          </h2>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200/50 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full"
            >
              회원가입
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-lime-600 dark:text-lime-400 font-medium hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <p className="text-center text-stone-400 dark:text-stone-500 text-xs mt-6">
          © 2025 GrowWeek
        </p>
      </div>
    </div>
  );
}
