"use client";

import { useState } from "react";
import Link from "next/link";
import { ReportForm } from "@/components/reports/report-form";
import type { ActivityReport, Club } from "@/lib/types";

type StudentReportDetailClientProps = {
  club: Club;
  report: ActivityReport;
  backHref: string;
};

export function StudentReportDetailClient({
  club,
  report,
  backHref,
}: StudentReportDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const formId = `student-report-form-${report.id}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {isEditing ? (
          <button
            type="submit"
            form={formId}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            완료
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setIsEditing(true)}
          >
            수정
          </button>
        )}
        <Link
          href={backHref}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
        >
          뒤로 가기
        </Link>
      </div>

      <ReportForm
        club={club}
        report={report}
        mode="student"
        readOnly={!isEditing}
        submitEndpoint={`/api/student/clubs/${club.id}/reports/${report.id}`}
        formId={formId}
        showFooterActions={false}
      />
    </div>
  );
}
