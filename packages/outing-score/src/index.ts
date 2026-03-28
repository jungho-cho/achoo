import type { DustLevel, DustResponse, PollenLevel, PollenResponse } from '@repo/shared-types';

/**
 * Outing Score: 0–100 (higher = safer to go outside)
 *
 * Pollen contributes 0–50 points, dust contributes 0–50 points.
 * If dust data is unavailable (e.g., outside Korea), dust defaults to 25/50.
 *
 *   Score → Label mapping:
 *     80–100: 좋음 (green)   → 야외 활동하기 좋은 날
 *     60–79:  보통 (yellow)  → 마스크 챙기세요
 *     40–59:  나쁨 (orange)  → 외출 시 마스크 착용 권장
 *      0–39:  매우나쁨 (red) → 가능하면 외출 삼가세요
 */

const POLLEN_SCORE: Record<PollenLevel, number> = {
  'low': 50,
  'moderate': 35,
  'high': 15,
  'very-high': 0,
};

const DUST_SCORE: Record<DustLevel, number> = {
  'good': 50,
  'moderate': 35,
  'bad': 15,
  'very-bad': 0,
};

export type OutingGrade = 'good' | 'moderate' | 'bad' | 'very-bad';

export interface OutingResult {
  score: number;
  grade: OutingGrade;
  label: string;
  advice: string;
}

function scoreToGrade(score: number): OutingGrade {
  if (score >= 80) return 'good';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'bad';
  return 'very-bad';
}

const GRADE_INFO: Record<OutingGrade, { label: string; advice: string }> = {
  'good': { label: '좋음', advice: '야외 활동하기 좋은 날이에요 🌿' },
  'moderate': { label: '보통', advice: '민감한 분은 마스크를 챙기세요 😷' },
  'bad': { label: '나쁨', advice: '외출 시 KF94 마스크 착용 권장 ⚠️' },
  'very-bad': { label: '매우나쁨', advice: '가능하면 외출을 삼가세요 🚫' },
};

export function calculateOutingScore(
  pollen: PollenResponse | null,
  dust: DustResponse | null,
): OutingResult {
  const pollenScore = pollen
    ? POLLEN_SCORE[pollen.current.overallLevel]
    : 25; // no data → neutral

  const dustScore = dust
    ? DUST_SCORE[dust.current.level]
    : 25; // no data (outside Korea) → neutral

  const score = pollenScore + dustScore;
  const grade = scoreToGrade(score);
  const { label, advice } = GRADE_INFO[grade];

  return { score, grade, label, advice };
}
