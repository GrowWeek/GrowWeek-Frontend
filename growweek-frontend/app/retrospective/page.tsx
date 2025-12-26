"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/common";
import {
  RetrospectiveCard,
  MonthlyStatistics,
} from "@/components/retrospective";
import { retrospectiveService } from "@/lib/api";
import type { MonthlyRetrospectiveResponse } from "@/lib/api";

export default function RetrospectiveListPage() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<MonthlyRetrospectiveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 년월
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const fetchMonthlyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await retrospectiveService.getMonthly(year, month);
      setMonthlyData(data);
    } catch (err) {
      console.error("Failed to fetch monthly retrospectives:", err);
      setError("회고 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);

  // 이전 달
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  // 다음 달
  const handleNextMonth = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 미래로는 이동 불가
    if (year === currentYear && month >= currentMonth) return;

    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  // 이번 달로 이동
  const handleCurrentMonth = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  };

  const canGoNext = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return !(year === currentYear && month >= currentMonth);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="회고 목록" description="월별 회고를 확인하세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-zinc-500">회고를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="회고 목록"
      description="월별 회고를 확인하고 관리하세요"
      actions={
        <Button onClick={() => router.push("/retrospective/write")}>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          회고 작성
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={fetchMonthlyData}
                className="ml-auto text-sm underline hover:no-underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 월 선택 네비게이션 */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg
              className="w-6 h-6 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {year}년 {month}월
            </h2>
            {!isCurrentMonth() && (
              <button
                onClick={handleCurrentMonth}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                이번 달로
              </button>
            )}
          </div>

          <button
            onClick={handleNextMonth}
            disabled={!canGoNext()}
            className={`p-2 rounded-xl transition-colors ${
              canGoNext()
                ? "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-6 h-6 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 월간 통계 */}
        {monthlyData && (
          <MonthlyStatistics
            statistics={monthlyData.statistics}
            year={monthlyData.year}
            month={monthlyData.month}
          />
        )}

        {/* 회고 목록 */}
        {monthlyData && monthlyData.retrospectives.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              회고 목록
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({monthlyData.retrospectives.length}개)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monthlyData.retrospectives.map((retro) => (
                <RetrospectiveCard key={retro.id} retrospective={retro} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              이 달의 회고가 없습니다
            </h3>
            <p className="text-zinc-500 mb-6">
              {isCurrentMonth()
                ? "이번 주 회고를 작성해보세요!"
                : `${year}년 ${month}월에 작성된 회고가 없습니다.`}
            </p>
            {isCurrentMonth() && (
              <Button onClick={() => router.push("/retrospective/write")}>
                회고 작성하기
              </Button>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

