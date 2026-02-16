"use client";

import Link from "next/link";
import { useLandingOnlyMode } from "@/lib/hooks";

export function Footer() {
  const isLandingOnly = useLandingOnlyMode();
  return (
    <footer className="py-12 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-stone-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
                GrowWeek
              </span>
            </Link>
            <p className="text-sm text-stone-500 dark:text-stone-500">
              매주 성장하는 나를 만나세요
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              기능
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              사용 방법
            </a>
            {!isLandingOnly && (
              <Link
                href="/login"
                className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Copyright */}
          <div className="text-sm text-stone-500 dark:text-stone-500">
            &copy; {new Date().getFullYear()} GrowWeek. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
