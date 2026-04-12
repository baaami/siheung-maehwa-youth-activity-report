import Link from "next/link";

type RoleEntryCardProps = {
  href: string;
  title: string;
  description: string;
  bullets: string[];
};

export function RoleEntryCard({
  href,
  title,
  description,
  bullets,
}: RoleEntryCardProps) {
  return (
    <Link
      href={href}
      className="app-card group flex h-full flex-col justify-between rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)]"
    >
      <div className="space-y-4">
        <div className="inline-flex rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Entry
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">{title}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
      </div>
      <div className="mt-8 space-y-2">
        {bullets.map((bullet) => (
          <p key={bullet} className="text-sm leading-6 text-[var(--foreground)]">
            {bullet}
          </p>
        ))}
      </div>
    </Link>
  );
}
