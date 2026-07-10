import path from "node:path";
import { NextResponse } from "next/server";
import { getPhotoFile } from "@/lib/repository";

const imageTypesByExtension: Record<string, string> = {
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".tiff": "image/tiff",
  ".webp": "image/webp",
};

function startsWith(buffer: Buffer, signature: number[]) {
  return signature.every((byte, index) => buffer[index] === byte);
}

function getImageExtension(storagePath: string, buffer: Buffer) {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) {
    return ".jpg";
  }

  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return ".png";
  }

  if (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a") {
    return ".gif";
  }

  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    return ".webp";
  }

  const storedExtension = path.extname(storagePath).toLowerCase();
  const normalizedExtension = storedExtension === ".jpeg" || storedExtension === ".jfif"
    ? ".jpg"
    : storedExtension === ".tif"
      ? ".tiff"
      : storedExtension;

  return imageTypesByExtension[normalizedExtension] ? normalizedExtension : ".jpg";
}

function encodeContentDispositionFileName(fileName: string) {
  return encodeURIComponent(fileName).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string; photoId: string }> },
) {
  const { reportId, photoId } = await params;
  const file = await getPhotoFile(reportId, photoId);

  if (!file) {
    return NextResponse.json({ message: "사진을 찾을 수 없습니다." }, { status: 404 });
  }

  const photoIndex = file.report.photos.findIndex((photo) => photo.id === photoId) + 1;
  const extension = getImageExtension(file.photo.storagePath, file.fileBuffer);
  const filename = `${file.report.title}_${photoIndex}${extension}`;
  const fallbackFilename = `activity-report-photo-${photoIndex}${extension}`;

  return new NextResponse(file.fileBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": imageTypesByExtension[extension],
      "Content-Disposition": `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodeContentDispositionFileName(filename)}`,
    },
  });
}
