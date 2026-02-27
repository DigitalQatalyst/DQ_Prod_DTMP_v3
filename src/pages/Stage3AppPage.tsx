import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Clock,
  Download,
  Eye,
  Filter,
  Home,
  Inbox,
  ListChecks,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

type Stage3View =
  | "dashboard"
  | "all"
  | "new"
  | "in-progress"
  | "pending-review"
  | "team-capacity"
  | "analytics";
type Stage3Scope = "all" | "learning-center" | "knowledge-center";

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

export default function Stage3AppPage() {
  const navigate = useNavigate();
  const { view: routeView } = useParams<{ view?: string }>();
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
  const [statusFilter, setStatusFilter] = useState<Stage3Request["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Stage3Request["priority"] | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );
  const selectedLearningChangeSet = useMemo(() => {
    if (!selectedRequest) return null;
    const changeAsset = (selectedRequest.relatedAssets ?? []).find((asset) =>
      asset.startsWith("learning-change:")
    );
    if (!changeAsset) return null;
    const changeId = changeAsset.replace("learning-change:", "").trim();
    return changeId ? getLearningChangeSetById(changeId) ?? null : null;
  }, [selectedRequest, requests]);

  useEffect(() => {
    if (!selectedRequestId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRequestId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedRequestId]);

  useEffect(() => {
    if (!routeView || !isStage3View(routeView)) {
      setView("dashboard");
      return;
    }
    setView(routeView);
  }, [routeView]);

  const scopedRequests = useMemo(() => {
    if (scope === "all") return requests;
    return requests.filter((request) => request.type === scope);
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
      (acc, request) => {
        acc[request.status] += 1;
        return acc;
      },
      {
        new: 0,
        assigned: 0,
        "in-progress": 0,
        "pending-review": 0,
        "pending-user": 0,
        completed: 0,
        "on-hold": 0,
        cancelled: 0,
      }
    );
    const total = scopedRequests.length;
    const active =
      statusCounts.assigned + statusCounts["in-progress"] + statusCounts["pending-user"];
    const pendingReview = statusCounts["pending-review"];
    const breached = scopedRequests.filter((request) => request.slaStatus === "breached").length;
    const slaCompliant = total === 0 ? 100 : Math.round(((total - breached) / total) * 100);
    const avgResolutionDays = Math.max(
      1.2,
      Number(
        (
          scopedRequests.reduce((sum, request) => {
            const hours = request.actualHours ?? request.estimatedHours;
            return sum + hours / 8;
          }, 0) / Math.max(1, total)
        ).toFixed(1)
      )
    );
    const satisfaction = Number(
      (
        scopedRequests.reduce((sum, request) => sum + (request.customerSatisfaction ?? 4.5), 0) /
        Math.max(1, total)
      ).toFixed(1)
    );
    return {
      total,
      active,
      pendingReview,
      breached,
      slaCompliant,
      avgResolutionDays,
      satisfaction,
    };
  }, [scopedRequests]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scopedRequests.filter((r) => {
      const matchesView =
        view === "all" ||
        view === "dashboard" ||
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
  const visibleQueueCount = filteredRequests.length;
  const assigneeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          scopedRequests
            .map((request) => request.assignedTo ?? "Unassigned")
            .filter(Boolean)
        )
      ),
    [scopedRequests]
  );

  const handleAssign = () => {
    if (!selectedRequest || !selectedMemberId) return;
    const updated = assignStage3Request(selectedRequest.id, selectedMemberId);
    if (!updated) return;
    setRequests([...stage3Requests]);
  };

  const handleUnassign = () => {
    if (!selectedRequest) return;
    const updated = unassignStage3Request(selectedRequest.id);
    if (!updated) return;
    setRequests([...stage3Requests]);
  };

  const availableNextStatuses = selectedRequest
    ? getAvailableStage3Transitions(selectedRequest.status)
    : [];

  const handleStatusTransition = () => {
    if (!selectedRequest || !selectedNextStatus) return;
    const updated = transitionStage3RequestStatus(selectedRequest.id, selectedNextStatus);
    if (!updated) return;
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

  const advanceLearningChangeReview = (
    request: Stage3Request,
    terminal: "approved" | "rejected"
  ) => {
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

  const requestNavCounts = {
    all: queueKpis.total,
    new: scopedRequests.filter((request) => request.status === "new").length,
    inProgress: scopedRequests.filter((request) => request.status === "in-progress").length,
    pendingReview: scopedRequests.filter((request) => request.status === "pending-review").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-2xl text-gray-900">TO Operations</h2>
          <p className="text-sm text-gray-500">Stage 3 - CRM</p>
        </div>
        <div className="p-4 space-y-1">
          <button
            onClick={() => navigate("/stage3/dashboard")}
            className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center gap-2 ${
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
              className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center justify-between ${
                view === "all" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="inline-flex items-center gap-2"><ListChecks className="w-4 h-4" />All Requests</span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100">{requestNavCounts.all}</span>
            </button>
            <button
              onClick={() => navigate("/stage3/new")}
              className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center justify-between ${
                view === "new" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="inline-flex items-center gap-2"><Inbox className="w-4 h-4" />New</span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-blue-100 text-blue-700">{requestNavCounts.new}</span>
            </button>
            <button
              onClick={() => navigate("/stage3/in-progress")}
              className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center justify-between ${
                view === "in-progress" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="inline-flex items-center gap-2"><Activity className="w-4 h-4" />In Progress</span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-700">{requestNavCounts.inProgress}</span>
            </button>
            <button
              onClick={() => navigate("/stage3/pending-review")}
              className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center justify-between ${
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
              className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center gap-2 ${
                view === "team-capacity" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" />
              Team & Capacity
            </button>
            <button
              onClick={() => navigate("/stage3/analytics")}
              className={`w-full text-left px-3 py-2 rounded-lg text-base flex items-center gap-2 ${
                view === "analytics" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>
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

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-gray-200 bg-white px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Request Management</h1>
            <p className="text-sm text-gray-500">Transformation Office Operations Dashboard</p>
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
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">Marketplace Scope</span>
            <Button size="sm" variant={scope === "all" ? "default" : "outline"} className={scope === "all" ? "bg-orange-600 hover:bg-orange-700" : ""} onClick={() => setScope("all")}>All</Button>
            <Button size="sm" variant={scope === "learning-center" ? "default" : "outline"} className={scope === "learning-center" ? "bg-orange-600 hover:bg-orange-700" : ""} onClick={() => setScope("learning-center")}>Learning Center</Button>
            <Button size="sm" variant={scope === "knowledge-center" ? "default" : "outline"} className={scope === "knowledge-center" ? "bg-orange-600 hover:bg-orange-700" : ""} onClick={() => setScope("knowledge-center")}>Knowledge Center</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800">Total Requests</p>
              <p className="text-4xl font-semibold text-blue-900 mt-2">{queueKpis.total}</p>
              <p className="text-sm text-blue-700">All time</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800">Active</p>
              <p className="text-4xl font-semibold text-amber-900 mt-2">{queueKpis.active}</p>
              <p className="text-sm text-amber-700">In progress</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700">SLA Compliance</p>
              <p className="text-4xl font-semibold text-gray-900 mt-2">{queueKpis.slaCompliant}%</p>
              <p className="text-sm text-gray-500">On track</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700">Avg Resolution</p>
              <p className="text-4xl font-semibold text-gray-900 mt-2">{queueKpis.avgResolutionDays}</p>
              <p className="text-sm text-gray-500">Days</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-orange-800">Satisfaction</p>
              <p className="text-4xl font-semibold text-orange-900 mt-2">{queueKpis.satisfaction}</p>
              <p className="text-sm text-orange-700">Out of 5</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[260px] border border-gray-200 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests, requesters, or organizations..."
                  className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Stage3Request["status"] | "all")} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
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
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Stage3Request["priority"] | "all")} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option value="all">All Assignees</option>
                {assigneeOptions.map((assignee) => (
                  <option key={assignee} value={assignee.toLowerCase()}>{assignee}</option>
                ))}
              </select>
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" />More</Button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">Showing {visibleQueueCount} of {queueKpis.total} requests</p>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>

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
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[0.3fr_1.3fr_0.9fr_0.9fr_0.9fr_1fr_0.8fr_0.9fr_0.8fr_0.4fr] px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b">
                <div />
                <div>Request</div>
                <div>Type</div>
                <div>Requester</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Assigned To</div>
                <div>Due Date</div>
                <div>SLA</div>
                <div>Actions</div>
              </div>
              {filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequestId(request.id)}
                  className="w-full grid grid-cols-[0.3fr_1.3fr_0.9fr_0.9fr_0.9fr_1fr_0.8fr_0.9fr_0.8fr_0.4fr] px-4 py-4 text-left border-b last:border-b-0 hover:bg-orange-50/30 items-start"
                >
                  <div className="pt-1">
                    <span className="inline-block w-5 h-5 rounded-full border border-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{request.title}</p>
                    <p className="text-xs text-gray-500">{request.requestNumber}</p>
                  </div>
                  <div className="text-sm text-gray-700">{requestTypeLabel[request.type]}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.requester.name}</p>
                    <p className="text-xs text-gray-500">{request.requester.organization}</p>
                  </div>
                  <div><Badge className={getStatusBadgeClass(request.status)}>{request.status}</Badge></div>
                  <div><Badge className={getPriorityBadgeClass(request.priority)}>{request.priority}</Badge></div>
                  <div className="text-sm text-gray-700">{request.assignedTo ?? "Unassigned"}</div>
                  <div className="text-sm text-gray-700">{new Date(request.dueDate).toLocaleDateString()}</div>
                  <div className="text-xs">
                    <Badge className={getSlaBadgeClass(request.slaStatus)}>{request.slaStatus}</Badge>
                    <p className="text-gray-500 mt-1">{getDueSummary(request.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <MoreHorizontal className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSelectedRequestId(null)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[860px] bg-white border-l border-gray-200 p-4 overflow-y-auto shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Request Detail</h2>
              <button onClick={() => setSelectedRequestId(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <Badge className={getStatusBadgeClass(selectedRequest.status)}>{selectedRequest.status}</Badge>
              <Badge className={getPriorityBadgeClass(selectedRequest.priority)}>{selectedRequest.priority}</Badge>
              <Badge variant="secondary">{selectedRequest.type}</Badge>
            </div>
            <p className="font-medium text-gray-900">{selectedRequest.title}</p>
            <p className="text-gray-700">{selectedRequest.description}</p>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">Requester</p>
              <p>{selectedRequest.requester.name}</p>
              <p className="text-gray-600">{selectedRequest.requester.email}</p>
            </div>
            {selectedLearningChangeSet && (
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500">Proposed Learning Changes</p>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {selectedLearningChangeSet.courseName}
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Draft status: {selectedLearningChangeSet.status}
                </p>
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
                  {selectedLearningChangeSet.diffs.length === 0 &&
                    !selectedLearningChangeSet.deleteRequested && (
                      <p className="text-xs text-gray-500">No field-level diffs captured.</p>
                    )}
                </div>
              </div>
            )}
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">Assignment</p>
              <p>{selectedRequest.assignedTo ?? "Unassigned"}</p>
              <p className="text-gray-600">{selectedRequest.assignedTeam ?? "No team assigned"}</p>
              <div className="mt-3 space-y-2">
                <label className="text-xs text-gray-500">Assign To</label>
                <select
                  value={selectedMemberId}
                  onChange={(event) => setSelectedMemberId(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
                >
                  <option value="">Select team member</option>
                  {stage3TeamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.team}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">Status Transition</p>
              <div className="mt-2 space-y-2">
                <select
                  value={selectedNextStatus}
                  onChange={(event) =>
                    setSelectedNextStatus(event.target.value as Stage3Request["status"] | "")
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
                  disabled={availableNextStatuses.length === 0}
                >
                  {availableNextStatuses.length === 0 ? (
                    <option value="">No valid transitions</option>
                  ) : (
                    availableNextStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))
                  )}
                </select>
                {availableNextStatuses.length === 0 && (
                  <p className="text-xs text-gray-500">
                    This request is in a terminal state and cannot transition further.
                  </p>
                )}
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">SLA and Aging</p>
              <div className="mt-1 space-y-1">
                <Badge className={getSlaBadgeClass(selectedRequest.slaStatus)}>
                  {selectedRequest.slaStatus}
                </Badge>
                <p className="text-gray-700">Open: {getDaysOpen(selectedRequest.createdAt)} days</p>
                <p className="text-gray-700">Due: {getDueSummary(selectedRequest.dueDate)}</p>
                <p className="text-gray-500 text-xs">
                  Created {new Date(selectedRequest.createdAt).toLocaleDateString()} | Due{" "}
                  {new Date(selectedRequest.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">Activity Timeline</p>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {selectedRequest.activityLog.length === 0 ? (
                  <p className="text-xs text-gray-500">No activity recorded yet.</p>
                ) : (
                  selectedRequest.activityLog.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-md p-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-900">{entry.action}</p>
                        <p className="text-[11px] text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-600">{entry.actor}</p>
                      <p className="text-sm text-gray-700">{entry.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">Notes</p>
              <ul className="list-disc ml-5 text-gray-700">
                {selectedRequest.notes.map((note, idx) => (
                  <li key={`${selectedRequest.id}-note-${idx}`}>{note}</li>
                ))}
              </ul>
              <div className="mt-3 space-y-2">
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="Add an operational note..."
                  className="w-full min-h-20 border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>
              <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleStatusTransition}
                disabled={!selectedNextStatus}
              >
                Update Status
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAssign}
                disabled={!selectedMemberId}
              >
                Assign
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleUnassign}
                disabled={!selectedRequest.assignedTo}
              >
                Unassign
              </Button>
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleAddNote}
                disabled={!noteDraft.trim()}
              >
                Add Note
              </Button>
              {selectedLearningChangeSet && (
                <>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => advanceLearningChangeReview(selectedRequest, "approved")}
                  >
                    Approve Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => advanceLearningChangeReview(selectedRequest, "rejected")}
                  >
                    Reject Changes
                  </Button>
                </>
              )}
            </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
