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
    color: "text-stone-700 dark:text-stone-300",
    bgColor: "bg-stone-100 dark:bg-stone-800",
    borderColor: "border-stone-300 dark:border-stone-600",
  },
  IN_PROGRESS: {
    title: "진행 중",
    color: "text-lime-700 dark:text-lime-400",
    bgColor: "bg-lime-50 dark:bg-lime-900/20",
    borderColor: "border-lime-400 dark:border-lime-600",
  },
  DONE: {
    title: "완료",
    color: "text-lime-700 dark:text-lime-400",
    bgColor: "bg-lime-50 dark:bg-lime-900/20",
    borderColor: "border-lime-400 dark:border-lime-600",
  },
  CANCEL: {
    title: "취소",
    color: "text-stone-500 dark:text-stone-400",
    bgColor: "bg-stone-100 dark:bg-stone-800",
    borderColor: "border-stone-300 dark:border-stone-700",
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
        bg-stone-50 dark:bg-stone-900/50 rounded-xl
        border-2 border-dashed
        ${isOver ? config.borderColor : "border-transparent"}
        transition-colors duration-150
      `}
    >
      {/* Column Header */}
      <div className={`px-3 py-2.5 rounded-t-xl ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium text-sm ${config.color}`}>{config.title}</h3>
            <span
              className={`px-1.5 py-0.5 text-xs font-medium rounded ${config.bgColor} ${config.color}`}
            >
              {tasks.length}
            </span>
          </div>
          {status === "TODO" && onAddTask && (
            <button
              onClick={onAddTask}
              className="p-1 rounded-md hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors"
              title="할일 추가"
            >
              <svg
                className="w-4 h-4 text-stone-500"
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
          flex-1 p-2.5 space-y-2 overflow-y-auto
          ${isOver ? "bg-lime-50/50 dark:bg-lime-900/10" : ""}
          transition-colors duration-150
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
          <div className="flex flex-col items-center justify-center h-28 text-stone-400">
            <svg
              className="w-6 h-6 mb-1.5"
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
            <p className="text-xs">할일이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
