# Achoo — TODO

## 완료

- [x] 에어코리아 API 키 발급
- [x] Vercel 배포 (achoo.day)
- [x] Google Analytics 4 연결 (G-G8LST05LHK)
- [x] 쿠팡 파트너스 연동 (AF7101194)
- [x] 네이버 서치어드바이저 등록
- [x] Google Search Console 등록
- [x] SEO: SSR 홈페이지, 사이트맵, canonical, 콘텐츠 페이지

## 다음 작업

### 다국어 지원 (i18n)
- [ ] 영어 지원 추가 — 글로벌 유저 유입 (독일 등 해외에서도 사용 중)
- [ ] next-intl 또는 next-i18next 도입
- [ ] URL 구조: `/ko/`, `/en/` 또는 브라우저 언어 감지
- [ ] 번역 대상: UI 텍스트, 팁 페이지, 꽃가루 정보 페이지, 지역 페이지

### 인터렉티브 알레르기 대처법
- [ ] 현재: 정적 팁 목록 (모든 유저에게 동일)
- [ ] 개선: 유저가 현재 증상을 선택 → 맞춤 대처법 제공
  - Step 1: "어떤 증상이 있나요?" (재채기, 코막힘, 눈 가려움, 기침 등 체크박스)
  - Step 2: "얼마나 심한가요?" (가벼움/보통/심함)
  - Step 3: 오늘 꽃가루/미세먼지 데이터와 결합 → 맞춤 조언 출력
  - 예: "오늘 나무 꽃가루 높음 + 눈 가려움 → 안약 사용 권장, 외출 시 선글라스"
- [ ] 증상 일기와 연동 — 선택한 증상을 자동 기록

### Upstash Redis
- [ ] console.upstash.com에서 Free tier 생성
- [ ] Vercel 환경변수에 URL + TOKEN 추가

### 광고
- [ ] Google AdSense 신청 (트래픽 확보 후)
- [ ] 승인 후 광고 컴포넌트 활성화

### Flutter 앱 (가을 시즌 목표)
- [ ] Flutter 프로젝트 생성 (`apps/flutter/`)
- [ ] 웹 API 소비: `GET /api/pollen`, `GET /api/dust`
- [ ] 푸시 알림 (FCM)
- [ ] AdMob 연동
- [ ] 앱스토어 / 플레이스토어 등록

### KMA 전환
- [ ] 한국 기상청 생활기상지수 API로 꽃가루 데이터 소스 전환
- [ ] Open-Meteo 대비 정확도 비교

### 접근성
- [ ] 색맹 접근성 (색상 외 아이콘 추가)
- [ ] 키보드 네비게이션
- [ ] ARIA 라벨
