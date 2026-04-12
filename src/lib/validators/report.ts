import { z } from "zod";
import { AGE_GROUPS, GENDERS } from "@/lib/constants";

export const participantSchema = z.object({
  name: z.string().trim().min(1, "참가자 이름이 필요합니다."),
  gender: z.enum(GENDERS),
  ageGroup: z.enum(AGE_GROUPS),
});

export const reportPhotoSchema = z.object({
  name: z.string().min(1),
  sizeMb: z.number().max(15, "사진은 각 이미지당 15MB 이하여야 합니다."),
  url: z.string().min(1),
  storagePath: z.string().min(1),
});

export const reportActivitySchema = z.object({
  title: z.string().trim().min(1, "활동 구분을 입력해주세요."),
  bullets: z.array(z.string().trim().min(1, "활동 요약을 입력해주세요.")).min(1),
});

export const reportSchema = z.object({
  reportDate: z.string().min(1, "활동 날짜가 필요합니다."),
  startTime: z.string().min(1, "시작 시간을 입력해주세요."),
  endTime: z.string().min(1, "종료 시간을 입력해주세요."),
  place: z.string().trim().min(1, "활동 장소를 입력해주세요."),
  title: z.string().trim().min(1, "활동명을 입력해주세요."),
  content: z
    .string()
    .min(200, "활동내용은 공백 포함 200자 이상이어야 합니다.")
    .max(300, "활동내용은 공백 포함 300자 이하여야 합니다."),
  reflection: z
    .string()
    .min(200, "활동소감은 공백 포함 200자 이상이어야 합니다.")
    .max(300, "활동소감은 공백 포함 300자 이하여야 합니다."),
  participants: z.array(participantSchema).min(1, "참가자는 최소 1명 이상이어야 합니다."),
  photos: z.array(reportPhotoSchema).length(2, "사진은 정확히 2장이어야 합니다."),
  rating: z.number().min(1).max(5),
  nextActivityContent: z.string().trim().max(100, "다음 활동은 100자 이내로 입력해주세요.").optional().or(z.literal("")),
  suggestions: z.string().trim().max(300, "건의사항은 300자 이내로 입력해주세요.").optional().or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportSchema>;
