import { randomUUID } from "node:crypto";
import type { EditableReportInput } from "@/lib/server-types";
import type { ActivityReport, Participant } from "@/lib/types";
import { reportSchema } from "@/lib/validators/report";

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return JSON.parse(value) as T;
}

function normalizeParticipants(raw: Participant[]) {
  return raw.map((participant) => ({
    id: participant.id || randomUUID(),
    name: participant.name?.trim() ?? "",
    gender: participant.gender,
    ageGroup: participant.ageGroup,
  }));
}

export function parseReportFormData(formData: FormData): {
  input: EditableReportInput;
  status: ActivityReport["status"];
  expectedUpdatedAt: string;
  photoFiles: Array<File | null>;
} {
  const participants = normalizeParticipants(
    parseJsonField<Participant[]>(formData.get("participants"), []),
  );
  const photoFiles = [formData.get("photo0"), formData.get("photo1")].map((entry) =>
    entry instanceof File && entry.size > 0 ? entry : null,
  );

  const existingPhotos = parseJsonField<ActivityReport["photos"]>(formData.get("existingPhotos"), []);

  const input: EditableReportInput = {
    reportDate: String(formData.get("reportDate") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    place: String(formData.get("place") ?? ""),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    reflection: String(formData.get("reflection") ?? ""),
    participants,
    rating: Number(formData.get("rating") ?? 0),
    nextActivityDate: String(formData.get("nextActivityDate") ?? ""),
    nextActivityContent: String(formData.get("nextActivityContent") ?? ""),
    suggestions: String(formData.get("suggestions") ?? ""),
  };

  const photosForValidation = [0, 1].map((index) => {
    const existingPhoto = existingPhotos[index];
    const nextFile = photoFiles[index];

    if (nextFile) {
      return {
        name: `사진${index + 1}`,
        sizeMb: Number((nextFile.size / (1024 * 1024)).toFixed(2)),
        url: existingPhoto?.url ?? "pending-upload",
        storagePath: existingPhoto?.storagePath ?? "pending-upload",
      };
    }

    return existingPhoto;
  }).filter(Boolean);

  reportSchema.parse({
    ...input,
    photos: photosForValidation,
  });

  return {
    input,
    status: formData.get("status") === "SUBMITTED" ? "SUBMITTED" : "DRAFT",
    expectedUpdatedAt: String(formData.get("expectedUpdatedAt") ?? ""),
    photoFiles,
  };
}
