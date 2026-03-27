import type { Metadata } from 'next';
import { AffiliateLinks } from '../../components/AffiliateLinks';

export const metadata: Metadata = {
  title: '알레르기 대처법 — Achoo',
  description: '꽃가루와 미세먼지가 높은 날 건강을 지키는 방법을 알아보세요.',
};

const TIPS = [
  {
    level: '높음 · 매우높음',
    dot: 'bg-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    items: [
      '🏠 가능하면 실내에 머무세요',
      '😷 외출 시 KF94 이상 마스크 착용',
      '🪟 창문은 오전 6~10시에 잠깐만 열기',
      '🚿 귀가 후 즉시 세안 · 샤워',
      '👕 외출복은 현관에서 바로 세탁함으로',
      '💊 알레르기 약은 외출 30분 전 복용',
    ],
  },
  {
    level: '보통',
    dot: 'bg-yellow-400',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    items: [
      '😷 민감한 분은 마스크 착용 권장',
      '🌿 장시간 야외 활동 자제',
      '🧴 귀가 후 손 씻기 철저히',
      '🪟 꽃가루 농도 높은 오전에 환기 자제',
    ],
  },
  {
    level: '낮음',
    dot: 'bg-green-500',
    bg: 'bg-green-50',
    border: 'border-green-100',
    items: [
      '🌿 야외 활동하기 좋은 날이에요',
      '🪟 오전에 잠깐 환기하면 좋아요',
    ],
  },
  {
    level: '미세먼지 나쁨',
    dot: 'bg-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    items: [
      '😷 보건용 마스크 (KF80 이상) 착용',
      '🧹 공기청정기 가동',
      '🚶 격렬한 외부 운동 자제',
      '🥗 항산화 식품 (과일·채소) 섭취',
    ],
  },
  {
    level: '실내 관리',
    dot: 'bg-blue-400',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    items: [
      '🌿 화초는 꽃가루 없는 품종으로',
      '🛏 침구는 주 1회 이상 세탁 (60°C 이상)',
      '🧹 청소기보다 물걸레 청소 권장',
      '💧 습도 40~50% 유지 (너무 건조하면 악화)',
      '🐾 반려동물 털 알레르기 주의',
    ],
  },
];

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 py-6 space-y-6">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-xl font-bold text-gray-900">알레르기 대처법</h1>
        </div>

        {/* Tip sections — 1 col mobile / 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIPS.map((section) => (
            <div
              key={section.level}
              className={`rounded-2xl border p-4 ${section.bg} ${section.border}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${section.dot}`} />
                <span className="text-sm font-semibold text-gray-700">{section.level}</span>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Affiliate links — Coupang Partners */}
        <AffiliateLinks />

        {/* Ad placeholder — hidden until AdSense approved */}

        <p className="text-center text-xs text-gray-300 pb-4">
          Achoo — 꽃가루 · 미세먼지 예보
        </p>
      </div>
    </div>
  );
}
