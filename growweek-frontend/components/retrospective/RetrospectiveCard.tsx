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
      className="block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-zinc-500 mb-1">
            {formatWeekIdKorean(retrospective.weekId)}
          </p>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        {retrospective.status === "DONE" && (
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
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
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-500">답변 진행률</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {retrospective.answeredCount}/{retrospective.questionCount}
            </span>
          </div>
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                retrospective.status === "DONE"
                  ? "bg-emerald-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 생성일 */}
      <p className="mt-3 text-xs text-zinc-400">
        {new Date(retrospective.createdAt).toLocaleDateString("ko-KR")} 생성
      </p>
    </Link>
  );
}

