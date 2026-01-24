"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getConfig } from "@/lib/config";

export interface TrackingParams {
  channel: string;
  postNumber: string;
}

/**
 * URL에서 트래킹 파라미터를 읽어옵니다.
 */
export function useTrackingParams(): TrackingParams {
  const searchParams = useSearchParams();

  return {
    channel: searchParams.get("channel") || "direct",
    postNumber: searchParams.get("postNumber") || "",
  };
}

/**
 * 랜딩 페이지 방문을 트래킹합니다.
 * 컴포넌트 마운트 시 한 번만 호출됩니다.
 */
export function usePageViewTracking(): void {
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const config = getConfig();
    const channel = searchParams.get("channel") || "direct";
    const postNumber = searchParams.get("postNumber") || "";

    const params = new URLSearchParams({
      projectId: String(config.UX_LOG_PROJECT_ID),
      channel,
    });

    if (postNumber) {
      params.set("postNumber", postNumber);
    }

    fetch(`${config.UX_LOG_API_URL}/api/track?${params.toString()}`, {
      method: "GET",
      mode: "cors",
    }).catch((error) => {
      console.error("Failed to track page view:", error);
    });
  }, [searchParams]);
}

/**
 * 이메일 수집 API를 호출합니다.
 */
export async function submitEmail(
  email: string,
  trackingParams: TrackingParams
): Promise<{ success: boolean; message: string }> {
  const config = getConfig();

  const response = await fetch(`${config.UX_LOG_API_URL}/api/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    body: JSON.stringify({
      projectId: config.UX_LOG_PROJECT_ID,
      email,
      channel: trackingParams.channel,
      postNumber: trackingParams.postNumber || undefined,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "이메일 등록에 실패했습니다.");
  }

  return response.json();
}
