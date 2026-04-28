# Trend Content Cluster Design

Date: 2026-04-28
Status: Shipped and deployed
Project: Achoo web

## Purpose

Achoo is starting to index. The next content addition should increase the number of useful indexed pages without diluting the site's health-weather focus. The preferred priority is:

1. Multilingual evergreen expansion
2. Korean search demand that is active in April 2026
3. Internal-link density for indexing
4. Product or affiliate intent as a secondary benefit

The design is a four-article multilingual insight cluster about 2026 pollen-season shifts and everyday symptom decisions. The cluster uses the existing article catalog, localization, source, route, sitemap, and JSON-LD systems.

## Trend Basis

The topic selection is based on current public signals:

- Korean pollen intensity rose sharply in April 2026. Donga/Newsis reported that Korea's cumulative pollen index from April 1 to April 16, 2026 was 1,178, more than four times the 277 recorded during the same period in 2025, citing KMA data.
- Korea's visible pine pollen season is moving earlier. The Korea National Arboretum reported on April 23, 2026 that pine pollen dispersal has moved earlier by about 0.91 days per year since 2010 on a national average, with stronger shifts in southern regions.
- Climate Central's March 4, 2026 analysis reports that freeze-free growing seasons lengthened in 173 of 198 analyzed U.S. cities by 21 days on average from 1970 to 2025.
- European reporting on the Lancet Countdown highlights pollen-season extension in the UK and mainland Europe, with birch, alder, and olive seasons starting one to two weeks earlier in 2015-2024 than in 1991-2000.

Primary source links:

- https://www.donga.com/news/amp/all/20260417/133757552/1
- https://news.nate.com/view/20260423n13110
- https://www.climatecentral.org/climate-matters/2026-allergy-season
- https://www.theguardian.com/environment/2026/apr/22/pollen-season-in-uk-and-mainland-europe-extended-by-climate-breakdown

## Chosen Approach

Use a multilingual season-trend cluster.

This approach adds four fully localized insight articles across `ko`, `en`, `de`, and `fr`. Each article targets a durable global search intent while giving the Korean version stronger references to current Korean search demand and public data.

Rejected alternatives:

- Korean-only hot trend content: faster for immediate Korean searches, but it would weaken the site's current four-locale article model and create missing-locale behavior to manage.
- Many short internal-link pages: useful for index surface area, but too shallow for a health-adjacent YMYL topic and less aligned with Achoo's calm editorial positioning.

## Article Set

### 1. `cold-vs-pollen-allergy`

Intent: Help users distinguish a cold-like day from pollen-allergy-like patterns before going out.

Korean angle:

- "감기 아닌데 콧물"
- "열 없는 콧물 재채기"
- "꽃가루 알레르기 감기 차이"

International angle:

- "cold vs pollen allergy"
- "hay fever or cold"
- "runny nose without fever during pollen season"

Planned blocks:

- Comparison block: cold, pollen allergy, and clinical warning signs
- Checklist block: a one-minute morning decision routine
- Section block: why pollen days can feel like a cold without fever
- FAQ: fever, duration, medication timing, and when to seek care

Related links:

- `forecast-vs-count-pollen`
- `when-allergies-need-a-clinic-plan`
- `outdoor-timing-on-high-pollen-days`

### 2. `pine-pollen-yellow-dust`

Intent: Explain the difference between visible yellow pollen, allergy-triggering pollen, dust, and fine particles.

Korean angle:

- "송홧가루 시기"
- "노란 꽃가루 알레르기"
- "송홧가루 환기 청소"
- Include the Korea National Arboretum trend signal that pine pollen dispersal has moved earlier by about 0.91 days per year since 2010.

International angle:

- Do not over-index on Korea-specific "songhwa" terminology.
- Frame as "visible yellow pollen vs the pollens that trigger symptoms."
- For German and French, connect to birch, alder, grass, and ragweed where natural.

Planned blocks:

- Section block: why visible pollen is not always the whole allergy story
- Table block: pine pollen, tree pollen, dust, fine particles, and yellow dust
- Checklist block: ventilation and cleaning decisions on visible-pollen days
- Quote block: respond to symptoms and forecasts, not only to what is visible

Related links:

- `longer-pollen-seasons`
- `pollen-dust-heat-days`
- `home-hepa-pollen-routine`

### 3. `itchy-eyes-pollen-conjunctivitis`

Intent: Help users separate pollen-related itchy eyes from infection-like or dryness-like patterns.

Relationship to existing content:

- Existing `eye-allergy-reset` remains the "same-day reset routine" article.
- This new article owns the "symptom distinction and warning signs" intent.

Planned blocks:

- Comparison block: allergic conjunctivitis, infectious conjunctivitis, dry eye
- Checklist block: avoid rubbing, rest contact lenses, avoid towel sharing, know care signals
- Section block: why pollen, dust, and screen-heavy days can overlap
- FAQ: itching vs pain, contagiousness, contact lenses, and when vision changes matter

Related links:

- `eye-allergy-reset`
- `pollen-dust-heat-days`
- `when-allergies-need-a-clinic-plan`

### 4. `skin-allergy-pollen-dust`

Intent: Cover skin itching, irritation, and barrier stress on spring days with pollen, dust, wind, and sun exposure.

Korean angle:

- "봄철 피부 알레르기"
- "꽃가루 미세먼지 피부 가려움"
- "봄 피부 트러블"

International angle:

- "pollen and skin irritation"
- "spring allergies skin itching"
- "dust pollen sensitive skin routine"

Planned blocks:

- Section block: why pollen, dust, dry wind, and UV can compound skin irritation
- Timeline block: before going out, while outside, after returning home
- Checklist block: cleansing, moisturizer, clothing separation, scratch prevention
- FAQ: rash vs dryness, when to seek care, and how to reduce repeat exposure

Related links:

- `pollen-dust-heat-days`
- `home-hepa-pollen-routine`
- `outdoor-timing-on-high-pollen-days`

## Architecture

Use the existing article architecture only:

- Add four records to `apps/web/content/articles/catalog.ts`.
- Add source definitions to `apps/web/content/articles/sources.ts`.
- Add `ko`, `en`, `de`, and `fr` localizations to `apps/web/content/articles/localizations.ts`.
- Keep all content within the existing schema in `apps/web/content/articles/schema.ts`.
- Reuse `TrendArticlePage`, `TrendArticleBlocks`, `ArticleLayout`, `getArticles`, `getArticleBySlug`, `generateStaticParams`, and `sitemap` unchanged unless a compile-time issue proves a small supporting change is required.

No new UI components, CMS, route handlers, API integrations, or automated trend collectors are part of this scope.

## Data Flow

1. `ARTICLE_CATALOG` defines each article id, slug, priority, tags, sources, and related ids.
2. `ARTICLE_LOCALIZATIONS` provides localized metadata, summaries, blocks, FAQ, and CTA for each article id and locale.
3. `getArticles(locale)` maps catalog entries to localized article records for the insights hub.
4. `getArticleBySlug(locale, slug)` maps the slug to catalog entry, localization, and sources for detail pages.
5. `generateStaticParams()` creates routes from `ARTICLE_CATALOG`.
6. `sitemap()` creates localized URLs and alternates from `ARTICLE_CATALOG`.
7. `getArticleJsonLd()` outputs Article and FAQ JSON-LD from the same record.

## SEO Rules

- Titles should match natural user questions, not clickbait.
- Korean titles may use active April 2026 phrasing such as "감기 아닌데", "송홧가루", "눈 가려움", and "피부 가려움".
- International titles should use local natural-language search intent instead of literal Korean translation.
- Meta descriptions should explain the decision the reader can make after reading.
- Each article should include 2-4 FAQ items with practical, non-diagnostic answers.
- Tags should describe the article's search and internal-link themes, for example `symptoms`, `forecast`, `eyes`, `skin`, `indoor-air`, `seasonality`, `air-quality`.

## Localization Rules

- Localize intent, not just words.
- Korean versions can cite Korean April 2026 signals directly when relevant.
- English, German, and French versions should frame Korea-specific examples as regional examples or omit them when they would feel unnatural.
- Keep medical caveats consistent across locales.
- Preserve the current site voice: calm, useful, non-alarming, and practical.

## Medical Safety Rules

The articles must not diagnose, prescribe, or promise treatment.

Every article should clearly direct users toward clinical care when symptoms suggest higher risk. Signals include:

- Wheezing, shortness of breath, or chest tightness
- Facial, lip, tongue, or throat swelling
- Eye pain, light sensitivity, vision changes, or severe discharge
- High fever or severe body aches
- Symptoms that persist, worsen, or disrupt daily life despite reasonable avoidance routines
- Skin symptoms that spread quickly, blister, involve swelling, or follow medication or food exposure
- Skin symptoms after food or medication exposure with breathing trouble, throat/lip/tongue swelling, dizziness, fainting, or rapid whole-body symptoms should be framed as urgent/emergency signals, not routine skin care.

## Error Handling And Consistency Checks

Implementation should avoid broken content data:

- Every new `sourceId` must exist in `ARTICLE_SOURCES`.
- Every new article must have all four locales: `ko`, `en`, `de`, `fr`.
- Every `relatedId` must point to an existing article id.
- Slugs must be unique.
- Article ids must be unique.
- Block ids should be unique within each article.
- Blocks should only use schema-supported fields and block types.
- FAQ answers should be factual and not overstate medical certainty.

## Verification Plan

After implementation, run the repo's normal verification path:

- Run `pnpm lint` from the repo root.
- Run `pnpm check-types` from the repo root.
- Run `pnpm build` from the repo root.
- Confirm the four new slugs render for `ko`, `en`, `de`, and `fr`.
- Confirm sitemap entries are produced for the four new slugs and all four locales.
- If the implementation adds a content consistency test, include the checks listed above.

## Out Of Scope

- New article page UI
- New insight hub layout
- CMS migration
- Google Trends or Naver DataLab automation
- Programmatic SEO factory
- Affiliate-link optimization inside the new articles
- Korean-only article publishing
- Medical advice beyond public-health style guidance and care-seeking signals

## Approval Notes

The user approved:

- Priority order: multilingual evergreen, Korean trend demand, indexing, affiliate as secondary
- Four-article cluster scope
- Existing architecture and block reuse
- Public-source and medical-safety criteria
- No new UI or automation in this implementation

## Implementation Outcome

Completed on 2026-04-28.

- Added four trend-focused insight articles: `cold-vs-pollen-allergy`, `pine-pollen-yellow-dust`, `itchy-eyes-pollen-conjunctivitis`, and `skin-allergy-pollen-dust`.
- Added all four locales for each article: `ko`, `en`, `de`, and `fr`.
- Added static article validation in `apps/web/lib/articles.ts` for duplicate ids/slugs, missing sources, missing localizations, broken related ids, and duplicate block ids.
- Strengthened `skin-allergy-pollen-dust` medical-safety copy with ACAAI-supported urgent reaction signals after food or medication exposure.
- Corrected eye-allergy attribution to match the configured AAAAI source.
- Merged to `master`, pushed to `origin/master`, and deployed to Cloudflare Workers.
- Deployment version: `ab922f49-737b-4c7c-addf-b7fa6fb9c1e6`.
- Verified live `https://achoo.day/sitemap.xml` includes the new article URLs for all four locales.
