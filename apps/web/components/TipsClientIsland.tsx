'use client';

import dynamic from 'next/dynamic';

const TipsPageClient = dynamic(
  () =>
    import('./TipsPageClient').then(
      (mod) => mod.TipsPageClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[2rem] border border-gray-200 bg-white px-5 py-6 shadow-sm">
        <p className="text-sm font-medium text-gray-800">
          알레르기 대처 도구를 불러오는 중...
        </p>
        <p className="mt-2 text-xs leading-6 text-gray-600">
          현재 위치와 오늘 증상에 맞춰 바로 대응할 수 있게 준비하고 있습니다.
        </p>
      </div>
    ),
  },
);

export function TipsClientIsland() {
  return <TipsPageClient />;
}
