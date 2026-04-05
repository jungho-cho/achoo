import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '꽃가루 알레르기란? — 원인, 증상, 예방법',
  description: '꽃가루 알레르기의 원인과 증상, 예방법을 알아보세요. 나무, 잔디, 잡초 꽃가루의 차이와 계절별 주의사항.',
  alternates: { canonical: '/pollen-info' },
};

export default function PollenInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">꽃가루 알레르기란?</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">꽃가루 알레르기 개요</h2>
            <p>
              꽃가루 알레르기(화분증)는 나무, 잔디, 잡초 등의 꽃가루가 코, 눈, 기관지 점막에 닿아
              면역 반응을 일으키는 질환입니다. 한국에서는 전 인구의 약 15~20%가 꽃가루 알레르기를
              겪고 있으며, 봄철(3~5월)과 가을철(8~10월)에 집중됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">꽃가루 종류와 시기</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold">종류</th>
                    <th className="text-left py-2 pr-4 font-semibold">대표 식물</th>
                    <th className="text-left py-2 font-semibold">시기</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 pr-4">🌳 나무</td><td className="py-2 pr-4">소나무, 참나무, 자작나무, 오리나무</td><td className="py-2">3~5월</td></tr>
                  <tr><td className="py-2 pr-4">🌾 잔디</td><td className="py-2 pr-4">잔디, 티모시, 호밀풀</td><td className="py-2">5~7월</td></tr>
                  <tr><td className="py-2 pr-4">🌿 잡초</td><td className="py-2 pr-4">쑥, 돼지풀, 환삼덩굴</td><td className="py-2">8~10월</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">주요 증상</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>코:</strong> 재채기, 맑은 콧물, 코막힘, 코 가려움</li>
              <li><strong>눈:</strong> 눈 가려움, 충혈, 눈물, 눈꺼풀 부기</li>
              <li><strong>기관지:</strong> 기침, 숨 가쁨, 천식 악화</li>
              <li><strong>피부:</strong> 두드러기, 피부 가려움 (드물지만 가능)</li>
              <li><strong>전신:</strong> 피로감, 집중력 저하, 수면 장애</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">예방법</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>꽃가루 지수가 높은 날은 외출을 자제하세요</li>
              <li>외출 시 KF94 이상의 마스크를 착용하세요</li>
              <li>귀가 후 바로 세안과 샤워를 하세요</li>
              <li>꽃가루가 많은 오전 시간대(6~10시) 환기를 피하세요</li>
              <li>세탁물은 실내에서 건조하세요</li>
              <li>공기청정기를 사용하면 실내 꽃가루를 줄일 수 있습니다</li>
              <li>증상이 심하면 항히스타민제를 복용하세요 (의사 상담 권장)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">꽃가루 vs 미세먼지</h2>
            <p>
              꽃가루와 미세먼지는 다릅니다. 꽃가루는 식물에서 나오는 생물학적 입자로 알레르기 반응을
              일으키고, 미세먼지(PM2.5/PM10)는 연소 과정에서 발생하는 화학적 입자로 호흡기 질환을
              유발합니다. 두 가지 모두 높은 날은 외출을 삼가고, 마스크를 착용하는 것이 좋습니다.
              Achoo 앱에서 꽃가루와 미세먼지를 동시에 확인할 수 있습니다.
            </p>
          </section>

        </article>

        <div className="flex gap-3 pt-4">
          <a href="/" className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            오늘의 꽃가루 확인하기
          </a>
          <a href="/tips" className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            알레르기 대처법 보기
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Achoo — 꽃가루 · 미세먼지 예보</p>
      </div>
    </div>
  );
}
