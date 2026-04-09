# Design System — Achoo

## Product Context
- **What this is:** Multilingual pollen/allergy forecast web app
- **Who it's for:** Allergy sufferers in Korea, Germany, UK, France who want clear, actionable forecasts
- **Space/industry:** Weather-health, pollen tracking (peers: pollen.com, klarify, Zyrtec AllergyCast, AccuWeather Allergy)
- **Project type:** Data-rich web app with editorial content pages

## Brand
- Name: Achoo (🤧)
- Personality: 자연현상을 오래 관찰해온 필드 사이언티스트의 도구. 차분하지만 권위 있는.
- Voice: 간결한 한국어, 생활 언어 우선, 과장 금지, 이모지는 보조적으로만 사용

## Aesthetic Direction
- **Direction:** Atmospheric Journal — feels like a field scientist's weather notebook, not a pharmacy or clinical dashboard
- **Decoration level:** Intentional — subtle paper texture/grain overlay, warm surfaces, but restrained
- **Mood:** Quiet authority. Like something that's been observing pollen for decades. Not anxious, not clinical, not generic wellness.

## Typography

### Korean (ko locale)
- **Display/Hero:** Noto Serif KR — Google Fonts 무료, 한국 에디토리얼 사이트에서 가장 많이 사용되는 세리프. 권위감 있는 헤드라인.
- **Body:** Pretendard — 한국 웹에서 가장 인기 있는 무료 산세리프. 가독성 최고.
- **UI/Labels:** Pretendard (same as body)
- **Data/Tables:** D2Coding — 네이버 오픈소스 고정폭 폰트, tabular-nums 지원, 한국 개발자에게 익숙
- **Code:** D2Coding

### International (en/de/fr locales)
- **Display/Hero:** Instrument Serif — Google Fonts 무료, 에디토리얼 권위감
- **Body:** Satoshi — Fontshare 무료, 깔끔한 지오메트릭 산세리프
- **UI/Labels:** Satoshi (same as body)
- **Data/Tables:** Geist Mono — tabular-nums 지원, 데이터 정렬에 최적
- **Code:** Geist Mono

### Loading
  - Noto Serif KR: Google Fonts (`fonts.googleapis.com`)
  - Pretendard: jsDelivr CDN (existing, `cdn.jsdelivr.net/gh/orioncactus/pretendard`)
  - D2Coding: GitHub CDN (`cdn.jsdelivr.net/gh/naver/d2codingfont`)
  - Instrument Serif: Google Fonts
  - Satoshi: Fontshare CDN (`api.fontshare.com`)
  - Geist Mono: self-hosted or Vercel CDN
- **Scale:**
  - Hero: `clamp(48px, 8vw, 80px)`
  - H1: 36px / 2.25rem
  - H2: 28px / 1.75rem
  - H3: 24px / 1.5rem
  - H4: 20px / 1.25rem
  - Body: 16px / 1rem
  - Small: 14px / 0.875rem
  - Caption: 12px / 0.75rem
  - Data: 13px / 0.8125rem (Geist Mono)
  - Eyebrow: 11px / 0.6875rem (uppercase, 0.12em tracking)

## Color System

### Core Palette ("Dried Botanical")
- **Approach:** Restrained earth tones for chrome, reserved semantic colors for data severity
- **Background:** `#F3EEE6` (Parchment) — warm neutral, never white
- **Surface:** `#E6DED2` (Warm Linen) — card backgrounds
- **Surface Strong:** `#D8CEBF` — emphasized surfaces
- **Accent:** `#B85C38` (Burnt Sienna) — CTAs, brand moments, interactive elements
- **Accent Deep:** `#8E4428` — hover/active states
- **Accent Soft:** `rgba(184, 92, 56, 0.1)` — subtle highlights, focus rings
- **Secondary:** `#3D4B72` (Dusty Indigo) — data emphasis, secondary actions, info
- **Secondary Soft:** `rgba(61, 75, 114, 0.12)`
- **Text Primary:** `#1E1A14` (Ink)
- **Text Secondary:** `#3B3529`
- **Text Muted:** `#7A6F5E` (Tallow)
- **Line:** `#C9BFA8` — borders, dividers
- **Line Light:** `#DDD5C6` — subtle separators

### CSS Variables (Light)
```css
:root {
  --bg: #F3EEE6;
  --surface: #E6DED2;
  --surface-strong: #D8CEBF;
  --text-primary: #1E1A14;
  --text-secondary: #3B3529;
  --text-muted: #7A6F5E;
  --accent: #B85C38;
  --accent-deep: #8E4428;
  --accent-soft: rgba(184, 92, 56, 0.1);
  --secondary: #3D4B72;
  --secondary-soft: rgba(61, 75, 114, 0.12);
  --line: #C9BFA8;
  --line-light: #DDD5C6;
}
```

### CSS Variables (Dark)
```css
[data-theme="dark"] {
  --bg: #1A1714;
  --surface: #252119;
  --surface-strong: #302A21;
  --text-primary: #E8E0D4;
  --text-secondary: #C4BAA8;
  --text-muted: #8A7F6E;
  --accent: #D4845E;
  --accent-deep: #E89A74;
  --accent-soft: rgba(212, 132, 94, 0.12);
  --secondary: #7E90B8;
  --secondary-soft: rgba(126, 144, 184, 0.12);
  --line: #3D362C;
  --line-light: #2E2820;
}
```

### Data Severity Scale
| Level | Label (ko) | Color | Hex |
|-------|-----------|-------|-----|
| Low | 낮음 | Sage Stone | `#8A9E7E` |
| Moderate | 보통 | Amber Wheat | `#D4A847` |
| High | 높음 | Terra Cotta | `#B84C2F` |
| Extreme | 매우높음 | Charcoal Plum | `#3A2535` |

### Semantic Colors
- Success: `#6B8F5E`
- Warning: `#C9922A`
- Error: `#B84C2F`
- Info: `#3D4B72`

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)
- Page padding: `px-4 py-6` (mobile), `px-6 py-8` (desktop)
- Card padding: `p-4` to `p-6`
- Section gap: `space-y-6` to `space-y-8`

## Layout
- **Approach:** Editorial — asymmetric, type-led, poster-like first viewport
- **Grid:** Single column mobile, editorial asymmetric desktop
- **Max content width:** 1080px (shell), 80rem (wide pages)
- **Border radius:** sm: 4px, md: 8px, lg: 12px (NO pills except badges, NO 2rem+ rounds)
- **Key principle:** Composition over components. First viewport is a poster, not a feed. Qualitative labels ("매우 많음") are primary, numeric data is secondary.

## Motion
- **Approach:** Intentional — entrance animations + state transitions, not decorative
- **Easing:** enter: ease-out, exit: ease-in, move: ease-in-out
- **Duration:** micro: 50-100ms, short: 150-250ms, medium: 250-400ms, long: 400-700ms
- **Grain overlay:** Fixed position, 3% opacity, fractalNoise SVG filter

## Design Principles
1. **Observe, don't alarm.** Present data with weather-station calm, not medical urgency.
2. **Type carries severity.** Scale, weight, language communicate risk first. Color supports.
3. **Warm, not clinical.** Parchment > white. Earth tones > medical green.
4. **Data is poetry.** Qualitative labels are the hero. Numbers are secondary.
5. **Zero green in chrome.** Green only in data scale (Low: Sage). Brand uses earth tones.

## Copy Rules
- Home copy starts with action, not explanation
- Prefer lived-language phrasing:
  - Good: "오늘은 마스크를 먼저 챙기세요"
  - Good: "오늘 증상을 남겨두면 내일 컨디션을 비교하기 쉬워져요"
  - Avoid: "오늘의 웰니스 상태를 확인하세요"

## Advice Copy
| Level | Message |
|-------|---------|
| low | 야외 활동하기 좋은 날이에요 🌿 |
| moderate | 민감한 분은 마스크를 챙기세요 😷 |
| high | 외출 시 KF94 마스크 착용 권장 ⚠️ |
| very-high | 가능하면 외출을 삼가세요 🚫 |

## Components

### Hero (first viewport)
- Poster composition: location + qualitative label + supporting number
- Left-weighted, asymmetric
- Qualitative label in Instrument Serif at hero scale
- Index number in Geist Mono, secondary position

### Species Cards
- Compact cards with species name (Korean + Latin) and severity badge
- Grid layout, 4 columns desktop / 2 mobile
- Badges use data scale colors with 12% opacity backgrounds

### Forecast Strip
- 7-day horizontal strip
- Vertical bars colored by severity scale
- Qualitative labels below each day

### Level Badge
- Data font, compact padding (4px 10px)
- Colored text on 12% opacity background matching data scale
- border-radius: 4px (NOT pills)

### Symptom Diary
- 5-level emoji selector (😊🤏😷🤧😵)
- localStorage-based (`achoo_diary`)
- Mini history: last 7 days as emoji dots

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-09 | Redesign: Atmospheric Journal direction | Competitive research + Codex + Claude subagent all agreed: break from medical green. Parchment + Burnt Sienna + editorial layout differentiates from every competitor. |
| 2026-04-09 | Korean: Noto Serif KR + Pretendard + D2Coding | 한국 사이트에서 가장 많이 쓰이는 무료 폰트 조합. Noto Serif KR(에디토리얼), Pretendard(본문), D2Coding(데이터). |
| 2026-04-09 | International: Instrument Serif + Satoshi + Geist Mono | 다국어(en/de/fr)용 별도 폰트 스택. 에디토리얼 권위감 + 모던 산세리프 + 데이터 모노. |
| 2026-04-09 | "Dried Botanical" color palette | Every competitor uses green. Warm earth tones reposition Achoo as "natural phenomenon observatory" vs "health app." |
| 2026-04-09 | Border radius reduced to 4-12px | Previous 2rem/32px rounds were generic wellness-app. Tighter radii match the editorial/instrument aesthetic. |
