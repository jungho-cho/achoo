"use client";

import { buildDailyRecommendation } from "@repo/normalizer";
import type { DustResponse, PollenResponse } from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LevelBadge } from "./LevelBadge";

type MaybeStalePollen = PollenResponse & { stale?: boolean };
type MaybeStaleDust = DustResponse & { stale?: boolean };

interface Props {
  pollen: MaybeStalePollen | null;
  dust: MaybeStaleDust | null;
  locationLabel: string | null;
  recommendationReady: boolean;
  locationDenied: boolean;
  loadingPhase: "location" | "data" | null;
}

const TIER_STYLES = {
  "act-now": "bg-red-50 text-red-700 border-red-100",
  "reduce-exposure": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "okay-today": "bg-green-50 text-green-700 border-green-100",
} as const;

const CONFIDENCE_STYLES = {
  high: "bg-green-50 text-green-700 border-green-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-gray-100 text-gray-600 border-gray-200",
} as const;

const ACTION_ICONS = {
  "take-medicine-early": "💊",
  "wear-mask": "😷",
  "avoid-lunch-walk": "🚶",
  "okay-today": "🌿",
} as const;

export function DecisionCard({
  pollen,
  dust,
  locationLabel,
  recommendationReady,
  locationDenied,
  loadingPhase,
}: Props) {
  const t = useTranslations("ui");
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!pollen && !dust) {
    return null;
  }

  if (!recommendationReady) {
    return (
      <section
        className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            {t("decision.state.locationPending")}
          </span>
          <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            {loadingPhase === "location"
              ? t("loading.location")
              : t("loading.data")}
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t("decision.title")}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          {t("decision.pendingTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t("decision.pendingDesc")}
        </p>
      </section>
    );
  }

  if (!pollen && !dust) return null;

  const stale = Boolean(pollen?.stale || dust?.stale);
  const recommendation = buildDailyRecommendation(pollen, dust, {
    stale,
    locationDenied,
  });
  if (!recommendation) return null;

  const locationChip = locationDenied
    ? t("decision.trust.fallbackLocation")
    : t("decision.trust.confirmedLocation");
  const freshnessChip = stale
    ? t("decision.trust.cached")
    : t("decision.trust.live");
  const timestamps = [pollen?.cachedAt, dust?.cachedAt].filter(
    (value): value is string => Boolean(value),
  );
  const updatedAt =
    timestamps.length > 0
      ? new Date(
          timestamps.reduce((oldest, current) =>
            new Date(current).getTime() < new Date(oldest).getTime()
              ? current
              : oldest,
          ),
        )
      : null;

  const stateMessages = [
    locationDenied ? t("decision.state.locationDenied") : null,
    recommendation.state.stale ? t("decision.state.stale") : null,
    recommendation.state.dataMode === "pollen-only"
      ? t("decision.state.pollenOnly")
      : null,
    recommendation.state.dataMode === "dust-only"
      ? t("decision.state.dustOnly")
      : null,
  ].filter(Boolean);

  return (
    <section
      className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${TIER_STYLES[recommendation.tier]}`}
        >
          {t(`decision.tier.${recommendation.tier}` as "decision.tier.act-now")}
        </span>
        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
          {locationChip}
        </span>
        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
          {freshnessChip}
        </span>
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${CONFIDENCE_STYLES[recommendation.confidence]}`}
        >
          {t(
            `decision.confidence.${recommendation.confidence}` as "decision.confidence.high",
          )}
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {t("decision.title")}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <span className="text-2xl leading-none">
          {ACTION_ICONS[recommendation.action]}
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {t(
              `decision.headline.${recommendation.action}` as "decision.headline.take-medicine-early",
            )}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t(
              `decision.summary.${recommendation.action}` as "decision.summary.take-medicine-early",
            )}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t("decision.actionTitle")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {recommendation.actions.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              <span>{ACTION_ICONS[item]}</span>
              <span>
                {t(
                  `decision.actionList.${item}` as "decision.actionList.take-medicine-early",
                )}
              </span>
            </span>
          ))}
        </div>
      </div>

      {stateMessages.length > 0 && (
        <div className="mt-4 space-y-2">
          {stateMessages.map((message) => (
            <div
              key={message}
              className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700"
            >
              {message}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t("decision.why")}
        </p>
        <ul className="mt-2 space-y-2">
          {recommendation.evidence.map((item, index) => {
            if (item.type === "pollen" && item.species) {
              return (
                <li
                  key={`${item.type}-${index}`}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                >
                  {t("decision.evidence.pollen", {
                    species: t(`species.${item.species}` as "species.tree"),
                    level: t(`pollenLevel.${item.level}` as "pollenLevel.low"),
                  })}
                </li>
              );
            }

            return (
              <li
                key={`${item.type}-${index}`}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              >
                {t("decision.evidence.dust", {
                  level: t(`dustLevel.${item.level}` as "dustLevel.good"),
                })}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">
            {locationLabel || t("decision.trust.defaultCity")}
          </p>
          {updatedAt && (
            <p className="text-[11px] text-gray-400">
              {t("decision.updatedAt", {
                time: updatedAt.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDetailsOpen((prev) => !prev)}
          className="shrink-0 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          aria-expanded={detailsOpen}
        >
          {detailsOpen
            ? t("decision.detailCtaClose")
            : t("decision.detailCtaOpen")}
        </button>
      </div>

      {detailsOpen && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          <div className="flex flex-wrap gap-2">
            {recommendation.pollenLevel && (
              <LevelBadge level={recommendation.pollenLevel} />
            )}
            {recommendation.dustLevel && (
              <LevelBadge
                level={recommendation.dustLevel}
                label={`${t("dust.title")} ${t(`dustLevel.${recommendation.dustLevel}` as "dustLevel.good")}`}
              />
            )}
          </div>
          <p className="text-xs text-gray-500">{t("decision.detailHint")}</p>
        </div>
      )}
    </section>
  );
}
