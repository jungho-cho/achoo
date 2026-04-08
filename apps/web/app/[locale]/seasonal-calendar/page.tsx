import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import { levelRank, type SummaryItem } from "../../../lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.seasonalCalendar",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

function levelTone(level: string) {
  const rank = levelRank(level);
  if (rank >= 4) return "bg-red-50 text-red-700 border-red-100";
  if (rank === 3) return "bg-orange-50 text-orange-700 border-orange-100";
  if (rank === 2) return "bg-amber-50 text-amber-700 border-amber-100";
  if (rank === 1) return "bg-green-50 text-green-700 border-green-100";
  return "bg-gray-50 text-gray-500 border-gray-200";
}

export default async function SeasonalCalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.seasonalCalendar");
  const tUI = await getTranslations("ui");

  const months = t.raw("months") as Array<{
    month: string;
    level: string;
    species: string;
    tip: string;
  }>;

  const peakMonths = months.filter((month) => levelRank(month.level) >= 3);
  const summaryItems: SummaryItem[] = [
    {
      label: tUI("content.peakMonths"),
      value: peakMonths
        .slice(0, 3)
        .map((month) => month.month)
        .join(" · "),
      tone: "amber" as const,
    },
    {
      label: tUI("content.peakSeason"),
      value:
        peakMonths.length > 0 ? peakMonths[0]!.species : months[0]!.species,
      tone: "rose" as const,
    },
    {
      label: tUI("content.planningRule"),
      value:
        months.find((month) => levelRank(month.level) === 0)?.tip ??
        months[6]!.tip,
      tone: "blue" as const,
    },
  ];

  return (
    <ArticleLayout
      locale={locale}
      backHref={`/${locale}`}
      backLabel={tUI("nav.home")}
      eyebrow={tUI("nav.seasonalCalendar")}
      title={t("title")}
      description={t("description")}
      summaryItems={summaryItems}
      toc={[
        { id: "peak-months", label: tUI("content.seasonHighlights") },
        { id: "full-calendar", label: t("title") },
      ]}
      tocTitle={tUI("content.onThisPage")}
      relatedTitle={tUI("content.related")}
      relatedLinks={[
        { href: "/allergy-types", label: tUI("nav.allergyTypes") },
        { href: "/prevention-guide", label: tUI("nav.preventionGuide") },
        { href: "/tips", label: tUI("nav.tips") },
      ]}
    >
      <section
        id="peak-months"
        className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {tUI("content.seasonHighlights")}
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {peakMonths.slice(0, 6).map((month) => (
            <div
              key={month.month}
              className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-gray-900">
                  {month.month}
                </p>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${levelTone(month.level)}`}
                >
                  {month.level}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                {month.species}
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {month.tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="full-calendar"
        className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("title")}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {months.map((month) => (
            <div
              key={month.month}
              className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">{month.month}</h3>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${levelTone(month.level)}`}
                >
                  {month.level}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                {month.species}
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {month.tip}
              </p>
            </div>
          ))}
        </div>
      </section>
    </ArticleLayout>
  );
}
