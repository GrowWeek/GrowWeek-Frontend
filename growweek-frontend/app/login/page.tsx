"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { memberService } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
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
          : "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="w-full max-w-sm mx-4">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lime-400 mb-4">
            <svg className="w-6 h-6 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            GrowWeek
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            매주 성장하는 나를 만나보세요
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-5">
            로그인
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
              required
              autoComplete="email"
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              로그인
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-lime-600 dark:text-lime-400 font-medium hover:underline"
              >
                회원가입
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
