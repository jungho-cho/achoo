import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import {
  excerpt,
  slugify,
  takeSentences,
  type SummaryItem,
} from "../../../lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return {
    title: t("title"),
    description: t("description"),
  };
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
  const summaryItems: SummaryItem[] = items.slice(0, 3).map((item, index) => ({
    label: item.question,
    value: excerpt(takeSentences(item.answer, 1)[0] ?? item.answer, 110),
    tone: (["green", "amber", "blue"] as const)[index] ?? "gray",
  }));

  return (
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
            className="group rounded-[2rem] border border-gray-100 bg-white shadow-sm"
          >
            <summary className="cursor-pointer list-none px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                    {tUI("content.section")}{" "}
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-lg md:text-xl font-semibold text-gray-900">
                    {item.question}
                  </h2>
                </div>
                <span className="mt-1 text-gray-300 transition-transform group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="border-t border-gray-100 px-6 pb-6 pt-4 text-sm leading-7 text-gray-700">
              {item.answer}
            </div>
          </details>
        ))}
      </section>
    </ArticleLayout>
  );
}
