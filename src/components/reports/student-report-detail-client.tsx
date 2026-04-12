"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
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
    <AppShell
      title={report.title}
      backHref={backHref}
      actions={
        isEditing ? (
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
        )
      }
    >
      <ReportForm
        club={club}
        report={report}
        mode="student"
        readOnly={!isEditing}
        submitEndpoint={`/api/student/clubs/${club.id}/reports/${report.id}`}
        formId={formId}
        showFooterActions={false}
      />
    </AppShell>
  );
}
