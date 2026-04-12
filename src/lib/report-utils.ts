import { ageGroupLabels, genderLabels } from "@/lib/constants";
import type { ActivityReport, Club, Participant } from "@/lib/types";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function formatKoreanDate(dateString: string) {
  if (!dateString) {
    return "(정보 필요)";
  }

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
}

export function formatCompactDate(dateString: string) {
  return dateString.replaceAll("-", "");
}

export function formatTimeRange(startTime: string, endTime: string) {
  if (!startTime && !endTime) {
    return "(정보 필요)";
  }

  return `${startTime || "--:--"} - ${endTime || "--:--"}`;
}

export function participantStats(participants: Participant[]) {
  const stats = Object.fromEntries(
    Object.entries(genderLabels).map(([gender]) => [
      gender,
      Object.fromEntries(Object.entries(ageGroupLabels).map(([group]) => [group, 0])),
    ]),
  ) as Record<keyof typeof genderLabels, Record<keyof typeof ageGroupLabels, number>>;

  for (const participant of participants) {
    stats[participant.gender][participant.ageGroup] += 1;
  }

  return stats;
}

export function totalParticipants(participants: Participant[]) {
  return participants.length;
}

export function belongsToStudent(club: Club, studentId: string) {
  return club.studentIds.includes(studentId);
}

export function reportCharacterState(text: string) {
  const length = text.length;

  if (length < 200) {
    return "미달";
  }

  if (length > 300) {
    return "초과";
  }

  return "충족";
}

export function truncationSummary(report: ActivityReport) {
  if (!report.pdfTruncated) {
    return "1페이지 안에 정상 배치";
  }

  return report.pdfTruncationNote ?? "1페이지를 넘어 일부 내용이 잘렸습니다.";
}

export function createEmptyParticipant(): Participant {
  return {
    id: createId(),
    name: "",
    gender: "FEMALE",
    ageGroup: "HIGH",
  };
}

export function createEmptyReport(clubId: string, authorName: string): ActivityReport {
  const timestamp = new Date().toISOString();

  return {
    id: "draft-preview",
    clubId,
    studentId: "student-1",
    authorName: authorName || "",
    reportDate: "",
    startTime: "",
    endTime: "",
    place: "",
    title: "",
    content: "",
    reflection: "",
    status: "DRAFT",
    participants: [createEmptyParticipant()],
    photos: [],
    activities: [],
    rating: 3,
    nextActivityDate: "",
    nextActivityContent: "",
    suggestions: "",
    pdfTruncated: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function ensureDisplayValue(value: string | undefined) {
  return value && value.trim() ? value : "(정보 필요)";
}
