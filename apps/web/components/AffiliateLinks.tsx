'use client';

// Coupang Partners affiliate links — shown only to users in Korea
// Amazon links can be added later for other regions (e.g. Germany)

import { useEffect, useState } from 'react';
import { isInKorea } from '../lib/sido';

interface AffiliateProduct {
  name: string;
  url: string;
  emoji: string;
  desc: string;
}

const COUPANG_PRODUCTS: AffiliateProduct[] = [
  {
    name: 'KF94 마스크',
    emoji: '😷',
    desc: '꽃가루 차단율 94%',
    url: 'https://link.coupang.com/a/ecRkTU',
  },
  {
    name: '공기청정기',
    emoji: '💨',
    desc: '실내 꽃가루 제거',
    url: 'https://link.coupang.com/a/ecRmeQ',
  },
  {
    name: '알레르기 안약',
    emoji: '👁️',
    desc: '눈 가려움 완화',
    url: 'https://link.coupang.com/a/ecRmzD',
  },
  {
    name: '항히스타민제',
    emoji: '💊',
    desc: '알레르기 증상 완화',
    url: 'https://link.coupang.com/a/ecRmPO',
  },
];

// TODO: Add Amazon DE products when affiliate account is approved
// const AMAZON_DE_PRODUCTS: AffiliateProduct[] = [];

type Region = 'kr' | 'other' | null;

function useUserRegion(): Region {
  const [region, setRegion] = useState<Region>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setRegion(isInKorea(latitude, longitude) ? 'kr' : 'other');
      },
      () => {
        // Geolocation denied — Korean site이므로 쿠팡을 기본으로 표시
        setRegion('kr');
      },
      { timeout: 5000 }
    );
  }, []);

  return region;
}

export function AffiliateLinks() {
  const region = useUserRegion();

  // Still detecting location or not in a supported region
  if (region === null || region === 'other') return null;

  // Korea → show Coupang
  if (region === 'kr') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          알레르기 관련 제품
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COUPANG_PRODUCTS.map((p) => (
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

  return null;
}
