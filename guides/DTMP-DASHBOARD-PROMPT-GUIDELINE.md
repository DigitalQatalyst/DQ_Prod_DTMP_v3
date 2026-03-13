# DTMP Dashboards — Prompt Guideline for Developers

> **Purpose:** The single source of truth for anyone (human or AI) building features on the DTMP platform. Read the Quick Start first, then dive into the section you need.

---

## Quick Start (Read This First)

### What is DTMP in one sentence?

DTMP is a **client-side React SPA** that provides 9 marketplaces and their dashboards, organized around a 4-phase digital transformation model (Discern → Design → Deploy → Drive). There is **no backend** — all data lives in `localStorage` and in-memory arrays.

### Setup

```bash
# Clone and install
git clone https://github.com/DigitalQatalyst/DQ_Prod_DTMP_v3.git
cd DQ_Prod_DTMP_v3
npm install

# Start dev server (port 8080)
npm run dev

# Run tests
npm run test
```

### The 5 things every developer must know

| #  | Rule | Why |
|----|------|-----|
| 1  | Use `@/` path alias for all imports | Maps to `src/`; keeps imports consistent |
| 2  | Use shadcn/ui components, never raw HTML elements | Ensures consistent look and behavior |
| 3  | Use Tailwind CSS only — no CSS modules, styled-components | Single styling approach across the codebase |
| 4  | All data is mock/localStorage — never call `fetch()` or `axios` | There is no backend server |
| 5  | Follow feature-based file organization | Components, types, and data for a feature live together |

### What do I need to build? (Decision Tree)

```
Start here → What are you building?
│
├─ A new Marketplace page (Stage 1)
│  └─ Go to §11.1 — Template: New Marketplace
│
├─ A new Dashboard for an existing DI service
│  └─ Go to §11.2 — Template: New Dashboard
│
├─ Stage 2 workspace integration
│  └─ Go to §11.3 — Template: Stage 2 Integration
│
├─ A request/intake pipeline for a marketplace
│  └─ Go to §11.4 — Template: New Request System
│
├─ A UI fix or visual enhancement
│  └─ Go to §11.5 — Template: UI Enhancement / Bug Fix
│
└─ Something else
   └─ Read §3 Architecture + §5 Component Patterns, then adapt
```

---

## Table of Contents

| # | Section | What you'll learn |
|---|---------|-------------------|
| 1 | [Project Overview](#1-project-overview) | What DTMP is, its stages, and key characteristics |
| 2 | [Technology Stack](#2-technology-stack) | Every library we use (and what we don't) |
| 3 | [Project Architecture](#3-project-architecture) | Folder structure and architecture principles |
| 4 | [Design System & Theming](#4-design-system--theming) | Colors, typography, spacing, responsive rules |
| 5 | [Component Patterns](#5-component-patterns) | Copy-paste patterns for pages, widgets, charts, modals |
| 6 | [Data Layer Patterns](#6-data-layer-patterns) | localStorage stores, mock data, intake pipelines |
| 7 | [Dashboard-Specific Patterns](#7-dashboard-specific-patterns) | Widget configs, metric types, layout diagrams |
| 8 | [Routing & Navigation](#8-routing--navigation) | Route map and how to add new routes |
| 9 | [Authentication & Authorization](#9-authentication--authorization) | Login flow, roles, and permissions |
| 10 | [Naming Conventions](#10-naming-conventions) | File, component, variable, and ID naming rules |
| 11 | [Prompt Templates](#11-prompt-templates) | Ready-to-use prompts for common tasks |
| 12 | [Common Pitfalls](#12-common-pitfalls--anti-patterns) | DO and DON'T checklists |
| 13 | [Pre-Prompt Checklist](#13-pre-prompt-checklist) | Verify before you start building |
| 14 | [Cheat Sheet](#14-cheat-sheet) | One-page quick reference |
| 15 | [Appendix: Key File Reference](#15-appendix-key-file-reference) | Important file paths and their purposes |

---

## 1. Project Overview

### What is DTMP?

DTMP is a **Digital Transformation Management Platform** built as a client-side Single Page Application (SPA). It provides a suite of marketplaces and dashboards that support the enterprise digital transformation journey through the **4D Model**:

```
 Discern ──→ Design ──→ Deploy ──→ Drive
 (Discover)   (Plan)    (Build)   (Operate)
```

### Platform Stages

The platform has three stages, each serving a different user need:

| Stage | Name | Who uses it | What it does | Route |
|-------|------|-------------|--------------|-------|
| **Stage 1** | Marketplaces | Everyone | Browse and discover services | `/marketplaces/*` |
| **Stage 2** | Service Hub | Authenticated users | Interactive workspaces and dashboards | `/stage2/*` |
| **Stage 3** | TO Operations | TO Admins & Ops only | Governance, request management | `/stage3/*` |

### The 9 Marketplaces

Each marketplace belongs to one of the 4D phases:

| 4D Phase | Marketplace | Route Slug | Color |
|----------|-------------|------------|-------|
| **Discern** (Blue) | Learning Center | `learning-center` | `--phase-discern` |
| **Discern** (Blue) | Knowledge Center | `knowledge-center` | `--phase-discern` |
| **Design** (Purple) | Document Studio | `document-studio` | `--phase-design` |
| **Design** (Purple) | Solution Specs | `solution-specs` | `--phase-design` |
| **Deploy** (Green) | Solution Build | `solution-build` | `--phase-deploy` |
| **Deploy** (Green) | Support Services | `support-services` | `--phase-deploy` |
| **Drive** (Orange) | Digital Intelligence | `digital-intelligence` | `--phase-drive` |
| **Drive** (Orange) | Portfolio Management | `portfolio-management` | `--phase-drive` |
| **Drive** (Orange) | Lifecycle Management | `lifecycle-management` | `--phase-drive` |

### Key Characteristics

- **Client-only SPA** — No backend server; all data is mock/localStorage.
- **Prompt-driven development** — Built incrementally via structured AI prompts (Prompt 1 through 9+).
- **Data is simulated** — Uses in-memory arrays and `localStorage` for persistence.
- **TanStack Query wired but unused** — `QueryClientProvider` is present for future API integration.

---

## 2. Technology Stack

### Core Stack

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| **Framework** | React | 18.3 | Functional components + hooks only |
| **Language** | TypeScript | 5.8 | Strict mode; type everything |
| **Build Tool** | Vite | 5.4 | Dev server on port 8080 |
| **Routing** | React Router DOM | 6.30 | Nested routes in `App.tsx` |
| **UI Library** | shadcn/ui (Radix UI) | Latest | Pre-built accessible components |
| **Styling** | Tailwind CSS | 3.4 | Utility-first; no custom CSS files |
| **Charts** | Recharts | 2.15 | All data visualizations |
| **Icons** | Lucide React | Latest | Consistent icon set |
| **Forms** | React Hook Form + Zod | Latest | Validation and form state |
| **Data Fetching** | TanStack React Query | Latest | Configured but not actively used |
| **Theming** | next-themes | Latest | Light/dark mode support |
| **Toasts** | Sonner | Latest | Notification popups |
| **Testing** | Vitest + Testing Library | Latest | Unit and component tests |

### Key Utilities

| Utility | What it does | Where to find it |
|---------|-------------|-----------------|
| `cn()` | Merges Tailwind classes conditionally (wraps `clsx` + `tailwind-merge`) | `src/lib/utils.ts` |
| `date-fns` | Date formatting and manipulation | Various components |
| `cmdk` | Command menu component | `src/components/ui/command.tsx` |

### What We Do NOT Use

> If you're tempted to add any of these, stop and ask first.

- **No** Redux, Zustand, or external state management
- **No** Axios or Fetch calls to external APIs
- **No** CSS Modules, styled-components, or Emotion
- **No** Next.js, Express, or server-side rendering
- **No** database, ORM, or SQL
- **No** environment variables or `.env` files

---

## 3. Project Architecture

### Directory Structure

```
src/
├── components/                    # All UI components
│   ├── ui/                        # shadcn/ui primitives (DO NOT EDIT)
│   ├── layout/                    # Header, Footer, ComingSoon
│   ├── sections/                  # Landing page sections
│   ├── cards/                     # Reusable card components
│   ├── shared/                    # Cross-cutting (MarketplaceHeader, TypeTabs, FilterPanel)
│   ├── digitalIntelligence/       # DI-specific components
│   │   └── stage2/                # DI widgets (DashboardWidget, InsightCard, MetricCard)
│   ├── portfolio/                 # Portfolio dashboards
│   ├── stage2/                    # Stage 2 workspace panels
│   ├── learningCenter/            # Learning Center components
│   ├── knowledgeCenter/           # Knowledge Center components
│   ├── supportServices/           # Support Services components
│   └── templates/                 # Document Studio components
│
├── pages/                         # Route-level page components
│   ├── stage2/                    # Stage 2 sub-pages
│   │   ├── intelligence/          # DI workspace pages
│   │   ├── support/               # Support workspace pages
│   │   └── ...
│   ├── lifecycle/                 # Lifecycle Management pages
│   ├── solutionBuild/             # Solution Build pages
│   └── [MarketplaceName]Page.tsx  # Stage 1 marketplace pages
│
├── data/                          # Data layer (mock data + localStorage)
│   ├── shared/                    # localStorageUtils.ts
│   ├── digitalIntelligence/       # DI data, configs, sample data
│   │   └── stage2/                # DI Stage 2 types, services, requests
│   ├── portfolio/                 # Portfolio health data
│   ├── stage3/                    # Stage 3 requests, intake, sync
│   └── [marketplace]/             # Per-marketplace request state
│
├── contexts/                      # React Context providers
│   └── AuthContext.tsx             # Authentication context
│
├── hooks/                         # Custom React hooks
│   ├── useSupportWorkspace.ts
│   ├── use-toast.ts
│   └── use-mobile.tsx
│
├── layouts/                       # Layout wrappers
│   └── Stage2Layout.tsx           # Three-column LVE layout
│
├── lib/                           # Utility functions
│   └── utils.ts                   # cn() helper
│
├── types/                         # Global TypeScript types
│   └── requests.ts
│
└── test/                          # Test files (Vitest)
```

### Architecture Principles

| Principle | Meaning |
|-----------|---------|
| **Feature-based organization** | Components grouped by marketplace/feature, not by type |
| **Barrel exports** | Each feature folder has an `index.ts` for clean imports |
| **Colocation** | Types, data, and components for a feature live together |
| **Path alias** | `@/` maps to `src/` (e.g., `import { cn } from '@/lib/utils'`) |
| **Separation of concerns** | Pages = routing/layout; Components = rendering; Data layer = state |

### Where to put new files

| You're creating... | Put it in... |
|--------------------|-------------|
| A new page | `src/pages/[MarketplaceName]Page.tsx` |
| Marketplace components | `src/components/[marketplaceName]/` |
| Data/types for a marketplace | `src/data/[marketplaceName]/` |
| A shared/reusable component | `src/components/shared/` |
| A custom hook | `src/hooks/` |
| Global types | `src/types/` |

---

## 4. Design System & Theming

### Color Palette

All colors are defined as CSS custom properties in `src/index.css` and mapped through `tailwind.config.ts`.

#### Core Brand Colors

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| `--navy` | `bg-navy`, `text-navy` | Primary headers, footers, titles |
| `--navy-light` | `bg-navy-light` | Sidebar backgrounds |
| `--blue-accent` | `text-blue-accent` | Links, active states |
| `--light-blue` | `bg-light-blue` | Card backgrounds, sections |
| `--orange` | `bg-orange`, `text-orange` | CTAs, accent buttons |
| `--purple` | `text-purple-600` | Chart primary, Design phase |
| `--green` | `text-green-600` | Deploy phase, success |
| `--pink` | `text-pink` | Decorative accents |

#### 4D Phase Colors (use these for marketplace branding)

| Phase | Text Class | Background Class | Where used |
|-------|-----------|-----------------|------------|
| Discern | `text-phase-discern` | `bg-phase-discern-bg` | Learning Center, Knowledge Center |
| Design | `text-phase-design` | `bg-phase-design-bg` | Document Studio, Solution Specs |
| Deploy | `text-phase-deploy` | `bg-phase-deploy-bg` | Solution Build, Support Services |
| Drive | `text-phase-drive` | `bg-phase-drive-bg` | DI, Portfolio, Lifecycle |

#### Usage Examples

```tsx
// Phase badges
<span className="bg-phase-discern-bg text-phase-discern">Discern</span>
<span className="bg-phase-drive-bg text-phase-drive">Drive</span>

// Primary buttons
<button className="bg-orange hover:bg-orange-hover text-white">Access Service</button>

// Cards
<Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">

// Navy header
<header className="bg-navy text-white">
```

#### Severity / Status Colors

| Status | Text | Background | When to use |
|--------|------|------------|-------------|
| Success / Healthy | `text-green-600` | `bg-green-50` | Completed, healthy, on track |
| Warning / At Risk | `text-orange-600` | `bg-orange-50` | At risk, needs attention |
| Error / Critical | `text-red-600` | `bg-red-50` | Failed, critical, blocked |
| Info / Default | `text-purple-600` | `bg-purple-50` | Informational, neutral |

### Chart Color Scheme

All Recharts visualizations use the **purple-based palette**:

```typescript
const COLORS = ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

// Standard chart line/fill
stroke="#7C3AED"
strokeWidth={2.5}

// Area chart gradient (copy this into your chart)
<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.05}/>
</linearGradient>
```

### Typography

| Element | Tailwind Classes |
|---------|-----------------|
| Page title | `text-2xl font-bold text-gray-900` |
| Section heading | `text-xl font-semibold text-gray-900` |
| Card title | `text-base font-semibold text-gray-900` |
| Card description | `text-xs text-gray-500` or `text-sm text-gray-600` |
| Metric value | `text-3xl font-bold text-gray-900` |
| Metric unit | `text-lg text-gray-600` |
| Label | `text-sm text-gray-600` |
| Badge | `text-xs font-semibold uppercase` |

### Spacing & Layout

| Pattern | Tailwind Classes |
|---------|-----------------|
| Page padding | `px-4 sm:px-6 lg:px-8` |
| Section spacing | `py-8 lg:py-12` |
| Card padding | `p-6` |
| Grid gap | `gap-4` or `gap-6` |
| Responsive grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Dashboard grid | `grid grid-cols-1 lg:grid-cols-3 gap-4` |

### Responsive Breakpoints

| Breakpoint | Prefix | Typical layout |
|------------|--------|---------------|
| < 640px | *(default)* | Mobile — single column |
| ≥ 640px | `sm:` | Small tablets |
| ≥ 768px | `md:` | Tablets — 2 columns |
| ≥ 1024px | `lg:` | Desktop — 3+ columns |
| ≥ 1280px | `xl:` | Wide desktop |

### Border Radius

Default radius is `0.75rem` (12px), defined as `--radius` in CSS:

```tsx
className="rounded-xl"    // 0.75rem — standard cards
className="rounded-lg"    // calc(0.75rem - 2px) — inner elements
className="rounded-md"    // buttons, inputs
className="rounded-full"  // badges, pills, avatars
```

---

## 5. Component Patterns

> Every pattern below is copy-paste ready. Replace the placeholders and you're done.

### 5.1 Page Component

Every page follows this skeleton:

```tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const MyMarketplacePage = () => {
  const [activeTab, setActiveTab] = useState('tab-name');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => /* filtering logic */);
  }, [items, searchQuery, activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* MarketplaceHeader with breadcrumbs */}
        {/* Tab Navigation */}
        {/* Filters + Content Grid */}
      </main>
      <Footer />
    </div>
  );
};

export default MyMarketplacePage;
```

### 5.2 Dashboard Widget

`DashboardWidget` is the **universal renderer** for all widget types. You configure it with data, and it picks the right sub-component:

```tsx
// Widget types: 'metric' | 'chart' | 'table' | 'insight' | 'heatmap'
// Chart types:  'line' | 'bar' | 'pie' | 'donut' | 'radar' | 'scatter' | 'area' | 'gauge'

<DashboardWidget
  widget={widgetConfig}    // DashboardWidget type from types.ts
  data={dashboardData}     // DashboardData with metrics, timeSeries, widgetData
  style={optionalStyles}
/>
```

Sub-components rendered internally:

| Sub-component | Renders when `widget.type` is |
|---------------|-------------------------------|
| `MetricWidget` | `'metric'` — KPI cards with trend arrows |
| `ChartWidget` | `'chart'` — Recharts visualization (7 chart types) |
| `TableWidget` | `'table'` — Data tables with status badges |
| `InsightWidget` | `'insight'` — AI insight cards |

### 5.3 Card Component

```tsx
<Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
  <div className="flex items-start gap-3 mb-4">
    {/* Icon + Title */}
  </div>
  <div className="flex-1">
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
  {/* Optional trend indicator */}
</Card>
```

### 5.4 Filter Component

```tsx
// Dropdown filter
<Select value={filter} onValueChange={setFilter}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>

// Search filter
<Input
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

### 5.5 Recharts Chart

All charts follow this pattern — always wrap in `ResponsiveContainer`:

```tsx
<ResponsiveContainer width="100%" height={240}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
    <XAxis
      dataKey="name"
      tick={{ fontSize: 12, fill: '#9ca3af' }}
      axisLine={{ stroke: '#e5e7eb' }}
      tickLine={false}
    />
    <YAxis
      tick={{ fontSize: 12, fill: '#9ca3af' }}
      axisLine={false}
      tickLine={false}
    />
    <Tooltip content={<CustomTooltip />} />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#7C3AED"
      strokeWidth={2.5}
      dot={{ fill: '#7C3AED', r: 4, strokeWidth: 0 }}
      activeDot={{ r: 6, fill: '#7C3AED' }}
    />
  </LineChart>
</ResponsiveContainer>
```

### 5.6 Modal / Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    {/* Modal body */}
  </DialogContent>
</Dialog>
```

### 5.7 Toast Notification

```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();
toast({
  title: "Success",
  description: "Action completed successfully.",
});
```

---

## 6. Data Layer Patterns

### 6.1 localStorage Store (the standard pattern)

Every marketplace that persists request state uses `makeLocalStorageStore`. This is the **only** way to read/write localStorage in this project:

```typescript
import { makeLocalStorageStore } from '@/data/shared/localStorageUtils';

const STORAGE_KEY = "dtmp.myMarketplace.toRequests";
const MAX_ITEMS = 200;

const store = makeLocalStorageStore<MyRequestType>(STORAGE_KEY, MAX_ITEMS);

// Read all items (optionally filter by requester)
export const getMyRequests = (requesterName?: string): MyRequestType[] => {
  const all = store.read();
  return requesterName ? all.filter(r => r.requesterName === requesterName) : all;
};

// Add a new item (prepend to array)
export const addMyRequest = (request: MyRequestType): void => {
  const all = store.read();
  store.write([request, ...all]);
};

// Update status by ID
export const updateMyRequestStatus = (id: string, status: string): void => {
  const all = store.read();
  store.write(all.map(r => r.id === id ? { ...r, status } : r));
};
```

### 6.2 Storage Key Convention

All keys follow the pattern **`dtmp.<domain>.<entity>`**:

| Key | Purpose |
|-----|---------|
| `dtmp.session.authenticated` | Auth flag (boolean string) |
| `dtmp.session.role` | User role |
| `dtmp.knowledge.toRequests` | Knowledge Center TO requests |
| `dtmp.learning.toRequests` | Learning Center TO requests |
| `dtmp.support.toRequests` | Support Services TO requests |
| `dtmp.blueprints.toRequests` | Blueprints TO requests |
| `dtmp.templates.toRequests` | Templates TO requests |
| `dtmp.di.toRequests` | Digital Intelligence TO requests |
| `dtmp.di.dashboardRequests` | DI dashboard update requests |
| `stage3Requests` | Stage 3 TO requests |

### 6.3 Type Definition Pattern

All data models follow this shape:

```typescript
export interface MyEntity {
  id: string;                // kebab-case slug (e.g., "app-rationalization")
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'under-review' | 'in-progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  submittedDate: string;     // ISO 8601 date string
}
```

### 6.4 Mock Data Pattern

Sample data lives in dedicated files per feature:

```typescript
// src/data/digitalIntelligence/stage2/sampleDashboardData.ts
export const sampleDashboardData: Record<string, DashboardData> = {
  'service-id-1': {
    serviceId: 'service-id-1',
    dataSource: 'live',
    timeSeries: [/* ... */],
    metrics: [/* ... */],
    insights: [/* ... */],
    tableData: [/* ... */],
    generatedAt: new Date().toISOString(),
    dataRange: { start: '...', end: '...' }
  },
};
```

### 6.5 Intake Pipeline (Stage 1/2 → Stage 3)

When a user submits a request in a marketplace, it flows to Stage 3 for governance:

```
User submits request
  → Create marketplace-level request (localStorage)
  → Create Stage 3 request (localStorage)
  → Link them via relatedAssets
```

```typescript
// src/data/stage3/intake.ts
export function createMyStage3Intake(input: IntakeInput): Stage3Request {
  const marketplaceRequest = addMyRequest({ /* ... */ });

  const stage3Request = createStage3Request({
    ...input,
    relatedAssets: [`my-request:${marketplaceRequest.id}`],
  });

  linkMyRequestToStage3(marketplaceRequest.id, stage3Request.id);

  return stage3Request;
}
```

### 6.6 Marketplace Sync (Stage 3 → Marketplaces)

When Stage 3 updates a request status, it syncs back to the originating marketplace:

```typescript
// src/data/stage3/marketplaceSync.ts
export function syncMarketplaceRequestStatusFromStage3(request: Stage3Request) {
  for (const asset of request.relatedAssets) {
    if (asset.startsWith('knowledge-request:')) {
      updateTORequestStatus(extractId(asset), mapStatus(request.status));
    }
    // ... handle each marketplace prefix
  }
}
```

---

## 7. Dashboard-Specific Patterns

### 7.1 Dashboard Configuration

Each intelligence service has a `dashboardConfig` that defines its widgets, filters, and capabilities:

```typescript
export interface DashboardConfig {
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  defaultDateRange: string;
  defaultView: string;
  exportFormats: ('excel' | 'pdf' | 'powerpoint')[];
  supportsScheduling: boolean;
}
```

### 7.2 Widget Type System

```typescript
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'insight' | 'heatmap';
  title: string;
  description: string;
  position: { row: number; col: number; width: number; height: number };
  chartType?: 'line' | 'bar' | 'pie' | 'donut' | 'radar' | 'scatter' | 'area' | 'gauge';
  dataQuery?: string;
}
```

### 7.3 Metric Type

```typescript
export interface DashboardMetric {
  id: string;            // Must match widget.id for MetricWidget to find it
  label: string;
  value: number | string;
  unit?: string;         // '%', 'ms', '$', etc.
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;   // e.g., +5.2 for "+5.2%"
  trendLabel?: string;   // e.g., "vs last month"
  severity?: 'success' | 'warning' | 'error' | 'info';
}
```

### 7.4 AI Insight Type

```typescript
export interface AIInsight {
  id: string;
  type: 'alert' | 'info' | 'prediction' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;    // 0–100
  actionable: boolean;
  suggestedAction?: string;
}
```

### 7.5 Dashboard Page Layout

Every service dashboard follows this visual structure:

```
┌─────────────────────────────────────────────────────┐
│ Header (breadcrumbs, service name)                   │
├─────────────────────────────────────────────────────┤
│ Filters Bar (data source, date range, custom)        │
├─────────────────────────────────────────────────────┤
│ Metric Widgets (row of KPI cards)                    │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │Metric│ │Metric│ │Metric│ │Metric│                │
│ └──────┘ └──────┘ └──────┘ └──────┘                │
├─────────────────────────────────────────────────────┤
│ Chart Widgets (responsive 2×2 grid)                  │
│ ┌──────────────────┐ ┌──────────────────┐           │
│ │ Line/Area Chart  │ │ Bar Chart        │           │
│ └──────────────────┘ └──────────────────┘           │
│ ┌──────────────────┐ ┌──────────────────┐           │
│ │ Pie/Donut Chart  │ │ Radar Chart      │           │
│ └──────────────────┘ └──────────────────┘           │
├─────────────────────────────────────────────────────┤
│ Table Widget (full width, scrollable)                │
├─────────────────────────────────────────────────────┤
│ AI Insights (InsightCards)                            │
└─────────────────────────────────────────────────────┘
```

### 7.6 Portfolio Health Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│ Summary KPI Cards (4 across)                         │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │Health %│ │Uptime %│ │Vulns   │ │Resp ms │       │
│ └────────┘ └────────┘ └────────┘ └────────┘       │
├─────────────────────────────────────────────────────┤
│ Filters (Search, Health, Criticality, Status)        │
├─────────────────────────────────────────────────────┤
│ Sortable Application Table                           │
├─────────────────────────────────────────────────────┤
│ Pagination Controls                                  │
└─────────────────────────────────────────────────────┘
```

---

## 8. Routing & Navigation

### Complete Route Map

```
/                                                    → LandingPage
/marketplaces                                        → MarketplacesPage
/marketplaces/{marketplace-slug}                     → MarketplacePage (Stage 1)
/marketplaces/{marketplace-slug}/:tab/:cardId        → DetailPage (Stage 1)
/marketplaces/digital-intelligence/:tab/:cardId/dashboard → DI Dashboard
/stage2                                              → Stage2AppPage (Service Hub)
/stage2/{marketplace-section}                        → Stage 2 workspace
/stage2/{marketplace-section}/:tab                   → Stage 2 sub-tab
/stage3                                              → Stage3AppPage (TO Ops, auth-guarded)
/stage3/:view                                        → Stage 3 views (dashboard, requests, ...)
```

### How to Add a New Route

1. Create the page component in `src/pages/`
2. Import it in `src/App.tsx`
3. Add a `<Route>` inside the `<Routes>` block
4. Follow the existing URL pattern for the marketplace's stage

### Navigation Patterns

| Pattern | Implementation |
|---------|---------------|
| Breadcrumbs | `Home > Marketplaces > {Name} > {Item}` |
| Tab navigation | `TypeTabs` component or custom `useState` tabs |
| Back navigation | `useNavigate()` from React Router |
| Stage transitions | Stage 1 → LoginModal → redirect to Stage 2 |

---

## 9. Authentication & Authorization

### Login Flow (Step by Step)

```
1. User clicks "Access Service" on a Stage 1 card
2. LoginModal appears (email + password)
3. Email determines role:
   ├─ admin@to.dtmp.com     → to-admin
   ├─ *@to.dtmp.com         → to-ops
   └─ any other email       → business-user
4. Session saved to localStorage
5. User redirected to Stage 2 or Stage 3
```

### Role Permissions

| Role | Stage 1 | Stage 2 | Stage 3 |
|------|---------|---------|---------|
| `business-user` | Full access | Full access | **No access** |
| `to-ops` | Full access | Full access | Full access |
| `to-admin` | Full access | Full access | Full access |

### Auth Utilities

```typescript
import { isUserAuthenticated } from '@/data/sessionAuth';
import { getSessionRole, setSessionRole, isTOStage3Role } from '@/data/sessionRole';
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

---

## 10. Naming Conventions

### Files

| Type | Convention | Example |
|------|-----------|---------|
| Pages | PascalCase + `Page` suffix | `PortfolioManagementPage.tsx` |
| Components | PascalCase | `DashboardWidget.tsx` |
| Data files | camelCase | `sampleDashboardData.ts` |
| Type files | camelCase | `types.ts` |
| Hooks | camelCase with `use` prefix | `useSupportWorkspace.ts` |
| Utilities | camelCase | `localStorageUtils.ts` |
| Barrel exports | `index.ts` | `index.ts` |
| Tests | `*.test.ts` / `*.test.tsx` | `FilterPanel.test.tsx` |

### Components

| Suffix | When to use | Example |
|--------|------------|---------|
| `Page` | Route-level page component | `ServiceDashboardPage` |
| `DetailPage` | Detail/drill-down page | `KnowledgeCenterDetailPage` |
| `Widget` | Dashboard widget component | `DashboardWidget`, `MetricWidget` |
| `Card` | Card component | `InsightCard`, `MetricCard` |
| `Modal` | Dialog/modal component | `LoginModal`, `RequestFormModal` |
| `Dashboard` | Dashboard component | `PortfolioHealthDashboard` |

### Variables & Functions

| Convention | Pattern | Example |
|-----------|---------|---------|
| State variables | camelCase | `activeTab`, `searchQuery` |
| Event handlers | `handle` prefix | `handleActionClick`, `handleSubmit` |
| Boolean state | `is`/`has` prefix | `isOpen`, `isLoading`, `hasAccess` |
| Getters | `get` prefix | `getHealthColor`, `getStatusBadge` |
| Data arrays | Plural nouns | `filteredApplications` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY`, `MAX_ITEMS` |

### Types & Interfaces

| Convention | Pattern | Example |
|-----------|---------|---------|
| Interfaces | PascalCase | `DashboardWidget`, `AIInsight` |
| Enums/Unions | String literals | `'success' \| 'warning' \| 'error'` |
| Props | Component + `Props` | `DashboardWidgetProps` |
| Generics | Single uppercase letter | `T` in `makeLocalStorageStore<T>` |

### IDs & Slugs

- **IDs and URL slugs:** kebab-case → `application-rationalization`
- **localStorage keys:** dot-separated → `dtmp.domain.entity`
- **Related asset refs:** prefix:id → `knowledge-request:req-123`

---

## 11. Prompt Templates

> Copy the relevant template, fill in the `[PLACEHOLDERS]`, and use it as your AI prompt.

### 11.1 Template: New Marketplace (Stage 1)

```
Build the [MARKETPLACE NAME] marketplace page for the DTMP platform.

Context:
- This is Prompt [N] of the DTMP platform build sequence
- Phase: [Discern/Design/Deploy/Drive]
- Route: /marketplaces/[marketplace-slug]
- Already built: [list previous marketplaces]

Technical Stack:
- React 18 + TypeScript + Vite
- React Router v6, Tailwind CSS, shadcn/ui, Lucide React icons
- Responsive mobile-first design

Routing:
- Main page: /marketplaces/[marketplace-slug]
- Detail pages: /marketplaces/[marketplace-slug]/:tab/:cardId

Page Structure:
1. Header (reuse existing Header component)
2. Marketplace Header with breadcrumbs, phase badge, title, description, stats
3. Tab Navigation ([Tab1] | [Tab2] | ...)
4. Filter Panel (left sidebar on desktop, drawer on mobile)
5. Search Bar (marketplace-scoped)
6. Service Card Grid (responsive: 1/2/3 columns)
7. Footer (reuse existing Footer component)

Tab Data:
- [Tab 1]: [N] services — [description]
- [Tab 2]: [N] services — [description]

Filter Groups per Tab:
[Define filter categories and options]

Service Card Fields:
- id, title, description, icon, category, [domain-specific fields]
- Key metrics: [list 3-4 metric labels per card]

Detail Page Tabs:
- About, Methodology, Deliverables, Getting Started, Support

Design Requirements:
- Phase badge: bg-[phase-color]-100 text-[phase-color]-700
- Card hover: hover:border-[phase-color]-500 hover:shadow-2xl hover:-translate-y-1
- Follow existing marketplace card patterns

Responsive Requirements:
- Mobile-first with Tailwind breakpoints
- Filter panel: drawer on mobile, sidebar on desktop
- Card grid: 1 col (mobile) → 2 col (md) → 3 col (lg)
- Touch targets: 44×44px minimum

File Organization:
src/data/[marketplace]/          → Data files
src/components/[marketplace]/    → Components
src/pages/[Marketplace]Page.tsx  → Main page
src/pages/[Marketplace]DetailPage.tsx → Detail page

Reuse:
- Header, Footer from src/components/layout/
- LoginModal from src/components/learningCenter/
- Card patterns from existing marketplaces
- Filter panel logic from existing implementations
```

### 11.2 Template: New Dashboard

```
Build a new dashboard for [SERVICE NAME] within the DTMP Digital Intelligence marketplace.

Context:
- Service ID: [service-id]
- Category: [systems/projects/maturity]
- Renders at /marketplaces/digital-intelligence/:tab/:cardId/dashboard
- Uses DashboardWidget from src/components/digitalIntelligence/stage2/

Dashboard Configuration:
Define the dashboardConfig with:

1. Metric Widgets (type: 'metric'):
   [List KPI metrics with id, label, initial value, unit, trend, severity]

2. Chart Widgets (type: 'chart'):
   [List charts with id, title, description, chartType]

3. Table Widget (type: 'table'):
   [Define columns and sample rows]

4. Insight Widgets (type: 'insight'):
   [List AI insights with type, severity, title, description, confidence]

5. Filters:
   [Define filters with id, label, type, options]

Sample Data (sampleDashboardData):
- Provide widgetData keyed by widget ID
- Provide timeSeries data points
- Provide metrics matching widget IDs
- Provide insights and tableData arrays

Widget Layout (grid positions):
- Row 1: Metric widgets (4 across)
- Row 2: Chart widgets (2×2 grid)
- Row 3: Table widget (full width)
- Row 4: Insights

Chart Color Scheme:
- Primary: #7C3AED
- Palette: ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE']
- Chart height: 240px in ResponsiveContainer

Files to Modify:
- src/data/digitalIntelligence/stage2/intelligenceServices.ts → Add service config
- src/data/digitalIntelligence/stage2/sampleDashboardData.ts → Add sample data
```

### 11.3 Template: Stage 2 Integration

```
Integrate [MARKETPLACE NAME] into the Stage 2 Service Hub.

Context:
- Stage 2 uses a three-column LVE layout (Left sidebar · Middle context · Right workspace)
- Base component: src/pages/Stage2AppPage.tsx

What to Add:

1. Left Sidebar Entry:
   - Icon: [LucideIcon name]
   - Label: "[Marketplace Name]"
   - Handler: handleServiceClick("[Marketplace Name]")

2. Middle Panel Navigation:
   When activeService === "[Marketplace Name]":
   - [Tab 1]: [description]
   - [Tab 2]: [description]
   - [Tab 3]: [description]

3. Right Panel Content:
   - Overview page component
   - List/browse view
   - Detail view
   - Request management view

4. State to Add:
   - activeMarketplaceTab state
   - Filter/search states specific to this marketplace

Data Imports:
- Import from src/data/[marketplace]/
- Import request state functions

Follow existing Stage 2 patterns from:
- Knowledge Center Stage 2 integration
- Support Services Stage 2 integration
- Digital Intelligence Stage 2 integration
```

### 11.4 Template: New Request System

```
Build a request management system for [MARKETPLACE NAME].

Context:
- Follows the established requestState pattern
- Syncs with Stage 3 via the intake pipeline

Type Definitions (src/data/[marketplace]/requestState.ts):

interface [Marketplace]TORequest {
  id: string;
  type: [define request types];
  title: string;
  description: string;
  status: [define statuses];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requesterName: string;
  requesterEmail: string;
  createdAt: string;
  stage3RequestId?: string;
  [marketplace-specific fields]
}

Storage:
- Key: dtmp.[marketplace].toRequests
- Limit: 200 items
- Use makeLocalStorageStore from src/data/shared/localStorageUtils.ts

Required Functions:
- get[Marketplace]TORequests(requesterName?)
- add[Marketplace]TORequest(request)
- update[Marketplace]TORequestStatus(id, status)
- link[Marketplace]TORequestToStage3(id, stage3Id)

Stage 3 Intake (src/data/stage3/intake.ts):
- Add create[Marketplace]Stage3Intake function
- Pattern: create marketplace request → create Stage3 request → link via relatedAssets

Marketplace Sync (src/data/stage3/marketplaceSync.ts):
- Add handler for '[marketplace]-request:' prefix
- Map Stage 3 statuses to marketplace statuses
```

### 11.5 Template: UI Enhancement / Bug Fix

```
[Describe the specific change needed]

Affected Files:
- [List specific file paths]

Current Behavior:
[What currently happens]

Expected Behavior:
[What should happen instead]

Technical Constraints:
- Use existing shadcn/ui components
- Maintain responsive design (test at mobile/tablet/desktop)
- Follow existing color scheme (purple for charts, navy for headers)
- Use Tailwind CSS classes only (no inline styles unless required by Recharts)
- Use cn() for conditional classes
- Use Lucide React for icons

Testing:
- Verify at breakpoints: 375px, 768px, 1024px, 1440px
- Check console for errors
- Verify no visual regressions on adjacent components
```

---

## 12. Common Pitfalls & Anti-Patterns

### DO (Green Flags)

- Use `@/` path alias for all imports
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- Use barrel exports (`index.ts`) for feature directories
- Use shadcn/ui components instead of raw HTML
- Wrap all Recharts charts in `ResponsiveContainer`
- Use `useMemo` for filtered/computed data
- Define TypeScript interfaces for all data structures
- Use kebab-case for IDs and URL slugs
- Use `makeLocalStorageStore` for new request systems
- Follow the page structure: Header → Content → Footer
- Use `#7C3AED` (purple) for chart elements
- Match the 4D phase color for marketplace branding
- Test responsive layouts at mobile, tablet, and desktop

### DON'T (Red Flags)

- Install new state management libraries (Redux, Zustand, MobX)
- Use `fetch()` or `axios` — all data is local/mock
- Use CSS modules or styled-components — Tailwind only
- Use inline styles (except for Recharts props)
- Create new UI primitives — use shadcn/ui
- Hardcode colors — use Tailwind tokens / CSS variables
- Skip TypeScript types — type everything
- Put business logic in components — extract to the data layer
- Use `any` type (except Recharts callback props)
- Create circular dependencies between data modules
- Modify `src/components/ui/` files — they are shadcn/ui managed
- Use `React.lazy` — code splitting is not implemented
- Add environment variables — the app has no external config
- Use `useEffect` for data fetching — read from data modules directly
- Create separate CSS files — everything is Tailwind

---

## 13. Pre-Prompt Checklist

Before writing a prompt to build a new feature, answer these questions:

### Architecture

- [ ] Which stage does this belong to? (1, 2, or 3)
- [ ] Which marketplace does it relate to?
- [ ] What routes are needed?
- [ ] What existing patterns should be followed?

### Data

- [ ] What types/interfaces are needed?
- [ ] Does it need localStorage persistence?
- [ ] Does it integrate with Stage 3 requests?
- [ ] What mock data is needed?

### Components

- [ ] Which existing components can be reused?
- [ ] Which shadcn/ui primitives will be needed?
- [ ] What chart types are required (if any)?
- [ ] What filter types are required?

### Design

- [ ] Which 4D phase color applies?
- [ ] What breakpoints need special handling?
- [ ] What loading/error states are needed?
- [ ] Are there accessibility requirements?

### Integration

- [ ] Does `App.tsx` need new routes?
- [ ] Does `Stage2AppPage` need sidebar entries?
- [ ] Does Stage 3 intake need a new function?
- [ ] Does marketplace sync need updating?

---

## 14. Cheat Sheet

> Print this section and keep it on your desk.

### Import Patterns

```tsx
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { makeLocalStorageStore } from '@/data/shared/localStorageUtils';
```

### Common Tailwind Combos

```tsx
// Page wrapper
<div className="min-h-screen flex flex-col">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Card with hover
<Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">

// Metric display
<p className="text-3xl font-bold text-gray-900">{value}</p>
<p className="text-sm text-gray-600">{label}</p>

// Phase badge
<span className="bg-phase-drive-bg text-phase-drive text-xs font-semibold px-2 py-1 rounded-full">Drive</span>

// Status badge
<span className="bg-green-50 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">Healthy</span>
```

### Chart Quick Setup

```tsx
// Colors
const COLORS = ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

// Always wrap charts
<ResponsiveContainer width="100%" height={240}>
  {/* chart component */}
</ResponsiveContainer>
```

### localStorage Quick Setup

```typescript
const store = makeLocalStorageStore<MyType>("dtmp.domain.entity", 200);
store.read();                    // → MyType[]
store.write([...items]);         // → void
```

### Test Login Credentials

| Email | Role | Access |
|-------|------|--------|
| `admin@to.dtmp.com` | `to-admin` | Stage 1 + 2 + 3 |
| `ops@to.dtmp.com` | `to-ops` | Stage 1 + 2 + 3 |
| `user@company.com` | `business-user` | Stage 1 + 2 only |

---

## 15. Appendix: Key File Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build config, path aliases, dev server (port 8080) |
| `tailwind.config.ts` | Theme, custom colors, animations |
| `tsconfig.app.json` | TypeScript config for app source |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `src/index.css` | CSS custom properties, design tokens |

### Core Application Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | React app entry point |
| `src/App.tsx` | Router, providers, all route definitions |
| `src/lib/utils.ts` | `cn()` utility function |
| `src/contexts/AuthContext.tsx` | Authentication provider and hook |
| `src/data/sessionAuth.ts` | localStorage session management |
| `src/data/sessionRole.ts` | Role management |
| `src/data/shared/localStorageUtils.ts` | Shared localStorage store factory |

### Dashboard-Critical Files

| File | Purpose |
|------|---------|
| `src/components/digitalIntelligence/stage2/DashboardWidget.tsx` | Universal widget renderer |
| `src/components/digitalIntelligence/stage2/InsightCard.tsx` | AI insight card |
| `src/components/digitalIntelligence/stage2/MetricCard.tsx` | KPI metric card |
| `src/data/digitalIntelligence/stage2/types.ts` | All dashboard type definitions |
| `src/data/digitalIntelligence/stage2/intelligenceServices.ts` | 30 service configurations |
| `src/data/digitalIntelligence/stage2/sampleDashboardData.ts` | Mock dashboard data |
| `src/data/digitalIntelligence/stage2/dashboardRequests.ts` | Dashboard update requests |
| `src/pages/stage2/intelligence/ServiceDashboardPage.tsx` | Main dashboard page |
| `src/pages/DigitalIntelligenceDashboardPage.tsx` | Dashboard wrapper |

### Portfolio Dashboard Files

| File | Purpose |
|------|---------|
| `src/components/portfolio/PortfolioHealthDashboard.tsx` | Application health dashboard |
| `src/components/portfolio/DynamicHealthDashboard.tsx` | Dynamic health dimensions |
| `src/data/portfolio/healthDashboard.ts` | Health metrics and mock apps |

### Stage 3 (Transformation Office) Files

| File | Purpose |
|------|---------|
| `src/pages/Stage3AppPage.tsx` | Stage 3 main page |
| `src/data/stage3/requests.ts` | Stage 3 request management |
| `src/data/stage3/intake.ts` | Intake pipeline (marketplace → Stage 3) |
| `src/data/stage3/marketplaceSync.ts` | Status sync (Stage 3 → marketplaces) |
| `src/data/stage3/types.ts` | Stage 3 type definitions |

### Existing Implementation Guides

| File | Purpose |
|------|---------|
| `guides/knowledge-center-implementation-guide.md` | Knowledge Center reference |
| `guides/learning-center-implementation-guide.md` | Learning Center reference |
| `guides/stage3-implementation-guide.md` | Stage 3 reference |
| `DIGITAL-INTELLIGENCE-STAGE2-README.md` | DI Stage 2 architecture |
| `STAGE2-INTEGRATION-QUICK-REF.md` | Stage 2 integration patterns |

---

## Version History

| Date | Author | Changes |
|------|--------|---------|
| 2026-03-13 | AI Team | Initial comprehensive guideline created |
| 2026-03-13 | AI Team | Added Quick Start, decision tree, cheat sheet; improved readability |

---

*Update this document whenever significant architectural changes are made. All team members should read the Quick Start section before their first contribution.*
