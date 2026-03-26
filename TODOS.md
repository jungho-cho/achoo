# Achoo — 직접 해야 할 일

## API 키 발급

- [ ] **에어코리아 (AirKorea)** — PM2.5/PM10 데이터
  - 공공데이터포털 가입: https://www.data.go.kr
  - 서비스: "에어코리아 대기오염정보 조회 서비스"
  - 발급 후 `.env.local`의 `AIRKOREA_API_KEY=` 에 입력

## 배포

- [ ] **Vercel 배포**
  - `vercel` CLI 또는 GitHub 연동
  - 환경변수: `AIRKOREA_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

- [ ] **Upstash Redis 생성** (선택, 캐시 성능 향상)
  - https://console.upstash.com
  - Free tier: 10,000 req/day
  - `.env.local`에 URL + TOKEN 입력

## 분석

- [ ] **Google Analytics 4 연결**
  - GA4 속성 생성 → 측정 ID (`G-XXXXXXXXXX`) 발급
  - `apps/web/app/layout.tsx`에 `<Script>` 태그로 추가
  - 또는 `@next/third-parties/google` 패키지 사용 (`pnpm add @next/third-parties`)

## 광고

- [ ] **Google AdSense 신청** — 웹 배너 광고
  - 실제 트래픽 확보 후 신청 (승인까지 3~6개월)
  - 승인 후 `apps/web/components/AdBanner.tsx`의 placeholder를 실제 AdSense 코드로 교체

- [ ] **Google AdMob 등록** — Flutter 앱 광고
  - 앱스토어 등록 후 AdMob 앱 ID 발급
  - Flutter 앱에 `google_mobile_ads` 패키지 연동

## Flutter 앱

- [ ] **Flutter 프로젝트 생성** (`apps/flutter/`)
  - Flutter 앱은 웹 API를 그대로 소비: `GET /api/pollen`, `GET /api/dust`
  - Vercel 배포 URL을 base URL로 설정
  - `http` 또는 `dio` 패키지로 API 호출
  - 웹과 동일한 색상 코드 시스템 구현 (🟢🟡🟠🔴)

- [ ] **앱스토어 / 플레이스토어 등록**
