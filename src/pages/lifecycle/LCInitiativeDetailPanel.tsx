import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Briefcase, FolderKanban, Server, ShieldCheck, Package, Archive, CheckCircle, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  getProjects,
  type Initiative,
  type Project,
} from "@/data/shared/lifecyclePortfolioStore";

// ── Types ──────────────────────────────────────────────────────────────────────

type DetailTab = "overview" | "projects" | "applications" | "compliance" | "products" | "retirement";

interface AppEntry {
  name: string;
  type: "Core" | "Supporting" | "Integration";
  status: "Active" | "Modernising" | "Retiring";
  owner: string;
  note: string;
}

interface ComplianceCheck {
  framework: string;
  status: "Passed" | "In Review" | "Action Required" | "Not Assessed";
  dueDate: string;
  note: string;
}

interface ProductEntry {
  name: string;
  type: "Platform" | "Service" | "API" | "Dataset" | "Capability";
  status: "Planned" | "In Development" | "Live" | "Decommissioned";
  owner: string;
  expectedDate: string;
}

interface RetirementEntry {
  assetName: string;
  assetType: "Application" | "Infrastructure" | "Service" | "PLC / OT Asset";
  reason: string;
  targetDate: string;
  status: "Scoping" | "Approved" | "In Progress" | "Completed";
  owner: string;
}

// ── Static mock data seeded per initiative type ───────────────────────────────

function getApplications(ini: Initiative): AppEntry[] {
  const base: AppEntry[] = [
    { name: "SCADA / OT Control System", type: "Core", status: "Active", owner: ini.division, note: "Directly impacted by this initiative's scope." },
    { name: "Enterprise GIS (Smallworld)", type: "Supporting", status: "Active", owner: "Corporate & Strategy", note: "Asset mapping integration required." },
    { name: "SAP ERP (FI / PM modules)", type: "Integration", status: "Active", owner: "Business Support & HR", note: "Budget and procurement integration." },
  ];
  if (ini.type === "Application Modernisation" || ini.type === "DXP Programme") {
    base.push({ name: "Legacy BIS-3 Billing System", type: "Core", status: "Retiring", owner: "Customer Services", note: "Identified for decommission as part of this initiative." });
    base.push({ name: "MyDEWA Customer Portal", type: "Supporting", status: "Modernising", owner: "Customer Services", note: "UX refresh scoped in delivery plan." });
  }
  if (ini.type === "AI Deployment") {
    base.push({ name: "Rammas AI Platform", type: "Core", status: "Modernising", owner: "Innovation & AI", note: "Extended capabilities being deployed." });
    base.push({ name: "Data Lake (Azure ADLS Gen2)", type: "Integration", status: "Active", owner: "Corporate & Strategy", note: "Training data pipeline integration." });
  }
  if (ini.type === "IT/OT Convergence" || ini.type === "Net-Zero Technology") {
    base.push({ name: "IoT Sensor Network", type: "Core", status: "Active", owner: ini.division, note: "New sensor nodes being commissioned." });
  }
  return base;
}

function getComplianceChecks(ini: Initiative): ComplianceCheck[] {
  return [
    {
      framework: "NESA / UAE IAS",
      status: ini.eaAlignmentScore && ini.eaAlignmentScore >= 80 ? "Passed" : "In Review",
      dueDate: ini.targetDate,
      note: "National cybersecurity framework alignment review.",
    },
    {
      framework: "ADSIC Information Security Policy",
      status: ini.status === "Active" ? "In Review" : "Not Assessed",
      dueDate: ini.targetDate,
      note: "Abu Dhabi government entity compliance obligation.",
    },
    {
      framework: "ISO 27001",
      status: ini.eaAlignmentScore && ini.eaAlignmentScore >= 75 ? "Passed" : "Action Required",
      dueDate: "2026-06-30",
      note: "Information security management system certification check.",
    },
    {
      framework: "DEWA EA 4.0 Benchmark",
      status: ini.eaAlignmentScore === null ? "Not Assessed" : ini.eaAlignmentScore >= 70 ? "Passed" : "Action Required",
      dueDate: ini.targetDate,
      note: `Current EA alignment score: ${ini.eaAlignmentScore === null ? "TBD" : `${ini.eaAlignmentScore}%`}`,
    },
    {
      framework: "UAE Personal Data Protection Law",
      status: ini.type === "DXP Programme" || ini.type === "Application Modernisation" ? "In Review" : "Not Assessed",
      dueDate: "2026-09-30",
      note: "Data handling and PII obligations review.",
    },
  ];
}

function getProducts(ini: Initiative): ProductEntry[] {
  const products: ProductEntry[] = [
    {
      name: `${ini.name} — Core Capability`,
      type: "Capability",
      status: ini.status === "Completed" ? "Live" : ini.status === "Active" ? "In Development" : "Planned",
      owner: ini.owner,
      expectedDate: ini.targetDate,
    },
  ];
  if (ini.type === "AI Deployment") {
    products.push({ name: "AI Inference API", type: "API", status: "In Development", owner: "Innovation & AI", expectedDate: ini.targetDate });
    products.push({ name: "AI Governance Dataset", type: "Dataset", status: "Planned", owner: "Innovation & AI", expectedDate: "2026-12-31" });
  }
  if (ini.type === "Platform Deployment" || ini.type === "DXP Programme") {
    products.push({ name: "Self-Service Portal", type: "Service", status: "In Development", owner: ini.division, expectedDate: ini.targetDate });
    products.push({ name: "Integration Middleware Platform", type: "Platform", status: "Planned", owner: "Corporate & Strategy", expectedDate: "2027-03-31" });
  }
  if (ini.type === "Data Platform") {
    products.push({ name: "Data Mesh Domain API", type: "API", status: "In Development", owner: ini.owner, expectedDate: ini.targetDate });
    products.push({ name: "Enterprise Data Catalogue", type: "Platform", status: "Planned", owner: "Corporate & Strategy", expectedDate: "2027-06-30" });
  }
  return products;
}

function getRetirements(ini: Initiative): RetirementEntry[] {
  const retirements: RetirementEntry[] = [];
  if (ini.type === "Application Modernisation" || ini.type === "Technology Rationalisation") {
    retirements.push({
      assetName: "Legacy BIS-3 Billing System",
      assetType: "Application",
      reason: "Vendor support ending Q3 2026. Being replaced by SAP S/4HANA billing module.",
      targetDate: "2026-09-30",
      status: "Scoping",
      owner: "Customer Services",
    });
  }
  if (ini.type === "IT/OT Convergence" || ini.type === "Net-Zero Technology") {
    retirements.push({
      assetName: "Legacy PLC Controllers (14 units)",
      assetType: "PLC / OT Asset",
      reason: "End-of-life firmware — critical vulnerability. Replacement mandated by NESA.",
      targetDate: "2026-06-30",
      status: "In Progress",
      owner: ini.owner,
    });
    retirements.push({
      assetName: "Analogue SCADA RTU Nodes",
      assetType: "Infrastructure",
      reason: "Non-IP-capable nodes cannot participate in smart grid monitoring.",
      targetDate: "2027-03-31",
      status: "Scoping",
      owner: ini.division,
    });
  }
  if (ini.type === "Architecture Remediation") {
    retirements.push({
      assetName: "Shadow IT — Departmental SharePoint Instances (x6)",
      assetType: "Application",
      reason: "Consolidated into enterprise SharePoint under EA governance.",
      targetDate: "2026-12-31",
      status: "Approved",
      owner: ini.owner,
    });
  }
  if (retirements.length === 0) {
    retirements.push({
      assetName: "No decommission items identified yet",
      assetType: "Application",
      reason: "Retirement scope to be determined during planning phase.",
      targetDate: "TBD",
      status: "Scoping",
      owner: ini.owner,
    });
  }
  return retirements;
}

// ── Colour helpers ─────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  Active: "bg-teal-100 text-teal-700 border-teal-200",
  Scoping: "bg-blue-100 text-blue-700 border-blue-200",
  "At Risk": "bg-amber-100 text-amber-800 border-amber-200",
  "On Hold": "bg-slate-200 text-slate-600 border-slate-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

const RAG_COLOR: Record<string, string> = {
  Green: "bg-green-500",
  Amber: "bg-amber-400",
  Red: "bg-red-500",
};

const COMPLIANCE_BADGE: Record<string, string> = {
  Passed: "bg-green-100 text-green-700 border-green-200",
  "In Review": "bg-amber-100 text-amber-700 border-amber-200",
  "Action Required": "bg-red-100 text-red-700 border-red-200",
  "Not Assessed": "bg-gray-100 text-gray-500 border-gray-200",
};

const PRODUCT_STATUS_BADGE: Record<string, string> = {
  Live: "bg-green-100 text-green-700 border-green-200",
  "In Development": "bg-blue-100 text-blue-700 border-blue-200",
  Planned: "bg-gray-100 text-gray-500 border-gray-200",
  Decommissioned: "bg-red-100 text-red-700 border-red-200",
};

const RETIREMENT_STATUS_BADGE: Record<string, string> = {
  Scoping: "bg-gray-100 text-gray-600 border-gray-200",
  Approved: "bg-blue-100 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

const APP_STATUS_BADGE: Record<string, string> = {
  Active: "bg-teal-100 text-teal-700 border-teal-200",
  Modernising: "bg-blue-100 text-blue-700 border-blue-200",
  Retiring: "bg-red-100 text-red-700 border-red-200",
};

const fmtBudget = (b: number | null | undefined) =>
  b == null ? "TBC" : `AED ${(b / 1_000_000).toFixed(0)}M`;

// ── Tab nav ────────────────────────────────────────────────────────────────────

const TABS: { id: DetailTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "applications", label: "Applications", icon: Server },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "products", label: "Products", icon: Package },
  { id: "retirement", label: "Retirement", icon: Archive },
];

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  initiative: Initiative;
  onClose: () => void;
}

export default function LCInitiativeDetailPanel({ initiative, onClose }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const allProjects = useMemo(() => getProjects(), []);
  const initiativeProjects = useMemo(
    () => allProjects.filter((p) => initiative.projects.includes(p.id)),
    [allProjects, initiative.projects]
  );

  const applications = useMemo(() => getApplications(initiative), [initiative]);
  const complianceChecks = useMemo(() => getComplianceChecks(initiative), [initiative]);
  const products = useMemo(() => getProducts(initiative), [initiative]);
  const retirements = useMemo(() => getRetirements(initiative), [initiative]);

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-3xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200 bg-white">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${STATUS_BADGE[initiative.status]} border text-xs`}>
                {initiative.status}
              </Badge>
              <span className="text-xs text-gray-400">{initiative.division}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{initiative.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{initiative.type}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex gap-0 border-b border-gray-200 bg-white overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* ── Overview ─────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <p className="text-sm text-gray-700 leading-relaxed">{initiative.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <Metric label="Owner" value={initiative.owner} />
                <Metric label="Division" value={initiative.division} />
                <Metric label="Budget" value={fmtBudget(initiative.budget)} />
                <Metric label="Budget Spent" value={fmtBudget(initiative.budgetSpent)} />
                <Metric label="Target Date" value={initiative.targetDate} />
                <Metric label="EA Alignment" value={initiative.eaAlignmentScore === null ? "TBD" : `${initiative.eaAlignmentScore}%`} />
              </div>

              {(initiative.status === "Active" || initiative.status === "At Risk") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Overall Progress</span>
                    <span className="font-semibold text-gray-900">{initiative.progress}%</span>
                  </div>
                  <Progress value={initiative.progress} className="h-2" />
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-3 gap-3 text-center">
                <StatTile label="Projects" value={initiativeProjects.length} />
                <StatTile label="Applications" value={applications.length} />
                <StatTile label="Compliance Checks" value={complianceChecks.filter((c) => c.status !== "Not Assessed").length} />
              </div>
            </div>
          )}

          {/* ── Projects ─────────────────────────────────────────── */}
          {activeTab === "projects" && (
            <div className="space-y-3">
              {initiativeProjects.length === 0 ? (
                <EmptyState icon={FolderKanban} message="No projects linked to this initiative yet." />
              ) : (
                initiativeProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))
              )}
            </div>
          )}

          {/* ── Applications ──────────────────────────────────────── */}
          {activeTab === "applications" && (
            <div className="space-y-3">
              {applications.map((app, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">{app.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{app.type}</span>
                      <Badge className={`${APP_STATUS_BADGE[app.status]} border text-xs`}>{app.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{app.note}</p>
                  <p className="text-xs text-gray-400">Owner: {app.owner}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Compliance ────────────────────────────────────────── */}
          {activeTab === "compliance" && (
            <div className="space-y-3">
              {complianceChecks.map((check, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">{check.framework}</span>
                    </div>
                    <Badge className={`${COMPLIANCE_BADGE[check.status]} border text-xs`}>
                      {check.status === "Passed" && <CheckCircle className="w-3 h-3 mr-1 inline" />}
                      {check.status === "Action Required" && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                      {check.status === "In Review" && <Clock className="w-3 h-3 mr-1 inline" />}
                      {check.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{check.note}</p>
                  <p className="text-xs text-gray-400">Due: {check.dueDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Products ──────────────────────────────────────────── */}
          {activeTab === "products" && (
            <div className="space-y-3">
              {products.map((prod, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">{prod.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{prod.type}</span>
                      <Badge className={`${PRODUCT_STATUS_BADGE[prod.status]} border text-xs`}>{prod.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Owner: {prod.owner} · Expected: {prod.expectedDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Retirement ────────────────────────────────────────── */}
          {activeTab === "retirement" && (
            <div className="space-y-3">
              {retirements.map((ret, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">{ret.assetName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ret.assetType}</span>
                      <Badge className={`${RETIREMENT_STATUS_BADGE[ret.status]} border text-xs`}>{ret.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{ret.reason}</p>
                  <p className="text-xs text-gray-400">Owner: {ret.owner} · Target: {ret.targetDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Last updated: {new Date(initiative.updatedAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            {initiative.fromPortfolio && initiative.portfolioCardId && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                onClick={() => {
                  onClose();
                  navigate("/marketplaces/portfolio-management", {
                    state: { tab: "operational-asset-digitisation", highlightCardId: initiative.portfolioCardId },
                  });
                }}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                View in Portfolio
              </Button>
            )}
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper sub-components ─────────────────────────────────────────────────────

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-xl py-3">
      <p className="text-xl font-bold text-orange-700">{value}</p>
      <p className="text-xs text-orange-600 mt-0.5">{label}</p>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const completedMs = project.milestones.filter((m) => m.status === "Completed").length;
  const spentPct = project.budget > 0 ? Math.round((project.budgetSpent / project.budget) * 100) : 0;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${RAG_COLOR[project.rag] ?? "bg-gray-400"}`} />
          <span className="text-sm font-semibold text-gray-900">{project.name}</span>
        </div>
        <span className="text-xs text-gray-400">{project.division}</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span className="font-medium text-gray-700">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>PM: {project.pmName}</span>
        <span>Budget: {fmtBudget(project.budget)} ({spentPct}% spent)</span>
        <span>Milestones: {completedMs}/{project.milestones.length}</span>
        <span>Target: {project.targetDate}</span>
      </div>

      {project.risks.filter((r) => r.severity === "Critical" || r.severity === "High").length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            {project.risks.filter((r) => r.severity === "Critical" || r.severity === "High").length} high/critical risk(s) open
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.FC<{ className?: string }>; message: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <Icon className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
