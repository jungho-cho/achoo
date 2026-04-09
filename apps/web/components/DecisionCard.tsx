"use client";

import { buildDailyRecommendation } from "@repo/normalizer";
import type { DustResponse, PollenResponse } from "@repo/shared-types";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { formatClockAtUtc } from "../lib/ssr-date";
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
  "act-now": "bg-[rgba(184,76,47,0.08)] text-[#B84C2F] border-[rgba(184,76,47,0.15)]",
  "reduce-exposure": "bg-[rgba(212,168,71,0.08)] text-[#9A7B20] border-[rgba(212,168,71,0.15)]",
  "okay-today": "bg-[rgba(138,158,126,0.08)] text-[#5C7252] border-[rgba(138,158,126,0.15)]",
} as const;

const CONFIDENCE_STYLES = {
  high: "bg-[rgba(138,158,126,0.08)] text-[#5C7252] border-[rgba(138,158,126,0.15)]",
  medium: "bg-[rgba(212,168,71,0.08)] text-[#9A7B20] border-[rgba(212,168,71,0.15)]",
  low: "bg-[var(--ach-surface)] text-[var(--ach-text-muted)] border-[var(--ach-line-light)]",
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
  const locale = useLocale();
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!pollen && !dust) {
    return null;
  }

  if (!recommendationReady) {
    return (
      <section
        className="rounded-lg bg-[var(--ach-surface)] p-5 shadow-sm border border-[var(--ach-line-light)]"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex rounded border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--ach-text-muted)]">
            {t("decision.state.locationPending")}
          </span>
          <span className="inline-flex rounded border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--ach-text-muted)]">
            {loadingPhase === "location"
              ? t("loading.location")
              : t("loading.data")}
          </span>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
          {t("decision.title")}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--ach-text-primary)]">
          {t("decision.pendingTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--ach-text-muted)]">
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
      ? timestamps.reduce((oldest, current) =>
          new Date(current).getTime() < new Date(oldest).getTime()
            ? current
            : oldest,
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
      className="rounded-lg bg-[var(--ach-surface)] p-5 shadow-sm border border-[var(--ach-line-light)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`inline-flex rounded border px-2.5 py-1 text-[11px] font-medium ${TIER_STYLES[recommendation.tier]}`}
        >
          {t(`decision.tier.${recommendation.tier}` as "decision.tier.act-now")}
        </span>
        <span className="inline-flex rounded border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--ach-text-muted)]">
          {locationChip}
        </span>
        <span className="inline-flex rounded border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--ach-text-muted)]">
          {freshnessChip}
        </span>
        <span
          className={`inline-flex rounded border px-2.5 py-1 text-[11px] font-medium ${CONFIDENCE_STYLES[recommendation.confidence]}`}
        >
          {t(
            `decision.confidence.${recommendation.confidence}` as "decision.confidence.high",
          )}
        </span>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
        {t("decision.title")}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <span className="text-2xl leading-none">
          {ACTION_ICONS[recommendation.action]}
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--ach-text-primary)]">
            {t(
              `decision.headline.${recommendation.action}` as "decision.headline.take-medicine-early",
            )}
          </h2>
          <p className="mt-2 text-sm text-[var(--ach-text-muted)]">
            {t(
              `decision.summary.${recommendation.action}` as "decision.summary.take-medicine-early",
            )}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
          {t("decision.actionTitle")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {recommendation.actions.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--ach-text-secondary)]"
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
              className="rounded-lg border border-[rgba(201,146,42,0.15)] bg-[rgba(201,146,42,0.06)] px-3 py-2 text-xs text-[#9A7B20]"
            >
              {message}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
          {t("decision.why")}
        </p>
        <ul className="mt-2 space-y-2">
          {recommendation.evidence.map((item, index) => {
            if (item.type === "pollen" && item.species) {
              return (
                <li
                  key={`${item.type}-${index}`}
                  className="rounded-lg border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-3 py-2 text-sm text-[var(--ach-text-muted)]"
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
                className="rounded-lg border border-[var(--ach-line-light)] bg-[var(--ach-surface-soft)] px-3 py-2 text-sm text-[var(--ach-text-muted)]"
              >
                {t("decision.evidence.dust", {
                  level: t(`dustLevel.${item.level}` as "dustLevel.good"),
                })}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--ach-line-light)] pt-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--ach-text-muted)]">
            {locationLabel || t("decision.trust.defaultCity")}
          </p>
          {updatedAt && (
            <p className="text-[11px] text-[var(--ach-text-subtle)]">
              {t("decision.updatedAt", {
                time: formatClockAtUtc(updatedAt, locale),
              })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDetailsOpen((prev) => !prev)}
          className="shrink-0 rounded border border-[var(--ach-line)] px-3 py-1.5 text-xs font-medium text-[var(--ach-text-muted)] hover:bg-[var(--ach-surface-strong)]"
          aria-expanded={detailsOpen}
        >
          {detailsOpen
            ? t("decision.detailCtaClose")
            : t("decision.detailCtaOpen")}
        </button>
      </div>

      {detailsOpen && (
        <div className="mt-4 space-y-3 border-t border-[var(--ach-line-light)] pt-4">
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
          <p className="text-xs text-[var(--ach-text-muted)]">{t("decision.detailHint")}</p>
        </div>
      )}
    </section>
  );
}
