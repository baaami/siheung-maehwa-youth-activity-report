import path from "node:path";
import { NextResponse } from "next/server";
import { getPhotoFile } from "@/lib/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string; photoId: string }> },
) {
  const { reportId, photoId } = await params;
  const file = await getPhotoFile(reportId, photoId);

  if (!file) {
    return NextResponse.json({ message: "사진을 찾을 수 없습니다." }, { status: 404 });
  }

  const extension = path.extname(file.photo.storagePath) || ".jpg";
  const filename = `${file.report.title}_${file.report.photos.findIndex((photo) => photo.id === photoId) + 1}${extension}`;
  return new NextResponse(file.fileBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
