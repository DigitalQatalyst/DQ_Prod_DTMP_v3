import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CheckSquare,
  ClipboardCheck,
  Clock,
  Download,
  Eye,
  FileEdit,
  Filter,
  Home,
  Inbox,
  LayoutDashboard,
  Library,
  ListChecks,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  appendStage3RequestNote,
  assignStage3Request,
  getAvailableStage3Transitions,
  syncMarketplaceRequestStatusFromStage3,
  stage3Requests,
  stage3TeamMembers,
  type Stage3Request,
  transitionStage3RequestStatus,
  unassignStage3Request,
} from "@/data/stage3";
import { getLearningChangeSetById } from "@/data/learningCenter/changeReviewState";
import { getSessionRole } from "@/data/sessionRole";
import { getLCChangeRequests } from "@/data/learningCenter/stage3/lcChangeRequests";
import type { LCChangeRequest } from "@/data/learningCenter/stage3/lcChangeRequests";
import LCGovOverview from "@/components/learningCenter/stage3/LCGovOverview";
import LCContentBrowser from "@/components/learningCenter/stage3/LCContentBrowser";
import LCChangeRequests from "@/components/learningCenter/stage3/LCChangeRequests";
import LCPendingApproval from "@/components/learningCenter/stage3/LCPendingApproval";
import LCApprovedChanges from "@/components/learningCenter/stage3/LCApprovedChanges";
import LCAnalytics from "@/components/learningCenter/stage3/LCAnalytics";
import {
  approveDesignReportRequest,
  documentStudioTabMeta,
  ensureRequestHasGeneratedDocument,
  getDocumentStudioRequest,
  getDocumentStudioSla,
  listDocumentStudioRequests,
  listDocumentStudioRevisions,
  publishDesignReportToKnowledgeCenter,
  updateDocumentStudioRequestStatus,
  type DocumentStudioRequest,
  type DocumentStudioRequestStatus,
} from "@/data/documentStudio";
import {
  deliverSolutionSpecRequestFromStage3,
  getSolutionSpecById,
  getSolutionSpecRequestByStage3RequestId,
  listDeliveredSolutionSpecs,
  listSolutionSpecRequests,
  listSolutionSpecRevisions,
  updateSolutionSpecRequestStatusFromStage3,
  updateSsRequestById,
  deliverSsRequestById,
  updateSsRevisionStatus,
  type SolutionSpecRequest,
  type SolutionSpecRevision,
} from "@/data/solutionSpecsWorkspace";
import {
  listBuildRequests,
  listBuildRevisions,
  updateBuildRequestStatus,
  assignBuildRequest,
  completeBuildRequest,
  getBuildById,
  type BuildRequest,
} from "@/data/solutionBuildWorkspace";
import { STREAM_COLORS as SB_STREAM_COLORS } from "@/data/blueprints/solutionBuilds";

// ─── General Stage3 types ────────────────────────────────────────────────────
type Stage3View =
  | "dashboard"
  | "all"
  | "new"
  | "in-progress"
  | "pending-review"
  | "team-capacity"
  | "analytics";
type Stage3Scope = "all" | "learning-center" | "knowledge-center" | "solution-specs" | "solution-build";

type LCGovView =
  | "dashboard"
  | "content-browser"
  | "change-requests"
  | "pending-approval"
  | "approved-changes"
  | "analytics";

const viewLabels: Record<Stage3View, string> = {
  dashboard: "Dashboard",
  all: "All Requests",
  new: "New",
  "in-progress": "In Progress",
  "pending-review": "Pending Review",
  "team-capacity": "Team & Capacity",
  analytics: "Analytics",
};

const requestTypeLabel: Record<Stage3Request["type"], string> = {
  "learning-center": "Learning Center",
  "knowledge-center": "Knowledge Center",
  "dtmp-templates": "Templates",
  "solution-specs": "Solution Specs",
  "solution-build": "Solution Build",
  "support-services": "Support Services",
};

// ─── Document Studio Stage3 types ────────────────────────────────────────────
const DS_VIEWS = ["overview", "queue", "active", "awaiting-approval", "revisions", "completed", "published"] as const;
type DsStage3View = (typeof DS_VIEWS)[number];

const dsNavLabels: Record<DsStage3View, string> = {
  overview: "Overview",
  queue: "Request Queue",
  active: "Active Requests",
  "awaiting-approval": "Awaiting Approval",
  revisions: "Revisions",
  completed: "Completed",
  published: "Published to KC",
};

// ─── Solution Build Stage3 types ─────────────────────────────────────────────
const SB_VIEWS = ["overview", "queue", "active", "testing", "completed", "on-hold", "revisions"] as const;
type SbStage3View = (typeof SB_VIEWS)[number];

const sbNavLabels: Record<SbStage3View, string> = {
  overview: "Overview",
  queue: "Request Queue",
  active: "Active Builds",
  testing: "In Testing",
  completed: "Completed",
  "on-hold": "On Hold",
  revisions: "Revisions",
};

function getSbStatusClass(status: BuildRequest["status"]): string {
  if (status === "Complete") return "bg-green-100 text-green-700";
  if (status === "In Progress") return "bg-orange-100 text-orange-700";
  if (status === "Testing") return "bg-purple-100 text-purple-700";
  if (status === "Queue") return "bg-blue-100 text-blue-700";
  if (status === "Triage") return "bg-yellow-100 text-yellow-700";
  if (status === "On Hold") return "bg-red-100 text-red-700";
  if (status === "Revision") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

// ─── Solution Specs Stage3 types ─────────────────────────────────────────────
const SS_VIEWS = ["overview", "queue", "active", "completed", "revisions"] as const;
type SsStage3View = (typeof SS_VIEWS)[number];

const ssNavLabels: Record<SsStage3View, string> = {
  overview: "Overview",
  queue: "Request Queue",
  active: "Active Requests",
  completed: "Completed",
  revisions: "Revisions",
};

const SS_STREAM_COLORS: Record<string, string> = {
  DBP: "bg-blue-100 text-blue-700",
  DXP: "bg-purple-100 text-purple-700",
  DWS: "bg-teal-100 text-teal-700",
  DIA: "bg-amber-100 text-amber-700",
  SDO: "bg-red-100 text-red-700",
};

function getSsStatusClass(status: SolutionSpecRequest["status"]) {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "Delivered") return "bg-green-50 text-green-600";
  if (status === "In Progress") return "bg-blue-100 text-blue-700";
  if (status === "Assigned") return "bg-sky-100 text-sky-700";
  if (status === "Revision") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

// ─── Badge helpers ────────────────────────────────────────────────────────────
function getStatusBadgeClass(status: Stage3Request["status"]) {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "in-progress") return "bg-blue-100 text-blue-700";
  if (status === "pending-review") return "bg-orange-100 text-orange-700";
  if (status === "new") return "bg-sky-100 text-sky-700";
  if (status === "assigned") return "bg-purple-100 text-purple-700";
  if (status === "on-hold") return "bg-gray-100 text-gray-700";
  return "bg-red-100 text-red-700";
}

function getPriorityBadgeClass(priority: Stage3Request["priority"]) {
  if (priority === "critical") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

function getSlaBadgeClass(slaStatus: Stage3Request["slaStatus"]) {
  if (slaStatus === "breached") return "bg-red-100 text-red-700";
  if (slaStatus === "at-risk") return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
}

function getDsStatusClass(status: DocumentStudioRequestStatus) {
  if (status === "published-to-kc") return "bg-green-700 text-white";
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "awaiting-approval") return "bg-amber-100 text-amber-700";
  if (status === "in-progress") return "bg-blue-100 text-blue-700";
  if (status === "assigned") return "bg-sky-100 text-sky-700";
  if (status === "revision-requested") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

const DAY_MS = 24 * 60 * 60 * 1000;
function getDaysOpen(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / DAY_MS));
}
function getDueSummary(dueDate: string) {
  const daysToDue = Math.ceil((new Date(dueDate).getTime() - Date.now()) / DAY_MS);
  if (daysToDue < 0) return `${Math.abs(daysToDue)}d overdue`;
  if (daysToDue === 0) return "due today";
  return `${daysToDue}d to due`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Stage3AppPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { view: routeView, requestId: routeRequestId } = useParams<{
    view?: string;
    requestId?: string;
  }>();

  const isDocumentStudioScope = location.pathname.startsWith("/stage3/document-studio");
  const isSolutionSpecsScope = location.pathname.startsWith("/stage3/solution-specs");
  const isSolutionBuildScope = location.pathname.startsWith("/stage3/solution-build");

  // ── General state ────────────────────────────────────────────────────────
  const isStage3View = (value: string): value is Stage3View => value in viewLabels;
  const [view, setView] = useState<Stage3View>(
    routeView && isStage3View(routeView) ? routeView : "dashboard"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<Stage3Request[]>(() => [...stage3Requests]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedNextStatus, setSelectedNextStatus] = useState<Stage3Request["status"] | "">("");
  const [noteDraft, setNoteDraft] = useState("");
  const [scope, setScope] = useState<Stage3Scope>("all");
  const role = getSessionRole();
  const [lcView, setLcView] = useState<LCGovView>("dashboard");
  const [lcRequests, setLcRequests] = useState<LCChangeRequest[]>([]);
  const refreshLc = () => setLcRequests(getLCChangeRequests());
  const lcSubmittedCount = lcRequests.filter((r) => r.status === "submitted").length;
  const [statusFilter, setStatusFilter] = useState<Stage3Request["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Stage3Request["priority"] | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  // ── Solution Specs state ─────────────────────────────────────────────────
  const [ssRequests, setSsRequests] = useState<SolutionSpecRequest[]>(() => listSolutionSpecRequests());
  const [selectedSsRequestId, setSelectedSsRequestId] = useState<string | null>(null);
  const [ssAssignMemberId, setSsAssignMemberId] = useState<string>("");

  // ── Solution Build state ─────────────────────────────────────────────────
  const [sbRequests, setSbRequests] = useState<BuildRequest[]>(() => listBuildRequests());
  const [selectedSbRequestId, setSelectedSbRequestId] = useState<string | null>(null);
  const [sbAssignTeam, setSbAssignTeam] = useState<string>("");

  // ── Document Studio state ────────────────────────────────────────────────
  const [dsRequests, setDsRequests] = useState<DocumentStudioRequest[]>([]);
  const [selectedDsRequestId, setSelectedDsRequestId] = useState<string | null>(
    routeRequestId ?? null
  );
  const [publicationNote, setPublicationNote] = useState("");
  const [visibility, setVisibility] = useState<"Enterprise-wide" | "Division-scoped">(
    "Enterprise-wide"
  );

  // Pre-select the member with most available hours
  const suggestedMemberId = useMemo(() => {
    return [...stage3TeamMembers].sort(
      (a, b) => (b.capacityHours - b.allocatedHours) - (a.capacityHours - a.allocatedHours)
    )[0]?.id ?? "";
  }, []);
  const [dsAssignMemberId, setDsAssignMemberId] = useState<string>(suggestedMemberId);

  // ── SS derived data ──────────────────────────────────────────────────────
  const activeSsView: SsStage3View = (SS_VIEWS as readonly string[]).includes(routeView ?? "")
    ? (routeView as SsStage3View)
    : "overview";
  const ssQueue = ssRequests.filter((r) => r.status === "Submitted");
  const ssActive = ssRequests.filter((r) => ["Assigned", "In Progress"].includes(r.status));
  const ssCompleted = ssRequests.filter((r) => ["Delivered", "Completed"].includes(r.status));
  const ssRevisions = ssRequests.filter((r) => r.status === "Revision");
  const allSsRevisionTickets = useMemo(() => listSolutionSpecRevisions(), [ssRequests]);
  const selectedSsRequest = useMemo(
    () => ssRequests.find((r) => r.id === selectedSsRequestId) ?? null,
    [ssRequests, selectedSsRequestId]
  );
  const selectedSsSpec = useMemo(
    () => (selectedSsRequest ? getSolutionSpecById(selectedSsRequest.specId) : null),
    [selectedSsRequest]
  );
  const selectedSsDelivered = useMemo(
    () => listDeliveredSolutionSpecs().find((d) => d.requestId === (selectedSsRequest?.id ?? "")) ?? null,
    [selectedSsRequest, ssRequests]
  );
  const ssCounts: Record<SsStage3View, number> = {
    overview: ssRequests.length,
    queue: ssQueue.length,
    active: ssActive.length,
    completed: ssCompleted.length,
    revisions: ssRevisions.length,
  };
  const ssVisibleRequests = useMemo(() => {
    switch (activeSsView) {
      case "queue": return ssQueue;
      case "active": return ssActive;
      case "completed": return ssCompleted;
      case "revisions": return ssRevisions;
      default: return ssRequests;
    }
  }, [activeSsView, ssQueue, ssActive, ssCompleted, ssRevisions, ssRequests]);

  const refreshSs = () => setSsRequests(listSolutionSpecRequests());

  // ── SB derived data ──────────────────────────────────────────────────────
  const activeSbView: SbStage3View = (SB_VIEWS as readonly string[]).includes(routeView ?? "")
    ? (routeView as SbStage3View)
    : "overview";
  const sbQueue = sbRequests.filter((r) => ["Submitted", "Triage"].includes(r.status));
  const sbActive = sbRequests.filter((r) => ["Queue", "In Progress"].includes(r.status));
  const sbTesting = sbRequests.filter((r) => r.status === "Testing");
  const sbCompleted = sbRequests.filter((r) => r.status === "Complete");
  const sbOnHold = sbRequests.filter((r) => r.status === "On Hold");
  const sbRevisionRequests = sbRequests.filter((r) => r.status === "Revision");
  const allSbRevisionTickets = useMemo(() => listBuildRevisions(), [sbRequests]);
  const selectedSbRequest = useMemo(
    () => sbRequests.find((r) => r.id === selectedSbRequestId) ?? null,
    [sbRequests, selectedSbRequestId]
  );
  const selectedSbBuild = useMemo(
    () => (selectedSbRequest ? getBuildById(selectedSbRequest.buildId) : null),
    [selectedSbRequest]
  );
  const sbCounts: Record<SbStage3View, number> = {
    overview: sbRequests.length,
    queue: sbQueue.length,
    active: sbActive.length,
    testing: sbTesting.length,
    completed: sbCompleted.length,
    "on-hold": sbOnHold.length,
    revisions: sbRevisionRequests.length,
  };
  const sbVisibleRequests = useMemo(() => {
    switch (activeSbView) {
      case "queue": return sbQueue;
      case "active": return sbActive;
      case "testing": return sbTesting;
      case "completed": return sbCompleted;
      case "on-hold": return sbOnHold;
      case "revisions": return sbRevisionRequests;
      default: return sbRequests;
    }
  }, [activeSbView, sbQueue, sbActive, sbTesting, sbCompleted, sbOnHold, sbRevisionRequests, sbRequests]);

  const refreshSb = () => setSbRequests(listBuildRequests());

  // ── DS derived data ──────────────────────────────────────────────────────
  const activeDsView: DsStage3View = (DS_VIEWS as readonly string[]).includes(routeView ?? "")
    ? (routeView as DsStage3View)
    : "overview";
  const dsQueue = dsRequests.filter((r) => r.status === "submitted");
  const dsActive = dsRequests.filter((r) =>
    ["assigned", "in-progress", "approved"].includes(r.status)
  );
  const dsAwaitingApproval = dsRequests.filter((r) => r.status === "awaiting-approval");
  const dsRevisionRequests = dsRequests.filter((r) => r.status === "revision-requested");
  const dsCompleted = dsRequests.filter((r) =>
    ["completed", "published-to-kc"].includes(r.status)
  );
  const dsPublished = dsRequests.filter((r) => r.status === "published-to-kc");
  const selectedDsRequest = selectedDsRequestId
    ? (getDocumentStudioRequest(selectedDsRequestId) ?? null)
    : null;
  const dsRevisions = listDocumentStudioRevisions();

  const dsCounts: Record<DsStage3View, number> = {
    overview: dsRequests.length,
    queue: dsQueue.length,
    active: dsActive.length,
    "awaiting-approval": dsAwaitingApproval.length,
    revisions: dsRevisionRequests.length,
    completed: dsCompleted.length,
    published: dsPublished.length,
  };

  const dsVisibleRequests = useMemo(() => {
    switch (activeDsView) {
      case "queue": return dsQueue;
      case "active": return dsActive;
      case "awaiting-approval": return dsAwaitingApproval;
      case "revisions": return dsRevisionRequests;
      case "completed": return dsCompleted;
      case "published": return dsPublished;
      default: return dsRequests;
    }
  }, [activeDsView, dsQueue, dsActive, dsAwaitingApproval, dsRevisionRequests, dsCompleted, dsPublished, dsRequests]);

  const refreshDs = () => setDsRequests(listDocumentStudioRequests());

  // Reset assignment dropdown when overlay opens on a different request
  useEffect(() => {
    if (!selectedDsRequestId) return;
    const req = getDocumentStudioRequest(selectedDsRequestId);
    if (req?.assignedTo) {
      const match = stage3TeamMembers.find((m) => m.name === req.assignedTo);
      setDsAssignMemberId(match?.id ?? suggestedMemberId);
    } else {
      setDsAssignMemberId(suggestedMemberId);
    }
  }, [selectedDsRequestId, suggestedMemberId]);

  // ── General derived data ─────────────────────────────────────────────────
  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );
  const selectedLearningChangeSet = useMemo(() => {
    if (!selectedRequest) return null;
    const changeAsset = (selectedRequest.relatedAssets ?? []).find((a) =>
      a.startsWith("learning-change:")
    );
    if (!changeAsset) return null;
    const changeId = changeAsset.replace("learning-change:", "").trim();
    return changeId ? getLearningChangeSetById(changeId) ?? null : null;
  }, [selectedRequest, requests]);
  const selectedSolutionSpecRequest = useMemo(() => {
    if (!selectedRequest || selectedRequest.type !== "solution-specs") return null;
    return getSolutionSpecRequestByStage3RequestId(selectedRequest.id);
  }, [selectedRequest, requests]);
  const selectedSolutionSpec = useMemo(() => {
    if (!selectedSolutionSpecRequest) return null;
    return getSolutionSpecById(selectedSolutionSpecRequest.specId);
  }, [selectedSolutionSpecRequest]);
  const selectedDeliveredSpec = useMemo(() => {
    if (!selectedSolutionSpecRequest) return null;
    return listDeliveredSolutionSpecs().find(
      (item) => item.requestId === selectedSolutionSpecRequest.id
    ) ?? null;
  }, [selectedSolutionSpecRequest, requests]);

  const scopedRequests = useMemo(() => {
    if (scope === "all") return requests;
    return requests.filter((r) => r.type === scope);
  }, [scope, requests]);

  useEffect(() => {
    if (!selectedRequestId) return;
    if (scope === "all") return;
    const selected = requests.find((request) => request.id === selectedRequestId);
    if (!selected || selected.type !== scope) {
      setSelectedRequestId(null);
    }
  }, [scope, selectedRequestId, requests]);

  useEffect(() => {
    if (scope === "learning-center") {
      setLcRequests(getLCChangeRequests());
    }
  }, [scope]);

  useEffect(() => {
    if (!selectedRequest) {
      setSelectedMemberId("");
      setSelectedNextStatus("");
      setNoteDraft("");
      return;
    }
    const matchingMember = stage3TeamMembers.find(
      (member) =>
        member.name === selectedRequest.assignedTo && member.team === selectedRequest.assignedTeam
    );
    setSelectedMemberId(matchingMember?.id ?? "");
    const available = getAvailableStage3Transitions(selectedRequest.status);
    setSelectedNextStatus(available[0] ?? "");
    setNoteDraft("");
  }, [selectedRequest]);


  const queueKpis = useMemo(() => {
    const statusCounts = scopedRequests.reduce<Record<Stage3Request["status"], number>>(
      (acc, r) => { acc[r.status] += 1; return acc; },
      { new: 0, assigned: 0, "in-progress": 0, "pending-review": 0, "pending-user": 0, completed: 0, "on-hold": 0, cancelled: 0 }
    );
    const total = scopedRequests.length;
    const active = statusCounts.assigned + statusCounts["in-progress"] + statusCounts["pending-user"];
    const pendingReview = statusCounts["pending-review"];
    const breached = scopedRequests.filter((r) => r.slaStatus === "breached").length;
    const slaCompliant = total === 0 ? 100 : Math.round(((total - breached) / total) * 100);
    const avgResolutionDays = Math.max(
      1.2,
      Number(
        (scopedRequests.reduce((sum, r) => sum + (r.actualHours ?? r.estimatedHours) / 8, 0) /
          Math.max(1, total)).toFixed(1)
      )
    );
    const satisfaction = Number(
      (scopedRequests.reduce((sum, r) => sum + (r.customerSatisfaction ?? 4.5), 0) /
        Math.max(1, total)).toFixed(1)
    );
    return { total, active, pendingReview, breached, slaCompliant, avgResolutionDays, satisfaction };
  }, [scopedRequests]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scopedRequests.filter((r) => {
      const matchesView =
        view === "all" || view === "dashboard" ||
        (view === "new" && r.status === "new") ||
        (view === "in-progress" && r.status === "in-progress") ||
        (view === "pending-review" && r.status === "pending-review");
      if (!matchesView) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
      if (assigneeFilter !== "all") {
        const assignee = (r.assignedTo ?? "unassigned").toLowerCase();
        if (assignee !== assigneeFilter.toLowerCase()) return false;
      }
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.requestNumber.toLowerCase().includes(q) ||
        r.requester.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    });
  }, [view, searchQuery, scopedRequests, statusFilter, priorityFilter, assigneeFilter]);

  const assigneeOptions = useMemo(
    () => Array.from(new Set(scopedRequests.map((r) => r.assignedTo ?? "Unassigned").filter(Boolean))),
    [scopedRequests]
  );

  const requestNavCounts = {
    all: queueKpis.total,
    new: scopedRequests.filter((r) => r.status === "new").length,
    inProgress: scopedRequests.filter((r) => r.status === "in-progress").length,
    pendingReview: scopedRequests.filter((r) => r.status === "pending-review").length,
  };

  const availableNextStatuses = selectedRequest
    ? getAvailableStage3Transitions(selectedRequest.status)
    : [];

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSolutionSpecsScope) return;
    setSsRequests(listSolutionSpecRequests());
  }, [isSolutionSpecsScope, location.key]);

  useEffect(() => {
    if (!isSolutionBuildScope) return;
    setSbRequests(listBuildRequests());
  }, [isSolutionBuildScope, location.key]);

  useEffect(() => {
    if (!isDocumentStudioScope) return;
    setDsRequests(listDocumentStudioRequests());
  }, [isDocumentStudioScope, location.key]);

  useEffect(() => {
    setSelectedDsRequestId(routeRequestId ?? null);
  }, [routeRequestId]);

  useEffect(() => {
    if (!routeView || !isStage3View(routeView)) { setView("dashboard"); return; }
    setView(routeView);
  }, [routeView]);

  useEffect(() => {
    if (!selectedRequestId) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedRequestId(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedRequestId]);

  useEffect(() => {
    if (!selectedDsRequestId) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedDsRequestId(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedDsRequestId]);

  useEffect(() => {
    if (!selectedSbRequestId) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedSbRequestId(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedSbRequestId]);

  useEffect(() => {
    if (!selectedRequestId) return;
    if (scope === "all") return;
    const selected = requests.find((r) => r.id === selectedRequestId);
    if (!selected || selected.type !== scope) setSelectedRequestId(null);
  }, [scope, selectedRequestId, requests]);

  useEffect(() => {
    if (!selectedRequest) {
      setSelectedMemberId(""); setSelectedNextStatus(""); setNoteDraft(""); return;
    }
    const matchingMember = stage3TeamMembers.find(
      (m) => m.name === selectedRequest.assignedTo && m.team === selectedRequest.assignedTeam
    );
    setSelectedMemberId(matchingMember?.id ?? "");
    const available = getAvailableStage3Transitions(selectedRequest.status);
    setSelectedNextStatus(available[0] ?? "");
    setNoteDraft("");
  }, [selectedRequest]);

  useEffect(() => {
    if (selectedDsRequestId) { setPublicationNote(""); setVisibility("Enterprise-wide"); }
  }, [selectedDsRequestId]);

  // ── General handlers ─────────────────────────────────────────────────────
  const handleAssign = () => {
    if (!selectedRequest || !selectedMemberId) return;
    const updated = assignStage3Request(selectedRequest.id, selectedMemberId);
    if (!updated) return;
    if (updated.type === "solution-specs") {
      updateSolutionSpecRequestStatusFromStage3(updated.id, "Assigned", updated.assignedTo);
    }
    setRequests([...stage3Requests]);
  };
  const handleUnassign = () => {
    if (!selectedRequest) return;
    const updated = unassignStage3Request(selectedRequest.id);
    if (!updated) return;
    setRequests([...stage3Requests]);
  };
  const handleStatusTransition = () => {
    if (!selectedRequest || !selectedNextStatus) return;
    const updated = transitionStage3RequestStatus(selectedRequest.id, selectedNextStatus);
    if (!updated) return;
    if (updated.type === "solution-specs") {
      const mappedStatus =
        selectedNextStatus === "assigned"
          ? "Assigned"
          : selectedNextStatus === "in-progress"
            ? "In Progress"
            : selectedNextStatus === "pending-review"
              ? "Delivered"
              : selectedNextStatus === "completed"
                ? "Completed"
                : null;
      if (mappedStatus) {
        updateSolutionSpecRequestStatusFromStage3(updated.id, mappedStatus, updated.assignedTo);
      }
    }
    syncMarketplaceRequestStatusFromStage3(updated);
    setRequests([...stage3Requests]);
  };
  const handleAddNote = () => {
    if (!selectedRequest) return;
    const updated = appendStage3RequestNote(selectedRequest.id, noteDraft);
    if (!updated) return;
    setRequests([...stage3Requests]);
    setNoteDraft("");
  };
  const handleSolutionSpecStartWork = () => {
    if (!selectedRequest || selectedRequest.type !== "solution-specs") return;
    const updated = transitionStage3RequestStatus(selectedRequest.id, "in-progress");
    if (!updated) return;
    updateSolutionSpecRequestStatusFromStage3(updated.id, "In Progress", updated.assignedTo);
    syncMarketplaceRequestStatusFromStage3(updated);
    setRequests([...stage3Requests]);
  };
  const handleSolutionSpecGenerateAndDeliver = () => {
    if (!selectedRequest || selectedRequest.type !== "solution-specs") return;
    const reviewReady =
      selectedRequest.status === "pending-review"
        ? selectedRequest
        : transitionStage3RequestStatus(selectedRequest.id, "pending-review");
    if (!reviewReady) return;
    updateSolutionSpecRequestStatusFromStage3(reviewReady.id, "Delivered", reviewReady.assignedTo);
    const completed =
      reviewReady.status === "completed"
        ? reviewReady
        : transitionStage3RequestStatus(reviewReady.id, "completed");
    if (!completed) return;
    deliverSolutionSpecRequestFromStage3(completed.id);
    syncMarketplaceRequestStatusFromStage3(completed);
    setRequests([...stage3Requests]);
  };
  // ── Solution Specs dedicated handlers ────────────────────────────────────
  const handleSsAssign = () => {
    if (!selectedSsRequest || !ssAssignMemberId) return;
    const member = stage3TeamMembers.find((m) => m.id === ssAssignMemberId);
    if (!member) return;
    updateSsRequestById(selectedSsRequest.id, { status: "Assigned", assignedTo: member.name });
    refreshSs();
  };
  const handleSsStartWork = () => {
    if (!selectedSsRequest) return;
    updateSsRequestById(selectedSsRequest.id, { status: "In Progress" });
    refreshSs();
  };
  const handleSsBuildAndDeliver = () => {
    if (!selectedSsRequest) return;
    deliverSsRequestById(selectedSsRequest.id);
    window.open("https://lovable.dev/dashboard", "_blank");
    refreshSs();
  };
  const handleSsResumeRevision = (requestId: string) => {
    updateSsRequestById(requestId, { status: "In Progress" });
    refreshSs();
  };

  const advanceLearningChangeReview = (request: Stage3Request, terminal: "approved" | "rejected") => {
    const transitionOrder: Stage3Request["status"][] =
      terminal === "approved"
        ? ["assigned", "in-progress", "pending-review", "completed"]
        : ["on-hold", "cancelled"];
    let working = request;
    for (const nextStatus of transitionOrder) {
      if (working.status === nextStatus) continue;
      const updated = transitionStage3RequestStatus(working.id, nextStatus);
      if (!updated) continue;
      working = updated;
      syncMarketplaceRequestStatusFromStage3(updated);
      if (terminal === "rejected" && nextStatus === "cancelled") break;
      if (terminal === "approved" && nextStatus === "completed") break;
    }
    setRequests([...stage3Requests]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-2xl text-gray-900">TO Operations</h2>
          <p className="text-sm text-gray-500">
            {scope === "learning-center" ? "Learning Centre Governance" : "Stage 3 — Transformation Office"}
          </p>
        </div>

        {/* SB scope: flat nav with count badges */}
        {isSolutionBuildScope ? (
          <nav className="p-4 space-y-1 flex-1">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 px-1">
              Solution Build
            </p>
            {SB_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => navigate(`/stage3/solution-build/${v}`)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  activeSbView === v
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{sbNavLabels[v]}</span>
                {v !== "overview" && sbCounts[v] > 0 && (
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    v === "queue" ? "bg-blue-100 text-blue-700"
                    : v === "revisions" ? "bg-red-100 text-red-700"
                    : v === "active" ? "bg-amber-100 text-amber-700"
                    : v === "testing" ? "bg-purple-100 text-purple-700"
                    : v === "on-hold" ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                    {sbCounts[v]}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 px-1">
                Management
              </p>
              <button
                onClick={() => navigate("/stage3/team-capacity")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-4 h-4" />
                Team &amp; Capacity
              </button>
              <button
                onClick={() => navigate("/stage3/analytics")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </nav>
        ) : isSolutionSpecsScope ? (
          <nav className="p-4 space-y-1 flex-1">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 px-1">
              Solution Specs
            </p>
            {SS_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => navigate(`/stage3/solution-specs/${v}`)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  activeSsView === v
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{ssNavLabels[v]}</span>
                {v !== "overview" && ssCounts[v] > 0 && (
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    v === "queue" ? "bg-blue-100 text-blue-700"
                    : v === "revisions" ? "bg-red-100 text-red-700"
                    : v === "active" ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                    {ssCounts[v]}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 px-1">
                Management
              </p>
              <button
                onClick={() => navigate("/stage3/team-capacity")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-4 h-4" />
                Team &amp; Capacity
              </button>
              <button
                onClick={() => navigate("/stage3/analytics")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </nav>
        ) : isDocumentStudioScope ? (
          <nav className="p-4 space-y-1 flex-1">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 px-1">
              Document Studio
            </p>
            {DS_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => navigate(`/stage3/document-studio/${v}`)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  activeDsView === v
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{dsNavLabels[v]}</span>
                {v !== "overview" && dsCounts[v] > 0 && (
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    v === "queue" ? "bg-blue-100 text-blue-700"
                    : v === "awaiting-approval" ? "bg-amber-100 text-amber-700"
                    : v === "revisions" ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                    {dsCounts[v]}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 px-1">
                Management
              </p>
              <button
                onClick={() => navigate("/stage3/team-capacity")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-4 h-4" />
                Team &amp; Capacity
              </button>
              <button
                onClick={() => navigate("/stage3/analytics")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </nav>
        ) : scope === "learning-center" ? (
          <nav className="p-4 space-y-1 flex-1">
            <div className="p-4 space-y-1">
              <button
                onClick={() => navigate("/stage3/dashboard")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  view === "dashboard" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Content Governance</p>
              <div className="space-y-1">
                {(
                  [
                    { id: "dashboard" as LCGovView, label: "Overview", Icon: LayoutDashboard },
                    { id: "content-browser" as LCGovView, label: "Content Browser", Icon: Library },
                    { id: "change-requests" as LCGovView, label: "Change Requests", Icon: FileEdit },
                    { id: "pending-approval" as LCGovView, label: "Pending Approval", Icon: ClipboardCheck },
                    { id: "approved-changes" as LCGovView, label: "Approved Changes", Icon: CheckSquare },
                    { id: "analytics" as LCGovView, label: "Analytics", Icon: BarChart3 },
                  ]
                ).map(({ id, label, Icon }) => {
                  const isActive = lcView === id;
                  const showBadge = id === "pending-approval" && lcSubmittedCount > 0;
                  return (
                    <button
                      key={id}
                      onClick={() => setLcView(id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                        isActive ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-orange-600" : "text-gray-500"}`} />
                      <span className="flex-1">{label}</span>
                      {showBadge && (
                        <span className="bg-orange-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                          {lcSubmittedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        ) : (
          /* General scope: grouped nav */
          <>
            <div className="p-4 space-y-1">
              <button
                onClick={() => navigate("/stage3/dashboard")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  view === "dashboard" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Requests</p>
              <div className="space-y-1">
                <button
                  onClick={() => navigate("/stage3/all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                    view === "all" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-2"><ListChecks className="w-4 h-4" />All Requests</span>
                  <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100">{requestNavCounts.all}</span>
                </button>
                <button
                  onClick={() => navigate("/stage3/new")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                    view === "new" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-2"><Inbox className="w-4 h-4" />New</span>
                  <span className="text-xs rounded-full px-2 py-0.5 bg-blue-100 text-blue-700">{requestNavCounts.new}</span>
                </button>
                <button
                  onClick={() => navigate("/stage3/in-progress")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                    view === "in-progress" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-2"><Activity className="w-4 h-4" />In Progress</span>
                  <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-700">{requestNavCounts.inProgress}</span>
                </button>
                <button
                  onClick={() => navigate("/stage3/pending-review")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                    view === "pending-review" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-2"><Eye className="w-4 h-4" />Pending Review</span>
                  <span className="text-xs rounded-full px-2 py-0.5 bg-orange-100 text-orange-700">{requestNavCounts.pendingReview}</span>
                </button>
              </div>
            </div>
            <div className="px-4 pb-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Management</p>
              <div className="space-y-1">
                <button
                  onClick={() => navigate("/stage3/team-capacity")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    view === "team-capacity" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Team &amp; Capacity
                </button>
                <button
                  onClick={() => navigate("/stage3/analytics")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    view === "analytics" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-auto border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center">
              SM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Sarah Miller</p>
              <p className="text-xs text-gray-500">TO Team Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">
              {scope === "learning-center"
                ? "Learning Centre"
                : isSolutionBuildScope ? sbNavLabels[activeSbView]
                : isSolutionSpecsScope ? ssNavLabels[activeSsView]
                : isDocumentStudioScope ? dsNavLabels[activeDsView]
                : "Request Management"}
            </h1>
            <p className="text-sm text-gray-500">
              {scope === "learning-center"
                ? "Content Governance · EA Office"
                : isSolutionBuildScope
                  ? "Solution Build — TO Office"
                  : isSolutionSpecsScope
                    ? "Solution Specs — TO Office"
                    : isDocumentStudioScope
                      ? "Document Studio — TO Office"
                      : "Transformation Office Operations Dashboard"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 inline-flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">

          {/* ── Marketplace scope selector ──────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
              Marketplace Scope
            </span>
            <Button
              size="sm"
              variant={isDocumentStudioScope ? "default" : "outline"}
              className={isDocumentStudioScope ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => navigate("/stage3/document-studio/overview")}
            >
              Document Studio
            </Button>
            <Button
              size="sm"
              variant={isSolutionSpecsScope ? "default" : "outline"}
              className={isSolutionSpecsScope ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => navigate("/stage3/solution-specs/overview")}
            >
              Solution Specs
            </Button>
            <Button
              size="sm"
              variant={isSolutionBuildScope ? "default" : "outline"}
              className={isSolutionBuildScope ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => navigate("/stage3/solution-build/overview")}
            >
              Solution Build
            </Button>
            <Button
              size="sm"
              variant={!isDocumentStudioScope && !isSolutionSpecsScope && !isSolutionBuildScope && scope === "all" ? "default" : "outline"}
              className={!isDocumentStudioScope && !isSolutionSpecsScope && !isSolutionBuildScope && scope === "all" ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => { navigate("/stage3/dashboard"); setScope("all"); }}
            >
              All (General)
            </Button>
            <Button
              size="sm"
              variant={!isDocumentStudioScope && !isSolutionSpecsScope && !isSolutionBuildScope && scope === "learning-center" ? "default" : "outline"}
              className={!isDocumentStudioScope && !isSolutionSpecsScope && !isSolutionBuildScope && scope === "learning-center" ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => { navigate("/stage3/all"); setScope("learning-center"); setLcView("dashboard"); }}
            >
              Learning Centre
            </Button>
            <Button
              size="sm"
              variant={!isDocumentStudioScope && !isSolutionSpecsScope && !isSolutionBuildScope && scope === "knowledge-center" ? "default" : "outline"}
              className={!isDocumentStudioScope && !isSolutionSpecsScope && !isSolutionBuildScope && scope === "knowledge-center" ? "bg-orange-600 hover:bg-orange-700" : ""}
              onClick={() => { navigate("/stage3/all"); setScope("knowledge-center"); }}
            >
              Knowledge Center
            </Button>
          </div>

          {/* ── LC Governance views ───────────────────────────────────────── */}
          {scope === "learning-center" && (
            <div className="space-y-4">
              {lcView === "dashboard" && <LCGovOverview requests={lcRequests} role={role} />}
              {lcView === "content-browser" && <LCContentBrowser onRequestCreated={refreshLc} />}
              {lcView === "change-requests" && <LCChangeRequests requests={lcRequests} onRefresh={refreshLc} />}
              {lcView === "pending-approval" && <LCPendingApproval requests={lcRequests} role={role} onRefresh={refreshLc} />}
              {lcView === "approved-changes" && <LCApprovedChanges requests={lcRequests} role={role} onRefresh={refreshLc} />}
              {lcView === "analytics" && <LCAnalytics />}
            </div>
          )}

          {/* ── KPI cards ────────────────────────────────────────────────── */}
          {isSolutionBuildScope ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <S3KpiCard color="blue" label="Total Requests" value={String(sbRequests.length)} sub="All time" />
              <S3KpiCard color="sky" label="In Queue" value={String(sbQueue.length)} sub="Pending triage" />
              <S3KpiCard color="amber" label="Active Builds" value={String(sbActive.length + sbTesting.length)} sub="In progress or testing" />
              <S3KpiCard color="green" label="Completed" value={String(sbCompleted.length)} sub="Delivered to user" />
              <S3KpiCard color="orange" label="Revisions" value={String(sbRevisionRequests.length)} sub="Awaiting action" />
            </div>
          ) : isSolutionSpecsScope ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <S3KpiCard color="blue" label="Total Requests" value={String(ssRequests.length)} sub="All time" />
              <S3KpiCard color="sky" label="In Queue" value={String(ssQueue.length)} sub="Pending assignment" />
              <S3KpiCard color="amber" label="Active" value={String(ssActive.length)} sub="Assigned or in progress" />
              <S3KpiCard color="green" label="Completed" value={String(ssCompleted.length)} sub="Delivered to user" />
              <S3KpiCard color="orange" label="Revisions" value={String(ssRevisions.length)} sub="Awaiting action" />
            </div>
          ) : isDocumentStudioScope ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <S3KpiCard color="blue" label="Total Requests" value={String(dsRequests.length)} sub="All time" />
              <S3KpiCard color="sky" label="Pending Assignment" value={String(dsQueue.length)} sub="In queue" />
              <S3KpiCard color="amber" label="Active" value={String(dsActive.length)} sub="In progress" />
              <S3KpiCard color="orange" label="Awaiting Approval" value={String(dsAwaitingApproval.length)} sub="User review" />
              <S3KpiCard color="green" label="Published to KC" value={String(dsPublished.length)} sub="Live" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <S3KpiCard color="blue" label="Total Requests" value={String(queueKpis.total)} sub="All time" />
              <S3KpiCard color="amber" label="Active" value={String(queueKpis.active)} sub="In progress" />
              <S3KpiCard color="plain" label="SLA Compliance" value={`${queueKpis.slaCompliant}%`} sub="On track" />
              <S3KpiCard color="plain" label="Avg Resolution" value={String(queueKpis.avgResolutionDays)} sub="Days" />
              <S3KpiCard color="orange" label="Satisfaction" value={String(queueKpis.satisfaction)} sub="Out of 5" />
            </div>
          )}

          {/* ── Search / filter bar ─────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[260px] border border-gray-200 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isSolutionBuildScope
                      ? "Search builds, streams, divisions..."
                      : isSolutionSpecsScope
                        ? "Search specs, divisions, request types..."
                        : isDocumentStudioScope
                          ? "Search requests, document types, requesters..."
                          : "Search requests, requesters, or organizations..."
                  }
                  className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              {!isDocumentStudioScope && (
                <>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Stage3Request["status"] | "all")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending-review">Pending Review</option>
                    <option value="pending-user">Pending User</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Stage3Request["priority"] | "all")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="all">All Priority</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="all">All Assignees</option>
                    {assigneeOptions.map((a) => (
                      <option key={a} value={a.toLowerCase()}>{a}</option>
                    ))}
                  </select>
                </>
              )}
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />More
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {isSolutionBuildScope ? sbVisibleRequests.length : isSolutionSpecsScope ? ssVisibleRequests.length : isDocumentStudioScope ? dsVisibleRequests.length : filteredRequests.length}{" "}
                of{" "}
                {isSolutionBuildScope ? sbRequests.length : isSolutionSpecsScope ? ssRequests.length : isDocumentStudioScope ? dsRequests.length : queueKpis.total} requests
              </p>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option>25</option><option>50</option><option>100</option>
              </select>
            </div>
          </div>

          {/* ── Solution Build content ──────────────────────────────────── */}
          {isSolutionBuildScope ? (
            <>
              {/* SB Overview */}
              {activeSbView === "overview" && (
                <div className="space-y-4">
                  <div className="grid lg:grid-cols-2 gap-4">
                    <S3Panel title="Requests by Stream">
                      <div className="flex flex-wrap gap-3">
                        {(["DBP","DXP","DWS","DIA","SDO"] as const).map((stream) => {
                          const count = sbRequests.filter((r) => r.stream === stream).length;
                          const colors = SB_STREAM_COLORS[stream] ?? SB_STREAM_COLORS["DBP"];
                          return (
                            <div key={stream} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${colors.bg} ${colors.text}`}>
                              <span>{stream}</span>
                              <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs font-bold">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </S3Panel>
                    <S3Panel title="SLA At Risk">
                      <div className="space-y-2">
                        {sbRequests
                          .filter((r) => r.slaStatus === "At Risk" || r.slaStatus === "Breached")
                          .slice(0, 5)
                          .map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setSelectedSbRequestId(r.id)}
                              className="w-full flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">{r.buildTitle}</p>
                                <p className="text-xs text-gray-500">{r.stream} · {r.dewaDivision}</p>
                              </div>
                              <span className={`text-xs rounded-full px-2 py-0.5 ${r.slaStatus === "Breached" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {r.slaStatus}
                              </span>
                            </button>
                          ))}
                        {sbRequests.filter((r) => r.slaStatus === "At Risk" || r.slaStatus === "Breached").length === 0 && (
                          <p className="text-sm text-gray-500">All requests are within SLA.</p>
                        )}
                      </div>
                    </S3Panel>
                    <S3Panel title="Active Builds">
                      <div className="space-y-2">
                        {[...sbActive, ...sbTesting].slice(0, 5).map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setSelectedSbRequestId(r.id)}
                            className="w-full flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.buildTitle}</p>
                              <p className="text-xs text-gray-500">{r.stream} · {r.progress}% complete</p>
                            </div>
                            <span className={`text-xs rounded-full px-2 py-0.5 ${getSbStatusClass(r.status)}`}>{r.status}</span>
                          </button>
                        ))}
                        {sbActive.length === 0 && sbTesting.length === 0 && <p className="text-sm text-gray-500">No active builds.</p>}
                      </div>
                    </S3Panel>
                    <S3Panel title="Recent Completions">
                      <div className="space-y-2">
                        {sbCompleted.slice(0, 5).map((r) => (
                          <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.buildTitle}</p>
                              <p className="text-xs text-gray-500">{r.stream} · {r.dewaDivision}</p>
                            </div>
                            <span className="text-xs text-green-600">Delivered</span>
                          </div>
                        ))}
                        {sbCompleted.length === 0 && <p className="text-sm text-gray-500">No completed builds yet.</p>}
                      </div>
                    </S3Panel>
                  </div>
                </div>
              )}

              {/* SB Revisions view */}
              {activeSbView === "revisions" && (
                <div className="space-y-3">
                  {sbRevisionRequests.map((r) => {
                    const linked = allSbRevisionTickets.filter((rev) => rev.requestId === r.id);
                    return (
                      <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${(SB_STREAM_COLORS[r.stream] ?? SB_STREAM_COLORS["DBP"]).bg} ${(SB_STREAM_COLORS[r.stream] ?? SB_STREAM_COLORS["DBP"]).text}`}>{r.stream}</span>
                              <span className="text-xs text-gray-500">{r.dewaDivision}</span>
                            </div>
                            <p className="font-semibold text-gray-900">{r.buildTitle}</p>
                          </div>
                          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">Revision</span>
                        </div>
                        <div className="space-y-2">
                          {linked.map((rev) => (
                            <div key={rev.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                              <p className="text-sm font-medium text-red-900">{rev.id}</p>
                              <p className="text-sm text-red-800 mt-1">{rev.note}</p>
                              <p className="text-xs text-red-600 mt-1">{rev.status}</p>
                            </div>
                          ))}
                          {linked.length === 0 && <p className="text-sm text-gray-500">No revision notes attached.</p>}
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setSelectedSbRequestId(r.id)}>
                            Open Request
                          </Button>
                          <Button onClick={() => { updateBuildRequestStatus(r.id, "In Progress"); refreshSb(); }}>
                            Resume Work
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {sbRevisionRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No revision tickets are currently open.</p>
                  )}
                </div>
              )}

              {/* SB request card list — queue, active, testing, completed, on-hold */}
              {activeSbView !== "overview" && activeSbView !== "revisions" && (
                <div className="space-y-3">
                  {sbVisibleRequests.map((r) => (
                    <SbRequestCard key={r.id} request={r} onClick={() => setSelectedSbRequestId(r.id)} />
                  ))}
                  {sbVisibleRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No requests in this view.</p>
                  )}
                </div>
              )}
            </>
          ) : isSolutionSpecsScope ? (
            <>
              {/* SS Overview */}
              {activeSsView === "overview" && (
                <div className="space-y-4">
                  <div className="grid lg:grid-cols-2 gap-4">
                    <S3Panel title="Requests by Stream">
                      <div className="flex flex-wrap gap-3">
                        {(["DBP","DXP","DWS","DIA","SDO"] as const).map((stream) => {
                          const count = ssRequests.filter((r) => r.stream === stream).length;
                          return (
                            <div key={stream} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${SS_STREAM_COLORS[stream]}`}>
                              <span>{stream}</span>
                              <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs font-bold">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </S3Panel>
                    <S3Panel title="SLA At Risk">
                      <div className="space-y-2">
                        {ssRequests
                          .filter((r) => r.slaStatus === "At Risk" || r.slaStatus === "Breached")
                          .slice(0, 5)
                          .map((r) => (
                            <button
                              key={r.id}
                              onClick={() => { setSelectedSsRequestId(r.id); }}
                              className="w-full flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">{r.specTitle}</p>
                                <p className="text-xs text-gray-500">{r.assignedTo} · {r.dewaDivision}</p>
                              </div>
                              <span className={`text-xs rounded-full px-2 py-0.5 ${r.slaStatus === "Breached" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {r.slaStatus}
                              </span>
                            </button>
                          ))}
                        {ssRequests.filter((r) => r.slaStatus === "At Risk" || r.slaStatus === "Breached").length === 0 && (
                          <p className="text-sm text-gray-500">All requests are within SLA.</p>
                        )}
                      </div>
                    </S3Panel>
                    <S3Panel title="Active Requests">
                      <div className="space-y-2">
                        {ssActive.slice(0, 5).map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setSelectedSsRequestId(r.id)}
                            className="w-full flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.specTitle}</p>
                              <p className="text-xs text-gray-500">{r.stream} · {r.assignedTo}</p>
                            </div>
                            <span className={`text-xs rounded-full px-2 py-0.5 ${getSsStatusClass(r.status)}`}>{r.status}</span>
                          </button>
                        ))}
                        {ssActive.length === 0 && <p className="text-sm text-gray-500">No active requests.</p>}
                      </div>
                    </S3Panel>
                    <S3Panel title="Recent Completions">
                      <div className="space-y-2">
                        {ssCompleted.slice(0, 5).map((r) => (
                          <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.specTitle}</p>
                              <p className="text-xs text-gray-500">{r.stream} · {r.dewaDivision}</p>
                            </div>
                            {r.stage3RequestId && (
                              <span className="text-xs text-gray-400">
                                {listDeliveredSolutionSpecs().find((d) => d.requestId === r.id)?.solutionBuildStartedAt
                                  ? "→ Build started"
                                  : "Delivered"}
                              </span>
                            )}
                          </div>
                        ))}
                        {ssCompleted.length === 0 && <p className="text-sm text-gray-500">No completed requests yet.</p>}
                      </div>
                    </S3Panel>
                  </div>
                </div>
              )}

              {/* SS Revisions view */}
              {activeSsView === "revisions" && (
                <div className="space-y-3">
                  {ssRevisions.map((r) => {
                    const linked = allSsRevisionTickets.filter((rev) => rev.requestId === r.id);
                    return (
                      <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SS_STREAM_COLORS[r.stream] ?? "bg-gray-100 text-gray-700"}`}>{r.stream}</span>
                              <span className="text-xs text-gray-500">{r.dewaDivision}</span>
                            </div>
                            <p className="font-semibold text-gray-900">{r.specTitle}</p>
                            <p className="text-sm text-gray-500">{r.assignedTo}</p>
                          </div>
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">Revision</span>
                        </div>
                        <div className="space-y-2">
                          {linked.map((rev) => (
                            <div key={rev.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                              <p className="text-sm font-medium text-red-900">{rev.id}</p>
                              <p className="text-sm text-red-800 mt-1">{rev.note}</p>
                              <p className="text-xs text-red-600 mt-1">{rev.status}</p>
                            </div>
                          ))}
                          {linked.length === 0 && <p className="text-sm text-gray-500">No revision notes attached.</p>}
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setSelectedSsRequestId(r.id)}>
                            Open Request
                          </Button>
                          <Button onClick={() => handleSsResumeRevision(r.id)}>
                            Resume Work
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {ssRevisions.length === 0 && (
                    <p className="text-sm text-gray-500">No revision tickets are currently open.</p>
                  )}
                </div>
              )}

              {/* SS request card list — queue, active, completed */}
              {activeSsView !== "overview" && activeSsView !== "revisions" && (
                <div className="space-y-3">
                  {ssVisibleRequests.map((r) => (
                    <SsRequestCard key={r.id} request={r} onClick={() => setSelectedSsRequestId(r.id)} />
                  ))}
                  {ssVisibleRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No requests in this view.</p>
                  )}
                </div>
              )}
            </>
          ) : isDocumentStudioScope ? (
          /* ── Document Studio content ─────────────────────────────────── */
            <>
              {/* DS Overview */}
              {activeDsView === "overview" && (
                <div className="space-y-4">
                  <div className="grid lg:grid-cols-2 gap-4">
                    <S3Panel title="Requests Approaching SLA">
                      <div className="space-y-2">
                        {dsRequests
                          .filter((r) => {
                            const a = getDocumentStudioSla(r, "assign");
                            const c = getDocumentStudioSla(r, "complete");
                            return a.health !== "healthy" || c.health !== "healthy";
                          })
                          .slice(0, 5)
                          .map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setSelectedDsRequestId(r.id)}
                              className="w-full flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">{r.title}</p>
                                <p className="text-xs text-gray-500">{r.assignedTo ?? "Unassigned"}</p>
                              </div>
                              <div className="flex gap-2">
                                <DsSlaBadge request={r} phase="assign" compact />
                                <DsSlaBadge request={r} phase="complete" compact />
                              </div>
                            </button>
                          ))}
                        {dsRequests.filter((r) => {
                          const a = getDocumentStudioSla(r, "assign");
                          const c = getDocumentStudioSla(r, "complete");
                          return a.health !== "healthy" || c.health !== "healthy";
                        }).length === 0 && (
                          <p className="text-sm text-gray-500">All requests are within SLA.</p>
                        )}
                      </div>
                    </S3Panel>
                    <S3Panel title="Published Outputs">
                      <div className="space-y-2">
                        {dsPublished.slice(0, 5).map((r) => (
                          <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.title}</p>
                              <p className="text-xs text-gray-500">{r.generatedDocument?.format ?? "PDF"}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/marketplaces/knowledge-center/design-reports/${r.knowledgeCenterDocumentId}`)}
                            >
                              Open KC
                            </Button>
                          </div>
                        ))}
                        {dsPublished.length === 0 && (
                          <p className="text-sm text-gray-500">No published outputs yet.</p>
                        )}
                      </div>
                    </S3Panel>
                  </div>
                </div>
              )}

              {/* DS Revisions view */}
              {activeDsView === "revisions" && (
                <div className="space-y-3">
                  {dsRevisionRequests.map((r) => {
                    const linked = dsRevisions.filter((rev) => rev.requestId === r.id);
                    return (
                      <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">{r.title}</p>
                            <p className="text-sm text-gray-500">{r.id}</p>
                          </div>
                          <Badge className={getDsStatusClass(r.status)}>{r.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          {linked.map((rev) => (
                            <div key={rev.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                              <p className="text-sm font-medium text-red-900">{rev.id}</p>
                              <p className="text-sm text-red-800 mt-1">{rev.note}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setSelectedDsRequestId(r.id)}>
                            Open Revision
                          </Button>
                          <Button
                            onClick={() => {
                              updateDocumentStudioRequestStatus(r.id, "in-progress", {
                                assignedTo: r.assignedTo ?? "Michael Chen",
                              });
                              refreshDs();
                            }}
                          >
                            Resume Work
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {dsRevisionRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No revision tickets are currently open.</p>
                  )}
                </div>
              )}

              {/* DS request card list — all non-overview, non-revision views */}
              {activeDsView !== "overview" && activeDsView !== "revisions" && (
                <div className="space-y-3">
                  {dsVisibleRequests.map((r) => (
                    <DsRequestCard
                      key={r.id}
                      request={r}
                      onClick={() => setSelectedDsRequestId(r.id)}
                    />
                  ))}
                  {dsVisibleRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No requests in this view.</p>
                  )}
                </div>
              )}
            </>
          ) : (
            /* ── General (LC/KC) content ─────────────────────────────────── */
            <>
              {view === "team-capacity" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {stage3TeamMembers.map((member) => {
                    const utilization = Math.round((member.allocatedHours / member.capacityHours) * 100);
                    return (
                      <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{member.team}</p>
                        <p className="text-sm text-gray-700 mb-2">{member.allocatedHours}h / {member.capacityHours}h</p>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${utilization}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Utilization: {utilization}%</p>
                      </div>
                    );
                  })}
                </div>
              ) : view === "analytics" ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <BarChart3 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">Stage 3 analytics scaffold ready</p>
                  <p className="text-sm text-gray-500 mt-1">Trend charts and SLA analytics will be added in subsequent tasks.</p>
                </div>
              ) : (
                /* Card-based request list (upgraded from grid table) */
                <div className="space-y-3">
                  {/* Stream breakdown — shown when Solution Specs scope is active */}
                  {scope === "solution-specs" && (() => {
                    const streams = ["DBP", "DXP", "DWS", "DIA", "SDO"] as const;
                    const streamColors: Record<string, string> = {
                      DBP: "bg-blue-50 text-blue-700 border-blue-200",
                      DXP: "bg-purple-50 text-purple-700 border-purple-200",
                      DWS: "bg-teal-50 text-teal-700 border-teal-200",
                      DIA: "bg-amber-50 text-amber-700 border-amber-200",
                      SDO: "bg-red-50 text-red-700 border-red-200",
                    };
                    const streamCounts = streams.map((s) => ({
                      stream: s,
                      count: scopedRequests.filter((r) => r.tags?.includes(s.toLowerCase())).length,
                    }));
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Requests by Stream</p>
                        <div className="flex flex-wrap gap-3">
                          {streamCounts.map(({ stream, count }) => (
                            <div
                              key={stream}
                              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${streamColors[stream]}`}
                            >
                              <span>{stream}</span>
                              <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs font-bold">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  {filteredRequests.map((r) => (
                    <GenericRequestCard
                      key={r.id}
                      request={r}
                      onClick={() => setSelectedRequestId(r.id)}
                    />
                  ))}
                  {filteredRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No requests match the current filters.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Solution Build detail overlay ────────────────────────────────── */}
      {selectedSbRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSelectedSbRequestId(null)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[860px] bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${(SB_STREAM_COLORS[selectedSbRequest.stream] ?? SB_STREAM_COLORS["DBP"]).bg} ${(SB_STREAM_COLORS[selectedSbRequest.stream] ?? SB_STREAM_COLORS["DBP"]).text}`}>
                    {selectedSbRequest.stream}
                  </span>
                  <span className="text-xs text-gray-500">{selectedSbRequest.dewaDivision}</span>
                </div>
                <h2 className="font-semibold text-lg text-gray-900">{selectedSbRequest.buildTitle}</h2>
                <p className="text-sm text-gray-500">{selectedSbRequest.id} · {selectedSbRequest.programme || "No programme specified"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getSbStatusClass(selectedSbRequest.status)}>{selectedSbRequest.status}</Badge>
                <button onClick={() => setSelectedSbRequestId(null)} className="text-gray-500 hover:text-gray-700 ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Info grid */}
              <div className="grid md:grid-cols-2 gap-3">
                <S3Panel title="Request Details">
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-500">Priority:</span> <span className="text-gray-900">{selectedSbRequest.priority}</span></div>
                    <div><span className="text-gray-500">Timeline:</span> <span className="text-gray-900">{selectedSbRequest.timelinePreference}</span></div>
                    <div><span className="text-gray-500">Submitted:</span> <span className="text-gray-900">{new Date(selectedSbRequest.submittedAt).toLocaleDateString()}</span></div>
                    <div><span className="text-gray-500">SLA:</span> <span className={`font-medium ${selectedSbRequest.slaStatus === "Breached" ? "text-red-600" : selectedSbRequest.slaStatus === "At Risk" ? "text-amber-600" : "text-green-600"}`}>{selectedSbRequest.slaStatus}</span></div>
                  </div>
                </S3Panel>
                <S3Panel title="Progress">
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Build Progress</span>
                      <span className="font-semibold text-gray-900">{selectedSbRequest.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${selectedSbRequest.status === "Complete" ? "bg-green-500" : "bg-orange-500"}`}
                        style={{ width: `${selectedSbRequest.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {selectedSbRequest.milestones.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.completed ? "bg-green-500" : "bg-gray-200"}`} />
                        <span className={m.completed ? "text-gray-500 line-through" : "text-gray-700"}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </S3Panel>
              </div>

              {/* Submitted context */}
              {(selectedSbRequest.businessNeed || selectedSbRequest.keyRequirements) && (
                <S3Panel title="Submitted Context">
                  <div className="space-y-2 text-sm">
                    {selectedSbRequest.businessNeed && (
                      <div><span className="text-gray-500">Business Need:</span> <span className="text-gray-900">{selectedSbRequest.businessNeed}</span></div>
                    )}
                    {selectedSbRequest.keyRequirements && (
                      <div><span className="text-gray-500">Key Requirements:</span> <span className="text-gray-900">{selectedSbRequest.keyRequirements}</span></div>
                    )}
                    {selectedSbRequest.customisationSelections.length > 0 && (
                      <div>
                        <span className="text-gray-500">Customisations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedSbRequest.customisationSelections.map((sel) => (
                            <span key={sel} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100">{sel}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </S3Panel>
              )}

              {/* Assignment panel */}
              <S3Panel title="Assignment">
                <p className="text-sm text-gray-600 mb-3">
                  {selectedSbRequest.assignedTeam
                    ? `Currently assigned to: ${selectedSbRequest.assignedTeam}`
                    : "Not yet assigned to a team."}
                </p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assign to Team</label>
                    <select
                      value={sbAssignTeam}
                      onChange={(e) => setSbAssignTeam(e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select team</option>
                      {stage3TeamMembers.map((m) => (
                        <option key={m.id} value={m.team}>{m.name} — {m.team}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    disabled={!sbAssignTeam}
                    onClick={() => {
                      assignBuildRequest(selectedSbRequest.id, sbAssignTeam);
                      refreshSb();
                    }}
                  >
                    Assign Request
                  </Button>
                </div>
              </S3Panel>

              {/* Status workflow panel */}
              {selectedSbRequest.status !== "Complete" && (
                <S3Panel title="Workflow Actions">
                  <div className="flex flex-wrap gap-2">
                    {selectedSbRequest.status === "Submitted" && (
                      <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "Triage"); refreshSb(); }}>
                        Move to Triage
                      </Button>
                    )}
                    {selectedSbRequest.status === "Triage" && (
                      <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "Queue"); refreshSb(); }}>
                        Add to Queue
                      </Button>
                    )}
                    {selectedSbRequest.status === "Queue" && (
                      <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "In Progress"); refreshSb(); }}>
                        Start Build
                      </Button>
                    )}
                    {selectedSbRequest.status === "In Progress" && (
                      <>
                        <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "Testing"); refreshSb(); }}>
                          Move to Testing
                        </Button>
                        <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "On Hold"); refreshSb(); }}>
                          Put On Hold
                        </Button>
                      </>
                    )}
                    {selectedSbRequest.status === "Testing" && (
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => { completeBuildRequest(selectedSbRequest.id); refreshSb(); }}>
                        Mark Complete &amp; Deliver
                      </Button>
                    )}
                    {selectedSbRequest.status === "On Hold" && (
                      <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "In Progress"); refreshSb(); }}>
                        Resume Build
                      </Button>
                    )}
                    {selectedSbRequest.status === "Revision" && (
                      <Button variant="outline" onClick={() => { updateBuildRequestStatus(selectedSbRequest.id, "In Progress"); refreshSb(); }}>
                        Resume Work
                      </Button>
                    )}
                  </div>
                </S3Panel>
              )}

              {/* Revision notes */}
              {allSbRevisionTickets.filter((rev) => rev.requestId === selectedSbRequest.id).length > 0 && (
                <S3Panel title="Revision Notes">
                  <div className="space-y-2">
                    {allSbRevisionTickets
                      .filter((rev) => rev.requestId === selectedSbRequest.id)
                      .map((rev) => (
                        <div key={rev.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                          <p className="text-sm font-medium text-red-900">{rev.id}</p>
                          <p className="text-sm text-red-800 mt-1">{rev.note}</p>
                          <p className="text-xs text-red-600 mt-1">{rev.status}</p>
                        </div>
                      ))}
                  </div>
                </S3Panel>
              )}

              {/* From Spec reference */}
              {selectedSbRequest.fromSpecId && selectedSbBuild && (
                <S3Panel title="Based on Solution Spec">
                  <p className="font-medium text-gray-900">{selectedSbBuild.fromSpecTitle}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => navigate(`/marketplaces/solution-specs/${selectedSbRequest.fromSpecId}`)}
                  >
                    Open Stage 1 Spec
                  </Button>
                </S3Panel>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ── Solution Specs detail overlay ───────────────────────────────── */}
      {selectedSsRequest && selectedSsSpec && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSelectedSsRequestId(null)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[860px] bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SS_STREAM_COLORS[selectedSsRequest.stream] ?? "bg-gray-100 text-gray-700"}`}>
                    {selectedSsRequest.stream}
                  </span>
                  <span className="text-xs text-gray-500">{selectedSsRequest.requestType}</span>
                </div>
                <h2 className="font-semibold text-lg text-gray-900">{selectedSsRequest.specTitle}</h2>
                <p className="text-sm text-gray-500">{selectedSsRequest.dewaDivision} · {selectedSsRequest.programme || "No programme specified"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getSsStatusClass(selectedSsRequest.status)}>{selectedSsRequest.status}</Badge>
                <button onClick={() => setSelectedSsRequestId(null)} className="text-gray-500 hover:text-gray-700 ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Info grid */}
              <div className="grid md:grid-cols-2 gap-3">
                <S3Panel title="Spec Reference">
                  <p className="font-medium text-gray-900">{selectedSsSpec.title}</p>
                  <p className="text-sm text-gray-500">{selectedSsSpec.solutionType} · {selectedSsSpec.maturityLevel} · {selectedSsSpec.diagramCount} diagrams · {selectedSsSpec.componentCount} components</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate(`/marketplaces/solution-specs/${selectedSsSpec.id}`)}>
                    Open Stage 1 Spec
                  </Button>
                </S3Panel>
                <S3Panel title="Request Details">
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-500">Division:</span> <span className="text-gray-900">{selectedSsRequest.dewaDivision}</span></div>
                    <div><span className="text-gray-500">Timeline:</span> <span className="text-gray-900">{selectedSsRequest.timelinePriority}</span></div>
                    <div><span className="text-gray-500">Submitted:</span> <span className="text-gray-900">{new Date(selectedSsRequest.submittedAt).toLocaleDateString()}</span></div>
                    <div><span className="text-gray-500">SLA:</span> <span className={`font-medium ${selectedSsRequest.slaStatus === "Breached" ? "text-red-600" : selectedSsRequest.slaStatus === "At Risk" ? "text-amber-600" : "text-green-600"}`}>{selectedSsRequest.slaStatus}</span></div>
                  </div>
                </S3Panel>
              </div>

              {/* Submitted context */}
              <S3Panel title="Submitted Context">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="md:col-span-2"><span className="text-gray-500">Business Need:</span> <span className="text-gray-900">{selectedSsRequest.businessNeed}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500">Current State:</span> <span className="text-gray-900">{selectedSsRequest.currentState}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500">Key Requirements:</span> <span className="text-gray-900">{selectedSsRequest.keyRequirements}</span></div>
                  {selectedSsRequest.architectureConstraints && (
                    <div className="md:col-span-2"><span className="text-gray-500">Architecture Constraints:</span> <span className="text-gray-900">{selectedSsRequest.architectureConstraints}</span></div>
                  )}
                  <div><span className="text-gray-500">Preferred Output:</span> <span className="text-gray-900">{selectedSsRequest.preferredOutputs.join(", ")}</span></div>
                  {selectedSsRequest.additionalNotes && (
                    <div className="md:col-span-2"><span className="text-gray-500">Additional Notes:</span> <span className="text-gray-900">{selectedSsRequest.additionalNotes}</span></div>
                  )}
                </div>
              </S3Panel>

              {/* Status-specific workflow panels */}

              {/* SUBMITTED → Assignment */}
              {selectedSsRequest.status === "Submitted" && (
                <S3Panel title="Assignment">
                  <p className="text-sm text-gray-600 mb-4">Assign this request to a TO team member. The recommended assignee has the most available capacity.</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assign to</label>
                      <select
                        value={ssAssignMemberId}
                        onChange={(e) => setSsAssignMemberId(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select team member</option>
                        {[...stage3TeamMembers]
                          .sort((a, b) => (b.capacityHours - b.allocatedHours) - (a.capacityHours - a.allocatedHours))
                          .map((m, idx) => {
                            const pct = Math.round((m.allocatedHours / m.capacityHours) * 100);
                            const avail = m.capacityHours - m.allocatedHours;
                            return (
                              <option key={m.id} value={m.id}>
                                {idx === 0 ? "★ " : ""}{m.name} — {m.team} ({pct}% utilized · {avail}h free)
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <Button disabled={!ssAssignMemberId} onClick={handleSsAssign}>
                      Assign Request
                    </Button>
                  </div>
                </S3Panel>
              )}

              {/* ASSIGNED → Start Work + Generation Panel */}
              {selectedSsRequest.status === "Assigned" && (
                <>
                  <S3Panel title="Assigned To">
                    <p className="font-medium text-gray-900">{selectedSsRequest.assignedTo}</p>
                    <p className="text-sm text-gray-500">Ready to begin work on this specification.</p>
                    <Button variant="outline" className="mt-3" onClick={handleSsStartWork}>
                      Start Work
                    </Button>
                  </S3Panel>
                  <S3Panel title="Reference Documents">
                    <div className="space-y-2">
                      {selectedSsSpec.documents.map((doc) => (
                        <div key={doc.id} className="rounded-md border border-gray-200 p-3">
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.summary}</p>
                        </div>
                      ))}
                    </div>
                  </S3Panel>
                </>
              )}

              {/* IN PROGRESS → Generation Panel */}
              {selectedSsRequest.status === "In Progress" && (
                <S3Panel title="Generation Panel">
                  <p className="text-sm text-gray-600 mb-3">
                    Build the contextualised spec using AI DocWriter. Generating will deliver the spec documents to the user and notify them via the platform.
                  </p>
                  <div className="mb-4 space-y-2">
                    {selectedSsSpec.documents.map((doc) => (
                      <div key={doc.id} className="rounded-md border border-gray-200 p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSsBuildAndDeliver}>
                    Build Spec with AI DocWriter &amp; Deliver
                  </Button>
                </S3Panel>
              )}

              {/* DELIVERED / COMPLETED → Delivery Panel */}
              {(selectedSsRequest.status === "Delivered" || selectedSsRequest.status === "Completed") && (
                <S3Panel title="Delivery Record">
                  <p className="text-sm font-medium text-gray-900 mb-3">Deliverables sent to user</p>
                  <div className="space-y-2 mb-3">
                    {selectedSsSpec.documents.map((doc) => (
                      <div key={doc.id} className="text-sm text-gray-700">• {doc.title}</div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                    <span className="font-medium">Solution Build handoff: </span>
                    {selectedSsDelivered?.solutionBuildStartedAt
                      ? <span className="text-green-700">User directed to Solution Build on {new Date(selectedSsDelivered.solutionBuildStartedAt).toLocaleDateString()}</span>
                      : <span className="text-gray-500">Not started yet</span>}
                  </div>
                </S3Panel>
              )}

              {/* REVISION → Revision notes + Resume */}
              {selectedSsRequest.status === "Revision" && (
                <S3Panel title="Revision Requested">
                  <div className="space-y-2 mb-3">
                    {allSsRevisionTickets
                      .filter((rev) => rev.requestId === selectedSsRequest.id)
                      .map((rev) => (
                        <div key={rev.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                          <p className="text-sm font-medium text-red-900">{rev.id}</p>
                          <p className="text-sm text-red-800 mt-1">{rev.note}</p>
                          <p className="text-xs text-red-600 mt-1">{rev.status}</p>
                        </div>
                      ))}
                  </div>
                  <Button onClick={() => handleSsResumeRevision(selectedSsRequest.id)}>
                    Move Back to In Progress
                  </Button>
                </S3Panel>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ── Generic detail overlay ──────────────────────────────────────── */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSelectedRequestId(null)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[860px] bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900">Request Detail</h2>
              <button onClick={() => setSelectedRequestId(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusBadgeClass(selectedRequest.status)}>{selectedRequest.status}</Badge>
                <Badge className={getPriorityBadgeClass(selectedRequest.priority)}>{selectedRequest.priority}</Badge>
                <Badge variant="secondary">{selectedRequest.type}</Badge>
              </div>
              <p className="font-semibold text-gray-900 text-base">{selectedRequest.title}</p>
              <p className="text-gray-700">{selectedRequest.description}</p>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-1">Requester</p>
                <p className="font-medium text-gray-900">{selectedRequest.requester.name}</p>
                <p className="text-gray-600">{selectedRequest.requester.email}</p>
              </div>

              {selectedSolutionSpecRequest && selectedSolutionSpec && (
                <>
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2">Solution Spec Reference</p>
                    <div className="rounded-lg border border-gray-200 p-3 space-y-1">
                      <p className="font-medium text-gray-900">{selectedSolutionSpec.title}</p>
                      <p className="text-xs text-gray-600">
                        {selectedSolutionSpec.solutionType} · {selectedSolutionSpec.maturityLevel} ·{" "}
                        {selectedSolutionSpec.diagramCount} diagrams · {selectedSolutionSpec.componentCount} components
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => navigate(`/marketplaces/solution-specs/${selectedSolutionSpec.id}`)}
                      >
                        Open Stage 1 Spec
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2">Submitted Context</p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Request Type:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.requestType}</span></div>
                      <div><span className="text-gray-500">Division:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.dewaDivision}</span></div>
                      <div><span className="text-gray-500">Programme:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.programme || "Not provided"}</span></div>
                      <div><span className="text-gray-500">Timeline:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.timelinePriority}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Business Need:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.businessNeed}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Current State:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.currentState}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Key Requirements:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.keyRequirements}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Architecture Constraints:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.architectureConstraints || "None provided"}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Preferred Output:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.preferredOutputs.join(", ")}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">Additional Notes:</span> <span className="text-gray-900">{selectedSolutionSpecRequest.additionalNotes || "None provided"}</span></div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2">Generation Panel</p>
                    <div className="rounded-lg border border-gray-200 p-3 space-y-3">
                      <p className="text-sm text-gray-700">
                        Build Spec with AI DocWriter is mocked here by using the DEWA reference documents attached to the selected Solution Spec.
                      </p>
                      <div className="space-y-2">
                        {selectedSolutionSpec.documents.map((document) => (
                          <div key={document.id} className="rounded-md border border-gray-200 p-3">
                            <p className="text-sm font-medium text-gray-900">{document.title}</p>
                            <p className="text-xs text-gray-500">{document.summary}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.status === "assigned" && (
                          <Button size="sm" variant="outline" onClick={handleSolutionSpecStartWork}>
                            Start Work
                          </Button>
                        )}
                        {(selectedRequest.status === "assigned" || selectedRequest.status === "in-progress" || selectedRequest.status === "pending-review") && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={handleSolutionSpecGenerateAndDeliver}>
                            Build Spec with AI DocWriter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {(selectedRequest.status === "completed" || selectedDeliveredSpec) && (
                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500 mb-2">Delivery Panel</p>
                      <div className="rounded-lg border border-gray-200 p-3 space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Deliverables attached to user request
                        </p>
                        {selectedSolutionSpec.documents.map((document) => (
                          <div key={document.id} className="text-sm text-gray-700">
                            • {document.title}
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 pt-1">
                          Status on delivery follows the Solution Specs model: Delivered → Completed.
                        </p>
                        <div className="text-xs text-gray-500">
                          Solution Build handoff:{" "}
                          {selectedDeliveredSpec?.solutionBuildStartedAt
                            ? `User directed to Solution Build on ${new Date(selectedDeliveredSpec.solutionBuildStartedAt).toLocaleDateString()}`
                            : "Not started yet"}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedLearningChangeSet && (
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-2">Proposed Learning Changes</p>
                  <p className="text-sm font-medium text-gray-900 mb-1">{selectedLearningChangeSet.courseName}</p>
                  <p className="text-xs text-gray-600 mb-2">Draft status: {selectedLearningChangeSet.status}</p>
                  {selectedLearningChangeSet.deleteRequested && (
                    <Badge className="bg-red-100 text-red-700 mb-2">Delete Course Requested</Badge>
                  )}
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {selectedLearningChangeSet.diffs.map((diff) => (
                      <div key={`${diff.field}-${diff.before}-${diff.after}`} className="border border-gray-200 rounded-md p-2">
                        <p className="text-xs font-semibold text-gray-900">{diff.label}</p>
                        <p className="text-xs text-gray-600">Before: {diff.before}</p>
                        <p className="text-xs text-gray-900">After: {diff.after}</p>
                      </div>
                    ))}
                    {selectedLearningChangeSet.diffs.length === 0 && !selectedLearningChangeSet.deleteRequested && (
                      <p className="text-xs text-gray-500">No field-level diffs captured.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-1">Assignment</p>
                <p className="font-medium text-gray-900">{selectedRequest.assignedTo ?? "Unassigned"}</p>
                <p className="text-gray-600 text-xs">{selectedRequest.assignedTeam ?? "No team assigned"}</p>
                <div className="mt-3 space-y-1">
                  <label className="text-xs text-gray-500">Assign To</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
                  >
                    <option value="">Select team member</option>
                    {stage3TeamMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} — {m.team}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Status Transition</p>
                <select
                  value={selectedNextStatus}
                  onChange={(e) => setSelectedNextStatus(e.target.value as Stage3Request["status"] | "")}
                  className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
                  disabled={availableNextStatuses.length === 0}
                >
                  {availableNextStatuses.length === 0
                    ? <option value="">No valid transitions</option>
                    : availableNextStatuses.map((s) => <option key={s} value={s}>{s}</option>)
                  }
                </select>
                {availableNextStatuses.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Terminal state — no further transitions.</p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-1">SLA &amp; Aging</p>
                <div className="space-y-1">
                  <Badge className={getSlaBadgeClass(selectedRequest.slaStatus)}>{selectedRequest.slaStatus}</Badge>
                  <p className="text-gray-700">Open: {getDaysOpen(selectedRequest.createdAt)} days</p>
                  <p className="text-gray-700">Due: {getDueSummary(selectedRequest.dueDate)}</p>
                  <p className="text-gray-500 text-xs">
                    Created {new Date(selectedRequest.createdAt).toLocaleDateString()} · Due {new Date(selectedRequest.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Activity Timeline</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRequest.activityLog.length === 0
                    ? <p className="text-xs text-gray-500">No activity recorded yet.</p>
                    : selectedRequest.activityLog.map((entry) => (
                        <div key={entry.id} className="border border-gray-200 rounded-md p-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-gray-900">{entry.action}</p>
                            <p className="text-[11px] text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                          </div>
                          <p className="text-[11px] text-gray-600">{entry.actor}</p>
                          <p className="text-sm text-gray-700">{entry.detail}</p>
                        </div>
                      ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <ul className="list-disc ml-5 text-gray-700 mb-3">
                  {selectedRequest.notes.map((note, idx) => (
                    <li key={`${selectedRequest.id}-note-${idx}`}>{note}</li>
                  ))}
                </ul>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add an operational note..."
                  className="w-full min-h-20 border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={handleStatusTransition} disabled={!selectedNextStatus}>Update Status</Button>
                <Button size="sm" variant="outline" onClick={handleAssign} disabled={!selectedMemberId}>Assign</Button>
                <Button size="sm" variant="outline" onClick={handleUnassign} disabled={!selectedRequest.assignedTo}>Unassign</Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={handleAddNote} disabled={!noteDraft.trim()}>Add Note</Button>
                {selectedLearningChangeSet && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => advanceLearningChangeReview(selectedRequest, "approved")}>Approve Changes</Button>
                    <Button size="sm" variant="destructive" onClick={() => advanceLearningChangeReview(selectedRequest, "rejected")}>Reject Changes</Button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Document Studio detail overlay ──────────────────────────────── */}
      {selectedDsRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSelectedDsRequestId(null)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[860px] bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-semibold text-lg text-gray-900">{selectedDsRequest.title}</h2>
                <p className="text-sm text-gray-500">{selectedDsRequest.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getDsStatusClass(selectedDsRequest.status)}>{selectedDsRequest.status}</Badge>
                <button onClick={() => setSelectedDsRequestId(null)} className="text-gray-500 hover:text-gray-700 ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Info grid */}
              <div className="grid md:grid-cols-2 gap-3">
                <S3Panel title="Requester">
                  <p className="font-medium text-gray-900">{selectedDsRequest.requester.name}</p>
                  <p className="text-sm text-gray-500">{selectedDsRequest.requester.email}</p>
                </S3Panel>
                <S3Panel title="Context Summary">
                  <p className="text-sm text-gray-700">
                    {selectedDsRequest.formData.organisationContext ??
                      selectedDsRequest.formData.additionalNotes ??
                      selectedDsRequest.formData.focusArea ??
                      selectedDsRequest.formData.applicationName ??
                      "—"}
                  </p>
                </S3Panel>
                <S3Panel title="Document Type">
                  <p className="font-medium text-gray-900">{selectedDsRequest.documentTypeName}</p>
                  <p className="text-sm text-gray-500">{documentStudioTabMeta[selectedDsRequest.tab].label}</p>
                </S3Panel>
                <S3Panel title="Assignment">
                  <p className="font-medium text-gray-900">{selectedDsRequest.assignedTo ?? "Unassigned"}</p>
                </S3Panel>
                <S3Panel title="SLA 1 — Time to Assign">
                  <DsSlaBadge request={selectedDsRequest} phase="assign" />
                </S3Panel>
                <S3Panel title="SLA 2 — Time to Complete">
                  <DsSlaBadge request={selectedDsRequest} phase="complete" />
                </S3Panel>
              </div>

              {/* Submitted context */}
              <S3Panel title="Submitted Context">
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(selectedDsRequest.formData)
                    .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
                    .slice(0, 10)
                    .map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-500">{toDsLabel(key)}:</span>{" "}
                        <span className="text-gray-900">
                          {Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </S3Panel>

              {/* Status-specific workflow panels */}
              {selectedDsRequest.status === "submitted" && (
                <S3Panel title="Assignment">
                  <p className="text-sm text-gray-600 mb-4">
                    Assign this request to a TO team member. The recommended assignee has the most available capacity.
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Assign to
                      </label>
                      <select
                        value={dsAssignMemberId}
                        onChange={(e) => setDsAssignMemberId(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...stage3TeamMembers]
                          .sort(
                            (a, b) =>
                              (b.capacityHours - b.allocatedHours) -
                              (a.capacityHours - a.allocatedHours)
                          )
                          .map((m, idx) => {
                            const pct = Math.round((m.allocatedHours / m.capacityHours) * 100);
                            const avail = m.capacityHours - m.allocatedHours;
                            return (
                              <option key={m.id} value={m.id}>
                                {idx === 0 ? "★ " : ""}{m.name} — {m.team} ({pct}% utilized · {avail}h free)
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <Button
                      disabled={!dsAssignMemberId}
                      onClick={() => {
                        const member = stage3TeamMembers.find((m) => m.id === dsAssignMemberId);
                        if (!member) return;
                        updateDocumentStudioRequestStatus(selectedDsRequest.id, "assigned", {
                          assignedTo: member.name,
                        });
                        refreshDs();
                      }}
                    >
                      Assign Request
                    </Button>
                  </div>
                </S3Panel>
              )}

              {(selectedDsRequest.status === "assigned" || selectedDsRequest.status === "in-progress") && (
                <>
                  <S3Panel title="Generation Panel">
                    <p className="text-sm text-gray-600 mb-3">
                      Prototype AI DocWriter flow. Generate a mock document preview and move the request forward.
                    </p>
                    <div className="flex gap-3">
                      {selectedDsRequest.status === "assigned" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            updateDocumentStudioRequestStatus(selectedDsRequest.id, "in-progress", {
                              assignedTo: selectedDsRequest.assignedTo ?? "",
                            });
                            refreshDs();
                          }}
                        >
                          Start Work
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          const updated = ensureRequestHasGeneratedDocument(
                            selectedDsRequest.id,
                            selectedDsRequest.assignedTo ?? ""
                          );
                          // Open platform dashboard in new tab to simulate user notification
                          window.open("https://lovable.dev/dashboard", "_blank");
                          refreshDs();
                        }}
                      >
                        Generate and Deliver
                      </Button>
                    </div>
                  </S3Panel>
                  {selectedDsRequest.generatedDocument && (
                    <S3Panel title="Delivery Panel">
                      <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedDsRequest.generatedDocument.fileName}</p>
                          <p className="text-xs text-gray-500">v{selectedDsRequest.generatedDocument.version} · {selectedDsRequest.generatedDocument.format}</p>
                        </div>
                        <Button variant="outline" onClick={() => window.open(selectedDsRequest.generatedDocument?.fileUrl ?? "#", "_blank")}>
                          Preview
                        </Button>
                      </div>
                    </S3Panel>
                  )}
                </>
              )}

              {selectedDsRequest.status === "approved" && (
                <>
                  <S3Panel title="Approval Status">
                    <p className="text-sm text-green-700">User has approved this document. Publish to Knowledge Centre is now available.</p>
                  </S3Panel>
                  <S3Panel title="Publish to Knowledge Centre">
                    <div className="rounded-lg border border-orange-100 bg-orange-50 p-4 mb-4">
                      <p className="text-sm font-semibold text-orange-900 mb-2">Knowledge Centre Card Preview</p>
                      <div className="space-y-1 text-sm text-orange-900">
                        <p>
                          {selectedDsRequest.documentTypeName} — DEWA{" "}
                          {selectedDsRequest.formData.divisionBusinessUnit ?? "Transmission"} —{" "}
                          {selectedDsRequest.formData.dbpStreams?.[0] ?? "DWS"}
                        </p>
                        <p className="text-orange-800">{selectedDsRequest.generatedDocument?.format ?? "PDF"} · {visibility}</p>
                        <p className="text-orange-700">
                          {publicationNote.trim() ||
                            selectedDsRequest.formData.programmeInitiativeName ||
                            selectedDsRequest.formData.organisationContext ||
                            selectedDsRequest.title}
                        </p>
                        {selectedDsRequest.generatedDocument?.fileUrl && (
                          <a
                            href={selectedDsRequest.generatedDocument.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-orange-600 underline break-all pt-1"
                          >
                            {selectedDsRequest.generatedDocument.fileUrl}
                          </a>
                        )}
                      </div>
                    </div>
                    <Textarea
                      value={publicationNote}
                      onChange={(e) => setPublicationNote(e.target.value)}
                      placeholder="Add a note about this document for Knowledge Centre viewers."
                    />
                    <div className="mt-3 flex flex-wrap gap-3">
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as "Enterprise-wide" | "Division-scoped")}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="Enterprise-wide">Enterprise-wide</option>
                        <option value="Division-scoped">Division-scoped</option>
                      </select>
                      <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => {
                          publishDesignReportToKnowledgeCenter(selectedDsRequest.id, publicationNote, visibility);
                          refreshDs();
                        }}
                      >
                        Publish to Knowledge Centre
                      </Button>
                    </div>
                  </S3Panel>
                </>
              )}

              {selectedDsRequest.status === "awaiting-approval" && (
                <S3Panel title="Approval Status">
                  <p className="text-sm text-amber-700 mb-3">
                    Awaiting user review. The request remains in the user approval state until the requester approves or raises a revision.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { approveDesignReportRequest(selectedDsRequest.id); refreshDs(); }}
                  >
                    Demo Approve on Behalf of User
                  </Button>
                </S3Panel>
              )}

              {selectedDsRequest.status === "revision-requested" && (
                <S3Panel title="Revision Requested">
                  <div className="space-y-2 mb-3">
                    {dsRevisions
                      .filter((rev) => rev.requestId === selectedDsRequest.id)
                      .map((rev) => (
                        <div key={rev.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                          <p className="text-sm font-medium text-red-900">{rev.id}</p>
                          <p className="text-sm text-red-800 mt-1">{rev.note}</p>
                        </div>
                      ))}
                  </div>
                  <Button
                    onClick={() => {
                      updateDocumentStudioRequestStatus(selectedDsRequest.id, "in-progress", {
                        assignedTo: selectedDsRequest.assignedTo ?? "",
                      });
                      refreshDs();
                    }}
                  >
                    Move Back to In Progress
                  </Button>
                </S3Panel>
              )}

              {selectedDsRequest.status === "published-to-kc" && selectedDsRequest.knowledgeCenterDocumentId && (
                <S3Panel title="Published Record">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/marketplaces/knowledge-center/design-reports/${selectedDsRequest.knowledgeCenterDocumentId}`)}
                    >
                      Open Knowledge Centre Card
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedDsRequest.generatedDocument?.fileUrl ?? "#", "_blank")}
                    >
                      Open Delivered Document
                    </Button>
                  </div>
                </S3Panel>
              )}

              {selectedDsRequest.status === "completed" && selectedDsRequest.generatedDocument && (
                <S3Panel title="Completed Delivery">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedDsRequest.generatedDocument.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Delivered {selectedDsRequest.completedDate ?? selectedDsRequest.generatedDocument.generatedDate}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => window.open(selectedDsRequest.generatedDocument?.fileUrl ?? "#", "_blank")}>
                      Open File
                    </Button>
                  </div>
                </S3Panel>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function S3KpiCard({
  color,
  label,
  value,
  sub,
}: {
  color: "blue" | "amber" | "orange" | "green" | "sky" | "plain";
  label: string;
  value: string;
  sub: string;
}) {
  const bg =
    color === "blue" ? "bg-blue-50 border-blue-100"
    : color === "amber" ? "bg-amber-50 border-amber-100"
    : color === "orange" ? "bg-orange-50 border-orange-100"
    : color === "green" ? "bg-green-50 border-green-100"
    : color === "sky" ? "bg-sky-50 border-sky-100"
    : "bg-white border-gray-200";
  const text =
    color === "blue" ? "text-blue-800"
    : color === "amber" ? "text-amber-800"
    : color === "orange" ? "text-orange-800"
    : color === "green" ? "text-green-800"
    : color === "sky" ? "text-sky-800"
    : "text-gray-700";
  const val =
    color === "blue" ? "text-blue-900"
    : color === "amber" ? "text-amber-900"
    : color === "orange" ? "text-orange-900"
    : color === "green" ? "text-green-900"
    : color === "sky" ? "text-sky-900"
    : "text-gray-900";
  const subText =
    color === "plain" ? "text-gray-500"
    : color === "blue" ? "text-blue-700"
    : color === "amber" ? "text-amber-700"
    : color === "orange" ? "text-orange-700"
    : color === "green" ? "text-green-700"
    : "text-sky-700";
  return (
    <div className={`border rounded-xl p-4 ${bg}`}>
      <p className={`text-sm font-semibold ${text}`}>{label}</p>
      <p className={`text-4xl font-semibold mt-2 ${val}`}>{value}</p>
      <p className={`text-sm ${subText}`}>{sub}</p>
    </div>
  );
}

function S3Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      {children}
    </div>
  );
}

function DsRequestCard({
  request,
  onClick,
}: {
  request: DocumentStudioRequest;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 text-left hover:bg-orange-50/30 transition-colors"
    >
      <div>
        <p className="font-semibold text-gray-900">{request.title}</p>
        <p className="text-sm text-gray-500">
          {request.documentTypeName} · {request.requester.name} ·{" "}
          {new Date(request.submittedDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <div className="text-xs text-gray-500">Assign SLA</div>
          <DsSlaBadge request={request} phase="assign" compact />
        </div>
        <Badge className={getDsStatusClass(request.status)}>{request.status}</Badge>
      </div>
    </button>
  );
}

function GenericRequestCard({
  request,
  onClick,
}: {
  request: Stage3Request;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 text-left hover:bg-orange-50/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">{request.title}</p>
        <p className="text-sm text-gray-500">
          {request.requestNumber} · {requestTypeLabel[request.type]} · {request.requester.name}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge className={getPriorityBadgeClass(request.priority)}>{request.priority}</Badge>
        <Badge className={getStatusBadgeClass(request.status)}>{request.status}</Badge>
        <Badge className={getSlaBadgeClass(request.slaStatus)}>{request.slaStatus}</Badge>
        <p className="text-xs text-gray-500 hidden md:block">{getDueSummary(request.dueDate)}</p>
      </div>
    </button>
  );
}

function SsRequestCard({
  request,
  onClick,
}: {
  request: SolutionSpecRequest;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 text-left hover:bg-orange-50/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SS_STREAM_COLORS[request.stream] ?? "bg-gray-100 text-gray-700"}`}>
            {request.stream}
          </span>
          <span className="text-xs text-gray-500">{request.requestType}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">{request.dewaDivision}</span>
        </div>
        <p className="font-semibold text-gray-900 truncate">{request.specTitle}</p>
        <p className="text-sm text-gray-500">{request.assignedTo} · {new Date(request.submittedAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${request.slaStatus === "Breached" ? "bg-red-100 text-red-700" : request.slaStatus === "At Risk" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
          {request.slaStatus}
        </span>
        <Badge className={getSsStatusClass(request.status)}>{request.status}</Badge>
      </div>
    </button>
  );
}

function SbRequestCard({
  request,
  onClick,
}: {
  request: BuildRequest;
  onClick: () => void;
}) {
  const colors = SB_STREAM_COLORS[request.stream] ?? SB_STREAM_COLORS["DBP"];
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4 text-left hover:bg-orange-50/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {request.stream}
          </span>
          <span className="text-xs text-gray-500">{request.dewaDivision}</span>
        </div>
        <p className="font-semibold text-gray-900 truncate">{request.buildTitle}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${request.progress}%` }} />
          </div>
          <span className="text-xs text-gray-500">{request.progress}%</span>
          <span className="text-xs text-gray-400">· {new Date(request.submittedAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${request.slaStatus === "Breached" ? "bg-red-100 text-red-700" : request.slaStatus === "At Risk" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
          {request.slaStatus}
        </span>
        <Badge className={getSbStatusClass(request.status)}>{request.status}</Badge>
      </div>
    </button>
  );
}

function DsSlaBadge({
  request,
  phase,
  compact = false,
}: {
  request: DocumentStudioRequest;
  phase: "assign" | "complete";
  compact?: boolean;
}) {
  const sla = getDocumentStudioSla(request, phase);
  const cls =
    sla.health === "breached" ? "bg-red-100 text-red-700"
    : sla.health === "warning" ? "bg-amber-100 text-amber-700"
    : "bg-green-100 text-green-700";
  return (
    <span className={`inline-flex rounded-full px-2 py-1 font-medium ${compact ? "text-[11px]" : "text-xs"} ${cls}`}>
      {sla.label}
    </span>
  );
}

function toDsLabel(raw: string) {
  return raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
