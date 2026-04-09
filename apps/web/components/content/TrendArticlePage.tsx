import { ArticleLayout } from "./ArticleLayout";
import { TrendArticleBlocks } from "./TrendArticleBlocks";
import {
  getRelatedArticles,
  buildArticleToc,
} from "../../lib/articles";
import { getInsightsChrome } from "../../lib/insights-chrome";
import type { ArticleRecord } from "../../content/articles/schema";

export function TrendArticlePage({
  locale,
  article,
}: {
  locale: string;
  article: ArticleRecord;
}) {
  const chrome = getInsightsChrome(locale);
  const toc = buildArticleToc(article.content);
  const relatedLinks = getRelatedArticles(article.locale, article);

  return (
    <>
      <ArticleLayout
        locale={locale}
        backHref={`/${locale}/insights`}
        backLabel={chrome.backToHubLabel}
        eyebrow={article.content.eyebrow}
        title={article.content.title}
        description={article.content.description}
        titleClassName="ach-editorial-title"
        summaryItems={article.content.summaryItems}
        toc={toc}
        tocTitle={chrome.tocTitle}
        relatedLinks={relatedLinks}
        relatedTitle={chrome.relatedTitle}
        heroVariant="editorial"
      >
        <section className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {article.content.trendSignals.map((signal) => (
              <span
                key={`${signal.label}-${signal.value}`}
                className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
              >
                <span className="mr-2 text-gray-500">{signal.label}</span>
                <span className="text-gray-800">{signal.value}</span>
              </span>
            ))}
          </div>
        </section>

        <TrendArticleBlocks content={article.content} />

        <section className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="ach-editorial-title text-2xl font-bold tracking-tight text-gray-900">
            {chrome.faqTitle}
          </h2>
          <div className="mt-5 space-y-3">
            {article.content.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
              >
                <summary className="cursor-pointer list-none font-semibold text-gray-900">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-gray-700">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-600">
            {chrome.ctaEyebrow}
          </p>
          <h2 className="ach-editorial-title mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {article.content.cta.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            {article.content.cta.body}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`/${locale}${article.content.cta.primaryHref}`}
              className="inline-flex items-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              {article.content.cta.primaryLabel}
            </a>
            {article.content.cta.secondaryHref &&
              article.content.cta.secondaryLabel && (
                <a
                  href={`/${locale}${article.content.cta.secondaryHref}`}
                  className="inline-flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  {article.content.cta.secondaryLabel}
                </a>
              )}
          </div>
        </section>

        <section className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="ach-editorial-title text-2xl font-bold tracking-tight text-gray-900">
            {chrome.sourceTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            {chrome.sourceNote}
          </p>
          <ul className="mt-5 space-y-3">
            {article.sources.map((source) => (
              <li key={source.id}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  <span>
                    <span className="font-semibold text-gray-900">
                      {source.publisher}
                    </span>{" "}
                    {source.title}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </ArticleLayout>

    </>
  );
}
