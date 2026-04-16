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
      title={club.name}
      backHref="/admin"
      homeHref="/admin"
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
      <ReportListTable
        reports={reports}
        basePath={`/admin/clubs/${club.id}/reports`}
        showAuthor
      />
    </AppShell>
  );
}
