"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/common";
import type { TaskResponse, TaskStatus } from "@/lib/api";

interface TaskCardProps {
  task: TaskResponse;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityConfig: Record<number, { label: string; color: string; dot: string }> = {
  1: { label: "높음", color: "text-rose-600", dot: "bg-rose-500" },
  2: { label: "중간", color: "text-amber-600", dot: "bg-amber-500" },
  3: { label: "낮음", color: "text-emerald-600", dot: "bg-emerald-500" },
};

function getPriorityConfig(priority: number) {
  if (priority === 1) return priorityConfig[1];
  if (priority === 2) return priorityConfig[2];
  return priorityConfig[3];
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const priority = getPriorityConfig(task.priority);
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== "DONE" && task.status !== "CANCEL";
  const isDueSoon =
    !isOverdue &&
    dueDate <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) &&
    task.status !== "DONE" &&
    task.status !== "CANCEL";

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-zinc-800 rounded-xl p-4
        border border-zinc-200 dark:border-zinc-700
        hover:border-indigo-300 dark:hover:border-indigo-700
        hover:shadow-md
        cursor-pointer transition-all duration-200
        ${isDragging ? "shadow-xl rotate-2 scale-105" : ""}
        ${task.hasRetrospective ? "opacity-75" : ""}
      `}
    >
      {/* 헤더: 우선순위 + 잠금 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
          <span className={`text-xs font-medium ${priority.color}`}>
            {priority.label}
          </span>
        </div>
        {task.hasRetrospective && (
          <div className="flex items-center gap-1 text-zinc-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs">잠김</span>
          </div>
        )}
      </div>

      {/* 제목 */}
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* 설명 */}
      {task.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* 마감일 */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 text-xs ${
            isOverdue
              ? "text-rose-600"
              : isDueSoon
              ? "text-amber-600"
              : "text-zinc-500"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {dueDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            {isOverdue && " (지남)"}
            {isDueSoon && " (임박)"}
          </span>
        </div>
      </div>
    </div>
  );
}

// 드래그 가능한 태스크 카드
export function DraggableTaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
}

