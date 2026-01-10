"use client";

import { useEffect, useState, useCallback } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/common";
import { CalendarGrid, DayDetail } from "@/components/calendar";
import { taskService, retrospectiveService } from "@/lib/api";
import type { TaskResponse, RetrospectiveSummaryResponse } from "@/lib/api";
import { parseWeekId, formatDate } from "@/lib/utils";

export default function CalendarPage() {
  // 현재 년월
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // 데이터
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [retrospectives, setRetrospectives] = useState<RetrospectiveSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 날짜 상세 모달
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 해당 월의 시작일과 종료일
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const startStr = formatDateStr(startDate);
      const endStr = formatDateStr(endDate);

      // 할일과 회고 데이터 병렬 로드
      const [tasksRes, retrospectivesRes] = await Promise.all([
        taskService.getAll({ page: 0, size: 100 }),
        retrospectiveService.getMonthly(year, month),
      ]);

      // 해당 월에 마감일이 있는 할일 필터링
      const monthTasks = tasksRes.items.filter((task) => {
        if (!task.dueDate) return false;
        return task.dueDate >= startStr && task.dueDate <= endStr;
      });

      setTasks(monthTasks);
      setRetrospectives(retrospectivesRes.retrospectives);
    } catch (err) {
      console.error("Failed to fetch calendar data:", err);
      setError("캘린더 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  // 오늘로 이동
  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  };

  // 날짜 클릭
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDetailOpen(true);
  };

  // 선택된 날짜의 할일과 회고
  const getSelectedDateItems = () => {
    if (!selectedDate) return { tasks: [], retrospectives: [] };

    const dateStr = formatDateStr(selectedDate);

    const dateTasks = tasks.filter((t) => t.dueDate === dateStr);
    const dateRetros = retrospectives.filter((r) => {
      // weekId를 파싱하여 해당 주의 시작일과 종료일을 구함
      const { start, end } = parseWeekId(r.weekId);
      const startStr = formatDate(start);
      const endStr = formatDate(end);
      return dateStr >= startStr && dateStr <= endStr;
    });

    return { tasks: dateTasks, retrospectives: dateRetros };
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="캘린더" description="할일과 회고 일정을 확인하세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin" />
            <p className="text-stone-500">캘린더를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const selectedItems = getSelectedDateItems();

  return (
    <PageLayout
      title="캘린더"
      description="할일 마감일과 회고 기간을 한눈에 확인하세요"
    >
      <div className="space-y-6">
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
                onClick={fetchData}
                className="ml-auto text-sm underline hover:no-underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 캘린더 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-stone-600 dark:text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 min-w-[140px] text-center">
                {year}년 {month}월
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-stone-600 dark:text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            {!isCurrentMonth() && (
              <Button variant="outline" size="sm" onClick={handleToday}>
                오늘
              </Button>
            )}
          </div>

          {/* 범례 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-stone-200 dark:bg-stone-700" />
              <span className="text-stone-600 dark:text-stone-400">할일</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-lime-200 dark:bg-lime-800" />
              <span className="text-stone-600 dark:text-stone-400">회고 기간</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-lime-400" />
              <span className="text-stone-600 dark:text-stone-400">완료</span>
            </div>
          </div>
        </div>

        {/* 월간 요약 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4">
            <p className="text-sm text-stone-500 mb-1">전체 할일</p>
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {tasks.length}
            </p>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4">
            <p className="text-sm text-stone-500 mb-1">완료</p>
            <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {tasks.filter((t) => t.status === "DONE").length}
            </p>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4">
            <p className="text-sm text-stone-500 mb-1">진행 중</p>
            <p className="text-2xl font-bold text-lime-700 dark:text-lime-300">
              {tasks.filter((t) => t.status === "IN_PROGRESS").length}
            </p>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4">
            <p className="text-sm text-stone-500 mb-1">회고</p>
            <p className="text-2xl font-bold text-stone-700 dark:text-stone-300">
              {retrospectives.length}
            </p>
          </div>
        </div>

        {/* 캘린더 그리드 */}
        <CalendarGrid
          year={year}
          month={month}
          tasks={tasks}
          retrospectives={retrospectives}
          onDateClick={handleDateClick}
        />

        {/* 날짜 상세 모달 */}
        <DayDetail
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          date={selectedDate}
          tasks={selectedItems.tasks}
          retrospectives={selectedItems.retrospectives}
        />
      </div>
    </PageLayout>
  );
}

function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

