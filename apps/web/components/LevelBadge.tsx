'use client';

import type { DustLevel, PollenLevel } from '@repo/shared-types';
import { useTranslations } from 'next-intl';

type Level = PollenLevel | DustLevel;

const CONFIG: Record<Level, { bg: string; text: string; dot: string; icon: string }> = {
  low:        { bg: 'bg-[rgba(138,158,126,0.08)]', text: 'text-[#5C7252]',  dot: 'bg-[var(--ach-data-low)]', icon: '✓' },
  moderate:   { bg: 'bg-[rgba(212,168,71,0.08)]',  text: 'text-[#9A7B20]',  dot: 'bg-[var(--ach-data-moderate)]', icon: '▲' },
  high:       { bg: 'bg-[rgba(184,76,47,0.08)]',   text: 'text-[#9A3B1A]',  dot: 'bg-[var(--ach-data-high)]', icon: '⚠' },
  'very-high':{ bg: 'bg-[rgba(58,37,53,0.08)]',    text: 'text-[#3A2535]',  dot: 'bg-[var(--ach-data-extreme)]', icon: '‼' },
  good:       { bg: 'bg-[rgba(138,158,126,0.08)]', text: 'text-[#5C7252]',  dot: 'bg-[var(--ach-data-low)]', icon: '✓' },
  bad:        { bg: 'bg-[rgba(184,76,47,0.08)]',   text: 'text-[#9A3B1A]',  dot: 'bg-[var(--ach-data-high)]', icon: '⚠' },
  'very-bad': { bg: 'bg-[rgba(58,37,53,0.08)]',    text: 'text-[#3A2535]',  dot: 'bg-[var(--ach-data-extreme)]', icon: '‼' },
};

const POLLEN_LEVELS = ['low', 'moderate', 'high', 'very-high'];

export function LevelBadge({ level, label }: { level: Level; label?: string }) {
  const t = useTranslations('ui');
  const c = CONFIG[level];
  const defaultLabel = POLLEN_LEVELS.includes(level)
    ? t(`pollenLevel.${level}` as 'pollenLevel.low')
    : t(`dustLevel.${level}` as 'dustLevel.good');
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} aria-hidden="true" />
      <span className="text-xs" aria-hidden="true">{c.icon}</span>
      {label ?? defaultLabel}
    </span>
  );
}

export function levelColor(level: Level): string {
  return CONFIG[level]?.dot ?? 'bg-[var(--ach-line)]';
}
