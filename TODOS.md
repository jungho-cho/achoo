# Achoo — 직접 해야 할 일

## API 키 발급

- [ ] **에어코리아 (AirKorea)** — PM2.5/PM10 데이터
  - 공공데이터포털 가입: https://www.data.go.kr
  - 서비스: "에어코리아 대기오염정보 조회 서비스"
  - 발급 후 `.env.local`의 `AIRKOREA_API_KEY=` 에 입력

- [ ] **구글 Maps Geocoding** (선택) — 좌표 → 도시명 변환
  - https://console.cloud.google.com
  - "Geocoding API" 활성화, `.env.local`의 `GOOGLE_MAPS_API_KEY=` 에 입력

## 배포

- [ ] **Vercel 배포**
  - `vercel` CLI 또는 GitHub 연동
  - 환경변수: `AIRKOREA_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

- [ ] **Upstash Redis 생성** (선택, 캐시 성능 향상)
  - https://console.upstash.com
  - Free tier: 10,000 req/day
  - `.env.local`에 URL + TOKEN 입력

## 광고

- [ ] **Google AdSense 신청** — 웹 배너 광고
  - 최소 콘텐츠 + 실제 트래픽 확보 후 신청
  - 승인까지 3~6개월 예상

- [ ] **Google AdMob 앱 등록** — 모바일 앱 광고
  - 앱스토어 등록 후 진행
