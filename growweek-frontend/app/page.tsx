"use client";

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/common";
import {
  WeekInfo,
  TaskStatistics,
  RetrospectiveStatus,
  QuickTaskList,
} from "@/components/dashboard";
import { taskService, retrospectiveService } from "@/lib/api";
import type {
  WeeklyTaskResponse,
  RetrospectiveSummaryResponse,
} from "@/lib/api";
import { getCurrentWeekId } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const [weeklyData, setWeeklyData] = useState<WeeklyTaskResponse | null>(null);
  const [retrospective, setRetrospective] =
    useState<RetrospectiveSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentWeekId = getCurrentWeekId();

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);

      try {
        // 주간 할일 데이터 조회
        const tasksData = await taskService.getWeekly(currentWeekId);
        setWeeklyData(tasksData);

        // 이번 주 회고 조회 (목록에서 현재 주차에 해당하는 회고 찾기)
        const retrospectives = await retrospectiveService.getAll({ size: 10 });
        const currentWeekRetro = retrospectives.items.find(
          (r) => r.weekId === currentWeekId
        );
        setRetrospective(currentWeekRetro || null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentWeekId]);

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="대시보드" description="이번 주 할일과 회고를 확인하세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin" />
            <p className="text-stone-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // 에러 상태 (Mock 데이터로 대체)
  const mockWeeklyData: WeeklyTaskResponse = weeklyData || {
    weekId: currentWeekId,
    tasks: [],
    statistics: {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      cancel: 0,
    },
  };

  return (
    <PageLayout
      title="대시보드"
      description="이번 주 할일과 회고를 확인하세요"
      actions={
        <Link href="/tasks">
          <Button
            disabled={retrospective?.status === "DONE"}
            leftIcon={
              <svg
                className="w-4 h-4"
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
            }
          >
            할일 추가
          </Button>
        </Link>
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 주차 정보 + 통계 */}
        <div className="lg:col-span-2 space-y-6">
          <WeekInfo weekId={mockWeeklyData.weekId} />
          <TaskStatistics statistics={mockWeeklyData.statistics} />
          <QuickTaskList tasks={mockWeeklyData.tasks} />
        </div>

        {/* 우측: 회고 상태 */}
        <div className="space-y-6">
          <RetrospectiveStatus retrospective={retrospective} />

          {/* 빠른 링크 */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              빠른 링크
            </h3>
            <div className="space-y-2">
              <Link
                href="/tasks"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-lime-600 dark:text-lime-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    칸반 보드
                  </p>
                  <p className="text-sm text-stone-500">할일 관리하기</p>
                </div>
              </Link>
              <Link
                href="/retrospective"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    회고 목록
                  </p>
                  <p className="text-sm text-stone-500">지난 회고 보기</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
