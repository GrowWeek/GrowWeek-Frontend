"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memberService, MemberResponse } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "대시보드",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "할일 관리",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    href: "/retrospective",
    label: "회고",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "캘린더",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const cachedUser = useMemo(() => memberService.getCachedCurrentMember(), []);
  const [currentUser, setCurrentUser] = useState<MemberResponse | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (memberService.isLoggedIn()) {
        try {
          const user = await memberService.getCurrentMember();
          setCurrentUser(user);
        } catch {
          memberService.logout();
          router.push("/login");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    memberService.logout();
    setCurrentUser(null);
    router.push("/login");
  };

  const getUserInitial = () => {
    if (currentUser?.nickname) {
      return currentUser.nickname.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-stone-100 dark:border-stone-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-lime-400 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
            GrowWeek
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400"
                    : "text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-900"
                }
              `}
            >
              <span className={isActive ? "text-lime-600 dark:text-lime-400" : ""}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-stone-100 dark:border-stone-800">
        {isLoading ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-stone-100 dark:bg-stone-800 rounded animate-pulse mb-1" />
              <div className="h-3 w-16 bg-stone-100 dark:bg-stone-800 rounded animate-pulse" />
            </div>
          </div>
        ) : currentUser ? (
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center">
                <span className="text-lime-700 dark:text-lime-400 font-medium text-xs">
                  {getUserInitial()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                  {currentUser.nickname}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-lime-400 hover:bg-lime-300 text-stone-900 rounded-lg text-sm font-semibold transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </aside>
  );
}
