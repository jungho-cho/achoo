import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 — Achoo',
  description: 'Achoo 꽃가루 예보 서비스의 개인정보처리방침.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">개인정보처리방침</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed text-sm">

          <p>
            Achoo(이하 &quot;서비스&quot;)는 사용자의 개인정보를 소중히 여기며,
            개인정보보호법에 따라 다음과 같이 개인정보처리방침을 수립하여 공개합니다.
          </p>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. 수집하는 개인정보</h2>
            <p>서비스는 다음과 같은 정보를 처리합니다:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>위치 정보:</strong> 브라우저 Geolocation API를 통해 현재 위치(위도, 경도)를 수집합니다. 위치 정보는 서버에 저장되지 않으며, 실시간 데이터 요청에만 사용됩니다.</li>
              <li><strong>증상 일기:</strong> 사용자가 직접 입력한 증상 데이터를 브라우저 localStorage에 저장합니다. 서버로 전송되지 않습니다.</li>
              <li><strong>방문 통계:</strong> Google Analytics 4를 통해 익명의 방문 통계(페이지뷰, 세션 등)를 수집합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>위치 기반 꽃가루/미세먼지 예보 정보 제공</li>
              <li>서비스 이용 통계 분석 및 서비스 개선</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. 개인정보의 보유 및 이용 기간</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>위치 정보:</strong> 수집 즉시 사용 후 파기. 서버에 저장하지 않습니다.</li>
              <li><strong>증상 일기:</strong> 사용자 브라우저에만 저장. 브라우저 데이터 삭제 시 삭제됩니다.</li>
              <li><strong>방문 통계:</strong> Google Analytics 정책에 따릅니다 (26개월).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. 개인정보의 제3자 제공</h2>
            <p>서비스는 사용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. 쿠키 및 추적 기술</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Google Analytics 4:</strong> 익명 방문 통계 수집. 브라우저 설정에서 쿠키를 차단하면 수집이 중단됩니다.</li>
              <li><strong>쿠팡 파트너스:</strong> 제휴 링크를 통한 제품 구매 추적을 위해 쿠팡의 쿠키가 사용될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. 사용자의 권리</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>위치 권한은 브라우저 설정에서 언제든 철회할 수 있습니다.</li>
              <li>증상 일기 데이터는 브라우저의 사이트 데이터 삭제를 통해 삭제할 수 있습니다.</li>
              <li>Google Analytics 수집은 브라우저 쿠키 설정 또는 Google Analytics Opt-out 확장 프로그램으로 거부할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. 데이터 출처</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>꽃가루 데이터: Open-Meteo Air Quality API (CAMS 유럽 모델 기반 추정치)</li>
              <li>미세먼지 데이터: 한국 환경부 에어코리아(AirKorea)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. 개인정보처리방침의 변경</h2>
            <p>
              이 개인정보처리방침은 2026년 3월 29일부터 적용됩니다.
              변경 시 이 페이지에 공지합니다.
            </p>
          </section>

        </article>

        <div className="flex gap-3 pt-4">
          <a href="/" className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            홈으로 돌아가기
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Achoo — 꽃가루 · 미세먼지 예보</p>
      </div>
    </div>
  );
}
