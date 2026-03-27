import { useMemo, useState } from "react";
import {
  AlertTriangle, BarChart2, ChevronRight, CheckCircle2, Clock,
  Layers, Package, Rocket, Sunset, TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductLifecycleStage =
  | "Concept"
  | "Roadmap"
  | "Development"
  | "Pilot"
  | "Active"
  | "Sunset Planning"
  | "Sunset";

type ProductCategory =
  | "Customer Digital"
  | "Operational Technology"
  | "Internal Platform"
  | "AI / Analytics"
  | "Field Services";

interface ProductRoadmapItem {
  quarter: string;
  milestone: string;
  status: "Delivered" | "In Progress" | "Planned" | "At Risk";
}

interface ProductRecord {
  id: string;
  productName: string;
  description: string;
  division: string;
  category: ProductCategory;
  stage: ProductLifecycleStage;
  productOwner: string;
  launchDate?: string;
  sunsetDate?: string;
  activeUsers?: number;
  adoptionRate?: number; // %
  healthScore: number; // 0-100
  annualOperatingCost: number; // AED
  roadmap: ProductRoadmapItem[];
  keyRisks: string[];
  nextMilestone: string;
  nextMilestoneDate: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  lastUpdated: string;
}

const DEMO_PRODUCTS: ProductRecord[] = [
  {
    id: "prod-001",
    productName: "DEWA Customer App (iOS / Android)",
    description: "End-to-end customer self-service platform — bills, consumption analytics, service requests, EV charging, and smart home integrations.",
    division: "Customer Services",
    category: "Customer Digital",
    stage: "Active",
    productOwner: "Fatima Al Hashimi",
    launchDate: "2022-03-15",
    activeUsers: 680_000,
    adoptionRate: 74,
    healthScore: 88,
    annualOperatingCost: 8_200_000,
    nextMilestone: "AI-powered bill forecasting module release",
    nextMilestoneDate: "2026-05-31",
    riskLevel: "Low",
    lastUpdated: "2026-03-10",
    keyRisks: ["Third-party payment gateway SLA risk", "iOS 18 compatibility regression pending validation"],
    roadmap: [
      { quarter: "Q4 2025", milestone: "Smart home integration (Matter protocol)", status: "Delivered" },
      { quarter: "Q1 2026", milestone: "EV charging station booking v2", status: "Delivered" },
      { quarter: "Q2 2026", milestone: "AI bill forecasting module", status: "In Progress" },
      { quarter: "Q3 2026", milestone: "WhatsApp chatbot deep integration", status: "Planned" },
      { quarter: "Q4 2026", milestone: "Personalised energy efficiency dashboard", status: "Planned" },
    ],
  },
  {
    id: "prod-002",
    productName: "Energy Management System (EMS) Dashboard",
    description: "Real-time operational dashboard for generation, transmission and distribution load balancing. Used by 420 operations staff daily.",
    division: "Transmission",
    category: "Operational Technology",
    stage: "Active",
    productOwner: "Eng. Khalid Al Rashidi",
    launchDate: "2020-09-01",
    activeUsers: 420,
    adoptionRate: 96,
    healthScore: 76,
    annualOperatingCost: 5_600_000,
    nextMilestone: "Predictive load balancing AI module go-live",
    nextMilestoneDate: "2026-07-15",
    riskLevel: "Medium",
    lastUpdated: "2026-03-12",
    keyRisks: ["Upstream SCADA integration stability (3 incidents in Q1)", "Licence renewal due Q3 2026 — cost increase expected"],
    roadmap: [
      { quarter: "Q3 2025", milestone: "Dark mode + accessibility upgrade", status: "Delivered" },
      { quarter: "Q1 2026", milestone: "N-1 contingency alert module", status: "Delivered" },
      { quarter: "Q2 2026", milestone: "Digital twin integration pilot", status: "At Risk" },
      { quarter: "Q3 2026", milestone: "Predictive load balancing AI module", status: "In Progress" },
      { quarter: "Q4 2026", milestone: "Cross-border grid exchange dashboard", status: "Planned" },
    ],
  },
  {
    id: "prod-003",
    productName: "DEWA AI Assistant (Internal — Copilot)",
    description: "Enterprise AI copilot for internal staff — document summarisation, policy Q&A, report generation, and workflow automation across DEWA operations.",
    division: "Innovation & AI",
    category: "AI / Analytics",
    stage: "Pilot",
    productOwner: "Eng. Mohammed Al Marzouqi",
    activeUsers: 250,
    adoptionRate: 42,
    healthScore: 68,
    annualOperatingCost: 3_400_000,
    nextMilestone: "Pilot evaluation report and board approval for full rollout",
    nextMilestoneDate: "2026-04-30",
    riskLevel: "Medium",
    lastUpdated: "2026-03-14",
    keyRisks: ["Data privacy review incomplete for HR data access", "LLM hallucination rate above 2% threshold in legal docs"],
    roadmap: [
      { quarter: "Q4 2025", milestone: "Phase 1 pilot — 50 users (Innovation team)", status: "Delivered" },
      { quarter: "Q1 2026", milestone: "Phase 2 pilot — 250 users (multi-division)", status: "Delivered" },
      { quarter: "Q2 2026", milestone: "Pilot evaluation + board approval", status: "In Progress" },
      { quarter: "Q3 2026", milestone: "Full enterprise rollout (2,000 users)", status: "Planned" },
      { quarter: "Q4 2026", milestone: "Integration with SAP, EMS, and document studio", status: "Planned" },
    ],
  },
  {
    id: "prod-004",
    productName: "Field Workforce Management Platform (FWM)",
    description: "Mobile-first platform for field technicians — job dispatch, asset inspection, fault reporting, and remote diagnostics.",
    division: "Distribution",
    category: "Field Services",
    stage: "Development",
    productOwner: "Eng. Sara Al Zaabi",
    activeUsers: 0,
    adoptionRate: 0,
    healthScore: 62,
    annualOperatingCost: 2_100_000,
    nextMilestone: "UAT sign-off with Distribution field team",
    nextMilestoneDate: "2026-05-15",
    riskLevel: "High",
    lastUpdated: "2026-03-08",
    keyRisks: ["SAP PM integration delayed 6 weeks", "Device procurement for 800 field tablets at risk of delay", "Arabic RTL UI gaps identified in UAT"],
    roadmap: [
      { quarter: "Q3 2025", milestone: "Architecture design approved", status: "Delivered" },
      { quarter: "Q4 2025", milestone: "Core job dispatch module completed", status: "Delivered" },
      { quarter: "Q1 2026", milestone: "Asset inspection module + offline mode", status: "At Risk" },
      { quarter: "Q2 2026", milestone: "UAT with Distribution field team", status: "In Progress" },
      { quarter: "Q3 2026", milestone: "Phase 1 live — 300 technicians", status: "Planned" },
    ],
  },
  {
    id: "prod-005",
    productName: "Legacy Billing Portal v1.x",
    description: "Original web-based customer billing portal. Being sunset as Customer 360 DXP takes over. Maintained in read-only mode for legacy contract queries.",
    division: "Customer Services",
    category: "Customer Digital",
    stage: "Sunset Planning",
    productOwner: "Fatima Al Hashimi",
    launchDate: "2015-01-01",
    sunsetDate: "2026-09-30",
    activeUsers: 12_000,
    adoptionRate: 8,
    healthScore: 35,
    annualOperatingCost: 1_500_000,
    nextMilestone: "User communication campaign for migration to DEWA App",
    nextMilestoneDate: "2026-04-15",
    riskLevel: "Medium",
    lastUpdated: "2026-03-01",
    keyRisks: ["12,000 users on legacy portal must be migrated before sunset", "Corporate account migration requires manual data validation"],
    roadmap: [
      { quarter: "Q1 2026", milestone: "Read-only mode enabled — no new registrations", status: "Delivered" },
      { quarter: "Q2 2026", milestone: "User migration campaign (push notifications + email)", status: "In Progress" },
      { quarter: "Q3 2026", milestone: "Final sunset — portal decommissioned", status: "Planned" },
    ],
  },
  {
    id: "prod-006",
    productName: "Smart Meter Analytics Platform",
    description: "Advanced metering infrastructure analytics — consumption pattern analysis, theft detection, demand forecasting, and regulatory reporting.",
    division: "Distribution",
    category: "AI / Analytics",
    stage: "Roadmap",
    productOwner: "Eng. Khalid Al Rashidi",
    activeUsers: 0,
    adoptionRate: 0,
    healthScore: 55,
    annualOperatingCost: 4_800_000,
    nextMilestone: "Business case approval and architecture review",
    nextMilestoneDate: "2026-06-30",
    riskLevel: "Low",
    lastUpdated: "2026-02-25",
    keyRisks: ["Smart meter rollout dependency — 40% penetration target not yet met", "Real-time data pipeline architecture not finalised"],
    roadmap: [
      { quarter: "Q2 2026", milestone: "Business case approval + architecture sign-off", status: "Planned" },
      { quarter: "Q3 2026", milestone: "Data pipeline & ingestion layer build", status: "Planned" },
      { quarter: "Q4 2026", milestone: "Analytics engine MVP — 500K meters", status: "Planned" },
      { quarter: "Q1 2027", milestone: "Theft detection module live", status: "Planned" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STAGE_CLASSES: Record<ProductLifecycleStage, string> = {
  Concept: "bg-slate-100 text-slate-700 border-slate-200",
  Roadmap: "bg-blue-100 text-blue-700 border-blue-200",
  Development: "bg-purple-100 text-purple-700 border-purple-200",
  Pilot: "bg-amber-100 text-amber-800 border-amber-200",
  Active: "bg-green-100 text-green-700 border-green-200",
  "Sunset Planning": "bg-orange-100 text-orange-800 border-orange-200",
  Sunset: "bg-gray-100 text-gray-600 border-gray-200",
};

const STAGE_ICON: Record<ProductLifecycleStage, React.ReactNode> = {
  Concept: <Package className="w-4 h-4 text-slate-500" />,
  Roadmap: <BarChart2 className="w-4 h-4 text-blue-600" />,
  Development: <Layers className="w-4 h-4 text-purple-600" />,
  Pilot: <Clock className="w-4 h-4 text-amber-600" />,
  Active: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  "Sunset Planning": <AlertTriangle className="w-4 h-4 text-orange-600" />,
  Sunset: <CheckCircle2 className="w-4 h-4 text-gray-400" />,
};

const ROADMAP_STATUS_CLASSES: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Planned: "bg-gray-100 text-gray-600 border-gray-200",
  "At Risk": "bg-amber-100 text-amber-800 border-amber-200",
};

const RISK_CLASSES: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-600",
};

const HEALTH_COLOR = (s: number) =>
  s >= 75 ? "text-green-600" : s >= 55 ? "text-amber-600" : "text-red-600";

const HEALTH_BAR = (s: number) =>
  s >= 75 ? "bg-green-500" : s >= 55 ? "bg-amber-400" : "bg-red-500";

const fmtUsers = (n?: number) =>
  n == null || n === 0 ? "—" : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

// ── Component ─────────────────────────────────────────────────────────────────

export default function LCProductsPage() {
  const [stageFilter, setStageFilter] = useState<"all" | ProductLifecycleStage>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProductCategory>("all");
  const [selected, setSelected] = useState<ProductRecord | null>(null);

  const filtered = useMemo(() =>
    DEMO_PRODUCTS.filter((p) => {
      if (stageFilter !== "all" && p.stage !== stageFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      return true;
    }),
    [stageFilter, categoryFilter]
  );

  const summary = useMemo(() => {
    const active = DEMO_PRODUCTS.filter((p) => p.stage === "Active").length;
    const development = DEMO_PRODUCTS.filter((p) => p.stage === "Development" || p.stage === "Pilot").length;
    const sunsetting = DEMO_PRODUCTS.filter((p) => p.stage === "Sunset Planning" || p.stage === "Sunset").length;
    const totalUsers = DEMO_PRODUCTS.reduce((a, b) => a + (b.activeUsers ?? 0), 0);
    return { active, development, sunsetting, totalUsers };
  }, []);

  // Detail panel
  if (selected) {
    return (
      <div className="p-6 space-y-5">
        <button onClick={() => setSelected(null)} className="text-sm text-orange-700 font-semibold hover:underline">
          ← Back to Product Register
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selected.productName}</h2>
            <p className="text-sm text-gray-500 mt-1">{selected.division} · {selected.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs border ${STAGE_CLASSES[selected.stage]}`}>{selected.stage}</Badge>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${RISK_CLASSES[selected.riskLevel]}`}>{selected.riskLevel} risk</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Health Score</p>
              <p className={`text-xl font-bold ${HEALTH_COLOR(selected.healthScore)}`}>{selected.healthScore}/100</p>
              <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${HEALTH_BAR(selected.healthScore)}`} style={{ width: `${selected.healthScore}%` }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Active Users</p>
              <p className="text-xl font-bold text-gray-900">{fmtUsers(selected.activeUsers)}</p>
              {selected.adoptionRate ? <p className="text-xs text-gray-400">{selected.adoptionRate}% adoption</p> : null}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Annual OpEx</p>
              <p className="text-xl font-bold text-gray-900">AED {(selected.annualOperatingCost / 1_000_000).toFixed(1)}M</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Product Owner</p>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{selected.productOwner}</p>
            </CardContent>
          </Card>
        </div>

        {/* Next milestone */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Next Milestone</p>
            <p className="text-sm font-semibold text-gray-900">{selected.nextMilestone}</p>
            <p className="text-xs text-gray-500 mt-0.5">Due: {new Date(selected.nextMilestoneDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Product Roadmap</p>
            <div className="space-y-2">
              {selected.roadmap.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{item.quarter}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-2">{item.milestone}</p>
                  </div>
                  <Badge className={`text-xs border flex-shrink-0 ${ROADMAP_STATUS_CLASSES[item.status]}`}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key risks */}
        {selected.keyRisks.length > 0 && (
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Key Risks
              </p>
              <ul className="space-y-2">
                {selected.keyRisks.map((r, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Lifecycle</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Track DEWA digital products across their full lifecycle — from roadmap through active operation to sunset planning.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Products", count: summary.active, cls: "bg-green-50 border-green-200 text-green-700", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "In Development / Pilot", count: summary.development, cls: "bg-purple-50 border-purple-200 text-purple-700", icon: <Layers className="w-5 h-5" /> },
          { label: "Sunset Planning", count: summary.sunsetting, cls: "bg-orange-50 border-orange-200 text-orange-700", icon: <AlertTriangle className="w-5 h-5" /> },
          { label: "Total Users", count: fmtUsers(summary.totalUsers), cls: "bg-teal-50 border-teal-200 text-teal-700", icon: <TrendingUp className="w-5 h-5" /> },
        ].map((t) => (
          <div key={t.label} className={`rounded-xl border p-3 ${t.cls}`}>
            <div className="flex items-center justify-between mb-1">{t.icon}</div>
            <p className="text-xl font-bold">{t.count}</p>
            <p className="text-xs font-medium mt-0.5">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as any)}>
          <SelectTrigger className="h-9 w-48 text-sm"><SelectValue placeholder="All stages" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {(["Concept", "Roadmap", "Development", "Pilot", "Active", "Sunset Planning", "Sunset"] as ProductLifecycleStage[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
          <SelectTrigger className="h-9 w-48 text-sm"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(["Customer Digital", "Operational Technology", "Internal Platform", "AI / Analytics", "Field Services"] as ProductCategory[]).map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} products</span>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((product) => (
          <Card
            key={product.id}
            className="border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => setSelected(product)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {STAGE_ICON[product.stage]}
                    <h3 className="text-sm font-semibold text-gray-900">{product.productName}</h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">{product.category}</Badge>
                    <span className="text-xs text-gray-500">{product.division}</span>
                    {product.activeUsers != null && product.activeUsers > 0 && (
                      <span className="text-xs text-gray-500">{fmtUsers(product.activeUsers)} users</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge className={`text-xs border ${STAGE_CLASSES[product.stage]}`}>{product.stage}</Badge>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${HEALTH_BAR(product.healthScore)}`} style={{ width: `${product.healthScore}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${HEALTH_COLOR(product.healthScore)}`}>{product.healthScore}</span>
                  </div>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${RISK_CLASSES[product.riskLevel]}`}>{product.riskLevel}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Next: </span>{product.nextMilestone}
                  <span className="text-gray-400"> · {new Date(product.nextMilestoneDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No products match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
