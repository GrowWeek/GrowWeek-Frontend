"use client";

import Link from "next/link";
import { Card, CardContent, Badge, Button } from "@/components/common";
import type {
  RetrospectiveSummaryResponse,
  RetrospectiveStatus as RetroStatus,
} from "@/lib/api";
import { isFriday } from "@/lib/utils";

interface RetrospectiveStatusProps {
  retrospective?: RetrospectiveSummaryResponse | null;
}

const statusConfig: Record<
  RetroStatus,
  { label: string; variant: "default" | "primary" | "warning" | "success" | "info" }
> = {
  TODO: { label: "시작 전", variant: "default" },
  BEFORE_GENERATE_QUESTION: { label: "질문 생성 대기", variant: "info" },
  AFTER_GENERATE_QUESTION: { label: "답변 대기", variant: "warning" },
  IN_PROGRESS: { label: "작성 중", variant: "primary" },
  DONE: { label: "완료", variant: "success" },
};

export function RetrospectiveStatus({
  retrospective,
}: RetrospectiveStatusProps) {
  const showFridayReminder = isFriday() && (!retrospective || retrospective.status !== "DONE");

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                이번 주 회고
              </h3>
              {retrospective ? (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusConfig[retrospective.status].variant}>
                    {statusConfig[retrospective.status].label}
                  </Badge>
                  {retrospective.status !== "TODO" &&
                    retrospective.status !== "DONE" && (
                      <span className="text-sm text-zinc-500">
                        {retrospective.answeredCount}/{retrospective.questionCount} 답변 완료
                      </span>
                    )}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 mt-1">
                  아직 회고가 생성되지 않았습니다
                </p>
              )}
            </div>
          </div>

          <Link href={retrospective ? `/retrospective/${retrospective.id}` : "/retrospective/write"}>
            <Button variant={retrospective ? "secondary" : "primary"} size="sm">
              {retrospective ? "회고 보기" : "회고 작성"}
            </Button>
          </Link>
        </div>

        {/* Friday Reminder */}
        {showFridayReminder && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                오늘은 금요일이에요! 이번 주 회고를 작성해보세요.
              </span>
            </div>
          </div>
        )}

        {/* Progress for IN_PROGRESS */}
        {retrospective && retrospective.status === "IN_PROGRESS" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-500">답변 진행률</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {Math.round(
                  (retrospective.answeredCount / retrospective.questionCount) * 100
                )}
                %
              </span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(retrospective.answeredCount / retrospective.questionCount) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

