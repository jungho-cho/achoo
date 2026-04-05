import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '미세먼지 가이드 — PM10, PM2.5 이해하기',
  description: '미세먼지와 초미세먼지의 차이, 건강 영향, 등급 기준, 예방법을 알아보세요.',
  alternates: { canonical: '/dust-guide' },
};

export default function DustGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">미세먼지 가이드</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">미세먼지란?</h2>
            <p>
              미세먼지는 대기 중에 떠다니는 미세한 입자상 물질입니다.
              크기에 따라 미세먼지(PM10, 지름 10마이크로미터 이하)와
              초미세먼지(PM2.5, 지름 2.5마이크로미터 이하)로 나뉩니다.
              머리카락 두께의 1/20~1/30 크기로, 눈에 보이지 않습니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">등급 기준 (한국 환경부)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4">등급</th>
                    <th className="text-left py-2 pr-4">PM10</th>
                    <th className="text-left py-2 pr-4">PM2.5</th>
                    <th className="text-left py-2">행동 요령</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 pr-4 text-green-600 font-medium">좋음</td><td className="py-2 pr-4">0~30</td><td className="py-2 pr-4">0~15</td><td className="py-2">정상 활동</td></tr>
                  <tr><td className="py-2 pr-4 text-yellow-600 font-medium">보통</td><td className="py-2 pr-4">31~80</td><td className="py-2 pr-4">16~35</td><td className="py-2">민감군 주의</td></tr>
                  <tr><td className="py-2 pr-4 text-orange-600 font-medium">나쁨</td><td className="py-2 pr-4">81~150</td><td className="py-2 pr-4">36~75</td><td className="py-2">외출 자제, 마스크 착용</td></tr>
                  <tr><td className="py-2 pr-4 text-red-600 font-medium">매우나쁨</td><td className="py-2 pr-4">151+</td><td className="py-2 pr-4">76+</td><td className="py-2">실외활동 금지</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">단위: ug/m3 (마이크로그램/세제곱미터)</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">건강 영향</h2>
            <div className="space-y-2">
              <p><strong>단기 노출:</strong> 기침, 재채기, 눈 따가움, 목 아픔. 천식/비염 환자는 증상 악화.</p>
              <p><strong>장기 노출:</strong> 폐 기능 저하, 심혈관 질환 위험 증가, 폐암 위험 증가. WHO는 미세먼지를 1군 발암물질로 분류.</p>
              <p><strong>민감군:</strong> 노인, 어린이, 임산부, 호흡기/심혈관 질환자는 보통 등급부터 주의 필요.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">미세먼지 vs 꽃가루</h2>
            <div className="space-y-2">
              <p>
                꽃가루와 미세먼지는 다른 물질이지만 동시에 나쁜 날이면 증상이 배로 심해집니다.
                꽃가루가 미세먼지 입자에 붙어 더 깊은 기관지까지 침투할 수 있기 때문입니다.
              </p>
              <p>
                achoo는 꽃가루와 미세먼지를 함께 보여주는 이유가 바로 이것입니다.
                두 가지를 종합적으로 판단해야 정확한 외출 결정을 내릴 수 있어요.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">예방법</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>KF94 마스크 착용 (미세먼지 94% 차단)</li>
              <li>실내 공기청정기 가동 (HEPA 필터)</li>
              <li>나쁨 이상 시 환기 자제</li>
              <li>외출 후 세안 + 코 세척</li>
              <li>수분 충분히 섭취 (기관지 점막 보호)</li>
              <li>과격한 실외 운동 자제 (호흡량 증가 = 흡입량 증가)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">데이터 출처</h2>
            <p>
              achoo의 미세먼지 데이터는 한국 환경부 에어코리아(AirKorea)에서 제공됩니다.
              전국 500여개 측정소에서 실시간 측정되며, 1시간 단위로 업데이트됩니다.
              achoo에서는 사용자 위치 기반으로 가장 가까운 시도의 평균값을 표시합니다.
            </p>
          </section>

        </article>

        <div className="flex gap-3 pt-4">
          <a href="/" className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            오늘의 미세먼지 확인하기
          </a>
          <a href="/prevention-guide" className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            예방법 가이드
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Achoo — 꽃가루 · 미세먼지 예보</p>
      </div>
    </div>
  );
}
