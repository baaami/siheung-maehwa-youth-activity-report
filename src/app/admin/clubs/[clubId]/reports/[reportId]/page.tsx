import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportForm } from "@/components/reports/report-form";
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
      description="관리자는 제출 여부와 관계없이 내용을 수정할 수 있고, 개별 PDF와 사진 다운로드가 가능합니다."
      actions={
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/api/admin/reports/${report.id}/pdf`}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            PDF 다운로드
          </Link>
          {report.photos.map((photo, index) => (
            <Link
              key={photo.id}
              href={`/api/admin/reports/${report.id}/photos/${photo.id}`}
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
            >
              사진 {index + 1} 다운로드
            </Link>
          ))}
        </div>
      }
    >
      <ReportForm
        club={club}
        report={report}
        mode="admin"
        submitEndpoint={`/api/admin/clubs/${clubId}/reports/${report.id}`}
        backHref={`/admin/clubs/${clubId}/reports`}
      />
    </AppShell>
  );
}
