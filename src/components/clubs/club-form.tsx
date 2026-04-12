"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { Club } from "@/lib/types";

type ClubFormProps = {
  mode: "create" | "edit";
  club?: Club;
};

export function ClubForm({ mode, club }: ClubFormProps) {
  const router = useRouter();
  const [name, setName] = useState(club?.name ?? "");
  const [category, setCategory] = useState(club?.category ?? "");
  const [description, setDescription] = useState(club?.description ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch(mode === "create" ? "/api/admin/clubs" : `/api/admin/clubs/${club!.id}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        description,
        expectedUpdatedAt: club?.updatedAt,
      }),
    });

    const payload = (await response.json()) as { message?: string; redirectUrl?: string };

    if (!response.ok) {
      setIsSubmitting(false);
      setMessage(payload.message ?? "동아리를 저장하지 못했습니다.");
      return;
    }

    startTransition(() => {
      router.push(payload.redirectUrl ?? "/admin");
      router.refresh();
    });
  }

  async function removeClub() {
    if (!club || !window.confirm("동아리를 삭제하면 연결된 활동일지도 함께 삭제됩니다. 계속할까요?")) {
      return;
    }

    setIsSubmitting(true);
    const response = await fetch(`/api/admin/clubs/${club.id}`, {
      method: "DELETE",
    });
    const payload = (await response.json()) as { redirectUrl?: string };

    startTransition(() => {
      router.push(payload.redirectUrl ?? "/admin");
      router.refresh();
    });
  }

  return (
    <div className="app-card max-w-3xl rounded-[24px] p-6">
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--muted)]">분류</span>
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
            placeholder="예: 사진동아리"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--muted)]">동아리명</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--muted)]">설명</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="w-full rounded-[24px] border border-[var(--line)] bg-white px-4 py-3"
          />
        </label>
        {message ? (
          <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {message}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            disabled={isSubmitting}
            onClick={() => void submit()}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
          {mode === "edit" ? (
            <button
              type="button"
              className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-700"
              disabled={isSubmitting}
              onClick={() => void removeClub()}
            >
              동아리 삭제
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
