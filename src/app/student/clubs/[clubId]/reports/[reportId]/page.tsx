import { notFound } from "next/navigation";
import { StudentReportDetailClient } from "@/components/reports/student-report-detail-client";
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
    <StudentReportDetailClient
      club={club}
      report={report}
      backHref={`/student/clubs/${clubId}`}
    />
  );
}
