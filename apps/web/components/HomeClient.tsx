'use client';

import type { PollenResponse } from '@repo/shared-types';
import { usePollenData } from '../hooks/usePollenData';
import { ForecastBar } from './ForecastBar';
import { HeroCard } from './HeroCard';
import { LevelBadge } from './LevelBadge';
import { SpeciesRow } from './SpeciesRow';
import { SymptomDiary } from './SymptomDiary';

interface Props {
  ssrPollen?: PollenResponse | null;
}

export function HomeClient({ ssrPollen }: Props) {
  const { pollen: clientPollen, dust, loading, loadingPhase, error, locationDenied, inKorea, cityName } = usePollenData();

  // Use client data when available, fall back to SSR data
  const pollen = clientPollen ?? ssrPollen ?? null;
  const isHydrating = loading && !ssrPollen;

  if (isHydrating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-green-500 animate-spin" />
        <p className="text-sm text-gray-400">
          {loadingPhase === 'location' ? '위치 확인 중...' : '데이터 불러오는 중...'}
        </p>
      </div>
    );
  }

  if (error && !pollen) {
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

  if (!pollen) return null;

  const { current, forecast } = pollen;
  const sido = inKorea ? (pollen.sido || dust?.sido || '서울') : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Header with location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">🤧 Achoo</h1>
            {sido && <span className="text-sm text-gray-500">📍 {sido}</span>}
            {!sido && !inKorea && <span className="text-sm text-gray-500">🌍 {cityName || '해외'}</span>}
          </div>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Geolocation denied banner */}
        {locationDenied && (
          <div className="px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100">
            <p className="text-xs text-yellow-700">
              📍 위치 권한이 없어 서울 기준으로 표시합니다
            </p>
          </div>
        )}

        {/* SEO intro text — visible to crawlers and users */}
        <p className="text-sm text-gray-500">
          오늘의 꽃가루 예보입니다. 나무, 잔디, 잡초 꽃가루 지수와 미세먼지 정보를 확인하세요.
        </p>

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
              {!dust && inKorea && (
                <span className="text-xs text-gray-400">미세먼지 데이터 준비 중</span>
              )}
            </div>

            {/* Cached data timestamp */}
            {pollen.cachedAt && (
              <p className="text-[10px] text-gray-300">
                업데이트: {new Date(pollen.cachedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Right column: species + forecast */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-1">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-3 pb-1">
                꽃가루 종류별
              </h2>
              {current.readings.map((r) => (
                <SpeciesRow key={r.species} reading={r} />
              ))}
            </div>

            <ForecastBar current={current} forecast={forecast} />
          </div>
        </div>

        {/* Symptom diary */}
        <SymptomDiary />

        {/* Navigation links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <a
            href="/tips"
            className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">💡 맞춤 대처법</span>
            <span className="text-gray-400 text-sm">→</span>
          </a>
          <a
            href="/pollen-info"
            className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">🌳 꽃가루 알레르기란?</span>
            <span className="text-gray-400 text-sm">→</span>
          </a>
          <a
            href="/regions"
            className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">📍 지역별 예보</span>
            <span className="text-gray-400 text-sm">→</span>
          </a>
        </div>

        {/* Tomorrow teaser — return hook */}
        {forecast.length > 0 && (() => {
          const tmrw = forecast[0];
          const LEVEL_KO: Record<string, string> = { low: '낮음', moderate: '보통', high: '높음', 'very-high': '매우높음' };
          const DOT_COLOR: Record<string, string> = { low: 'bg-green-500', moderate: 'bg-yellow-400', high: 'bg-orange-500', 'very-high': 'bg-red-500' };
          return (
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-xs text-gray-400">내일 예보</span>
              <span className={`w-2 h-2 rounded-full ${DOT_COLOR[tmrw.overallLevel] ?? 'bg-gray-300'}`} />
              <span className="text-xs font-medium text-gray-500">{LEVEL_KO[tmrw.overallLevel]}</span>
            </div>
          );
        })()}

        <p className="text-center text-xs text-gray-300 pb-4">
          데이터: Open-Meteo (CAMS, 유럽 모델 기반 추정치) · 에어코리아
        </p>
      </div>
    </div>
  );
}
