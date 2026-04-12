"use client";

import { useState } from "react";
import Link from "next/link";
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {isEditing ? (
          <button
            type="button"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setIsEditing(false)}
          >
            읽기 화면으로
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

      <ReportForm
        club={club}
        report={report}
        mode="admin"
        readOnly={!isEditing}
        submitEndpoint={`/api/admin/clubs/${club.id}/reports/${report.id}`}
        backHref={backHref}
        onCancelEdit={isEditing ? () => setIsEditing(false) : undefined}
      />
    </div>
  );
}
