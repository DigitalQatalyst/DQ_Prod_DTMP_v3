import { useMemo, useState } from "react";
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
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Flag,
  Layers,
  Link2,
  RefreshCw,
} from "lucide-react";
import {
  lifecycleInstances,
  lifecycleTemplates,
  type LifecycleInstance,
} from "@/data/lifecycle/lifecycleData";

// ── Helpers ───────────────────────────────────────────────────────────────────

const HEALTH_CLASSES: Record<string, string> = {
  "on-track": "bg-green-100 text-green-700 border-green-200",
  "at-risk": "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const TYPE_CLASSES: Record<string, string> = {
  "application-retirement": "bg-red-50 text-red-700 border-red-200",
  "application-modernization": "bg-blue-50 text-blue-700 border-blue-200",
};

const TYPE_LABELS: Record<string, string> = {
  "application-retirement": "Retirement",
  "application-modernization": "Modernisation",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "application-retirement": <AlertTriangle className="w-4 h-4 text-red-500" />,
  "application-modernization": <RefreshCw className="w-4 h-4 text-blue-500" />,
};

const SYNC_CLASSES: Record<string, string> = {
  synced: "bg-green-100 text-green-700",
  "out-of-sync": "bg-amber-100 text-amber-800",
  manual: "bg-slate-100 text-slate-600",
};

const BENEFIT_TYPE_LABELS: Record<string, string> = {
  "cost-savings": "Cost Savings",
  efficiency: "Efficiency",
  revenue: "Revenue",
  "risk-reduction": "Risk Reduction",
  quality: "Quality",
};

const STATUS_BADGE: Record<string, string> = {
  "not-started": "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  "on-hold": "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
  planned: "bg-slate-100 text-slate-600",
  "in-progress-b": "bg-blue-100 text-blue-700",
  realized: "bg-green-100 text-green-700",
  "not-realized": "bg-red-100 text-red-700",
};

const fmtBudget = (n?: number) =>
  n == null ? "—" : n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(1)}M` : `AED ${(n / 1_000).toFixed(0)}K`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const apps = useMemo(
    () =>
      lifecycleInstances.filter(
        (i) => i.type === "application-retirement" || i.type === "application-modernization"
      ),
    []
  );

  const [typeFilter, setTypeFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [selected, setSelected] = useState<LifecycleInstance | null>(null);

  const filtered = useMemo(
    () =>
      apps.filter((a) => {
        if (typeFilter !== "all" && a.type !== typeFilter) return false;
        if (healthFilter !== "all" && a.overallHealth !== healthFilter) return false;
        return true;
      }),
    [apps, typeFilter, healthFilter]
  );

  const summary = useMemo(() => {
    const retirement = apps.filter((a) => a.type === "application-retirement").length;
    const modernisation = apps.filter((a) => a.type === "application-modernization").length;
    const totalBenefits = apps.reduce(
      (sum, a) =>
        sum + a.expectedBenefits.reduce((s, b) => s + (b.quantifiedValue ?? 0), 0),
      0
    );
    return { retirement, modernisation, totalBenefits };
  }, [apps]);

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    const template = lifecycleTemplates.find((t) => t.id === selected.basedOnTemplate);
    const currentStageObj = template?.stages.find((s) => s.id === selected.currentStage);
    const daysLeft = Math.ceil(
      (new Date(selected.forecastEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="p-6 space-y-5">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-orange-700 font-semibold hover:underline flex items-center gap-1"
        >
          ← Back to Applications
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {TYPE_ICONS[selected.type]}
              <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`text-xs border ${TYPE_CLASSES[selected.type] ?? ""}`}>
                {TYPE_LABELS[selected.type] ?? selected.type}
              </Badge>
              {selected.portfolioLink && (
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                  <Link2 className="w-3 h-3 mr-1" />
                  Portfolio: {selected.portfolioLink.id}
                  <span className={`ml-1.5 px-1 rounded text-xs ${SYNC_CLASSES[selected.portfolioLink.syncStatus]}`}>
                    {selected.portfolioLink.syncStatus}
                  </span>
                </Badge>
              )}
            </div>
          </div>
          <Badge className={`text-xs border ${HEALTH_CLASSES[selected.overallHealth]}`}>
            {selected.overallHealth.replace("-", " ")}
          </Badge>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Progress</p>
              <p className="text-xl font-bold text-gray-900">{selected.overallProgress}%</p>
              <Progress value={selected.overallProgress} className="mt-1 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Gates</p>
              <p className="text-xl font-bold text-gray-900">{selected.gatesCompleted}/{selected.totalGates}</p>
              <Progress value={(selected.gatesCompleted / selected.totalGates) * 100} className="mt-1 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Days Left</p>
              <p className={`text-xl font-bold ${daysLeft < 0 ? "text-red-600" : daysLeft < 30 ? "text-amber-600" : "text-gray-900"}`}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d over` : `${daysLeft}d`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Owner</p>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{selected.owner.name}</p>
              <p className="text-xs text-gray-400">{selected.owner.role}</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Timeline
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Planned Start</p>
                <p className="font-medium">{new Date(selected.plannedStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Actual Start</p>
                <p className="font-medium">{selected.actualStartDate ? new Date(selected.actualStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Planned End</p>
                <p className="font-medium">{new Date(selected.plannedEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Forecast End</p>
                <p className={`font-medium ${selected.forecastEndDate > selected.plannedEndDate ? "text-amber-600" : "text-green-600"}`}>
                  {new Date(selected.forecastEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        {selected.budget && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600" /> Budget
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Budget utilisation</span>
                  <span>{Math.min(100, Math.round((selected.budget.spent / selected.budget.total) * 100))}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selected.budget.spent / selected.budget.total > 0.9
                        ? "bg-red-500"
                        : selected.budget.spent / selected.budget.total > 0.75
                        ? "bg-amber-400"
                        : "bg-teal-500"
                    }`}
                    style={{ width: `${Math.min(100, (selected.budget.spent / selected.budget.total) * 100)}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Spent: {fmtBudget(selected.budget.spent)}</span>
                  <span>Total: {fmtBudget(selected.budget.total)}</span>
                  <span>Forecast: {fmtBudget(selected.budget.forecast)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current stage */}
        {currentStageObj && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Current Stage
              </p>
              <p className="text-sm font-bold text-gray-900">{currentStageObj.name}</p>
              <p className="text-sm text-gray-600">{currentStageObj.description}</p>
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">Pending Deliverables</p>
                <div className="flex flex-wrap gap-1">
                  {currentStageObj.deliverables.map((d) => (
                    <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-white border border-blue-200 text-blue-800">{d}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expected Benefits */}
        {selected.expectedBenefits.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Expected Benefits
              </p>
              <div className="space-y-2">
                {selected.expectedBenefits.map((b, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-gray-50 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800">{b.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {BENEFIT_TYPE_LABELS[b.type]} · {new Date(b.realizationDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {b.quantifiedValue != null && (
                        <span className="text-xs font-semibold text-green-700">{fmtBudget(b.quantifiedValue)}</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_BADGE[b.status] ?? "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sponsor */}
        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Executive Sponsor</p>
            <p className="text-sm font-semibold text-gray-900">{selected.sponsor.name}</p>
            <p className="text-xs text-gray-500">{selected.sponsor.role}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Lifecycle Governance</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {apps.length} applications under retirement or modernisation governance. Click any to view details.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3">
          <p className="text-xl font-bold">{summary.retirement}</p>
          <p className="text-xs font-medium mt-0.5">Retirement</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 text-blue-700 p-3">
          <p className="text-xl font-bold">{summary.modernisation}</p>
          <p className="text-xs font-medium mt-0.5">Modernisation</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 text-green-700 p-3">
          <p className="text-xl font-bold">{fmtBudget(summary.totalBenefits)}</p>
          <p className="text-xs font-medium mt-0.5">Expected Benefits</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-48 text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="application-retirement">Retirement</SelectItem>
            <SelectItem value="application-modernization">Modernisation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="h-9 w-40 text-sm"><SelectValue placeholder="All health" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All health</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} applications</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((app) => {
          const totalBenefits = app.expectedBenefits.reduce(
            (s, b) => s + (b.quantifiedValue ?? 0),
            0
          );
          return (
            <Card
              key={app.id}
              className="border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelected(app)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {TYPE_ICONS[app.type]}
                      <h3 className="text-sm font-semibold text-gray-900">{app.name}</h3>
                      <Badge className={`text-xs border ${TYPE_CLASSES[app.type] ?? ""}`}>
                        {TYPE_LABELS[app.type]}
                      </Badge>
                      {app.portfolioLink && (
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                          <Link2 className="w-3 h-3 mr-1" /> Portfolio
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Owner: {app.owner.name} · {app.gatesCompleted}/{app.totalGates} gates
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${app.type === "application-retirement" ? "bg-red-400" : "bg-blue-500"}`}
                          style={{ width: `${app.overallProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{app.overallProgress}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge className={`text-xs border ${HEALTH_CLASSES[app.overallHealth]}`}>
                      {app.overallHealth.replace("-", " ")}
                    </Badge>
                    {totalBenefits > 0 && (
                      <span className="text-xs text-green-700 font-medium">{fmtBudget(totalBenefits)} benefit</span>
                    )}
                    <span className="text-xs text-gray-400">
                      Due {new Date(app.forecastEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Layers className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No applications match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
