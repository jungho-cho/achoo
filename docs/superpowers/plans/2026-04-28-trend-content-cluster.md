# Trend Content Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four fully localized trend-focused insight articles to Achoo while preserving the existing article architecture and catching content-data mistakes during verification.

**Architecture:** Keep the static article model: catalog records define routes and ordering, source records define citations, and locale maps provide rendered article copy. Add one small content validation guard in `apps/web/lib/articles.ts` so missing locales, missing sources, duplicate slugs, and broken related links fail during type check or build instead of silently shipping.

**Tech Stack:** Next.js 16 app router, TypeScript, `next-intl`, static article data under `apps/web/content/articles`, pnpm/turbo verification.

---

## File Structure

- Modify `apps/web/lib/articles.ts`
  - Responsibility: read article data and validate static content consistency at module load.
  - Add a private `validateArticleContent()` function and call it once.

- Modify `apps/web/content/articles/sources.ts`
  - Responsibility: source metadata used by article pages.
  - Add public-source entries for April 2026 Korean pollen signals, the 2026 Climate Central allergy-season analysis, CDC common cold, CDC conjunctivitis, and Mayo Clinic skin references.

- Modify `apps/web/content/articles/catalog.ts`
  - Responsibility: route-level article metadata, ordering, tags, sources, and related links.
  - Add four records: `cold-vs-pollen-allergy`, `pine-pollen-yellow-dust`, `itchy-eyes-pollen-conjunctivitis`, `skin-allergy-pollen-dust`.

- Modify `apps/web/content/articles/localizations.ts`
  - Responsibility: rendered article content for `ko`, `en`, `de`, and `fr`.
  - Add four localized objects to each locale map: `KO`, `EN`, `DE`, `FR`.

No new route, UI component, CMS layer, API endpoint, package dependency, or automation job is part of this plan.

---

### Task 1: Add Article Content Validation

**Files:**
- Modify: `apps/web/lib/articles.ts`

- [ ] **Step 1: Add the validation call before the function exists**

In `apps/web/lib/articles.ts`, add `validateArticleContent();` after the imports and before `function getLocalization`.

```ts
validateArticleContent();
```

- [ ] **Step 2: Run type check and confirm the failure**

Run:

```bash
pnpm check-types
```

Expected: FAIL with a TypeScript error equivalent to `Cannot find name 'validateArticleContent'`.

- [ ] **Step 3: Add the validation implementation**

Update the schema import to include `ARTICLE_LOCALES`:

```ts
import {
  ARTICLE_LOCALES,
  type ArticleCatalogEntry,
  type ArticleLocale,
  type ArticleLocalization,
  type ArticleRecord,
} from "../content/articles/schema";
```

Add this function above `validateArticleContent();`:

```ts
function validateArticleContent() {
  const errors: string[] = [];
  const articleIds = new Set<string>();
  const slugs = new Set<string>();

  for (const entry of ARTICLE_CATALOG) {
    if (articleIds.has(entry.id)) {
      errors.push(`Duplicate article id: ${entry.id}`);
    }
    articleIds.add(entry.id);

    if (slugs.has(entry.slug)) {
      errors.push(`Duplicate article slug: ${entry.slug}`);
    }
    slugs.add(entry.slug);
  }

  for (const entry of ARTICLE_CATALOG) {
    for (const sourceId of entry.sourceIds) {
      if (!ARTICLE_SOURCES[sourceId]) {
        errors.push(`Article ${entry.id} references missing source ${sourceId}`);
      }
    }

    for (const relatedId of entry.relatedIds) {
      if (!articleIds.has(relatedId)) {
        errors.push(`Article ${entry.id} references missing related article ${relatedId}`);
      }
    }

    for (const locale of ARTICLE_LOCALES) {
      const localizationCount = ARTICLE_LOCALIZATIONS.filter(
        (item) => item.articleId === entry.id && item.locale === locale,
      ).length;

      if (localizationCount !== 1) {
        errors.push(
          `Article ${entry.id} has ${localizationCount} ${locale} localizations`,
        );
      }
    }
  }

  for (const localization of ARTICLE_LOCALIZATIONS) {
    if (!articleIds.has(localization.articleId)) {
      errors.push(
        `Localization ${localization.locale}/${localization.articleId} references missing article`,
      );
    }

    const blockIds = new Set<string>();
    for (const block of localization.blocks) {
      if (blockIds.has(block.id)) {
        errors.push(
          `Localization ${localization.locale}/${localization.articleId} has duplicate block id ${block.id}`,
        );
      }
      blockIds.add(block.id);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid article content:\n${errors.join("\n")}`);
  }
}

validateArticleContent();
```

- [ ] **Step 4: Run type check and confirm the pass**

Run:

```bash
pnpm check-types
```

Expected: PASS.

- [ ] **Step 5: Do not commit yet**

This change is useful only when paired with the new content. Keep it staged or unstaged until Task 6 passes all verification.

---

### Task 2: Add Sources And Catalog Records

**Files:**
- Modify: `apps/web/content/articles/sources.ts`
- Modify: `apps/web/content/articles/catalog.ts`

- [ ] **Step 1: Add source entries**

In `apps/web/content/articles/sources.ts`, insert these entries before the final closing `};`:

```ts
  "donga-kma-pollen-2026": {
    id: "donga-kma-pollen-2026",
    title: "4월 꽃가루 지수, 전년보다 4배 이상 증가",
    href: "https://www.donga.com/news/amp/all/20260417/133757552/1",
    publisher: "Donga / Newsis",
  },
  "korea-national-arboretum-pine-pollen-2026": {
    id: "korea-national-arboretum-pine-pollen-2026",
    title: "송홧가루 비산 시기 조기화 분석",
    href: "https://news.nate.com/view/20260423n13110",
    publisher: "Korea National Arboretum / Newsis",
  },
  "climate-central-2026-allergy-season": {
    id: "climate-central-2026-allergy-season",
    title: "2026 Allergy Season",
    href: "https://www.climatecentral.org/climate-matters/2026-allergy-season",
    publisher: "Climate Central",
  },
  "guardian-lancet-europe-pollen-2026": {
    id: "guardian-lancet-europe-pollen-2026",
    title: "Pollen season in UK and mainland Europe extended by climate breakdown",
    href: "https://www.theguardian.com/environment/2026/apr/22/pollen-season-in-uk-and-mainland-europe-extended-by-climate-breakdown",
    publisher: "The Guardian",
  },
  "cdc-common-cold": {
    id: "cdc-common-cold",
    title: "About Common Cold",
    href: "https://www.cdc.gov/common-cold/about/index.html",
    publisher: "CDC",
  },
  "cdc-pink-eye-symptoms": {
    id: "cdc-pink-eye-symptoms",
    title: "Symptoms of Pink Eye",
    href: "https://www.cdc.gov/conjunctivitis/signs-symptoms/index.html",
    publisher: "CDC",
  },
  "mayo-itchy-skin": {
    id: "mayo-itchy-skin",
    title: "Itchy skin: Symptoms and causes",
    href: "https://www.mayoclinic.org/diseases-conditions/itchy-skin/symptoms-causes/syc-20355006",
    publisher: "Mayo Clinic",
  },
  "mayo-contact-dermatitis": {
    id: "mayo-contact-dermatitis",
    title: "Contact dermatitis: Symptoms and causes",
    href: "https://www.mayoclinic.org/diseases-conditions/contact-dermatitis/symptoms-causes/syc-20352742",
    publisher: "Mayo Clinic",
  },
```

- [ ] **Step 2: Add catalog records**

In `apps/web/content/articles/catalog.ts`, insert these four records before the existing `adult-onset-allergy-after-moving` record so fresh content appears above older evergreen content:

```ts
  {
    id: "cold-vs-pollen-allergy",
    slug: "cold-vs-pollen-allergy",
    publishedAt: "2026-04-28",
    updatedAt: "2026-04-28",
    featured: false,
    priority: 98,
    theme: "blue",
    tags: ["symptoms", "cold", "forecast"],
    sourceIds: ["cdc-common-cold", "aaaai-hay-fever", "acaai-seasonal-allergies"],
    relatedIds: [
      "forecast-vs-count-pollen",
      "when-allergies-need-a-clinic-plan",
      "outdoor-timing-on-high-pollen-days",
    ],
  },
  {
    id: "pine-pollen-yellow-dust",
    slug: "pine-pollen-yellow-dust",
    publishedAt: "2026-04-28",
    updatedAt: "2026-04-28",
    featured: false,
    priority: 95,
    theme: "amber",
    tags: ["seasonality", "pollen", "air-quality"],
    sourceIds: [
      "korea-national-arboretum-pine-pollen-2026",
      "donga-kma-pollen-2026",
      "climate-central-2026-allergy-season",
      "cdc-pollen-health",
    ],
    relatedIds: [
      "longer-pollen-seasons",
      "pollen-dust-heat-days",
      "home-hepa-pollen-routine",
    ],
  },
  {
    id: "itchy-eyes-pollen-conjunctivitis",
    slug: "itchy-eyes-pollen-conjunctivitis",
    publishedAt: "2026-04-28",
    updatedAt: "2026-04-28",
    featured: false,
    priority: 89,
    theme: "rose",
    tags: ["eyes", "symptoms", "care"],
    sourceIds: ["acaai-eye-allergy", "cdc-pink-eye-symptoms", "kdca-eye-allergy"],
    relatedIds: [
      "eye-allergy-reset",
      "pollen-dust-heat-days",
      "when-allergies-need-a-clinic-plan",
    ],
  },
  {
    id: "skin-allergy-pollen-dust",
    slug: "skin-allergy-pollen-dust",
    publishedAt: "2026-04-28",
    updatedAt: "2026-04-28",
    featured: false,
    priority: 87,
    theme: "amber",
    tags: ["skin", "air-quality", "routine"],
    sourceIds: [
      "mayo-itchy-skin",
      "mayo-contact-dermatitis",
      "pubmed-pollution-review",
      "cdc-pollen-health",
    ],
    relatedIds: [
      "pollen-dust-heat-days",
      "home-hepa-pollen-routine",
      "outdoor-timing-on-high-pollen-days",
    ],
  },
```

- [ ] **Step 3: Run build and confirm validation catches missing localizations**

Run:

```bash
pnpm build
```

Expected: FAIL with `Invalid article content` and missing localization messages for the four new article ids across `ko`, `en`, `de`, and `fr`.

---

### Task 3: Add `cold-vs-pollen-allergy` Localizations

**Files:**
- Modify: `apps/web/content/articles/localizations.ts`

- [ ] **Step 1: Add one `cold-vs-pollen-allergy` object to each locale map**

Add an object keyed by `"cold-vs-pollen-allergy"` inside `KO`, `EN`, `DE`, and `FR`.

Each object must use `articleId: "cold-vs-pollen-allergy"` and these exact block ids and block types:

| Block id | Block type | Required content |
| --- | --- | --- |
| `symptom-pattern` | `comparison` | Compare cold, pollen allergy, and care signals. |
| `morning-check` | `checklist` | Four morning decision items. |
| `why-it-feels-like-cold` | `section` | Two or three paragraphs about overlap without diagnosis. |
| `care-signal` | `quote` | One safety-oriented summary quote. |

Each object must include exactly three FAQ items covering fever, duration, and care-seeking signal. Each object must end with `cta: createCta(locale, title, body)`, using the literal locale string for that locale.

Use these localized metadata values:

| Locale | Eyebrow | Title | SEO title focus |
| --- | --- | --- | --- |
| `ko` | 증상 구분 | 감기 아닌데 콧물·재채기만 계속될 때, 꽃가루 알레르기인지 보는 법 | 감기와 꽃가루 알레르기 차이 |
| `en` | Symptom check | Cold or pollen allergy? How to read symptoms before you head out | cold vs pollen allergy |
| `de` | Symptome einordnen | Erkältung oder Pollenallergie? So lesen Sie die Signale vor dem Rausgehen | Erkältung oder Pollenallergie |
| `fr` | Lecture des symptômes | Rhume ou allergie au pollen ? Les signes à vérifier avant de sortir | rhume ou allergie au pollen |

Content requirements:

- The comparison rows must compare fever/body aches, itchiness, mucus pattern, timing, contagiousness, and care signals.
- The checklist must be a four-step morning routine: check fever, check itch pattern, check today's forecast, adjust outdoor plan.
- The section must explain that pollen symptoms can mimic a cold without diagnosing the reader.
- The quote must say that fever, wheezing, shortness of breath, severe pain, or worsening symptoms move the situation from forecast planning to clinical care.
- Korean copy must include "열 없는 콧물", "재채기", and "꽃가루 예보" naturally.
- English, German, and French copy must use local search language and not mention Korean-only source details.

- [ ] **Step 2: Run build and confirm remaining localization failures**

Run:

```bash
pnpm build
```

Expected: FAIL with missing localization messages for `pine-pollen-yellow-dust`, `itchy-eyes-pollen-conjunctivitis`, and `skin-allergy-pollen-dust`. There should be no missing localization message for `cold-vs-pollen-allergy`.

---

### Task 4: Add `pine-pollen-yellow-dust` Localizations

**Files:**
- Modify: `apps/web/content/articles/localizations.ts`

- [ ] **Step 1: Add one `pine-pollen-yellow-dust` object to each locale map**

Add an object keyed by `"pine-pollen-yellow-dust"` inside `KO`, `EN`, `DE`, and `FR`.

Each object must use `articleId: "pine-pollen-yellow-dust"` and these exact block ids and block types:

| Block id | Block type | Required content |
| --- | --- | --- |
| `visible-pollen` | `section` | Explain why visible pollen is not the whole allergy story. |
| `compare-pollen-dust` | `table` | Compare visible pollen, allergy-triggering pollen, dust, fine particles, and yellow dust where relevant. |
| `ventilation-cleaning` | `checklist` | Five home routine items. |
| `forecast-over-visible` | `quote` | One forecast-first summary quote. |

Each object must include exactly three FAQ items covering visible yellow powder, ventilation, and cleaning or washing. Each object must end with `cta: createCta(locale, title, body)`, using the literal locale string for that locale.

Use these localized metadata values:

| Locale | Eyebrow | Title | SEO title focus |
| --- | --- | --- | --- |
| `ko` | 송홧가루 · 노란 가루 | 송홧가루가 많이 날릴 때, 진짜 알레르기 위험은 어떻게 봐야 할까 | 송홧가루 시기와 꽃가루 알레르기 |
| `en` | Visible pollen | Yellow pollen everywhere: what it does and does not tell you about allergy risk | yellow pollen and allergy risk |
| `de` | Sichtbarer Pollen | Gelber Pollen überall: Was er über Allergierisiko verrät und was nicht | gelber Pollen und Allergierisiko |
| `fr` | Pollen visible | Poudre jaune partout : ce qu’elle dit vraiment du risque allergique | pollen jaune et risque allergique |

Content requirements:

- Korean copy must cite the 2026 pine-pollen trend signal as a public-data example: pine pollen dispersal has moved earlier by about 0.91 days per year since 2010.
- Korean copy must distinguish 송홧가루, 참나무/자작나무 등 알레르기 원인 꽃가루, 미세먼지, 황사.
- English, German, and French copy must frame the topic as visible pollen versus symptom-triggering pollen; do not center "songhwa" terminology.
- The table must have columns equivalent to "What you see", "What it means", and "What to do today".
- The checklist must cover windows, laundry, wiping surfaces, showering after outdoor exposure, and checking pollen/dust together.
- The quote must reinforce that visible dust is a cue to check the forecast, not a full risk measurement.

- [ ] **Step 2: Run build and confirm remaining localization failures**

Run:

```bash
pnpm build
```

Expected: FAIL with missing localization messages for `itchy-eyes-pollen-conjunctivitis` and `skin-allergy-pollen-dust`. There should be no missing localization message for `pine-pollen-yellow-dust`.

---

### Task 5: Add `itchy-eyes-pollen-conjunctivitis` Localizations

**Files:**
- Modify: `apps/web/content/articles/localizations.ts`

- [ ] **Step 1: Add one `itchy-eyes-pollen-conjunctivitis` object to each locale map**

Add an object keyed by `"itchy-eyes-pollen-conjunctivitis"` inside `KO`, `EN`, `DE`, and `FR`.

Each object must use `articleId: "itchy-eyes-pollen-conjunctivitis"` and these exact block ids and block types:

| Block id | Block type | Required content |
| --- | --- | --- |
| `eye-patterns` | `comparison` | Compare allergic conjunctivitis, infectious conjunctivitis, and dry-eye-like irritation. |
| `same-day-eye-routine` | `checklist` | Six same-day eye-care decision items. |
| `overlap-days` | `section` | Explain pollen, dust, and screen-heavy overlap days. |
| `vision-warning` | `quote` | One quote about pain, light sensitivity, vision change, discharge, and contact lens pain. |

Each object must include exactly three FAQ items covering contagiousness, contact lenses, and urgent eye symptoms. Each object must end with `cta: createCta(locale, title, body)`, using the literal locale string for that locale.

Use these localized metadata values:

| Locale | Eyebrow | Title | SEO title focus |
| --- | --- | --- | --- |
| `ko` | 눈 가려움 · 결막염 | 눈이 가렵고 충혈될 때, 꽃가루 알레르기와 결막염을 구분하는 법 | 눈 가려움 꽃가루 알레르기 결막염 |
| `en` | Itchy eyes | Itchy red eyes on pollen days: allergy, pink eye, or dryness? | itchy eyes pollen allergy vs pink eye |
| `de` | Juckende Augen | Juckende rote Augen an Pollentagen: Allergie, Bindehautentzündung oder Trockenheit? | juckende Augen Pollenallergie |
| `fr` | Yeux qui grattent | Yeux rouges qui grattent les jours de pollen : allergie, conjonctivite ou sécheresse ? | yeux qui grattent allergie pollen |

Content requirements:

- The comparison rows must separate allergic conjunctivitis, infectious conjunctivitis, and dry-eye-like irritation.
- Include signs from ACAAI and CDC sources without diagnosing: itching, redness, watery discharge, crusting, colored discharge, pain, light sensitivity, and contact lens discomfort.
- The checklist must cover not rubbing, pausing contact lenses, using clean towels, washing hands, reducing outdoor exposure, and seeking care for pain or vision changes.
- The section must distinguish this article from `eye-allergy-reset`: this page is about sorting signals; the existing page remains the same-day reset routine.
- The quote must clearly state that eye pain, light sensitivity, vision change, severe discharge, or contact lens pain should be handled as a care issue.

- [ ] **Step 2: Run build and confirm remaining localization failures**

Run:

```bash
pnpm build
```

Expected: FAIL with missing localization messages for `skin-allergy-pollen-dust`. There should be no missing localization message for `itchy-eyes-pollen-conjunctivitis`.

---

### Task 6: Add `skin-allergy-pollen-dust` Localizations

**Files:**
- Modify: `apps/web/content/articles/localizations.ts`

- [ ] **Step 1: Add one `skin-allergy-pollen-dust` object to each locale map**

Add an object keyed by `"skin-allergy-pollen-dust"` inside `KO`, `EN`, `DE`, and `FR`.

Each object must use `articleId: "skin-allergy-pollen-dust"` and these exact block ids and block types:

| Block id | Block type | Required content |
| --- | --- | --- |
| `skin-barrier-pressure` | `section` | Explain compounding irritation from pollen, dust, wind, sweat, and UV. |
| `day-timeline` | `timeline` | Three items: before going out, while outside, after returning home. |
| `return-home-checklist` | `checklist` | Five return-home skin barrier routine items. |
| `rash-warning` | `quote` | One quote about spreading rash, blistering, swelling, fever, severe itch, and food or medication exposure. |

Each object must include exactly three FAQ items covering itch versus rash, showering or cleansing, and care-seeking signal. Each object must end with `cta: createCta(locale, title, body)`, using the literal locale string for that locale.

Use these localized metadata values:

| Locale | Eyebrow | Title | SEO title focus |
| --- | --- | --- | --- |
| `ko` | 피부 · 미세먼지 | 봄철 피부 가려움, 꽃가루와 미세먼지가 함께 있는 날 어떻게 관리할까 | 봄철 피부 알레르기 꽃가루 미세먼지 |
| `en` | Skin routine | Pollen, dust, and itchy spring skin: a practical barrier routine | pollen dust itchy skin routine |
| `de` | Hautroutine | Pollen, Staub und juckende Frühlingshaut: eine ruhige Barriere-Routine | Pollen Staub juckende Haut |
| `fr` | Routine peau | Pollen, poussières et peau qui gratte au printemps : une routine barrière simple | pollen poussière peau qui gratte |

Content requirements:

- The section must explain compounding irritation from pollen, fine dust, dry wind, sweat, and UV exposure without claiming pollen alone causes every rash.
- The timeline must have three items: before going out, while outside, after returning home.
- The checklist must cover gentle cleansing, fragrance-free moisturizer, separating outdoor clothes, changing pillowcases or towels when symptoms flare, and avoiding scratching.
- The quote must direct users toward care for spreading rash, blistering, swelling, fever, severe itch disrupting sleep, or symptoms after food/medication exposure.
- Korean copy must include "봄철 피부 가려움", "꽃가루", "미세먼지", and "보습" naturally.

- [ ] **Step 2: Run build and confirm validation passes**

Run:

```bash
pnpm build
```

Expected: PASS. The build should show 109 generated static pages: existing 93 pages plus 16 new localized article routes.

- [ ] **Step 3: Commit the content and validation changes**

Run:

```bash
git add apps/web/lib/articles.ts apps/web/content/articles/sources.ts apps/web/content/articles/catalog.ts apps/web/content/articles/localizations.ts
git commit -m "feat: add trend content insight cluster"
```

Expected: commit succeeds after pre-commit verification.

---

### Task 7: Final Verification

**Files:**
- Read-only verification of generated routes and metadata.

- [ ] **Step 1: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 2: Run type check**

Run:

```bash
pnpm check-types
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS and include static article route output with the new slug count reflected by 109 generated static pages.

- [ ] **Step 4: Verify the sitemap contains all new localized URLs**

Run:

```bash
pnpm --filter web build
npx tsx -e "import sitemap from './apps/web/app/sitemap.ts'; const urls=sitemap().map((item)=>item.url); const slugs=['cold-vs-pollen-allergy','pine-pollen-yellow-dust','itchy-eyes-pollen-conjunctivitis','skin-allergy-pollen-dust']; const locales=['ko','en','de','fr']; const missing=[]; for (const slug of slugs) for (const locale of locales) { const url='https://achoo.day/'+locale+'/insights/'+slug; if (!urls.includes(url)) missing.push(url); } if (missing.length) { console.error(missing.join('\\n')); process.exit(1); } console.log('all new insight URLs present');"
```

Expected: `all new insight URLs present`.

- [ ] **Step 5: Verify article records load for all locales**

Run:

```bash
npx tsx -e "import { getArticleBySlug } from './apps/web/lib/articles.ts'; const slugs=['cold-vs-pollen-allergy','pine-pollen-yellow-dust','itchy-eyes-pollen-conjunctivitis','skin-allergy-pollen-dust']; const locales=['ko','en','de','fr']; for (const slug of slugs) for (const locale of locales) { const article=getArticleBySlug(locale as any, slug); if (!article) { throw new Error(locale+'/'+slug+' missing'); } if (article.content.blocks.length < 4) { throw new Error(locale+'/'+slug+' has too few blocks'); } } console.log('all new article records load');"
```

Expected: `all new article records load`.

---

## Self-Review Notes

Spec coverage:

- Four article ids are covered in Tasks 2-6.
- Existing architecture reuse is covered by touching only article data and `apps/web/lib/articles.ts`.
- Source, SEO, localization, medical safety, and internal-link requirements are covered in the per-article content requirements.
- Verification commands match the approved spec: `pnpm lint`, `pnpm check-types`, and `pnpm build`.

Plan constraints:

- No new UI, CMS, route, API, or automation task is introduced.
- The content validation guard keeps data mistakes visible during build.
- Article copy is constrained by exact ids, block ids, metadata, source ids, and medical-safety rules so implementation can proceed without design decisions.
