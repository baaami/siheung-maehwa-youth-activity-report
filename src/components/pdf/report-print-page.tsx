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
    <div className="print-page mx-auto bg-white text-[#2a2a2a]">
      <div className="pdf-sheet">
        <PdfFullHeader>({club.name}) 활동일지</PdfFullHeader>

        <PdfSplitRow
          label="일자"
          leftValue={formatKoreanDate(report.reportDate)}
          rightLabel="작성자"
          rightValue={ensureDisplayValue(report.authorName)}
        />
        <PdfSplitRow
          label="시간"
          leftValue={formatTimeRange(report.startTime, report.endTime)}
          rightLabel="활동장소"
          rightValue={ensureDisplayValue(report.place)}
        />
        <PdfSingleRow label="활동명">{ensureDisplayValue(report.title)}</PdfSingleRow>

        <PdfSingleRow label="참가자 현황" keepTogether>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm leading-6">
                {report.participants.map((participant) => participant.name).join(", ") || "(정보 필요)"}
              </p>
              <p className="shrink-0 text-sm font-semibold">총인원 {totalParticipants(report.participants)}명</p>
            </div>
            <ParticipantStatsTable participants={report.participants} />
          </div>
        </PdfSingleRow>

        <PdfSingleRow label="활동내용">
          <p className="whitespace-pre-wrap text-sm leading-7">{ensureDisplayValue(report.content)}</p>
        </PdfSingleRow>

        <PdfSingleRow label="활동소감">
          <p className="whitespace-pre-wrap text-sm leading-7">{ensureDisplayValue(report.reflection)}</p>
        </PdfSingleRow>

        <PdfSingleRow label="활동평가" keepTogether>
          <div className="flex items-center justify-center">
            <p className="shrink-0 text-2xl tracking-[0.22em]">
              {"★★★★★".slice(0, report.rating)}
              <span className="text-neutral-300">{"★★★★★".slice(report.rating)}</span>
            </p>
          </div>
        </PdfSingleRow>

        <PdfSplitRow
          label="다음활동"
          leftValue={formatKoreanDate(report.nextActivityDate)}
          rightLabel="내용"
          rightValue={ensureDisplayValue(report.nextActivityContent)}
          keepTogether
        />

        <PdfSingleRow label="건의사항">
          <p className="whitespace-pre-wrap text-sm leading-7">{ensureDisplayValue(report.suggestions)}</p>
        </PdfSingleRow>

        <PdfSingleRow label="활동사진" keepTogether>
          <div className="pdf-photo-grid grid grid-cols-2 gap-4">
            {report.photos.map((photo, index) => (
              <div key={photo.id} className="space-y-2">
                <div className="relative h-64 overflow-hidden border border-[#d7c6a0] bg-[#faf7ee]">
                  <Image
                    src={photo.url}
                    alt={`활동 사진 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                </div>
                <p className="text-center text-sm text-neutral-500">사진{index + 1}</p>
              </div>
            ))}
          </div>
        </PdfSingleRow>
      </div>
    </div>
  );
}

function PdfFullHeader({ children }: { children: ReactNode }) {
  return (
    <div className="border border-[#d7c6a0] bg-[#f3e5c2] px-6 py-4 text-center text-[28px] font-bold">
      {children}
    </div>
  );
}

function PdfSingleRow({
  label,
  children,
  keepTogether = false,
}: {
  label: string;
  children: ReactNode;
  keepTogether?: boolean;
}) {
  return (
    <div className={`pdf-row grid grid-cols-[110px_1fr] border-x border-b border-[#d7c6a0] ${keepTogether ? "pdf-avoid-break" : ""}`}>
      <div className="flex items-center justify-center border-r border-[#d7c6a0] bg-[#f7ecd1] px-3 py-4 text-center text-sm font-semibold">
        {label}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function PdfSplitRow({
  label,
  leftValue,
  rightLabel,
  rightValue,
  keepTogether = false,
}: {
  label: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  keepTogether?: boolean;
}) {
  return (
    <div
      className={`pdf-row grid grid-cols-[110px_1fr_110px_1fr] border-x border-b border-[#d7c6a0] ${keepTogether ? "pdf-avoid-break" : ""}`}
    >
      <CellLabel>{label}</CellLabel>
      <CellValue>{leftValue}</CellValue>
      <CellLabel>{rightLabel}</CellLabel>
      <CellValue>{rightValue}</CellValue>
    </div>
  );
}

function CellLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center border-r border-[#d7c6a0] bg-[#f7ecd1] px-3 py-4 text-center text-sm font-semibold">
      {children}
    </div>
  );
}

function CellValue({ children }: { children: ReactNode }) {
  return <div className="border-r border-[#d7c6a0] px-5 py-4 text-sm last:border-r-0">{children}</div>;
}
