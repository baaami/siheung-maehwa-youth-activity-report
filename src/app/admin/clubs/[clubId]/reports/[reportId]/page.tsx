import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { AdminReportDetailClient } from "@/components/reports/admin-report-detail-client";
import { getClubById, getReportById } from "@/lib/repository";

export default async function AdminReportDetailPage({
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
      eyebrow="Admin / Report Detail"
      title={report.title}
    >
      <AdminReportDetailClient
        club={club}
        report={report}
        backHref={`/admin/clubs/${clubId}/reports`}
      />
    </AppShell>
  );
}
