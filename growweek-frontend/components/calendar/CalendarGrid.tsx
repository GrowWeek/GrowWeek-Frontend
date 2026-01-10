"use client";

import { useMemo } from "react";
import type { TaskResponse, RetrospectiveSummaryResponse } from "@/lib/api";
import { parseWeekId, formatDate } from "@/lib/utils";

interface CalendarGridProps {
  year: number;
  month: number;
  tasks: TaskResponse[];
  retrospectives: RetrospectiveSummaryResponse[];
  onDateClick?: (date: Date) => void;
}

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: TaskResponse[];
  retrospectives: RetrospectiveSummaryResponse[];
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 회고 데이터에 시작/종료일 문자열을 추가한 타입
interface RetrospectiveWithDateRange extends RetrospectiveSummaryResponse {
  startDateStr: string;
  endDateStr: string;
}

export function CalendarGrid({
  year,
  month,
  tasks,
  retrospectives,
  onDateClick,
}: CalendarGridProps) {
  // 회고 데이터를 미리 처리하여 시작/종료일 문자열 추가 (성능 최적화)
  const retrospectivesWithDates = useMemo<RetrospectiveWithDateRange[]>(() => {
    return retrospectives.map((r) => {
      const { start, end } = parseWeekId(r.weekId);
      return {
        ...r,
        startDateStr: formatDate(start),
        endDateStr: formatDate(end),
      };
    });
  }, [retrospectives]);

  const days = useMemo(() => {
    const result: DayInfo[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 해당 월의 첫 날과 마지막 날
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    // 시작 요일 (0: 일요일)
    const startDayOfWeek = firstDay.getDay();

    // 이전 달 날짜 채우기
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, -i);
      result.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        tasks: [],
        retrospectives: [],
      });
    }

    // 현재 달 날짜 채우기
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = formatDateStr(date);

      // 해당 날짜의 할일 (마감일 기준)
      const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

      // 해당 날짜가 포함된 회고 기간 (미리 계산된 시작/종료일 사용)
      const dayRetros = retrospectivesWithDates.filter(
        (r) => dateStr >= r.startDateStr && dateStr <= r.endDateStr
      );

      result.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        tasks: dayTasks,
        retrospectives: dayRetros,
      });
    }

    // 다음 달 날짜 채우기 (6주 채우기)
    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month, i);
      result.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        tasks: [],
        retrospectives: [],
      });
    }

    return result;
  }, [year, month, tasks, retrospectivesWithDates]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`py-3 text-center text-sm font-medium ${
              index === 0
                ? "text-rose-500"
                : index === 6
                ? "text-sky-500"
                : "text-zinc-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayOfWeek = day.date.getDay();
          const hasItems = day.tasks.length > 0 || day.retrospectives.length > 0;

          return (
            <div
              key={index}
              onClick={() => onDateClick?.(day.date)}
              className={`
                min-h-[100px] p-2 border-b border-r border-zinc-100 dark:border-zinc-800
                ${index % 7 === 6 ? "border-r-0" : ""}
                ${!day.isCurrentMonth ? "bg-zinc-50 dark:bg-zinc-950" : ""}
                ${hasItems ? "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50" : ""}
                transition-colors
              `}
            >
              {/* 날짜 번호 */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                    ${
                      day.isToday
                        ? "bg-indigo-600 text-white font-bold"
                        : day.isCurrentMonth
                        ? dayOfWeek === 0
                          ? "text-rose-500"
                          : dayOfWeek === 6
                          ? "text-sky-500"
                          : "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-300 dark:text-zinc-600"
                    }
                  `}
                >
                  {day.date.getDate()}
                </span>
              </div>

              {/* 이벤트 표시 */}
              <div className="space-y-1">
                {/* 회고 기간 표시 */}
                {(day.retrospectives as RetrospectiveWithDateRange[]).slice(0, 1).map((retro) => {
                  const dateStr = formatDateStr(day.date);
                  const isStart = retro.startDateStr === dateStr;
                  const isEnd = retro.endDateStr === dateStr;

                  return (
                    <div
                      key={retro.id}
                      className={`
                        text-xs py-0.5 px-1.5 truncate
                        ${
                          retro.status === "DONE"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        }
                        ${isStart ? "rounded-l-md" : ""}
                        ${isEnd ? "rounded-r-md" : ""}
                        ${!isStart && !isEnd ? "" : ""}
                      `}
                    >
                      {isStart ? "📝 회고" : ""}
                    </div>
                  );
                })}

                {/* 할일 표시 */}
                {day.tasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`
                      text-xs py-0.5 px-1.5 rounded truncate
                      ${
                        task.status === "DONE"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : task.status === "CANCEL"
                          ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 line-through"
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      }
                    `}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}

                {/* 더보기 표시 */}
                {day.tasks.length > 2 && (
                  <div className="text-xs text-zinc-400 px-1.5">
                    +{day.tasks.length - 2}개 더
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

