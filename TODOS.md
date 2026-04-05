# Achoo — TODO

## 완료

- [x] 에어코리아 API 키 발급
- [x] Vercel 배포 (achoo.day)
- [x] Google Analytics 4 연결 (G-G8LST05LHK)
- [x] 쿠팡 파트너스 연동 (AF7101194)
- [x] 네이버 서치어드바이저 등록
- [x] Google Search Console 등록
- [x] SEO: SSR 홈페이지, 사이트맵, canonical, 콘텐츠 페이지
- [x] 다국어 지원 (i18n) — next-intl, ko/de/en/fr, [locale] routing
- [x] EU 미세먼지 — Open-Meteo PM2.5/PM10 통합
- [x] EU 제휴 링크 — Amazon.de
- [x] 지역화 콘텐츠 — 32개 페이지 JSON (독일 Pollenflug, 프랑스 RNSA)
- [x] KMA 전환 — 한국 기상청 꽃가루 API 연동 완료

## 다음 작업

### ~~인터렉티브 알레르기 대처법~~ ✅
- [x] 실시간 꽃가루/미세먼지 데이터와 증상 결합 맞춤 조언
- [x] 꽃가루 주의보 / 미세먼지 주의보 자동 표시
- [x] 증상별 + 심각도별 14개 조언 카드 (i18n 4개 언어)
- [x] 증상 일기 자동 기록 연동

### ~~Upstash Redis~~ ✅
- [x] console.upstash.com Free tier 생성 (evolving-seahorse-75331)
- [x] .env.local에 URL + TOKEN 추가, 연결 테스트 통과
- [x] Vercel 환경변수에 URL + TOKEN 추가

### 광고
- [ ] Google AdSense 신청 (트래픽 확보 후)
- [ ] 승인 후 광고 컴포넌트 활성화

### Flutter 앱 (가을 시즌 목표)
- [ ] Flutter 프로젝트 생성 (`apps/flutter/`)
- [ ] 웹 API 소비: `GET /api/pollen`, `GET /api/dust`
- [ ] 푸시 알림 (FCM)
- [ ] AdMob 연동
- [ ] 앱스토어 / 플레이스토어 등록

### ~~접근성~~ ✅
- [x] 색맹 접근성 — LevelBadge에 ✓/▲/⚠/‼ 아이콘 추가
- [x] 키보드 네비게이션 — skip to content, aria-pressed 토글
- [x] ARIA 라벨 — role/aria-live/aria-label 전체 컴포넌트 적용
