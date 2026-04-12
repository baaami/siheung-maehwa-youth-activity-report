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
      eyebrow="Student / New Report"
      title={`${club.name} 활동일지 작성`}
      description="PDF 포맷 이미지의 항목을 기준으로 학생이 쉽게 입력할 수 있도록 날짜, 장소, 참가자, 활동 요약, 사진 2장을 한 번에 작성합니다."
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
