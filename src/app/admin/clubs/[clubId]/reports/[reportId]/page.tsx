import { notFound } from "next/navigation";
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
    <AdminReportDetailClient
      club={club}
      report={report}
      backHref={`/admin/clubs/${clubId}/reports`}
    />
  );
}
