"use client";

import type { PollenResponse } from "@repo/shared-types";
import { useTranslations, useLocale } from "next-intl";
import { usePollenData } from "../hooks/usePollenData";
import { DecisionCard } from "./DecisionCard";
import { ForecastBar } from "./ForecastBar";
import { SpeciesRow } from "./SpeciesRow";
import { SymptomDiary } from "./SymptomDiary";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface Props {
  ssrPollen?: PollenResponse | null;
}

type MaybeStalePollen = PollenResponse & { stale?: boolean };

export function HomeClient({ ssrPollen }: Props) {
  const t = useTranslations("ui");
  const locale = useLocale();
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
  } = usePollenData();

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
          className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-green-500 animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-gray-400">
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
        <p className="text-gray-600">{error ?? t("error.fetchFailed")}</p>
        <button
          className="mt-2 px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600"
          onClick={() => window.location.reload()}
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  if (!pollen) return null;

  const { current, forecast } = pollen;
  const locationLabel = inKorea
    ? pollen.sido || dust?.sido || "서울"
    : cityName || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="max-w-md md:max-w-4xl mx-auto px-4 py-6 space-y-4"
      >
        {/* Header with location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">🤧 Achoo</h1>
            {locationLabel && (
              <span className="text-sm text-gray-500">📍 {locationLabel}</span>
            )}
            {!locationLabel && !inKorea && (
              <span className="text-sm text-gray-500">🌍</span>
            )}
            <button
              onClick={refreshLocation}
              disabled={loading}
              aria-label="현재 위치 새로고침"
              title="새로고침"
              className={`p-1 -ml-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "active:rotate-180"}`}
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-green-500" : ""}`}
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
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString(locale, {
                month: "long",
                day: "numeric",
              })}
            </span>
            <LocaleSwitcher />
          </div>
        </div>

        {/* Geolocation denied banner */}
        {locationDenied && (
          <div className="px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100">
            <p className="text-xs text-yellow-700">📍 {t("location.denied")}</p>
          </div>
        )}

        {/* SEO intro text — visible to crawlers and users */}
        <p className="text-sm text-gray-500">{t("decision.intro")}</p>

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
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("decision.feedbackTitle")}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t("decision.feedbackDesc")}
              </p>
              <div className="mt-3">
                <SymptomDiary />
              </div>
            </div>
          </div>

          {/* Right column: species + forecast */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-1">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-3 pb-1">
                {t("pollen.title")}
              </h2>
              {pollen.offSeason && (
                <div className="px-3 py-2 my-2 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-600">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
          role="navigation"
          aria-label="Main navigation"
        >
          <a
            href={`/${locale}/tips`}
            className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              💡 {t("nav.tips")}
            </span>
            <span className="text-gray-400 text-sm">→</span>
          </a>
          <a
            href={`/${locale}/pollen-info`}
            className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              🌳 {t("nav.pollenInfo")}
            </span>
            <span className="text-gray-400 text-sm">→</span>
          </a>
          {/* 지역별 예보 링크 — 비활성화
          <a
            href={`/${locale}/regions`}
            className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">📍 지역별 예보</span>
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
              low: "bg-green-500",
              moderate: "bg-yellow-400",
              high: "bg-orange-500",
              "very-high": "bg-red-500",
            };
            return (
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="text-xs text-gray-400">
                  {t("days.tomorrow")} 예보
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${DOT_COLOR[tmrw.overallLevel] ?? "bg-gray-300"}`}
                />
                <span className="text-xs font-medium text-gray-500">
                  {t(`pollenLevel.${tmrw.overallLevel}` as "pollenLevel.low")}
                </span>
              </div>
            );
          })()}

        <nav
          className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400 pt-2"
          aria-label="Footer navigation"
        >
          <a href={`/${locale}/allergy-types`} className="hover:text-gray-600">
            {t("nav.allergyTypes")}
          </a>
          <a
            href={`/${locale}/seasonal-calendar`}
            className="hover:text-gray-600"
          >
            {t("nav.seasonalCalendar")}
          </a>
          <a
            href={`/${locale}/prevention-guide`}
            className="hover:text-gray-600"
          >
            {t("nav.preventionGuide")}
          </a>
          <a href={`/${locale}/dust-guide`} className="hover:text-gray-600">
            {t("nav.dustGuide")}
          </a>
          <a href={`/${locale}/faq`} className="hover:text-gray-600">
            {t("nav.faq")}
          </a>
          <a href={`/${locale}/privacy`} className="hover:text-gray-600">
            {t("nav.privacy")}
          </a>
        </nav>

        <p className="text-center text-xs text-gray-300 pb-4">
          {t("pollen.source")}
        </p>
      </main>
    </div>
  );
}
