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
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.privacy");
  const tUI = await getTranslations("ui");

  const sections = t.raw("sections") as Array<{
    heading: string;
    content: string;
  }>;
  const summaryItems: SummaryItem[] = sections
    .slice(0, 3)
    .map((section, index) => ({
      label: section.heading,
      value: excerpt(
        takeSentences(section.content, 1)[0] ?? section.content,
        110,
      ),
      tone: (["blue", "green", "amber"] as const)[index] ?? "gray",
    }));

  return (
    <ArticleLayout
      locale={locale}
      backHref={`/${locale}`}
      backLabel={tUI("nav.home")}
      eyebrow={tUI("nav.privacy")}
      title={t("title")}
      description={t("description")}
      summaryItems={summaryItems}
      toc={sections.map((section) => ({
        id: slugify(section.heading),
        label: section.heading,
      }))}
      tocTitle={tUI("content.onThisPage")}
      relatedTitle={tUI("content.related")}
      relatedLinks={[
        { href: "/faq", label: tUI("nav.faq") },
        { href: "/pollen-info", label: tUI("nav.pollenInfo") },
      ]}
    >
      {sections.map((section, index) => (
        <section
          key={section.heading}
          id={slugify(section.heading)}
          className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                {tUI("content.section")} {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                {section.heading}
              </h2>
            </div>
            <div className="text-sm leading-7 text-gray-700">
              {section.content}
            </div>
          </div>
        </section>
      ))}
    </ArticleLayout>
  );
}
