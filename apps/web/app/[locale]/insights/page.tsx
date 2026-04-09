import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getArticles } from "../../../lib/articles";
import { getInsightsChrome } from "../../../lib/insights-chrome";
import type { ArticleLocale } from "../../../content/articles/schema";
import { buildPageMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const chrome = getInsightsChrome(locale);

  return buildPageMetadata({
    locale,
    pathname: "/insights",
    title: chrome.hubTitle,
    description: chrome.hubDescription,
  });
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

        <section className="rounded-lg border border-[var(--ach-line)] bg-[var(--ach-surface)] p-6 md:p-8">
          <p className="ach-eyebrow">{chrome.hubEyebrow}</p>
          <h1 className="ach-editorial-title mt-4 text-[2rem] font-bold tracking-tight text-[var(--ach-text-primary)] md:text-[3rem]">
            {chrome.hubTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ach-text-muted)] md:text-lg">
            {chrome.hubDescription}
          </p>
        </section>

        <div className="space-y-3">
          {articles.map((article, index) => (
            <a
              key={article.id}
              href={`/${locale}/insights/${article.slug}`}
              className="trend-card trend-rise block rounded-lg border border-[var(--ach-line-light)] bg-[var(--ach-surface)] p-5 transition hover:bg-[var(--ach-surface-strong)]"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex rounded border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
                      {article.content.eyebrow}
                    </span>
                    <span className="text-xs text-[var(--ach-text-subtle)]">
                      {article.updatedAt}
                    </span>
                  </div>
                  <h2 className="ach-editorial-title text-lg font-bold tracking-tight text-[var(--ach-text-primary)] md:text-xl">
                    {article.content.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--ach-text-muted)]">
                    {article.content.listSummary}
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-[var(--ach-accent)]" aria-hidden="true">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
