# Achoo Design System

## Brand
- Name: Achoo (🤧)
- Personality: 친근하고 실용적인 알레르기 도우미
- Voice: 간결한 한국어, 이모지 사용 OK

## Typography
- Primary: **Pretendard** (CDN: orioncactus/pretendard v1.3.9)
- Fallback: sans-serif
- Scale: Tailwind defaults
  - Hero number: `text-7xl font-bold tracking-tight`
  - Hero label: `text-lg font-medium`
  - Section title: `text-xs font-semibold uppercase tracking-wide`
  - Body: `text-sm`
  - Caption: `text-xs`, `text-[10px]`

## Color System

### Pollen Levels
| Level | Gradient (Hero) | Badge BG | Badge Text | Dot |
|-------|----------------|----------|------------|-----|
| low | green-400 → green-600 | green-50 | green-700 | green-500 |
| moderate | yellow-400 → yellow-500 | yellow-50 | yellow-700 | yellow-400 |
| high | orange-400 → orange-600 | orange-50 | orange-700 | orange-500 |
| very-high | red-500 → red-700 | red-50 | red-700 | red-500 |

### Dust Levels
| Level | Badge BG | Badge Text | Dot |
|-------|----------|------------|-----|
| good | green-50 | green-700 | green-500 |
| moderate | yellow-50 | yellow-700 | yellow-400 |
| bad | orange-50 | orange-700 | orange-500 |
| very-bad | red-50 | red-700 | red-500 |

### Surfaces
- Page background: `bg-gray-50`
- Card: `bg-white rounded-2xl shadow-sm border border-gray-100`
- Hero card: `rounded-3xl bg-gradient-to-br shadow-lg`
- Interactive: `hover:bg-gray-50 transition-colors` or `hover:bg-gray-100`

## Spacing
- Page padding: `px-4 py-6`
- Card padding: `p-4` (standard), `p-8` (hero)
- Section gap: `space-y-4`
- Max width: `max-w-md` (mobile), `md:max-w-4xl` (desktop)

## Corner Radius
- Hero card: `rounded-3xl` (24px)
- Standard card: `rounded-2xl` (16px)
- Badge: `rounded-full`
- Button: `rounded-xl` (12px)

## Layout
- Mobile: single column, `max-w-md`
- Desktop (≥768px): 2-column grid, `md:grid-cols-2 md:gap-6`

## Components

### HeroCard
- Shows dominant metric (pollen or dust, whichever is worse)
- Large numericValue + displayValue label + advice text
- Selection logic: `selectHero()` in `@repo/normalizer/src/hero.ts`

### SpeciesRow
- 4-segment bar visualization (low/moderate/high/very-high)
- Species: 나무/잔디/잡초

### ForecastBar
- 7-day dots with day labels (오늘/내일/요일)
- Color-coded dots matching level system

### LevelBadge
- Dot + label, pill shape
- Works for both pollen and dust levels

### SymptomDiary
- 5-level emoji selector (😊🤏😷🤧😵)
- Local storage based (localStorage key: `achoo_diary`)
- Mini history: last 7 days as emoji dots

## Advice Copy
| Level | Message |
|-------|---------|
| low | 야외 활동하기 좋은 날이에요 🌿 |
| moderate | 민감한 분은 마스크를 챙기세요 😷 |
| high | 외출 시 KF94 마스크 착용 권장 ⚠️ |
| very-high | 가능하면 외출을 삼가세요 🚫 |
| good | 공기 맑은 날이에요 🌿 |
| bad | 미세먼지 마스크를 착용하세요 😷 |
| very-bad | 외출 자제, 환기 금지 🚫 |
