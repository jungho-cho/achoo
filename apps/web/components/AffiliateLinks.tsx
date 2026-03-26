// Coupang Partners affiliate links — early revenue before AdSense approval
// Replace TRACKING_CODE with your actual Coupang Partners tracking code after signup:
// https://partners.coupang.com

const TRACKING_CODE = 'achoo2024'; // TODO: replace with real tracking code after signup

interface AffiliateProduct {
  name: string;
  url: string;
  emoji: string;
  desc: string;
}

const PRODUCTS: AffiliateProduct[] = [
  {
    name: 'KF94 마스크',
    emoji: '😷',
    desc: '꽃가루 차단율 94%',
    url: `https://www.coupang.com/np/search?q=KF94+마스크&listSize=10&affiliate=${TRACKING_CODE}`,
  },
  {
    name: '공기청정기',
    emoji: '💨',
    desc: '실내 꽃가루 제거',
    url: `https://www.coupang.com/np/search?q=공기청정기+헤파필터&listSize=10&affiliate=${TRACKING_CODE}`,
  },
  {
    name: '알레르기 안약',
    emoji: '👁️',
    desc: '눈 가려움 완화',
    url: `https://www.coupang.com/np/search?q=알레르기+안약&listSize=10&affiliate=${TRACKING_CODE}`,
  },
  {
    name: '항히스타민제',
    emoji: '💊',
    desc: '알레르기 증상 완화',
    url: `https://www.coupang.com/np/search?q=항히스타민제+알레르기&listSize=10&affiliate=${TRACKING_CODE}`,
  },
];

export function AffiliateLinks() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        알레르기 관련 제품
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {PRODUCTS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">{p.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{p.name}</span>
            <span className="text-xs text-gray-400">{p.desc}</span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-gray-300 mt-2 text-center">
        이 링크는 제휴 링크입니다 (쿠팡 파트너스)
      </p>
    </div>
  );
}
