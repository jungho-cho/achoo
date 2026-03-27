import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '지역별 꽃가루 예보 — 전국 17개 시도',
  description: '서울, 부산, 대구, 인천 등 전국 17개 시도의 꽃가루 예보를 확인하세요. 실시간 꽃가루 지수와 미세먼지 정보.',
  alternates: { canonical: '/regions' },
};

const REGIONS = [
  { name: '서울', lat: 37.5665, lng: 126.978 },
  { name: '부산', lat: 35.1796, lng: 129.0756 },
  { name: '대구', lat: 35.8714, lng: 128.6014 },
  { name: '인천', lat: 37.4563, lng: 126.7052 },
  { name: '광주', lat: 35.1595, lng: 126.8526 },
  { name: '대전', lat: 36.3504, lng: 127.3845 },
  { name: '울산', lat: 35.5384, lng: 129.3114 },
  { name: '세종', lat: 36.4800, lng: 127.0000 },
  { name: '경기', lat: 37.4138, lng: 127.5183 },
  { name: '강원', lat: 37.8228, lng: 128.1555 },
  { name: '충북', lat: 36.6357, lng: 127.4914 },
  { name: '충남', lat: 36.5184, lng: 126.8000 },
  { name: '전북', lat: 35.7175, lng: 127.1530 },
  { name: '전남', lat: 34.8679, lng: 126.9910 },
  { name: '경북', lat: 36.4919, lng: 128.8889 },
  { name: '경남', lat: 35.4606, lng: 128.2132 },
  { name: '제주', lat: 33.4996, lng: 126.5312 },
];

export default function RegionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 홈</a>
          <h1 className="text-2xl font-bold text-gray-900">지역별 꽃가루 예보</h1>
        </div>

        <p className="text-sm text-gray-500">
          전국 17개 시도의 꽃가루 예보를 확인하세요. 위치 권한을 허용하면 자동으로 내 지역이 표시됩니다.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {REGIONS.map((region) => (
            <a
              key={region.name}
              href={`/?lat=${region.lat}&lng=${region.lng}`}
              className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm">📍</span>
              <span className="text-sm font-medium text-gray-700">{region.name}</span>
            </a>
          ))}
        </div>

        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-900">지역별 꽃가루 특성</h2>

          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">수도권 (서울, 경기, 인천)</h3>
              <p>3월 중순부터 오리나무, 자작나무 꽃가루가 시작됩니다. 4월에 참나무, 소나무가 폭발적으로 증가하며, 5월까지 이어집니다. 도심 녹지와 교외 산림 모두 영향을 줍니다.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">영남권 (부산, 대구, 울산, 경남, 경북)</h3>
              <p>수도권보다 1~2주 일찍 꽃가루 시즌이 시작됩니다. 특히 대구는 분지 지형으로 꽃가루가 정체되기 쉬워 농도가 높게 유지됩니다.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">호남권 (광주, 전남, 전북)</h3>
              <p>온난한 기후로 꽃가루 시즌이 길게 이어집니다. 삼나무 꽃가루는 제주와 함께 2월부터 시작될 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">제주</h3>
              <p>한국에서 가장 먼저 꽃가루 시즌이 시작됩니다. 2월부터 삼나무 꽃가루가 극심하며, 제주 특유의 바람이 꽃가루 확산에 영향을 줍니다.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">강원권</h3>
              <p>산림이 많아 나무 꽃가루 농도가 높습니다. 수도권보다 1~2주 늦게 시즌이 시작되지만, 소나무 꽃가루는 매우 높게 나타납니다.</p>
            </div>
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <a href="/" className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            내 위치 꽃가루 확인
          </a>
          <a href="/pollen-info" className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            꽃가루 알레르기란?
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">Achoo — 꽃가루 · 미세먼지 예보</p>
      </div>
    </div>
  );
}
