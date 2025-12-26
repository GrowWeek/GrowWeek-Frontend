"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableTaskCard } from "./TaskCard";
import type { TaskResponse, TaskStatus } from "@/lib/api";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: TaskResponse[];
  onTaskClick: (task: TaskResponse) => void;
  onAddTask?: () => void;
}

const columnConfig: Record<
  TaskStatus,
  { title: string; color: string; bgColor: string; borderColor: string }
> = {
  TODO: {
    title: "할 일",
    color: "text-zinc-700 dark:text-zinc-300",
    bgColor: "bg-zinc-100 dark:bg-zinc-800",
    borderColor: "border-zinc-300 dark:border-zinc-600",
  },
  IN_PROGRESS: {
    title: "진행 중",
    color: "text-sky-700 dark:text-sky-300",
    bgColor: "bg-sky-50 dark:bg-sky-900/30",
    borderColor: "border-sky-300 dark:border-sky-700",
  },
  DONE: {
    title: "완료",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    borderColor: "border-emerald-300 dark:border-emerald-700",
  },
  CANCEL: {
    title: "취소",
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-50 dark:bg-rose-900/30",
    borderColor: "border-rose-300 dark:border-rose-700",
  },
};

export function TaskColumn({
  status,
  tasks,
  onTaskClick,
  onAddTask,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = columnConfig[status];
  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={`
        flex flex-col h-full min-h-[500px]
        bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl
        border-2 border-dashed
        ${isOver ? config.borderColor : "border-transparent"}
        transition-colors duration-200
      `}
    >
      {/* Column Header */}
      <div className={`px-4 py-3 rounded-t-2xl ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}
            >
              {tasks.length}
            </span>
          </div>
          {status === "TODO" && onAddTask && (
            <button
              onClick={onAddTask}
              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-colors"
              title="할일 추가"
            >
              <svg
                className="w-5 h-5 text-zinc-500"
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
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 p-3 space-y-3 overflow-y-auto
          ${isOver ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}
          transition-colors duration-200
        `}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-400">
            <svg
              className="w-8 h-8 mb-2"
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
            <p className="text-sm">할일이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

