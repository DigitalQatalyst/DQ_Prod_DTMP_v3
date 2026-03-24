import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  MessageSquare,
  Send,
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

const RESOLUTION_TYPES: TOResolutionType[] = [
  "Article Updated",
  "Clarified",
  "No Action Needed",
  "Escalated",
];

// ── Display maps ──────────────────────────────────────────────────────────────

const REQUEST_TYPE_LABELS: Record<string, string> = {
  clarification:      "Clarification",
  "outdated-section": "Outdated Section",
  "stale-flag":       "Stale Flag",
  collaboration:      "Collaboration",
};

const REQUEST_TYPE_COLORS: Record<string, string> = {
  clarification:      "bg-blue-100 text-blue-700",
  "outdated-section": "bg-amber-100 text-amber-700",
  "stale-flag":       "bg-red-100 text-red-700",
  collaboration:      "bg-green-100 text-green-700",
};

const REQUEST_STATUS_COLORS: Record<TORequestStatus, string> = {
  Open:        "bg-sky-100 text-sky-700",
  Assigned:    "bg-purple-100 text-purple-700",
  "In Review": "bg-orange-100 text-orange-700",
  Resolved:    "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<TORequestPriority, string> = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low:    "bg-gray-100 text-gray-600 border-gray-200",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const slaDays = (createdAt: string) =>
  Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

// ── Component ─────────────────────────────────────────────────────────────────

export default function KCIncomingRequests({ role }: KCIncomingRequestsProps) {
  const navigate = useNavigate();

  // Filters
  const [statusFilter, setStatusFilter] = useState<"All" | TORequestStatus>("All");
  const [typeFilter,   setTypeFilter]   = useState<"All Types" | TORequestType>("All Types");

  // Data
  const [requests,    setRequests]    = useState<TORequest[]>(() => getTORequests());
  const [selectedId,  setSelectedId]  = useState<string | null>(null);

  // Response panel state
  const [responseDraft,      setResponseDraft]      = useState("");
  const [resolutionType,     setResolutionType]     = useState<TOResolutionType | "">("");
  const [assigneeDraft,      setAssigneeDraft]      = useState("");
  const [internalNoteDraft,  setInternalNoteDraft]  = useState("");
  const [showActivity,       setShowActivity]       = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────────

  const itemById = useMemo(
    () => new Map(knowledgeItems.map((item) => [item.id, item])),
    []
  );

  const filtered = useMemo(
    () => requests.filter((r) => {
      const sm = statusFilter === "All"       || r.status === statusFilter;
      const tm = typeFilter   === "All Types" || r.type   === typeFilter;
      return sm && tm;
    }),
    [requests, statusFilter, typeFilter]
  );

  const selectedReq    = selectedId ? requests.find((r) => r.id === selectedId) ?? null : null;
  const selectedItem   = selectedReq ? itemById.get(selectedReq.itemId) : null;
  const selectedMetric = selectedReq ? getKnowledgeUsageMetric(selectedReq.itemId) : null;

  const mergedThread = useMemo((): TOThreadEntry[] => {
    if (!selectedReq) return [];
    const legacy: TOThreadEntry[] = (selectedReq.activityLog ?? []).map((e, i) => ({
      id: `legacy-${i}`, kind: "system" as TOThreadEntryKind, text: e.action, by: e.by, at: e.at,
    }));
    return [
      { id: "submit", kind: "system", text: "Request submitted", by: selectedReq.requesterName, at: selectedReq.createdAt },
      ...legacy,
      ...(selectedReq.thread ?? []),
    ].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  }, [selectedReq]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const refresh = () => setRequests(getTORequests());

  const handleSelect = (id: string) => {
    if (id === selectedId) { setSelectedId(null); return; }
    setSelectedId(id);
    setResponseDraft("");
    setResolutionType("");
    setAssigneeDraft("");
    setInternalNoteDraft("");
    setShowActivity(false);
  };

  const handleResolve = () => {
    if (!selectedReq) return;
    if (assigneeDraft) assignTORequest(selectedReq.id, assigneeDraft, ACTOR);
    if (responseDraft.trim()) addTOThreadEntry(selectedReq.id, "reply", responseDraft, ACTOR);
    updateTORequestStatus(selectedReq.id, "Resolved", {
      actor: ACTOR,
      toResponse: responseDraft.trim() || undefined,
      resolutionType: resolutionType || undefined,
    });
    refresh();
    setResponseDraft("");
    setResolutionType("");
    setAssigneeDraft("");
  };

  const handleSendInternalNote = () => {
    if (!selectedReq || !internalNoteDraft.trim()) return;
    addTOThreadEntry(selectedReq.id, "internal", internalNoteDraft, ACTOR);
    refresh();
    setInternalNoteDraft("");
  };

  const handlePriority = (priority: TORequestPriority) => {
    if (!selectedReq) return;
    setTORequestPriority(selectedReq.id, priority, ACTOR);
    refresh();
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

        {/* ── Request list ─────────────────────────────────────────────── */}
        <div className={`space-y-2 min-w-0 transition-all duration-200 ${selectedId ? "w-[42%] flex-shrink-0" : "w-full"}`}>
          {filtered.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-10 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">No requests match this filter</p>
            </div>
          ) : (
            filtered.map((req) => {
              const item   = itemById.get(req.itemId);
              const isSel  = req.id === selectedId;
              const days   = slaDays(req.createdAt);
              return (
                <button
                  key={req.id} type="button"
                  onClick={() => handleSelect(req.id)}
                  className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${
                    isSel ? "border-orange-400 shadow-md ring-1 ring-orange-200" : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item?.title ?? req.itemId}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{req.requesterName} · {req.requesterRole}</p>
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
                        <span className="text-[10px] text-gray-400">{req.assignee.split(" ")[0]}</span>
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

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-2">
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
                </div>
                <button type="button" onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-bold text-gray-900 text-base leading-snug">
                {selectedItem?.title ?? selectedReq.itemId}
              </p>
              {selectedItem && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedItem.department} · {selectedItem.type}
                </p>
              )}
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <div className="p-5 space-y-5">

                {/* ── Two info cards ───────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Article Reference */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Reference</p>
                    {selectedMetric ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                          <BarChart3 className="w-3 h-3 text-blue-500" />
                          <strong>{selectedMetric.views}</strong> views · <strong>{selectedMetric.saves}</strong> saves
                        </span>
                        <span className="text-xs text-gray-600">
                          <strong>{selectedMetric.helpfulVotes}</strong> helpful votes
                        </span>
                        {selectedMetric.readingDepth > 0 && (
                          <span className="text-xs text-gray-600">
                            <strong>{selectedMetric.readingDepth}%</strong> avg read depth
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No usage data yet</p>
                    )}
                    {selectedItem && (
                      <button
                        type="button"
                        onClick={() => navigate(`/marketplaces/knowledge-center/${selectedItem.sourceTab}/${selectedItem.sourceId}`)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open Article
                      </button>
                    )}
                  </div>

                  {/* Request Details */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-2.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request Details</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {selectedReq.requesterName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{selectedReq.requesterName}</p>
                        <p className="text-[10px] text-gray-500 truncate">{selectedReq.requesterRole}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Submitted: <span className="font-medium text-gray-800">{fmtDate(selectedReq.createdAt)}</span></p>
                      {(() => {
                        const days = slaDays(selectedReq.createdAt);
                        const over = days >= 5;
                        return (
                          <p className={`flex items-center gap-1 ${over ? "text-red-600 font-semibold" : ""}`}>
                            {over && <AlertTriangle className="w-3 h-3" />}
                            SLA: {over ? "Overdue" : `Day ${days + 1} of 5 · On Track`}
                          </p>
                        );
                      })()}
                      {selectedReq.assignee && (
                        <p>Assigned: <span className="font-medium text-gray-800">{selectedReq.assignee}</span></p>
                      )}
                    </div>

                    {/* Priority — compact pills */}
                    {role === "admin" && selectedReq.status !== "Resolved" && (
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Priority</p>
                        <div className="flex gap-1">
                          {(["High", "Medium", "Low"] as TORequestPriority[]).map((p) => (
                            <button
                              key={p} type="button"
                              onClick={() => handlePriority(p)}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all ${
                                selectedReq.priority === p ? `${PRIORITY_COLORS[p]} ring-1 ring-offset-1 ring-current` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Submitted Context ────────────────────────────────── */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Submitted Context</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedReq.message}</p>
                  {selectedReq.sectionRef && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Section Reference</p>
                      <p className="text-xs text-gray-700 font-medium">{selectedReq.sectionRef}</p>
                    </div>
                  )}
                </div>

                {/* ── Response Panel ───────────────────────────────────── */}
                {role === "admin" && (
                  <div className="rounded-xl overflow-hidden border border-orange-200">

                    {/* Panel label — mirrors DS "Generation Panel" header */}
                    <div className="bg-orange-50 px-4 py-3 border-b border-orange-200">
                      <p className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-0.5">
                        Response Panel
                      </p>
                      {selectedReq.status !== "Resolved" ? (
                        <p className="text-xs text-orange-700">
                          Your response will be sent to the requester and their request status will update in their workspace.
                        </p>
                      ) : (
                        <p className="text-xs text-green-700">This request has been resolved.</p>
                      )}
                    </div>

                    {selectedReq.status !== "Resolved" ? (
                      <div className="p-4 space-y-3 bg-white">

                        {/* Resolution type + Assign row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                              Resolution Type
                            </label>
                            <select
                              value={resolutionType}
                              onChange={(e) => setResolutionType(e.target.value as TOResolutionType | "")}
                              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
                            >
                              <option value="">Select type…</option>
                              {RESOLUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                              Assign To
                            </label>
                            <select
                              value={assigneeDraft}
                              onChange={(e) => setAssigneeDraft(e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
                            >
                              <option value="">Unassigned</option>
                              {TO_TEAM.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Response textarea */}
                        <div>
                          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                            Response to Requester
                          </label>
                          <Textarea
                            placeholder="Write your response to the requester. They'll see this alongside the resolved status in their My Requests tab…"
                            value={responseDraft}
                            onChange={(e) => setResponseDraft(e.target.value)}
                            rows={4}
                            className="text-sm resize-none"
                          />
                        </div>

                        {/* CTA */}
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5"
                          onClick={handleResolve}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Send Response &amp; Mark Resolved
                        </Button>
                      </div>
                    ) : (
                      /* Resolved state */
                      <div className="p-4 bg-white space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Resolved</span>
                          {selectedReq.resolutionType && (
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              {selectedReq.resolutionType}
                            </span>
                          )}
                        </div>
                        {selectedReq.toResponse ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                            <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1.5">
                              Response sent to requester
                            </p>
                            <p className="text-sm text-green-900 leading-relaxed">{selectedReq.toResponse}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No response was sent to the requester.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Internal Notes ───────────────────────────────────── */}
                {role === "admin" && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowActivity((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Internal Notes &amp; Activity
                      </span>
                      {showActivity
                        ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      }
                    </button>

                    {showActivity && (
                      <div className="p-4 space-y-4">

                        {/* Thread entries */}
                        {mergedThread.length > 0 && (
                          <div className="space-y-2.5">
                            {mergedThread.map((entry) => {
                              if (entry.kind === "system") return (
                                <div key={entry.id} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-400 italic">{entry.text} · {entry.by} · {fmtDateTime(entry.at)}</span>
                                </div>
                              );
                              if (entry.kind === "internal") return (
                                <div key={entry.id} className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2.5">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Lock className="w-3 h-3 text-purple-500" />
                                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">Internal</span>
                                    <span className="ml-auto text-[10px] text-purple-400">{entry.by} · {fmtDateTime(entry.at)}</span>
                                  </div>
                                  <p className="text-xs text-purple-900">{entry.text}</p>
                                </div>
                              );
                              if (entry.kind === "reply") return (
                                <div key={entry.id} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Send className="w-3 h-3 text-blue-500" />
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Sent to User</span>
                                    <span className="ml-auto text-[10px] text-blue-400">{entry.by} · {fmtDateTime(entry.at)}</span>
                                  </div>
                                  <p className="text-xs text-blue-900">{entry.text}</p>
                                </div>
                              );
                              return null;
                            })}
                          </div>
                        )}

                        {/* Internal note compose */}
                        {selectedReq.status !== "Resolved" && (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Leave an internal note — not visible to the requester…"
                              value={internalNoteDraft}
                              onChange={(e) => setInternalNoteDraft(e.target.value)}
                              rows={2}
                              className="text-xs resize-none"
                            />
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSendInternalNote}
                                disabled={!internalNoteDraft.trim()}
                                className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                              >
                                <Lock className="w-3 h-3 mr-1.5" />
                                Add Note
                              </Button>
                            </div>
                          </div>
                        )}
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
