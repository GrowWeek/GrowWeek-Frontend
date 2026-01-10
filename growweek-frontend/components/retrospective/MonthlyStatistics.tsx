"use client";

import type { RetrospectiveStatisticsResponse } from "@/lib/api";

interface MonthlyStatisticsProps {
  statistics: RetrospectiveStatisticsResponse;
  year: number;
  month: number;
}

export function MonthlyStatistics({
  statistics,
  year,
  month,
}: MonthlyStatisticsProps) {
  const completionRate =
    statistics.total > 0
      ? Math.round((statistics.completed / statistics.total) * 100)
      : 0;

  return (
    <div className="bg-lime-100 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-xl p-6 text-stone-900 dark:text-stone-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">월간 회고 현황</p>
          <h2 className="text-2xl font-bold">
            {year}년 {month}월
          </h2>
        </div>
        <div className="w-14 h-14 bg-lime-200 dark:bg-lime-800/50 rounded-xl flex items-center justify-center">
          <svg
            className="w-7 h-7 text-lime-600 dark:text-lime-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* 완료율 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-stone-500 dark:text-stone-400">완료율</span>
          <span className="text-2xl font-bold">{completionRate}%</span>
        </div>
        <div className="h-2 bg-lime-200 dark:bg-lime-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime-400 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/60 dark:bg-stone-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{statistics.total}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">전체</p>
        </div>
        <div className="bg-white/60 dark:bg-stone-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{statistics.completed}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">완료</p>
        </div>
        <div className="bg-white/60 dark:bg-stone-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{statistics.inProgress}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">진행 중</p>
        </div>
        <div className="bg-white/60 dark:bg-stone-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{statistics.notStarted}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">미시작</p>
        </div>
      </div>
    </div>
  );
}

