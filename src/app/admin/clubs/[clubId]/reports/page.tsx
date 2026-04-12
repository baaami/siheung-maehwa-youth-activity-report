import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportListTable } from "@/components/reports/report-list-table";
import { getClubById, getReportsByClubId } from "@/lib/repository";

export default async function AdminReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ clubId: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { clubId } = await params;
  const { year } = await searchParams;
  const club = await getClubById(clubId);

  if (!club) {
    notFound();
  }

  const reports = await getReportsByClubId(clubId);
  const years = [...new Set(reports.map((report) => report.reportDate.slice(0, 4)))].sort().reverse();
  const filteredReports = year
    ? reports.filter((report) => report.reportDate.startsWith(year))
    : reports;
  const submittedCount = filteredReports.filter((report) => report.status === "SUBMITTED").length;

  return (
    <AppShell
      title={`${club.name} 활동일지 관리`}
      backHref={`/admin/clubs/${club.id}`}
      actions={filteredReports[0] || reports[0] ? (
        <Link
          href={`/reports/${filteredReports[0]?.id ?? reports[0]?.id}/print`}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          출력 템플릿 보기
        </Link>
      ) : undefined}
    >
      <div className="space-y-6">
        <form method="GET" className="app-card flex flex-wrap items-end gap-3 rounded-[24px] p-5">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--muted)]">연도 필터</span>
            <select
              name="year"
              defaultValue={year ?? ""}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            >
              <option value="">전체 연도</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}년
                </option>
              ))}
            </select>
          </label>
          <button className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--accent)]">
            적용
          </button>
          <div className="ml-auto text-sm text-[var(--muted)]">
            제출된 활동일지 {submittedCount}건 / 현재 목록 {filteredReports.length}건
          </div>
        </form>

        <form action="/api/admin/reports/pdf" method="POST" className="space-y-4">
          <input type="hidden" name="clubId" value={club.id} />
          <div className="app-card flex flex-col gap-2 rounded-[24px] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-title">PDF 다운로드</p>
              <p className="mt-2 text-lg font-semibold text-[var(--accent-strong)]">
                제출된 보고서만 묶음 PDF로 내려받습니다.
              </p>
            </div>
            <button className="w-fit rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white">
              선택한 제출건 PDF 다운로드
            </button>
          </div>
          <ReportListTable
            reports={filteredReports}
            basePath={`/admin/clubs/${club.id}/reports`}
            selectable
            showAuthor
          />
        </form>
      </div>
    </AppShell>
  );
}
