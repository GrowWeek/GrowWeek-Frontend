"use client";

import { getConfig } from "@/lib/config";

export function useLandingOnlyMode(): boolean {
  return getConfig().LANDING_ONLY_MODE;
}
