import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportListTable } from "@/components/reports/report-list-table";
import { getClubById, getReportsByClubId } from "@/lib/repository";

export default async function AdminClubPage({
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
      eyebrow="Admin / Club"
      title={club.name}
      description="동아리별 활동일지와 PDF 상태를 확인할 수 있습니다."
      actions={
        <div className="flex gap-3">
          <Link
            href={`/admin/clubs/${club.id}/edit`}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
          >
            동아리 수정
          </Link>
          <Link
            href={`/admin/clubs/${club.id}/reports`}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            보고서 관리
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="전체" value={`${reports.length}건`} />
          <SummaryCard label="제출" value={`${reports.filter((report) => report.status === "SUBMITTED").length}건`} />
          <SummaryCard label="PDF 가능" value={`${reports.filter((report) => report.status === "SUBMITTED").length}건`} />
        </div>
        <ReportListTable
          reports={reports}
          basePath={`/admin/clubs/${club.id}/reports`}
          showAuthor
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
