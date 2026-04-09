import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getArticles } from "../../../lib/articles";
import { getInsightsChrome } from "../../../lib/insights-chrome";
import type { ArticleLocale } from "../../../content/articles/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const chrome = getInsightsChrome(locale);

  return {
    title: chrome.hubTitle,
    description: chrome.hubDescription,
    alternates: {
      canonical: `/${locale}/insights`,
      languages: {
        ko: "/ko/insights",
        en: "/en/insights",
        de: "/de/insights",
        fr: "/fr/insights",
        "x-default": "/en/insights",
      },
    },
  };
}

export default async function InsightsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tUI = await getTranslations("ui");
  const chrome = getInsightsChrome(locale);
  const articles = getArticles(locale as ArticleLocale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:space-y-8 md:py-8">
        <div className="flex items-center gap-4">
          <a
            href={`/${locale}`}
            className="text-sm text-gray-400 transition hover:text-gray-600"
          >
            &larr; {tUI("nav.home")}
          </a>
        </div>

        <section className="trend-card rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-600">
            {chrome.hubEyebrow}
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
            <div>
              <h1 className="text-[1.9rem] font-bold tracking-tight text-gray-900 md:text-4xl">
                {chrome.hubTitle}
              </h1>
              <p className="mt-3 text-sm leading-7 text-gray-700 md:text-lg">
                {chrome.hubDescription}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {articles.slice(0, 4).map((article) => (
                <div
                  key={article.id}
                  className="rounded-2xl border border-white/70 bg-white/90 px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {chrome.updatedLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                    {article.content.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-gray-500">
                    {article.updatedAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article, index) => (
            <a
              key={article.id}
              href={`/${locale}/insights/${article.slug}`}
              className="trend-card trend-rise block rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {article.content.eyebrow}
                </span>
                <span className="text-xs text-gray-400">
                  {chrome.updatedLabel} {article.updatedAt}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                {article.content.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                {article.content.listSummary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {article.content.trendSignals.slice(0, 2).map((signal) => (
                  <span
                    key={`${signal.label}-${signal.value}`}
                    className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs text-gray-600"
                  >
                    {signal.label}: {signal.value}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-green-700">
                <span>{chrome.readMoreLabel}</span>
                <span aria-hidden="true">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
