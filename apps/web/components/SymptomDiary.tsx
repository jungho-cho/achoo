'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DiaryEntry, Severity } from '../lib/diary';
import { SEVERITY_OPTIONS, loadEntries, saveTodayEntry, today } from '../lib/diary';

export function SymptomDiary() {
  const t = useTranslations('ui');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setMounted(true);
  }, []);

  const todayEntry = entries.find((e) => e.date === today());

  const handleSelect = useCallback((severity: Severity) => {
    const updated = saveTodayEntry(entries, severity, todayEntry?.symptoms ?? []);
    setEntries(updated);
  }, [entries, todayEntry]);

  if (!mounted) return null;

  const recent = entries
    .filter((e) => {
      const diff = (Date.now() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {t('diary.title')}
      </p>
      {recent.length === 0 && (
        <p className="text-[11px] text-gray-400 mb-3">
          {t('diary.description')}
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
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
                isSelected
                  ? 'bg-green-50 border-2 border-green-400'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-[10px] text-gray-500">{t(opt.label as any)}</span>
            </button>
          );
        })}
      </div>

      {/* Link to detailed symptom checker */}
      {todayEntry && todayEntry.severity > 0 && (
        <a
          href="/tips"
          className="mt-3 flex items-center justify-center gap-1 text-xs text-green-600 hover:text-green-700"
        >
          {t('diary.expandCta')} →
        </a>
      )}

      {recent.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {recent.slice(0, 7).map((entry) => {
            const opt = SEVERITY_OPTIONS.find((o) => o.value === entry.severity);
            const dayLabel = new Date(entry.date).toLocaleDateString('ko-KR', { day: 'numeric' });
            return (
              <div key={entry.date} className="flex flex-col items-center gap-0.5">
                <span className="text-xs">{opt?.emoji}</span>
                <span className="text-[9px] text-gray-300">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
