"use client";

import { Modal, Button, Badge } from "@/components/common";
import type { TaskResponse, TaskStatus } from "@/lib/api";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskResponse | null;
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; variant: "default" | "info" | "success" | "danger" }
> = {
  TODO: { label: "할 일", variant: "default" },
  IN_PROGRESS: { label: "진행 중", variant: "info" },
  DONE: { label: "완료", variant: "success" },
  CANCEL: { label: "취소", variant: "danger" },
};

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: "🔴 높음", color: "text-rose-600" },
  2: { label: "🟡 중간", color: "text-amber-600" },
  3: { label: "🟢 낮음", color: "text-emerald-600" },
};

function getPriorityConfig(priority: number) {
  if (priority === 1) return priorityConfig[1];
  if (priority === 2) return priorityConfig[2];
  return priorityConfig[3];
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const priority = getPriorityConfig(task.priority);
  const status = statusConfig[task.status];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할일 상세" size="lg">
      <div className="p-6">
        {/* 상태 & 우선순위 */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={status.variant}>{status.label}</Badge>
          <span className={`text-sm font-medium ${priority.color}`}>
            {priority.label}
          </span>
          {task.hasRetrospective && (
            <Badge variant="warning">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              잠김
            </Badge>
          )}
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {task.title}
        </h2>

        {/* 설명 */}
        {task.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-2">설명</h3>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* 메타 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <div>
            <h3 className="text-xs font-medium text-zinc-500 mb-1">시작일</h3>
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              {new Date(task.startDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-500 mb-1">마감일</h3>
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              {new Date(task.dueDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-500 mb-1">생성일</h3>
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              {new Date(task.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-500 mb-1">수정일</h3>
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              {new Date(task.updatedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            variant="danger"
            onClick={onDelete}
            disabled={task.hasRetrospective}
          >
            삭제
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              닫기
            </Button>
            <Button onClick={onEdit} disabled={task.hasRetrospective}>
              수정
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

