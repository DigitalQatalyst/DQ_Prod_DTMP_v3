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
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Flag,
  Link2,
  TrendingUp,
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

const STATUS_CLASSES: Record<string, string> = {
  "not-started": "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  "on-hold": "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const BENEFIT_TYPE_LABELS: Record<string, string> = {
  "cost-savings": "Cost Savings",
  efficiency: "Efficiency",
  revenue: "Revenue",
  "risk-reduction": "Risk Reduction",
  quality: "Quality",
};

const fmtBudget = (n?: number) =>
  n == null ? "—" : n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(1)}M` : `AED ${(n / 1_000).toFixed(0)}K`;

function BudgetBar({ total, spent }: { total: number; spent: number }) {
  const pct = Math.min(100, Math.round((spent / total) * 100));
  const color = pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-400" : "bg-teal-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Budget utilisation</span>
        <span className={pct > 90 ? "text-red-600 font-semibold" : ""}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Spent: {fmtBudget(spent)}</span>
        <span>Total: {fmtBudget(total)}</span>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const projects = useMemo(
    () => lifecycleInstances.filter((i) => i.type === "project"),
    []
  );
  const [healthFilter, setHealthFilter] = useState("all");
  const [selected, setSelected] = useState<LifecycleInstance | null>(null);

  const filtered = useMemo(
    () => projects.filter((p) => healthFilter === "all" || p.overallHealth === healthFilter),
    [projects, healthFilter]
  );

  const summary = useMemo(() => ({
    total: projects.length,
    onTrack: projects.filter((p) => p.overallHealth === "on-track").length,
    atRisk: projects.filter((p) => p.overallHealth === "at-risk").length,
    critical: projects.filter((p) => p.overallHealth === "critical").length,
  }), [projects]);

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    const template = lifecycleTemplates.find((t) => t.id === selected.basedOnTemplate);
    const currentStageObj = template?.stages.find((s) => s.id === selected.currentStage);
    const daysRemaining = Math.ceil(
      (new Date(selected.forecastEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="p-6 space-y-5">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-orange-700 font-semibold hover:underline flex items-center gap-1"
        >
          ← Back to Projects
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-500">{selected.type.replace(/-/g, " ")}</span>
              {selected.portfolioLink && (
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                  <Link2 className="w-3 h-3 mr-1" /> Portfolio {selected.portfolioLink.id}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs border ${HEALTH_CLASSES[selected.overallHealth]}`}>
              {selected.overallHealth.replace("-", " ")}
            </Badge>
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_CLASSES[selected.status]}`}>
              {selected.status.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Progress</p>
              <p className="text-xl font-bold text-gray-900">{selected.overallProgress}%</p>
              <Progress value={selected.overallProgress} className="mt-1 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 flex items-center gap-1"><Flag className="w-3 h-3" /> Gates</p>
              <p className="text-xl font-bold text-gray-900">{selected.gatesCompleted}/{selected.totalGates}</p>
              <Progress value={(selected.gatesCompleted / selected.totalGates) * 100} className="mt-1 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Days Left</p>
              <p className={`text-xl font-bold ${daysRemaining < 0 ? "text-red-600" : daysRemaining < 30 ? "text-amber-600" : "text-gray-900"}`}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d over` : `${daysRemaining}d`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Owner</p>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{selected.owner.name}</p>
              <p className="text-xs text-gray-400">{selected.owner.role}</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Timeline</p>
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
              <BudgetBar total={selected.budget.total} spent={selected.budget.spent} />
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Forecast: {fmtBudget(selected.budget.forecast)}</span>
                {selected.budget.forecast > selected.budget.total && (
                  <span className="text-red-600 font-medium">
                    Over by {fmtBudget(selected.budget.forecast - selected.budget.total)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current stage */}
        {currentStageObj && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Current Stage</p>
              <p className="text-sm font-bold text-gray-900">{currentStageObj.name}</p>
              <p className="text-sm text-gray-600">{currentStageObj.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentStageObj.deliverables.map((d) => (
                  <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-white border border-orange-200 text-orange-800">{d}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {selected.expectedBenefits.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Expected Benefits
              </p>
              <div className="space-y-2">
                {selected.expectedBenefits.map((b, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 text-sm p-2 rounded-lg bg-gray-50">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800">{b.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {BENEFIT_TYPE_LABELS[b.type]} · Realisation: {new Date(b.realizationDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {b.quantifiedValue && (
                        <span className="text-xs font-semibold text-green-700">{fmtBudget(b.quantifiedValue)}</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_CLASSES[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Lifecycle Management</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {projects.length} projects under governance. Click any project to view timeline, budget and stage details.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", count: summary.total, cls: "bg-slate-50 border-slate-200 text-slate-700" },
          { label: "On Track", count: summary.onTrack, cls: "bg-green-50 border-green-200 text-green-700" },
          { label: "At Risk", count: summary.atRisk, cls: "bg-amber-50 border-amber-200 text-amber-800" },
          { label: "Critical", count: summary.critical, cls: "bg-red-50 border-red-200 text-red-700" },
        ].map((t) => (
          <div key={t.label} className={`rounded-xl border p-3 ${t.cls}`}>
            <p className="text-2xl font-bold">{t.count}</p>
            <p className="text-xs font-medium mt-0.5">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="h-9 w-44 text-sm"><SelectValue placeholder="All health" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All health</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} projects</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((project) => {
          const daysLeft = Math.ceil(
            (new Date(project.forecastEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return (
            <Card
              key={project.id}
              className="border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelected(project)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                      {project.portfolioLink && (
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                          <Link2 className="w-3 h-3 mr-1" /> Portfolio
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Owner: {project.owner.name} · {project.gatesCompleted}/{project.totalGates} gates
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${project.overallProgress}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{project.overallProgress}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge className={`text-xs border ${HEALTH_CLASSES[project.overallHealth]}`}>
                      {project.overallHealth.replace("-", " ")}
                    </Badge>
                    <span className={`text-xs ${daysLeft < 0 ? "text-red-600 font-medium" : daysLeft < 30 ? "text-amber-600 font-medium" : "text-gray-500"}`}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
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
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No projects match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
