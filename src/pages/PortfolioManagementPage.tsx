import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  ChevronRight,
  Eye,
  FileText,
  Rocket,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  BarChart3,
  Shield,
  Layers,
  Cpu,
  Zap,
  LayoutGrid,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  appCards,
  projectCards,
  initiativeCards,
  rationalisationCards,
  governanceCards,
  oadCards,
  PM_TAB_CONFIG,
  PM_REPORT_TYPES,
  PM_SLA_MAP,
  DIVISION_COLORS,
  STATUS_COLORS,
  type PMTab,
  type AppCard,
  type ProjectCard,
  type InitiativeCard,
  type RationalisationCard,
  type GovernanceCard,
  type OADCard,
} from "@/data/portfolioManagement";

// ── Role system ──────────────────────────────────────────────────────────

type PMRole = "EA Office / Portfolio Manager" | "Division Head / Senior Stakeholder" | "General DEWA Staff";
const PM_ROLES: PMRole[] = [
  "EA Office / Portfolio Manager",
  "Division Head / Senior Stakeholder",
  "General DEWA Staff",
];

// ── Types for insights drawer union ──────────────────────────────────────

type AnyCard = AppCard | ProjectCard | InitiativeCard | RationalisationCard | GovernanceCard | OADCard;

// ── Helpers ───────────────────────────────────────────────────────────────

function healthColor(score: number): string {
  if (score >= 90) return "text-green-700 bg-green-100";
  if (score >= 70) return "text-amber-700 bg-amber-100";
  return "text-red-700 bg-red-100";
}

function ragColor(rag: string): string {
  if (rag === "Green") return "bg-green-500";
  if (rag === "Amber") return "bg-amber-400";
  return "bg-red-500";
}

function eaColor(score: number): string {
  if (score >= 80) return "text-green-700";
  if (score >= 60) return "text-amber-700";
  return "text-red-700";
}

function govScoreColor(score: number): string {
  if (score >= 85) return "text-green-700 bg-green-100";
  if (score >= 70) return "text-amber-700 bg-amber-100";
  return "text-red-700 bg-red-100";
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Improving") return <TrendingUp className="w-3.5 h-3.5 text-green-600" />;
  if (trend === "Declining") return <TrendingDown className="w-3.5 h-3.5 text-red-600" />;
  return <Minus className="w-3.5 h-3.5 text-gray-500" />;
}

// ── Role Selector Modal ───────────────────────────────────────────────────

function RoleSelectorModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (role: PMRole) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Select Your Role</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Intelligence depth is tailored to your role. Choose the role you want to view as for this demo.
        </p>
        <div className="space-y-3">
          {PM_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => onSelect(role)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <p className="font-semibold text-gray-900 text-sm">{role}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {role === "EA Office / Portfolio Manager"
                  ? "Full governance view — all metrics, history, cross-division"
                  : role === "Division Head / Senior Stakeholder"
                  ? "Executive summary — key scores, top risks, division-scoped"
                  : "Lightweight — overall status and headline score only"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Insights Drawer ───────────────────────────────────────────────────────

function InsightsDrawer({
  card,
  tab,
  role,
  onClose,
  onChangeRole,
  onRequestReport,
}: {
  card: AnyCard;
  tab: PMTab;
  role: PMRole;
  onClose: () => void;
  onChangeRole: () => void;
  onRequestReport: () => void;
}) {
  const isEA = role === "EA Office / Portfolio Manager";
  const isDivHead = role === "Division Head / Senior Stakeholder";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-medium text-orange-200 uppercase tracking-wider mb-1">
                {PM_TAB_CONFIG[tab].label} — Insights
              </p>
              <h2 className="text-lg font-bold leading-snug">
                {tab === "application-portfolio"
                  ? (card as AppCard).name
                  : tab === "project-portfolio"
                  ? (card as ProjectCard).name
                  : tab === "transformation-initiatives"
                  ? (card as InitiativeCard).name
                  : tab === "technology-rationalisation"
                  ? (card as RationalisationCard).overlapTitle
                  : tab === "governance-health"
                  ? `${(card as GovernanceCard).division} — Governance Health`
                  : (card as OADCard).assetClassName}
              </h2>
            </div>
            <button onClick={onClose} className="text-orange-200 hover:text-white mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
              Viewing as: {role}
            </span>
            <button
              onClick={onChangeRole}
              className="text-xs text-orange-200 hover:text-white underline"
            >
              Change role
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          {/* App Portfolio Insights */}
          {tab === "application-portfolio" && (() => {
            const c = card as AppCard;
            return (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Health Score</p>
                    <p className={`text-2xl font-bold px-2 py-0.5 rounded inline-block ${healthColor(c.healthScore)}`}>
                      {c.healthScore}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Annual TCO</p>
                    <p className="text-xl font-bold text-gray-900">{c.annualTCO}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Technical Debt</p>
                    <p className="text-sm font-semibold text-gray-900">{c.technicalDebt}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Lifecycle Stage</p>
                    <p className="text-sm font-semibold text-gray-900">{c.lifecycleStage}</p>
                  </div>
                </div>

                {isEA && c.insightsBreakdown && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Health Breakdown</h3>
                    {Object.entries(c.insightsBreakdown).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-gray-600 w-24 capitalize">{k}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${v >= 80 ? "bg-green-500" : v >= 65 ? "bg-amber-400" : "bg-red-500"}`}
                            style={{ width: `${v}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8 text-right">{v}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {isEA && c.eaAlignment && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">EA Alignment</h3>
                    <p className="text-sm text-blue-700">{c.eaAlignment}</p>
                  </div>
                )}

                {(isEA || isDivHead) && c.lifecycleRecommendation && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-orange-900 mb-1">EA Office Recommendation</h3>
                    <p className="text-sm text-orange-700">{c.lifecycleRecommendation}</p>
                  </div>
                )}

                {c.riskFlag && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{c.riskFlag}</p>
                  </div>
                )}

                {!isEA && !isDivHead && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">
                      Status: <span className={`font-semibold ${c.healthScore >= 80 ? "text-green-700" : c.healthScore >= 65 ? "text-amber-700" : "text-red-700"}`}>{c.status}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Health: {c.healthScore}%</p>
                  </div>
                )}
              </>
            );
          })()}

          {/* Project Portfolio Insights */}
          {tab === "project-portfolio" && (() => {
            const c = card as ProjectCard;
            return (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${ragColor(c.ragStatus)}`} />
                  <span className="text-sm font-semibold text-gray-900">{c.ragLabel}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{c.progress}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Budget Health</p>
                    <p className={`text-sm font-semibold ${c.budgetHealth === "On Track" ? "text-green-700" : c.budgetHealth === "Overspent" ? "text-red-700" : "text-amber-700"}`}>
                      {c.budgetHealth}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">EA Alignment</p>
                    <p className={`text-sm font-semibold ${eaColor(c.eaAlignment)}`}>{c.eaAlignment}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    <p className={`text-xs font-semibold ${c.isOverdue ? "text-red-700" : "text-gray-900"}`}>
                      {c.targetCompletion} {c.isOverdue ? "— OVERDUE" : ""}
                    </p>
                  </div>
                </div>

                {isEA && (
                  <>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Milestone Summary</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${((c.milestonesAchieved || 0) / (c.milestonesTotal || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {c.milestonesAchieved} / {c.milestonesTotal} milestones
                        </span>
                      </div>
                      {c.nextMilestone && (
                        <p className="text-xs text-gray-500">Next: {c.nextMilestone}</p>
                      )}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Top Risks</h3>
                      {c.topRisk1 && <p className="text-xs text-red-700 mb-1">• {c.topRisk1}</p>}
                      {c.topRisk2 && <p className="text-xs text-amber-700">• {c.topRisk2}</p>}
                    </div>
                  </>
                )}

                {!isEA && isDivHead && c.topRisk1 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-900 mb-1">Top Risk</p>
                    <p className="text-sm text-amber-700">{c.topRisk1}</p>
                  </div>
                )}
              </>
            );
          })()}

          {/* Transformation Initiatives Insights */}
          {tab === "transformation-initiatives" && (() => {
            const c = card as InitiativeCard;
            return (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">EA Alignment</p>
                    <p className={`text-2xl font-bold ${eaColor(c.eaAlignmentScore)}`}>{c.eaAlignmentScore}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{c.projectsCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Programme Budget</p>
                    <p className="text-sm font-bold text-gray-900">{c.programmeBudget}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    <p className="text-sm font-semibold text-gray-900">{c.targetCompletion}</p>
                  </div>
                </div>
                {(isEA || isDivHead) && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    <p className="text-sm font-semibold text-emerald-900 mb-1">Status</p>
                    <p className="text-sm text-emerald-700">{c.status} — {c.initiativeType}</p>
                  </div>
                )}
              </>
            );
          })()}

          {/* Technology Rationalisation Insights */}
          {tab === "technology-rationalisation" && (() => {
            const c = card as RationalisationCard;
            return (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Annual Overlap Cost</p>
                    <p className="text-sm font-bold text-red-700">{c.annualOverlapCost}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Saving Potential</p>
                    <p className="text-sm font-bold text-green-700">{c.savingPotential}</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Systems in Overlap</p>
                  <p className="text-sm text-gray-900">{c.systemsInOverlap}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-900 mb-1">EA Office Recommendation</p>
                  <p className="text-sm text-amber-700">{c.recommendation}: {c.consolidationTarget}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    Complexity: {c.complexity}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Status: {c.status}
                  </span>
                </div>
              </>
            );
          })()}

          {/* Governance Health Insights */}
          {tab === "governance-health" && (() => {
            const c = card as GovernanceCard;
            return (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Overall Governance</p>
                    <p className={`text-2xl font-bold px-2 py-0.5 rounded inline-block ${govScoreColor(c.overallGovernanceScore)}`}>
                      {c.overallGovernanceScore}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">EA Maturity</p>
                    <p className="text-2xl font-bold text-gray-900">{c.eaMaturityScore}<span className="text-sm text-gray-400"> / 5.0</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Arch. Compliance</p>
                    <p className="text-sm font-bold text-gray-900">{c.architectureCompliance}%</p>
                    <p className="text-xs text-gray-400">{c.standardsMet}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Trend</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendIcon trend={c.trend} />
                      <span className={`text-sm font-semibold ${c.trend === "Improving" ? "text-green-700" : c.trend === "Declining" ? "text-red-700" : "text-gray-600"}`}>
                        {c.trend}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{c.trendPercent}</p>
                  </div>
                </div>
                {isEA && (
                  <>
                    {c.criticalViolations > 0 && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-800">{c.criticalViolations} Critical Violation{c.criticalViolations > 1 ? "s" : ""}</p>
                          <p className="text-xs text-red-600">{c.nonCompliantProjects} non-compliant active projects</p>
                        </div>
                      </div>
                    )}
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Maturity Gap</p>
                      <p className="text-sm text-gray-700">{c.maturityGap}</p>
                      <p className="text-xs text-gray-400 mt-1">Last reviewed: {c.lastReviewed}</p>
                    </div>
                  </>
                )}
              </>
            );
          })()}

          {/* OAD Insights */}
          {tab === "operational-asset-digitisation" && (() => {
            const c = card as OADCard;
            return (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Digitised</p>
                    <p className="text-2xl font-bold text-gray-900">{c.digitisedPercentage}%</p>
                    <p className="text-xs text-gray-400">{c.digitisedCount} of {c.totalAssets}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className="text-sm font-bold text-gray-900">{c.remainingCount}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs text-gray-600">{c.digitisedPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${c.digitisedPercentage >= 80 ? "bg-green-500" : c.digitisedPercentage >= 50 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${c.digitisedPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Target</p>
                  <p className="text-sm font-semibold text-gray-900">{c.targetDate || "—"}</p>
                </div>
                {c.stateDetail && (
                  <div className={`border rounded-lg p-3 flex gap-2 ${c.cardState === "Gap" ? "bg-orange-50 border-orange-100" : "bg-amber-50 border-amber-100"}`}>
                    <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${c.cardState === "Gap" ? "text-orange-500" : "text-amber-500"}`} />
                    <p className={`text-sm ${c.cardState === "Gap" ? "text-orange-700" : "text-amber-700"}`}>{c.stateDetail}</p>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          <Button
            onClick={onRequestReport}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Request Report
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Request Report Modal ──────────────────────────────────────────────────

function RequestReportModal({
  cardTitle,
  tab,
  onClose,
  onSubmit,
}: {
  cardTitle: string;
  tab: PMTab;
  onClose: () => void;
  onSubmit: (type: string) => void;
}) {
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const reportTypes = PM_REPORT_TYPES[tab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Request Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">{cardTitle}</span>
        </p>
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Report Type</p>
          {reportTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                selectedType === type
                  ? "border-orange-400 bg-orange-50 text-orange-900 font-medium"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{type}</span>
                {PM_SLA_MAP[type] && (
                  <span className="text-xs text-gray-400">{PM_SLA_MAP[type]}</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
            Additional Context (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"
            rows={3}
            placeholder="Any specific focus areas, audience, or deadline..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!selectedType}
            onClick={() => onSubmit(selectedType)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            Submit Request
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function PortfolioManagementPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<PMTab>("application-portfolio");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [divisionFilter, setDivisionFilter] = useState("All Divisions");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hasInitiativeFilter, setHasInitiativeFilter] = useState("All");

  // Insights
  const [insightsCard, setInsightsCard] = useState<AnyCard | null>(null);
  const [role, setRole] = useState<PMRole | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [pendingInsightsCard, setPendingInsightsCard] = useState<AnyCard | null>(null);

  // Report modal
  const [reportCard, setReportCard] = useState<{ card: AnyCard; title: string } | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const openInsights = (card: AnyCard) => {
    if (!role) {
      setPendingInsightsCard(card);
      setRoleModalOpen(true);
    } else {
      setInsightsCard(card);
    }
  };

  const handleRoleSelected = (r: PMRole) => {
    setRole(r);
    setRoleModalOpen(false);
    if (pendingInsightsCard) {
      setInsightsCard(pendingInsightsCard);
      setPendingInsightsCard(null);
    }
  };

  const openRequestReport = (card: AnyCard, title: string) => {
    setInsightsCard(null);
    setReportCard({ card, title });
  };

  const handleReportSubmit = (type: string) => {
    setReportCard(null);
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 4000);
    navigate("/stage2/portfolio-management", {
      state: { cardId: "my-requests" },
    });
  };

  const handleInitiateInLifecycle = () => {
    navigate("/marketplaces/lifecycle-management");
  };

  // ── Filter helpers ───────────────────────────────────────────────────

  const divisions: string[] = [
    "All Divisions",
    "Generation",
    "Transmission",
    "Distribution",
    "Water Services",
    "Customer Services",
    "Digital DEWA & Moro Hub",
    "Corporate EA Office",
  ];

  const tabStatusOptions: Record<PMTab, string[]> = {
    "application-portfolio": ["All", "On Track", "At Risk", "Critical", "No Initiative"],
    "project-portfolio": ["All", "Green", "Amber", "Red"],
    "transformation-initiatives": ["All", "Active", "Scoping", "At Risk", "Completed"],
    "technology-rationalisation": ["All", "Identified", "Under Analysis", "Initiative Active", "Resolved"],
    "governance-health": ["All", "Improving", "Stable", "Declining"],
    "operational-asset-digitisation": ["All", "On Track", "At Risk", "No Initiative", "Completed"],
  };

  // ── Filtered cards ───────────────────────────────────────────────────

  const filteredCards = useMemo((): AnyCard[] => {
    let cards: AnyCard[] = [];
    if (activeTab === "application-portfolio") cards = appCards;
    else if (activeTab === "project-portfolio") cards = projectCards;
    else if (activeTab === "transformation-initiatives") cards = initiativeCards;
    else if (activeTab === "technology-rationalisation") cards = rationalisationCards;
    else if (activeTab === "governance-health") cards = governanceCards;
    else if (activeTab === "operational-asset-digitisation") cards = oadCards;

    const q = searchQuery.toLowerCase();
    return cards.filter((c) => {
      // Search
      if (q) {
        const name =
          activeTab === "application-portfolio" ? (c as AppCard).name
          : activeTab === "project-portfolio" ? (c as ProjectCard).name
          : activeTab === "transformation-initiatives" ? (c as InitiativeCard).name
          : activeTab === "technology-rationalisation" ? (c as RationalisationCard).overlapTitle
          : activeTab === "governance-health" ? (c as GovernanceCard).division
          : (c as OADCard).assetClassName;
        if (!name.toLowerCase().includes(q)) return false;
      }

      // Division filter
      if (divisionFilter !== "All Divisions") {
        const div =
          activeTab === "application-portfolio" ? (c as AppCard).division
          : activeTab === "project-portfolio" ? (c as ProjectCard).division
          : activeTab === "transformation-initiatives" ? (c as InitiativeCard).division
          : activeTab === "technology-rationalisation" ? null
          : activeTab === "governance-health" ? (c as GovernanceCard).division
          : (c as OADCard).division;
        if (div && div !== divisionFilter && div !== "All Divisions") return false;
      }

      // Status filter
      if (statusFilter !== "All") {
        if (activeTab === "project-portfolio") {
          if ((c as ProjectCard).ragStatus !== statusFilter) return false;
        } else if (activeTab === "governance-health") {
          if ((c as GovernanceCard).trend !== statusFilter) return false;
        } else if (activeTab === "transformation-initiatives") {
          if ((c as InitiativeCard).status !== statusFilter) return false;
        } else if (activeTab === "technology-rationalisation") {
          if ((c as RationalisationCard).status !== statusFilter) return false;
        } else if (activeTab === "application-portfolio") {
          if ((c as AppCard).status !== statusFilter) return false;
        } else if (activeTab === "operational-asset-digitisation") {
          if ((c as OADCard).status !== statusFilter) return false;
        }
      }

      // Has initiative filter
      if (hasInitiativeFilter === "Yes") {
        const hasIni =
          activeTab === "application-portfolio" ? !!(c as AppCard).initiativeTag
          : activeTab === "project-portfolio" ? true
          : activeTab === "operational-asset-digitisation" ? !!(c as OADCard).initiativeTag
          : activeTab === "technology-rationalisation" ? !!(c as RationalisationCard).initiativeTag
          : true;
        if (!hasIni) return false;
      } else if (hasInitiativeFilter === "No") {
        const hasIni =
          activeTab === "application-portfolio" ? !!(c as AppCard).initiativeTag
          : activeTab === "operational-asset-digitisation" ? !!(c as OADCard).initiativeTag
          : activeTab === "technology-rationalisation" ? !!(c as RationalisationCard).initiativeTag
          : true;
        if (hasIni) return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, divisionFilter, statusFilter, hasInitiativeFilter]);

  const tabCfg = PM_TAB_CONFIG[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 to-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full uppercase tracking-wide">
                  DRIVE Phase
                </span>
                <span className="text-xs text-gray-400">Portfolio Management</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
              <p className="text-gray-600 max-w-2xl text-sm leading-relaxed">
                DEWA's corporate governance intelligence platform. A single, continuously updated view of
                the entire digital estate — application health, project performance, transformation
                initiative alignment, technology rationalisation opportunities, architecture compliance,
                EA maturity, and operational asset digitisation progress. The Corporate EA Office's
                control tower.
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { label: "Intelligence Views", value: "6" },
                { label: "Real-time Analytics", value: "Live" },
                { label: "EA Office Governed", value: "✓" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-0">
            {(Object.entries(PM_TAB_CONFIG) as [PMTab, typeof PM_TAB_CONFIG[PMTab]][]).map(
              ([tabKey, cfg]) => (
                <button
                  key={tabKey}
                  onClick={() => {
                    setActiveTab(tabKey);
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                  className={`flex-shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tabKey
                      ? "border-orange-500 text-orange-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {cfg.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filters</p>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1.5">Division</p>
                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  {divisions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1.5">
                  {activeTab === "project-portfolio" ? "RAG Status" : activeTab === "governance-health" ? "Trend" : "Status"}
                </p>
                <div className="space-y-1">
                  {tabStatusOptions[activeTab].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                        statusFilter === s
                          ? "bg-orange-100 text-orange-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {["application-portfolio", "project-portfolio", "technology-rationalisation", "operational-asset-digitisation"].includes(activeTab) && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1.5">Has Active Initiative</p>
                  <div className="space-y-1">
                    {["All", "Yes", "No"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setHasInitiativeFilter(v)}
                        className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                          hasInitiativeFilter === v
                            ? "bg-orange-100 text-orange-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(divisionFilter !== "All Divisions" || statusFilter !== "All" || hasInitiativeFilter !== "All") && (
                <button
                  onClick={() => {
                    setDivisionFilter("All Divisions");
                    setStatusFilter("All");
                    setHasInitiativeFilter("All");
                  }}
                  className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search + filter toggle */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${tabCfg.label.toLowerCase()}...`}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {filteredCards.length} result{filteredCards.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Tab description */}
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">{tabCfg.label}</h2>
              <p className="text-sm text-gray-500">{tabCfg.description}</p>
            </div>

            {/* Card Grid */}
            {filteredCards.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <LayoutGrid className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No results match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCards.map((card) => (
                  <PMCard
                    key={card.id}
                    card={card}
                    tab={activeTab}
                    onInsights={() => openInsights(card)}
                    onRequestReport={() => {
                      const title =
                        activeTab === "application-portfolio" ? (card as AppCard).name
                        : activeTab === "project-portfolio" ? (card as ProjectCard).name
                        : activeTab === "transformation-initiatives" ? (card as InitiativeCard).name
                        : activeTab === "technology-rationalisation" ? (card as RationalisationCard).overlapTitle
                        : activeTab === "governance-health" ? (card as GovernanceCard).division
                        : (card as OADCard).assetClassName;
                      openRequestReport(card, title);
                    }}
                    onInitiateInLifecycle={handleInitiateInLifecycle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Portals */}
      {roleModalOpen &&
        createPortal(
          <RoleSelectorModal onClose={() => setRoleModalOpen(false)} onSelect={handleRoleSelected} />,
          document.body
        )}
      {insightsCard &&
        role &&
        createPortal(
          <InsightsDrawer
            card={insightsCard}
            tab={activeTab}
            role={role}
            onClose={() => setInsightsCard(null)}
            onChangeRole={() => {
              setPendingInsightsCard(insightsCard);
              setInsightsCard(null);
              setRoleModalOpen(true);
            }}
            onRequestReport={() => {
              const title =
                activeTab === "application-portfolio" ? (insightsCard as AppCard).name
                : activeTab === "project-portfolio" ? (insightsCard as ProjectCard).name
                : activeTab === "transformation-initiatives" ? (insightsCard as InitiativeCard).name
                : activeTab === "technology-rationalisation" ? (insightsCard as RationalisationCard).overlapTitle
                : activeTab === "governance-health" ? (insightsCard as GovernanceCard).division
                : (insightsCard as OADCard).assetClassName;
              openRequestReport(insightsCard, title);
            }}
          />,
          document.body
        )}
      {reportCard &&
        createPortal(
          <RequestReportModal
            cardTitle={reportCard.title}
            tab={activeTab}
            onClose={() => setReportCard(null)}
            onSubmit={handleReportSubmit}
          />,
          document.body
        )}
      {reportSubmitted &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Report request submitted — navigating to My Requests
          </div>,
          document.body
        )}
    </div>
  );
}

// ── PMCard component ──────────────────────────────────────────────────────

function PMCard({
  card,
  tab,
  onInsights,
  onRequestReport,
  onInitiateInLifecycle,
}: {
  card: AnyCard;
  tab: PMTab;
  onInsights: () => void;
  onRequestReport: () => void;
  onInitiateInLifecycle: () => void;
}) {
  const cfg = PM_TAB_CONFIG[tab];

  const showInitiateBtn =
    (tab === "application-portfolio" &&
      ((card as AppCard).lifecycleStage === "Replace" ||
        (card as AppCard).lifecycleStage === "Retire" ||
        (card as AppCard).status === "Critical" ||
        (card as AppCard).status === "No Initiative")) ||
    (tab === "project-portfolio" && (card as ProjectCard).ragStatus === "Red") ||
    (tab === "transformation-initiatives" &&
      ((card as InitiativeCard).eaAlignmentScore < 80 || (card as InitiativeCard).status === "At Risk")) ||
    (tab === "technology-rationalisation") ||
    (tab === "governance-health" &&
      ((card as GovernanceCard).overallGovernanceScore < 75 || (card as GovernanceCard).trend === "Declining")) ||
    (tab === "operational-asset-digitisation" &&
      ((card as OADCard).cardState === "Gap" || (card as OADCard).cardState === "At Risk"));

  const isGapState =
    (tab === "operational-asset-digitisation" && (card as OADCard).cardState === "Gap") ||
    (tab === "application-portfolio" && (card as AppCard).status === "No Initiative");

  return (
    <div className={`bg-white rounded-xl border transition-all hover:border-orange-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col ${isGapState ? "border-orange-200" : "border-gray-200"}`}>
      {/* Card header gradient */}
      <div className={`bg-gradient-to-r ${cfg.gradient} rounded-t-xl px-4 py-3`}>
        <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {tab === "application-portfolio" ? (card as AppCard).name
            : tab === "project-portfolio" ? (card as ProjectCard).name
            : tab === "transformation-initiatives" ? (card as InitiativeCard).name
            : tab === "technology-rationalisation" ? (card as RationalisationCard).overlapTitle
            : tab === "governance-health" ? (card as GovernanceCard).division
            : (card as OADCard).assetClassName}
        </p>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Division + status */}
        <div className="flex items-center flex-wrap gap-1.5">
          {tab !== "technology-rationalisation" && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              DIVISION_COLORS[
                tab === "governance-health" ? (card as GovernanceCard).division
                : tab === "operational-asset-digitisation" ? (card as OADCard).division
                : tab === "transformation-initiatives" ? (card as InitiativeCard).division
                : tab === "project-portfolio" ? (card as ProjectCard).division
                : (card as AppCard).division
              ] || "bg-gray-100 text-gray-700"
            }`}>
              {tab === "governance-health" ? (card as GovernanceCard).division
                : tab === "operational-asset-digitisation" ? (card as OADCard).division
                : tab === "transformation-initiatives" ? (card as InitiativeCard).division
                : tab === "project-portfolio" ? (card as ProjectCard).division
                : (card as AppCard).division}
            </span>
          )}
          {isGapState ? (
            <span className="text-xs px-2 py-0.5 rounded-full border bg-orange-100 text-orange-800 border-orange-200 font-medium">
              No Active Initiative
            </span>
          ) : (
            <StatusBadge card={card} tab={tab} />
          )}
        </div>

        {/* Key metrics per tab */}
        <CardMetrics card={card} tab={tab} />

        {/* Tags */}
        <CardTags card={card} tab={tab} />

        {/* Actions */}
        <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
          <button
            onClick={onInsights}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg border border-orange-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            See Insights
          </button>
          <button
            onClick={onRequestReport}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Request Report
          </button>
          {showInitiateBtn && (
            <button
              onClick={onInitiateInLifecycle}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors mt-1"
            >
              <Rocket className="w-3.5 h-3.5" />
              {tab === "project-portfolio" ? "View in Lifecycle" : "Initiate in Lifecycle"}
            </button>
          )}
          {tab === "project-portfolio" && (
            <button
              onClick={onInitiateInLifecycle}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors mt-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View in Lifecycle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ card, tab }: { card: AnyCard; tab: PMTab }) {
  let label = "";
  let color = "";

  if (tab === "application-portfolio") {
    const c = card as AppCard;
    label = c.status;
    color = STATUS_COLORS[c.status] || "bg-gray-100 text-gray-700 border-gray-200";
  } else if (tab === "project-portfolio") {
    const c = card as ProjectCard;
    label = c.ragStatus;
    color =
      c.ragStatus === "Green"
        ? "bg-green-100 text-green-800 border-green-200"
        : c.ragStatus === "Amber"
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-red-100 text-red-800 border-red-200";
  } else if (tab === "transformation-initiatives") {
    const c = card as InitiativeCard;
    label = c.status;
    color =
      c.status === "Active"
        ? "bg-green-100 text-green-800 border-green-200"
        : c.status === "Scoping"
        ? "bg-blue-100 text-blue-800 border-blue-200"
        : c.status === "At Risk"
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-gray-100 text-gray-700 border-gray-200";
  } else if (tab === "technology-rationalisation") {
    const c = card as RationalisationCard;
    label = c.status;
    color =
      c.status === "Initiative Active"
        ? "bg-green-100 text-green-800 border-green-200"
        : c.status === "Under Analysis"
        ? "bg-blue-100 text-blue-800 border-blue-200"
        : "bg-gray-100 text-gray-700 border-gray-200";
  } else if (tab === "governance-health") {
    const c = card as GovernanceCard;
    label = c.trend;
    color =
      c.trend === "Improving"
        ? "bg-green-100 text-green-800 border-green-200"
        : c.trend === "Declining"
        ? "bg-red-100 text-red-800 border-red-200"
        : "bg-gray-100 text-gray-700 border-gray-200";
  } else {
    const c = card as OADCard;
    label = c.status;
    color = STATUS_COLORS[c.status] || "bg-gray-100 text-gray-700 border-gray-200";
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>{label}</span>
  );
}

function CardMetrics({ card, tab }: { card: AnyCard; tab: PMTab }) {
  if (tab === "application-portfolio") {
    const c = card as AppCard;
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">Health</p>
          <p className={`font-bold text-sm ${c.healthScore >= 90 ? "text-green-700" : c.healthScore >= 70 ? "text-amber-700" : "text-red-700"}`}>
            {c.healthScore}%
          </p>
        </div>
        <div>
          <p className="text-gray-400">TCO</p>
          <p className="font-semibold text-gray-900">{c.annualTCO}</p>
        </div>
        <div>
          <p className="text-gray-400">Debt</p>
          <p className={`font-semibold ${c.technicalDebt === "None" || c.technicalDebt === "Low" ? "text-green-700" : c.technicalDebt === "Critical" || c.technicalDebt === "High" ? "text-red-700" : "text-amber-700"}`}>
            {c.technicalDebt}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Stage</p>
          <p className={`font-semibold ${c.lifecycleStage === "Replace" || c.lifecycleStage === "Retire" ? "text-red-700" : c.lifecycleStage === "Modernise" ? "text-amber-700" : "text-green-700"}`}>
            {c.lifecycleStage}
          </p>
        </div>
      </div>
    );
  }

  if (tab === "project-portfolio") {
    const c = card as ProjectCard;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${ragColor(c.ragStatus)}`} />
          <span className="text-xs text-gray-600">{c.ragLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${c.progress}%` }} />
          </div>
          <span className="text-xs text-gray-600">{c.progress}%</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-400">Budget</p>
            <p className={`font-semibold ${c.budgetHealth === "On Track" ? "text-green-700" : c.budgetHealth === "Overspent" ? "text-red-700" : "text-amber-700"}`}>{c.budgetHealth}</p>
          </div>
          <div>
            <p className="text-gray-400">EA Align</p>
            <p className={`font-semibold ${eaColor(c.eaAlignment)}`}>{c.eaAlignment}%</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">PM: {c.projectManager}</p>
      </div>
    );
  }

  if (tab === "transformation-initiatives") {
    const c = card as InitiativeCard;
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">EA Alignment</p>
          <p className={`font-bold text-sm ${eaColor(c.eaAlignmentScore)}`}>{c.eaAlignmentScore}%</p>
        </div>
        <div>
          <p className="text-gray-400">Projects</p>
          <p className="font-semibold text-gray-900">{c.projectsCount} projects</p>
        </div>
        <div>
          <p className="text-gray-400">Budget</p>
          <p className="font-semibold text-gray-900">{c.programmeBudget}</p>
        </div>
        <div>
          <p className="text-gray-400">Target</p>
          <p className="font-semibold text-gray-900">{c.targetCompletion}</p>
        </div>
      </div>
    );
  }

  if (tab === "technology-rationalisation") {
    const c = card as RationalisationCard;
    return (
      <div className="space-y-1.5 text-xs">
        <p className="text-gray-500 line-clamp-2">{c.systemsInOverlap}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-gray-400">Overlap Cost</p>
            <p className="font-semibold text-red-700">{c.annualOverlapCost}</p>
          </div>
          <div>
            <p className="text-gray-400">Saving</p>
            <p className="font-semibold text-green-700">{c.savingPotential}</p>
          </div>
          <div>
            <p className="text-gray-400">Complexity</p>
            <p className="font-semibold text-gray-900">{c.complexity}</p>
          </div>
          <div>
            <p className="text-gray-400">Action</p>
            <p className="font-semibold text-gray-900">{c.recommendation}</p>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "governance-health") {
    const c = card as GovernanceCard;
    return (
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Overall Score</span>
          <span className={`font-bold text-sm px-2 py-0.5 rounded ${govScoreColor(c.overallGovernanceScore)}`}>
            {c.overallGovernanceScore}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Arch. Compliance</span>
          <span className="font-semibold text-gray-900">{c.architectureCompliance}% — {c.standardsMet}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">EA Maturity</span>
          <span className="font-semibold text-gray-900">{c.eaMaturityScore} / 5.0</span>
        </div>
        {c.criticalViolations > 0 && (
          <div className="flex items-center gap-1 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-medium">{c.criticalViolations} critical violation{c.criticalViolations > 1 ? "s" : ""}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <TrendIcon trend={c.trend} />
          <span className={`font-medium ${c.trend === "Improving" ? "text-green-700" : c.trend === "Declining" ? "text-red-700" : "text-gray-600"}`}>
            {c.trend} {c.trendPercent && `(${c.trendPercent})`}
          </span>
        </div>
      </div>
    );
  }

  if (tab === "operational-asset-digitisation") {
    const c = card as OADCard;
    return (
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${c.digitisedPercentage >= 80 ? "bg-green-500" : c.digitisedPercentage >= 50 ? "bg-amber-400" : "bg-red-500"}`}
              style={{ width: `${c.digitisedPercentage}%` }}
            />
          </div>
          <span className="text-gray-600 font-medium">{c.digitisedPercentage}%</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-gray-400">Total</p>
            <p className="font-semibold text-gray-900">{c.totalAssets}</p>
          </div>
          <div>
            <p className="text-gray-400">Remaining</p>
            <p className="font-semibold text-gray-900">{c.remainingCount}</p>
          </div>
        </div>
        {c.targetDate !== "—" && (
          <p className="text-gray-500">Target: {c.targetDate}</p>
        )}
      </div>
    );
  }

  return null;
}

function CardTags({ card, tab }: { card: AnyCard; tab: PMTab }) {
  let projectTag: string | undefined;
  let initiativeTag: string | undefined;

  if (tab === "application-portfolio") {
    projectTag = (card as AppCard).projectTag;
    initiativeTag = (card as AppCard).initiativeTag;
  } else if (tab === "transformation-initiatives") {
    initiativeTag = (card as InitiativeCard).name;
  } else if (tab === "technology-rationalisation") {
    initiativeTag = (card as RationalisationCard).initiativeTag;
  } else if (tab === "operational-asset-digitisation") {
    projectTag = (card as OADCard).projectTag;
    initiativeTag = (card as OADCard).initiativeTag;
  } else if (tab === "project-portfolio") {
    initiativeTag = (card as ProjectCard).parentInitiative;
  }

  if (!projectTag && !initiativeTag) return null;

  return (
    <div className="flex flex-wrap gap-1 text-xs">
      {projectTag && (
        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
          {projectTag}
        </span>
      )}
      {initiativeTag && tab !== "transformation-initiatives" && (
        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
          {initiativeTag}
        </span>
      )}
    </div>
  );
}
