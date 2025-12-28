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
      // 로그인 API 호출
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
          : "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/30">
            G
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            GrowWeek
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            매주 성장하는 나를 만나보세요
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/50 p-8 border border-zinc-200/50 dark:border-zinc-700/50">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
            로그인
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

          <div className="mt-6 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                회원가입
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

