export const AGE_GROUPS = ["ELEMENTARY", "MIDDLE", "HIGH", "LATE_YOUTH", "YOUNG_ADULT"] as const;
export const GENDERS = ["MALE", "FEMALE"] as const;
export const REPORT_STATUSES = ["DRAFT", "SUBMITTED"] as const;

export const ageGroupLabels: Record<(typeof AGE_GROUPS)[number], string> = {
  ELEMENTARY: "초등",
  MIDDLE: "중등",
  HIGH: "고등",
  LATE_YOUTH: "후기",
  YOUNG_ADULT: "청년",
};

export const genderLabels: Record<(typeof GENDERS)[number], string> = {
  MALE: "남",
  FEMALE: "여",
};

export const reportStatusLabels: Record<(typeof REPORT_STATUSES)[number], string> = {
  DRAFT: "미제출",
  SUBMITTED: "제출",
};

export type AgeGroup = (typeof AGE_GROUPS)[number];
export type Gender = (typeof GENDERS)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];
