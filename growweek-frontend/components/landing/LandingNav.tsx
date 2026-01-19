"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../common";
import { memberService } from "@/lib/api";
import { useIsLoggedIn } from "@/lib/hooks";

export function LandingNav() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const handleLogout = () => {
    memberService.logout();
    window.dispatchEvent(new Event("storage"));
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
              GrowWeek
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              기능
            </a>
            <a
              href="#how-it-works"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              사용 방법
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" onClick={handleLogout}>
                  로그아웃
                </Button>
                <Link href="/dashboard">
                  <Button variant="primary">대시보드</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">로그인</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary">시작하기</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-600 dark:text-stone-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                기능
              </a>
              <a
                href="#how-it-works"
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                사용 방법
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-stone-200 dark:border-stone-800">
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      로그아웃
                    </Button>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        대시보드
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        로그인
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        시작하기
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
