import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '월별 꽃가루 캘린더 — 한국 꽃가루 시즌 가이드',
  description: '한국의 월별 꽃가루 시즌 캘린더. 나무, 잔디, 잡초 꽃가루가 언제 날리는지 한눈에 확인하세요.',
  alternates: { canonical: '/seasonal-calendar' },
};

const MONTHS = [
  { month: '1월', tree: '없음', grass: '없음', weed: '없음', dust: '높음', note: '겨울. 꽃가루 없지만 미세먼지 주의. 실내 건조로 비염 악화 가능.' },
  { month: '2월', tree: '낮음', grass: '없음', weed: '없음', dust: '매우높음', note: '오리나무, 개암나무 꽃가루 시작. 중국발 황사+미세먼지 최악의 달.' },
  { month: '3월', tree: '높음', grass: '없음', weed: '없음', dust: '높음', note: '자작나무, 참나무 본격 시작. 봄 꽃가루 시즌 개막.' },
  { month: '4월', tree: '매우높음', grass: '낮음', weed: '없음', dust: '보통', note: '참나무 피크. 소나무 시작. 봄 알레르기 가장 심한 달.' },
  { month: '5월', tree: '높음', grass: '보통', weed: '없음', dust: '보통', note: '나무 꽃가루 감소, 잔디 시작. 소나무 꽃가루 노란 가루 비.' },
  { month: '6월', tree: '낮음', grass: '높음', weed: '없음', dust: '낮음', note: '잔디 꽃가루 피크. 장마 시작되면 꽃가루 감소.' },
  { month: '7월', tree: '없음', grass: '보통', weed: '없음', dust: '낮음', note: '장마 기간 꽃가루 최저. 알레르기 환자에게 가장 편한 달.' },
  { month: '8월', tree: '없음', grass: '낮음', weed: '높음', dust: '보통', note: '돼지풀, 쑥 시작. 가을 알레르기 시즌 개막.' },
  { month: '9월', tree: '없음', grass: '없음', weed: '매우높음', dust: '보통', note: '쑥, 돼지풀 피크. 환삼덩굴도 합세. 가을 알레르기 최악의 달.' },
  { month: '10월', tree: '없음', grass: '없음', weed: '보통', dust: '보통', note: '잡초 꽃가루 감소. 첫 서리 이후 시즌 종료.' },
  { month: '11월', tree: '없음', grass: '없음', weed: '없음', dust: '높음', note: '꽃가루 시즌 종료. 난방 시작으로 미세먼지 증가.' },
  { month: '12월', tree: '없음', grass: '없음', weed: '없음', dust: '높음', note: '겨울. 실내 알레르기(집먼지진드기, 곰팡이) 주의.' },
];

function levelColor(level: string) {
  switch (level) {
    case '매우높음': return 'bg-red-50 text-red-700';
    case '높음': return 'bg-orange-50 text-orange-700';
    case '보통': return 'bg-yellow-50 text-yellow-700';
    case '낮음': return 'bg-green-50 text-green-700';
    default: return 'bg-gray-50 text-gray-400';
  }
}

export default function SeasonalCalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">월별 꽃가루 캘린더</h1>
        </div>

        <p className="text-gray-600">
          한국의 꽃가루 시즌은 크게 봄(나무)과 가을(잡초) 두 번입니다.
          월별로 어떤 꽃가루가 날리는지, 미세먼지는 어떤지 한눈에 확인하세요.
        </p>

        <div className="space-y-3">
          {MONTHS.map((m) => (
            <div key={m.month} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{m.month}</h3>
                <div className="flex gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(m.tree)}`}>
                    나무 {m.tree}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(m.grass)}`}>
                    잔디 {m.grass}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(m.weed)}`}>
                    잡초 {m.weed}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{m.note}</p>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">시즌별 대비 요약</h2>
          <div className="space-y-2 text-gray-700 text-sm">
            <p><strong>봄 (3~5월):</strong> KF94 마스크 필수. 외출 후 샤워. 빨래 실내 건조. 오전 10시 이전 외출 자제.</p>
            <p><strong>여름 (6~7월):</strong> 장마 기간은 쉬는 시간. 에어컨 필터 청소해두기.</p>
            <p><strong>가을 (8~10월):</strong> 잡초 알레르기 환자는 봄만큼 주의. 돼지풀 자생지(하천변, 공터) 피하기.</p>
            <p><strong>겨울 (11~2월):</strong> 실내 습도 40~60% 유지. 집먼지진드기 침구 세탁.</p>
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <a href="/" className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            오늘의 꽃가루 확인하기
          </a>
          <a href="/allergy-types" className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            꽃가루 종류 알아보기
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Achoo — 꽃가루 · 미세먼지 예보</p>
      </div>
    </div>
  );
}
