import { useMemo, useState } from "react";
import { AlertTriangle, Archive, CheckCircle2, ChevronRight, Clock, Layers, Server } from "lucide-react";
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

// ── Types & demo data ─────────────────────────────────────────────────────────

type RetirementStatus =
  | "Candidate"
  | "Approved for Retirement"
  | "Decommission In Progress"
  | "Migration Required"
  | "Retired";

type RetirementReason =
  | "End of Life"
  | "Technology Rationalisation"
  | "Replaced by Modern Platform"
  | "Regulatory Compliance"
  | "Cost Optimisation";

type MigrationPath = "Rehost" | "Replatform" | "Refactor" | "Replace" | "Retire" | "Retain";

interface RetirementRecord {
  id: string;
  applicationName: string;
  systemId: string;
  division: string;
  owner: string;
  status: RetirementStatus;
  reason: RetirementReason;
  migrationPath: MigrationPath;
  targetRetirementDate: string;
  decommissionProgress: number; // 0-100
  annualCostSaving: number; // AED
  dependentSystems: string[];
  replacedBy?: string;
  dataRetentionRequired: boolean;
  dataRetentionYears?: number;
  securityClearanceRequired: boolean;
  findings: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  lastUpdated: string;
}

const DEMO_RETIREMENTS: RetirementRecord[] = [
  {
    id: "ret-001", applicationName: "Legacy SCADA HMI v2.1", systemId: "SYS-SCADA-012",
    division: "Transmission", owner: "Eng. Khalid Al Rashidi",
    status: "Decommission In Progress", reason: "Replaced by Modern Platform",
    migrationPath: "Replace", targetRetirementDate: "2026-06-30",
    decommissionProgress: 65,
    annualCostSaving: 2_800_000,
    dependentSystems: ["Energy Management System", "SCADA Data Historian"],
    replacedBy: "SCADA Modernisation Programme (AVEVA System Platform)",
    dataRetentionRequired: true, dataRetentionYears: 7,
    securityClearanceRequired: true,
    findings: "Legacy HMI running on unsupported Windows Server 2008 R2. OT security risk elevated. Migration to AVEVA System Platform 65% complete. Two substations pending cut-over.",
    riskLevel: "High", lastUpdated: "2026-03-15",
  },
  {
    id: "ret-002", applicationName: "Oracle EBS 11i Customer Portal", systemId: "SYS-EBS-004",
    division: "Customer Services", owner: "Fatima Al Hashimi",
    status: "Approved for Retirement", reason: "Replaced by Modern Platform",
    migrationPath: "Replace", targetRetirementDate: "2026-09-30",
    decommissionProgress: 20,
    annualCostSaving: 4_500_000,
    dependentSystems: ["Billing System", "CRM Module", "Customer Self-Service Portal"],
    replacedBy: "Customer 360 DXP — Salesforce CRM",
    dataRetentionRequired: true, dataRetentionYears: 10,
    securityClearanceRequired: false,
    findings: "System end-of-life per Oracle support timeline. Customer 360 DXP approved as replacement. Data migration plan approved. Dependent system integration testing pending.",
    riskLevel: "Medium", lastUpdated: "2026-03-10",
  },
  {
    id: "ret-003", applicationName: "On-Premise File Archive Server (NAS-Legacy)", systemId: "SYS-NAS-007",
    division: "Corporate & Strategy", owner: "Eng. Sara Al Zaabi",
    status: "Retired", reason: "Cost Optimisation",
    migrationPath: "Rehost", targetRetirementDate: "2026-01-31",
    decommissionProgress: 100,
    annualCostSaving: 750_000,
    dependentSystems: [],
    replacedBy: "Azure Blob Storage (DEWA Cloud Platform)",
    dataRetentionRequired: true, dataRetentionYears: 5,
    securityClearanceRequired: false,
    findings: "Successfully decommissioned. All 18TB of archived files migrated to Azure Blob Storage with tiered access policies. Hardware returned to vendor.",
    riskLevel: "Low", lastUpdated: "2026-02-01",
  },
  {
    id: "ret-004", applicationName: "SAP BW 3.5 Reporting Suite", systemId: "SYS-SAP-BW-002",
    division: "Business Support & HR", owner: "Eng. Mohammed Al Marzouqi",
    status: "Migration Required", reason: "Technology Rationalisation",
    migrationPath: "Replatform", targetRetirementDate: "2026-12-31",
    decommissionProgress: 10,
    annualCostSaving: 3_200_000,
    dependentSystems: ["Finance Reporting Dashboard", "HR Analytics Module", "Executive KPI Portal"],
    replacedBy: "SAP S/4HANA Embedded Analytics + Power BI",
    dataRetentionRequired: true, dataRetentionYears: 7,
    securityClearanceRequired: false,
    findings: "SAP BW 3.5 approaching end of mainstream maintenance. Migration assessment complete. 47 custom reports identified requiring redevelopment on new platform. Business sign-off pending.",
    riskLevel: "Medium", lastUpdated: "2026-03-05",
  },
  {
    id: "ret-005", applicationName: "GIS Mapping Server (ESRI ArcGIS 9.x)", systemId: "SYS-GIS-003",
    division: "Distribution", owner: "Eng. Khalid Al Rashidi",
    status: "Candidate", reason: "End of Life",
    migrationPath: "Refactor", targetRetirementDate: "2027-03-31",
    decommissionProgress: 5,
    annualCostSaving: 1_800_000,
    dependentSystems: ["Network Asset Management", "Field Mobile App", "Outage Management System"],
    replacedBy: "ArcGIS Enterprise 11.x (DEWA Spatial Platform)",
    dataRetentionRequired: false,
    securityClearanceRequired: false,
    findings: "ESRI ArcGIS 9.x no longer supported. Three dependent operational systems require re-integration. Spatial data migration complexity rated High. Budget request submitted for FY2026/27.",
    riskLevel: "High", lastUpdated: "2026-02-20",
  },
  {
    id: "ret-006", applicationName: "Water Quality Monitoring SCADA (Siemens WinCC v5)", systemId: "SYS-WQ-001",
    division: "Water", owner: "Eng. Sara Al Zaabi",
    status: "Approved for Retirement", reason: "Regulatory Compliance",
    migrationPath: "Replace", targetRetirementDate: "2026-08-31",
    decommissionProgress: 35,
    annualCostSaving: 1_200_000,
    dependentSystems: ["DEWA Water Quality Dashboard", "Regulatory Reporting Module"],
    replacedBy: "Smart Water Network SCADA — ABB System 800xA",
    dataRetentionRequired: true, dataRetentionYears: 10,
    securityClearanceRequired: true,
    findings: "UAE regulatory update requires IEC 62443 compliance for all OT water management systems. Current WinCC v5 cannot be patched to meet new standard. Replacement under Smart Water Network Upgrade initiative.",
    riskLevel: "Critical", lastUpdated: "2026-03-18",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<RetirementStatus, string> = {
  Candidate: "bg-slate-100 text-slate-700 border-slate-200",
  "Approved for Retirement": "bg-amber-100 text-amber-800 border-amber-200",
  "Decommission In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  "Migration Required": "bg-purple-100 text-purple-700 border-purple-200",
  Retired: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_ICON: Record<RetirementStatus, React.ReactNode> = {
  Candidate: <Server className="w-4 h-4 text-slate-500" />,
  "Approved for Retirement": <AlertTriangle className="w-4 h-4 text-amber-600" />,
  "Decommission In Progress": <Clock className="w-4 h-4 text-blue-600" />,
  "Migration Required": <Layers className="w-4 h-4 text-purple-600" />,
  Retired: <CheckCircle2 className="w-4 h-4 text-green-600" />,
};

const RISK_CLASSES: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-600",
};

const fmtCurrency = (n: number) => `AED ${(n / 1_000_000).toFixed(1)}M`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function LCRetirementPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | RetirementStatus>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [selected, setSelected] = useState<RetirementRecord | null>(null);

  const divisions = useMemo(() => Array.from(new Set(DEMO_RETIREMENTS.map((r) => r.division))).sort(), []);

  const filtered = useMemo(() =>
    DEMO_RETIREMENTS.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (divisionFilter !== "all" && r.division !== divisionFilter) return false;
      return true;
    }),
    [statusFilter, divisionFilter]
  );

  const summary = useMemo(() => {
    const total = DEMO_RETIREMENTS.length;
    const retired = DEMO_RETIREMENTS.filter((r) => r.status === "Retired").length;
    const inProgress = DEMO_RETIREMENTS.filter((r) => r.status === "Decommission In Progress").length;
    const approved = DEMO_RETIREMENTS.filter((r) => r.status === "Approved for Retirement").length;
    const totalSavings = DEMO_RETIREMENTS.filter((r) => r.status === "Retired").reduce((a, b) => a + b.annualCostSaving, 0);
    const projectedSavings = DEMO_RETIREMENTS.filter((r) => r.status !== "Candidate").reduce((a, b) => a + b.annualCostSaving, 0);
    return { total, retired, inProgress, approved, totalSavings, projectedSavings };
  }, []);

  // Detail panel
  if (selected) {
    return (
      <div className="p-6 space-y-5">
        <button onClick={() => setSelected(null)} className="text-sm text-orange-700 font-semibold hover:underline flex items-center gap-1">
          ← Back to Retirement Register
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selected.applicationName}</h2>
            <p className="text-xs text-gray-500 mt-1">{selected.systemId} · {selected.division} · Owner: {selected.owner}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs border ${STATUS_CLASSES[selected.status]}`}>{selected.status}</Badge>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${RISK_CLASSES[selected.riskLevel]}`}>{selected.riskLevel} risk</span>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Decommission Progress</p>
              <span className="text-sm font-bold text-gray-900">{selected.decommissionProgress}%</span>
            </div>
            <Progress value={selected.decommissionProgress} className="h-2" />
            <p className="text-xs text-gray-500">Target retirement: {new Date(selected.targetRetirementDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Retirement Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Reason</span><span className="font-medium">{selected.reason}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Migration Path</span><span className="font-medium">{selected.migrationPath}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Annual Saving</span><span className="font-semibold text-green-700">{fmtCurrency(selected.annualCostSaving)}</span></div>
                {selected.dataRetentionRequired && (
                  <div className="flex justify-between"><span className="text-gray-500">Data Retention</span><span className="font-medium">{selected.dataRetentionYears} years</span></div>
                )}
                {selected.securityClearanceRequired && (
                  <div className="flex justify-between"><span className="text-gray-500">Security Clearance</span><span className="font-medium text-amber-700">Required</span></div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Dependent Systems</p>
              {selected.dependentSystems.length === 0 ? (
                <p className="text-sm text-gray-500">No dependencies.</p>
              ) : (
                <ul className="space-y-1">
                  {selected.dependentSystems.map((s) => (
                    <li key={s} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              )}
              {selected.replacedBy && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Replaced By</p>
                  <p className="text-sm font-medium text-teal-700">{selected.replacedBy}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold text-gray-700">Assessment Findings</p>
            <p className="text-sm text-gray-600 leading-relaxed">{selected.findings}</p>
            <p className="text-xs text-gray-400">Last updated: {new Date(selected.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Retirement & Decommissioning</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Track applications and systems approved for retirement, decommission progress, and migration paths across DEWA divisions.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Applications", count: summary.total, cls: "bg-slate-50 border-slate-200 text-slate-700" },
          { label: "In Progress", count: summary.inProgress, cls: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Retired", count: summary.retired, cls: "bg-green-50 border-green-200 text-green-700" },
          { label: "Projected Savings", count: fmtCurrency(summary.projectedSavings) + "/yr", cls: "bg-teal-50 border-teal-200 text-teal-700" },
        ].map((t) => (
          <div key={t.label} className={`rounded-xl border p-3 ${t.cls}`}>
            <p className="text-xl font-bold">{t.count}</p>
            <p className="text-xs font-medium mt-0.5">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="h-9 w-56 text-sm"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(["Candidate", "Approved for Retirement", "Migration Required", "Decommission In Progress", "Retired"] as RetirementStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={divisionFilter} onValueChange={setDivisionFilter}>
          <SelectTrigger className="h-9 w-44 text-sm"><SelectValue placeholder="All divisions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All divisions</SelectItem>
            {divisions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} applications</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => setSelected(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {STATUS_ICON[item.status]}
                    <h3 className="text-sm font-semibold text-gray-900">{item.applicationName}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{item.systemId} · {item.division}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">{item.migrationPath}</Badge>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${RISK_CLASSES[item.riskLevel]}`}>{item.riskLevel}</span>
                    {item.securityClearanceRequired && (
                      <span className="text-xs text-amber-700 font-medium">Security clearance required</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge className={`text-xs border ${STATUS_CLASSES[item.status]}`}>{item.status}</Badge>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${item.decommissionProgress}%` }} />
                    </div>
                    <span className="text-gray-500">{item.decommissionProgress}%</span>
                  </div>
                  <span className="text-xs text-green-700 font-medium">{fmtCurrency(item.annualCostSaving)}/yr saving</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Archive className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No retirement records match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
