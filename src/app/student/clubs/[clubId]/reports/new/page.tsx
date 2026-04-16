import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportForm } from "@/components/reports/report-form";
import { createEmptyReport } from "@/lib/report-utils";
import { getClubById, getCurrentStudent } from "@/lib/repository";

export default async function NewStudentReportPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const club = await getClubById(clubId);
  const student = await getCurrentStudent();

  if (!club) {
    notFound();
  }

  return (
    <AppShell
      title={`${club.name} 활동일지 작성`}
      backHref={`/student/clubs/${club.id}`}
      homeHref="/student"
    >
      <ReportForm
        club={club}
        report={createEmptyReport(club.id, student.name)}
        mode="student"
        submitEndpoint={`/api/student/clubs/${club.id}/reports`}
        backHref={`/student/clubs/${club.id}`}
      />
    </AppShell>
  );
}
