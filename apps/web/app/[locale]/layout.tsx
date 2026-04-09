import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { hasLocale, routing, type AppLocale } from "../../i18n/routing";
import { notFound } from "next/navigation";

export const viewport: Viewport = {
  themeColor: "#B85C38",
  width: "device-width",
  initialScale: 1,
};

const LOCALE_META: Record<AppLocale, { ogLocale: string; font?: string }> = {
  ko: { ogLocale: "ko_KR", font: "Pretendard" },
  de: { ogLocale: "de_DE" },
  en: { ogLocale: "en_US" },
  fr: { ogLocale: "fr_FR" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "ui.metadata" });
  const localeMeta = LOCALE_META[locale];

  return {
    metadataBase: new URL("https://achoo.day"),
    title: {
      default: t("title"),
      template: "%s — Achoo",
    },
    description: t("description"),
    keywords: ["pollen", "air quality", "allergy", "forecast"],
    authors: [{ name: "Achoo" }],
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Achoo",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ko: "/ko",
        de: "/de",
        en: "/en",
        fr: "/fr",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Achoo",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: localeMeta.ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale;
  setRequestLocale(locale);
  const messages = await getMessages();

  const usePretendard = locale === "ko";

  return (
    <html lang={locale}>
      <head>
        {locale === "ko" && (
          <meta
            name="naver-site-verification"
            content="1490fae47df158cf159608e169f7cace61cb2dcc"
          />
        )}
        {usePretendard ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
            />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700;900&display=swap"
            />
          </>
        ) : (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://api.fontshare.com"
              crossOrigin="anonymous"
            />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
            />
            <link
              rel="stylesheet"
              href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
            />
          </>
        )}
      </head>
      <body
        style={{
          fontFamily: usePretendard
            ? "'Pretendard', sans-serif"
            : "'Satoshi', system-ui, sans-serif",
          margin: 0,
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9077995492417834"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G8LST05LHK"
          strategy="afterInteractive"
        />
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
