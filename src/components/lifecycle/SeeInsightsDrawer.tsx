import { useState } from "react";
import {
  X, ChevronRight, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  DollarSign, Users, FileText, Activity, Flag, Shield, Zap,
  ChevronDown, ChevronUp, BarChart2, Edit3, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Initiative, Project, Milestone } from "@/data/shared/lifecyclePortfolioStore";
import {
  getProjects,
  updateMilestoneStatus,
  updateProjectRAG,
  type MilestoneStatus,
  type RAGStatus,
} from "@/data/shared/lifecyclePortfolioStore";
import {
  type LifecycleInsightsRole,
  LIFECYCLE_ROLE_LABELS,
  getDemoAccount,
} from "@/data/shared/lifecycleRole";

// ── Helpers ────────────────────────────────────────────────────────────────────

const RAG_COLORS: Record<RAGStatus, string> = {
  Green: "bg-green-100 text-green-700 border-green-200",
  Amber: "bg-amber-100 text-amber-800 border-amber-200",
  Red: "bg-red-100 text-red-700 border-red-200",
};

const RAG_DOT: Record<RAGStatus, string> = {
  Green: "bg-green-500",
  Amber: "bg-amber-400",
  Red: "bg-red-500",
};

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-teal-100 text-teal-700",
  Scoping: "bg-blue-100 text-blue-700",
  "At Risk": "bg-amber-100 text-amber-800",
  "On Hold": "bg-slate-200 text-slate-600",
  Completed: "bg-green-100 text-green-700",
};

const MILESTONE_COLORS: Record<MilestoneStatus, string> = {
  Complete: "text-green-600 bg-green-50",
  "In Progress": "text-blue-600 bg-blue-50",
  "Not Started": "text-slate-500 bg-slate-50",
  Delayed: "text-red-600 bg-red-50",
};

const formatBudget = (n: number | null): string => {
  if (n === null) return "TBC";
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n}`;
};

const daysUntil = (dateStr: string): number => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ── Section nav ────────────────────────────────────────────────────────────────

type CockpitSection =
  | "health"
  | "projects"
  | "budget"
  | "milestones"
  | "risks"
  | "blockers"
  | "team"
  | "activity";

const COCKPIT_SECTIONS: { id: CockpitSection; label: string; icon: React.ReactNode }[] = [
  { id: "health", label: "Health", icon: <Activity className="w-3.5 h-3.5" /> },
  { id: "projects", label: "Projects", icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { id: "budget", label: "Budget", icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: "milestones", label: "Milestones", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: "risks", label: "Risks", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "blockers", label: "Blockers", icon: <Flag className="w-3.5 h-3.5" /> },
  { id: "team", label: "Team", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "activity", label: "Activity", icon: <Zap className="w-3.5 h-3.5" /> },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function HealthPanel({ initiative, projects }: { initiative: Initiative; projects: Project[] }) {
  const redCount = projects.filter((p) => p.rag === "Red").length;
  const amberCount = projects.filter((p) => p.rag === "Amber").length;
  const days = daysUntil(initiative.targetDate);
  const spentPct = initiative.budget ? Math.round((initiative.budgetSpent / initiative.budget) * 100) : 0;

  const overallRAG: RAGStatus =
    initiative.status === "At Risk" ? "Red" : redCount > 0 ? "Red" : amberCount > 0 ? "Amber" : "Green";

  return (
    <div className="space-y-5">
      {/* RAG + status */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${RAG_COLORS[overallRAG]}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${RAG_DOT[overallRAG]}`} />
          <span className="font-semibold text-sm">{overallRAG} — Overall Health</span>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${STATUS_COLORS[initiative.status]}`}>
          {initiative.status}
        </span>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Progress</p>
          <p className="text-xl font-bold text-slate-900">{initiative.progress}%</p>
          <Progress value={initiative.progress} className="mt-1.5 h-1.5" />
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">EA Alignment</p>
          <p className="text-xl font-bold text-slate-900">
            {initiative.eaAlignmentScore !== null ? `${initiative.eaAlignmentScore}%` : "TBD"}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Days to Target</p>
          <p className={`text-xl font-bold ${days < 0 ? "text-red-600" : days < 90 ? "text-amber-600" : "text-slate-900"}`}>
            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Budget Spent</p>
          <p className="text-xl font-bold text-slate-900">{spentPct}%</p>
          <p className="text-xs text-slate-400 mt-0.5">{formatBudget(initiative.budgetSpent)} of {formatBudget(initiative.budget)}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-slate-700 leading-relaxed">{initiative.description}</p>
      </div>

      {/* Project RAG summary */}
      {projects.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">{projects.length} projects:</span>
          {["Green", "Amber", "Red"].map((rag) => {
            const count = projects.filter((p) => p.rag === rag).length;
            if (count === 0) return null;
            return (
              <span key={rag} className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${RAG_COLORS[rag as RAGStatus]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${RAG_DOT[rag as RAGStatus]}`} />
                {count} {rag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectsPanel({
  projects,
  isOwner,
  onRefresh,
}: {
  projects: Project[];
  isOwner: boolean;
  onRefresh: () => void;
}) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [updatingRag, setUpdatingRag] = useState<string | null>(null);

  const handleRAGUpdate = (projectId: string, rag: RAGStatus) => {
    updateProjectRAG(projectId, rag);
    setUpdatingRag(null);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div key={project.id} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            className="w-full text-left flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
            onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
          >
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${RAG_DOT[project.rag]}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{project.name}</p>
              <p className="text-xs text-slate-500">PM: {project.pmName} · {project.progress}% complete</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${RAG_COLORS[project.rag]}`}>
                {project.rag}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                project.budgetHealth === "On Track" ? "bg-green-50 text-green-700" :
                project.budgetHealth === "At Risk" ? "bg-amber-50 text-amber-700" :
                "bg-red-50 text-red-700"
              }`}>
                {project.budgetHealth}
              </span>
              {expandedProject === project.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {expandedProject === project.id && (
            <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-3">
              <Progress value={project.progress} className="h-1.5" />

              {/* Milestones preview */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Milestones</p>
                {project.milestones.slice(0, 3).map((ms) => (
                  <div key={ms.id} className="flex items-center gap-2 py-1">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${MILESTONE_COLORS[ms.status]}`}>
                      {ms.status}
                    </span>
                    <span className="text-xs text-slate-600 truncate flex-1">{ms.name}</span>
                    <span className="text-xs text-slate-400 flex-shrink-0">{ms.dueDate}</span>
                  </div>
                ))}
              </div>

              {/* Blockers preview */}
              {project.blockers.filter((b) => !b.resolved).length > 0 && (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs font-medium">
                    {project.blockers.filter((b) => !b.resolved).length} open blocker(s)
                  </span>
                </div>
              )}

              {/* RAG update for owners */}
              {isOwner && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Update RAG:</span>
                  {(["Green", "Amber", "Red"] as RAGStatus[]).map((rag) => (
                    <button
                      key={rag}
                      onClick={() => handleRAGUpdate(project.id, rag)}
                      className={`px-2 py-0.5 rounded text-xs font-medium border transition-opacity ${
                        project.rag === rag ? "opacity-100" : "opacity-50 hover:opacity-80"
                      } ${RAG_COLORS[rag]}`}
                    >
                      {rag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BudgetPanel({ initiative, projects }: { initiative: Initiative; projects: Project[] }) {
  const totalBudget = initiative.budget ?? 0;
  const totalSpent = initiative.budgetSpent;
  const committed = projects.reduce(
    (sum, p) => sum + Math.max(0, p.budget - p.budgetSpent),
    0
  );
  const forecastToComplete = totalBudget - totalSpent;
  const variance = totalBudget - totalSpent - committed;

  const pctSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const pctCommitted = totalBudget > 0 ? (committed / totalBudget) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Allocated", value: formatBudget(totalBudget), color: "text-slate-900" },
          { label: "Spent", value: formatBudget(totalSpent), color: "text-slate-900" },
          { label: "Forecast to Complete", value: formatBudget(forecastToComplete), color: "text-slate-900" },
          { label: "Variance", value: formatBudget(variance), color: variance < 0 ? "text-red-600" : "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-base font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Waterfall bar */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-3">Budget Waterfall</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Spent ({Math.round(pctSpent)}%)</span>
              <span>{formatBudget(totalSpent)}</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pctSpent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Committed ({Math.round(pctCommitted)}%)</span>
              <span>{formatBudget(committed)}</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.min(100, pctCommitted)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* By project */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">Breakdown by Project</p>
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 flex-1 truncate">{p.name}</span>
              <span className={`text-xs font-medium flex-shrink-0 ${
                p.budgetHealth === "On Track" ? "text-green-600" :
                p.budgetHealth === "At Risk" ? "text-amber-600" : "text-red-600"
              }`}>{p.budgetHealth}</span>
              <span className="text-xs text-slate-500 w-20 text-right flex-shrink-0">{formatBudget(p.budget)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestonesPanel({
  initiative,
  projects,
  isOwner,
  onRefresh,
}: {
  initiative: Initiative;
  projects: Project[];
  isOwner: boolean;
  onRefresh: () => void;
}) {
  // Aggregate milestones across all projects
  const allMilestones: (Milestone & { projectName: string; projectId: string })[] = projects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectName: p.name, projectId: p.id }))
  );

  const handleStatusChange = (projectId: string, milestoneId: string, status: MilestoneStatus) => {
    updateMilestoneStatus(projectId, milestoneId, status);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {allMilestones.map((ms) => (
        <div key={ms.id} className="border border-slate-200 rounded-xl p-3">
          <div className="flex items-start gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${MILESTONE_COLORS[ms.status]}`}>
              {ms.status}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">{ms.name}</p>
              <p className="text-xs text-slate-500">{ms.projectName} · Due {ms.dueDate}</p>
              {ms.owner && <p className="text-xs text-slate-400">Owner: {ms.owner}</p>}
            </div>
            {isOwner && ms.status !== "Complete" && (
              <button
                onClick={() => handleStatusChange(ms.projectId, ms.id, "Complete")}
                className="text-xs text-teal-600 hover:text-teal-800 font-medium flex-shrink-0 px-2 py-1 rounded hover:bg-teal-50 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function RisksPanel({ projects }: { projects: Project[] }) {
  const allRisks = projects.flatMap((p) =>
    p.risks.map((r) => ({ ...r, projectName: p.name }))
  );

  const SEV_ORDER = ["Critical", "High", "Medium", "Low"];
  const sorted = [...allRisks].sort(
    (a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity)
  );

  const SEV_COLORS: Record<string, string> = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  };

  if (sorted.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
        <p className="text-sm">No risks logged at programme level.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((risk) => (
        <div key={risk.id} className="border border-slate-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${SEV_COLORS[risk.severity]}`}>
              {risk.severity}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{risk.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{risk.projectName}</p>
              <p className="text-xs text-slate-600 mt-1">{risk.impact}</p>
              <p className="text-xs text-teal-700 mt-1">
                <span className="font-medium">Mitigation:</span> {risk.mitigation}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span>Owner: {risk.owner}</span>
                <span>·</span>
                <span>Due: {risk.mitigationDueDate}</span>
                <span>·</span>
                <span className={risk.status === "Open" ? "text-red-500" : "text-green-600"}>{risk.status}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockersPanel({ projects, isOwner }: { projects: Project[]; isOwner: boolean }) {
  const allBlockers = projects.flatMap((p) =>
    p.blockers.filter((b) => !b.resolved).map((b) => ({ ...b, projectName: p.name }))
  );

  if (allBlockers.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
        <p className="text-sm">No open blockers across this programme.</p>
      </div>
    );
  }

  const ESC_COLORS: Record<string, string> = {
    "Not Escalated": "bg-slate-100 text-slate-600",
    "Escalated to TO": "bg-amber-100 text-amber-700",
    "Escalated to Division Head": "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-3">
      {allBlockers.map((blocker) => (
        <div key={blocker.id} className="border border-amber-200 rounded-xl p-4 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{blocker.title}</p>
              <p className="text-xs text-slate-500">{blocker.projectName} · Raised {blocker.dateRaised} by {blocker.raisedBy}</p>
              <p className="text-xs text-slate-700 mt-1">Needed: {blocker.whatIsNeeded}</p>
              <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-medium ${ESC_COLORS[blocker.escalationStatus]}`}>
                {blocker.escalationStatus}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamPanel({ initiative, projects }: { initiative: Initiative; projects: Project[] }) {
  const pms = [...new Set(projects.map((p) => p.pmName))].filter(Boolean);
  return (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 mb-3">Initiative Owner</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
            {initiative.owner.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{initiative.owner}</p>
            <p className="text-xs text-slate-500">Programme Manager</p>
          </div>
        </div>
      </div>
      {pms.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 mb-3">Project Managers</p>
          <div className="space-y-2.5">
            {pms.map((pm) => (
              <div key={pm} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700">
                  {pm.charAt(0)}
                </div>
                <span className="text-sm text-slate-700">{pm}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 mb-1">EA Office Contact</p>
        <p className="text-sm text-slate-700">Corporate EA Office</p>
        <p className="text-xs text-slate-400">TO Assigned Member · DTMP Programme Team</p>
      </div>
    </div>
  );
}

function ActivityPanel({ initiative }: { initiative: Initiative }) {
  const events = [
    { time: initiative.updatedAt, actor: "System", action: "Initiative data last updated", note: "" },
    { time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), actor: initiative.owner, action: "Progress updated", note: `${initiative.progress}% complete` },
    { time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), actor: "TO Team", action: "EA alignment score updated", note: `${initiative.eaAlignmentScore ?? "TBD"}%` },
    { time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), actor: "System", action: "Initiative status", note: initiative.status },
  ];

  return (
    <div className="space-y-1">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3 py-2.5 border-b border-slate-100 last:border-0">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-1.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-700">
              <span className="font-medium">{event.actor}</span> · {event.action}
              {event.note && <span className="text-slate-500"> — {event.note}</span>}
            </p>
            <p className="text-xs text-slate-400">{new Date(event.time).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main drawer ────────────────────────────────────────────────────────────────

interface Props {
  initiative: Initiative;
  role: LifecycleInsightsRole;
  onClose: () => void;
  onChangeRole: () => void;
}

export function SeeInsightsDrawer({ initiative, role, onClose, onChangeRole }: Props) {
  const [activeSection, setActiveSection] = useState<CockpitSection>("health");
  const [projects, setProjects] = useState<Project[]>(() => getProjects(initiative.id));

  const refresh = () => setProjects(getProjects(initiative.id));
  const isOwner = role === "initiative-owner";
  const account = getDemoAccount(role);
  const days = daysUntil(initiative.targetDate);

  // ── General Staff — lightweight ──────────────────────────────────────────────
  if (role === "general-staff") {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">{LIFECYCLE_ROLE_LABELS[role]}</p>
              <h2 className="font-bold text-slate-900 text-base">{initiative.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${STATUS_COLORS[initiative.status]}`}>
                {initiative.status}
              </span>
              <span className="text-sm text-slate-500">{initiative.division}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-semibold text-slate-900">{initiative.progress}%</span>
              </div>
              <Progress value={initiative.progress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Target Completion</p>
                <p className="font-medium text-slate-900">{initiative.targetDate}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Days Remaining</p>
                <p className={`font-medium ${days < 0 ? "text-red-600" : "text-slate-900"}`}>
                  {days < 0 ? "Overdue" : `${days} days`}
                </p>
              </div>
            </div>
            <button
              onClick={onChangeRole}
              className="w-full text-center text-xs text-teal-600 hover:text-teal-800 py-2"
            >
              Switch role to see more detail →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Senior Stakeholder — executive summary ───────────────────────────────────
  if (role === "senior-stakeholder") {
    const redProjects = projects.filter((p) => p.rag === "Red");
    const topRisks = projects.flatMap((p) => p.risks).filter((r) => r.severity === "Critical" || r.severity === "High").slice(0, 3);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-400">{LIFECYCLE_ROLE_LABELS[role]} · {account.name}</span>
              </div>
              <h2 className="font-bold text-slate-900">{initiative.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onChangeRole} className="text-xs text-teal-600 hover:text-teal-800 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">
                Change role
              </button>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-6 space-y-5">
            {/* RAG + key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`col-span-2 flex items-center gap-3 rounded-xl p-4 border ${
                initiative.status === "At Risk" || projects.some(p => p.rag === "Red")
                  ? "bg-red-50 border-red-200"
                  : projects.some(p => p.rag === "Amber")
                  ? "bg-amber-50 border-amber-200"
                  : "bg-green-50 border-green-200"
              }`}>
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  initiative.status === "At Risk" || projects.some(p => p.rag === "Red") ? "bg-red-500" :
                  projects.some(p => p.rag === "Amber") ? "bg-amber-400" : "bg-green-500"
                }`} />
                <div>
                  <p className="font-bold text-slate-900">{initiative.status}</p>
                  <p className="text-xs text-slate-600">{initiative.progress}% complete · {days < 0 ? "Overdue" : `${days}d to target`}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500">EA Alignment</p>
                <p className="text-xl font-bold text-slate-900">{initiative.eaAlignmentScore ?? "TBD"}%</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500">Budget</p>
                <p className="text-lg font-bold text-slate-900">{formatBudget(initiative.budget)}</p>
                <p className="text-xs text-slate-400">{formatBudget(initiative.budgetSpent)} spent</p>
              </div>
            </div>

            {/* Projects — name + RAG only */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">{projects.length} Projects</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${RAG_DOT[p.rag]}`} />
                    <span className="text-sm text-slate-700 truncate flex-1">{p.name}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${RAG_COLORS[p.rag]}`}>{p.rag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top risks */}
            {topRisks.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Top Risks</p>
                <div className="space-y-2">
                  {topRisks.map((risk) => (
                    <div key={risk.id} className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{risk.title}</p>
                        <p className="text-xs text-slate-600">{risk.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* At-risk projects callout */}
            {redProjects.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{redProjects.length} project(s) are Red</p>
                  <p className="text-xs text-red-600 mt-0.5">Immediate attention required from Initiative Owner.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Initiative Owner — full cockpit ──────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-xs text-slate-400">{LIFECYCLE_ROLE_LABELS[role]} · {account.name}</span>
              {initiative.fromPortfolio && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">From Portfolio</span>
              )}
            </div>
            <h2 className="font-bold text-slate-900 text-lg truncate">{initiative.name}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onChangeRole} className="text-xs text-teal-600 hover:text-teal-800 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors hidden sm:block">
              Change role
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar nav */}
          <nav className="w-36 border-r border-slate-100 py-4 flex-shrink-0 overflow-y-auto">
            {COCKPIT_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left ${
                  activeSection === sec.id
                    ? "bg-teal-50 text-teal-700 font-semibold border-r-2 border-teal-500"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === "health" && (
              <HealthPanel initiative={initiative} projects={projects} />
            )}
            {activeSection === "projects" && (
              <ProjectsPanel projects={projects} isOwner={isOwner} onRefresh={refresh} />
            )}
            {activeSection === "budget" && (
              <BudgetPanel initiative={initiative} projects={projects} />
            )}
            {activeSection === "milestones" && (
              <MilestonesPanel initiative={initiative} projects={projects} isOwner={isOwner} onRefresh={refresh} />
            )}
            {activeSection === "risks" && (
              <RisksPanel projects={projects} />
            )}
            {activeSection === "blockers" && (
              <BlockersPanel projects={projects} isOwner={isOwner} />
            )}
            {activeSection === "team" && (
              <TeamPanel initiative={initiative} projects={projects} />
            )}
            {activeSection === "activity" && (
              <ActivityPanel initiative={initiative} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
