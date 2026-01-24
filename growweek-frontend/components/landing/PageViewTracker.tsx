"use client";

import { usePageViewTracking } from "@/lib/hooks";

export function PageViewTracker() {
  usePageViewTracking();
  return null;
}
