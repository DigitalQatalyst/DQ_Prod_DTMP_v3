import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getTORequests,
  updateTORequestStatus,
  type TORequest,
  type TORequestStatus,
  type TORequestType,
} from "@/data/knowledgeCenter/requestState";
import { getKnowledgeUsageMetric } from "@/data/knowledgeCenter/analyticsState";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";

interface KCIncomingRequestsProps {
  role: "admin" | "viewer";
}

// ── Display maps ─────────────────────────────────────────────────────────────
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
  "In Review": "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function KCIncomingRequests({ role }: KCIncomingRequestsProps) {
  const navigate = useNavigate();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<"All" | TORequestStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All Types" | TORequestType>("All Types");

  // ── Request state ─────────────────────────────────────────────────────────
  const [requests, setRequests] = useState<TORequest[]>(() => getTORequests());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Panel action state ────────────────────────────────────────────────────
  const [toResponseDraft, setToResponseDraft] = useState("");

  // ── Derived ───────────────────────────────────────────────────────────────
  const itemById = useMemo(
    () => new Map(knowledgeItems.map((item) => [item.id, item])),
    []
  );

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const statusMatch = statusFilter === "All" || r.status === statusFilter;
      const typeMatch = typeFilter === "All Types" || r.type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [requests, statusFilter, typeFilter]);

  const selectedReq = selectedId
    ? (requests.find((r) => r.id === selectedId) ?? null)
    : null;
  const selectedItem = selectedReq ? itemById.get(selectedReq.itemId) : null;
  const selectedMetric = selectedReq
    ? getKnowledgeUsageMetric(selectedReq.itemId)
    : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelect = (id: string) => {
    if (id === selectedId) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
      setToResponseDraft("");
    }
  };

  const handleStatusChange = (
    requestId: string,
    status: TORequestStatus,
    toResponse?: string
  ) => {
    updateTORequestStatus(requestId, status, {
      actor: "Sarah Miller",
      toResponse,
    });
    setRequests(getTORequests());
    setToResponseDraft("");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Single-row filter toolbar ───────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | TORequestStatus)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Type
          </span>
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

        <span className="ml-auto text-sm text-gray-400">
          {filtered.length} request(s)
        </span>
      </div>

      {/* ── List + detail panel ─────────────────────────────────────────── */}
      <div className="flex gap-4 items-start">

        {/* Request list */}
        <div
          className={`space-y-2 min-w-0 transition-all duration-200 ${
            selectedId ? "w-[45%] flex-shrink-0" : "w-full"
          }`}
        >
          {filtered.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-10 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                No requests match this filter
              </p>
            </div>
          ) : (
            filtered.map((req) => {
              const item = itemById.get(req.itemId);
              const isSelected = req.id === selectedId;
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
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                        {req.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <Badge
                        className={`text-xs ${
                          REQUEST_TYPE_COLORS[req.type] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {REQUEST_TYPE_LABELS[req.type] ?? req.type}
                      </Badge>
                      <Badge className={`text-xs ${REQUEST_STATUS_COLORS[req.status]}`}>
                        {req.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {REQUEST_TYPE_LABELS[selectedReq.type] ?? selectedReq.type}
                </p>
                <p className="font-semibold text-gray-900 text-sm leading-snug">
                  {selectedItem?.title ?? selectedReq.itemId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-300px)]">

              {/* Article impact signal */}
              {selectedMetric && (selectedMetric.views > 0 || selectedMetric.saves > 0) && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="flex flex-wrap gap-4 text-xs text-blue-700">
                    <span>
                      <strong>{selectedMetric.views}</strong> views
                    </span>
                    <span>
                      <strong>{selectedMetric.saves}</strong> saves
                    </span>
                    <span>
                      <strong>{selectedMetric.helpfulVotes}</strong> helpful votes
                    </span>
                    {selectedMetric.readingDepth > 0 && (
                      <span>
                        <strong>{selectedMetric.readingDepth}%</strong> avg read depth
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Requester */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Submitted by
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedReq.requesterName}
                </p>
                <p className="text-xs text-gray-500">{selectedReq.requesterRole}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(selectedReq.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Full message */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Message
                </p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedReq.message}
                </p>
              </div>

              {/* Section ref */}
              {selectedReq.sectionRef && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Section Reference
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                    {selectedReq.sectionRef}
                  </p>
                </div>
              )}

              {/* View article */}
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

              {/* Activity log */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Activity
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                    <span>
                      Submitted by {selectedReq.requesterName} ·{" "}
                      {new Date(selectedReq.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  {(selectedReq.activityLog ?? []).map((entry, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                      <span>
                        {entry.action} by {entry.by} ·{" "}
                        {new Date(entry.at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TO response (if already set) */}
              {selectedReq.toResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">TO Response</p>
                  <p className="text-sm text-green-800">{selectedReq.toResponse}</p>
                </div>
              )}

              {/* Admin workflow actions */}
              {role === "admin" && selectedReq.status !== "Resolved" && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </p>

                  {selectedReq.status === "Open" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                      onClick={() => handleStatusChange(selectedReq.id, "In Review")}
                    >
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      Mark In Review
                    </Button>
                  )}

                  {selectedReq.status === "In Review" && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Optional: add a response for the requester — they'll see this in their My Requests tab."
                        value={toResponseDraft}
                        onChange={(e) => setToResponseDraft(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          handleStatusChange(selectedReq.id, "Resolved", toResponseDraft)
                        }
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Resolved state */}
              {selectedReq.status === "Resolved" && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium border-t border-gray-100 pt-4">
                  <CheckCircle className="w-4 h-4" />
                  This request has been resolved
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
