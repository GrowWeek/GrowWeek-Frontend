import { ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-lime-400 text-stone-900 hover:bg-lime-300 focus:ring-lime-400/50 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-stone-900 font-semibold",
  secondary:
    "bg-stone-100 text-stone-700 hover:bg-stone-200 focus:ring-stone-400/50 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700",
  ghost:
    "bg-transparent text-stone-600 hover:bg-stone-100 focus:ring-stone-400/50 dark:text-stone-400 dark:hover:bg-stone-800",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500/50 dark:bg-rose-600 dark:hover:bg-rose-500",
  outline:
    "bg-transparent border border-stone-300 text-stone-700 hover:bg-stone-50 focus:ring-stone-400/50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        dark:focus:ring-offset-stone-900
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon}
    </button>
  );
}
