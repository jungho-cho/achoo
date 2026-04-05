import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자주 묻는 질문 (FAQ) — Achoo 꽃가루 예보',
  description: 'Achoo 꽃가루 예보 앱에 대한 자주 묻는 질문과 답변. 데이터 출처, 사용법, 정확도 등.',
  alternates: { canonical: '/faq' },
};

const faqs = [
  {
    q: '꽃가루 데이터는 어디서 오나요?',
    a: 'Open-Meteo Air Quality API를 사용합니다. 유럽 CAMS(Copernicus Atmosphere Monitoring Service) 모델 기반 추정치로, 전 세계 데이터를 무료로 제공합니다. 한국 데이터는 유럽 모델 기반이라 실제와 차이가 있을 수 있습니다.',
  },
  {
    q: '미세먼지 데이터는 어디서 오나요?',
    a: '한국 환경부 에어코리아(AirKorea) API를 사용합니다. 전국 500여개 측정소에서 실시간 측정된 공식 데이터입니다. 한국 외 지역에서는 미세먼지 데이터가 표시되지 않습니다.',
  },
  {
    q: '위치 정보는 어떻게 사용되나요?',
    a: '브라우저의 위치 정보 API로 현재 위치를 확인한 뒤, 해당 좌표의 꽃가루/미세먼지 데이터를 가져옵니다. 위치 정보는 서버에 저장되지 않으며, 데이터 요청에만 사용됩니다.',
  },
  {
    q: '위치 권한을 거부하면 어떻게 되나요?',
    a: '서울 기준으로 데이터를 표시합니다. 상단에 "위치 권한이 없어 서울 기준으로 표시합니다" 안내가 나옵니다.',
  },
  {
    q: '증상 일기 데이터는 어디에 저장되나요?',
    a: '브라우저의 localStorage에 저장됩니다. 서버로 전송되지 않으며, 브라우저 데이터를 삭제하면 함께 삭제됩니다. 다른 기기에서는 볼 수 없습니다.',
  },
  {
    q: '해외에서도 사용할 수 있나요?',
    a: '네, 꽃가루 데이터는 전 세계를 지원합니다. 다만 미세먼지 데이터는 한국만 지원되며, 해외에서는 꽃가루 정보만 표시됩니다.',
  },
  {
    q: '데이터가 정확한가요?',
    a: 'Open-Meteo의 꽃가루 데이터는 유럽 CAMS 모델 기반 추정치입니다. 한국의 실제 꽃가루 농도와 차이가 있을 수 있습니다. 참고용으로 사용하시고, 정확한 판단은 기상청 꽃가루 지수를 병행 확인해주세요.',
  },
  {
    q: '앱은 없나요?',
    a: '현재 웹 버전만 제공됩니다. 모바일 브라우저에서도 잘 동작하도록 설계되었습니다. 홈 화면에 추가하면 앱처럼 사용할 수 있습니다.',
  },
  {
    q: '광고가 있나요?',
    a: '쿠팡 파트너스 제휴 링크가 있습니다. 마스크, 공기청정기 등 알레르기 관련 제품을 추천하며, 링크를 통해 구매 시 소정의 수수료를 받습니다.',
  },
  {
    q: '버그를 발견했어요 / 기능 제안이 있어요',
    a: 'achoo는 1인 사이드 프로젝트입니다. 버그 신고나 기능 제안은 감사히 받겠습니다. 피드백은 서비스 개선에 큰 도움이 됩니다.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors">
                {faq.q}
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

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
