import type { ReactNode } from "react";
import Image from "next/image";
import { ParticipantStatsTable } from "@/components/reports/participant-stats-table";
import {
  ensureDisplayValue,
  formatKoreanDate,
  formatTimeRange,
  totalParticipants,
} from "@/lib/report-utils";
import type { ActivityReport, Club } from "@/lib/types";

type ReportPrintPageProps = {
  club: Club;
  report: ActivityReport;
};

export function ReportPrintPage({ club, report }: ReportPrintPageProps) {
  return (
    <div className="print-page mx-auto border border-[#d7c6a0] bg-white text-[#2a2a2a] shadow-sm">
      <div className="overflow-hidden border border-[#d7c6a0]">
        <PrintRow label="" className="bg-[#f3e5c2] text-center text-2xl font-bold">
          ({club.name}) 활동일지
        </PrintRow>
        <PrintGridRow
          label="일자"
          cells={[
            formatKoreanDate(report.reportDate),
            "작성자",
            report.authorName,
          ]}
        />
        <PrintGridRow
          label="시간"
          cells={[
            formatTimeRange(report.startTime, report.endTime),
            "활동장소",
            ensureDisplayValue(report.place),
          ]}
        />
        <PrintRow label="활동명">{ensureDisplayValue(report.title)}</PrintRow>
        <PrintRow label="참가자 명단">
          <div className="space-y-3">
            <p>{report.participants.map((participant) => participant.name).join(", ") || "(정보 필요)"}</p>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>총인원 {totalParticipants(report.participants)}명</span>
              <span>{club.category}</span>
            </div>
            <ParticipantStatsTable participants={report.participants} />
          </div>
        </PrintRow>
        <PrintRow label="활동내용">
          <p className="whitespace-pre-wrap leading-7">{ensureDisplayValue(report.content)}</p>
        </PrintRow>
        <PrintRow label="활동소감">
          <p className="whitespace-pre-wrap leading-7">{ensureDisplayValue(report.reflection)}</p>
        </PrintRow>
        <PrintRow label="활동평가">
          <div className="flex items-center justify-between gap-6">
            <p className="text-sm">※ 모든 참여인원의 활동소감을 자연어로 서술해 주세요.</p>
            <p className="text-2xl tracking-[0.25em]">
              {"★★★★★".slice(0, report.rating)}
              <span className="text-neutral-300">{"★★★★★".slice(report.rating)}</span>
            </p>
          </div>
        </PrintRow>
        <PrintRow label="다음활동">{ensureDisplayValue(report.nextActivityContent)}</PrintRow>
        <PrintRow label="건의사항">
          <p className="whitespace-pre-wrap leading-7">{ensureDisplayValue(report.suggestions)}</p>
        </PrintRow>
        <PrintRow label="활동사진">
          <div className="grid grid-cols-2 gap-4">
            {report.photos.map((photo, index) => (
              <div key={photo.id} className="space-y-2">
                <div className="relative h-60 overflow-hidden border border-[#d7c6a0]">
                  <Image src={photo.url} alt={`활동 사진 ${index + 1}`} fill className="object-cover" />
                </div>
                <p className="text-center text-sm text-neutral-500">사진{index + 1}</p>
              </div>
            ))}
          </div>
        </PrintRow>
      </div>
    </div>
  );
}

function PrintRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid border-t border-[#d7c6a0] ${label ? "grid-cols-[120px_1fr]" : "grid-cols-1"} ${className ?? ""}`}>
      {label ? (
        <div className="flex items-center justify-center border-r border-[#d7c6a0] bg-[#f7ecd1] px-4 py-4 text-center text-sm font-semibold">
          {label}
        </div>
      ) : null}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function PrintGridRow({
  label,
  cells,
  narrow = false,
}: {
  label: string;
  cells: string[];
  narrow?: boolean;
}) {
  return (
    <div className={`grid border-t border-[#d7c6a0] ${narrow ? "grid-cols-[120px_220px_100px_1fr]" : "grid-cols-[120px_1fr_120px_1fr]"}`}>
      <div className="flex items-center justify-center border-r border-[#d7c6a0] bg-[#f7ecd1] px-4 py-4 text-center text-sm font-semibold">
        {label}
      </div>
      {cells.map((cell, index) => (
        <div
          key={`${label}-${index}`}
          className={`px-5 py-4 text-sm ${index % 2 === 0 ? "border-r border-[#d7c6a0]" : ""}`}
        >
          {cell}
        </div>
      ))}
    </div>
  );
}
