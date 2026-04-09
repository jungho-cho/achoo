import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { TipsClientIsland } from "../../../components/TipsClientIsland";
import { Link } from "../../../i18n/routing";
import { buildPageMetadata } from "../../../lib/seo";

function headingTone(heading: string): string {
  const normalized = heading.toLowerCase();

  if (
    normalized.includes("매우높") ||
    normalized.includes("높음") ||
    normalized.includes("very high") ||
    normalized.includes("high / very high") ||
    normalized.includes("sehr hoch") ||
    normalized.includes("hoher / sehr hoher") ||
    normalized.includes("tres eleve") ||
    normalized.includes("eleve / tres eleve")
  ) {
    return "border-red-300 bg-red-100";
  }
  if (
    normalized.includes("보통") ||
    normalized.includes("moderate") ||
    normalized.includes("maessiger") ||
    normalized.includes("mäßig") ||
    normalized.includes("moyen")
  ) {
    return "border-amber-300 bg-amber-100";
  }
  if (
    normalized.includes("낮음") ||
    normalized.includes("low") ||
    normalized.includes("niedrig") ||
    normalized.includes("faible")
  ) {
    return "border-green-300 bg-green-100";
  }
  return "border-gray-300 bg-gray-100";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.tips" });
  return buildPageMetadata({
    locale,
    pathname: "/tips",
    title: t("title"),
    description: t("description"),
  });
}

export default async function TipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ui");
  const pageT = await getTranslations("pages.tips");
  const sections = pageT.raw("sections") as Array<{
    heading: string;
    tips: string[];
  }>;

  const highlights = sections.slice(0, 3);

  return (
    <div className="ach-page">
      <div className="ach-page-shell ach-page-shell--wide space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="ach-top-link">
            ← {t("nav.home")}
          </Link>
        </div>

        <section className="ach-panel px-5 py-5 md:px-6">
          <p className="ach-eyebrow">{pageT("title")}</p>
          <h1 className="mt-4 text-[1.9rem] font-bold tracking-tight text-gray-900 md:text-[2.6rem]">
            {pageT("heroTitle")}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-800 md:text-[15px] md:leading-8">
            {pageT("description")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((section) => (
              <span
                key={section.heading}
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold text-gray-900 shadow-sm ${headingTone(section.heading)}`}
              >
                {section.heading}
              </span>
            ))}
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <TipsClientIsland locale={locale} />
          </div>

          <aside className="space-y-5 xl:col-start-2 xl:row-start-1">
            <section className="ach-panel px-4 py-4 md:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                {pageT("quickActionTitle")}
              </p>
              <div className="mt-3 space-y-3">
                {highlights.map((section) => (
                  <div
                    key={section.heading}
                    className={`rounded-2xl border px-4 py-3 shadow-sm ${headingTone(section.heading)}`}
                  >
                    <p className="text-sm font-bold text-gray-900">
                      {section.heading}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-gray-800">
                      {section.tips[0]}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <p className="pb-4 text-center text-xs text-gray-500">
          {t("metadata.title")}
        </p>
      </div>
    </div>
  );
}
