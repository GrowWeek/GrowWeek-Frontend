import { useSyncExternalStore } from "react";
import { memberService } from "@/lib/api";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return memberService.isLoggedIn();
}

function getServerSnapshot() {
  return false;
}

export function useIsLoggedIn() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
