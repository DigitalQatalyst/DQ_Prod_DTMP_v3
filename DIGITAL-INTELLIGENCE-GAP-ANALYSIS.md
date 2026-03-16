# DIGITAL INTELLIGENCE MARKETPLACE — GAP ANALYSIS & RECOMMENDATIONS

**Document Type:** Technical Gap Analysis  
**Date:** February 17, 2026  
**Scope:** Comparison of current DTMP Digital Intelligence implementation vs. Developer Briefing Document v1.0  
**Audience:** Developers, Product Managers, Architects  

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Current Implementation Inventory](#2-current-implementation-inventory)
3. [Stage 1 Marketplace Gap Analysis](#3-stage-1-marketplace-gap-analysis)
4. [Stage 2 Service Hub Gap Analysis](#4-stage-2-service-hub-gap-analysis)
5. [Data & Content Gaps](#5-data--content-gaps)
6. [Data Model Alignment](#6-data-model-alignment)
7. [Missing Pages & Features](#7-missing-pages--features)
8. [RBAC Implementation Gap](#8-rbac-implementation-gap)
9. [Cross-Marketplace Integration](#9-cross-marketplace-integration)
10. [Technical Debt & Library Gaps](#10-technical-debt--library-gaps)
11. [Quick Wins](#11-quick-wins)
12. [Prioritized Implementation Roadmap](#12-prioritized-implementation-roadmap)
13. [Appendix: File-by-File Inventory](#13-appendix-file-by-file-inventory)

---

## 1. EXECUTIVE SUMMARY

### Overall Assessment

The Digital Intelligence Marketplace has a **solid foundational implementation** covering both Stage 1 (public marketplace) and Stage 2 (authenticated service hub). The core technology stack — React + TypeScript, Vite, Recharts, shadcn/ui, Tailwind CSS, TanStack React Query — is well-chosen and aligned with the spec's recommendations.

However, significant gaps exist between the current build and the full vision described in the Developer Briefing Document. These gaps fall into four categories:

| Gap Category | Severity | Effort to Close |
|--------------|----------|-----------------|
| **Content & Data Volume** (dashboards, insights) | High | Medium (data authoring) |
| **Stage 1 Page Sections** (marketing/landing content) | High | Medium (new components) |
| **Stage 2 Interactivity** (drill-down, export, scheduling) | High | High (new features) |
| **Missing Pages** (Insights Hub, Builder, Reports, Gallery) | Medium | High (new pages) |

### Readiness Score

| Area | Current | Target | Readiness |
|------|---------|--------|-----------|
| Stage 1 Marketplace Page | 40% | 100% | Needs 8+ new sections |
| Stage 2 LVE Layout | 85% | 100% | Structure is solid |
| Stage 2 Column 2 (Dashboard List) | 45% | 100% | Needs tabs, filters, sort |
| Stage 2 Column 3 (Dashboard Viewer) | 55% | 100% | Needs drill-down, export |
| Dashboard Count | 30/52 | 52/52 | 58% complete |
| AI Insights Count | 15/143 | 143/143 | 10% complete |
| Export Functionality | UI only | Functional | 15% complete |
| RBAC Filtering | Types only | Functional | 10% complete |
| AI Insights Hub Page | 0% | 100% | Not started |
| Custom Dashboard Builder | 0% | 100% | Not started |
| Scheduled Reports Page | 0% | 100% | Not started |
| Dashboard Gallery Page | 0% | 100% | Not started |

---

## 2. CURRENT IMPLEMENTATION INVENTORY

### Technology Stack (Confirmed)

| Layer | Technology | Version |
|-------|-----------|---------|
| Build Tool | Vite | 5.4.19 |
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.8.3 |
| Routing | React Router DOM | 6.30.1 |
| State Management | TanStack React Query | 5.83.0 |
| UI Components | shadcn/ui + Radix UI | 20+ components |
| Styling | Tailwind CSS | 3.4.17 |
| Charts | Recharts | 2.15.4 |
| Icons | Lucide React | Latest |
| Forms | React Hook Form + Zod | Latest |

### File Structure (Digital Intelligence)

```
src/
├── pages/
│   ├── DigitalIntelligencePage.tsx          ← Stage 1 main page
│   ├── DigitalIntelligenceDetailPage.tsx    ← Stage 1 detail page
│   └── stage2/intelligence/
│       ├── IntelligenceOverviewPage.tsx     ← Stage 2 overview
│       ├── IntelligenceServicesPage.tsx     ← Stage 2 service list (Col 2)
│       ├── ServiceDashboardPage.tsx         ← Stage 2 dashboard viewer (Col 3)
│       ├── MyDashboardsPage.tsx             ← User favorites
│       ├── MyRequestsPage.tsx               ← Request list
│       ├── RequestDetailPage.tsx            ← Request detail
│       └── index.ts
├── components/digitalIntelligence/
│   ├── IntelligenceCard.tsx                 ← Service card
│   ├── MarketplaceHeader.tsx                ← Hero section
│   ├── index.ts
│   └── stage2/
│       ├── DashboardWidget.tsx              ← Widget renderer (chart/metric/table/insight)
│       ├── InsightCard.tsx                  ← AI insight card
│       ├── MetricCard.tsx                   ← Metric display card
│       └── index.ts
├── data/digitalIntelligence/
│   ├── systemsPortfolio.ts                  ← 12 services
│   ├── digitalMaturity.ts                   ← 8 services
│   ├── projectsPortfolio.ts                 ← 10 services
│   ├── filters.ts                           ← Filter configurations
│   ├── index.ts
│   └── stage2/
│       ├── intelligenceServices.ts          ← 30 service definitions (Stage 2)
│       ├── sampleDashboardData.ts           ← Mock data for 5 dashboards
│       ├── dashboardRequests.ts             ← Mock request data
│       ├── types.ts                         ← TypeScript interfaces
│       └── index.ts
```

### Routes (Current)

| Route | Page | Stage |
|-------|------|-------|
| `/marketplaces/digital-intelligence` | `DigitalIntelligencePage` | 1 |
| `/marketplaces/digital-intelligence/:tab/:cardId` | `DigitalIntelligenceDetailPage` | 1 |
| `/stage2` (with intelligence context) | `Stage2AppPage` → Intelligence pages | 2 |

### Routes (Missing — Required by Spec)

| Route | Page | Status |
|-------|------|--------|
| `/stage2/intelligence/gallery` | Dashboard Gallery | **Not built** |
| `/stage2/intelligence/insights` | AI Insights Hub | **Not built** |
| `/stage2/intelligence/builder` | Custom Dashboard Builder | **Not built** |
| `/stage2/intelligence/reports` | Scheduled Reports | **Not built** |

---

## 3. STAGE 1 MARKETPLACE GAP ANALYSIS

### Current Page Structure

```
┌─────────────────────────────────────────────┐
│ Header (shared)                              │
├─────────────────────────────────────────────┤
│ MarketplaceHeader                            │
│ • Breadcrumb                                 │
│ • Phase badge + AI badge                     │
│ • Title: "DTMP Digital Intelligence"         │
│ • Description paragraph                      │
│ • 3 inline stats (text only)                 │
├─────────────────────────────────────────────┤
│ Tab Navigation                               │
│ • Systems Portfolio (12)                     │
│ • Digital Maturity (8)                       │
│ • Projects Portfolio (10)                    │
├─────────────────────────────────────────────┤
│ Search Bar                                   │
├─────────────────────────────────────────────┤
│ Filter Panel (left) + Card Grid (right)      │
│ • IntelligenceCard × N                       │
├─────────────────────────────────────────────┤
│ Footer (shared)                              │
└─────────────────────────────────────────────┘
```

### Spec's Required Page Structure

```
┌─────────────────────────────────────────────┐
│ Header / Navigation                          │  ← EXISTS
├─────────────────────────────────────────────┤
│ HERO SECTION                                 │  ← PARTIAL (needs stat cards, CTA buttons)
│ • Icon (BarChart3, 48-64px)                  │  ← MISSING (currently no large icon)
│ • Title: "Digital Intelligence"              │  ← EXISTS (slightly different text)
│ • Subtitle                                   │  ← EXISTS
│ • Tags: "50+ dashboards • AI-powered..."     │  ← MISSING (currently inline stats)
│ • CTA: [Explore Dashboards] [View Sample]    │  ← MISSING
├─────────────────────────────────────────────┤
│ KEY STATISTICS (4 metric cards)              │  ← MISSING
│ • 847 Apps Analyzed                          │
│ • $12.4M Annual Savings                      │
│ • 73% Cloud Ready                            │
│ • 2,847 Active Users                         │
├─────────────────────────────────────────────┤
│ SAMPLE DASHBOARD PREVIEW                     │  ← MISSING
│ • Interactive Portfolio Health mini-chart     │
├─────────────────────────────────────────────┤
│ DASHBOARDS BY ROLE (6 cards, 3×2 grid)       │  ← MISSING
│ • Executive, Director, Manager               │
│ • Architect, App Owner, Analyst              │
├─────────────────────────────────────────────┤
│ FEATURED DASHBOARDS (3 cards)                │  ← MISSING
│ • Portfolio Health                           │
│ • Transformation Pipeline                    │
│ • AI Insights Hub                            │
├─────────────────────────────────────────────┤
│ DASHBOARD CATEGORIES (6 cards, 3×2 grid)     │  ← MISSING
│ • Portfolio Analytics (12)                   │
│ • Delivery & Execution (8)                   │
│ • People & Skills (6)                        │
│ • Operational Metrics (9)                    │
│ • Predictive Analytics (7)                   │
│ • Custom Dashboards                          │
├─────────────────────────────────────────────┤
│ AI-POWERED INSIGHTS (3-4 examples)           │  ← MISSING
│ • 🔍 23 apps identified for retirement       │
│ • ⚠️ Cloud migration 15% behind             │
│ • 💡 Learning engagement up 34%              │
├─────────────────────────────────────────────┤
│ WHAT YOU CAN DO (checkmark list)             │  ← MISSING
├─────────────────────────────────────────────┤
│ DATA SOURCES (list of integrated systems)    │  ← MISSING
├─────────────────────────────────────────────┤
│ SAMPLE INSIGHTS (quoted recommendations)     │  ← MISSING
├─────────────────────────────────────────────┤
│ CALL TO ACTION                               │  ← MISSING
│ • [Explore Dashboards →]                     │
│ • [Request Demo] [Schedule Training]         │
├─────────────────────────────────────────────┤
│ Footer                                       │  ← EXISTS
└─────────────────────────────────────────────┘
```

### Section-by-Section Gap Detail

#### 3.1 Hero Section

| Element | Spec | Current | Gap |
|---------|------|---------|-----|
| Large icon (48-64px) | BarChart3 or TrendingUp | No large icon | **Add** |
| Title text | "Digital Intelligence" | "DTMP Digital Intelligence" | Minor rename |
| Title size | text-4xl to text-6xl, bold, navy #001F3F | text-3xl lg:text-4xl, gray-900 | **Adjust** font size and color |
| Subtitle | "Data-driven insights for transformation decisions" | Longer description paragraph | **Simplify** |
| Tags line | "50+ dashboards • AI-powered insights • Real-time analytics" | 3 icon+text stats | **Restyle** as inline tags |
| Primary CTA | "Explore Dashboards" (orange #FF6600) | None | **Add** |
| Secondary CTA | "View Sample Dashboard" (outline) | None | **Add** |
| Background | Not specified (navy/blue implied) | Purple/pink gradient | **Align** to navy palette |

**Recommendation:** Restructure `MarketplaceHeader.tsx` to match the spec's hero layout. Add the large icon, simplify the subtitle, replace inline stats with tag badges, and add two CTA buttons. Shift the color scheme from purple gradient to the spec's navy (#001F3F) / blue (#0066CC) palette.

#### 3.2 Key Statistics Section

**Status: MISSING ENTIRELY**

The spec calls for 4 metric cards in a responsive row:
- 847 Apps Analyzed
- $12.4M Annual Savings Identified
- 73% Cloud Ready
- 2,847 Active Users

**Recommendation:** Create a `KeyStatisticsSection` component. Use the existing `Card` component from shadcn/ui. Each card displays a large bold number (32-48px) and a label below (14-16px, gray-600). 4-column grid on desktop, 2-column on tablet, 1-column on mobile.

#### 3.3 Sample Dashboard Preview

**Status: MISSING ENTIRELY**

The spec wants an embedded interactive mini-dashboard showing the Portfolio Health distribution (Excellent 35%, Good 28%, Fair 17%, Poor 12%, Critical 8%).

**Recommendation:** Create a `SampleDashboardPreview` component using Recharts. Render a horizontal `BarChart` with the health score color palette (green #10B981, light-green #84CC16, yellow #F59E0B, orange #FF6600, red #EF4444). Add a "View Full Dashboard →" link below.

#### 3.4 Dashboards by Role Section

**Status: MISSING ENTIRELY**

The spec wants 6 cards in a 3×2 grid, one per role: Executive, Director, Manager, Architect, App Owner, Analyst.

Each card includes:
- Icon representing role
- Role title (bold, 18-20px)
- 3-4 bullet points of key dashboards for that role
- "View →" link

**Recommendation:** Create a `DashboardsByRoleSection` component. Use Lucide icons: Crown (Executive), Building2 (Director), Users (Manager), GitBranch (Architect), Package (App Owner), Database (Analyst). Each card's bullet points should reference actual dashboard names.

#### 3.5 Featured Dashboards Section

**Status: MISSING ENTIRELY**

3 horizontal cards: Portfolio Health, Transformation Pipeline, AI Insights Hub.

Each card: chart icon, title, description, key metric count, "View →" link.

**Recommendation:** Create a `FeaturedDashboardsSection` component. Use static data for the three featured dashboards. These cards should visually stand out — consider adding subtle gradient backgrounds or larger icons.

#### 3.6 Dashboard Categories Section

**Status: MISSING ENTIRELY**

6 category cards (3×2 grid): Portfolio Analytics (12), Delivery & Execution (8), People & Skills (6), Operational Metrics (9), Predictive Analytics (7), Custom Dashboards.

**Recommendation:** Create a `DashboardCategoriesSection` component. Each card shows category name and dashboard count. Make them clickable to eventually filter the Stage 2 dashboard list by category.

#### 3.7 AI-Powered Insights Section

**Status: MISSING ENTIRELY**

3-4 recent insight examples with type icons:
- 🔍 Discovery: "23 applications identified for potential retirement"
- ⚠️ Alert: "Cloud migration pace slowing — 15% behind target"
- 💡 Recommendation: "Learning engagement up 34% this quarter"

**Recommendation:** Create an `AIInsightsPreviewSection` component. Use static example data. Each insight shows an icon, a bold title, and a supporting detail line. Add a "View All Insights →" link at the bottom.

#### 3.8 "What You Can Do" Section

**Status: MISSING ENTIRELY**

Checkmark list of 8 platform capabilities.

**Recommendation:** Create a `WhatYouCanDoSection` component. Simple list with green checkmark icons. Low effort, high informational value.

#### 3.9 Data Sources Section

**Status: MISSING ENTIRELY**

List of 8 integrated data sources with entity counts.

**Recommendation:** Create a `DataSourcesSection` component. Bullet list with source names and counts (e.g., "Portfolio Management (847 applications)").

#### 3.10 Call to Action Section

**Status: MISSING ENTIRELY**

Bottom CTA: "Explore Dashboards →" (primary), "Request Demo", "Schedule Training" (secondary).

**Recommendation:** Create a `CTASection` component. Center-aligned with the primary button triggering the login modal and secondary buttons as outline style.

---

## 4. STAGE 2 SERVICE HUB GAP ANALYSIS

### 4.1 Column 1: Sidebar Navigation

| Element | Spec | Current | Gap |
|---------|------|---------|-----|
| All 9 marketplaces listed | Yes | 8 listed (Lifecycle "Coming Soon") | Minor |
| Digital Intelligence highlighted | Active state styling | Yes — orange highlight | OK |
| Sub-items under DI | Dashboard Gallery, My Dashboards, Favorites, Custom Dashboards, Scheduled Reports, AI Insights Hub, Data Catalog | Overview, Browse Services, My Dashboards, My Requests | **4 sub-items missing** |
| Collapsible on mobile | Yes | Yes | OK |

**Missing Sub-Navigation Items:**
- Dashboard Gallery → needs `/stage2/intelligence/gallery` page
- Favorites → currently merged into My Dashboards
- Custom Dashboards → needs builder page
- Scheduled Reports → needs `/stage2/intelligence/reports` page
- AI Insights Hub → needs `/stage2/intelligence/insights` page
- Data Catalog → advanced feature, lower priority

**Recommendation:** Add sidebar sub-navigation items for Gallery, AI Insights Hub, Scheduled Reports, and Custom Dashboards. Wire them to new routes/pages.

### 4.2 Column 2: Dashboard List

#### Current Implementation (`IntelligenceServicesPage.tsx`)

- Lists 30 services grouped by category (Systems, Projects, Maturity)
- Search functionality
- Category group headers
- Basic service cards with title, description, accuracy, frequency
- "View Dashboard →" link per card

#### Spec Requirements vs. Current

| Feature | Spec | Current | Status |
|---------|------|---------|--------|
| View Tabs (All, Favorites, Recently Viewed, Custom) | Required | None | **MISSING** |
| Search by name, description, tags, metrics | Required | Name + description only | **PARTIAL** |
| Filter by Category (6 categories) | Required | Grouped by 3 categories | **PARTIAL** |
| Filter by Target Role | Required | None | **MISSING** |
| Filter by Data Source | Required | None | **MISSING** |
| Filter by Update Frequency | Required | None | **MISSING** |
| Sort options (Most Used, Recently Updated, A-Z, Newest) | Required | None | **MISSING** |
| Dashboard count in header | Required | None | **MISSING** |
| Favorite toggle (star) on each item | Required | None (only in Col 3) | **MISSING** |
| Category badge on each item | Required | None | **MISSING** |
| Role badge on each item | Required | None | **MISSING** |
| "Updated X ago" timestamp | Required | None | **MISSING** |
| "+ Create Custom Dashboard" button | Required | None | **MISSING** |

**Recommendations:**

1. **Add View Tabs** — Use the existing `Tabs` component. Four tabs: "All Dashboards (52)", "My Favorites", "Recently Viewed", "Custom". Store favorites and recents in `localStorage` initially.

2. **Add Filter Panel** — Reuse the `FilterPanel` pattern from Stage 1. Four collapsible filter sections: Category (6 checkboxes), Target Role (6 checkboxes), Data Source (6 checkboxes), Update Frequency (4 radio buttons).

3. **Add Sort Dropdown** — Use the `Select` component. Options: Most Used, Recently Updated, Alphabetical (A-Z), Newest First, Relevance (when searching).

4. **Enhance List Items** — Each dashboard card should display: dashboard icon, name, 1-line description, category badge, role badge, "Updated 5m ago" timestamp, favorite star toggle, "View →" button.

5. **Add "+ Create Custom Dashboard" Button** — Positioned at the bottom of Column 2. Links to `/stage2/intelligence/builder`.

### 4.3 Column 3: Dashboard Viewer

#### Current Implementation (`ServiceDashboardPage.tsx`)

- Service header with title, description, badges (phase, accuracy, frequency, AI)
- Data source selector dropdown
- 2 dashboard filters (from `dashboardConfig.filters`)
- Refresh button
- Widget grid using `DashboardWidget` component
- Actions section (Schedule Report, Export Excel, Export PDF, Request Update, Request Data Source)
- Key Insights list
- AI Capabilities badges

#### DashboardWidget Capabilities (`DashboardWidget.tsx`)

| Widget Type | Supported | Chart Types |
|-------------|-----------|-------------|
| Metric | Yes | KPI card with trend |
| Chart | Yes | Line, Bar, Area, Pie, Donut, Radar |
| Table | Yes | Auto-columns, status badges |
| Insight | Yes | InsightCard list |
| Heatmap | Placeholder only | "Heatmap visualization" text |

#### Spec Requirements vs. Current

| Feature | Spec | Current | Status |
|---------|------|---------|--------|
| Dashboard header with refresh indicator | Required | Title + badges only | **PARTIAL** |
| Auto-refresh toggle & interval | Required | None | **MISSING** |
| "Last updated: X ago • Auto-refresh: ON" | Required | None | **MISSING** |
| Share button | Required | None | **MISSING** |
| Settings button | Required | None | **MISSING** |
| Filters & Date Range bar | Required | 2 filters shown | **PARTIAL** |
| Date range selector | Required | None | **MISSING** |
| "Apply Filters" / "Reset" buttons | Required | None | **MISSING** |
| Key metrics cards row at top | Required | Mixed into widget grid | **PARTIAL** |
| **Interactive drill-down** (click chart → filter) | Required | None | **MISSING** |
| Hover tooltips | Required | Yes (Recharts) | **DONE** |
| Legend toggle (show/hide series) | Required | None | **MISSING** |
| Chart ↔ Table view toggle | Required | None | **MISSING** |
| Full-screen chart mode | Required | None | **MISSING** |
| **Export as PDF** | Required | Button exists, no logic | **UI ONLY** |
| **Export as PowerPoint** | Required | In types, no button/logic | **MISSING** |
| **Export as Excel** | Required | Button exists, no logic | **UI ONLY** |
| Export as PNG | Required | None | **MISSING** |
| Export as CSV | Required | None | **MISSING** |
| Copy dashboard link | Required | None | **MISSING** |
| Email dashboard | Required | None | **MISSING** |
| Schedule report from dashboard | Required | Button exists, no modal | **UI ONLY** |
| Embed iframe code | Required | None | **MISSING** |
| Auto-refresh settings | Required | None | **MISSING** |
| Data quality indicator bar | Required | None | **MISSING** |
| Breadcrumb drill-down trail | Required | None | **MISSING** |
| URL state for filters/drill-down | Required | None | **MISSING** |
| Scatter chart type | Required | None | **MISSING** |
| Funnel chart type | Required | None | **MISSING** |
| Gauge chart type | Required | None | **MISSING** |
| Multi-series charts | Required | Single series only | **MISSING** |
| Zoom & pan on time-series | Required | None | **MISSING** |

**Recommendations (by priority):**

**HIGH PRIORITY:**

1. **Drill-down navigation** — The spec's most distinctive UX feature. When a user clicks a chart element (bar, pie segment, table row), the dashboard should:
   - Update URL with filter parameters: `?domain=supply-chain&health=poor`
   - Re-render all widgets with the new filter context
   - Show a breadcrumb trail: "Portfolio Health > Supply Chain > Poor Health"
   - Allow "Back" to clear the drill-down

   Implementation approach:
   ```
   1. Add onClick handlers to Recharts chart elements
   2. Store drill-down state in URL search params
   3. Pass filter context to DashboardWidget data queries
   4. Render breadcrumb trail above the dashboard
   ```

2. **Export implementation** — Install libraries and wire existing buttons:
   - `jspdf` + `html2canvas` → PDF export (capture dashboard as image, embed in PDF)
   - `xlsx` (SheetJS) → Excel export (export metrics + table data as worksheets)
   - `pptxgenjs` → PowerPoint export (one slide per widget)
   - `html2canvas` → PNG export (capture individual chart containers)
   - Native → CSV export (serialize table data to CSV string, trigger download)

3. **Schedule Report modal** — When "Schedule Email Report" button is clicked:
   - Open a Dialog with form fields: name, frequency (daily/weekly/monthly), day, time, recipients (comma-separated emails), format (PDF/Excel/PPT)
   - Use existing `ScheduledReport` interface from `types.ts`
   - Save to localStorage initially
   - Show toast confirmation via Sonner

**MEDIUM PRIORITY:**

4. **Date range selector** — Add a date range picker using `react-day-picker` (already installed) in the filters bar. Options: Last 7 Days, Last 30 Days, Last Quarter, Last Year, Custom Range.

5. **Share functionality** — Add a share dropdown menu with:
   - "Copy Link" → `navigator.clipboard.writeText(window.location.href)`
   - "Email Dashboard" → `mailto:` link with pre-filled subject
   - "Embed" → Show iframe code snippet in a dialog

6. **Additional chart types** — Add to `DashboardWidget.tsx`:
   - Scatter: `import { ScatterChart, Scatter } from 'recharts'`
   - Funnel: Custom component using stacked horizontal bars
   - Gauge: Custom SVG component or use a library like `react-gauge-chart`

7. **Multi-series chart support** — Current `ChartWidget` maps all time series data to a single "value" field. Update to support multiple data series (e.g., planned vs. actual, or multiple metrics on the same chart).

**LOWER PRIORITY:**

8. **Auto-refresh** — Use `setInterval` or React Query's `refetchInterval` option. Add a toggle in the dashboard header showing "Auto-refresh: ON/OFF" with interval selector (5min, 15min, 1hr).

9. **Data quality indicator** — Add a bar below the dashboard showing: "Data Quality: 87% | Last Updated: 5 min ago | Sources: Portfolio (847 apps), Financial (✓)".

10. **Full-screen chart mode** — Add an expand button on each widget card. On click, render the chart in a full-screen Dialog overlay.

---

## 5. DATA & CONTENT GAPS

### 5.1 Dashboard Count

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Total dashboards/services | 30 | 52 | **22 missing** (42%) |

#### Current Distribution (30 services)

| Category | Count | Services |
|----------|-------|----------|
| Systems Portfolio & Lifecycle | 12 | Health analytics, performance, cost, security, etc. |
| Digital Maturity | 8 | DBP maturity, domain assessments, capability, etc. |
| Projects Portfolio & Lifecycle | 10 | Delivery velocity, project success, resource optimization, etc. |

#### Target Distribution (52 dashboards per spec)

| Category | Target Count | Currently Mapped | To Add |
|----------|-------------|-----------------|--------|
| Portfolio Analytics | 12 | ~12 (Systems) | 0 (reclassify) |
| Delivery & Execution | 8 | ~5 (Projects subset) | 3 |
| People & Skills | 6 | 0 | **6** |
| Operational Metrics | 9 | 0 | **9** |
| Predictive Analytics | 7 | ~3 (Predictive subset) | 4 |
| Executive | 10 | 0 | **10** |
| **TOTAL** | **52** | **~20 mapped** | **~32 to add/reclassify** |

#### Category Taxonomy Mismatch

**Critical Issue:** The current 3-category model (`systems`, `projects`, `maturity`) does not match the spec's 6-category model (`portfolio`, `delivery`, `people`, `operational`, `predictive`, `executive`).

**Recommendation:** Migrate to the spec's 6-category taxonomy:

1. Reclassify existing 30 services into the 6 new categories
2. Add 22 new dashboard definitions
3. Update the `category` field type in `IntelligenceService`:
   ```typescript
   // FROM:
   category: 'systems' | 'projects' | 'maturity';
   // TO:
   category: 'portfolio' | 'delivery' | 'people' | 'operational' | 'predictive' | 'executive' | 'custom';
   ```

#### Dashboards to Create (22 new)

**People & Skills (6 new):**
1. Learning Engagement Dashboard (Director, Daily)
2. Skills Matrix & Gaps Dashboard (Manager, Weekly)
3. Certification Tracking Dashboard (Manager, Daily)
4. Team Capability Heatmap (Director, Weekly)
5. Training ROI Dashboard (Executive, Monthly)
6. Workforce Planning Dashboard (Director, Weekly)

**Operational Metrics (9 new):**
1. Support Performance Dashboard (Manager, Real-time)
2. Platform Usage Analytics (Manager, Daily)
3. User Engagement Dashboard (Director, Daily)
4. Quality & Compliance Dashboard (Director, Weekly)
5. SLA Compliance Dashboard (Manager, Real-time)
6. Issue Trends Dashboard (Manager, Daily)
7. Agent Performance Dashboard (Manager, Daily)
8. Service Request Pipeline (Manager, Real-time)
9. Satisfaction Trends Dashboard (Director, Weekly)

**Executive (10 new):**
1. Transformation Overview (Executive, Real-time)
2. Business Value & ROI Dashboard (Executive, Daily)
3. Strategic Portfolio View (Executive, Weekly)
4. Investment Allocation Dashboard (Executive, Monthly)
5. Transformation Velocity Dashboard (Executive, Daily)
6. Board Presentation Metrics (Executive, Monthly)
7. Digital Readiness Scorecard (Executive, Weekly)
8. Cost Optimization Dashboard (Executive, Daily)
9. Risk & Issue Executive Summary (Executive, Daily)
10. Innovation Pipeline Dashboard (Executive, Weekly)

**Additional Delivery & Execution (3 new):**
1. Stage Gate Performance Dashboard (Director, Daily)
2. Resource Utilization Dashboard (Manager, Daily)
3. Schedule Variance Dashboard (Manager, Daily)

### 5.2 Sample Dashboard Data

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Services with sample data | 5 | 52 | **47 missing** (90%) |

Currently `sampleDashboardData.ts` only has data for:
1. `delivery-velocity-analytics`
2. `system-health-analytics`
3. `predictive-maintenance`
4. `dbp-maturity-assessment`
5. `project-success-prediction`

**Recommendation:** Create sample data entries for all 52 dashboards. Each entry needs:
- `timeSeries`: 6-12 data points showing realistic trends
- `metrics`: 3-5 KPI metrics with trends
- `insights`: 2-4 AI insights relevant to the dashboard
- `tableData`: 5-10 rows of relevant tabular data

Consider creating a utility function to generate realistic sample data based on dashboard metadata (category, data source, etc.).

### 5.3 AI Insights

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Total AI insights | 15 | 143 | **128 missing** (90%) |

#### Current Distribution (15 insights)

- 3 per dashboard × 5 dashboards = 15
- Types: Mixed (alert, info, prediction, recommendation)
- Severities: Mixed

#### Target Distribution (143 insights per spec)

| Type | Target Count | Current Count | To Add |
|------|-------------|---------------|--------|
| Alerts | 35 | ~5 | 30 |
| Recommendations | 67 | ~5 | 62 |
| Predictions | 28 | ~3 | 25 |
| Anomalies | 13 | ~2 | 11 |

| Priority | Target Count | Current Count | To Add |
|----------|-------------|---------------|--------|
| Critical | 8 | ~2 | 6 |
| High | 23 | ~4 | 19 |
| Medium | 67 | ~5 | 62 |
| Low | 45 | ~4 | 41 |

**Recommendation:** Create a dedicated `aiInsightsData.ts` file with all 143 insights. Each insight should follow the `AIInsight` interface and include realistic titles, descriptions, confidence scores (60-98%), and suggested actions. Group them by category/dashboard for easy association.

---

## 6. DATA MODEL ALIGNMENT

### Current `IntelligenceService` vs. Spec's `Dashboard`

| Spec Field | Your Field | Status | Action Needed |
|------------|-----------|--------|---------------|
| `id` | `id` | ✅ Match | None |
| `name` | `title` | ⚠️ Different name | Rename or alias |
| `slug` | — | ❌ Missing | Add URL-friendly slug |
| `description` | `description` | ✅ Match | None |
| `category` (6 values) | `category` (3 values) | ❌ Mismatch | Expand to 6+1 values |
| `targetRole` | — | ❌ Missing | **Add field** |
| `tags` | — | ❌ Missing | **Add field** (distinct from `keyInsights`) |
| `dataSources` | `availableDataSources` | ⚠️ Different structure | Compatible |
| `updateFrequency` | `updateFrequency` | ✅ Match | None |
| `lastUpdated` | — | ❌ Missing | **Add field** |
| `layout` | — | ❌ Missing | Add (or derive from widget positions) |
| `widgets` | `dashboardConfig.widgets` | ⚠️ Partial | Enhance widget config |
| `globalFilters` | `dashboardConfig.filters` | ✅ Match | None |
| `visibility` | — | ❌ Missing | **Add field** |
| `allowedRoles` | `visibleToRoles` | ✅ Match | None |
| `owner` | — | ❌ Missing | Add (optional) |
| `views` | `views` | ✅ Match | None |
| `favorites` | `favorites` | ✅ Match | None |
| `shares` | — | ❌ Missing | Add |
| `settings.autoRefresh` | — | ❌ Missing | **Add settings object** |
| `settings.refreshInterval` | — | ❌ Missing | **Add** |
| `settings.defaultDateRange` | `dashboardConfig.defaultDateRange` | ✅ Match | None |
| `createdAt` | — | ❌ Missing | Add |
| `createdBy` | — | ❌ Missing | Add |
| `version` | — | ❌ Missing | Add |

### Current `AIInsight` vs. Spec's `AIInsight`

| Spec Field | Your Field | Status | Action Needed |
|------------|-----------|--------|---------------|
| `id` | `id` | ✅ Match | None |
| `type` | `type` | ⚠️ Partial | Add `'anomaly'` value |
| `priority` | `severity` | ⚠️ Different name | Align naming |
| `title` | `title` | ✅ Match | None |
| `description` | `description` | ✅ Match | None |
| `impact` | — | ❌ Missing | **Add field** |
| `action` | `suggestedAction` | ⚠️ Different name | Compatible |
| `dataPoints` | — | ❌ Missing | **Add field** |
| `confidence` | `confidence` | ✅ Match | None |
| `affectedEntities` | — | ❌ Missing | **Add field** |
| `relatedDashboards` | — | ❌ Missing | **Add field** |
| `model` | — | ❌ Missing | Add (ML model metadata) |
| `status` | — | ❌ Missing | **Add field** (new/acknowledged/action-taken/dismissed) |
| `acknowledgedBy` | — | ❌ Missing | Add |
| `generatedAt` | — | ❌ Missing | **Add field** |
| `expiresAt` | — | ❌ Missing | Add |

### Current `DashboardWidget` vs. Spec's `Widget`

| Spec Field | Your Field | Status | Action Needed |
|------------|-----------|--------|---------------|
| `id` | `id` | ✅ Match | None |
| `type` | `type` | ✅ Match | None |
| `position.row/column/rowSpan/colSpan` | `position.row/col/width/height` | ⚠️ Different names | Compatible |
| `config.chartType` | `chartType` | ✅ Match | Add scatter, funnel, gauge |
| `config.xAxis` | — | ❌ Missing | **Add** (field, label, type) |
| `config.yAxis` | — | ❌ Missing | **Add** (field, label, format) |
| `config.colorScheme` | — | ❌ Missing | Add |
| `config.drillDown` | — | ❌ Missing | **Add** (enabled, target, params) |
| `config.showLegend` | — | ❌ Missing | Add |
| `config.showDataLabels` | — | ❌ Missing | Add |
| `config.showTooltips` | — | ❌ Missing | Add |
| `config.columns` (table) | — | ❌ Missing | Add (column definitions) |
| `config.sortable` | — | ❌ Missing | Add |
| `config.paginated` | — | ❌ Missing | Add |
| `dataSource` | `dataQuery` (string) | ⚠️ Partial | Enhance to structured query |
| `query` (DataQuery) | — | ❌ Missing | Add structured query object |

### Recommendations for Data Model

1. **Extend `IntelligenceService`** — Add: `targetRole`, `tags`, `slug`, `lastUpdated`, `settings` object, `shares` counter.

2. **Extend `AIInsight`** — Add: `impact`, `affectedEntities`, `relatedDashboards`, `status`, `generatedAt`, `expiresAt`. Add `'anomaly'` to the `type` union.

3. **Extend `DashboardWidget`** — Add a `config` object with: `xAxis`, `yAxis`, `colorScheme`, `drillDown`, `showLegend`, `showDataLabels`. Add `'scatter' | 'funnel' | 'gauge'` to `chartType`.

4. **Add `UserDashboardPreferences` interface** (from spec) — Tracks user favorites, recently viewed, custom dashboards, default dashboard, and display preferences (theme, data density, default date range).

---

## 7. MISSING PAGES & FEATURES

### 7.1 AI Insights Hub (`/stage2/intelligence/insights`)

**Priority: HIGH**

**Purpose:** Central hub for all AI-generated insights and recommendations.

**Required Content:**
- Summary cards: Active Insights (143), Critical Alerts (8), Recommendations (67), Predictions (28)
- Critical Alerts section (action required) with P1/P2 priority tags
- Recommendations section with savings estimates and confidence %
- Predictions section with forecasts and recommended capacity actions
- Filters: Category, Priority, Confidence, Date, Type
- Each insight: View Details button, Take Action button
- Status management: New → Acknowledged → Action Taken / Dismissed

**Implementation Notes:**
- Reuse `InsightCard.tsx` with expanded layout
- Add status toggle functionality
- Add filter panel (reuse `FilterPanel` pattern)
- Link "Take Action" to cross-marketplace navigation (e.g., create initiative in Lifecycle Management)

**Estimated Effort:** 5-7 days

### 7.2 Custom Dashboard Builder (`/stage2/intelligence/builder`)

**Priority: MEDIUM**

**Purpose:** Drag-and-drop interface for users to create custom dashboards.

**Phased Approach:**

**Phase 1 — Template-Based Builder (MVP):**
- User selects a dashboard template (Portfolio, Delivery, People, etc.)
- User customizes: name, description, data source, date range
- User toggles which pre-built widgets to include/exclude
- Save as custom dashboard to "My Dashboards"
- Estimated effort: 5-7 days

**Phase 2 — Drag-and-Drop Builder:**
- Widget palette sidebar (Charts, Tables, Metrics, Text)
- Canvas with grid-based drop zones
- Widget configuration panel (data source, chart type, axes, colors)
- Drag to resize and reposition
- Save, Preview, Publish workflow
- Libraries needed: `@dnd-kit/core`, `@dnd-kit/sortable`, `react-grid-layout`
- Estimated effort: 10-15 days

### 7.3 Scheduled Reports (`/stage2/intelligence/reports`)

**Priority: MEDIUM**

**Purpose:** Manage automated report delivery.

**Required Content:**
- Active Schedules list with: report name, recipients, frequency, format, last sent date
- Edit / Pause / Delete actions per schedule
- "+ Create New Schedule" button → opens creation form
- Form fields: name, dashboard (select), frequency, day/time, timezone, recipients, format, include filters, include summary

**Implementation Notes:**
- `ScheduledReport` interface already exists in `types.ts`
- Store schedules in localStorage (Phase 1) or backend (Phase 2)
- Actual email delivery requires backend service (out of scope for frontend)

**Estimated Effort:** 3-5 days

### 7.4 Dashboard Gallery (`/stage2/intelligence/gallery`)

**Priority: LOWER**

**Purpose:** Visual browsing of all available dashboards with preview thumbnails.

**Required Content:**
- Dashboard cards organized by category
- Preview thumbnails (mini-chart or screenshot)
- Search and filter capabilities
- Quick actions: View, Favorite, Share

**Implementation Notes:**
- Can reuse `IntelligenceServicesPage` layout with enhanced card design
- Thumbnail previews: Render mini Recharts components or use static placeholder images

**Estimated Effort:** 3-4 days

---

## 8. RBAC IMPLEMENTATION GAP

### Current State

- `visibleToRoles` array defined on each `IntelligenceService`
- `dataScope` field defined ('own' | 'team' | 'domain' | 'all')
- `rbacRestricted` boolean on filters
- **No actual filtering logic implemented anywhere**
- Login is mock (no real authentication)

### Required Implementation

#### Step 1: User Context

Create a `UserContext` provider that stores the authenticated user's role after login:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'associate' | 'manager' | 'lead' | 'director' | 'executive';
  department?: string;
  teamId?: string;
}
```

Currently the `LoginModal` just navigates to Stage 2 without persisting any user role. Update it to:
1. Accept a role selection (or default to a role)
2. Store the user in React context
3. Make the context available to all Stage 2 pages

#### Step 2: Dashboard Filtering

In `IntelligenceServicesPage` and the sidebar, filter services:

```typescript
const visibleServices = intelligenceServices.filter(
  service => service.visibleToRoles.includes(currentUser.role)
);
```

#### Step 3: Data Scope Enforcement

In `ServiceDashboardPage`, apply data scope:

| Role | `dataScope` Value | What They See |
|------|------------------|---------------|
| Staff | 'own' | Only their own apps/projects |
| Manager | 'team' | Their team's apps/projects |
| Director | 'domain' | Their department's data |
| Executive | 'all' | Everything |

#### Step 4: Sensitive Data Filtering

Per the spec's data sensitivity levels:
- **Public:** Aggregate counts, general metrics → Everyone
- **Role-Restricted:** Team/department metrics → Managers+
- **Sensitive:** Financial details, vendor pricing → Executives + TO only

#### Permission Matrix (from spec)

| Capability | Staff | Manager | Director | Executive | Architect | Analyst | TO |
|-----------|-------|---------|----------|-----------|-----------|---------|-----|
| View public dashboards | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View role-specific | Own | Manager+ | Director+ | All | Architect | Analyst | All |
| View sensitive data | ❌ | Team | Dept | All | Tech | Depends | All |
| Create custom | Personal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schedule reports | Self | Team | Dept | All | Self | Self | All |
| Manage AI insights | ❌ | Ack | Ack | All | Ack | View | Manage |

**Estimated Effort:** 5-6 days

---

## 9. CROSS-MARKETPLACE INTEGRATION

### Current State

Digital Intelligence data is completely isolated in `src/data/digitalIntelligence/`. No cross-references to other marketplace data.

### Spec's Vision

Digital Intelligence should **analyze data from all other marketplaces**:

| Source Marketplace | Data Analyzed | Example Dashboards |
|-------------------|---------------|--------------------|
| Portfolio Management | App health, rationalization, tech debt | Portfolio Health, Rationalization Matrix |
| Lifecycle Management | Initiative progress, velocity, ROI | Transformation Pipeline, Delivery Metrics |
| Learning Center | Enrollment, completion, skill gaps | Learning Engagement, Skills Matrix |
| Support Services | Ticket volume, SLA, satisfaction | Support Performance, Issue Trends |
| Solutions Build | Delivery pipeline, build queue | Delivery Capacity, Backlog Health |
| Knowledge Center | Article views, search queries | Content Engagement, Knowledge Effectiveness |

### Recommendations

1. **Import shared data** — Where data exists in other marketplace data files (e.g., `src/data/portfolio/`), import aggregate counts and metrics into Digital Intelligence dashboards.

2. **Cross-marketplace navigation** — When a user drills down to an individual entity (e.g., an application, initiative, or course), provide a "View in [Marketplace]" link that navigates to Stage 2 with appropriate context via React Router's `state` parameter.

3. **Data references** — In AI insights and dashboard table data, include entity IDs that map to other marketplaces:
   ```typescript
   affectedEntities: ['APP-CRM-001', 'APP-ERP-002'], // → Portfolio Management
   relatedInitiatives: ['INIT-CLOUD-001'],             // → Lifecycle Management
   ```

4. **Unified data layer (future)** — Consider creating a shared `src/data/shared/` directory with aggregate metrics that Digital Intelligence consumes from all marketplaces.

---

## 10. TECHNICAL DEBT & LIBRARY GAPS

### Missing Libraries (Need to Install)

| Library | Purpose | npm Command |
|---------|---------|-------------|
| `jspdf` | PDF export | `npm install jspdf` |
| `html2canvas` | Screenshot charts for PDF/PNG | `npm install html2canvas` |
| `xlsx` | Excel export (SheetJS) | `npm install xlsx` |
| `pptxgenjs` | PowerPoint export | `npm install pptxgenjs` |
| `@dnd-kit/core` | Drag-and-drop (dashboard builder) | `npm install @dnd-kit/core` |
| `@dnd-kit/sortable` | Sortable drag-and-drop | `npm install @dnd-kit/sortable` |
| `react-grid-layout` | Resizable grid layout (builder) | `npm install react-grid-layout` |

### Existing Libraries Not Yet Utilized

| Library | Installed | Used by DI? | Opportunity |
|---------|-----------|-------------|-------------|
| `@tanstack/react-query` | ✅ Yes | ❌ No | Use for dashboard data fetching with polling |
| `react-day-picker` | ✅ Yes | ❌ No | Use for date range filters |
| `react-resizable-panels` | ✅ Yes | ❌ No | Could enhance LVE column resizing |
| `sonner` | ✅ Yes | ❌ No | Use for toast notifications (export success, etc.) |
| `cmdk` | ✅ Yes | ❌ No | Could power dashboard command palette / quick search |

### Performance Considerations

1. **Dashboard data caching** — Use React Query with `staleTime` based on `updateFrequency` (real-time: 30s, hourly: 30min, daily: 1hr).

2. **Lazy loading** — Dashboard pages and chart components should be lazy-loaded:
   ```typescript
   const ServiceDashboardPage = lazy(() => import('./ServiceDashboardPage'));
   ```

3. **Virtual scrolling** — For the 52-dashboard list in Column 2, consider virtual scrolling if performance becomes an issue.

4. **Debounced filters** — Filter changes in Column 2 and Column 3 should be debounced (already done for search in Stage 1).

---

## 11. QUICK WINS

These are changes that provide immediate alignment with the spec at minimal effort:

| # | Quick Win | Effort | Impact |
|---|-----------|--------|--------|
| 1 | Rename hero subtitle to "Data-driven insights for transformation decisions" | 5 min | Aligns messaging |
| 2 | Change "30 Intelligence Services" to "50+ Dashboards" in stats | 5 min | Matches spec language |
| 3 | Add `targetRole` field to `IntelligenceService` type and data | 30 min | Enables role filtering |
| 4 | Add health score color palette to chart colors (green → red) | 15 min | Matches spec's visual language |
| 5 | Add 4 stat cards below the hero (847, $12.4M, 73%, 2,847) | 1 hr | Major visual alignment |
| 6 | Add "Explore Dashboards" CTA button in hero | 15 min | Key missing interaction |
| 7 | Add "View All Insights" link on overview page | 10 min | Navigation improvement |
| 8 | Add favorite star toggle to Column 2 list items | 1 hr | Key spec feature |
| 9 | Add last updated timestamp to Column 2 list items | 30 min | Matches spec layout |
| 10 | Use `sonner` for toast on export/favorite actions | 30 min | Better UX feedback |

---

## 12. PRIORITIZED IMPLEMENTATION ROADMAP

### Phase 1: Content & Data Foundation (Week 1-2)

**Goal:** Expand data to spec requirements and fix structural mismatches.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Reclassify 30 services into 6 spec categories | 2 days | Decision on taxonomy |
| Add 22 new dashboard service definitions | 3 days | Category taxonomy |
| Generate `sampleDashboardData` for all 52 dashboards | 3 days | Dashboard definitions |
| Create 143 AI insights in dedicated data file | 2 days | Dashboard definitions |
| Add `targetRole`, `tags`, `slug` to `IntelligenceService` type | 0.5 day | None |
| Extend `AIInsight` type with spec fields | 0.5 day | None |

### Phase 2: Stage 1 Enhancement (Week 2-3)

**Goal:** Transform the marketplace page into the spec's rich landing experience.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Enhance `MarketplaceHeader` (hero icon, CTA buttons, subtitle) | 1 day | None |
| Build `KeyStatisticsSection` (4 metric cards) | 0.5 day | None |
| Build `SampleDashboardPreview` (interactive mini-chart) | 1 day | None |
| Build `DashboardsByRoleSection` (6 role cards) | 1 day | None |
| Build `FeaturedDashboardsSection` (3 cards) | 0.5 day | None |
| Build `DashboardCategoriesSection` (6 cards) | 0.5 day | Category taxonomy |
| Build `AIInsightsPreviewSection` | 0.5 day | AI insights data |
| Build `WhatYouCanDoSection` + `DataSourcesSection` + `CTASection` | 0.5 day | None |

### Phase 3: Stage 2 Column 2 Enhancement (Week 3-4)

**Goal:** Transform the dashboard list into a rich browsing experience.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Add View Tabs (All, Favorites, Recently Viewed, Custom) | 1 day | None |
| Add Filter Panel (Category, Role, Data Source, Frequency) | 1.5 days | `targetRole` field |
| Add Sort dropdown | 0.5 day | None |
| Enhance list item cards (badges, timestamps, favorite toggle) | 1 day | None |
| Add "+ Create Custom Dashboard" button | 0.5 day | Builder page (Phase 6) |
| Add dashboard count header | 0.5 day | None |

### Phase 4: Stage 2 Column 3 Interactivity (Week 4-6)

**Goal:** Add the spec's most impactful interactive features.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Implement drill-down navigation (click → filter → breadcrumb) | 3 days | URL state management |
| Implement URL state for filters/drill-down | 1 day | None |
| Install export libraries (`jspdf`, `xlsx`, `pptxgenjs`, `html2canvas`) | 0.5 day | npm install |
| Implement PDF export | 1 day | Libraries installed |
| Implement Excel export | 1 day | Libraries installed |
| Implement PowerPoint export | 1.5 days | Libraries installed |
| Implement PNG/CSV export | 0.5 day | Libraries installed |
| Build Schedule Report modal/form | 1.5 days | `ScheduledReport` type |
| Add Share functionality (copy link, email) | 1 day | None |
| Add Date Range selector | 1 day | `react-day-picker` |
| Add scatter/funnel/gauge chart types | 2 days | None |
| Add multi-series chart support | 1 day | None |
| Add legend toggle, chart↔table toggle | 1 day | None |

### Phase 5: New Pages (Week 6-8)

**Goal:** Build the four missing Stage 2 pages.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Build AI Insights Hub page | 5 days | AI insights data |
| Build Scheduled Reports management page | 3 days | Schedule modal |
| Build Dashboard Gallery page | 3 days | Dashboard data |
| Build Custom Dashboard Builder (MVP — template-based) | 5 days | Widget components |
| Add sidebar sub-navigation items | 0.5 day | New pages |
| Add routes to `App.tsx` | 0.5 day | New pages |

### Phase 6: RBAC & Integration (Week 8-10)

**Goal:** Implement role-based access and cross-marketplace navigation.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Create `UserContext` with role storage | 1 day | None |
| Implement dashboard filtering by role | 1 day | User context |
| Implement data scope enforcement | 2 days | User context |
| Implement sensitive data filtering | 1 day | Data scope |
| Add cross-marketplace navigation links | 1 day | Other marketplace routes |
| Import shared data from other marketplaces | 2 days | Other marketplace data |

### Phase 7: Polish & Advanced (Week 10-12)

**Goal:** Advanced features and production readiness.

| Task | Effort | Dependencies |
|------|--------|-------------|
| Custom Dashboard Builder — drag-and-drop (Phase 2) | 10 days | @dnd-kit, react-grid-layout |
| Auto-refresh implementation | 1 day | React Query |
| Data quality indicator | 1 day | None |
| Full-screen chart mode | 1 day | None |
| Loading skeletons for all data | 1 day | None |
| Error handling for all data fetching | 1 day | None |
| Mobile responsive testing & fixes | 2 days | None |
| Performance optimization (lazy loading, virtual scroll) | 2 days | None |

### Total Estimated Effort

| Phase | Effort | Cumulative |
|-------|--------|-----------|
| Phase 1: Content & Data | 11 days | 11 days |
| Phase 2: Stage 1 Enhancement | 5 days | 16 days |
| Phase 3: Column 2 Enhancement | 5 days | 21 days |
| Phase 4: Column 3 Interactivity | 15 days | 36 days |
| Phase 5: New Pages | 17 days | 53 days |
| Phase 6: RBAC & Integration | 8 days | 61 days |
| Phase 7: Polish & Advanced | 18 days | 79 days |
| **TOTAL** | **~79 working days** | ~16 weeks |

---

## 13. APPENDIX: FILE-BY-FILE INVENTORY

### Files That Need Modification (Existing)

| File | Changes Needed |
|------|---------------|
| `src/data/digitalIntelligence/stage2/types.ts` | Extend interfaces: add `targetRole`, `tags`, `slug`, `impact`, `status`, `affectedEntities`, chart config fields |
| `src/data/digitalIntelligence/stage2/intelligenceServices.ts` | Reclassify 30 services, add new fields, add 22 new services |
| `src/data/digitalIntelligence/stage2/sampleDashboardData.ts` | Add dashboard data for 47 more services |
| `src/components/digitalIntelligence/MarketplaceHeader.tsx` | Add large icon, CTA buttons, simplified subtitle, stat tags |
| `src/pages/DigitalIntelligencePage.tsx` | Add 8+ new sections below hero |
| `src/pages/stage2/intelligence/IntelligenceServicesPage.tsx` | Add tabs, filters, sort, enhanced list items |
| `src/pages/stage2/intelligence/ServiceDashboardPage.tsx` | Add drill-down, export logic, share, date range, auto-refresh |
| `src/components/digitalIntelligence/stage2/DashboardWidget.tsx` | Add scatter/funnel/gauge, drill-down onClick, legend toggle, multi-series |
| `src/components/digitalIntelligence/stage2/InsightCard.tsx` | Add status management, action buttons, expanded fields |
| `src/pages/Stage2AppPage.tsx` | Add sidebar sub-items for new pages, add routes |
| `src/App.tsx` | Add routes for gallery, insights, builder, reports |

### Files That Need Creation (New)

| File | Purpose |
|------|---------|
| `src/data/digitalIntelligence/stage2/aiInsightsData.ts` | 143 AI insights (dedicated file) |
| `src/data/digitalIntelligence/stage2/dashboardCategories.ts` | 6 category definitions |
| `src/components/digitalIntelligence/KeyStatisticsSection.tsx` | Stage 1: 4 metric cards |
| `src/components/digitalIntelligence/SampleDashboardPreview.tsx` | Stage 1: interactive mini-chart |
| `src/components/digitalIntelligence/DashboardsByRoleSection.tsx` | Stage 1: 6 role cards |
| `src/components/digitalIntelligence/FeaturedDashboardsSection.tsx` | Stage 1: 3 featured cards |
| `src/components/digitalIntelligence/DashboardCategoriesSection.tsx` | Stage 1: 6 category cards |
| `src/components/digitalIntelligence/AIInsightsPreviewSection.tsx` | Stage 1: insight examples |
| `src/components/digitalIntelligence/WhatYouCanDoSection.tsx` | Stage 1: capabilities list |
| `src/components/digitalIntelligence/DataSourcesSection.tsx` | Stage 1: data sources |
| `src/components/digitalIntelligence/CTASection.tsx` | Stage 1: bottom CTA |
| `src/pages/stage2/intelligence/InsightsHubPage.tsx` | AI Insights Hub page |
| `src/pages/stage2/intelligence/DashboardGalleryPage.tsx` | Dashboard Gallery page |
| `src/pages/stage2/intelligence/DashboardBuilderPage.tsx` | Custom Dashboard Builder |
| `src/pages/stage2/intelligence/ScheduledReportsPage.tsx` | Scheduled Reports page |
| `src/components/digitalIntelligence/stage2/ScheduleReportModal.tsx` | Report scheduling form |
| `src/components/digitalIntelligence/stage2/ShareMenu.tsx` | Share dropdown menu |
| `src/components/digitalIntelligence/stage2/ExportMenu.tsx` | Export dropdown with logic |
| `src/components/digitalIntelligence/stage2/DrillDownBreadcrumb.tsx` | Drill-down navigation trail |
| `src/components/digitalIntelligence/stage2/DataQualityIndicator.tsx` | Data quality bar |
| `src/lib/exportUtils.ts` | PDF/Excel/PPT/PNG/CSV export functions |
| `src/hooks/useUserContext.ts` | User role context hook |
| `src/hooks/useDashboardFilters.ts` | Dashboard filter state + URL sync |
| `src/hooks/useFavorites.ts` | Favorites management (localStorage) |

---

*End of Document*

*Generated: February 17, 2026*  
*This document should be reviewed alongside the Developer Briefing Document v1.0*
