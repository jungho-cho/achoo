import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '꽃가루 알레르기 예방법 — 실천 가이드',
  description: '꽃가루 알레르기 예방과 관리를 위한 실천 가이드. 마스크 선택, 실내 환경 관리, 약물 치료까지.',
  alternates: { canonical: '/prevention-guide' },
};

export default function PreventionGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">꽃가루 알레르기 예방법</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed">

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">😷 마스크 선택 가이드</h2>
            <div className="space-y-2">
              <p><strong>KF94:</strong> 꽃가루 차단율 94%. 봄철 외출 시 가장 추천. 미세먼지도 동시 차단.</p>
              <p><strong>KF80:</strong> 차단율 80%. 가벼운 날에 사용. 호흡이 더 편함.</p>
              <p><strong>일반 마스크:</strong> 꽃가루 차단 효과 거의 없음. 비추천.</p>
              <p className="text-sm text-gray-500 mt-2">
                마스크는 코와 입을 완전히 밀착시켜야 효과가 있습니다.
                턱에 걸치거나 코를 내놓으면 차단 효과가 50% 이하로 떨어집니다.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">🏠 실내 환경 관리</h2>
            <ul className="space-y-2">
              <li><strong>환기 시간:</strong> 꽃가루 농도가 낮은 오후 2시~4시에 짧게 (10~15분). 오전에는 환기 자제.</li>
              <li><strong>공기청정기:</strong> HEPA 필터 제품 사용. 침실에 두고 취침 시 가동. 필터는 6개월마다 교체.</li>
              <li><strong>빨래:</strong> 실내 건조 필수. 야외 건조 시 꽃가루가 옷에 묻음.</li>
              <li><strong>침구:</strong> 주 1회 60도 이상 열수 세탁. 방진 커버 사용 추천.</li>
              <li><strong>습도:</strong> 40~60% 유지. 너무 건조하면 점막 자극, 너무 습하면 곰팡이.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">🚿 외출 후 루틴</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>현관에서 겉옷 벗기 (실내로 꽃가루 유입 차단)</li>
              <li>손 씻기 + 세안 (눈 주변 꽃가루 제거)</li>
              <li>코 세척 (생리식염수로 비강 세척 — 증상 50% 감소 효과)</li>
              <li>샤워 + 머리 감기 (머리카락에 꽃가루가 가장 많이 묻음)</li>
              <li>외출복 세탁 또는 별도 보관</li>
            </ol>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">💊 약물 치료</h2>
            <div className="space-y-2">
              <p><strong>항히스타민제:</strong> 세티리진(지르텍), 로라타딘(클라리틴), 펙소페나딘(알레그라). 증상 발생 전 복용이 가장 효과적.</p>
              <p><strong>비강 스프레이:</strong> 플루티카손(아바미스), 모메타손(나조넥스). 코막힘에 가장 효과적. 2~3일 후 효과 나타남.</p>
              <p><strong>안약:</strong> 올로파타딘(파타놀), 케토티펜. 눈 가려움, 충혈에 효과적.</p>
              <p className="text-sm text-gray-500 mt-2">
                약물은 시즌 시작 2주 전부터 미리 복용하면 효과가 훨씬 좋습니다.
                의사와 상담 후 자신에게 맞는 약물을 선택하세요.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">🌡️ 면역 요법 (근본 치료)</h2>
            <p>
              3~5년간 알레르겐을 소량씩 투여해 면역 체계를 적응시키는 치료법입니다.
              피하주사 또는 설하(혀 밑) 투여 방식이 있으며, 완치율은 약 70~80%.
              시간이 걸리지만 유일한 근본 치료법입니다.
            </p>
          </section>

        </article>

        <div className="flex gap-3 pt-4">
          <a href="/" className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            오늘의 꽃가루 확인하기
          </a>
          <a href="/seasonal-calendar" className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            월별 캘린더 보기
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Achoo — 꽃가루 · 미세먼지 예보</p>
      </div>
    </div>
  );
}
