import { dominantLevel, normalizeKmaReading } from '@repo/normalizer';
import type { PollenForecastDay, PollenReading, PollenResponse } from '@repo/shared-types';

// 기상청 보건기상지수 V3 — 꽃가루농도위험지수
// 소나무/참나무: 3~6월, 잡초류: 8~10월
const BASE_URL = 'https://apis.data.go.kr/1360000/HealthWthrIdxServiceV3';

interface KmaPollenItem {
  code: string;
  areaNo: string;
  date: string;
  today: string;
  tomorrow: string;
  dayaftertomorrow: string;
  twodaysaftertomorrow: string;
}

interface KmaResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body?: {
      items?: { item?: KmaPollenItem[] };
    };
  };
}

// KMA values: 0=낮음, 1=보통, 2=높음, 3=매우높음
const KMA_VALUE_MAP: Record<string, string> = {
  '0': '낮음',
  '1': '보통',
  '2': '높음',
  '3': '매우높음',
};

function kmaValueToReading(
  value: string,
  species: 'pine' | 'oak' | 'weed',
): PollenReading | null {
  const label = KMA_VALUE_MAP[value];
  if (!label) return null;
  return normalizeKmaReading(label, species);
}

// KST 기준 현재 날짜의 발표시간 (06시 또는 18시)
function getKstTimeParam(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = kst.getUTCHours();
  // 06시 발표 이후면 06, 아니면 전날 18시
  if (hh >= 6) return `${yyyy}${mm}${dd}06`;
  // 전날 18시
  const prev = new Date(kst.getTime() - 24 * 60 * 60 * 1000);
  const py = prev.getUTCFullYear();
  const pm = String(prev.getUTCMonth() + 1).padStart(2, '0');
  const pd = String(prev.getUTCDate()).padStart(2, '0');
  return `${py}${pm}${pd}18`;
}

async function fetchKmaEndpoint(
  endpoint: string,
  areaNo: string,
  time: string,
): Promise<KmaPollenItem | null> {
  const apiKey = process.env.KMA_POLLEN_API_KEY;
  if (!apiKey) throw new Error('KMA_POLLEN_API_KEY not set');

  const params = new URLSearchParams({
    serviceKey: apiKey,
    numOfRows: '10',
    pageNo: '1',
    dataType: 'JSON',
    areaNo,
    time,
  });

  const res = await fetch(`${BASE_URL}/${endpoint}?${params}`);
  if (!res.ok) return null;

  const json = (await res.json()) as KmaResponse;
  if (json.response.header.resultCode !== '00') return null;

  const items = json.response.body?.items?.item;
  return items?.[0] ?? null;
}

// 현재 월이 제공 기간 내인지 확인
function isTreeSeason(): boolean {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const month = kst.getUTCMonth() + 1;
  return month >= 3 && month <= 6;
}

function isWeedSeason(): boolean {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const month = kst.getUTCMonth() + 1;
  return month >= 8 && month <= 10;
}

export async function fetchPollenKma(
  areaNo: string,
  sido: string,
): Promise<PollenResponse> {
  const time = getKstTimeParam();
  const today = time.slice(0, 8);
  const todayDate = `${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`;

  // Fetch available endpoints in parallel
  const [pine, oak, weed] = await Promise.all([
    isTreeSeason() ? fetchKmaEndpoint('getPinePollenRiskIdxV3', areaNo, time) : null,
    isTreeSeason() ? fetchKmaEndpoint('getOakPollenRiskIdxV3', areaNo, time) : null,
    isWeedSeason() ? fetchKmaEndpoint('getWeedsPollenRiskndxV3', areaNo, time) : null,
  ]);

  // Build current day readings from "today" field (may be empty if not yet published)
  const currentReadings: PollenReading[] = [];
  const todayPine = pine?.today ? kmaValueToReading(pine.today, 'pine') : null;
  const todayOak = oak?.today ? kmaValueToReading(oak.today, 'oak') : null;
  const todayWeed = weed?.today ? kmaValueToReading(weed.today, 'weed') : null;

  // If today is empty, use tomorrow as fallback for current display
  const fallbackPine = !todayPine && pine?.tomorrow ? kmaValueToReading(pine.tomorrow, 'pine') : todayPine;
  const fallbackOak = !todayOak && oak?.tomorrow ? kmaValueToReading(oak.tomorrow, 'oak') : todayOak;
  const fallbackWeed = !todayWeed && weed?.tomorrow ? kmaValueToReading(weed.tomorrow, 'weed') : todayWeed;

  if (fallbackPine) currentReadings.push(fallbackPine);
  if (fallbackOak) currentReadings.push(fallbackOak);
  if (fallbackWeed) currentReadings.push(fallbackWeed);

  // Off-season detection (July, Nov-Feb: neither tree nor weed season)
  const offSeason = currentReadings.length === 0;

  if (offSeason) {
    currentReadings.push(normalizeKmaReading('낮음', 'pine'));
    currentReadings.push(normalizeKmaReading('낮음', 'oak'));
  }

  const current: PollenForecastDay = {
    date: todayDate,
    readings: currentReadings,
    overallLevel: dominantLevel(currentReadings),
  };

  // Build forecast from tomorrow/dayafter/twodaysafter
  const forecastDays: PollenForecastDay[] = [];
  const dayFields = ['tomorrow', 'dayaftertomorrow', 'twodaysaftertomorrow'] as const;

  for (let i = 0; i < dayFields.length; i++) {
    const field = dayFields[i];
    const readings: PollenReading[] = [];
    const pineVal = pine?.[field] ? kmaValueToReading(pine[field], 'pine') : null;
    const oakVal = oak?.[field] ? kmaValueToReading(oak[field], 'oak') : null;
    const weedVal = weed?.[field] ? kmaValueToReading(weed[field], 'weed') : null;

    if (pineVal) readings.push(pineVal);
    if (oakVal) readings.push(oakVal);
    if (weedVal) readings.push(weedVal);

    if (readings.length === 0) continue;

    // Compute KST date by parsing todayDate and adding days manually
    // (toISOString() would convert to UTC and shift the date)
    const [y, m, day] = todayDate.split('-').map(Number);
    const d = new Date(y, m - 1, day + i + 1);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    forecastDays.push({
      date: dateStr,
      readings,
      overallLevel: dominantLevel(readings),
    });
  }

  return {
    sido,
    lat: 0,
    lng: 0,
    source: 'kma',
    current,
    forecast: forecastDays,
    cachedAt: new Date().toISOString(),
    offSeason,
  };
}
