import { NextResponse } from "next/server";
import { getClubById, getReportsByIds } from "@/lib/repository";
import { formatCompactDate } from "@/lib/report-utils";
import { mergePdfs, renderReportPdf } from "@/server/pdf-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const reportIds = formData.getAll("reportIds").map(String);
  const clubId = String(formData.get("clubId") ?? "");
  const reports = (await getReportsByIds(reportIds)).filter((report) => report.status === "SUBMITTED");

  if (reports.length === 0) {
    return NextResponse.json({ message: "제출된 활동일지를 하나 이상 선택해주세요." }, { status: 400 });
  }

  const club = await getClubById(clubId);

  if (!club) {
    return NextResponse.json({ message: "동아리를 찾을 수 없습니다." }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const rendered = await Promise.all(
    reports.map((report) =>
      renderReportPdf({
        origin,
        reportId: report.id,
      }),
    ),
  );
  const mergedPdf = await mergePdfs({
    files: rendered.map((item) => item.buffer),
  });
  const newestDate = [...reports]
    .sort((left, right) => right.reportDate.localeCompare(left.reportDate))[0]
    .reportDate;
  const fileName = `${club.name}_${formatCompactDate(newestDate)}_활동일지묶음.pdf`;

  return new NextResponse(mergedPdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  });
}
