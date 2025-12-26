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
    <div className={`${bgColor} rounded-xl p-4`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{label}</p>
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
            <span className="text-sm text-zinc-500">완료율</span>
            <span className="text-lg font-bold text-indigo-600">
              {completionRate}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatItem
            label="할 일"
            value={statistics.todo}
            color="text-zinc-700 dark:text-zinc-300"
            bgColor="bg-zinc-100 dark:bg-zinc-800"
          />
          <StatItem
            label="진행 중"
            value={statistics.inProgress}
            color="text-sky-700 dark:text-sky-300"
            bgColor="bg-sky-50 dark:bg-sky-900/30"
          />
          <StatItem
            label="완료"
            value={statistics.done}
            color="text-emerald-700 dark:text-emerald-300"
            bgColor="bg-emerald-50 dark:bg-emerald-900/30"
          />
          <StatItem
            label="취소"
            value={statistics.cancel}
            color="text-rose-700 dark:text-rose-300"
            bgColor="bg-rose-50 dark:bg-rose-900/30"
          />
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-sm text-zinc-500">전체 할일</span>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {statistics.total}개
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

