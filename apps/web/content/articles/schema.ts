import type { SummaryItem } from "../../lib/content";

export const ARTICLE_LOCALES = ["ko", "en", "de", "fr"] as const;

export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];
export type ArticleTone = "green" | "amber" | "blue" | "rose" | "gray";

export interface ArticleSource {
  id: string;
  title: string;
  href: string;
  publisher: string;
}

export interface ArticleCatalogEntry {
  id: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  priority: number;
  theme: ArticleTone;
  tags: string[];
  sourceIds: string[];
  relatedIds: string[];
}

export interface TrendSignal {
  label: string;
  value: string;
  tone?: ArticleTone;
}

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export interface ArticleCta {
  eyebrow: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

interface BaseBlock {
  id: string;
  heading: string;
  tone?: ArticleTone;
}

export interface ArticleSectionBlock extends BaseBlock {
  type: "section";
  paragraphs: string[];
  bullets?: string[];
}

export interface ArticleChecklistBlock extends BaseBlock {
  type: "checklist";
  intro?: string;
  items: string[];
}

export interface ArticleComparisonBlock extends BaseBlock {
  type: "comparison";
  intro?: string;
  leftTitle: string;
  rightTitle: string;
  rows: Array<{
    label: string;
    left: string;
    right: string;
  }>;
  footnote?: string;
}

export interface ArticleTableBlock extends BaseBlock {
  type: "table";
  intro?: string;
  columns: string[];
  rows: Array<{
    cells: string[];
    tone?: ArticleTone;
  }>;
  footnote?: string;
}

export interface ArticleChartBlock extends BaseBlock {
  type: "chart";
  intro?: string;
  scaleLabel: string;
  bars: Array<{
    label: string;
    value: number;
    detail: string;
    tone?: ArticleTone;
  }>;
  footnote?: string;
}

export interface ArticleTimelineBlock extends BaseBlock {
  type: "timeline";
  intro?: string;
  items: Array<{
    label: string;
    title: string;
    body: string;
  }>;
}

export interface ArticleQuoteBlock extends BaseBlock {
  type: "quote";
  quote: string;
  attribution?: string;
}

export type ArticleBlock =
  | ArticleSectionBlock
  | ArticleChecklistBlock
  | ArticleComparisonBlock
  | ArticleTableBlock
  | ArticleChartBlock
  | ArticleTimelineBlock
  | ArticleQuoteBlock;

export interface ArticleLocalization {
  articleId: string;
  locale: ArticleLocale;
  eyebrow: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  listSummary: string;
  summaryItems: SummaryItem[];
  trendSignals: TrendSignal[];
  blocks: ArticleBlock[];
  faq: ArticleFaqItem[];
  cta: ArticleCta;
}

export interface ArticleRecord extends ArticleCatalogEntry {
  locale: ArticleLocale;
  content: ArticleLocalization;
  sources: ArticleSource[];
}
