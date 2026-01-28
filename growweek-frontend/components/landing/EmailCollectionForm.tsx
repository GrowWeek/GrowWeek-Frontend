"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "../common";
import { Input } from "../common";
import { useTrackingParams, submitEmail } from "@/lib/hooks";
import { getConfig } from "@/lib/config";

interface EmailCollectionFormProps {
  variant?: "hero" | "cta";
}

export function EmailCollectionForm({ variant = "hero" }: EmailCollectionFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [waitingCount, setWaitingCount] = useState<number | null>(null);
  const trackingParams = useTrackingParams();

  // 대기 인원수 조회
  const fetchWaitingCount = async () => {
    try {
      const config = getConfig();
      const res = await fetch(
        `${config.UX_LOG_API_URL}/api/projects/${config.UX_LOG_PROJECT_ID}/waiting-count`,
        { mode: "cors" }
      );
      const data = await res.json();
      setWaitingCount(data.waitingCount);
    } catch {
      // 실패 시 null 유지 (표시 안 함)
    }
  };

  // 컴포넌트 마운트 시 대기 인원수 조회
  useEffect(() => {
    fetchWaitingCount();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      await submitEmail(email, trackingParams);

      // 대기 인원수 다시 조회 (서버에서 증가된 값)
      await fetchWaitingCount();

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-3 bg-lime-100 dark:bg-lime-900/30 border border-lime-200 dark:border-lime-800 rounded-lg">
          <svg
            className="w-5 h-5 text-lime-600 dark:text-lime-400"
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
          <span className="text-lime-700 dark:text-lime-300 font-medium">
            출시 알림 신청이 완료되었습니다!
          </span>
        </div>
        {waitingCount !== null && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            현재 <span className="font-semibold text-lime-600 dark:text-lime-400">{waitingCount}명</span>이 대기 중입니다
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={status === "loading"}
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={status === "loading"}
          className="whitespace-nowrap"
        >
          출시 알림 받기
        </Button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-rose-500">{errorMessage}</p>
      )}
      <div className="mt-3 space-y-1">
        {waitingCount !== null && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            현재 <span className="font-semibold text-lime-600 dark:text-lime-400">{waitingCount}명</span>이 대기 중입니다
          </p>
        )}
        <p className="text-xs text-stone-400 dark:text-stone-500">
          사전예약 안내를 위해 이메일을 수집합니다.
        </p>
      </div>
    </form>
  );
}
