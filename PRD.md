# RefiRateBoard — PRD
## Refinance Rates Updated Daily

---

## 1. Overview

**Service Name:** RefiRateBoard
**Tagline:** "Compare today's refinance rates — find your best refi deal"
**URL Pattern:** `refi-rate-board.vercel.app`
**GitHub Repo:** `taeshin11/refi-rate-board`

RefiRateBoard is a mortgage refinance rate comparison dashboard. It sources current rate benchmarks from the FRED (Federal Reserve Economic Data) free API and supplements with manually maintained lender rate data via Google Sheets. Users can compare rates by loan type, state, and lender, and use a built-in refinance calculator to estimate savings.

**Target Users:**
- Homeowners considering refinancing their mortgage
- First-time refi shoppers who don't know where to start
- Real estate investors comparing refi options for rental properties
- Financial planners and mortgage brokers researching rate environments
- Personal finance bloggers and content creators

---

## 2. Core Features

| ID  | Feature                                           | Priority |
|-----|---------------------------------------------------|----------|
| F01 | Homepage rate dashboard (30yr, 15yr, ARM rates)   | P0       |
| F02 | Lender pages `/lenders/[slug]`                    | P0       |
| F03 | State pages `/states/[state]`                     | P0       |
| F04 | Loan type pages `/loan-types/[type]`              | P0       |
| F05 | Refinance calculator `/calculator`                | P0       |
| F06 | Rate trend chart (52-week history) via Chart.js   | P0       |
| F07 | Rate comparison table (all lenders sortable)      | P1       |
| F08 | Break-even analysis in calculator                 | P1       |
| F09 | i18n support (8 languages)                        | P1       |
| F10 | Visitor counter (footer)                          | P1       |
| F11 | Google Sheets webhook on interaction              | P1       |
| F12 | Adsterra ad placements                            | P1       |
| F13 | Sitemap + hreflang + schema.org                   | P0       |
| F14 | ISR revalidation every 24 hours                   | P0       |
| F15 | research_history/ milestone logs                  | P2       |

---

## 3. Tech Stack

| Layer       | Technology                                         |
|-------------|---------------------------------------------------|
| Framework   | Next.js 14 (App Router, SSG + ISR)                |
| Styling     | Tailwind CSS v3 (mobile-first, pastel palette)    |
| Charts      | Chart.js 4 + react-chartjs-2                      |
| Data        | FRED API (free) + Google Sheets CSV               |
| Fallback    | `data/rates-fallback.json`                        |
| Deployment  | Vercel (`npx vercel --prod`)                      |
| Repo        | GitHub via `gh` CLI (`taeshin11/refi-rate-board`) |
| i18n        | `next-intl`                                       |
| SEO         | `next-sitemap`, JSON-LD schema                    |
| Analytics   | Vercel Analytics (free tier)                      |
| Ads         | Adsterra (Social Bar + Native Banner + Display)   |

---

## 4. Data Sources

### Primary: FRED API (Federal Reserve Economic Data)
**Base URL:** `https://api.stlouisfed.org/fred/series/observations`
**Free API Key:** Register at fred.stlouisfed.org — free, no credit card

**Key Series:**
```
MORTGAGE30US   — 30-Year Fixed Rate Mortgage Average (weekly)
MORTGAGE15US   — 15-Year Fixed Rate Mortgage Average (weekly)
MORTGAGE5US    — 5/1-Year ARM Rate (weekly)
FEDFUNDS       — Federal Funds Rate (daily, context for trend)
```

**Sample Request:**
```
GET https://api.stlouisfed.org/fred/series/observations
  ?series_id=MORTGAGE30US
  &api_key=${FRED_API_KEY}
  &file_type=json
  &limit=52
  &sort_order=desc
```

**ISR Revalidation:** 86400 seconds (24 hours)
**Fallback:** `data/rates-fallback.json` with hardcoded last 52 weeks

### Secondary: Google Sheets CSV (Lender Data)
**Columns:** `slug, lender_name, logo_url, website, lender_type, rate_30yr_fixed, rate_15yr_fixed, rate_5_1_arm, rate_jumbo_30yr, min_credit_score, min_down_payment_pct, origination_fee_pct, closing_cost_estimate, states_available, specialty, last_verified_date, affiliate_url`

**Lender Types:** bank, credit_union, online_lender, broker, government

**Env variable:** `SHEETS_CSV_URL`
**Pre-loaded fallback:** 30 lenders in `data/lenders-fallback.json`

### Supplementary Static Data
- `data/states.json` — state metadata and average credit score context
- `data/loan-types.json` — loan type descriptions (conventional, FHA, VA, jumbo, USDA)

---

## 5. Page Structure & SEO

### `/` — Homepage Rate Dashboard
- **Title:** "Today's Refinance Rates (April 2026) — 30yr, 15yr & ARM | RefiRateBoard"
- **H1:** "Today's Mortgage Refinance Rates"
- Rate hero section: 30yr fixed, 15yr fixed, 5/1 ARM — large badges
- Week-over-week change indicators (▲/▼)
- 52-week rate trend chart (Chart.js)
- Top lenders table (sortable by rate)
- "Should you refinance?" FAQ section
- Native Banner ad below hero
- Schema: `WebSite`, `LoanOrCredit`, `FAQPage`

### `/lenders/[slug]` — Lender Detail
- **Title:** "[Lender Name] Refi Rates (April 2026): 30yr, 15yr, ARM | RefiRateBoard"
- **H1:** "[Lender Name] Refinance Rates"
- Lender profile card (logo, type, states available)
- Rate table: all loan types
- Pros/cons list (static, manually curated)
- Mini refi calculator embedded
- "Compare with similar lenders" grid
- Display banner mid-page
- Schema: `FinancialService`, `LoanOrCredit`, `BreadcrumbList`

### `/states/[state]` — State Pages
- **Title:** "[State] Mortgage Refinance Rates — Best Refi Deals (April 2026) | RefiRateBoard"
- **H1:** "[State] Refinance Rates"
- Average refi rate for state (state median context note)
- Available lenders in state (filtered from lender data)
- State-specific refi tips (static content, SEO-focused)
- Schema: `Dataset`, `BreadcrumbList`

### `/loan-types/[type]` — Loan Type Pages
- Types: `conventional`, `fha`, `va`, `jumbo`, `usda`, `cash-out`, `rate-and-term`
- **Title:** "[Type] Refinance Rates — April 2026 Best Rates | RefiRateBoard"
- **H1:** "[Conventional/FHA/VA/Jumbo] Refi Rates Today"
- Loan type explainer (500-word SEO content block)
- Rate table filtered to loan type
- Eligibility requirements (static)
- Schema: `LoanOrCredit`, `BreadcrumbList`

### `/calculator` — Refinance Calculator
- **Title:** "Mortgage Refinance Calculator — See Your Savings | RefiRateBoard"
- **H1:** "Refinance Savings Calculator"
- Inputs: current loan balance, current rate, current remaining term, new rate, new term, closing costs
- Outputs: new monthly payment, monthly savings, break-even months, lifetime savings
- Real-time calculation (no submit)
- Rate auto-fill buttons ("Use today's 30yr rate")
- Schema: `WebApplication`

### SEO Infrastructure
```
/sitemap.xml     — all lenders + states + loan types + calculator
/robots.txt      — allow all
/[lang]/...      — hreflang 8 locales
```

---

## 6. UI/UX Design

### Color Palette (Soft Pastel)
```css
--bg-primary:    #F8FAFC   /* cool white */
--bg-card:       #FFFFFF
--bg-accent:     #E2E8F0   /* slate 200 */
--text-primary:  #1E293B
--text-secondary:#64748B
--rate-low:      #D1FAE5   /* green — low rate */
--rate-mid:      #FEF9C3   /* yellow — mid rate */
--rate-high:     #FEE2E2   /* red — high rate */
--rate-change-up:#FEE2E2   /* rate rose — red badge */
--rate-change-dn:#D1FAE5   /* rate fell — green badge */
--cta-button:    #0F172A   /* dark slate */
--border:        #E2E8F0
--chart-color:   #38BDF8   /* sky blue line */
```

### Layout Principles
- Mobile-first: rate badges stack vertically on mobile
- Rate hero: 3 large stat cards side-by-side on desktop
- Chart: full width, 250px height mobile, 350px desktop
- Calculator: 2-column on desktop (inputs left, results right), stacked mobile
- Lender table: sticky header, sortable arrows, horizontal scroll on mobile
- Lender cards: logo left, rate right, CTA button

### Key Components
- `RateHero` — three rate cards (30yr/15yr/ARM) with change badge
- `TrendChart` — Chart.js line chart, 52-week history
- `LenderTable` — sortable, color-coded rate column
- `LenderCard` — logo, rates, CTA button
- `RefiCalculator` — full calculator with break-even
- `RateChangeBadge` — ▲/▼ with bp change
- `LoanTypeSelector` — pill tabs

---

## 7. i18n Configuration

**Supported Locales:** `en`, `ko`, `ja`, `zh`, `es`, `fr`, `de`, `pt`
**Default Locale:** `en`
**Library:** `next-intl`

**Key Translation Strings:**
```json
{
  "hero.title": "Today's Mortgage Refinance Rates",
  "hero.subtitle": "Compare refi rates from {count} lenders",
  "rate.30yr": "30-Year Fixed",
  "rate.15yr": "15-Year Fixed",
  "rate.arm": "5/1 ARM",
  "rate.jumbo": "Jumbo",
  "rate.change": "vs. last week",
  "lender.viewRates": "View Rates",
  "lender.minCredit": "Min. Credit Score",
  "lender.states": "Available States",
  "calculator.title": "Refi Savings Calculator",
  "calculator.currentBalance": "Current Loan Balance",
  "calculator.currentRate": "Current Rate (%)",
  "calculator.currentTerm": "Remaining Term (months)",
  "calculator.newRate": "New Rate (%)",
  "calculator.newTerm": "New Term (months)",
  "calculator.closingCosts": "Estimated Closing Costs",
  "calculator.monthlySavings": "Monthly Savings",
  "calculator.breakEven": "Break-even in",
  "calculator.lifetimeSavings": "Lifetime Savings",
  "loanType.conventional": "Conventional",
  "loanType.fha": "FHA",
  "loanType.va": "VA",
  "loanType.jumbo": "Jumbo",
  "footer.visitorsToday": "Visitors today",
  "footer.visitorsTotal": "Total visitors",
  "footer.rateDisclaimer": "Rates are for reference only. Contact lenders for exact quotes."
}
```

---

## 8. Ad Integration (Adsterra)

### Social Bar — `<head>`
```html
<!-- TODO: Replace with Adsterra Social Bar script -->
<!-- ADSTERRA_SOCIAL_BAR_PLACEHOLDER -->
```

### Native Banner — Below Rate Hero Section
```html
<!-- TODO: Adsterra Native Banner — below 3 rate cards -->
<div id="adsterra-native-banner" class="my-6 w-full">
  {/* ADSTERRA_NATIVE_BANNER_PLACEHOLDER */}
</div>
```

### Display Banner — Mid-Page (Above Lender Table or mid-Calculator)
```html
<!-- TODO: Adsterra Display Banner 728x90 / 320x50 -->
<div id="adsterra-display-banner" class="my-8 flex justify-center">
  {/* ADSTERRA_DISPLAY_BANNER_PLACEHOLDER */}
</div>
```

---

## 9. Google Sheets Webhook

**Trigger:** rate_view, lender_click, calculator_use, state_select, loan_type_select

### Payload Schema
```json
{
  "event": "rate_view | lender_click | calculator_use | state_select | loan_type_select",
  "lender_slug": "rocket-mortgage",
  "loan_type": "conventional",
  "state": "california",
  "locale": "en",
  "timestamp": "2026-04-13T12:00:00Z",
  "page": "/lenders/rocket-mortgage"
}
```

### Apps Script (Google Sheets)
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("interactions");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.event, data.lender_slug,
    data.loan_type, data.state, data.locale, data.page
  ]);
  return ContentService.createTextOutput("OK");
}
```

---

## 10. Visitor Counter

**Placement:** Footer, subtle left or right text
**Storage:** Upstash Redis free tier

```tsx
// components/VisitorCounter.tsx
// Text: "Today: 512 | Total: 23,888"
// Incremented once per session
// API: /api/visitor-count GET and POST
```

---

## 11. Milestones & Git Strategy

### Milestone 1 — Scaffold
- Next.js 14 + Tailwind + Chart.js + next-intl
- `gh repo create taeshin11/refi-rate-board --public`
- Harness files
- `research_history/` folder
- **Commit:** `feat: scaffold Next.js with Chart.js and i18n`
- `git push origin main`

### Milestone 2 — Data Layer
- FRED API fetcher (`lib/fred.ts`)
- Google Sheets lender data fetcher (`lib/sheets.ts`)
- Fallback JSON files
- Type definitions (`types/rate.ts`, `types/lender.ts`)
- **Commit:** `feat: data layer — FRED API + Sheets lender data + fallback`
- `git push origin main`

### Milestone 3 — Homepage
- RateHero component (3 rate cards)
- TrendChart (52-week FRED data)
- LenderTable (sortable)
- RateChangeBadge
- Adsterra placeholder divs
- FAQ section
- **Commit:** `feat: homepage with rate hero, trend chart, and lender table`
- `git push origin main`

### Milestone 4 — Dynamic Pages
- `/lenders/[slug]` — lender detail
- `/states/[state]` — state refi page
- `/loan-types/[type]` — loan type pages
- `/calculator` — refi calculator with break-even
- **Commit:** `feat: lender, state, loan-type pages and refi calculator`
- `git push origin main`

### Milestone 5 — SEO Layer
- next-sitemap config
- JSON-LD: LoanOrCredit, FinancialService, FAQPage, WebApplication
- hreflang tags
- Meta description templates
- **Commit:** `feat: SEO — sitemap, hreflang, schema.org`
- `git push origin main`

### Milestone 6 — i18n
- 8 locale translation files
- Locale switcher
- **Commit:** `feat: i18n — 8 locales`
- `git push origin main`

### Milestone 7 — Integrations
- Google Sheets webhook
- Visitor counter (Upstash Redis)
- Vercel Analytics
- **Commit:** `feat: webhook, visitor counter, analytics`
- `git push origin main`

### Milestone 8 — Deploy
- `npx vercel --prod`
- Verify FRED API key in Vercel env vars
- Calculator smoke test (break-even formula check)
- **Commit:** `chore: production deploy verified`
- `git push origin main`

---

## 12. File Structure

```
refi-rate-board/
├── PRD.md
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── research_history/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── data/
│   ├── rates-fallback.json
│   ├── lenders-fallback.json
│   ├── states.json
│   └── loan-types.json
├── messages/
│   ├── en.json  ├── ko.json  ├── ja.json  ├── zh.json
│   ├── es.json  ├── fr.json  ├── de.json  └── pt.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── lenders/[slug]/page.tsx
│   │   ├── states/[state]/page.tsx
│   │   ├── loan-types/[type]/page.tsx
│   │   └── calculator/page.tsx
│   └── api/
│       └── visitor-count/route.ts
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── layout/LocaleSwitcher.tsx
│   ├── rates/RateHero.tsx
│   ├── rates/RateChangeBadge.tsx
│   ├── rates/TrendChart.tsx
│   ├── rates/LoanTypeSelector.tsx
│   ├── lenders/LenderTable.tsx
│   ├── lenders/LenderCard.tsx
│   ├── calculator/RefiCalculator.tsx
│   ├── calculator/BreakEvenDisplay.tsx
│   ├── ads/SocialBar.tsx
│   ├── ads/NativeBanner.tsx
│   ├── ads/DisplayBanner.tsx
│   └── VisitorCounter.tsx
├── lib/
│   ├── fred.ts
│   ├── sheets.ts
│   ├── webhook.ts
│   └── utils.ts
├── types/
│   ├── rate.ts
│   └── lender.ts
├── next.config.js
├── next-sitemap.config.js
├── tailwind.config.js
└── package.json
```

---

## 13. Harness Spec

### `feature_list.json`
```json
{
  "project": "refi-rate-board",
  "version": "1.0.0",
  "features": [
    { "id": "F01", "name": "Homepage rate dashboard", "status": "pending" },
    { "id": "F02", "name": "Lender detail pages", "status": "pending" },
    { "id": "F03", "name": "State pages", "status": "pending" },
    { "id": "F04", "name": "Loan type pages", "status": "pending" },
    { "id": "F05", "name": "Refinance calculator", "status": "pending" },
    { "id": "F06", "name": "52-week trend chart", "status": "pending" },
    { "id": "F07", "name": "Lender comparison table", "status": "pending" },
    { "id": "F08", "name": "Break-even analysis", "status": "pending" },
    { "id": "F09", "name": "i18n 8 locales", "status": "pending" },
    { "id": "F10", "name": "Visitor counter", "status": "pending" },
    { "id": "F11", "name": "Google Sheets webhook", "status": "pending" },
    { "id": "F12", "name": "Adsterra ads", "status": "pending" },
    { "id": "F13", "name": "SEO sitemap hreflang schema", "status": "pending" },
    { "id": "F14", "name": "ISR 24h revalidation", "status": "pending" },
    { "id": "F15", "name": "Research history logs", "status": "pending" }
  ]
}
```

### `claude-progress.txt`
```
# RefiRateBoard — Claude Build Progress

MILESTONE_1=pending
MILESTONE_2=pending
MILESTONE_3=pending
MILESTONE_4=pending
MILESTONE_5=pending
MILESTONE_6=pending
MILESTONE_7=pending
MILESTONE_8=pending
LAST_UPDATED=
DEPLOY_URL=
```

### `init.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== RefiRateBoard Init ==="

npx create-next-app@latest . \
  --typescript --tailwind --eslint \
  --app --src-dir=false --import-alias="@/*" --no-git

npm install next-intl next-sitemap chart.js react-chartjs-2 \
  @vercel/analytics @upstash/redis

gh repo create taeshin11/refi-rate-board \
  --public --source=. --remote=origin --push

mkdir -p research_history data messages \
  components/layout components/rates \
  components/lenders components/calculator \
  components/ads lib types app/api/visitor-count

git add .
git commit -m "chore: initial scaffold"
git push origin main

echo "=== Init complete ==="
```

---

## 14. Environment Variables

```env
FRED_API_KEY=your_free_fred_key_here
SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/[ID]/export?format=csv
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/[ID]/exec
NEXT_PUBLIC_SITE_URL=https://refi-rate-board.vercel.app
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 15. Refinance Calculator Spec

```typescript
// components/calculator/RefiCalculator.tsx
// INPUTS (all controlled, real-time):
//   currentBalance: number (default 300000)
//   currentRate: number (default 6.5, %)
//   remainingMonths: number (default 300)
//   newRate: number (default 6.0, %)
//   newTermMonths: number (default 360)
//   closingCosts: number (default 5000)

// OUTPUTS (computed instantly):
//   currentPayment = PMT(currentRate/12/100, remainingMonths, currentBalance)
//   newPayment = PMT(newRate/12/100, newTermMonths, currentBalance)
//   monthlySavings = currentPayment - newPayment
//   breakEvenMonths = closingCosts / monthlySavings
//   lifetimeSavings = (monthlySavings * newTermMonths) - closingCosts

// Display breakEvenMonths as "X months" or "X years Y months"
// Show "Not worth refinancing" if breakEvenMonths > 120 (10 years)
// "Use today's rate" button auto-fills newRate from FRED data
```

---

## 16. FRED Data Processing

```typescript
// lib/fred.ts
export interface FREDObservation {
  date: string;       // "2026-04-10"
  value: string;      // "6.82" | "."  (dot = missing)
}

export async function fetchFREDSeries(seriesId: string, limit = 52): Promise<FREDObservation[]> {
  const url = new URL('https://api.stlouisfed.org/fred/series/observations');
  url.searchParams.set('series_id', seriesId);
  url.searchParams.set('api_key', process.env.FRED_API_KEY!);
  url.searchParams.set('file_type', 'json');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sort_order', 'desc');
  
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  const json = await res.json();
  return json.observations.filter((o: FREDObservation) => o.value !== '.');
}

// Series to fetch: MORTGAGE30US, MORTGAGE15US, MORTGAGE5US
```

**Programmatic SEO target:** 800+ indexable pages (30 lenders + 50 states + 7 loan types + calculator + historical archive pages).

---

## 17. Legal Disclaimer

All rate data is sourced from FRED (federal benchmark averages) and manually maintained lender sheets. Rates displayed are for informational purposes only and are not guaranteed. Users should contact lenders directly for personalized rate quotes. RefiRateBoard is not a licensed mortgage broker or lender.

Include a concise version of this disclaimer in the footer of every page.
