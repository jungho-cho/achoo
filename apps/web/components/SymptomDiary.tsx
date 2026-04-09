"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { DiaryEntry, Severity } from "../lib/diary";
import {
  SEVERITY_OPTIONS,
  loadEntries,
  parseLocalDate,
  saveTodayEntry,
  today,
} from "../lib/diary";

export function SymptomDiary() {
  const t = useTranslations("ui");
  const locale = useLocale();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setMounted(true);
  }, []);

  const todayEntry = entries.find((e) => e.date === today());

  const handleSelect = useCallback(
    (severity: Severity) => {
      const updated = saveTodayEntry(
        entries,
        severity,
        todayEntry?.symptoms ?? [],
      );
      setEntries(updated);
    },
    [entries, todayEntry],
  );

  if (!mounted) return null;

  const recent = entries
    .filter((e) => {
      const diff =
        (Date.now() - parseLocalDate(e.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-gray-800">
        {t("diary.title")}
      </p>
      {recent.length === 0 && (
        <p className="mb-3 text-xs leading-6 text-gray-600">
          {t("diary.description")}
        </p>
      )}
      {recent.length > 0 && <div className="mb-3" />}

      <div className="flex justify-between gap-1">
        {SEVERITY_OPTIONS.map((opt) => {
          const isSelected = todayEntry?.severity === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              aria-label={t(opt.label)}
              aria-pressed={isSelected}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
                isSelected
                  ? "border-2 border-green-600 bg-green-200 text-green-950 shadow-sm"
                  : "border-2 border-transparent bg-gray-100 text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className={isSelected ? "text-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]" : "text-xl"}>
                {opt.emoji}
              </span>
              <span
                className={`text-[11px] ${isSelected ? "font-bold text-green-950" : "font-medium text-gray-700"}`}
              >
                {t(opt.label)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Link to detailed symptom checker */}
      {todayEntry && todayEntry.severity > 0 && (
        <a
          href={`/${locale}/tips`}
          className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"
        >
          {t("diary.expandCta")} →
        </a>
      )}

      {recent.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {recent.slice(0, 7).map((entry) => {
            const opt = SEVERITY_OPTIONS.find(
              (o) => o.value === entry.severity,
            );
            const dayLabel = parseLocalDate(entry.date).toLocaleDateString(
              locale,
              { day: "numeric" },
            );
            return (
              <div
                key={entry.date}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="text-xs">{opt?.emoji}</span>
                <span className="text-[10px] text-gray-500">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
