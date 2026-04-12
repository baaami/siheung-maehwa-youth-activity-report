import Link from "next/link";
import { formatKoreanDate, totalParticipants } from "@/lib/report-utils";
import type { ActivityReport } from "@/lib/types";

type ReportListTableProps = {
  reports: ActivityReport[];
  basePath: string;
  selectable?: boolean;
  showAuthor?: boolean;
  checkboxName?: string;
  showPdfColumn?: boolean;
};

export function ReportListTable({
  reports,
  basePath,
  selectable = false,
  showAuthor = false,
  checkboxName = "reportIds",
  showPdfColumn = true,
}: ReportListTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-[var(--surface-strong)] text-left text-[var(--accent-strong)]">
          <tr>
            {selectable ? <th className="px-4 py-3">선택</th> : null}
            <th className="px-4 py-3">일자</th>
            <th className="px-4 py-3">활동명</th>
            <th className="px-4 py-3">참여 인원</th>
            {showAuthor ? <th className="px-4 py-3">작성자</th> : null}
            {showPdfColumn ? <th className="px-4 py-3">PDF</th> : null}
            <th className="px-4 py-3">상세</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-t border-[var(--line)]">
              {selectable ? (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    name={checkboxName}
                    value={report.id}
                    defaultChecked={report.status === "SUBMITTED"}
                    disabled={report.status !== "SUBMITTED"}
                  />
                </td>
              ) : null}
              <td className="px-4 py-3">{formatKoreanDate(report.reportDate)}</td>
              <td className="px-4 py-3 font-medium">{report.title}</td>
              <td className="px-4 py-3">{totalParticipants(report.participants)}명</td>
              {showAuthor ? <td className="px-4 py-3">{report.authorName}</td> : null}
              {showPdfColumn ? (
                <td className="px-4 py-3">
                  {report.status !== "SUBMITTED" ? (
                    <span className="text-xs font-semibold text-[var(--muted)]">제출 후 가능</span>
                  ) : report.pdfTruncated ? (
                    <span className="text-xs font-semibold text-[var(--warning)]">일부 잘림</span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700">정상</span>
                  )}
                </td>
              ) : null}
              <td className="px-4 py-3">
                <Link className="font-medium text-[var(--accent)]" href={`${basePath}/${report.id}`}>
                  보기
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
