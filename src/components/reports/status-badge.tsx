import { reportStatusLabels } from "@/lib/constants";
import type { ReportStatus } from "@/lib/constants";

type ReportStatusBadgeProps = {
  status: ReportStatus;
};

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const palette =
    status === "SUBMITTED"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${palette}`}>
      {reportStatusLabels[status]}
    </span>
  );
}
