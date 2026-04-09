import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import { slugify, takeSentences, type SummaryItem } from "../../../lib/content";
import { buildPageMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.pollenInfo" });
  return buildPageMetadata({
    locale,
    pathname: "/pollen-info",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PollenInfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.pollenInfo");
  const tUI = await getTranslations("ui");

  const intro = t("intro");
  const sections = t.raw("sections") as Array<{
    heading: string;
    content: string;
  }>;
  const toc = sections.map((section) => ({
    id: slugify(section.heading),
    label: section.heading,
  }));
  const summaryItems: SummaryItem[] = sections
    .slice(0, 3)
    .map((section, index) => ({
      label: section.heading,
      value: takeSentences(section.content, 1)[0] ?? section.content,
      tone: (["green", "amber", "blue"] as const)[index] ?? "gray",
    }));

  return (
    <ArticleLayout
      locale={locale}
      backHref={`/${locale}`}
      backLabel={tUI("nav.home")}
      eyebrow={tUI("pollen.title")}
      title={t("title")}
      description={t("description")}
      summaryItems={summaryItems}
      toc={toc}
      tocTitle={tUI("content.onThisPage")}
      relatedTitle={tUI("content.related")}
      relatedLinks={[
        { href: "/tips", label: tUI("nav.tips") },
        { href: "/allergy-types", label: tUI("nav.allergyTypes") },
        { href: "/seasonal-calendar", label: tUI("nav.seasonalCalendar") },
      ]}
    >
      <section className="rounded-[2rem] border border-[#d9eadf] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,246,239,0.78))] p-6 shadow-[var(--ach-shadow-md)]">
        <p className="text-sm leading-8 text-[var(--ach-text-muted)]">
          {intro}
        </p>
      </section>

      {sections.map((section, index) => {
        return (
          <section
            key={section.heading}
            id={slugify(section.heading)}
            className={`rounded-[2rem] border p-6 shadow-[var(--ach-shadow-md)] ${index % 2 === 0 ? "border-[var(--ach-line)] bg-[var(--ach-surface)]" : "border-[#d7e7f0] bg-[#edf5f9]"}`}
          >
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ach-text-muted)]">
                  {tUI("content.section")} {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                  {section.heading}
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-8 text-[var(--ach-text-muted)]">
                  {section.content}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </ArticleLayout>
  );
}
