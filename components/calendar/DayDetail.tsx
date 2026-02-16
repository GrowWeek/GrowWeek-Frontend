"use client";

import Link from "next/link";
import { Modal, Badge } from "@/components/common";
import type { TaskResponse, RetrospectiveSummaryResponse, TaskStatus, RetrospectiveStatus } from "@/lib/api";
import { formatWeekIdKorean } from "@/lib/utils";

interface DayDetailProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  tasks: TaskResponse[];
  retrospectives: RetrospectiveSummaryResponse[];
}

const taskStatusConfig: Record<TaskStatus, { label: string; variant: "default" | "info" | "success" | "danger" }> = {
  TODO: { label: "할 일", variant: "default" },
  IN_PROGRESS: { label: "진행 중", variant: "info" },
  DONE: { label: "완료", variant: "success" },
  CANCEL: { label: "취소", variant: "danger" },
};

const retroStatusConfig: Record<RetrospectiveStatus, { label: string; variant: "default" | "info" | "warning" | "success" | "primary" }> = {
  TODO: { label: "시작 전", variant: "default" },
  BEFORE_GENERATE_QUESTION: { label: "질문 생성 대기", variant: "info" },
  AFTER_GENERATE_QUESTION: { label: "답변 대기", variant: "warning" },
  IN_PROGRESS: { label: "작성 중", variant: "primary" },
  DONE: { label: "완료", variant: "success" },
};

export function DayDetail({
  isOpen,
  onClose,
  date,
  tasks,
  retrospectives,
}: DayDetailProps) {
  if (!date) return null;

  const dateStr = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dateStr} size="lg">
      <div className="p-5 space-y-5">
        {/* 회고 섹션 */}
        {retrospectives.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 mb-2.5 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              회고 기간
            </h3>
            <div className="space-y-2">
              {retrospectives.map((retro) => (
                <Link
                  key={retro.id}
                  href={`/retrospective/${retro.id}`}
                  onClick={onClose}
                  className="block p-3 bg-lime-50 dark:bg-lime-900/20 rounded-lg hover:bg-lime-100 dark:hover:bg-lime-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                        {formatWeekIdKorean(retro.weekId)}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        답변: {retro.answeredCount}/{retro.questionCount}
                      </p>
                    </div>
                    <Badge variant={retroStatusConfig[retro.status].variant}>
                      {retroStatusConfig[retro.status].label}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 할일 섹션 */}
        {tasks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 mb-2.5 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              마감 할일 ({tasks.length})
            </h3>
            <div className="space-y-2">
              {tasks.map((task) => {
                const status = taskStatusConfig[task.status];
                const priorityColor =
                  task.priority === 1
                    ? "bg-rose-500"
                    : task.priority === 2
                    ? "bg-amber-500"
                    : "bg-lime-400";

                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    onClick={onClose}
                    className="block p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${priorityColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-medium text-stone-900 dark:text-stone-100 text-sm truncate ${task.status === "CANCEL" ? "line-through text-stone-400" : ""}`}>
                            {task.title}
                          </p>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-stone-500 mt-0.5 truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {tasks.length === 0 && retrospectives.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-stone-500 text-sm">이 날에는 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
