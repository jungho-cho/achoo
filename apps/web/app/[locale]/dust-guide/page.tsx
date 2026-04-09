import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArticleLayout } from "../../../components/content/ArticleLayout";
import { slugify, type SummaryItem } from "../../../lib/content";
import { buildPageMetadata } from "../../../lib/seo";

function gradeColor(grade: string) {
  const normalized = grade.toLowerCase();
  if (
    normalized.includes("매우") ||
    normalized.includes("very") ||
    normalized.includes("sehr") ||
    normalized.includes("tres")
  ) {
    return "text-red-700 bg-red-50 border-red-100";
  }
  if (
    normalized.includes("나쁨") ||
    normalized.includes("bad") ||
    normalized.includes("schlecht") ||
    normalized.includes("mauvais")
  ) {
    return "text-orange-700 bg-orange-50 border-orange-100";
  }
  if (
    normalized.includes("보통") ||
    normalized.includes("moderate") ||
    normalized.includes("mäßig") ||
    normalized.includes("modéré")
  ) {
    return "text-amber-700 bg-amber-50 border-amber-100";
  }
  return "text-green-700 bg-green-50 border-green-100";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.dustGuide" });
  return buildPageMetadata({
    locale,
    pathname: "/dust-guide",
    title: t("title"),
    description: t("description"),
  });
}

export default async function DustGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.dustGuide");
  const tUI = await getTranslations("ui");

  const sections = t.raw("sections") as Array<{
    heading: string;
    content: string;
  }>;
  const grades = t.raw("grades") as Array<{
    grade: string;
    pm25: string;
    pm10: string;
    health: string;
  }>;
  const toc = sections.map((section) => ({
    id: slugify(section.heading),
    label: section.heading,
  }));
  const summaryItems: SummaryItem[] = grades
    .slice(0, 3)
    .map((grade, index) => ({
      label: grade.grade,
      value: grade.health,
      tone: (["green", "amber", "rose"] as const)[index] ?? "gray",
    }));

  return (
    <ArticleLayout
      locale={locale}
      backHref={`/${locale}`}
      backLabel={tUI("nav.home")}
      eyebrow={tUI("nav.dustGuide")}
      title={t("title")}
      description={t("description")}
      summaryItems={summaryItems}
      toc={toc}
      tocTitle={tUI("content.onThisPage")}
      relatedTitle={tUI("content.related")}
      relatedLinks={[
        { href: "/prevention-guide", label: tUI("nav.preventionGuide") },
        { href: "/pollen-info", label: tUI("nav.pollenInfo") },
        { href: "/tips", label: tUI("nav.tips") },
      ]}
    >
      <section className="ach-panel p-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {tUI("content.gradeTable")}
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-3 py-3 font-medium">
                  {tUI("content.grade")}
                </th>
                <th className="px-3 py-3 font-medium">PM10</th>
                <th className="px-3 py-3 font-medium">PM2.5</th>
                <th className="px-3 py-3 font-medium">
                  {tUI("content.health")}
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr
                  key={grade.grade}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${gradeColor(grade.grade)}`}
                    >
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{grade.pm10}</td>
                  <td className="px-3 py-3 text-gray-700">{grade.pm25}</td>
                  <td className="px-3 py-3 text-[var(--ach-text-muted)]">
                    {grade.health}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {sections.map((section, index) => (
        <section
          key={section.heading}
          id={slugify(section.heading)}
          className={`rounded-[2rem] border p-6 shadow-[var(--ach-shadow-md)] ${index === 2 ? "border-[#ecd8ab] bg-[#fbf2de]" : "border-[var(--ach-line)] bg-[var(--ach-surface)]"}`}
        >
          <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ach-text-muted)]">
                {tUI("content.topic")} {String(index + 1).padStart(2, "0")}
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
      ))}
    </ArticleLayout>
  );
}
