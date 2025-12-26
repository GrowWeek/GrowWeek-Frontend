"use client";

import type { RetrospectiveStatus } from "@/lib/api";

interface RetrospectiveProgressProps {
  status: RetrospectiveStatus;
  questionCount: number;
  answeredCount: number;
}

const steps: { status: RetrospectiveStatus; label: string }[] = [
  { status: "TODO", label: "시작" },
  { status: "BEFORE_GENERATE_QUESTION", label: "질문 생성 대기" },
  { status: "AFTER_GENERATE_QUESTION", label: "답변 대기" },
  { status: "IN_PROGRESS", label: "작성 중" },
  { status: "DONE", label: "완료" },
];

const statusOrder: Record<RetrospectiveStatus, number> = {
  TODO: 0,
  BEFORE_GENERATE_QUESTION: 1,
  AFTER_GENERATE_QUESTION: 2,
  IN_PROGRESS: 3,
  DONE: 4,
};

export function RetrospectiveProgress({
  status,
  questionCount,
  answeredCount,
}: RetrospectiveProgressProps) {
  const currentIndex = statusOrder[status];
  const progressPercent =
    questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      {/* 단계 표시 */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-indigo-500 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 h-0.5 mx-2
                    ${isCompleted ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 답변 진행률 (질문이 있는 경우) */}
      {questionCount > 0 && status !== "TODO" && status !== "BEFORE_GENERATE_QUESTION" && (
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-500">답변 진행률</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {answeredCount} / {questionCount} ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

