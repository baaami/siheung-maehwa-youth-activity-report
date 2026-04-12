import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportForm } from "@/components/reports/report-form";
import { getClubById, getReportById } from "@/lib/repository";

export default async function StudentReportDetailPage({
  params,
}: {
  params: Promise<{ clubId: string; reportId: string }>;
}) {
  const { clubId, reportId } = await params;
  const report = await getReportById(reportId);

  if (!report || report.clubId !== clubId) {
    notFound();
  }

  const club = await getClubById(clubId);

  if (!club) {
    notFound();
  }

  return (
    <AppShell
      eyebrow="Student / Report"
      title={report.title}
      actions={
        report.status === "DRAFT" ? (
          <Link
            href={`/student/clubs/${clubId}/reports/${report.id}/edit`}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            수정 화면
          </Link>
        ) : undefined
      }
    >
      <ReportForm club={club} report={report} mode="student" readOnly />
    </AppShell>
  );
}
