# Achoo Flutter App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Flutter mobile app for Achoo with a native weather-utility UI, app-ready forecast API, Today/Journal/Guide/Settings tabs, onboarding, permissions, and status states.

**Architecture:** Add a small app-ready JSON contract on the web backend, then build `apps/mobile` as a Flutter client that consumes that contract. The Flutter app owns UI state, local symptom records, onboarding/settings persistence, and static Korean guide content; `achoo.day` owns pollen/dust provider integration and recommendation payload shaping.

**Tech Stack:** Next.js route handlers, `@repo/normalizer`, `@repo/shared-types`, Flutter Material 3, `http`, `shared_preferences`, `geolocator`, `permission_handler`, `flutter_test`.

---

## File Structure

Backend contract:

- Modify `packages/shared-types/src/index.ts`: add app API response types.
- Create `packages/normalizer/src/app-today.ts`: build app-ready Today payload from pollen, dust, recommendation, and display strings.
- Create `packages/normalizer/src/__tests__/app-today.test.ts`: lock API payload behavior.
- Modify `packages/normalizer/src/index.ts`: export the app payload builder.
- Create `apps/web/app/api/app/today/route.ts`: expose `GET /api/app/today?lat=...&lng=...&locationDenied=false`.

Flutter app:

- Create `apps/mobile/`: Flutter project root.
- Modify `apps/mobile/pubspec.yaml`: dependencies, assets, app metadata.
- Modify `apps/mobile/analysis_options.yaml`: lint rules.
- Modify `apps/mobile/lib/main.dart`: app entrypoint.
- Create `apps/mobile/lib/app/achoo_app.dart`: `MaterialApp`.
- Create `apps/mobile/lib/app/theme.dart`: colors, text styles, shapes.
- Create `apps/mobile/lib/app/app_shell.dart`: bottom navigation shell.
- Create `apps/mobile/lib/core/status/status_widgets.dart`: reusable banners, blocking states, info cards.
- Create `apps/mobile/lib/core/storage/local_store.dart`: shared preferences wrapper.
- Create `apps/mobile/lib/features/today/today_models.dart`: app API models.
- Create `apps/mobile/lib/features/today/today_api.dart`: HTTP client.
- Create `apps/mobile/lib/features/today/today_controller.dart`: Today screen state.
- Create `apps/mobile/lib/features/today/today_screen.dart`: selected Decision First UI.
- Create `apps/mobile/lib/features/today/widgets/daily_decision_card.dart`: top recommendation card.
- Create `apps/mobile/lib/features/today/widgets/pollen_dust_summary.dart`: metric cards.
- Create `apps/mobile/lib/features/today/widgets/species_reading_list.dart`: species rows.
- Create `apps/mobile/lib/features/today/widgets/forecast_strip.dart`: seven-day forecast.
- Create `apps/mobile/lib/features/journal/journal_models.dart`: severity, symptom, entry models.
- Create `apps/mobile/lib/features/journal/journal_store.dart`: local diary persistence.
- Create `apps/mobile/lib/features/journal/journal_screen.dart`: quick check-in screen.
- Create `apps/mobile/lib/features/journal/symptom_checker_screen.dart`: detailed checker.
- Create `apps/mobile/lib/features/guide/guide_content.dart`: Korean guide categories and sections.
- Create `apps/mobile/lib/features/guide/guide_hub_screen.dart`: category tile list.
- Create `apps/mobile/lib/features/guide/guide_detail_screen.dart`: native article template and variants.
- Create `apps/mobile/lib/features/settings/settings_screen.dart`: list settings.
- Create `apps/mobile/lib/features/onboarding/onboarding_screen.dart`: pollen sensitivity and location setup.
- Create tests under `apps/mobile/test/` matching the feature folders.

## Task 1: Add App Today Payload Builder

**Files:**
- Modify: `packages/shared-types/src/index.ts`
- Create: `packages/normalizer/src/app-today.ts`
- Create: `packages/normalizer/src/__tests__/app-today.test.ts`
- Modify: `packages/normalizer/src/index.ts`

- [ ] **Step 1: Write failing tests for the app payload**

Create `packages/normalizer/src/__tests__/app-today.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { DustResponse, PollenResponse } from "@repo/shared-types";
import { buildAppTodayPayload } from "../app-today.js";

function pollenResponse(): PollenResponse {
  return {
    sido: "서울",
    lat: 37.5665,
    lng: 126.978,
    source: "kma",
    cachedAt: "2026-04-28T06:00:00Z",
    current: {
      date: "2026-04-28",
      overallLevel: "high",
      readings: [
        { species: "tree", level: "high", numericValue: 70, range: "61~100" },
        { species: "grass", level: "moderate", numericValue: 35, range: "31~60" },
      ],
    },
    forecast: [
      {
        date: "2026-04-29",
        overallLevel: "moderate",
        readings: [{ species: "tree", level: "moderate", numericValue: 45, range: "31~60" }],
      },
    ],
  };
}

function dustResponse(): DustResponse {
  return {
    sido: "서울",
    lat: 37.5665,
    lng: 126.978,
    source: "airkorea",
    cachedAt: "2026-04-28T06:05:00Z",
    current: { pm10: 60, pm25: 31, level: "moderate" },
  };
}

describe("buildAppTodayPayload", () => {
  it("returns a mobile-ready recommendation payload", () => {
    const payload = buildAppTodayPayload({
      pollen: pollenResponse(),
      dust: dustResponse(),
      locationLabel: "서울",
      locationDenied: false,
      stale: false,
      locale: "ko",
    });

    expect(payload.location.label).toBe("서울");
    expect(payload.recommendation?.action).toBe("take-medicine-early");
    expect(payload.recommendationCopy.headline).toBe("오늘은 약을 미리 챙기세요");
    expect(payload.status.kind).toBe("ready");
    expect(payload.pollen?.current.overallLevel).toBe("high");
    expect(payload.dust?.current.level).toBe("moderate");
  });

  it("uses fallback location and partial status when dust is missing", () => {
    const payload = buildAppTodayPayload({
      pollen: pollenResponse(),
      dust: null,
      locationLabel: "서울",
      locationDenied: true,
      stale: false,
      locale: "ko",
    });

    expect(payload.location.mode).toBe("fallback");
    expect(payload.recommendation?.state.dataMode).toBe("pollen-only");
    expect(payload.status.kind).toBe("partial");
    expect(payload.status.message).toBe("미세먼지 없이 꽃가루 중심으로 판단했어요.");
  });

  it("returns blocking status when no environmental data exists", () => {
    const payload = buildAppTodayPayload({
      pollen: null,
      dust: null,
      locationLabel: "서울",
      locationDenied: true,
      stale: false,
      locale: "ko",
    });

    expect(payload.recommendation).toBeNull();
    expect(payload.status.kind).toBe("blocked");
    expect(payload.status.message).toBe("데이터를 불러올 수 없습니다.");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm --filter @repo/normalizer test -- app-today
```

Expected: FAIL with an import error for `../app-today.js`.

- [ ] **Step 3: Add shared app response types**

Append these types to `packages/shared-types/src/index.ts`:

```ts
// ─── App API ─────────────────────────────────────────────────────────────────

export type AppLocale = "ko" | "en" | "de" | "fr";

export type AppLocationMode = "confirmed" | "fallback";

export interface AppLocationSummary {
  label: string;
  mode: AppLocationMode;
  lat: number | null;
  lng: number | null;
}

export type AppTodayStatusKind = "ready" | "partial" | "stale" | "blocked";

export interface AppTodayStatus {
  kind: AppTodayStatusKind;
  message: string | null;
}

export interface AppRecommendationCopy {
  headline: string;
  summary: string;
  actionLabels: string[];
}

export type AppRecommendationTier = "act-now" | "reduce-exposure" | "okay-today";
export type AppRecommendationAction =
  | "take-medicine-early"
  | "wear-mask"
  | "avoid-lunch-walk"
  | "okay-today";

export interface AppRecommendationEvidence {
  type: "pollen" | "dust";
  level: PollenLevel | DustLevel;
  species?: PollenSpecies;
}

export interface AppRecommendationState {
  stale: boolean;
  dataMode: "full" | "pollen-only" | "dust-only" | "none";
  locationMode: "confirmed" | "fallback";
}

export interface AppDailyRecommendation {
  tier: AppRecommendationTier;
  action: AppRecommendationAction;
  actions: AppRecommendationAction[];
  confidence: "high" | "medium" | "low";
  state: AppRecommendationState;
  evidence: AppRecommendationEvidence[];
  dominantSpecies?: PollenSpecies;
  pollenLevel?: PollenLevel;
  dustLevel?: DustLevel;
}

export interface AppTodayPayload {
  locale: AppLocale;
  location: AppLocationSummary;
  pollen: PollenResponse | null;
  dust: DustResponse | null;
  recommendation: AppDailyRecommendation | null;
  recommendationCopy: AppRecommendationCopy;
  status: AppTodayStatus;
  generatedAt: string;
}
```

- [ ] **Step 4: Create the payload builder**

Create `packages/normalizer/src/app-today.ts`:

```ts
import type {
  AppLocale,
  AppRecommendationCopy,
  AppTodayPayload,
  AppTodayStatus,
  DustResponse,
  PollenResponse,
} from "@repo/shared-types";
import {
  buildDailyRecommendation,
  type RecommendationAction,
} from "./recommendation";

const HEADLINE_KO: Record<RecommendationAction, string> = {
  "take-medicine-early": "오늘은 약을 미리 챙기세요",
  "wear-mask": "오늘은 마스크를 먼저 챙기세요",
  "avoid-lunch-walk": "오늘 점심 산책은 피하는 편이 좋아요",
  "okay-today": "오늘은 평소처럼 지내도 괜찮아요",
};

const SUMMARY_KO: Record<RecommendationAction, string> = {
  "take-medicine-early": "꽃가루 자극이 강할 가능성이 높아요. 외출 전에 미리 대비하는 쪽이 낫습니다.",
  "wear-mask": "미세먼지나 복합 자극이 있어요. 출근 길부터 노출을 줄이는 편이 안전합니다.",
  "avoid-lunch-walk": "야외 노출 시간을 줄이면 오후 컨디션이 훨씬 안정적일 수 있어요.",
  "okay-today": "오늘은 경계 강도가 높지 않아요. 무리만 하지 않으면 평소처럼 지내도 됩니다.",
};

const ACTION_LABEL_KO: Record<RecommendationAction, string> = {
  "take-medicine-early": "외출 전 약 먼저 챙기기",
  "wear-mask": "출근길부터 마스크 쓰기",
  "avoid-lunch-walk": "점심 산책 줄이기",
  "okay-today": "평소 루틴 유지하기",
};

interface BuildAppTodayPayloadInput {
  pollen: PollenResponse | null;
  dust: DustResponse | null;
  locationLabel: string;
  locationDenied: boolean;
  stale: boolean;
  locale: AppLocale;
  generatedAt?: string;
}

function buildStatus(
  pollen: PollenResponse | null,
  dust: DustResponse | null,
  stale: boolean,
): AppTodayStatus {
  if (!pollen && !dust) {
    return { kind: "blocked", message: "데이터를 불러올 수 없습니다." };
  }
  if (stale) {
    return { kind: "stale", message: "최근 캐시를 기준으로 보여드려요." };
  }
  if (pollen && !dust) {
    return { kind: "partial", message: "미세먼지 없이 꽃가루 중심으로 판단했어요." };
  }
  if (!pollen && dust) {
    return { kind: "partial", message: "꽃가루 없이 미세먼지 중심으로 판단했어요." };
  }
  return { kind: "ready", message: null };
}

function buildRecommendationCopy(
  action: RecommendationAction | null,
): AppRecommendationCopy {
  const key = action ?? "okay-today";
  return {
    headline: HEADLINE_KO[key],
    summary: SUMMARY_KO[key],
    actionLabels: [ACTION_LABEL_KO[key]],
  };
}

export function buildAppTodayPayload({
  pollen,
  dust,
  locationLabel,
  locationDenied,
  stale,
  locale,
  generatedAt = new Date().toISOString(),
}: BuildAppTodayPayloadInput): AppTodayPayload {
  const recommendation = buildDailyRecommendation(pollen, dust, {
    stale,
    locationDenied,
  });

  return {
    locale,
    location: {
      label: locationLabel,
      mode: locationDenied ? "fallback" : "confirmed",
      lat: pollen?.lat ?? dust?.lat ?? null,
      lng: pollen?.lng ?? dust?.lng ?? null,
    },
    pollen,
    dust,
    recommendation,
    recommendationCopy: buildRecommendationCopy(recommendation?.action ?? null),
    status: buildStatus(pollen, dust, stale),
    generatedAt,
  };
}
```

- [ ] **Step 5: Export the builder**

Add this line to `packages/normalizer/src/index.ts`:

```ts
export * from "./app-today";
```

- [ ] **Step 6: Run tests and typecheck**

Run:

```bash
pnpm --filter @repo/normalizer test -- app-today
pnpm --filter web check-types
```

Expected: tests PASS and typecheck exits with code 0.

- [ ] **Step 7: Commit**

Run:

```bash
git add packages/shared-types/src/index.ts packages/normalizer/src/app-today.ts packages/normalizer/src/__tests__/app-today.test.ts packages/normalizer/src/index.ts
git commit -m "feat: add app today payload builder"
```

## Task 2: Add App Today API Route

**Files:**
- Create: `apps/web/app/api/app/today/route.ts`

- [ ] **Step 1: Create the route**

Create `apps/web/app/api/app/today/route.ts`:

```ts
import type { AppLocale, DustResponse, PollenResponse } from "@repo/shared-types";
import { buildAppTodayPayload } from "@repo/normalizer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_LOCATION = {
  ko: { label: "서울", lat: 37.5665, lng: 126.978 },
  en: { label: "London", lat: 51.5074, lng: -0.1278 },
  de: { label: "Berlin", lat: 52.52, lng: 13.405 },
  fr: { label: "Paris", lat: 48.8566, lng: 2.3522 },
} satisfies Record<AppLocale, { label: string; lat: number; lng: number }>;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function json(data: unknown, init?: { status?: number }) {
  return NextResponse.json(data, {
    ...init,
    headers: CORS_HEADERS,
  });
}

function parseLocale(value: string | null): AppLocale {
  if (value === "en" || value === "de" || value === "fr" || value === "ko") {
    return value;
  }
  return "ko";
}

function parseCoordinate(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchJson<T>(url: URL): Promise<(T & { stale?: boolean }) | null> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) return null;
  return (await response.json()) as T & { stale?: boolean };
}

export async function GET(req: NextRequest) {
  const locale = parseLocale(req.nextUrl.searchParams.get("locale"));
  const fallback = DEFAULT_LOCATION[locale];
  const lat = parseCoordinate(req.nextUrl.searchParams.get("lat")) ?? fallback.lat;
  const lng = parseCoordinate(req.nextUrl.searchParams.get("lng")) ?? fallback.lng;
  const locationLabel = req.nextUrl.searchParams.get("locationLabel") ?? fallback.label;
  const locationDenied = req.nextUrl.searchParams.get("locationDenied") === "true";

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return json({ error: "Invalid lat/lng" }, { status: 400 });
  }

  const pollenUrl = new URL("/api/pollen", req.nextUrl.origin);
  pollenUrl.searchParams.set("lat", String(lat));
  pollenUrl.searchParams.set("lng", String(lng));

  const dustUrl = new URL("/api/dust", req.nextUrl.origin);
  dustUrl.searchParams.set("lat", String(lat));
  dustUrl.searchParams.set("lng", String(lng));

  const [pollen, dust] = await Promise.all([
    fetchJson<PollenResponse>(pollenUrl),
    fetchJson<DustResponse>(dustUrl),
  ]);

  const stale = Boolean(pollen?.stale || dust?.stale);
  const payload = buildAppTodayPayload({
    pollen,
    dust,
    locationLabel,
    locationDenied,
    stale,
    locale,
  });

  return json(payload, { status: payload.status.kind === "blocked" ? 503 : 200 });
}
```

- [ ] **Step 2: Run typecheck**

Run:

```bash
pnpm --filter web check-types
```

Expected: command exits with code 0.

- [ ] **Step 3: Smoke test locally**

Run:

```bash
pnpm --filter web dev
```

In another terminal, run:

```bash
curl -s "http://localhost:3001/api/app/today?locale=ko&lat=37.5665&lng=126.978&locationLabel=%EC%84%9C%EC%9A%B8" | jq '.location.label, .status.kind, .recommendationCopy.headline'
```

Expected output includes:

```text
"서울"
"ready"
```

The headline value varies with live data and must be one of the Korean recommendation headlines from Task 1.

- [ ] **Step 4: Commit**

Run:

```bash
git add apps/web/app/api/app/today/route.ts
git commit -m "feat: expose app today API"
```

## Task 3: Scaffold Flutter App

**Files:**
- Create: `apps/mobile/`
- Modify: `apps/mobile/pubspec.yaml`
- Modify: `apps/mobile/analysis_options.yaml`
- Modify: `apps/mobile/test/widget_test.dart`

- [ ] **Step 1: Create the Flutter project**

Run:

```bash
flutter create --org day.achoo --project-name achoo_mobile --platforms ios,android apps/mobile
```

Expected: Flutter creates `apps/mobile/lib/main.dart`, platform folders, and a passing starter test.

- [ ] **Step 2: Replace dependencies**

Edit `apps/mobile/pubspec.yaml` so the dependency block contains:

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  geolocator: ^14.0.2
  http: ^1.2.2
  intl: ^0.20.2
  permission_handler: ^12.0.1
  shared_preferences: ^2.5.3

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^6.0.0
```

- [ ] **Step 3: Replace analysis options**

Set `apps/mobile/analysis_options.yaml` to:

```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_single_quotes: true
    require_trailing_commas: true
    sort_child_properties_last: false
```

- [ ] **Step 4: Replace starter widget test**

Set `apps/mobile/test/widget_test.dart` to:

```dart
import 'package:achoo_mobile/main.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('starts on the Today tab', (tester) async {
    await tester.pumpWidget(const AchooBootstrap());

    expect(find.text('오늘'), findsWidgets);
    expect(find.text('기록'), findsOneWidget);
    expect(find.text('가이드'), findsOneWidget);
    expect(find.text('설정'), findsOneWidget);
  });
}
```

- [ ] **Step 5: Run dependency install and verify starter failure**

Run:

```bash
cd apps/mobile
flutter pub get
flutter test
```

Expected: test FAILS because `AchooBootstrap` does not exist yet.

- [ ] **Step 6: Commit scaffold**

Run:

```bash
git add apps/mobile
git commit -m "chore: scaffold Flutter mobile app"
```

## Task 4: Add Flutter App Shell and Theme

**Files:**
- Modify: `apps/mobile/lib/main.dart`
- Create: `apps/mobile/lib/app/achoo_app.dart`
- Create: `apps/mobile/lib/app/theme.dart`
- Create: `apps/mobile/lib/app/app_shell.dart`

- [ ] **Step 1: Add theme**

Create `apps/mobile/lib/app/theme.dart`:

```dart
import 'package:flutter/material.dart';

class AchooColors {
  static const bg = Color(0xFFF3EEE6);
  static const surface = Color(0xFFFFF9EF);
  static const surfaceStrong = Color(0xFFEDE8DC);
  static const textPrimary = Color(0xFF1E1A14);
  static const textMuted = Color(0xFF7A6F5E);
  static const accent = Color(0xFFB85C38);
  static const accentStrong = Color(0xFF8E4428);
  static const secondary = Color(0xFF3D4B72);
  static const dataLow = Color(0xFF8A9E7E);
  static const dataModerate = Color(0xFFD4A847);
  static const dataHigh = Color(0xFFB84C2F);
  static const dataExtreme = Color(0xFFC0392B);
}

ThemeData buildAchooTheme() {
  final colorScheme = ColorScheme.fromSeed(
    seedColor: AchooColors.accent,
    brightness: Brightness.light,
    surface: AchooColors.surface,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: colorScheme,
    scaffoldBackgroundColor: AchooColors.bg,
    fontFamily: 'Pretendard',
    textTheme: const TextTheme(
      headlineSmall: TextStyle(
        color: AchooColors.textPrimary,
        fontSize: 24,
        fontWeight: FontWeight.w800,
        height: 1.18,
      ),
      titleMedium: TextStyle(
        color: AchooColors.textPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w700,
      ),
      bodyMedium: TextStyle(
        color: AchooColors.textPrimary,
        fontSize: 14,
        height: 1.45,
      ),
      bodySmall: TextStyle(
        color: AchooColors.textMuted,
        fontSize: 12,
        height: 1.4,
      ),
    ),
    cardTheme: CardThemeData(
      color: AchooColors.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    ),
  );
}
```

- [ ] **Step 2: Add app shell**

Create `apps/mobile/lib/app/app_shell.dart`:

```dart
import 'package:flutter/material.dart';

class AppTab {
  const AppTab({
    required this.label,
    required this.icon,
    required this.screen,
  });

  final String label;
  final IconData icon;
  final Widget screen;
}

class AchooAppShell extends StatefulWidget {
  const AchooAppShell({required this.tabs, super.key});

  final List<AppTab> tabs;

  @override
  State<AchooAppShell> createState() => _AchooAppShellState();
}

class _AchooAppShellState extends State<AchooAppShell> {
  var _index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _index,
          children: widget.tabs.map((tab) => tab.screen).toList(),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (index) => setState(() => _index = index),
        destinations: [
          for (final tab in widget.tabs)
            NavigationDestination(icon: Icon(tab.icon), label: tab.label),
        ],
      ),
    );
  }
}
```

- [ ] **Step 3: Add bootstrap app with placeholder screens**

Create `apps/mobile/lib/app/achoo_app.dart`:

```dart
import 'package:achoo_mobile/app/app_shell.dart';
import 'package:achoo_mobile/app/theme.dart';
import 'package:flutter/material.dart';

class AchooApp extends StatelessWidget {
  const AchooApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Achoo',
      theme: buildAchooTheme(),
      home: AchooAppShell(
        tabs: const [
          AppTab(label: '오늘', icon: Icons.wb_sunny_outlined, screen: _PlaceholderScreen(title: '오늘')),
          AppTab(label: '기록', icon: Icons.edit_note_outlined, screen: _PlaceholderScreen(title: '기록')),
          AppTab(label: '가이드', icon: Icons.menu_book_outlined, screen: _PlaceholderScreen(title: '가이드')),
          AppTab(label: '설정', icon: Icons.settings_outlined, screen: _PlaceholderScreen(title: '설정')),
        ],
      ),
    );
  }
}

class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(title, style: Theme.of(context).textTheme.headlineSmall),
    );
  }
}
```

Replace `apps/mobile/lib/main.dart` with:

```dart
import 'package:achoo_mobile/app/achoo_app.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const AchooBootstrap());
}

class AchooBootstrap extends StatelessWidget {
  const AchooBootstrap({super.key});

  @override
  Widget build(BuildContext context) {
    return const AchooApp();
  }
}
```

- [ ] **Step 4: Run tests and analyze**

Run:

```bash
cd apps/mobile
flutter test
flutter analyze
```

Expected: both commands exit with code 0.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/mobile/lib apps/mobile/test/widget_test.dart apps/mobile/analysis_options.yaml apps/mobile/pubspec.yaml apps/mobile/pubspec.lock
git commit -m "feat: add mobile app shell"
```

## Task 5: Add Today Data Models, API Client, and Controller

**Files:**
- Create: `apps/mobile/lib/features/today/today_models.dart`
- Create: `apps/mobile/lib/features/today/today_api.dart`
- Create: `apps/mobile/lib/features/today/today_controller.dart`
- Create: `apps/mobile/test/features/today/today_models_test.dart`
- Create: `apps/mobile/test/features/today/today_controller_test.dart`

- [ ] **Step 1: Add model tests**

Create `apps/mobile/test/features/today/today_models_test.dart`:

```dart
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('parses app today payload', () {
    final payload = AppTodayPayload.fromJson({
      'locale': 'ko',
      'location': {'label': '서울', 'mode': 'confirmed', 'lat': 37.5665, 'lng': 126.978},
      'pollen': {
        'current': {
          'date': '2026-04-28',
          'overallLevel': 'high',
          'readings': [
            {'species': 'tree', 'level': 'high', 'numericValue': 70, 'range': '61~100'},
          ],
        },
        'forecast': [],
      },
      'dust': {'current': {'pm10': 60, 'pm25': 31, 'level': 'moderate'}},
      'recommendation': {'tier': 'act-now', 'action': 'take-medicine-early', 'actions': ['take-medicine-early']},
      'recommendationCopy': {'headline': '오늘은 약을 미리 챙기세요', 'summary': '외출 전에 준비하세요.', 'actionLabels': ['외출 전 약 먼저 챙기기']},
      'status': {'kind': 'ready', 'message': null},
      'generatedAt': '2026-04-28T06:00:00Z',
    });

    expect(payload.location.label, '서울');
    expect(payload.pollen?.current.overallLevel, 'high');
    expect(payload.dust?.current.level, 'moderate');
    expect(payload.recommendationCopy.headline, '오늘은 약을 미리 챙기세요');
  });
}
```

- [ ] **Step 2: Add models**

Create `apps/mobile/lib/features/today/today_models.dart` with these classes:

```dart
class AppTodayPayload {
  const AppTodayPayload({
    required this.locale,
    required this.location,
    required this.pollen,
    required this.dust,
    required this.recommendation,
    required this.recommendationCopy,
    required this.status,
    required this.generatedAt,
  });

  factory AppTodayPayload.fromJson(Map<String, Object?> json) {
    return AppTodayPayload(
      locale: json['locale'] as String,
      location: AppLocation.fromJson(json['location']! as Map<String, Object?>),
      pollen: json['pollen'] == null ? null : PollenSummary.fromJson(json['pollen']! as Map<String, Object?>),
      dust: json['dust'] == null ? null : DustSummary.fromJson(json['dust']! as Map<String, Object?>),
      recommendation: json['recommendation'] == null ? null : DailyRecommendation.fromJson(json['recommendation']! as Map<String, Object?>),
      recommendationCopy: RecommendationCopy.fromJson(json['recommendationCopy']! as Map<String, Object?>),
      status: TodayStatus.fromJson(json['status']! as Map<String, Object?>),
      generatedAt: DateTime.parse(json['generatedAt'] as String),
    );
  }

  final String locale;
  final AppLocation location;
  final PollenSummary? pollen;
  final DustSummary? dust;
  final DailyRecommendation? recommendation;
  final RecommendationCopy recommendationCopy;
  final TodayStatus status;
  final DateTime generatedAt;
}

class AppLocation {
  const AppLocation({required this.label, required this.mode, required this.lat, required this.lng});

  factory AppLocation.fromJson(Map<String, Object?> json) => AppLocation(
        label: json['label'] as String,
        mode: json['mode'] as String,
        lat: (json['lat'] as num?)?.toDouble(),
        lng: (json['lng'] as num?)?.toDouble(),
      );

  final String label;
  final String mode;
  final double? lat;
  final double? lng;
}

class PollenSummary {
  const PollenSummary({required this.current, required this.forecast});

  factory PollenSummary.fromJson(Map<String, Object?> json) => PollenSummary(
        current: PollenDay.fromJson(json['current']! as Map<String, Object?>),
        forecast: ((json['forecast'] as List<Object?>?) ?? [])
            .map((item) => PollenDay.fromJson(item! as Map<String, Object?>))
            .toList(),
      );

  final PollenDay current;
  final List<PollenDay> forecast;
}

class PollenDay {
  const PollenDay({required this.date, required this.overallLevel, required this.readings});

  factory PollenDay.fromJson(Map<String, Object?> json) => PollenDay(
        date: json['date'] as String,
        overallLevel: json['overallLevel'] as String,
        readings: ((json['readings'] as List<Object?>?) ?? [])
            .map((item) => PollenReading.fromJson(item! as Map<String, Object?>))
            .toList(),
      );

  final String date;
  final String overallLevel;
  final List<PollenReading> readings;
}

class PollenReading {
  const PollenReading({required this.species, required this.level, required this.numericValue, required this.range});

  factory PollenReading.fromJson(Map<String, Object?> json) => PollenReading(
        species: json['species'] as String,
        level: json['level'] as String,
        numericValue: (json['numericValue'] as num).toDouble(),
        range: json['range'] as String,
      );

  final String species;
  final String level;
  final double numericValue;
  final String range;
}

class DustSummary {
  const DustSummary({required this.current});

  factory DustSummary.fromJson(Map<String, Object?> json) => DustSummary(
        current: DustReading.fromJson(json['current']! as Map<String, Object?>),
      );

  final DustReading current;
}

class DustReading {
  const DustReading({required this.pm10, required this.pm25, required this.level});

  factory DustReading.fromJson(Map<String, Object?> json) => DustReading(
        pm10: (json['pm10'] as num).toDouble(),
        pm25: (json['pm25'] as num).toDouble(),
        level: json['level'] as String,
      );

  final double pm10;
  final double pm25;
  final String level;
}

class DailyRecommendation {
  const DailyRecommendation({required this.tier, required this.action, required this.actions});

  factory DailyRecommendation.fromJson(Map<String, Object?> json) => DailyRecommendation(
        tier: json['tier'] as String,
        action: json['action'] as String,
        actions: ((json['actions'] as List<Object?>?) ?? []).cast<String>(),
      );

  final String tier;
  final String action;
  final List<String> actions;
}

class RecommendationCopy {
  const RecommendationCopy({required this.headline, required this.summary, required this.actionLabels});

  factory RecommendationCopy.fromJson(Map<String, Object?> json) => RecommendationCopy(
        headline: json['headline'] as String,
        summary: json['summary'] as String,
        actionLabels: ((json['actionLabels'] as List<Object?>?) ?? []).cast<String>(),
      );

  final String headline;
  final String summary;
  final List<String> actionLabels;
}

class TodayStatus {
  const TodayStatus({required this.kind, required this.message});

  factory TodayStatus.fromJson(Map<String, Object?> json) => TodayStatus(
        kind: json['kind'] as String,
        message: json['message'] as String?,
      );

  final String kind;
  final String? message;
}
```

- [ ] **Step 3: Add API client and controller**

Create `apps/mobile/lib/features/today/today_api.dart`:

```dart
import 'dart:convert';

import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:http/http.dart' as http;

abstract class TodayClient {
  Future<AppTodayPayload> fetchToday({
    required double lat,
    required double lng,
    required String locale,
    required String locationLabel,
    required bool locationDenied,
  });
}

class TodayApi implements TodayClient {
  TodayApi({required this.baseUrl, http.Client? client}) : _client = client ?? http.Client();

  final Uri baseUrl;
  final http.Client _client;

  @override
  Future<AppTodayPayload> fetchToday({
    required double lat,
    required double lng,
    required String locale,
    required String locationLabel,
    required bool locationDenied,
  }) async {
    final uri = baseUrl.replace(
      path: '/api/app/today',
      queryParameters: {
        'lat': '$lat',
        'lng': '$lng',
        'locale': locale,
        'locationLabel': locationLabel,
        'locationDenied': '$locationDenied',
      },
    );
    final response = await _client.get(uri, headers: {'Accept': 'application/json'});
    if (response.statusCode >= 500) {
      throw TodayApiException('Achoo data is unavailable');
    }
    if (response.statusCode >= 400) {
      throw TodayApiException('Achoo request was rejected');
    }
    return AppTodayPayload.fromJson(jsonDecode(response.body) as Map<String, Object?>);
  }
}

class TodayApiException implements Exception {
  const TodayApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
```

Create `apps/mobile/lib/features/today/today_controller.dart`:

```dart
import 'package:achoo_mobile/features/today/today_api.dart';
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter/foundation.dart';

class TodayController extends ChangeNotifier {
  TodayController({required TodayClient api}) : _api = api;

  final TodayClient _api;
  AppTodayPayload? payload;
  String? errorMessage;
  bool isLoading = false;

  Future<void> loadDefaultSeoul() async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      payload = await _api.fetchToday(
        lat: 37.5665,
        lng: 126.978,
        locale: 'ko',
        locationLabel: '서울',
        locationDenied: false,
      );
    } on TodayApiException catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
```

- [ ] **Step 4: Add controller test**

Create `apps/mobile/test/features/today/today_controller_test.dart`:

```dart
import 'package:achoo_mobile/features/today/today_api.dart';
import 'package:achoo_mobile/features/today/today_controller.dart';
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter_test/flutter_test.dart';

class FailingTodayClient implements TodayClient {
  @override
  Future<AppTodayPayload> fetchToday({
    required double lat,
    required double lng,
    required String locale,
    required String locationLabel,
    required bool locationDenied,
  }) async {
    throw const TodayApiException('Achoo data is unavailable');
  }
}

void main() {
  test('controller stores failures', () async {
    final controller = TodayController(api: FailingTodayClient());

    await controller.loadDefaultSeoul();

    expect(controller.isLoading, isFalse);
    expect(controller.payload, isNull);
    expect(controller.errorMessage, isNotNull);
  });
}
```

- [ ] **Step 5: Run tests**

Run:

```bash
cd apps/mobile
flutter test test/features/today
flutter analyze
```

Expected: tests and analyze pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps/mobile/lib/features/today apps/mobile/test/features/today
git commit -m "feat: add Today data layer"
```

## Task 6: Build Today Screen UI

**Files:**
- Create: `apps/mobile/lib/features/today/today_screen.dart`
- Create: `apps/mobile/lib/features/today/widgets/daily_decision_card.dart`
- Create: `apps/mobile/lib/features/today/widgets/pollen_dust_summary.dart`
- Create: `apps/mobile/lib/features/today/widgets/species_reading_list.dart`
- Create: `apps/mobile/lib/features/today/widgets/forecast_strip.dart`
- Modify: `apps/mobile/lib/app/achoo_app.dart`
- Create: `apps/mobile/test/features/today/today_screen_test.dart`

- [ ] **Step 1: Add widget test**

Create `apps/mobile/test/features/today/today_screen_test.dart`:

```dart
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:achoo_mobile/features/today/today_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Today screen shows the decision first', (tester) async {
    final payload = AppTodayPayload.fromJson({
      'locale': 'ko',
      'location': {'label': '서울', 'mode': 'confirmed', 'lat': 37.5665, 'lng': 126.978},
      'pollen': {
        'current': {
          'date': '2026-04-28',
          'overallLevel': 'high',
          'readings': [
            {'species': 'tree', 'level': 'high', 'numericValue': 70, 'range': '61~100'},
          ],
        },
        'forecast': [
          {'date': '2026-04-29', 'overallLevel': 'moderate', 'readings': []},
        ],
      },
      'dust': {'current': {'pm10': 60, 'pm25': 31, 'level': 'moderate'}},
      'recommendation': {'tier': 'act-now', 'action': 'take-medicine-early', 'actions': ['take-medicine-early']},
      'recommendationCopy': {'headline': '오늘은 약을 미리 챙기세요', 'summary': '외출 전에 준비하세요.', 'actionLabels': ['외출 전 약 먼저 챙기기']},
      'status': {'kind': 'ready', 'message': null},
      'generatedAt': '2026-04-28T06:00:00Z',
    });

    await tester.pumpWidget(MaterialApp(home: TodayScreen(payload: payload)));

    expect(find.text('오늘은 약을 미리 챙기세요'), findsOneWidget);
    expect(find.text('서울'), findsOneWidget);
    expect(find.text('오늘의 꽃가루'), findsOneWidget);
    expect(find.text('7일 예보'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Implement Today screen and widgets**

Create `apps/mobile/lib/features/today/today_screen.dart`:

```dart
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:achoo_mobile/features/today/widgets/daily_decision_card.dart';
import 'package:achoo_mobile/features/today/widgets/forecast_strip.dart';
import 'package:achoo_mobile/features/today/widgets/pollen_dust_summary.dart';
import 'package:achoo_mobile/features/today/widgets/species_reading_list.dart';
import 'package:flutter/material.dart';

class TodayScreen extends StatelessWidget {
  const TodayScreen({required this.payload, super.key});

  final AppTodayPayload payload;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Achoo', style: Theme.of(context).textTheme.titleMedium),
            Text(payload.location.label, style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
        const SizedBox(height: 16),
        DailyDecisionCard(payload: payload),
        const SizedBox(height: 12),
        PollenDustSummary(payload: payload),
        const SizedBox(height: 12),
        if (payload.pollen != null) SpeciesReadingList(readings: payload.pollen!.current.readings),
        const SizedBox(height: 12),
        if (payload.pollen != null) ForecastStrip(days: [payload.pollen!.current, ...payload.pollen!.forecast]),
      ],
    );
  }
}
```

Create `apps/mobile/lib/features/today/widgets/daily_decision_card.dart`:

```dart
import 'package:achoo_mobile/app/theme.dart';
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter/material.dart';

class DailyDecisionCard extends StatelessWidget {
  const DailyDecisionCard({required this.payload, super.key});

  final AppTodayPayload payload;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AchooColors.textPrimary,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(payload.location.label, style: const TextStyle(color: AchooColors.surfaceStrong, fontSize: 12, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text(payload.recommendationCopy.headline, style: const TextStyle(color: AchooColors.surface, fontSize: 26, fontWeight: FontWeight.w800, height: 1.12)),
          const SizedBox(height: 10),
          Text(payload.recommendationCopy.summary, style: const TextStyle(color: AchooColors.surfaceStrong, fontSize: 13, height: 1.45)),
        ],
      ),
    );
  }
}
```

Create `apps/mobile/lib/features/today/widgets/pollen_dust_summary.dart`:

```dart
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter/material.dart';

class PollenDustSummary extends StatelessWidget {
  const PollenDustSummary({required this.payload, super.key});

  final AppTodayPayload payload;

  @override
  Widget build(BuildContext context) {
    final pollenLevel = payload.pollen?.current.overallLevel ?? '없음';
    final dustLevel = payload.dust?.current.level ?? '없음';
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(child: _Metric(label: '오늘의 꽃가루', value: pollenLevel)),
            const SizedBox(width: 10),
            Expanded(child: _Metric(label: '미세먼지', value: dustLevel)),
          ],
        ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 4),
        Text(value, style: Theme.of(context).textTheme.titleMedium),
      ],
    );
  }
}
```

Create `apps/mobile/lib/features/today/widgets/species_reading_list.dart`:

```dart
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter/material.dart';

class SpeciesReadingList extends StatelessWidget {
  const SpeciesReadingList({required this.readings, super.key});

  final List<PollenReading> readings;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          for (final reading in readings)
            ListTile(
              title: Text(_speciesLabel(reading.species)),
              trailing: Text(reading.level),
              subtitle: Text(reading.range),
            ),
        ],
      ),
    );
  }
}

String _speciesLabel(String species) {
  return switch (species) {
    'tree' => '나무',
    'grass' => '잔디',
    'weed' => '잡초',
    'pine' => '소나무',
    'oak' => '참나무',
    _ => species,
  };
}
```

Create `apps/mobile/lib/features/today/widgets/forecast_strip.dart`:

```dart
import 'package:achoo_mobile/features/today/today_models.dart';
import 'package:flutter/material.dart';

class ForecastStrip extends StatelessWidget {
  const ForecastStrip({required this.days, super.key});

  final List<PollenDay> days;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('7일 예보', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  for (final day in days.take(7))
                    Container(
                      width: 64,
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.surface,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Text(day.date.substring(5)),
                          const SizedBox(height: 6),
                          Text(day.overallLevel, textAlign: TextAlign.center),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 3: Wire Today screen into shell**

Modify the Today tab in `apps/mobile/lib/app/achoo_app.dart` to pass a static fixture payload. Task 10 replaces this fixture with live loading:

```dart
AppTab(label: '오늘', icon: Icons.wb_sunny_outlined, screen: TodayScreen(payload: sampleTodayPayload)),
```

Define `sampleTodayPayload` in the same file by parsing the JSON used in the widget test.

- [ ] **Step 4: Run tests**

Run:

```bash
cd apps/mobile
flutter test test/features/today/today_screen_test.dart test/widget_test.dart
flutter analyze
```

Expected: tests and analyze pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/mobile/lib/app apps/mobile/lib/features/today apps/mobile/test
git commit -m "feat: build Today screen"
```

## Task 7: Build Journal and Symptom Checker

**Files:**
- Create: `apps/mobile/lib/core/storage/local_store.dart`
- Create: `apps/mobile/lib/features/journal/journal_models.dart`
- Create: `apps/mobile/lib/features/journal/journal_store.dart`
- Create: `apps/mobile/lib/features/journal/journal_screen.dart`
- Create: `apps/mobile/lib/features/journal/symptom_checker_screen.dart`
- Modify: `apps/mobile/lib/app/achoo_app.dart`
- Create: `apps/mobile/test/features/journal/journal_store_test.dart`

- [ ] **Step 1: Add journal store test**

Create `apps/mobile/test/features/journal/journal_store_test.dart`:

```dart
import 'package:achoo_mobile/features/journal/journal_models.dart';
import 'package:achoo_mobile/features/journal/journal_store.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  test('saves and loads today entry', () async {
    SharedPreferences.setMockInitialValues({});
    final store = JournalStore(await SharedPreferences.getInstance());

    await store.saveToday(Severity.moderate, const ['sneeze', 'itchyEyes']);
    final entries = store.loadEntries();

    expect(entries, hasLength(1));
    expect(entries.first.severity, Severity.moderate);
    expect(entries.first.symptoms, ['sneeze', 'itchyEyes']);
  });
}
```

- [ ] **Step 2: Add journal models and store**

Create `apps/mobile/lib/features/journal/journal_models.dart`:

```dart
enum Severity { fine, mild, moderate, severe, verySevere }

class JournalEntry {
  const JournalEntry({
    required this.date,
    required this.severity,
    required this.symptoms,
  });

  factory JournalEntry.fromJson(Map<String, Object?> json) => JournalEntry(
        date: json['date'] as String,
        severity: Severity.values.byName(json['severity'] as String),
        symptoms: ((json['symptoms'] as List<Object?>?) ?? []).cast<String>(),
      );

  final String date;
  final Severity severity;
  final List<String> symptoms;

  Map<String, Object?> toJson() => {
        'date': date,
        'severity': severity.name,
        'symptoms': symptoms,
      };
}
```

Create `apps/mobile/lib/features/journal/journal_store.dart`:

```dart
import 'dart:convert';

import 'package:achoo_mobile/features/journal/journal_models.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class JournalStore {
  JournalStore(this._preferences);

  static const _key = 'achoo_diary';
  final SharedPreferences _preferences;

  List<JournalEntry> loadEntries() {
    final raw = _preferences.getString(_key);
    if (raw == null || raw.isEmpty) return const [];
    final list = jsonDecode(raw) as List<Object?>;
    return list.map((item) => JournalEntry.fromJson(item! as Map<String, Object?>)).toList();
  }

  Future<void> saveToday(Severity severity, List<String> symptoms) async {
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final entries = loadEntries().where((entry) => entry.date != today).toList()
      ..insert(0, JournalEntry(date: today, severity: severity, symptoms: symptoms));
    final encoded = jsonEncode(entries.map((entry) => entry.toJson()).toList());
    await _preferences.setString(_key, encoded);
  }
}
```

- [ ] **Step 3: Add Journal UI**

Create `apps/mobile/lib/features/journal/journal_screen.dart` with five severity buttons labelled:

```dart
const severityLabels = ['괜찮아요', '조금', '보통', '심해요', '매우 심해요'];
```

Each button calls `JournalStore.saveToday`. Include a button labelled `증상 자세히 기록하고 맞춤 조언 받기` that opens `SymptomCheckerScreen` with `Navigator.of(context).push(...)`.

Create `apps/mobile/lib/features/journal/symptom_checker_screen.dart` with:

```dart
const symptomOptions = [
  ('sneeze', '재채기'),
  ('runnyNose', '콧물'),
  ('stuffyNose', '코막힘'),
  ('itchyEyes', '눈 가려움'),
  ('wateryEyes', '눈물'),
  ('cough', '기침'),
  ('itchyThroat', '목 가려움'),
  ('skinItch', '피부 가려움'),
  ('fatigue', '피로감'),
  ('headache', '두통'),
];
```

The result screen must render `맞춤 알레르기 대처법`, `KF94 마스크 착용`, and `귀가 후 즉시 샤워` when at least one symptom is selected.

- [ ] **Step 4: Wire Journal tab**

Modify `apps/mobile/lib/app/achoo_app.dart` so the `기록` tab uses `JournalScreen`.

- [ ] **Step 5: Run tests**

Run:

```bash
cd apps/mobile
flutter test test/features/journal
flutter analyze
```

Expected: tests and analyze pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps/mobile/lib/core apps/mobile/lib/features/journal apps/mobile/lib/app/achoo_app.dart apps/mobile/test/features/journal
git commit -m "feat: add symptom journal"
```

## Task 8: Build Guide Hub and Reading Detail

**Files:**
- Create: `apps/mobile/lib/features/guide/guide_content.dart`
- Create: `apps/mobile/lib/features/guide/guide_hub_screen.dart`
- Create: `apps/mobile/lib/features/guide/guide_detail_screen.dart`
- Modify: `apps/mobile/lib/app/achoo_app.dart`
- Create: `apps/mobile/test/features/guide/guide_content_test.dart`

- [ ] **Step 1: Add content test**

Create `apps/mobile/test/features/guide/guide_content_test.dart`:

```dart
import 'package:achoo_mobile/features/guide/guide_content.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('guide content covers all app categories', () {
    expect(guideCategories.map((category) => category.title), [
      '알레르기 대처법',
      '꽃가루 정보',
      '알레르기 종류',
      '시즌 캘린더',
      '예방 가이드',
      '미세먼지 가이드',
      '인사이트',
    ]);
  });
}
```

- [ ] **Step 2: Add content model and Korean content**

Create `apps/mobile/lib/features/guide/guide_content.dart`:

```dart
class GuideCategory {
  const GuideCategory({
    required this.id,
    required this.title,
    required this.description,
    required this.sections,
    required this.variant,
  });

  final String id;
  final String title;
  final String description;
  final List<GuideSection> sections;
  final GuideVariant variant;
}

class GuideSection {
  const GuideSection({required this.heading, required this.body});

  final String heading;
  final String body;
}

enum GuideVariant { article, actionGuide, dataExplainer }

const guideCategories = [
  GuideCategory(
    id: 'tips',
    title: '알레르기 대처법',
    description: '오늘 증상에 맞춰 바로 행동을 정하는 도구',
    variant: GuideVariant.actionGuide,
    sections: [
      GuideSection(heading: '높음 / 매우높음', body: '외출 전 약과 마스크를 먼저 준비하고 점심 산책은 줄이세요.'),
      GuideSection(heading: '실내 관리', body: '창문을 닫고 외출복은 현관에서 분리해 보관하세요.'),
    ],
  ),
  GuideCategory(
    id: 'pollen-info',
    title: '꽃가루 정보',
    description: '꽃가루 알레르기 증상과 감기와의 차이를 정리합니다.',
    variant: GuideVariant.article,
    sections: [
      GuideSection(heading: '언제 가장 심할까', body: '건조하고 바람이 강한 날, 오전 시간대에 꽃가루 노출이 커질 수 있습니다.'),
    ],
  ),
  GuideCategory(
    id: 'allergy-types',
    title: '알레르기 종류',
    description: '나무, 잔디, 잡초 꽃가루 차이를 비교합니다.',
    variant: GuideVariant.dataExplainer,
    sections: [
      GuideSection(heading: '나무 꽃가루', body: '봄철에 강하고 눈 가려움, 재채기, 콧물과 함께 나타납니다.'),
    ],
  ),
  GuideCategory(
    id: 'seasonal-calendar',
    title: '시즌 캘린더',
    description: '월별 꽃가루 시즌을 빠르게 확인합니다.',
    variant: GuideVariant.dataExplainer,
    sections: [
      GuideSection(heading: '봄 시즌', body: '3월부터 5월까지 나무 꽃가루가 강해집니다.'),
    ],
  ),
  GuideCategory(
    id: 'prevention-guide',
    title: '예방 가이드',
    description: '출근 전부터 귀가 후까지의 예방 루틴입니다.',
    variant: GuideVariant.actionGuide,
    sections: [
      GuideSection(heading: '출근 전 30초', body: '오늘 예보를 확인하고 마스크, 약, 인공눈물을 챙기세요.'),
    ],
  ),
  GuideCategory(
    id: 'dust-guide',
    title: '미세먼지 가이드',
    description: '미세먼지와 초미세먼지 등급을 이해합니다.',
    variant: GuideVariant.dataExplainer,
    sections: [
      GuideSection(heading: 'PM2.5와 PM10', body: '입자 크기와 건강 영향을 구분해서 보는 것이 좋습니다.'),
    ],
  ),
  GuideCategory(
    id: 'insights',
    title: '인사이트',
    description: '알레르기와 기후, 생활 루틴에 관한 읽을거리입니다.',
    variant: GuideVariant.article,
    sections: [
      GuideSection(heading: '꽃가루 시즌이 길어지는 이유', body: '기온과 계절 변화는 꽃가루 노출 기간에 영향을 줍니다.'),
    ],
  ),
];
```

- [ ] **Step 3: Add guide screens**

Create `apps/mobile/lib/features/guide/guide_hub_screen.dart`:

```dart
import 'package:achoo_mobile/features/guide/guide_content.dart';
import 'package:achoo_mobile/features/guide/guide_detail_screen.dart';
import 'package:flutter/material.dart';

class GuideHubScreen extends StatelessWidget {
  const GuideHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      children: [
        Text('가이드', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        for (final category in guideCategories)
          Card(
            child: ListTile(
              title: Text(category.title),
              subtitle: Text(category.description),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => GuideDetailScreen(category: category),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }
}
```

Create `apps/mobile/lib/features/guide/guide_detail_screen.dart`:

```dart
import 'package:achoo_mobile/app/theme.dart';
import 'package:achoo_mobile/features/guide/guide_content.dart';
import 'package:flutter/material.dart';

class GuideDetailScreen extends StatelessWidget {
  const GuideDetailScreen({required this.category, super.key});

  final GuideCategory category;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(category.title)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
        children: [
          Text(category.description, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 16),
          for (final section in category.sections)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (category.variant == GuideVariant.actionGuide)
                      const Padding(
                        padding: EdgeInsets.only(right: 10),
                        child: Icon(Icons.check_circle_outline, color: AchooColors.accent),
                      ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (category.variant == GuideVariant.dataExplainer)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AchooColors.surfaceStrong,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(section.heading),
                            )
                          else
                            Text(section.heading, style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: 8),
                          Text(section.body),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 4: Wire Guide tab**

Modify `apps/mobile/lib/app/achoo_app.dart` so the `가이드` tab uses `GuideHubScreen`.

- [ ] **Step 5: Run tests**

Run:

```bash
cd apps/mobile
flutter test test/features/guide
flutter analyze
```

Expected: tests and analyze pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps/mobile/lib/features/guide apps/mobile/lib/app/achoo_app.dart apps/mobile/test/features/guide
git commit -m "feat: add guide hub"
```

## Task 9: Add Settings, Onboarding, Permissions, and Status Components

**Files:**
- Create: `apps/mobile/lib/core/status/status_widgets.dart`
- Create: `apps/mobile/lib/features/settings/settings_screen.dart`
- Create: `apps/mobile/lib/features/onboarding/onboarding_screen.dart`
- Modify: `apps/mobile/lib/app/achoo_app.dart`
- Create: `apps/mobile/test/features/settings/settings_screen_test.dart`

- [ ] **Step 1: Add settings widget test**

Create `apps/mobile/test/features/settings/settings_screen_test.dart`:

```dart
import 'package:achoo_mobile/features/settings/settings_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('settings exposes location language notification and legal links', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SettingsScreen()));

    expect(find.text('위치'), findsOneWidget);
    expect(find.text('언어'), findsOneWidget);
    expect(find.text('알림'), findsOneWidget);
    expect(find.text('FAQ'), findsOneWidget);
    expect(find.text('개인정보처리방침'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Add status widgets**

Create `apps/mobile/lib/core/status/status_widgets.dart`:

```dart
import 'package:achoo_mobile/app/theme.dart';
import 'package:flutter/material.dart';

class StatusBanner extends StatelessWidget {
  const StatusBanner({required this.message, super.key});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AchooColors.surfaceStrong,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(message, style: Theme.of(context).textTheme.bodySmall),
    );
  }
}

class BlockingState extends StatelessWidget {
  const BlockingState({required this.title, required this.message, required this.onRetry, super.key});

  final String title;
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(title, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton(onPressed: onRetry, child: const Text('다시 시도')),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 3: Add Settings screen**

Create `apps/mobile/lib/features/settings/settings_screen.dart`:

```dart
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      children: const [
        Text('설정', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
        SizedBox(height: 16),
        ListTile(leading: Icon(Icons.location_on_outlined), title: Text('위치'), subtitle: Text('현재 위치 새로고침')),
        ListTile(leading: Icon(Icons.language_outlined), title: Text('언어'), subtitle: Text('한국어')),
        ListTile(leading: Icon(Icons.notifications_none_outlined), title: Text('알림'), subtitle: Text('푸시 알림 준비 중')),
        Divider(),
        ListTile(leading: Icon(Icons.help_outline), title: Text('FAQ')),
        ListTile(leading: Icon(Icons.privacy_tip_outlined), title: Text('개인정보처리방침')),
        ListTile(leading: Icon(Icons.dataset_outlined), title: Text('데이터 출처'), subtitle: Text('기상청 · 에어코리아 · Open-Meteo')),
      ],
    );
  }
}
```

- [ ] **Step 4: Add Onboarding screen**

Create `apps/mobile/lib/features/onboarding/onboarding_screen.dart` with two pages:

```dart
const pollenChoices = ['나무', '잔디', '잡초'];
const locationTitle = '현재 위치로 오늘 예보를 보여드릴게요';
const locationBody = '위치 권한이 없어도 서울 기준 예보를 볼 수 있습니다.';
```

The first page renders the three pollen choices as `FilterChip`s. The second page renders `위치 허용` and `서울 기준으로 보기` buttons. The `위치 허용` button calls `Geolocator.requestPermission()`.

- [ ] **Step 5: Wire Settings tab**

Modify `apps/mobile/lib/app/achoo_app.dart` so the `설정` tab uses `SettingsScreen`.

- [ ] **Step 6: Run tests**

Run:

```bash
cd apps/mobile
flutter test test/features/settings
flutter analyze
```

Expected: tests and analyze pass.

- [ ] **Step 7: Commit**

Run:

```bash
git add apps/mobile/lib/core/status apps/mobile/lib/features/settings apps/mobile/lib/features/onboarding apps/mobile/lib/app/achoo_app.dart apps/mobile/test/features/settings
git commit -m "feat: add settings and onboarding surfaces"
```

## Task 10: Connect Live Today Loading and Final Verification

**Files:**
- Modify: `apps/mobile/lib/app/achoo_app.dart`
- Modify: `apps/mobile/lib/features/today/today_screen.dart`
- Modify: `apps/mobile/lib/features/today/today_controller.dart`
- Create: `apps/mobile/test/features/today/live_today_smoke_test.dart`

- [ ] **Step 1: Add live-loading widget smoke test**

Create `apps/mobile/test/features/today/live_today_smoke_test.dart`:

```dart
import 'package:achoo_mobile/features/today/today_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('loading state is visible without payload', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: TodayLoadingScreen()));

    expect(find.text('데이터 불러오는 중...'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Add loading screen**

Add this widget to `apps/mobile/lib/features/today/today_screen.dart`:

```dart
class TodayLoadingScreen extends StatelessWidget {
  const TodayLoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 12),
          Text('데이터 불러오는 중...'),
        ],
      ),
    );
  }
}
```

- [ ] **Step 3: Replace static Today fixture with controller-driven loader**

In `apps/mobile/lib/app/achoo_app.dart`, replace the static Today tab with a `StatefulWidget` that:

1. Creates `TodayController(api: TodayApi(baseUrl: Uri.parse('https://achoo.day')))`.
2. Calls `loadDefaultSeoul()` in `initState`.
3. Renders `TodayLoadingScreen` while loading.
4. Renders `BlockingState(title: '예보를 불러오지 못했어요', message: controller.errorMessage ?? '잠시 후 다시 시도하세요.', onRetry: controller.loadDefaultSeoul)` when no payload exists.
5. Renders `TodayScreen(payload: controller.payload!)` when payload exists.

- [ ] **Step 4: Run full Flutter checks**

Run:

```bash
cd apps/mobile
flutter test
flutter analyze
flutter build apk --debug
```

Expected: all commands exit with code 0 and debug APK is produced under `apps/mobile/build/app/outputs/flutter-apk/app-debug.apk`.

- [ ] **Step 5: Run web checks**

Run:

```bash
pnpm --filter @repo/normalizer test
pnpm --filter web check-types
pnpm --filter web build
```

Expected: all commands exit with code 0.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps/mobile
git commit -m "feat: connect mobile Today screen"
```

## Task 11: Final Review

**Files:**
- Modify only files required by findings from verification.

- [ ] **Step 1: Review route and Flutter app against the design spec**

Check these requirements manually:

```text
Today tab exists.
Journal tab exists.
Guide tab exists.
Settings tab exists.
Today uses Decision First layout.
Journal uses Quick Check-in layout.
Guide uses Category Tiles layout.
Reading detail supports article, action guide, and data explainer variants.
Settings includes location, language, notification, FAQ, privacy, and data sources.
Onboarding includes sensitive pollen choices and location permission copy.
Status components cover inline banner and blocking state.
```

- [ ] **Step 2: Run final verification**

Run:

```bash
git status --short
pnpm lint
pnpm check-types
pnpm --filter web build
cd apps/mobile && flutter test && flutter analyze && flutter build apk --debug
```

Expected:

```text
git status --short
```

shows no unrelated unstaged work except files intentionally changed by this plan before the final commit.

All test, analyze, typecheck, lint, and build commands exit with code 0.

- [ ] **Step 3: Commit final fixes**

If Step 2 required changes, run:

```bash
git add apps/mobile apps/web packages
git commit -m "fix: polish mobile app verification"
```

If Step 2 required no changes, do not create an empty commit.
