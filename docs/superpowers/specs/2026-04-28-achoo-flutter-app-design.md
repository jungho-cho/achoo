# Achoo Flutter App Design

Date: 2026-04-28

## Goal

Build a simple Flutter mobile app for Achoo that feels like a native app, not a mobile copy of the website.

The existing Next.js app remains useful as the source of product logic, copy, content, and data structure. The Flutter app should reinterpret that material as a fast weather-style utility: users open it, understand today's allergy risk and recommended action, optionally record symptoms, then leave.

## Product Direction

Chosen direction: **Native Weather Utility**.

The app should feel closer to a weather app than to a content website or medical dashboard. The first screen prioritizes today's action, current location, pollen/dust summary, and short-term forecast. Editorial content moves into a secondary guide area.

Core qualities:

- Fast first read: "What should I do today?" should be clear in 3 seconds.
- Native mobile structure: bottom tabs, compact cards, native settings, permission flows.
- Warm but practical visual tone: keep Achoo's parchment and burnt sienna palette, but use app-style hierarchy and controls.
- Low duplication: repeated web pages become reusable app templates.

## Existing Web Pages Read

The current web app has these user-facing routes:

- `/[locale]`: home forecast and daily decision
- `/[locale]/tips`: symptom checker, advice, affiliate links
- `/[locale]/pollen-info`: pollen explainer
- `/[locale]/allergy-types`: tree/grass/weed allergy guide
- `/[locale]/seasonal-calendar`: monthly pollen calendar
- `/[locale]/prevention-guide`: practical prevention guide
- `/[locale]/dust-guide`: dust guide and PM grade table
- `/[locale]/insights`: article list
- `/[locale]/insights/[slug]`: article detail
- `/[locale]/faq`: FAQ
- `/[locale]/privacy`: privacy policy
- `/[locale]/regions`: disabled; redirects to home

The app should not reproduce these as one screen per route. It should preserve their content where useful and remap them into app-native tabs and templates.

## App Information Architecture

Use four bottom tabs:

1. **Today**
   - Current location
   - Today's primary recommendation
   - Pollen and dust summary
   - Species rows
   - 7-day forecast
   - Update/cache status

2. **Journal**
   - Quick symptom check-in
   - Detailed symptom checker
   - Recent 7-day symptom history
   - Saved advice result

3. **Guide**
   - Allergy countermeasures
   - Pollen info
   - Allergy types
   - Seasonal calendar
   - Prevention guide
   - Dust guide
   - Insights article list
   - Article detail screens

4. **Settings**
   - Location refresh and fallback city
   - Language
   - Notification preference
   - Data sources
   - FAQ
   - Privacy policy

App-only screens:

- Onboarding
- Location permission
- Notification permission
- Loading state
- Location denied state
- API error state
- Cached/stale data state

## Reusable Screen Templates

The app design is organized around seven reusable templates.

### 1. Today Template

Purpose: show the day's recommended action and key environmental readings.

Three design variants:

- **A. Decision First**: large action card at the top, followed by pollen/dust summary, species rows, 7-day forecast, and a small journal prompt. This is the selected default.
- **B. Score Dashboard**: outing score and environmental metrics are arranged as a compact dashboard. Better for data comparison, but less direct than a recommendation-led home.
- **C. Today Timeline**: morning, lunch, commute, and evening actions are shown as a timeline. Strong for routine guidance, but too heavy as the default MVP home.

Selected: **A. Decision First**.

### 2. Journal Template

Purpose: capture symptoms quickly and turn them into useful advice.

Three design variants:

- **A. Quick Check-in**: five severity choices are the first element. If a user taps a non-zero symptom level, the screen suggests opening the detailed checker. This is the selected default.
- **B. Symptom Grid**: symptom chips are primary. Better for detailed advice, but slower for daily repeat use.
- **C. Pattern Journal**: recent history and pattern visualization are primary. Better after enough diary data exists, but not ideal for first release.

Selected: **A. Quick Check-in**, with B available inside the detailed checker flow.

### 3. Guide List Template

Purpose: merge web content pages into a browsable app guide.

Three design variants:

- **A. Category Tiles**: a compact grid/list of categories: Allergy Tips, Pollen Basics, Allergy Types, Seasonal Calendar, Prevention, Dust, Insights. This is the selected default.
- **B. Recommended Feed**: content cards are reordered based on today's condition. More personal, but needs more ranking logic.
- **C. Search + Filters**: search-first content library. Useful later when content volume grows.

Selected: **A. Category Tiles**.

### 4. Reading Detail Template

Purpose: render guide pages, articles, FAQ, and policy content with one native reading system.

Three design variants:

- **A. Native Article**: standard app article screen with app bar, title, summary chips, sections, related links. This is the default detail template.
- **B. Action Guide**: checklist-style reading with practical action blocks near the top. Use for prevention and tips content.
- **C. Data Explainer**: table/calendar/chart-oriented detail. Use for dust guide and seasonal calendar.

Selected: **A as the base**, with **B/C as content-type variations**.

### 5. Settings Template

Purpose: keep utility controls and legal/help content out of the main workflow.

Three design variants:

- **A. Plain Settings List**: native list sections for location, language, notification, data sources, FAQ, privacy. Selected default.
- **B. Card Settings**: larger explanatory cards. Easier for onboarding but too bulky for normal settings.
- **C. Compact Utility Sheet**: bottom-sheet style controls. Useful for location/language quick changes, not the full settings screen.

Selected: **A. Plain Settings List**.

### 6. Onboarding and Permission Template

Purpose: collect minimum preferences and explain required permissions.

Three design variants:

- **A. Two-step Native Onboarding**: choose sensitive pollen types, then ask for location. Selected default.
- **B. Weather-app Permission First**: ask location immediately, then show value. Fast, but abrupt.
- **C. Guided Setup Cards**: explain pollen, dust, diary, notifications across several cards. Polished, but too long for MVP.

Selected: **A. Two-step Native Onboarding**.

Notification permission should not appear on first launch unless push notification support is implemented. Ask after the user has seen the app value, such as after the first successful forecast or from Settings.

### 7. Status Template

Purpose: handle loading, denied permissions, stale data, and API failures consistently.

Three design variants:

- **A. Inline Status Banner**: small banner above relevant data. Use for stale cache, fallback city, and partial data.
- **B. Empty State Screen**: full-screen state with retry. Use only when no usable data exists.
- **C. Bottom Sheet Explanation**: contextual explanation for permission denied or data source details. Use when the user asks for details.

Selected: use all three by severity:

- A for recoverable states
- B for blocking states
- C for explanations and permission recovery

## Visual System

The Flutter app should reuse the brand palette but not the website layout.

Colors:

- Background: `#F3EEE6`
- Surface: `#FFF9EF` or `#EDE8DC` depending on elevation
- Strong text: `#1E1A14`
- Muted text: `#7A6F5E`
- Accent: `#B85C38`
- Accent strong: `#8E4428`
- Secondary: `#3D4B72`
- Low: `#8A9E7E`
- Moderate: `#D4A847`
- High: `#B84C2F`
- Very high: `#C0392B`

Flutter shape rules:

- Use 16-24px radii for app cards and bottom sheets.
- Use 8-12px radii for chips, badges, and compact controls.
- Avoid the website's large editorial card layout.
- Use native bottom navigation and app bars.
- Use simple icon buttons for location refresh, language, settings, notification, and back actions.

Typography:

- Korean app UI can use Pretendard or the Flutter platform fallback if keeping the app lightweight.
- Use tabular numbers for scores, PM values, and dates.
- Keep titles practical and compact. Do not use website hero-scale editorial headings inside the app.

## Component System

Core Flutter components:

- `AchooAppShell`: bottom tab scaffold and shared app chrome
- `TodayScreen`: selected Today template
- `DailyDecisionCard`: primary action card from normalized recommendation
- `PollenDustSummary`: combined pollen/dust key metrics
- `SpeciesReadingList`: tree/grass/weed/pine/oak rows
- `ForecastStrip`: 7-day horizontal forecast
- `QuickSymptomCheckIn`: five severity choices
- `SymptomCheckerFlow`: symptoms, severity, result
- `GuideHubScreen`: guide category list and insight entry point
- `GuideDetailScreen`: native article base template
- `SettingsScreen`: list-based settings
- `OnboardingFlow`: sensitivity and location setup
- `PermissionPrompt`: reusable permission card/sheet
- `StatusBanner`, `BlockingState`, `InfoSheet`: status handling

## Data Flow

The Flutter app cannot directly import the existing TypeScript workspace packages. Treat the packages as behavioral references, then choose one of two implementation paths during planning:

- Port the needed recommendation and score logic to Dart for offline-capable app behavior.
- Or keep the recommendation calculation behind `achoo.day` API endpoints and let Flutter consume app-ready JSON.

For the first Flutter MVP, use the second path: **Flutter calls `achoo.day` app APIs and renders app-ready JSON**. This avoids exposing provider secrets in the mobile app and keeps the first implementation small.

Flutter data flow:

1. App starts.
2. Load local settings and cached forecast.
3. Resolve location or fallback city.
4. Fetch app-ready pollen, dust, and recommendation payloads from `achoo.day`.
5. Map the response into one Flutter `TodayState`.
6. Render recommendation, evidence, and forecast.
7. Render Today screen.
8. Save successful response as cache.

Local persistence:

- Symptom diary
- Last successful pollen/dust response
- Onboarding completion
- Sensitive pollen types
- Language
- Notification preference

## Error Handling

Use a calm, practical tone. Avoid alarmist copy.

Cases:

- **Location denied**: show fallback city and a Settings action to enable location.
- **Pollen succeeds, dust fails**: show pollen data and inline banner: "미세먼지 없이 꽃가루 중심으로 판단했어요."
- **Dust succeeds, pollen fails**: show dust data and inline banner.
- **Both fail, cache exists**: show cached data with stale banner.
- **Both fail, no cache**: show blocking retry state.
- **Off season**: show pollen off-season notice and emphasize dust plus general prevention.
- **Permission pending**: show skeleton/loading state without blocking the whole app longer than needed.

## Testing and Verification

Design verification:

- Each reusable template has three variants documented.
- Every current web route maps to one app tab/template or is explicitly excluded.
- App-only screens are included.
- No template depends on website-only layout patterns.

Implementation verification when built later:

- Flutter widget tests for Today, Journal, GuideHub, GuideDetail, Settings.
- Unit tests for recommendation mapping and cache fallback.
- Golden or screenshot tests for the seven templates in Korean at minimum.
- Manual checks on small phone, large phone, light mode.
- Text overflow checks for Korean, English, German, and French strings.

## Page Mapping Summary

| Web page | App destination | Template |
| --- | --- | --- |
| `/[locale]` | Today tab | Today Template |
| `/tips` | Journal detailed checker and Guide article | Journal Template, Reading Detail |
| `/pollen-info` | Guide | Reading Detail |
| `/allergy-types` | Guide | Reading Detail / Data Explainer |
| `/seasonal-calendar` | Guide | Reading Detail / Data Explainer |
| `/prevention-guide` | Guide | Reading Detail / Action Guide |
| `/dust-guide` | Guide | Reading Detail / Data Explainer |
| `/insights` | Guide | Guide List |
| `/insights/[slug]` | Guide | Reading Detail |
| `/faq` | Settings | Reading Detail / FAQ accordion |
| `/privacy` | Settings | Reading Detail |
| `/regions` | Excluded for MVP | Currently disabled on web |

## Out of Scope

- Creating the Flutter project
- Implementing code
- Push notification backend
- AdMob integration
- Region comparison page
- Account sync or server-side symptom diary
- Pixel-perfect visual design assets

## Implementation Defaults

These defaults remove ambiguity for the next planning step:

- App directory: `apps/mobile`.
- Framework: Flutter.
- API strategy: call `achoo.day` app APIs rather than direct provider APIs.
- First release locale: Korean first, with data/content structures kept locale-ready for English, German, and French.
- Ads: out of scope for the first design implementation unless explicitly added later.
- Notifications: design the permission/settings surface, but do not request notification permission until push delivery exists.
