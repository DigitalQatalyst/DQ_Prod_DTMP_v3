import { BarChart3, ClipboardList, Search, SlidersHorizontal, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type BuildRequest } from "@/data/solutionBuild";

export type BuildWorkspaceTab = "overview" | "my-requests";

interface BuildWorkspaceSidebarProps {
  activeTab: BuildWorkspaceTab;
  onTabChange: (tab: BuildWorkspaceTab) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (filter: string) => void;
  priorityFilter?: string;
  onPriorityFilterChange?: (filter: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  requests?: BuildRequest[];
  selectedRequest?: BuildRequest | null;
  onSelectRequest?: (request: BuildRequest) => void;
  getStatusColor?: (status: BuildRequest["status"]) => string;
}

export function BuildWorkspaceSidebar({
  activeTab,
  onTabChange,
  searchQuery = "",
  onSearchChange,
  statusFilter = "all",
  onStatusFilterChange,
  priorityFilter = "all",
  onPriorityFilterChange,
  showFilters = false,
  onToggleFilters,
  activeFiltersCount = 0,
  onClearFilters,
  requests = [],
  selectedRequest,
  onSelectRequest,
  getStatusColor,
}: BuildWorkspaceSidebarProps) {
  return (
    <>
      <div className="space-y-1 mb-4">
        <button
          onClick={() => onTabChange("overview")}
          className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-colors ${
            activeTab === "overview"
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-700 hover:bg-gray-50 border border-transparent"
          }`}
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0" />
          <div className="text-left font-medium">Overview</div>
        </button>
        <button
          onClick={() => onTabChange("my-requests")}
          className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-colors ${
            activeTab === "my-requests"
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "text-gray-700 hover:bg-gray-50 border border-transparent"
          }`}
        >
          <ClipboardList className="w-4 h-4 flex-shrink-0" />
          <div className="text-left font-medium">My Requests</div>
        </button>
      </div>

      {activeTab === "my-requests" && onSearchChange && (
        <div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 h-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={onToggleFilters}
            className="h-7 px-2 text-xs flex items-center gap-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
          {showFilters && (
            <div className="mt-2 space-y-2">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange?.(e.target.value)}
                className="w-full h-8 text-xs border border-gray-300 rounded px-2"
              >
                <option value="all">All Statuses</option>
                <option value="intake">Intake</option>
                <option value="triage">Triage</option>
                <option value="queue">Queue</option>
                <option value="in-progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="deployed">Deployed</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => onPriorityFilterChange?.(e.target.value)}
                className="w-full h-8 text-xs border border-gray-300 rounded px-2"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {activeFiltersCount > 0 && (
                <button onClick={onClearFilters} className="text-xs text-orange-600 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          )}

          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {requests.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                <Filter className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">No requests</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => onSelectRequest?.(request)}
                  className={`p-3 rounded-lg border cursor-pointer hover:border-orange-300 transition-colors ${
                    selectedRequest?.id === request.id
                      ? "bg-orange-50 border-orange-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-xs text-gray-900 truncate flex-1 mr-1">
                      {request.name}
                    </h4>
                    <span
                      className={`flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded-full ${getStatusColor?.(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">
                    {request.id} · {request.department}
                  </p>
                  <Progress value={request.progress} className="h-1" />
                  <p className="text-[10px] text-gray-500 mt-0.5">{request.progress}% complete</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface BuildWorkspaceMainProps {
  activeTab: BuildWorkspaceTab;
  requests: BuildRequest[];
  selectedRequest: BuildRequest | null;
  onSelectRequest: (request: BuildRequest) => void;
  getStatusColor: (status: BuildRequest["status"]) => string;
}

export function BuildWorkspaceMain({
  activeTab,
  requests = [],
  selectedRequest,
  onSelectRequest,
  getStatusColor,
}: BuildWorkspaceMainProps) {
  if (activeTab === "overview") {
    return (
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Solution Build Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xl font-bold text-blue-600">{requests.length}</p>
            <p className="text-xs text-blue-700">Total Requests</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xl font-bold text-green-600">
              {requests.filter((r) => r.status === "deployed").length}
            </p>
            <p className="text-xs text-green-700">Deployed</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xl font-bold text-purple-600">
              {requests.filter((r) => r.status === "in-progress").length}
            </p>
            <p className="text-xs text-purple-700">In Progress</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xl font-bold text-yellow-600">
              {requests.filter((r) => r.status === "queue").length}
            </p>
            <p className="text-xs text-yellow-700">Queued</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
