import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import { slugify, takeSentences, type SummaryItem } from "../../../lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.pollenInfo" });
  return {
    title: t("title"),
    description: t("description"),
  };
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
      <section className="rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-6 shadow-sm">
        <p className="text-sm leading-7 text-gray-700">{intro}</p>
      </section>

      {sections.map((section, index) => {
        const points = takeSentences(section.content, 4);
        return (
          <section
            key={section.heading}
            id={slugify(section.heading)}
            className={`rounded-[2rem] border p-6 shadow-sm ${index % 2 === 0 ? "border-gray-100 bg-white" : "border-blue-100 bg-blue-50/40"}`}
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

              <div className="space-y-4">
                <p className="text-sm leading-7 text-gray-700">
                  {section.content}
                </p>
                {points.length > 1 && (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 text-sm text-gray-600"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </ArticleLayout>
  );
}
