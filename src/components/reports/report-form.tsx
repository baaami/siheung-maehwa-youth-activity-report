"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AGE_GROUPS, GENDERS, ageGroupLabels, genderLabels } from "@/lib/constants";
import { createEmptyParticipant, formatTimeRange, reportCharacterState } from "@/lib/report-utils";
import type { ActivityReport, Club } from "@/lib/types";
import { ParticipantStatsTable } from "@/components/reports/participant-stats-table";
import { ParticipantTable } from "@/components/reports/participant-table";

type ReportFormProps = {
  club: Club;
  report: ActivityReport;
  mode: "student" | "admin";
  readOnly?: boolean;
  submitEndpoint?: string;
  backHref?: string;
  formId?: string;
  showFooterActions?: boolean;
};

type FormState = {
  reportDate: string;
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  content: string;
  reflection: string;
  participants: ActivityReport["participants"];
  rating: number;
  nextActivityDate: string;
  nextActivityContent: string;
  suggestions: string;
};

function toFormState(report: ActivityReport): FormState {
  return {
    reportDate: report.reportDate,
    startTime: report.startTime,
    endTime: report.endTime,
    place: report.place,
    title: report.title,
    content: report.content,
    reflection: report.reflection,
    participants: report.participants,
    rating: report.rating,
    nextActivityDate: report.nextActivityDate,
    nextActivityContent: report.nextActivityContent,
    suggestions: report.suggestions,
  };
}

export function ReportForm({
  club,
  report,
  mode,
  readOnly = false,
  submitEndpoint,
  backHref,
  formId,
  showFooterActions = true,
}: ReportFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(report));
  const [existingPhotos] = useState(report.photos);
  const [photoFiles, setPhotoFiles] = useState<Array<File | null>>([null, null]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (!submitEndpoint) {
      return;
    }

    const formData = new FormData();
    formData.set("reportDate", form.reportDate);
    formData.set("startTime", form.startTime);
    formData.set("endTime", form.endTime);
    formData.set("place", form.place);
    formData.set("title", form.title);
    formData.set("content", form.content);
    formData.set("reflection", form.reflection);
    formData.set("participants", JSON.stringify(form.participants));
    formData.set("rating", String(form.rating));
    formData.set("nextActivityDate", form.nextActivityDate);
    formData.set("nextActivityContent", form.nextActivityContent);
    formData.set("suggestions", form.suggestions);
    formData.set("existingPhotos", JSON.stringify(existingPhotos));
    formData.set("expectedUpdatedAt", report.updatedAt);
    formData.set("status", "SUBMITTED");

    photoFiles.forEach((file, index) => {
      if (file) {
        formData.set(`photo${index}`, file);
      }
    });

    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch(submitEndpoint, {
      method: report.id === "draft-preview" ? "POST" : "PUT",
      body: formData,
    });

    const payload = (await response.json()) as { message?: string; redirectUrl?: string };

    if (!response.ok) {
      setIsSubmitting(false);
      setMessage(payload.message ?? "저장하지 못했습니다.");
      return;
    }

    startTransition(() => {
      router.push(payload.redirectUrl ?? backHref ?? "/");
      router.refresh();
    });
  }

  if (readOnly) {
    return <ReportReadOnlyContent club={club} report={report} mode={mode} />;
  }

  return (
    <form
      id={formId}
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <section className="app-card rounded-[24px] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">
              기본 정보
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="활동일자"
            value={form.reportDate}
            onChange={(value) => setForm((current) => ({ ...current, reportDate: value }))}
            type="date"
          />
          <Field
            label="활동장소"
            value={form.place}
            onChange={(value) => setForm((current) => ({ ...current, place: value }))}
          />
          <Field
            label="시작 시간"
            value={form.startTime}
            onChange={(value) => setForm((current) => ({ ...current, startTime: value }))}
            type="time"
          />
          <Field
            label="종료 시간"
            value={form.endTime}
            onChange={(value) => setForm((current) => ({ ...current, endTime: value }))}
            type="time"
          />
        </div>
      </section>

      <section className="app-card rounded-[24px] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">참여자 명단</h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--accent)]"
            onClick={() =>
              setForm((current) => ({
                ...current,
                participants: [...current.participants, createEmptyParticipant()],
              }))
            }
          >
            참가자 추가
          </button>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <ParticipantStatsTable participants={form.participants.filter((participant) => participant.name.trim())} />
          <div className="space-y-3">
            {form.participants.map((participant, index) => (
              <div key={participant.id} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
                  <Field
                    label={`참가자 ${index + 1}`}
                    value={participant.name}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        participants: current.participants.map((item) =>
                          item.id === participant.id ? { ...item, name: value } : item,
                        ),
                      }))
                    }
                  />
                  <SelectField
                    label="성별"
                    value={participant.gender}
                    options={GENDERS.map((gender) => ({ value: gender, label: genderLabels[gender] }))}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        participants: current.participants.map((item) =>
                          item.id === participant.id
                            ? { ...item, gender: value as ActivityReport["participants"][number]["gender"] }
                            : item,
                        ),
                      }))
                    }
                  />
                  <SelectField
                    label="연령대"
                    value={participant.ageGroup}
                    options={AGE_GROUPS.map((group) => ({ value: group, label: ageGroupLabels[group] }))}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        participants: current.participants.map((item) =>
                          item.id === participant.id
                            ? { ...item, ageGroup: value as ActivityReport["participants"][number]["ageGroup"] }
                            : item,
                        ),
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="mt-7 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        participants:
                          current.participants.length > 1
                            ? current.participants.filter((item) => item.id !== participant.id)
                            : current.participants,
                      }))
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="app-card rounded-[24px] p-6">
          <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">활동 내용</h2>
          <div className="mt-4 space-y-4">
            <Field
              label="활동명"
              value={form.title}
              onChange={(value) => setForm((current) => ({ ...current, title: value }))}
            />
            <TextAreaField
              label="활동내용"
              value={form.content}
              onChange={(value) => setForm((current) => ({ ...current, content: value }))}
            />
            <CharacterHint text={form.content} />
            <TextAreaField
              label="활동소감"
              value={form.reflection}
              onChange={(value) => setForm((current) => ({ ...current, reflection: value }))}
            />
            <CharacterHint text={form.reflection} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="app-card rounded-[24px] p-6">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">활동 평가</h2>
            <div className="mt-5 flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${
                    form.rating >= score
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
                  }`}
                  onClick={() => setForm((current) => ({ ...current, rating: score }))}
                >
                  {score}점
                </button>
              ))}
            </div>
          </div>

          <div className="app-card rounded-[24px] p-6">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">다음 활동</h2>
            <div className="mt-4 space-y-4">
              <Field
                label="다음 활동 일자"
                value={form.nextActivityDate}
                onChange={(value) => setForm((current) => ({ ...current, nextActivityDate: value }))}
                type="date"
              />
              <Field
                label="다음 활동 메모"
                value={form.nextActivityContent}
                onChange={(value) => setForm((current) => ({ ...current, nextActivityContent: value }))}
              />
            </div>
          </div>

          <div className="app-card rounded-[24px] p-6">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">건의 사항</h2>
            <div className="mt-4">
              <TextAreaField
                label="건의사항"
                value={form.suggestions}
                onChange={(value) => setForm((current) => ({ ...current, suggestions: value }))}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="app-card rounded-[24px] p-6">
        <h2 className="mb-5 text-2xl font-semibold text-[var(--accent-strong)]">활동 사진</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((index) => {
            const nextFile = photoFiles[index];
            const currentPhoto = existingPhotos[index];
            const inputId = `photo-upload-${index}`;

            return (
              <div key={index} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <label
                  htmlFor={inputId}
                  className="group block cursor-pointer"
                >
                  <div
                    className="relative h-52 rounded-[16px] border border-dashed border-[var(--line)] bg-cover bg-center transition group-hover:border-[var(--accent)]"
                    style={{
                      backgroundImage: nextFile
                        ? `url(${URL.createObjectURL(nextFile)})`
                        : currentPhoto
                          ? `url(${currentPhoto.url})`
                          : undefined,
                    }}
                  >
                    <div className="absolute inset-0 rounded-[16px] bg-black/0 transition group-hover:bg-black/10" />
                    <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--accent-strong)] shadow-sm">
                      클릭하여 업로드
                    </div>
                  </div>
                </label>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold text-[var(--foreground)]">사진 {index + 1}</p>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setPhotoFiles((current) => {
                        const next = [...current];
                        next[index] = event.target.files?.[0] ?? null;
                        return next;
                      })
                    }
                    className="block w-full text-sm"
                  />
                  <p className="text-xs text-[var(--muted)]">
                    {nextFile
                      ? `${nextFile.name} (${(nextFile.size / (1024 * 1024)).toFixed(2)}MB)`
                      : currentPhoto
                        ? `${currentPhoto.name} (${currentPhoto.sizeMb}MB)`
                        : "업로드 필요"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {message ? (
        <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {message}
        </div>
      ) : null}

      {showFooterActions ? (
        <div className="flex flex-wrap items-center gap-3">
          {backHref ? (
            <button
              type="button"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
              onClick={() => router.push(backHref)}
            >
              뒤로 가기
            </button>
          ) : null}
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "완료 중..." : "완료"}
          </button>
        </div>
      ) : null}
    </form>
  );
}

function ReportReadOnlyContent({
  club,
  report,
  mode,
}: {
  club: Club;
  report: ActivityReport;
  mode: "student" | "admin";
}) {
  return (
    <div className="space-y-6">
      <section className="app-card rounded-[24px] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">기본 정보</h2>
          </div>
          <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            {mode === "student" ? "학생 읽기 화면" : "관리자 읽기 화면"}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DisplayField label="동아리명" value={`${club.category} ${club.name}`} />
          <DisplayField label="작성자" value={report.authorName} />
          <DisplayField label="활동일자" value={report.reportDate} />
          <DisplayField label="활동장소" value={report.place} />
          <DisplayField label="활동시간" value={formatTimeRange(report.startTime, report.endTime)} />
          <DisplayField label="활동명" value={report.title} />
        </div>
      </section>

      <section className="app-card rounded-[24px] p-6">
        <div className="mb-5 space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">개별 입력 기준 자동 집계</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <ParticipantStatsTable participants={report.participants} />
          <ParticipantTable participants={report.participants} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="app-card rounded-[24px] p-6">
          <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">활동 내용</h2>
          <div className="mt-4 space-y-4">
            <DisplayField label="활동명" value={report.title} />
            <DisplayTextArea label="활동내용" value={report.content} />
            <CharacterHint text={report.content} />
            <DisplayTextArea label="활동소감" value={report.reflection} />
            <CharacterHint text={report.reflection} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="app-card rounded-[24px] p-6">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">활동 평가</h2>
            <p className="mt-4 text-sm font-semibold text-[var(--accent-strong)]">{report.rating} / 5</p>
          </div>
          <div className="app-card rounded-[24px] p-6">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">다음 활동</h2>
            <p className="mt-4 text-sm font-semibold text-[var(--accent-strong)]">
              {report.nextActivityDate || "(정보 필요)"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{report.nextActivityContent || "(정보 필요)"}</p>
          </div>
          <div className="app-card rounded-[24px] p-6">
            <h2 className="text-2xl font-semibold text-[var(--accent-strong)]">건의 사항</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{report.suggestions || "(정보 필요)"}</p>
          </div>
        </div>
      </section>

      <section className="app-card rounded-[24px] p-6">
        <h2 className="mb-5 text-2xl font-semibold text-[var(--accent-strong)]">활동 사진</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {report.photos.map((photo, index) => (
            <div key={photo.id} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
              <div className="relative">
                <div
                  className="h-52 rounded-[16px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${photo.url})` }}
                />
                {mode === "admin" ? (
                  <Link
                    href={`/api/admin/reports/${report.id}/photos/${photo.id}`}
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--accent-strong)] shadow-sm transition hover:bg-white"
                    aria-label={`사진 ${index + 1} 다운로드`}
                    title={`사진 ${index + 1} 다운로드`}
                  >
                    <span className="text-lg leading-none">↓</span>
                  </Link>
                ) : null}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--foreground)]">{photo.name}</span>
                <span className="text-[var(--muted)]">{photo.sizeMb}MB</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  className,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <label className={`space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-semibold text-[var(--muted)]">{label}</span>
      <input
        value={value}
        type={type}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] read-only:bg-[var(--surface-strong)]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-[var(--muted)]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="w-full rounded-[24px] border border-[var(--line)] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
      />
    </label>
  );
}

function DisplayField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
      <span className="text-sm font-semibold text-[var(--muted)]">{label}</span>
      <p className="text-sm">{value || "(정보 필요)"}</p>
    </div>
  );
}

function DisplayTextArea({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 rounded-[24px] border border-[var(--line)] bg-white px-4 py-3">
      <span className="text-sm font-semibold text-[var(--muted)]">{label}</span>
      <p className="whitespace-pre-wrap text-sm leading-6">{value || "(정보 필요)"}</p>
    </div>
  );
}

function CharacterHint({ text }: { text: string }) {
  const state = reportCharacterState(text);
  const tone =
    state === "충족"
      ? "text-emerald-700"
      : state === "미달"
        ? "text-amber-700"
        : "text-rose-700";

  return (
    <p className={`text-xs font-medium ${tone}`}>
      공백 포함 {text.length}자 / 기준 상태: {state}
    </p>
  );
}
