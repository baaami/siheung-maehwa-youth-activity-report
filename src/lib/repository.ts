import path from "node:path";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { ActivityReport, Club, ReportPhoto } from "@/lib/types";
import type { EditableReportInput } from "@/lib/server-types";
import { currentAdminId, currentStudentId } from "@/lib/seed-data";
import { getUploadsDir, readData, toPublicUrl, writeData } from "@/lib/file-storage";

const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export class RepositoryConflictError extends Error {}
export class RepositoryValidationError extends Error {}

type SavedPhotoInput = {
  reportId: string;
  index: number;
  file: File;
};

function nowIso() {
  return new Date().toISOString();
}

function toMb(bytes: number) {
  return Number((bytes / (1024 * 1024)).toFixed(2));
}

function sanitizeFileSegment(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "file";
}

function getFileExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return extension || ".bin";
}

async function saveUploadedPhoto({ reportId, index, file }: SavedPhotoInput): Promise<ReportPhoto> {
  if (file.size > MAX_PHOTO_BYTES) {
    throw new RepositoryValidationError("사진은 각 이미지당 15MB 이하여야 합니다.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(file.name);
  const reportDir = path.join(getUploadsDir(), reportId);
  await mkdir(reportDir, { recursive: true });

  const storedName = `${index + 1}-${randomUUID()}${extension}`;
  const absolutePath = path.join(reportDir, storedName);
  await writeFile(absolutePath, buffer);

  const relativePath = path.relative(process.cwd(), absolutePath);

  return {
    id: randomUUID(),
    name: `사진${index + 1}`,
    url: toPublicUrl(relativePath),
    storagePath: relativePath,
    sizeMb: toMb(file.size),
  };
}

async function removeStoredPhoto(photo: ReportPhoto) {
  if (!photo.storagePath.startsWith(path.join("public", "uploads"))) {
    return;
  }

  try {
    await unlink(path.join(process.cwd(), photo.storagePath));
  } catch {
    // Ignore missing files so data cleanup does not block editing.
  }
}

function applyReportInput(report: ActivityReport, input: EditableReportInput, status: ActivityReport["status"]) {
  report.reportDate = input.reportDate;
  report.startTime = input.startTime;
  report.endTime = input.endTime;
  report.place = input.place;
  report.title = input.title.trim();
  report.content = input.content.trim();
  report.reflection = input.reflection.trim();
  report.participants = input.participants;
  report.activities = [];
  report.rating = input.rating;
  report.nextActivityDate = input.nextActivityDate;
  report.nextActivityContent = input.nextActivityContent.trim();
  report.suggestions = input.suggestions.trim();
  report.status = status;
}

function cloneReport(report: ActivityReport) {
  return JSON.parse(JSON.stringify(report)) as ActivityReport;
}

export async function getCurrentStudent() {
  const data = await readData();
  return data.users.find((user) => user.id === currentStudentId)!;
}

export async function getCurrentAdmin() {
  const data = await readData();
  return data.users.find((user) => user.id === currentAdminId)!;
}

export async function getStudentClubs() {
  const data = await readData();
  return data.clubs.filter((club) => club.studentIds.includes(currentStudentId));
}

export async function getAllClubs() {
  const data = await readData();
  return data.clubs;
}

export async function getClubById(clubId: string) {
  const data = await readData();
  return data.clubs.find((club) => club.id === clubId);
}

export async function getReportsByClubId(clubId: string) {
  const data = await readData();
  return data.reports
    .filter((report) => report.clubId === clubId)
    .sort((left, right) => right.reportDate.localeCompare(left.reportDate));
}

export async function getReportById(reportId: string) {
  const data = await readData();
  const report = data.reports.find((item) => item.id === reportId);
  return report ? cloneReport(report) : undefined;
}

export async function getReportsByIds(reportIds: string[]) {
  const data = await readData();
  return reportIds
    .map((reportId) => data.reports.find((report) => report.id === reportId))
    .filter((report): report is ActivityReport => Boolean(report))
    .map(cloneReport);
}

export async function createClub(input: Pick<Club, "name" | "category" | "description">) {
  const data = await readData();
  const timestamp = nowIso();
  const club: Club = {
    id: `club-${sanitizeFileSegment(input.name)}-${randomUUID().slice(0, 8)}`,
    name: input.name.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    studentIds: [currentStudentId],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  data.clubs.push(club);
  await writeData(data);
  return club;
}

export async function updateClub(
  clubId: string,
  input: Pick<Club, "name" | "category" | "description">,
  expectedUpdatedAt?: string,
) {
  const data = await readData();
  const club = data.clubs.find((item) => item.id === clubId);

  if (!club) {
    return undefined;
  }

  if (expectedUpdatedAt && club.updatedAt !== expectedUpdatedAt) {
    throw new RepositoryConflictError("다른 사용자가 먼저 동아리 정보를 수정했습니다. 화면을 새로고침한 뒤 다시 시도해주세요.");
  }

  club.name = input.name.trim();
  club.category = input.category.trim();
  club.description = input.description.trim();
  club.updatedAt = nowIso();
  await writeData(data);
  return club;
}

export async function deleteClub(clubId: string) {
  const data = await readData();
  const reports = data.reports.filter((report) => report.clubId === clubId);

  for (const report of reports) {
    for (const photo of report.photos) {
      await removeStoredPhoto(photo);
    }
  }

  data.clubs = data.clubs.filter((club) => club.id !== clubId);
  data.reports = data.reports.filter((report) => report.clubId !== clubId);
  await writeData(data);
}

export async function createReportForStudent({
  clubId,
  input,
  status,
  photoFiles,
}: {
  clubId: string;
  input: EditableReportInput;
  status: ActivityReport["status"];
  photoFiles: File[];
}) {
  const data = await readData();
  const club = data.clubs.find((item) => item.id === clubId);

  if (!club) {
    return undefined;
  }

  const reportId = `report-${randomUUID()}`;
  const timestamp = nowIso();
  const photos = await Promise.all(
    photoFiles.map((file, index) => saveUploadedPhoto({ reportId, index, file })),
  );

  const report: ActivityReport = {
    id: reportId,
    clubId,
    studentId: currentStudentId,
    authorName: "",
    reportDate: input.reportDate,
    startTime: input.startTime,
    endTime: input.endTime,
    place: input.place.trim(),
    title: input.title.trim(),
    content: input.content.trim(),
    reflection: input.reflection.trim(),
    status,
    participants: input.participants,
    photos,
    activities: [],
    rating: input.rating,
    nextActivityDate: input.nextActivityDate,
    nextActivityContent: input.nextActivityContent.trim(),
    suggestions: input.suggestions.trim(),
    pdfTruncated: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  data.reports.push(report);
  await writeData(data);
  return cloneReport(report);
}

async function replacePhotos({
  report,
  newFiles,
}: {
  report: ActivityReport;
  newFiles: Array<File | null>;
}) {
  const photos = [...report.photos];

  for (let index = 0; index < 2; index += 1) {
    const nextFile = newFiles[index];

    if (!nextFile) {
      continue;
    }

    if (photos[index]) {
      await removeStoredPhoto(photos[index]);
    }

    photos[index] = await saveUploadedPhoto({
      reportId: report.id,
      index,
      file: nextFile,
    });
  }

  return photos;
}

export async function updateReportAsStudent({
  clubId,
  reportId,
  input,
  status,
  expectedUpdatedAt,
  photoFiles,
}: {
  clubId: string;
  reportId: string;
  input: EditableReportInput;
  status: ActivityReport["status"];
  expectedUpdatedAt: string;
  photoFiles: Array<File | null>;
}) {
  const data = await readData();
  const report = data.reports.find((item) => item.id === reportId && item.clubId === clubId);

  if (!report || report.studentId !== currentStudentId) {
    return undefined;
  }

  if (report.updatedAt !== expectedUpdatedAt) {
    throw new RepositoryConflictError("다른 사용자가 먼저 활동일지를 수정했습니다. 화면을 새로고침한 뒤 다시 시도해주세요.");
  }

  report.photos = await replacePhotos({ report, newFiles: photoFiles });
  applyReportInput(report, input, status);
  report.updatedAt = nowIso();
  await writeData(data);
  return cloneReport(report);
}

export async function updateReportAsAdmin({
  clubId,
  reportId,
  input,
  status,
  expectedUpdatedAt,
  photoFiles,
}: {
  clubId: string;
  reportId: string;
  input: EditableReportInput;
  status: ActivityReport["status"];
  expectedUpdatedAt: string;
  photoFiles: Array<File | null>;
}) {
  const data = await readData();
  const report = data.reports.find((item) => item.id === reportId && item.clubId === clubId);

  if (!report) {
    return undefined;
  }

  if (report.updatedAt !== expectedUpdatedAt) {
    throw new RepositoryConflictError("다른 사용자가 먼저 활동일지를 수정했습니다. 화면을 새로고침한 뒤 다시 시도해주세요.");
  }

  report.photos = await replacePhotos({ report, newFiles: photoFiles });
  applyReportInput(report, input, status);
  report.updatedAt = nowIso();
  await writeData(data);
  return cloneReport(report);
}

export async function updateReportPdfMetadata({
  reportId,
  pdfTruncated,
  pdfTruncationNote,
}: {
  reportId: string;
  pdfTruncated: boolean;
  pdfTruncationNote?: string;
}) {
  const data = await readData();
  const report = data.reports.find((item) => item.id === reportId);

  if (!report) {
    return;
  }

  report.pdfTruncated = pdfTruncated;
  report.pdfTruncationNote = pdfTruncationNote;
  report.pdfCheckedAt = nowIso();
  await writeData(data);
}

export async function getPhotoFile(reportId: string, photoId: string) {
  const report = await getReportById(reportId);

  if (!report) {
    return undefined;
  }

  const photo = report.photos.find((item) => item.id === photoId);

  if (!photo) {
    return undefined;
  }

  const fileBuffer = await readFile(path.join(process.cwd(), photo.storagePath));
  return { report, photo, fileBuffer };
}
