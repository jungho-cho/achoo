import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import { slugify, type SummaryItem } from "../../../lib/content";

const ICONS = ["😷", "🏠", "🚿", "💊", "🧬"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.preventionGuide",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PreventionGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.preventionGuide");
  const tUI = await getTranslations("ui");

  const sections = t.raw("sections") as Array<{
    heading: string;
    tips: string[];
  }>;
  const toc = sections.map((section) => ({
    id: slugify(section.heading),
    label: section.heading,
  }));
  const summaryItems: SummaryItem[] = sections
    .slice(0, 3)
    .map((section, index) => ({
      label: section.heading,
      value: section.tips[0] ?? "",
      tone: (["green", "blue", "amber"] as const)[index] ?? "gray",
    }));

  return (
    <ArticleLayout
      locale={locale}
      backHref={`/${locale}`}
      backLabel={tUI("nav.home")}
      eyebrow={tUI("nav.preventionGuide")}
      title={t("title")}
      description={t("description")}
      summaryItems={summaryItems}
      toc={toc}
      tocTitle={tUI("content.onThisPage")}
      relatedTitle={tUI("content.related")}
      relatedLinks={[
        { href: "/tips", label: tUI("nav.tips") },
        { href: "/seasonal-calendar", label: tUI("nav.seasonalCalendar") },
        { href: "/dust-guide", label: tUI("nav.dustGuide") },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {summaryItems.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {item.label}
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-700">{item.value}</p>
          </div>
        ))}
      </section>

      {sections.map((section, index) => (
        <section
          key={section.heading}
          id={slugify(section.heading)}
          className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              {ICONS[index] ?? "✅"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                {tUI("content.playbook")} {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                {section.heading}
              </h2>
            </div>
          </div>

          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {section.tips.map((tip, tipIndex) => (
              <li
                key={`${section.heading}-${tipIndex}`}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-700"
              >
                <span className="mr-2 text-green-600">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ArticleLayout>
  );
}
