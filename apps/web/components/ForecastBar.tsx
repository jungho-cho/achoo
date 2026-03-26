'use client';

import type { PollenForecastDay } from '@repo/shared-types';

const DOT: Record<string, string> = {
  low:         'bg-green-500',
  moderate:    'bg-yellow-400',
  high:        'bg-orange-500',
  'very-high': 'bg-red-500',
};

const LABEL: Record<string, string> = {
  low: '낮음', moderate: '보통', high: '높음', 'very-high': '매우높음',
};

function dayLabel(dateStr: string, index: number): string {
  if (index === 0) return '오늘';
  if (index === 1) return '내일';
  const d = new Date(dateStr);
  return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()] + '요';
}

interface Props {
  current: PollenForecastDay;
  forecast: PollenForecastDay[];
}

export function ForecastBar({ current, forecast }: Props) {
  const days = [current, ...forecast.slice(0, 6)];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">7일 예보</p>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <span className="text-xs text-gray-500">{dayLabel(day.date, i)}</span>
            <span className={`w-3 h-3 rounded-full ${DOT[day.overallLevel] ?? 'bg-gray-300'}`} />
            <span className="text-[10px] text-gray-500 text-center leading-tight">
              {LABEL[day.overallLevel]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
