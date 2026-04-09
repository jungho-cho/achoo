'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isInKorea } from '../lib/sido';

type AffiliateProductKey = 'mask' | 'purifier' | 'eyeDrops' | 'antihistamine';

interface AffiliateProduct {
  key: AffiliateProductKey;
  url: string;
  desc: string;
}

const AFFILIATE_LABEL_KEYS: Record<AffiliateProductKey, `affiliate.${AffiliateProductKey}`> = {
  mask: 'affiliate.mask',
  purifier: 'affiliate.purifier',
  eyeDrops: 'affiliate.eyeDrops',
  antihistamine: 'affiliate.antihistamine',
};

const COUPANG_PRODUCTS: AffiliateProduct[] = [
  { key: 'mask', desc: '꽃가루 차단율 94%', url: 'https://link.coupang.com/a/ecRkTU' },
  { key: 'purifier', desc: '실내 꽃가루 제거', url: 'https://link.coupang.com/a/ecRmeQ' },
  { key: 'eyeDrops', desc: '눈 가려움 완화', url: 'https://link.coupang.com/a/ecRmzD' },
  { key: 'antihistamine', desc: '알레르기 증상 완화', url: 'https://link.coupang.com/a/ecRmPO' },
];

const AMAZON_EU_PRODUCTS: AffiliateProduct[] = [
  { key: 'mask', desc: 'FFP2 pollen filter', url: 'https://www.amazon.de/dp/B08NVDFM6R?tag=achoo-21' },
  { key: 'purifier', desc: 'HEPA air purifier', url: 'https://www.amazon.de/dp/B07VVK39F7?tag=achoo-21' },
  { key: 'eyeDrops', desc: 'Antihistamine eye drops', url: 'https://www.amazon.de/dp/B00BQNKAHU?tag=achoo-21' },
  { key: 'antihistamine', desc: 'Cetirizine tablets', url: 'https://www.amazon.de/dp/B00F5K3JJ2?tag=achoo-21' },
];

type Region = 'kr' | 'eu' | null;

function useUserRegion(): Region {
  const [region, setRegion] = useState<Region>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setRegion(isInKorea(latitude, longitude) ? 'kr' : 'eu');
      },
      () => {
        // Geolocation denied — detect from html lang
        const lang = document.documentElement.lang;
        setRegion(lang === 'ko' ? 'kr' : 'eu');
      },
      { timeout: 15000, maximumAge: 300000, enableHighAccuracy: false },
    );
  }, []);

  return region;
}

export function AffiliateLinks() {
  const t = useTranslations('ui');
  const region = useUserRegion();

  if (region === null) return null;

  const products = region === 'kr' ? COUPANG_PRODUCTS : AMAZON_EU_PRODUCTS;

  return (
    <div className="ach-panel px-4 py-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-700">
        {t('affiliate.sectionTitle')}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {products.map((p) => (
          <a
            key={p.key}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`${t(AFFILIATE_LABEL_KEYS[p.key])} - ${p.desc}`}
            className="flex flex-col gap-1 rounded-2xl border border-gray-300 bg-gray-50 p-3 transition hover:bg-white"
          >
            <span className="text-sm font-semibold text-gray-900">{t(AFFILIATE_LABEL_KEYS[p.key])}</span>
            <span className="text-xs font-medium leading-5 text-gray-700">{p.desc}</span>
          </a>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-gray-500">
        {t('affiliate.disclaimer')}
      </p>
    </div>
  );
}
