import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import { slugify, takeSentences, type SummaryItem } from "../../../lib/content";

const ICONS = ["🌳", "🌾", "🍂"];
const TONES = [
  "border-green-100 bg-green-50/50",
  "border-blue-100 bg-blue-50/50",
  "border-amber-100 bg-amber-50/50",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.allergyTypes" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AllergyTypesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.allergyTypes");
  const tUI = await getTranslations("ui");

  const types = t.raw("types") as Array<{
    name: string;
    species: string;
    season: string;
    symptoms: string;
  }>;

  const toc = types.map((item) => ({
    id: slugify(item.name),
    label: item.name,
  }));
  const summaryItems: SummaryItem[] = types.map((item, index) => ({
    label: item.name,
    value: item.season,
    tone: (["green", "blue", "amber"] as const)[index] ?? "gray",
  }));

  return (
    <ArticleLayout
      locale={locale}
      backHref={`/${locale}`}
      backLabel={tUI("nav.home")}
      eyebrow={tUI("nav.allergyTypes")}
      title={t("title")}
      description={t("description")}
      summaryItems={summaryItems}
      toc={toc}
      tocTitle={tUI("content.onThisPage")}
      relatedTitle={tUI("content.related")}
      relatedLinks={[
        { href: "/pollen-info", label: tUI("nav.pollenInfo") },
        { href: "/seasonal-calendar", label: tUI("nav.seasonalCalendar") },
        { href: "/tips", label: tUI("nav.tips") },
      ]}
    >
      {types.map((type, index) => {
        const symptomBullets = takeSentences(type.symptoms, 4);
        return (
          <section
            key={type.name}
            id={slugify(type.name)}
            className={`rounded-[2rem] border p-6 shadow-sm ${TONES[index] ?? "border-gray-100 bg-white"}`}
          >
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ICONS[index] ?? "🌿"}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                      {tUI("content.peakSeason")}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-600">
                      {type.season}
                    </p>
                  </div>
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                  {type.name}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {tUI("content.representativePlants")}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-gray-700">
                    {type.species}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {symptomBullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm leading-7 text-gray-700"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </ArticleLayout>
  );
}
