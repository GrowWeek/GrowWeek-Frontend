"use client";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  return (
    <header className="h-14 bg-white dark:bg-stone-950 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
