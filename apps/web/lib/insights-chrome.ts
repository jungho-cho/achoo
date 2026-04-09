import type { ArticleLocale } from "../content/articles/schema";

interface InsightsChrome {
  navLabel: string;
  backToHubLabel: string;
  hubEyebrow: string;
  hubTitle: string;
  hubDescription: string;
  updatedLabel: string;
  trendLabel: string;
  tocTitle: string;
  readMoreLabel: string;
  sourceTitle: string;
  faqTitle: string;
  relatedTitle: string;
  ctaEyebrow: string;
  sourceNote: string;
}

const CHROME: Record<ArticleLocale, InsightsChrome> = {
  ko: {
    navLabel: "트렌드 인사이트",
    backToHubLabel: "트렌드 인사이트",
    hubEyebrow: "트렌드 에디션",
    hubTitle: "지금 읽어야 할 알레르기 인사이트",
    hubDescription:
      "기후, 꽃가루, 공기질, 실내 환경 변화까지 바로 행동에 옮길 수 있는 주제만 추렸습니다.",
    updatedLabel: "업데이트",
    trendLabel: "왜 지금 중요한가",
    tocTitle: "이 글에서",
    readMoreLabel: "기사 읽기",
    sourceTitle: "참고한 자료",
    faqTitle: "자주 묻는 질문",
    relatedTitle: "관련 인사이트",
    ctaEyebrow: "오늘 바로 해볼 것",
    sourceNote:
      "공공보건 기관과 전문 학회 자료를 바탕으로 정리했으며, 증상이 심하거나 오래 가면 진료가 우선입니다.",
  },
  en: {
    navLabel: "Trend Briefings",
    backToHubLabel: "Trend Briefings",
    hubEyebrow: "Trend Edition",
    hubTitle: "Allergy briefings worth reading now",
    hubDescription:
      "Pollen, air quality, and indoor-environment shifts that matter most right now, turned into practical decisions.",
    updatedLabel: "Updated",
    trendLabel: "Why this matters now",
    tocTitle: "On this page",
    readMoreLabel: "Read article",
    sourceTitle: "Sources",
    faqTitle: "Common questions",
    relatedTitle: "Related briefings",
    ctaEyebrow: "Do this next",
    sourceNote:
      "This guide is based on public-health and specialty-society sources. If symptoms are severe, persistent, or involve wheezing, clinical advice comes first.",
  },
  de: {
    navLabel: "Trend-Briefings",
    backToHubLabel: "Trend-Briefings",
    hubEyebrow: "Trend Edition",
    hubTitle: "Allergie-Briefings, die man jetzt lesen sollte",
    hubDescription:
      "Pollen-, Luft- und Innenraumtrends, die wirklich relevant sind, übersetzt in konkrete Alltagsentscheidungen.",
    updatedLabel: "Aktualisiert",
    trendLabel: "Warum das gerade wichtig ist",
    tocTitle: "Auf dieser Seite",
    readMoreLabel: "Artikel lesen",
    sourceTitle: "Quellen",
    faqTitle: "Häufige Fragen",
    relatedTitle: "Verwandte Briefings",
    ctaEyebrow: "Nächster Schritt",
    sourceNote:
      "Die Inhalte stützen sich auf öffentliche Gesundheitsquellen und Fachgesellschaften. Bei starken, anhaltenden oder asthmatischen Beschwerden ist ärztlicher Rat wichtiger als jeder Ratgeber.",
  },
  fr: {
    navLabel: "Briefings tendances",
    backToHubLabel: "Briefings tendances",
    hubEyebrow: "Édition tendances",
    hubTitle: "Briefings allergie à lire maintenant",
    hubDescription:
      "Pollens, qualité de l’air et environnement intérieur : les évolutions qui comptent, traduites en décisions utiles.",
    updatedLabel: "Mis à jour",
    trendLabel: "Pourquoi c’est important maintenant",
    tocTitle: "Dans cet article",
    readMoreLabel: "Lire l’article",
    sourceTitle: "Sources",
    faqTitle: "Questions fréquentes",
    relatedTitle: "Briefings liés",
    ctaEyebrow: "À faire ensuite",
    sourceNote:
      "Le contenu s’appuie sur des sources de santé publique et des sociétés savantes. En cas de symptômes sévères, persistants ou avec sifflements, l’avis médical reste prioritaire.",
  },
};

export function getInsightsChrome(locale: string): InsightsChrome {
  return CHROME[locale as ArticleLocale] ?? CHROME.en;
}
