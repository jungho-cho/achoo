# Achoo Design System

## Brand
- Name: Achoo (🤧)
- Personality: 차분하지만 단호한 알레르기 의사결정 도구
- Voice: 간결한 한국어, 생활 언어 우선, 과장 금지, 이모지는 보조적으로만 사용

## Typography
- Primary: **Pretendard** (CDN: orioncactus/pretendard v1.3.9)
- Editorial accent: **Noto Serif KR** (insights hub / article titles only)
- Data/UI utility: **JetBrains Mono** (timestamps, metrics, system labels only)
- Fallback: sans-serif
- Scale:
  - Home hero headline: `text-[1.85rem] ~ text-[2.05rem] font-bold tracking-tight`
  - Editorial title: `ach-editorial-title text-[2rem] ~ text-[3rem]`
  - Section title: `text-2xl font-bold tracking-tight`
  - Eyebrow: `text-xs font-semibold uppercase tracking-[0.18em]`
  - Body: `text-sm leading-7` to `text-[15px] leading-8`
  - Caption: `text-xs`, `text-[10px]`

## Color System

### Primary Product Palette
| Token | Usage | Value |
|-------|-------|-------|
| Moss action | primary action / decision surface | `#2F6F53` |
| Moss deep | hover / dark edge | `#214C38` |
| Moss soft | soft accent / selected state | `#DFEEE2` |
| Warm background | page background | `#F2EEE6` |
| Soft green wash | secondary background | `#E7EFE7` |

### Pollen Levels
| Level | Decision/Card Direction | Badge BG | Badge Text | Dot |
|-------|----------------|----------|------------|-----|
| low | green calm | green-50 | green-700 | green-500 |
| moderate | amber caution | yellow-50 | yellow-700 | yellow-400 |
| high | orange warning | orange-50 | orange-700 | orange-500 |
| very-high | red alert | red-50 | red-700 | red-500 |

### Dust Levels
| Level | Badge BG | Badge Text | Dot |
|-------|----------|------------|-----|
| good | green-50 | green-700 | green-500 |
| moderate | yellow-50 | yellow-700 | yellow-400 |
| bad | orange-50 | orange-700 | orange-500 |
| very-bad | red-50 | red-700 | red-500 |

### Surfaces
- Page background: warm neutral gradient using `--ach-bg` and `--ach-bg-soft`
- Decision surface: gradient, highest emphasis, strongest shadow
- Standard card: soft white / glass surface, rounded `2rem`, quiet border
- Editorial hero: warm white gradient with serif title support
- Interactive: subtle lift or white tint, never loud gradients everywhere

## Spacing
- Page padding: `px-4 py-6`
- Standard card padding: `p-4` to `p-6`
- Key surface padding: `p-5` to `p-6`
- Section gap: `space-y-5` to `space-y-8`
- Max width:
  - Home / hub / articles: `ach-page-shell--wide`
  - Compact tool flows: `ach-page-shell`

## Corner Radius
- Decision surface: `rounded-[2rem]` (32px)
- Standard card: `rounded-[2rem]` or `rounded-2xl`
- Badge: `rounded-full`
- Button: `rounded-xl` (12px)

## Layout
- Home: decision-first 2-column at desktop, left main / right support
- Tool page: main interaction left, support / affiliate right
- Standard guide pages: hero + summary cards + sticky sidebar
- Insights hub: wide editorial hero + article card grid
- Insight article: editorial hero + signal row + structured content blocks

## Components

### DecisionCard
- Primary home surface
- Shows one recommended action first, then why, then supporting evidence
- Uses tier-based gradient surfaces: `act-now`, `reduce-exposure`, `okay-today`
- Must visually outweigh forecast, diary, and navigation cards

### SpeciesRow
- 4-segment bar visualization (low/moderate/high/very-high)
- Species: 나무/잔디/잡초

### ForecastBar
- 7-day dots with day labels (오늘/내일/요일)
- Color-coded dots matching level system
- Treated as secondary support card, not the main hero

### LevelBadge
- Dot + label, pill shape
- Works for both pollen and dust levels

### SymptomDiary
- 5-level emoji selector (😊🤏😷🤧😵)
- Local storage based (localStorage key: `achoo_diary`)
- Mini history: last 7 days as emoji dots
- Positioning copy must stay honest: comparison/recording, not fake personalization promises

### ArticleLayout
- Shared frame for guide pages
- Uses warm hero, summary cards, sticky sidebar TOC, related links
- Default title is sans; insight article titles can opt into serif

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

## Copy Rules
- Home copy starts with action, not explanation
- Avoid internal/system phrasing like "추천 품질 향상" unless the feature really does that
- Prefer lived-language phrasing:
  - Good: "오늘은 마스크를 먼저 챙기세요"
  - Good: "오늘 증상을 남겨두면 내일 컨디션을 비교하기 쉬워져요"
  - Avoid: "오늘의 웰니스 상태를 확인하세요"
  - Avoid: "내일 추천 품질을 높입니다"
