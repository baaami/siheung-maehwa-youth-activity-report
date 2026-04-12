type PdfTruncatedAlertProps = {
  truncated: boolean;
  note?: string;
};

export function PdfTruncatedAlert({ truncated, note }: PdfTruncatedAlertProps) {
  if (!truncated) {
    return (
      <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        PDF 1페이지 안에 정상적으로 출력됩니다.
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">PDF 일부 내용 잘림 감지</p>
      <p className="mt-1 leading-6">{note ?? "일부 내용이 1페이지를 초과해 잘렸습니다."}</p>
    </div>
  );
}
