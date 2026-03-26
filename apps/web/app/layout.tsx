import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achoo — 꽃가루 · 미세먼지 예보",
  description: "오늘 외출 전, 꽃가루와 미세먼지를 확인하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard — Korean UX standard */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body style={{ fontFamily: "'Pretendard', sans-serif" }}>{children}</body>
    </html>
  );
}
