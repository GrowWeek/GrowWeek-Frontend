"use client";

import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskResponse } from "@/lib/api";

interface TaskCardProps {
  task: TaskResponse;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityConfig: Record<number, { label: string; color: string; dot: string }> = {
  1: { label: "높음", color: "text-rose-600 dark:text-rose-400", dot: "bg-rose-400" },
  2: { label: "중간", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-400" },
  3: { label: "낮음", color: "text-lime-600 dark:text-lime-400", dot: "bg-lime-400" },
};

function getPriorityConfig(priority: number) {
  if (priority === 1) return priorityConfig[1];
  if (priority === 2) return priorityConfig[2];
  return priorityConfig[3];
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const priority = getPriorityConfig(task.priority);
  const dueDate = useMemo(() => new Date(task.dueDate), [task.dueDate]);
  const now = useMemo(() => new Date(), []);
  const twoDaysFromNow = useMemo(() => new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), [now]);

  const isOverdue = dueDate < now && task.status !== "DONE" && task.status !== "CANCEL";
  const isDueSoon =
    !isOverdue &&
    dueDate <= twoDaysFromNow &&
    task.status !== "DONE" &&
    task.status !== "CANCEL";

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-stone-800 rounded-lg p-3.5
        border border-stone-200 dark:border-stone-700
        hover:border-lime-400 dark:hover:border-lime-600
        cursor-pointer transition-all duration-150
        ${isDragging ? "shadow-lg rotate-1 scale-[1.02]" : ""}
        ${task.hasRetrospective ? "opacity-60" : ""}
      `}
    >
      {/* 헤더: 우선순위 + 잠금 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <span className={`text-xs font-medium ${priority.color}`}>
            {priority.label}
          </span>
        </div>
        {task.hasRetrospective && (
          <div className="flex items-center gap-1 text-stone-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 제목 */}
      <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm mb-1.5 line-clamp-2">
        {task.title}
      </h4>

      {/* 설명 */}
      {task.description && (
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2.5 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* 마감일 */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1 text-xs ${
            isOverdue
              ? "text-rose-600 dark:text-rose-400"
              : isDueSoon
              ? "text-amber-600 dark:text-amber-400"
              : "text-stone-500"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
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
