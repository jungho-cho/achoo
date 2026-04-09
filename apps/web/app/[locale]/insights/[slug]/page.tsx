import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ARTICLE_CATALOG } from "../../../../content/articles/catalog";
import type { ArticleLocale } from "../../../../content/articles/schema";
import { TrendArticlePage } from "../../../../components/content/TrendArticlePage";
import { getArticleBySlug } from "../../../../lib/articles";
import { buildPageMetadata } from "../../../../lib/seo";

export function generateStaticParams() {
  return ARTICLE_CATALOG.flatMap((article) =>
    ["ko", "en", "de", "fr"].map((locale) => ({
      locale,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(locale as ArticleLocale, slug);
  if (!article) {
    return {};
  }

  return {
    ...buildPageMetadata({
      locale,
      pathname: `/insights/${slug}`,
      title: article.content.seoTitle,
      description: article.content.seoDescription,
      type: "article",
      keywords: article.tags,
    }),
  };
}

export default async function InsightArticleRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticleBySlug(locale as ArticleLocale, slug);

  if (!article) {
    notFound();
  }

  return <TrendArticlePage locale={locale} article={article} />;
}
