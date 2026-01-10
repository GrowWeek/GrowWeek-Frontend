"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/common";
import { TaskFormModal } from "@/components/task";
import { taskService } from "@/lib/api";
import type { TaskResponse, TaskStatus, UpdateTaskRequest } from "@/lib/api";
import { formatWeekIdKorean } from "@/lib/utils";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; variant: "default" | "info" | "success" | "danger"; bgColor: string }
> = {
  TODO: { label: "할 일", variant: "default", bgColor: "bg-zinc-100 dark:bg-zinc-800" },
  IN_PROGRESS: { label: "진행 중", variant: "info", bgColor: "bg-sky-50 dark:bg-sky-900/30" },
  DONE: { label: "완료", variant: "success", bgColor: "bg-emerald-50 dark:bg-emerald-900/30" },
  CANCEL: { label: "취소", variant: "danger", bgColor: "bg-rose-50 dark:bg-rose-900/30" },
};

const priorityConfig: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: "높음", color: "text-rose-700 dark:text-rose-300", bgColor: "bg-rose-100 dark:bg-rose-900/30" },
  2: { label: "중간", color: "text-amber-700 dark:text-amber-300", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  3: { label: "낮음", color: "text-emerald-700 dark:text-emerald-300", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
};

function getPriorityConfig(priority: number) {
  if (priority === 1) return priorityConfig[1];
  if (priority === 2) return priorityConfig[2];
  return priorityConfig[3];
}

const sensitivityLabels: Record<string, string> = {
  NONE: "없음",
  TITLE_ONLY: "제목만",
  NEVER: "항상",
};

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const taskId = parseInt(id);

  useEffect(() => {
    async function fetchTask() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await taskService.getById(taskId);
        setTask(data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("할일을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!isNaN(taskId)) {
      fetchTask();
    }
  }, [taskId]);

  const handleEdit = async (data: UpdateTaskRequest) => {
    try {
      const updated = await taskService.update(taskId, data);
      setTask(updated);
    } catch (err) {
      console.error("Failed to update task:", err);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 할일을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await taskService.delete(taskId);
      router.push("/tasks");
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task || task.hasRetrospective) return;

    try {
      const updated = await taskService.updateStatus(taskId, { status: newStatus });
      setTask(updated);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="할일 상세" description="할일 정보를 확인하세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-zinc-500">할일을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // 에러 상태
  if (error || !task) {
    return (
      <PageLayout title="할일 상세" description="할일 정보를 확인하세요">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-rose-600"
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
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            {error || "할일을 찾을 수 없습니다."}
          </p>
          <Button variant="secondary" onClick={() => router.push("/tasks")}>
            목록으로 돌아가기
          </Button>
        </div>
      </PageLayout>
    );
  }

  const status = statusConfig[task.status];
  const priority = getPriorityConfig(task.priority);
  const isLocked = task.hasRetrospective;

  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== "DONE" && task.status !== "CANCEL";

  return (
    <PageLayout
      title="할일 상세"
      description="할일 정보를 확인하고 수정하세요"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/tasks")}>
            ← 목록
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            disabled={isLocked}
          >
            수정
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isLocked}
          >
            삭제
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 잠금 알림 */}
        {isLocked && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  이 할일은 잠겨있습니다
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  회고가 작성된 할일은 수정하거나 삭제할 수 없습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 메인 카드 */}
        <Card>
          <CardContent className="p-8">
            {/* 상태 & 우선순위 배지 */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant={status.variant} className="text-sm px-3 py-1">
                {status.label}
              </Badge>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${priority.bgColor} ${priority.color}`}>
                우선순위: {priority.label}
              </span>
              {isOverdue && (
                <Badge variant="danger" className="text-sm px-3 py-1">
                  마감일 지남
                </Badge>
              )}
              {isLocked && (
                <Badge variant="warning" className="text-sm px-3 py-1">
                  🔒 잠김
                </Badge>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {task.title}
            </h1>

            {/* 설명 */}
            {task.description ? (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-zinc-500 mb-2">설명</h2>
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </p>
              </div>
            ) : (
              <p className="text-zinc-400 dark:text-zinc-500 mb-8 italic">
                설명이 없습니다.
              </p>
            )}

            {/* 상태 변경 버튼 */}
            {!isLocked && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-zinc-500 mb-3">상태 변경</h2>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(statusConfig) as TaskStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={task.status === s}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${
                          task.status === s
                            ? `${statusConfig[s].bgColor} ring-2 ring-indigo-500`
                            : `${statusConfig[s].bgColor} opacity-60 hover:opacity-100`
                        }
                      `}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 상세 정보 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 일정 정보 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                일정 정보
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">주차</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatWeekIdKorean(task.weekId)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">마감일</span>
                  <span className={`font-medium ${isOverdue ? "text-rose-600" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {new Date(task.dueDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                    {isOverdue && " (지남)"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-zinc-500">남은 기간</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {task.status === "DONE" || task.status === "CANCEL"
                      ? "-"
                      : isOverdue
                      ? `${Math.ceil((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))}일 초과`
                      : `${Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일 남음`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                추가 정보
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">민감도</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {sensitivityLabels[task.sensitivityLevel]}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">회고 작성</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {task.hasRetrospective ? "완료" : "미작성"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">생성일</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(task.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-zinc-500">최종 수정</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(task.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 수정 모달 */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        task={task}
        mode="edit"
      />
    </PageLayout>
  );
}

