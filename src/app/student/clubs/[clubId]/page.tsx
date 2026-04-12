import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportListTable } from "@/components/reports/report-list-table";
import { getClubById, getReportsByClubId } from "@/lib/repository";

export default async function StudentClubPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const club = await getClubById(clubId);

  if (!club) {
    notFound();
  }

  const reports = await getReportsByClubId(clubId);

  return (
    <AppShell
      eyebrow="Student / Club"
      title={club.name}
      description={club.description}
      actions={
        <Link
          href={`/student/clubs/${club.id}/reports/new`}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          활동일지 작성
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="활동일지 수" value={`${reports.length}건`} />
          <SummaryCard label="제출 완료" value={`${reports.filter((report) => report.status === "SUBMITTED").length}건`} />
          <SummaryCard label="미제출" value={`${reports.filter((report) => report.status === "DRAFT").length}건`} />
        </div>
        <ReportListTable
          reports={reports}
          basePath={`/student/clubs/${club.id}/reports`}
        />
      </div>
    </AppShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="app-card rounded-[22px] p-5">
      <p className="section-title">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[var(--accent-strong)]">{value}</p>
    </div>
  );
}
