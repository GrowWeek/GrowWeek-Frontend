"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { Button, Card, CardContent, Badge } from "@/components/common";
import {
  QuestionItem,
  RetrospectiveProgress,
  AdditionalNotes,
} from "@/components/retrospective";
import { retrospectiveService } from "@/lib/api";
import type {
  RetrospectiveResponse,
  RetrospectiveSummaryResponse,
  AnswerResponse,
} from "@/lib/api";
import {
  getCurrentWeekId,
  formatWeekIdKorean,
  getRetrospectiveWritePeriod,
  getTimeUntilRetrospectiveOpen,
  getTimeUntilRetrospectiveClose,
  isRetrospectiveExpiredForWeek,
} from "@/lib/utils";

export default function RetrospectiveWritePage() {
  const router = useRouter();
  const [retrospective, setRetrospective] = useState<RetrospectiveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // // 🧪 테스트용: 다음 주 월요일 00시 01분으로 모킹 (기간 만료 테스트)
  // const getMockedTime = () => {
  //   const now = new Date();
  //   const day = now.getDay();
  //   const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 이번 주 월요일
  //   const monday = new Date(now.setDate(diff));
  //   monday.setDate(monday.getDate() + 7); // 다음 주 월요일
  //   monday.setHours(0, 1, 0, 0); // 00:01:00
  //   return monday;
  // };
  // const [currentTime, setCurrentTime] = useState(getMockedTime());
  const [currentTime, setCurrentTime] = useState(new Date()); // 원래 코드

  const currentWeekId = getCurrentWeekId();

  // 회고 작성 가능 시간 체크
  const { isWithinPeriod } = getRetrospectiveWritePeriod(currentTime);
  const timeUntilOpen = getTimeUntilRetrospectiveOpen(currentTime);
  const timeUntilClose = getTimeUntilRetrospectiveClose(currentTime);

  // 1분마다 현재 시간 업데이트 (시간 제한 체크용)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 이번 주 회고 조회 또는 생성
  const fetchOrCreateRetrospective = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 기존 회고 목록에서 이번 주 회고 찾기
      const list = await retrospectiveService.getAll({ size: 10 });
      const existingRetro = list.items.find(
        (r: RetrospectiveSummaryResponse) => r.weekId === currentWeekId
      );

      if (existingRetro) {
        // 기존 회고 상세 조회
        const detail = await retrospectiveService.getById(existingRetro.id);
        setRetrospective(detail);
      } else {
        // 회고가 없으면 null로 설정 (생성 버튼 표시)
        setRetrospective(null);
      }
    } catch (err) {
      console.error("Failed to fetch retrospective:", err);
      setError("회고를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekId]);

  useEffect(() => {
    fetchOrCreateRetrospective();
  }, [fetchOrCreateRetrospective]);

  // 회고 생성
  const handleCreateRetrospective = async () => {
    setIsCreating(true);
    try {
      const created = await retrospectiveService.create({
        weekId: currentWeekId,
        questionCount: 3,
      });
      setRetrospective(created);
    } catch (err) {
      console.error("Failed to create retrospective:", err);
      setError("회고 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  // AI 질문 생성
  const handleGenerateQuestions = async () => {
    if (!retrospective) return;

    setIsGeneratingQuestions(true);
    try {
      const updated = await retrospectiveService.generateQuestions(retrospective.id);
      setRetrospective(updated);
    } catch (err) {
      console.error("Failed to generate questions:", err);
      setError("질문 생성에 실패했습니다.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 답변 저장
  const handleSaveAnswer = async (questionId: number, content: string) => {
    if (!retrospective) return;

    try {
      const updated = await retrospectiveService.writeAnswer(retrospective.id, {
        questionId,
        content,
      });
      setRetrospective(updated);
    } catch (err) {
      console.error("Failed to save answer:", err);
      throw err;
    }
  };

  // 추가 메모 저장
  const handleSaveNotes = async (notes: string) => {
    if (!retrospective) return;

    try {
      const updated = await retrospectiveService.writeAdditionalNotes(
        retrospective.id,
        { notes }
      );
      setRetrospective(updated);
    } catch (err) {
      console.error("Failed to save notes:", err);
      throw err;
    }
  };

  // 회고 완료
  const handleComplete = async () => {
    if (!retrospective) return;

    if (!confirm("회고를 완료하시겠습니까? 완료 후에는 수정할 수 없습니다.")) return;

    setIsCompleting(true);
    try {
      const updated = await retrospectiveService.complete(retrospective.id);
      setRetrospective(updated);
      router.push(`/retrospective/${retrospective.id}`);
    } catch (err) {
      console.error("Failed to complete retrospective:", err);
      setError("회고 완료에 실패했습니다.");
    } finally {
      setIsCompleting(false);
    }
  };

  // 답변 찾기 헬퍼
  const getAnswerForQuestion = (questionId: number): AnswerResponse | undefined => {
    return retrospective?.answers.find((a) => a.questionId === questionId);
  };

  // 답변 완료 개수
  const answeredCount = retrospective?.answers.filter((a) => a.content).length || 0;
  const isCompleted = retrospective?.status === "DONE";

  // 회고 기간 만료 여부 체크 (회고가 있는 경우)
  const expiredInfo = retrospective
    ? isRetrospectiveExpiredForWeek(retrospective.weekId, currentTime)
    : null;
  const isExpired = expiredInfo?.isExpired ?? false;

  // 편집 불가 여부: 완료됨 또는 기간 만료
  const isEditDisabled = isCompleted || isExpired;

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout title="회고 작성" description="이번 주를 돌아보세요">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-zinc-500">회고를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="회고 작성"
      description={`${formatWeekIdKorean(currentWeekId)} 회고`}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/retrospective")}>
            ← 목록
          </Button>
          {retrospective && retrospective.status !== "DONE" && !isExpired && (
            <Button
              onClick={handleComplete}
              isLoading={isCompleting}
              disabled={answeredCount === 0}
            >
              회고 완료
            </Button>
          )}
        </div>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* 회고 작성 기간 안내 (마감까지 남은 시간) */}
        {isWithinPeriod && timeUntilClose && !retrospective?.status?.includes("DONE") && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  회고 작성 마감까지{" "}
                  <span className="font-bold">
                    {timeUntilClose.days > 0 && `${timeUntilClose.days}일 `}
                    {timeUntilClose.hours}시간 {timeUntilClose.minutes}분
                  </span>{" "}
                  남았습니다
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  월요일 0시 0분까지 회고를 완료해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 회고 작성 불가 기간 안내 */}
        {!isWithinPeriod && !retrospective && timeUntilOpen && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-zinc-400 dark:text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                회고 작성 기간이 아닙니다
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                회고는 <span className="font-semibold text-indigo-600 dark:text-indigo-400">금요일 0시</span>부터{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">월요일 0시</span>까지 작성할 수 있습니다.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-zinc-700 dark:text-zinc-300">
                  다음 회고 시작까지{" "}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {timeUntilOpen.days > 0 && `${timeUntilOpen.days}일 `}
                    {timeUntilOpen.hours}시간 {timeUntilOpen.minutes}분
                  </span>
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                금요일이 되면 이번 주 할일을 바탕으로 회고를 작성할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        )}

        {/* 회고가 없는 경우: 생성 안내 (작성 가능 기간일 때만) */}
        {!retrospective && isWithinPeriod && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                이번 주 회고 시작하기
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                {formatWeekIdKorean(currentWeekId)} 기간의 회고를 작성해보세요.
              </p>
              <Button onClick={handleCreateRetrospective} isLoading={isCreating} size="lg">
                회고 시작하기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 회고가 있는 경우 */}
        {retrospective && (
          <>
            {/* 진행 상태 */}
            <RetrospectiveProgress
              status={retrospective.status}
              questionCount={retrospective.questionCount}
              answeredCount={answeredCount}
            />

            {/* 완료된 회고 안내 */}
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
                      더 이상 수정할 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 기간 만료 안내 (완료되지 않은 상태에서 기간이 지난 경우) */}
            {!isCompleted && isExpired && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 dark:bg-rose-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-rose-600 dark:text-rose-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-rose-800 dark:text-rose-200">
                      회고 작성 기간이 종료되었습니다
                    </p>
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                      작성 기간(월요일 0시)이 지나 더 이상 수정할 수 없습니다.
                      {answeredCount > 0 && (
                        <span className="block mt-1">
                          작성된 답변 {answeredCount}개는 그대로 유지됩니다.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 질문 생성 전 */}
            {(retrospective.status === "TODO" ||
              retrospective.status === "BEFORE_GENERATE_QUESTION") && !isExpired && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    AI 질문 생성
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                    이번 주 할일을 바탕으로 맞춤형 회고 질문을 생성합니다.
                  </p>
                  <Button
                    onClick={handleGenerateQuestions}
                    isLoading={isGeneratingQuestions}
                    size="lg"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    질문 생성하기
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 질문 생성 전 + 기간 만료 */}
            {(retrospective.status === "TODO" ||
              retrospective.status === "BEFORE_GENERATE_QUESTION") && isExpired && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-zinc-400 dark:text-zinc-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-500 dark:text-zinc-400 mb-2">
                    질문이 생성되지 않았습니다
                  </h2>
                  <p className="text-zinc-400 dark:text-zinc-500">
                    작성 기간이 종료되어 더 이상 질문을 생성할 수 없습니다.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 질문 목록 */}
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
                  회고 질문
                  <Badge variant="primary">{retrospective.questionCount}개</Badge>
                </h2>

                {retrospective.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      answer={getAnswerForQuestion(question.id)}
                      onSaveAnswer={handleSaveAnswer}
                      disabled={isEditDisabled}
                    />
                  ))}
              </div>
            )}

            {/* 추가 메모 */}
            {(retrospective.status === "AFTER_GENERATE_QUESTION" ||
              retrospective.status === "IN_PROGRESS" ||
              retrospective.status === "DONE") && (
              <AdditionalNotes
                initialNotes={retrospective.additionalNotes}
                onSave={handleSaveNotes}
                disabled={isEditDisabled}
              />
            )}

            {/* 완료 버튼 (하단) */}
            {!isEditDisabled && retrospective.questions.length > 0 && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleComplete}
                  isLoading={isCompleting}
                  disabled={answeredCount === 0}
                  size="lg"
                >
                  회고 완료하기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}

