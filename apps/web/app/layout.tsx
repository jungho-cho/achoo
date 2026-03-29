import "./globals.css";
import Script from "next/script";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://achoo.day'),
  title: {
    default: "Achoo — 꽃가루 · 미세먼지 예보",
    template: "%s — Achoo",
  },
  description: "오늘 외출 전, 꽃가루와 미세먼지를 확인하세요. 위치 기반 실시간 예보.",
  keywords: ["꽃가루", "미세먼지", "알레르기", "예보", "꽃가루지수", "pollen", "air quality"],
  authors: [{ name: "Achoo" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Achoo",
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    siteName: "Achoo",
    title: "Achoo — 꽃가루 · 미세먼지 예보",
    description: "오늘 외출 전, 꽃가루와 미세먼지를 확인하세요.",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Achoo — 꽃가루 · 미세먼지 예보",
    description: "오늘 외출 전, 꽃가루와 미세먼지를 확인하세요.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="1490fae47df158cf159608e169f7cace61cb2dcc" />
        {/* Pretendard — Korean UX standard */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body style={{ fontFamily: "'Pretendard', sans-serif", margin: 0 }}>
        {children}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9077995492417834"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G8LST05LHK" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-G8LST05LHK');
        `}</Script>
      </body>
    </html>
  );
}
