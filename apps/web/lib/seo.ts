import type { Metadata } from "next";
import { routing, type AppLocale } from "../i18n/routing";

const BASE_URL = "https://achoo.day";

const OG_LOCALE: Record<AppLocale, string> = {
  ko: "ko_KR",
  de: "de_DE",
  en: "en_US",
  fr: "fr_FR",
};

function normalizePathname(pathname = "") {
  if (!pathname || pathname === "/") {
    return "";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildLocalizedPath(locale: string, pathname = "") {
  return `/${locale}${normalizePathname(pathname)}`;
}

export function buildLanguageAlternates(pathname = "") {
  const alternates: Record<string, string> = {};

  for (const locale of routing.locales) {
    alternates[locale] = buildLocalizedPath(locale, pathname);
  }

  alternates["x-default"] = buildLocalizedPath("en", pathname);

  return alternates;
}

export function buildPageMetadata({
  locale,
  pathname = "",
  title,
  description,
  type = "website",
  keywords,
}: {
  locale: string;
  pathname?: string;
  title: string;
  description: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const canonicalPath = buildLocalizedPath(locale, pathname);

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(pathname),
    },
    openGraph: {
      type,
      siteName: "Achoo",
      url: `${BASE_URL}${canonicalPath}`,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: OG_LOCALE[locale as AppLocale] ?? OG_LOCALE.en,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function buildFaqJsonLd({
  locale,
  pathname,
  questions,
}: {
  locale: string;
  pathname: string;
  questions: Array<{ question: string; answer: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${BASE_URL}${buildLocalizedPath(locale, pathname)}`,
    inLanguage: locale,
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
