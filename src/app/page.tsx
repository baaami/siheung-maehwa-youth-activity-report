import { RoleEntryCard } from "@/components/role-entry-card";

export default function Home() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-10">
        <section className="space-y-4 text-center">
          <p className="section-title">MVP Entry</p>
          <h1 className="text-5xl font-semibold tracking-tight text-[var(--accent-strong)]">
            매아리 활동일지
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-7 text-[var(--muted)]">
            학생은 활동일지를 작성하고 제출할 수 있고, 관리자는 동아리별 활동일지를 확인한 뒤 PDF와 사진을 내려받을 수 있습니다.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <RoleEntryCard
            href="/student"
            title="학생 진입"
          />
          <RoleEntryCard
            href="/admin"
            title="관리자 진입"
          />
        </section>
      </div>
    </div>
  );
}
