import type { DustLevel, PollenLevel } from '@repo/shared-types';

type Level = PollenLevel | DustLevel;

const CONFIG: Record<Level, { bg: string; text: string; dot: string; label: string }> = {
  low:        { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  label: '낮음' },
  moderate:   { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400', label: '보통' },
  high:       { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: '높음' },
  'very-high':{ bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    label: '매우높음' },
  good:       { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  label: '좋음' },
  bad:        { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: '나쁨' },
  'very-bad': { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    label: '매우나쁨' },
};

export function LevelBadge({ level, label }: { level: Level; label?: string }) {
  const c = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {label ?? c.label}
    </span>
  );
}

export function levelColor(level: Level): string {
  return CONFIG[level]?.dot ?? 'bg-gray-400';
}
