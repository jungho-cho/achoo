import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "../../i18n/routing";
import { notFound } from "next/navigation";

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
};

const LOCALE_META: Record<string, { ogLocale: string; font?: string }> = {
  ko: { ogLocale: 'ko_KR', font: 'Pretendard' },
  de: { ogLocale: 'de_DE' },
  en: { ogLocale: 'en_US' },
  fr: { ogLocale: 'fr_FR' },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ui.metadata' });
  const localeMeta = LOCALE_META[locale] ?? LOCALE_META.en!;

  return {
    metadataBase: new URL('https://achoo.day'),
    title: {
      default: t('title'),
      template: '%s — Achoo',
    },
    description: t('description'),
    keywords: ['pollen', 'air quality', 'allergy', 'forecast'],
    authors: [{ name: 'Achoo' }],
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Achoo',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ko': '/ko',
        'de': '/de',
        'en': '/en',
        'fr': '/fr',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Achoo',
      title: t('title'),
      description: t('description'),
      locale: localeMeta.ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
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
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const usePretendard = locale === 'ko';

  return (
    <html lang={locale}>
      <head>
        {locale === 'ko' && (
          <meta name="naver-site-verification" content="1490fae47df158cf159608e169f7cace61cb2dcc" />
        )}
        {usePretendard && (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          />
        )}
      </head>
      <body style={{ fontFamily: usePretendard ? "'Pretendard', sans-serif" : "system-ui, -apple-system, sans-serif", margin: 0 }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
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
