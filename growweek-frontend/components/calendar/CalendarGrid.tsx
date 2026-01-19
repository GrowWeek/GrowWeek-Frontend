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

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();

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

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = formatDateStr(date);

      const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
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
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-stone-200 dark:border-stone-800">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`py-2.5 text-center text-sm font-medium ${
              index === 0
                ? "text-rose-500"
                : index === 6
                ? "text-lime-600 dark:text-lime-400"
                : "text-stone-500"
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
                min-h-[90px] p-2 border-b border-r border-stone-100 dark:border-stone-800
                ${index % 7 === 6 ? "border-r-0" : ""}
                ${!day.isCurrentMonth ? "bg-stone-50 dark:bg-stone-950" : ""}
                ${hasItems ? "cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50" : ""}
                transition-colors
              `}
            >
              {/* 날짜 번호 */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full text-sm
                    ${
                      day.isToday
                        ? "bg-lime-400 text-stone-900 font-bold"
                        : day.isCurrentMonth
                        ? dayOfWeek === 0
                          ? "text-rose-500"
                          : dayOfWeek === 6
                          ? "text-lime-600 dark:text-lime-400"
                          : "text-stone-900 dark:text-stone-100"
                        : "text-stone-300 dark:text-stone-600"
                    }
                  `}
                >
                  {day.date.getDate()}
                </span>
              </div>

              {/* 이벤트 표시 */}
              <div className="space-y-0.5">
                {/* 회고 기간 표시 */}
                {(day.retrospectives as RetrospectiveWithDateRange[]).slice(0, 1).map((retro) => {
                  const dateStr = formatDateStr(day.date);
                  const isStart = retro.startDateStr === dateStr;
                  const isEnd = retro.endDateStr === dateStr;

                  return (
                    <div
                      key={retro.id}
                      className={`
                        text-xs py-0.5 px-1 truncate
                        ${
                          retro.status === "DONE"
                            ? "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400"
                            : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                        }
                        ${isStart ? "rounded-l" : ""}
                        ${isEnd ? "rounded-r" : ""}
                      `}
                    >
                      {isStart ? "회고" : ""}
                    </div>
                  );
                })}

                {/* 할일 표시 */}
                {day.tasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`
                      text-xs py-0.5 px-1 rounded truncate
                      ${
                        task.status === "DONE"
                          ? "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400"
                          : task.status === "CANCEL"
                          ? "bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500 line-through"
                          : "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400"
                      }
                    `}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}

                {/* 더보기 표시 */}
                {day.tasks.length > 2 && (
                  <div className="text-xs text-stone-400 px-1">
                    +{day.tasks.length - 2}개
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
