# Achoo — 앱인토스 미니앱 개발 가이드

## 개요

achoo.day(꽃가루/미세먼지 예보 웹앱)를 토스 앱인토스 미니앱으로 출시하기 위한 가이드.
토스 2,000만+ 유저에게 직접 노출되는 채널.

## 아키텍처

```
┌─────────────────────────┐
│  토스 앱                  │
│  ┌─────────────────────┐ │
│  │ Achoo 미니앱 (WebView)│ │
│  │ TDS 컴포넌트 기반 UI  │ │
│  │ @apps-in-toss/web    │ │
│  └──────────┬──────────┘ │
└─────────────┼────────────┘
              │ fetch
              ▼
┌──────────────────────────┐
│  achoo.day (Vercel)       │
│  /api/pollen              │
│  /api/dust                │
│  (기존 API 그대로 사용)    │
└──────────────────────────┘
```

- **API**: achoo.day의 기존 Next.js API routes 재사용
- **UI**: TDS (Toss Design System) 컴포넌트로 새로 구현 (기존 Tailwind UI 사용 불가)
- **프레임워크**: `@apps-in-toss/web-framework` + Vite

## 사전 준비 (본인이 직접 해야 할 것)

### 1. 앱인토스 콘솔 가입 + 워크스페이스 생성
- https://console-apps-in-toss.toss.im 접속
- 토스 계정으로 로그인
- 워크스페이스 생성 (회사/개인)

### 2. 사업자 등록 (선택)
- 사업자 없어도 미니앱 출시 가능
- 단, 수익화(인앱 광고, 인앱 결제) + 토스 로그인은 사업자 필수
- 꽃가루 앱은 광고 수익이 목표 → **사업자 등록 권장**
- 콘솔 → 워크스페이스 → 파트너 정보 → 사업자 정보 등록

### 3. 앱 등록
- 콘솔에서 "새 앱 만들기"
- 앱 이름: `achoo` (이 이름이 `intoss://achoo` 딥링크가 됨)
- 카테고리: 비게임 > 라이프 (또는 건강)
- 아이콘, 스크린샷 등 에셋 업로드

### 4. 샌드박스 앱 설치
- iOS: TestFlight로 설치
- Android: APK 다운로드
- 개발/테스트 시 샌드박스 앱에서만 미니앱 실행 가능

## 프로젝트 셋업

### 1. 새 프로젝트 생성

achoo 모노레포의 `apps/toss/` 디렉토리에 생성:

```bash
cd apps
mkdir toss && cd toss
pnpm create vite@latest . --template react-ts
pnpm install
```

### 2. 앱인토스 SDK 설치

```bash
pnpm install @apps-in-toss/web-framework
```

### 3. 초기화

```bash
pnpm ait init
```

프롬프트에서:
- `web-framework` 선택
- appName: `achoo` (콘솔에서 만든 앱 이름과 동일해야 함)
- dev 명령어: `vite`
- build 명령어: `vite build`
- 포트: `5173`

### 4. granite.config.ts 확인

```typescript
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'achoo',
  brand: {
    displayName: 'Achoo - 꽃가루 예보',
    primaryColor: '#22c55e', // achoo 브랜드 그린
    icon: '', // 콘솔에서 업로드한 아이콘 URL
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
});
```

### 5. TDS (Toss Design System) 설치

```bash
pnpm install @toss/tds-mobile
```

- **TDS 사용은 필수** — 비게임 미니앱 검수 조건
- 로컬 브라우저에서는 TDS가 동작하지 않음 → 샌드박스 앱에서 테스트
- TDS 문서: https://tossmini-docs.toss.im/tds-mobile/

## 개발 가이드

### API 호출

기존 achoo.day API를 그대로 호출:

```typescript
const API_BASE = 'https://achoo.day';

// 꽃가루 데이터
const pollen = await fetch(`${API_BASE}/api/pollen?lat=${lat}&lng=${lng}`).then(r => r.json());

// 미세먼지 데이터 (한국만)
const dust = await fetch(`${API_BASE}/api/dust?lat=${lat}&lng=${lng}`).then(r => r.json());
```

### 위치 정보

앱인토스 SDK의 위치 API 또는 브라우저 Geolocation API 사용.
권한 필요 시 `granite.config.ts`의 `permissions`에 추가.

### UI 구현 (TDS 기반)

기존 achoo.day의 컴포넌트 구조를 참고하되 TDS 컴포넌트로 대체:

| achoo.day (Tailwind) | 앱인토스 (TDS) |
|---------------------|---------------|
| HeroCard (gradient div) | TDS Card + 커스텀 스타일 |
| SpeciesRow (flex div) | TDS ListItem |
| ForecastBar (grid) | TDS 커스텀 컴포넌트 |
| SymptomDiary (buttons) | TDS Chip / SegmentedControl |
| SymptomChecker (multi-step) | TDS BottomSheet / Step flow |
| LevelBadge (span) | TDS Badge |

### 색상 시스템

DESIGN.md 참조. 레벨별 색상:
- low: green (#22c55e)
- moderate: yellow (#eab308)
- high: orange (#f97316)
- very-high: red (#ef4444)

### 핵심 화면

1. **홈** — 히어로카드(숫자+레벨), 종류별 분류, 7일 예보, 증상 일기
2. **증상 체커** — 3단계 플로우 (증상 선택 → 심각도 → 맞춤 조언)
3. **꽃가루 정보** — 정적 콘텐츠

### 로컬 저장소

증상 일기 데이터는 `localStorage`에 저장 (achoo.day와 동일한 키 `achoo_diary` 사용).
앱인토스 WebView에서 localStorage 사용 가능.

## 테스트

### 로컬 개발

```bash
pnpm run dev  # granite dev 실행됨
```

### 샌드박스 앱에서 테스트

1. 샌드박스 앱 실행
2. `intoss://achoo` 입력
3. "스키마 열기" 클릭

### 실기기 테스트 (iOS)

1. Mac과 같은 Wi-Fi
2. 샌드박스 앱에서 로컬 서버 IP 입력

### 실기기 테스트 (Android)

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173
```

## 빌드 + 출시

### 빌드

```bash
pnpm run build  # granite build 실행 → .ait 파일 생성
```

- 빌드 결과물: `dist/` 폴더
- 번들 크기: 압축 해제 기준 **100MB 이하**

### 출시 절차

1. 콘솔에서 `.ait` 파일 업로드
2. 검토 요청
3. 토스 내부 검수 (영업일 기준 수일)
4. 승인 후 출시

## 검수 체크리스트 (비게임)

출시 전 반드시 확인:
- https://developers-apps-in-toss.toss.im/checklist/app-nongame.md

핵심 항목:
- [ ] TDS 컴포넌트 사용 (필수)
- [ ] iframe 미사용 (YouTube 예외)
- [ ] 앱 번들 100MB 이하
- [ ] SDK 2.x 사용
- [ ] 개인정보 처리방침 페이지
- [ ] 에러 핸들링 (네트워크 오류 시 안내 화면)
- [ ] 로딩 상태 표시
- [ ] 뒤로가기 동작 정상

## 수익화

### 인앱 광고 (사업자 필수)
- 앱인토스 자체 광고 시스템 사용
- AdMob/AdSense가 아닌 토스 광고 네트워크
- 배너 광고, 네이티브 광고 지원

### 프로모션
- 토스 포인트 기반 프로모션 가능
- 유저 유입 + 리텐션 도구 제공

## 마케팅 (출시 후)

앱인토스 콘솔에서 제공하는 마케팅 도구:
- **세그먼트/푸시**: 타겟 유저에게 알림 (꽃가루 시즌에 효과적)
- **프로모션**: 토스 포인트로 유저 유입
- **성장 가이드**: https://developers-apps-in-toss.toss.im/growth/intro.md

## 참고 문서

| 문서 | URL |
|------|-----|
| 시작하기 | https://developers-apps-in-toss.toss.im/prepare/console-workspace |
| WebView 개발 | https://developers-apps-in-toss.toss.im/tutorials/webview |
| SDK 레퍼런스 | https://developers-apps-in-toss.toss.im/bedrock/reference/framework |
| TDS Web | https://tossmini-docs.toss.im/tds-mobile/ |
| 비게임 검수 | https://developers-apps-in-toss.toss.im/checklist/app-nongame |
| 미니앱 출시 | https://developers-apps-in-toss.toss.im/development/deploy |
| 성장 가이드 | https://developers-apps-in-toss.toss.im/growth/intro |
| AI 개발 가이드 | https://developers-apps-in-toss.toss.im/development/llms |

## 타임라인

1. **지금**: 콘솔 가입 + 워크스페이스 + 앱 등록 + 사업자 등록
2. **준비 완료 후**: 프로젝트 셋업 + TDS 기반 UI 개발
3. **개발 완료**: 샌드박스 테스트 + 검수 요청
4. **검수 통과**: 출시 + 마케팅 도구 활용
