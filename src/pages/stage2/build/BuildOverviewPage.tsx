import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Activity,
  CheckCircle2,
  GitPullRequest,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listBuildRequests } from "@/data/solutionBuildWorkspace";
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

export default function BuildOverviewPage() {
  const navigate = useNavigate();
  const requests = listBuildRequests();
  const recent = requests.slice(0, 5);

  const kpis = {
    total: requests.length,
    active: requests.filter(r => ["Queue", "In Progress", "Testing"].includes(r.status)).length,
    testing: requests.filter(r => r.status === "Testing").length,
    complete: requests.filter(r => r.status === "Complete").length,
  };

  return (
    <div className="stage2-content p-6">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Solution Builds</h1>
          <p className="text-gray-600">Track your build requests, milestones, and delivery progress.</p>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => navigate("/marketplaces/solution-build")}
        >
          <Rocket className="mr-2 h-4 w-4" />
          Browse Solution Build
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Requests", value: kpis.total, icon: GitPullRequest, color: "bg-blue-100 text-blue-600" },
          { label: "Active Builds", value: kpis.active, icon: Activity, color: "bg-amber-100 text-amber-600" },
          { label: "In Testing", value: kpis.testing, icon: Rocket, color: "bg-purple-100 text-purple-600" },
          { label: "Completed", value: kpis.complete, icon: CheckCircle2, color: "bg-green-100 text-green-600" },
        ].map(item => (
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

      {/* Recent Requests */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/stage2/solution-build/my-requests")}>
            View All
          </Button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-8">
            <Rocket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No build requests yet.</p>
            <Button
              size="sm"
              className="mt-3 bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate("/marketplaces/solution-build")}
            >
              Browse Solution Build
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Reference</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Build</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Stream</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map(req => {
                  const streamColors = STREAM_COLORS[req.stream] ?? STREAM_COLORS["DBP"];
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate("/stage2/solution-build/my-requests")}
                    >
                      <td className="py-3 px-3 font-mono text-xs text-gray-500">{req.id}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{req.buildTitle}</p>
                        <p className="text-xs text-gray-500">{req.dewaDivision}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${streamColors.bg} ${streamColors.text}`}>
                          {req.stream}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 min-w-[100px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${req.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{req.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
