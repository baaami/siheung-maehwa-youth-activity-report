import { NextResponse } from "next/server";
import { getReportById } from "@/lib/repository";
import { renderReportPdf } from "@/server/pdf-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await params;
  const report = await getReportById(reportId);

  if (!report) {
    return NextResponse.json({ message: "활동일지를 찾을 수 없습니다." }, { status: 404 });
  }

  const pdf = await renderReportPdf({
    reportId,
    origin: new URL(request.url).origin,
  });
  return new NextResponse(pdf.buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(`${report.title}.pdf`)}`,
    },
  });
}
