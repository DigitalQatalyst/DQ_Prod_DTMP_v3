import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck, FileText, GitPullRequest, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listDeliveredSolutionSpecs,
  listSolutionSpecRequests,
  listSolutionSpecRevisions,
} from "@/data/solutionSpecsWorkspace";

export default function SolutionSpecsOverview() {
  const navigate = useNavigate();
  const requests = listSolutionSpecRequests();
  const delivered = listDeliveredSolutionSpecs();
  const revisions = listSolutionSpecRevisions();
  const activeRequests = requests.filter((request) =>
    ["Submitted", "Assigned", "In Progress"].includes(request.status)
  );

  return (
    <div className="stage2-content p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/stage2")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Service Hub
      </Button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Solution Specs</h1>
          <p className="text-gray-600">Your specification requests, delivered assets, and revisions.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => navigate("/marketplaces/solution-specs")}>
          Browse Solution Specs
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Requests", value: requests.length, icon: GitPullRequest, color: "bg-blue-100 text-blue-600" },
          { label: "In Progress", value: activeRequests.length, icon: RefreshCw, color: "bg-amber-100 text-amber-600" },
          { label: "Specs Acquired", value: delivered.length, icon: FileCheck, color: "bg-green-100 text-green-600" },
          { label: "Pending Revision", value: revisions.length, icon: FileText, color: "bg-rose-100 text-rose-600" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-600">{item.label}</div>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Active Requests</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/stage2/specs/my-requests")}>
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {activeRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">{request.specTitle}</div>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{request.requestType} • {request.dewaDivision}</div>
              </div>
            ))}
            {activeRequests.length === 0 && (
              <p className="text-sm text-gray-500">No active Solution Spec requests yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/marketplaces/solution-specs")}>
              Browse Solution Specs
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/stage2/specs/my-requests")}>
              View All Requests
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/stage2/specs/my-specs")}>
              View My Specs
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/stage2/specs/revisions")}>
              View Revisions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
