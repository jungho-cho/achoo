import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "../../../components/JsonLd";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import {
  excerpt,
  slugify,
  takeSentences,
  type SummaryItem,
} from "../../../lib/content";
import { buildFaqJsonLd, buildPageMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return buildPageMetadata({
    locale,
    pathname: "/faq",
    title: t("title"),
    description: t("description"),
  });
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.faq");
  const tUI = await getTranslations("ui");

  const items = t.raw("items") as Array<{ question: string; answer: string }>;
  const faqJsonLd = buildFaqJsonLd({
    locale,
    pathname: "/faq",
    questions: items,
  });
  const summaryItems: SummaryItem[] = items.slice(0, 3).map((item, index) => ({
    label: item.question,
    value: excerpt(takeSentences(item.answer, 1)[0] ?? item.answer, 110),
    tone: (["green", "amber", "blue"] as const)[index] ?? "gray",
  }));

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <ArticleLayout
        locale={locale}
        backHref={`/${locale}`}
        backLabel={tUI("nav.home")}
        eyebrow={tUI("nav.faq")}
        title={t("title")}
        description={t("description")}
        summaryItems={summaryItems}
        toc={items.map((item) => ({
          id: slugify(item.question),
          label: item.question,
        }))}
        tocTitle={tUI("content.onThisPage")}
        relatedTitle={tUI("content.related")}
        relatedLinks={[
          { href: "/pollen-info", label: tUI("nav.pollenInfo") },
          { href: "/tips", label: tUI("nav.tips") },
          { href: "/privacy", label: tUI("nav.privacy") },
        ]}
      >
        <section className="space-y-4">
          {items.map((item, index) => (
            <details
              key={item.question}
              id={slugify(item.question)}
              className="group rounded-[2rem] border border-[var(--ach-line)] bg-[var(--ach-surface)] shadow-[var(--ach-shadow-md)]"
            >
              <summary className="cursor-pointer list-none px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ach-text-muted)]">
                      {tUI("content.section")}{" "}
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 text-lg md:text-xl font-semibold text-gray-900">
                      {item.question}
                    </h2>
                  </div>
                  <span className="mt-1 text-[var(--ach-text-muted)] opacity-60 transition-transform group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <div className="border-t border-[var(--ach-line)] px-6 pb-6 pt-4 text-sm leading-8 text-[var(--ach-text-muted)]">
                {item.answer}
              </div>
            </details>
          ))}
        </section>
      </ArticleLayout>
    </>
  );
}
