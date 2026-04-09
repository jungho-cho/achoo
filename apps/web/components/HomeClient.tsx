"use client";

import type { PollenResponse } from "@repo/shared-types";
import { useTranslations, useLocale } from "next-intl";
import { usePollenData } from "../hooks/usePollenData";
import { getInsightsChrome } from "../lib/insights-chrome";
import { formatMonthDayAtUtc } from "../lib/ssr-date";
import { DecisionCard } from "./DecisionCard";
import { ForecastBar } from "./ForecastBar";
import { SpeciesRow } from "./SpeciesRow";
import { SymptomDiary } from "./SymptomDiary";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface Props {
  ssrPollen?: PollenResponse | null;
}

type MaybeStalePollen = PollenResponse & { stale?: boolean };

const DEFAULT_CITY_NAMES: Record<string, string> = {
  ko: "서울",
  de: "Berlin",
  en: "London",
  fr: "Paris",
};

const EN_UI_COPY = {
  footerNavigation: "Footer navigation",
  mainNavigation: "Main navigation",
  refreshLocation: "Refresh location",
  skipToMain: "Skip to main content",
  tomorrowForecast: (day: string) => `${day} forecast`,
};

const UI_COPY: Record<
  string,
  {
    footerNavigation: string;
    mainNavigation: string;
    refreshLocation: string;
    skipToMain: string;
    tomorrowForecast: (day: string) => string;
  }
> = {
  ko: {
    footerNavigation: "하단 탐색",
    mainNavigation: "주요 탐색",
    refreshLocation: "현재 위치 새로고침",
    skipToMain: "본문으로 바로가기",
    tomorrowForecast: (day) => `${day} 예보`,
  },
  de: {
    footerNavigation: "Fußnavigation",
    mainNavigation: "Hauptnavigation",
    refreshLocation: "Standort aktualisieren",
    skipToMain: "Zum Hauptinhalt springen",
    tomorrowForecast: (day) => `${day}-Prognose`,
  },
  en: EN_UI_COPY,
  fr: {
    footerNavigation: "Navigation de pied de page",
    mainNavigation: "Navigation principale",
    refreshLocation: "Actualiser la position",
    skipToMain: "Aller au contenu principal",
    tomorrowForecast: (day) => `Prévisions ${day}`,
  },
};

export function HomeClient({ ssrPollen }: Props) {
  const t = useTranslations("ui");
  const locale = useLocale();
  const insightsChrome = getInsightsChrome(locale);
  const defaultCityName =
    DEFAULT_CITY_NAMES[locale] ?? DEFAULT_CITY_NAMES.en ?? "London";
  const uiCopy = UI_COPY[locale] ?? EN_UI_COPY;
  const {
    pollen: clientPollen,
    dust,
    loading,
    loadingPhase,
    error,
    locationDenied,
    inKorea,
    cityName,
    refreshLocation,
  } = usePollenData(locale);

  // Use client data when available, fall back to SSR data
  const pollen = (clientPollen ?? ssrPollen ?? null) as MaybeStalePollen | null;
  const isHydrating = loading && !ssrPollen;
  const recommendationReady =
    Boolean(pollen) || Boolean(dust) || locationDenied;

  if (isHydrating) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-3"
        role="status"
        aria-busy="true"
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-[var(--ach-line-light)] border-t-[var(--ach-accent)] animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-[var(--ach-text-muted)]">
          {loadingPhase === "location"
            ? t("loading.location")
            : t("loading.data")}
        </p>
      </div>
    );
  }

  if (error && !pollen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 px-6 text-center">
        <p className="text-2xl">😵</p>
        <p className="text-[var(--ach-text-muted)]">{t("error.fetchFailed")}</p>
        <button
          className="mt-2 px-4 py-2 text-sm rounded-lg bg-[var(--ach-surface)] text-[var(--ach-text-muted)]"
          onClick={() => window.location.reload()}
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  if (!pollen) return null;

  const { current, forecast } = pollen;
  const headerDateLabel = current.date
    ? formatMonthDayAtUtc(current.date, locale)
    : "";
  const locationLabel = inKorea
    ? pollen.sido || dust?.sido || defaultCityName
    : cityName || defaultCityName;

  return (
    <div className="min-h-screen bg-[var(--ach-bg)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--ach-surface)] focus:text-[var(--ach-text-primary)] focus:rounded-lg focus:shadow-lg"
      >
        {uiCopy.skipToMain}
      </a>
      <main
        id="main-content"
        className="max-w-md md:max-w-4xl mx-auto px-4 py-6 space-y-4"
      >
        {/* Header with location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--ach-accent)]">
              <span aria-hidden="true">🤧 Achoo</span>
              <span className="sr-only">{t("metadata.title")}</span>
            </h1>
            {locationLabel && (
              <span className="text-sm text-[var(--ach-text-muted)]">
                📍 {locationLabel}
              </span>
            )}
            {!locationLabel && !inKorea && (
              <span className="text-sm text-[var(--ach-text-muted)]">🌍</span>
            )}
            <button
              onClick={refreshLocation}
              disabled={loading}
              aria-label={uiCopy.refreshLocation}
              title={uiCopy.refreshLocation}
              className={`p-1 -ml-1 text-[var(--ach-text-muted)] hover:text-[var(--ach-text-primary)] hover:bg-[var(--ach-surface)] rounded transition-colors duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "active:rotate-180"}`}
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--ach-accent)]" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--ach-text-muted)]">
              {headerDateLabel}
            </span>
            <LocaleSwitcher />
          </div>
        </div>

        {/* SEO intro text — visible to crawlers and users */}
        <p className="text-sm text-[var(--ach-text-muted)]">
          {t("decision.intro")}
        </p>

        {/* 2-column grid on desktop, single column on mobile */}
        <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
          {/* Left column: decision + feedback */}
          <div className="space-y-4">
            <DecisionCard
              pollen={pollen}
              dust={dust}
              locationLabel={locationLabel}
              recommendationReady={recommendationReady}
              locationDenied={locationDenied}
              loadingPhase={loadingPhase}
            />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
                {t("decision.feedbackTitle")}
              </p>
              <p className="mt-1 text-sm text-[var(--ach-text-muted)]">
                {t("decision.feedbackDesc")}
              </p>
              <div className="mt-3">
                <SymptomDiary />
              </div>
            </div>
          </div>

          {/* Right column: species + forecast */}
          <div className="space-y-4">
            <div className="bg-[var(--ach-surface)] rounded-lg shadow-sm border border-[var(--ach-line-light)] px-4 py-1">
              <h2 className="text-[11px] font-semibold text-[var(--ach-text-muted)] uppercase tracking-widest pt-3 pb-1">
                {t("pollen.title")}
              </h2>
              {pollen.offSeason && (
                <div className="px-3 py-2 my-2 rounded-lg bg-[var(--ach-secondary-soft)] border border-[rgba(61,75,114,0.15)]">
                  <p className="text-xs text-[var(--ach-secondary)]">
                    {t("pollen.offSeason")}
                  </p>
                </div>
              )}
              {current.readings.map((r) => (
                <SpeciesRow key={r.species} reading={r} />
              ))}
            </div>

            <ForecastBar current={current} forecast={forecast} />
          </div>
        </div>

        {/* Navigation links */}
        <nav
          className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4"
          role="navigation"
          aria-label={uiCopy.mainNavigation}
        >
          <a
            href={`/${locale}/tips`}
            className="flex items-center justify-between px-4 py-3 bg-[var(--ach-surface)] rounded-lg shadow-sm border border-[var(--ach-line-light)] hover:bg-[var(--ach-surface-strong)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--ach-text-secondary)]">
              💡 {t("nav.tips")}
            </span>
            <span className="text-[var(--ach-text-muted)] text-sm">→</span>
          </a>
          <a
            href={`/${locale}/pollen-info`}
            className="flex items-center justify-between px-4 py-3 bg-[var(--ach-surface)] rounded-lg shadow-sm border border-[var(--ach-line-light)] hover:bg-[var(--ach-surface-strong)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--ach-text-secondary)]">
              🌳 {t("nav.pollenInfo")}
            </span>
            <span className="text-[var(--ach-text-muted)] text-sm">→</span>
          </a>
          <a
            href={`/${locale}/insights`}
            className="flex items-center justify-between px-4 py-3 bg-[var(--ach-surface)] rounded-lg shadow-sm border border-[var(--ach-line-light)] hover:bg-[var(--ach-surface-strong)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--ach-text-secondary)]">
              📰 {insightsChrome.navLabel}
            </span>
            <span className="text-[var(--ach-text-muted)] text-sm">→</span>
          </a>
          {/* 지역별 예보 링크 — 비활성화
          <a
            href={`/${locale}/regions`}
            className="flex items-center justify-between px-4 py-3 bg-[var(--ach-surface)] rounded-lg shadow-sm border border-[var(--ach-line-light)] hover:bg-[var(--ach-surface-strong)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--ach-text-secondary)]">📍 지역별 예보</span>
            <span className="text-gray-400 text-sm">→</span>
          </a>
          */}
        </nav>

        {/* Tomorrow teaser — return hook */}
        {forecast.length > 0 &&
          (() => {
            const tmrw = forecast[0];
            if (!tmrw) return null;
            const DOT_COLOR: Record<string, string> = {
              low: "bg-[var(--ach-data-low)]",
              moderate: "bg-[var(--ach-data-moderate)]",
              high: "bg-[var(--ach-data-high)]",
              "very-high": "bg-[var(--ach-data-extreme)]",
            };
            return (
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="text-xs text-[var(--ach-text-muted)]">
                  {uiCopy.tomorrowForecast(t("days.tomorrow"))}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${DOT_COLOR[tmrw.overallLevel] ?? "bg-[var(--ach-line)]"}`}
                />
                <span className="text-xs font-medium text-[var(--ach-text-secondary)]">
                  {t(`pollenLevel.${tmrw.overallLevel}` as "pollenLevel.low")}
                </span>
              </div>
            );
          })()}

        <nav
          className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-2 text-xs text-[var(--ach-text-muted)]"
          aria-label={uiCopy.footerNavigation}
        >
          <a
            href={`/${locale}/allergy-types`}
            className="hover:text-[var(--ach-text-secondary)]"
          >
            {t("nav.allergyTypes")}
          </a>
          <span>·</span>
          <a
            href={`/${locale}/seasonal-calendar`}
            className="hover:text-[var(--ach-text-secondary)]"
          >
            {t("nav.seasonalCalendar")}
          </a>
          <span>·</span>
          <a
            href={`/${locale}/prevention-guide`}
            className="hover:text-[var(--ach-text-secondary)]"
          >
            {t("nav.preventionGuide")}
          </a>
          <span>·</span>
          <a
            href={`/${locale}/dust-guide`}
            className="hover:text-[var(--ach-text-secondary)]"
          >
            {t("nav.dustGuide")}
          </a>
          <span>·</span>
          <a
            href={`/${locale}/faq`}
            className="hover:text-[var(--ach-text-secondary)]"
          >
            {t("nav.faq")}
          </a>
          <span>·</span>
          <a
            href={`/${locale}/privacy`}
            className="hover:text-[var(--ach-text-secondary)]"
          >
            {t("nav.privacy")}
          </a>
        </nav>
      </main>
    </div>
  );
}
