import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '꽃가루 종류별 알레르기 — 나무, 잔디, 잡초',
  description: '나무, 잔디, 잡초 꽃가루 알레르기의 차이점, 주요 원인 식물, 시즌, 증상 비교. 내가 어떤 꽃가루에 민감한지 알아보세요.',
  alternates: { canonical: '/allergy-types' },
};

export default function AllergyTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">꽃가루 종류별 알레르기</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed">

          <p>
            꽃가루 알레르기는 크게 나무, 잔디, 잡초 세 가지로 나뉩니다.
            각 종류마다 시즌이 다르고, 증상의 강도도 차이가 있어요.
            자신이 어떤 꽃가루에 반응하는지 알면 대비가 훨씬 쉬워집니다.
          </p>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">🌳 나무 꽃가루</h2>
            <div className="space-y-2">
              <p><strong>시즌:</strong> 3월~5월 (봄)</p>
              <p><strong>주요 원인:</strong> 참나무(떡갈나무, 상수리나무), 자작나무, 오리나무, 소나무, 삼나무</p>
              <p><strong>특징:</strong> 한국에서 가장 흔한 꽃가루 알레르기 원인. 특히 참나무와 자작나무는 교차 반응이 있어 사과, 복숭아 같은 과일에도 알레르기를 일으킬 수 있습니다 (구강 알레르기 증후군).</p>
              <p><strong>증상:</strong> 재채기, 맑은 콧물, 코막힘, 눈 가려움. 심하면 기침과 천식 악화.</p>
              <p><strong>피크 시간:</strong> 오전 5시~10시 (바람이 많은 건조한 날에 농도 최고)</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">🌿 잔디 꽃가루</h2>
            <div className="space-y-2">
              <p><strong>시즌:</strong> 5월~8월 (늦봄~여름)</p>
              <p><strong>주요 원인:</strong> 큰조아재비, 오리새, 호밀풀, 티모시, 버뮤다그래스</p>
              <p><strong>특징:</strong> 잔디밭, 공원, 골프장 근처에서 특히 심합니다. 잔디 깎기 후 24시간 동안 농도가 급상승합니다.</p>
              <p><strong>증상:</strong> 나무 꽃가루와 비슷하지만 피부 접촉 시 두드러기(접촉성 피부염)가 추가로 나타날 수 있습니다.</p>
              <p><strong>피크 시간:</strong> 오후 2시~5시 (낮 기온이 높을 때)</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">🌾 잡초 꽃가루</h2>
            <div className="space-y-2">
              <p><strong>시즌:</strong> 8월~10월 (가을)</p>
              <p><strong>주요 원인:</strong> 쑥, 돼지풀(래그위드), 환삼덩굴, 명아주</p>
              <p><strong>특징:</strong> 돼지풀 한 포기가 하루에 약 10억 개의 꽃가루를 날립니다. 바람을 타고 수백 km까지 이동할 수 있어 도시에서도 안전하지 않습니다.</p>
              <p><strong>증상:</strong> 나무/잔디보다 증상이 강한 편. 눈 충혈, 심한 재채기 발작, 후비루(콧물이 목 뒤로 넘어가는 증상)가 특징적입니다.</p>
              <p><strong>피크 시간:</strong> 이른 아침 (일출 직후)</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">교차 반응 주의</h2>
            <p>
              특정 꽃가루에 알레르기가 있으면 비슷한 단백질 구조를 가진 음식에도 반응할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>자작나무 → 사과, 복숭아, 체리, 당근, 셀러리</li>
              <li>잔디 → 토마토, 감자, 오렌지</li>
              <li>쑥 → 셀러리, 당근, 고수, 회향</li>
              <li>돼지풀 → 바나나, 멜론, 수박, 호박</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">내 알레르기 타입 확인법</h2>
            <p>
              어떤 꽃가루에 반응하는지 정확히 알려면 알레르기 전문의에서 피부반응검사(skin prick test)
              또는 혈액검사(specific IgE)를 받는 것이 좋습니다. 비용은 보통 3만~5만원대이며,
              결과는 당일 확인 가능합니다.
            </p>
            <p className="mt-2">
              간단한 자가 판단법: 증상이 나타나는 시기를 기록하세요.
              3~5월이면 나무, 5~8월이면 잔디, 8~10월이면 잡초일 가능성이 높습니다.
              achoo의 증상 일기 기능으로 매일 기록하면 패턴을 찾을 수 있어요.
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
