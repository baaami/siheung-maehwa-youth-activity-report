import type { ReactNode } from "react";
import Link from "next/link";

type AppShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function AppShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: AppShellProps) {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="app-card rounded-[28px] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="section-title">{eyebrow}</p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--accent-strong)]">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                역할 선택으로
              </Link>
              {actions}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
