"use client";

import { Card, CardContent } from "@/components/common";
import { parseWeekId, formatWeekIdKorean, getWeekOfMonth } from "@/lib/utils";

interface WeekInfoProps {
  weekId: string;
}

export function WeekInfo({ weekId }: WeekInfoProps) {
  const { start } = parseWeekId(weekId);
  const month = start.getMonth() + 1;
  const weekOfMonth = getWeekOfMonth(start);
  const today = new Date();
  const todayStr = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <Card className="bg-lime-100 border-lime-200 dark:bg-lime-900/20 dark:border-lime-800">
      <CardContent className="py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
              {todayStr}
            </p>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">
              {month}월 {weekOfMonth}주차
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              {formatWeekIdKorean(weekId)}
            </p>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
