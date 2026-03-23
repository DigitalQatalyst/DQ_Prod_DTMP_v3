import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  listBuildRequests,
  createBuildRevision,
  type BuildRequest,
} from "@/data/solutionBuildWorkspace";
import { STREAM_COLORS } from "@/data/blueprints/solutionBuilds";

const STATUS_COLORS: Record<string, string> = {
  Submitted: "bg-gray-100 text-gray-700",
  Triage: "bg-yellow-100 text-yellow-700",
  Queue: "bg-blue-100 text-blue-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Testing: "bg-purple-100 text-purple-700",
  Complete: "bg-green-100 text-green-700",
  "On Hold": "bg-red-100 text-red-700",
  Revision: "bg-yellow-100 text-yellow-700",
};

const SLA_COLORS: Record<string, string> = {
  "On Track": "bg-green-100 text-green-700",
  "At Risk": "bg-amber-100 text-amber-700",
  Breached: "bg-red-100 text-red-700",
};

function RequestCard({ request, onRevisionAdded }: { request: BuildRequest; onRevisionAdded: () => void }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  const streamColors = STREAM_COLORS[request.stream] ?? STREAM_COLORS["DBP"];

  const handleRaiseRevision = () => {
    if (!revisionNote.trim()) return;
    createBuildRevision(request.id, revisionNote);
    setRevisionNote("");
    setShowRevision(false);
    onRevisionAdded();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Card header — always visible */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-xs text-gray-400">{request.id}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${streamColors.bg} ${streamColors.text}`}>
                {request.stream}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[request.status] ?? "bg-gray-100 text-gray-700"}`}>
                {request.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${SLA_COLORS[request.slaStatus] ?? "bg-gray-100"}`}>
                {request.slaStatus}
              </span>
            </div>
            <p className="font-semibold text-gray-900 text-base line-clamp-2">{request.buildTitle}</p>
            <p className="text-sm text-gray-500 mt-1">{request.dewaDivision} · Submitted {new Date(request.submittedAt).toLocaleDateString("en-GB")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? "Collapse" : "Details"}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${request.status === "Complete" ? "bg-green-500" : "bg-orange-500"}`}
              style={{ width: `${request.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10 text-right">{request.progress}%</span>
        </div>

        {/* Milestones mini-row */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {request.milestones.map(m => (
            <div
              key={m.id}
              title={m.label}
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                m.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4 bg-gray-50/50">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Priority</p>
              <p className="text-gray-900">{request.priority}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Timeline Preference</p>
              <p className="text-gray-900">{request.timelinePreference}</p>
            </div>
            {request.assignedTeam && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Assigned Team</p>
                <p className="text-gray-900">{request.assignedTeam}</p>
              </div>
            )}
            {request.programme && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Programme</p>
                <p className="text-gray-900">{request.programme}</p>
              </div>
            )}
          </div>

          {request.businessNeed && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Business Need</p>
              <p className="text-sm text-gray-700">{request.businessNeed}</p>
            </div>
          )}

          {request.keyRequirements && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Requirements</p>
              <p className="text-sm text-gray-700">{request.keyRequirements}</p>
            </div>
          )}

          {/* Customisation selections */}
          {request.customisationSelections.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customisation Selections</p>
              <div className="flex flex-wrap gap-1">
                {request.customisationSelections.map(sel => (
                  <span key={sel} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100">
                    {sel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Milestones full list */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Milestones</p>
            <div className="space-y-1">
              {request.milestones.map(m => (
                <div key={m.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${m.completed ? "text-green-500" : "text-gray-300"}`} />
                  <span className={m.completed ? "text-gray-900 line-through decoration-gray-300" : "text-gray-600"}>
                    {m.label}
                  </span>
                  {m.completedAt && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(m.completedAt).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {request.fromSpecTitle && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Based on Spec</p>
              <button
                onClick={() => navigate(`/marketplaces/solution-specs/${request.fromSpecId}`)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {request.fromSpecTitle}
              </button>
            </div>
          )}

          {/* Revision section */}
          {request.status === "Complete" && (
            <div className="pt-2 border-t border-gray-200">
              {!showRevision ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRevision(true)}
                >
                  Raise a Revision
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Revision Note</p>
                  <Textarea
                    placeholder="Describe what needs to be revised or updated..."
                    value={revisionNote}
                    onChange={e => setRevisionNote(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowRevision(false)}>Cancel</Button>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={!revisionNote.trim()}
                      onClick={handleRaiseRevision}
                    >
                      Submit Revision
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BuildRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BuildRequest[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setRequests(listBuildRequests());
  }, [refresh]);

  return (
    <div className="stage2-content p-6">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Build Requests</h1>
          <p className="text-gray-600">Track your solution build requests and delivery progress.</p>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => navigate("/marketplaces/solution-build")}
        >
          <Rocket className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No build requests yet</h3>
          <p className="text-gray-500 text-sm mb-6">Browse the Solution Build marketplace to request a build solution.</p>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate("/marketplaces/solution-build")}
          >
            Browse Solution Build
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              onRevisionAdded={() => setRefresh(r => r + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
