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
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
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
                        ? "bg-lime-400 text-stone-900"
                        : isCurrent
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-500"
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
                    ${isCurrent ? "text-stone-900 dark:text-stone-100" : "text-stone-500"}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 h-0.5 mx-2
                    ${isCompleted ? "bg-lime-400" : "bg-stone-200 dark:bg-stone-700"}
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
            <span className="text-stone-500">답변 진행률</span>
            <span className="font-medium text-stone-900 dark:text-stone-100">
              {answeredCount} / {questionCount} ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

