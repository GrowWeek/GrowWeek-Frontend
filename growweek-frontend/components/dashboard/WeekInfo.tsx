"use client";

import { Card, CardContent } from "@/components/common";
import { formatDateRangeKorean, getWeekOfMonth } from "@/lib/utils";

interface WeekInfoProps {
  weekStart: string;
  weekEnd: string;
}

export function WeekInfo({ weekStart, weekEnd }: WeekInfoProps) {
  const startDate = new Date(weekStart);
  const month = startDate.getMonth() + 1;
  const weekOfMonth = getWeekOfMonth(startDate);
  const today = new Date();
  const todayStr = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-0 text-white">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium mb-1">
              {todayStr}
            </p>
            <h2 className="text-2xl font-bold mb-2">
              {month}월 {weekOfMonth}주차
            </h2>
            <p className="text-indigo-100">
              {formatDateRangeKorean(weekStart, weekEnd)}
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

