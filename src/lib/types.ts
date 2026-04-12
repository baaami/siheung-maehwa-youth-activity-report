import type { AgeGroup, Gender, ReportStatus } from "@/lib/constants";

export type Role = "student" | "admin";

export type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  id: string;
  name: string;
  gender: Gender;
  ageGroup: AgeGroup;
};

export type ReportPhoto = {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  sizeMb: number;
};

export type ReportActivity = {
  id: string;
  title: string;
  bullets: string[];
};

export type ActivityReport = {
  id: string;
  clubId: string;
  studentId: string;
  authorName: string;
  reportDate: string;
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  content: string;
  reflection: string;
  status: ReportStatus;
  participants: Participant[];
  photos: ReportPhoto[];
  activities: ReportActivity[];
  rating: number;
  nextActivityDate: string;
  nextActivityContent: string;
  suggestions: string;
  pdfTruncated: boolean;
  pdfTruncationNote?: string;
  createdAt: string;
  updatedAt: string;
  pdfCheckedAt?: string;
};

export type User = {
  id: string;
  name: string;
  role: Role;
};
