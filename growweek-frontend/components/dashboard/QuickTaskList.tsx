"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/common";
import type { TaskResponse, TaskStatus } from "@/lib/api";

interface QuickTaskListProps {
  tasks: TaskResponse[];
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
  1: { label: "높음", color: "text-rose-500" },
  2: { label: "중간", color: "text-amber-500" },
  3: { label: "낮음", color: "text-lime-500" },
};

function getPriorityConfig(priority: number) {
  if (priority === 1) return priorityConfig[1];
  if (priority === 2) return priorityConfig[2];
  return priorityConfig[3];
}

export function QuickTaskList({ tasks }: QuickTaskListProps) {
  const activeTasks = tasks
    .filter((task) => task.status === "TODO" || task.status === "IN_PROGRESS")
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>진행 중인 할일</CardTitle>
          <Link
            href="/tasks"
            className="text-sm text-lime-600 hover:text-lime-700 dark:text-lime-400 dark:hover:text-lime-300 font-medium"
          >
            전체 보기 →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {activeTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              진행 중인 할일이 없습니다
            </p>
            <Link
              href="/tasks"
              className="text-sm text-lime-600 hover:text-lime-700 dark:text-lime-400 font-medium mt-2 inline-block"
            >
              할일 추가하기
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTasks.map((task) => {
              const priority = getPriorityConfig(task.priority);
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs ${priority.color}`}>●</span>
                        <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm truncate">
                          {task.title}
                        </h4>
                      </div>
                      {task.description && (
                        <p className="text-xs text-stone-500 truncate pl-4">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={statusConfig[task.status].variant}>
                        {statusConfig[task.status].label}
                      </Badge>
                      <span className="text-xs text-stone-400">
                        {new Date(task.dueDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
