import type { ActivityReport, Club, User } from "@/lib/types";

export type AppDataFile = {
  users: User[];
  clubs: Club[];
  reports: ActivityReport[];
};

export type EditableReportInput = {
  reportDate: string;
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  content: string;
  reflection: string;
  participants: ActivityReport["participants"];
  rating: number;
  nextActivityContent: string;
  suggestions: string;
};
