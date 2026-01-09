"use client";

import { useEffect, useState, useCallback } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/common";
import {
  TaskKanban,
  TaskFormDrawer,
  TaskDetailModal,
} from "@/components/task";
import { taskService, retrospectiveService } from "@/lib/api";
import type {
  TaskResponse,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
  WeeklyTaskResponse,
  RetrospectiveSummaryResponse,
} from "@/lib/api";
import { getWeekStart, getWeekEnd, formatDate, formatDateRangeKorean } from "@/lib/utils";

export default function TasksPage() {
  const [weeklyData, setWeeklyData] = useState<WeeklyTaskResponse | null>(null);
  const [retrospective, setRetrospective] = useState<RetrospectiveSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const weekStart = formatDate(getWeekStart());
  const weekEnd = formatDate(getWeekEnd());

  // 회고가 완료된 주차인지 확인
  const isRetrospectiveCompleted = retrospective?.status === "DONE";

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 주간 할일 데이터 조회
      const data = await taskService.getWeekly(weekStart);
      setWeeklyData(data);

      // 이번 주 회고 조회 (목록에서 현재 주차에 해당하는 회고 찾기)
      const retrospectives = await retrospectiveService.getAll({ size: 10 });
      const currentWeekRetro = retrospectives.items.find(
        (r) => r.startDate === weekStart || r.endDate === weekEnd
      );
      setRetrospective(currentWeekRetro || null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("할일을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [weekStart, weekEnd]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 상태 변경 핸들러
  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    if (isRetrospectiveCompleted) {
      alert("회고가 완료된 주차의 할일은 상태를 변경할 수 없습니다.");
      return;
    }

    try {
      await taskService.updateStatus(taskId, { status: newStatus });
      await fetchTasks(); // 목록 새로고침
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  // 할일 클릭 핸들러
  const handleTaskClick = (task: TaskResponse) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  // 할일 추가 핸들러
  const handleAddTask = () => {
    if (isRetrospectiveCompleted) {
      alert("회고가 완료된 주차에는 할일을 추가할 수 없습니다.");
      return;
    }
    setSelectedTask(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  // 할일 수정 핸들러
  const handleEditTask = () => {
    if (isRetrospectiveCompleted) {
      alert("회고가 완료된 주차의 할일은 수정할 수 없습니다.");
      return;
    }
    setIsDetailModalOpen(false);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  // 할일 삭제 핸들러
  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    if (isRetrospectiveCompleted) {
      alert("회고가 완료된 주차의 할일은 삭제할 수 없습니다.");
      return;
    }

    if (!confirm("정말 이 할일을 삭제하시겠습니까?")) return;

    try {
      await taskService.delete(selectedTask.id);
      setIsDetailModalOpen(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // 폼 제출 핸들러
  const handleFormSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    if (isRetrospectiveCompleted) {
      throw new Error("회고가 완료된 주차에는 할일을 추가하거나 수정할 수 없습니다.");
    }

    try {
      if (formMode === "create") {
        await taskService.create(data as CreateTaskRequest);
      } else if (selectedTask) {
        await taskService.update(selectedTask.id, data as UpdateTaskRequest);
      }
      await fetchTasks();
    } catch (err) {
      console.error("Failed to submit task:", err);
      throw err;
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="할일 관리" description="칸반 보드로 할일을 관리하세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-zinc-500">할일을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const tasks = weeklyData?.tasks || [];
  const dateRange = weeklyData
    ? formatDateRangeKorean(weeklyData.weekStart, weeklyData.weekEnd)
    : "";

  return (
    <PageLayout
      title="할일 관리"
      description={`이번 주 (${dateRange}) 할일을 관리하세요`}
      actions={
        <Button
          onClick={handleAddTask}
          disabled={isRetrospectiveCompleted}
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
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
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
              onClick={fetchTasks}
              className="ml-auto text-sm underline hover:no-underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 회고 완료 안내 */}
      {isRetrospectiveCompleted && (
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
            <span className="text-sm font-medium">
              이번 주 회고가 완료되어 할일을 추가하거나 수정할 수 없습니다.
            </span>
          </div>
        </div>
      )}

      {/* 통계 요약 */}
      {weeklyData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {weeklyData.statistics.total}
            </p>
            <p className="text-sm text-zinc-500">전체</p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-800">
            <p className="text-2xl font-bold text-sky-700 dark:text-sky-300">
              {weeklyData.statistics.inProgress}
            </p>
            <p className="text-sm text-sky-600 dark:text-sky-400">진행 중</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {weeklyData.statistics.done}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">완료</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {weeklyData.statistics.total > 0
                ? Math.round(
                    (weeklyData.statistics.done / weeklyData.statistics.total) * 100
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-zinc-500">완료율</p>
          </div>
        </div>
      )}

      {/* 칸반 보드 */}
      <TaskKanban
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        isRetrospectiveCompleted={isRetrospectiveCompleted}
      />

      {/* 할일 추가/수정 드로어 */}
      <TaskFormDrawer
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        mode={formMode}
      />

      {/* 할일 상세 모달 */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </PageLayout>
  );
}

