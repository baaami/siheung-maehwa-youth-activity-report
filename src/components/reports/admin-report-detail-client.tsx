"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ReportForm } from "@/components/reports/report-form";
import type { ActivityReport, Club } from "@/lib/types";

type AdminReportDetailClientProps = {
  club: Club;
  report: ActivityReport;
  backHref: string;
};

export function AdminReportDetailClient({
  club,
  report,
  backHref,
}: AdminReportDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const formId = `admin-report-form-${report.id}`;

  return (
    <AppShell
      title={report.title}
      backHref={backHref}
      actions={
        <>
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
            href={`/api/admin/reports/${report.id}/pdf`}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
          >
            PDF 다운로드
          </Link>
        </>
      }
    >
      <ReportForm
        club={club}
        report={report}
        mode="admin"
        readOnly={!isEditing}
        submitEndpoint={`/api/admin/clubs/${club.id}/reports/${report.id}`}
        formId={formId}
        showFooterActions={false}
      />
    </AppShell>
  );
}
