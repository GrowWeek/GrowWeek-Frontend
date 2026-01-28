"use client";

import Link from "next/link";
import { Button } from "../common";
import { useIsLoggedIn, useLandingOnlyMode } from "@/lib/hooks";
import { EmailCollectionForm } from "./EmailCollectionForm";

export function CTASection() {
  const isLoggedIn = useIsLoggedIn();
  const isLandingOnly = useLandingOnlyMode();
  return (
    <section id="cta" className="py-20 md:py-32 bg-white dark:bg-stone-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative bg-lime-100 dark:bg-lime-900/20 rounded-2xl p-8 md:p-16 border border-lime-200 dark:border-lime-800 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-200/50 dark:bg-lime-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime-300/30 dark:bg-lime-800/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center max-w-2xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-2xl mb-8">
              <svg
                className="w-8 h-8 text-stone-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4 text-balance word-keep-all">
              오늘부터 성장을 시작하세요
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 leading-relaxed text-balance word-keep-all">
              {isLandingOnly
                ? "서비스 출시 시 가장 먼저 알림을 받으세요."
                : "매주 작은 목표를 세우고, 달성하고, 돌아보는 습관이 큰 변화를 만들어냅니다."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4">
              {isLandingOnly ? (
                <EmailCollectionForm />
              ) : (
                <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                  <Button size="lg" className="px-10">
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
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-stone-500 dark:text-stone-500">
              {isLandingOnly ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-lime-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    스팸 없음
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-lime-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    언제든 구독 취소
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-lime-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    무료로 시작
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-lime-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    신용카드 불필요
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-lime-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    언제든 취소
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
