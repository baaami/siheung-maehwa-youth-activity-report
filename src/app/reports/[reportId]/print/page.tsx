import { notFound } from "next/navigation";
import { ReportPrintPage } from "@/components/pdf/report-print-page";
import { getClubById, getReportById } from "@/lib/repository";

export default async function ReportPrintRoute({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const report = await getReportById(reportId);

  if (!report) {
    notFound();
  }

  const club = await getClubById(report.clubId);

  if (!club) {
    notFound();
  }

  return <ReportPrintPage club={club} report={report} />;
}
