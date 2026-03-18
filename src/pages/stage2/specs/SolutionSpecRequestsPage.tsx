import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listSolutionSpecRequests } from "@/data/solutionSpecsWorkspace";

const streamPill: Record<string, string> = {
  DBP: "bg-blue-100 text-blue-700",
  DXP: "bg-purple-100 text-purple-700",
  DWS: "bg-teal-100 text-teal-700",
  DIA: "bg-amber-100 text-amber-700",
  SDO: "bg-red-100 text-red-700",
};

export default function SolutionSpecRequestsPage() {
  const navigate = useNavigate();
  const requests = useMemo(() => listSolutionSpecRequests(), []);

  return (
    <div className="stage2-content p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/stage2/specs/overview")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Overview
      </Button>

      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-600">Track status, assignment, and SLA posture for Solution Spec requests.</p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${streamPill[request.stream]}`}>{request.stream}</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{request.requestType}</span>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">{request.status}</span>
            </div>
            <div className="mb-2 text-lg font-semibold text-gray-900">{request.specTitle}</div>
            <div className="mb-3 text-sm text-gray-600">{request.dewaDivision} • Submitted {new Date(request.submittedAt).toLocaleDateString("en-US")}</div>
            <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-3">
              <div><span className="font-medium text-gray-900">Assigned TO member:</span> {request.assignedTo}</div>
              <div><span className="font-medium text-gray-900">SLA:</span> {request.slaStatus}</div>
              <div><span className="font-medium text-gray-900">Programme:</span> {request.programme || "Not provided"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
