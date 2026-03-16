import { Activity, BarChart3, Briefcase, CheckCircle2, ClipboardList, Clock, Eye, AlertCircle, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ServiceRequest } from "@/types/requests";

export type PortfolioWorkspaceTab = "overview" | "my-requests" | "my-assets";

interface PortfolioSubService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortfolioWorkspaceSidebarProps {
  activeTab: PortfolioWorkspaceTab;
  onTabChange: (tab: PortfolioWorkspaceTab) => void;
}

export function PortfolioWorkspaceSidebar({
  activeTab,
  onTabChange,
}: PortfolioWorkspaceSidebarProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onTabChange("overview")}
        className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-colors ${activeTab === "overview"
          ? "bg-orange-50 text-orange-700 border border-orange-200"
          : "text-gray-700 hover:bg-gray-50 border border-transparent"
          }`}
      >
        <BarChart3 className="w-4 h-4 flex-shrink-0" />
        <div className="text-left font-medium">Overview</div>
      </button>
      <button
        onClick={() => onTabChange("my-requests")}
        className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-colors ${activeTab === "my-requests"
          ? "bg-orange-50 text-orange-700 border border-orange-200"
          : "text-gray-700 hover:bg-gray-50 border border-transparent"
          }`}
      >
        <ClipboardList className="w-4 h-4 flex-shrink-0" />
        <div className="text-left font-medium">My Requests</div>
      </button>
      <button
        onClick={() => onTabChange("my-assets")}
        className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-colors ${activeTab === "my-assets"
          ? "bg-orange-50 text-orange-700 border border-orange-200"
          : "text-gray-700 hover:bg-gray-50 border border-transparent"
          }`}
      >
        <Briefcase className="w-4 h-4 flex-shrink-0" />
        <div className="text-left font-medium">My Assets</div>
      </button>
    </div>
  );
}

interface PortfolioWorkspaceMainProps {
  activeTab: PortfolioWorkspaceTab;
  activeSubService: string;
  portfolioSubServices: PortfolioSubService[];
  userRequests: ServiceRequest[];
  onTabChange?: (tab: PortfolioWorkspaceTab) => void;
}

export function PortfolioWorkspaceMain({
  activeTab,
  userRequests,
  onTabChange,
}: PortfolioWorkspaceMainProps) {
  const getStatusConfig = (status: ServiceRequest["status"]) => {
    const config: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
      submitted: { label: "Submitted", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock },
      "under-review": { label: "Under Review", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Eye },
      approved: { label: "Approved", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: CheckCircle2 },
      "in-progress": { label: "In Progress", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Activity },
      "pending-information": { label: "Pending Information", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle },
      completed: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
      delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
      closed: { label: "Closed", color: "bg-gray-100 text-gray-500 border-gray-200", icon: CheckCircle2 },
    };
    return config[status] || { label: status, color: "bg-gray-100 text-gray-600 border-gray-200", icon: AlertCircle };
  };

  const getProgressByStatus = (status: ServiceRequest["status"]) => {
    const progressMap: Record<ServiceRequest["status"], number> = {
      submitted: 0,
      "under-review": 25,
      approved: 40,
      "in-progress": 65,
      "pending-information": 45,
      completed: 100,
      delivered: 100,
      closed: 100,
    };
    return progressMap[status] ?? 0;
  };

  const sortedUserRequests = [...userRequests].sort((a, b) => {
    const aTime = new Date(a.submittedAt).getTime();
    const bTime = new Date(b.submittedAt).getTime();
    return bTime - aTime;
  });

  if (activeTab === "my-requests") {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Assessment Requests</h2>
            <p className="text-sm text-gray-500">Track and manage your requested portfolio assessments</p>
          </div>
        </div>

        {sortedUserRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No requests yet</h3>
            <p className="text-gray-500">You haven't requested any portfolio assessments or reports yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedUserRequests.map((request) => {
              const status = getStatusConfig(request.status);
              const StatusIcon = status.icon;
              const progressValue = getProgressByStatus(request.status);
              return (
                <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{request.requestType}</h4>
                      <p className="text-sm text-gray-500 mt-1">{request.serviceName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Request ID</p>
                      <p className="text-sm font-mono text-gray-700">{request.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Priority</p>
                      <p className={`text-sm font-medium ${request.priority === "urgent" ? "text-red-600" : "text-gray-700"}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Submitted</p>
                      <p className="text-sm text-gray-700">{new Date(request.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Target Date</p>
                      <p className="text-sm text-gray-700">{new Date(request.desiredCompletionDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500">Current Phase: {request.statusHistory[request.statusHistory.length - 1]?.comment || request.status}</p>
                      <p className="text-xs font-medium text-gray-400">Updated {new Date(request.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={progressValue} className="h-1.5 flex-1" />
                      <span className="text-xs font-bold text-gray-700">{progressValue}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "my-assets") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Managed Assets</h2>
          <p className="text-sm text-gray-500">Applications and projects under your direct responsibility</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">Application</span>
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase">
                <Activity className="w-3 h-3" />
                Stable
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-1">Customer Portal-V2</h4>
            <p className="text-gray-500 text-xs mb-4">Enterprise-wide External Application</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Debt Score</p>
                <p className="text-sm font-bold text-green-600">Low (12%)</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Annual TCO</p>
                <p className="text-sm font-bold text-gray-900">$238K</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded">Project</span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 uppercase">
                <Activity className="w-3 h-3" />
                At Risk
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-1">Legacy DB Migration</h4>
            <p className="text-gray-500 text-xs mb-4">IT Infrastructure Modernization</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Progress</p>
                <p className="text-sm font-bold text-amber-600">45%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Budget</p>
                <p className="text-sm font-bold text-gray-900">$1.2M</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold uppercase rounded">Deliverable</span>
              <span className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase">
                <Activity className="w-3 h-3" />
                Finalized
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-1">FY24 Cloud TCO Audit</h4>
            <p className="text-gray-500 text-xs mb-4">Deep-Dive Analysis Report</p>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Format: PDF</p>
              <button className="text-xs font-bold text-blue-600 hover:underline">Download</button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <Search className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">Need more assets?</p>
            <p className="text-xs text-gray-400 mt-1">Search the global enterprise directory</p>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = userRequests.reduce<Record<ServiceRequest["status"], number>>((acc, request) => {
    acc[request.status] = (acc[request.status] ?? 0) + 1;
    return acc;
  }, {
    submitted: 0,
    "under-review": 0,
    approved: 0,
    "in-progress": 0,
    "pending-information": 0,
    completed: 0,
    delivered: 0,
    closed: 0,
  });

  const totalRequests = userRequests.length;
  const activeRequests = statusCounts.submitted + statusCounts["under-review"] + statusCounts.approved + statusCounts["in-progress"] + statusCounts["pending-information"];
  const fulfilledRequests = statusCounts.completed + statusCounts.delivered + statusCounts.closed;
  const completionRate = totalRequests > 0 ? Math.round((fulfilledRequests / totalRequests) * 100) : 0;
  const recentRequests = [...userRequests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalRequests}</p>
          <p className="text-xs text-gray-500 mt-1">All portfolio submissions</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase">Active</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{activeRequests}</p>
          <p className="text-xs text-gray-500 mt-1">Submitted, review, or in progress</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase">Fulfilled</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{fulfilledRequests}</p>
          <p className="text-xs text-gray-500 mt-1">Completed, delivered, or closed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{completionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Based on fulfilled requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Fulfillment Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Submitted</p>
              <p className="text-2xl font-bold text-gray-800">{statusCounts.submitted}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Under Review</p>
              <p className="text-2xl font-bold text-blue-700">{statusCounts["under-review"]}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">In Progress</p>
              <p className="text-2xl font-bold text-purple-700">{statusCounts["in-progress"]}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Pending Info</p>
              <p className="text-2xl font-bold text-amber-700">{statusCounts["pending-information"]}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Completed</p>
              <p className="text-2xl font-bold text-green-700">{statusCounts.completed}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Delivered / Closed</p>
              <p className="text-2xl font-bold text-emerald-700">{statusCounts.delivered + statusCounts.closed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="space-y-2">
            <button
              onClick={() => onTabChange?.("my-requests")}
              className="w-full text-left rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go to My Requests
            </button>
            <button
              onClick={() => onTabChange?.("my-assets")}
              className="w-full text-left rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View My Assets
            </button>
            <a
              href="/marketplaces/portfolio-management"
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Open Stage 1 Portfolio
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {recentRequests.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.requestType}</p>
                  <p className="text-xs text-gray-500">{request.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-700 capitalize">{request.status.replace("-", " ")}</p>
                  <p className="text-xs text-gray-500">{new Date(request.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
