import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listSolutionSpecRequests, type SolutionSpecRequest } from "@/data/solutionSpecsWorkspace";

const streamPill: Record<string, string> = {
  DBP: "bg-blue-100 text-blue-700",
  DXP: "bg-purple-100 text-purple-700",
  DWS: "bg-teal-100 text-teal-700",
  DIA: "bg-amber-100 text-amber-700",
  SDO: "bg-red-100 text-red-700",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  Submitted:   { label: "Submitted",   color: "bg-gray-100 text-gray-700",   icon: Clock },
  Assigned:    { label: "Assigned",    color: "bg-blue-100 text-blue-700",   icon: Clock },
  "In Progress": { label: "In Progress", color: "bg-orange-100 text-orange-700", icon: Loader2 },
  Delivered:   { label: "Delivered",   color: "bg-teal-100 text-teal-700",   icon: CheckCircle2 },
  Completed:   { label: "Completed",   color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  Revision:    { label: "Revision",    color: "bg-red-100 text-red-700",     icon: AlertTriangle },
};

const slaConfig: Record<string, string> = {
  "On Track": "text-green-700 bg-green-50",
  "At Risk":  "text-amber-700 bg-amber-50",
  Breached:   "text-red-700 bg-red-50",
};

function RequestCard({ request }: { request: SolutionSpecRequest }) {
  const status = statusConfig[request.status] ?? statusConfig["Submitted"];
  const StatusIcon = status.icon;
  const isCustom = request.specId.startsWith("custom-");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-orange-200 hover:shadow-sm transition-all">
      {/* Top row — stream + type + status badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${streamPill[request.stream] ?? "bg-gray-100 text-gray-700"}`}>
          {request.stream}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {request.requestType}
        </span>
        {isCustom && (
          <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-medium text-orange-700">
            Custom Request
          </span>
        )}
        <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{request.specTitle}</h3>

      {/* Meta line */}
      <p className="mb-4 text-sm text-gray-500">
        {request.dewaDivision}
        {request.additionalNotes ? ` · ${request.additionalNotes}` : ""}
        {" · "}Submitted {new Date(request.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </p>

      {/* Details grid */}
      <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
        <div>
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Assigned TO</span>
          <span className="font-medium text-gray-900">{request.assignedTo}</span>
        </div>
        <div>
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">SLA</span>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${slaConfig[request.slaStatus] ?? ""}`}>
            {request.slaStatus}
          </span>
        </div>
        <div>
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Priority</span>
          <span className="font-medium text-gray-900">{request.timelinePriority}</span>
        </div>
      </div>

      {/* Business need preview */}
      {request.businessNeed && (
        <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3 line-clamp-2">
          {request.businessNeed}
        </p>
      )}
    </div>
  );
}

export default function SolutionSpecRequestsPage() {
  const navigate = useNavigate();
  // Read fresh on every mount so navigation from marketplace shows new request
  const requests = listSolutionSpecRequests();

  const submitted = requests.filter((r) => r.status === "Submitted").length;
  const active    = requests.filter((r) => r.status === "Assigned" || r.status === "In Progress").length;
  const done      = requests.filter((r) => r.status === "Delivered" || r.status === "Completed").length;

  return (
    <div className="stage2-content p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/stage2/specs/overview")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Overview
      </Button>

      <div className="mb-6">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-500 text-sm">
          Track status, assignment, and SLA posture for all Solution Spec requests you have raised.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Awaiting Assignment", value: submitted, color: "text-gray-700" },
          { label: "In Progress",          value: active,    color: "text-orange-600" },
          { label: "Delivered",            value: done,      color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Clock className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests yet</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-4">
            Browse the Solution Specs marketplace and click <strong>Request a Spec</strong> to get started.
          </p>
          <Button
            onClick={() => navigate("/marketplaces/solution-specs")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Browse Solution Specs
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
