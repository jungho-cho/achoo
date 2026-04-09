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
    <div className="ach-page">
      <div className="ach-page-shell ach-page-shell--wide space-y-6 md:space-y-8">
        <div className="flex items-center gap-4">
          <a href={`/${locale}`} className="ach-top-link">
            &larr; {tUI("nav.home")}
          </a>
        </div>

        <section className="rounded-[2rem] border border-[var(--ach-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,245,238,0.94))] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] md:p-8">
          <p className="ach-eyebrow">
            {chrome.hubEyebrow}
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-start">
            <div>
              <h1 className="ach-editorial-title text-[2rem] font-bold tracking-tight text-gray-900 md:text-[3rem]">
                {chrome.hubTitle}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-700 md:text-lg">
                {chrome.hubDescription}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {articles.slice(0, 4).map((article) => (
                <div
                  key={article.id}
                  className="rounded-2xl border border-white/80 bg-white/92 px-4 py-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {chrome.updatedLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                    {article.content.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-gray-600">
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
              className="trend-card trend-rise block rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {article.content.eyebrow}
                </span>
                <span className="text-xs text-gray-500">
                  {chrome.updatedLabel} {article.updatedAt}
                </span>
              </div>
              <h2 className="ach-editorial-title mt-4 text-[1.9rem] font-bold tracking-tight text-gray-900">
                {article.content.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                {article.content.listSummary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {article.content.trendSignals.slice(0, 2).map((signal) => (
                  <span
                    key={`${signal.label}-${signal.value}`}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
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
