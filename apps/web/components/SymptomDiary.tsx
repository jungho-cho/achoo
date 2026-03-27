'use client';

import { useCallback, useEffect, useState } from 'react';

type Severity = 0 | 1 | 2 | 3 | 4;

interface DiaryEntry {
  date: string; // YYYY-MM-DD
  severity: Severity;
  note: string;
  timestamp: string;
}

const SEVERITY_OPTIONS: { value: Severity; emoji: string; label: string }[] = [
  { value: 0, emoji: '😊', label: '괜찮아요' },
  { value: 1, emoji: '🤏', label: '조금' },
  { value: 2, emoji: '😷', label: '보통' },
  { value: 3, emoji: '🤧', label: '심해요' },
  { value: 4, emoji: '😵', label: '매우 심해요' },
];

const STORAGE_KEY = 'achoo_diary';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadEntries(): DiaryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: DiaryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function SymptomDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setMounted(true);
  }, []);

  const todayEntry = entries.find((e) => e.date === today());

  const handleSelect = useCallback((severity: Severity) => {
    const updated = entries.filter((e) => e.date !== today());
    const entry: DiaryEntry = {
      date: today(),
      severity,
      note: '',
      timestamp: new Date().toISOString(),
    };
    updated.push(entry);
    setEntries(updated);
    saveEntries(updated);
  }, [entries]);

  if (!mounted) return null;

  // Recent 7 days for mini history
  const recent = entries
    .filter((e) => {
      const diff = (Date.now() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
        오늘 어떠세요?
      </p>
      {recent.length === 0 && (
        <p className="text-[11px] text-gray-400 mb-3">
          매일 기록하면 나만의 알레르기 패턴을 알 수 있어요
        </p>
      )}
      {recent.length > 0 && <div className="mb-3" />}

      {/* Severity selector */}
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
              <span className="text-[10px] text-gray-500">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mini history */}
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
