import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Achoo — 꽃가루 · 미세먼지 예보',
    short_name: 'Achoo',
    description: '오늘 외출 전, 꽃가루와 미세먼지를 확인하세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#22c55e',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
