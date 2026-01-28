"use client";

import Link from "next/link";
import { Button } from "../common";
import { useIsLoggedIn, useLandingOnlyMode } from "@/lib/hooks";
import { EmailCollectionForm } from "./EmailCollectionForm";

export function HeroSection() {
  const isLoggedIn = useIsLoggedIn();
  const isLandingOnly = useLandingOnlyMode();
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-lime-200/30 dark:bg-lime-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-lime-100/40 dark:bg-lime-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-100 dark:bg-lime-900/30 border border-lime-200 dark:border-lime-800 rounded-full mb-8">
            <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-lime-700 dark:text-lime-300">
              매주 성장하는 나를 만나세요
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-6 text-balance word-keep-all">
            주간 할일과 회고로{" "}
            <span className="text-lime-600 dark:text-lime-400">
              꾸준히 성장하세요
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed text-balance word-keep-all">
            <span className="hidden md:inline">
              매주 목표를 세우고, 칸반 보드로 진행 상황을 관리하고, AI가 생성한
              질문에 답하며 한 주를 되돌아보세요.
            </span>
            <span className="md:hidden">
              목표 설정부터 회고까지, 주간 성장을 한곳에서 관리하세요.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4">
            {isLandingOnly ? (
              <EmailCollectionForm />
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                  <Button size="lg" className="px-8">
                    {isLoggedIn ? "대시보드로 이동" : "무료로 시작하기"}
                    <svg
                      className="w-5 h-5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    기능 살펴보기
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-stone-200 dark:border-stone-800">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
                4단계
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                할일 상태 관리
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
                AI
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                맞춤 회고 질문
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
                매주
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                성장 기록
              </div>
            </div>
          </div>
        </div>

        {/* Preview Image Placeholder */}
        <div className="mt-16 md:mt-20 relative">
          <div className="relative mx-auto max-w-4xl">
            {/* Browser mockup */}
            <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-lime-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white dark:bg-stone-700 rounded-md px-3 py-1 text-sm text-stone-500 dark:text-stone-400 text-center">
                    growweek.app
                  </div>
                </div>
              </div>

              {/* Content preview */}
              <div className="p-6 md:p-8 bg-stone-50 dark:bg-stone-950">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {/* Kanban columns preview */}
                  {["TODO", "진행 중", "완료", "취소"].map((col, idx) => (
                    <div
                      key={col}
                      className="bg-white dark:bg-stone-900 rounded-lg p-4 border border-stone-200 dark:border-stone-800"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            idx === 0
                              ? "bg-stone-400"
                              : idx === 1
                                ? "bg-amber-400"
                                : idx === 2
                                  ? "bg-lime-400"
                                  : "bg-rose-400"
                          }`}
                        />
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                          {col}
                        </span>
                      </div>
                      {[...Array(idx === 1 ? 2 : idx === 2 ? 3 : 1)].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="bg-stone-100 dark:bg-stone-800 rounded-md p-2 mb-2 last:mb-0"
                          >
                            <div className="h-2 bg-stone-300 dark:bg-stone-600 rounded w-3/4 mb-1.5" />
                            <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-4 md:-left-8 top-1/3 bg-white dark:bg-stone-900 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-800 animate-fade-in hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-lime-600 dark:text-lime-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    할일 완료!
                  </div>
                  <div className="text-xs text-stone-500">방금 전</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 md:-right-8 bottom-1/4 bg-white dark:bg-stone-900 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-800 animate-fade-in hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-lime-600 dark:text-lime-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    AI 회고 질문 생성됨
                  </div>
                  <div className="text-xs text-stone-500">3개의 질문</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
