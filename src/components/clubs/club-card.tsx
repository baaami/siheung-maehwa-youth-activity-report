import Link from "next/link";

type ClubCardProps = {
  href: string;
  name: string;
  description: string;
  meta: string;
};

export function ClubCard({ href, name, description, meta }: ClubCardProps) {
  return (
    <Link
      href={href}
      className="app-card flex flex-col gap-4 rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-[var(--accent)]"
    >
      <div className="space-y-2">
        <p className="section-title">{meta}</p>
        <h2 className="text-xl font-semibold text-[var(--accent-strong)]">{name}</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      <p className="text-sm font-medium text-[var(--accent)]">상세 보기</p>
    </Link>
  );
}
