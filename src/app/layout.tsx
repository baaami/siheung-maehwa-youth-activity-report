import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "동아리 활동일지 PDF MVP",
  description: "학생 활동일지 작성과 관리자 PDF 다운로드를 위한 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
