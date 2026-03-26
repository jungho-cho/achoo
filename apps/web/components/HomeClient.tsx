'use client';

import { usePollenData } from '../hooks/usePollenData';
import { ForecastBar } from './ForecastBar';
import { HeroCard } from './HeroCard';
import { LevelBadge } from './LevelBadge';
import { SpeciesRow } from './SpeciesRow';

export function HomeClient() {
  const { pollen, dust, loading, error } = usePollenData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-green-500 animate-spin" />
        <p className="text-sm text-gray-400">위치 확인 중...</p>
      </div>
    );
  }

  if (error || !pollen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 px-6 text-center">
        <p className="text-2xl">😵</p>
        <p className="text-gray-600">{error ?? '데이터를 불러올 수 없습니다.'}</p>
        <button
          className="mt-2 px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const { current, forecast } = pollen;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🤧 Achoo</h1>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* 2-column grid on desktop, single column on mobile */}
        <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">

          {/* Left column: hero + badges */}
          <div className="space-y-4">
            <HeroCard pollen={pollen} dust={dust} />

            <div className="flex items-center gap-2 flex-wrap">
              <LevelBadge level={current.overallLevel} />
              {dust && (
                <LevelBadge level={dust.current.level} label={`미세먼지 ${dust.current.displayValue}`} />
              )}
              {!dust && (
                <span className="text-xs text-gray-400">미세먼지 데이터 준비 중</span>
              )}
            </div>
          </div>

          {/* Right column: species + forecast */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-3 pb-1">
                꽃가루 종류별
              </p>
              {current.readings.map((r) => (
                <SpeciesRow key={r.species} reading={r} />
              ))}
            </div>

            <ForecastBar current={current} forecast={forecast} />
          </div>
        </div>

        {/* Full-width: tips link */}
        <a
          href="/tips"
          className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">💡 알레르기 대처법 보기</span>
          <span className="text-gray-400 text-sm">→</span>
        </a>

        {/* Ad banner placeholder */}
        <div className="h-14 rounded-xl bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-300">광고 영역</span>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">
          데이터: Open-Meteo (CAMS) · 에어코리아
        </p>
      </div>
    </div>
  );
}
