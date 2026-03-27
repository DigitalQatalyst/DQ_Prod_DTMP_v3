import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, Shield, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitiatives, type Initiative } from "@/data/shared/lifecyclePortfolioStore";

// ── Static compliance data (demo) ─────────────────────────────────────────────

type ComplianceStatus = "Compliant" | "Non-Compliant" | "Under Review" | "Remediation Required";
type ComplianceDomain = "Architecture" | "Security" | "Data Governance" | "EA Standards" | "Regulatory";

interface ComplianceItem {
  id: string;
  initiativeId: string;
  initiativeName: string;
  division: string;
  domain: ComplianceDomain;
  checkName: string;
  status: ComplianceStatus;
  score: number; // 0-100
  reviewer: string;
  reviewDate: string;
  nextReviewDate: string;
  findings: string;
  actionRequired?: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
}

const DEMO_COMPLIANCE: ComplianceItem[] = [
  {
    id: "cc-001", initiativeId: "ini-001", initiativeName: "SCADA Modernisation Programme", division: "Transmission",
    domain: "Architecture", checkName: "EA Architecture Compliance Check",
    status: "Compliant", score: 88, reviewer: "Eng. Sara Al Zaabi", reviewDate: "2026-02-10", nextReviewDate: "2026-08-10",
    findings: "Architecture aligns with DEWA EA reference model. Minor deviation in integration layer addressed.", riskLevel: "Low",
  },
  {
    id: "cc-002", initiativeId: "ini-002", initiativeName: "Customer 360 DXP", division: "Customer Services",
    domain: "Security", checkName: "Information Security Assessment",
    status: "Remediation Required", score: 61, reviewer: "Eng. Khalid Al Rashidi", reviewDate: "2026-01-28", nextReviewDate: "2026-04-28",
    findings: "PII data handling does not meet DEWA data classification policy. Encryption-at-rest missing on three data stores.",
    actionRequired: "Implement AES-256 encryption on customer data stores and update data handling procedures by Q2 2026.",
    riskLevel: "High",
  },
  {
    id: "cc-003", initiativeId: "ini-003", initiativeName: "Green Hydrogen Tech Platform", division: "Generation",
    domain: "Regulatory", checkName: "DEWA Regulatory Alignment Review",
    status: "Under Review", score: 74, reviewer: "Eng. Mohammed Al Marzouqi", reviewDate: "2026-03-01", nextReviewDate: "2026-06-01",
    findings: "Regulatory mapping in progress. UAE Net-Zero 2050 alignment partially documented. ADEK reporting framework not yet integrated.",
    actionRequired: "Complete UAE Net-Zero regulatory mapping by end of Q1 2026.",
    riskLevel: "Medium",
  },
  {
    id: "cc-004", initiativeId: "ini-001", initiativeName: "SCADA Modernisation Programme", division: "Transmission",
    domain: "Data Governance", checkName: "Data Governance Compliance Check",
    status: "Compliant", score: 92, reviewer: "Fatima Al Hashimi", reviewDate: "2026-02-15", nextReviewDate: "2026-08-15",
    findings: "Data lineage documentation complete. Master data management aligned with DEWA data strategy.", riskLevel: "Low",
  },
  {
    id: "cc-005", initiativeId: "ini-004", initiativeName: "AI-Enabled Fault Detection", division: "Distribution",
    domain: "EA Standards", checkName: "EA Standards Conformance Review",
    status: "Non-Compliant", score: 45, reviewer: "Eng. Sara Al Zaabi", reviewDate: "2026-01-20", nextReviewDate: "2026-04-20",
    findings: "API design does not follow DEWA API standards v3.1. Event-driven architecture pattern deviates from approved reference model.",
    actionRequired: "Refactor API layer to conform to DEWA API standards. Submit revised architecture for EA board sign-off.",
    riskLevel: "Critical",
  },
  {
    id: "cc-006", initiativeId: "ini-005", initiativeName: "Smart Water Network Upgrade", division: "Water",
    domain: "Architecture", checkName: "IT/OT Architecture Review",
    status: "Compliant", score: 85, reviewer: "Eng. Khalid Al Rashidi", reviewDate: "2026-02-28", nextReviewDate: "2026-08-28",
    findings: "IT/OT integration architecture approved. Network segmentation meets NERC CIP standards.", riskLevel: "Low",
  },
  {
    id: "cc-007", initiativeId: "ini-002", initiativeName: "Customer 360 DXP", division: "Customer Services",
    domain: "Data Governance", checkName: "PDPL Compliance Check",
    status: "Remediation Required", score: 58, reviewer: "Fatima Al Hashimi", reviewDate: "2026-03-05", nextReviewDate: "2026-06-05",
    findings: "UAE PDPL consent management framework not fully implemented. Data retention policies require update.",
    actionRequired: "Implement consent management module and update data retention policies to comply with UAE PDPL.",
    riskLevel: "High",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<ComplianceStatus, string> = {
  Compliant: "bg-green-100 text-green-700 border-green-200",
  "Non-Compliant": "bg-red-100 text-red-700 border-red-200",
  "Under Review": "bg-blue-100 text-blue-700 border-blue-200",
  "Remediation Required": "bg-amber-100 text-amber-800 border-amber-200",
};

const STATUS_ICON: Record<ComplianceStatus, React.ReactNode> = {
  Compliant: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  "Non-Compliant": <X className="w-4 h-4 text-red-600" />,
  "Under Review": <Clock className="w-4 h-4 text-blue-600" />,
  "Remediation Required": <AlertTriangle className="w-4 h-4 text-amber-600" />,
};

const RISK_CLASSES: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-600",
};

const SCORE_COLOR = (s: number) =>
  s >= 80 ? "text-green-600" : s >= 60 ? "text-amber-600" : "text-red-600";

const SCORE_BAR = (s: number) =>
  s >= 80 ? "bg-green-500" : s >= 60 ? "bg-amber-400" : "bg-red-500";

// ── Component ─────────────────────────────────────────────────────────────────

export default function LCCompliancePage() {
  const [domainFilter, setDomainFilter] = useState<"all" | ComplianceDomain>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ComplianceStatus>("all");
  const [selected, setSelected] = useState<ComplianceItem | null>(null);

  const initiatives = useMemo(() => getInitiatives(), []);

  const filtered = useMemo(() => {
    return DEMO_COMPLIANCE.filter((c) => {
      if (domainFilter !== "all" && c.domain !== domainFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      return true;
    });
  }, [domainFilter, statusFilter]);

  const summary = useMemo(() => {
    const total = DEMO_COMPLIANCE.length;
    const compliant = DEMO_COMPLIANCE.filter((c) => c.status === "Compliant").length;
    const nonCompliant = DEMO_COMPLIANCE.filter((c) => c.status === "Non-Compliant").length;
    const remediation = DEMO_COMPLIANCE.filter((c) => c.status === "Remediation Required").length;
    const underReview = DEMO_COMPLIANCE.filter((c) => c.status === "Under Review").length;
    const avgScore = Math.round(DEMO_COMPLIANCE.reduce((a, b) => a + b.score, 0) / total);
    return { total, compliant, nonCompliant, remediation, underReview, avgScore };
  }, []);

  // Detail panel
  if (selected) {
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-orange-700 font-semibold hover:underline flex items-center gap-1"
          >
            ← Back to Compliance Register
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selected.checkName}</h2>
            <p className="text-sm text-gray-500 mt-1">{selected.initiativeName} · {selected.division}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs border ${STATUS_CLASSES[selected.status]}`}>{selected.status}</Badge>
            <span className={`text-2xl font-bold ${SCORE_COLOR(selected.score)}`}>{selected.score}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 space-y-1">
              <p className="text-xs text-gray-500">Domain</p>
              <p className="font-semibold text-gray-900">{selected.domain}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-1">
              <p className="text-xs text-gray-500">Risk Level</p>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${RISK_CLASSES[selected.riskLevel]}`}>{selected.riskLevel}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-1">
              <p className="text-xs text-gray-500">Reviewer</p>
              <p className="font-semibold text-gray-900">{selected.reviewer}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Compliance Score</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${SCORE_BAR(selected.score)} transition-all`} style={{ width: `${selected.score}%` }} />
                </div>
              </div>
              <span className={`text-xl font-bold ${SCORE_COLOR(selected.score)}`}>{selected.score}%</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Review date: {new Date(selected.reviewDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span>·</span>
              <span>Next review: {new Date(selected.nextReviewDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold text-gray-700">Findings</p>
            <p className="text-sm text-gray-600 leading-relaxed">{selected.findings}</p>
          </CardContent>
        </Card>

        {selected.actionRequired && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5 space-y-2">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Action Required
              </p>
              <p className="text-sm text-amber-900 leading-relaxed">{selected.actionRequired}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance & Risk Register</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Architecture, security, data governance and regulatory compliance checks across all active initiatives.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Compliant", count: summary.compliant, cls: "bg-green-50 border-green-200 text-green-700" },
          { label: "Under Review", count: summary.underReview, cls: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Remediation", count: summary.remediation, cls: "bg-amber-50 border-amber-200 text-amber-800" },
          { label: "Non-Compliant", count: summary.nonCompliant, cls: "bg-red-50 border-red-200 text-red-700" },
          { label: "Avg Score", count: `${summary.avgScore}%`, cls: "bg-slate-50 border-slate-200 text-slate-700" },
        ].map((t) => (
          <div key={t.label} className={`rounded-xl border p-3 ${t.cls}`}>
            <p className="text-2xl font-bold">{t.count}</p>
            <p className="text-xs font-medium mt-0.5">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={domainFilter} onValueChange={(v) => setDomainFilter(v as any)}>
          <SelectTrigger className="h-9 w-48 text-sm">
            <SelectValue placeholder="All domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            {(["Architecture", "Security", "Data Governance", "EA Standards", "Regulatory"] as ComplianceDomain[]).map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="h-9 w-52 text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(["Compliant", "Non-Compliant", "Under Review", "Remediation Required"] as ComplianceStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto self-center">{filtered.length} checks</span>
      </div>

      {/* Table */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => setSelected(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {STATUS_ICON[item.status]}
                    <h3 className="text-sm font-semibold text-gray-900">{item.checkName}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{item.initiativeName} · <span className="text-gray-400">{item.division}</span></p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">{item.domain}</Badge>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${RISK_CLASSES[item.riskLevel]}`}>{item.riskLevel} risk</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge className={`text-xs border ${STATUS_CLASSES[item.status]}`}>{item.status}</Badge>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${SCORE_BAR(item.score)}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${SCORE_COLOR(item.score)}`}>{item.score}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {item.actionRequired && (
                <div className="mt-3 pt-3 border-t border-amber-100">
                  <p className="text-xs text-amber-700 line-clamp-1">
                    <span className="font-semibold">Action: </span>{item.actionRequired}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shield className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No compliance checks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
