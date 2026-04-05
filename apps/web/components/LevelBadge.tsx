'use client';

import type { DustLevel, PollenLevel } from '@repo/shared-types';
import { useTranslations } from 'next-intl';

type Level = PollenLevel | DustLevel;

const CONFIG: Record<Level, { bg: string; text: string; dot: string; icon: string }> = {
  low:        { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500', icon: '✓' },
  moderate:   { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400', icon: '▲' },
  high:       { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', icon: '⚠' },
  'very-high':{ bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500', icon: '‼' },
  good:       { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500', icon: '✓' },
  bad:        { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', icon: '⚠' },
  'very-bad': { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500', icon: '‼' },
};

const POLLEN_LEVELS = ['low', 'moderate', 'high', 'very-high'];

export function LevelBadge({ level, label }: { level: Level; label?: string }) {
  const t = useTranslations('ui');
  const c = CONFIG[level];
  const defaultLabel = POLLEN_LEVELS.includes(level)
    ? t(`pollenLevel.${level}` as 'pollenLevel.low')
    : t(`dustLevel.${level}` as 'dustLevel.good');
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} aria-hidden="true" />
      <span className="text-xs" aria-hidden="true">{c.icon}</span>
      {label ?? defaultLabel}
    </span>
  );
}

export function levelColor(level: Level): string {
  return CONFIG[level]?.dot ?? 'bg-gray-400';
}
