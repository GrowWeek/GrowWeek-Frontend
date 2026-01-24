"use client";

import { useState, FormEvent } from "react";
import { Button } from "../common";
import { Input } from "../common";
import { useTrackingParams, submitEmail } from "@/lib/hooks";

interface EmailCollectionFormProps {
  variant?: "hero" | "cta";
}

export function EmailCollectionForm({ variant = "hero" }: EmailCollectionFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const trackingParams = useTrackingParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      await submitEmail(email, trackingParams);
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
      <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
        출시 소식을 가장 먼저 알려드립니다. 스팸 없음.
      </p>
    </form>
  );
}
