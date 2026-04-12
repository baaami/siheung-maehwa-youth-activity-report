import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { updateReportPdfMetadata } from "@/lib/repository";

type MergePdfInput = {
  files: Uint8Array[];
};

type RenderPdfInput = {
  origin: string;
  reportId: string;
};

export async function mergePdfs({ files }: MergePdfInput) {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const document = await PDFDocument.load(file);
    const pages = await merged.copyPages(document, document.getPageIndices());

    for (const page of pages) {
      merged.addPage(page);
    }
  }

  return merged.save();
}

export async function renderReportPdf({ origin, reportId }: RenderPdfInput) {
  const playwrightPath = chromium.executablePath();
  const executablePath = existsSync(playwrightPath)
    ? playwrightPath
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });
  const page = await browser.newPage();

  try {
    await page.goto(`${origin}/reports/${reportId}/print`, { waitUntil: "networkidle" });

    const truncation = await page.evaluate(() => {
      const root = document.querySelector(".print-page");

      if (!root) {
        return { truncated: false };
      }

      const element = root as HTMLElement;
      return {
        truncated: element.scrollHeight > element.clientHeight + 2,
        note:
          element.scrollHeight > element.clientHeight + 2
            ? "출력 내용이 1페이지 높이를 초과했습니다."
            : undefined,
      };
    });

    await updateReportPdfMetadata({
      reportId,
      pdfTruncated: truncation.truncated,
      pdfTruncationNote: truncation.note,
    });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return {
      buffer,
      truncated: truncation.truncated,
      note: truncation.note,
    };
  } finally {
    await page.close();
    await browser.close();
  }
}
