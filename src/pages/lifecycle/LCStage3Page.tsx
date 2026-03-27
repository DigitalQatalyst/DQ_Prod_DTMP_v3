// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle Management — Stage 3: TO Office Management Console
// Views: Overview | Pending Approvals | Active Programmes | Service Requests
//        | Escalations | Completed
// src/pages/lifecycle/LCStage3Page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleSlash,
  ClipboardList,
  Clock,
  FileText,
  Flag,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Play,
  RefreshCw,
  ShieldAlert,
  User,
  Zap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import {
  getInitiatives,
  type Initiative,
  type InitiativeStatus,
} from "@/data/shared/lifecyclePortfolioStore";

import {
  getApprovalQueue,
  getEscalations,
  getLCRequests,
  updateApprovalStatus,
  updateEscalationStatus,
  updateLCRequestStatus,
  type ApprovalStatus,
  type EscalationSeverity,
  type EscalationStatus,
  type InitiativeApprovalRequest,
  type LCEscalation,
  type LCRequestStatus,
  type LCServiceRequest,
} from "@/data/lifecycle/serviceRequestState";

// ── Types ─────────────────────────────────────────────────────────────────────

type Stage3View =
  | "overview"
  | "pending-approvals"
  | "active-programmes"
  | "service-requests"
  | "escalations"
  | "completed";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const fmtBudget = (b: number | null | undefined) =>
  b == null ? "TBC" : `AED ${(b / 1_000_000).toFixed(0)}M`;

function slaClass(r: LCServiceRequest): string {
  const target = new Date(r.submittedAt).getTime() + r.slaHours * 3_600_000;
  return Date.now() > target ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function slaLabel(r: LCServiceRequest): string {
  const target = new Date(r.submittedAt).getTime() + r.slaHours * 3_600_000;
  const remaining = target - Date.now();
  if (remaining < 0) return "SLA Breached";
  const h = Math.floor(remaining / 3_600_000);
  const d = Math.floor(h / 24);
  return d > 0 ? `${d}d left` : `${h}h left`;
}

const STATUS_BADGES: Record<LCRequestStatus, string> = {
  Submitted: "bg-sky-100 text-sky-700 border-sky-200",
  Assigned: "bg-purple-100 text-purple-700 border-purple-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-green-50 text-green-600 border-green-100",
};

const APPROVAL_STATUS_BADGES: Record<ApprovalStatus, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  "Clarification Requested": "bg-blue-100 text-blue-700 border-blue-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Escalated: "bg-purple-100 text-purple-700 border-purple-200",
};

const ESCALATION_SEVERITY_BADGES: Record<EscalationSeverity, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-gray-100 text-gray-700 border-gray-200",
};

const INITIATIVE_STATUS_BADGES: Record<InitiativeStatus, string> = {
  Active: "bg-teal-100 text-teal-700 border-teal-200",
  Scoping: "bg-blue-100 text-blue-700 border-blue-200",
  "At Risk": "bg-amber-100 text-amber-800 border-amber-200",
  "On Hold": "bg-slate-200 text-slate-600 border-slate-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

// ── Sidebar nav config ────────────────────────────────────────────────────────

interface NavItem {
  id: Stage3View;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LCStage3Page() {
  const { view: routeView } = useParams<{ view?: string }>();
  const navigate = useNavigate();

  const activeView: Stage3View =
    (["overview", "pending-approvals", "active-programmes", "service-requests", "escalations", "completed"] as Stage3View[]).includes(routeView as Stage3View)
      ? (routeView as Stage3View)
      : "overview";

  // ── Data ─────────────────────────────────────────────────────────────────────

  const [initiatives, setInitiatives] = useState<Initiative[]>(() => getInitiatives());
  const [approvals, setApprovals] = useState(() => getApprovalQueue());
  const [serviceRequests, setServiceRequests] = useState<LCServiceRequest[]>(() => getLCRequests());
  const [escalations, setEscalations] = useState<LCEscalation[]>(() => getEscalations());

  const refresh = () => {
    setInitiatives(getInitiatives());
    setApprovals(getApprovalQueue());
    setServiceRequests(getLCRequests());
    setEscalations(getEscalations());
  };

  // ── Derived ───────────────────────────────────────────────────────────────────

  const pendingApprovals = useMemo(
    () => approvals.filter((a) => a.status === "Pending" || a.status === "Clarification Requested"),
    [approvals]
  );

  const activeProgrammes = useMemo(
    () => initiatives.filter((i) => i.status === "Active" || i.status === "At Risk" || i.status === "Scoping"),
    [initiatives]
  );

  const openServiceRequests = useMemo(
    () => serviceRequests.filter((r) => r.status !== "Completed"),
    [serviceRequests]
  );

  const openEscalations = useMemo(
    () => escalations.filter((e) => e.status === "Open" || e.status === "Acknowledged"),
    [escalations]
  );

  const completedInitiatives = useMemo(
    () => initiatives.filter((i) => i.status === "Completed"),
    [initiatives]
  );

  const completedRequests = useMemo(
    () => serviceRequests.filter((r) => r.status === "Completed"),
    [serviceRequests]
  );

  const slaBreached = useMemo(
    () => openServiceRequests.filter((r) => Date.now() > new Date(r.submittedAt).getTime() + r.slaHours * 3_600_000).length,
    [openServiceRequests]
  );

  // ── Sidebar nav ───────────────────────────────────────────────────────────────

  const navItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "pending-approvals", label: "Pending Approvals", icon: <Inbox className="w-4 h-4" />, count: pendingApprovals.length },
    { id: "active-programmes", label: "Active Programmes", icon: <Play className="w-4 h-4" />, count: activeProgrammes.length },
    { id: "service-requests", label: "Service Requests", icon: <ClipboardList className="w-4 h-4" />, count: openServiceRequests.length },
    { id: "escalations", label: "Escalations", icon: <ShieldAlert className="w-4 h-4" />, count: openEscalations.length },
    { id: "completed", label: "Completed", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const goTo = (v: Stage3View) => navigate(`/stage3/lifecycle-management/${v}`, { replace: true });

  // ── Action modals ─────────────────────────────────────────────────────────────

  // Approval action modal
  const [approvalModal, setApprovalModal] = useState<{ approval: InitiativeApprovalRequest; action: ApprovalStatus } | null>(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [assignee, setAssignee] = useState("Eng. Khalid Al Rashidi");

  const submitApprovalAction = () => {
    if (!approvalModal) return;
    const { approval, action } = approvalModal;
    updateApprovalStatus(approval.id, action, {
      toNotes: approvalNote.trim() || undefined,
      rejectionReason: action === "Rejected" ? approvalNote.trim() || undefined : undefined,
      escalationNote: action === "Escalated" ? approvalNote.trim() || undefined : undefined,
    });
    toast({ title: `Initiative ${action}`, description: `${approval.initiativeName} — status updated.` });
    setApprovalModal(null);
    setApprovalNote("");
    refresh();
  };

  // Service request action modal
  const [reqModal, setReqModal] = useState<{ req: LCServiceRequest; nextStatus: LCRequestStatus } | null>(null);
  const [reqNote, setReqNote] = useState("");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableFormat, setDeliverableFormat] = useState<"PDF" | "PPTX" | "Word">("PDF");

  const submitReqAction = () => {
    if (!reqModal) return;
    const { req, nextStatus } = reqModal;
    const isDeliver = nextStatus === "Delivered";
    updateLCRequestStatus(req.id, nextStatus, {
      assignedTo: assignee || undefined,
      deliveredAt: isDeliver ? new Date().toISOString() : undefined,
      deliverableTitle: isDeliver && deliverableTitle.trim() ? deliverableTitle.trim() : undefined,
      deliverableFormat: isDeliver ? deliverableFormat : undefined,
    });
    toast({ title: `Request ${nextStatus}`, description: `${req.serviceType} for ${req.initiativeName}` });
    setReqModal(null);
    setReqNote("");
    setDeliverableTitle("");
    refresh();
  };

  // Escalation action modal
  const [escModal, setEscModal] = useState<{ esc: LCEscalation; action: EscalationStatus } | null>(null);
  const [escNote, setEscNote] = useState("");

  const submitEscAction = () => {
    if (!escModal) return;
    const { esc, action } = escModal;
    updateEscalationStatus(esc.id, action, {
      toResponse: escNote.trim() || undefined,
      resolvedNote: action === "Resolved" ? escNote.trim() || undefined : undefined,
    });
    toast({ title: `Escalation ${action}`, description: esc.title });
    setEscModal(null);
    setEscNote("");
    refresh();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">TO Office</p>
          <h2 className="text-sm font-bold text-gray-900 mt-0.5">Lifecycle Management</h2>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeView === item.id
                  ? "bg-orange-50 text-orange-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  item.id === "escalations" && item.count > 0
                    ? "bg-red-100 text-red-700"
                    : item.id === "pending-approvals" && item.count > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">
              TO
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">TO Office</p>
              <p className="text-xs text-gray-500">Stage 3 Console</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 space-y-6">

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {activeView === "overview" && (
          <OverviewView
            pendingApprovals={pendingApprovals.length}
            activeProgrammes={activeProgrammes.length}
            openRequests={openServiceRequests.length}
            openEscalations={openEscalations.length}
            slaBreached={slaBreached}
            completedInitiatives={completedInitiatives.length}
            onNavigate={goTo}
          />
        )}

        {/* ── PENDING APPROVALS ────────────────────────────────── */}
        {activeView === "pending-approvals" && (
          <PendingApprovalsView
            approvals={pendingApprovals}
            onAction={(approval, action) => {
              setApprovalModal({ approval, action });
              setApprovalNote("");
            }}
          />
        )}

        {/* ── ACTIVE PROGRAMMES ────────────────────────────────── */}
        {activeView === "active-programmes" && (
          <ActiveProgrammesView initiatives={activeProgrammes} />
        )}

        {/* ── SERVICE REQUESTS ─────────────────────────────────── */}
        {activeView === "service-requests" && (
          <ServiceRequestsView
            requests={openServiceRequests}
            onAction={(req, nextStatus) => {
              setReqModal({ req, nextStatus });
              setAssignee("Eng. Khalid Al Rashidi");
              setDeliverableTitle("");
              setDeliverableFormat("PDF");
              setReqNote("");
            }}
          />
        )}

        {/* ── ESCALATIONS ──────────────────────────────────────── */}
        {activeView === "escalations" && (
          <EscalationsView
            escalations={openEscalations}
            onAction={(esc, action) => {
              setEscModal({ esc, action });
              setEscNote("");
            }}
          />
        )}

        {/* ── COMPLETED ────────────────────────────────────────── */}
        {activeView === "completed" && (
          <CompletedView initiatives={completedInitiatives} requests={completedRequests} />
        )}
      </main>

      {/* ── Approval Action Modal ─────────────────────────────────────────────── */}
      <Dialog open={!!approvalModal} onOpenChange={() => setApprovalModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalModal?.action === "Approved" && "Approve Initiative"}
              {approvalModal?.action === "Rejected" && "Reject Initiative"}
              {approvalModal?.action === "Clarification Requested" && "Request Clarification"}
              {approvalModal?.action === "Escalated" && "Escalate to Senior Approver"}
            </DialogTitle>
          </DialogHeader>
          {approvalModal && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500">Initiative</p>
                <p className="text-sm font-semibold text-slate-900">{approvalModal.approval.initiativeName}</p>
                <p className="text-xs text-slate-500 mt-1">{approvalModal.approval.frameworkType} · {approvalModal.approval.division}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {approvalModal.action === "Rejected" ? "Rejection reason" : "Notes (optional)"}
                </label>
                <Textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder={
                    approvalModal.action === "Rejected"
                      ? "Explain why this initiative was rejected…"
                      : approvalModal.action === "Clarification Requested"
                      ? "What information is needed before approval can proceed?"
                      : "Any notes for the record…"
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalModal(null)}>Cancel</Button>
            <Button
              className={
                approvalModal?.action === "Approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : approvalModal?.action === "Rejected"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : approvalModal?.action === "Escalated"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
              onClick={submitApprovalAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Service Request Action Modal ──────────────────────────────────────── */}
      <Dialog open={!!reqModal} onOpenChange={() => setReqModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reqModal?.nextStatus === "Assigned" && "Assign Request"}
              {reqModal?.nextStatus === "In Progress" && "Start Work"}
              {reqModal?.nextStatus === "Delivered" && "Mark as Delivered"}
              {reqModal?.nextStatus === "Completed" && "Mark as Completed"}
            </DialogTitle>
          </DialogHeader>
          {reqModal && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500">Request</p>
                <p className="text-sm font-semibold text-slate-900">{reqModal.req.serviceType}</p>
                <p className="text-xs text-slate-500 mt-1">{reqModal.req.initiativeName}</p>
              </div>

              {reqModal.nextStatus === "Assigned" && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Assign to</label>
                  <Input
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="TO team member name"
                  />
                </div>
              )}

              {reqModal.nextStatus === "Delivered" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Deliverable title</label>
                    <Input
                      value={deliverableTitle}
                      onChange={(e) => setDeliverableTitle(e.target.value)}
                      placeholder="e.g. Smart Grid Initiative Status Report – Q2 2026"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Format</label>
                    <Select value={deliverableFormat} onValueChange={(v) => setDeliverableFormat(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="PPTX">PPTX</SelectItem>
                        <SelectItem value="Word">Word</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReqModal(null)}>Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={submitReqAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Escalation Action Modal ───────────────────────────────────────────── */}
      <Dialog open={!!escModal} onOpenChange={() => setEscModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {escModal?.action === "Acknowledged" && "Acknowledge Escalation"}
              {escModal?.action === "Resolved" && "Resolve Escalation"}
              {escModal?.action === "Escalated Further" && "Escalate Further"}
            </DialogTitle>
          </DialogHeader>
          {escModal && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500">Escalation</p>
                <p className="text-sm font-semibold text-slate-900">{escModal.esc.title}</p>
                <p className="text-xs text-slate-500 mt-1">{escModal.esc.initiativeName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {escModal.action === "Resolved" ? "Resolution note" : "Response"}
                </label>
                <Textarea
                  value={escNote}
                  onChange={(e) => setEscNote(e.target.value)}
                  placeholder={
                    escModal.action === "Resolved"
                      ? "Describe how this was resolved…"
                      : "Your response to the escalation…"
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscModal(null)}>Cancel</Button>
            <Button
              className={escModal?.action === "Resolved" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"}
              onClick={submitEscAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── View Components ───────────────────────────────────────────────────────────

function OverviewView({
  pendingApprovals,
  activeProgrammes,
  openRequests,
  openEscalations,
  slaBreached,
  completedInitiatives,
  onNavigate,
}: {
  pendingApprovals: number;
  activeProgrammes: number;
  openRequests: number;
  openEscalations: number;
  slaBreached: number;
  completedInitiatives: number;
  onNavigate: (v: Stage3View) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TO Office — Lifecycle Console</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Programme governance, approvals, service delivery, and escalation management.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Pending Approvals", value: pendingApprovals, icon: <Inbox className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50", view: "pending-approvals" as Stage3View, urgent: pendingApprovals > 0 },
          { label: "Active Programmes", value: activeProgrammes, icon: <Play className="w-5 h-5" />, color: "text-teal-600", bg: "bg-teal-50", view: "active-programmes" as Stage3View, urgent: false },
          { label: "Open Requests", value: openRequests, icon: <ClipboardList className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50", view: "service-requests" as Stage3View, urgent: false },
          { label: "SLA Breached", value: slaBreached, icon: <Clock className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50", view: "service-requests" as Stage3View, urgent: slaBreached > 0 },
          { label: "Escalations", value: openEscalations, icon: <ShieldAlert className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50", view: "escalations" as Stage3View, urgent: openEscalations > 0 },
          { label: "Completed", value: completedInitiatives, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-50", view: "completed" as Stage3View, urgent: false },
        ].map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => onNavigate(kpi.view)}
            className={`group text-left p-4 bg-white border rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 ${kpi.urgent ? "border-red-200 ring-1 ring-red-100" : "border-gray-200"}`}
          >
            <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center mb-3 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{kpi.label}</p>
            {kpi.urgent && kpi.value > 0 && (
              <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Needs attention
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["pending-approvals", "service-requests", "escalations", "active-programmes"] as Stage3View[]).map((v) => {
                const labels: Record<string, string> = {
                  "pending-approvals": "Review Approvals",
                  "service-requests": "Manage Requests",
                  "escalations": "Resolve Escalations",
                  "active-programmes": "View Programmes",
                };
                return (
                  <Button key={v} variant="outline" className="justify-start text-xs h-9" onClick={() => onNavigate(v)}>
                    <ChevronRight className="w-3 h-3 mr-1" />
                    {labels[v]}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Delivery Health
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>SLA Compliance</span>
                  <span className="font-semibold">
                    {openRequests > 0 ? Math.round(((openRequests - slaBreached) / openRequests) * 100) : 100}%
                  </span>
                </div>
                <Progress
                  value={openRequests > 0 ? ((openRequests - slaBreached) / openRequests) * 100 : 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Open Escalations</span>
                  <span className={`font-semibold ${openEscalations > 0 ? "text-red-600" : "text-green-600"}`}>
                    {openEscalations === 0 ? "None" : openEscalations}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Approvals Pending</span>
                  <span className={`font-semibold ${pendingApprovals > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {pendingApprovals === 0 ? "Clear" : pendingApprovals}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Pending Approvals View ─────────────────────────────────────────────────────

function PendingApprovalsView({
  approvals,
  onAction,
}: {
  approvals: InitiativeApprovalRequest[];
  onAction: (a: InitiativeApprovalRequest, action: ApprovalStatus) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Initiative requests awaiting TO review.</p>
        </div>
        <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
          {approvals.length} pending
        </Badge>
      </div>

      {approvals.length === 0 ? (
        <EmptyState icon={<Inbox className="w-8 h-8 text-gray-300" />} message="No pending approvals" />
      ) : (
        <div className="space-y-4">
          {approvals.map((a) => (
            <Card key={a.id} className="border-gray-200">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={`text-xs border ${APPROVAL_STATUS_BADGES[a.status]}`}>{a.status}</Badge>
                      <Badge variant="outline" className={`text-xs border ${a.priority === "Critical" ? "border-red-200 bg-red-50 text-red-700" : a.priority === "High" ? "border-orange-200 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-700"}`}>
                        {a.priority}
                      </Badge>
                      <Badge variant="outline" className={`text-xs border ${a.isExternal ? "border-blue-200 bg-blue-50 text-blue-700" : "border-teal-200 bg-teal-50 text-teal-700"}`}>
                        {a.isExternal ? "External" : "Internal"}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{a.initiativeName}</h3>
                    <p className="text-sm text-gray-500">{a.frameworkType} · {a.division}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400 flex-shrink-0">
                    <p>Submitted {fmtDate(a.submittedAt)}</p>
                    <p>by {a.submittedBy}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500">Objective</p>
                    <p className="text-sm text-slate-700">{a.objective}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500">Scope</p>
                    <p className="text-sm text-slate-700">{a.scope}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Proposed Owner</p>
                    <p className="font-medium text-gray-800">{a.proposedOwner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Key Stakeholders</p>
                    <p className="font-medium text-gray-800">{a.keyStakeholders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Target Start</p>
                    <p className="font-medium text-gray-800">{fmtDate(a.targetStartDate)}</p>
                  </div>
                </div>

                {a.estimatedBudget && (
                  <div className="text-sm">
                    <p className="text-xs text-gray-400">Estimated Budget</p>
                    <p className="font-medium text-gray-800">{a.estimatedBudget}</p>
                  </div>
                )}

                {a.additionalContext && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Additional context</p>
                    <p className="text-sm text-blue-800">{a.additionalContext}</p>
                  </div>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onAction(a, "Approved")}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => onAction(a, "Clarification Requested")}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> Request Clarification
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => onAction(a, "Escalated")}
                  >
                    <Flag className="w-3.5 h-3.5 mr-1" /> Escalate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => onAction(a, "Rejected")}
                  >
                    <CircleSlash className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Active Programmes View ────────────────────────────────────────────────────

function ActiveProgrammesView({ initiatives }: { initiatives: Initiative[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Active Programmes</h1>
          <p className="text-sm text-gray-500 mt-0.5">All initiatives currently in delivery.</p>
        </div>
        <Badge variant="outline">{initiatives.length} active</Badge>
      </div>

      {initiatives.length === 0 ? (
        <EmptyState icon={<Play className="w-8 h-8 text-gray-300" />} message="No active programmes" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {initiatives.map((ini) => (
            <Card key={ini.id} className={`border-gray-200 ${ini.status === "At Risk" ? "border-amber-200 bg-amber-50/30" : ""}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{ini.division}</p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{ini.name}</h3>
                  </div>
                  <Badge className={`text-xs border flex-shrink-0 ${INITIATIVE_STATUS_BADGES[ini.status]}`}>
                    {ini.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{ini.owner ?? "Unassigned"}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{ini.projects.length} projects</span>
                  <span className="ml-auto font-medium text-gray-700">{fmtBudget(ini.budget)}</span>
                </div>

                {(ini.status === "Active" || ini.status === "At Risk") && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="font-medium text-gray-700">{ini.progress}%</span>
                    </div>
                    <Progress value={ini.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>EA Alignment: {ini.eaAlignmentScore == null ? "TBD" : `${ini.eaAlignmentScore}%`}</span>
                  <span>Target: {ini.targetDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Service Requests View ─────────────────────────────────────────────────────

function ServiceRequestsView({
  requests,
  onAction,
}: {
  requests: LCServiceRequest[];
  onAction: (r: LCServiceRequest, next: LCRequestStatus) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<LCRequestStatus | "all">("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const nextStatusMap: Partial<Record<LCRequestStatus, { label: string; next: LCRequestStatus }>> = {
    Submitted: { label: "Assign", next: "Assigned" },
    Assigned: { label: "Start Work", next: "In Progress" },
    "In Progress": { label: "Deliver", next: "Delivered" },
    Delivered: { label: "Complete", next: "Completed" },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">All open lifecycle service requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(["Submitted", "Assigned", "In Progress", "Delivered"] as LCRequestStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">{filtered.length} shown</Badge>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ClipboardList className="w-8 h-8 text-gray-300" />} message="No requests match" />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const action = nextStatusMap[r.status];
            return (
              <Card key={r.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`text-xs border ${STATUS_BADGES[r.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                          {r.status}
                        </Badge>
                        <Badge className={`text-xs border ${slaClass(r)}`}>
                          {slaLabel(r)}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                          {r.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{r.serviceType}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.initiativeName}{r.projectName ? ` · ${r.projectName}` : ""}</p>
                    </div>

                    <div className="text-right text-xs text-gray-400 flex-shrink-0">
                      <p>By {r.submittedBy}</p>
                      <p>{fmtDate(r.submittedAt)}</p>
                      {r.assignedTo && <p className="text-teal-600 font-medium">→ {r.assignedTo}</p>}
                    </div>
                  </div>

                  {r.notes && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded p-2 border border-gray-100">{r.notes}</p>
                  )}

                  {action && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                        onClick={() => onAction(r, action.next)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {action.label}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Escalations View ──────────────────────────────────────────────────────────

function EscalationsView({
  escalations,
  onAction,
}: {
  escalations: LCEscalation[];
  onAction: (e: LCEscalation, action: EscalationStatus) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Escalations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Open blockers, risks, and decisions requiring TO response.</p>
        </div>
        <Badge variant="outline" className={`${escalations.length > 0 ? "border-red-200 text-red-700 bg-red-50" : "border-gray-200 text-gray-500"}`}>
          {escalations.length} open
        </Badge>
      </div>

      {escalations.length === 0 ? (
        <EmptyState icon={<ShieldAlert className="w-8 h-8 text-gray-300" />} message="No open escalations" />
      ) : (
        <div className="space-y-4">
          {escalations.map((e) => (
            <Card key={e.id} className={`border-gray-200 ${e.severity === "Critical" ? "border-red-200 bg-red-50/20" : e.severity === "High" ? "border-orange-200 bg-orange-50/10" : ""}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={`text-xs border ${ESCALATION_SEVERITY_BADGES[e.severity]}`}>{e.severity}</Badge>
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">{e.type}</Badge>
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">{e.status}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{e.title}</h3>
                    <p className="text-xs text-gray-500">{e.initiativeName}{e.projectName ? ` · ${e.projectName}` : ""}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400 flex-shrink-0">
                    <p>Raised by {e.raisedBy}</p>
                    <p>{fmtDate(e.dateRaised)}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1">What is needed</p>
                  <p className="text-sm text-slate-700">{e.whatIsNeeded}</p>
                </div>

                {e.toResponse && (
                  <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-teal-600 mb-1">TO Response</p>
                    <p className="text-sm text-teal-800">{e.toResponse}</p>
                  </div>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  {e.status === "Open" && (
                    <Button size="sm" variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => onAction(e, "Acknowledged")}>
                      Acknowledge
                    </Button>
                  )}
                  <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onAction(e, "Resolved")}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Resolve
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => onAction(e, "Escalated Further")}>
                    <Flag className="w-3 h-3 mr-1" /> Escalate Further
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Completed View ────────────────────────────────────────────────────────────

function CompletedView({
  initiatives,
  requests,
}: {
  initiatives: Initiative[];
  requests: LCServiceRequest[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Completed</h1>
        <p className="text-sm text-gray-500 mt-0.5">Delivered initiatives and completed service requests.</p>
      </div>

      {/* Completed initiatives */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" /> Completed Initiatives ({initiatives.length})
        </h2>
        {initiatives.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No completed initiatives yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {initiatives.map((ini) => (
              <Card key={ini.id} className="border-green-100 bg-green-50/20">
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{ini.division}</p>
                    <p className="text-sm font-semibold text-gray-900">{ini.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ini.type} · {fmtBudget(ini.budget)}</p>
                  </div>
                  <Badge className="text-xs border bg-green-100 text-green-700 border-green-200 flex-shrink-0">Completed</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed requests */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-teal-600" /> Completed Requests ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No completed requests yet.</p>
        ) : (
          <div className="space-y-2">
            {requests.slice(0, 20).map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{r.serviceType}</p>
                  <p className="text-xs text-gray-500">{r.initiativeName}</p>
                </div>
                <div className="text-right text-xs text-gray-400 flex-shrink-0">
                  {r.deliverableTitle && <p className="text-teal-600 font-medium">{r.deliverableTitle}</p>}
                  <p>{fmtDate(r.submittedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
