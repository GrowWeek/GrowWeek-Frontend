import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 ${className} ${onClick ? "cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 transition-colors" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div
      className={`px-5 py-4 border-b border-stone-100 dark:border-stone-800 ${className}`}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3
      className={`text-base font-semibold text-stone-900 dark:text-stone-100 ${className}`}
    >
      {children}
    </h3>
  );
}
