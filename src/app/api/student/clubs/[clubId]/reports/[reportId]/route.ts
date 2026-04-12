import { NextResponse } from "next/server";
import { RepositoryConflictError, updateReportAsStudent } from "@/lib/repository";
import { parseReportFormData } from "@/lib/report-request";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ clubId: string; reportId: string }> },
) {
  try {
    const { clubId, reportId } = await params;
    const formData = await request.formData();
    const { input, status, expectedUpdatedAt, photoFiles } = parseReportFormData(formData);
    const report = await updateReportAsStudent({
      clubId,
      reportId,
      input,
      status,
      expectedUpdatedAt,
      photoFiles,
    });

    if (!report) {
      return NextResponse.json({ message: "수정 가능한 활동일지를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      redirectUrl: `/student/clubs/${clubId}/reports/${report.id}`,
    });
  } catch (error) {
    const status = error instanceof RepositoryConflictError ? 409 : 400;
    const message =
      error instanceof Error ? error.message : "활동일지를 수정하지 못했습니다.";
    return NextResponse.json({ message }, { status });
  }
}
