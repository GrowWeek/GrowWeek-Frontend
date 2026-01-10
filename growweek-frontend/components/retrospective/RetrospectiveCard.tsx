"use client";

import Link from "next/link";
import { Badge } from "@/components/common";
import type { RetrospectiveSummaryResponse, RetrospectiveStatus } from "@/lib/api";
import { formatWeekIdKorean } from "@/lib/utils";

interface RetrospectiveCardProps {
  retrospective: RetrospectiveSummaryResponse;
}

const statusConfig: Record<
  RetrospectiveStatus,
  { label: string; variant: "default" | "info" | "warning" | "success" | "primary" }
> = {
  TODO: { label: "시작 전", variant: "default" },
  BEFORE_GENERATE_QUESTION: { label: "질문 생성 대기", variant: "info" },
  AFTER_GENERATE_QUESTION: { label: "답변 대기", variant: "warning" },
  IN_PROGRESS: { label: "작성 중", variant: "primary" },
  DONE: { label: "완료", variant: "success" },
};

export function RetrospectiveCard({ retrospective }: RetrospectiveCardProps) {
  const status = statusConfig[retrospective.status];
  const progressPercent =
    retrospective.questionCount > 0
      ? Math.round((retrospective.answeredCount / retrospective.questionCount) * 100)
      : 0;

  return (
    <Link
      href={`/retrospective/${retrospective.id}`}
      className="block bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 hover:border-lime-400 dark:hover:border-lime-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-stone-500 mb-1">
            {formatWeekIdKorean(retrospective.weekId)}
          </p>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        {retrospective.status === "DONE" && (
          <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-lime-600 dark:text-lime-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 진행률 */}
      {retrospective.questionCount > 0 && retrospective.status !== "TODO" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-500">답변 진행률</span>
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {retrospective.answeredCount}/{retrospective.questionCount}
            </span>
          </div>
          <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 생성일 */}
      <p className="mt-3 text-xs text-stone-400">
        {new Date(retrospective.createdAt).toLocaleDateString("ko-KR")} 생성
      </p>
    </Link>
  );
}
