import { NextResponse } from "next/server";
import { createReportForStudent } from "@/lib/repository";
import { parseReportFormData } from "@/lib/report-request";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clubId: string }> },
) {
  try {
    const { clubId } = await params;
    const formData = await request.formData();
    const { input, status, photoFiles } = parseReportFormData(formData);

    if (photoFiles.some((file) => file === null)) {
      return NextResponse.json(
        { message: "사진 2장을 모두 업로드해주세요." },
        { status: 400 },
      );
    }

    const report = await createReportForStudent({
      clubId,
      input,
      status,
      photoFiles: photoFiles.filter((file): file is File => Boolean(file)),
    });

    if (!report) {
      return NextResponse.json({ message: "동아리를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      redirectUrl: `/student/clubs/${clubId}/reports/${report.id}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "활동일지를 저장하지 못했습니다.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
