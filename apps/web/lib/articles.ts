import { ARTICLE_CATALOG } from "../content/articles/catalog";
import { ARTICLE_LOCALIZATIONS } from "../content/articles/localizations";
import { ARTICLE_SOURCES } from "../content/articles/sources";
import type {
  ArticleCatalogEntry,
  ArticleLocale,
  ArticleLocalization,
  ArticleRecord,
} from "../content/articles/schema";
import { slugify } from "./content";

function getLocalization(articleId: string, locale: ArticleLocale) {
  return ARTICLE_LOCALIZATIONS.find(
    (item) => item.articleId === articleId && item.locale === locale,
  );
}

function getEntry(articleId: string): ArticleCatalogEntry | undefined {
  return ARTICLE_CATALOG.find((item) => item.id === articleId);
}

export function getArticleBySlug(locale: ArticleLocale, slug: string) {
  const entry = ARTICLE_CATALOG.find((item) => item.slug === slug);
  if (!entry) return null;

  const content = getLocalization(entry.id, locale);
  if (!content) return null;

  return {
    ...entry,
    locale,
    content,
    sources: entry.sourceIds
      .map((id) => ARTICLE_SOURCES[id])
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  } satisfies ArticleRecord;
}

export function getArticles(locale: ArticleLocale): ArticleRecord[] {
  return ARTICLE_CATALOG.map((entry) => {
    const content = getLocalization(entry.id, locale);
    if (!content) return null;

    return {
      ...entry,
      locale,
      content,
      sources: entry.sourceIds
        .map((id) => ARTICLE_SOURCES[id])
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    } satisfies ArticleRecord;
  })
    .filter((item): item is ArticleRecord => Boolean(item))
    .sort((a, b) => b.priority - a.priority);
}

export function getFeaturedArticles(locale: ArticleLocale, limit = 3) {
  return getArticles(locale)
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getRelatedArticles(
  locale: ArticleLocale,
  article: Pick<ArticleCatalogEntry, "relatedIds">,
) {
  return article.relatedIds
    .map((id) => {
      const entry = getEntry(id);
      if (!entry) return null;
      const content = getLocalization(id, locale);
      if (!content) return null;
      return {
        href: `/insights/${entry.slug}`,
        label: content.title,
      };
    })
    .filter((item): item is { href: string; label: string } => Boolean(item));
}

export function buildArticleToc(content: ArticleLocalization) {
  return content.blocks
    .filter((block) => block.heading)
    .map((block) => ({
      id: `${block.id}-${slugify(block.heading)}`,
      label: block.heading,
    }));
}

export function getArticleJsonLd(article: ArticleRecord) {
  const faq = article.content.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.content.seoTitle,
        description: article.content.seoDescription,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: article.locale,
        mainEntityOfPage: `https://achoo.day/${article.locale}/insights/${article.slug}`,
        author: {
          "@type": "Organization",
          name: "Achoo",
        },
        publisher: {
          "@type": "Organization",
          name: "Achoo",
          url: "https://achoo.day",
        },
        keywords: article.tags.join(", "),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq,
      },
    ],
  };
}
