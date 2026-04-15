import { ImageResponse } from 'next/og';

export const alt = 'Achoo — 꽃가루 · 미세먼지 예보';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 96 }}>🤧</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginTop: 16,
            letterSpacing: '-2px',
          }}
        >
          Achoo
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 16,
          }}
        >
          꽃가루 · 미세먼지 예보
        </div>
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 24,
          }}
        >
          오늘 외출 전, 꽃가루 지수를 확인하세요
        </div>
      </div>
    ),
    size,
  );
}
