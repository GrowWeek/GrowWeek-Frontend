"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import type { TaskStatisticsResponse } from "@/lib/api";

interface TaskStatisticsProps {
  statistics: TaskStatisticsResponse;
}

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function StatItem({ label, value, color, bgColor }: StatItemProps) {
  return (
    <div className={`${bgColor} rounded-lg p-3`}>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{label}</p>
    </div>
  );
}

export function TaskStatistics({ statistics }: TaskStatisticsProps) {
  const completionRate =
    statistics.total > 0
      ? Math.round((statistics.done / statistics.total) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>이번 주 할일 현황</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">완료율</span>
            <span className="text-lg font-bold text-lime-600 dark:text-lime-400">
              {completionRate}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <StatItem
            label="할 일"
            value={statistics.todo}
            color="text-stone-700 dark:text-stone-300"
            bgColor="bg-stone-100 dark:bg-stone-800"
          />
          <StatItem
            label="진행 중"
            value={statistics.inProgress}
            color="text-lime-700 dark:text-lime-400"
            bgColor="bg-lime-50 dark:bg-lime-900/20"
          />
          <StatItem
            label="완료"
            value={statistics.done}
            color="text-lime-700 dark:text-lime-400"
            bgColor="bg-lime-50 dark:bg-lime-900/20"
          />
          <StatItem
            label="취소"
            value={statistics.cancel}
            color="text-stone-500 dark:text-stone-400"
            bgColor="bg-stone-100 dark:bg-stone-800"
          />
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <span className="text-sm text-stone-500">전체 할일</span>
          <span className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {statistics.total}개
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
