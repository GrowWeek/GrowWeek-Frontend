import { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  primary: "bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-400",
  success: "bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
  info: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
