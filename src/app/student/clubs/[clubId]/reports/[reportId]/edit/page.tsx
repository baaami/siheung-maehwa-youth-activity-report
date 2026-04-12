import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportForm } from "@/components/reports/report-form";
import { getClubById, getReportById } from "@/lib/repository";

export default async function EditStudentReportPage({
  params,
}: {
  params: Promise<{ clubId: string; reportId: string }>;
}) {
  const { clubId, reportId } = await params;
  const report = await getReportById(reportId);

  if (!report || report.clubId !== clubId || report.status === "SUBMITTED") {
    notFound();
  }

  const club = await getClubById(clubId);

  if (!club) {
    notFound();
  }

  return (
    <AppShell
      eyebrow="Student / Edit"
      title={`${report.title} 수정`}
    >
      <ReportForm
        club={club}
        report={report}
        mode="student"
        submitEndpoint={`/api/student/clubs/${clubId}/reports/${report.id}`}
        backHref={`/student/clubs/${clubId}/reports/${report.id}`}
      />
    </AppShell>
  );
}
