# Achoo — 앱인토스 미니앱 개발 가이드

## 개요

achoo.day(꽃가루/미세먼지 예보 웹앱)를 토스 앱인토스 미니앱으로 출시하기 위한 가이드.
토스 2,000만+ 유저에게 직접 노출되는 채널.

> CEO Plan: `~/.gstack/projects/jungho-cho-achoo/ceo-plans/2026-03-28-toss-mini-app.md`

## 아키텍처

**React Native 기반** (`@granite-js/react-native` + `@toss/tds-react-native`)

```
┌─────────────────────────────────┐
│  토스 앱                         │
│  ┌───────────────────────────┐  │
│  │ Achoo 미니앱 (RN)          │  │
│  │ @granite-js/react-native   │  │
│  │ @toss/tds-react-native     │  │
│  │                            │  │
│  │ ┌──────┐  ┌─────────────┐ │  │
│  │ │UI    │  │비즈니스 로직  │ │  │
│  │ │(TDS) │  │@repo/shared  │ │  │
│  │ └──┬───┘  └──────┬──────┘ │  │
│  │    │              │        │  │
│  │    ▼              ▼        │  │
│  │  Storage     직접 API 호출  │  │
│  │  (SDK)       Open-Meteo    │  │
│  │              AirKorea      │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

- **API**: Open-Meteo(꽃가루) + AirKorea(미세먼지) 직접 호출 (achoo.day 경유 안 함)
- **UI**: TDS React Native 컴포넌트로 구현
- **프레임워크**: `@granite-js/react-native` (Granite)
- **저장소**: `@apps-in-toss/framework`의 `Storage` API (**AsyncStorage 사용 불가 — 화이트아웃 발생**)
- **에러 트래킹**: `@sentry/react-native`

## 스코프

### v1.0 — Launch (검수 통과 목표)

- RN + TDS 기반 전체 UI
- 알레르기 타입 온보딩 (첫 실행 시 민감 꽃가루 선택)
- 오늘의 외출 점수 (꽃가루+미세먼지 종합)
- 홈: 히어로카드(외출 점수), 종류별 현황, 7일 예보, 증상 일기
- 증상 체커: 3단계 플로우 (증상 선택 → 심각도 → 맞춤 조언)
- 에러 핸들링: 모든 API 에러 시 캐시 fallback + 사용자 안내
- Sentry 에러 트래킹
- 개인정보 처리방침 페이지

### v1.1+ — Post-Launch

- 토스 푸시 알림 (mTLS + 서버-to-서버 API 필요)
- 토스 1원 프로모션 (사업 협의)
- 증상 일기 스트릭 + 시즌 리포트 (서버사이드 저장소 필요)
- 지역 비교 카드
- 토스 광고 연동 (사업자 등록 필수)

## 사전 준비 (본인이 직접 해야 할 것)

### 1. 앱인토스 콘솔 가입 + 워크스페이스 생성
- https://console-apps-in-toss.toss.im 접속
- 토스 계정으로 로그인
- 워크스페이스 생성 (회사/개인)

### 2. 사업자 등록 (**수익화 필수**)
- 사업자 없어도 미니앱 출시 가능
- 단, 수익화(인앱 광고, 인앱 결제) + 토스 로그인은 사업자 **필수**
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
npx @granite-js/react-native init achoo
```

프롬프트에서:
- appName: `achoo` (콘솔에서 만든 앱 이름과 동일해야 함)

### 2. TDS React Native 설치

```bash
pnpm install @toss/tds-react-native
```

- **TDS 사용은 필수** — 비게임 미니앱 검수 조건
- TDS RN 문서: https://tossmini-docs.toss.im/tds-react-native/

### 3. 추가 의존성 설치

```bash
pnpm install @sentry/react-native
pnpm install @granite-js/plugin-env  # 환경 변수 (AirKorea API key)
```

### 4. granite.config.ts

```typescript
import { defineConfig } from '@granite-js/react-native/config';
import { pluginEnv } from '@granite-js/plugin-env';

export default defineConfig({
  appName: 'achoo',
  brand: {
    displayName: 'Achoo - 꽃가루 예보',
    primaryColor: '#22c55e',
    icon: '', // 콘솔에서 업로드한 아이콘 URL
  },
  plugins: [
    pluginEnv({
      AIRKOREA_API_KEY: process.env.AIRKOREA_API_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
    }),
  ],
  permissions: ['location'], // 위치 권한 필요
});
```

### 5. 모노레포 패키지 연결

기존 패키지를 `apps/toss/package.json`에 추가:

```json
{
  "dependencies": {
    "@repo/shared-types": "workspace:*",
    "@repo/normalizer": "workspace:*",
    "@repo/api-client": "workspace:*"
  }
}
```

## 개발 가이드

### API 호출 (직접)

achoo.day를 경유하지 않고 직접 호출:

```typescript
import { fetchPollen } from '@repo/api-client/pollen';
import { fetchDust } from '@repo/api-client/dust';

// 꽃가루 데이터 (Open-Meteo — API key 불필요)
const pollen = await fetchPollen(lat, lng);

// 미세먼지 데이터 (AirKorea — env에서 API key 주입)
const dust = await fetchDust(lat, lng, import.meta.env.AIRKOREA_API_KEY);
```

> **주의:** `@repo/api-client`가 현재 서버사이드 전용이면 클라이언트용으로 분리 필요.

### 위치 정보

앱인토스 SDK의 위치 API 사용. 브라우저 Geolocation은 RN에서 사용 불가.
`granite.config.ts`의 `permissions: ['location']` 필수.

```typescript
// 위치 권한 거부 시 서울 기본값 fallback
const DEFAULT_LOCATION = { lat: 37.5665, lng: 126.978 };
```

### 로컬 저장소

**AsyncStorage 사용 불가** — 앱인토스에서 화이트아웃 발생.

`@apps-in-toss/framework`의 `Storage` API 사용:

```typescript
import { Storage } from '@apps-in-toss/framework';

// 증상 일기 저장
await Storage.setItem('achoo_diary', JSON.stringify(diaryData));

// 알레르기 타입 저장
await Storage.setItem('achoo_allergy_type', JSON.stringify(['tree', 'weed']));
```

### UI 구현 (TDS React Native 기반)

| achoo.day (Tailwind) | 앱인토스 (TDS RN) |
|---------------------|-----------------|
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

1. **온보딩** (첫 실행) — "어떤 꽃가루에 민감하세요?" (나무/잔디/잡초 선택)
2. **홈** — 외출 점수(히어로), 종류별 분류(개인화 필터), 7일 예보, 증상 일기
3. **증상 체커** — 3단계 플로우 (증상 선택 → 심각도 → 맞춤 조언)

### 에러 핸들링

모든 API 호출에 try-catch + 캐시 fallback:

```typescript
try {
  const data = await fetchPollen(lat, lng);
  await Storage.setItem('achoo_pollen_cache', JSON.stringify(data));
  return data;
} catch (error) {
  Sentry.captureException(error);
  const cached = await Storage.getItem('achoo_pollen_cache');
  if (cached) return { ...JSON.parse(cached), isStale: true };
  throw new Error('데이터를 불러올 수 없습니다');
}
```

### 외출 점수 계산

```typescript
// 꽃가루 + 미세먼지 종합 점수 (0-100, 높을수록 좋음)
function calculateOutingScore(pollen: PollenData, dust?: DustData): number {
  const pollenScore = mapLevelToScore(pollen.current.overallLevel); // 0-50
  const dustScore = dust ? mapDustToScore(dust.current.pm10) : 25;  // 0-50
  return pollenScore + dustScore;
}
```

## 테스트

### 로컬 개발

```bash
pnpm run dev  # Metro 개발 서버 실행
```

### 디버깅

- Metro 서버에서 `j` 키 → React Native Debugger (Chrome DevTools)
- Android: `chrome://inspect/#devices` → WebView inspect
- iOS: Safari → 개발자 메뉴 → Web Inspector

### 샌드박스 앱에서 테스트

1. 샌드박스 앱 실행
2. `intoss://achoo` 입력
3. "스키마 열기" 클릭

### 실기기 테스트 (Android)

```bash
adb reverse tcp:8081 tcp:8081
```

## 빌드 + 출시

### 빌드

```bash
pnpm run build  # granite build 실행 → .ait 파일 생성
```

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
- [ ] Sentry 에러 트래킹 연동

## 수익화 (사업자 등록 후)

### 인앱 광고
- 앱인토스 자체 광고 시스템 사용
- RN에서는 `InlineAd` 컴포넌트 사용
- 테스트 배너 ID: `ait-ad-test-banner-id`

### 프로모션
- 토스 포인트 기반 프로모션 (1원 프로모션 포함)
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
| RN 튜토리얼 | https://developers-apps-in-toss.toss.im/tutorials/react-native |
| SDK 레퍼런스 | https://developers-apps-in-toss.toss.im/bedrock/reference/framework |
| TDS RN | https://tossmini-docs.toss.im/tds-react-native/ |
| 비게임 검수 | https://developers-apps-in-toss.toss.im/checklist/app-nongame |
| 미니앱 출시 | https://developers-apps-in-toss.toss.im/development/deploy |
| 성장 가이드 | https://developers-apps-in-toss.toss.im/growth/intro |
| AI 개발 가이드 | https://developers-apps-in-toss.toss.im/development/llms |
| 디버깅 | https://developers-apps-in-toss.toss.im/learn-more/debugging |
| 환경 변수 (RN) | https://developers-apps-in-toss.toss.im/bedrock/reference/framework/환경 |

## 타임라인

1. **지금**: 콘솔 가입 + 워크스페이스 + 앱 등록 + 사업자 등록
2. **준비 완료 후**: RN 프로젝트 셋업 + TDS RN 기반 UI 개발
3. **개발 완료**: 샌드박스 테스트 + 검수 요청
4. **검수 통과**: 출시 + 마케팅 도구 활용
5. **출시 후**: 푸시 알림, 프로모션, 스트릭, 지역 비교 추가
