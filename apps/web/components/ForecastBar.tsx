"use client";

import type { PollenForecastDay } from "@repo/shared-types";
import { useTranslations } from "next-intl";
import { getUtcWeekday } from "../lib/ssr-date";

const DOT: Record<string, string> = {
  low: "bg-[var(--ach-data-low)]",
  moderate: "bg-[var(--ach-data-moderate)]",
  high: "bg-[var(--ach-data-high)]",
  "very-high": "bg-[var(--ach-data-extreme)]",
};

const LEVEL_TEXT: Record<string, string> = {
  low: "text-[#5C7252]",
  moderate: "text-[#9A7B20]",
  high: "text-[#9A3B1A]",
  "very-high": "text-[#C0392B]",
};

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

interface Props {
  current: PollenForecastDay;
  forecast: PollenForecastDay[];
}

export function ForecastBar({ current, forecast }: Props) {
  const t = useTranslations("ui");
  const days = [current, ...forecast.slice(0, 6)];

  function dayLabel(dateStr: string, index: number): string {
    if (index === 0) return t("days.today");
    if (index === 1) return t("days.tomorrow");
    return t(`days.${DAY_KEYS[getUtcWeekday(dateStr)]}` as "days.mon");
  }

  return (
    <div className="ach-panel px-4 py-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--ach-text-muted)]">
        {t("pollen.forecast")}
      </p>
      <div className="grid grid-cols-7 gap-1" role="list">
        {days.map((day, i) => {
          const levelLabel = t(
            `pollenLevel.${day.overallLevel}` as "pollenLevel.low",
          );
          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1.5 rounded-lg bg-[var(--ach-surface-soft)] px-1 py-2"
              role="listitem"
              aria-label={`${dayLabel(day.date, i)}: ${t("pollen.title")} ${levelLabel}`}
            >
              <span className="text-xs font-medium text-[var(--ach-text-secondary)]">
                {dayLabel(day.date, i)}
              </span>
              <span
                className={`w-3 h-3 rounded-full ${DOT[day.overallLevel] ?? "bg-[var(--ach-line)]"}`}
                aria-hidden="true"
              />
              <span
                className={`text-[10px] text-center leading-tight font-semibold ${LEVEL_TEXT[day.overallLevel] ?? "text-[var(--ach-text-secondary)]"}`}
              >
                {levelLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
