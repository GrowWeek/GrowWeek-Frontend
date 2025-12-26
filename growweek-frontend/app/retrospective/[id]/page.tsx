"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/common";
import { RetrospectiveProgress } from "@/components/retrospective";
import { retrospectiveService } from "@/lib/api";
import type {
  RetrospectiveResponse,
  RetrospectiveStatus,
  AnswerResponse,
} from "@/lib/api";
import { formatDateRangeKorean } from "@/lib/utils";

interface RetrospectiveDetailPageProps {
  params: Promise<{ id: string }>;
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

export default function RetrospectiveDetailPage({
  params,
}: RetrospectiveDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [retrospective, setRetrospective] = useState<RetrospectiveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const retrospectiveId = parseInt(id);

  useEffect(() => {
    async function fetchRetrospective() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await retrospectiveService.getById(retrospectiveId);
        setRetrospective(data);
      } catch (err) {
        console.error("Failed to fetch retrospective:", err);
        setError("회고를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!isNaN(retrospectiveId)) {
      fetchRetrospective();
    }
  }, [retrospectiveId]);

  const handleDelete = async () => {
    if (!confirm("정말 이 회고를 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await retrospectiveService.delete(retrospectiveId);
      router.push("/retrospective");
    } catch (err) {
      console.error("Failed to delete retrospective:", err);
      alert("삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  };

  const handleContinueWriting = () => {
    router.push("/retrospective/write");
  };

  // 답변 찾기 헬퍼
  const getAnswerForQuestion = (questionId: number): AnswerResponse | undefined => {
    return retrospective?.answers.find((a) => a.questionId === questionId);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="회고 상세" description="회고 내용을 확인하세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-zinc-500">회고를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // 에러 상태
  if (error || !retrospective) {
    return (
      <PageLayout title="회고 상세" description="회고 내용을 확인하세요">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            {error || "회고를 찾을 수 없습니다."}
          </p>
          <Button variant="secondary" onClick={() => router.push("/retrospective")}>
            목록으로 돌아가기
          </Button>
        </div>
      </PageLayout>
    );
  }

  const status = statusConfig[retrospective.status];
  const answeredCount = retrospective.answers.filter((a) => a.content).length;
  const isCompleted = retrospective.status === "DONE";
  const canContinue = !isCompleted && retrospective.status !== "TODO";

  return (
    <PageLayout
      title="회고 상세"
      description={formatDateRangeKorean(retrospective.startDate, retrospective.endDate)}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/retrospective")}>
            ← 목록
          </Button>
          {canContinue && (
            <Button variant="secondary" onClick={handleContinueWriting}>
              이어서 작성
            </Button>
          )}
          {!isCompleted && (
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              삭제
            </Button>
          )}
        </div>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 상태 배지 */}
        <div className="flex items-center gap-3">
          <Badge variant={status.variant} className="text-sm px-3 py-1">
            {status.label}
          </Badge>
          <span className="text-zinc-500">
            {formatDateRangeKorean(retrospective.startDate, retrospective.endDate)}
          </span>
        </div>

        {/* 진행 상태 */}
        <RetrospectiveProgress
          status={retrospective.status}
          questionCount={retrospective.questionCount}
          answeredCount={answeredCount}
        />

        {/* 완료 안내 */}
        {isCompleted && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center">
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
              <div>
                <p className="font-medium text-emerald-800 dark:text-emerald-200">
                  회고가 완료되었습니다
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {new Date(retrospective.updatedAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}에 완료됨
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 질문-답변 목록 */}
        {retrospective.questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              회고 질문 및 답변
              <Badge variant="primary">
                {answeredCount}/{retrospective.questionCount}
              </Badge>
            </h2>

            {retrospective.questions
              .sort((a, b) => a.order - b.order)
              .map((question) => {
                const answer = getAnswerForQuestion(question.id);
                const hasAnswer = !!answer?.content;

                return (
                  <Card key={question.id}>
                    <CardContent className="p-6">
                      {/* 질문 */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${
                              hasAnswer
                                ? "bg-emerald-500 text-white"
                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                            }
                          `}
                        >
                          {hasAnswer ? (
                            <svg
                              className="w-4 h-4"
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
                          ) : (
                            question.order
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                            {question.content}
                          </h3>
                        </div>
                      </div>

                      {/* 답변 */}
                      <div className="ml-12">
                        {hasAnswer ? (
                          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                              {answer.content}
                            </p>
                            {answer.updatedAt && (
                              <p className="mt-3 text-xs text-zinc-400">
                                {new Date(answer.updatedAt).toLocaleDateString("ko-KR", {
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}에 작성됨
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                            <p className="text-zinc-400 italic">답변이 작성되지 않았습니다.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {/* 질문이 없는 경우 */}
        {retrospective.questions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-zinc-500 mb-4">아직 질문이 생성되지 않았습니다.</p>
              <Button onClick={handleContinueWriting}>질문 생성하기</Button>
            </CardContent>
          </Card>
        )}

        {/* 추가 메모 */}
        {retrospective.additionalNotes && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-500"
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
                추가 메모
              </h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {retrospective.additionalNotes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 메타 정보 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              회고 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">회고 기간</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatDateRangeKorean(retrospective.startDate, retrospective.endDate)}
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">질문 수</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {retrospective.questionCount}개
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">생성일</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {new Date(retrospective.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">최종 수정</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {new Date(retrospective.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

