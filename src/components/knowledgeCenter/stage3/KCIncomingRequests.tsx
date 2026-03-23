import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink,
  Lock,
  MessageSquare,
  Send,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addTOThreadEntry,
  assignTORequest,
  getTORequests,
  setTORequestPriority,
  updateTORequestStatus,
  type TORequest,
  type TORequestPriority,
  type TORequestStatus,
  type TORequestType,
  type TOResolutionType,
  type TOThreadEntry,
  type TOThreadEntryKind,
} from "@/data/knowledgeCenter/requestState";
import { getKnowledgeUsageMetric } from "@/data/knowledgeCenter/analyticsState";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";

interface KCIncomingRequestsProps {
  role: "admin" | "viewer";
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTOR = "Sarah Miller";

const TO_TEAM = ["Sarah Miller", "Rami Al-Hassan", "Layla Qassim", "Omar Nader"];

const STATUS_STEPS: TORequestStatus[] = ["Open", "Assigned", "In Review", "Resolved"];

const RESOLUTION_TYPES: TOResolutionType[] = [
  "Article Updated",
  "Clarified",
  "No Action Needed",
  "Escalated",
];

// ── Display maps ──────────────────────────────────────────────────────────────

const REQUEST_TYPE_LABELS: Record<string, string> = {
  clarification: "Clarification",
  "outdated-section": "Outdated Section",
  "stale-flag": "Stale Flag",
  collaboration: "Collaboration",
};

const REQUEST_TYPE_COLORS: Record<string, string> = {
  clarification: "bg-blue-100 text-blue-700",
  "outdated-section": "bg-amber-100 text-amber-700",
  "stale-flag": "bg-red-100 text-red-700",
  collaboration: "bg-green-100 text-green-700",
};

const REQUEST_STATUS_COLORS: Record<TORequestStatus, string> = {
  Open: "bg-sky-100 text-sky-700",
  Assigned: "bg-purple-100 text-purple-700",
  "In Review": "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<TORequestPriority, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-gray-100 text-gray-600 border-gray-200",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const slaDays = (createdAt: string) =>
  Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

// ── Component ─────────────────────────────────────────────────────────────────

export default function KCIncomingRequests({ role }: KCIncomingRequestsProps) {
  const navigate = useNavigate();

  // Filter
  const [statusFilter, setStatusFilter] = useState<"All" | TORequestStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All Types" | TORequestType>("All Types");

  // Data
  const [requests, setRequests] = useState<TORequest[]>(() => getTORequests());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Per-panel compose state
  const [composeDraft, setComposeDraft] = useState("");
  const [composeKind, setComposeKind] = useState<"reply" | "internal">("reply");
  const [assigneeDraft, setAssigneeDraft] = useState("");
  const [resolutionType, setResolutionType] = useState<TOResolutionType | "">("");
  const [toResponseDraft, setToResponseDraft] = useState("");

  // ── Derived ───────────────────────────────────────────────────────────────

  const itemById = useMemo(
    () => new Map(knowledgeItems.map((item) => [item.id, item])),
    []
  );

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        const statusMatch = statusFilter === "All" || r.status === statusFilter;
        const typeMatch = typeFilter === "All Types" || r.type === typeFilter;
        return statusMatch && typeMatch;
      }),
    [requests, statusFilter, typeFilter]
  );

  const selectedReq = selectedId ? requests.find((r) => r.id === selectedId) ?? null : null;
  const selectedItem = selectedReq ? itemById.get(selectedReq.itemId) : null;
  const selectedMetric = selectedReq ? getKnowledgeUsageMetric(selectedReq.itemId) : null;

  /** Merge legacy activityLog + new thread for unified display */
  const mergedThread = useMemo((): TOThreadEntry[] => {
    if (!selectedReq) return [];
    const legacy: TOThreadEntry[] = (selectedReq.activityLog ?? []).map((e, i) => ({
      id: `legacy-${i}`,
      kind: "system" as TOThreadEntryKind,
      text: e.action,
      by: e.by,
      at: e.at,
    }));
    const all: TOThreadEntry[] = [
      { id: "submit", kind: "system", text: "Request submitted", by: selectedReq.requesterName, at: selectedReq.createdAt },
      ...legacy,
      ...(selectedReq.thread ?? []),
    ];
    return all.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  }, [selectedReq]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const refresh = () => setRequests(getTORequests());

  const handleSelect = (id: string) => {
    if (id === selectedId) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
    setComposeDraft("");
    setComposeKind("reply");
    setAssigneeDraft("");
    setResolutionType("");
    setToResponseDraft("");
  };

  const handleAssign = (assignee: string) => {
    if (!selectedReq || !assignee) return;
    assignTORequest(selectedReq.id, assignee, ACTOR);
    refresh();
    setAssigneeDraft("");
  };

  const handlePriority = (priority: TORequestPriority) => {
    if (!selectedReq) return;
    setTORequestPriority(selectedReq.id, priority, ACTOR);
    refresh();
  };

  const handleAdvanceStatus = (status: TORequestStatus) => {
    if (!selectedReq) return;
    updateTORequestStatus(selectedReq.id, status, { actor: ACTOR });
    refresh();
  };

  const handleResolve = () => {
    if (!selectedReq) return;
    updateTORequestStatus(selectedReq.id, "Resolved", {
      actor: ACTOR,
      toResponse: toResponseDraft.trim() || undefined,
      resolutionType: resolutionType || undefined,
    });
    refresh();
    setToResponseDraft("");
    setResolutionType("");
  };

  const handleSend = () => {
    if (!selectedReq || !composeDraft.trim()) return;
    addTOThreadEntry(selectedReq.id, composeKind, composeDraft, ACTOR);
    refresh();
    setComposeDraft("");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Filter toolbar ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | TORequestStatus)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "All Types" | TORequestType)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="All Types">All Types</option>
            <option value="clarification">Clarification</option>
            <option value="outdated-section">Outdated Section</option>
            <option value="stale-flag">Stale Flag</option>
          </select>
        </div>
        <span className="ml-auto text-sm text-gray-400">{filtered.length} request(s)</span>
      </div>

      {/* ── List + detail ───────────────────────────────────────────────── */}
      <div className="flex gap-4 items-start">

        {/* Request list */}
        <div
          className={`space-y-2 min-w-0 transition-all duration-200 ${
            selectedId ? "w-[42%] flex-shrink-0" : "w-full"
          }`}
        >
          {filtered.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-10 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">No requests match this filter</p>
            </div>
          ) : (
            filtered.map((req) => {
              const item = itemById.get(req.itemId);
              const isSelected = req.id === selectedId;
              const days = slaDays(req.createdAt);
              return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => handleSelect(req.id)}
                  className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${
                    isSelected
                      ? "border-orange-400 shadow-md ring-1 ring-orange-200"
                      : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item?.title ?? req.itemId}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {req.requesterName} · {req.requesterRole}
                      </p>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{req.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <Badge className={`text-xs ${REQUEST_TYPE_COLORS[req.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {REQUEST_TYPE_LABELS[req.type] ?? req.type}
                      </Badge>
                      <Badge className={`text-xs ${REQUEST_STATUS_COLORS[req.status]}`}>
                        {req.status}
                      </Badge>
                      {req.priority && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[req.priority]}`}>
                          {req.priority}
                        </span>
                      )}
                      {req.assignee && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <User className="w-2.5 h-2.5" />
                          {req.assignee.split(" ")[0]}
                        </span>
                      )}
                      <span className={`text-[10px] font-medium ${days >= 5 ? "text-red-500" : "text-gray-400"}`}>
                        Day {days + 1}{days >= 5 && " ⚠"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* ── Detail panel ──────────────────────────────────────────────── */}
        {selectedReq && (
          <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-4 shadow-sm">

            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center flex-wrap gap-2">
                  <Badge className={`text-xs ${REQUEST_TYPE_COLORS[selectedReq.type] ?? "bg-gray-100 text-gray-700"}`}>
                    {REQUEST_TYPE_LABELS[selectedReq.type] ?? selectedReq.type}
                  </Badge>
                  <Badge className={`text-xs ${REQUEST_STATUS_COLORS[selectedReq.status]}`}>
                    {selectedReq.status}
                  </Badge>
                  {selectedReq.priority && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[selectedReq.priority]}`}>
                      {selectedReq.priority}
                    </span>
                  )}
                  {(() => {
                    const days = slaDays(selectedReq.createdAt);
                    const over = days >= 5;
                    return (
                      <span className={`text-xs font-medium flex items-center gap-1 ${over ? "text-red-600" : "text-gray-400"}`}>
                        {over && <AlertTriangle className="w-3 h-3" />}
                        Day {days + 1} of 5 SLA
                      </span>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Article title + meta */}
              <p className="font-semibold text-gray-900 text-sm leading-snug">
                {selectedItem?.title ?? selectedReq.itemId}
              </p>
              {selectedItem && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedItem.department} · {selectedItem.type} · Updated {fmtDate(selectedItem.updatedAt)}
                </p>
              )}

              {/* Impact strip */}
              {selectedMetric && (selectedMetric.views > 0 || selectedMetric.saves > 0) && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-xs text-blue-700">
                    <BarChart3 className="w-3 h-3" />
                    <strong>{selectedMetric.views}</strong> views
                  </span>
                  <span className="text-xs text-blue-700"><strong>{selectedMetric.saves}</strong> saves</span>
                  <span className="text-xs text-blue-700"><strong>{selectedMetric.helpfulVotes}</strong> helpful</span>
                  {selectedMetric.readingDepth > 0 && (
                    <span className="text-xs text-blue-700"><strong>{selectedMetric.readingDepth}%</strong> avg depth</span>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[calc(100vh-330px)]">

              {/* ── Workflow stepper ──────────────────────────────────── */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, i) => {
                    const currentIdx = STATUS_STEPS.indexOf(selectedReq.status);
                    const done = i < currentIdx;
                    const current = i === currentIdx;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                              done
                                ? "bg-green-500 border-green-500 text-white"
                                : current
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "bg-white border-gray-200 text-gray-400"
                            }`}
                          >
                            {done ? "✓" : i + 1}
                          </div>
                          <p
                            className={`text-[9px] mt-1 font-semibold whitespace-nowrap tracking-wide ${
                              current ? "text-orange-600" : done ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${
                              i < currentIdx ? "bg-green-400" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 space-y-6">

                {/* ── Assignment ──────────────────────────────────────── */}
                {role === "admin" && selectedReq.status !== "Resolved" && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Assignment
                    </p>
                    {selectedReq.assignee ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {selectedReq.assignee.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 flex-1">
                          {selectedReq.assignee}
                        </span>
                        {selectedReq.assignee !== ACTOR && (
                          <button
                            type="button"
                            onClick={() => handleAssign(ACTOR)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                          >
                            Reassign to me
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={assigneeDraft}
                          onChange={(e) => setAssigneeDraft(e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
                        >
                          <option value="">Select team member…</option>
                          {TO_TEAM.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50 flex-shrink-0"
                          onClick={() => handleAssign(assigneeDraft)}
                          disabled={!assigneeDraft}
                        >
                          Assign
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleAssign(ACTOR)}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium flex-shrink-0 whitespace-nowrap"
                        >
                          Assign to me
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Priority ────────────────────────────────────────── */}
                {role === "admin" && selectedReq.status !== "Resolved" && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Priority
                    </p>
                    <div className="flex gap-2">
                      {(["High", "Medium", "Low"] as TORequestPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePriority(p)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                            selectedReq.priority === p
                              ? `${PRIORITY_COLORS[p]} ring-1 ring-offset-1 ring-current`
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Submitted by ────────────────────────────────────── */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Submitted by
                  </p>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {selectedReq.requesterName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{selectedReq.requesterName}</p>
                      <p className="text-xs text-gray-500">{selectedReq.requesterRole}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(selectedReq.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg px-3 py-2.5">
                    {selectedReq.message}
                  </p>
                  {selectedReq.sectionRef && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-1.5">
                      <span className="font-semibold">Section:</span> {selectedReq.sectionRef}
                    </p>
                  )}
                </div>

                {/* ── View Article ─────────────────────────────────────── */}
                {selectedItem && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/marketplaces/knowledge-center/${selectedItem.sourceTab}/${selectedItem.sourceId}`
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Article in KC
                  </button>
                )}

                {/* ── Thread ──────────────────────────────────────────── */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Thread
                  </p>

                  {/* Timeline */}
                  <div className="space-y-2.5 mb-4">
                    {mergedThread.map((entry) => {
                      if (entry.kind === "system") {
                        return (
                          <div key={entry.id} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-gray-500 italic">
                              {entry.text} · {entry.by} · {fmtDateTime(entry.at)}
                            </span>
                          </div>
                        );
                      }
                      if (entry.kind === "internal") {
                        return (
                          <div key={entry.id} className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Lock className="w-3 h-3 text-purple-500" />
                              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide">
                                Internal Note
                              </span>
                              <span className="ml-auto text-[10px] text-purple-400">
                                {entry.by} · {fmtDateTime(entry.at)}
                              </span>
                            </div>
                            <p className="text-xs text-purple-900 leading-relaxed">{entry.text}</p>
                          </div>
                        );
                      }
                      if (entry.kind === "reply") {
                        return (
                          <div key={entry.id} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Send className="w-3 h-3 text-blue-500" />
                              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                                Sent to User
                              </span>
                              <span className="ml-auto text-[10px] text-blue-400">
                                {entry.by} · {fmtDateTime(entry.at)}
                              </span>
                            </div>
                            <p className="text-xs text-blue-900 leading-relaxed">{entry.text}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Compose box — admin only, not resolved */}
                  {role === "admin" && selectedReq.status !== "Resolved" && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Tab toggle */}
                      <div className="flex border-b border-gray-200">
                        {(["reply", "internal"] as const).map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setComposeKind(k)}
                            className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                              composeKind === k
                                ? k === "reply"
                                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                                  : "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {k === "reply" ? (
                              <><Send className="w-3 h-3" /> Reply to User</>
                            ) : (
                              <><Lock className="w-3 h-3" /> Internal Note</>
                            )}
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder={
                          composeKind === "reply"
                            ? "Write a message to the requester…"
                            : "Leave an internal note — not visible to the user…"
                        }
                        value={composeDraft}
                        onChange={(e) => setComposeDraft(e.target.value)}
                        rows={3}
                        className="text-sm border-0 rounded-none resize-none focus-visible:ring-0"
                      />
                      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleSend}
                          disabled={!composeDraft.trim()}
                          className={
                            composeKind === "reply"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }
                        >
                          {composeKind === "reply" ? "Send to User" : "Add Note"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Advance Status ──────────────────────────────────── */}
                {role === "admin" && selectedReq.status !== "Resolved" && (
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Advance Status
                    </p>

                    {(selectedReq.status === "Open" || selectedReq.status === "Assigned") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => handleAdvanceStatus("In Review")}
                      >
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Mark In Review
                      </Button>
                    )}

                    {selectedReq.status === "In Review" && (
                      <div className="space-y-2.5">
                        <select
                          value={resolutionType}
                          onChange={(e) => setResolutionType(e.target.value as TOResolutionType | "")}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
                        >
                          <option value="">Resolution type (optional)…</option>
                          {RESOLUTION_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <Textarea
                          placeholder="Final response to requester (optional — they'll see this in their My Requests tab)"
                          value={toResponseDraft}
                          onChange={(e) => setToResponseDraft(e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleResolve}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                          Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Resolved banner ─────────────────────────────────── */}
                {selectedReq.status === "Resolved" && (
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Request resolved
                      {selectedReq.resolutionType && (
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {selectedReq.resolutionType}
                        </span>
                      )}
                    </div>
                    {selectedReq.toResponse && (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                        <p className="text-xs font-semibold text-green-700 mb-1">
                          Final response sent to user
                        </p>
                        <p className="text-sm text-green-800 leading-relaxed">
                          {selectedReq.toResponse}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
